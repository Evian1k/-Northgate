/**
 * News API
 */
import { db } from "@/lib/db";
import { apiHandler, parseBody, ok, created, fail } from "@/lib/api";
import { newsSchema } from "@/lib/validators";
import { getCurrentUser } from "@/lib/session";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const GET = apiHandler(async (req) => {
  const url = new URL(req.url);
  const includeDrafts = url.searchParams.get("includeDrafts") === "true";
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("q");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);

  const where: any = { deletedAt: null };
  if (!includeDrafts) {
    where.status = "PUBLISHED";
    where.publishedAt = { lte: new Date() };
  }
  if (category) where.category = category;
  if (search) where.OR = [{ title: { contains: search } }, { excerpt: { contains: search } }, { content: { contains: search } }];

  const items = await db.news.findMany({
    where,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: { author: { select: { id: true, name: true } } },
    take: limit,
  });
  return ok(items);
});

export const POST = apiHandler(async (req) => {
  const user = await getCurrentUser();
  const body = await parseBody(req);
  const data = newsSchema.parse(body);
  const slug = slugify(data.title);

  const dup = await db.news.findFirst({ where: { slug } });
  if (dup) return fail("Article with this title already exists", 409);

  const publishedAt = data.status === "PUBLISHED" ? (data.publishedAt ? new Date(data.publishedAt) : new Date()) : null;
  const scheduledAt = data.status === "SCHEDULED" && data.scheduledAt ? new Date(data.scheduledAt) : null;

  const item = await db.news.create({
    data: {
      ...data,
      slug,
      authorId: user!.id,
      publishedAt,
      scheduledAt,
      tags: JSON.stringify(data.tags || []),
    },
  });
  return created(item);
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"], audit: { action: "CREATE", resource: "News" } });
