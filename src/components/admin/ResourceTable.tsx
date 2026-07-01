"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Download, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export type CellRenderer = (row: any) => React.ReactNode;

export interface ColumnDef {
  key: string;
  label: string;
  render?: CellRenderer;
  className?: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

interface ResourceTableProps {
  title: string;
  description?: string;
  rows: any[];
  columns: ColumnDef[];
  searchKeys: string[];
  basePath: string;
  apiPath: string;
  filters?: { label: string; param: string; options: FilterOption[] }[];
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  createLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  exportable?: boolean;
}

export function ResourceTable({
  title, description, rows, columns, searchKeys, basePath, apiPath,
  filters = [], canCreate = true, canEdit = true, canDelete = true,
  createLabel = "Create", emptyTitle, emptyDescription, exportable = true,
}: ResourceTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [query, setQuery] = React.useState("");
  const [filterValues, setFilterValues] = React.useState<Record<string, string>>({});
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [actionMenu, setActionMenu] = React.useState<string | null>(null);
  const [bulkLoading, setBulkLoading] = React.useState(false);

  const filtered = React.useMemo(() => {
    let result = rows;
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((r) =>
        searchKeys.some((k) => String(r?.[k] || "").toLowerCase().includes(q))
      );
    }
    for (const [k, v] of Object.entries(filterValues)) {
      if (v) result = result.filter((r) => String(r?.[k] || "") === v);
    }
    return result;
  }, [rows, query, filterValues, searchKeys]);

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((r) => r.id)));
  };

  const deleteRow = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item? This action can be undone from the archive.")) return;
    const res = await fetch(`${apiPath}/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Deleted", description: "Item moved to archive." });
      router.refresh();
    } else {
      toast({ title: "Failed", description: "Could not delete item.", variant: "destructive" });
    }
  };

  const bulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} items?`)) return;
    setBulkLoading(true);
    await Promise.all(
      Array.from(selected).map((id) => fetch(`${apiPath}/${id}`, { method: "DELETE" }))
    );
    setBulkLoading(false);
    setSelected(new Set());
    toast({ title: "Deleted", description: `${selected.size} items archived.` });
    router.refresh();
  };

  const exportCsv = () => {
    if (filtered.length === 0) return;
    const headers = columns.map((c) => c.label);
    const lines = [headers.join(",")];
    for (const r of filtered) {
      const cells = columns.map((c) => {
        const val = r?.[c.key] != null ? String(r[c.key]) : "";
        return `"${val.replace(/"/g, '""')}"`;
      });
      lines.push(cells.join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s/g, "-")}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        {canCreate && (
          <Button
            onClick={() => toast({ title: "Create form", description: "Use the API endpoints at /api/* to create records, or implement dedicated create pages." })}
            className="rounded-full gradient-royal text-white shadow-soft hover:shadow-premium h-10 px-5"
          >
            <Plus className="h-4 w-4 mr-1.5" /> {createLabel}
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="pl-10 h-11 rounded-xl"
          />
        </div>
        {filters.map((f) => (
          <select
            key={f.param}
            value={filterValues[f.param] || ""}
            onChange={(e) => setFilterValues({ ...filterValues, [f.param]: e.target.value })}
            className="h-11 rounded-xl bg-card border border-border px-3 text-sm font-medium min-w-[140px]"
          >
            <option value="">{f.label}: All</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        ))}
        {exportable && (
          <Button variant="outline" onClick={exportCsv} className="rounded-xl h-11 px-4">
            <Download className="h-4 w-4 mr-1.5" /> Export
          </Button>
        )}
      </div>

      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-between rounded-2xl gradient-royal text-white p-3 px-5 shadow-soft"
          >
            <span className="text-sm font-medium">{selected.size} selected</span>
            <div className="flex gap-2">
              <button
                onClick={bulkDelete}
                disabled={bulkLoading}
                className="inline-flex items-center gap-1.5 text-sm bg-white/15 hover:bg-white/25 rounded-full px-3 py-1.5 transition-colors"
              >
                {bulkLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                Delete
              </button>
              <button onClick={() => setSelected(new Set())} className="inline-flex items-center gap-1.5 text-sm bg-white/15 hover:bg-white/25 rounded-full px-3 py-1.5 transition-colors">
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-card border border-border p-12 text-center">
          <div className="grid place-items-center h-16 w-16 rounded-2xl bg-muted mx-auto mb-4">
            <Search className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="font-display font-bold text-lg">{emptyTitle || "No records found"}</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            {emptyDescription || (query ? "Try adjusting your search or filters." : "Create your first record to get started.")}
          </p>
          {canCreate && (
            <Button onClick={() => toast({ title: "Create form", description: "Use the API endpoints at /api/* to create records." })} className="mt-5 rounded-full gradient-royal text-white">
              <Plus className="h-4 w-4 mr-1.5" /> {createLabel}
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-3xl bg-card border border-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.size === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-border"
                      aria-label="Select all"
                    />
                  </th>
                  {columns.map((c) => (
                    <th key={c.key} className={`text-left px-4 py-3 font-semibold text-xs uppercase tracking-widest text-muted-foreground ${c.className || ""}`}>
                      {c.label}
                    </th>
                  ))}
                  <th className="w-12 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.5) }}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(row.id)}
                        onChange={() => toggleSelect(row.id)}
                        className="rounded border-border"
                        aria-label="Select row"
                      />
                    </td>
                    {columns.map((c) => (
                      <td key={c.key} className={`px-4 py-3 ${c.className || ""}`}>
                        {c.render ? c.render(row) : String(row?.[c.key] ?? "—")}
                      </td>
                    ))}
                    <td className="px-4 py-3 relative">
                      <button
                        onClick={() => setActionMenu(actionMenu === row.id ? null : row.id)}
                        className="grid place-items-center h-8 w-8 rounded-full hover:bg-muted"
                        aria-label="Actions"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      <AnimatePresence>
                        {actionMenu === row.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActionMenu(null)} />
                            <motion.div
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="absolute right-4 top-12 z-20 w-44 rounded-2xl glass shadow-premium p-1.5"
                            >
                              <Link
                                href={`${basePath}/${row.id}`}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-muted cursor-pointer"
                                onClick={() => setActionMenu(null)}
                              >
                                <Eye className="h-3.5 w-3.5" /> View
                              </Link>
                              {canEdit && (
                                <button
                                  onClick={() => { toast({ title: "Edit form", description: "Use PATCH /api/* to update records." }); setActionMenu(null); }}
                                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-muted"
                                >
                                  <Edit className="h-3.5 w-3.5" /> Edit
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  onClick={() => { deleteRow(row.id); setActionMenu(null); }}
                                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-muted text-red-600"
                                >
                                  <Trash2 className="h-3.5 w-3.5" /> Delete
                                </button>
                              )}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>Showing {filtered.length} of {rows.length} records</span>
            <div className="flex gap-1">
              <button className="grid place-items-center h-8 w-8 rounded-full hover:bg-muted" disabled>
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button className="grid place-items-center h-8 w-8 rounded-full hover:bg-muted" disabled>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PUBLISHED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    ARCHIVED: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    SCHEDULED: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
    ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    NEW: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    REVIEWING: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
    ACCEPTED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    REJECTED: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
    ENROLLED: "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300",
    READ: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    REPLIED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    SUSPENDED: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
    UNSUBSCRIBED: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    BOUNCED: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  };
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}
