/**
 * POST /api/auth/forgot-password
 * Generates a reset token and (in production) emails it.
 */
import { db } from "@/lib/db";
import { apiHandler, parseBody, ok, fail } from "@/lib/api";
import { forgotPasswordSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { randomToken } from "@/lib/jwt";

export const POST = apiHandler(async (req) => {
  const rl = rateLimit({ key: `forgot:${req.headers.get("x-forwarded-for") || "unknown"}`, limit: 5, windowMs: 60_000 });
  if (!rl.success) return fail("Too many requests. Try again later.", 429);

  const body = await parseBody(req);
  const data = forgotPasswordSchema.parse(body);

  // Always return ok to prevent email enumeration
  const user = await db.user.findFirst({
    where: { emailNormalized: data.email, deletedAt: null },
  });

  if (user) {
    await db.passwordReset.create({
      data: {
        email: user.email,
        token: randomToken(),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });
    // TODO(hooks): integrate email provider here. Token URL: /admin/reset-password?token=...
  }

  return ok({ success: true });
});
