/**
 * POST /api/auth/register
 * Public registration — defaults to STUDENT role, PENDING status until email verified.
 */
import { db } from "@/lib/db";
import { hashPassword, isPasswordStrong } from "@/lib/password";
import { setSessionCookies, getRequestIp } from "@/lib/session";
import { apiHandler, parseBody, ok, fail } from "@/lib/api";
import { registerSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { audit } from "@/lib/audit";
import { randomToken } from "@/lib/jwt";

export const POST = apiHandler(async (req, ctx) => {
  const ip = await getRequestIp(req);
  const rl = rateLimit({ key: `register:${ip || "unknown"}`, limit: 5, windowMs: 60_000 });
  if (!rl.success) return fail("Too many registrations. Try again later.", 429);

  const body = await parseBody(req);
  const data = registerSchema.parse(body);

  if (!isPasswordStrong(data.password)) {
    return fail("Password does not meet strength requirements", 422);
  }

  const existing = await db.user.findFirst({
    where: { emailNormalized: data.email, deletedAt: null },
  });
  if (existing) return fail("An account with this email already exists", 409);

  const passwordHash = await hashPassword(data.password);
  const user = await db.user.create({
    data: {
      email: data.email,
      emailNormalized: data.email,
      name: data.name,
      passwordHash,
      role: "STUDENT",
      status: "ACTIVE", // For demo; production should require email verification
      emailVerifiedAt: new Date(),
    },
  });

  // Email verification token (would be emailed in production)
  await db.emailVerification.create({
    data: {
      userId: user.id,
      token: randomToken(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  await setSessionCookies(user.id, user.email, user.role, user.name, {
    ip,
    userAgent: ctx.userAgent,
  });

  await audit({
    userId: user.id,
    action: "REGISTER",
    resource: "User",
    resourceId: user.id,
    ip,
    userAgent: ctx.userAgent,
  });

  return ok({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});
