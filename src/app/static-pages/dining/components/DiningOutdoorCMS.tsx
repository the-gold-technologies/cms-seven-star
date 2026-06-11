"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { CloudUpload, Trash2, Sparkles, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

const defaultFormData = {
  outdoorHeading: "",
  outdoorHeadingItalic: "",
  outdoorDesc: "",
  outdoorCtaText: "",
  outdoorCtaLink: "",
  outdoorImage: "",
  outdoorImages: [] as string[],
};

interface DiningOutdoorCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function DiningOutdoorCMS({
  sectionId,
  initialData,
  saveUrl = "/api/dining",
  responseKey = "DiningOutdoor",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: DiningOutdoorCMSProps) {
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
  const [outdoorImages, setOutdoorImages] = useState<(File | string)[]>([""]);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (initialData) {
      const data = { ...defaultFormData, ...initialData };
      setFormData(data);
      if (Array.isArray(data.outdoorImages) && data.outdoorImages.length > 0) {
        setOutdoorImages(data.outdoorImages);
      } else if (data.outdoorImage) {
        setOutdoorImages([data.outdoorImage]);
      } else {
        setOutdoorImages([""]);
      }
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey
            ? json.data?.[responseKey]
            : json.data;
          if (json.success && sectionData) {
            const data = { ...defaultFormData, ...sectionData };
            setFormData(data);
            if (Array.isArray(data.outdoorImages) && data.outdoorImages.length > 0) {
              setOutdoorImages(data.outdoorImages);
            } else if (data.outdoorImage) {
              setOutdoorImages([data.outdoorImage]);
            } else {
              setOutdoorImages([""]);
            }
          } else {
            setOutdoorImages([""]);
          }
        })
        .catch((err) => {
          console.error(err);
          setOutdoorImages([""]);
        });
    }
  }, [initialData, saveUrl, responseKey]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // File change helper functions are handled inline in JSX map

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.outdoorHeading?.trim())
      errs.push("Outdoor Heading regular part is required");
    if (!formData.outdoorHeadingItalic?.trim())
      errs.push("Outdoor Heading italic part is required");
    if (!formData.outdoorDesc?.trim())
      errs.push("Outdoor description copy is required");
    if (!formData.outdoorCtaText?.trim())
      errs.push("CTA booking button label is required");
    
    const validImages = outdoorImages.filter((img) => img !== "");
    if (validImages.length === 0) errs.push("At least one Outdoor seating photo is required");

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Outdoor seating details...");
    try {
      const uploadedUrls = await uploadFiles(validImages);
      const finalImages = validImages.map((img, idx) => {
        return img instanceof File ? uploadedUrls[idx] || "" : img;
      });

      const payload = {
        ...formData,
        outdoorImage: finalImages[0] || "",
        outdoorImages: finalImages,
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
        toast.success("Outdoor seating saved successfully!", { id: toastId });
        setFormData(payload);
        setOutdoorImages(finalImages.length > 0 ? finalImages : [""]);
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

  // File previews are handled inside JSX mapping

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Dining Outdoor Seating"
          description="Manage Outdoor Seating split headers, copy descriptions, cover photos, and book button actions."
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
              {/* Header texts */}
              <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <InputField
                    label="Outdoor Heading Regular Part"
                    name="outdoorHeading"
                    value={formData.outdoorHeading}
                    onChange={handleChange}
                    placeholder="e.g. Outdoor"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Outdoor Heading Italic Part"
                    name="outdoorHeadingItalic"
                    value={formData.outdoorHeadingItalic}
                    onChange={handleChange}
                    placeholder="e.g. Seating"
                    required
                    containerClassName="flex-1"
                  />
                </div>

                <TextAreaField
                  label="Outdoor Seating Description Copy"
                  name="outdoorDesc"
                  value={formData.outdoorDesc}
                  onChange={handleChange}
                  placeholder="Welcome to Seven Stars, where culinary excellence..."
                  rows={3}
                  required
                />
              </div>

              {/* CTA trigger */}
              <div className="flex flex-col gap-4 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block border-b border-gray-100 pb-1.5 mb-2">
                  Call To Action Settings
                </span>
                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <InputField
                    label="Booking Button Label"
                    name="outdoorCtaText"
                    value={formData.outdoorCtaText}
                    onChange={handleChange}
                    placeholder="e.g. Book Now"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Booking Button Link / Route"
                    name="outdoorCtaLink"
                    value={formData.outdoorCtaLink || ""}
                    onChange={handleChange}
                    placeholder="e.g. /contact or #contact"
                    containerClassName="flex-1"
                  />
                </div>
              </div>

              {/* Carousel Images Collection */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Outdoor Seating Slider Images ({outdoorImages.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setOutdoorImages((prev) => [...prev, ""])}
                    className="text-xs text-[#475DB1] hover:text-[#475DB1]/80 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Photo
                  </button>
                </div>

                <div className="flex flex-col gap-4 mt-1 w-full">
                  {outdoorImages.map((img, idx) => {
                    const preview =
                      img instanceof File
                        ? URL.createObjectURL(img)
                        : img;
                    const name =
                      typeof img === "string"
                        ? img.split("/").pop() || `Photo ${idx + 1}`
                        : img?.name || `Photo ${idx + 1}`;
                    return (
                      <div key={idx} className="w-full">
                        {preview ? (
                          <div className="flex items-center justify-between p-3.5 px-5 bg-white border border-gray-200 rounded-2xl transition-all hover:bg-gray-50/50">
                            <div className="flex items-center gap-3.5 text-gray-700 overflow-hidden">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={preview}
                                  alt={`Outdoor Preview ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex flex-col overflow-hidden">
                                <span className="text-xs font-bold text-gray-900 truncate max-w-[120px] sm:max-w-xs md:max-w-md">
                                  {name}
                                </span>
                                <span className="text-[9px] text-gray-400 font-semibold mt-0.5">
                                  Showcase Image
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => fileInputRefs.current[idx]?.click()}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                              >
                                Change
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setOutdoorImages((prev) => {
                                    const updated = prev.filter((_, i) => i !== idx);
                                    return updated.length > 0 ? updated : [""];
                                  });
                                }}
                                className="text-red-500 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
                                title="Delete Photo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInputRefs.current[idx]?.click()}
                            className="w-full border-2 border-dashed border-gray-200 hover:border-blue-500 bg-white hover:bg-blue-50/10 rounded-xl flex flex-col items-center justify-center h-[120px] p-6 text-center cursor-pointer transition-all group"
                          >
                            <CloudUpload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
                            <p className="text-xs text-gray-500 font-semibold group-hover:text-blue-600">
                              Drag and drop image here, or{" "}
                              <span className="text-blue-500 hover:underline">
                                browse
                              </span>
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1">
                              PNG, JPG or WEBP (Carousel Photo {idx + 1})
                            </p>
                          </div>
                        )}
                        <input
                          type="file"
                          ref={(el) => {
                            fileInputRefs.current[idx] = el;
                          }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              setOutdoorImages((prev) => {
                                const updated = [...prev];
                                updated[idx] = file;
                                return updated;
                              });
                            }
                          }}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    );
                  })}
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
