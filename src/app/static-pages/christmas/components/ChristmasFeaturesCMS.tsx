"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

const defaultFormData = {
  tagline: "Exclusive Experiences",
  heading: "Special Christmas",
  headingHighlight: "Party Features",
  feature1: "Special Seating arrangements tailored for families and group bookings.",
  feature2: "Elegant options for Private Celebrations and large corporate/friend gatherings.",
  feature3: "Book Before October to secure a £20 Voucher reward.",
  cardBadge: "Early Booking Reward",
  cardTitle: "Secure a",
  cardTitleHighlight: "£20 Voucher",
  cardDescription: "Book your party of 8 or more before the end of October to receive a thank-you voucher redeemable in the New Year.",
  cardTnc: "*Terms & Conditions apply.",
  cardFooterNote: "Tables are filling fast – don't miss your chance to make this Christmas unforgettable!",
  ctaText: "Book your Christmas Party Now!",
  ctaLink: "https://sevenstarsatmarshbaldon.co.uk/book-a-table/",
};

export function ChristmasFeaturesCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);

  const saveUrl = "/api/christmas";
  const responseKey = "ChristmasFeatures";

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
    const toastId = toast.loading("Saving Features Section...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: responseKey, content: formData }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Features section saved successfully!", { id: toastId });
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
        title="Features & Booking Incentive"
        description="Manage the special party features lists, the early booking incentive card values, T&Cs, and action buttons."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="flex flex-col gap-8 pt-6">
          <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest pb-2 border-b border-gray-200/60">
              Left Column - Features Copy
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                label="Tagline Label"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
              />
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

            <InputField
              label="Feature Bullet Item 1"
              name="feature1"
              value={formData.feature1}
              onChange={handleChange}
            />
            <InputField
              label="Feature Bullet Item 2"
              name="feature2"
              value={formData.feature2}
              onChange={handleChange}
            />
            <InputField
              label="Feature Bullet Item 3"
              name="feature3"
              value={formData.feature3}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest pb-2 border-b border-gray-200/60">
              Right Column - Voucher Reward Card
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                label="Card Badge Label"
                name="cardBadge"
                value={formData.cardBadge}
                onChange={handleChange}
              />
              <InputField
                label="Card Title Prefix"
                name="cardTitle"
                value={formData.cardTitle}
                onChange={handleChange}
              />
              <InputField
                label="Card Title Highlight"
                name="cardTitleHighlight"
                value={formData.cardTitleHighlight}
                onChange={handleChange}
              />
            </div>

            <TextAreaField
              label="Reward Description Copy"
              name="cardDescription"
              value={formData.cardDescription}
              onChange={handleChange}
              rows={2}
            />

            <InputField
              label="Card T&C Subtitle"
              name="cardTnc"
              value={formData.cardTnc}
              onChange={handleChange}
            />

            <TextAreaField
              label="Card Bottom Warning Note"
              name="cardFooterNote"
              value={formData.cardFooterNote}
              onChange={handleChange}
              rows={2}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
              <InputField
                label="Card Action Text"
                name="ctaText"
                value={formData.ctaText}
                onChange={handleChange}
              />
              <InputField
                label="Card Action Link"
                name="ctaLink"
                value={formData.ctaLink}
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
