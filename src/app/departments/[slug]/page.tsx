import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { parseJsonArray } from "@/lib/data";
import { DepartmentDetailClient } from "./DepartmentDetailClient";

export const dynamic = "force-dynamic";

export default async function DepartmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const department = await db.department.findFirst({
    where: { slug, deletedAt: null, status: "PUBLISHED" },
  });
  if (!department) notFound();

  const programmes = await db.programme.findMany({
    where: { departmentId: department.id, deletedAt: null, status: "PUBLISHED" },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
  });

  return (
    <DepartmentDetailClient
      department={{
        name: department.name,
        tagline: department.tagline,
        description: department.description || "",
        imageUrl: department.imageUrl,
        icon: department.icon,
      }}
      programmes={programmes.map((p) => ({
        id: p.id,
        code: p.code,
        title: p.title,
        slug: p.slug,
        qualification: p.qualification,
        duration: p.duration,
        fee: p.fee,
        currency: p.currency,
        description: p.description,
        requirements: parseJsonArray(p.requirements),
        careerPaths: parseJsonArray(p.careerPaths),
      }))}
    />
  );
}
