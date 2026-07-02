"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2, User, Mail, Phone, BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Programme { id: string; code: string; title: string; department: string; qualification: string; duration: string }

export default function ApplicationFormPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [programmes, setProgrammes] = React.useState<Programme[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    firstName: "", lastName: "", email: "", phone: "",
    programmeId: "", intake: "September 2026", qualification: "", notes: "",
  });

  React.useEffect(() => {
    fetch("/api/programmes")
      .then((r) => r.json())
      .then((d) => setProgrammes(d.data || []))
      .catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(data.data.reference);
        toast({ title: "Application submitted!", description: `Your reference is ${data.data.reference}` });
      } else {
        toast({ title: "Submission failed", description: data.error || "Try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", description: "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-navy via-royal-deep to-navy relative overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-royal/40 blur-3xl animate-float-slow" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gold/20 blur-3xl animate-float-slow" />
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative glass rounded-[2rem] shadow-premium p-8 sm:p-10 max-w-lg w-full text-center"
        >
          <div className="grid place-items-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 mx-auto mb-5">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="font-display font-bold text-2xl mb-2">Application Received!</h1>
          <p className="text-sm text-muted-foreground mb-5">
            Thank you for applying to Northgate. We&apos;ve received your application and will contact you within 5 business days.
          </p>
          <div className="rounded-2xl bg-muted p-4 mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Your Reference</p>
            <p className="font-mono text-xl font-bold text-royal">{submitted}</p>
          </div>
          <Button onClick={() => router.push("/")} className="w-full rounded-full gradient-royal text-white">
            Return to Homepage <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to website
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl shadow-premium border border-border p-6 sm:p-10"
        >
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/10 text-gold px-3 py-1 text-xs font-semibold uppercase tracking-widest mb-3">
              Admissions Open
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">Apply to Northgate</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Fill in the form below to submit your application. Our admissions team will respond within 5 business days.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-widest mb-1.5 block">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="pl-10 h-11" placeholder="John" />
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-widest mb-1.5 block">Last Name</Label>
                <Input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="h-11" placeholder="Doe" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-widest mb-1.5 block">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="pl-10 h-11" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-widest mb-1.5 block">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="pl-10 h-11" placeholder="+254 700 000 000" />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold uppercase tracking-widest mb-1.5 block">Programme of Interest</Label>
              <Select value={form.programmeId} onValueChange={(v) => {
                const p = programmes.find((p) => p.id === v);
                setForm({ ...form, programmeId: v, qualification: p?.qualification || "" });
              }}>
                <SelectTrigger className="h-11">
                  <BookOpen className="h-4 w-4 text-muted-foreground mr-2" />
                  <SelectValue placeholder="Select a programme" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {programmes.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      <span className="font-mono text-xs text-gold mr-2">{p.code}</span>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-widest mb-1.5 block">Intake</Label>
                <Select value={form.intake} onValueChange={(v) => setForm({ ...form, intake: v })}>
                  <SelectTrigger className="h-11">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="September 2026">September 2026</SelectItem>
                    <SelectItem value="January 2027">January 2027</SelectItem>
                    <SelectItem value="May 2027">May 2027</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-widest mb-1.5 block">Current Qualification</Label>
                <Input value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} className="h-11" placeholder="KCSE, Diploma, etc." />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold uppercase tracking-widest mb-1.5 block">Additional Notes (optional)</Label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={4}
                placeholder="Anything else you'd like us to know?"
                className="w-full rounded-xl bg-background border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <Button type="submit" disabled={loading || !form.programmeId} className="w-full h-12 rounded-xl gradient-royal text-white font-semibold shadow-premium hover:shadow-gold transition-shadow">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting…</> : <>Submit Application <ArrowRight className="h-4 w-4 ml-2" /></>}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
