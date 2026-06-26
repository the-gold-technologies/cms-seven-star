import { PageHeader } from "@/components/PageHeader";
import { ChristmasHeroCMS } from "./components/ChristmasHeroCMS";
import { ChristmasIntroCMS } from "./components/ChristmasIntroCMS";
import { ChristmasFeaturesCMS } from "./components/ChristmasFeaturesCMS";
import { ChristmasMenusCMS } from "./components/ChristmasMenusCMS";
import { ChristmasTransitionCMS } from "./components/ChristmasTransitionCMS";
import { ChristmasDishesCMS } from "./components/ChristmasDishesCMS";
import { ChristmasReservationCMS } from "./components/ChristmasReservationCMS";

export default function ChristmasCMSPage() {
  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title="Christmas Page Content"
        description="Manage the content displayed on the Christmas 2026 landing page, including hero, introduction, special features, menus downloads, transition banner, dishes showcase, and reservation links."
      />

      <ChristmasHeroCMS />
      <ChristmasIntroCMS />
      <ChristmasFeaturesCMS />
      <ChristmasMenusCMS />
      <ChristmasTransitionCMS />
      <ChristmasDishesCMS />
      <ChristmasReservationCMS />
    </section>
  );
}
