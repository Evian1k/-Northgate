/**
 * POST /api/auth/verify-email
 */
import { db } from "@/lib/db";
import { apiHandler, parseBody, ok, fail } from "@/lib/api";
import { verifyEmailSchema } from "@/lib/validators";

export const POST = apiHandler(async (req) => {
  const body = await parseBody(req);
  const data = verifyEmailSchema.parse(body);

  const verification = await db.emailVerification.findFirst({
    where: { token: data.token, usedAt: null, expiresAt: { gt: new Date() } },
  });
  if (!verification) return fail("Invalid or expired verification token", 400);

  await db.user.update({
    where: { id: verification.userId },
    data: { emailVerifiedAt: new Date() },
  });
  await db.emailVerification.update({
    where: { id: verification.id },
    data: { usedAt: new Date() },
  });

  return ok({ success: true });
});
