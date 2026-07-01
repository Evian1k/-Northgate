"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle2, MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function ContactPageClient({
  siteName, phone, email, address,
}: {
  siteName: string; phone: string; email: string; address: string;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
        toast({ title: "Message sent!", description: "We'll respond within 24 hours." });
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        toast({ title: "Failed to send", description: data.error || "Try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", description: "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <section className="relative gradient-navy overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-royal/30 blur-3xl" />
        <div className="relative mx-auto max-w-5xl">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to homepage
          </Link>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-xs font-semibold text-gold uppercase tracking-widest mb-4">
              Contact Us
            </span>
            <h1 className="font-display font-bold text-white text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1]">
              Let&apos;s <span className="text-gradient-gold">Talk.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/75 max-w-2xl">
              Questions about admissions, programmes, or anything else? Our team responds within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact info cards */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: MapPin, label: "Visit Us", value: address, href: "#map" },
            { icon: Phone, label: "Call Us", value: phone, href: `tel:${phone}` },
            { icon: Mail, label: "Email Us", value: email, href: `mailto:${email}` },
            { icon: Clock, label: "Office Hours", value: "Mon–Fri · 8 AM – 5 PM EAT", href: undefined },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <a
                href={c.href}
                className={`group block rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-premium transition-all h-full ${c.href ? "cursor-pointer" : "cursor-default"}`}
              >
                <div className="grid place-items-center h-11 w-11 rounded-xl bg-muted mb-3 group-hover:scale-110 transition-transform">
                  <c.icon className="h-5 w-5 text-royal" />
                </div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{c.label}</p>
                <p className="font-semibold text-sm mt-1">{c.value}</p>
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-soft">
            <div className="flex items-center gap-3 mb-6">
              <div className="grid place-items-center h-11 w-11 rounded-xl gradient-royal text-white">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl">Send a Message</h2>
                <p className="text-xs text-muted-foreground">We&apos;ll respond within 24 hours</p>
              </div>
            </div>

            {sent ? (
              <div className="text-center py-12">
                <div className="grid place-items-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-display font-bold text-lg mb-1">Message Sent!</h3>
                <p className="text-sm text-muted-foreground mb-5">Thank you for reaching out. Our team will respond shortly.</p>
                <Button onClick={() => setSent(false)} variant="outline" className="rounded-full">
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Full Name</label>
                    <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Phone (optional)</label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-11" placeholder="+254 700 000 000" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Email</label>
                  <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Subject</label>
                  <Input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="h-11" placeholder="How can we help?" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-xl bg-background border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Tell us more…"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl gradient-royal text-white font-semibold">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Sending…</> : <><Send className="h-4 w-4 mr-2" /> Send Message</>}
                </Button>
              </form>
            )}
          </div>

          {/* Map */}
          <div id="map" className="rounded-3xl overflow-hidden border border-border shadow-soft min-h-[400px]">
            <iframe
              title="Northgate location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=36.82,-1.30,36.86,-1.26&layer=mapnik&marker=-1.28,36.84"
              className="w-full h-full min-h-[400px]"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
