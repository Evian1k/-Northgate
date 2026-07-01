"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Wallet,
  UserCircle,
  MonitorPlay,
  Search,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { staggerContainer, staggerItem } from "@/components/anim";

interface Action {
  title: string;
  desc: string;
  icon: LucideIcon;
  href: string;
  accent?: boolean;
}

const actions: Action[] = [
  { title: "Apply Online", desc: "Start your journey today", icon: FileText, href: "#final-cta", accent: true },
  { title: "Download Brochure", desc: "2026 prospectus (PDF)", icon: Download, href: "#" },
  { title: "Fee Structure", desc: "Tuition & funding options", icon: Wallet, href: "#" },
  { title: "Student Portal", desc: "Grades, results & e-learning", icon: UserCircle, href: "#" },
  { title: "Virtual Tour", desc: "Explore campus in 3D", icon: MonitorPlay, href: "#" },
  { title: "Course Finder", desc: "Find your perfect programme", icon: Search, href: "#courses" },
];

export function QuickActions() {
  return (
    <section className="relative -mt-16 z-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
        >
          {actions.map((a) => (
            <motion.div key={a.title} variants={staggerItem}>
              <Link
                href={a.href}
                className={`group relative block h-full rounded-2xl p-4 sm:p-5 transition-all hover:-translate-y-1 ${
                  a.accent
                    ? "gradient-royal text-white shadow-premium"
                    : "bg-card border border-border shadow-soft hover:shadow-premium text-foreground"
                }`}
              >
                <div className={`grid place-items-center h-11 w-11 rounded-xl mb-3 transition-transform group-hover:scale-110 ${
                  a.accent ? "bg-white/15" : "bg-muted"
                }`}>
                  <a.icon className={`h-5 w-5 ${a.accent ? "text-white" : "text-royal"}`} />
                </div>
                <p className="font-semibold text-sm sm:text-base leading-tight">{a.title}</p>
                <p className={`text-xs mt-1 ${a.accent ? "text-white/75" : "text-muted-foreground"}`}>{a.desc}</p>
                <ArrowUpRight className={`absolute top-4 right-4 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ${a.accent ? "text-white" : "text-royal"}`} />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
