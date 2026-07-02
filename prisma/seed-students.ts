/**
 * Seed demo student accounts + their academic data (units, assessments,
 * attendance, fees, payments, results, exam cards, library loans, hostel,
 * notifications, messages, announcements).
 *
 * Run: bun run db:seed:students
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 86400000);
}
function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 86400000);
}

async function main() {
  console.log("🌱 Seeding student demo data…");

  // Get or create current semester
  const semester = await db.semester.upsert({
    where: { code: "2025/2026-S1" },
    update: { isCurrent: true },
    create: {
      name: "Semester 1, 2025/2026",
      code: "2025/2026-S1",
      startDate: daysAgo(60),
      endDate: daysFromNow(60),
      isCurrent: true,
      academicYear: "2025/2026",
    },
  });
  console.log(`  ✓ Semester: ${semester.name}`);

  // Get departments + programmes
  const engDept = await db.department.findFirst({ where: { slug: "engineering" } });
  const ictDept = await db.department.findFirst({ where: { slug: "ict" } });
  const bizDept = await db.department.findFirst({ where: { slug: "business" } });

  if (!engDept || !ictDept || !bizDept) {
    throw new Error("Departments not found. Run main seed first: bun run db:seed");
  }

  // Create units
  const units = [
    { code: "ENG 1101", title: "Engineering Mathematics I", departmentId: engDept.id, credits: 3, instructor: "Dr. Wanjiru Maina" },
    { code: "ENG 1102", title: "Technical Drawing", departmentId: engDept.id, credits: 2, instructor: "Eng. Peter Kamau" },
    { code: "ENG 1103", title: "Workshop Practice I", departmentId: engDept.id, credits: 3, instructor: "Mr. James Otieno" },
    { code: "ENG 1104", title: "Engineering Materials", departmentId: engDept.id, credits: 2, instructor: "Dr. Sarah Achieng" },
    { code: "ICT 1101", title: "Introduction to Programming", departmentId: ictDept.id, credits: 3, instructor: "Mr. David Mwangi" },
    { code: "ICT 1102", title: "Computer Networks", departmentId: ictDept.id, credits: 3, instructor: "Ms. Faith Njoroge" },
    { code: "ICT 1103", title: "Database Systems", departmentId: ictDept.id, credits: 3, instructor: "Dr. Daniel Kiprop" },
    { code: "BIZ 1101", title: "Business Communication", departmentId: bizDept.id, credits: 2, instructor: "Mrs. Mary Wambui" },
    { code: "BIZ 1102", title: "Financial Accounting", departmentId: bizDept.id, credits: 3, instructor: "CPA John Mutiso" },
  ];

  for (const u of units) {
    await db.unit.upsert({
      where: { code: u.code },
      update: {},
      create: {
        ...u,
        description: `${u.title} — foundational unit covering core concepts and practical applications.`,
        semesterId: semester.id,
        year: 1,
      },
    });
  }
  console.log(`  ✓ ${units.length} units`);

  // Get programmes for student enrollment
  const engProg = await db.programme.findFirst({ where: { code: "CIV/4/1" } });
  const ictProg = await db.programme.findFirst({ where: { code: "SWE/5/1" } });
  const bizProg = await db.programme.findFirst({ where: { code: "BUS/4/1" } });

  // ── Create 3 demo students ─────────────────────────────────
  const students = [
    {
      email: "student@northgate.ac.ke",
      name: "Alex Mwangi",
      admissionNo: "NG/2025/001",
      programme: engProg,
      gender: "MALE",
      phone: "+254712345678",
      idNumber: "12345678",
      nextOfKin: "Grace Mwangi",
      nextOfKinPhone: "+254712345679",
      gpa: 3.65,
      attendance: 92,
      progress: 65,
      profileComplete: 85,
      units: ["ENG 1101", "ENG 1102", "ENG 1103", "ENG 1104", "BIZ 1101"],
    },
    {
      email: "mary.student@northgate.ac.ke",
      name: "Mary Wanjiru",
      admissionNo: "NG/2025/002",
      programme: ictProg,
      gender: "FEMALE",
      phone: "+254722334455",
      idNumber: "23456789",
      nextOfKin: "Peter Wanjiru",
      nextOfKinPhone: "+254722334456",
      gpa: 3.85,
      attendance: 96,
      progress: 70,
      profileComplete: 95,
      units: ["ICT 1101", "ICT 1102", "ICT 1103", "BIZ 1101", "BIZ 1102"],
    },
    {
      email: "brian.student@northgate.ac.ke",
      name: "Brian Otieno",
      admissionNo: "NG/2025/003",
      programme: bizProg,
      gender: "MALE",
      phone: "+254733445566",
      idNumber: "34567890",
      nextOfKin: "Janet Otieno",
      nextOfKinPhone: "+254733445567",
      gpa: 3.20,
      attendance: 85,
      progress: 55,
      profileComplete: 70,
      units: ["BIZ 1101", "BIZ 1102", "ICT 1101", "ENG 1102"],
    },
  ];

  for (const s of students) {
    const passwordHash = await bcrypt.hash("Student@2026", 12);
    const user = await db.user.upsert({
      where: { emailNormalized: s.email },
      update: {},
      create: {
        email: s.email,
        emailNormalized: s.email,
        name: s.name,
        passwordHash,
        role: "STUDENT",
        status: "ACTIVE",
        emailVerifiedAt: new Date(),
        phone: s.phone,
      },
    });

    const student = await db.student.upsert({
      where: { admissionNo: s.admissionNo },
      update: {
        currentGPA: s.gpa,
        attendanceRate: s.attendance,
        overallProgress: s.progress,
        profileComplete: s.profileComplete,
      },
      create: {
        userId: user.id,
        admissionNo: s.admissionNo,
        programmeId: s.programme?.id,
        year: 1,
        semester: 1,
        status: "ACTIVE",
        gender: s.gender,
        phone: s.phone,
        idNumber: s.idNumber,
        nationality: "Kenyan",
        dateOfBirth: new Date("2004-05-15"),
        address: "Nairobi, Kenya",
        nextOfKin: s.nextOfKin,
        nextOfKinPhone: s.nextOfKinPhone,
        profileImageUrl: s.gender === "FEMALE"
          ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
          : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        currentGPA: s.gpa,
        attendanceRate: s.attendance,
        overallProgress: s.progress,
        profileComplete: s.profileComplete,
        enrollmentDate: daysAgo(60),
      },
    });
    console.log(`  ✓ Student: ${s.email} (admission: ${s.admissionNo})`);

    // Enroll student in units
    for (const unitCode of s.units) {
      const unit = await db.unit.findFirst({ where: { code: unitCode } });
      if (!unit) continue;
      await db.enrollment.upsert({
        where: {
          studentId_unitId_semesterId: {
            studentId: student.id,
            unitId: unit.id,
            semesterId: semester.id,
          },
        },
        update: {},
        create: {
          studentId: student.id,
          unitId: unit.id,
          semesterId: semester.id,
          status: "ENROLLED",
        },
      });
    }

    // Create assessments for each unit + student submissions
    const enrolledUnits = await db.unit.findMany({
      where: { enrollments: { some: { studentId: student.id } } },
    });
    for (const unit of enrolledUnits) {
      // 2 assessments per unit: 1 assignment (past), 1 CAT (upcoming)
      const pastAssignment = await db.assessment.create({
        data: {
          unitId: unit.id,
          title: `${unit.code} Assignment 1`,
          type: "ASSIGNMENT",
          description: `Assignment covering the first 4 weeks of ${unit.title}.`,
          maxMarks: 100,
          weight: 0.15,
          dueDate: daysAgo(20),
          semesterId: semester.id,
        },
      });
      // Submit and grade
      const marks = Math.floor(60 + Math.random() * 35);
      await db.submission.create({
        data: {
          assessmentId: pastAssignment.id,
          studentId: student.id,
          submittedAt: daysAgo(22),
          marks,
          status: "GRADED",
          feedback: marks >= 80 ? "Excellent work!" : marks >= 65 ? "Good effort, room for improvement." : "Please review the material and seek help.",
        },
      });

      const upcomingCat = await db.assessment.create({
        data: {
          unitId: unit.id,
          title: `${unit.code} CAT 1`,
          type: "CAT",
          description: `Continuous Assessment Test 1 for ${unit.title}.`,
          maxMarks: 100,
          weight: 0.20,
          dueDate: daysFromNow(7 + Math.floor(Math.random() * 10)),
          semesterId: semester.id,
        },
      });
      // Pending submission for this CAT
      await db.submission.create({
        data: {
          assessmentId: upcomingCat.id,
          studentId: student.id,
          status: "PENDING",
        },
      });

      // POE Request (1 per unit, pending)
      await db.assessment.create({
        data: {
          unitId: unit.id,
          title: `${unit.code} POE Request`,
          type: "POE_REQUEST",
          description: `Portfolio of Evidence request for ${unit.title}. Submit your practical work and project documentation.`,
          maxMarks: 100,
          weight: 0.40,
          dueDate: daysFromNow(21),
          semesterId: semester.id,
        },
      });
    }

    // Create attendance records (last 30 days, ~5 sessions per week)
    for (let d = 30; d >= 0; d--) {
      const date = daysAgo(d);
      const day = date.getDay();
      if (day === 0 || day === 6) continue; // Skip weekends
      // Random unit for that day
      const unit = enrolledUnits[d % enrolledUnits.length];
      if (!unit) continue;
      const r = Math.random();
      const status = r > 0.92 ? "ABSENT" : r > 0.85 ? "LATE" : r > 0.97 ? "EXCUSED" : "PRESENT";
      try {
        await db.attendance.create({
          data: {
            studentId: student.id,
            unitId: unit.id,
            date,
            status,
          },
        });
      } catch {
        // Unique constraint — skip duplicates
      }
    }

    // Create fees (idempotent by studentId + type + semesterId)
    const tuitionFee = await db.fee.upsert({
      where: { studentId_semesterId_type: { studentId: student.id, semesterId: semester.id, type: "TUITION" } },
      update: {},
      create: {
        studentId: student.id,
        semesterId: semester.id,
        type: "TUITION",
        amount: 85000,
        dueDate: daysAgo(30),
        status: "PARTIAL",
      },
    });
    // Partial payment (idempotent by reference)
    const payRef = `MPESA-${student.admissionNo.replace(/\//g, "")}-1`;
    const existingPay = await db.payment.findUnique({ where: { reference: payRef } });
    if (!existingPay) {
      await db.payment.create({
        data: {
          feeId: tuitionFee.id,
          studentId: student.id,
          amount: 50000,
          method: "MPESA",
          reference: payRef,
          paidAt: daysAgo(45),
        },
      });
    }

    const labFee = await db.fee.upsert({
      where: { studentId_semesterId_type: { studentId: student.id, semesterId: semester.id, type: "LAB" } },
      update: {},
      create: {
        studentId: student.id,
        semesterId: semester.id,
        type: "LAB",
        amount: 15000,
        dueDate: daysFromNow(7),
        status: "PENDING",
      },
    });

    const hostelFee = await db.fee.upsert({
      where: { studentId_semesterId_type: { studentId: student.id, semesterId: semester.id, type: "HOSTEL" } },
      update: {},
      create: {
        studentId: student.id,
        semesterId: semester.id,
        type: "HOSTEL",
        amount: 25000,
        dueDate: daysFromNow(14),
        status: "PENDING",
      },
    });

    // Create results for past semester (mock previous results for trend)
    const prevSemester = await db.semester.upsert({
      where: { code: "2024/2025-S2" },
      update: {},
      create: {
        name: "Semester 2, 2024/2025",
        code: "2024/2025-S2",
        startDate: daysAgo(180),
        endDate: daysAgo(120),
        isCurrent: false,
        academicYear: "2024/2025",
      },
    });

    // Past results for GPA trend
    const pastUnits = enrolledUnits.slice(0, 3);
    for (const unit of pastUnits) {
      const marks = Math.floor(55 + Math.random() * 40);
      const grade = marks >= 70 ? "A" : marks >= 60 ? "B" : marks >= 50 ? "C" : "D";
      const gpa = marks >= 70 ? 4.0 : marks >= 60 ? 3.0 : marks >= 50 ? 2.0 : 1.0;
      try {
        await db.result.create({
          data: {
            studentId: student.id,
            unitId: unit.id,
            semesterId: prevSemester.id,
            marks,
            grade,
            gpa,
            releasedAt: daysAgo(120),
            status: "RELEASED",
          },
        });
      } catch {}
    }

    // Current semester results (draft)
    for (const unit of enrolledUnits.slice(0, 2)) {
      const marks = Math.floor(60 + Math.random() * 35);
      const grade = marks >= 70 ? "A" : marks >= 60 ? "B" : "C";
      const gpa = marks >= 70 ? 4.0 : marks >= 60 ? 3.0 : 2.0;
      try {
        await db.result.create({
          data: {
            studentId: student.id,
            unitId: unit.id,
            semesterId: semester.id,
            marks,
            grade,
            gpa,
            status: "RELEASED",
            releasedAt: daysAgo(5),
          },
        });
      } catch {}
    }

    // Exam card
    await db.examCard.create({
      data: {
        studentId: student.id,
        semesterId: semester.id,
        status: "ISSUED",
        issuedAt: daysAgo(10),
      },
    });

    // Notifications
    const notifs = [
      { title: "New Result Released", message: `Your ${enrolledUnits[0]?.title || "Unit"} result has been released.`, type: "ACADEMIC", link: "/student/results" },
      { title: "Fee Reminder", message: `Your lab fee of KES 15,000 is due in 7 days.`, type: "FINANCE", link: "/student/finance" },
      { title: "Assignment Graded", message: `Your ${enrolledUnits[0]?.code || "ENG 1101"} Assignment 1 has been graded.`, type: "ACADEMIC", link: "/student/assessments" },
      { title: "Exam Card Issued", message: `Your exam card for ${semester.name} has been issued. Download it now.`, type: "SUCCESS", link: "/student/exam-card" },
      { title: "New Announcement", message: `Library extended hours during exam period.`, type: "ANNOUNCEMENT", link: "/student/notifications" },
    ];
    for (const n of notifs) {
      await db.notification.create({
        data: {
          studentId: student.id,
          ...n,
          readAt: Math.random() > 0.5 ? daysAgo(2) : null,
        },
      });
    }

    // Hostel allocation
    const hostel = await db.hostel.upsert({
      where: { name: "Northgate Hostel Block A" },
      update: {},
      create: {
        name: "Northgate Hostel Block A",
        block: "A",
        gender: "ANY",
        capacity: 200,
        occupied: 145,
      },
    });
    await db.hostelAllocation.upsert({
      where: { studentId: student.id },
      update: {},
      create: {
        studentId: student.id,
        hostelId: hostel.id,
        roomNo: `A-${100 + students.indexOf(s) + 1}`,
      },
    });
  }

  // Library books (shared)
  const books = [
    { title: "Engineering Mathematics", author: "K.A. Stroud", category: "Engineering", total: 5 },
    { title: "Introduction to Algorithms", author: "Cormen, Leiserson, Rivest, Stein", category: "Computer Science", total: 8 },
    { title: "Database System Concepts", author: "Silberschatz, Korth, Sudarshan", category: "Computer Science", total: 4 },
    { title: "Technical Drawing with Engineering Graphics", author: "Frederick Giesecke", category: "Engineering", total: 3 },
    { title: "Principles of Financial Accounting", author: "Belverd E. Needles", category: "Business", total: 6 },
    { title: "Computer Networks: A Systems Approach", author: "Larry L. Peterson", category: "Computer Science", total: 4 },
    { title: "Workshop Theory and Practice", author: "W.A.J. Chapman", category: "Engineering", total: 5 },
    { title: "Business Communication Today", author: "Courtland L. Bovée", category: "Business", total: 7 },
  ];
  for (const b of books) {
    const existing = await db.libraryBook.findFirst({ where: { title: b.title } });
    if (!existing) {
      await db.libraryBook.create({
        data: {
          title: b.title,
          author: b.author,
          category: b.category,
          totalCopies: b.total,
          availableCopies: b.total - Math.floor(Math.random() * b.total),
          coverUrl: `https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80`,
          description: `${b.title} by ${b.author}.`,
        },
      });
    }
  }
  console.log(`  ✓ ${books.length} library books`);

  // Assign some book loans to first student
  const firstStudent = await db.student.findFirst({ where: { admissionNo: "NG/2025/001" } });
  if (firstStudent) {
    const book1 = await db.libraryBook.findFirst({ where: { title: "Engineering Mathematics" } });
    const book2 = await db.libraryBook.findFirst({ where: { title: "Technical Drawing with Engineering Graphics" } });
    if (book1) {
      await db.bookLoan.create({
        data: {
          bookId: book1.id,
          studentId: firstStudent.id,
          dueAt: daysFromNow(10),
          status: "ACTIVE",
        },
      });
    }
    if (book2) {
      await db.bookLoan.create({
        data: {
          bookId: book2.id,
          studentId: firstStudent.id,
          dueAt: daysAgo(2),
          status: "OVERDUE",
        },
      });
    }
  }

  // Announcements (shared)
  const admin = await db.user.findFirst({ where: { emailNormalized: "admin@northgate.ac.ke" } });
  const announcements = [
    { title: "Mid-Semester Exams Schedule Released", content: "The mid-semester examination timetable has been published. Please check your student portal under Exam Card section for your schedule.", category: "Academic", audience: "STUDENTS" },
    { title: "Library Extended Hours", content: "The library will operate 24/7 during the examination period (3 weeks). Take advantage of the extended study hours.", category: "General", audience: "STUDENTS" },
    { title: "Fee Payment Deadline Approaching", content: "All semester fees must be cleared by the end of this month. Late payments attract a 5% surcharge.", category: "Finance", audience: "STUDENTS" },
    { title: "Industry Career Fair", content: "Annual career fair on August 30. 80+ employers will be on campus. Bring multiple copies of your CV.", category: "Events", audience: "STUDENTS" },
    { title: "System Maintenance Notice", content: "The portal will undergo maintenance this Saturday from 2 AM to 4 AM. Plan your activities accordingly.", category: "Urgent", audience: "ALL" },
  ];
  for (const a of announcements) {
    const existing = await db.announcement.findFirst({ where: { title: a.title } });
    if (!existing) {
      await db.announcement.create({
        data: {
          ...a,
          authorId: admin?.id,
          publishedAt: daysAgo(Math.floor(Math.random() * 7)),
        },
      });
    }
  }
  console.log(`  ✓ ${announcements.length} announcements`);

  // Send welcome message to each student
  for (const s of students) {
    const student = await db.student.findFirst({ where: { admissionNo: s.admissionNo } });
    if (student && admin) {
      await db.message.create({
        data: {
          fromUserId: admin.id,
          toStudentId: student.id,
          subject: "Welcome to Northgate Student Portal",
          body: `Dear ${s.name},\n\nWelcome to the Northgate Student Portal! Your account is now active.\n\nAdmission Number: ${s.admissionNo}\nProgramme: ${s.programme?.title || "—"}\n\nExplore your dashboard to view units, assessments, attendance, results, fees, and more.\n\nIf you need any assistance, please use the Support section.\n\nBest regards,\nNorthgate Administration`,
          readAt: null,
        },
      });
    }
  }
  console.log(`  ✓ Welcome messages sent`);

  console.log("\n✅ Student seed complete.");
  console.log("   Student 1: student@northgate.ac.ke / Student@2026 (Engineering)");
  console.log("   Student 2: mary.student@northgate.ac.ke / Student@2026 (ICT)");
  console.log("   Student 3: brian.student@northgate.ac.ke / Student@2026 (Business)");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
