"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Settings, Sun, Moon, Bell, Globe, Lock, Palette, Type, LogOut, Loader2 } from "lucide-react";
import { StudentPageHeader } from "@/components/student/ui";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const logout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/student/login");
  };

  return (
    <div>
      <StudentPageHeader title="Settings" subtitle="Customize your experience" icon={Settings} />

      <div className="space-y-4 max-w-2xl">
        {/* Appearance */}
        <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
          <h3 className="font-display font-bold text-base mb-4 flex items-center gap-2">
            <Palette className="h-4 w-4 text-gold" /> Appearance
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="grid place-items-center h-9 w-9 rounded-xl bg-card">
                  {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-semibold">Theme</p>
                  <p className="text-xs text-muted-foreground">Toggle between light and dark mode</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative h-7 w-12 rounded-full transition-colors ${theme === "dark" ? "bg-royal" : "bg-muted"}`}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${theme === "dark" ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="grid place-items-center h-9 w-9 rounded-xl bg-card">
                  <Type className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Font Size</p>
                  <p className="text-xs text-muted-foreground">Adjust text size for readability</p>
                </div>
              </div>
              <select className="h-9 rounded-lg bg-card border border-border px-2 text-sm">
                <option>Default</option>
                <option>Large</option>
                <option>Extra Large</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
          <h3 className="font-display font-bold text-base mb-4 flex items-center gap-2">
            <Bell className="h-4 w-4 text-gold" /> Notifications
          </h3>
          <div className="space-y-3">
            {[
              { label: "Academic alerts", desc: "Results, assessments, attendance" },
              { label: "Finance reminders", desc: "Fee due dates, payment confirmations" },
              { label: "Announcements", desc: "Institution-wide notices" },
              { label: "Email notifications", desc: "Receive copies via email" },
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-muted/50">
                <div>
                  <p className="text-sm font-semibold">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <button
                  onClick={() => toast({ title: "Setting saved", description: `${n.label} toggled` })}
                  className="relative h-7 w-12 rounded-full bg-royal"
                >
                  <span className="absolute top-1 h-5 w-5 rounded-full bg-white translate-x-6 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
          <h3 className="font-display font-bold text-base mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4 text-gold" /> Language
          </h3>
          <select className="w-full h-11 rounded-xl bg-muted border border-border px-3 text-sm">
            <option>English</option>
            <option>Swahili</option>
            <option>French</option>
          </select>
        </div>

        {/* Security */}
        <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
          <h3 className="font-display font-bold text-base mb-4 flex items-center gap-2">
            <Lock className="h-4 w-4 text-gold" /> Security
          </h3>
          <div className="space-y-2">
            <button onClick={() => toast({ title: "Coming soon", description: "Password change form" })} className="w-full text-left p-3 rounded-2xl bg-muted/50 hover:bg-muted transition-colors">
              <p className="text-sm font-semibold">Change Password</p>
              <p className="text-xs text-muted-foreground">Update your account password</p>
            </button>
            <button onClick={() => toast({ title: "Coming soon", description: "2FA setup" })} className="w-full text-left p-3 rounded-2xl bg-muted/50 hover:bg-muted transition-colors">
              <p className="text-sm font-semibold">Enable Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
            </button>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={logout}
          disabled={loading}
          className="w-full rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-5 text-left hover:bg-red-100 dark:hover:bg-red-950/60 transition-colors flex items-center gap-3"
        >
          {loading ? <Loader2 className="h-5 w-5 text-red-600 animate-spin" /> : <LogOut className="h-5 w-5 text-red-600" />}
          <div>
            <p className="font-semibold text-red-600">Sign out</p>
            <p className="text-xs text-red-500/70">End your session on this device</p>
          </div>
        </button>
      </div>
    </div>
  );
}
