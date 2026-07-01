"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users, BookOpen, Newspaper, CalendarDays, FileText, Mail,
  Building2, MessageSquare, Image as ImageIcon, Handshake,
  TrendingUp, ArrowUpRight, Clock, Activity, type LucideIcon,
} from "lucide-react";

interface Counts {
  students: number; programmes: number; news: number; events: number;
  applications: number; pendingApplications: number;
  contactMessages: number; newMessages: number;
  subscribers: number; departments: number; testimonials: number;
  partners: number; gallery: number;
}

interface ActivityItem {
  id: string; action: string; resource: string; createdAt: string; user: string;
}

interface ApplicationItem {
  id: string; reference: string; firstName: string; lastName: string;
  email: string; status: string; createdAt: string; programme: string;
}

interface MessageItem {
  id: string; name: string; email: string; subject: string; status: string; createdAt: string;
}

interface TrendItem { date: string; count: number }

const statCards: { key: keyof Counts; label: string; icon: LucideIcon; href: string; accent?: boolean; suffix?: string }[] = [
  { key: "students", label: "Students", icon: Users, href: "/admin", accent: true },
  { key: "programmes", label: "Programmes", icon: BookOpen, href: "/admin/programmes" },
  { key: "applications", label: "Applications", icon: FileText, href: "/admin/applications", accent: true },
  { key: "pendingApplications", label: "Pending Apps", icon: FileText, href: "/admin/applications" },
  { key: "news", label: "News Articles", icon: Newspaper, href: "/admin/news" },
  { key: "events", label: "Events", icon: CalendarDays, href: "/admin/events" },
  { key: "contactMessages", label: "Messages", icon: Mail, href: "/admin/messages" },
  { key: "newMessages", label: "New Messages", icon: Mail, href: "/admin/messages" },
  { key: "subscribers", label: "Subscribers", icon: Users, href: "/admin/subscribers" },
  { key: "departments", label: "Departments", icon: Building2, href: "/admin/departments" },
  { key: "testimonials", label: "Testimonials", icon: MessageSquare, href: "/admin/testimonials" },
  { key: "gallery", label: "Gallery", icon: ImageIcon, href: "/admin/gallery" },
];

export function DashboardClient({
  counts, recentActivity, recentApplications, recentMessages, trend,
}: {
  counts: Counts;
  recentActivity: ActivityItem[];
  recentApplications: ApplicationItem[];
  recentMessages: MessageItem[];
  trend: TrendItem[];
}) {
  const maxTrend = Math.max(...trend.map((t) => t.count), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back. Here&apos;s what&apos;s happening at Northgate.</p>
        </div>
        <Link
          href="/apply"
          className="inline-flex items-center gap-2 rounded-full gradient-royal text-white px-4 py-2.5 text-sm font-semibold shadow-soft hover:shadow-premium transition-shadow"
        >
          New Application <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
        {statCards.map((s, i) => {
          const value = counts[s.key];
          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <Link
                href={s.href}
                className={`group block rounded-2xl p-5 shadow-soft hover:shadow-premium hover:-translate-y-1 transition-all ${
                  s.accent ? "gradient-royal text-white" : "bg-card border border-border"
                }`}
              >
                <div className={`grid place-items-center h-10 w-10 rounded-xl mb-3 ${s.accent ? "bg-white/15" : "bg-muted"}`}>
                  <s.icon className={`h-5 w-5 ${s.accent ? "text-white" : "text-royal"}`} />
                </div>
                <p className={`font-display font-bold text-2xl ${s.accent ? "text-white" : "text-foreground"}`}>
                  {value.toLocaleString()}
                </p>
                <p className={`text-xs mt-0.5 ${s.accent ? "text-white/75" : "text-muted-foreground"}`}>{s.label}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Trend + activity grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Applications trend */}
        <div className="lg:col-span-2 rounded-3xl bg-card border border-border p-6 shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-bold text-lg">Applications Trend</h2>
              <p className="text-xs text-muted-foreground">Last 14 days</p>
            </div>
            <TrendingUp className="h-5 w-5 text-gold" />
          </div>
          <div className="h-48 flex items-end gap-1.5">
            {trend.map((t, i) => (
              <div key={t.date} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full relative flex items-end" style={{ height: "160px" }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(t.count / maxTrend) * 100}%` }}
                    transition={{ duration: 0.5, delay: i * 0.04 }}
                    className="w-full gradient-royal rounded-t-md group-hover:gradient-gold transition-all relative"
                  >
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      {t.count}
                    </span>
                  </motion.div>
                </div>
                <span className="text-[9px] text-muted-foreground">{t.date.slice(-2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg">Activity</h2>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto scroll-premium">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
            ) : (
              recentActivity.map((a) => (
                <div key={a.id} className="flex items-start gap-3 text-sm">
                  <div className="grid place-items-center h-8 w-8 rounded-full bg-muted flex-shrink-0">
                    <span className="text-[10px] font-bold text-royal">{a.action[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{a.action.replace(/_/g, " ").toLowerCase()}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {a.user} · {a.resource}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {timeAgo(a.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent applications + messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg">Recent Applications</h2>
            <Link href="/admin/applications" className="text-xs text-royal hover:underline font-medium">View all →</Link>
          </div>
          <div className="space-y-2">
            {recentApplications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No applications yet</p>
            ) : (
              recentApplications.map((a) => (
                <Link
                  key={a.id}
                  href={`/admin/applications/${a.id}`}
                  className="block rounded-xl p-3 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{a.firstName} {a.lastName}</p>
                      <p className="text-xs text-muted-foreground truncate">{a.programme}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <StatusBadge status={a.status} />
                      <span className="text-[10px] text-muted-foreground">{timeAgo(a.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg">Recent Messages</h2>
            <Link href="/admin/messages" className="text-xs text-royal hover:underline font-medium">View all →</Link>
          </div>
          <div className="space-y-2">
            {recentMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No messages yet</p>
            ) : (
              recentMessages.map((m) => (
                <div key={m.id} className="rounded-xl p-3 hover:bg-muted transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{m.subject}</p>
                      <p className="text-xs text-muted-foreground truncate">{m.name} · {m.email}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <StatusBadge status={m.status} />
                      <span className="text-[10px] text-muted-foreground">{timeAgo(m.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    NEW: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    REVIEWING: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
    ACCEPTED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    REJECTED: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
    ENROLLED: "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300",
    READ: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    REPLIED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    ARCHIVED: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
