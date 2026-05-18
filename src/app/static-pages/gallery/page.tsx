import { PageHeader } from "@/components/PageHeader";
import { GalleryHeroCMS } from "./components/GalleryHeroCMS";
import { GalleryGridCMS } from "./components/GalleryGridCMS";

export default function GalleryCMSPage() {
  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title="Gallery Page Content"
        description="Manage the main visual story hero page details and configure, uploader categorize, resize, and delete grid photos dynamically."
      />

      {/* Dynamic Modular CMS sections for Gallery Page */}
      <GalleryHeroCMS />
      <GalleryGridCMS />
    </section>
  );
}
