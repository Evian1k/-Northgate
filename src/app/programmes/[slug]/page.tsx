import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getPublishedProgrammes } from "@/lib/data";
import { parseJsonArray } from "@/lib/data";
import { ProgrammeDetailClient } from "./ProgrammeDetailClient";

export const dynamic = "force-dynamic";

export default async function ProgrammeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const programme = await db.programme.findFirst({
    where: { slug, deletedAt: null, status: "PUBLISHED" },
    include: { department: true },
  });
  if (!programme) notFound();

  const related = (await getPublishedProgrammes()).filter(
    (p) => p.id !== programme.id && p.departmentId === programme.departmentId
  ).slice(0, 3);

  return (
    <ProgrammeDetailClient
      programme={{
        id: programme.id,
        code: programme.code,
        title: programme.title,
        description: programme.description,
        qualification: programme.qualification,
        duration: programme.duration,
        durationMonths: programme.durationMonths,
        mode: programme.mode,
        fee: programme.fee,
        currency: programme.currency,
        intake: programme.intake,
        requirements: parseJsonArray(programme.requirements),
        careerPaths: parseJsonArray(programme.careerPaths),
        imageUrl: programme.imageUrl,
        department: {
          name: programme.department.name,
          slug: programme.department.slug,
          tagline: programme.department.tagline,
        },
      }}
      related={related.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        code: p.code,
        qualification: p.qualification,
        duration: p.duration,
      }))}
    />
  );
}
