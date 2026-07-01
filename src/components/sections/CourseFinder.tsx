"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Award, Clock, ArrowRight, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/anim";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const sampleResults = [
  { code: "EEE/4/1", title: "Diploma in Electrical Engineering", dept: "Electrical", duration: "3 years", level: "Diploma" },
  { code: "ICT/5/2", title: "Higher Diploma in Cybersecurity", dept: "ICT", duration: "1 year", level: "Higher Diploma" },
  { code: "NUR/3/1", title: "Certificate in Nursing Assistant", dept: "Health Sciences", duration: "1 year", level: "Certificate" },
  { code: "MEC/4/1", title: "Diploma in Mechanical Engineering", dept: "Mechanical", duration: "3 years", level: "Diploma" },
  { code: "BUS/4/1", title: "Diploma in Business Management", dept: "Business", duration: "2 years", level: "Diploma" },
  { code: "AGR/4/1", title: "Diploma in Agribusiness", dept: "Agriculture", duration: "2 years", level: "Diploma" },
];

export function CourseFinder() {
  const [results, setResults] = React.useState(sampleResults.slice(0, 3));
  const [query, setQuery] = React.useState("");

  const filter = React.useCallback((q: string) => {
    if (!q.trim()) {
      setResults(sampleResults.slice(0, 3));
      return;
    }
    const filtered = sampleResults.filter(
      (r) =>
        r.title.toLowerCase().includes(q.toLowerCase()) ||
        r.dept.toLowerCase().includes(q.toLowerCase())
    );
    setResults(filtered.length ? filtered.slice(0, 4) : sampleResults.slice(0, 3));
  }, []);

  const onQueryChange = (v: string) => {
    setQuery(v);
    filter(v);
  };

  return (
    <section id="courses" className="relative py-24 sm:py-28 px-4 sm:px-6 lg:px-8 gradient-navy overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-royal/30 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          light
          eyebrow="Course Finder"
          title="Find Your"
          highlight="Perfect Programme"
          subtitle="Search 150+ accredited programmes across nine departments. Filter by qualification, duration, or department to discover your path."
        />

        {/* Search panel */}
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
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search courses, e.g. 'Electrical'"
                className="pl-11 h-12 bg-white/5 border-white/15 text-white placeholder:text-white/50 rounded-xl"
              />
            </div>
            <div className="md:col-span-2">
              <Select>
                <SelectTrigger className="h-12 bg-white/5 border-white/15 text-white rounded-xl">
                  <MapPin className="h-4 w-4 text-white/50 mr-2" />
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {["Engineering", "ICT", "Business", "Hospitality", "Health Sciences", "Agriculture", "Electrical", "Mechanical", "Building Tech"].map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Select>
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
              <Select>
                <SelectTrigger className="h-12 bg-white/5 border-white/15 text-white rounded-xl">
                  <Clock className="h-4 w-4 text-white/50 mr-2" />
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  {["6 months", "1 year", "2 years", "3 years", "4 years"].map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1">
              <Button
                onClick={() => filter(query)}
                className="w-full h-12 gradient-gold text-navy font-bold rounded-xl hover:scale-[1.02] transition-transform"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Live results */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {results.map((r, i) => (
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
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-white/50">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Showing {results.length} of 150+ programmes
            </span>
            <button className="text-gold hover:underline font-medium">Browse full catalogue →</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
