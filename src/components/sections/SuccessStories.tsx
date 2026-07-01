"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { SectionHeading, AnimatedCounter } from "@/components/anim";

interface Story {
  name: string;
  role: string;
  type: "student" | "employer" | "graduate";
  quote: string;
  avatar: string;
  org: string;
}

const stories: Story[] = [
  {
    name: "Amara Ochieng",
    role: "Graduate · Electrical Engineering, 2022",
    type: "graduate",
    quote:
      "Northgate didn&apos;t just teach me circuits — they taught me discipline. Three weeks after graduation I was hired as a maintenance engineer at a regional power company. The labs had already prepared me for everything I now do daily.",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80",
    org: "Now at Kenya Power",
  },
  {
    name: "Daniel Mwangi",
    role: "ICT Manager · Safaricom",
    type: "employer",
    quote:
      "We&apos;ve hired 18 Northgate graduates in the last two years. Their hands-on fluency with real infrastructure is exceptional — they arrive ready, not green. The partnership has fundamentally reshaped our talent pipeline.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    org: "Safaricom PLC",
  },
  {
    name: "Fatuma Hassan",
    role: "Student · Diploma in Nursing, Final Year",
    type: "student",
    quote:
      "The clinical placements and simulated ward training mean I walk into practice with confidence. My trainers are practising nurses — they bring the hospital into the classroom every single day.",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80",
    org: "Northgate Student",
  },
  {
    name: "Brian Kamau",
    role: "Founder · TekFix Solutions",
    type: "graduate",
    quote:
      "After my diploma in Mechanical Engineering, I launched my own repair and fabrication shop. The innovation hub gave me my first CNC prototype and the mentorship to turn it into a real business.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    org: "CEO, TekFix Solutions",
  },
];

const stats = [
  { value: 96, suffix: "%", label: "Graduate Employability", decimals: 0 },
  { value: 18500, suffix: "+", label: "Alumni Network", decimals: 0 },
  { value: 80, suffix: "+", label: "Hiring Partners", decimals: 0 },
  { value: 42, suffix: "%", label: "Salary Uplift vs. Peers", decimals: 0 },
];

export function SuccessStories() {
  const [idx, setIdx] = React.useState(0);
  const next = () => setIdx((p) => (p + 1) % stories.length);
  const prev = () => setIdx((p) => (p - 1 + stories.length) % stories.length);

  React.useEffect(() => {
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, []);

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
          {/* Featured testimonial */}
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
                  <p
                    className="text-white text-lg sm:text-xl md:text-2xl font-medium leading-relaxed flex-1"
                    dangerouslySetInnerHTML={{ __html: `"${current.quote}"` }}
                  />
                  <div className="mt-8 flex items-center gap-4">
                    <img
                      src={current.avatar}
                      alt={current.name}
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-gold/40"
                    />
                    <div>
                      <p className="font-display font-bold text-white">{current.name}</p>
                      <p className="text-white/70 text-sm">{current.role}</p>
                      <p className="text-gold text-xs font-medium mt-0.5">{current.org}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              <div className="mt-8 flex items-center gap-2">
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="grid place-items-center h-10 w-10 rounded-full glass-dark text-white hover:bg-white/15 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="grid place-items-center h-10 w-10 rounded-full glass-dark text-white hover:bg-white/15 transition-colors"
                >
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

          {/* Stats column */}
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
