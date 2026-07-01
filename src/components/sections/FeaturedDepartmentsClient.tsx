"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading, StaggerGroup, staggerItem } from "@/components/anim";

export interface Dept {
  id: string;
  name: string;
  tagline: string;
  count: string;
  img: string;
}

export function FeaturedDepartmentsClient({ departments }: { departments: Dept[] }) {
  if (departments.length === 0) return null;

  return (
    <section id="departments" className="relative py-24 sm:py-28 px-4 sm:px-6 lg:px-8 bg-muted/40">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <SectionHeading
            align="left"
            eyebrow="Featured Departments"
            title="Nine Faculties."
            highlight="One Standard."
            subtitle="Each school blends rigorous theory with intensive practical immersion — preparing graduates who hit the ground running from day one."
          />
          <Link
            href="#courses"
            className="hidden lg:inline-flex items-center gap-2 text-sm font-semibold text-royal hover:gap-3 transition-all"
          >
            View all departments <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[200px] sm:auto-rows-[220px]">
          {departments.length > 0 && (
            <motion.div variants={staggerItem} className="col-span-2 row-span-2">
              <DeptCard dept={departments[0]} large />
            </motion.div>
          )}
          {departments.slice(1).map((d) => (
            <motion.div key={d.id} variants={staggerItem}>
              <DeptCard dept={d} />
            </motion.div>
          ))}
        </StaggerGroup>

        <div className="mt-8 lg:hidden">
          <Link href="#courses" className="inline-flex items-center gap-2 text-sm font-semibold text-royal">
            View all departments <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function DeptCard({ dept, large = false }: { dept: Dept; large?: boolean }) {
  return (
    <Link
      href="#courses"
      className="group relative block h-full w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-soft hover:shadow-premium transition-shadow"
    >
      <img
        src={dept.img}
        alt={`${dept.name} department`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent transition-opacity group-hover:from-navy/95" />

      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        <span className="inline-flex items-center gap-1 rounded-full glass-dark text-white text-[10px] sm:text-xs font-medium px-2.5 py-1">
          {dept.count}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 text-white">
        <h3 className={`font-display font-bold ${large ? "text-xl sm:text-3xl" : "text-base sm:text-lg"} leading-tight`}>
          {dept.name}
        </h3>
        <p className={`text-white/70 ${large ? "text-sm sm:text-base" : "text-[11px] sm:text-xs"} mt-0.5`}>
          {dept.tagline}
        </p>
        <div className="mt-2 sm:mt-3 flex items-center gap-1.5 text-xs font-semibold text-gold opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
          Explore programmes <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
}
