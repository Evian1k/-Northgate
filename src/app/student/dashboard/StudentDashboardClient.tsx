"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen, FileText, FileCheck2, FileCheck, CalendarCheck, Wallet, Receipt,
  IdCard, Library, Bell, GraduationCap, Building2, CalendarDays, Download,
  ArrowRight, TrendingUp, Award, Clock, AlertCircle, CheckCircle2,
  CreditCard, User, LifeBuoy, Settings, type LucideIcon,
} from "lucide-react";
import { AnimatedCounter, Reveal } from "@/components/anim";

interface Student {
  name: string; admissionNo: string; programme: string; programmeCode: string;
  qualification: string; year: number; semester: number;
  profileImageUrl?: string | null;
  currentGPA: number; attendanceRate: number; overallProgress: number; profileComplete: number;
}

interface Counts {
  enrolledUnits: number; pendingAssessments: number; poeRequests: number; poeSubmissions: number;
  feeBalance: number; examCardStatus: string; activeLoans: number; unreadNotifications: number;
  releasedResults: number; hostelStatus: string;
}

interface Deadline { id: string; title: string; type: string; dueDate: string; unit: string }
interface GpaTrend { semester: string; gpa: number }
interface AttendanceByUnit { unit: string; rate: number }

const quickActions: { icon: LucideIcon; label: string; href: string }[] = [
  { icon: BookOpen, label: "Register Units", href: "/student/my-units" },
  { icon: CalendarDays, label: "View Timetable", href: "/student/calendar" },
  { icon: IdCard, label: "Download Exam Card", href: "/student/exam-card" },
  { icon: GraduationCap, label: "View Results", href: "/student/results" },
  { icon: FileText, label: "Assessments", href: "/student/assessments" },
  { icon: FileCheck2, label: "POE Requests", href: "/student/poe-requests" },
  { icon: FileCheck, label: "POE Submission", href: "/student/poe-submissions" },
  { icon: CalendarCheck, label: "Attendance", href: "/student/attendance" },
  { icon: Library, label: "Library", href: "/student/library" },
  { icon: Receipt, label: "Fee Statement", href: "/student/fee-statements" },
  { icon: CreditCard, label: "Fee Payment", href: "/student/payments" },
  { icon: IdCard, label: "Student ID", href: "/student/student-id" },
  { icon: CalendarDays, label: "Academic Calendar", href: "/student/calendar" },
  { icon: Download, label: "Downloads", href: "/student/downloads" },
  { icon: LifeBuoy, label: "Support", href: "/student/support" },
  { icon: User, label: "Profile Settings", href: "/student/profile" },
];

export function StudentDashboardClient({
  student, counts, upcomingDeadlines, gpaTrend, attendanceByUnit,
}: {
  student: Student; counts: Counts; upcomingDeadlines: Deadline[];
  gpaTrend: GpaTrend[]; attendanceByUnit: AttendanceByUnit[];
}) {
  const cards = [
    { label: "Registered Units", value: counts.enrolledUnits, suffix: "", icon: BookOpen, href: "/student/my-units", color: "text-royal", bg: "bg-royal/10" },
    { label: "Pending Assessments", value: counts.pendingAssessments, suffix: "", icon: FileText, href: "/student/assessments", color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-950/40" },
    { label: "POE Requests", value: counts.poeRequests, suffix: "", icon: FileCheck2, href: "/student/poe-requests", color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-950/40" },
    { label: "POE Submissions", value: counts.poeSubmissions, suffix: "", icon: FileCheck, href: "/student/poe-submissions", color: "text-teal-600", bg: "bg-teal-100 dark:bg-teal-950/40" },
    { label: "Attendance Rate", value: student.attendanceRate, suffix: "%", icon: CalendarCheck, href: "/student/attendance", color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-950/40" },
    { label: "Fee Balance", value: counts.feeBalance, suffix: "", prefix: "KES ", icon: Wallet, href: "/student/finance", color: "text-red-600", bg: "bg-red-100 dark:bg-red-950/40" },
    { label: "Fee Statement", value: 0, suffix: "", icon: Receipt, href: "/student/fee-statements", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-950/40", custom: "View" },
    { label: "Exam Card Status", value: 0, suffix: "", icon: IdCard, href: "/student/exam-card", color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-950/40", custom: counts.examCardStatus },
    { label: "Active Loans", value: counts.activeLoans, suffix: "", icon: Library, href: "/student/library", color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-950/40" },
    { label: "Announcements", value: 0, suffix: "", icon: Bell, href: "/student/notifications", color: "text-pink-600", bg: "bg-pink-100 dark:bg-pink-950/40", custom: "View" },
    { label: "Notifications", value: counts.unreadNotifications, suffix: "", icon: Bell, href: "/student/notifications", color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-950/40" },
    { label: "Results Released", value: counts.releasedResults, suffix: "", icon: GraduationCap, href: "/student/results", color: "text-green-600", bg: "bg-green-100 dark:bg-green-950/40" },
    { label: "Library Books", value: counts.activeLoans, suffix: "", icon: Library, href: "/student/library", color: "text-cyan-600", bg: "bg-cyan-100 dark:bg-cyan-950/40" },
    { label: "Hostel Status", value: 0, suffix: "", icon: Building2, href: "/student/hostel", color: "text-violet-600", bg: "bg-violet-100 dark:bg-violet-950/40", custom: counts.hostelStatus },
  ];

  const maxGpa = Math.max(...gpaTrend.map((g) => g.gpa), 4);
  const maxAttendance = 100;

  return (
    <div className="space-y-6">
      {/* Welcome Hero */}
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl gradient-royal p-6 sm:p-8 shadow-premium">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-white/15 backdrop-blur-md grid place-items-center overflow-hidden flex-shrink-0 ring-2 ring-white/20">
              {student.profileImageUrl ? (
                <img src={student.profileImageUrl} alt={student.name} className="h-full w-full object-cover" />
              ) : (
                <span className="font-display font-bold text-white text-3xl">{student.name[0]}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">
                {greeting()} · Semester {student.semester}, Year {student.year}
              </p>
              <h1 className="font-display font-bold text-white text-2xl sm:text-3xl tracking-tight">
                Welcome back, {student.name.split(" ")[0]}!
              </h1>
              <p className="text-white/75 text-sm mt-1">
                {student.programme} · {student.qualification} · {student.admissionNo}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 w-full sm:w-auto">
              <HeroStat label="GPA" value={student.currentGPA} suffix="" decimals={2} />
              <HeroStat label="Attendance" value={student.attendanceRate} suffix="%" decimals={0} />
              <HeroStat label="Progress" value={student.overallProgress} suffix="%" decimals={0} />
            </div>
          </div>
        </div>
      </Reveal>

      {/* Stat cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
          >
            <Link
              href={card.href}
              className="group block rounded-2xl bg-card border border-border p-4 shadow-soft hover:shadow-premium hover:-translate-y-1 transition-all h-full"
            >
              <div className={`grid place-items-center h-9 w-9 rounded-xl mb-2.5 ${card.bg}`}>
                <card.icon className={`h-4.5 w-4.5 ${card.color}`} />
              </div>
              {card.custom ? (
                <p className={`font-display font-bold text-base ${card.color}`}>{card.custom}</p>
              ) : (
                <p className="font-display font-bold text-xl text-foreground">
                  {card.prefix}<AnimatedCounter to={card.value} suffix={card.suffix} />
                </p>
              )}
              <p className="text-[11px] text-muted-foreground mt-0.5 font-medium uppercase tracking-wide">{card.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* GPA Trend */}
        <Reveal>
          <div className="rounded-3xl bg-card border border-border p-6 shadow-soft h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-bold text-lg">GPA Trend</h2>
                <p className="text-xs text-muted-foreground">Across semesters</p>
              </div>
              <div className="grid place-items-center h-9 w-9 rounded-xl bg-gold/10">
                <TrendingUp className="h-4 w-4 text-gold" />
              </div>
            </div>
            {gpaTrend.length === 0 ? (
              <EmptyChart message="No results yet" />
            ) : (
              <div className="h-48 flex items-end gap-3">
                {gpaTrend.map((g, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full relative flex items-end" style={{ height: "160px" }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(g.gpa / maxGpa) * 100}%` }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="w-full gradient-royal rounded-t-lg group-hover:brightness-110 transition-all relative"
                      >
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          {g.gpa}
                        </span>
                      </motion.div>
                    </div>
                    <span className="text-[9px] text-muted-foreground text-center truncate w-full">{g.semester.split(",")[0]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {/* Attendance by Unit */}
        <Reveal delay={0.1}>
          <div className="rounded-3xl bg-card border border-border p-6 shadow-soft h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-bold text-lg">Attendance by Unit</h2>
                <p className="text-xs text-muted-foreground">This semester</p>
              </div>
              <div className="grid place-items-center h-9 w-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/40">
                <CalendarCheck className="h-4 w-4 text-emerald-600" />
              </div>
            </div>
            {attendanceByUnit.length === 0 ? (
              <EmptyChart message="No attendance records" />
            ) : (
              <div className="space-y-3 max-h-48 overflow-y-auto scroll-premium">
                {attendanceByUnit.map((a, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium">{a.unit}</span>
                      <span className="font-mono text-muted-foreground">{a.rate}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${a.rate}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05 }}
                        className={`h-full rounded-full ${a.rate >= 80 ? "bg-emerald-500" : a.rate >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {/* Upcoming Deadlines */}
        <Reveal delay={0.2}>
          <div className="rounded-3xl bg-card border border-border p-6 shadow-soft h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-bold text-lg">Upcoming Deadlines</h2>
                <p className="text-xs text-muted-foreground">Next 5 due</p>
              </div>
              <div className="grid place-items-center h-9 w-9 rounded-xl bg-amber-100 dark:bg-amber-950/40">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
            </div>
            {upcomingDeadlines.length === 0 ? (
              <EmptyChart message="No upcoming deadlines" />
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto scroll-premium">
                {upcomingDeadlines.map((d) => {
                  const daysLeft = Math.ceil((new Date(d.dueDate).getTime() - Date.now()) / 86400000);
                  return (
                    <Link
                      key={d.id}
                      href="/student/assessments"
                      className="block rounded-xl p-3 hover:bg-muted transition-colors border border-border"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold truncate">{d.title}</p>
                          <p className="text-xs text-muted-foreground">{d.unit} · {d.type}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          daysLeft <= 3 ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                          : daysLeft <= 7 ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                          : "bg-muted text-muted-foreground"
                        }`}>
                          {daysLeft}d left
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {/* Quick Actions */}
      <Reveal>
        <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-bold text-lg">Quick Actions</h2>
              <p className="text-xs text-muted-foreground">One-click access to everything you need</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
              >
                <Link
                  href={action.href}
                  className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-muted/50 hover:bg-muted hover:shadow-soft transition-all aspect-square justify-center text-center"
                >
                  <div className="grid place-items-center h-10 w-10 rounded-xl gradient-royal text-white group-hover:scale-110 transition-transform">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-medium leading-tight">{action.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function HeroStat({ label, value, suffix, decimals }: { label: string; value: number; suffix: string; decimals: number }) {
  return (
    <div className="rounded-2xl glass-dark p-3 text-center">
      <p className="font-display font-bold text-white text-xl sm:text-2xl">
        <AnimatedCounter to={value} suffix={suffix} decimals={decimals} />
      </p>
      <p className="text-[10px] text-white/65 uppercase tracking-widest font-semibold">{label}</p>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="h-48 grid place-items-center text-center">
      <div>
        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
