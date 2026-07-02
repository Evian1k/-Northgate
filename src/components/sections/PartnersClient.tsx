"use client";

import { motion } from "framer-motion";
import { ShieldCheck, FileCheck, Landmark, GraduationCap, Globe2, Building2, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/anim";

interface Partner {
  name: string;
  short: string;
  category: string;
}

const iconMap: Record<string, LucideIcon> = {
  ACCREDITATION: ShieldCheck,
  GOVERNMENT: Landmark,
  INDUSTRY: Building2,
};

const fallbackIcons = [FileCheck, GraduationCap, Globe2];

export function PartnersClient({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;
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

        <div className="mt-14 relative overflow-hidden mask-fade-x">
          <div className="flex gap-4 sm:gap-6 animate-marquee w-max">
            {doubled.map((p, i) => {
              const Icon = iconMap[p.category] || fallbackIcons[i % fallbackIcons.length];
              return (
                <motion.div
                  key={`${p.name}-${i}`}
                  whileHover={{ y: -4 }}
                  className="flex-shrink-0 w-[260px] sm:w-[300px] rounded-2xl bg-card border border-border p-6 shadow-soft hover:shadow-premium hover:border-royal/30 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="grid place-items-center h-11 w-11 rounded-xl gradient-royal text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-display font-bold text-lg text-foreground">{p.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.short}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
