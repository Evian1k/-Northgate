import { db } from "@/lib/db";
import { apiHandler, parseBody, ok, notFound } from "@/lib/api";

export const GET = apiHandler(async (req, { params }) => {
  const item = await db.contactMessage.findFirst({ where: { id: params!.id } });
  if (!item) return notFound();
  return ok(item);
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"] });

export const PATCH = apiHandler(async (req, { params }) => {
  const body = await parseBody(req);
  const data: any = {};
  if (body.status) data.status = body.status;
  const updated = await db.contactMessage.update({ where: { id: params!.id }, data });
  return ok(updated);
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"] });

export const DELETE = apiHandler(async (req, { params }) => {
  const existing = await db.contactMessage.findFirst({ where: { id: params!.id } });
  if (!existing) return notFound();
  await db.contactMessage.delete({ where: { id: params!.id } });
  return ok({ success: true });
}, { requireAuth: true, roles: ["ADMIN"] });
