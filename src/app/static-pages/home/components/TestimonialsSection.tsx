"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { CloudUpload, Trash2, Plus, Sparkles, Quote, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { TextAreaField } from "@/components/TextAreaField";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  testimonials: [
    {
      quote: "",
      author: "",
      role: "",
    },
  ],
  testimonialImages: [] as string[],
};

interface TestimonialsSectionProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function TestimonialsSection({
  sectionId,
  initialData,
  saveUrl = "/api/home",
  responseKey = "Testimonials",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: TestimonialsSectionProps) {
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
  const [testimonialImages, setTestimonialImages] = useState<(File | string)[]>(["", ""]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [collapsedIndices, setCollapsedIndices] = useState<Record<number, boolean>>({});

  const isCollapsed = (index: number) => {
    return collapsedIndices[index] !== false;
  };

  const toggleCollapse = (index: number) => {
    setCollapsedIndices((prev) => {
      const currentlyCollapsed = prev[index] !== false;
      return {
        ...prev,
        [index]: !currentlyCollapsed,
      };
    });
  };

  useEffect(() => {
    if (initialData) {
      const data = { ...defaultFormData, ...initialData };
      setFormData(data);
      
      let loadedImages: string[] = [];
      if (Array.isArray(data.testimonialImages) && data.testimonialImages.length > 0) {
        loadedImages = data.testimonialImages;
      } else if (Array.isArray(data.testimonials)) {
        loadedImages = data.testimonials.map((t: any) => t.image).filter((img: any) => typeof img === "string" && img !== "");
      }

      if (loadedImages.length === 0) {
        setTestimonialImages(["", ""]);
      } else if (loadedImages.length === 1) {
        setTestimonialImages([loadedImages[0], ""]);
      } else {
        setTestimonialImages(loadedImages);
      }
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey ? json.data?.[responseKey] : json.data;
          if (json.success && sectionData) {
            const data = { ...defaultFormData, ...sectionData };
            setFormData(data);

            let loadedImages: string[] = [];
            if (Array.isArray(data.testimonialImages) && data.testimonialImages.length > 0) {
              loadedImages = data.testimonialImages;
            } else if (Array.isArray(data.testimonials)) {
              loadedImages = data.testimonials.map((t: any) => t.image).filter((img: any) => typeof img === "string" && img !== "");
            }

            if (loadedImages.length === 0) {
              setTestimonialImages(["", ""]);
            } else if (loadedImages.length === 1) {
              setTestimonialImages([loadedImages[0], ""]);
            } else {
              setTestimonialImages(loadedImages);
            }
          } else {
            setTestimonialImages(["", ""]);
          }
        })
        .catch((err) => {
          console.error(err);
          setTestimonialImages(["", ""]);
        });
    }
  }, [initialData, saveUrl, responseKey]);

  const handleFieldChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const newTestimonials = [...prev.testimonials];
      newTestimonials[index] = { ...newTestimonials[index], [field]: value };
      return { ...prev, testimonials: newTestimonials };
    });
  };

  const addTestimonial = () => {
    setFormData((prev) => ({
      ...prev,
      testimonials: [
        {
          quote: "",
          author: "",
          role: "",
        },
        ...prev.testimonials,
      ],
    }));
    setCollapsedIndices((prev) => {
      const next: Record<number, boolean> = { 0: false };
      Object.entries(prev).forEach(([key, val]) => {
        next[Number(key) + 1] = val;
      });
      return next;
    });
  };

  const removeTestimonial = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, idx) => idx !== indexToRemove),
    }));
    setCollapsedIndices((prev) => {
      const next: Record<number, boolean> = {};
      Object.entries(prev).forEach(([key, val]) => {
        const k = Number(key);
        if (k < indexToRemove) {
          next[k] = val;
        } else if (k > indexToRemove) {
          next[k - 1] = val;
        }
      });
      return next;
    });
  };

  const handleSave = async () => {
    const errs: string[] = [];

    formData.testimonials.forEach((t, idx) => {
      if (!t.quote?.trim()) errs.push(`Quote is required for Testimonial ${idx + 1}`);
      if (!t.author?.trim()) errs.push(`Author name is required for Testimonial ${idx + 1}`);
      if (!t.role?.trim()) errs.push(`Role is required for Testimonial ${idx + 1}`);
    });

    const validImages = testimonialImages.filter((img) => img !== "");
    if (validImages.length < 2) {
      errs.push("At least two testimonial photos are required for the slider");
    }

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Testimonials...");
    try {
      const uploadedUrls = await uploadFiles(validImages);
      const finalImages = validImages.map((img, idx) => {
        return img instanceof File ? uploadedUrls[idx] || "" : img;
      });

      const payload = {
        testimonials: formData.testimonials.map((t) => ({
          quote: t.quote,
          author: t.author,
          role: t.role,
        })),
        testimonialImages: finalImages,
      };

      const body = sectionId
        ? { id: sectionId, content: payload }
        : { section: responseKey ?? "Testimonials", content: payload };

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Testimonials saved successfully!", { id: toastId });
        setFormData(payload);
        setTestimonialImages(finalImages.length >= 2 ? finalImages : [...finalImages, ...Array(2 - finalImages.length).fill("")]);
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
          title="Testimonials Section"
          description="Manage client quotes, local critics, food reviews, and guest testimonial headshots."
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
              
              {/* Testimonials List */}
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Quote className="w-3.5 h-3.5 text-blue-500 rotate-180" />
                    Guest Testimonial Reviews ({formData.testimonials.length} reviews)
                  </h4>
                  <button
                    type="button"
                    onClick={addTestimonial}
                    className="text-xs text-[#475DB1] hover:text-[#475DB1]/80 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Review
                  </button>
                </div>

                <div className="flex flex-col gap-6 mt-2">
                  {formData.testimonials.map((testimonial, idx) => {
                    const collapsed = isCollapsed(idx);
                    return (
                      <div
                        key={idx}
                        className="flex flex-col gap-4 bg-gray-50/40 p-6 border border-gray-100 rounded-3xl shadow-sm relative transition-all"
                      >
                        <div
                          className="flex justify-between items-center cursor-pointer select-none"
                          onClick={() => toggleCollapse(idx)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                              Review {idx + 1}
                            </span>
                            {testimonial.author && (
                              <span className="text-xs font-semibold text-gray-700 bg-white px-2 py-0.5 rounded-full border border-gray-100 shadow-sm truncate max-w-[150px] sm:max-w-[250px]">
                                {testimonial.author}
                              </span>
                            )}
                            {testimonial.role && (
                              <span className="text-[10px] font-medium text-gray-400 hidden sm:inline">
                                {testimonial.role}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => toggleCollapse(idx)}
                              className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                              title={collapsed ? "Expand Review" : "Collapse Review"}
                            >
                              {collapsed ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronUp className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => removeTestimonial(idx)}
                              className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                              title="Remove Review"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {!collapsed && (
                          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <InputField
                                label="Author Name"
                                value={testimonial.author}
                                onChange={(e) => handleFieldChange(idx, "author", e.target.value)}
                                placeholder="e.g. James Harrison"
                                required
                              />
                              <InputField
                                label="Guest Role / Subtitle"
                                value={testimonial.role}
                                onChange={(e) => handleFieldChange(idx, "role", e.target.value)}
                                placeholder="e.g. Local Food Critic"
                                required
                              />
                            </div>

                            <TextAreaField
                              label="Testimonial Quote"
                              value={testimonial.quote}
                              onChange={(e) => handleFieldChange(idx, "quote", e.target.value)}
                              placeholder="Quote description..."
                              rows={3}
                              required
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Slider Images Collection */}
              <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Slider Images ({testimonialImages.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setTestimonialImages((prev) => [...prev, ""])}
                    className="text-xs text-[#475DB1] hover:text-[#475DB1]/80 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Photo
                  </button>
                </div>

                <div className="flex flex-col gap-4 mt-1 w-full">
                  {testimonialImages.map((img, idx) => {
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
                                  alt={`Slider Preview ${idx + 1}`}
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
                                  setTestimonialImages((prev) => {
                                    const updated = prev.filter((_, i) => i !== idx);
                                    if (updated.length === 0) return ["", ""];
                                    if (updated.length === 1) return [updated[0], ""];
                                    return updated;
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
                              setTestimonialImages((prev) => {
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
