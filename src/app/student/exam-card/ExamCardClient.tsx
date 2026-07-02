"use client";

import { motion } from "framer-motion";
import { IdCard, Download, CheckCircle2, Clock, XCircle, Printer } from "lucide-react";
import { StudentPageHeader, StatusPill, EmptyState } from "@/components/student/ui";

interface ExamCard {
  id: string; status: string; issuedAt: string | null; semester: string;
}

interface Student {
  name: string; admissionNo: string; programme: string;
  year: number; semester: number; profileImageUrl?: string | null;
}

interface Unit { code: string; title: string; credits: number; instructor: string }

export function ExamCardClient({
  examCard, student, units,
}: {
  examCard: ExamCard | null; student: Student; units: Unit[];
}) {
  const handlePrint = () => window.print();

  return (
    <div>
      <StudentPageHeader
        title="Exam Card"
        subtitle="Your examination entry card for the current semester"
        icon={IdCard}
        actions={
          examCard?.status === "ISSUED" && (
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-full gradient-royal text-white px-4 py-2 text-sm font-semibold shadow-soft hover:shadow-premium transition-shadow"
            >
              <Printer className="h-4 w-4" /> Print / Save PDF
            </button>
          )
        }
      />

      {examCard?.status === "ISSUED" ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          {/* Exam card */}
          <div className="rounded-3xl bg-card border-2 border-royal/20 shadow-premium overflow-hidden print:shadow-none print:border-royal">
            {/* Header */}
            <div className="gradient-royal p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-grid opacity-20" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-white/15 backdrop-blur-md grid place-items-center">
                    <span className="font-display font-bold text-white text-xl">N</span>
                  </div>
                  <div>
                    <p className="font-display font-bold text-lg">Northgate Institute of Technology</p>
                    <p className="text-xs text-white/70">Examination Entry Card · {examCard.semester}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-white/70 font-semibold">Status</p>
                  <p className="font-bold text-gold">ISSUED</p>
                </div>
              </div>
            </div>

            {/* Student info */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-2xl bg-muted overflow-hidden flex-shrink-0">
                  {student.profileImageUrl ? (
                    <img src={student.profileImageUrl} alt={student.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full grid place-items-center bg-royal text-white font-display font-bold text-2xl">
                      {student.name[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Student Name</p>
                    <p className="font-display font-bold text-lg">{student.name}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Admission No.</p>
                    <p className="font-mono font-bold text-lg">{student.admissionNo}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Programme</p>
                    <p className="font-semibold text-sm">{student.programme}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Year / Semester</p>
                    <p className="font-semibold text-sm">Year {student.year} · Semester {student.semester}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Units table */}
            <div className="p-6">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground mb-3">Examined Units</h3>
              <div className="rounded-2xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-widest text-muted-foreground">#</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Code</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Unit Title</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Credits</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Instructor</th>
                      <th className="text-center px-4 py-2.5 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Signature</th>
                    </tr>
                  </thead>
                  <tbody>
                    {units.map((u, i) => (
                      <tr key={u.code} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                        <td className="px-4 py-3 font-mono font-semibold">{u.code}</td>
                        <td className="px-4 py-3">{u.title}</td>
                        <td className="px-4 py-3 font-mono">{u.credits}</td>
                        <td className="px-4 py-3 text-xs">{u.instructor}</td>
                        <td className="px-4 py-3 text-center text-muted-foreground/40">—</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <div>
                  <p>Issued on: {examCard.issuedAt ? new Date(examCard.issuedAt).toLocaleDateString() : "—"}</p>
                  <p>Card ID: {examCard.id.slice(0, 12).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">Registrar of Examinations</p>
                  <p>Northgate Institute of Technology</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4 print:hidden">
            This exam card is valid for the {examCard.semester}. Present it to your invigilator at each examination.
          </p>
        </motion.div>
      ) : examCard?.status === "PENDING" ? (
        <EmptyState
          title="Exam Card Pending"
          message="Your exam card is being processed. Please check back later or contact the registrar."
          icon={Clock}
        />
      ) : examCard?.status === "APPROVED" ? (
        <EmptyState
          title="Exam Card Approved"
          message="Your exam card has been approved and will be issued shortly."
          icon={CheckCircle2}
        />
      ) : (
        <EmptyState
          title="No Exam Card"
          message="You don't have an exam card for this semester. Contact the registrar's office."
          icon={XCircle}
        />
      )}
    </div>
  );
}
