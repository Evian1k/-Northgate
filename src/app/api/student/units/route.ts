import { db } from "@/lib/db";
import { apiHandler, ok, unauthorized } from "@/lib/api";
import { getCurrentStudent } from "@/lib/student-session";

export const dynamic = "force-dynamic";

export const GET = apiHandler(async (req) => {
  const student = await getCurrentStudent();
  if (!student) return unauthorized();

  const enrollments = await db.enrollment.findMany({
    where: { studentId: student.id, status: "ENROLLED" },
    include: {
      unit: {
        include: {
          department: { select: { name: true } },
          semester: { select: { name: true } },
          _count: { select: { assessments: true } },
        },
      },
      semester: { select: { name: true } },
    },
    orderBy: { enrolledAt: "desc" },
  });

  return ok(enrollments.map((e) => ({
    id: e.id,
    status: e.status,
    enrolledAt: e.enrolledAt.toISOString(),
    unit: {
      id: e.unit.id,
      code: e.unit.code,
      title: e.unit.title,
      description: e.unit.description,
      credits: e.unit.credits,
      instructor: e.unit.instructor,
      department: e.unit.department.name,
      semester: e.unit.semester?.name || "—",
      assessmentCount: e.unit._count.assessments,
    },
  })));
});
