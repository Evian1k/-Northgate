/**
 * Gallery API
 */
import { db } from "@/lib/db";
import { apiHandler, parseBody, ok, created } from "@/lib/api";
import { galleryImageSchema } from "@/lib/validators";

export const GET = apiHandler(async (req) => {
  const url = new URL(req.url);
  const includeDrafts = url.searchParams.get("includeDrafts") === "true";
  const category = url.searchParams.get("category");
  const where: any = { deletedAt: null };
  if (!includeDrafts) where.status = "PUBLISHED";
  if (category) where.category = category;

  const items = await db.galleryImage.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return ok(items);
});

export const POST = apiHandler(async (req) => {
  const body = await parseBody(req);
  const data = galleryImageSchema.parse(body);
  const item = await db.galleryImage.create({ data });
  return created(item);
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"], audit: { action: "CREATE", resource: "GalleryImage" } });
