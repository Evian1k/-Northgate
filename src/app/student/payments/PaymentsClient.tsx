"use client";

import { motion } from "framer-motion";
import { CreditCard, TrendingUp, Download, Wallet, CheckCircle2 } from "lucide-react";
import { StudentPageHeader, StatCard, EmptyState } from "@/components/student/ui";
import { useToast } from "@/hooks/use-toast";

interface Payment {
  id: string; amount: number; method: string; reference: string;
  paidAt: string; feeType: string;
}

export function PaymentsClient({
  totalPaid, paymentCount, payments,
}: {
  totalPaid: number; paymentCount: number; payments: Payment[];
}) {
  const { toast } = useToast();

  return (
    <div>
      <StudentPageHeader
        title="Payments"
        subtitle="Your payment history and methods"
        icon={CreditCard}
        actions={
          <button
            onClick={() => toast({ title: "Coming soon", description: "Payment gateway integration required (M-Pesa/Stripe)" })}
            className="inline-flex items-center gap-2 rounded-full gradient-gold text-navy px-4 py-2 text-sm font-bold shadow-soft hover:shadow-premium transition-shadow"
          >
            <Wallet className="h-4 w-4" /> Make Payment
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <StatCard label="Total Paid" value={`KES ${totalPaid.toLocaleString()}`} icon={TrendingUp} color="text-emerald-600" bg="bg-emerald-100 dark:bg-emerald-950/40" />
        <StatCard label="Payments" value={paymentCount} icon={CreditCard} />
        <StatCard label="Avg Payment" value={`KES ${paymentCount > 0 ? Math.round(totalPaid / paymentCount).toLocaleString() : 0}`} icon={Wallet} color="text-gold" bg="bg-gold/10" />
      </div>

      {/* Payment methods */}
      <div className="rounded-3xl bg-card border border-border p-6 shadow-soft mb-6">
        <h2 className="font-display font-bold text-lg mb-4">Payment Methods</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: "M-Pesa", desc: "Paybill 522522 · Account: NG-<Admission>", color: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300" },
            { name: "Card", desc: "Visa / Mastercard via secure portal", color: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300" },
            { name: "Bank", desc: "Direct deposit to Northgate account", color: "bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300" },
          ].map((m) => (
            <div key={m.name} className={`rounded-2xl p-4 ${m.color}`}>
              <p className="font-display font-bold text-base">{m.name}</p>
              <p className="text-xs mt-1 opacity-80">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      {payments.length === 0 ? (
        <EmptyState title="No payments yet" message="Your payment history will appear here." icon={CreditCard} />
      ) : (
        <div className="rounded-3xl bg-card border border-border shadow-soft overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="font-display font-bold text-lg">Payment History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Reference</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Fee Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Method</th>
                  <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Amount</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Date</th>
                  <th className="text-center px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs font-semibold">{p.reference}</td>
                    <td className="px-4 py-3">{p.feeType}</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-muted">{p.method}</span></td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-600">KES {p.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs">{new Date(p.paidAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                        <CheckCircle2 className="h-3 w-3" /> Confirmed
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
