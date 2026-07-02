"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, BookOpen, Award, Clock, Wallet,
  Building2, GraduationCap, Users, type LucideIcon,
} from "lucide-react";
import { Reveal, SectionHeading, StaggerGroup, staggerItem } from "@/components/anim";

interface Programme {
  id: string; code: string; title: string; slug: string;
  qualification: string; duration: string; fee: number; currency: string;
  description: string; requirements: string[]; careerPaths: string[];
}

const iconMap: Record<string, LucideIcon> = {
  HardHat: Building2, Cpu: Building2, Building2, Stethoscope: Building2,
  UtensilsCrossed: Building2, Tractor: Building2, Zap: Building2,
  Wrench: Building2, GraduationCap: Building2,
};

export function DepartmentDetailClient({
  department, programmes,
}: {
  department: { name: string; tagline: string; description: string; imageUrl: string | null; icon: string | null };
  programmes: Programme[];
}) {
  const Icon = Building2;

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {department.imageUrl && (
            <img
              src={department.imageUrl}
              alt={department.name}
              className="h-full w-full object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 gradient-navy opacity-90" />
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-royal/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <Link href="/#departments" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> All departments
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid place-items-center h-16 w-16 rounded-2xl gradient-royal shadow-premium mb-5">
              <Icon className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-display font-bold text-white text-4xl sm:text-5xl md:text-6xl tracking-tight">
              {department.name}
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-white/75 max-w-2xl">{department.tagline}</p>
          </motion.div>
        </div>
      </section>

      {/* Description */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <h2 className="font-display font-bold text-2xl sm:text-3xl mb-4">About the Department</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-base sm:text-lg">
              {department.description}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 grid grid-cols-3 gap-4">
              <div className="rounded-2xl bg-card border border-border p-5 text-center shadow-soft">
                <BookOpen className="h-6 w-6 text-gold mx-auto mb-2" />
                <p className="font-display font-bold text-2xl">{programmes.length}</p>
                <p className="text-xs text-muted-foreground">Programmes</p>
              </div>
              <div className="rounded-2xl bg-card border border-border p-5 text-center shadow-soft">
                <Users className="h-6 w-6 text-gold mx-auto mb-2" />
                <p className="font-display font-bold text-2xl">320+</p>
                <p className="text-xs text-muted-foreground">Faculty</p>
              </div>
              <div className="rounded-2xl bg-card border border-border p-5 text-center shadow-soft">
                <GraduationCap className="h-6 w-6 text-gold mx-auto mb-2" />
                <p className="font-display font-bold text-2xl">96%</p>
                <p className="text-xs text-muted-foreground">Placed</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Programmes list */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            align="left"
            eyebrow="Programmes"
            title="Available"
            highlight="Courses"
            subtitle={`Browse all ${programmes.length} accredited programmes in the ${department.name} department.`}
          />

          <StaggerGroup className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {programmes.map((p) => (
              <motion.div key={p.id} variants={staggerItem}>
                <Link
                  href={`/programmes/${p.slug}`}
                  className="group block rounded-2xl bg-card border border-border p-6 shadow-soft hover:shadow-premium hover:-translate-y-1 transition-all h-full"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="font-mono text-xs font-bold text-gold bg-gold/10 px-2 py-0.5 rounded">{p.code}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-royal group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h3 className="font-display font-bold text-lg leading-snug group-hover:text-royal transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.description}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Award className="h-3 w-3" /> {p.qualification}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {p.duration}</span>
                    <span className="inline-flex items-center gap-1"><Wallet className="h-3 w-3" /> {p.currency} {p.fee.toLocaleString()}/yr</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </StaggerGroup>

          {programmes.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No programmes are currently available in this department.</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 rounded-full gradient-royal text-white px-7 py-3.5 font-semibold shadow-premium hover:shadow-gold transition-shadow"
            >
              Apply Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
