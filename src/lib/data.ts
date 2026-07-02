/**
 * Data access layer for public homepage content.
 * Tries database first, falls back to hardcoded demo data.
 */
import { db, ensureSeeded } from "@/lib/db";
import { cache } from "react";
import {
  demoSiteSettings, demoDepartments, demoProgrammes, demoTestimonials,
  demoNews, demoGallery, demoPartners,
} from "@/lib/demo-data";

async function withFallback<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    await ensureSeeded();
    const result = await fn();
    if (!result || (Array.isArray(result) && result.length === 0)) return fallback;
    return result;
  } catch {
    return fallback;
  }
}

export const getSiteSettings = cache(async () => {
  return withFallback(async () => {
    const settings = await db.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    if (Object.keys(map).length === 0) return demoSiteSettings;
    return map;
  }, demoSiteSettings);
});

export const getPublishedDepartments = cache(async () => {
  return withFallback(async () => {
    return db.department.findMany({
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { _count: { select: { programmes: { where: { deletedAt: null, status: "PUBLISHED" } } } } },
    });
  }, [] as any[]);
});

export const getPublishedProgrammes = cache(async () => {
  return withFallback(async () => {
    return db.programme.findMany({
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
      include: { department: { select: { name: true, slug: true } } },
    });
  }, [] as any[]);
});

export const getPublishedNews = cache(async (limit = 5) => {
  return withFallback(async () => {
    return db.news.findMany({
      where: { deletedAt: null, status: "PUBLISHED", publishedAt: { lte: new Date() } },
      orderBy: [{ publishedAt: "desc" }],
      take: limit,
      include: { author: { select: { name: true } } },
    });
  }, [] as any[]);
});

export const getPublishedEvents = cache(async (limit = 5) => {
  return withFallback(async () => {
    return db.event.findMany({
      where: { deletedAt: null, status: "PUBLISHED", startDate: { gte: new Date() } },
      orderBy: [{ startDate: "asc" }],
      take: limit,
    });
  }, [] as any[]);
});

export const getPublishedTestimonials = cache(async () => {
  return withFallback(async () => {
    return db.testimonial.findMany({
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  }, [] as any[]);
});

export const getPublishedPartners = cache(async () => {
  return withFallback(async () => {
    return db.partner.findMany({
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  }, [] as any[]);
});

export const getPublishedGallery = cache(async () => {
  return withFallback(async () => {
    return db.galleryImage.findMany({
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  }, [] as any[]);
});

export function parseJsonArray(s: string | null | undefined): string[] {
  if (!s) return [];
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
