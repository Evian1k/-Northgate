import { db } from "@/lib/db";
import { apiHandler, parseBody, ok, notFound, fail } from "@/lib/api";
import { eventSchema } from "@/lib/validators";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const GET = apiHandler(async (req, { params }) => {
  const id = params!.id;
  const item = await db.event.findFirst({ where: { id, deletedAt: null }, include: { author: true } });
  if (!item) return notFound();
  return ok(item);
});

export const PATCH = apiHandler(async (req, { params }) => {
  const id = params!.id;
  const body = await parseBody(req);
  const data = eventSchema.partial().parse(body);

  if (data.title) {
    data.slug = slugify(data.title);
    const clash = await db.event.findFirst({ where: { slug: data.slug, NOT: { id } } });
    if (clash) return fail("Slug already in use", 409);
  }

  const updateData: any = { ...data };
  if (data.startDate) updateData.startDate = new Date(data.startDate);
  if (data.endDate) updateData.endDate = new Date(data.endDate);

  const updated = await db.event.update({ where: { id }, data: updateData });
  return ok(updated);
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"], audit: { action: "UPDATE", resource: "Event" } });

export const DELETE = apiHandler(async (req, { params }) => {
  const id = params!.id;
  const existing = await db.event.findFirst({ where: { id, deletedAt: null } });
  if (!existing) return notFound();
  await db.event.update({ where: { id }, data: { deletedAt: new Date(), status: "ARCHIVED" } });
  return ok({ success: true });
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"], audit: { action: "DELETE", resource: "Event" } });
