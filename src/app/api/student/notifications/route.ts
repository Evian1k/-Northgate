import { db } from "@/lib/db";
import { apiHandler, ok, unauthorized, parseBody } from "@/lib/api";
import { getCurrentStudent } from "@/lib/student-session";

export const dynamic = "force-dynamic";

export const GET = apiHandler(async (req) => {
  const student = await getCurrentStudent();
  if (!student) return unauthorized();

  const url = new URL(req.url);
  const unreadOnly = url.searchParams.get("unread") === "true";
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 100);

  const where: any = { studentId: student.id };
  if (unreadOnly) where.readAt = null;

  const notifications = await db.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return ok(notifications.map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    type: n.type,
    link: n.link,
    readAt: n.readAt?.toISOString() || null,
    createdAt: n.createdAt.toISOString(),
  })));
});

// Mark notification as read
export const PATCH = apiHandler(async (req) => {
  const student = await getCurrentStudent();
  if (!student) return unauthorized();

  const body = await parseBody(req);
  const { id, all } = body;

  if (all) {
    await db.notification.updateMany({
      where: { studentId: student.id, readAt: null },
      data: { readAt: new Date() },
    });
    return ok({ success: true, marked: "all" });
  }

  if (id) {
    await db.notification.updateMany({
      where: { id, studentId: student.id },
      data: { readAt: new Date() },
    });
    return ok({ success: true, id });
  }

  return ok({ success: false });
});
