import { db } from "@/lib/db";
import { getCurrentStudent } from "@/lib/student-session";
import { FinanceClient } from "../finance/FinanceClient";

export const dynamic = "force-dynamic";

export default async function FeeStatementsPage() {
  const student = await getCurrentStudent();
  if (!student) return <div>Unauthorized</div>;

  const fees = await db.fee.findMany({
    where: { studentId: student.id },
    orderBy: { dueDate: "asc" },
    include: {
      payments: { orderBy: { paidAt: "desc" } },
      semester: { select: { name: true } },
    },
  });

  const totalBilled = fees.reduce((s, f) => s + f.amount, 0);
  const totalPaid = fees.reduce((s, f) => s + f.payments.reduce((ss, p) => ss + p.amount, 0), 0);

  return (
    <FinanceClient
      totalBilled={totalBilled}
      totalPaid={totalPaid}
      balance={totalBilled - totalPaid}
      fees={fees.map((f) => ({
        id: f.id, type: f.type, amount: f.amount,
        dueDate: f.dueDate.toISOString(), status: f.status,
        semester: f.semester?.name || "—",
        paid: f.payments.reduce((s, p) => s + p.amount, 0),
        payments: f.payments.map((p) => ({
          id: p.id, amount: p.amount, method: p.method, reference: p.reference,
          paidAt: p.paidAt.toISOString(),
        })),
      }))}
    />
  );
}
