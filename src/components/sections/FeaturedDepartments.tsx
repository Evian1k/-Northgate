"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading, StaggerGroup, staggerItem } from "@/components/anim";

interface Dept {
  name: string;
  tagline: string;
  count: string;
  img: string;
  size?: "lg" | "md";
}

const departments: Dept[] = [
  {
    name: "Engineering",
    tagline: "Civil · Mechanical · Automotive",
    count: "32 programmes",
    img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
    size: "lg",
  },
  {
    name: "ICT",
    tagline: "Software · Networks · Cybersecurity",
    count: "24 programmes",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Business",
    tagline: "Accounting · HR · Marketing",
    count: "18 programmes",
    img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Hospitality",
    tagline: "Culinary · Tourism · Hotel Mgmt",
    count: "12 programmes",
    img: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Health Sciences",
    tagline: "Nursing · Lab Tech · Pharmacy",
    count: "16 programmes",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Agriculture",
    tagline: "Agribusiness · Agronomy",
    count: "10 programmes",
    img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Electrical",
    tagline: "Power · Electronics · Solar",
    count: "14 programmes",
    img: "https://images.unsplash.com/photo-1506617561150-c7a2ac2989b7?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Mechanical",
    tagline: "Production · Plant Maintenance",
    count: "12 programmes",
    img: "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Building Technology",
    tagline: "Construction · Surveying",
    count: "12 programmes",
    img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
  },
];

export function FeaturedDepartments() {
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
            href="#"
            className="hidden lg:inline-flex items-center gap-2 text-sm font-semibold text-royal hover:gap-3 transition-all"
          >
            View all departments <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[200px] sm:auto-rows-[220px]">
          {/* Featured large card */}
          <motion.div variants={staggerItem} className="col-span-2 row-span-2">
            <DeptCard dept={departments[0]} large />
          </motion.div>
          {departments.slice(1).map((d) => (
            <motion.div key={d.name} variants={staggerItem}>
              <DeptCard dept={d} />
            </motion.div>
          ))}
        </StaggerGroup>

        <div className="mt-8 lg:hidden">
          <Link href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-royal">
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
      {/* Overlay */}
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
