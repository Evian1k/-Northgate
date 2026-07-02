import Link from "next/link";
import { db, ensureSeeded } from "@/lib/db";
import { ArrowRight, Award, Users, Building2, Globe2 } from "lucide-react";
import { Reveal, SectionHeading, StaggerGroup } from "@/components/anim";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  await ensureSeeded();
  const settings = await db.siteSetting.findMany();
  const s: Record<string, string> = {};
  for (const setting of settings) s[setting.key] = setting.value;

  const stats = [
    { icon: Users, value: Number(s["stats.students"] || 9000), suffix: "+", label: "Current Students" },
    { icon: Award, value: Number(s["stats.programmes"] || 150), suffix: "+", label: "Accredited Programmes" },
    { icon: Building2, value: 42, suffix: "", label: "Modern Laboratories" },
    { icon: Globe2, value: 15, suffix: "", label: "Countries Recognised" },
  ];

  const milestones = [
    { year: "1964", title: "Founded", desc: "Northgate opens its doors with 3 workshops and 47 students." },
    { year: "1985", title: "Royal Charter", desc: "Granted full institutional status by the Kenyan government." },
    { year: "2002", title: "TVETA Accreditation", desc: "First TVET institution in the region to receive full TVETA accreditation." },
    { year: "2015", title: "Innovation Hub", desc: "KES 180M maker-space opens, hosting 120+ student projects annually." },
    { year: "2021", title: "UNESCO Partnership", desc: "Qualifications recognised across 15 countries under UNESCO conventions." },
    { year: "2026", title: "AI & Data Centre", desc: "KES 240M facility inaugurated, hosting 8 specialised compute labs." },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <section className="relative gradient-navy overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-royal/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-6 transition-colors">
            ← Back to homepage
          </Link>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-xs font-semibold text-gold uppercase tracking-widest mb-4">
              About Us
            </span>
            <h1 className="font-display font-bold text-white text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1]">
              Six Decades of<br /><span className="text-gradient-gold">Building Nations.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/75 max-w-3xl leading-relaxed">
              {s["site.name"] || "Northgate Institute of Technology"} is East Africa&apos;s premier TVET institution. Since 1964, we have trained over 18,500 graduates who now power industries across 15 countries.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 sm:px-6 lg:px-8 py-14">
        <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.05}>
              <div className="rounded-2xl bg-card border border-border p-6 shadow-soft text-center">
                <stat.icon className="h-7 w-7 text-gold mx-auto mb-3" />
                <p className="font-display font-bold text-3xl">
                  {stat.value.toLocaleString()}{stat.suffix}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-widest">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="px-4 sm:px-6 lg:px-8 py-14 bg-muted/40">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Our Mission"
            title="Building Tomorrow's"
            highlight="Skilled Professionals"
            subtitle="Through world-class workshops, industry partnerships, and hands-on mastery, we launch careers that shape nations."
          />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            <Reveal>
              <div className="rounded-3xl bg-card border border-border p-6 shadow-soft h-full">
                <h3 className="font-display font-bold text-lg mb-2">Pedagogy</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  70% practical, 30% theory. Our students spend the majority of their time in workshops, labs, and on industry placements — building muscle memory from day one.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-3xl bg-card border border-border p-6 shadow-soft h-full">
                <h3 className="font-display font-bold text-lg mb-2">Partnerships</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  80+ industry partners co-design our curricula, host our students for placements, and hire our graduates. Their input keeps our programmes relevant.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="rounded-3xl bg-card border border-border p-6 shadow-soft h-full">
                <h3 className="font-display font-bold text-lg mb-2">Recognition</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  UNESCO-anchored qualifications recognised across 15 countries. Accredited by TVETA, CDACC, and partnered with HELB and KUCCPS.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Our Journey"
            title="Six Decades of"
            highlight="Milestones"
            subtitle="From a single workshop in 1964 to a 9,000-student institution recognised across East Africa."
          />
          <div className="mt-12 relative">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-border sm:-translate-x-px" />
            <StaggerGroup className="space-y-8">
              {milestones.map((m, i) => (
                <Reveal key={m.year} delay={i * 0.05}>
                  <div className={`relative flex ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"} items-start gap-6`}>
                    <div className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 h-3 w-3 rounded-full bg-gold ring-4 ring-background z-10 mt-2" />
                    <div className={`pl-12 sm:pl-0 sm:w-1/2 ${i % 2 === 0 ? "sm:pr-8 sm:text-right" : "sm:pl-8"}`}>
                      <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
                        <span className="font-display font-bold text-2xl text-gradient-gold">{m.year}</span>
                        <h3 className="font-display font-bold text-base mt-1">{m.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{m.desc}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mx-auto max-w-4xl rounded-3xl gradient-royal p-8 sm:p-12 text-white text-center shadow-premium">
          <h2 className="font-display font-bold text-2xl sm:text-3xl mb-3">Join the Northgate Family</h2>
          <p className="text-white/75 max-w-lg mx-auto mb-6">
            Become part of a 60-year legacy. Admissions for the {s["admissions.intake"] || "September 2026"} intake are now open.
          </p>
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 rounded-full gradient-gold text-navy px-7 py-3.5 font-bold hover:scale-[1.03] transition-transform"
          >
            Apply Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
