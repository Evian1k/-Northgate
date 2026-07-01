import { getPublishedNews, getPublishedEvents } from "@/lib/data";
import { NewsEventsClient } from "./NewsEventsClient";

export async function NewsEvents() {
  const [news, events] = await Promise.all([
    getPublishedNews(5),
    getPublishedEvents(3),
  ]);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const items = [
    ...(news[0] ? [{
      id: news[0].id,
      category: news[0].category,
      title: news[0].title,
      excerpt: news[0].excerpt,
      date: formatDate(news[0].publishedAt || news[0].createdAt),
      readTime: `${news[0].readTime} min read`,
      img: news[0].imageUrl || "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1400&q=80",
      size: "lg" as const,
    }] : []),
    ...events.slice(0, 2).map(e => ({
      id: e.id,
      category: e.category,
      title: e.title,
      excerpt: e.description,
      date: formatDate(e.startDate),
      readTime: e.endDate ? `${Math.ceil((e.endDate.getTime() - e.startDate.getTime()) / 86400000)} days` : "All day",
      img: e.imageUrl || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80",
      size: "md" as const,
    })),
    ...news.slice(1, 4).map(n => ({
      id: n.id,
      category: n.category,
      title: n.title,
      excerpt: n.excerpt,
      date: formatDate(n.publishedAt || n.createdAt),
      readTime: `${n.readTime} min read`,
      img: n.imageUrl || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80",
      size: "md" as const,
    })),
  ];

  return <NewsEventsClient items={items} />;
}
