"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, MapPin, Volume2 } from "lucide-react";

interface TourStop {
  title: string;
  location: string;
  description: string;
  image: string;
  duration: string;
}

const stops: TourStop[] = [
  {
    title: "Main Campus Entrance",
    location: "Northgate Avenue",
    description: "Welcome to Northgate — begin your journey at our iconic main gate.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
    duration: "0:45",
  },
  {
    title: "Engineering Workshops",
    location: "Block A · Ground Floor",
    description: "State-of-the-art workshops with lathes, CNC machines, and CAD labs.",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80",
    duration: "2:30",
  },
  {
    title: "ICT & Innovation Hub",
    location: "Block C · 2nd Floor",
    description: "Our brand-new AI & Data Centre with 8 specialised compute labs.",
    image: "https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?auto=format&fit=crop&w=1200&q=80",
    duration: "1:50",
  },
  {
    title: "Health Sciences Simulation Ward",
    location: "Block D · 1st Floor",
    description: "Clinical simulation ward where nursing students practise on high-fidelity mannequins.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    duration: "1:15",
  },
  {
    title: "Library & Learning Resource Centre",
    location: "Central Block",
    description: "20,000+ volumes, digital archives, silent study zones, and group rooms.",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
    duration: "1:00",
  },
  {
    title: "Graduation Square",
    location: "Central Plaza",
    description: "Where our 9,000+ alumni crossed the stage to begin their careers.",
    image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1200&q=80",
    duration: "0:30",
  },
];

export function CampusTourModal({
  open, onClose,
}: {
  open: boolean; onClose: () => void;
}) {
  const [activeStop, setActiveStop] = React.useState(0);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const current = stops[activeStop];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] grid place-items-center p-4 sm:p-6"
        >
          <div className="absolute inset-0 bg-navy/90 backdrop-blur-md" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-card rounded-3xl shadow-premium overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
              <div>
                <p className="text-xs uppercase tracking-widest text-gold font-semibold">Virtual Campus Tour</p>
                <p className="font-display font-bold text-lg">{current.title}</p>
              </div>
              <button
                onClick={onClose}
                className="grid place-items-center h-10 w-10 rounded-full hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video player area */}
            <div className="relative aspect-video bg-navy overflow-hidden">
              <img src={current.image} alt={current.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-navy/40" />
              {/* Play button overlay */}
              <div className="absolute inset-0 grid place-items-center">
                <button className="group grid place-items-center h-20 w-20 rounded-full glass-dark text-white hover:scale-110 transition-transform">
                  <Play className="h-8 w-8 fill-white" />
                </button>
              </div>
              {/* Location badge */}
              <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full glass-dark text-white text-xs font-medium px-3 py-1.5">
                <MapPin className="h-3 w-3 text-gold" /> {current.location}
              </div>
              {/* Duration */}
              <div className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full glass-dark text-white text-xs font-medium px-3 py-1.5">
                <Volume2 className="h-3 w-3 text-gold" /> {current.duration}
              </div>
            </div>

            {/* Description */}
            <div className="p-4 sm:p-5 border-b border-border">
              <p className="text-sm text-muted-foreground leading-relaxed">{current.description}</p>
            </div>

            {/* Tour stops navigation */}
            <div className="flex-1 overflow-y-auto scroll-premium p-4 sm:p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">
                Tour Stops ({activeStop + 1} of {stops.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {stops.map((stop, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStop(i)}
                    className={`group relative overflow-hidden rounded-xl text-left aspect-video ${
                      i === activeStop ? "ring-2 ring-royal" : "ring-1 ring-border"
                    }`}
                  >
                    <img src={stop.image} alt={stop.title} className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-[10px] text-white/70">{stop.duration}</p>
                      <p className="text-xs font-semibold text-white leading-tight line-clamp-1">{stop.title}</p>
                    </div>
                    {i === activeStop && (
                      <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-gold animate-pulse" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <button
                  onClick={() => setActiveStop((p) => (p - 1 + stops.length) % stops.length)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full bg-muted hover:bg-muted/70 transition-colors"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setActiveStop((p) => (p + 1) % stops.length)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full gradient-royal text-white hover:shadow-premium transition-shadow"
                >
                  Next stop →
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
