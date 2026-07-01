"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Clock, Award, MapPin,
  Wallet, Calendar, Briefcase, Compass, GraduationCap,
} from "lucide-react";
import { Reveal } from "@/components/anim";
import { Button } from "@/components/ui/button";

interface Programme {
  id: string; code: string; title: string; description: string;
  qualification: string; duration: string; durationMonths: number;
  mode: string; fee: number; currency: string; intake: string;
  requirements: string[]; careerPaths: string[]; imageUrl: string | null;
  department: { name: string; slug: string; tagline: string };
}

interface Related {
  id: string; title: string; slug: string; code: string;
  qualification: string; duration: string;
}

export function ProgrammeDetailClient({
  programme, related,
}: {
  programme: Programme; related: Related[];
}) {
  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <section className="relative gradient-navy overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-royal/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <Link href="/#courses" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to courses
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="font-mono text-xs font-bold text-gold bg-gold/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                {programme.code}
              </span>
              <Link
                href={`/departments/${programme.department.slug}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-white/80 hover:text-white bg-white/10 px-2.5 py-1 rounded-full transition-colors"
              >
                <MapPin className="h-3 w-3" /> {programme.department.name}
              </Link>
              <span className="text-xs font-medium text-white/80 bg-white/10 px-2.5 py-1 rounded-full">
                {programme.qualification}
              </span>
              <span className="text-xs font-medium text-white/80 bg-white/10 px-2.5 py-1 rounded-full">
                {programme.duration}
              </span>
            </div>

            <h1 className="font-display font-bold text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1]">
              {programme.title}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-white/75 max-w-3xl leading-relaxed">
              {programme.department.tagline} — a comprehensive programme designed to launch your career with hands-on mastery.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 rounded-full gradient-gold text-navy px-6 py-3.5 font-bold shadow-gold hover:scale-[1.03] transition-transform"
              >
                Apply Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#courses"
                className="inline-flex items-center gap-2 rounded-full glass-dark text-white px-6 py-3.5 font-semibold hover:bg-white/10 transition-all"
              >
                <Compass className="h-4 w-4" /> Explore other courses
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick facts */}
      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: Award, label: "Qualification", value: programme.qualification },
            { icon: Clock, label: "Duration", value: programme.duration },
            { icon: Calendar, label: "Intake", value: programme.intake },
            { icon: Wallet, label: "Tuition", value: `${programme.currency} ${programme.fee.toLocaleString()}/yr` },
          ].map((f, i) => (
            <Reveal key={f.label} delay={i * 0.05}>
              <div className="rounded-2xl bg-card border border-border p-5 shadow-soft h-full">
                <f.icon className="h-5 w-5 text-gold mb-2" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{f.label}</p>
                <p className="font-display font-bold text-foreground mt-1">{f.value}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Body */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Reveal>
              <h2 className="font-display font-bold text-2xl mb-3">Programme Overview</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {programme.description}
              </p>
            </Reveal>

            {programme.requirements.length > 0 && (
              <Reveal delay={0.1}>
                <h2 className="font-display font-bold text-2xl mb-3">Entry Requirements</h2>
                <ul className="space-y-2">
                  {programme.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-royal flex-shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {programme.careerPaths.length > 0 && (
              <Reveal delay={0.2}>
                <h2 className="font-display font-bold text-2xl mb-3">Career Paths</h2>
                <div className="flex flex-wrap gap-2">
                  {programme.careerPaths.map((c, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm font-medium">
                      <Briefcase className="h-3.5 w-3.5 text-gold" /> {c}
                    </span>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <Reveal delay={0.15}>
              <div className="rounded-3xl gradient-royal p-6 shadow-premium text-white sticky top-24">
                <h3 className="font-display font-bold text-xl mb-1">Apply Now</h3>
                <p className="text-white/75 text-sm mb-5">
                  {programme.intake} intake is open. Limited slots available.
                </p>
                <Link
                  href="/apply"
                  className="block w-full text-center rounded-full gradient-gold text-navy font-bold py-3 hover:scale-[1.02] transition-transform"
                >
                  Start Application
                </Link>
                <div className="mt-5 pt-5 border-t border-white/15 space-y-2 text-sm text-white/75">
                  <p className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-gold" /> {programme.department.name}</p>
                  <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-gold" /> {programme.duration}</p>
                  <p className="flex items-center gap-2"><Award className="h-4 w-4 text-gold" /> {programme.qualification}</p>
                  <p className="flex items-center gap-2"><Wallet className="h-4 w-4 text-gold" /> {programme.currency} {programme.fee.toLocaleString()}/yr</p>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mx-auto max-w-5xl mt-16">
            <Reveal>
              <h2 className="font-display font-bold text-2xl mb-5">Related Programmes</h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r, i) => (
                <Reveal key={r.id} delay={i * 0.05}>
                  <Link
                    href={`/programmes/${r.slug}`}
                    className="group block rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-premium hover:-translate-y-1 transition-all"
                  >
                    <span className="font-mono text-xs text-gold font-bold">{r.code}</span>
                    <p className="font-semibold mt-1 leading-snug group-hover:text-royal transition-colors">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{r.qualification} · {r.duration}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
