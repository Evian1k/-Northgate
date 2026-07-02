/**
 * Data access layer for public homepage content.
 * Server-side only — calls Prisma directly.
 * Auto-seeds the database on first access.
 */
import { db, ensureSeeded } from "@/lib/db";
import { cache } from "react";

async function withSeed<T>(fn: () => Promise<T>): Promise<T> {
  await ensureSeeded();
  return fn();
}

export const getSiteSettings = cache(async () => {
  return withSeed(async () => {
    const settings = await db.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    return map;
  });
});

export const getPublishedDepartments = cache(async () => {
  return withSeed(async () => {
    return db.department.findMany({
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        _count: { select: { programmes: { where: { deletedAt: null, status: "PUBLISHED" } } } },
      },
    });
  });
});

export const getPublishedProgrammes = cache(async () => {
  return withSeed(async () => {
    return db.programme.findMany({
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
      include: { department: { select: { name: true, slug: true } } },
    });
  });
});

export const getFeaturedProgrammes = cache(async (limit = 6) => {
  return withSeed(async () => {
    return db.programme.findMany({
      where: { deletedAt: null, status: "PUBLISHED", featured: true },
      orderBy: [{ sortOrder: "asc" }],
      take: limit,
      include: { department: { select: { name: true } } },
    });
  });
});

export const getPublishedNews = cache(async (limit = 5) => {
  return withSeed(async () => {
    return db.news.findMany({
      where: {
        deletedAt: null,
        status: "PUBLISHED",
        publishedAt: { lte: new Date() },
      },
      orderBy: [{ publishedAt: "desc" }],
      take: limit,
      include: { author: { select: { name: true } } },
    });
  });
});

export const getPublishedEvents = cache(async (limit = 5) => {
  return withSeed(async () => {
    return db.event.findMany({
      where: {
        deletedAt: null,
        status: "PUBLISHED",
        startDate: { gte: new Date() },
      },
      orderBy: [{ startDate: "asc" }],
      take: limit,
    });
  });
});

export const getPublishedTestimonials = cache(async () => {
  return withSeed(async () => {
    return db.testimonial.findMany({
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  });
});

export const getPublishedPartners = cache(async () => {
  return withSeed(async () => {
    return db.partner.findMany({
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  });
});

export const getPublishedGallery = cache(async () => {
  return withSeed(async () => {
    return db.galleryImage.findMany({
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  });
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
