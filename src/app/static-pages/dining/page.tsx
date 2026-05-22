import { PageHeader } from "@/components/PageHeader";
import { DiningHeroCMS } from "./components/DiningHeroCMS";
import { DiningIntroCMS } from "./components/DiningIntroCMS";
import { DiningQuoteCMS } from "./components/DiningQuoteCMS";
import { DiningPillarsCMS } from "./components/DiningPillarsCMS";
import { DiningBarnCMS } from "./components/DiningBarnCMS";
import { DiningOutdoorCMS } from "./components/DiningOutdoorCMS";
import { DiningSection } from "./components/DiningSection";

export default function DiningCMSPage() {
  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title="Dining Page Content"
        description="Manage the main culinary hero details, craft introduction layouts, menu specials grid cards, private Barn events, and Outdoor seating configurations."
      />

      {/* Dynamic Modular CMS sections for Dining Page */}
      <DiningHeroCMS />
      <DiningSection />
      <DiningIntroCMS />
      <DiningQuoteCMS />
      <DiningPillarsCMS />
      <DiningBarnCMS />
      <DiningOutdoorCMS />
    </section>
  );
}
