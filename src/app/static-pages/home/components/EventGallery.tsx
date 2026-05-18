"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import {
  CloudUpload,
  Trash2,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";

const defaultImages = [
  { src: "", alt: "" },
  { src: "", alt: "" },
  { src: "", alt: "" },
  { src: "", alt: "" },
  { src: "", alt: "" },
];

const defaultFormData = {
  upperTag: "",
  headingPart1: "",
  headingItalicHighlight: "",
  images: defaultImages,
};

interface BlogSectionProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

const slotLabels = [
  "Left Stack - Top Image",
  "Left Stack - Bottom Image",
  "Center Featured - Large Tall Image",
  "Right Stack - Top Image",
  "Right Stack - Bottom Image",
];

export function EventGallery({
  sectionId,
  initialData,
  saveUrl = "/api/home",
  responseKey = "EventGallery",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: BlogSectionProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
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

  // Track selected files/strings for the 5 slots
  const [slotImages, setSlotImages] = useState<(File | string)[]>(
    defaultImages.map((img) => img.src),
  );

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (initialData) {
      const data = { ...defaultFormData, ...initialData };

      // Ensure we have exactly 5 slots in the data
      const mergedImages = [...defaultImages];
      if (Array.isArray(data.images)) {
        data.images.forEach((img: any, idx: number) => {
          if (idx < 5) {
            mergedImages[idx] = { ...mergedImages[idx], ...img };
          }
        });
      }
      data.images = mergedImages;

      setFormData(data);
      setSlotImages(mergedImages.map((img) => img.src));
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey
            ? json.data?.[responseKey]
            : json.data;
          if (json.success && sectionData) {
            const data = { ...defaultFormData, ...sectionData };
            const mergedImages = [...defaultImages];
            if (Array.isArray(data.images)) {
              data.images.forEach((img: any, idx: number) => {
                if (idx < 5) {
                  mergedImages[idx] = { ...mergedImages[idx], ...img };
                }
              });
            }
            data.images = mergedImages;
            setFormData(data);
            setSlotImages(mergedImages.map((img) => img.src));
          }
        })
        .catch(console.error);
    }
  }, [initialData, saveUrl, responseKey]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAltChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index] = { ...updatedImages[index], alt: value };
      return { ...prev, images: updatedImages };
    });
  };

  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSlotImages((prev) => {
        const updated = [...prev];
        updated[index] = file;
        return updated;
      });
    }
  };

  const removeImage = (index: number) => {
    setSlotImages((prev) => {
      const updated = [...prev];
      updated[index] = "";
      return updated;
    });
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.headingPart1?.trim()) errs.push("Heading is required");
    if (!formData.upperTag?.trim()) errs.push("Tag label is required");
    if (slotImages.some((src) => !src))
      errs.push("All 5 gallery images are required");

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Event Gallery Section...");
    try {
      // Filter out files that need uploading
      const filesToUpload = slotImages.map((img) =>
        img instanceof File ? img : null,
      );
      const uploadedUrls = await uploadFiles(filesToUpload);

      // Reassemble final image slots
      const finalImages = formData.images.map((img, idx) => {
        const srcVal = slotImages[idx];
        return {
          src: srcVal instanceof File ? uploadedUrls[idx] || "" : srcVal,
          alt: img.alt,
        };
      });

      const payload = {
        ...formData,
        images: finalImages,
      };

      const body = sectionId
        ? { id: sectionId, content: payload }
        : { section: responseKey ?? "BlogSection", content: payload };

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Event Gallery section saved successfully!", {
          id: toastId,
        });
        setSlotImages(finalImages.map((img) => img.src));
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

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Event Gallery Section"
          description="Manage headings and precisely customize the 5 layout images for the events masonry grid."
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
              {/* Header Titles Editor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                <InputField
                  label="Upper Tag Label"
                  name="upperTag"
                  value={formData.upperTag}
                  onChange={handleChange}
                  placeholder="e.g. Events & Celebrations"
                  required
                  containerClassName=" col-span-2"
                />
                <InputField
                  label="Heading Part 1 (Regular)"
                  name="headingPart1"
                  value={formData.headingPart1}
                  onChange={handleChange}
                  placeholder="e.g. Perfect For"
                  required
                />
                <InputField
                  label="Heading Part 2 (Italic Highlight)"
                  name="headingItalicHighlight"
                  value={formData.headingItalicHighlight}
                  onChange={handleChange}
                  placeholder="e.g. Every Moment"
                  required
                />
              </div>

              {/* Masonry Layout Uploader List */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Masonry Grid Layout Manager (5 Slots Required)
                </h4>

                <div className="flex flex-col gap-5 mt-2">
                  {[0, 1, 2, 3, 4].map((idx) => {
                    const imgVal = slotImages[idx];
                    const preview =
                      imgVal instanceof File
                        ? URL.createObjectURL(imgVal)
                        : imgVal;
                    const name =
                      typeof imgVal === "string"
                        ? imgVal.split("/").pop() || `${slotLabels[idx]} Image`
                        : imgVal?.name || `${slotLabels[idx]} Image`;
                    return (
                      <div
                        key={idx}
                        className="flex flex-col gap-3 bg-gray-50/40 p-5 border border-gray-100 rounded-3xl shadow-sm"
                      >
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          Slot {idx + 1}: {slotLabels[idx]}
                        </span>

                        {preview ? (
                          <div className="flex items-center justify-between p-3.5 px-5 bg-white border border-gray-200 rounded-2xl transition-all hover:bg-gray-50/50 mt-1">
                            <div className="flex items-center gap-3.5 text-gray-700">
                              <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={preview}
                                  alt={formData.images[idx].alt}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                                  {name}
                                </span>
                                <span className="text-[9px] text-gray-400 font-semibold mt-0.5">
                                  {slotLabels[idx]}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  fileInputRefs.current[idx]?.click()
                                }
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                              >
                                Change
                              </button>
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="text-red-500 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
                                title="Remove Image"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInputRefs.current[idx]?.click()}
                            className="w-full border-2 border-dashed border-gray-200 hover:border-blue-500 bg-white hover:bg-blue-50/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all group mt-1"
                          >
                            <CloudUpload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
                            <p className="text-xs text-gray-500 font-semibold group-hover:text-blue-600">
                              Drag and drop image here, or{" "}
                              <span className="text-blue-500 hover:underline animate-pulse">
                                browse
                              </span>
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1">
                              PNG, JPG or WEBP ({slotLabels[idx]})
                            </p>
                          </div>
                        )}
                        <input
                          type="file"
                          ref={(el) => {
                            fileInputRefs.current[idx] = el;
                          }}
                          onChange={(e) => handleFileChange(idx, e)}
                          accept="image/*"
                          className="hidden"
                        />

                        <InputField
                          label="SEO Alt Tag"
                          value={formData.images[idx].alt}
                          onChange={(e) => handleAltChange(idx, e.target.value)}
                          placeholder="Alt tag..."
                          containerClassName="mt-1"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Save Button Action */}
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
