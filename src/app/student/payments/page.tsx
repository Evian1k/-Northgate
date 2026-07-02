import { db } from "@/lib/db";
import { getCurrentStudent } from "@/lib/student-session";
import { PaymentsClient } from "./PaymentsClient";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const student = await getCurrentStudent();
  if (!student) return <div>Unauthorized</div>;

  const payments = await db.payment.findMany({
    where: { studentId: student.id },
    orderBy: { paidAt: "desc" },
    include: { fee: { select: { type: true } } },
    take: 100,
  });

  const totalPaid = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <PaymentsClient
      totalPaid={totalPaid}
      paymentCount={payments.length}
      payments={payments.map((p) => ({
        id: p.id, amount: p.amount, method: p.method, reference: p.reference,
        paidAt: p.paidAt.toISOString(), feeType: p.fee.type,
      }))}
    />
  );
}
