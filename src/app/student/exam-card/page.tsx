import { getCurrentUser } from "@/lib/session";
import { isDemoUser, demoExamCard } from "@/lib/demo-student-data";
import { ExamCardClient } from "./ExamCardClient";

export const dynamic = "force-dynamic";

export default async function ExamCardPage() {
  const user = await getCurrentUser();
  if (!user) return <div>Unauthorized</div>;
  if (isDemoUser(user.id)) return <ExamCardClient examCard={demoExamCard} student={demoExamCard.student} units={demoExamCard.units} />;
  try {
    const { db } = await import("@/lib/db");
    const { getCurrentStudent } = await import("@/lib/student-session");
    const student = await getCurrentStudent();
    if (!student) return <div>Unauthorized</div>;
    const examCard = await db.examCard.findFirst({ where: { studentId: student.id }, orderBy: { createdAt: "desc" }, include: { semester: { select: { name: true } } } });
    const enrollments = await db.enrollment.findMany({ where: { studentId: student.id, status: "ENROLLED" }, include: { unit: { select: { code: true, title: true, credits: true, instructor: true } } } });
    return <ExamCardClient examCard={examCard ? { id: examCard.id, status: examCard.status, issuedAt: examCard.issuedAt?.toISOString() || null, semester: examCard.semester?.name || "—" } : null} student={{ name: student.user.name, admissionNo: student.admissionNo, programme: student.programme?.title || "—", year: student.year, semester: student.semester, profileImageUrl: student.profileImageUrl }} units={enrollments.map((e) => e.unit)} />;
  } catch {
    return <ExamCardClient examCard={demoExamCard} student={demoExamCard.student} units={demoExamCard.units} />;
  }
}
