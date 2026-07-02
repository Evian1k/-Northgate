/**
 * Hardcoded demo data for zero-database demo mode.
 * Used as fallback when database is unavailable (e.g. Vercel ephemeral filesystem).
 * Also used by demo-login to set cookies without DB queries.
 */

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "EDITOR" | "STUDENT";
  admissionNo?: string;
  programme?: string;
  profileImageUrl?: string;
}

export const demoUsers: Record<string, DemoUser> = {
  admin: {
    id: "demo-admin",
    email: "admin@northgate.ac.ke",
    name: "System Administrator",
    role: "ADMIN",
    profileImageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  },
  editor: {
    id: "demo-editor",
    email: "editor@northgate.ac.ke",
    name: "Content Editor",
    role: "EDITOR",
  },
  student1: {
    id: "demo-student-1",
    email: "student@northgate.ac.ke",
    name: "Alex Mwangi",
    role: "STUDENT",
    admissionNo: "NG/2025/001",
    programme: "Diploma in Civil Engineering",
    profileImageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  },
  student2: {
    id: "demo-student-2",
    email: "mary.student@northgate.ac.ke",
    name: "Mary Wanjiru",
    role: "STUDENT",
    admissionNo: "NG/2025/002",
    programme: "Diploma in Software Engineering",
    profileImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  student3: {
    id: "demo-student-3",
    email: "brian.student@northgate.ac.ke",
    name: "Brian Otieno",
    role: "STUDENT",
    admissionNo: "NG/2025/003",
    programme: "Diploma in Business Management",
    profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  student4: {
    id: "demo-student-4",
    email: "grace.student@northgate.ac.ke",
    name: "Grace Achieng",
    role: "STUDENT",
    admissionNo: "NG/2025/004",
    programme: "Certificate in Nursing Assistant",
    profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  },
  student5: {
    id: "demo-student-5",
    email: "david.student@northgate.ac.ke",
    name: "David Kiprop",
    role: "STUDENT",
    admissionNo: "NG/2025/005",
    programme: "Diploma in Agribusiness",
    profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  student6: {
    id: "demo-student-6",
    email: "faith.student@northgate.ac.ke",
    name: "Faith Njoroge",
    role: "STUDENT",
    admissionNo: "NG/2024/089",
    programme: "Certificate in Culinary Arts",
    profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  },
};

export const demoAccounts: Record<string, string> = {
  admin: "admin@northgate.ac.ke",
  editor: "editor@northgate.ac.ke",
  student1: "student@northgate.ac.ke",
  student2: "mary.student@northgate.ac.ke",
  student3: "brian.student@northgate.ac.ke",
  student4: "grace.student@northgate.ac.ke",
  student5: "david.student@northgate.ac.ke",
  student6: "faith.student@northgate.ac.ke",
};

// ── Student dashboard demo data ──────────────────────────────

export function getDemoStudentStats(account: string) {
  const students: Record<string, any> = {
    student1: { gpa: 3.65, attendance: 92, progress: 65, profileComplete: 85, year: 1, semester: 1 },
    student2: { gpa: 3.85, attendance: 96, progress: 70, profileComplete: 95, year: 1, semester: 1 },
    student3: { gpa: 3.20, attendance: 85, progress: 55, profileComplete: 70, year: 1, semester: 1 },
    student4: { gpa: 3.95, attendance: 98, progress: 75, profileComplete: 100, year: 1, semester: 1 },
    student5: { gpa: 2.10, attendance: 68, progress: 40, profileComplete: 60, year: 1, semester: 1 },
    student6: { gpa: 3.45, attendance: 91, progress: 92, profileComplete: 90, year: 2, semester: 2 },
  };
  return students[account] || students.student1;
}

export function getDemoStudentDashboard(account: string) {
  const s = getDemoStudentStats(account);
  const user = demoUsers[account];
  const isTop = s.gpa > 3.8;
  const isStruggling = s.gpa < 2.5;

  return {
    student: {
      name: user.name,
      admissionNo: user.admissionNo,
      programme: user.programme,
      programmeCode: "—",
      qualification: "Diploma",
      year: s.year,
      semester: s.semester,
      profileImageUrl: user.profileImageUrl,
      currentGPA: s.gpa,
      attendanceRate: s.attendance,
      overallProgress: s.progress,
      profileComplete: s.profileComplete,
    },
    counts: {
      enrolledUnits: 5,
      pendingAssessments: 5,
      poeRequests: 5,
      poeSubmissions: 0,
      feeBalance: isStruggling ? 93000 : isTop ? 0 : 50000,
      examCardStatus: isStruggling ? "PENDING" : "ISSUED",
      activeLoans: 2,
      unreadNotifications: 3,
      releasedResults: 5,
      hostelStatus: isStruggling ? "Not allocated" : "Room A-201",
    },
    upcomingDeadlines: [
      { id: "1", title: "ENG 1101 CAT 1", type: "CAT", dueDate: new Date(Date.now() + 3 * 86400000).toISOString(), unit: "ENG 1101" },
      { id: "2", title: "ICT 1102 Assignment 2", type: "ASSIGNMENT", dueDate: new Date(Date.now() + 5 * 86400000).toISOString(), unit: "ICT 1102" },
      { id: "3", title: "BIZ 1101 POE Request", type: "POE_REQUEST", dueDate: new Date(Date.now() + 7 * 86400000).toISOString(), unit: "BIZ 1101" },
      { id: "4", title: "ENG 1103 CAT 1", type: "CAT", dueDate: new Date(Date.now() + 10 * 86400000).toISOString(), unit: "ENG 1103" },
      { id: "5", title: "ICT 1103 Assignment", type: "ASSIGNMENT", dueDate: new Date(Date.now() + 14 * 86400000).toISOString(), unit: "ICT 1103" },
    ],
    gpaTrend: [
      { semester: "Semester 2, 2024/2025", gpa: Math.max(2.5, s.gpa - 0.3) },
      { semester: "Semester 1, 2025/2026", gpa: s.gpa },
    ],
    attendanceByUnit: [
      { unit: "ENG 1101", rate: s.attendance },
      { unit: "ENG 1102", rate: Math.min(100, s.attendance + 3) },
      { unit: "ENG 1103", rate: Math.max(50, s.attendance - 5) },
      { unit: "BIZ 1101", rate: s.attendance },
      { unit: "ICT 1101", rate: Math.min(100, s.attendance + 1) },
    ],
  };
}

export function getDemoAdminStats() {
  return {
    counts: {
      students: 9000,
      programmes: 12,
      news: 5,
      events: 3,
      applications: 1,
      pendingApplications: 1,
      contactMessages: 1,
      newMessages: 1,
      subscribers: 1,
      departments: 9,
      testimonials: 4,
      partners: 6,
      gallery: 9,
      auditLogs: 10,
    },
    recentActivity: [
      { id: "1", action: "LOGIN", resource: "User", createdAt: new Date(Date.now() - 5 * 60000).toISOString(), user: "System Administrator" },
      { id: "2", action: "CREATE", resource: "News", createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), user: "Content Editor" },
      { id: "3", action: "UPDATE", resource: "Programme", createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), user: "System Administrator" },
      { id: "4", action: "PUBLISH", resource: "News", createdAt: new Date(Date.now() - 24 * 3600000).toISOString(), user: "Content Editor" },
      { id: "5", action: "DELETE", resource: "GalleryImage", createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), user: "System Administrator" },
    ],
    recentApplications: [
      { id: "1", reference: "NG-2026-DEMO1", firstName: "Test", lastName: "Student", email: "test@example.com", status: "PENDING", createdAt: new Date(Date.now() - 3600000).toISOString(), programme: "Diploma in Electrical Engineering" },
    ],
    recentMessages: [
      { id: "1", name: "Test User", email: "test@example.com", subject: "Inquiry about programmes", status: "NEW", createdAt: new Date(Date.now() - 7200000).toISOString() },
    ],
    applicationTrend: Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.now() - (13 - i) * 86400000).toISOString().slice(5, 10),
      count: Math.floor(Math.random() * 3),
    })),
  };
}

// ── Homepage demo data ───────────────────────────────────────

export const demoSiteSettings: Record<string, string> = {
  "site.name": "Northgate Institute of Technology",
  "site.tagline": "Building Tomorrow's Skilled Professionals",
  "site.phone": "+254 700 000 000",
  "site.email": "admissions@northgate.ac.ke",
  "site.address": "Northgate Avenue, Off Mombasa Road, Nairobi, Kenya",
  "admissions.intake": "September 2026",
  "admissions.deadline": "15 August 2026",
  "stats.students": "9000",
  "stats.programmes": "150",
  "stats.employability": "96",
  "stats.years": "60",
};

export const demoDepartments = [
  { id: "1", slug: "engineering", name: "Engineering", tagline: "Civil · Mechanical · Automotive", count: "3 programmes", img: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=900&q=80" },
  { id: "2", slug: "ict", name: "ICT", tagline: "Software · Networks · Cybersecurity", count: "2 programmes", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80" },
  { id: "3", slug: "business", name: "Business", tagline: "Accounting · HR · Marketing", count: "2 programmes", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80" },
  { id: "4", slug: "hospitality", name: "Hospitality", tagline: "Culinary · Tourism · Hotel Mgmt", count: "1 programme", img: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=900&q=80" },
  { id: "5", slug: "health-sciences", name: "Health Sciences", tagline: "Nursing · Lab Tech · Pharmacy", count: "1 programme", img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80" },
  { id: "6", slug: "agriculture", name: "Agriculture", tagline: "Agribusiness · Agronomy", count: "1 programme", img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80" },
  { id: "7", slug: "electrical", name: "Electrical", tagline: "Power · Electronics · Solar", count: "1 programme", img: "https://images.unsplash.com/photo-1506617561150-c7a2ac2989b7?auto=format&fit=crop&w=900&q=80" },
  { id: "8", slug: "mechanical", name: "Mechanical", tagline: "Production · Plant Maintenance", count: "1 programme", img: "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=900&q=80" },
  { id: "9", slug: "building-technology", name: "Building Technology", tagline: "Construction · Surveying", count: "1 programme", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80" },
];

export const demoProgrammes = [
  { code: "EEE/4/1", title: "Diploma in Electrical Engineering", slug: "diploma-in-electrical-engineering", dept: "Electrical", duration: "3 years", level: "Diploma" },
  { code: "ICT/5/2", title: "Higher Diploma in Cybersecurity", slug: "higher-diploma-in-cybersecurity", dept: "ICT", duration: "1 year", level: "Higher Diploma" },
  { code: "MEC/4/1", title: "Diploma in Mechanical Engineering", slug: "diploma-in-mechanical-engineering", dept: "Mechanical", duration: "3 years", level: "Diploma" },
  { code: "NUR/3/1", title: "Certificate in Nursing Assistant", slug: "certificate-in-nursing-assistant", dept: "Health Sciences", duration: "1 year", level: "Certificate" },
  { code: "BUS/4/1", title: "Diploma in Business Management", slug: "diploma-in-business-management", dept: "Business", duration: "2 years", level: "Diploma" },
  { code: "AGR/4/1", title: "Diploma in Agribusiness", slug: "diploma-in-agribusiness", dept: "Agriculture", duration: "2 years", level: "Diploma" },
  { code: "CIV/4/1", title: "Diploma in Civil Engineering", slug: "diploma-in-civil-engineering", dept: "Engineering", duration: "3 years", level: "Diploma" },
  { code: "CUL/3/1", title: "Certificate in Culinary Arts", slug: "certificate-in-culinary-arts", dept: "Hospitality", duration: "1 year", level: "Certificate" },
  { code: "SWE/5/1", title: "Diploma in Software Engineering", slug: "diploma-in-software-engineering", dept: "ICT", duration: "2 years", level: "Diploma" },
  { code: "AUT/4/1", title: "Diploma in Automotive Engineering", slug: "diploma-in-automotive-engineering", dept: "Engineering", duration: "3 years", level: "Diploma" },
  { code: "BUI/3/1", title: "Certificate in Building Construction", slug: "certificate-in-building-construction", dept: "Building Technology", duration: "1 year", level: "Certificate" },
  { code: "HRM/4/1", title: "Diploma in Human Resource Management", slug: "diploma-in-human-resource-management", dept: "Business", duration: "2 years", level: "Diploma" },
];

export const demoTestimonials = [
  { name: "Amara Ochieng", role: "Graduate · Electrical Engineering, 2022", type: "graduate" as const, quote: "Northgate didn't just teach me circuits — they taught me discipline. Three weeks after graduation I was hired as a maintenance engineer.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80", org: "Kenya Power" },
  { name: "Daniel Mwangi", role: "ICT Manager · Safaricom", type: "employer" as const, quote: "We've hired 18 Northgate graduates in the last two years. Their hands-on fluency with real infrastructure is exceptional.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80", org: "Safaricom PLC" },
  { name: "Fatuma Hassan", role: "Student · Diploma in Nursing, Final Year", type: "student" as const, quote: "The clinical placements and simulated ward training mean I walk into practice with confidence.", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80", org: "Northgate Student" },
  { name: "Brian Kamau", role: "Founder · TekFix Solutions", type: "graduate" as const, quote: "After my diploma, I launched my own repair and fabrication shop. The innovation hub gave me my first CNC prototype.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80", org: "CEO, TekFix" },
];

export const demoNews = [
  { id: "1", slug: "northgate-wins-national-tvet-innovation-award-2026", category: "Latest News", title: "Northgate Wins National TVET Innovation Award 2026", excerpt: "Our Smart Irrigation Project beat 84 institutions to take top honours.", date: "Jul 1, 2026", readTime: "4 min read", img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1400&q=80", size: "lg" as const },
  { id: "2", slug: "open-day-september-intake", category: "Upcoming Events", title: "Open Day · September Intake", excerpt: "Tour the campus, meet faculty, and apply on the spot.", date: "Aug 24, 2026", readTime: "All day", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80", size: "md" as const },
  { id: "3", slug: "solar-powered-cold-storage", category: "Research", title: "Solar-Powered Cold Storage for Smallholder Farmers", excerpt: "A cross-departmental team unveils a working prototype.", date: "Jul 2, 2026", readTime: "6 min read", img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80", size: "md" as const },
  { id: "4", slug: "new-ai-data-centre", category: "Innovation", title: "New AI & Data Centre Inaugurated", excerpt: "KES 240M facility hosts 8 specialised compute labs.", date: "Jun 18, 2026", readTime: "3 min read", img: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80", size: "md" as const },
  { id: "5", slug: "east-africa-tvet-symposium", category: "Conferences", title: "East Africa TVET Symposium · Hosted at Northgate", excerpt: "300+ educators convening on the future of skills.", date: "Oct 09, 2026", readTime: "2 days", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80", size: "md" as const },
];

export const demoGallery = [
  { src: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=800&q=80", alt: "Engineering students at work", title: "Engineering students at work" },
  { src: "https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?auto=format&fit=crop&w=600&q=80", alt: "Computer lab session", title: "Computer lab session" },
  { src: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=600&q=80", alt: "Graduation ceremony", title: "Graduation ceremony" },
  { src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80", alt: "Library reading", title: "Library reading" },
  { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80", alt: "Workshop training", title: "Workshop training" },
  { src: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=600&q=80", alt: "Health sciences simulation", title: "Health sciences simulation" },
  { src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80", alt: "Campus aerial view", title: "Campus aerial view" },
  { src: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=600&q=80", alt: "Culinary class", title: "Culinary class" },
  { src: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=600&q=80", alt: "Sports and student life", title: "Sports and student life" },
];

export const demoPartners = [
  { name: "TVETA", short: "Technical & Vocational Education Training Authority", category: "ACCREDITATION" },
  { name: "CDACC", short: "Curriculum Development & Certification Council", category: "ACCREDITATION" },
  { name: "HELB", short: "Higher Education Loans Board", category: "GOVERNMENT" },
  { name: "KUCCPS", short: "Kenya Universities & Colleges Placement Service", category: "GOVERNMENT" },
  { name: "UNESCO", short: "United Nations Educational, Scientific & Cultural Org.", category: "ACCREDITATION" },
  { name: "Industry Partners", short: "80+ hiring employers across East Africa", category: "INDUSTRY" },
];
