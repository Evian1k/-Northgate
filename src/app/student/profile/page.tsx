import { getCurrentUser } from "@/lib/session";
import { isDemoUser, demoProfile } from "@/lib/demo-student-data";
import { ProfileClient } from "./ProfileClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) return <div>Unauthorized</div>;
  if (isDemoUser(user.id)) return <ProfileClient profile={demoProfile} />;
  try {
    const { db } = await import("@/lib/db");
    const { getCurrentStudent } = await import("@/lib/student-session");
    const student = await getCurrentStudent();
    if (!student) return <div>Not found</div>;
    const fullStudent = await db.student.findFirst({ where: { id: student.id }, include: { user: { select: { name: true, email: true, phone: true } }, programme: { select: { title: true, code: true, qualification: true } }, hostelAlloc: { include: { hostel: true } } } });
    if (!fullStudent) return <div>Not found</div>;
    return <ProfileClient profile={{ name: fullStudent.user.name, email: fullStudent.user.email, phone: fullStudent.phone || fullStudent.user.phone || "", admissionNo: fullStudent.admissionNo, gender: fullStudent.gender || "", dateOfBirth: fullStudent.dateOfBirth?.toISOString().slice(0, 10) || "", nationality: fullStudent.nationality || "", idNumber: fullStudent.idNumber || "", address: fullStudent.address || "", nextOfKin: fullStudent.nextOfKin || "", nextOfKinPhone: fullStudent.nextOfKinPhone || "", profileImageUrl: fullStudent.profileImageUrl, profileComplete: fullStudent.profileComplete, programme: fullStudent.programme?.title || "—", year: fullStudent.year, semester: fullStudent.semester, enrollmentDate: fullStudent.enrollmentDate.toISOString(), hostel: fullStudent.hostelAlloc ? { room: fullStudent.hostelAlloc.roomNo, name: fullStudent.hostelAlloc.hostel.name } : null }} />;
  } catch {
    return <ProfileClient profile={demoProfile} />;
  }
}
