/**
 * Seed 3 additional demo students with different scenarios:
 * 4. Grace Achieng — Nursing student, perfect attendance, top performer
 * 5. David Kiprop — Agribusiness student, struggling (low GPA, overdue fees)
 * 6. Faith Njoroge — Culinary Arts, final year about to graduate
 *
 * Run: bun run db:seed:students2
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
  console.log("🌱 Seeding 3 additional demo students…");

  const semester = await db.semester.findFirst({ where: { isCurrent: true } });
  if (!semester) throw new Error("Current semester not found. Run db:seed:students first.");

  // Get departments + units
  const healthDept = await db.department.findFirst({ where: { slug: "health-sciences" } });
  const agriDept = await db.department.findFirst({ where: { slug: "agriculture" } });
  const hospDept = await db.department.findFirst({ where: { slug: "hospitality" } });

  if (!healthDept || !agriDept || !hospDept) {
    throw new Error("Departments not found. Run main seed first.");
  }

  // Create additional units for health, agriculture, hospitality
  const additionalUnits = [
    { code: "NUR 1101", title: "Anatomy & Physiology I", departmentId: healthDept.id, credits: 3, instructor: "Dr. Sarah Achieng" },
    { code: "NUR 1102", title: "Fundamentals of Nursing", departmentId: healthDept.id, credits: 3, instructor: "Ms. Grace Kamau" },
    { code: "NUR 1103", title: "Clinical Practice I", departmentId: healthDept.id, credits: 4, instructor: "Dr. Peter Otieno" },
    { code: "AGR 1101", title: "Principles of Agriculture", departmentId: agriDept.id, credits: 3, instructor: "Mr. James Mwangi" },
    { code: "AGR 1102", title: "Soil Science", departmentId: agriDept.id, credits: 2, instructor: "Dr. Faith Wanjiru" },
    { code: "AGR 1103", title: "Crop Production", departmentId: agriDept.id, credits: 3, instructor: "Mr. Daniel Kiprop" },
    { code: "CUL 1101", title: "Culinary Fundamentals", departmentId: hospDept.id, credits: 3, instructor: "Chef Mary Atieno" },
    { code: "CUL 1102", title: "Food Safety & Hygiene", departmentId: hospDept.id, credits: 2, instructor: "Mr. Samuel Kariuki" },
    { code: "CUL 1103", title: "Pastry & Bakery", departmentId: hospDept.id, credits: 3, instructor: "Chef Aisha Hassan" },
  ];

  for (const u of additionalUnits) {
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
  console.log(`  ✓ ${additionalUnits.length} additional units`);

  // Get programmes
  const nurProg = await db.programme.findFirst({ where: { code: "NUR/3/1" } });
  const agrProg = await db.programme.findFirst({ where: { code: "AGR/4/1" } });
  const culProg = await db.programme.findFirst({ where: { code: "CUL/3/1" } });

  const newStudents = [
    {
      email: "grace.student@northgate.ac.ke",
      name: "Grace Achieng",
      admissionNo: "NG/2025/004",
      programme: nurProg,
      gender: "FEMALE",
      phone: "+254740111222",
      idNumber: "45678901",
      nextOfKin: "Mary Achieng",
      nextOfKinPhone: "+254740111223",
      gpa: 3.95,
      attendance: 98,
      progress: 75,
      profileComplete: 100,
      units: ["NUR 1101", "NUR 1102", "NUR 1103", "BIZ 1101"],
      scenario: "top_performer",
    },
    {
      email: "david.student@northgate.ac.ke",
      name: "David Kiprop",
      admissionNo: "NG/2025/005",
      programme: agrProg,
      gender: "MALE",
      phone: "+254750333444",
      idNumber: "56789012",
      nextOfKin: "Ruth Kiprop",
      nextOfKinPhone: "+254750333445",
      gpa: 2.10,
      attendance: 68,
      progress: 40,
      profileComplete: 60,
      units: ["AGR 1101", "AGR 1102", "AGR 1103", "BIZ 1101"],
      scenario: "struggling",
    },
    {
      email: "faith.student@northgate.ac.ke",
      name: "Faith Njoroge",
      admissionNo: "NG/2024/089",
      programme: culProg,
      gender: "FEMALE",
      phone: "+254760555666",
      idNumber: "67890123",
      nextOfKin: "John Njoroge",
      nextOfKinPhone: "+254760555667",
      gpa: 3.45,
      attendance: 91,
      progress: 92,
      profileComplete: 90,
      units: ["CUL 1101", "CUL 1102", "CUL 1103", "BIZ 1101"],
      scenario: "graduating",
    },
  ];

  for (const s of newStudents) {
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
        year: s.scenario === "graduating" ? 2 : 1,
        semester: s.scenario === "graduating" ? 2 : 1,
        status: "ACTIVE",
        gender: s.gender,
        phone: s.phone,
        idNumber: s.idNumber,
        nationality: "Kenyan",
        dateOfBirth: new Date("2003-08-22"),
        address: "Nairobi, Kenya",
        nextOfKin: s.nextOfKin,
        nextOfKinPhone: s.nextOfKinPhone,
        profileImageUrl: s.gender === "FEMALE"
          ? "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80"
          : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        currentGPA: s.gpa,
        attendanceRate: s.attendance,
        overallProgress: s.progress,
        profileComplete: s.profileComplete,
        enrollmentDate: daysAgo(s.scenario === "graduating" ? 420 : 60),
      },
    });
    console.log(`  ✓ Student: ${s.email} (${s.scenario})`);

    // Enroll in units
    for (const unitCode of s.units) {
      const unit = await db.unit.findFirst({ where: { code: unitCode } });
      if (!unit) continue;
      try {
        await db.enrollment.create({
          data: {
            studentId: student.id,
            unitId: unit.id,
            semesterId: semester.id,
            status: "ENROLLED",
          },
        });
      } catch {}
    }

    // Create assessments + submissions
    const enrolledUnits = await db.unit.findMany({
      where: { enrollments: { some: { studentId: student.id } } },
    });
    for (const unit of enrolledUnits) {
      // Past assignment (graded) — performance varies by scenario
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
      // Marks vary by scenario
      let marks: number;
      if (s.scenario === "top_performer") marks = Math.floor(85 + Math.random() * 13);
      else if (s.scenario === "struggling") marks = Math.floor(40 + Math.random() * 25);
      else marks = Math.floor(65 + Math.random() * 25);

      try {
        await db.submission.create({
          data: {
            assessmentId: pastAssignment.id,
            studentId: student.id,
            submittedAt: daysAgo(22),
            marks,
            status: "GRADED",
            feedback: marks >= 80 ? "Excellent work!" : marks >= 60 ? "Good effort." : "Please seek help and review the material.",
          },
        });
      } catch {}

      // Upcoming CAT
      const upcomingCat = await db.assessment.create({
        data: {
          unitId: unit.id,
          title: `${unit.code} CAT 1`,
          type: "CAT",
          description: `Continuous Assessment Test 1 for ${unit.title}.`,
          maxMarks: 100,
          weight: 0.20,
          dueDate: daysFromNow(5 + Math.floor(Math.random() * 10)),
          semesterId: semester.id,
        },
      });
      try {
        await db.submission.create({
          data: {
            assessmentId: upcomingCat.id,
            studentId: student.id,
            status: "PENDING",
          },
        });
      } catch {}

      // POE request
      await db.assessment.create({
        data: {
          unitId: unit.id,
          title: `${unit.code} POE Request`,
          type: "POE_REQUEST",
          description: `Portfolio of Evidence request for ${unit.title}.`,
          maxMarks: 100,
          weight: 0.40,
          dueDate: daysFromNow(21),
          semesterId: semester.id,
        },
      });
    }

    // Attendance — varies by scenario
    for (let d = 30; d >= 0; d--) {
      const date = daysAgo(d);
      const day = date.getDay();
      if (day === 0 || day === 6) continue;
      const unit = enrolledUnits[d % enrolledUnits.length];
      if (!unit) continue;
      let status: string;
      if (s.scenario === "top_performer") {
        const r = Math.random();
        status = r > 0.98 ? "LATE" : "PRESENT";
      } else if (s.scenario === "struggling") {
        const r = Math.random();
        status = r > 0.65 ? "ABSENT" : r > 0.55 ? "LATE" : "PRESENT";
      } else {
        const r = Math.random();
        status = r > 0.90 ? "ABSENT" : r > 0.85 ? "LATE" : "PRESENT";
      }
      try {
        await db.attendance.create({
          data: { studentId: student.id, unitId: unit.id, date, status },
        });
      } catch {}
    }

    // Fees — varies by scenario
    if (s.scenario === "struggling") {
      // Overdue fees, no payment
      const tuitionFee = await db.fee.upsert({
        where: { studentId_semesterId_type: { studentId: student.id, semesterId: semester.id, type: "TUITION" } },
        update: { status: "OVERDUE", dueDate: daysAgo(15) },
        create: {
          studentId: student.id, semesterId: semester.id, type: "TUITION",
          amount: 68000, dueDate: daysAgo(15), status: "OVERDUE",
        },
      });
      await db.fee.upsert({
        where: { studentId_semesterId_type: { studentId: student.id, semesterId: semester.id, type: "LAB" } },
        update: {},
        create: {
          studentId: student.id, semesterId: semester.id, type: "LAB",
          amount: 12000, dueDate: daysAgo(5), status: "OVERDUE",
        },
      });
      await db.fee.upsert({
        where: { studentId_semesterId_type: { studentId: student.id, semesterId: semester.id, type: "HOSTEL" } },
        update: {},
        create: {
          studentId: student.id, semesterId: semester.id, type: "HOSTEL",
          amount: 25000, dueDate: daysFromNow(3), status: "PENDING",
        },
      });
    } else if (s.scenario === "top_performer") {
      // Fully paid
      const tuitionFee = await db.fee.upsert({
        where: { studentId_semesterId_type: { studentId: student.id, semesterId: semester.id, type: "TUITION" } },
        update: { status: "PAID" },
        create: {
          studentId: student.id, semesterId: semester.id, type: "TUITION",
          amount: 65000, dueDate: daysAgo(30), status: "PAID",
        },
      });
      // Add payment record
      const payRef = `MPESA-${student.admissionNo.replace(/\//g, "")}-FULL`;
      const existingPay = await db.payment.findUnique({ where: { reference: payRef } });
      if (!existingPay) {
        await db.payment.create({
          data: {
            feeId: tuitionFee.id, studentId: student.id, amount: 65000,
            method: "MPESA", reference: payRef, paidAt: daysAgo(35),
          },
        });
      }
      await db.fee.upsert({
        where: { studentId_semesterId_type: { studentId: student.id, semesterId: semester.id, type: "LAB" } },
        update: { status: "PAID" },
        create: {
          studentId: student.id, semesterId: semester.id, type: "LAB",
          amount: 12000, dueDate: daysAgo(20), status: "PAID",
        },
      });
    } else {
      // Graduating — partial payment
      const tuitionFee = await db.fee.upsert({
        where: { studentId_semesterId_type: { studentId: student.id, semesterId: semester.id, type: "TUITION" } },
        update: {},
        create: {
          studentId: student.id, semesterId: semester.id, type: "TUITION",
          amount: 58000, dueDate: daysAgo(30), status: "PARTIAL",
        },
      });
      const payRef = `MPESA-${student.admissionNo.replace(/\//g, "")}-PART`;
      const existingPay = await db.payment.findUnique({ where: { reference: payRef } });
      if (!existingPay) {
        await db.payment.create({
          data: {
            feeId: tuitionFee.id, studentId: student.id, amount: 40000,
            method: "MPESA", reference: payRef, paidAt: daysAgo(40),
          },
        });
      }
    }

    // Results — vary by scenario
    const prevSemester = await db.semester.findFirst({ where: { code: "2024/2025-S2" } });
    if (prevSemester) {
      for (const unit of enrolledUnits.slice(0, 3)) {
        let marks: number;
        if (s.scenario === "top_performer") marks = Math.floor(80 + Math.random() * 18);
        else if (s.scenario === "struggling") marks = Math.floor(45 + Math.random() * 20);
        else marks = Math.floor(60 + Math.random() * 30);
        const grade = marks >= 70 ? "A" : marks >= 60 ? "B" : marks >= 50 ? "C" : marks >= 40 ? "D" : "F";
        const gpa = marks >= 70 ? 4.0 : marks >= 60 ? 3.0 : marks >= 50 ? 2.0 : marks >= 40 ? 1.0 : 0;
        try {
          await db.result.create({
            data: {
              studentId: student.id, unitId: unit.id, semesterId: prevSemester.id,
              marks, grade, gpa, releasedAt: daysAgo(120), status: "RELEASED",
            },
          });
        } catch {}
      }
    }

    // Current semester results
    for (const unit of enrolledUnits.slice(0, 2)) {
      let marks: number;
      if (s.scenario === "top_performer") marks = Math.floor(85 + Math.random() * 13);
      else if (s.scenario === "struggling") marks = Math.floor(45 + Math.random() * 20);
      else marks = Math.floor(65 + Math.random() * 25);
      const grade = marks >= 70 ? "A" : marks >= 60 ? "B" : marks >= 50 ? "C" : marks >= 40 ? "D" : "F";
      const gpa = marks >= 70 ? 4.0 : marks >= 60 ? 3.0 : marks >= 50 ? 2.0 : marks >= 40 ? 1.0 : 0;
      try {
        await db.result.create({
          data: {
            studentId: student.id, unitId: unit.id, semesterId: semester.id,
            marks, grade, gpa, status: "RELEASED", releasedAt: daysAgo(5),
          },
        });
      } catch {}
    }

    // Exam card — top performer and graduating have issued, struggling has pending
    const examCardStatus = s.scenario === "struggling" ? "PENDING" : "ISSUED";
    try {
      await db.examCard.create({
        data: {
          studentId: student.id, semesterId: semester.id,
          status: examCardStatus,
          issuedAt: examCardStatus === "ISSUED" ? daysAgo(10) : null,
        },
      });
    } catch {}

    // Notifications — vary by scenario
    const notifs = s.scenario === "struggling"
      ? [
          { title: "Fee Overdue Notice", message: "Your tuition fee of KES 68,000 is 15 days overdue. Please pay immediately to avoid suspension.", type: "ERROR", link: "/student/finance" },
          { title: "Low Attendance Warning", message: "Your attendance is below 70%. You may be barred from exams.", type: "WARNING", link: "/student/attendance" },
          { title: "Exam Card Pending", message: "Your exam card cannot be issued until fees are cleared.", type: "WARNING", link: "/student/exam-card" },
          { title: "Assignment Graded", message: "Your AGR 1101 Assignment 1 has been graded.", type: "ACADEMIC", link: "/student/assessments" },
          { title: "Support Available", message: "Free tutoring available. Contact the academic office.", type: "INFO", link: "/student/support" },
        ]
      : s.scenario === "top_performer"
      ? [
          { title: "Exam Card Issued", message: "Your exam card has been issued. Download it now.", type: "SUCCESS", link: "/student/exam-card" },
          { title: "Outstanding Result", message: "You scored A in NUR 1101. Congratulations!", type: "ACADEMIC", link: "/student/results" },
          { title: "Fees Fully Paid", message: "Thank you! Your semester fees are fully cleared.", type: "FINANCE", link: "/student/finance" },
          { title: "Perfect Attendance", message: "You've maintained 98% attendance. Keep it up!", type: "SUCCESS", link: "/student/attendance" },
          { title: "Scholarship Opportunity", message: "You qualify for the merit scholarship. Apply by next week.", type: "ANNOUNCEMENT", link: "/student/notifications" },
        ]
      : [
          { title: "Graduation Approaching", message: "Your graduation ceremony is scheduled. Check details.", type: "SUCCESS", link: "/student/calendar" },
          { title: "Final Results Released", message: "Your final semester results are now available.", type: "ACADEMIC", link: "/student/results" },
          { title: "Exam Card Issued", message: "Your final exam card has been issued.", type: "SUCCESS", link: "/student/exam-card" },
          { title: "Fee Balance Reminder", message: "Clear your balance before graduation.", type: "FINANCE", link: "/student/finance" },
          { title: "Alumni Network", message: "Join the Northgate Alumni Network after graduation.", type: "ANNOUNCEMENT", link: "/student/notifications" },
        ];
    for (const n of notifs) {
      await db.notification.create({
        data: {
          studentId: student.id, ...n,
          readAt: Math.random() > 0.5 ? daysAgo(2) : null,
        },
      });
    }

    // Hostel allocation (skip for struggling student — no hostel due to fees)
    if (s.scenario !== "struggling") {
      const hostel = await db.hostel.upsert({
        where: { name: s.gender === "FEMALE" ? "Northgate Hostel Block B" : "Northgate Hostel Block A" },
        update: {},
        create: {
          name: s.gender === "FEMALE" ? "Northgate Hostel Block B" : "Northgate Hostel Block A",
          block: s.gender === "FEMALE" ? "B" : "A",
          gender: s.gender === "FEMALE" ? "FEMALE" : "MALE",
          capacity: 200,
          occupied: 150,
        },
      });
      try {
        await db.hostelAllocation.create({
          data: {
            studentId: student.id, hostelId: hostel.id,
            roomNo: `${s.gender === "FEMALE" ? "B" : "A"}-${200 + newStudents.indexOf(s) + 1}`,
          },
        });
      } catch {}
    }
  }

  console.log("\n✅ Additional students seed complete.");
  console.log("   Student 4: grace.student@northgate.ac.ke / Student@2026 (Nursing, top performer, GPA 3.95)");
  console.log("   Student 5: david.student@northgate.ac.ke / Student@2026 (Agribusiness, struggling, GPA 2.10)");
  console.log("   Student 6: faith.student@northgate.ac.ke / Student@2026 (Culinary, graduating, GPA 3.45)");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
