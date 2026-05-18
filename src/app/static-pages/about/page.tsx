import { PageHeader } from "@/components/PageHeader";
import { AboutUs } from "@/static-pages/home/components/AboutUs";
import VideoSection from "./components/VideoSection";
import VisionSection from "./components/VisionSection";
import OurTeam from "./components/OurTeam";

export default function AboutCMSPage() {
  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title="About Page Content"
        description="Manage the content displayed on the about page."
      />

      {/* Sections */}
      <AboutUs />
      <VideoSection />
      <VisionSection />
      <OurTeam />
    </section>
  );
}
