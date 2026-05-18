"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

const defaultFormData = {
  introTagline: "",
  introHeading: "",
  introHeadingItalic: "",
  introDesc: "",
};

interface StoryIntroCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function StoryIntroCMS({
  sectionId,
  initialData,
  saveUrl = "/api/our-story",
  responseKey = "StoryIntro",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: StoryIntroCMSProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (val: any) => {
    if (controlledOnToggle) {
      controlledOnToggle();
    } else {
      setInternalIsOpen(typeof val === "function" ? val(internalIsOpen) : val);
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...defaultFormData, ...initialData });
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey ? json.data?.[responseKey] : json.data;
          if (json.success && sectionData) {
            setFormData({ ...defaultFormData, ...sectionData });
          }
        })
        .catch(console.error);
    }
  }, [initialData, saveUrl, responseKey]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.introTagline?.trim()) errs.push("Tag label is required");
    if (!formData.introHeading?.trim()) errs.push("Heading is required");
    if (!formData.introHeadingItalic?.trim()) errs.push("Italic Heading highlight is required");
    if (!formData.introDesc?.trim()) errs.push("Introductory description is required");

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Story Intro details...");
    try {
      const payload = {
        ...formData,
      };

      const body = sectionId
        ? { id: sectionId, content: payload }
        : { section: responseKey, content: payload };

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Story Intro saved successfully!", { id: toastId });
        setFormData(payload);
        if (onSave) onSave(payload as unknown as Record<string, unknown>);
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
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Story Intro Section"
          description="Manage the main introduction taglines, split titles, and bold opening summaries."
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
              
              {/* Fields */}
              <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <InputField
                  label="Intro Section Tagline"
                  name="introTagline"
                  value={formData.introTagline}
                  onChange={handleChange}
                  placeholder="e.g. Our Story"
                  required
                  containerClassName="w-full"
                />

                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <InputField
                    label="Intro Heading Regular Part"
                    name="introHeading"
                    value={formData.introHeading}
                    onChange={handleChange}
                    placeholder="e.g. A Community That Creates"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Intro Heading Italic Part"
                    name="introHeadingItalic"
                    value={formData.introHeadingItalic}
                    onChange={handleChange}
                    placeholder="e.g. Happy Moments"
                    required
                    containerClassName="flex-1"
                  />
                </div>

                <TextAreaField
                  label="Introductory Subtext"
                  name="introDesc"
                  value={formData.introDesc}
                  onChange={handleChange}
                  placeholder="Our story began when we started looking for ways to bring people together..."
                  containerClassName="w-full"
                  rows={3}
                  required
                />
              </div>

              {/* Save Action */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <SaveButton
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-44 h-12 text-sm"
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
