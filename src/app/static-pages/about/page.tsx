import { PageHeader } from "@/components/PageHeader";
import { AboutHeroCMS } from "./components/AboutHeroCMS";
import { AboutRootsCMS } from "./components/AboutRootsCMS";
import { AboutPhilosophyCMS } from "./components/AboutPhilosophyCMS";
import { AboutExperienceCMS } from "./components/AboutExperienceCMS";
import { AboutAmenitiesCMS } from "./components/AboutAmenitiesCMS";
import { AboutCtaCMS } from "./components/AboutCtaCMS";

export default function AboutCMSPage() {
  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title="About Page Content"
        description="Manage the content displayed on the About Us page, including brand roots, parallax hero backgrounds, hospitality statements, features, and custom CTA booking details."
      />

      <AboutHeroCMS />
      <AboutRootsCMS />
      <AboutPhilosophyCMS />
      <AboutExperienceCMS />
      <AboutAmenitiesCMS />
      <AboutCtaCMS />
    </section>
  );
}
