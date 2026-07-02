import { db } from "@/lib/db";
import { getCurrentStudent } from "@/lib/student-session";
import { AssessmentsClient } from "../assessments/AssessmentsClient";

export const dynamic = "force-dynamic";

export default async function PoeRequestsPage() {
  const student = await getCurrentStudent();
  if (!student) return <div>Unauthorized</div>;

  const assessments = await db.assessment.findMany({
    where: { type: "POE_REQUEST", unit: { enrollments: { some: { studentId: student.id } } } },
    orderBy: { dueDate: "asc" },
    include: {
      unit: { select: { code: true, title: true } },
      submissions: { where: { studentId: student.id }, select: { id: true, status: true, marks: true, feedback: true, submittedAt: true } },
    },
    take: 100,
  });

  return (
    <AssessmentsClient
      assessments={assessments.map((a) => ({
        id: a.id, title: a.title, type: a.type,
        description: a.description || "", maxMarks: a.maxMarks, weight: a.weight,
        dueDate: a.dueDate.toISOString(), unit: a.unit,
        submission: a.submissions[0] || null,
      }))}
    />
  );
}
