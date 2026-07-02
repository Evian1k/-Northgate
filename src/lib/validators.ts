/**
 * Zod validation schemas shared between client & server.
 */
import { z } from "zod";

export const emailSchema = z.string().email().max(254).transform((s) => s.toLowerCase().trim());
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/\d/, "Must contain a digit")
  .regex(/[^A-Za-z0-9]/, "Must contain a symbol");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
  remember: z.boolean().optional().default(false),
});

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1),
});

export const departmentSchema = z.object({
  name: z.string().min(2).max(100),
  tagline: z.string().min(2).max(200),
  description: z.string().max(5000).optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  accentColor: z.string().max(20).optional().nullable(),
  sortOrder: z.number().int().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
});

export const programmeSchema = z.object({
  code: z.string().min(2).max(50),
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  departmentId: z.string().min(1),
  qualification: z.enum(["Certificate", "Diploma", "Higher Diploma", "Degree", "Short Course"]),
  duration: z.string().min(1).max(50),
  durationMonths: z.number().int().min(1).max(72),
  mode: z.enum(["FULL_TIME", "PART_TIME", "EVENING", "ONLINE"]).default("FULL_TIME"),
  fee: z.number().int().min(0),
  currency: z.string().max(10).default("KES"),
  intake: z.string().max(50).default("September"),
  requirements: z.array(z.string()).optional().default([]),
  careerPaths: z.array(z.string()).optional().default([]),
  imageUrl: z.string().url().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const newsSchema = z.object({
  title: z.string().min(3).max(200),
  excerpt: z.string().min(3).max(500),
  content: z.string().min(10).max(50000),
  category: z.enum(["Latest News", "Upcoming Events", "Research", "Innovation", "Conferences"]).default("Latest News"),
  imageUrl: z.string().url().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.string().datetime().optional().nullable(),
  scheduledAt: z.string().datetime().optional().nullable(),
  readTime: z.number().int().min(1).max(60).default(3),
  tags: z.array(z.string()).optional().default([]),
  featured: z.boolean().default(false),
});

export const eventSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(3).max(2000),
  category: z.enum(["Upcoming Events", "Conferences"]).default("Upcoming Events"),
  location: z.string().max(200).optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
  capacity: z.number().int().min(1).max(10000).optional().nullable(),
});

export const testimonialSchema = z.object({
  name: z.string().min(2).max(100),
  role: z.string().min(2).max(200),
  type: z.enum(["student", "employer", "graduate"]).default("student"),
  quote: z.string().min(10).max(2000),
  avatarUrl: z.string().url().optional().nullable(),
  org: z.string().max(200).optional().nullable(),
  rating: z.number().int().min(1).max(5).default(5),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
  sortOrder: z.number().int().default(0),
});

export const partnerSchema = z.object({
  name: z.string().min(2).max(100),
  short: z.string().min(2).max(300),
  logoUrl: z.string().url().optional().nullable(),
  website: z.string().url().optional().nullable(),
  category: z.enum(["ACCREDITATION", "INDUSTRY", "GOVERNMENT"]).default("ACCREDITATION"),
  sortOrder: z.number().int().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
});

export const galleryImageSchema = z.object({
  title: z.string().min(2).max(200),
  alt: z.string().min(2).max(300),
  imageUrl: z.string().url(),
  category: z.string().max(50).default("Campus Life"),
  width: z.number().int().optional().nullable(),
  height: z.number().int().optional().nullable(),
  sortOrder: z.number().int().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
});

export const applicationSchema = z.object({
  firstName: z.string().min(2).max(80),
  lastName: z.string().min(2).max(80),
  email: emailSchema,
  phone: z.string().min(7).max(20),
  programmeId: z.string().min(1),
  intake: z.string().max(50),
  qualification: z.string().max(200).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export const contactMessageSchema = z.object({
  name: z.string().min(2).max(100),
  email: emailSchema,
  phone: z.string().max(20).optional().nullable(),
  subject: z.string().min(2).max(200),
  message: z.string().min(5).max(5000),
});

export const newsletterSchema = z.object({
  email: emailSchema,
});
