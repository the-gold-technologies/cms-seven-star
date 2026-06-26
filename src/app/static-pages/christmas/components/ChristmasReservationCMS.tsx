"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

const defaultFormData = {
  heading: "Reserve Your Place at the",
  headingHighlight: "Christmas Table",
  description: "Tables fill up very fast during the Christmas season. Reserve your lunch or party early to avoid missing out.",
  phoneNumber: "01865 343337",
  emailAddress: "info@sevenstarsatmb.co.uk",
  bookingLink: "https://www.opentable.co.uk/r/the-seven-stars-at-marsh-baldon-reservations-oxford?restref=459243&lang=en-GB&ot_source=Restaurant%20website",
  bookingText: "Book Table Online",
};

export function ChristmasReservationCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);

  const saveUrl = "/api/christmas";
  const responseKey = "ChristmasReservation";

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.[responseKey];
        if (json.success && sectionData) {
          setFormData({ ...defaultFormData, ...sectionData });
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Reservation Section...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: responseKey, content: formData }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Reservation details saved successfully!", { id: toastId });
      } else {
        toast.error(json.error || "Save failed.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
      <SectionHeader
        title="Reservation Footer Section"
        description="Manage headings, description details, phone numbers, email addresses, and OpenTable reservation links."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="flex flex-col gap-8 pt-6">
          <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Heading Regular Text"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
              />
              <InputField
                label="Heading Highlight (Italic highlight)"
                name="headingHighlight"
                value={formData.headingHighlight}
                onChange={handleChange}
              />
            </div>

            <TextAreaField
              label="Reservation Notice Text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100/60">
              <InputField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              <InputField
                label="Email Address"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Booking Button Text"
                name="bookingText"
                value={formData.bookingText}
                onChange={handleChange}
              />
              <InputField
                label="Booking OpenTable Link"
                name="bookingLink"
                value={formData.bookingLink}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <SaveButton onClick={handleSave} disabled={isSaving} className="w-44 h-12 text-sm" />
          </div>
        </div>
      )}
    </div>
  );
}
