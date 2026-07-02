"use client";

import { motion } from "framer-motion";
import { Wallet, TrendingDown, TrendingUp, CreditCard, Receipt, Download } from "lucide-react";
import { StudentPageHeader, StatusPill, StatCard, EmptyState } from "@/components/student/ui";

interface Fee {
  id: string; type: string; amount: number; dueDate: string; status: string;
  semester: string; paid: number;
  payments: { id: string; amount: number; method: string; reference: string; paidAt: string }[];
}

export function FinanceClient({
  totalBilled, totalPaid, balance, fees,
}: {
  totalBilled: number; totalPaid: number; balance: number; fees: Fee[];
}) {
  return (
    <div>
      <StudentPageHeader
        title="Finance"
        subtitle="Your fees, payments, and outstanding balances"
        icon={Wallet}
        actions={
          <button className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold shadow-soft hover:shadow-premium transition-shadow">
            <Download className="h-4 w-4" /> Statement
          </button>
        }
      />

      {/* Top balance card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl gradient-royal p-6 sm:p-8 shadow-premium mb-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/70 font-semibold mb-1">Outstanding Balance</p>
            <p className="font-display font-bold text-white text-3xl sm:text-4xl">KES {balance.toLocaleString()}</p>
            <p className="text-white/60 text-xs mt-1">Across {fees.length} fee items</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/70 font-semibold mb-1">Total Billed</p>
            <p className="font-display font-bold text-white text-2xl">KES {totalBilled.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/70 font-semibold mb-1">Total Paid</p>
            <p className="font-display font-bold text-white text-2xl">KES {totalPaid.toLocaleString()}</p>
          </div>
        </div>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="Total Billed" value={`KES ${totalBilled.toLocaleString()}`} icon={Receipt} />
        <StatCard label="Total Paid" value={`KES ${totalPaid.toLocaleString()}`} icon={TrendingUp} color="text-emerald-600" bg="bg-emerald-100 dark:bg-emerald-950/40" />
        <StatCard label="Balance" value={`KES ${balance.toLocaleString()}`} icon={TrendingDown} color="text-red-600" bg="bg-red-100 dark:bg-red-950/40" />
        <StatCard label="Fee Items" value={fees.length} icon={CreditCard} color="text-purple-600" bg="bg-purple-100 dark:bg-purple-950/40" />
      </div>

      {/* Fees table */}
      {fees.length === 0 ? (
        <EmptyState title="No fees" message="You have no fee records." icon={Wallet} />
      ) : (
        <div className="rounded-3xl bg-card border border-border shadow-soft overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="font-display font-bold text-lg">Fee Items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Semester</th>
                  <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Amount</th>
                  <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Paid</th>
                  <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Balance</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Due</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f) => {
                  const bal = f.amount - f.paid;
                  return (
                    <tr key={f.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-semibold">{f.type}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{f.semester}</td>
                      <td className="px-4 py-3 text-right font-mono">KES {f.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-mono text-emerald-600">KES {f.paid.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-red-600">KES {bal.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs">{new Date(f.dueDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3"><StatusPill status={f.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
