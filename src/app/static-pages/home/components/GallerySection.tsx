"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { CloudUpload, Trash2, Plus, ImageIcon, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

interface GalleryImage {
  src: string;
  alt: string;
}

const defaultImages: GalleryImage[] = [
  { src: "/images/gallery/gallery-1.jpg", alt: "Authentic Pub Atmosphere" },
  { src: "/images/gallery/gallery-2.jpg", alt: "Vibrant Main Bar" },
  { src: "/images/gallery/gallery-3.jpg", alt: "Traditional Pub Character" },
  { src: "/images/gallery/gallery-4.jpg", alt: "Restaurant Interior Detail" },
  { src: "/images/amenities/barn.jpg", alt: "Atmospheric Interiors" },
  { src: "/images/gallery/gallery-6.jpg", alt: "Gourmet Dining Setup" },
  { src: "/images/gallery/gallery-8.jpg", alt: "Blue Exterior Charm" },
  { src: "/images/gallery/event-celebration.jpg", alt: "Special Event Celebration" },
  { src: "/images/gallery/gallery-25.jpg", alt: "Vintage Pub Decor" },
];

const defaultFormData = {
  upperTag: "Visual Journey",
  regularHeading: "Our",
  italicHeading: "Gallery",
  description: "A comprehensive look into the Seven Stars. Explore our historic architecture, vibrant interiors, and the premium gastro experience across our entire curated collection.",
  images: defaultImages,
};

interface GallerySectionProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function GallerySection({
  sectionId,
  initialData,
  saveUrl = "/api/home",
  responseKey = "OurReputation", // Map to OurReputation DB slot to prevent schema breakage
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: GallerySectionProps) {
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
  
  // Array matching the uploaded files / existing URLs for the images
  const [galleryImages, setGalleryImages] = useState<(File | string)[]>(
    defaultImages.map((img) => img.src)
  );

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (initialData) {
      const data = { ...defaultFormData, ...initialData };
      setFormData(data);
      if (Array.isArray(data.images)) {
        setGalleryImages(data.images.map((img: any) => img.src || ""));
      }
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey ? json.data?.[responseKey] : json.data;
          if (json.success && sectionData) {
            const data = { ...defaultFormData, ...sectionData };
            setFormData(data);
            if (Array.isArray(data.images)) {
              setGalleryImages(data.images.map((img: any) => img.src || ""));
            }
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

  const handleAltChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.images];
      updated[index] = { ...updated[index], alt: value };
      return { ...prev, images: updated };
    });
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setGalleryImages((prev) => {
        const updated = [...prev];
        updated[index] = file;
        return updated;
      });
    }
  };

  const removeImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addNewImage = () => {
    setGalleryImages((prev) => [...prev, ""]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { src: "", alt: "" }],
    }));
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.upperTag?.trim()) errs.push("Upper Tag is required");
    if (!formData.regularHeading?.trim()) errs.push("Heading is required");
    if (!formData.italicHeading?.trim()) errs.push("Italic Heading is required");
    
    formData.images.forEach((img, idx) => {
      if (!galleryImages[idx]) errs.push(`Image slot ${idx + 1} must have a file uploaded`);
      if (!img.alt?.trim()) errs.push(`Alt description is required for image ${idx + 1}`);
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Marquee Gallery...");
    try {
      const uploadedUrls = await uploadFiles(galleryImages);

      const finalImages = formData.images.map((img, idx) => {
        const cell = galleryImages[idx];
        const url = cell instanceof File ? uploadedUrls[idx] || "" : cell;
        return {
          src: url,
          alt: img.alt,
        };
      });

      const payload = {
        ...formData,
        images: finalImages,
      };

      const body = sectionId
        ? { id: sectionId, content: payload }
        : { section: responseKey ?? "OurReputation", content: payload };

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Gallery saved successfully!", { id: toastId });
        setGalleryImages(finalImages.map((img) => img.src));
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
          title="Marquee Gallery Section"
          description="Manage marquee visual journey headers, descriptions, and curated scrolling image cards with unique alt tags."
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                <InputField
                  label="Tag Label"
                  name="upperTag"
                  value={formData.upperTag}
                  onChange={handleChange}
                  placeholder="e.g. Visual Journey"
                  required
                />
                <InputField
                  label="Heading (Regular)"
                  name="regularHeading"
                  value={formData.regularHeading}
                  onChange={handleChange}
                  placeholder="e.g. Our"
                  required
                />
                <InputField
                  label="Heading (Italic Highlight)"
                  name="italicHeading"
                  value={formData.italicHeading}
                  onChange={handleChange}
                  placeholder="e.g. Gallery"
                  required
                />
                <TextAreaField
                  label="Top Subheading / Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Introduce the gallery journey..."
                  containerClassName="col-span-1 md:col-span-3"
                  rows={2}
                />
              </div>

              {/* Curated Collection */}
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Curated Collection ({formData.images.length} Images)
                  </h4>
                  <button
                    type="button"
                    onClick={addNewImage}
                    className="text-xs text-blue-500 hover:text-blue-600 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Image Card
                  </button>
                </div>

                <div className="flex flex-col gap-5 mt-2">
                  {formData.images.map((img, idx) => {
                    const imgVal = galleryImages[idx];
                    const preview = imgVal instanceof File ? URL.createObjectURL(imgVal) : imgVal;
                    const name =
                      typeof imgVal === "string"
                        ? imgVal.split("/").pop() || `Gallery Image ${idx + 1}`
                        : imgVal?.name || `Gallery Image ${idx + 1}`;
                    return (
                      <div
                        key={idx}
                        className="flex flex-col gap-3 bg-gray-50/40 p-5 border border-gray-100 rounded-3xl shadow-sm relative"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                            Image Card {idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="text-red-500 hover:text-red-600 p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-all cursor-pointer"
                            title="Remove Image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {preview ? (
                          <div className="flex items-center justify-between p-3.5 px-5 bg-white border border-gray-200 rounded-2xl transition-all hover:bg-gray-50/50 mt-1">
                            <div className="flex items-center gap-3.5 text-gray-700">
                              <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={preview}
                                  alt={img.alt}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                                  {name}
                                </span>
                                <span className="text-[9px] text-gray-400 font-semibold mt-0.5">
                                  Marquee Scrolling Image
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => fileInputRefs.current[idx]?.click()}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                            >
                              Change
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInputRefs.current[idx]?.click()}
                            className="w-full border-2 border-dashed border-gray-200 hover:border-blue-500 bg-white hover:bg-blue-50/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all group mt-1"
                          >
                            <CloudUpload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
                            <p className="text-xs text-gray-500 font-semibold group-hover:text-blue-600">
                              Drag and drop image here, or <span className="text-blue-500 hover:underline animate-pulse">browse</span>
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1">PNG, JPG or WEBP (Marquee Showcase Image)</p>
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
                          label="Image SEO Alt Tag"
                          value={img.alt}
                          onChange={(e) => handleAltChange(idx, e.target.value)}
                          placeholder="e.g. Traditional Pub Atmosphere"
                          containerClassName="mt-1"
                          required
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
