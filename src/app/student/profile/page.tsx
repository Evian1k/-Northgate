import { db } from "@/lib/db";
import { getCurrentStudent } from "@/lib/student-session";
import { ProfileClient } from "./ProfileClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const student = await getCurrentStudent();
  if (!student) return <div>Unauthorized</div>;

  const fullStudent = await db.student.findFirst({
    where: { id: student.id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      programme: { select: { title: true, code: true, qualification: true } },
      hostelAlloc: { include: { hostel: true } },
    },
  });

  if (!fullStudent) return <div>Not found</div>;

  return (
    <ProfileClient
      profile={{
        name: fullStudent.user.name,
        email: fullStudent.user.email,
        phone: fullStudent.phone || fullStudent.user.phone || "",
        admissionNo: fullStudent.admissionNo,
        gender: fullStudent.gender || "",
        dateOfBirth: fullStudent.dateOfBirth?.toISOString().slice(0, 10) || "",
        nationality: fullStudent.nationality || "",
        idNumber: fullStudent.idNumber || "",
        address: fullStudent.address || "",
        nextOfKin: fullStudent.nextOfKin || "",
        nextOfKinPhone: fullStudent.nextOfKinPhone || "",
        profileImageUrl: fullStudent.profileImageUrl,
        profileComplete: fullStudent.profileComplete,
        programme: fullStudent.programme?.title || "—",
        year: fullStudent.year,
        semester: fullStudent.semester,
        enrollmentDate: fullStudent.enrollmentDate.toISOString(),
        hostel: fullStudent.hostelAlloc
          ? { room: fullStudent.hostelAlloc.roomNo, name: fullStudent.hostelAlloc.hostel.name }
          : null,
      }}
    />
  );
}
