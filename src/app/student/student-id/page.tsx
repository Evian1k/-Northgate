import { db } from "@/lib/db";
import { getCurrentStudent } from "@/lib/student-session";
import { StudentIdClient } from "./StudentIdClient";

export const dynamic = "force-dynamic";

export default async function StudentIdPage() {
  const student = await getCurrentStudent();
  if (!student) return <div>Unauthorized</div>;

  return (
    <StudentIdClient
      student={{
        name: student.user.name,
        admissionNo: student.admissionNo,
        programme: student.programme?.title || "—",
        qualification: student.programme?.qualification || "—",
        year: student.year,
        semester: student.semester,
        gender: student.gender || "—",
        nationality: student.nationality || "—",
        phone: student.phone || student.user.phone || "—",
        email: student.user.email,
        profileImageUrl: student.profileImageUrl,
        enrollmentDate: student.enrollmentDate.toISOString(),
        status: student.status,
      }}
    />
  );
}
