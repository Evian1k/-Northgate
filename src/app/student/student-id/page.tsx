import { getCurrentUser } from "@/lib/session";
import { isDemoUser, demoProfile } from "@/lib/demo-student-data";
import { StudentIdClient } from "./StudentIdClient";

export const dynamic = "force-dynamic";

export default async function StudentIdPage() {
  const user = await getCurrentUser();
  if (!user) return <div>Unauthorized</div>;
  if (isDemoUser(user.id)) return <StudentIdClient student={{ name: demoProfile.name, admissionNo: demoProfile.admissionNo, programme: demoProfile.programme, qualification: "Diploma", year: demoProfile.year, semester: demoProfile.semester, gender: demoProfile.gender, nationality: demoProfile.nationality, phone: demoProfile.phone, email: demoProfile.email, profileImageUrl: demoProfile.profileImageUrl, enrollmentDate: demoProfile.enrollmentDate, status: "ACTIVE" }} />;
  try {
    const { getCurrentStudent } = await import("@/lib/student-session");
    const student = await getCurrentStudent();
    if (!student) return <div>Unauthorized</div>;
    return <StudentIdClient student={{ name: student.user.name, admissionNo: student.admissionNo, programme: student.programme?.title || "—", qualification: student.programme?.qualification || "—", year: student.year, semester: student.semester, gender: student.gender || "—", nationality: student.nationality || "—", phone: student.phone || student.user.phone || "—", email: student.user.email, profileImageUrl: student.profileImageUrl, enrollmentDate: student.enrollmentDate.toISOString(), status: student.status }} />;
  } catch {
    return <StudentIdClient student={{ name: demoProfile.name, admissionNo: demoProfile.admissionNo, programme: demoProfile.programme, qualification: "Diploma", year: demoProfile.year, semester: demoProfile.semester, gender: demoProfile.gender, nationality: demoProfile.nationality, phone: demoProfile.phone, email: demoProfile.email, profileImageUrl: demoProfile.profileImageUrl, enrollmentDate: demoProfile.enrollmentDate, status: "ACTIVE" }} />;
  }
}
