"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, GraduationCap, BookOpen, FileText, Calendar, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DemoLoginButtons } from "@/components/DemoLoginButtons";

const features: { icon: LucideIcon; label: string; desc: string }[] = [
  { icon: GraduationCap, label: "Grades & Transcripts", desc: "View results and download transcripts" },
  { icon: BookOpen, label: "E-Learning", desc: "Access course materials and assignments" },
  { icon: FileText, label: "Fee Statements", desc: "Track payments and outstanding balances" },
  { icon: Calendar, label: "Timetable", desc: "Check your class schedule and exams" },
];

export default function StudentLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <StudentLoginInner />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-navy via-royal-deep to-navy">
      <div className="h-10 w-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
    </div>
  );
}

function StudentLoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/student/dashboard";
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
            Your academic life,<br /><span className="text-gradient-gold">all in one place.</span>
          </h1>
          <p className="mt-4 text-white/70 max-w-md">
            Grades, attendance, fees, library, hostel — everything you need, beautifully organized.
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
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl">Student Sign In</h2>
              <p className="text-xs text-muted-foreground">Access your dashboard</p>
            </div>
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
                Email or Admission No.
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@northgate.ac.ke"
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
                <input type="checkbox" className="rounded border-border" /> Remember me
              </label>
              <Link href="#" className="text-royal hover:underline font-medium">Forgot password?</Link>
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
            <div className="rounded-xl bg-muted/60 p-4">
              <DemoLoginButtons
                accounts={[
                  { account: "student1", label: "Alex Mwangi", email: "student@northgate.ac.ke", role: "STUDENT", description: "Engineering · GPA 3.65", color: "bg-royal" },
                  { account: "student2", label: "Mary Wanjiru", email: "mary.student@northgate.ac.ke", role: "STUDENT", description: "ICT · GPA 3.85", color: "bg-emerald-500" },
                  { account: "student3", label: "Brian Otieno", email: "brian.student@northgate.ac.ke", role: "STUDENT", description: "Business · GPA 3.20", color: "bg-blue-500" },
                  { account: "student4", label: "Grace Achieng", email: "grace.student@northgate.ac.ke", role: "STUDENT", description: "Nursing · GPA 3.95 ★", color: "bg-gold" },
                  { account: "student5", label: "David Kiprop", email: "david.student@northgate.ac.ke", role: "STUDENT", description: "Agribusiness · GPA 2.10 ⚠", color: "bg-red-500" },
                  { account: "student6", label: "Faith Njoroge", email: "faith.student@northgate.ac.ke", role: "STUDENT", description: "Culinary · Graduating", color: "bg-purple-500" },
                ]}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
