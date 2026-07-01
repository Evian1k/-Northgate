/**
 * Programmes API
 * GET  /api/programmes
 * POST /api/programmes
 */
import { db } from "@/lib/db";
import { apiHandler, parseBody, ok, created, fail } from "@/lib/api";
import { programmeSchema } from "@/lib/validators";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const GET = apiHandler(async (req) => {
  const url = new URL(req.url);
  const includeDrafts = url.searchParams.get("includeDrafts") === "true";
  const departmentId = url.searchParams.get("departmentId");
  const qualification = url.searchParams.get("qualification");
  const search = url.searchParams.get("q");
  const featured = url.searchParams.get("featured");

  const where: any = { deletedAt: null };
  if (!includeDrafts) where.status = "PUBLISHED";
  if (departmentId) where.departmentId = departmentId;
  if (qualification) where.qualification = qualification;
  if (featured === "true") where.featured = true;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { code: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const programmes = await db.programme.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { department: { select: { id: true, name: true, slug: true } } },
    take: 200,
  });
  return ok(programmes);
});

export const POST = apiHandler(async (req) => {
  const body = await parseBody(req);
  const data = programmeSchema.parse(body);
  const slug = slugify(data.title);

  const dup = await db.programme.findFirst({ where: { OR: [{ code: data.code }, { slug }] } });
  if (dup) return fail("Programme with this code or title already exists", 409);

  const programme = await db.programme.create({
    data: {
      ...data,
      slug,
      requirements: JSON.stringify(data.requirements || []),
      careerPaths: JSON.stringify(data.careerPaths || []),
    },
  });
  return created(programme);
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"], audit: { action: "CREATE", resource: "Programme" } });
