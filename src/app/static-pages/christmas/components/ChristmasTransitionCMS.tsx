"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

const defaultFormData = {
  heading: "Make This Christmas",
  headingHighlight: "Unforgettable at Seven Stars",
  description: "Step into the festive spirit at our cosy pub in Marsh Baldon, Oxford. Whether you’re planning an intimate family lunch or a lively Christmas party with friends, Seven Stars is the perfect place to celebrate. With glowing décor, hearty festive dishes, and seasonal drinks, we’ll make sure your Christmas gathering is full of warmth, laughter, and cheer.",
};

export function ChristmasTransitionCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);

  const saveUrl = "/api/christmas";
  const responseKey = "ChristmasTransition";

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
    const toastId = toast.loading("Saving Transition Banner...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: responseKey, content: formData }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Transition Banner saved successfully!", { id: toastId });
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
        title="Transition Banner Section"
        description="Manage the content displayed in the full-width dark Christmas transition section."
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
                label="Heading Highlight (Italic text)"
                name="headingHighlight"
                value={formData.headingHighlight}
                onChange={handleChange}
              />
            </div>

            <TextAreaField
              label="Transition Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <SaveButton onClick={handleSave} disabled={isSaving} className="w-44 h-12 text-sm" />
          </div>
        </div>
      )}
    </div>
  );
}
