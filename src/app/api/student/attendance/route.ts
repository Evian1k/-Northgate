import { db } from "@/lib/db";
import { apiHandler, ok, unauthorized } from "@/lib/api";
import { getCurrentStudent } from "@/lib/student-session";

export const dynamic = "force-dynamic";

export const GET = apiHandler(async (req) => {
  const student = await getCurrentStudent();
  if (!student) return unauthorized();

  const url = new URL(req.url);
  const days = parseInt(url.searchParams.get("days") || "30");
  const since = new Date(Date.now() - days * 86400000);

  const records = await db.attendance.findMany({
    where: { studentId: student.id, date: { gte: since } },
    orderBy: { date: "desc" },
    include: { unit: { select: { code: true, title: true } } },
    take: 200,
  });

  const total = records.length;
  const present = records.filter((r) => r.status === "PRESENT").length;
  const late = records.filter((r) => r.status === "LATE").length;
  const absent = records.filter((r) => r.status === "ABSENT").length;
  const excused = records.filter((r) => r.status === "EXCUSED").length;
  const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

  // By unit
  const byUnitMap: Record<string, { code: string; total: number; present: number }> = {};
  for (const r of records) {
    const key = r.unit.code;
    if (!byUnitMap[key]) byUnitMap[key] = { code: key, total: 0, present: 0 };
    byUnitMap[key].total++;
    if (r.status === "PRESENT" || r.status === "LATE") byUnitMap[key].present++;
  }
  const byUnit = Object.values(byUnitMap).map((u) => ({
    unit: u.code,
    rate: u.total > 0 ? Math.round((u.present / u.total) * 100) : 0,
    total: u.total,
  }));

  // By day (for chart - last 14 days)
  const byDayMap: Record<string, { date: string; present: number; absent: number }> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toISOString().slice(5, 10);
    byDayMap[key] = { date: key, present: 0, absent: 0 };
  }
  for (const r of records) {
    const key = r.date.toISOString().slice(5, 10);
    if (key in byDayMap) {
      if (r.status === "PRESENT" || r.status === "LATE") byDayMap[key].present++;
      else byDayMap[key].absent++;
    }
  }

  return ok({
    rate,
    total,
    present,
    late,
    absent,
    excused,
    records: records.map((r) => ({
      id: r.id,
      date: r.date.toISOString(),
      status: r.status,
      unit: r.unit.code,
      unitTitle: r.unit.title,
    })),
    byUnit,
    byDay: Object.values(byDayMap),
  });
});
