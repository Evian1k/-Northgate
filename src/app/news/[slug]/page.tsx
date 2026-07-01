import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getPublishedNews } from "@/lib/data";
import { parseJsonArray } from "@/lib/data";
import { NewsDetailClient } from "./NewsDetailClient";

export const dynamic = "force-dynamic";

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await db.news.findFirst({
    where: { slug, deletedAt: null, status: "PUBLISHED", publishedAt: { lte: new Date() } },
    include: { author: { select: { name: true } } },
  });
  if (!article) notFound();

  const related = (await getPublishedNews(5)).filter((n) => n.id !== article.id).slice(0, 3);

  // Increment views (fire-and-forget)
  db.news.update({ where: { id: article.id }, data: { views: { increment: 1 } } }).catch(() => {});

  return (
    <NewsDetailClient
      article={{
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        imageUrl: article.imageUrl,
        publishedAt: (article.publishedAt || article.createdAt).toISOString(),
        readTime: article.readTime,
        tags: parseJsonArray(article.tags),
        author: article.author?.name || "Northgate Editorial",
        views: article.views + 1,
      }}
      related={related.map((n) => ({
        id: n.id,
        title: n.title,
        slug: n.slug,
        excerpt: n.excerpt,
        imageUrl: n.imageUrl,
        publishedAt: (n.publishedAt || n.createdAt).toISOString(),
        category: n.category,
      }))}
    />
  );
}
