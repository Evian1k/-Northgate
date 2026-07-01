"use client";

import { motion } from "framer-motion";
import { ShieldCheck, FileCheck, Landmark, GraduationCap, Globe2, Building2 } from "lucide-react";
import { SectionHeading } from "@/components/anim";

interface Partner {
  name: string;
  short: string;
  icon: typeof ShieldCheck;
}

const partners: Partner[] = [
  { name: "TVETA", short: "Technical & Vocational Education Training Authority", icon: ShieldCheck },
  { name: "CDACC", short: "Curriculum Development & Certification Council", icon: FileCheck },
  { name: "HELB", short: "Higher Education Loans Board", icon: Landmark },
  { name: "KUCCPS", short: "Kenya Universities & Colleges Placement Service", icon: GraduationCap },
  { name: "UNESCO", short: "United Nations Educational, Scientific & Cultural Org.", icon: Globe2 },
  { name: "Industry Partners", short: "80+ hiring employers across East Africa", icon: Building2 },
];

export function Partners() {
  // Duplicate for seamless marquee
  const doubled = [...partners, ...partners];

  return (
    <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/40 border-y border-border">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Accredited & Partnered"
          title="Trusted by the"
          highlight="Best Institutions"
          subtitle="Our qualifications are recognised, accredited and trusted by national and international bodies."
        />

        {/* Marquee */}
        <div className="mt-14 relative overflow-hidden mask-fade-x">
          <div className="flex gap-4 sm:gap-6 animate-marquee w-max">
            {doubled.map((p, i) => (
              <motion.div
                key={`${p.name}-${i}`}
                whileHover={{ y: -4 }}
                className="flex-shrink-0 w-[260px] sm:w-[300px] rounded-2xl bg-card border border-border p-6 shadow-soft hover:shadow-premium hover:border-royal/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="grid place-items-center h-11 w-11 rounded-xl gradient-royal text-white">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <span className="font-display font-bold text-lg text-foreground">{p.name}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.short}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
