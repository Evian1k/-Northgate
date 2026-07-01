import { db } from "@/lib/db";
import { apiHandler, parseBody, ok, notFound, fail } from "@/lib/api";
import { audit } from "@/lib/audit";
import { getCurrentUser } from "@/lib/session";

const VALID_STATUSES = ["PENDING", "REVIEWING", "ACCEPTED", "REJECTED", "ENROLLED"];

export const GET = apiHandler(async (req, { params }) => {
  const item = await db.application.findFirst({
    where: { id: params!.id },
    include: { programme: true, user: { select: { id: true, name: true, email: true } } },
  });
  if (!item) return notFound();
  return ok(item);
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"] });

export const PATCH = apiHandler(async (req, { params }) => {
  const id = params!.id;
  const body = await parseBody(req);
  const updateData: any = {};

  if (body.status) {
    if (!VALID_STATUSES.includes(body.status)) return fail("Invalid status", 400);
    updateData.status = body.status;
  }
  if (typeof body.notes === "string") updateData.notes = body.notes;

  const updated = await db.application.update({ where: { id }, data: updateData });

  const user = await getCurrentUser();
  await audit({
    userId: user?.id,
    action: "APPLICATION_UPDATED",
    resource: "Application",
    resourceId: id,
    metadata: updateData,
  });

  return ok(updated);
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"], audit: { action: "UPDATE", resource: "Application" } });

export const DELETE = apiHandler(async (req, { params }) => {
  const existing = await db.application.findFirst({ where: { id: params!.id } });
  if (!existing) return notFound();
  await db.application.delete({ where: { id: params!.id } });
  return ok({ success: true });
}, { requireAuth: true, roles: ["ADMIN"], audit: { action: "DELETE", resource: "Application" } });
