"use client";

import { motion } from "framer-motion";
import { GraduationCap, TrendingUp, Award, BookOpen } from "lucide-react";
import { StudentPageHeader, StatusPill, StatCard, EmptyState } from "@/components/student/ui";

interface Result {
  id: string; marks: number; grade: string; gpa: number;
  unit: { code: string; title: string; credits: number };
  releasedAt: string | null;
}

interface Semester {
  semester: string; gpa: number; units: number; results: Result[];
}

export function ResultsClient({
  currentGPA, totalUnits, semesterSummary,
}: {
  currentGPA: number; totalUnits: number; semesterSummary: Semester[];
}) {
  const bestGpa = Math.max(currentGPA, ...semesterSummary.map((s) => s.gpa), 4);
  const totalCredits = semesterSummary.reduce((s, sem) => s + sem.results.reduce((ss, r) => ss + r.unit.credits, 0), 0);

  return (
    <div>
      <StudentPageHeader
        title="Results"
        subtitle="Your academic performance across semesters"
        icon={GraduationCap}
      />

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="Current GPA" value={currentGPA.toFixed(2)} icon={TrendingUp} />
        <StatCard label="Total Units" value={totalUnits} icon={BookOpen} color="text-blue-600" bg="bg-blue-100 dark:bg-blue-950/40" />
        <StatCard label="Total Credits" value={totalCredits} icon={Award} color="text-gold" bg="bg-gold/10" />
        <StatCard label="Semesters" value={semesterSummary.length} icon={GraduationCap} color="text-purple-600" bg="bg-purple-100 dark:bg-purple-950/40" />
      </div>

      {/* GPA trend chart */}
      {semesterSummary.length > 0 && (
        <div className="rounded-3xl bg-card border border-border p-6 shadow-soft mb-6">
          <h2 className="font-display font-bold text-lg mb-4">GPA Trend</h2>
          <div className="h-48 flex items-end gap-4">
            {semesterSummary.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full relative flex items-end" style={{ height: "160px" }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(s.gpa / bestGpa) * 100}%` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="w-full gradient-royal rounded-t-lg group-hover:brightness-110 transition-all relative"
                  >
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      {s.gpa}
                    </span>
                  </motion.div>
                </div>
                <span className="text-[10px] text-muted-foreground text-center truncate w-full">{s.semester.split(",")[0]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-semester results */}
      {semesterSummary.length === 0 ? (
        <EmptyState title="No results yet" message="Your results will appear here once released." icon={GraduationCap} />
      ) : (
        <div className="space-y-6">
          {semesterSummary.map((sem, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-3xl bg-card border border-border shadow-soft overflow-hidden"
            >
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg">{sem.semester}</h3>
                  <p className="text-xs text-muted-foreground">{sem.units} units · {sem.results.reduce((s, r) => s + r.unit.credits, 0)} credits</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Semester GPA</p>
                  <p className="font-display font-bold text-3xl text-gradient-royal">{sem.gpa}</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Unit</th>
                      <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Credits</th>
                      <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Marks</th>
                      <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Grade</th>
                      <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">GPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sem.results.map((r) => (
                      <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-mono text-xs font-semibold">{r.unit.code}</p>
                          <p className="text-xs text-muted-foreground">{r.unit.title}</p>
                        </td>
                        <td className="px-4 py-3 font-mono">{r.unit.credits}</td>
                        <td className="px-4 py-3 font-mono font-semibold">{r.marks}</td>
                        <td className="px-4 py-3">
                          <span className={`font-display font-bold text-lg ${gradeColor(r.grade)}`}>{r.grade}</span>
                        </td>
                        <td className="px-4 py-3 font-mono">{r.gpa.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function gradeColor(grade: string) {
  if (grade === "A") return "text-emerald-600";
  if (grade === "B") return "text-blue-600";
  if (grade === "C") return "text-amber-600";
  if (grade === "D") return "text-orange-600";
  return "text-red-600";
}
