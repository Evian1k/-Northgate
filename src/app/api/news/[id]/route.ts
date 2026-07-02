import { db } from "@/lib/db";
import { apiHandler, parseBody, ok, notFound, fail } from "@/lib/api";
import { newsSchema } from "@/lib/validators";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const GET = apiHandler(async (req, { params }) => {
  const id = params!.id;
  const item = await db.news.findFirst({ where: { id, deletedAt: null }, include: { author: true } });
  if (!item) return notFound();
  // Increment views
  await db.news.update({ where: { id }, data: { views: { increment: 1 } } });
  return ok({ ...item, views: item.views + 1 });
});

export const PATCH = apiHandler(async (req, { params }) => {
  const id = params!.id;
  const body = await parseBody(req);
  const data = newsSchema.partial().parse(body);

  if (data.title) {
    data.slug = slugify(data.title);
    const clash = await db.news.findFirst({ where: { slug: data.slug, NOT: { id } } });
    if (clash) return fail("Slug already in use", 409);
  }

  const updateData: any = { ...data };
  if (data.tags) updateData.tags = JSON.stringify(data.tags);
  if (data.status === "PUBLISHED" && !data.publishedAt) updateData.publishedAt = new Date();
  if (data.publishedAt) updateData.publishedAt = new Date(data.publishedAt);
  if (data.scheduledAt) updateData.scheduledAt = new Date(data.scheduledAt);

  const updated = await db.news.update({ where: { id }, data: updateData });
  return ok(updated);
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"], audit: { action: "UPDATE", resource: "News" } });

export const DELETE = apiHandler(async (req, { params }) => {
  const id = params!.id;
  const existing = await db.news.findFirst({ where: { id, deletedAt: null } });
  if (!existing) return notFound();
  await db.news.update({ where: { id }, data: { deletedAt: new Date(), status: "ARCHIVED" } });
  return ok({ success: true });
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"], audit: { action: "DELETE", resource: "News" } });
