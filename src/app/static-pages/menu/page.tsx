import { PageHeader } from "@/components/PageHeader";
import { MenuHeroCMS } from "./components/MenuHeroCMS";
import { MenuBookCMS } from "./components/MenuBookCMS";
import { MenuCuratedCMS } from "./components/MenuCuratedCMS";
import { MenuCellarCMS } from "./components/MenuCellarCMS";
import { MenuIntroCMS } from "./components/MenuIntroCMS";

export default function MenuCMSPage() {
  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title="Menu Sheets & Cellars"
        description="Manage cover parallax photos, 3D book menus, bento course collections, wines, and centered quotes."
      />

      {/* Modular dynamic sections for Menu CMS Dashboard */}
      <MenuHeroCMS />
      <MenuBookCMS />
      <MenuCuratedCMS />
      <MenuCellarCMS />
      <MenuIntroCMS />
    </section>
  );
}
