import { db } from "@/lib/db";
import { apiHandler, ok, unauthorized, parseBody } from "@/lib/api";
import { getCurrentStudent } from "@/lib/student-session";

export const dynamic = "force-dynamic";

export const GET = apiHandler(async (req) => {
  const student = await getCurrentStudent();
  if (!student) return unauthorized();

  const fullStudent = await db.student.findFirst({
    where: { id: student.id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, image: true } },
      programme: { select: { id: true, title: true, code: true, qualification: true, duration: true } },
      hostelAlloc: { include: { hostel: true } },
    },
  });

  if (!fullStudent) return unauthorized();

  return ok({
    id: fullStudent.id,
    admissionNo: fullStudent.admissionNo,
    name: fullStudent.user.name,
    email: fullStudent.user.email,
    phone: fullStudent.phone || fullStudent.user.phone,
    gender: fullStudent.gender,
    dateOfBirth: fullStudent.dateOfBirth?.toISOString(),
    nationality: fullStudent.nationality,
    idNumber: fullStudent.idNumber,
    address: fullStudent.address,
    nextOfKin: fullStudent.nextOfKin,
    nextOfKinPhone: fullStudent.nextOfKinPhone,
    profileImageUrl: fullStudent.profileImageUrl || fullStudent.user.image,
    profileComplete: fullStudent.profileComplete,
    year: fullStudent.year,
    semester: fullStudent.semester,
    status: fullStudent.status,
    enrollmentDate: fullStudent.enrollmentDate.toISOString(),
    programme: fullStudent.programme,
    hostel: fullStudent.hostelAlloc
      ? { room: fullStudent.hostelAlloc.roomNo, name: fullStudent.hostelAlloc.hostel.name, block: fullStudent.hostelAlloc.hostel.block }
      : null,
  });
});

// Update profile
export const PATCH = apiHandler(async (req) => {
  const student = await getCurrentStudent();
  if (!student) return unauthorized();

  const body = await parseBody(req);
  const allowed = ["phone", "address", "nextOfKin", "nextOfKinPhone", "profileImageUrl", "gender", "nationality"];
  const data: any = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  // Calculate new profile completeness
  const current = await db.student.findFirst({ where: { id: student.id } });
  if (current) {
    const fields = ["phone", "address", "nextOfKin", "nextOfKinPhone", "gender", "nationality", "idNumber", "dateOfBirth"];
    const filled = fields.filter((f) => data[f] !== undefined ? data[f] : current[f as keyof typeof current]);
    data.profileComplete = Math.min(100, Math.round((filled.length / fields.length) * 100));
  }

  const updated = await db.student.update({
    where: { id: student.id },
    data,
  });

  return ok({ success: true, profileComplete: updated.profileComplete });
});
