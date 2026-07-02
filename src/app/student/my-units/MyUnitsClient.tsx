"use client";

import { motion } from "framer-motion";
import { BookOpen, User, Clock, FileText, ArrowRight, type LucideIcon } from "lucide-react";
import { StudentPageHeader, EmptyState, StatCard } from "@/components/student/ui";

interface Unit {
  id: string; code: string; title: string; description: string;
  credits: number; instructor: string; department: string;
  semester: string; assessmentCount: number; upcomingAssessments: number;
}

export function MyUnitsClient({ units }: { units: Unit[] }) {
  const totalCredits = units.reduce((s, u) => s + u.credits, 0);
  const totalAssessments = units.reduce((s, u) => s + u.assessmentCount, 0);
  const totalUpcoming = units.reduce((s, u) => s + u.upcomingAssessments, 0);

  return (
    <div>
      <StudentPageHeader
        title="My Units"
        subtitle="Units you are enrolled in this semester"
        icon={BookOpen}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="Enrolled Units" value={units.length} icon={BookOpen} />
        <StatCard label="Total Credits" value={totalCredits} icon={Clock} color="text-gold" bg="bg-gold/10" />
        <StatCard label="Assessments" value={totalAssessments} icon={FileText} color="text-purple-600" bg="bg-purple-100 dark:bg-purple-950/40" />
        <StatCard label="Upcoming" value={totalUpcoming} icon={Clock} color="text-amber-600" bg="bg-amber-100 dark:bg-amber-950/40" />
      </div>

      {units.length === 0 ? (
        <EmptyState
          title="No units enrolled"
          message="You are not currently enrolled in any units. Contact your academic advisor."
          icon={BookOpen}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {units.map((unit, i) => (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-3xl bg-card border border-border p-6 shadow-soft hover:shadow-premium transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="font-mono text-xs font-bold text-gold bg-gold/10 px-2 py-1 rounded">{unit.code}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{unit.credits} credits</span>
              </div>
              <h3 className="font-display font-bold text-lg leading-snug mb-2">{unit.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{unit.description}</p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5"><User className="h-3 w-3" /> {unit.instructor}</p>
                <p className="flex items-center gap-1.5"><BookOpen className="h-3 w-3" /> {unit.department}</p>
                <p className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {unit.semester}</p>
                <p className="flex items-center gap-1.5"><FileText className="h-3 w-3" /> {unit.assessmentCount} assessments · {unit.upcomingAssessments} upcoming</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
