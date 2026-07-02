"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Calendar, Clock, Eye, User, ArrowRight, ArrowUpRight,
} from "lucide-react";
import { Reveal } from "@/components/anim";

interface Article {
  title: string; excerpt: string; content: string; category: string;
  imageUrl: string | null; publishedAt: string; readTime: number;
  tags: string[]; author: string; views: number;
}

interface Related {
  id: string; title: string; slug: string; excerpt: string;
  imageUrl: string | null; publishedAt: string; category: string;
}

export function NewsDetailClient({ article, related }: { article: Article; related: Related[] }) {
  const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <article>
        <header className="relative overflow-hidden">
          <div className="absolute inset-0">
            {article.imageUrl && (
              <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/40" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <Link href="/#news" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" /> All news
            </Link>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-gold bg-gold/10 px-3 py-1 rounded-full mb-4">
                {article.category}
              </span>
              <h1 className="font-display font-bold text-white text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1]">
                {article.title}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-white/80 max-w-3xl leading-relaxed">
                {article.excerpt}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4 text-gold" /> {article.author}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gold" /> {date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gold" /> {article.readTime} min read
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-gold" /> {article.views} views
                </span>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Body */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <Reveal>
            <div className="prose prose-lg max-w-none">
              {article.content.split("\n\n").map((para, i) => (
                <p key={i} className="text-foreground/80 leading-relaxed mb-6 whitespace-pre-line">
                  {para}
                </p>
              ))}
            </div>
          </Reveal>

          {article.tags.length > 0 && (
            <Reveal delay={0.1}>
              <div className="mt-10 pt-6 border-t border-border">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((t, i) => (
                    <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-full bg-muted text-foreground/70">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          <Reveal delay={0.15}>
            <div className="mt-10 rounded-3xl gradient-royal p-6 sm:p-8 text-white shadow-premium text-center">
              <h3 className="font-display font-bold text-xl sm:text-2xl mb-2">Ready to join Northgate?</h3>
              <p className="text-white/75 text-sm mb-5 max-w-md mx-auto">
                Take the first step toward a career that builds nations.
              </p>
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 rounded-full gradient-gold text-navy px-6 py-3 font-bold hover:scale-[1.03] transition-transform"
              >
                Apply Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 pb-16 bg-muted/40 py-16">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <h2 className="font-display font-bold text-2xl sm:text-3xl mb-6">Related Stories</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((r, i) => (
                <Reveal key={r.id} delay={i * 0.05}>
                  <Link
                    href={`/news/${r.slug}`}
                    className="group block rounded-2xl bg-card border border-border overflow-hidden shadow-soft hover:shadow-premium transition-shadow h-full"
                  >
                    <div className="h-40 overflow-hidden">
                      {r.imageUrl && (
                        <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      )}
                    </div>
                    <div className="p-5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gold">{r.category}</span>
                      <p className="font-display font-bold text-base mt-1 leading-snug group-hover:text-royal transition-colors">{r.title}</p>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{r.excerpt}</p>
                      <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-royal">
                        Read more <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
