import { db } from "@/lib/db";
import { apiHandler, parseBody, ok, notFound } from "@/lib/api";
import { testimonialSchema } from "@/lib/validators";

export const GET = apiHandler(async (req, { params }) => {
  const item = await db.testimonial.findFirst({ where: { id: params!.id, deletedAt: null } });
  if (!item) return notFound();
  return ok(item);
});

export const PATCH = apiHandler(async (req, { params }) => {
  const body = await parseBody(req);
  const data = testimonialSchema.partial().parse(body);
  const updated = await db.testimonial.update({ where: { id: params!.id }, data });
  return ok(updated);
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"], audit: { action: "UPDATE", resource: "Testimonial" } });

export const DELETE = apiHandler(async (req, { params }) => {
  const existing = await db.testimonial.findFirst({ where: { id: params!.id, deletedAt: null } });
  if (!existing) return notFound();
  await db.testimonial.update({ where: { id: params!.id }, data: { deletedAt: new Date(), status: "ARCHIVED" } });
  return ok({ success: true });
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"], audit: { action: "DELETE", resource: "Testimonial" } });
