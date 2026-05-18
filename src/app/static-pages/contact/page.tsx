import { PageHeader } from "@/components/PageHeader";
import { ContactHeroCMS } from "./components/ContactHeroCMS";
import { ContactInfoCMS } from "./components/ContactInfoCMS";

export default function ContactCMSPage() {
  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title="Contact Page Content"
        description="Manage the content displayed on the Contact Us landing page, including hero parallax images, direct channels, physical addresses, opening schedules, and maps."
      />

      {/* Dynamic Contact CMS Sections */}
      <ContactHeroCMS />
      <ContactInfoCMS />
    </section>
  );
}
