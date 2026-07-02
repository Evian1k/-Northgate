import { db } from "@/lib/db";
import { apiHandler, parseBody, ok, notFound } from "@/lib/api";
import { partnerSchema } from "@/lib/validators";

export const GET = apiHandler(async (req, { params }) => {
  const item = await db.partner.findFirst({ where: { id: params!.id, deletedAt: null } });
  if (!item) return notFound();
  return ok(item);
});

export const PATCH = apiHandler(async (req, { params }) => {
  const body = await parseBody(req);
  const data = partnerSchema.partial().parse(body);
  const updated = await db.partner.update({ where: { id: params!.id }, data });
  return ok(updated);
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"], audit: { action: "UPDATE", resource: "Partner" } });

export const DELETE = apiHandler(async (req, { params }) => {
  const existing = await db.partner.findFirst({ where: { id: params!.id, deletedAt: null } });
  if (!existing) return notFound();
  await db.partner.update({ where: { id: params!.id }, data: { deletedAt: new Date(), status: "ARCHIVED" } });
  return ok({ success: true });
}, { requireAuth: true, roles: ["ADMIN"], audit: { action: "DELETE", resource: "Partner" } });
