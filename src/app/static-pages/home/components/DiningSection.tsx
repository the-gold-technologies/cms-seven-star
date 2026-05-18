"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { CloudUpload, Trash2, Sparkles, UtensilsCrossed } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

const defaultFormData = {
  upperTag: "Food Tales",
  headingPart1: "The",
  headingItalicHighlight: "Dining",
  headingPart3: "Experience",
  mainQuote: "Our kitchen works with fresh, carefully sourced ingredients to craft heartening dishes that become the season to bond together.",
  paragraph1: "At their heart, our dishes are rooted in British pub tradition but we love to bring in Middle Eastern, European and South Asian influences that keep things interesting.",
  paragraph2: "There's always something to look forward to with scrumptious open sandwiches, wholesome cheese boards and mouthwatering orange and cognac crème brulée.",
  btnLabel: "Explore Dining & Menu",
  btnUrl: "/dining",
  indoorCapacity: "76",
  gardenCapacity: "150",
  showcaseImage: "/images/gallery/food-gourmet.jpg",
  imageAlt: "Gourmet dish at Seven Stars",
  imageOverlayTitle: "Proper Food",
  imageOverlaySubtitle: "Honouring British Pub Tradition",
};

interface DiningSectionProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function DiningSection({
  sectionId,
  initialData,
  saveUrl = "/api/home",
  responseKey = "WhatWeDo", // Map to the old WhatWeDo DB slot to prevent schema breakage
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: DiningSectionProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(!initialData);
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setFormData((prev) => ({ ...prev, showcaseImage: "" }));
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.upperTag?.trim()) errs.push("Tag label is required");
    if (!formData.headingItalicHighlight?.trim()) errs.push("Italic heading is required");
    if (!formData.mainQuote?.trim()) errs.push("Main quote is required");
    if (!formData.showcaseImage && !selectedFile) errs.push("Showcase image is required");

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Dining Experience Section...");
    try {
      let finalImageUrl = formData.showcaseImage;

      if (selectedFile) {
        const uploadedUrls = await uploadFiles([selectedFile]);
        if (uploadedUrls[0]) {
          finalImageUrl = uploadedUrls[0];
        }
      }

      const payload = {
        ...formData,
        showcaseImage: finalImageUrl,
      };

      const body = sectionId
        ? { id: sectionId, content: payload }
        : { section: responseKey ?? "WhatWeDo", content: payload };

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Dining Experience section saved successfully!", { id: toastId });
        setSelectedFile(null);
        setFormData(payload);
        if (onSave) onSave(payload as unknown as Record<string, unknown>);
      } else {
        toast.error(json.error || "Save failed. Please try again.", {
          id: toastId,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : formData.showcaseImage;

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Dining Experience Section"
          description="Manage dining stories, capacities, custom copy, and the highlighted gourmet plate uploader."
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                <InputField
                  label="Upper Tag Label"
                  name="upperTag"
                  value={formData.upperTag}
                  onChange={handleChange}
                  placeholder="e.g. Food Tales"
                  required
                />
                <InputField
                  label="Heading Part 1 (Regular)"
                  name="headingPart1"
                  value={formData.headingPart1}
                  onChange={handleChange}
                  placeholder="e.g. The"
                  required
                />
                <InputField
                  label="Heading Part 2 (Italic Highlight)"
                  name="headingItalicHighlight"
                  value={formData.headingItalicHighlight}
                  onChange={handleChange}
                  placeholder="e.g. Dining"
                  required
                />
                <InputField
                  label="Heading Part 3 (Regular)"
                  name="headingPart3"
                  value={formData.headingPart3}
                  onChange={handleChange}
                  placeholder="e.g. Experience"
                  required
                />
              </div>

              {/* Layout Content block */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                {/* Left Side fields: Quotes & Capacities */}
                <div className="flex flex-col gap-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-blue-500" />
                    Custom Copy & Settings
                  </h4>

                  <TextAreaField
                    label="Main Featured Quote (Italic)"
                    name="mainQuote"
                    value={formData.mainQuote}
                    onChange={handleChange}
                    placeholder="Dining quote..."
                    rows={3}
                    required
                  />

                  <TextAreaField
                    label="Story Paragraph 1"
                    name="paragraph1"
                    value={formData.paragraph1}
                    onChange={handleChange}
                    placeholder="Paragraph 1..."
                    rows={3}
                  />

                  <TextAreaField
                    label="Story Paragraph 2"
                    name="paragraph2"
                    value={formData.paragraph2}
                    onChange={handleChange}
                    placeholder="Paragraph 2..."
                    rows={3}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="CTA Button Label"
                      name="btnLabel"
                      value={formData.btnLabel}
                      onChange={handleChange}
                      placeholder="e.g. Explore Dining"
                    />
                    <InputField
                      label="CTA Button URL"
                      name="btnUrl"
                      value={formData.btnUrl}
                      onChange={handleChange}
                      placeholder="e.g. /dining"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 border border-gray-100 rounded-2xl">
                    <InputField
                      label="Indoor Capacity"
                      name="indoorCapacity"
                      value={formData.indoorCapacity}
                      onChange={handleChange}
                      placeholder="e.g. 76"
                    />
                    <InputField
                      label="Garden Capacity"
                      name="gardenCapacity"
                      value={formData.gardenCapacity}
                      onChange={handleChange}
                      placeholder="e.g. 150"
                    />
                  </div>
                </div>

                {/* Right Side fields: Image Showcase */}
                <div className="flex flex-col gap-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Featured Showcase Image
                  </h4>

                  <div className="flex flex-col gap-3 bg-gray-50/40 p-5 border border-gray-100 rounded-2xl">
                    <label className="text-xs font-semibold text-gray-600">Showcase Image Uploader</label>
                    
                    {previewUrl ? (
                      <div className="flex items-center justify-between p-3.5 px-5 bg-white border border-gray-200 rounded-2xl transition-all hover:bg-gray-50/50 mt-1">
                        <div className="flex items-center gap-3.5 text-gray-700">
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={previewUrl} alt={formData.imageAlt} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                              {selectedFile ? selectedFile.name : formData.showcaseImage.split("/").pop() || "Showcase Image"}
                            </span>
                            <span className="text-[9px] text-gray-400 font-semibold mt-0.5">
                              Dining Showcase Image
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="text-red-500 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
                          title="Remove Image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-gray-200 hover:border-blue-500 bg-white hover:bg-blue-50/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all group mt-1"
                      >
                        <CloudUpload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
                        <p className="text-xs text-gray-500 font-semibold group-hover:text-blue-600">
                          Drag and drop showcase image here, or <span className="text-blue-500 hover:underline animate-pulse">browse</span>
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">PNG, JPG or WEBP (Cinematic Showcase Image)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    <InputField
                      label="SEO Image Alt Tag"
                      name="imageAlt"
                      value={formData.imageAlt}
                      onChange={handleChange}
                      placeholder="Alt tag..."
                      containerClassName="mt-3"
                    />

                    <div className="grid grid-cols-2 gap-4 mt-1">
                      <InputField
                        label="Image Card Title"
                        name="imageOverlayTitle"
                        value={formData.imageOverlayTitle}
                        onChange={handleChange}
                        placeholder="e.g. Proper Food"
                      />
                      <InputField
                        label="Image Card Subtitle"
                        name="imageOverlaySubtitle"
                        value={formData.imageOverlaySubtitle}
                        onChange={handleChange}
                        placeholder="e.g. British Pub Tradition"
                      />
                    </div>
                  </div>
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
