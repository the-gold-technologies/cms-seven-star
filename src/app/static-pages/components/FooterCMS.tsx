"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";
import { Sparkles, Plus, Trash2 } from "lucide-react";

const SECTION_KEY = "FooterCMS";

const defaultFormData = {
  companyName: "SEVEN STARS",
  tagline: "Countryside Gastro Club Pub",
  footerDescription: "Born from a passion for exceptional hospitality, Seven Stars merges the warmth of a countryside pub with the sophistication of a premium gastro club.",
  address: "Seven Stars Lane,\nCountryside Village,\nEngland, UK",
  phoneNumber: "+44 1234 567 890",
  emailAddress: "hello@sevenstars.co.uk",
  watermark: "SEVEN STARS",
  facebookUrl: "https://www.facebook.com/sevenstarsatmarshbaldon",
  instagramUrl: "https://www.instagram.com/sevenstarsatmarshbaldon/",
  youtubeUrl: "#",
  ctaLabel: "BOOK A TABLE",
  ctaUrl: "/contact",
  openingHours: [
    { day: "Monday – Thursday", hours: "12pm – 11pm" },
    { day: "Friday – Saturday", hours: "12pm – 1am" },
    { day: "Sunday", hours: "12pm – 10pm" },
  ],
};

export default function FooterCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    fetchWithCache("/api/home")
      .then((json) => {
        if (json.success && json.data?.[SECTION_KEY]) {
          setFormData((prev) => ({ ...prev, ...json.data[SECTION_KEY] }));
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHourChange = (index: number, field: "day" | "hours", value: string) => {
    setFormData((prev) => {
      const nextHours = [...prev.openingHours];
      nextHours[index] = { ...nextHours[index], [field]: value };
      return { ...prev, openingHours: nextHours };
    });
  };

  const addHourRow = () => {
    setFormData((prev) => ({
      ...prev,
      openingHours: [...prev.openingHours, { day: "", hours: "" }],
    }));
  };

  const removeHourRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: prev.openingHours.filter((_, idx) => idx !== index),
    }));
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.companyName.trim()) errs.push("Brand Title is required");
    if (!formData.emailAddress.trim()) errs.push("Email Address is required");
    if (!formData.ctaLabel.trim() || !formData.ctaUrl.trim()) errs.push("CTA Button label and URL are required");

    formData.openingHours.forEach((item, idx) => {
      if (!item.day.trim() || !item.hours.trim()) {
        errs.push(`Opening Hours slot ${idx + 1} cannot have empty fields`);
      }
    });

    if (errs.length > 0) {
      errs.forEach((m) => toast.error(m));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Footer details...");
    try {
      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: SECTION_KEY, content: formData }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Footer details saved successfully!", { id: toastId });
      } else {
        toast.error("Save failed. Please try again.", { id: toastId });
      }
    } catch {
      toast.error("Network error. Please try again.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Global Footer Section"
          description="Manage site-wide brand credentials, addresses, opening hours, booking CTAs, social tags, and large watermarks."
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
        />

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-8 pt-6 animate-in fade-in duration-500">
              
              {/* Brand & Watermark */}
              <div className="flex flex-col gap-5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Footer Brand & Identity
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                  <InputField
                    label="Brand Name (e.g. SEVEN STARS)"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. SEVEN STARS"
                    required
                  />
                  <InputField
                    label="Subheading/Tagline"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    placeholder="e.g. Countryside Gastro Club Pub"
                  />
                  <InputField
                    label="Large Background Watermark"
                    name="watermark"
                    value={formData.watermark}
                    onChange={handleChange}
                    placeholder="e.g. SEVEN STARS"
                    containerClassName="col-span-1 md:col-span-2"
                  />
                  <TextAreaField
                    label="Brand Description"
                    name="footerDescription"
                    value={formData.footerDescription}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Brief description about the brand..."
                    containerClassName="col-span-1 md:col-span-2"
                  />
                </div>
              </div>

              {/* Contact Information & Address */}
              <div className="flex flex-col gap-5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Address & Contact Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                  <InputField
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="e.g. +44 1234 567 890"
                  />
                  <InputField
                    label="Email Address"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    placeholder="e.g. hello@sevenstars.co.uk"
                    required
                  />
                  <TextAreaField
                    label="Full Address (Enter new line for line breaks)"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Address lines..."
                    containerClassName="col-span-1 md:col-span-2"
                  />
                </div>
              </div>

              {/* Booking CTA Button */}
              <div className="flex flex-col gap-5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Footer Booking CTA Button
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                  <InputField
                    label="Button Label"
                    name="ctaLabel"
                    value={formData.ctaLabel}
                    onChange={handleChange}
                    placeholder="e.g. BOOK A TABLE"
                    required
                  />
                  <InputField
                    label="Button Link URL"
                    name="ctaUrl"
                    value={formData.ctaUrl}
                    onChange={handleChange}
                    placeholder="e.g. /contact"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Opening Hours Rows */}
              <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Opening Hours Configuration
                  </h4>
                  <button
                    type="button"
                    onClick={addHourRow}
                    className="text-xs text-blue-500 hover:text-blue-600 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Row
                  </button>
                </div>

                <div className="flex flex-col gap-4 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                  {formData.openingHours.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="grid grid-cols-2 gap-4 flex-grow">
                        <InputField
                          label={`Row ${idx + 1} - Days Label`}
                          value={item.day}
                          onChange={(e) => handleHourChange(idx, "day", e.target.value)}
                          placeholder="e.g. Monday – Thursday"
                          required
                        />
                        <InputField
                          label="Hours Value"
                          value={item.hours}
                          onChange={(e) => handleHourChange(idx, "hours", e.target.value)}
                          placeholder="e.g. 12pm – 11pm"
                          required
                        />
                      </div>
                      {formData.openingHours.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHourRow(idx)}
                          className="text-red-500 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer self-end mb-1"
                          title="Remove Hour Row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media Links */}
              <div className="flex flex-col gap-5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Social Media Account Links
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                  <InputField
                    label="Facebook Page URL"
                    name="facebookUrl"
                    value={formData.facebookUrl}
                    onChange={handleChange}
                    placeholder="https://facebook.com/..."
                  />
                  <InputField
                    label="Instagram Profile URL"
                    name="instagramUrl"
                    value={formData.instagramUrl}
                    onChange={handleChange}
                    placeholder="https://instagram.com/..."
                  />
                  <InputField
                    label="YouTube Channel URL"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleChange}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <SaveButton onClick={handleSave} disabled={isSaving} className="w-44 h-12 text-sm" />
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
