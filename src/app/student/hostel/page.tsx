import { getCurrentUser } from "@/lib/session";
import { isDemoUser, demoHostel } from "@/lib/demo-student-data";
import { HostelClient } from "./HostelClient";

export const dynamic = "force-dynamic";

export default async function HostelPage() {
  const user = await getCurrentUser();
  if (!user) return <div>Unauthorized</div>;
  if (isDemoUser(user.id)) return <HostelClient allocation={demoHostel} />;
  try {
    const { db } = await import("@/lib/db");
    const { getCurrentStudent } = await import("@/lib/student-session");
    const student = await getCurrentStudent();
    if (!student) return <div>Unauthorized</div>;
    const allocation = await db.hostelAllocation.findFirst({ where: { studentId: student.id }, include: { hostel: true } });
    return <HostelClient allocation={allocation ? { roomNo: allocation.roomNo, allocatedAt: allocation.allocatedAt.toISOString(), hostel: { name: allocation.hostel.name, block: allocation.hostel.block, capacity: allocation.hostel.capacity, occupied: allocation.hostel.occupied } } : null} />;
  } catch {
    return <HostelClient allocation={demoHostel} />;
  }
}
