/**
 * POST /api/auth/reset-password
 */
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { revokeAllUserSessions } from "@/lib/session";
import { apiHandler, parseBody, ok, fail } from "@/lib/api";
import { resetPasswordSchema } from "@/lib/validators";
import { audit } from "@/lib/audit";

export const POST = apiHandler(async (req, ctx) => {
  const body = await parseBody(req);
  const data = resetPasswordSchema.parse(body);

  const reset = await db.passwordReset.findFirst({
    where: { token: data.token, usedAt: null, expiresAt: { gt: new Date() } },
  });
  if (!reset) return fail("Invalid or expired reset token", 400);

  const user = await db.user.findFirst({
    where: { emailNormalized: reset.email, deletedAt: null },
  });
  if (!user) return fail("User not found", 404);

  const passwordHash = await hashPassword(data.password);
  await db.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });
  await db.passwordReset.update({
    where: { id: reset.id },
    data: { usedAt: new Date() },
  });

  // Invalidate all existing sessions
  await revokeAllUserSessions(user.id);

  await audit({
    userId: user.id,
    action: "PASSWORD_RESET",
    resource: "User",
    resourceId: user.id,
    ip: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return ok({ success: true });
});
