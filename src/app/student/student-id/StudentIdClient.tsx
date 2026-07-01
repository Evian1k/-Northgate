"use client";

import { motion } from "framer-motion";
import { IdCard, Download, Printer, Shield, QrCode } from "lucide-react";
import { StudentPageHeader } from "@/components/student/ui";

interface Student {
  name: string; admissionNo: string; programme: string; qualification: string;
  year: number; semester: number; gender: string; nationality: string;
  phone: string; email: string; profileImageUrl?: string | null;
  enrollmentDate: string; status: string;
}

export function StudentIdClient({ student }: { student: Student }) {
  const handlePrint = () => window.print();

  return (
    <div>
      <StudentPageHeader
        title="Student ID"
        subtitle="Your digital student identification card"
        icon={IdCard}
        actions={
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-full gradient-royal text-white px-4 py-2 text-sm font-semibold shadow-soft hover:shadow-premium transition-shadow"
          >
            <Printer className="h-4 w-4" /> Print ID
          </button>
        }
      />

      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ rotateY: 5, rotateX: -5 }}
          style={{ transformStyle: "preserve-3d", perspective: 1000 }}
          className="rounded-3xl overflow-hidden shadow-premium"
        >
          {/* Front of ID */}
          <div className="relative aspect-[1.6/1] gradient-royal text-white overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />

            <div className="relative p-6 h-full flex flex-col justify-between">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid place-items-center h-8 w-8 rounded-lg bg-white/15 backdrop-blur-md">
                    <span className="font-display font-bold text-sm">N</span>
                  </div>
                  <div>
                    <p className="font-display font-bold text-xs">Northgate</p>
                    <p className="text-[8px] uppercase tracking-widest text-white/60">Student ID Card</p>
                  </div>
                </div>
                <Shield className="h-5 w-5 text-gold" />
              </div>

              {/* Body */}
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-2xl bg-white/15 backdrop-blur-md overflow-hidden ring-2 ring-white/20 flex-shrink-0">
                  {student.profileImageUrl ? (
                    <img src={student.profileImageUrl} alt={student.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full grid place-items-center font-display font-bold text-2xl">
                      {student.name[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-lg leading-tight">{student.name}</p>
                  <p className="text-xs text-white/70 mt-0.5">{student.admissionNo}</p>
                  <p className="text-xs text-gold mt-1">{student.qualification}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <p className="text-white/50 uppercase tracking-widest">Programme</p>
                  <p className="font-semibold truncate">{student.programme}</p>
                </div>
                <div>
                  <p className="text-white/50 uppercase tracking-widest">Year/Sem</p>
                  <p className="font-semibold">Y{student.year} · S{student.semester}</p>
                </div>
                <div>
                  <p className="text-white/50 uppercase tracking-widest">Status</p>
                  <p className="font-semibold text-emerald-300">{student.status}</p>
                </div>
                <div>
                  <p className="text-white/50 uppercase tracking-widest">Valid Until</p>
                  <p className="font-semibold">{new Date(Date.now() + 365 * 86400000).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Back of ID */}
          <div className="bg-card p-5 border-t border-border">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-muted-foreground uppercase tracking-widest text-[9px] font-semibold">Email</p>
                <p className="font-medium truncate">{student.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground uppercase tracking-widest text-[9px] font-semibold">Phone</p>
                <p className="font-medium">{student.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground uppercase tracking-widest text-[9px] font-semibold">Nationality</p>
                <p className="font-medium">{student.nationality}</p>
              </div>
              <div>
                <p className="text-muted-foreground uppercase tracking-widest text-[9px] font-semibold">Enrolled</p>
                <p className="font-medium">{new Date(student.enrollmentDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <div className="grid place-items-center h-12 w-12 rounded-lg bg-muted">
                <QrCode className="h-8 w-8 text-foreground" />
              </div>
              <p className="text-[9px] text-muted-foreground text-right max-w-[60%]">
                This card is property of Northgate Institute of Technology. If found, please return to the registrar&apos;s office.
              </p>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Present this ID at the library, exam halls, and campus facilities.
        </p>
      </div>
    </div>
  );
}
