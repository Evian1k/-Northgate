import { getCurrentUser } from "@/lib/session";
import { demoUsers, getDemoStudentDashboard } from "@/lib/demo-data";
import { StudentDashboardClient } from "./StudentDashboardClient";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return <div className="p-8 text-center text-muted-foreground">Loading…</div>;

  const isDemo = user.id.startsWith("demo-");

  if (isDemo) {
    const account = Object.keys(demoUsers).find((k) => demoUsers[k].id === user.id) || "student1";
    const data = getDemoStudentDashboard(account);
    return <StudentDashboardClient {...data} />;
  }

  // Real student — query DB with fallback
  try {
    const { db } = await import("@/lib/db");
    const { getCurrentStudent } = await import("@/lib/student-session");
    const student = await getCurrentStudent();
    if (!student) return <div className="p-8 text-center">Loading…</div>;

    // ... full DB query (same as before) — but if it fails, fall back to demo
    const now = new Date();
    const [enrollments, pendingAssessments, poeRequests, poeSubmissions, attendanceRecords, fees, examCard, activeLoans, unreadNotifs, upcomingDeadlines, releasedResults, hostelAlloc] = await Promise.all([
      db.enrollment.count({ where: { studentId: student.id, status: "ENROLLED" } }),
      db.assessment.count({ where: { unit: { enrollments: { some: { studentId: student.id } } }, dueDate: { gte: now }, submissions: { none: { studentId: student.id, status: { in: ["SUBMITTED", "GRADED"] } } } } }),
      db.assessment.count({ where: { type: "POE_REQUEST", unit: { enrollments: { some: { studentId: student.id } } }, dueDate: { gte: now } } }),
      db.submission.count({ where: { studentId: student.id, assessment: { type: "POE_SUBMISSION" } } }),
      db.attendance.findMany({ where: { studentId: student.id, date: { gte: new Date(now.getTime() - 30 * 86400000) } }, select: { status: true } }),
      db.fee.findMany({ where: { studentId: student.id }, include: { payments: true } }),
      db.examCard.findFirst({ where: { studentId: student.id }, orderBy: { createdAt: "desc" } }),
      db.bookLoan.count({ where: { studentId: student.id, status: { in: ["ACTIVE", "OVERDUE"] } } }),
      db.notification.count({ where: { studentId: student.id, readAt: null } }),
      db.assessment.findMany({ where: { unit: { enrollments: { some: { studentId: student.id } } }, dueDate: { gte: now }, submissions: { none: { studentId: student.id, status: { in: ["SUBMITTED", "GRADED"] } } } }, take: 5, orderBy: { dueDate: "asc" }, include: { unit: { select: { code: true, title: true } } } }),
      db.result.count({ where: { studentId: student.id, status: "RELEASED" } }),
      db.hostelAllocation.findFirst({ where: { studentId: student.id }, include: { hostel: true } }),
    ]);

    const results = await db.result.findMany({ where: { studentId: student.id, status: "RELEASED" }, include: { semester: true }, orderBy: { createdAt: "asc" } });
    const bySemester: Record<string, { name: string; gpa: number; count: number }> = {};
    for (const r of results) {
      const key = r.semester?.code || "current";
      if (!bySemester[key]) bySemester[key] = { name: r.semester?.name || "Current", gpa: 0, count: 0 };
      bySemester[key].gpa += r.gpa;
      bySemester[key].count++;
    }
    const gpaTrend = Object.values(bySemester).map((s) => ({ semester: s.name, gpa: Number((s.gpa / s.count).toFixed(2)) }));

    const attendanceByUnit = await db.attendance.groupBy({ by: ["unitId", "status"], where: { studentId: student.id }, _count: { status: true } });
    const unitIds = [...new Set(attendanceByUnit.map((a) => a.unitId))];
    const units = await db.unit.findMany({ where: { id: { in: unitIds } }, select: { id: true, code: true } });
    const attendanceByUnitChart = units.map((u) => {
      const recs = attendanceByUnit.filter((a) => a.unitId === u.id);
      const present = recs.filter((r) => r.status === "PRESENT" || r.status === "LATE").reduce((s, r) => s + r._count.status, 0);
      const total = recs.reduce((s, r) => s + r._count.status, 0);
      return { unit: u.code, rate: total > 0 ? Math.round((present / total) * 100) : 0 };
    });

    const totalBilled = fees.reduce((s, f) => s + f.amount, 0);
    const totalPaid = fees.reduce((s, f) => s + f.payments.reduce((ss, p) => ss + p.amount, 0), 0);
    const feeBalance = totalBilled - totalPaid;
    const present = attendanceRecords.filter((a) => a.status === "PRESENT" || a.status === "LATE").length;
    const attendanceRate = attendanceRecords.length > 0 ? Math.round((present / attendanceRecords.length) * 100) : 0;

    return (
      <StudentDashboardClient
        student={{
          name: student.user.name, admissionNo: student.admissionNo,
          programme: student.programme?.title || "—", programmeCode: student.programme?.code || "—",
          qualification: student.programme?.qualification || "—", year: student.year, semester: student.semester,
          profileImageUrl: student.profileImageUrl, currentGPA: student.currentGPA,
          attendanceRate, overallProgress: student.overallProgress, profileComplete: student.profileComplete,
        }}
        counts={{
          enrolledUnits: enrollments, pendingAssessments, poeRequests, poeSubmissions,
          feeBalance, examCardStatus: examCard?.status || "NONE", activeLoans,
          unreadNotifications: unreadNotifs, releasedResults,
          hostelStatus: hostelAlloc ? `Room ${hostelAlloc.roomNo}` : "Not allocated",
        }}
        upcomingDeadlines={upcomingDeadlines.map((a) => ({ id: a.id, title: a.title, type: a.type, dueDate: a.dueDate.toISOString(), unit: a.unit.code }))}
        gpaTrend={gpaTrend}
        attendanceByUnit={attendanceByUnitChart}
      />
    );
  } catch {
    // DB failed — use demo data as fallback
    const account = Object.keys(demoUsers).find((k) => demoUsers[k].id === user.id) || "student1";
    const data = getDemoStudentDashboard(account);
    return <StudentDashboardClient {...data} />;
  }
}
