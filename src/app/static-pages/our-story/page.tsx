import { PageHeader } from "@/components/PageHeader";
import { StoryHeroCMS } from "./components/StoryHeroCMS";
import { StoryIntroCMS } from "./components/StoryIntroCMS";
import { StoryTimelineCMS } from "./components/StoryTimelineCMS";
import { StoryHubCMS } from "./components/StoryHubCMS";

export default function OurStoryCMSPage() {
  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title="Our Story & Community Page Content"
        description="Manage historical milestones, heritage hero parallax layers, village community hub paragraphs, and key experiences."
      />

      {/* Dynamic Modular CMS sections for Our Story page */}
      <StoryHeroCMS />
      <StoryIntroCMS />
      <StoryTimelineCMS />
      <StoryHubCMS />
    </section>
  );
}
