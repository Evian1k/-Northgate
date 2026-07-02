import { getCurrentUser } from "@/lib/session";
import { isDemoUser, demoResults } from "@/lib/demo-student-data";
import { ResultsClient } from "./ResultsClient";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const user = await getCurrentUser();
  if (!user) return <div>Unauthorized</div>;
  if (isDemoUser(user.id)) return <ResultsClient currentGPA={demoResults.currentGPA} totalUnits={demoResults.totalUnits} semesterSummary={demoResults.semesterSummary} />;
  try {
    const { db } = await import("@/lib/db");
    const { getCurrentStudent } = await import("@/lib/student-session");
    const student = await getCurrentStudent();
    if (!student) return <div>Unauthorized</div>;
    const results = await db.result.findMany({ where: { studentId: student.id, status: "RELEASED" }, orderBy: { createdAt: "desc" }, include: { unit: { select: { code: true, title: true, credits: true } }, semester: { select: { name: true, code: true } } } });
    const bySemester: Record<string, { semester: string; results: any[]; gpa: number; count: number }> = {};
    for (const r of results) { const key = r.semester?.code || "current"; if (!bySemester[key]) bySemester[key] = { semester: r.semester?.name || "Current", results: [], gpa: 0, count: 0 }; bySemester[key].results.push({ id: r.id, marks: r.marks, grade: r.grade, gpa: r.gpa, unit: r.unit, releasedAt: r.releasedAt?.toISOString() }); bySemester[key].gpa += r.gpa; bySemester[key].count++; }
    const semesterSummary = Object.values(bySemester).map((s) => ({ semester: s.semester, gpa: Number((s.gpa / s.count).toFixed(2)), units: s.count, results: s.results }));
    return <ResultsClient currentGPA={student.currentGPA} totalUnits={results.length} semesterSummary={semesterSummary} />;
  } catch {
    return <ResultsClient currentGPA={demoResults.currentGPA} totalUnits={demoResults.totalUnits} semesterSummary={demoResults.semesterSummary} />;
  }
}
