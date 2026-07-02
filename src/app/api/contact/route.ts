/**
 * Contact messages API
 * GET  /api/contact — admin only
 * POST /api/contact — public submission
 */
import { db } from "@/lib/db";
import { apiHandler, parseBody, ok, created, fail } from "@/lib/api";
import { contactMessageSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";

export const GET = apiHandler(async (req) => {
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const where: any = {};
  if (status) where.status = status;
  const items = await db.contactMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return ok(items);
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"] });

export const POST = apiHandler(async (req, ctx) => {
  const rl = rateLimit({ key: `contact:${ctx.ip || "unknown"}`, limit: 5, windowMs: 60_000 });
  if (!rl.success) return fail("Too many messages. Try again later.", 429);

  const body = await parseBody(req);
  const data = contactMessageSchema.parse(body);
  const item = await db.contactMessage.create({ data });
  return created(item);
});
