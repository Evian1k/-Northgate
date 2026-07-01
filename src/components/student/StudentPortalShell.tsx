"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, FileText, ClipboardCheck, FileCheck2, FileCheck,
  CalendarCheck, GraduationCap, CreditCard, Receipt, Wallet, Library,
  Download, Building2, IdCard, Bell, MessageSquare, CalendarDays,
  LifeBuoy, User, Settings, LogOut, Menu, X, Search, ChevronDown,
  Sun, Moon, type LucideIcon,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { CommandPalette } from "./CommandPalette";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Academics",
    items: [
      { label: "My Units", href: "/student/my-units", icon: BookOpen },
      { label: "Assessments", href: "/student/assessments", icon: FileText },
      { label: "Assignments", href: "/student/assignments", icon: ClipboardCheck },
      { label: "POE Requests", href: "/student/poe-requests", icon: FileCheck2 },
      { label: "POE Submissions", href: "/student/poe-submissions", icon: FileCheck },
      { label: "Attendance", href: "/student/attendance", icon: CalendarCheck },
      { label: "Results", href: "/student/results", icon: GraduationCap },
      { label: "Exam Card", href: "/student/exam-card", icon: IdCard },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Finance", href: "/student/finance", icon: Wallet },
      { label: "Fee Statements", href: "/student/fee-statements", icon: Receipt },
      { label: "Payments", href: "/student/payments", icon: CreditCard },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Library", href: "/student/library", icon: Library },
      { label: "Downloads", href: "/student/downloads", icon: Download },
      { label: "Hostel", href: "/student/hostel", icon: Building2 },
      { label: "Student ID", href: "/student/student-id", icon: IdCard },
    ],
  },
  {
    title: "Communication",
    items: [
      { label: "Notifications", href: "/student/notifications", icon: Bell },
      { label: "Messages", href: "/student/messages", icon: MessageSquare },
      { label: "Calendar", href: "/student/calendar", icon: CalendarDays },
      { label: "Support", href: "/student/support", icon: LifeBuoy },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", href: "/student/profile", icon: User },
      { label: "Settings", href: "/student/settings", icon: Settings },
    ],
  },
];

export function StudentPortalShell({
  children,
  student,
  unreadCount = 0,
}: {
  children: React.ReactNode;
  student: { name: string; email: string; admissionNo: string; programme: string; profileImageUrl?: string | null } | null;
  unreadCount?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [notifs, setNotifs] = React.useState<any[]>([]);

  // Cmd+K shortcut
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Fetch notifications
  React.useEffect(() => {
    fetch("/api/student/notifications?unread=true&limit=5")
      .then((r) => r.json())
      .then((d) => setNotifs(d.data || []))
      .catch(() => {});
  }, [pathname]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/student/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-navy/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`fixed top-0 left-0 bottom-0 z-50 glass-nav border-r border-border transform transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} ${collapsed ? "w-20" : "w-72"}`}>
        <div className="h-16 flex items-center justify-between px-5 border-b border-border">
          <Link href="/student/dashboard" className="flex items-center gap-2.5 group">
            <div className="relative h-9 w-9 rounded-xl gradient-royal grid place-items-center shadow-soft group-hover:scale-105 transition-transform flex-shrink-0">
              <span className="font-display font-bold text-white">N</span>
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full gradient-gold ring-2 ring-background" />
            </div>
            {!collapsed && (
              <div className="flex flex-col leading-tight">
                <span className="font-display font-bold text-sm">Northgate</span>
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Student Portal</span>
              </div>
            )}
          </Link>
          {!collapsed && (
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden grid place-items-center h-8 w-8 rounded-full hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 z-10 grid place-items-center h-6 w-6 rounded-full bg-card border border-border shadow-soft hover:scale-110 transition-transform"
          aria-label="Toggle sidebar"
        >
          <ChevronDown className={`h-3 w-3 transition-transform ${collapsed ? "rotate-90" : "-rotate-90"}`} />
        </button>

        <nav className="overflow-y-auto scroll-premium h-[calc(100vh-4rem-5rem)] py-4 px-3">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-4">
              {!collapsed && (
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold px-3 mb-1.5">
                  {group.title}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href || (item.href !== "/student/dashboard" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? "gradient-royal text-white shadow-soft"
                          : "text-foreground/70 hover:text-foreground hover:bg-muted"
                      } ${collapsed ? "justify-center" : ""}`}
                    >
                      <item.icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-white" : "text-muted-foreground group-hover:text-foreground"}`} />
                      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                      {!collapsed && item.href === "/student/notifications" && unreadCount > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${active ? "bg-white/20 text-white" : "bg-red-500 text-white"}`}>
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="absolute bottom-0 inset-x-0 p-3 border-t border-border bg-background/60">
          <div className="flex items-center gap-3 p-2">
            <div className="h-9 w-9 rounded-full gradient-royal grid place-items-center text-white font-semibold text-sm flex-shrink-0 overflow-hidden">
              {student?.profileImageUrl ? (
                <img src={student.profileImageUrl} alt={student.name} className="h-full w-full object-cover" />
              ) : (
                student?.name?.[0]?.toUpperCase() || "S"
              )}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{student?.name || "Student"}</p>
                <p className="text-xs text-muted-foreground truncate">{student?.admissionNo}</p>
              </div>
            )}
            <button onClick={logout} className="grid place-items-center h-8 w-8 rounded-full hover:bg-muted text-muted-foreground hover:text-red-500 flex-shrink-0" aria-label="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className={`transition-all duration-300 ${collapsed ? "lg:pl-20" : "lg:pl-72"}`}>
        <header className="sticky top-0 z-30 h-16 glass-nav border-b border-border flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden grid place-items-center h-10 w-10 rounded-full hover:bg-muted">
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground hover:bg-muted/70 transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search…</span>
              <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="grid place-items-center h-10 w-10 rounded-full hover:bg-muted text-muted-foreground" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative grid place-items-center h-10 w-10 rounded-full hover:bg-muted text-muted-foreground"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
                )}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-80 rounded-2xl glass shadow-premium p-3 z-50"
                    >
                      <div className="flex items-center justify-between mb-2 px-2">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Notifications</p>
                        <Link href="/student/notifications" onClick={() => setNotifOpen(false)} className="text-xs text-royal hover:underline">View all</Link>
                      </div>
                      <div className="space-y-1 max-h-80 overflow-y-auto scroll-premium">
                        {notifs.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-6">You&apos;re all caught up!</p>
                        ) : (
                          notifs.map((n) => (
                            <Link
                              key={n.id}
                              href={n.link || "/student/notifications"}
                              onClick={() => setNotifOpen(false)}
                              className="block p-2 rounded-xl hover:bg-muted transition-colors"
                            >
                              <p className="text-sm font-semibold">{n.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                            </Link>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-muted">
                <div className="h-8 w-8 rounded-full gradient-royal grid place-items-center text-white font-semibold text-sm overflow-hidden">
                  {student?.profileImageUrl ? (
                    <img src={student.profileImageUrl} alt={student.name} className="h-full w-full object-cover" />
                  ) : (
                    student?.name?.[0]?.toUpperCase() || "S"
                  )}
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-64 rounded-2xl glass shadow-premium p-2 z-50"
                    >
                      <div className="px-3 py-2 border-b border-border mb-1">
                        <p className="font-semibold text-sm">{student?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{student?.email}</p>
                        <p className="text-xs text-muted-foreground">{student?.admissionNo}</p>
                        <p className="text-[10px] text-gold mt-1 font-medium">{student?.programme}</p>
                      </div>
                      <Link href="/student/profile" className="block px-3 py-2 rounded-xl text-sm hover:bg-muted">My Profile</Link>
                      <Link href="/student/settings" className="block px-3 py-2 rounded-xl text-sm hover:bg-muted">Settings</Link>
                      <Link href="/" className="block px-3 py-2 rounded-xl text-sm hover:bg-muted">View Website</Link>
                      <button onClick={logout} className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-muted text-red-600">Sign out</button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-3 border-b border-border bg-background/40">
          <Breadcrumb pathname={pathname} />
        </div>

        <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>

      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

function Breadcrumb({ pathname }: { pathname: string }) {
  const segments = pathname.split("/").filter(Boolean);
  return (
    <nav className="flex items-center gap-2 text-xs text-muted-foreground">
      <Link href="/student/dashboard" className="hover:text-foreground">Portal</Link>
      {segments.slice(1).map((seg, i) => (
        <React.Fragment key={i}>
          <span className="opacity-50">/</span>
          <span className={i === segments.length - 2 ? "text-foreground font-medium capitalize" : "capitalize"}>
            {seg.replace(/-/g, " ")}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
}
