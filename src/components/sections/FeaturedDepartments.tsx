import { getPublishedDepartments } from "@/lib/data";
import { FeaturedDepartmentsClient } from "./FeaturedDepartmentsClient";

export async function FeaturedDepartments() {
  const departments = await getPublishedDepartments();
  const mapped = departments.map((d) => ({
    id: d.id,
    name: d.name,
    tagline: d.tagline,
    count: `${d._count.programmes} programmes`,
    img: d.imageUrl || "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=900&q=80",
  }));
  return <FeaturedDepartmentsClient departments={mapped} />;
}
