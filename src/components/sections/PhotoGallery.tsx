import { getPublishedGallery } from "@/lib/data";
import { PhotoGalleryClient } from "./PhotoGalleryClient";

export async function PhotoGallery() {
  const images = await getPublishedGallery();
  const mapped = images.map((g) => ({
    src: g.imageUrl,
    alt: g.alt,
    title: g.title,
  }));
  return <PhotoGalleryClient photos={mapped} />;
}
