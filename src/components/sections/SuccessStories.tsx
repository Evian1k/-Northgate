import { getPublishedTestimonials } from "@/lib/data";
import { SuccessStoriesClient } from "./SuccessStoriesClient";

export async function SuccessStories() {
  const testimonials = await getPublishedTestimonials();
  const mapped = testimonials.map((t) => ({
    name: t.name,
    role: t.role,
    type: t.type as "student" | "employer" | "graduate",
    quote: t.quote,
    avatar: t.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    org: t.org || "",
  }));
  return <SuccessStoriesClient stories={mapped} />;
}
