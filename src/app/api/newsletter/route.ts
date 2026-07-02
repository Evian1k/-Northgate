/**
 * Newsletter subscription API
 * POST /api/newsletter — public subscribe
 */
import { db } from "@/lib/db";
import { apiHandler, parseBody, ok, fail } from "@/lib/api";
import { newsletterSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { randomToken } from "@/lib/jwt";

export const POST = apiHandler(async (req, ctx) => {
  const rl = rateLimit({ key: `newsletter:${ctx.ip || "unknown"}`, limit: 5, windowMs: 60_000 });
  if (!rl.success) return fail("Too many requests. Try again later.", 429);

  const body = await parseBody(req);
  const data = newsletterSchema.parse(body);

  const existing = await db.newsletterSubscriber.findFirst({ where: { email: data.email } });
  if (existing) {
    if (existing.status === "ACTIVE") return fail("You are already subscribed", 409);
    await db.newsletterSubscriber.update({
      where: { id: existing.id },
      data: { status: "ACTIVE" },
    });
    return ok({ success: true });
  }

  await db.newsletterSubscriber.create({
    data: {
      email: data.email,
      token: randomToken(),
    },
  });
  return ok({ success: true });
});

export const GET = apiHandler(async (req) => {
  const items = await db.newsletterSubscriber.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return ok(items);
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"] });
