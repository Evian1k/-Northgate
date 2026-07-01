/**
 * GET /api/student/stats
 * Returns aggregate dashboard stats for the current student.
 */
import { db } from "@/lib/db";
import { apiHandler, ok, unauthorized } from "@/lib/api";
import { getCurrentStudent } from "@/lib/student-session";

export const dynamic = "force-dynamic";

export const GET = apiHandler(async (req) => {
  const student = await getCurrentStudent();
  if (!student) return unauthorized();

  const now = new Date();

  const [
    enrollments,
    pendingAssessments,
    poeRequests,
    poeSubmissions,
    attendanceRecords,
    fees,
    payments,
    examCard,
    activeLoans,
    unreadNotifs,
    upcomingDeadlines,
    releasedResults,
    hostelAlloc,
  ] = await Promise.all([
    db.enrollment.count({ where: { studentId: student.id, status: "ENROLLED" } }),
    db.assessment.count({
      where: {
        unit: { enrollments: { some: { studentId: student.id } } },
        dueDate: { gte: now },
        submissions: { none: { studentId: student.id, status: { in: ["SUBMITTED", "GRADED"] } } },
      },
    }),
    db.assessment.count({
      where: {
        type: "POE_REQUEST",
        unit: { enrollments: { some: { studentId: student.id } } },
        dueDate: { gte: now },
      },
    }),
    db.submission.count({
      where: { studentId: student.id, assessment: { type: "POE_SUBMISSION" } },
    }),
    db.attendance.findMany({
      where: { studentId: student.id, date: { gte: new Date(now.getTime() - 30 * 86400000) } },
      select: { status: true },
    }),
    db.fee.findMany({ where: { studentId: student.id }, include: { payments: true } }),
    db.payment.count({ where: { studentId: student.id } }),
    db.examCard.findFirst({ where: { studentId: student.id }, orderBy: { createdAt: "desc" } }),
    db.bookLoan.count({ where: { studentId: student.id, status: { in: ["ACTIVE", "OVERDUE"] } } }),
    db.notification.count({ where: { studentId: student.id, readAt: null } }),
    db.assessment.findMany({
      where: {
        unit: { enrollments: { some: { studentId: student.id } } },
        dueDate: { gte: now },
        submissions: { none: { studentId: student.id, status: { in: ["SUBMITTED", "GRADED"] } } },
      },
      take: 5,
      orderBy: { dueDate: "asc" },
      include: { unit: { select: { code: true, title: true } } },
    }),
    db.result.count({ where: { studentId: student.id, status: "RELEASED" } }),
    db.hostelAllocation.findFirst({ where: { studentId: student.id }, include: { hostel: true } }),
  ]);

  // Calculate fee balance
  const totalFees = fees.reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = fees.reduce((sum, f) => sum + f.payments.reduce((s, p) => s + p.amount, 0), 0);
  const feeBalance = totalFees - totalPaid;

  // Attendance rate
  const present = attendanceRecords.filter((a) => a.status === "PRESENT" || a.status === "LATE").length;
  const attendanceRate = attendanceRecords.length > 0 ? Math.round((present / attendanceRecords.length) * 100) : 0;

  // GPA trend (last 4 semesters)
  const results = await db.result.findMany({
    where: { studentId: student.id, status: "RELEASED" },
    include: { semester: true },
    orderBy: { createdAt: "asc" },
  });
  const bySemester: Record<string, { name: string; gpa: number; count: number }> = {};
  for (const r of results) {
    const key = r.semester?.code || "current";
    if (!bySemester[key]) bySemester[key] = { name: r.semester?.name || "Current", gpa: 0, count: 0 };
    bySemester[key].gpa += r.gpa;
    bySemester[key].count++;
  }
  const gpaTrend = Object.values(bySemester).map((s) => ({
    semester: s.name,
    gpa: Number((s.gpa / s.count).toFixed(2)),
  }));

  // Attendance by unit (for chart)
  const attendanceByUnit = await db.attendance.groupBy({
    by: ["unitId", "status"],
    where: { studentId: student.id },
    _count: { status: true },
  });
  const unitIds = [...new Set(attendanceByUnit.map((a) => a.unitId))];
  const units = await db.unit.findMany({ where: { id: { in: unitIds } }, select: { id: true, code: true } });
  const attendanceByUnitChart = units.map((u) => {
    const recs = attendanceByUnit.filter((a) => a.unitId === u.id);
    const present = recs.filter((r) => r.status === "PRESENT" || r.status === "LATE").reduce((s, r) => s + r._count.status, 0);
    const total = recs.reduce((s, r) => s + r._count.status, 0);
    return { unit: u.code, rate: total > 0 ? Math.round((present / total) * 100) : 0 };
  });

  return ok({
    student: {
      id: student.id,
      admissionNo: student.admissionNo,
      name: student.user.name,
      email: student.user.email,
      programme: student.programme?.title || "—",
      programmeCode: student.programme?.code || "—",
      qualification: student.programme?.qualification || "—",
      year: student.year,
      semester: student.semester,
      status: student.status,
      profileImageUrl: student.profileImageUrl,
      currentGPA: student.currentGPA,
      attendanceRate,
      overallProgress: student.overallProgress,
      profileComplete: student.profileComplete,
    },
    counts: {
      enrolledUnits: enrollments,
      pendingAssessments,
      poeRequests,
      poeSubmissions,
      attendanceRecords: attendanceRecords.length,
      feeBalance,
      totalFees,
      totalPaid,
      paymentCount: payments,
      examCardStatus: examCard?.status || "NONE",
      activeLoans,
      unreadNotifications: unreadNotifs,
      releasedResults,
      hostelStatus: hostelAlloc ? `Room ${hostelAlloc.roomNo}, ${hostelAlloc.hostel.name}` : "Not allocated",
    },
    upcomingDeadlines: upcomingDeadlines.map((a) => ({
      id: a.id,
      title: a.title,
      type: a.type,
      dueDate: a.dueDate.toISOString(),
      unit: a.unit.code,
    })),
    gpaTrend,
    attendanceByUnit: attendanceByUnitChart,
  });
});
