/**
 * Partners API
 */
import { db } from "@/lib/db";
import { apiHandler, parseBody, ok, created } from "@/lib/api";
import { partnerSchema } from "@/lib/validators";

export const GET = apiHandler(async (req) => {
  const url = new URL(req.url);
  const includeDrafts = url.searchParams.get("includeDrafts") === "true";
  const where: any = { deletedAt: null };
  if (!includeDrafts) where.status = "PUBLISHED";

  const items = await db.partner.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return ok(items);
});

export const POST = apiHandler(async (req) => {
  const body = await parseBody(req);
  const data = partnerSchema.parse(body);
  const item = await db.partner.create({ data });
  return created(item);
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"], audit: { action: "CREATE", resource: "Partner" } });
