"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/admin";
  const forbidden = params.get("error") === "forbidden";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPwd, setShowPwd] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(forbidden ? "You don't have permission to access that page." : null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.push(redirect);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-navy via-royal-deep to-navy">
      {/* Floating orbs */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-royal/40 blur-3xl animate-float-slow" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gold/20 blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />
      <div className="absolute inset-0 bg-grid opacity-10" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Glass card */}
        <div className="glass rounded-[2rem] shadow-premium p-8 sm:p-10 border border-white/40">
          {/* Logo */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative h-14 w-14 rounded-2xl gradient-royal grid place-items-center shadow-premium mb-4">
              <span className="font-display font-bold text-white text-2xl">N</span>
              <span className="absolute -right-1.5 -top-1.5 h-4 w-4 rounded-full gradient-gold ring-2 ring-white" />
            </div>
            <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">Admin Portal</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to manage Northgate&apos;s content</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 px-4 py-3 text-sm text-red-700 dark:text-red-300"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@northgate.ac.ke"
                  className="pl-10 h-12 rounded-xl bg-background/60"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPwd ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12 rounded-xl bg-background/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                Remember me
              </label>
              <Link href="#" className="text-royal hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl gradient-royal text-white font-semibold shadow-premium hover:shadow-gold transition-shadow disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Signing in…</>
              ) : (
                <>Sign In <ArrowRight className="h-4 w-4 ml-2" /></>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="rounded-xl bg-muted/60 p-4 text-xs text-muted-foreground">
              <p className="flex items-center gap-1.5 font-semibold text-foreground mb-1">
                <Shield className="h-3.5 w-3.5 text-gold" /> Demo Credentials
              </p>
              <p>Admin: <code className="font-mono">admin@northgate.ac.ke</code> / <code className="font-mono">Admin@2026</code></p>
              <p>Editor: <code className="font-mono">editor@northgate.ac.ke</code> / <code className="font-mono">Editor@2026</code></p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-white/60 mt-6">
          <Link href="/" className="hover:text-white transition-colors">← Back to website</Link>
        </p>
      </motion.div>
    </div>
  );
}
