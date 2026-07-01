import { db } from "@/lib/db";
import { apiHandler, ok, unauthorized } from "@/lib/api";
import { getCurrentStudent } from "@/lib/student-session";

export const dynamic = "force-dynamic";

export const GET = apiHandler(async (req) => {
  const student = await getCurrentStudent();
  if (!student) return unauthorized();

  const results = await db.result.findMany({
    where: { studentId: student.id, status: "RELEASED" },
    orderBy: { createdAt: "desc" },
    include: {
      unit: { select: { code: true, title: true, credits: true } },
      semester: { select: { name: true, code: true } },
    },
  });

  // Group by semester for trend
  const bySemester: Record<string, { semester: string; results: any[]; gpa: number; count: number }> = {};
  for (const r of results) {
    const key = r.semester?.code || "current";
    if (!bySemester[key]) bySemester[key] = { semester: r.semester?.name || "Current", results: [], gpa: 0, count: 0 };
    bySemester[key].results.push({
      id: r.id,
      marks: r.marks,
      grade: r.grade,
      gpa: r.gpa,
      unit: r.unit,
      releasedAt: r.releasedAt?.toISOString(),
    });
    bySemester[key].gpa += r.gpa;
    bySemester[key].count++;
  }

  const semesterSummary = Object.values(bySemester).map((s) => ({
    semester: s.semester,
    gpa: Number((s.gpa / s.count).toFixed(2)),
    units: s.count,
    results: s.results,
  }));

  return ok({
    currentGPA: student.currentGPA,
    totalUnits: results.length,
    semesterSummary,
    allResults: results.map((r) => ({
      id: r.id,
      marks: r.marks,
      grade: r.grade,
      gpa: r.gpa,
      unit: r.unit,
      semester: r.semester?.name || "—",
      releasedAt: r.releasedAt?.toISOString(),
    })),
  });
});
