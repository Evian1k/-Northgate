import { db } from "@/lib/db";
import { getCurrentStudent } from "@/lib/student-session";
import { ExamCardClient } from "./ExamCardClient";

export const dynamic = "force-dynamic";

export default async function ExamCardPage() {
  const student = await getCurrentStudent();
  if (!student) return <div>Unauthorized</div>;

  const examCard = await db.examCard.findFirst({
    where: { studentId: student.id },
    orderBy: { createdAt: "desc" },
    include: { semester: { select: { name: true } } },
  });

  const enrollments = await db.enrollment.findMany({
    where: { studentId: student.id, status: "ENROLLED" },
    include: { unit: { select: { code: true, title: true, credits: true, instructor: true } } },
  });

  return (
    <ExamCardClient
      examCard={examCard ? {
        id: examCard.id,
        status: examCard.status,
        issuedAt: examCard.issuedAt?.toISOString() || null,
        semester: examCard.semester?.name || "—",
      } : null}
      student={{
        name: student.user.name,
        admissionNo: student.admissionNo,
        programme: student.programme?.title || "—",
        year: student.year,
        semester: student.semester,
        profileImageUrl: student.profileImageUrl,
      }}
      units={enrollments.map((e) => e.unit)}
    />
  );
}
