"use client";

import { PageHeader } from "@/components/PageHeader";
import { HeroSection } from "@/static-pages/home/components/HeroSection";
import { AboutUs } from "@/static-pages/home/components/AboutUs";
import { DiningSection } from "@/static-pages/home/components/DiningSection";
import { FeatureTilesSection } from "@/static-pages/home/components/FeatureTilesSection";
import { GallerySection } from "@/static-pages/home/components/GallerySection";
import { EventGallery } from "@/static-pages/home/components/EventGallery";
import { TestimonialsSection } from "@/static-pages/home/components/TestimonialsSection";
import { ReadyToVisitSection } from "@/static-pages/home/components/ReadyToVisitSection";
import FooterCMS from "@/components/cms/sections/FooterCMS";

export default function HomeCMSPage() {
  return (
    <section className="flex flex-col gap-8 pb-12">
      <PageHeader
        title="Home Page Content"
        description="Manage the layout sections of your homepage. Expand any section to edit its details."
      />

      {/* 1. Hero Slideshow Section */}
      <HeroSection />

      {/* 2. About Us Story Section */}
      <AboutUs />

      {/* 3. Event Gallery Masonry Grid */}
      <EventGallery />

      {/* 4. Dining Experience Details */}
      <DiningSection />

      {/* 5. Pub Traditions Slider Cards */}
      <FeatureTilesSection />

      {/* 6. Scrolling Marquee Gallery Collection */}
      <GallerySection />

      {/* 7. Guest Testimonials Section */}
      <TestimonialsSection />

      {/* 8. Ready To Visit (CTA Plan Visit) Section */}
      <ReadyToVisitSection />

      <FooterCMS />
    </section>
  );
}
