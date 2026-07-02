import { db } from "@/lib/db";
import { getCurrentStudent } from "@/lib/student-session";
import { HostelClient } from "./HostelClient";

export const dynamic = "force-dynamic";

export default async function HostelPage() {
  const student = await getCurrentStudent();
  if (!student) return <div>Unauthorized</div>;

  const allocation = await db.hostelAllocation.findFirst({
    where: { studentId: student.id },
    include: { hostel: true },
  });

  return (
    <HostelClient
      allocation={allocation ? {
        roomNo: allocation.roomNo,
        allocatedAt: allocation.allocatedAt.toISOString(),
        hostel: {
          name: allocation.hostel.name,
          block: allocation.hostel.block,
          capacity: allocation.hostel.capacity,
          occupied: allocation.hostel.occupied,
        },
      } : null}
    />
  );
}
