import { db } from "@/lib/db";
import { apiHandler, parseBody, ok, notFound, fail } from "@/lib/api";
import { programmeSchema } from "@/lib/validators";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const GET = apiHandler(async (req, { params }) => {
  const id = params!.id;
  const programme = await db.programme.findFirst({
    where: { id, deletedAt: null },
    include: { department: true },
  });
  if (!programme) return notFound();
  return ok(programme);
});

export const PATCH = apiHandler(async (req, { params }) => {
  const id = params!.id;
  const body = await parseBody(req);
  const data = programmeSchema.partial().parse(body);

  if (data.title) {
    data.slug = slugify(data.title);
    const clash = await db.programme.findFirst({ where: { slug: data.slug, NOT: { id } } });
    if (clash) return fail("Slug already in use", 409);
  }

  const updateData: any = { ...data };
  if (data.requirements) updateData.requirements = JSON.stringify(data.requirements);
  if (data.careerPaths) updateData.careerPaths = JSON.stringify(data.careerPaths);

  const updated = await db.programme.update({ where: { id }, data: updateData });
  return ok(updated);
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"], audit: { action: "UPDATE", resource: "Programme" } });

export const DELETE = apiHandler(async (req, { params }) => {
  const id = params!.id;
  const existing = await db.programme.findFirst({ where: { id, deletedAt: null } });
  if (!existing) return notFound();
  await db.programme.update({ where: { id }, data: { deletedAt: new Date(), status: "ARCHIVED" } });
  return ok({ success: true });
}, { requireAuth: true, roles: ["ADMIN"], audit: { action: "DELETE", resource: "Programme" } });
