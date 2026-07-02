/**
 * Departments API
 * GET  /api/departments           — list (public; published only by default)
 * POST /api/departments           — create (admin/editor)
 */
import { db } from "@/lib/db";
import { apiHandler, parseBody, ok, created, fail } from "@/lib/api";
import { departmentSchema } from "@/lib/validators";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const GET = apiHandler(async (req) => {
  const url = new URL(req.url);
  const includeDrafts = url.searchParams.get("includeDrafts") === "true";
  const where: any = { deletedAt: null };
  if (!includeDrafts) where.status = "PUBLISHED";

  const departments = await db.department.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { programmes: { where: { deletedAt: null } } } } },
  });
  return ok(departments);
});

export const POST = apiHandler(async (req) => {
  const body = await parseBody(req);
  const data = departmentSchema.parse(body);
  const slug = slugify(data.name);

  const existing = await db.department.findFirst({ where: { OR: [{ name: data.name }, { slug }] } });
  if (existing) return fail("Department with this name already exists", 409);

  const dept = await db.department.create({
    data: { ...data, slug },
  });
  return created(dept);
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"], audit: { action: "CREATE", resource: "Department" } });
