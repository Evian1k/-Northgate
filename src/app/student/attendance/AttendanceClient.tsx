"use client";

import { motion } from "framer-motion";
import { CalendarCheck, CheckCircle2, XCircle, Clock3, FileText } from "lucide-react";
import { StudentPageHeader, StatusPill, StatCard } from "@/components/student/ui";

interface Props {
  stats: { rate: number; total: number; present: number; late: number; absent: number; excused: number };
  byUnit: { unit: string; rate: number; total: number }[];
  records: { id: string; date: string; status: string; unit: string; unitTitle: string }[];
}

export function AttendanceClient({ stats, byUnit, records }: Props) {
  return (
    <div>
      <StudentPageHeader
        title="Attendance"
        subtitle="Your class attendance records and analytics"
        icon={CalendarCheck}
      />

      {/* Overall rate donut + stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="rounded-3xl bg-card border border-border p-6 shadow-soft flex items-center gap-6">
          <AttendanceDonut rate={stats.rate} />
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Overall Rate</p>
            <p className="font-display font-bold text-4xl text-foreground">{stats.rate}%</p>
            <p className="text-xs text-muted-foreground mt-1">{stats.total} sessions recorded</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:col-span-2">
          <StatCard label="Present" value={stats.present} icon={CheckCircle2} color="text-emerald-600" bg="bg-emerald-100 dark:bg-emerald-950/40" />
          <StatCard label="Late" value={stats.late} icon={Clock3} color="text-amber-600" bg="bg-amber-100 dark:bg-amber-950/40" />
          <StatCard label="Absent" value={stats.absent} icon={XCircle} color="text-red-600" bg="bg-red-100 dark:bg-red-950/40" />
          <StatCard label="Excused" value={stats.excused} icon={FileText} color="text-blue-600" bg="bg-blue-100 dark:bg-blue-950/40" />
        </div>
      </div>

      {/* By unit */}
      <div className="rounded-3xl bg-card border border-border p-6 shadow-soft mb-6">
        <h2 className="font-display font-bold text-lg mb-4">Attendance by Unit</h2>
        <div className="space-y-3">
          {byUnit.map((u, i) => (
            <div key={u.unit}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-mono font-semibold">{u.unit}</span>
                <span className="font-mono text-muted-foreground">{u.rate}% · {u.total} sessions</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${u.rate}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className={`h-full rounded-full ${u.rate >= 80 ? "bg-emerald-500" : u.rate >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent records */}
      <div className="rounded-3xl bg-card border border-border shadow-soft overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-display font-bold text-lg">Recent Sessions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Unit</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.slice(0, 20).map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">{new Date(r.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs font-semibold">{r.unit}</p>
                    <p className="text-xs text-muted-foreground">{r.unitTitle}</p>
                  </td>
                  <td className="px-4 py-3"><StatusPill status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AttendanceDonut({ rate }: { rate: number }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (rate / 100) * circumference;
  return (
    <div className="relative h-28 w-28 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
        <motion.circle
          cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
          className={rate >= 80 ? "text-emerald-500" : rate >= 60 ? "text-amber-500" : "text-red-500"}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-display font-bold text-xl">{rate}%</span>
      </div>
    </div>
  );
}
