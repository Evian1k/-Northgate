import { Suspense } from "react";
import { Navigation } from "@/components/sections/Navigation";
import { Hero } from "@/components/sections/Hero";
import { QuickActions } from "@/components/sections/QuickActions";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { FeaturedDepartments } from "@/components/sections/FeaturedDepartments";
import { CourseFinder } from "@/components/sections/CourseFinder";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { NewsEvents } from "@/components/sections/NewsEvents";
import { PhotoGallery } from "@/components/sections/PhotoGallery";
import { Partners } from "@/components/sections/Partners";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";
import { HomepageSkeleton } from "@/components/skeletons";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background overflow-x-hidden">
      <Navigation />
      <main className="flex-1">
        <Suspense fallback={<HomepageSkeleton />}>
          <Hero />
          <QuickActions />
          <WhyChooseUs />
          <FeaturedDepartments />
          <CourseFinder />
          <SuccessStories />
          <NewsEvents />
          <PhotoGallery />
          <Partners />
          <FinalCTA />
        </Suspense>
      </main>
      <Suspense fallback={<div className="h-96 bg-navy" />}>
        <Footer />
      </Suspense>
    </div>
  );
}
