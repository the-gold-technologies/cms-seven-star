"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { CloudUpload, Trash2, Plus, Sparkles, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  tagline: "Occasions",
  heading: "What We Host",
  subtext: "Perfect For..",
  image: "/images/gallery/event-celebration.jpg",
  items: [
    "Birthday parties & milestone celebrations",
    "Family get-togethers & reunion dinners",
    "Corporate lunches & team away days",
    "Wedding receptions & pre-wedding celebrations",
    "Summer BBQ parties",
    "Christmas parties & NYE celebrations",
    "Community events & fundraisers",
  ] as string[],
};

interface WhatWeHostCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function WhatWeHostCMS({
  sectionId,
  initialData,
  saveUrl = "/api/events",
  responseKey = "WhatWeHost",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: WhatWeHostCMSProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(!initialData);
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (val: any) => {
    if (controlledOnToggle) {
      controlledOnToggle();
    } else {
      setInternalIsOpen(typeof val === "function" ? val(internalIsOpen) : val);
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [selectedImage, setSelectedImage] = useState<File | string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      const data = { ...defaultFormData, ...initialData };
      setFormData(data);
      if (data.image) setSelectedImage(data.image);
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey
            ? json.data?.[responseKey]
            : json.data;
          if (json.success && sectionData) {
            const data = { ...defaultFormData, ...sectionData };
            setFormData(data);
            if (data.image) setSelectedImage(data.image);
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
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setSelectedImage("");
  };

  const handleListItemChange = (idx: number, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.items];
      updated[idx] = val;
      return { ...prev, items: updated };
    });
  };

  const addListItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, ""],
    }));
  };

  const deleteListItem = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.tagline?.trim()) errs.push("Section tag label is required");
    if (!formData.heading?.trim()) errs.push("Heading title is required");
    if (!formData.subtext?.trim()) errs.push("Subtext is required");
    if (!selectedImage) errs.push("Side cover photo is required");

    formData.items.forEach((item, idx) => {
      if (!item.trim()) errs.push(`Hosting checklist item ${idx + 1} cannot be empty`);
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Hosted Occasions checklist...");
    try {
      const uploadedUrls = await uploadFiles([selectedImage]);
      const imgUrl =
        selectedImage instanceof File ? uploadedUrls[0] || "" : selectedImage;

      const payload = {
        ...formData,
        image: imgUrl,
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
        toast.success("Occasions checklist saved successfully!", { id: toastId });
        setFormData(payload);
        setSelectedImage(imgUrl);
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

  const preview =
    selectedImage instanceof File
      ? URL.createObjectURL(selectedImage)
      : selectedImage;
  const name =
    typeof selectedImage === "string"
      ? selectedImage.split("/").pop() || "Occasions Side Cover"
      : selectedImage?.name;

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="What We Host Section"
          description="Manage checklist items, side showcase covers, subtitles, and headings."
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
        />

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-8 pt-6 animate-in fade-in duration-500 text-left">
              
              {/* Header texts */}
              <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <InputField
                  label="Eyebrow Subtitle"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="e.g. Occasions"
                  required
                />

                <InputField
                  label="Heading Title"
                  name="heading"
                  value={formData.heading}
                  onChange={handleChange}
                  placeholder="e.g. What We Host"
                  required
                />

                <InputField
                  label="Perfect For description"
                  name="subtext"
                  value={formData.subtext}
                  onChange={handleChange}
                  placeholder="e.g. Perfect For.."
                  required
                />
              </div>

              {/* Cover Photo */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Checklist Side Cover Photo
                </span>

                {preview ? (
                  <div className="flex items-center justify-between p-3.5 px-5 bg-white border border-gray-200 rounded-2xl transition-all hover:bg-gray-50/50 mt-1">
                    <div className="flex items-center gap-3.5 text-gray-700">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preview}
                          alt="Checklist side BG"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                          {name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="text-red-500 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-200 hover:border-blue-500 bg-white hover:bg-blue-50/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all group mt-1"
                  >
                    <CloudUpload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
                    <p className="text-xs text-gray-500 font-semibold group-hover:text-blue-600">
                      Drag and drop image here, or browse
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                  Hosted Occasions Checklist ({formData.items.length})
                </span>

                <div className="flex flex-col gap-3">
                  {formData.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-white p-3 border border-gray-200 rounded-2xl relative"
                    >
                      <span className="text-xs font-bold text-gray-400 bg-gray-100/50 w-7 h-7 flex items-center justify-center rounded-xl shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleListItemChange(idx, e.target.value)}
                        placeholder="e.g. Milestone Birthday celebrations"
                        className="w-full bg-transparent border-0 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
                      />
                      <button
                        type="button"
                        onClick={() => deleteListItem(idx)}
                        className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addListItem}
                    className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-blue-500 p-4 rounded-2xl text-xs font-bold text-gray-500 hover:text-blue-600 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Celebration Checklist Item
                  </button>
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
