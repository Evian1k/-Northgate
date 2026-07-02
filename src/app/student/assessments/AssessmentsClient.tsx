"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Clock, Award, Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { StudentPageHeader, EmptyState, StatusPill, StatCard } from "@/components/student/ui";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Assessment {
  id: string;
  title: string;
  type: string;
  description: string;
  maxMarks: number;
  weight: number;
  dueDate: string;
  unit: { code: string; title: string };
  submission: { id: string; status: string; marks: number | null; feedback: string | null; submittedAt: string | null } | null;
}

export function AssessmentsClient({ assessments }: { assessments: Assessment[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [filter, setFilter] = React.useState("ALL");
  const [submitting, setSubmitting] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    if (filter === "ALL") return assessments;
    if (filter === "PENDING") return assessments.filter((a) => !a.submission || a.submission.status === "PENDING");
    if (filter === "SUBMITTED") return assessments.filter((a) => a.submission?.status === "SUBMITTED" || a.submission?.status === "LATE");
    if (filter === "GRADED") return assessments.filter((a) => a.submission?.status === "GRADED");
    return assessments;
  }, [assessments, filter]);

  const pending = assessments.filter((a) => !a.submission || a.submission.status === "PENDING").length;
  const submitted = assessments.filter((a) => a.submission?.status === "SUBMITTED" || a.submission?.status === "LATE").length;
  const graded = assessments.filter((a) => a.submission?.status === "GRADED").length;
  const avgScore = assessments
    .filter((a) => a.submission?.marks != null)
    .reduce((s, a) => s + (a.submission!.marks! / a.maxMarks) * 100, 0) /
    Math.max(1, graded);

  const submit = async (id: string) => {
    setSubmitting(id);
    try {
      const res = await fetch("/api/student/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId: id, fileUrl: "uploaded.pdf" }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Submitted!", description: "Your assessment has been submitted." });
        router.refresh();
      } else {
        toast({ title: "Failed", description: data.error || "Try again", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", description: "Try again", variant: "destructive" });
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div>
      <StudentPageHeader
        title="Assessments"
        subtitle="All your assignments, CATs, exams, and POE requests"
        icon={FileText}
        actions={
          <div className="flex gap-2">
            {["ALL", "PENDING", "SUBMITTED", "GRADED"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                  f === filter ? "gradient-royal text-white shadow-soft" : "bg-card border border-border text-foreground/70 hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="Total" value={assessments.length} icon={FileText} />
        <StatCard label="Pending" value={pending} icon={Clock} color="text-amber-600" bg="bg-amber-100 dark:bg-amber-950/40" />
        <StatCard label="Submitted" value={submitted} icon={Upload} color="text-blue-600" bg="bg-blue-100 dark:bg-blue-950/40" />
        <StatCard label="Avg Score" value={`${Math.round(avgScore)}%`} icon={Award} color="text-emerald-600" bg="bg-emerald-100 dark:bg-emerald-950/40" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No assessments found"
          message={filter === "ALL" ? "You have no assessments yet." : `No ${filter.toLowerCase()} assessments.`}
          icon={FileText}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((a, i) => {
            const daysLeft = Math.ceil((new Date(a.dueDate).getTime() - Date.now()) / 86400000);
            const overdue = daysLeft < 0 && !a.submission;
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-premium transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold text-gold bg-gold/10 px-2 py-0.5 rounded">{a.unit.code}</span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{a.type}</span>
                      {a.submission && <StatusPill status={a.submission.status} />}
                    </div>
                    <h3 className="font-display font-bold text-base">{a.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{a.description}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Due {new Date(a.dueDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Award className="h-3 w-3" /> {a.maxMarks} marks · {(a.weight * 100).toFixed(0)}% weight</span>
                      {a.submission?.marks != null && (
                        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                          <CheckCircle2 className="h-3 w-3" /> Scored {a.submission.marks}/{a.maxMarks}
                        </span>
                      )}
                    </div>
                    {a.submission?.feedback && (
                      <div className="mt-3 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">Feedback: </span>{a.submission.feedback}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-2">
                    {!a.submission || a.submission.status === "PENDING" ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => submit(a.id)}
                          disabled={submitting === a.id}
                          className="rounded-full gradient-royal text-white"
                        >
                          {submitting === a.id ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Upload className="h-3.5 w-3.5 mr-1" />}
                          Submit
                        </Button>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          overdue ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                          : daysLeft <= 3 ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                          : daysLeft <= 7 ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                          : "bg-muted text-muted-foreground"
                        }`}>
                          {overdue ? "OVERDUE" : `${daysLeft}d left`}
                        </span>
                      </>
                    ) : a.submission.status === "GRADED" ? (
                      <span className="text-2xl font-display font-bold text-emerald-600">
                        {Math.round((a.submission.marks! / a.maxMarks) * 100)}%
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Awaiting grading</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
