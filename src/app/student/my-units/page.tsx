import { db } from "@/lib/db";
import { getCurrentStudent } from "@/lib/student-session";
import { MyUnitsClient } from "./MyUnitsClient";

export const dynamic = "force-dynamic";

export default async function MyUnitsPage() {
  const student = await getCurrentStudent();
  if (!student) return <div>Unauthorized</div>;

  const enrollments = await db.enrollment.findMany({
    where: { studentId: student.id, status: "ENROLLED" },
    include: {
      unit: {
        include: {
          department: { select: { name: true } },
          semester: { select: { name: true } },
          assessments: { select: { id: true, dueDate: true, type: true } },
        },
      },
      semester: { select: { name: true } },
    },
    orderBy: { enrolledAt: "desc" },
  });

  const units = enrollments.map((e) => ({
    id: e.unit.id,
    code: e.unit.code,
    title: e.unit.title,
    description: e.unit.description || "",
    credits: e.unit.credits,
    instructor: e.unit.instructor || "TBA",
    department: e.unit.department.name,
    semester: e.unit.semester?.name || "—",
    assessmentCount: e.unit.assessments.length,
    upcomingAssessments: e.unit.assessments.filter((a) => a.dueDate > new Date()).length,
  }));

  return <MyUnitsClient units={units} />;
}
