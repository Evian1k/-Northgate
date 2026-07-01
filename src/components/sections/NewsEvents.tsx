"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import { SectionHeading, StaggerGroup, staggerItem } from "@/components/anim";

interface Item {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  img: string;
  size: "lg" | "md";
}

const items: Item[] = [
  {
    category: "Latest News",
    title: "Northgate Wins National TVET Innovation Award 2026",
    excerpt:
      "Our Smart Irrigation Project, built by agricultural engineering students, beat 84 institutions to take top honours at this year&apos;s National Skills Showcase.",
    date: "May 14, 2026",
    readTime: "4 min read",
    img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1400&q=80",
    size: "lg",
  },
  {
    category: "Upcoming Events",
    title: "Open Day · September Intake",
    excerpt: "Tour the campus, meet faculty, and apply on the spot.",
    date: "Aug 24, 2026",
    readTime: "All day",
    img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
    size: "md",
  },
  {
    category: "Research",
    title: "Solar-Powered Cold Storage for Smallholder Farmers",
    excerpt: "A cross-departmental team unveils a working prototype.",
    date: "Jul 02, 2026",
    readTime: "6 min read",
    img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80",
    size: "md",
  },
  {
    category: "Innovation",
    title: "New AI & Data Centre Inaugurated",
    excerpt: "KES 240M facility hosts 8 specialised compute labs.",
    date: "Jun 18, 2026",
    readTime: "3 min read",
    img: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80",
    size: "md",
  },
  {
    category: "Conferences",
    title: "East Africa TVET Symposium · Hosted at Northgate",
    excerpt: "300+ educators convening on the future of skills.",
    date: "Oct 09, 2026",
    readTime: "2 days",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80",
    size: "md",
  },
];

const categories = ["Latest News", "Upcoming Events", "Research", "Innovation", "Conferences"];

export function NewsEvents() {
  return (
    <section className="relative py-24 sm:py-28 px-4 sm:px-6 lg:px-8 bg-muted/40">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <SectionHeading
            align="left"
            eyebrow="News & Events"
            title="The Northgate"
            highlight="Magazine"
            subtitle="Discoveries, milestones and gatherings — the people and ideas powering our campus every week."
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((c, i) => (
              <button
                key={c}
                className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors ${
                  i === 0
                    ? "gradient-royal text-white shadow-soft"
                    : "bg-card border border-border text-foreground/70 hover:text-foreground hover:border-royal/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Feature */}
          <motion.div variants={staggerItem} className="md:col-span-2 lg:row-span-2">
            <ArticleCard item={items[0]} large />
          </motion.div>
          {items.slice(1).map((it) => (
            <motion.div key={it.title} variants={staggerItem}>
              <ArticleCard item={it} />
            </motion.div>
          ))}
        </StaggerGroup>

        <div className="mt-10 text-center">
          <Link
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold shadow-soft hover:shadow-premium hover:border-royal/40 transition-all"
          >
            View all news &amp; events <ArrowUpRight className="h-4 w-4 text-royal" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ item, large = false }: { item: Item; large?: boolean }) {
  return (
    <Link
      href="#"
      className={`group relative block overflow-hidden rounded-3xl bg-card border border-border shadow-soft hover:shadow-premium transition-shadow h-full ${
        large ? "min-h-[420px]" : "min-h-[260px]"
      }`}
    >
      <div className={`relative ${large ? "h-56 sm:h-64" : "h-40"} overflow-hidden`}>
        <img
          src={item.img}
          alt={item.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <span className="absolute top-3 left-3 inline-flex items-center rounded-full glass-dark text-white text-[10px] font-semibold px-2.5 py-1 uppercase tracking-wider">
          {item.category}
        </span>
      </div>
      <div className={`p-5 ${large ? "sm:p-7" : ""}`}>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {item.date}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {item.readTime}
          </span>
        </div>
        <h3 className={`font-display font-bold ${large ? "text-xl sm:text-2xl" : "text-base"} text-foreground leading-snug group-hover:text-royal transition-colors`}>
          {item.title}
        </h3>
        <p className={`text-sm text-muted-foreground mt-2 ${large ? "leading-relaxed" : "line-clamp-2"}`}>
          {item.excerpt}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-royal opacity-0 group-hover:opacity-100 transition-opacity">
          Read more <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
