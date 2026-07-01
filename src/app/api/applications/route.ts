/**
 * Applications API (admissions)
 * GET  /api/applications — admin only
 * POST /api/applications — public submission
 */
import { db } from "@/lib/db";
import { apiHandler, parseBody, ok, created, fail } from "@/lib/api";
import { applicationSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { audit } from "@/lib/audit";

export const GET = apiHandler(async (req) => {
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const where: any = {};
  if (status) where.status = status;

  const items = await db.application.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { programme: { select: { id: true, title: true, code: true } } },
    take: 200,
  });
  return ok(items);
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"] });

export const POST = apiHandler(async (req, ctx) => {
  const rl = rateLimit({ key: `apply:${ctx.ip || "unknown"}`, limit: 5, windowMs: 60_000 });
  if (!rl.success) return fail("Too many submissions. Try again later.", 429);

  const body = await parseBody(req);
  const data = applicationSchema.parse(body);

  // Verify programme exists
  const programme = await db.programme.findFirst({
    where: { id: data.programmeId, deletedAt: null, status: "PUBLISHED" },
  });
  if (!programme) return fail("Selected programme is not available", 400);

  const reference = `NG-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const item = await db.application.create({
    data: {
      ...data,
      reference,
    },
  });

  await audit({
    action: "APPLICATION_SUBMITTED",
    resource: "Application",
    resourceId: item.id,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
    metadata: { reference, email: data.email },
  });

  return created({ ...item, reference });
});
