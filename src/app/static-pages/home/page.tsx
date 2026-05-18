"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { HeroSection } from "@/static-pages/home/components/HeroSection";
import { AboutUs } from "@/static-pages/home/components/AboutUs";
import { DiningSection } from "@/static-pages/home/components/DiningSection";
import { FeatureTilesSection } from "@/static-pages/home/components/FeatureTilesSection";
import { GallerySection } from "@/static-pages/home/components/GallerySection";
import { EventGallery } from "@/static-pages/home/components/EventGallery";
import { TestimonialsSection } from "@/static-pages/home/components/TestimonialsSection";
import { ReadyToVisitSection } from "@/static-pages/home/components/ReadyToVisitSection";
import FooterCMS from "../components/FooterCMS";

export default function HomeCMSPage() {
  // Centralized Accordion State - starts with Hero expanded
  const [openSection, setOpenSection] = useState<string | null>("hero");

  const toggleSection = (sectionName: string) => {
    setOpenSection((prev) => (prev === sectionName ? null : sectionName));
  };

  return (
    <section className="flex flex-col gap-8 pb-12">
      <PageHeader
        title="Home Page Content"
        description="Manage the layout sections of your homepage. Expanding any section automatically collapses the others for a clean, focused editor."
      />

      {/* 1. Hero Slideshow Section */}
      <HeroSection
        isOpen={openSection === "hero"}
        onToggle={() => toggleSection("hero")}
      />

      {/* 2. About Us Story Section */}
      <AboutUs
        isOpen={openSection === "about"}
        onToggle={() => toggleSection("about")}
      />

      {/* 3. Event Gallery Masonry Grid */}
      <EventGallery
        isOpen={openSection === "events"}
        onToggle={() => toggleSection("events")}
      />

      {/* 4. Dining Experience Details */}
      <DiningSection
        isOpen={openSection === "dining"}
        onToggle={() => toggleSection("dining")}
      />

      {/* 5. Pub Traditions Slider Cards */}
      <FeatureTilesSection
        isOpen={openSection === "traditions"}
        onToggle={() => toggleSection("traditions")}
      />

      {/* 6. Scrolling Marquee Gallery Collection */}
      <GallerySection
        isOpen={openSection === "gallery"}
        onToggle={() => toggleSection("gallery")}
      />

      {/* 7. Guest Testimonials Section */}
      <TestimonialsSection
        isOpen={openSection === "testimonials"}
        onToggle={() => toggleSection("testimonials")}
      />

      {/* 8. Ready To Visit (CTA Plan Visit) Section */}
      <ReadyToVisitSection
        isOpen={openSection === "ready"}
        onToggle={() => toggleSection("ready")}
      />

      <FooterCMS />
    </section>
  );
}
