"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  GraduationCap,
  User,
  Building2,
  Cpu,
  Stethoscope,
  UtensilsCrossed,
  Tractor,
  Zap,
  Wrench,
  HardHat,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

interface MegaColumn {
  title: string;
  links: { label: string; href: string; desc?: string }[];
}

const departments: { label: string; icon: LucideIcon; desc: string }[] = [
  { label: "Engineering", icon: HardHat, desc: "Civil, Mechanical, Automotive" },
  { label: "ICT", icon: Cpu, desc: "Software, Networks, Cybersecurity" },
  { label: "Business", icon: Building2, desc: "Accounting, HR, Marketing" },
  { label: "Hospitality", icon: UtensilsCrossed, desc: "Culinary, Tourism, Hotel Mgmt" },
  { label: "Health Sciences", icon: Stethoscope, desc: "Nursing, Lab Tech, Pharmacy" },
  { label: "Agriculture", icon: Tractor, desc: "Agribusiness, Agronomy" },
  { label: "Electrical", icon: Zap, desc: "Power, Electronics, Solar" },
  { label: "Mechanical", icon: Wrench, desc: "Production, Plant Maintenance" },
  { label: "Building Technology", icon: GraduationCap, desc: "Construction, Surveying" },
];

const megaMenu: MegaColumn[] = [
  {
    title: "About",
    links: [
      { label: "Overview", href: "/about", desc: "Our mission & vision" },
      { label: "Leadership", href: "/about", desc: "Governance & management" },
      { label: "Campus & Facilities", href: "/#gallery", desc: "Modern labs & workshops" },
      { label: "Contact Us", href: "/contact-us", desc: "Get in touch" },
    ],
  },
  {
    title: "Academics",
    links: [
      { label: "Schools & Departments", href: "/#departments", desc: "9 academic faculties" },
      { label: "Course Catalogue", href: "/#courses", desc: "150+ programmes" },
      { label: "News & Events", href: "/#news", desc: "Latest updates" },
      { label: "Photo Gallery", href: "/#gallery", desc: "Campus life" },
    ],
  },
  {
    title: "Admissions",
    links: [
      { label: "How to Apply", href: "/apply", desc: "Online application form" },
      { label: "Tuition & Fees", href: "/fees", desc: "Fee structure & funding" },
      { label: "Download Prospectus", href: "/api/brochure", desc: "2026 PDF brochure" },
      { label: "Student Portal", href: "/portal", desc: "Login to your account" },
    ],
  },
];

export function Navigation() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [megaOpen, setMegaOpen] = React.useState<string | null>(null);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const { theme, toggleTheme } = useTheme();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems: { label: string; href: string; hasMega?: boolean }[] = [
    { label: "About", href: "/about", hasMega: true },
    { label: "Academics", href: "/#departments", hasMega: true },
    { label: "Admissions", href: "/apply", hasMega: true },
    { label: "Campus Life", href: "/#gallery", hasMega: false },
    { label: "News", href: "/#news", hasMega: false },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-nav shadow-soft" : "bg-transparent"
        }`}
        onMouseLeave={() => setMegaOpen(null)}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "h-16" : "h-20"}`}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-10 w-10 rounded-xl gradient-royal grid place-items-center shadow-soft group-hover:scale-105 transition-transform">
                <span className="font-display font-bold text-white text-lg">N</span>
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full gradient-gold ring-2 ring-background" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className={`font-display font-bold text-base sm:text-lg tracking-tight ${scrolled ? "text-foreground" : "text-white"}`}>
                  Northgate
                </span>
                <span className={`text-[10px] uppercase tracking-[0.18em] font-semibold ${scrolled ? "text-muted-foreground" : "text-white/70"}`}>
                  Institute of Technology
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => setMegaOpen(item.hasMega && megaMenu.some(m => m.title === item.label) ? item.label : null)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors flex items-center gap-1 ${
                    scrolled
                      ? "text-foreground/80 hover:text-foreground hover:bg-muted"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                  {item.hasMega && megaMenu.some(m => m.title === item.label) && (
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className={`hidden sm:grid place-items-center h-10 w-10 rounded-full transition-colors ${
                  scrolled ? "text-foreground/80 hover:bg-muted" : "text-white/80 hover:bg-white/10"
                }`}
              >
                <Search className="h-4 w-4" />
              </button>
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`hidden sm:grid place-items-center h-10 w-10 rounded-full transition-colors ${
                  scrolled ? "text-foreground/80 hover:bg-muted" : "text-white/80 hover:bg-white/10"
                }`}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <Link
                href="/portal"
                className={`hidden md:inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-full transition-colors ${
                  scrolled ? "text-foreground/80 hover:bg-muted" : "text-white/80 hover:bg-white/10"
                }`}
              >
                <User className="h-4 w-4" />
                Portal
              </Link>
              <Button
                asChild
                size="sm"
                className="hidden md:inline-flex gradient-royal text-white border-0 shadow-soft hover:shadow-premium rounded-full font-semibold"
              >
                <Link href="/apply">Apply Now</Link>
              </Button>
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className={`lg:hidden grid place-items-center h-10 w-10 rounded-full ${
                  scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"
                }`}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mega menu */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-x-0 top-full hidden lg:block"
            >
              <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-6">
                <div className="glass rounded-3xl shadow-premium p-6 grid grid-cols-12 gap-6">
                  <div className="col-span-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-2">
                      {megaOpen}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Discover everything Northgate has to offer across our {megaOpen.toLowerCase()} — from programmes to people.
                    </p>
                  </div>
                  <div className="col-span-6 grid grid-cols-3 gap-6">
                    {megaMenu.find(m => m.title === megaOpen)?.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="group block rounded-2xl p-3 -m-3 hover:bg-muted/60 transition-colors"
                      >
                        <p className="font-semibold text-sm text-foreground group-hover:text-royal transition-colors">
                          {link.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
                      </Link>
                    ))}
                  </div>
                  <div className="col-span-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                      Featured Departments
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {departments.slice(0, 6).map((d) => (
                        <Link
                          key={d.label}
                          href={`/departments/${d.label.toLowerCase().replace(/\s+/g, "-")}`}
                          className="flex items-center gap-1.5 text-xs text-foreground/70 hover:text-royal transition-colors py-1"
                        >
                          <d.icon className="h-3.5 w-3.5" />
                          {d.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="absolute right-0 top-0 bottom-0 w-[88%] max-w-sm bg-background shadow-premium overflow-y-auto scroll-premium"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <span className="font-display font-bold text-lg">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="grid place-items-center h-10 w-10 rounded-full hover:bg-muted"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-5 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-2xl text-foreground/80 hover:bg-muted font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="p-5 border-t border-border space-y-3">
                <Link href="/portal" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-muted text-foreground font-medium">
                  <User className="h-4 w-4" /> Student Portal
                </Link>
                <Button asChild className="w-full gradient-royal text-white rounded-full font-semibold">
                  <Link href="/apply" onClick={() => setMobileOpen(false)}>Apply Now</Link>
                </Button>
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl border border-border text-sm font-medium"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  Toggle theme
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4"
          >
            <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="relative w-full max-w-2xl glass rounded-3xl shadow-premium p-2"
            >
              <div className="flex items-center gap-3 px-4">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  autoFocus
                  placeholder="Search programmes, departments, events…"
                  className="flex-1 bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground"
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground border border-border rounded-md px-2 py-1">
                  ESC
                </kbd>
              </div>
              <div className="border-t border-border mt-2 p-3">
                <p className="text-xs uppercase tracking-widest text-muted-foreground px-2 mb-2">Popular</p>
                <div className="flex flex-wrap gap-2">
                  {["Electrical Engineering", "Cybersecurity", "Nursing", "Agribusiness", "Scholarships"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSearchOpen(false)}
                      className="px-3 py-1.5 rounded-full bg-muted hover:bg-muted/70 text-sm font-medium"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
