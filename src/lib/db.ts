import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaSeeded: boolean | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/**
 * Auto-seed the database on first access.
 * Creates schema + demo data if DB is empty.
 * Non-fatal — if it fails, pages show empty states gracefully.
 * Uses a mutex to prevent concurrent seeding (React strict mode).
 */
let seedPromise: Promise<void> | null = null;

export async function ensureSeeded() {
  if (globalForPrisma.prismaSeeded) return;
  if (process.env.AUTO_SEED === "false") return;

  // Use a shared promise so concurrent calls wait for the same seed
  if (!seedPromise) {
    seedPromise = doSeed();
  }
  await seedPromise;
}

async function doSeed() {
  try {
    // Check if schema exists by trying a count
    let count: number;
    try {
      count = await db.user.count();
    } catch {
      // Schema doesn't exist yet — create it via raw SQL
      await createSchemaRaw();
      count = 0;
    }

    if (count > 0) {
      globalForPrisma.prismaSeeded = true;
      return;
    }

    // Run seeders inline
    const { seedDemoData } = await import("@/lib/auto-seed");
    await seedDemoData(db);
    console.log("[auto-seed] Demo data created successfully.");
    globalForPrisma.prismaSeeded = true;
  } catch (e) {
    console.error("[auto-seed] Failed (non-fatal):", e);
    globalForPrisma.prismaSeeded = true; // Don't keep retrying
  }
}

/**
 * Create database schema using raw SQL (for serverless environments
 * where `prisma db push` CLI isn't available at runtime).
 * Uses SQLite-compatible DDL.
 */
async function createSchemaRaw() {
  console.log("[db] Creating schema via raw SQL...");

  const statements = [
    `CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "email" TEXT NOT NULL UNIQUE,
      "emailNormalized" TEXT NOT NULL UNIQUE,
      "name" TEXT NOT NULL,
      "passwordHash" TEXT,
      "image" TEXT,
      "phone" TEXT,
      "role" TEXT NOT NULL DEFAULT 'STUDENT',
      "status" TEXT NOT NULL DEFAULT 'ACTIVE',
      "emailVerifiedAt" DATETIME,
      "lastLoginAt" DATETIME,
      "lastLoginIp" TEXT,
      "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
      "lockedUntil" DATETIME,
      "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
      "twoFactorSecret" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      "deletedAt" DATETIME
    )`,
    `CREATE TABLE IF NOT EXISTS "Department" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "name" TEXT NOT NULL UNIQUE,
      "slug" TEXT NOT NULL UNIQUE,
      "tagline" TEXT NOT NULL,
      "description" TEXT,
      "icon" TEXT,
      "imageUrl" TEXT,
      "accentColor" TEXT,
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      "deletedAt" DATETIME
    )`,
    `CREATE TABLE IF NOT EXISTS "Programme" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "code" TEXT NOT NULL UNIQUE,
      "title" TEXT NOT NULL,
      "slug" TEXT NOT NULL UNIQUE,
      "description" TEXT NOT NULL,
      "departmentId" TEXT NOT NULL,
      "qualification" TEXT NOT NULL,
      "duration" TEXT NOT NULL,
      "durationMonths" INTEGER NOT NULL,
      "mode" TEXT NOT NULL DEFAULT 'FULL_TIME',
      "fee" INTEGER NOT NULL DEFAULT 0,
      "currency" TEXT NOT NULL DEFAULT 'KES',
      "intake" TEXT NOT NULL DEFAULT 'September',
      "requirements" TEXT,
      "careerPaths" TEXT,
      "imageUrl" TEXT,
      "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
      "featured" BOOLEAN NOT NULL DEFAULT false,
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      "deletedAt" DATETIME,
      FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT
    )`,
    `CREATE TABLE IF NOT EXISTS "Semester" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "name" TEXT NOT NULL UNIQUE,
      "code" TEXT NOT NULL UNIQUE,
      "startDate" DATETIME NOT NULL,
      "endDate" DATETIME NOT NULL,
      "isCurrent" BOOLEAN NOT NULL DEFAULT false,
      "academicYear" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "Unit" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "code" TEXT NOT NULL UNIQUE,
      "title" TEXT NOT NULL,
      "description" TEXT,
      "credits" INTEGER NOT NULL DEFAULT 1,
      "departmentId" TEXT NOT NULL,
      "semesterId" TEXT,
      "instructor" TEXT,
      "year" INTEGER NOT NULL DEFAULT 1,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE,
      FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE SET NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "Student" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "userId" TEXT NOT NULL UNIQUE,
      "admissionNo" TEXT NOT NULL UNIQUE,
      "programmeId" TEXT,
      "year" INTEGER NOT NULL DEFAULT 1,
      "semester" INTEGER NOT NULL DEFAULT 1,
      "status" TEXT NOT NULL DEFAULT 'ACTIVE',
      "enrollmentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "gender" TEXT,
      "dateOfBirth" DATETIME,
      "nationality" TEXT,
      "idNumber" TEXT,
      "phone" TEXT,
      "address" TEXT,
      "nextOfKin" TEXT,
      "nextOfKinPhone" TEXT,
      "profileImageUrl" TEXT,
      "profileComplete" INTEGER NOT NULL DEFAULT 40,
      "currentGPA" REAL NOT NULL DEFAULT 0,
      "attendanceRate" REAL NOT NULL DEFAULT 0,
      "overallProgress" INTEGER NOT NULL DEFAULT 0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
      FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE SET NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "Enrollment" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "studentId" TEXT NOT NULL,
      "unitId" TEXT NOT NULL,
      "semesterId" TEXT,
      "status" TEXT NOT NULL DEFAULT 'ENROLLED',
      "enrolledAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE,
      FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE,
      FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE SET NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "Assessment" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "unitId" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "type" TEXT NOT NULL DEFAULT 'ASSIGNMENT',
      "description" TEXT,
      "maxMarks" INTEGER NOT NULL DEFAULT 100,
      "weight" REAL NOT NULL DEFAULT 1.0,
      "dueDate" DATETIME NOT NULL,
      "semesterId" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE,
      FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE SET NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "Submission" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "assessmentId" TEXT NOT NULL,
      "studentId" TEXT NOT NULL,
      "submittedAt" DATETIME,
      "marks" INTEGER,
      "feedback" TEXT,
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "fileUrl" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE,
      FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS "Attendance" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "studentId" TEXT NOT NULL,
      "unitId" TEXT NOT NULL,
      "date" DATETIME NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'PRESENT',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE,
      FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS "Result" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "studentId" TEXT NOT NULL,
      "unitId" TEXT NOT NULL,
      "semesterId" TEXT,
      "marks" INTEGER NOT NULL,
      "grade" TEXT NOT NULL,
      "gpa" REAL NOT NULL,
      "releasedAt" DATETIME,
      "status" TEXT NOT NULL DEFAULT 'DRAFT',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE,
      FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE,
      FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE SET NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "Fee" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "studentId" TEXT NOT NULL,
      "semesterId" TEXT,
      "type" TEXT NOT NULL,
      "amount" INTEGER NOT NULL,
      "dueDate" DATETIME NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE,
      FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE SET NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "Payment" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "feeId" TEXT NOT NULL,
      "studentId" TEXT NOT NULL,
      "amount" INTEGER NOT NULL,
      "method" TEXT NOT NULL DEFAULT 'MPESA',
      "reference" TEXT NOT NULL UNIQUE,
      "paidAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("feeId") REFERENCES "Fee"("id") ON DELETE CASCADE,
      FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS "ExamCard" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "studentId" TEXT NOT NULL,
      "semesterId" TEXT,
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "issuedAt" DATETIME,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE,
      FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE SET NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "LibraryBook" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "title" TEXT NOT NULL,
      "author" TEXT NOT NULL,
      "isbn" TEXT,
      "category" TEXT NOT NULL DEFAULT 'General',
      "totalCopies" INTEGER NOT NULL DEFAULT 1,
      "availableCopies" INTEGER NOT NULL DEFAULT 1,
      "coverUrl" TEXT,
      "description" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "BookLoan" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "bookId" TEXT NOT NULL,
      "studentId" TEXT NOT NULL,
      "borrowedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "dueAt" DATETIME NOT NULL,
      "returnedAt" DATETIME,
      "status" TEXT NOT NULL DEFAULT 'ACTIVE',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("bookId") REFERENCES "LibraryBook"("id") ON DELETE CASCADE,
      FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS "Hostel" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "name" TEXT NOT NULL UNIQUE,
      "block" TEXT NOT NULL,
      "gender" TEXT NOT NULL DEFAULT 'ANY',
      "capacity" INTEGER NOT NULL,
      "occupied" INTEGER NOT NULL DEFAULT 0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "HostelAllocation" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "studentId" TEXT NOT NULL UNIQUE,
      "hostelId" TEXT NOT NULL,
      "roomNo" TEXT NOT NULL,
      "allocatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE,
      FOREIGN KEY ("hostelId") REFERENCES "Hostel"("id") ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS "News" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "title" TEXT NOT NULL,
      "slug" TEXT NOT NULL UNIQUE,
      "excerpt" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "category" TEXT NOT NULL DEFAULT 'Latest News',
      "imageUrl" TEXT,
      "authorId" TEXT,
      "status" TEXT NOT NULL DEFAULT 'DRAFT',
      "publishedAt" DATETIME,
      "scheduledAt" DATETIME,
      "readTime" INTEGER NOT NULL DEFAULT 3,
      "tags" TEXT,
      "views" INTEGER NOT NULL DEFAULT 0,
      "featured" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      "deletedAt" DATETIME,
      FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "Event" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "title" TEXT NOT NULL,
      "slug" TEXT NOT NULL UNIQUE,
      "description" TEXT NOT NULL,
      "category" TEXT NOT NULL DEFAULT 'Upcoming Events',
      "location" TEXT,
      "imageUrl" TEXT,
      "startDate" DATETIME NOT NULL,
      "endDate" DATETIME,
      "authorId" TEXT,
      "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
      "capacity" INTEGER,
      "registered" INTEGER NOT NULL DEFAULT 0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      "deletedAt" DATETIME,
      FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "Testimonial" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "name" TEXT NOT NULL,
      "role" TEXT NOT NULL,
      "type" TEXT NOT NULL DEFAULT 'student',
      "quote" TEXT NOT NULL,
      "avatarUrl" TEXT,
      "org" TEXT,
      "rating" INTEGER NOT NULL DEFAULT 5,
      "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      "deletedAt" DATETIME
    )`,
    `CREATE TABLE IF NOT EXISTS "Partner" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "name" TEXT NOT NULL,
      "short" TEXT NOT NULL,
      "logoUrl" TEXT,
      "website" TEXT,
      "category" TEXT NOT NULL DEFAULT 'ACCREDITATION',
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      "deletedAt" DATETIME
    )`,
    `CREATE TABLE IF NOT EXISTS "GalleryImage" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "title" TEXT NOT NULL,
      "alt" TEXT NOT NULL,
      "imageUrl" TEXT NOT NULL,
      "category" TEXT NOT NULL DEFAULT 'Campus Life',
      "width" INTEGER,
      "height" INTEGER,
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      "deletedAt" DATETIME
    )`,
    `CREATE TABLE IF NOT EXISTS "Application" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "reference" TEXT NOT NULL UNIQUE,
      "userId" TEXT,
      "firstName" TEXT NOT NULL,
      "lastName" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "phone" TEXT NOT NULL,
      "programmeId" TEXT NOT NULL,
      "intake" TEXT NOT NULL,
      "qualification" TEXT,
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "notes" TEXT,
      "metadata" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL,
      FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE RESTRICT
    )`,
    `CREATE TABLE IF NOT EXISTS "ContactMessage" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "phone" TEXT,
      "subject" TEXT NOT NULL,
      "message" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'NEW',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "NewsletterSubscriber" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "email" TEXT NOT NULL UNIQUE,
      "status" TEXT NOT NULL DEFAULT 'ACTIVE',
      "token" TEXT NOT NULL UNIQUE,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "SiteSetting" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "key" TEXT NOT NULL UNIQUE,
      "value" TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "Announcement" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "title" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "audience" TEXT NOT NULL DEFAULT 'ALL',
      "category" TEXT NOT NULL DEFAULT 'General',
      "authorId" TEXT,
      "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "Notification" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "studentId" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "message" TEXT NOT NULL,
      "type" TEXT NOT NULL DEFAULT 'INFO',
      "link" TEXT,
      "readAt" DATETIME,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS "Message" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "fromStudentId" TEXT,
      "toStudentId" TEXT,
      "fromUserId" TEXT,
      "subject" TEXT NOT NULL,
      "body" TEXT NOT NULL,
      "readAt" DATETIME,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("fromStudentId") REFERENCES "Student"("id") ON DELETE CASCADE,
      FOREIGN KEY ("toStudentId") REFERENCES "Student"("id") ON DELETE CASCADE,
      FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE SET NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "AuditLog" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "userId" TEXT,
      "action" TEXT NOT NULL,
      "resource" TEXT NOT NULL,
      "resourceId" TEXT,
      "metadata" TEXT,
      "ip" TEXT,
      "userAgent" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "RefreshToken" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "userId" TEXT NOT NULL,
      "token" TEXT NOT NULL UNIQUE,
      "expiresAt" DATETIME NOT NULL,
      "revokedAt" DATETIME,
      "ip" TEXT,
      "userAgent" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS "PasswordReset" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "email" TEXT NOT NULL,
      "token" TEXT NOT NULL UNIQUE,
      "expiresAt" DATETIME NOT NULL,
      "usedAt" DATETIME,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "EmailVerification" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "userId" TEXT NOT NULL,
      "token" TEXT NOT NULL UNIQUE,
      "expiresAt" DATETIME NOT NULL,
      "usedAt" DATETIME,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
    )`,
  ];

  for (const sql of statements) {
    try {
      await db.$executeRawUnsafe(sql);
    } catch (e) {
      // Table might already exist — ignore
    }
  }

  console.log("[db] Schema created via raw SQL.");
}
