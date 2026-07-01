"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Award, Clock, ArrowRight, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/anim";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Programme {
  code: string;
  title: string;
  dept: string;
  duration: string;
  level: string;
}

export function CourseFinderClient({ programmes, departments }: { programmes: Programme[]; departments: string[] }) {
  const [query, setQuery] = React.useState("");
  const [dept, setDept] = React.useState<string>("");
  const [level, setLevel] = React.useState<string>("");
  const [duration, setDuration] = React.useState<string>("");

  const filtered = React.useMemo(() => {
    let result = programmes;
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.dept.toLowerCase().includes(q) || p.code.toLowerCase().includes(q));
    }
    if (dept) result = result.filter((p) => p.dept === dept);
    if (level) result = result.filter((p) => p.level === level);
    if (duration) {
      result = result.filter((p) => {
        // Match by duration string contains
        return p.duration.toLowerCase().includes(duration.toLowerCase());
      });
    }
    return result.slice(0, 6);
  }, [programmes, query, dept, level, duration]);

  const onApply = () => {
    window.location.href = "/apply";
  };

  return (
    <section id="courses" className="relative py-24 sm:py-28 px-4 sm:px-6 lg:px-8 gradient-navy overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-royal/30 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          light
          eyebrow="Course Finder"
          title="Find Your"
          highlight="Perfect Programme"
          subtitle="Search across our accredited catalogue. Filter by qualification, duration, or department to discover your path."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mt-12 rounded-3xl glass-dark p-4 sm:p-6 shadow-premium"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses, e.g. 'Electrical'"
                className="pl-11 h-12 bg-white/5 border-white/15 text-white placeholder:text-white/50 rounded-xl"
              />
            </div>
            <div className="md:col-span-2">
              <Select value={dept} onValueChange={setDept}>
                <SelectTrigger className="h-12 bg-white/5 border-white/15 text-white rounded-xl">
                  <MapPin className="h-4 w-4 text-white/50 mr-2" />
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="h-12 bg-white/5 border-white/15 text-white rounded-xl">
                  <Award className="h-4 w-4 text-white/50 mr-2" />
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {["Certificate", "Diploma", "Higher Diploma", "Degree"].map((q) => (
                    <SelectItem key={q} value={q}>{q}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="h-12 bg-white/5 border-white/15 text-white rounded-xl">
                  <Clock className="h-4 w-4 text-white/50 mr-2" />
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  {["1 year", "2 years", "3 years"].map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1">
              <Button onClick={onApply} className="w-full h-12 gradient-gold text-navy font-bold rounded-xl hover:scale-[1.02] transition-transform">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-12 text-white/50">
                <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No programmes match your filters. Try adjusting your search.</p>
              </div>
            ) : (
              filtered.map((r, i) => (
                <motion.div
                  key={r.code}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 p-4 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gold">{r.code}</span>
                      <p className="font-semibold text-white text-sm mt-1 leading-snug">{r.title}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">{r.dept}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">{r.duration}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">{r.level}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-gold group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-white/50">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Showing {filtered.length} of {programmes.length} programmes
            </span>
            <button onClick={onApply} className="text-gold hover:underline font-medium">Apply now →</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
