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
  ctaHeading: "",
  ctaDesc: "",
  ctaButtonLabel: "",
  ctaButtonUrl: "",
};

interface AboutCtaCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AboutCtaCMS({
  sectionId,
  initialData,
  saveUrl = "/api/about",
  responseKey = "AboutCta",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: AboutCtaCMSProps) {
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
    if (!formData.ctaHeading?.trim()) errs.push("CTA Heading is required");
    if (!formData.ctaDesc?.trim()) errs.push("Description is required");
    if (!formData.ctaButtonLabel?.trim()) errs.push("Button label is required");
    if (!formData.ctaButtonUrl?.trim()) errs.push("Button URL link is required");

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving CTA details...");
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
        toast.success("About CTA saved successfully!", { id: toastId });
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
          title="About Call-To-Action Section"
          description="Manage special moments background lines, CTA descriptions, and booking redirect buttons."
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
              
              {/* Header Editor Block */}
              <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Heading Configurator
                </span>

                <InputField
                  label="Call-To-Action Heading"
                  name="ctaHeading"
                  value={formData.ctaHeading}
                  onChange={handleChange}
                  placeholder="e.g. Celebrate your special moments with us."
                  required
                  containerClassName="w-full"
                />

                <TextAreaField
                  label="Description / Subheading Text"
                  name="ctaDesc"
                  value={formData.ctaDesc}
                  onChange={handleChange}
                  placeholder="From intimate dinners to grand celebrations in our private barn..."
                  containerClassName="w-full"
                  rows={2}
                  required
                />
              </div>

              {/* Action Button Link Block */}
              <div className="flex flex-col gap-4 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  CTA Action Button Config
                </span>

                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <InputField
                    label="Button Label"
                    name="ctaButtonLabel"
                    value={formData.ctaButtonLabel}
                    onChange={handleChange}
                    placeholder="e.g. Book Your Visit"
                    required
                    containerClassName="flex-1"
                  />
                  
                  <InputField
                    label="Button Redirect Link URL"
                    name="ctaButtonUrl"
                    value={formData.ctaButtonUrl}
                    onChange={handleChange}
                    placeholder="e.g. /contact"
                    required
                    containerClassName="flex-1"
                  />
                </div>
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
