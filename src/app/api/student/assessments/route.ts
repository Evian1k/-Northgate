import { db } from "@/lib/db";
import { apiHandler, ok, unauthorized, parseBody } from "@/lib/api";
import { getCurrentStudent } from "@/lib/student-session";

export const dynamic = "force-dynamic";

export const GET = apiHandler(async (req) => {
  const student = await getCurrentStudent();
  if (!student) return unauthorized();

  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const status = url.searchParams.get("status");

  const where: any = {
    unit: { enrollments: { some: { studentId: student.id } } },
  };
  if (type) where.type = type;
  if (status === "PENDING") {
    where.submissions = { none: { studentId: student.id, status: { in: ["SUBMITTED", "GRADED"] } } };
  } else if (status === "GRADED") {
    where.submissions = { some: { studentId: student.id, status: "GRADED" } };
  }

  const assessments = await db.assessment.findMany({
    where,
    orderBy: { dueDate: "asc" },
    include: {
      unit: { select: { code: true, title: true } },
      submissions: {
        where: { studentId: student.id },
        select: { id: true, status: true, marks: true, feedback: true, submittedAt: true },
      },
    },
    take: 100,
  });

  return ok(assessments.map((a) => ({
    id: a.id,
    title: a.title,
    type: a.type,
    description: a.description,
    maxMarks: a.maxMarks,
    weight: a.weight,
    dueDate: a.dueDate.toISOString(),
    unit: a.unit,
    submission: a.submissions[0] || null,
  })));
});

// Submit an assessment
export const POST = apiHandler(async (req) => {
  const student = await getCurrentStudent();
  if (!student) return unauthorized();

  const body = await parseBody(req);
  const { assessmentId, fileUrl } = body;

  const assessment = await db.assessment.findFirst({
    where: { id: assessmentId, unit: { enrollments: { some: { studentId: student.id } } } },
  });
  if (!assessment) return unauthorized("Assessment not available");

  const existing = await db.submission.findFirst({
    where: { assessmentId, studentId: student.id },
  });

  const isLate = new Date() > assessment.dueDate;
  const status = isLate ? "LATE" : "SUBMITTED";

  if (existing) {
    // Update
    const updated = await db.submission.update({
      where: { id: existing.id },
      data: {
        status,
        submittedAt: new Date(),
        fileUrl: fileUrl || existing.fileUrl,
      },
    });
    return ok(updated);
  }

  const submission = await db.submission.create({
    data: {
      assessmentId,
      studentId: student.id,
      status,
      submittedAt: new Date(),
      fileUrl,
    },
  });
  return ok(submission);
});
