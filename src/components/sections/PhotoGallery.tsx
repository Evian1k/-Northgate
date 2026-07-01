"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/anim";

interface Photo {
  src: string;
  alt: string;
  span: string; // tailwind classes for masonry size
}

const photos: Photo[] = [
  {
    src: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=800&q=80",
    alt: "Engineering students at work",
    span: "row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?auto=format&fit=crop&w=600&q=80",
    alt: "Computer lab session",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=600&q=80",
    alt: "Graduation ceremony",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
    alt: "Library reading",
    span: "row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80",
    alt: "Workshop training",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=600&q=80",
    alt: "Health sciences simulation",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
    alt: "Campus aerial view",
    span: "row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=600&q=80",
    alt: "Culinary class",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=600&q=80",
    alt: "Sports and student life",
    span: "",
  },
];

export function PhotoGallery() {
  const [active, setActive] = React.useState<number | null>(null);

  const close = () => setActive(null);
  const next = () => setActive((p) => (p === null ? p : (p + 1) % photos.length));
  const prev = () => setActive((p) => (p === null ? p : (p - 1 + photos.length) % photos.length));

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (active === null) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <section className="relative py-24 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Photo Gallery"
          title="Life at"
          highlight="Northgate"
          subtitle="A glimpse into our workshops, labs, ceremonies and everyday campus life — where future professionals are made."
        />

        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[160px] sm:auto-rows-[180px] gap-3 sm:gap-4">
          {photos.map((p, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
              onClick={() => setActive(i)}
              className={`group relative overflow-hidden rounded-2xl ${p.span} cursor-zoom-in`}
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/0 to-navy/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                <p className="text-white text-xs font-medium line-clamp-2">{p.alt}</p>
              </div>
              <span className="absolute top-3 right-3 grid place-items-center h-8 w-8 rounded-full glass-dark text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="h-4 w-4" />
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] grid place-items-center p-4 sm:p-8"
          >
            <div className="absolute inset-0 bg-navy/90 backdrop-blur-md" onClick={close} />
            <button
              onClick={close}
              className="absolute top-5 right-5 grid place-items-center h-11 w-11 rounded-full glass-dark text-white hover:bg-white/15 z-10"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={prev}
              className="absolute left-3 sm:left-5 grid place-items-center h-11 w-11 rounded-full glass-dark text-white hover:bg-white/15 z-10"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 sm:right-5 grid place-items-center h-11 w-11 rounded-full glass-dark text-white hover:bg-white/15 z-10"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl"
            >
              <img
                src={photos[active].src.replace("w=600", "w=1400").replace("w=800", "w=1400")}
                alt={photos[active].alt}
                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
              />
              <p className="text-center text-white/80 text-sm mt-4">{photos[active].alt}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
