"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ArrowRight, X, LayoutDashboard, BookOpen, FileText, ClipboardCheck,
  FileCheck2, FileCheck, CalendarCheck, GraduationCap, IdCard, Wallet,
  Receipt, CreditCard, Library, Download, Building2, Bell, MessageSquare,
  CalendarDays, LifeBuoy, User, Settings, type LucideIcon,
} from "lucide-react";

interface Command {
  label: string;
  href: string;
  icon: LucideIcon;
  category: string;
}

const commands: Command[] = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard, category: "Overview" },
  { label: "My Units", href: "/student/my-units", icon: BookOpen, category: "Academics" },
  { label: "Assessments", href: "/student/assessments", icon: FileText, category: "Academics" },
  { label: "Assignments", href: "/student/assignments", icon: ClipboardCheck, category: "Academics" },
  { label: "POE Requests", href: "/student/poe-requests", icon: FileCheck2, category: "Academics" },
  { label: "POE Submissions", href: "/student/poe-submissions", icon: FileCheck, category: "Academics" },
  { label: "Attendance", href: "/student/attendance", icon: CalendarCheck, category: "Academics" },
  { label: "Results", href: "/student/results", icon: GraduationCap, category: "Academics" },
  { label: "Exam Card", href: "/student/exam-card", icon: IdCard, category: "Academics" },
  { label: "Finance", href: "/student/finance", icon: Wallet, category: "Finance" },
  { label: "Fee Statements", href: "/student/fee-statements", icon: Receipt, category: "Finance" },
  { label: "Payments", href: "/student/payments", icon: CreditCard, category: "Finance" },
  { label: "Library", href: "/student/library", icon: Library, category: "Resources" },
  { label: "Downloads", href: "/student/downloads", icon: Download, category: "Resources" },
  { label: "Hostel", href: "/student/hostel", icon: Building2, category: "Resources" },
  { label: "Student ID", href: "/student/student-id", icon: IdCard, category: "Resources" },
  { label: "Notifications", href: "/student/notifications", icon: Bell, category: "Communication" },
  { label: "Messages", href: "/student/messages", icon: MessageSquare, category: "Communication" },
  { label: "Calendar", href: "/student/calendar", icon: CalendarDays, category: "Communication" },
  { label: "Support", href: "/student/support", icon: LifeBuoy, category: "Communication" },
  { label: "Profile", href: "/student/profile", icon: User, category: "Account" },
  { label: "Settings", href: "/student/settings", icon: Settings, category: "Account" },
];

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = React.useMemo(() => {
    if (!query) return commands;
    const q = query.toLowerCase();
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
  }, [query]);

  const grouped = React.useMemo(() => {
    const map: Record<string, Command[]> = {};
    for (const c of filtered) {
      if (!map[c.category]) map[c.category] = [];
      map[c.category].push(c);
    }
    return map;
  }, [filtered]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((p) => Math.min(p + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((p) => Math.max(p - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[active];
      if (cmd) {
        router.push(cmd.href);
        onClose();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-start justify-center pt-24 px-4"
        >
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl glass rounded-3xl shadow-premium overflow-hidden border border-border"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                onKeyDown={onKey}
                placeholder="Search pages and actions…"
                className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground"
              />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground">ESC</kbd>
            </div>

            <div className="max-h-80 overflow-y-auto scroll-premium p-2">
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No results found.</p>
              ) : (
                Object.entries(grouped).map(([category, items]) => (
                  <div key={category} className="mb-2">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold px-3 py-1.5">{category}</p>
                    {items.map((cmd) => {
                      const idx = filtered.indexOf(cmd);
                      return (
                        <button
                          key={cmd.href}
                          onClick={() => { router.push(cmd.href); onClose(); }}
                          onMouseEnter={() => setActive(idx)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
                            idx === active ? "bg-royal text-white" : "hover:bg-muted text-foreground"
                          }`}
                        >
                          <cmd.icon className={`h-4 w-4 ${idx === active ? "text-white" : "text-muted-foreground"}`} />
                          <span className="flex-1 text-left">{cmd.label}</span>
                          {idx === active && <ArrowRight className="h-3 w-3" />}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            <div className="px-4 py-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
              <span>↑↓ Navigate · ↵ Select · ESC Close</span>
              <span>{filtered.length} results</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
