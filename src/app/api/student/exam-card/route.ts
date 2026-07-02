import { db } from "@/lib/db";
import { apiHandler, ok, unauthorized } from "@/lib/api";
import { getCurrentStudent } from "@/lib/student-session";

export const dynamic = "force-dynamic";

export const GET = apiHandler(async (req) => {
  const student = await getCurrentStudent();
  if (!student) return unauthorized();

  const examCard = await db.examCard.findFirst({
    where: { studentId: student.id },
    orderBy: { createdAt: "desc" },
    include: { semester: { select: { name: true } } },
  });

  if (!examCard) return ok(null);

  // Get enrolled units for the exam card
  const enrollments = await db.enrollment.findMany({
    where: { studentId: student.id, status: "ENROLLED" },
    include: { unit: { select: { code: true, title: true, credits: true, instructor: true } } },
  });

  return ok({
    id: examCard.id,
    status: examCard.status,
    issuedAt: examCard.issuedAt?.toISOString(),
    semester: examCard.semester?.name || "—",
    student: {
      name: student.user.name,
      admissionNo: student.admissionNo,
      programme: student.programme?.title || "—",
    },
    units: enrollments.map((e) => e.unit),
  });
});
