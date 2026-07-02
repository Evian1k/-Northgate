import { getCurrentUser } from "@/lib/session";
import { isDemoUser, demoAssessments } from "@/lib/demo-student-data";
import { AssessmentsClient } from "../assessments/AssessmentsClient";

export const dynamic = "force-dynamic";

export default async function AssignmentsPage() {
  const user = await getCurrentUser();
  if (!user) return <div>Unauthorized</div>;
  if (isDemoUser(user.id)) return <AssessmentsClient assessments={demoAssessments.filter((a) => a.type === "ASSIGNMENT")} />;
  try {
    const { db } = await import("@/lib/db");
    const { getCurrentStudent } = await import("@/lib/student-session");
    const student = await getCurrentStudent();
    if (!student) return <div>Unauthorized</div>;
    const assessments = await db.assessment.findMany({ where: { type: "ASSIGNMENT", unit: { enrollments: { some: { studentId: student.id } } } }, orderBy: { dueDate: "asc" }, include: { unit: { select: { code: true, title: true } }, submissions: { where: { studentId: student.id }, select: { id: true, status: true, marks: true, feedback: true, submittedAt: true } } }, take: 100 });
    return <AssessmentsClient assessments={assessments.map((a) => ({ id: a.id, title: a.title, type: a.type, description: a.description || "", maxMarks: a.maxMarks, weight: a.weight, dueDate: a.dueDate.toISOString(), unit: a.unit, submission: a.submissions[0] || null }))} />;
  } catch {
    return <AssessmentsClient assessments={demoAssessments.filter((a) => a.type === "ASSIGNMENT")} />;
  }
}
