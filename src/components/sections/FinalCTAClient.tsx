"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Download, Phone } from "lucide-react";
import { Reveal } from "@/components/anim";

export function FinalCTAClient({
  intake,
  deadline,
  phone,
  email,
}: {
  intake: string;
  deadline: string;
  phone: string;
  email: string;
}) {
  return (
    <section id="final-cta" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden gradient-hero">
      <div className="absolute inset-0 bg-grid opacity-25" />
      <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-royal/30 blur-3xl animate-float-slow" />
      <div className="absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-gold/20 blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />

      <div className="relative mx-auto max-w-5xl text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-xs font-semibold text-gold uppercase tracking-[0.2em]">
            Admissions Open · {intake}
          </span>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="mt-6 font-display font-bold text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
            {`Start Your Future `}
            <span className="text-gradient-gold">Today.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed">
            Applications for the {intake} intake are now open. Take the first step
            towards a career that builds nations — join 9,000+ students already shaping tomorrow.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/apply"
              className="group inline-flex items-center gap-2 rounded-full gradient-gold text-navy px-7 py-4 font-bold shadow-gold hover:scale-[1.03] transition-transform"
            >
              Apply Now
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="/api/brochure"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full glass-dark text-white px-7 py-4 font-semibold hover:bg-white/10 transition-all"
            >
              <Download className="h-4 w-4" />
              Download Prospectus
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-white/60 text-sm">
            <span className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold" />
              {phone}
            </span>
            <span>·</span>
            <span>{email}</span>
            <span>·</span>
            <span>Deadline: {deadline}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
