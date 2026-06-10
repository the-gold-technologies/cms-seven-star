"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { CloudUpload, Trash2, Plus, Sparkles, Utensils } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

const defaultFormData = {
  upperTag: "",
  regularHeading: "",
  italicHeading: "",
  description: "",
  watermark: "",
  badgeLabel: "",
  badgeText: "",
  btnUrl: "",
  btnLabel: "",
  btnSublabel: "",
  dishes: [] as {
    name: string;
    price: string;
    description: string;
    image: string;
  }[],
};

interface MenuFeaturedSectionProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
}

export function MenuFeaturedSection({
  sectionId,
  initialData,
  saveUrl = "/api/home",
  responseKey = "MenuFeatured",
  onSave,
}: MenuFeaturedSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [dishImages, setDishImages] = useState<(File | string)[]>([]);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (initialData) {
      const data = { ...defaultFormData, ...initialData };
      const fetchedDishes = (data.dishes ||
        []) as typeof defaultFormData.dishes;
      setFormData({ ...data, dishes: fetchedDishes });
      setDishImages(fetchedDishes.map((d) => d.image));
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey
            ? json.data?.[responseKey]
            : json.data;
          if (json.success && sectionData) {
            const data = { ...defaultFormData, ...sectionData };
            const fetchedDishes = (data.dishes ||
              []) as typeof defaultFormData.dishes;
            setFormData({ ...data, dishes: fetchedDishes });
            setDishImages(fetchedDishes.map((d) => d.image));
          } else {
            setFormData((prev) => ({ ...prev, dishes: [] }));
            setDishImages([]);
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

  const handleDishFieldChange = (
    idx: number,
    field: "name" | "price" | "description",
    value: string,
  ) => {
    setFormData((prev) => {
      const updated = [...prev.dishes];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, dishes: updated };
    });
  };

  const handleFileChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDishImages((prev) => {
        const updated = [...prev];
        updated[idx] = file;
        return updated;
      });
    }
  };

  const removeImage = (idx: number) => {
    setDishImages((prev) => {
      const updated = [...prev];
      updated[idx] = "";
      return updated;
    });
  };

  const addDish = () => {
    if (formData.dishes.length >= 3) {
      toast.error("You can add a maximum of 3 dishes!");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      dishes: [
        ...prev.dishes,
        { name: "", price: "", description: "", image: "" },
      ],
    }));
    setDishImages((prev) => [...prev, ""]);
    toast.success("New dish card prepended!");
  };

  const deleteDish = (idx: number) => {
    setFormData((prev) => {
      const updated = prev.dishes.filter((_, i) => i !== idx);
      return { ...prev, dishes: updated };
    });
    setDishImages((prev) => prev.filter((_, i) => i !== idx));
    toast.success("Dish card deleted successfully.");
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.upperTag?.trim()) errs.push("Upper tag is required");
    if (!formData.regularHeading?.trim())
      errs.push("Heading regular part is required");
    if (!formData.italicHeading?.trim())
      errs.push("Heading italic part is required");

    if (formData.dishes.length === 0) {
      errs.push("Please add at least one dish before saving.");
    }

    formData.dishes.forEach((dish, idx) => {
      if (!dish.name?.trim()) errs.push(`Dish ${idx + 1} Name is required`);
      if (!dish.price?.trim()) errs.push(`Dish ${idx + 1} Price is required`);
      if (!dishImages[idx])
        errs.push(`Image is required for Dish ${idx + 1} (${dish.name})`);
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Signature Dishes Section...");
    try {
      // 1. Filter out only files to upload
      const filesToUpload: { index: number; file: File }[] = [];
      dishImages.forEach((img, idx) => {
        if (img instanceof File) {
          filesToUpload.push({ index: idx, file: img });
        }
      });

      let uploadedUrls: (string | null)[] = [];
      if (filesToUpload.length > 0) {
        uploadedUrls = await uploadFiles(filesToUpload.map((f) => f.file));
      }

      // 2. Map back
      let uploadPointer = 0;
      const finalDishes = formData.dishes.map((dish, idx) => {
        const cell = dishImages[idx];
        if (cell instanceof File) {
          const url = uploadedUrls[uploadPointer] || "";
          uploadPointer++;
          return { ...dish, image: url };
        }
        return { ...dish, image: cell };
      });

      const payload = {
        ...formData,
        dishes: finalDishes,
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
        toast.success("Signature Dishes section saved successfully!", {
          id: toastId,
        });
        setDishImages(finalDishes.map((d) => d.image));
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
          title="Signature Dishes Section (Menu Featured)"
          description="Manage culinary headings, main chef selections, and precisely edit up to 3 spotlight dishes dynamically."
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
                  placeholder="e.g. The Chef's Selection"
                  required
                />
                <InputField
                  label="Heading (Regular)"
                  name="regularHeading"
                  value={formData.regularHeading}
                  onChange={handleChange}
                  placeholder="e.g. Taste the"
                  required
                />
                <InputField
                  label="Heading (Italic Highlight)"
                  name="italicHeading"
                  value={formData.italicHeading}
                  onChange={handleChange}
                  placeholder="e.g. Exceptional"
                  required
                />
                <TextAreaField
                  label="Top Subheading / Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Subheading..."
                  containerClassName="col-span-1 md:col-span-3"
                  rows={2}
                />
              </div>

              {/* Branding, Badges & CTA Editor Block */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest col-span-1 md:col-span-3 pb-2 border-b border-gray-100">
                  Branding, Badges & CTA Configuration
                </h4>
                <InputField
                  label="Watermark Background Text"
                  name="watermark"
                  value={formData.watermark}
                  onChange={handleChange}
                  placeholder="e.g. Signature Dishes"
                />
                <InputField
                  label="Hover Badge Tag"
                  name="badgeLabel"
                  value={formData.badgeLabel}
                  onChange={handleChange}
                  placeholder="e.g. Chef's Signature"
                />
                <InputField
                  label="Hover Badge Text"
                  name="badgeText"
                  value={formData.badgeText}
                  onChange={handleChange}
                  placeholder="e.g. Culinary excellence in every bite."
                />
                <InputField
                  label="CTA Button Label"
                  name="btnLabel"
                  value={formData.btnLabel}
                  onChange={handleChange}
                  placeholder="e.g. Explore Full Menu"
                />
                <InputField
                  label="CTA Button Sublabel"
                  name="btnSublabel"
                  value={formData.btnSublabel}
                  onChange={handleChange}
                  placeholder="e.g. See our complete seasonal collection"
                />
                <InputField
                  label="CTA Button Link / URL"
                  name="btnUrl"
                  value={formData.btnUrl}
                  onChange={handleChange}
                  placeholder="e.g. /menu"
                />
              </div>

              {/* Dishes Editor Grid */}
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Spotlight Dishes ({formData.dishes.length} / 3)
                  </h4>

                  {formData.dishes.length < 3 && (
                    <button
                      type="button"
                      onClick={addDish}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3.5 py-1.5 rounded-xl text-[10px] shadow-sm transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Dish Card
                    </button>
                  )}
                </div>

                {formData.dishes.length === 0 ? (
                  <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center">
                    <Utensils className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400 font-bold">
                      No dish cards added.
                    </p>
                    <button
                      type="button"
                      onClick={addDish}
                      className="mt-3 text-xs font-bold text-blue-500 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Create First Card
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {formData.dishes.map((dish, idx) => {
                      const imgVal = dishImages[idx];
                      const preview =
                        imgVal instanceof File
                          ? URL.createObjectURL(imgVal)
                          : imgVal;
                      return (
                        <div
                          key={idx}
                          className="flex flex-col gap-4 bg-gray-50/40 p-6 border border-gray-100 rounded-3xl shadow-sm relative text-left"
                        >
                          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                              Dish {idx + 1} Card
                            </span>

                            <button
                              type="button"
                              onClick={() => deleteDish(idx)}
                              className="text-red-500 hover:text-red-600 p-1.5 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                              title="Delete Dish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <InputField
                            label="Dish Name"
                            value={dish.name}
                            onChange={(e) =>
                              handleDishFieldChange(idx, "name", e.target.value)
                            }
                            placeholder="e.g. Cured Scottish Salmon"
                            required
                          />

                          <InputField
                            label="Price Tag"
                            value={dish.price}
                            onChange={(e) =>
                              handleDishFieldChange(
                                idx,
                                "price",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. £14.50"
                            required
                          />

                          <TextAreaField
                            label="Ingredients Description"
                            value={dish.description}
                            onChange={(e) =>
                              handleDishFieldChange(
                                idx,
                                "description",
                                e.target.value,
                              )
                            }
                            placeholder="Dish ingredients description..."
                            rows={3}
                          />

                          {/* Image Uploader */}
                          <div className="flex flex-col gap-2 bg-white p-4 border border-gray-100 rounded-2xl">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                              Spotlight Image
                            </label>
                            <div className="relative h-[150px] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center group cursor-pointer mt-1">
                              {preview ? (
                                <>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={preview}
                                    alt={dish.name || "Dish Preview"}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        fileInputRefs.current[idx]?.click()
                                      }
                                      className="bg-white text-gray-800 hover:bg-gray-50 px-3 py-1 rounded-[8px] text-[9px] font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                                    >
                                      Change Image
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => removeImage(idx)}
                                      className="bg-red-500 text-white p-1.5 rounded-[8px] shadow-md hover:bg-red-600 transition-all active:scale-95 cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <div
                                  onClick={() =>
                                    fileInputRefs.current[idx]?.click()
                                  }
                                  className="w-full h-full flex flex-col items-center justify-center p-6 text-center hover:bg-blue-50/10 transition-colors"
                                >
                                  <CloudUpload className="w-6 h-6 text-gray-400 mb-1" />
                                  <span className="text-[9px] text-gray-400 font-semibold">
                                    Upload gourmet image
                                  </span>
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
                        </div>
                      );
                    })}
                  </div>
                )}
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
