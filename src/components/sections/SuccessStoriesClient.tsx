"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { SectionHeading, AnimatedCounter } from "@/components/anim";

export interface Story {
  name: string;
  role: string;
  type: "student" | "employer" | "graduate";
  quote: string;
  avatar: string;
  org: string;
}

const stats = [
  { value: 96, suffix: "%", label: "Graduate Employability", decimals: 0 },
  { value: 18500, suffix: "+", label: "Alumni Network", decimals: 0 },
  { value: 80, suffix: "+", label: "Hiring Partners", decimals: 0 },
  { value: 42, suffix: "%", label: "Salary Uplift vs. Peers", decimals: 0 },
];

export function SuccessStoriesClient({ stories }: { stories: Story[] }) {
  const [idx, setIdx] = React.useState(0);
  const next = () => setIdx((p) => (p + 1) % Math.max(stories.length, 1));
  const prev = () => setIdx((p) => (p - 1 + Math.max(stories.length, 1)) % Math.max(stories.length, 1));

  React.useEffect(() => {
    if (stories.length <= 1) return;
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [stories.length]);

  if (stories.length === 0) return null;
  const current = stories[idx];

  return (
    <section className="relative py-24 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Success Stories"
          title="Where Our Graduates"
          highlight="Go Next"
          subtitle="Real voices from students, employers and alumni — the human proof of what Northgate delivers."
        />

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl gradient-royal p-8 sm:p-10 shadow-premium overflow-hidden h-full min-h-[360px] flex flex-col">
              <Quote className="absolute top-6 right-6 h-20 w-20 text-white/10" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col h-full"
                >
                  <div className="flex items-center gap-2 mb-5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-white text-lg sm:text-xl md:text-2xl font-medium leading-relaxed flex-1">
                    &ldquo;{current.quote}&rdquo;
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                    <img
                      src={current.avatar}
                      alt={current.name}
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-gold/40"
                    />
                    <div>
                      <p className="font-display font-bold text-white">{current.name}</p>
                      <p className="text-white/70 text-sm">{current.role}</p>
                      {current.org && <p className="text-gold text-xs font-medium mt-0.5">{current.org}</p>}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex items-center gap-2">
                <button onClick={prev} aria-label="Previous" className="grid place-items-center h-10 w-10 rounded-full glass-dark text-white hover:bg-white/15 transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={next} aria-label="Next" className="grid place-items-center h-10 w-10 rounded-full glass-dark text-white hover:bg-white/15 transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="ml-3 flex gap-1.5">
                  {stories.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIdx(i)}
                      aria-label={`Story ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-gold" : "w-1.5 bg-white/30"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-premium transition-shadow"
              >
                <TrendingUp className="h-5 w-5 text-gold mb-3" />
                <p className="font-display font-bold text-3xl text-foreground">
                  <AnimatedCounter to={s.value} suffix={s.suffix} decimals={s.decimals} />
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
