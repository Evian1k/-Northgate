/**
 * Dashboard stats API
 * GET /api/stats — admin only, returns counts and metrics
 */
import { db } from "@/lib/db";
import { apiHandler, ok } from "@/lib/api";

export const GET = apiHandler(async (req) => {
  const [
    students,
    programmes,
    news,
    events,
    applications,
    pendingApplications,
    contactMessages,
    newMessages,
    subscribers,
    testimonials,
    partners,
    gallery,
    departments,
    auditLogs,
  ] = await Promise.all([
    db.user.count({ where: { role: "STUDENT", deletedAt: null } }),
    db.programme.count({ where: { deletedAt: null } }),
    db.news.count({ where: { deletedAt: null } }),
    db.event.count({ where: { deletedAt: null } }),
    db.application.count(),
    db.application.count({ where: { status: "PENDING" } }),
    db.contactMessage.count(),
    db.contactMessage.count({ where: { status: "NEW" } }),
    db.newsletterSubscriber.count({ where: { status: "ACTIVE" } }),
    db.testimonial.count({ where: { deletedAt: null } }),
    db.partner.count({ where: { deletedAt: null } }),
    db.galleryImage.count({ where: { deletedAt: null } }),
    db.department.count({ where: { deletedAt: null } }),
    db.auditLog.count(),
  ]);

  // Recent activity (last 10 audit logs)
  const recentActivity = await db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { user: { select: { name: true, email: true } } },
  });

  // Application trend (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentApplications = await db.application.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true, status: true },
  });

  const trend: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = `${d.getMonth() + 1}/${d.getDate()}`;
    trend[key] = 0;
  }
  for (const a of recentApplications) {
    const key = `${a.createdAt.getMonth() + 1}/${a.createdAt.getDate()}`;
    if (key in trend) trend[key]++;
  }

  return ok({
    counts: {
      students,
      programmes,
      news,
      events,
      applications,
      pendingApplications,
      contactMessages,
      newMessages,
      subscribers,
      testimonials,
      partners,
      gallery,
      departments,
      auditLogs,
    },
    recentActivity,
    applicationTrend: Object.entries(trend).map(([date, count]) => ({ date, count })),
  });
}, { requireAuth: true, roles: ["ADMIN", "EDITOR"] });
