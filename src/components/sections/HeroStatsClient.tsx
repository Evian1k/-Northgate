"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/anim";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  decimals: number;
}

export function HeroStatsClient({ stats }: { stats: Stat[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="mt-14 lg:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 + i * 0.1 }}
          className="glass-dark rounded-2xl p-4 sm:p-5 hover:bg-white/10 transition-colors"
        >
          <p className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-white">
            <AnimatedCounter to={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
          </p>
          <p className="text-xs sm:text-sm text-white/65 mt-1 font-medium">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
