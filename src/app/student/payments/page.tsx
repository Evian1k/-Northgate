import { getCurrentUser } from "@/lib/session";
import { isDemoUser, demoFees } from "@/lib/demo-student-data";
import { PaymentsClient } from "./PaymentsClient";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const user = await getCurrentUser();
  if (!user) return <div>Unauthorized</div>;
  const demoPayments = demoFees.fees.flatMap((f) => f.payments.map((p) => ({ ...p, feeType: f.type })));
  if (isDemoUser(user.id)) return <PaymentsClient totalPaid={demoPayments.reduce((s, p) => s + p.amount, 0)} paymentCount={demoPayments.length} payments={demoPayments} />;
  try {
    const { db } = await import("@/lib/db");
    const { getCurrentStudent } = await import("@/lib/student-session");
    const student = await getCurrentStudent();
    if (!student) return <div>Unauthorized</div>;
    const payments = await db.payment.findMany({ where: { studentId: student.id }, orderBy: { paidAt: "desc" }, include: { fee: { select: { type: true } } }, take: 100 });
    const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
    return <PaymentsClient totalPaid={totalPaid} paymentCount={payments.length} payments={payments.map((p) => ({ id: p.id, amount: p.amount, method: p.method, reference: p.reference, paidAt: p.paidAt.toISOString(), feeType: p.fee.type }))} />;
  } catch {
    return <PaymentsClient totalPaid={demoPayments.reduce((s, p) => s + p.amount, 0)} paymentCount={demoPayments.length} payments={demoPayments} />;
  }
}
