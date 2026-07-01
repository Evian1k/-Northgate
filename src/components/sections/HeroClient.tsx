"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ArrowRight, Compass, ChevronDown } from "lucide-react";

interface HeroStat {
  value: number;
  suffix: string;
  label: string;
  decimals: number;
}

export function HeroClient({
  stats,
  admissionsIntake,
  admissionsDeadline,
}: {
  stats: HeroStat[];
  admissionsIntake: string;
  admissionsDeadline: string;
}) {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden gradient-hero">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=2400&q=80"
          alt="Students in an engineering lab"
          className="h-full w-full object-cover opacity-40"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/70 to-navy" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-royal/30 blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-gold/20 blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 lg:pt-40 pb-24 min-h-[100svh] flex flex-col justify-center">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-xs sm:text-sm font-medium text-white/90"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" style={{ animation: "pulse-ring 2s ease-out infinite" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            Admissions Open · {admissionsIntake} Intake
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display font-bold text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight"
          >
            Building Tomorrow&apos;s{" "}
            <span className="relative inline-block">
              <span className="text-gradient-gold">Skilled</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-gold/60 origin-left"
              />
            </span>{" "}
            Professionals
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-white/75 leading-relaxed max-w-2xl"
          >
            East Africa&apos;s premier Technical &amp; Vocational institute — where world-class workshops,
            industry partnerships and hands-on mastery converge to launch careers that shape nations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/apply"
              className="group inline-flex items-center gap-2 rounded-full gradient-royal text-white px-6 py-3.5 font-semibold shadow-premium hover:shadow-gold transition-all hover:-translate-y-0.5"
            >
              Apply Now
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="#departments"
              className="group inline-flex items-center gap-2 rounded-full glass-dark text-white px-6 py-3.5 font-semibold hover:bg-white/10 transition-all"
            >
              <Compass className="h-4 w-4" />
              Explore Courses
            </Link>
            <button className="group inline-flex items-center gap-2 rounded-full text-white px-4 py-3.5 font-semibold hover:bg-white/10 transition-all">
              <span className="grid place-items-center h-9 w-9 rounded-full gradient-gold text-navy group-hover:scale-110 transition-transform">
                <Play className="h-4 w-4 fill-navy" />
              </span>
              Watch Campus Tour
            </button>
          </motion.div>
        </div>

        {/* Floating statistics */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-14 lg:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 + i * 0.1 }}
              className="glass-dark rounded-2xl p-4 sm:p-5 hover:bg-white/10 transition-colors"
            >
              <p className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-white" data-stat-value={stat.value} data-stat-suffix={stat.suffix}>
                {stat.value.toLocaleString("en-US")}{stat.suffix}
              </p>
              <p className="text-xs sm:text-sm text-white/65 mt-1 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-medium">Scroll</span>
        <div className="relative h-9 w-5 rounded-full border border-white/30 grid place-items-start p-1">
          <span className="h-2 w-2 rounded-full bg-gold scroll-dot" />
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-white/40 -mt-1" />
      </motion.div>
    </section>
  );
}
