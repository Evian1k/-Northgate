/**
 * Department by ID
 */
import { db } from "@/lib/db";
import { apiHandler, parseBody, ok, notFound, fail } from "@/lib/api";
import { departmentSchema } from "@/lib/validators";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const GET = apiHandler(async (req, { params }) => {
  const id = params!.id;
  const dept = await db.department.findFirst({
    where: { id, deletedAt: null },
    include: { programmes: { where: { deletedAt: null } } },
  });
  if (!dept) return notFound();
  return ok(dept);
});

export const PATCH = apiHandler(async (req, { params }) => {
  const id = params!.id;
  const body = await parseBody(req);
  const data = departmentSchema.partial().parse(body);

  if (data.name) {
    data.slug = slugify(data.name);
    const clash = await db.department.findFirst({ where: { slug: data.slug, NOT: { id } } });
    if (clash) return fail("Slug already in use", 409);
  }

  const updated = await db.department.update({ where: { id }, data });
  return ok(updated);
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"], audit: { action: "UPDATE", resource: "Department" } });

export const DELETE = apiHandler(async (req, { params }) => {
  const id = params!.id;
  const existing = await db.department.findFirst({ where: { id, deletedAt: null } });
  if (!existing) return notFound();
  await db.department.update({ where: { id }, data: { deletedAt: new Date(), status: "ARCHIVED" } });
  return ok({ success: true });
}, { requireAuth: true, roles: ["ADMIN"], audit: { action: "DELETE", resource: "Department" } });
