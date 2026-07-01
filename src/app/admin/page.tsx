import { db } from "@/lib/db";
import { DashboardClient } from "@/components/admin/DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    counts, recentActivity, recentApplications, recentMessages,
  ] = await Promise.all([
    {
      students: await db.user.count({ where: { role: "STUDENT", deletedAt: null } }),
      programmes: await db.programme.count({ where: { deletedAt: null } }),
      news: await db.news.count({ where: { deletedAt: null } }),
      events: await db.event.count({ where: { deletedAt: null } }),
      applications: await db.application.count(),
      pendingApplications: await db.application.count({ where: { status: "PENDING" } }),
      contactMessages: await db.contactMessage.count(),
      newMessages: await db.contactMessage.count({ where: { status: "NEW" } }),
      subscribers: await db.newsletterSubscriber.count({ where: { status: "ACTIVE" } }),
      departments: await db.department.count({ where: { deletedAt: null } }),
      testimonials: await db.testimonial.count({ where: { deletedAt: null } }),
      partners: await db.partner.count({ where: { deletedAt: null } }),
      gallery: await db.galleryImage.count({ where: { deletedAt: null } }),
    },
    db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { name: true, email: true } } },
    }),
    db.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { programme: { select: { title: true, code: true } } },
    }),
    db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  // Application trend (last 14 days)
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const recentApps = await db.application.findMany({
    where: { createdAt: { gte: fourteenDaysAgo } },
    select: { createdAt: true },
  });
  const trend: { date: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(5, 10); // MM-DD
    trend.push({ date: key, count: 0 });
  }
  for (const a of recentApps) {
    const key = a.createdAt.toISOString().slice(5, 10);
    const entry = trend.find((t) => t.date === key);
    if (entry) entry.count++;
  }

  return (
    <DashboardClient
      counts={counts}
      recentActivity={recentActivity.map((a) => ({
        id: a.id,
        action: a.action,
        resource: a.resource,
        createdAt: a.createdAt.toISOString(),
        user: a.user?.name || "System",
      }))}
      recentApplications={recentApplications.map((a) => ({
        id: a.id,
        reference: a.reference,
        firstName: a.firstName,
        lastName: a.lastName,
        email: a.email,
        status: a.status,
        createdAt: a.createdAt.toISOString(),
        programme: a.programme?.title || "—",
      }))}
      recentMessages={recentMessages.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        subject: m.subject,
        status: m.status,
        createdAt: m.createdAt.toISOString(),
      }))}
      trend={trend}
    />
  );
}
