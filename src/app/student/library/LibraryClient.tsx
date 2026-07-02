"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Library, Search, BookOpen, Clock, AlertCircle, RotateCcw } from "lucide-react";
import { StudentPageHeader, StatusPill, StatCard, EmptyState } from "@/components/student/ui";

interface Book {
  id: string; title: string; author: string; category: string;
  available: boolean; availableCopies: number; totalCopies: number;
  coverUrl: string | null; description: string | null;
}

interface Loan {
  id: string; borrowedAt: string; dueAt: string; status: string;
  book: { id: string; title: string; author: string; coverUrl: string | null };
}

export function LibraryClient({ books, myLoans }: { books: Book[]; myLoans: Loan[] }) {
  const [query, setQuery] = React.useState("");
  const filtered = books.filter((b) =>
    !query || b.title.toLowerCase().includes(query.toLowerCase()) || b.author.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <StudentPageHeader
        title="Library"
        subtitle="Browse the catalogue and manage your book loans"
        icon={Library}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="Total Books" value={books.length} icon={BookOpen} />
        <StatCard label="Available" value={books.filter((b) => b.available).length} icon={Library} color="text-emerald-600" bg="bg-emerald-100 dark:bg-emerald-950/40" />
        <StatCard label="My Loans" value={myLoans.length} icon={Clock} color="text-amber-600" bg="bg-amber-100 dark:bg-amber-950/40" />
        <StatCard label="Overdue" value={myLoans.filter((l) => l.status === "OVERDUE").length} icon={AlertCircle} color="text-red-600" bg="bg-red-100 dark:bg-red-950/40" />
      </div>

      {/* My loans */}
      {myLoans.length > 0 && (
        <div className="rounded-3xl bg-card border border-border shadow-soft p-5 mb-6">
          <h2 className="font-display font-bold text-lg mb-4">My Active Loans</h2>
          <div className="space-y-2">
            {myLoans.map((l) => {
              const daysLeft = Math.ceil((new Date(l.dueAt).getTime() - Date.now()) / 86400000);
              return (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-border"
                >
                  <div className="h-12 w-12 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                    {l.book.coverUrl && <img src={l.book.coverUrl} alt={l.book.title} className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{l.book.title}</p>
                    <p className="text-xs text-muted-foreground">{l.book.author}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <StatusPill status={l.status} />
                    <p className={`text-xs mt-1 ${daysLeft < 0 ? "text-red-600 font-semibold" : "text-muted-foreground"}`}>
                      {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or author…"
          className="w-full pl-10 h-11 rounded-xl bg-card border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Books grid */}
      {filtered.length === 0 ? (
        <EmptyState title="No books found" message="Try a different search query." icon={Library} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
              className="rounded-2xl bg-card border border-border shadow-soft hover:shadow-premium transition-shadow overflow-hidden group"
            >
              <div className="aspect-[3/4] bg-muted overflow-hidden">
                {b.coverUrl && (
                  <img src={b.coverUrl} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm line-clamp-2 leading-snug">{b.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{b.author}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-muted-foreground">{b.category}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${b.available ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"}`}>
                    {b.available ? `${b.availableCopies} avail` : "Out"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
