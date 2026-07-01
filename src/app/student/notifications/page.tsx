import { db } from "@/lib/db";
import { getCurrentStudent } from "@/lib/student-session";
import { NotificationsClient } from "./NotificationsClient";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const student = await getCurrentStudent();
  if (!student) return <div>Unauthorized</div>;

  const [notifications, announcements] = await Promise.all([
    db.notification.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    db.announcement.findMany({
      where: { OR: [{ audience: "ALL" }, { audience: "STUDENTS" }] },
      orderBy: { publishedAt: "desc" },
      take: 10,
      include: { author: { select: { name: true } } },
    }),
  ]);

  return (
    <NotificationsClient
      notifications={notifications.map((n) => ({
        id: n.id, title: n.title, message: n.message, type: n.type,
        link: n.link, readAt: n.readAt?.toISOString() || null,
        createdAt: n.createdAt.toISOString(),
      }))}
      announcements={announcements.map((a) => ({
        id: a.id, title: a.title, content: a.content, category: a.category,
        author: a.author?.name || "Administration",
        publishedAt: a.publishedAt.toISOString(),
      }))}
    />
  );
}
