/**
 * POST /api/auth/login
 */
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { setSessionCookies, getRequestIp } from "@/lib/session";
import { apiHandler, parseBody, ok, fail } from "@/lib/api";
import { loginSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { audit } from "@/lib/audit";

export const POST = apiHandler(async (req, ctx) => {
  const ip = await getRequestIp(req);
  const rateKey = `login:${ip || "unknown"}`;
  const rl = rateLimit({ key: rateKey, limit: 10, windowMs: 60_000 });
  if (!rl.success) {
    return fail("Too many login attempts. Please try again later.", 429);
  }

  const body = await parseBody(req);
  const data = loginSchema.parse(body);

  const user = await db.user.findFirst({
    where: { emailNormalized: data.email, deletedAt: null },
  });

  if (!user || !user.passwordHash) {
    return fail("Invalid email or password", 401);
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return fail("Account temporarily locked. Try again later.", 423);
  }

  const valid = await verifyPassword(data.password, user.passwordHash);
  if (!valid) {
    await db.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: { increment: 1 },
        lockedUntil:
          user.failedLoginAttempts + 1 >= 5
            ? new Date(Date.now() + 15 * 60 * 1000)
            : null,
      },
    });
    await audit({
      userId: user.id,
      action: "LOGIN_FAILED",
      resource: "User",
      resourceId: user.id,
      ip,
      userAgent: ctx.userAgent,
    });
    return fail("Invalid email or password", 401);
  }

  if (user.status !== "ACTIVE") {
    return fail(`Account is ${user.status.toLowerCase()}. Contact administrator.`, 403);
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
      lastLoginIp: ip,
    },
  });

  await setSessionCookies(user.id, user.email, user.role, user.name, {
    ip,
    userAgent: ctx.userAgent,
  });

  await audit({
    userId: user.id,
    action: "LOGIN",
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
