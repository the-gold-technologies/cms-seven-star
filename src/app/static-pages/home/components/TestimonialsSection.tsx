"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { CloudUpload, Trash2, Plus, Sparkles, Quote } from "lucide-react";
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
      image: "",
    },
  ],
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
  const [testimonialImages, setTestimonialImages] = useState<(File | string)[]>([]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (initialData) {
      const data = { ...defaultFormData, ...initialData };
      setFormData(data);
      setTestimonialImages(data.testimonials.map((t) => t.image || ""));
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey ? json.data?.[responseKey] : json.data;
          if (json.success && sectionData && sectionData.testimonials) {
            const data = { ...defaultFormData, ...sectionData };
            setFormData(data);
            setTestimonialImages(data.testimonials.map((t: any) => t.image || ""));
          } else {
            setTestimonialImages(defaultFormData.testimonials.map((t) => t.image || ""));
          }
        })
        .catch(console.error);
    }
  }, [initialData, saveUrl, responseKey]);

  const handleFieldChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const newTestimonials = [...prev.testimonials];
      newTestimonials[index] = { ...newTestimonials[index], [field]: value };
      return { ...prev, testimonials: newTestimonials };
    });
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTestimonialImages((prev) => {
        const next = [...prev];
        next[index] = file;
        return next;
      });
    }
  };

  const removeImage = (index: number) => {
    setTestimonialImages((prev) => {
      const next = [...prev];
      next[index] = "";
      return next;
    });
  };

  const addTestimonial = () => {
    setTestimonialImages((prev) => ["", ...prev]);
    setFormData((prev) => ({
      ...prev,
      testimonials: [
        {
          quote: "",
          author: "",
          role: "",
          image: "",
        },
        ...prev.testimonials,
      ],
    }));
  };

  const removeTestimonial = (indexToRemove: number) => {
    setTestimonialImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setFormData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSave = async () => {
    const errs: string[] = [];

    formData.testimonials.forEach((t, idx) => {
      if (!t.quote?.trim()) errs.push(`Quote is required for Testimonial ${idx + 1}`);
      if (!t.author?.trim()) errs.push(`Author name is required for Testimonial ${idx + 1}`);
      if (!t.role?.trim()) errs.push(`Role is required for Testimonial ${idx + 1}`);
      if (!testimonialImages[idx]) errs.push(`Photo is required for Testimonial ${idx + 1}`);
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Testimonials...");
    try {
      const uploadedUrls = await uploadFiles(testimonialImages);

      const finalTestimonials = formData.testimonials.map((t, idx) => {
        const cell = testimonialImages[idx];
        const url = cell instanceof File ? uploadedUrls[idx] || "" : cell;
        return {
          ...t,
          image: url,
        };
      });

      const payload = {
        testimonials: finalTestimonials,
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
        setTestimonialImages(finalTestimonials.map((t) => t.image));
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
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Guest Testimonials ({formData.testimonials.length} reviews)
                  </h4>
                  <button
                    type="button"
                    onClick={addTestimonial}
                    className="text-xs text-blue-500 hover:text-blue-600 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Testimonial
                  </button>
                </div>

                <div className="flex flex-col gap-6 mt-2">
                  {formData.testimonials.map((testimonial, idx) => {
                    const imgVal = testimonialImages[idx];
                    const preview = imgVal instanceof File ? URL.createObjectURL(imgVal) : imgVal;
                    const filename =
                      typeof imgVal === "string"
                        ? imgVal.split("/").pop() || `Testimonial Photo ${idx + 1}`
                        : imgVal?.name || `Testimonial Photo ${idx + 1}`;
                    return (
                      <div
                        key={idx}
                        className="flex flex-col gap-4 bg-gray-50/40 p-6 border border-gray-100 rounded-3xl shadow-sm relative"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                            Testimonial Card {idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeTestimonial(idx)}
                            className="text-red-500 hover:text-red-600 p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-all cursor-pointer"
                            title="Remove Testimonial"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

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

                        <div className="flex flex-col gap-2 mt-1">
                          <label className="text-xs font-semibold text-gray-600">Guest Headshot Image</label>

                          {preview ? (
                            <div className="flex items-center justify-between p-3.5 px-5 bg-white border border-gray-200 rounded-2xl transition-all hover:bg-gray-50/50 mt-1">
                              <div className="flex items-center gap-3.5 text-gray-700">
                                <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={preview}
                                    alt={testimonial.author}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                                    {filename}
                                  </span>
                                  <span className="text-[9px] text-gray-400 font-semibold mt-0.5">
                                    {testimonial.author || "Guest"} - Profile Photo
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => fileInputRefs.current[idx]?.click()}
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
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
                                Drag and drop profile photo here, or <span className="text-blue-500 hover:underline animate-pulse">browse</span>
                              </p>
                              <p className="text-[10px] text-gray-400 mt-1">PNG, JPG or WEBP (Headshot Photo)</p>
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
                        </div>
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
