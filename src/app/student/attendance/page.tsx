import { getCurrentUser } from "@/lib/session";
import { isDemoUser, demoAttendance } from "@/lib/demo-student-data";
import { AttendanceClient } from "./AttendanceClient";

export const dynamic = "force-dynamic";

export default async function AttendancePage() {
  const user = await getCurrentUser();
  if (!user) return <div>Unauthorized</div>;
  if (isDemoUser(user.id)) return <AttendanceClient stats={demoAttendance} byUnit={demoAttendance.byUnit} records={demoAttendance.records} />;
  try {
    const { db } = await import("@/lib/db");
    const { getCurrentStudent } = await import("@/lib/student-session");
    const student = await getCurrentStudent();
    if (!student) return <div>Unauthorized</div>;
    const since = new Date(Date.now() - 30 * 86400000);
    const records = await db.attendance.findMany({ where: { studentId: student.id, date: { gte: since } }, orderBy: { date: "desc" }, include: { unit: { select: { code: true, title: true } } }, take: 200 });
    const total = records.length;
    const present = records.filter((r) => r.status === "PRESENT").length;
    const late = records.filter((r) => r.status === "LATE").length;
    const absent = records.filter((r) => r.status === "ABSENT").length;
    const excused = records.filter((r) => r.status === "EXCUSED").length;
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    const byUnitMap: Record<string, { code: string; total: number; present: number }> = {};
    for (const r of records) { if (!byUnitMap[r.unit.code]) byUnitMap[r.unit.code] = { code: r.unit.code, total: 0, present: 0 }; byUnitMap[r.unit.code].total++; if (r.status === "PRESENT" || r.status === "LATE") byUnitMap[r.unit.code].present++; }
    const byUnit = Object.values(byUnitMap).map((u) => ({ unit: u.code, rate: u.total > 0 ? Math.round((u.present / u.total) * 100) : 0, total: u.total }));
    return <AttendanceClient stats={{ rate, total, present, late, absent, excused }} byUnit={byUnit} records={records.map((r) => ({ id: r.id, date: r.date.toISOString(), status: r.status, unit: r.unit.code, unitTitle: r.unit.title }))} />;
  } catch {
    return <AttendanceClient stats={demoAttendance} byUnit={demoAttendance.byUnit} records={demoAttendance.records} />;
  }
}
