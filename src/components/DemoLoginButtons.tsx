"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Zap, type LucideIcon } from "lucide-react";

export interface DemoAccount {
  account: string;
  label: string;
  email: string;
  role: string;
  description?: string;
  icon?: LucideIcon;
  color?: string;
}

export function DemoLoginButtons({
  accounts,
}: {
  accounts: DemoAccount[];
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const login = async (account: string, role: string) => {
    setLoading(account);
    setError(null);
    try {
      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account }),
      });

      const data = await res.json();

      if (res.ok && data.success !== false) {
        // Get redirect from data.data.redirectTo or data.redirectTo
        const redirect =
          data?.data?.redirectTo ||
          data?.redirectTo ||
          (role === "STUDENT" ? "/student/dashboard" : "/admin");

        // Use window.location for a hard navigation (more reliable than router.push)
        setTimeout(() => { window.location.href = redirect; }, 100);
      } else {
        setError(data?.error || data?.data?.error || `Login failed (HTTP ${res.status})`);
        setLoading(null);
      }
    } catch (e: any) {
      setError(e?.message || "Network error. Please try again.");
      setLoading(null);
    }
  };

  return (
    <div className="space-y-2">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 px-3 py-2 text-xs text-red-700 dark:text-red-300"
        >
          {error}
        </motion.div>
      )}
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2 flex items-center gap-1.5">
        <Zap className="h-3 w-3 text-gold" /> One-Click Demo Login
      </p>
      <div className="space-y-1.5">
        {accounts.map((acc) => {
          const isLoading = loading === acc.account;
          return (
            <motion.button
              key={acc.account}
              onClick={() => login(acc.account, acc.role)}
              disabled={loading !== null}
              whileHover={{ scale: loading === null ? 1.01 : 1 }}
              whileTap={{ scale: 0.99 }}
              className="group w-full flex items-center gap-3 rounded-xl bg-card border border-border px-3 py-2.5 text-left hover:border-royal/40 hover:shadow-soft transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className={`grid place-items-center h-8 w-8 rounded-lg flex-shrink-0 ${acc.color || "bg-royal/10"}`}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-royal" />
                ) : acc.icon ? (
                  <acc.icon className={`h-4 w-4 ${acc.color ? "text-white" : "text-royal"}`} />
                ) : (
                  <span className="text-xs font-bold text-royal">
                    {acc.email[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{acc.label}</p>
                <p className="text-[10px] text-muted-foreground truncate">{acc.email}</p>
              </div>
              {acc.description && (
                <span className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground flex-shrink-0">
                  {acc.description}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
