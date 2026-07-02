"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Building2, BookOpen, Newspaper, CalendarDays, MessageSquare,
  Image as ImageIcon, Handshake, FileText, Users, ScrollText, Settings, LogOut, Menu, X,
  Bell, Search, ChevronDown, Sun, Moon, Mail, type LucideIcon,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Analytics", href: "/admin/analytics", icon: ScrollText },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Departments", href: "/admin/departments", icon: Building2 },
      { label: "Programmes", href: "/admin/programmes", icon: BookOpen },
      { label: "News", href: "/admin/news", icon: Newspaper },
      { label: "Events", href: "/admin/events", icon: CalendarDays },
      { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
      { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
      { label: "Partners", href: "/admin/partners", icon: Handshake },
    ],
  },
  {
    title: "Engagement",
    items: [
      { label: "Applications", href: "/admin/applications", icon: FileText },
      { label: "Messages", href: "/admin/messages", icon: Mail },
      { label: "Subscribers", href: "/admin/subscribers", icon: Users },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminShell({ children, user }: { children: React.ReactNode; user: { name: string; email: string; role: string } | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
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

      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-72 glass-nav border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-16 flex items-center justify-between px-5 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 rounded-xl gradient-royal grid place-items-center shadow-soft">
              <span className="font-display font-bold text-white">N</span>
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full gradient-gold ring-2 ring-background" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-bold text-sm">Northgate</span>
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Admin CMS</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden grid place-items-center h-8 w-8 rounded-full hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="overflow-y-auto scroll-premium h-[calc(100vh-4rem-5rem)] py-4 px-3">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-5">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold px-3 mb-1.5">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? "gradient-royal text-white shadow-soft"
                          : "text-foreground/70 hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <item.icon className={`h-4 w-4 ${active ? "text-white" : "text-muted-foreground group-hover:text-foreground"}`} />
                      <span className="flex-1">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="absolute bottom-0 inset-x-0 p-3 border-t border-border bg-background/60">
          <div className="flex items-center gap-3 p-2">
            <div className="h-9 w-9 rounded-full gradient-royal grid place-items-center text-white font-semibold text-sm">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <button onClick={logout} className="grid place-items-center h-8 w-8 rounded-full hover:bg-muted text-muted-foreground hover:text-red-500" aria-label="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 h-16 glass-nav border-b border-border flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden grid place-items-center h-10 w-10 rounded-full hover:bg-muted">
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
              <span>Search…</span>
              <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="grid place-items-center h-10 w-10 rounded-full hover:bg-muted text-muted-foreground" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative grid place-items-center h-10 w-10 rounded-full hover:bg-muted text-muted-foreground" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-2 w-80 rounded-2xl glass shadow-premium p-3 z-50"
                  >
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2 px-2">Notifications</p>
                    <div className="space-y-1">
                      <Link href="/admin/applications" className="block p-2 rounded-xl hover:bg-muted">
                        <p className="text-sm font-medium">New application received</p>
                        <p className="text-xs text-muted-foreground">2 min ago</p>
                      </Link>
                      <Link href="/admin/messages" className="block p-2 rounded-xl hover:bg-muted">
                        <p className="text-sm font-medium">New contact message</p>
                        <p className="text-xs text-muted-foreground">1 hour ago</p>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-muted">
                <div className="h-8 w-8 rounded-full gradient-royal grid place-items-center text-white font-semibold text-sm">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-2 w-64 rounded-2xl glass shadow-premium p-2 z-50"
                  >
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <p className="font-semibold text-sm">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase tracking-widest font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full">{user?.role}</span>
                    </div>
                    <Link href="/admin/settings" className="block px-3 py-2 rounded-xl text-sm hover:bg-muted">Settings</Link>
                    <Link href="/" className="block px-3 py-2 rounded-xl text-sm hover:bg-muted">View website</Link>
                    <button onClick={logout} className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-muted text-red-600">Sign out</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
