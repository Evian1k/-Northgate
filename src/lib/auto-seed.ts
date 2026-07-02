/**
 * Auto-seed: creates demo data on first DB access.
 * Called from ensureSeeded() in db.ts.
 * Idempotent — safe to run multiple times.
 */
import bcrypt from "bcryptjs";
import type { PrismaClient } from "@prisma/client";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function daysFromNow(days: number) { return new Date(Date.now() + days * 86400000); }
function daysAgo(days: number) { return new Date(Date.now() - days * 86400000); }

export async function seedDemoData(db: PrismaClient) {
  console.log("[auto-seed] Creating demo data...");

  // ── Admin & Editor ─────────────────────────────────────────
  const adminPwd = await bcrypt.hash("Admin@2026", 12);
  const editorPwd = await bcrypt.hash("Editor@2026", 12);
  const studentPwd = await bcrypt.hash("Student@2026", 12);

  const admin = await db.user.upsert({
    where: { emailNormalized: "admin@northgate.ac.ke" },
    update: {},
    create: {
      email: "admin@northgate.ac.ke", emailNormalized: "admin@northgate.ac.ke",
      name: "System Administrator", passwordHash: adminPwd,
      role: "ADMIN", status: "ACTIVE", emailVerifiedAt: new Date(),
    },
  });

  const editor = await db.user.upsert({
    where: { emailNormalized: "editor@northgate.ac.ke" },
    update: {},
    create: {
      email: "editor@northgate.ac.ke", emailNormalized: "editor@northgate.ac.ke",
      name: "Content Editor", passwordHash: editorPwd,
      role: "EDITOR", status: "ACTIVE", emailVerifiedAt: new Date(),
    },
  });

  // ── Site Settings ──────────────────────────────────────────
  const settings = [
    { key: "site.name", value: "Northgate Institute of Technology" },
    { key: "site.tagline", value: "Building Tomorrow's Skilled Professionals" },
    { key: "site.phone", value: "+254 700 000 000" },
    { key: "site.email", value: "admissions@northgate.ac.ke" },
    { key: "site.address", value: "Northgate Avenue, Off Mombasa Road, Nairobi, Kenya" },
    { key: "admissions.intake", value: "September 2026" },
    { key: "admissions.deadline", value: "15 August 2026" },
    { key: "stats.students", value: "9000" },
    { key: "stats.programmes", value: "150" },
    { key: "stats.employability", value: "96" },
    { key: "stats.years", value: "60" },
  ];
  for (const s of settings) {
    await db.siteSetting.upsert({ where: { key: s.key }, update: {}, create: s });
  }

  // ── Departments ────────────────────────────────────────────
  const deptData = [
    { name: "Engineering", tagline: "Civil · Mechanical · Automotive" },
    { name: "ICT", tagline: "Software · Networks · Cybersecurity" },
    { name: "Business", tagline: "Accounting · HR · Marketing" },
    { name: "Hospitality", tagline: "Culinary · Tourism · Hotel Mgmt" },
    { name: "Health Sciences", tagline: "Nursing · Lab Tech · Pharmacy" },
    { name: "Agriculture", tagline: "Agribusiness · Agronomy" },
    { name: "Electrical", tagline: "Power · Electronics · Solar" },
    { name: "Mechanical", tagline: "Production · Plant Maintenance" },
    { name: "Building Technology", tagline: "Construction · Surveying" },
  ];

  const departments: Record<string, any> = {};
  for (const d of deptData) {
    const slug = slugify(d.name);
    departments[slug] = await db.department.upsert({
      where: { slug },
      update: {},
      create: {
        ...d, slug,
        description: `The ${d.name} department at Northgate delivers world-class technical training.`,
        imageUrl: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80",
        status: "PUBLISHED",
      },
    });
  }

  // ── Programmes ─────────────────────────────────────────────
  const programmeData = [
    { code: "CIV/4/1", title: "Diploma in Civil Engineering", deptSlug: "engineering", qual: "Diploma", dur: "3 years", months: 36, fee: 88000 },
    { code: "SWE/5/1", title: "Diploma in Software Engineering", deptSlug: "ict", qual: "Diploma", dur: "2 years", months: 24, fee: 95000 },
    { code: "BUS/4/1", title: "Diploma in Business Management", deptSlug: "business", qual: "Diploma", dur: "2 years", months: 24, fee: 72000 },
    { code: "CUL/3/1", title: "Certificate in Culinary Arts", deptSlug: "hospitality", qual: "Certificate", dur: "1 year", months: 12, fee: 58000 },
    { code: "NUR/3/1", title: "Certificate in Nursing Assistant", deptSlug: "health-sciences", qual: "Certificate", dur: "1 year", months: 12, fee: 65000 },
    { code: "AGR/4/1", title: "Diploma in Agribusiness", deptSlug: "agriculture", qual: "Diploma", dur: "2 years", months: 24, fee: 68000 },
    { code: "EEE/4/1", title: "Diploma in Electrical Engineering", deptSlug: "electrical", qual: "Diploma", dur: "3 years", months: 36, fee: 85000 },
    { code: "MEC/4/1", title: "Diploma in Mechanical Engineering", deptSlug: "mechanical", qual: "Diploma", dur: "3 years", months: 36, fee: 82000 },
    { code: "BUI/3/1", title: "Certificate in Building Construction", deptSlug: "building-technology", qual: "Certificate", dur: "1 year", months: 12, fee: 55000 },
    { code: "ICT/5/2", title: "Higher Diploma in Cybersecurity", deptSlug: "ict", qual: "Higher Diploma", dur: "1 year", months: 12, fee: 120000 },
    { code: "AUT/4/1", title: "Diploma in Automotive Engineering", deptSlug: "engineering", qual: "Diploma", dur: "3 years", months: 36, fee: 80000 },
    { code: "HRM/4/1", title: "Diploma in Human Resource Management", deptSlug: "business", qual: "Diploma", dur: "2 years", months: 24, fee: 70000 },
  ];

  const programmes: Record<string, any> = {};
  for (const p of programmeData) {
    const dept = departments[p.deptSlug];
    if (!dept) continue;
    programmes[p.code] = await db.programme.upsert({
      where: { code: p.code },
      update: {},
      create: {
        code: p.code, title: p.title, slug: slugify(p.title),
        description: `${p.title} — a comprehensive programme combining theory with intensive practical training.`,
        departmentId: dept.id, qualification: p.qual,
        duration: p.dur, durationMonths: p.months, fee: p.fee,
        requirements: JSON.stringify(["KCSE Mean Grade C- (minus) or equivalent", "Copy of national ID"]),
        careerPaths: JSON.stringify(["Field technician", "Operations engineer", "Project coordinator"]),
        imageUrl: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=900&q=80",
        status: "PUBLISHED", featured: ["EEE/4/1", "ICT/5/2", "MEC/4/1"].includes(p.code),
      },
    });
  }

  // ── Testimonials ───────────────────────────────────────────
  const testimonials = [
    { name: "Amara Ochieng", role: "Graduate · Electrical Engineering, 2022", type: "graduate", quote: "Northgate didn't just teach me circuits — they taught me discipline. Three weeks after graduation I was hired as a maintenance engineer.", org: "Kenya Power" },
    { name: "Daniel Mwangi", role: "ICT Manager · Safaricom", type: "employer", quote: "We've hired 18 Northgate graduates in the last two years. Their hands-on fluency with real infrastructure is exceptional.", org: "Safaricom PLC" },
    { name: "Fatuma Hassan", role: "Student · Diploma in Nursing, Final Year", type: "student", quote: "The clinical placements and simulated ward training mean I walk into practice with confidence.", org: "Northgate Student" },
    { name: "Brian Kamau", role: "Founder · TekFix Solutions", type: "graduate", quote: "After my diploma, I launched my own repair and fabrication shop. The innovation hub gave me my first CNC prototype.", org: "CEO, TekFix" },
  ];
  for (const t of testimonials) {
    const exists = await db.testimonial.findFirst({ where: { name: t.name } });
    if (!exists) {
      await db.testimonial.create({
        data: {
          ...t,
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
          status: "PUBLISHED",
        },
      });
    }
  }

  // ── Partners ───────────────────────────────────────────────
  const partners = [
    { name: "TVETA", short: "Technical & Vocational Education Training Authority", category: "ACCREDITATION" },
    { name: "CDACC", short: "Curriculum Development & Certification Council", category: "ACCREDITATION" },
    { name: "HELB", short: "Higher Education Loans Board", category: "GOVERNMENT" },
    { name: "KUCCPS", short: "Kenya Universities & Colleges Placement Service", category: "GOVERNMENT" },
    { name: "UNESCO", short: "United Nations Educational, Scientific & Cultural Org.", category: "ACCREDITATION" },
    { name: "Industry Partners", short: "80+ hiring employers across East Africa", category: "INDUSTRY" },
  ];
  for (const p of partners) {
    const exists = await db.partner.findFirst({ where: { name: p.name } });
    if (!exists) await db.partner.create({ data: { ...p, status: "PUBLISHED" } });
  }

  // ── Gallery ────────────────────────────────────────────────
  const gallery = [
    { title: "Engineering students at work", alt: "Engineering workshop", cat: "Workshop", url: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=800&q=80" },
    { title: "Computer lab session", alt: "Computer lab", cat: "Lab", url: "https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?auto=format&fit=crop&w=600&q=80" },
    { title: "Graduation ceremony", alt: "Graduation", cat: "Graduation", url: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=600&q=80" },
    { title: "Library reading", alt: "Library", cat: "Campus Life", url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80" },
    { title: "Workshop training", alt: "Workshop", cat: "Workshop", url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80" },
    { title: "Health sciences simulation", alt: "Health sciences", cat: "Lab", url: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=600&q=80" },
    { title: "Campus aerial view", alt: "Campus", cat: "Campus Life", url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80" },
    { title: "Culinary class", alt: "Culinary", cat: "Workshop", url: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=600&q=80" },
    { title: "Sports and student life", alt: "Sports", cat: "Campus Life", url: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=600&q=80" },
  ];
  for (const g of gallery) {
    const exists = await db.galleryImage.findFirst({ where: { title: g.title } });
    if (!exists) {
      await db.galleryImage.create({ data: { title: g.title, alt: g.alt, imageUrl: g.url, category: g.cat, status: "PUBLISHED" } });
    }
  }

  // ── News ───────────────────────────────────────────────────
  const news = [
    { title: "Northgate Wins National TVET Innovation Award 2026", cat: "Latest News", excerpt: "Our Smart Irrigation Project beat 84 institutions to take top honours.", content: "The National Skills Showcase 2026 brought together 84 TVET institutions. Northgate's entry — a solar-powered smart irrigation system — was awarded the top prize.\n\nThe project solves a real problem faced by smallholder farmers: precise, automated water management that reduces waste by up to 60%.", read: 4 },
    { title: "Open Day · September Intake", cat: "Upcoming Events", excerpt: "Tour the campus, meet faculty, and apply on the spot.", content: "Join us on August 24 for our largest open day of the year. Tour all nine departments, meet trainers, attend live demonstrations, and submit your application on-site.", read: 2 },
    { title: "Solar-Powered Cold Storage for Smallholder Farmers", cat: "Research", excerpt: "A cross-departmental team unveils a working prototype.", content: "Electrical and Agricultural Engineering students have completed a working prototype of a solar-powered cold storage unit for off-grid farming communities.", read: 6 },
    { title: "New AI & Data Centre Inaugurated", cat: "Innovation", excerpt: "KES 240M facility hosts 8 specialised compute labs.", content: "The new AI & Data Centre — a KES 240 million investment — was officially inaugurated this month.", read: 3 },
    { title: "East Africa TVET Symposium · Hosted at Northgate", cat: "Conferences", excerpt: "300+ educators convening on the future of skills.", content: "Northgate will host the 2026 East Africa TVET Symposium on October 9-10.", read: 2 },
  ];
  for (const n of news) {
    const slug = slugify(n.title);
    const exists = await db.news.findFirst({ where: { slug } });
    if (!exists) {
      await db.news.create({
        data: {
          title: n.title, slug, excerpt: n.excerpt, content: n.content,
          category: n.cat,
          imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1400&q=80",
          authorId: admin.id, status: "PUBLISHED", publishedAt: new Date(), readTime: n.read,
        },
      });
    }
  }

  // ── Events ─────────────────────────────────────────────────
  const events = [
    { title: "Open Day · September Intake", cat: "Upcoming Events", desc: "Tour the campus, meet faculty, and apply on the spot.", start: daysFromNow(40), end: daysFromNow(40), loc: "Main Campus" },
    { title: "East Africa TVET Symposium", cat: "Conferences", desc: "300+ educators convening on the future of skills.", start: daysFromNow(95), end: daysFromNow(96), loc: "Conference Centre" },
    { title: "Industry Career Fair 2026", cat: "Upcoming Events", desc: "Meet 80+ hiring employers under one roof.", start: daysFromNow(60), end: daysFromNow(60), loc: "Sports Complex" },
  ];
  for (const e of events) {
    const slug = slugify(e.title);
    const exists = await db.event.findFirst({ where: { slug } });
    if (!exists) {
      await db.event.create({
        data: {
          title: e.title, slug, description: e.desc, category: e.cat,
          location: e.loc, startDate: e.start, endDate: e.end,
          imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80",
          authorId: admin.id, status: "PUBLISHED", capacity: 500,
        },
      });
    }
  }

  // ── Announcements ──────────────────────────────────────────
  const announcements = [
    { title: "Mid-Semester Exams Schedule Released", content: "The mid-semester examination timetable has been published.", category: "Academic", audience: "STUDENTS" },
    { title: "Library Extended Hours", content: "The library will operate 24/7 during the examination period.", category: "General", audience: "STUDENTS" },
    { title: "Fee Payment Deadline Approaching", content: "All semester fees must be cleared by the end of this month.", category: "Finance", audience: "STUDENTS" },
    { title: "Industry Career Fair", content: "Annual career fair on August 30. 80+ employers will be on campus.", category: "Events", audience: "STUDENTS" },
    { title: "System Maintenance Notice", content: "The portal will undergo maintenance this Saturday from 2 AM to 4 AM.", category: "Urgent", audience: "ALL" },
  ];
  for (const a of announcements) {
    const exists = await db.announcement.findFirst({ where: { title: a.title } });
    if (!exists) {
      await db.announcement.create({ data: { ...a, authorId: admin.id, publishedAt: daysAgo(Math.floor(Math.random() * 7)) } });
    }
  }

  // ── Library Books ──────────────────────────────────────────
  const books = [
    { title: "Engineering Mathematics", author: "K.A. Stroud", category: "Engineering", total: 5 },
    { title: "Introduction to Algorithms", author: "Cormen et al.", category: "Computer Science", total: 8 },
    { title: "Database System Concepts", author: "Silberschatz et al.", category: "Computer Science", total: 4 },
    { title: "Technical Drawing", author: "Frederick Giesecke", category: "Engineering", total: 3 },
    { title: "Principles of Financial Accounting", author: "Belverd Needles", category: "Business", total: 6 },
    { title: "Computer Networks", author: "Larry Peterson", category: "Computer Science", total: 4 },
    { title: "Workshop Theory and Practice", author: "W.A.J. Chapman", category: "Engineering", total: 5 },
    { title: "Business Communication Today", author: "Courtland Bovée", category: "Business", total: 7 },
  ];
  for (const b of books) {
    const exists = await db.libraryBook.findFirst({ where: { title: b.title } });
    if (!exists) {
      await db.libraryBook.create({
        data: {
          title: b.title, author: b.author, category: b.category,
          totalCopies: b.total, availableCopies: b.total - Math.floor(Math.random() * b.total),
          coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80",
          description: `${b.title} by ${b.author}.`,
        },
      });
    }
  }

  // ── Semester + Units ───────────────────────────────────────
  const semester = await db.semester.upsert({
    where: { code: "2025/2026-S1" },
    update: { isCurrent: true },
    create: {
      name: "Semester 1, 2025/2026", code: "2025/2026-S1",
      startDate: daysAgo(60), endDate: daysFromNow(60), isCurrent: true, academicYear: "2025/2026",
    },
  });

  const prevSemester = await db.semester.upsert({
    where: { code: "2024/2025-S2" },
    update: {},
    create: {
      name: "Semester 2, 2024/2025", code: "2024/2025-S2",
      startDate: daysAgo(180), endDate: daysAgo(120), isCurrent: false, academicYear: "2024/2025",
    },
  });

  const unitData = [
    { code: "ENG 1101", title: "Engineering Mathematics I", deptSlug: "engineering", credits: 3, instructor: "Dr. Wanjiru Maina" },
    { code: "ENG 1102", title: "Technical Drawing", deptSlug: "engineering", credits: 2, instructor: "Eng. Peter Kamau" },
    { code: "ENG 1103", title: "Workshop Practice I", deptSlug: "engineering", credits: 3, instructor: "Mr. James Otieno" },
    { code: "ICT 1101", title: "Introduction to Programming", deptSlug: "ict", credits: 3, instructor: "Mr. David Mwangi" },
    { code: "ICT 1102", title: "Computer Networks", deptSlug: "ict", credits: 3, instructor: "Ms. Faith Njoroge" },
    { code: "ICT 1103", title: "Database Systems", deptSlug: "ict", credits: 3, instructor: "Dr. Daniel Kiprop" },
    { code: "BIZ 1101", title: "Business Communication", deptSlug: "business", credits: 2, instructor: "Mrs. Mary Wambui" },
    { code: "BIZ 1102", title: "Financial Accounting", deptSlug: "business", credits: 3, instructor: "CPA John Mutiso" },
    { code: "NUR 1101", title: "Anatomy & Physiology I", deptSlug: "health-sciences", credits: 3, instructor: "Dr. Sarah Achieng" },
    { code: "NUR 1102", title: "Fundamentals of Nursing", deptSlug: "health-sciences", credits: 3, instructor: "Ms. Grace Kamau" },
    { code: "AGR 1101", title: "Principles of Agriculture", deptSlug: "agriculture", credits: 3, instructor: "Mr. James Mwangi" },
    { code: "CUL 1101", title: "Culinary Fundamentals", deptSlug: "hospitality", credits: 3, instructor: "Chef Mary Atieno" },
  ];

  const units: Record<string, any> = {};
  for (const u of unitData) {
    const dept = departments[u.deptSlug];
    if (!dept) continue;
    units[u.code] = await db.unit.upsert({
      where: { code: u.code },
      update: {},
      create: {
        code: u.code, title: u.title, departmentId: dept.id, credits: u.credits,
        instructor: u.instructor, semesterId: semester.id, year: 1,
        description: `${u.title} — foundational unit covering core concepts.`,
      },
    });
  }

  // ── Demo Students ──────────────────────────────────────────
  const studentData = [
    { email: "student@northgate.ac.ke", name: "Alex Mwangi", admissionNo: "NG/2025/001", progCode: "CIV/4/1", gender: "MALE", gpa: 3.65, att: 92, prog: 65, pc: 85, units: ["ENG 1101", "ENG 1102", "ENG 1103", "BIZ 1101"], avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80" },
    { email: "mary.student@northgate.ac.ke", name: "Mary Wanjiru", admissionNo: "NG/2025/002", progCode: "SWE/5/1", gender: "FEMALE", gpa: 3.85, att: 96, prog: 70, pc: 95, units: ["ICT 1101", "ICT 1102", "ICT 1103", "BIZ 1101"], avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
    { email: "brian.student@northgate.ac.ke", name: "Brian Otieno", admissionNo: "NG/2025/003", progCode: "BUS/4/1", gender: "MALE", gpa: 3.20, att: 85, prog: 55, pc: 70, units: ["BIZ 1101", "BIZ 1102", "ICT 1101", "ENG 1102"], avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
    { email: "grace.student@northgate.ac.ke", name: "Grace Achieng", admissionNo: "NG/2025/004", progCode: "NUR/3/1", gender: "FEMALE", gpa: 3.95, att: 98, prog: 75, pc: 100, units: ["NUR 1101", "NUR 1102", "BIZ 1101", "ENG 1102"], avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" },
    { email: "david.student@northgate.ac.ke", name: "David Kiprop", admissionNo: "NG/2025/005", progCode: "AGR/4/1", gender: "MALE", gpa: 2.10, att: 68, prog: 40, pc: 60, units: ["AGR 1101", "BIZ 1101", "ENG 1102", "ICT 1101"], avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
    { email: "faith.student@northgate.ac.ke", name: "Faith Njoroge", admissionNo: "NG/2024/089", progCode: "CUL/3/1", gender: "FEMALE", gpa: 3.45, att: 91, prog: 92, pc: 90, units: ["CUL 1101", "BIZ 1101", "ICT 1101", "ENG 1102"], avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" },
  ];

  for (const s of studentData) {
    const user = await db.user.upsert({
      where: { emailNormalized: s.email },
      update: {},
      create: {
        email: s.email, emailNormalized: s.email, name: s.name,
        passwordHash: studentPwd, role: "STUDENT", status: "ACTIVE",
        emailVerifiedAt: new Date(),
      },
    });

    const programme = programmes[s.progCode];
    const student = await db.student.upsert({
      where: { admissionNo: s.admissionNo },
      update: { currentGPA: s.gpa, attendanceRate: s.att, overallProgress: s.prog, profileComplete: s.pc },
      create: {
        userId: user.id, admissionNo: s.admissionNo, programmeId: programme?.id,
        year: s.email.includes("faith") ? 2 : 1, semester: s.email.includes("faith") ? 2 : 1,
        status: "ACTIVE", gender: s.gender, phone: "+254700000000",
        nationality: "Kenyan", dateOfBirth: new Date("2003-08-22"),
        address: "Nairobi, Kenya", nextOfKin: "Parent", nextOfKinPhone: "+254700000001",
        profileImageUrl: s.avatar,
        currentGPA: s.gpa, attendanceRate: s.att, overallProgress: s.prog, profileComplete: s.pc,
        enrollmentDate: daysAgo(s.email.includes("faith") ? 420 : 60),
      },
    });

    // Enroll in units
    for (const unitCode of s.units) {
      const unit = units[unitCode];
      if (!unit) continue;
      try {
        await db.enrollment.create({
          data: { studentId: student.id, unitId: unit.id, semesterId: semester.id, status: "ENROLLED" },
        });
      } catch {}
    }

    // Assessments + submissions
    const enrolledUnits = await db.unit.findMany({ where: { enrollments: { some: { studentId: student.id } } } });
    const isTopPerformer = s.gpa > 3.8;
    const isStruggling = s.gpa < 2.5;
    for (const unit of enrolledUnits) {
      const pastAssignment = await db.assessment.create({
        data: {
          unitId: unit.id, title: `${unit.code} Assignment 1`, type: "ASSIGNMENT",
          description: `Assignment covering the first 4 weeks of ${unit.title}.`,
          maxMarks: 100, weight: 0.15, dueDate: daysAgo(20), semesterId: semester.id,
        },
      });
      const marks = isTopPerformer ? Math.floor(85 + Math.random() * 13) : isStruggling ? Math.floor(40 + Math.random() * 25) : Math.floor(60 + Math.random() * 30);
      try {
        await db.submission.create({
          data: { assessmentId: pastAssignment.id, studentId: student.id, submittedAt: daysAgo(22), marks, status: "GRADED", feedback: marks >= 80 ? "Excellent!" : "Good effort." },
        });
      } catch {}

      const upcomingCat = await db.assessment.create({
        data: {
          unitId: unit.id, title: `${unit.code} CAT 1`, type: "CAT",
          description: `CAT for ${unit.title}.`, maxMarks: 100, weight: 0.20,
          dueDate: daysFromNow(5 + Math.floor(Math.random() * 10)), semesterId: semester.id,
        },
      });
      try {
        await db.submission.create({ data: { assessmentId: upcomingCat.id, studentId: student.id, status: "PENDING" } });
      } catch {}

      await db.assessment.create({
        data: {
          unitId: unit.id, title: `${unit.code} POE Request`, type: "POE_REQUEST",
          description: `POE for ${unit.title}.`, maxMarks: 100, weight: 0.40,
          dueDate: daysFromNow(21), semesterId: semester.id,
        },
      });
    }

    // Attendance
    for (let d = 30; d >= 0; d--) {
      const date = daysAgo(d);
      const day = date.getDay();
      if (day === 0 || day === 6) continue;
      const unit = enrolledUnits[d % enrolledUnits.length];
      if (!unit) continue;
      const r = Math.random();
      const status = isStruggling ? (r > 0.65 ? "ABSENT" : r > 0.55 ? "LATE" : "PRESENT") : isTopPerformer ? (r > 0.98 ? "LATE" : "PRESENT") : (r > 0.90 ? "ABSENT" : r > 0.85 ? "LATE" : "PRESENT");
      try {
        await db.attendance.create({ data: { studentId: student.id, unitId: unit.id, date, status } });
      } catch {}
    }

    // Fees
    if (isStruggling) {
      await db.fee.create({ data: { studentId: student.id, semesterId: semester.id, type: "TUITION", amount: 68000, dueDate: daysAgo(15), status: "OVERDUE" } });
      await db.fee.create({ data: { studentId: student.id, semesterId: semester.id, type: "LAB", amount: 12000, dueDate: daysAgo(5), status: "OVERDUE" } });
    } else if (isTopPerformer) {
      const f = await db.fee.create({ data: { studentId: student.id, semesterId: semester.id, type: "TUITION", amount: 65000, dueDate: daysAgo(30), status: "PAID" } });
      const payRef = `MPESA-${student.admissionNo.replace(/\//g, "")}-FULL`;
      const existingPay = await db.payment.findUnique({ where: { reference: payRef } });
      if (!existingPay) {
        await db.payment.create({ data: { feeId: f.id, studentId: student.id, amount: 65000, method: "MPESA", reference: payRef, paidAt: daysAgo(35) } });
      }
    } else {
      const f = await db.fee.create({ data: { studentId: student.id, semesterId: semester.id, type: "TUITION", amount: 85000, dueDate: daysAgo(30), status: "PARTIAL" } });
      const payRef = `MPESA-${student.admissionNo.replace(/\//g, "")}-PART`;
      const existingPay = await db.payment.findUnique({ where: { reference: payRef } });
      if (!existingPay) {
        await db.payment.create({ data: { feeId: f.id, studentId: student.id, amount: 50000, method: "MPESA", reference: payRef, paidAt: daysAgo(45) } });
      }
      await db.fee.create({ data: { studentId: student.id, semesterId: semester.id, type: "LAB", amount: 15000, dueDate: daysFromNow(7), status: "PENDING" } });
    }

    // Results
    for (const unit of enrolledUnits.slice(0, 3)) {
      const marks = isTopPerformer ? Math.floor(80 + Math.random() * 18) : isStruggling ? Math.floor(45 + Math.random() * 20) : Math.floor(60 + Math.random() * 30);
      const grade = marks >= 70 ? "A" : marks >= 60 ? "B" : marks >= 50 ? "C" : marks >= 40 ? "D" : "F";
      const gpa = marks >= 70 ? 4.0 : marks >= 60 ? 3.0 : marks >= 50 ? 2.0 : marks >= 40 ? 1.0 : 0;
      try {
        await db.result.create({ data: { studentId: student.id, unitId: unit.id, semesterId: prevSemester.id, marks, grade, gpa, releasedAt: daysAgo(120), status: "RELEASED" } });
      } catch {}
    }
    for (const unit of enrolledUnits.slice(0, 2)) {
      const marks = isTopPerformer ? Math.floor(85 + Math.random() * 13) : isStruggling ? Math.floor(45 + Math.random() * 20) : Math.floor(65 + Math.random() * 25);
      const grade = marks >= 70 ? "A" : marks >= 60 ? "B" : marks >= 50 ? "C" : marks >= 40 ? "D" : "F";
      const gpa = marks >= 70 ? 4.0 : marks >= 60 ? 3.0 : marks >= 50 ? 2.0 : marks >= 40 ? 1.0 : 0;
      try {
        await db.result.create({ data: { studentId: student.id, unitId: unit.id, semesterId: semester.id, marks, grade, gpa, status: "RELEASED", releasedAt: daysAgo(5) } });
      } catch {}
    }

    // Exam card
    const examCardStatus = isStruggling ? "PENDING" : "ISSUED";
    try {
      await db.examCard.create({ data: { studentId: student.id, semesterId: semester.id, status: examCardStatus, issuedAt: examCardStatus === "ISSUED" ? daysAgo(10) : null } });
    } catch {}

    // Notifications
    const notifs = isStruggling ? [
      { title: "Fee Overdue Notice", message: "Your tuition fee is 15 days overdue.", type: "ERROR", link: "/student/finance" },
      { title: "Low Attendance Warning", message: "Your attendance is below 70%.", type: "WARNING", link: "/student/attendance" },
      { title: "Exam Card Pending", message: "Fees must be cleared first.", type: "WARNING", link: "/student/exam-card" },
      { title: "Assignment Graded", message: "Your assignment has been graded.", type: "ACADEMIC", link: "/student/assessments" },
      { title: "Support Available", message: "Free tutoring available.", type: "INFO", link: "/student/support" },
    ] : isTopPerformer ? [
      { title: "Exam Card Issued", message: "Download it now.", type: "SUCCESS", link: "/student/exam-card" },
      { title: "Outstanding Result", message: "You scored A!", type: "ACADEMIC", link: "/student/results" },
      { title: "Fees Fully Paid", message: "Thank you!", type: "FINANCE", link: "/student/finance" },
      { title: "Perfect Attendance", message: "98% attendance. Keep it up!", type: "SUCCESS", link: "/student/attendance" },
      { title: "Scholarship Opportunity", message: "You qualify for merit scholarship.", type: "ANNOUNCEMENT", link: "/student/notifications" },
    ] : [
      { title: "New Result Released", message: "Your result has been released.", type: "ACADEMIC", link: "/student/results" },
      { title: "Fee Reminder", message: "Lab fee due in 7 days.", type: "FINANCE", link: "/student/finance" },
      { title: "Assignment Graded", message: "Your assignment has been graded.", type: "ACADEMIC", link: "/student/assessments" },
      { title: "Exam Card Issued", message: "Your exam card has been issued.", type: "SUCCESS", link: "/student/exam-card" },
      { title: "New Announcement", message: "Library extended hours.", type: "ANNOUNCEMENT", link: "/student/notifications" },
    ];
    for (const n of notifs) {
      await db.notification.create({ data: { studentId: student.id, ...n, readAt: Math.random() > 0.5 ? daysAgo(2) : null } });
    }

    // Hostel (skip for struggling student)
    if (!isStruggling) {
      const hostelName = s.gender === "FEMALE" ? "Northgate Hostel Block B" : "Northgate Hostel Block A";
      const hostel = await db.hostel.upsert({
        where: { name: hostelName },
        update: {},
        create: { name: hostelName, block: s.gender === "FEMALE" ? "B" : "A", gender: s.gender, capacity: 200, occupied: 150 },
      });
      try {
        await db.hostelAllocation.create({ data: { studentId: student.id, hostelId: hostel.id, roomNo: `${s.gender === "FEMALE" ? "B" : "A"}-${200 + studentData.indexOf(s) + 1}` } });
      } catch {}
    }

    // Welcome message
    await db.message.create({
      data: {
        fromUserId: admin.id, toStudentId: student.id,
        subject: "Welcome to Northgate Student Portal",
        body: `Dear ${s.name},\n\nWelcome to the Northgate Student Portal! Your account is now active.\n\nAdmission Number: ${s.admissionNo}\nProgramme: ${programme?.title || "—"}\n\nExplore your dashboard to view units, assessments, attendance, results, fees, and more.`,
        readAt: null,
      },
    });
  }

  console.log("[auto-seed] Demo data created successfully.");
}
