import { db } from "@/lib/db";
import { apiHandler, ok, unauthorized } from "@/lib/api";
import { getCurrentStudent } from "@/lib/student-session";

export const dynamic = "force-dynamic";

export const GET = apiHandler(async (req) => {
  const student = await getCurrentStudent();
  if (!student) return unauthorized();

  const announcements = await db.announcement.findMany({
    where: {
      OR: [{ audience: "ALL" }, { audience: "STUDENTS" }],
    },
    orderBy: { publishedAt: "desc" },
    take: 20,
    include: { author: { select: { name: true } } },
  });

  return ok(announcements.map((a) => ({
    id: a.id,
    title: a.title,
    content: a.content,
    category: a.category,
    audience: a.audience,
    author: a.author?.name || "Administration",
    publishedAt: a.publishedAt.toISOString(),
  })));
});
