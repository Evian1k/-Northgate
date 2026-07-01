"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  UserCircle, Lock, Mail, ArrowRight, Loader2, AlertCircle,
  GraduationCap, BookOpen, FileText, Calendar, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const features: { icon: LucideIcon; label: string; desc: string }[] = [
  { icon: GraduationCap, label: "Grades & Transcripts", desc: "View results and download transcripts" },
  { icon: BookOpen, label: "E-Learning", desc: "Access course materials and assignments" },
  { icon: FileText, label: "Fee Statements", desc: "Track payments and outstanding balances" },
  { icon: Calendar, label: "Timetable", desc: "Check your class schedule and exams" },
];

export default function PortalPage() {
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Welcome back!", description: "Redirecting to your dashboard…" });
        setTimeout(() => window.location.href = "/admin", 1000);
      } else {
        toast({ title: "Login failed", description: data.error || "Invalid credentials", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", description: "Please try again", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-navy via-royal-deep to-navy">
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-royal/40 blur-3xl animate-float-slow" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gold/20 blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />
      <div className="absolute inset-0 bg-grid opacity-10" />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Left: Features */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col justify-center text-white p-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-xs font-semibold text-gold uppercase tracking-widest w-fit mb-5">
            Student Portal
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight leading-[1.1]">
            Your Northgate,<br /><span className="text-gradient-gold">all in one place.</span>
          </h1>
          <p className="mt-4 text-white/70 max-w-md">
            Access your grades, course materials, fee statements, and timetable — anywhere, anytime.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {features.map((f) => (
              <div key={f.label} className="rounded-2xl glass-dark p-4">
                <f.icon className="h-5 w-5 text-gold mb-2" />
                <p className="font-semibold text-sm">{f.label}</p>
                <p className="text-xs text-white/60 mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Login form */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-[2rem] shadow-premium p-8 sm:p-10 border border-white/40"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="relative h-12 w-12 rounded-2xl gradient-royal grid place-items-center shadow-premium">
              <UserCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl">Sign In</h2>
              <p className="text-xs text-muted-foreground">Access your student account</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                Email or Admission No.
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@northgate.ac.ke"
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
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 h-12 rounded-xl bg-background/60"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                <input type="checkbox" className="rounded border-border" /> Remember me
              </label>
              <Link href="#" className="text-royal hover:underline font-medium">Forgot password?</Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl gradient-royal text-white font-semibold shadow-premium hover:shadow-gold transition-shadow"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Signing in…</> : <>Sign In <ArrowRight className="h-4 w-4 ml-2" /></>}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/apply" className="text-royal hover:underline font-semibold">Apply now</Link>
            </p>
          </div>

          <div className="mt-4 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">Demo access:</p>
            <p>Use admin@northgate.ac.ke / Admin@2026</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
