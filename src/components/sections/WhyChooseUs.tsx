"use client";

import { motion } from "framer-motion";
import {
  Handshake,
  FlaskConical,
  Lightbulb,
  Globe2,
  GraduationCap,
  Wrench,
  Briefcase,
  Award,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading, StaggerGroup, staggerItem } from "@/components/anim";

interface Reason {
  icon: LucideIcon;
  title: string;
  desc: string;
  stat: string;
}

const reasons: Reason[] = [
  { icon: Handshake, title: "Industry Partnerships", desc: "Curricula co-designed with 80+ employers for job-ready skills.", stat: "80+ partners" },
  { icon: FlaskConical, title: "Modern Laboratories", desc: "State-of-the-art workshops equipped with the latest industry tech.", stat: "42 labs" },
  { icon: Lightbulb, title: "Innovation Hub", desc: "A dedicated maker-space where students prototype real solutions.", stat: "120+ projects" },
  { icon: Globe2, title: "International Recognition", desc: "UNESCO-anchored qualifications recognised across 15 countries.", stat: "15 countries" },
  { icon: GraduationCap, title: "Qualified Trainers", desc: "Practitioner-lecturers with global certifications and field experience.", stat: "320+ faculty" },
  { icon: Wrench, title: "Hands-on Learning", desc: "70% practical, 30% theory — building muscle memory from day one.", stat: "70% practical" },
  { icon: Briefcase, title: "Career Placement", desc: "Dedicated placement cell connecting graduates to employers.", stat: "96% placed" },
  { icon: Award, title: "Research Excellence", desc: "Applied research solving real community and industrial problems.", stat: "40+ papers/yr" },
];

export function WhyChooseUs() {
  return (
    <section className="relative py-24 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Why Northgate"
          title="Engineered for"
          highlight="Excellence"
          subtitle="Every detail of our institution — from pedagogy to partnerships — is engineered to launch graduates into high-impact careers."
        />

        <StaggerGroup className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {reasons.map((r) => (
            <motion.div
              key={r.title}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              className="group relative rounded-3xl bg-card border border-border p-6 shadow-soft hover:shadow-premium transition-shadow overflow-hidden"
            >
              {/* Gold accent line */}
              <span className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-gold/0 via-gold to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center justify-between mb-5">
                <div className="grid place-items-center h-12 w-12 rounded-2xl gradient-royal text-white shadow-soft group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <r.icon className="h-5.5 w-5.5" />
                </div>
                <span className="text-xs font-semibold text-gold bg-gold/10 px-2.5 py-1 rounded-full">
                  {r.stat}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mb-2">{r.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
