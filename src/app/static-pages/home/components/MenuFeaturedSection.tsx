"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { CloudUpload, Trash2, Sparkles, Utensils, Euro } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

const defaultDishes = [
  {
    name: "Cured Scottish Salmon",
    price: "£14.50",
    description: "Citrus-cured salmon, pickled cucumber, radish, and herb emulsion.",
    image: "/images/menu/SEVEN_STARS_2026_02_09-129.jpg",
  },
  {
    name: "Pan-Seared Duck Breast",
    price: "£26.95",
    description: "Tender duck breast, honey-glazed carrots, potato fondant, and rich red wine reduction.",
    image: "/images/menu/SEVEN_STARS_2026_02_09-142.jpg",
  },
  {
    name: "Golden Squash Risotto",
    price: "£18.50",
    description: "Creamy butternut squash risotto, crumbled feta, roasted beetroot, and crispy kale.",
    image: "/images/menu/SEVEN_STARS_2026_02_09-213.jpg",
  },
  {
    name: "Chocolate Lava Cake",
    price: "£9.50",
    description: "Warm chocolate fondant, vanilla bean ice cream, fresh strawberries, and berry coulis.",
    image: "/images/menu/SEVEN_STARS_2026_02_09-0159.jpg",
  },
];

const defaultFormData = {
  upperTag: "The Chef's Selection",
  regularHeading: "Taste the",
  italicHeading: "Exceptional",
  description: "Experience our most celebrated seasonal creations, each crafted with locally sourced ingredients and culinary passion.",
  dishes: defaultDishes,
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
  responseKey = "OurPartners", // Map to OurPartners DB slot to prevent schema breakage
  onSave,
}: MenuFeaturedSectionProps) {
  const [isOpen, setIsOpen] = useState(!initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  
  const [dishImages, setDishImages] = useState<(File | string)[]>(
    defaultDishes.map((d) => d.image)
  );
  
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>(
    defaultDishes.map(() => null)
  );

  useEffect(() => {
    if (initialData) {
      const data = { ...defaultFormData, ...initialData };
      const mergedDishes = defaultDishes.map((dd, idx) => {
        const customD = data.dishes?.[idx] || {};
        return {
          name: customD.name || dd.name,
          price: customD.price || dd.price,
          description: customD.description || dd.description,
          image: customD.image || dd.image,
        };
      });
      data.dishes = mergedDishes;
      setFormData(data);
      setDishImages(mergedDishes.map((d) => d.image));
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey ? json.data?.[responseKey] : json.data;
          if (json.success && sectionData) {
            const data = { ...defaultFormData, ...sectionData };
            const mergedDishes = defaultDishes.map((dd, idx) => {
              const customD = data.dishes?.[idx] || {};
              return {
                name: customD.name || dd.name,
                price: customD.price || dd.price,
                description: customD.description || dd.description,
                image: customD.image || dd.image,
              };
            });
            data.dishes = mergedDishes;
            setFormData(data);
            setDishImages(mergedDishes.map((d) => d.image));
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

  const handleDishFieldChange = (idx: number, field: "name" | "price" | "description", value: string) => {
    setFormData((prev) => {
      const updated = [...prev.dishes];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, dishes: updated };
    });
  };

  const handleFileChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.upperTag?.trim()) errs.push("Upper tag is required");
    if (!formData.regularHeading?.trim()) errs.push("Heading regular part is required");
    if (!formData.italicHeading?.trim()) errs.push("Heading italic part is required");
    
    formData.dishes.forEach((dish, idx) => {
      if (!dish.name?.trim()) errs.push(`Dish ${idx + 1} Name is required`);
      if (!dish.price?.trim()) errs.push(`Dish ${idx + 1} Price is required`);
      if (!dishImages[idx]) errs.push(`Image is required for Dish ${idx + 1} (${dish.name})`);
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Signature Dishes Section...");
    try {
      const uploadedUrls = await uploadFiles(dishImages);

      const finalDishes = formData.dishes.map((dish, idx) => {
        const cell = dishImages[idx];
        const url = cell instanceof File ? uploadedUrls[idx] || "" : cell;
        return {
          name: dish.name,
          price: dish.price,
          description: dish.description,
          image: url,
        };
      });

      const payload = {
        ...formData,
        dishes: finalDishes,
      };

      const body = sectionId
        ? { id: sectionId, content: payload }
        : { section: responseKey ?? "OurPartners", content: payload };

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Signature Dishes section saved successfully!", { id: toastId });
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
          description="Manage culinary headings, main chef selections, and precisely edit the 4 spotlight dishes and gourmet photos."
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

              {/* Dishes Editor Grid */}
              <div className="flex flex-col gap-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Spotlight Dishes (Exactly 4 Dishes)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {formData.dishes.map((dish, idx) => {
                    const imgVal = dishImages[idx];
                    const preview = imgVal instanceof File ? URL.createObjectURL(imgVal) : imgVal;
                    return (
                      <div key={idx} className="flex flex-col gap-4 bg-gray-50/40 p-6 border border-gray-100 rounded-3xl shadow-sm relative">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Dish {idx + 1} {idx === 0 ? "(Featured Large Card)" : "(Boutique Swap Card)"}</span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <InputField
                            label="Dish Name"
                            value={dish.name}
                            onChange={(e) => handleDishFieldChange(idx, "name", e.target.value)}
                            placeholder="e.g. Cured Scottish Salmon"
                            containerClassName="md:col-span-2"
                            required
                          />
                          <InputField
                            label="Price Tag"
                            value={dish.price}
                            onChange={(e) => handleDishFieldChange(idx, "price", e.target.value)}
                            placeholder="e.g. £14.50"
                            required
                          />
                        </div>

                        <TextAreaField
                          label="Ingredients Description"
                          value={dish.description}
                          onChange={(e) => handleDishFieldChange(idx, "description", e.target.value)}
                          placeholder="Dish ingredients description..."
                          rows={2}
                        />

                        {/* Image Uploader */}
                        <div className="flex flex-col gap-2 bg-white p-4 border border-gray-100 rounded-2xl">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Spotlight Image</label>
                          <div className="relative h-[180px] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center group cursor-pointer mt-1">
                            {preview ? (
                              <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={preview} alt={dish.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => fileInputRefs.current[idx]?.click()}
                                    className="bg-white text-gray-800 hover:bg-gray-50 px-3.5 py-1.5 rounded-xl text-[10px] font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                                  >
                                    Change Image
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="bg-red-500 text-white p-2 rounded-xl shadow-md hover:bg-red-600 transition-all active:scale-95 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </>
                            ) : (
                              <div
                                onClick={() => fileInputRefs.current[idx]?.click()}
                                className="w-full h-full flex flex-col items-center justify-center p-6 text-center hover:bg-blue-50/10 transition-colors"
                              >
                                <CloudUpload className="w-6 h-6 text-gray-400 mb-2" />
                                <span className="text-[10px] text-gray-400 font-semibold">Upload gourmet image</span>
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
