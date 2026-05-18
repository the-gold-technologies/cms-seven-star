"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import {
  CloudUpload,
  Trash2,
  Plus,
  Sparkles,
  LayoutGrid,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

interface CategoryData {
  title: string;
  description: string;
  items: string[];
  image: string;
  caption: string;
}

const defaultFormData = {
  upperTag: "",
  heading: "",
  menuCategories: [] as CategoryData[],
};

interface MenuCuratedCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function MenuCuratedCMS({
  sectionId,
  initialData,
  saveUrl = "/api/menu",
  responseKey = "MenuCurated",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: MenuCuratedCMSProps) {
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

  // Maintain separate upload state arrays for each of the 5 bento cards
  const [selectedImages, setSelectedImages] = useState<(File | string)[]>([
    "",
    "",
    "",
    "",
    "",
  ]);

  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (initialData) {
      const data = { ...defaultFormData, ...initialData };
      setFormData(data);
      if (data.menuCategories) {
        setSelectedImages(data.menuCategories.map((c) => c.image || ""));
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
            if (data.menuCategories) {
              setSelectedImages(
                data.menuCategories.map((c: any) => c.image || ""),
              );
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

  const handleCardFieldChange = (
    index: number,
    field: keyof CategoryData,
    value: string,
  ) => {
    setFormData((prev) => {
      const updated = [...prev.menuCategories];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, menuCategories: updated };
    });
  };

  const handleItemNameChange = (
    cardIndex: number,
    itemIndex: number,
    val: string,
  ) => {
    setFormData((prev) => {
      const updated = [...prev.menuCategories];
      const updatedItems = [...updated[cardIndex].items];
      updatedItems[itemIndex] = val;
      updated[cardIndex] = { ...updated[cardIndex], items: updatedItems };
      return { ...prev, menuCategories: updated };
    });
  };

  const addDishToCard = (cardIndex: number) => {
    setFormData((prev) => {
      const updated = [...prev.menuCategories];
      const updatedItems = [...updated[cardIndex].items, ""];
      updated[cardIndex] = { ...updated[cardIndex], items: updatedItems };
      return { ...prev, menuCategories: updated };
    });
  };

  const deleteDishFromCard = (cardIndex: number, itemIndex: number) => {
    setFormData((prev) => {
      const updated = [...prev.menuCategories];
      const updatedItems = updated[cardIndex].items.filter(
        (_, i) => i !== itemIndex,
      );
      updated[cardIndex] = { ...updated[cardIndex], items: updatedItems };
      return { ...prev, menuCategories: updated };
    });
  };

  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImages((prev) => {
        const updated = [...prev];
        updated[index] = file;
        return updated;
      });
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => {
      const updated = [...prev];
      updated[index] = "";
      return updated;
    });
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.upperTag?.trim()) errs.push("Eyebrow tag is required");
    if (!formData.heading?.trim()) errs.push("Heading title is required");

    formData.menuCategories.forEach((c, idx) => {
      if (!c.title?.trim())
        errs.push(`Bento Card ${idx + 1} Title is required`);
      if (!c.description?.trim())
        errs.push(`Bento Card ${idx + 1} Description is required`);
      if (!c.caption?.trim())
        errs.push(`Bento Card ${idx + 1} Image Alt Caption is required`);
      if (!selectedImages[idx])
        errs.push(`Bento Card ${idx + 1} Cover Photo is required`);

      c.items.forEach((item, itemIdx) => {
        if (!item.trim())
          errs.push(`Card ${idx + 1} item ${itemIdx + 1} cannot be empty`);
      });
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Curated Courses Bento grids...");
    try {
      const updatedCards = [...formData.menuCategories];

      // Sequential image upload
      for (let i = 0; i < 5; i++) {
        const item = selectedImages[i];
        if (item instanceof File) {
          const urls = await uploadFiles([item]);
          updatedCards[i].image = urls[0] || "";
        } else {
          updatedCards[i].image = item;
        }
      }

      const payload = {
        ...formData,
        menuCategories: updatedCards,
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
        toast.success("Bento Curated Courses saved successfully!", {
          id: toastId,
        });
        setFormData(payload);
        setSelectedImages(payload.menuCategories.map((c) => c.image));
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
          title="Curated Courses Bento Section"
          description="Edit global headers and manage all five bento course cards (images, summaries, and showcase dishes)."
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
              {/* Heading settings */}
              <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <LayoutGrid className="w-3.5 h-3.5 text-blue-500" />
                  Section Headers
                </h4>

                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <InputField
                    label="Eyebrow Subtitle"
                    name="upperTag"
                    value={formData.upperTag}
                    onChange={handleChange}
                    placeholder="e.g. The Collection"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Heading Title"
                    name="heading"
                    value={formData.heading}
                    onChange={handleChange}
                    placeholder="e.g. Curated Courses"
                    required
                    containerClassName="flex-1"
                  />
                </div>
              </div>

              {/* Five Bento Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2  gap-8">
                {formData.menuCategories.map((card, idx) => {
                  const preview =
                    selectedImages[idx] instanceof File
                      ? URL.createObjectURL(selectedImages[idx] as File)
                      : (selectedImages[idx] as string);
                  const name =
                    typeof selectedImages[idx] === "string"
                      ? (selectedImages[idx] as string).split("/").pop() ||
                        `Bento Card ${idx + 1} Image`
                      : (selectedImages[idx] as File)?.name;

                  return (
                    <div
                      key={idx}
                      className="flex flex-col gap-6 p-6 bg-white border border-gray-200/80 rounded-3xl relative hover:border-gray-300 transition-all text-left"
                    >
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2 mb-1">
                        <Award className="w-3.5 h-3.5 text-blue-500" />
                        Bento Course Card #{idx + 1} - {card.title || `Card`}
                      </span>

                      {/* Cover Photo */}
                      <div className="flex flex-col gap-2.5">
                        <label className="text-xs font-semibold text-gray-600">
                          Cover Photo
                        </label>
                        {preview ? (
                          <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 rounded-2xl">
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={preview}
                                alt={`Bento ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-[10px] font-bold text-gray-700 truncate max-w-[80px]">
                              {name}
                            </span>
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  fileInputRefs[idx].current?.click()
                                }
                                className="bg-white hover:bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-[9px] font-bold border border-gray-200 shadow-sm"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="text-red-500 hover:text-red-600 p-1.5 bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInputRefs[idx].current?.click()}
                            className="border-2 border-dashed border-gray-200 hover:border-blue-500 bg-white hover:bg-blue-50/5 rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all"
                          >
                            <CloudUpload className="w-6 h-6 text-gray-400 mb-1" />
                            <p className="text-[10px] text-gray-500 font-bold">
                              Upload image
                            </p>
                          </div>
                        )}
                        <input
                          type="file"
                          ref={fileInputRefs[idx]}
                          onChange={(e) => handleFileChange(idx, e)}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>

                      <InputField
                        label="Course Card Title"
                        value={card.title}
                        onChange={(e) =>
                          handleCardFieldChange(idx, "title", e.target.value)
                        }
                        placeholder="e.g. Starters"
                        required
                      />

                      <TextAreaField
                        label="Card Short Description"
                        value={card.description}
                        onChange={(e) =>
                          handleCardFieldChange(
                            idx,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. Perfect beginnings..."
                        rows={2}
                        required
                      />

                      <InputField
                        label="Culinary Image Caption / Alt Text"
                        value={card.caption}
                        onChange={(e) =>
                          handleCardFieldChange(idx, "caption", e.target.value)
                        }
                        placeholder="e.g. Honouring the classics with fresh..."
                        required
                      />

                      {/* Course items */}
                      <div className="flex flex-col gap-3 bg-gray-50/50 p-4 border border-gray-100 rounded-2xl">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                          Showcase dishes
                        </label>
                        <div className="flex flex-col gap-2">
                          {card.items.map((item, itemIdx) => (
                            <div
                              key={itemIdx}
                              className="flex items-center gap-2 relative"
                            >
                              <input
                                type="text"
                                value={item}
                                onChange={(e) =>
                                  handleItemNameChange(
                                    idx,
                                    itemIdx,
                                    e.target.value,
                                  )
                                }
                                placeholder="e.g. Crispy Squid"
                                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => deleteDishFromCard(idx, itemIdx)}
                                className="text-red-500 p-1 hover:bg-red-50 rounded-lg shrink-0"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addDishToCard(idx)}
                            className="flex items-center justify-center gap-1.5 border border-dashed border-gray-200 hover:border-blue-500 py-2 rounded-xl text-[10px] font-bold text-gray-500 hover:text-blue-600 transition-colors mt-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Showcase Dish
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
