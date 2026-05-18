import { PageHeader } from "@/components/PageHeader";
import { EventsHeroCMS } from "./components/EventsHeroCMS";
import { UpcomingEventsCMS } from "./components/UpcomingEventsCMS";
import { EventsArchiveCMS } from "./components/EventsArchiveCMS";
import { WhatWeHostCMS } from "./components/WhatWeHostCMS";
import { EventsCapabilitiesCMS } from "./components/EventsCapabilitiesCMS";

export default function EventsCMSPage() {
  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title="Events & Celebrations"
        description="Manage events hero, upcoming menu schedules, vault archives, check-lists, and capability columns."
      />

      {/* Modular dynamic sections for Events CMS Dashboard */}
      <EventsHeroCMS />
      <UpcomingEventsCMS />
      <EventsArchiveCMS />
      <WhatWeHostCMS />
      <EventsCapabilitiesCMS />
    </section>
  );
}
