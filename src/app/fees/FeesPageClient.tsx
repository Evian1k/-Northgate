"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Wallet, Calendar, CreditCard, Landmark, FileText,
  HelpCircle, Download, ArrowRight, type LucideIcon,
} from "lucide-react";
import { Reveal, SectionHeading, StaggerGroup, staggerItem } from "@/components/anim";

interface Programme {
  code: string; title: string; department: string;
  qualification: string; duration: string;
  fee: number; currency: string;
}

const paymentMethods: { icon: LucideIcon; name: string; desc: string }[] = [
  { icon: CreditCard, name: "Card Payment", desc: "Visa / Mastercard via our secure online portal" },
  { icon: Landmark, name: "Bank Transfer", desc: "Direct deposit to Northgate's equity account" },
  { icon: Wallet, name: "M-Pesa", desc: "Paybill 522522 · Account: NG-<Your Admission No.>" },
  { icon: Calendar, name: "Installment Plan", desc: "3 installments per semester, 0% interest" },
];

const faqs = [
  { q: "When are fees due?", a: "Tuition is payable before the start of each semester. Installment plans require the first payment (40%) before classes begin." },
  { q: "Are there hidden charges?", a: "No. The fees listed below are inclusive of tuition, lab access, and workshop materials. Optional items (graduation, field trips) are billed separately." },
  { q: "Can I get a refund?", a: "Refunds are available within the first 14 days of a semester on a pro-rata basis. After 14 days, fees are non-refundable." },
  { q: "What about HELB?", a: "We accept HELB disbursements directly. Indicate HELB funding on your application and our finance office will follow up." },
];

export function FeesPageClient({
  programmes, phone, email,
}: {
  programmes: Programme[]; phone: string; email: string;
}) {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("ALL");

  const filtered = programmes.filter((p) => {
    if (filter !== "ALL" && p.qualification !== filter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.code.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <section className="relative gradient-navy overflow-hidden py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-royal/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to homepage
          </Link>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-xs font-semibold text-gold uppercase tracking-widest mb-4">
              <Wallet className="h-3.5 w-3.5" /> Fee Structure
            </span>
            <h1 className="font-display font-bold text-white text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1]">
              Transparent Tuition,<br /><span className="text-gradient-gold">No Surprises.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/75 max-w-2xl">
              Every fee is listed upfront. Flexible payment plans, HELB support, and merit scholarships available.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Payment methods */}
      <section className="px-4 sm:px-6 lg:px-8 py-14">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            align="left"
            eyebrow="Payment Options"
            title="Pay How"
            highlight="Suits You"
            subtitle="Four convenient payment methods. All transactions are secured and receipted instantly."
          />
          <StaggerGroup className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentMethods.map((m) => (
              <motion.div key={m.name} variants={staggerItem} className="rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-premium transition-shadow">
                <div className="grid place-items-center h-11 w-11 rounded-xl bg-muted mb-3">
                  <m.icon className="h-5 w-5 text-royal" />
                </div>
                <p className="font-semibold text-sm">{m.name}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Fees table */}
      <section className="px-4 sm:px-6 lg:px-8 pb-14">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            align="left"
            eyebrow="Programme Fees"
            title="Per-Programme"
            highlight="Pricing"
            subtitle="Annual tuition fees for all accredited programmes. All amounts in KES."
          />

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by programme name or code…"
              className="flex-1 h-11 rounded-xl bg-card border border-border px-4 text-sm"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-11 rounded-xl bg-card border border-border px-3 text-sm font-medium"
            >
              <option value="ALL">All Levels</option>
              <option value="Certificate">Certificate</option>
              <option value="Diploma">Diploma</option>
              <option value="Higher Diploma">Higher Diploma</option>
              <option value="Degree">Degree</option>
            </select>
            <a
              href="/api/brochure"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl gradient-royal text-white px-5 h-11 font-semibold text-sm"
            >
              <Download className="h-4 w-4" /> Prospectus
            </a>
          </div>

          <div className="mt-6 rounded-3xl bg-card border border-border shadow-soft overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Code</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Programme</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Department</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Level</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Duration</th>
                  <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Annual Fee</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <motion.tr
                    key={p.code}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.4) }}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3"><span className="font-mono text-xs font-bold text-gold">{p.code}</span></td>
                    <td className="px-4 py-3 font-semibold">{p.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.department}</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-muted">{p.qualification}</span></td>
                    <td className="px-4 py-3 text-muted-foreground">{p.duration}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold">{p.currency} {p.fee.toLocaleString()}</td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                      No programmes match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            * Fees are reviewed annually. Amounts shown are for the {new Date().getFullYear()} academic year. Additional charges may apply for optional services.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16 bg-muted/40 py-16">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="FAQ"
            title="Fees"
            highlight="Explained"
            subtitle="Answers to the most common questions about tuition and payments."
          />
          <div className="mt-8 space-y-3">
            {faqs.map((f, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <details className="group rounded-2xl bg-card border border-border p-5 shadow-soft cursor-pointer">
                  <summary className="flex items-center justify-between gap-3 font-semibold list-none">
                    <span className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-gold" /> {f.q}
                    </span>
                    <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 rounded-3xl gradient-royal p-8 text-white text-center shadow-premium">
            <FileText className="h-8 w-8 text-gold mx-auto mb-3" />
            <h3 className="font-display font-bold text-xl mb-2">Need help with fees?</h3>
            <p className="text-white/75 text-sm max-w-md mx-auto mb-5">
              Our finance team is available Monday–Friday, 8 AM – 5 PM EAT.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
              <a href={`tel:${phone}`} className="inline-flex items-center gap-1.5 hover:text-gold transition-colors">
                <Wallet className="h-4 w-4" /> {phone}
              </a>
              <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 hover:text-gold transition-colors">
                <FileText className="h-4 w-4" /> {email}
              </a>
            </div>
            <Link
              href="/apply"
              className="mt-5 inline-flex items-center gap-2 rounded-full gradient-gold text-navy px-6 py-3 font-bold hover:scale-[1.03] transition-transform"
            >
              Apply Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
