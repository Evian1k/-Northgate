/**
 * Production seed script for Northgate Institute of Technology.
 * Creates an admin user, sample content for every resource, and site settings.
 *
 * Run: bun run db:seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function main() {
  console.log("🌱 Seeding Northgate production database…");

  // ── Admin user ──────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin@2026", 12);
  const admin = await db.user.upsert({
    where: { emailNormalized: "admin@northgate.ac.ke" },
    update: {},
    create: {
      email: "admin@northgate.ac.ke",
      emailNormalized: "admin@northgate.ac.ke",
      name: "System Administrator",
      passwordHash: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
      emailVerifiedAt: new Date(),
    },
  });
  console.log(`  ✓ Admin user: ${admin.email} (password: Admin@2026)`);

  const editorPassword = await bcrypt.hash("Editor@2026", 12);
  const editor = await db.user.upsert({
    where: { emailNormalized: "editor@northgate.ac.ke" },
    update: {},
    create: {
      email: "editor@northgate.ac.ke",
      emailNormalized: "editor@northgate.ac.ke",
      name: "Content Editor",
      passwordHash: editorPassword,
      role: "EDITOR",
      status: "ACTIVE",
      emailVerifiedAt: new Date(),
    },
  });
  console.log(`  ✓ Editor user: ${editor.email} (password: Editor@2026)`);

  // ── Departments ─────────────────────────────────────────────
  const departments = [
    { name: "Engineering", tagline: "Civil · Mechanical · Automotive", icon: "HardHat", sortOrder: 1 },
    { name: "ICT", tagline: "Software · Networks · Cybersecurity", icon: "Cpu", sortOrder: 2 },
    { name: "Business", tagline: "Accounting · HR · Marketing", icon: "Building2", sortOrder: 3 },
    { name: "Hospitality", tagline: "Culinary · Tourism · Hotel Mgmt", icon: "UtensilsCrossed", sortOrder: 4 },
    { name: "Health Sciences", tagline: "Nursing · Lab Tech · Pharmacy", icon: "Stethoscope", sortOrder: 5 },
    { name: "Agriculture", tagline: "Agribusiness · Agronomy", icon: "Tractor", sortOrder: 6 },
    { name: "Electrical", tagline: "Power · Electronics · Solar", icon: "Zap", sortOrder: 7 },
    { name: "Mechanical", tagline: "Production · Plant Maintenance", icon: "Wrench", sortOrder: 8 },
    { name: "Building Technology", tagline: "Construction · Surveying", icon: "GraduationCap", sortOrder: 9 },
  ];

  for (const d of departments) {
    await db.department.upsert({
      where: { slug: slugify(d.name) },
      update: {},
      create: {
        ...d,
        slug: slugify(d.name),
        description: `The ${d.name} department at Northgate delivers world-class technical training combining theory with intensive hands-on practice in modern workshops.`,
        imageUrl: `https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80`,
        status: "PUBLISHED",
      },
    });
  }
  console.log(`  ✓ ${departments.length} departments`);

  // ── Programmes ──────────────────────────────────────────────
  const programmes = [
    { code: "EEE/4/1", title: "Diploma in Electrical Engineering", dept: "electrical", qual: "Diploma", dur: "3 years", months: 36, fee: 85000 },
    { code: "ICT/5/2", title: "Higher Diploma in Cybersecurity", dept: "ict", qual: "Higher Diploma", dur: "1 year", months: 12, fee: 120000 },
    { code: "NUR/3/1", title: "Certificate in Nursing Assistant", dept: "health-sciences", qual: "Certificate", dur: "1 year", months: 12, fee: 65000 },
    { code: "MEC/4/1", title: "Diploma in Mechanical Engineering", dept: "mechanical", qual: "Diploma", dur: "3 years", months: 36, fee: 82000 },
    { code: "BUS/4/1", title: "Diploma in Business Management", dept: "business", qual: "Diploma", dur: "2 years", months: 24, fee: 72000 },
    { code: "AGR/4/1", title: "Diploma in Agribusiness", dept: "agriculture", qual: "Diploma", dur: "2 years", months: 24, fee: 68000 },
    { code: "CIV/4/1", title: "Diploma in Civil Engineering", dept: "engineering", qual: "Diploma", dur: "3 years", months: 36, fee: 88000 },
    { code: "CUL/3/1", title: "Certificate in Culinary Arts", dept: "hospitality", qual: "Certificate", dur: "1 year", months: 12, fee: 58000 },
    { code: "SWE/5/1", title: "Diploma in Software Engineering", dept: "ict", qual: "Diploma", dur: "2 years", months: 24, fee: 95000 },
    { code: "AUT/4/1", title: "Diploma in Automotive Engineering", dept: "engineering", qual: "Diploma", dur: "3 years", months: 36, fee: 80000 },
    { code: "BUI/3/1", title: "Certificate in Building Construction", dept: "building-technology", qual: "Certificate", dur: "1 year", months: 12, fee: 55000 },
    { code: "HRM/4/1", title: "Diploma in Human Resource Management", dept: "business", qual: "Diploma", dur: "2 years", months: 24, fee: 70000 },
  ];

  for (const p of programmes) {
    const dept = await db.department.findFirst({ where: { slug: p.dept } });
    if (!dept) continue;
    await db.programme.upsert({
      where: { code: p.code },
      update: {},
      create: {
        code: p.code,
        title: p.title,
        slug: slugify(p.title),
        description: `${p.title} — a comprehensive ${p.qual.toLowerCase()} programme combining theoretical foundations with intensive practical training in state-of-the-art facilities. Graduates are job-ready from day one.`,
        departmentId: dept.id,
        qualification: p.qual,
        duration: p.dur,
        durationMonths: p.months,
        fee: p.fee,
        requirements: JSON.stringify(["KCSE Mean Grade C- (minus) or equivalent", "Pass in relevant subjects", "Copy of national ID"]),
        careerPaths: JSON.stringify(["Field technician", "Operations engineer", "Project coordinator"]),
        imageUrl: `https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=900&q=80`,
        status: "PUBLISHED",
        featured: ["EEE/4/1", "ICT/5/2", "MEC/4/1"].includes(p.code),
      },
    });
  }
  console.log(`  ✓ ${programmes.length} programmes`);

  // ── Testimonials ────────────────────────────────────────────
  const testimonials = [
    { name: "Amara Ochieng", role: "Graduate · Electrical Engineering, 2022", type: "graduate", quote: "Northgate didn't just teach me circuits — they taught me discipline. Three weeks after graduation I was hired as a maintenance engineer at a regional power company.", org: "Now at Kenya Power", rating: 5 },
    { name: "Daniel Mwangi", role: "ICT Manager · Safaricom", type: "employer", quote: "We've hired 18 Northgate graduates in the last two years. Their hands-on fluency with real infrastructure is exceptional — they arrive ready, not green.", org: "Safaricom PLC", rating: 5 },
    { name: "Fatuma Hassan", role: "Student · Diploma in Nursing, Final Year", type: "student", quote: "The clinical placements and simulated ward training mean I walk into practice with confidence. My trainers are practising nurses.", org: "Northgate Student", rating: 5 },
    { name: "Brian Kamau", role: "Founder · TekFix Solutions", type: "graduate", quote: "After my diploma in Mechanical Engineering, I launched my own repair and fabrication shop. The innovation hub gave me my first CNC prototype.", org: "CEO, TekFix Solutions", rating: 5 },
  ];
  for (const t of testimonials) {
    const existing = await db.testimonial.findFirst({ where: { name: t.name } });
    if (!existing) {
      await db.testimonial.create({
        data: {
          ...t,
          avatarUrl: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80`,
          status: "PUBLISHED",
        },
      });
    }
  }
  console.log(`  ✓ ${testimonials.length} testimonials`);

  // ── Partners ────────────────────────────────────────────────
  const partners = [
    { name: "TVETA", short: "Technical & Vocational Education Training Authority", category: "ACCREDITATION", sortOrder: 1 },
    { name: "CDACC", short: "Curriculum Development & Certification Council", category: "ACCREDITATION", sortOrder: 2 },
    { name: "HELB", short: "Higher Education Loans Board", category: "GOVERNMENT", sortOrder: 3 },
    { name: "KUCCPS", short: "Kenya Universities & Colleges Placement Service", category: "GOVERNMENT", sortOrder: 4 },
    { name: "UNESCO", short: "United Nations Educational, Scientific & Cultural Org.", category: "ACCREDITATION", sortOrder: 5 },
    { name: "Industry Partners", short: "80+ hiring employers across East Africa", category: "INDUSTRY", sortOrder: 6 },
  ];
  for (const p of partners) {
    const existing = await db.partner.findFirst({ where: { name: p.name } });
    if (!existing) await db.partner.create({ data: { ...p, status: "PUBLISHED" } });
  }
  console.log(`  ✓ ${partners.length} partners`);

  // ── Gallery ─────────────────────────────────────────────────
  const gallery = [
    { title: "Engineering students at work", alt: "Engineering students in workshop", cat: "Workshop", url: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=800&q=80" },
    { title: "Computer lab session", alt: "Students in computer lab", cat: "Lab", url: "https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?auto=format&fit=crop&w=600&q=80" },
    { title: "Graduation ceremony", alt: "Graduation ceremony", cat: "Graduation", url: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=600&q=80" },
    { title: "Library reading", alt: "Library reading", cat: "Campus Life", url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80" },
    { title: "Workshop training", alt: "Workshop training", cat: "Workshop", url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80" },
    { title: "Health sciences simulation", alt: "Health sciences simulation", cat: "Lab", url: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=600&q=80" },
    { title: "Campus aerial view", alt: "Campus aerial view", cat: "Campus Life", url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80" },
    { title: "Culinary class", alt: "Culinary class", cat: "Workshop", url: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=600&q=80" },
    { title: "Sports and student life", alt: "Sports and student life", cat: "Campus Life", url: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=600&q=80" },
  ];
  for (const g of gallery) {
    const existing = await db.galleryImage.findFirst({ where: { title: g.title } });
    if (!existing) {
      await db.galleryImage.create({
        data: {
          title: g.title,
          alt: g.alt,
          imageUrl: g.url,
          category: g.cat,
          status: "PUBLISHED",
          sortOrder: 0,
        },
      });
    }
  }
  console.log(`  ✓ ${gallery.length} gallery images`);

  // ── News ────────────────────────────────────────────────────
  const news = [
    { title: "Northgate Wins National TVET Innovation Award 2026", cat: "Latest News", excerpt: "Our Smart Irrigation Project, built by agricultural engineering students, beat 84 institutions to take top honours.", content: "The National Skills Showcase 2026 brought together 84 TVET institutions from across the country. Northgate's entry — a solar-powered smart irrigation system designed and built entirely by students in the Agricultural Engineering programme — was awarded the top prize by an independent panel of industry judges.\n\nThe project solves a real problem faced by smallholder farmers: precise, automated water management that reduces waste by up to 60% while increasing yield. Three of our final-year students will travel to Geneva in October to present the prototype at the UNESCO Global Skills Summit.", read: 4 },
    { title: "Open Day · September Intake", cat: "Upcoming Events", excerpt: "Tour the campus, meet faculty, and apply on the spot.", content: "Join us on August 24 for our largest open day of the year. Tour all nine departments, meet trainers and current students, attend live demonstrations in our workshops, and submit your application on-site with admissions staff ready to assist.", read: 2 },
    { title: "Solar-Powered Cold Storage for Smallholder Farmers", cat: "Research", excerpt: "A cross-departmental team unveils a working prototype.", content: "Electrical and Agricultural Engineering students, working with faculty mentors, have completed a working prototype of a solar-powered cold storage unit designed for off-grid farming communities. The unit keeps produce at 4°C for up to 72 hours using only solar energy.", read: 6 },
    { title: "New AI & Data Centre Inaugurated", cat: "Innovation", excerpt: "KES 240M facility hosts 8 specialised compute labs.", content: "The new AI & Data Centre — a KES 240 million investment — was officially inaugurated this month. The facility hosts 8 specialised compute laboratories including GPU clusters for machine learning, a cybersecurity range, and a data centre operations lab.", read: 3 },
    { title: "East Africa TVET Symposium · Hosted at Northgate", cat: "Conferences", excerpt: "300+ educators convening on the future of skills.", content: "Northgate will host the 2026 East Africa TVET Symposium on October 9-10. Over 300 educators, policymakers and industry leaders from 12 countries will convene to discuss the future of skills development in the region.", read: 2 },
  ];

  for (const n of news) {
    const slug = slugify(n.title);
    const existing = await db.news.findFirst({ where: { slug } });
    if (!existing) {
      await db.news.create({
        data: {
          title: n.title,
          slug,
          excerpt: n.excerpt,
          content: n.content,
          category: n.cat,
          imageUrl: `https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1400&q=80`,
          authorId: admin.id,
          status: "PUBLISHED",
          publishedAt: new Date(),
          readTime: n.read,
        },
      });
    }
  }
  console.log(`  ✓ ${news.length} news articles`);

  // ── Events ──────────────────────────────────────────────────
  const future = (days: number) => new Date(Date.now() + days * 86400000);
  const events = [
    { title: "Open Day · September Intake", cat: "Upcoming Events", desc: "Tour the campus, meet faculty, and apply on the spot.", start: future(40), end: future(40), loc: "Main Campus, Nairobi" },
    { title: "East Africa TVET Symposium", cat: "Conferences", desc: "300+ educators convening on the future of skills.", start: future(95), end: future(96), loc: "Northgate Conference Centre" },
    { title: "Industry Career Fair 2026", cat: "Upcoming Events", desc: "Meet 80+ hiring employers under one roof.", start: future(60), end: future(60), loc: "Sports Complex" },
  ];
  for (const e of events) {
    const slug = slugify(e.title);
    const existing = await db.event.findFirst({ where: { slug } });
    if (!existing) {
      await db.event.create({
        data: {
          title: e.title,
          slug,
          description: e.desc,
          category: e.cat,
          location: e.loc,
          startDate: e.start,
          endDate: e.end,
          imageUrl: `https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80`,
          authorId: admin.id,
          status: "PUBLISHED",
          capacity: 500,
        },
      });
    }
  }
  console.log(`  ✓ ${events.length} events`);

  // ── Site settings ───────────────────────────────────────────
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
    await db.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log(`  ✓ ${settings.length} site settings`);

  console.log("\n✅ Seed complete.");
  console.log("   Admin login: admin@northgate.ac.ke / Admin@2026");
  console.log("   Editor login: editor@northgate.ac.ke / Editor@2026");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
