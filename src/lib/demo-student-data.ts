/**
 * Demo data for student sub-pages.
 * Used when a demo student is logged in (no DB needed).
 */
import { demoUsers } from "./demo-data";

export function isDemoUser(userId: string): boolean {
  return userId.startsWith("demo-");
}

export function getDemoAccount(userId: string): string {
  return Object.keys(demoUsers).find((k) => demoUsers[k].id === userId) || "student1";
}

export const demoUnits = [
  { id: "1", code: "ENG 1101", title: "Engineering Mathematics I", description: "Foundational mathematics for engineering students covering calculus, algebra, and geometry.", credits: 3, instructor: "Dr. Wanjiru Maina", department: "Engineering", semester: "Semester 1, 2025/2026", assessmentCount: 3, upcomingAssessments: 2 },
  { id: "2", code: "ENG 1102", title: "Technical Drawing", description: "Principles of engineering drawing including orthographic projection, isometric views, and CAD.", credits: 2, instructor: "Eng. Peter Kamau", department: "Engineering", semester: "Semester 1, 2025/2026", assessmentCount: 3, upcomingAssessments: 2 },
  { id: "3", code: "ENG 1103", title: "Workshop Practice I", description: "Hands-on workshop practice covering bench work, fitting, and basic machining.", credits: 3, instructor: "Mr. James Otieno", department: "Engineering", semester: "Semester 1, 2025/2026", assessmentCount: 3, upcomingAssessments: 2 },
  { id: "4", code: "BIZ 1101", title: "Business Communication", description: "Effective communication in business environments including reports, presentations, and emails.", credits: 2, instructor: "Mrs. Mary Wambui", department: "Business", semester: "Semester 1, 2025/2026", assessmentCount: 3, upcomingAssessments: 1 },
  { id: "5", code: "ICT 1101", title: "Introduction to Programming", description: "Fundamentals of programming using Python including variables, loops, functions, and data structures.", credits: 3, instructor: "Mr. David Mwangi", department: "ICT", semester: "Semester 1, 2025/2026", assessmentCount: 3, upcomingAssessments: 2 },
];

export const demoAssessments = [
  { id: "1", title: "ENG 1101 Assignment 1", type: "ASSIGNMENT", description: "Assignment covering the first 4 weeks of Engineering Mathematics I.", maxMarks: 100, weight: 0.15, dueDate: new Date(Date.now() - 20 * 86400000).toISOString(), unit: { code: "ENG 1101", title: "Engineering Mathematics I" }, submission: { id: "s1", status: "GRADED", marks: 78, feedback: "Good effort, review calculus section.", submittedAt: new Date(Date.now() - 22 * 86400000).toISOString() } },
  { id: "2", title: "ENG 1101 CAT 1", type: "CAT", description: "Continuous Assessment Test 1 for Engineering Mathematics I.", maxMarks: 100, weight: 0.20, dueDate: new Date(Date.now() + 3 * 86400000).toISOString(), unit: { code: "ENG 1101", title: "Engineering Mathematics I" }, submission: null },
  { id: "3", title: "ENG 1101 POE Request", type: "POE_REQUEST", description: "Portfolio of Evidence request for Engineering Mathematics I.", maxMarks: 100, weight: 0.40, dueDate: new Date(Date.now() + 21 * 86400000).toISOString(), unit: { code: "ENG 1101", title: "Engineering Mathematics I" }, submission: null },
  { id: "4", title: "ENG 1102 Assignment 1", type: "ASSIGNMENT", description: "Assignment covering the first 4 weeks of Technical Drawing.", maxMarks: 100, weight: 0.15, dueDate: new Date(Date.now() - 18 * 86400000).toISOString(), unit: { code: "ENG 1102", title: "Technical Drawing" }, submission: { id: "s2", status: "GRADED", marks: 85, feedback: "Excellent work!", submittedAt: new Date(Date.now() - 20 * 86400000).toISOString() } },
  { id: "5", title: "ENG 1102 CAT 1", type: "CAT", description: "Continuous Assessment Test 1 for Technical Drawing.", maxMarks: 100, weight: 0.20, dueDate: new Date(Date.now() + 5 * 86400000).toISOString(), unit: { code: "ENG 1102", title: "Technical Drawing" }, submission: null },
  { id: "6", title: "ENG 1103 Assignment 1", type: "ASSIGNMENT", description: "Assignment covering the first 4 weeks of Workshop Practice I.", maxMarks: 100, weight: 0.15, dueDate: new Date(Date.now() - 15 * 86400000).toISOString(), unit: { code: "ENG 1103", title: "Workshop Practice I" }, submission: { id: "s3", status: "GRADED", marks: 72, feedback: "Good practical work.", submittedAt: new Date(Date.now() - 17 * 86400000).toISOString() } },
  { id: "7", title: "BIZ 1101 Assignment 1", type: "ASSIGNMENT", description: "Assignment covering the first 4 weeks of Business Communication.", maxMarks: 100, weight: 0.15, dueDate: new Date(Date.now() + 7 * 86400000).toISOString(), unit: { code: "BIZ 1101", title: "Business Communication" }, submission: null },
  { id: "8", title: "ICT 1101 Assignment 1", type: "ASSIGNMENT", description: "Assignment covering the first 4 weeks of Introduction to Programming.", maxMarks: 100, weight: 0.15, dueDate: new Date(Date.now() - 10 * 86400000).toISOString(), unit: { code: "ICT 1101", title: "Introduction to Programming" }, submission: { id: "s4", status: "GRADED", marks: 90, feedback: "Outstanding!", submittedAt: new Date(Date.now() - 12 * 86400000).toISOString() } },
];

export const demoAttendance = {
  rate: 92, total: 22, present: 20, late: 1, absent: 1, excused: 0,
  byUnit: [
    { unit: "ENG 1101", rate: 95, total: 5 },
    { unit: "ENG 1102", rate: 90, total: 5 },
    { unit: "ENG 1103", rate: 85, total: 4 },
    { unit: "BIZ 1101", rate: 100, total: 4 },
    { unit: "ICT 1101", rate: 90, total: 4 },
  ],
  records: Array.from({ length: 15 }, (_, i) => ({
    id: String(i + 1),
    date: new Date(Date.now() - (14 - i) * 86400000).toISOString(),
    status: Math.random() > 0.9 ? "ABSENT" : Math.random() > 0.85 ? "LATE" : "PRESENT",
    unit: ["ENG 1101", "ENG 1102", "ENG 1103", "BIZ 1101", "ICT 1101"][i % 5],
    unitTitle: ["Engineering Mathematics I", "Technical Drawing", "Workshop Practice I", "Business Communication", "Introduction to Programming"][i % 5],
  })),
};

export const demoResults = {
  currentGPA: 3.65,
  totalUnits: 5,
  semesterSummary: [
    {
      semester: "Semester 2, 2024/2025",
      gpa: 3.40,
      units: 3,
      results: [
        { id: "r1", marks: 75, grade: "A", gpa: 4.0, unit: { code: "ENG 1101", title: "Engineering Mathematics I", credits: 3 }, releasedAt: new Date(Date.now() - 120 * 86400000).toISOString() },
        { id: "r2", marks: 68, grade: "B", gpa: 3.0, unit: { code: "ENG 1102", title: "Technical Drawing", credits: 2 }, releasedAt: new Date(Date.now() - 120 * 86400000).toISOString() },
        { id: "r3", marks: 62, grade: "B", gpa: 3.0, unit: { code: "ENG 1103", title: "Workshop Practice I", credits: 3 }, releasedAt: new Date(Date.now() - 120 * 86400000).toISOString() },
      ],
    },
    {
      semester: "Semester 1, 2025/2026",
      gpa: 3.65,
      units: 2,
      results: [
        { id: "r4", marks: 78, grade: "A", gpa: 4.0, unit: { code: "ENG 1101", title: "Engineering Mathematics I", credits: 3 }, releasedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
        { id: "r5", marks: 72, grade: "B", gpa: 3.0, unit: { code: "ICT 1101", title: "Introduction to Programming", credits: 3 }, releasedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
      ],
    },
  ],
};

export const demoFees = {
  totalBilled: 125000,
  totalPaid: 50000,
  balance: 75000,
  fees: [
    { id: "f1", type: "TUITION", amount: 85000, dueDate: new Date(Date.now() - 30 * 86400000).toISOString(), status: "PARTIAL", semester: "Semester 1, 2025/2026", paid: 50000, payments: [{ id: "p1", amount: 50000, method: "MPESA", reference: "MPESA-NG2025001-1", paidAt: new Date(Date.now() - 45 * 86400000).toISOString() }] },
    { id: "f2", type: "LAB", amount: 15000, dueDate: new Date(Date.now() + 7 * 86400000).toISOString(), status: "PENDING", semester: "Semester 1, 2025/2026", paid: 0, payments: [] },
    { id: "f3", type: "HOSTEL", amount: 25000, dueDate: new Date(Date.now() + 14 * 86400000).toISOString(), status: "PENDING", semester: "Semester 1, 2025/2026", paid: 0, payments: [] },
  ],
};

export const demoExamCard = {
  id: "ec1",
  status: "ISSUED",
  issuedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  semester: "Semester 1, 2025/2026",
  student: { name: "Alex Mwangi", admissionNo: "NG/2025/001", programme: "Diploma in Civil Engineering", year: 1, semester: 1, profileImageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80" },
  units: demoUnits.slice(0, 4),
};

export const demoNotifications = [
  { id: "n1", title: "New Result Released", message: "Your ENG 1101 result has been released.", type: "ACADEMIC", link: "/student/results", readAt: null, createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: "n2", title: "Fee Reminder", message: "Your lab fee of KES 15,000 is due in 7 days.", type: "FINANCE", link: "/student/finance", readAt: null, createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: "n3", title: "Assignment Graded", message: "Your ENG 1101 Assignment 1 has been graded.", type: "ACADEMIC", link: "/student/assessments", readAt: new Date(Date.now() - 86400000).toISOString(), createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "n4", title: "Exam Card Issued", message: "Your exam card has been issued. Download it now.", type: "SUCCESS", link: "/student/exam-card", readAt: null, createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "n5", title: "New Announcement", message: "Library extended hours during exam period.", type: "ANNOUNCEMENT", link: "/student/notifications", readAt: new Date(Date.now() - 86400000).toISOString(), createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
];

export const demoAnnouncements = [
  { id: "a1", title: "Mid-Semester Exams Schedule Released", content: "The mid-semester examination timetable has been published. Please check your student portal under Exam Card section for your schedule.", category: "Academic", author: "Administration", publishedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "a2", title: "Library Extended Hours", content: "The library will operate 24/7 during the examination period (3 weeks).", category: "General", author: "Administration", publishedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "a3", title: "Fee Payment Deadline Approaching", content: "All semester fees must be cleared by the end of this month. Late payments attract a 5% surcharge.", category: "Finance", author: "Administration", publishedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "a4", title: "Industry Career Fair", content: "Annual career fair on August 30. 80+ employers will be on campus.", category: "Events", author: "Administration", publishedAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: "a5", title: "System Maintenance Notice", content: "The portal will undergo maintenance this Saturday from 2 AM to 4 AM.", category: "Urgent", author: "Administration", publishedAt: new Date(Date.now() - 86400000).toISOString() },
];

export const demoMessages = [
  { id: "m1", subject: "Welcome to Northgate Student Portal", body: "Dear Alex,\n\nWelcome to the Northgate Student Portal! Your account is now active.\n\nAdmission Number: NG/2025/001\nProgramme: Diploma in Civil Engineering\n\nExplore your dashboard to view units, assessments, attendance, results, fees, and more.\n\nBest regards,\nNorthgate Administration", readAt: null, createdAt: new Date(Date.now() - 60 * 86400000).toISOString(), from: "Administration" },
  { id: "m2", subject: "Your application has been approved", body: "Dear Alex,\n\nCongratulations! Your application has been approved. Your admission number is NG/2025/001.\n\nPlease complete your fee payment to secure your spot.", readAt: new Date(Date.now() - 55 * 86400000).toISOString(), createdAt: new Date(Date.now() - 58 * 86400000).toISOString(), from: "Admissions Office" },
];

export const demoLibrary = {
  books: [
    { id: "b1", title: "Engineering Mathematics", author: "K.A. Stroud", category: "Engineering", available: true, availableCopies: 3, totalCopies: 5, coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80", description: "Comprehensive engineering mathematics textbook." },
    { id: "b2", title: "Introduction to Algorithms", author: "Cormen et al.", category: "Computer Science", available: true, availableCopies: 5, totalCopies: 8, coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80", description: "The definitive algorithms textbook." },
    { id: "b3", title: "Database System Concepts", author: "Silberschatz et al.", category: "Computer Science", available: false, availableCopies: 0, totalCopies: 4, coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80", description: "Database fundamentals and design." },
    { id: "b4", title: "Technical Drawing", author: "Frederick Giesecke", category: "Engineering", available: true, availableCopies: 2, totalCopies: 3, coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80", description: "Engineering drawing principles." },
    { id: "b5", title: "Principles of Financial Accounting", author: "Belverd Needles", category: "Business", available: true, availableCopies: 4, totalCopies: 6, coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80", description: "Accounting fundamentals." },
    { id: "b6", title: "Computer Networks", author: "Larry Peterson", category: "Computer Science", available: true, availableCopies: 3, totalCopies: 4, coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80", description: "Network systems approach." },
  ],
  myLoans: [
    { id: "l1", borrowedAt: new Date(Date.now() - 10 * 86400000).toISOString(), dueAt: new Date(Date.now() + 4 * 86400000).toISOString(), status: "ACTIVE", book: { id: "b1", title: "Engineering Mathematics", author: "K.A. Stroud", coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80" } },
    { id: "l2", borrowedAt: new Date(Date.now() - 20 * 86400000).toISOString(), dueAt: new Date(Date.now() - 2 * 86400000).toISOString(), status: "OVERDUE", book: { id: "b4", title: "Technical Drawing", author: "Frederick Giesecke", coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80" } },
  ],
};

export const demoHostel = {
  roomNo: "A-201",
  allocatedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  hostel: { name: "Northgate Hostel Block A", block: "A", capacity: 200, occupied: 150 },
};

export const demoProfile = {
  name: "Alex Mwangi",
  email: "student@northgate.ac.ke",
  phone: "+254712345678",
  admissionNo: "NG/2025/001",
  gender: "MALE",
  dateOfBirth: "2004-05-15",
  nationality: "Kenyan",
  idNumber: "12345678",
  address: "Nairobi, Kenya",
  nextOfKin: "Grace Mwangi",
  nextOfKinPhone: "+254712345679",
  profileImageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  profileComplete: 85,
  programme: "Diploma in Civil Engineering",
  year: 1,
  semester: 1,
  enrollmentDate: new Date(Date.now() - 60 * 86400000).toISOString(),
  hostel: { room: "A-201", name: "Northgate Hostel Block A" },
};
