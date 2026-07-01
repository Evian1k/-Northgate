/**
 * Server-side session management.
 * Uses httpOnly cookies for both access & refresh tokens.
 */
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  randomToken,
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  type AccessTokenPayload,
} from "@/lib/jwt";

export const ACCESS_COOKIE = "ng_access";
export const REFRESH_COOKIE = "ng_refresh";

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function setSessionCookies(userId: string, email: string, role: string, name: string, opts?: { ip?: string; userAgent?: string }) {
  const access = await signAccessToken({ sub: userId, email, role, name });
  const refreshJti = randomToken();
  const refresh = await signRefreshToken({ sub: userId, jti: refreshJti });

  // Persist refresh token in DB for revocation tracking
  await db.refreshToken.create({
    data: {
      userId,
      token: refreshJti,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL * 1000),
      ip: opts?.ip,
      userAgent: opts?.userAgent,
    },
  });

  const jar = await cookies();
  jar.set(ACCESS_COOKIE, access, cookieOptions(ACCESS_TOKEN_TTL));
  jar.set(REFRESH_COOKIE, refresh, cookieOptions(REFRESH_TOKEN_TTL));

  return { access, refresh };
}

export async function clearSessionCookies() {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
}

export async function getAccessToken(): Promise<AccessTokenPayload | null> {
  const jar = await cookies();
  const token = jar.get(ACCESS_COOKIE)?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}

export async function getCurrentUser() {
  const payload = await getAccessToken();
  if (!payload) return null;
  const user = await db.user.findFirst({
    where: { id: payload.sub, deletedAt: null, status: "ACTIVE" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      image: true,
      emailVerifiedAt: true,
      twoFactorEnabled: true,
    },
  });
  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    const err = new Error("Unauthorized");
    (err as any).status = 401;
    throw err;
  }
  return user;
}

export async function requireRole(roles: string[]) {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    const err = new Error("Forbidden");
    (err as any).status = 403;
    throw err;
  }
  return user;
}

/**
 * Refresh the access token if it has expired but refresh token is still valid.
 * Called from middleware / API.
 */
export async function refreshSession(): Promise<boolean> {
  const jar = await cookies();
  const refreshToken = jar.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return false;

  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) return false;

  // Check if refresh token is still valid in DB
  const stored = await db.refreshToken.findFirst({
    where: {
      token: payload.jti,
      userId: payload.sub,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
  });
  if (!stored) return false;

  const user = await db.user.findFirst({
    where: { id: payload.sub, deletedAt: null, status: "ACTIVE" },
  });
  if (!user) return false;

  // Issue new access token
  const access = await signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });
  jar.set(ACCESS_COOKIE, access, cookieOptions(ACCESS_TOKEN_TTL));
  return true;
}

export async function revokeAllUserSessions(userId: string) {
  await db.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function getRequestIp(req: Request): Promise<string | undefined> {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return undefined;
}
