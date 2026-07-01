"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, Facebook, Twitter, Linkedin, Instagram, Youtube, Send, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const columns = [
  {
    title: "Admissions",
    links: ["How to Apply", "Tuition & Fees", "Scholarships", "International Students", "Transfer Students", "FAQs"],
  },
  {
    title: "Departments",
    links: ["Engineering", "ICT", "Business", "Hospitality", "Health Sciences", "Agriculture"],
  },
  {
    title: "Quick Links",
    links: ["About Us", "News & Events", "Research", "Library", "Career Services", "Alumni"],
  },
];

const socials = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

export function Footer() {
  const [email, setEmail] = React.useState("");
  const { toast } = useToast();

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({
      title: "Subscribed!",
      description: "You'll receive Northgate updates soon.",
    });
    setEmail("");
  };

  return (
    <footer className="relative bg-navy text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Brand + newsletter */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative h-11 w-11 rounded-xl gradient-royal grid place-items-center shadow-soft">
                <span className="font-display font-bold text-white text-lg">N</span>
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full gradient-gold ring-2 ring-navy" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display font-bold text-lg">Northgate</span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-white/60 font-semibold">
                  Institute of Technology
                </span>
              </div>
            </div>
            <p className="text-sm text-white/65 leading-relaxed max-w-sm">
              East Africa&apos;s premier TVET institution — building tomorrow&apos;s skilled professionals
              through world-class technical education since 1964.
            </p>

            {/* Newsletter */}
            <form onSubmit={subscribe} className="mt-6">
              <label className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Stay Updated
              </label>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="bg-white/5 border-white/15 text-white placeholder:text-white/40 rounded-full h-11"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-11 w-11 rounded-full gradient-gold text-navy hover:scale-105 transition-transform"
                  aria-label="Subscribe"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-xs text-white/40">
                Monthly newsletter · No spam · Unsubscribe anytime
              </p>
            </form>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-4">
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <Link
                        href="#"
                        className="group inline-flex items-center gap-1 text-sm text-white/65 hover:text-white transition-colors"
                      >
                        {l}
                        <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact + map */}
          <div className="lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-4">Contact</p>
            <ul className="space-y-3 text-sm text-white/65">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                <span>Northgate Avenue, Off Mombasa Road, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-gold flex-shrink-0" />
                <span>info@northgate.ac.ke</span>
              </li>
            </ul>

            {/* Map embed */}
            <div className="mt-5 rounded-2xl overflow-hidden border border-white/10">
              <iframe
                title="Northgate location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=36.82,-1.30,36.86,-1.26&layer=mapnik&marker=-1.28,36.84"
                className="w-full h-32 grayscale-[40%] opacity-80"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Socials */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="grid place-items-center h-10 w-10 rounded-full bg-white/5 hover:bg-gold hover:text-navy text-white/70 transition-colors"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p className="text-xs text-white/40 text-center sm:text-right">
            © {new Date().getFullYear()} Northgate Institute of Technology. All rights reserved. ·
            <Link href="#" className="hover:text-white transition-colors ml-1">Privacy</Link> ·
            <Link href="#" className="hover:text-white transition-colors ml-1">Terms</Link> ·
            <Link href="#" className="hover:text-white transition-colors ml-1">Accessibility</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
