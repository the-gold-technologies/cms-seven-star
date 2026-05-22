"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Sparkles, Code } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  title: "",
  subtitle: "",
  instagramAccountId: "",
  instagramToken: "",
};

interface InstagramRibbonCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function InstagramRibbonCMS({
  sectionId,
  initialData,
  saveUrl = "/api/events",
  responseKey = "EventsArchive",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: InstagramRibbonCMSProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (val: boolean | ((prev: boolean) => boolean)) => {
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
      const data = { ...defaultFormData, ...initialData };
      setFormData(data);
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey
            ? json.data?.[responseKey]
            : json.data;
          if (json.success && sectionData) {
            const data = { ...defaultFormData, ...sectionData };
            setFormData(data);
          }
        })
        .catch(console.error);
    }
  }, [initialData, saveUrl, responseKey]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.title?.trim()) errs.push("Instagram Heading Title is required");
    if (!formData.subtitle?.trim()) errs.push("Instagram Subtitle is required");

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Instagram Ribbon details...");
    try {
      const payload = { ...formData };

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
        toast.success("Instagram Ribbon saved successfully!", { id: toastId });
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
          title="Instagram Feed (API & Manual Fallback)"
          description="Manage your Instagram marquee. Automatically fetches from Meta API, or falls back to manual images if the API fails."
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
        />

        <div
          className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-8 pt-6 animate-in fade-in duration-500 text-left font-sans">

              {/* Header Title block */}
              <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Instagram Header Options
                </h4>

                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <InputField
                    label="Instagram Ribbon Title / Eyebrow"
                    name="title"
                    value={formData.title || ""}
                    onChange={handleChange}
                    placeholder="e.g. Follow Us On Instagram"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Instagram Profile Link"
                    name="subtitle"
                    value={formData.subtitle || ""}
                    onChange={handleChange}
                    placeholder="e.g. https://www.instagram.com/sevenstarsatmarshbaldon/"
                    required
                    containerClassName="flex-1"
                  />
                </div>
              </div>

              {/* Native Meta API Integration Block */}
              <div className="flex flex-col gap-6 bg-amber-50/50 border border-amber-200 p-6 rounded-2xl w-full">
                <h4 className="text-xs font-bold text-amber-600 uppercase tracking-widest flex items-center gap-2 border-b border-amber-100 pb-2">
                  <Code className="w-4 h-4" />
                  Automatic Meta Graph API
                </h4>
                
                <div className="text-sm text-gray-700 mb-2 space-y-3">
                  <p className="font-medium text-amber-900">
                    Connect your live Instagram feed by entering your API Token below. 
                  </p>
                  <div className="bg-white/60 p-4 rounded-xl border border-amber-200/50 space-y-2 text-xs">
                    <p className="font-bold text-gray-900">How to generate your token:</p>
                    <ol className="list-decimal pl-4 space-y-1 text-gray-600">
                      <li>Go to <a href="https://developers.facebook.com/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Meta for Developers</a> and create a <b>Business</b> App.</li>
                      <li>Use the <b>Graph API Explorer</b> tool.</li>
                      <li>Select the <code>instagram_basic</code> and <code>pages_show_list</code> permissions.</li>
                      <li>Click Generate Access Token (ensure your Facebook Page is linked to Instagram).</li>
                      <li>Make sure to use the <b>Access Token Tool</b> to extend it to a permanent 60-day token.</li>
                    </ol>
                    <p className="pt-2 font-medium">
                      Need help? <a href="https://www.youtube.com/watch?v=sPjlyDSNYQs" target="_blank" rel="noreferrer" className="text-red-600 hover:underline inline-flex items-center gap-1">🎥 Watch Step-by-Step Video Tutorial</a>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-6 w-full">
                  <InputField
                    label="Instagram Business Account ID"
                    name="instagramAccountId"
                    value={formData.instagramAccountId || ""}
                    onChange={handleChange}
                    placeholder="e.g. 17841412345678901 (Leave blank to use manual fallback)"
                  />
                  <InputField
                    label="Instagram Long-Lived Access Token"
                    name="instagramToken"
                    value={formData.instagramToken || ""}
                    onChange={handleChange}
                    placeholder="e.g. EAAPz... (Leave blank to use manual fallback)"
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
