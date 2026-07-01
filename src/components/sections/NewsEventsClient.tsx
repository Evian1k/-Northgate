"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import { SectionHeading, StaggerGroup, staggerItem } from "@/components/anim";

export interface NewsItem {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  img: string;
  size: "lg" | "md";
}

const categories = ["Latest News", "Upcoming Events", "Research", "Innovation", "Conferences"];

export function NewsEventsClient({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null;

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
          {items[0] && (
            <motion.div variants={staggerItem} className="md:col-span-2 lg:row-span-2">
              <ArticleCard item={items[0]} large />
            </motion.div>
          )}
          {items.slice(1).map((it) => (
            <motion.div key={it.id} variants={staggerItem}>
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

function ArticleCard({ item, large = false }: { item: NewsItem; large?: boolean }) {
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
