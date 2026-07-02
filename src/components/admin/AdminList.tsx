"use client";

import { ResourceTable, StatusPill, type ColumnDef } from "@/components/admin/ResourceTable";

type AnyRow = Record<string, unknown> & { id: string };

function makeColumns(type: string): ColumnDef[] {
  switch (type) {
    case "departments":
      return [
        {
          key: "name",
          label: "Department",
          render: (r) => (
            <div>
              <p className="font-semibold">{r.name as string}</p>
              <p className="text-xs text-muted-foreground">{r.tagline as string}</p>
            </div>
          ),
        },
        { key: "programmes", label: "Programmes", render: (r) => <span className="font-mono text-xs">{String(r.programmes ?? 0)}</span> },
        { key: "status", label: "Status", render: (r) => <StatusPill status={String(r.status)} /> },
        { key: "createdAt", label: "Created", render: (r) => <span className="text-xs text-muted-foreground">{new Date(r.createdAt as string).toLocaleDateString()}</span> },
      ];
    case "programmes":
      return [
        {
          key: "title",
          label: "Programme",
          render: (r) => (
            <div>
              <p className="font-semibold flex items-center gap-1.5">
                {r.featured && <span className="h-1.5 w-1.5 rounded-full bg-gold" title="Featured" />}
                {r.title as string}
              </p>
              <p className="text-xs font-mono text-muted-foreground">{r.code as string}</p>
            </div>
          ),
        },
        { key: "department", label: "Department" },
        { key: "qualification", label: "Level" },
        { key: "duration", label: "Duration" },
        { key: "fee", label: "Fee", render: (r) => <span className="font-mono text-xs">KES {Number(r.fee || 0).toLocaleString()}</span> },
        { key: "status", label: "Status", render: (r) => <StatusPill status={String(r.status)} /> },
      ];
    case "news":
      return [
        {
          key: "title",
          label: "Article",
          render: (r) => (
            <div className="max-w-md">
              <p className="font-semibold truncate">{r.title as string}</p>
              <p className="text-xs text-muted-foreground">by {r.author as string}</p>
            </div>
          ),
        },
        { key: "category", label: "Category" },
        { key: "views", label: "Views", render: (r) => <span className="font-mono text-xs">{String(r.views ?? 0)}</span> },
        { key: "status", label: "Status", render: (r) => <StatusPill status={String(r.status)} /> },
        { key: "publishedAt", label: "Published", render: (r) => <span className="text-xs text-muted-foreground">{r.publishedAt ? new Date(r.publishedAt as string).toLocaleDateString() : "—"}</span> },
      ];
    case "events":
      return [
        {
          key: "title",
          label: "Event",
          render: (r) => (
            <div>
              <p className="font-semibold">{r.title as string}</p>
              <p className="text-xs text-muted-foreground">{(r.location as string) || "No location"}</p>
            </div>
          ),
        },
        { key: "category", label: "Category" },
        { key: "startDate", label: "Date", render: (r) => <span className="text-xs">{new Date(r.startDate as string).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span> },
        { key: "registered", label: "Registered", render: (r) => <span className="font-mono text-xs">{String(r.registered ?? 0)}</span> },
        { key: "status", label: "Status", render: (r) => <StatusPill status={String(r.status)} /> },
      ];
    case "testimonials":
      return [
        {
          key: "name",
          label: "Person",
          render: (r) => (
            <div>
              <p className="font-semibold">{r.name as string}</p>
              <p className="text-xs text-muted-foreground">{r.role as string}</p>
            </div>
          ),
        },
        { key: "type", label: "Type", render: (r) => <span className="capitalize text-xs">{r.type as string}</span> },
        { key: "org", label: "Organization", render: (r) => <span className="text-xs">{(r.org as string) || "—"}</span> },
        { key: "rating", label: "Rating", render: (r) => <span className="font-mono text-xs">{"★".repeat(Number(r.rating || 5))}{"☆".repeat(5 - Number(r.rating || 5))}</span> },
        { key: "status", label: "Status", render: (r) => <StatusPill status={String(r.status)} /> },
      ];
    case "partners":
      return [
        {
          key: "name",
          label: "Partner",
          render: (r) => (
            <div className="max-w-md">
              <p className="font-semibold">{r.name as string}</p>
              <p className="text-xs text-muted-foreground truncate">{r.short as string}</p>
            </div>
          ),
        },
        { key: "category", label: "Category", render: (r) => <span className="text-xs font-mono">{r.category as string}</span> },
        { key: "sortOrder", label: "Order", render: (r) => <span className="font-mono text-xs">{String(r.sortOrder ?? 0)}</span> },
        { key: "status", label: "Status", render: (r) => <StatusPill status={String(r.status)} /> },
      ];
    case "gallery":
      return [
        {
          key: "title",
          label: "Image",
          render: (r) => (
            <div>
              <p className="font-semibold">{r.title as string}</p>
              <p className="text-xs text-muted-foreground">{r.alt as string}</p>
            </div>
          ),
        },
        { key: "category", label: "Category" },
        { key: "sortOrder", label: "Order", render: (r) => <span className="font-mono text-xs">{String(r.sortOrder ?? 0)}</span> },
        { key: "status", label: "Status", render: (r) => <StatusPill status={String(r.status)} /> },
      ];
    case "applications":
      return [
        { key: "reference", label: "Reference", render: (r) => <span className="font-mono text-xs font-semibold">{r.reference as string}</span> },
        {
          key: "name",
          label: "Applicant",
          render: (r) => (
            <div>
              <p className="font-semibold">{r.name as string}</p>
              <p className="text-xs text-muted-foreground">{r.email as string}</p>
            </div>
          ),
        },
        { key: "programme", label: "Programme", render: (r) => <span className="text-xs">{r.programme as string}</span> },
        { key: "status", label: "Status", render: (r) => <StatusPill status={String(r.status)} /> },
        { key: "createdAt", label: "Submitted", render: (r) => <span className="text-xs text-muted-foreground">{new Date(r.createdAt as string).toLocaleDateString()}</span> },
      ];
    case "messages":
      return [
        {
          key: "subject",
          label: "Message",
          render: (r) => (
            <div className="max-w-md">
              <p className="font-semibold truncate">{r.subject as string}</p>
              <p className="text-xs text-muted-foreground truncate">{r.message as string}</p>
            </div>
          ),
        },
        {
          key: "name",
          label: "From",
          render: (r) => (
            <div>
              <p className="text-sm font-medium">{r.name as string}</p>
              <p className="text-xs text-muted-foreground">{r.email as string}</p>
            </div>
          ),
        },
        { key: "status", label: "Status", render: (r) => <StatusPill status={String(r.status)} /> },
        { key: "createdAt", label: "Received", render: (r) => <span className="text-xs text-muted-foreground">{new Date(r.createdAt as string).toLocaleDateString()}</span> },
      ];
    case "subscribers":
      return [
        { key: "email", label: "Email", render: (r) => <span className="font-mono text-sm">{r.email as string}</span> },
        { key: "status", label: "Status", render: (r) => <StatusPill status={String(r.status)} /> },
        { key: "createdAt", label: "Subscribed", render: (r) => <span className="text-xs text-muted-foreground">{new Date(r.createdAt as string).toLocaleDateString()}</span> },
      ];
    case "audit-logs":
      return [
        { key: "action", label: "Action", render: (r) => <span className="font-mono text-xs font-semibold uppercase">{String(r.action).replace(/_/g, " ")}</span> },
        {
          key: "resource",
          label: "Resource",
          render: (r) => (
            <div>
              <p className="text-sm font-medium">{r.resource as string}</p>
              {r.resourceId && <p className="text-xs font-mono text-muted-foreground">{String(r.resourceId).slice(0, 12)}…</p>}
            </div>
          ),
        },
        { key: "user", label: "User" },
        { key: "ip", label: "IP", render: (r) => <span className="font-mono text-xs">{(r.ip as string) || "—"}</span> },
        { key: "createdAt", label: "When", render: (r) => <span className="text-xs text-muted-foreground">{new Date(r.createdAt as string).toLocaleString()}</span> },
      ];
    default:
      return [];
  }
}

interface Props {
  type: string;
  title: string;
  description?: string;
  rows: AnyRow[];
  searchKeys: string[];
  basePath: string;
  apiPath: string;
  filters?: { label: string; param: string; options: { label: string; value: string }[] }[];
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  createLabel?: string;
}

export function AdminList(props: Props) {
  const columns = makeColumns(props.type);
  return <ResourceTable {...props} columns={columns} />;
}
