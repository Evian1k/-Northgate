/**
 * Reusable API helpers: standard responses, error handling, request parsing,
 * validation, permission gating, audit logging wrapper.
 */
import { NextResponse } from "next/server";
import { ZodSchema, ZodError } from "zod";
import { getCurrentUser, getRequestIp } from "@/lib/session";
import { audit } from "@/lib/audit";

export interface ApiContext {
  user: Awaited<ReturnType<typeof getCurrentUser>>;
  ip?: string;
  userAgent?: string;
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function created<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { success: false, error: message, details },
    { status }
  );
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ success: false, error: message }, { status: 403 });
}

export function notFound(message = "Resource not found") {
  return NextResponse.json({ success: false, error: message }, { status: 404 });
}

export function serverError(message = "Internal server error") {
  return NextResponse.json({ success: false, error: message }, { status: 500 });
}

export function validate<T>(schema: ZodSchema<T>, input: unknown): T {
  return schema.parse(input);
}

export function formatZodError(e: ZodError) {
  return e.errors.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));
}

type Handler<T = unknown> = (
  req: Request,
  ctx: ApiContext & { params?: Record<string, string> }
) => Promise<NextResponse> | NextResponse;

/**
 * Wrap an API handler with: error catching, auth, audit logging, JSON parsing.
 */
export function apiHandler(
  handler: Handler,
  opts?: {
    requireAuth?: boolean;
    roles?: string[];
    audit?: { action: string; resource: string };
    rateLimit?: { key: string; limit: number; windowMs: number };
  }
) {
  return async (req: Request, routeCtx?: { params?: Record<string, string> }) => {
    try {
      let user = await getCurrentUser();
      const ip = await getRequestIp(req);
      const userAgent = req.headers.get("user-agent") || undefined;

      if (opts?.requireAuth && !user) {
        return unauthorized();
      }
      if (opts?.roles && user && !opts.roles.includes(user.role)) {
        return forbidden();
      }

      const result = await handler(req, {
        user,
        ip,
        userAgent,
        params: routeCtx?.params,
      });

      // Async audit log after success
      if (opts?.audit && user) {
        audit({
          userId: user.id,
          action: opts.audit.action,
          resource: opts.audit.resource,
          ip,
          userAgent,
        }).catch(() => {});
      }

      return result;
    } catch (e: any) {
      console.error("API error:", e);
      if (e.status === 401) return unauthorized();
      if (e.status === 403) return forbidden();
      if (e.name === "ZodError") {
        return fail("Validation failed", 422, formatZodError(e));
      }
      if (e.code === "P2002") {
        return fail("A record with this value already exists", 409);
      }
      if (e.code === "P2025") {
        return notFound();
      }
      return serverError(e?.message || "Unknown error");
    }
  };
}

export async function parseBody<T>(req: Request): Promise<T> {
  return (await req.json()) as T;
}
