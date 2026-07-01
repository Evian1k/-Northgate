"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, CheckCheck, BellOff, Megaphone, Clock } from "lucide-react";
import { StudentPageHeader, EmptyState } from "@/components/student/ui";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string; title: string; message: string; type: string;
  link: string | null; readAt: string | null; createdAt: string;
}

interface Announcement {
  id: string; title: string; content: string; category: string;
  author: string; publishedAt: string;
}

export function NotificationsClient({
  notifications, announcements,
}: {
  notifications: Notification[]; announcements: Announcement[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [tab, setTab] = React.useState<"notifications" | "announcements">("notifications");

  const markAllRead = async () => {
    const res = await fetch("/api/student/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    if (res.ok) {
      toast({ title: "All marked as read" });
      router.refresh();
    }
  };

  const markRead = async (id: string) => {
    await fetch("/api/student/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  };

  const unread = notifications.filter((n) => !n.readAt).length;

  return (
    <div>
      <StudentPageHeader
        title="Notifications"
        subtitle="Stay updated on your academic life"
        icon={Bell}
        actions={
          <Button onClick={markAllRead} variant="outline" size="sm" className="rounded-full">
            <CheckCheck className="h-3.5 w-3.5 mr-1.5" /> Mark all read
          </Button>
        }
      />

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("notifications")}
          className={`text-xs font-medium px-4 py-2 rounded-full transition-colors ${
            tab === "notifications" ? "gradient-royal text-white shadow-soft" : "bg-card border border-border text-foreground/70 hover:text-foreground"
          }`}
        >
          My Notifications {unread > 0 && `(${unread})`}
        </button>
        <button
          onClick={() => setTab("announcements")}
          className={`text-xs font-medium px-4 py-2 rounded-full transition-colors ${
            tab === "announcements" ? "gradient-royal text-white shadow-soft" : "bg-card border border-border text-foreground/70 hover:text-foreground"
          }`}
        >
          Announcements ({announcements.length})
        </button>
      </div>

      {tab === "notifications" ? (
        notifications.length === 0 ? (
          <EmptyState title="No notifications" message="You're all caught up!" icon={BellOff} />
        ) : (
          <div className="space-y-2">
            {notifications.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                onClick={() => !n.readAt && markRead(n.id)}
                className={`rounded-2xl bg-card border p-4 shadow-soft cursor-pointer transition-all hover:shadow-premium ${
                  n.readAt ? "border-border opacity-70" : "border-royal/30 bg-royal/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`grid place-items-center h-9 w-9 rounded-xl flex-shrink-0 ${
                    n.type === "SUCCESS" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40"
                    : n.type === "WARNING" ? "bg-amber-100 text-amber-600 dark:bg-amber-950/40"
                    : n.type === "ERROR" ? "bg-red-100 text-red-600 dark:bg-red-950/40"
                    : n.type === "ACADEMIC" ? "bg-purple-100 text-purple-600 dark:bg-purple-950/40"
                    : n.type === "FINANCE" ? "bg-orange-100 text-orange-600 dark:bg-orange-950/40"
                    : "bg-blue-100 text-blue-600 dark:bg-blue-950/40"
                  }`}>
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm">{n.title}</p>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 flex-shrink-0">
                        <Clock className="h-2.5 w-2.5" /> {timeAgo(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                  </div>
                  {!n.readAt && <span className="h-2 w-2 rounded-full bg-royal flex-shrink-0 mt-1" />}
                </div>
              </motion.div>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-3">
          {announcements.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="rounded-2xl bg-card border border-border p-5 shadow-soft"
            >
              <div className="flex items-start gap-3">
                <div className="grid place-items-center h-10 w-10 rounded-xl bg-gold/10 flex-shrink-0">
                  <Megaphone className="h-5 w-5 text-gold" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-widest text-gold font-bold bg-gold/10 px-2 py-0.5 rounded">{a.category}</span>
                    <span className="text-xs text-muted-foreground">{new Date(a.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-display font-bold text-base">{a.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{a.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">— {a.author}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
