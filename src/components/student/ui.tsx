"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export function StudentPageHeader({
  title,
  subtitle,
  icon: Icon,
  actions,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="grid place-items-center h-11 w-11 rounded-2xl gradient-royal text-white shadow-soft">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </motion.div>
  );
}

export function EmptyState({ title, message, icon: Icon }: { title: string; message: string; icon: LucideIcon }) {
  return (
    <div className="rounded-3xl bg-card border border-border p-12 text-center">
      <div className="grid place-items-center h-16 w-16 rounded-2xl bg-muted mx-auto mb-4">
        <Icon className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="font-display font-bold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">{message}</p>
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  color = "text-royal",
  bg = "bg-royal/10",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  bg?: string;
}) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
      <div className={`grid place-items-center h-10 w-10 rounded-xl mb-3 ${bg}`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <p className="font-display font-bold text-2xl text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5 font-medium uppercase tracking-wide">{label}</p>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PUBLISHED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    RELEASED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    GRADED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    SUBMITTED: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    LATE: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
    OVERDUE: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
    ABSENT: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
    PRESENT: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    EXCUSED: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    ISSUED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    APPROVED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    PAID: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    PARTIAL: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    RETURNED: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    ENROLLED: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    NEW: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    READ: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    REPLIED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  };
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}
