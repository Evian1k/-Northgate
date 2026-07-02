"use client";

import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

interface Channel { icon: LucideIcon; label: string; value: string; href: string; desc: string }
interface Resource { icon: LucideIcon; label: string; desc: string }

export function SupportClient({ channels, resources }: { channels: Channel[]; resources: Resource[] }) {
  return (
    <div className="space-y-6">
      {/* Contact channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {channels.map((c, i) => (
          <motion.a
            key={c.label}
            href={c.href}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-premium transition-shadow group"
          >
            <div className="grid place-items-center h-11 w-11 rounded-xl gradient-royal text-white mb-3 group-hover:scale-110 transition-transform">
              <c.icon className="h-5 w-5" />
            </div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{c.label}</p>
            <p className="font-display font-bold text-base mt-0.5">{c.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{c.desc}</p>
          </motion.a>
        ))}
      </div>

      {/* Quick links to message compose */}
      <div className="rounded-3xl gradient-royal p-6 sm:p-8 text-white shadow-premium relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative">
          <h2 className="font-display font-bold text-xl mb-2">Need to talk to someone?</h2>
          <p className="text-white/75 text-sm max-w-md mb-4">
            Send a message to our support team and we&apos;ll get back to you within 24 hours.
          </p>
          <Link
            href="/student/messages"
            className="inline-flex items-center gap-2 rounded-full gradient-gold text-navy px-5 py-2.5 text-sm font-bold hover:scale-105 transition-transform"
          >
            Send a Message <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Resources */}
      <div>
        <h2 className="font-display font-bold text-lg mb-4">Helpful Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {resources.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-premium transition-shadow group cursor-pointer"
            >
              <div className="grid place-items-center h-10 w-10 rounded-xl bg-muted mb-3 group-hover:bg-royal/10 transition-colors">
                <r.icon className="h-5 w-5 text-muted-foreground group-hover:text-royal transition-colors" />
              </div>
              <p className="font-semibold text-sm">{r.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
