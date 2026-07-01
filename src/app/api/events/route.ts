/**
 * Events API
 */
import { db } from "@/lib/db";
import { apiHandler, parseBody, ok, created, fail } from "@/lib/api";
import { eventSchema } from "@/lib/validators";
import { getCurrentUser } from "@/lib/session";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const GET = apiHandler(async (req) => {
  const url = new URL(req.url);
  const includeDrafts = url.searchParams.get("includeDrafts") === "true";
  const upcoming = url.searchParams.get("upcoming") === "true";

  const where: any = { deletedAt: null };
  if (!includeDrafts) where.status = "PUBLISHED";
  if (upcoming) where.startDate = { gte: new Date() };

  const items = await db.event.findMany({
    where,
    orderBy: { startDate: "asc" },
    include: { author: { select: { id: true, name: true } } },
    take: 100,
  });
  return ok(items);
});

export const POST = apiHandler(async (req) => {
  const user = await getCurrentUser();
  const body = await parseBody(req);
  const data = eventSchema.parse(body);
  const slug = slugify(data.title);

  const dup = await db.event.findFirst({ where: { slug } });
  if (dup) return fail("Event with this title already exists", 409);

  const item = await db.event.create({
    data: {
      ...data,
      slug,
      authorId: user!.id,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
    },
  });
  return created(item);
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"], audit: { action: "CREATE", resource: "Event" } });
