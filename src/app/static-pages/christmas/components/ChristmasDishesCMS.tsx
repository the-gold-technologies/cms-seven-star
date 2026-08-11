"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import {
  CloudUpload,
  Trash2,
  Sparkles,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

const defaultFormData = {
  tagline: "Visual Feast",
  heading: "Our Christmas",
  headingHighlight: "Special Dishes",
  dishesList: [
    {
      name: "Festive Starters",
      tagline: "Begin the Celebration",
      description:
        "A selection of beautiful, chef-prepared seasonal appetizers to kick off your Christmas meal.",
      image:
        "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish1.webp",
    },
    {
      name: "Traditional Mains",
      tagline: "The Heart of Christmas",
      description:
        "Hearty, classic holiday main courses prepared using the finest locally sourced ingredients.",
      image:
        "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish2.webp",
    },
    {
      name: "Decadent Desserts",
      tagline: "A Sweet Finale",
      description:
        "Indulgent treats and festive showstoppers to end your celebration on a sweet note.",
      image:
        "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish3.webp",
    },
    {
      name: "Festive Canapés",
      tagline: "Perfect for Parties",
      description:
        "Bite-sized delights crafted to complement your festive drinks and social gatherings.",
      image:
        "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish4.webp",
    },
    {
      name: "Gourmet Selections",
      tagline: "Chef's Handcrafted Specialties",
      description:
        "Unique, seasonal creations highlighting the best of winter game and local produce.",
      image:
        "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish5.webp",
    },
    {
      name: "Festive Roast Sides",
      tagline: "The Perfect Accompaniments",
      description:
        "Crispy roast potatoes, honey-glazed root veg, and all the classic trimmings.",
      image:
        "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish6.webp",
    },
    {
      name: "Artisan Cheeseboard",
      tagline: "Savory Indulgence",
      description:
        "A curated selection of British cheeses served with crackers, seasonal chutney, and grapes.",
      image:
        "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish7.webp",
    },
    {
      name: "Holiday Treats",
      tagline: "Festive Sweet Treats",
      description:
        "Homemade mince pies, truffles, and warm festive cookies served alongside your coffee.",
      image:
        "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish8.webp",
    },
  ],
};

export function ChristmasDishesCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [dishImages, setDishImages] = useState<(File | string)[]>([]);
  // Track open/collapsed state of each dish item card (default: all collapsed except first for clean view)
  const [collapsedCards, setCollapsedCards] = useState<Record<number, boolean>>(
    {},
  );

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const saveUrl = "/api/christmas";
  const responseKey = "ChristmasDishes";

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.[responseKey];
        if (json.success && sectionData) {
          const data = { ...defaultFormData, ...sectionData };
          setFormData(data);
          setDishImages(data.dishesList.map((d: any) => d.image || ""));
        } else {
          setDishImages(defaultFormData.dishesList.map((d) => d.image));
        }
      })
      .catch(console.error);
  }, []);

  const toggleCardCollapse = (index: number) => {
    setCollapsedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const expandAllCards = () => {
    setCollapsedCards({});
  };

  const collapseAllCards = () => {
    const allCollapsed: Record<number, boolean> = {};
    formData.dishesList.forEach((_, i) => {
      allCollapsed[i] = true;
    });
    setCollapsedCards(allCollapsed);
  };

  const handleChangeHeader = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeDishList = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updated = [...formData.dishesList];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, dishesList: updated }));
  };

  const addDishItem = () => {
    const newDish = {
      name: "New Festive Dish",
      tagline: "Chef's Special",
      description: "Delicious seasonal dish crafted for the holidays.",
      image: "",
    };
    const newIndex = formData.dishesList.length;
    setFormData((prev) => ({
      ...prev,
      dishesList: [...prev.dishesList, newDish],
    }));
    setDishImages((prev) => [...prev, ""]);
    // Keep the new item expanded so user can edit right away
    setCollapsedCards((prev) => ({ ...prev, [newIndex]: false }));
    toast.success("New dish item added!");
  };

  const removeDishItem = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (formData.dishesList.length <= 1) {
      toast.error("At least one dish item is required in the carousel!");
      return;
    }
    const dishName = formData.dishesList[index]?.name || `Item #${index + 1}`;
    setFormData((prev) => ({
      ...prev,
      dishesList: prev.dishesList.filter((_, i) => i !== index),
    }));
    setDishImages((prev) => prev.filter((_, i) => i !== index));
    toast.success(`Removed "${dishName}"`);
  };

  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const updated = [...dishImages];
      updated[index] = e.target.files[0];
      setDishImages(updated);
    }
  };

  const removeImage = (index: number) => {
    const updated = [...dishImages];
    updated[index] = "";
    setDishImages(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Christmas Dishes...");
    try {
      const uploadedUrls = await uploadFiles(dishImages);

      const savedDishesList = formData.dishesList.map((dish, i) => {
        const imgUrl =
          dishImages[i] instanceof File
            ? uploadedUrls[i] || ""
            : (dishImages[i] as string) || "";
        return {
          ...dish,
          image: imgUrl,
        };
      });

      const payload = {
        tagline: formData.tagline,
        heading: formData.heading,
        headingHighlight: formData.headingHighlight,
        dishesList: savedDishesList,
      };

      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: responseKey, content: payload }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Dishes saved successfully!", { id: toastId });
        setFormData(payload);
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
      <SectionHeader
        title="Dishes Carousel Section"
        description="Manage headings and items displayed in the Special Dishes horizontal carousel."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="flex flex-col gap-8 pt-6">
          <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                label="Section Tagline"
                name="tagline"
                value={formData.tagline}
                onChange={handleChangeHeader}
              />
              <InputField
                label="Section Heading"
                name="heading"
                value={formData.heading}
                onChange={handleChangeHeader}
              />
              <InputField
                label="Heading Highlight (Italic text)"
                name="headingHighlight"
                value={formData.headingHighlight}
                onChange={handleChangeHeader}
              />
            </div>
          </div>

          {/* Carousel Items Header with Controls */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Carousel Dishes ({formData.dishesList.length})
              </h3>
              <div className="flex items-center gap-2 ml-4">
                <button
                  type="button"
                  onClick={expandAllCards}
                  className="text-[11px] font-semibold text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Expand All
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={collapseAllCards}
                  className="text-[11px] font-semibold text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Collapse All
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={addDishItem}
              className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Dish Item
            </button>
          </div>

          {/* Dishes List with Collapsible Cards */}
          <div className="flex flex-col gap-4">
            {formData.dishesList.map((dish, i) => {
              const isCollapsed = Boolean(collapsedCards[i]);
              const preview =
                dishImages[i] instanceof File
                  ? URL.createObjectURL(dishImages[i] as File)
                  : (dishImages[i] as string) || "";
              const imgName =
                typeof dishImages[i] === "string"
                  ? (dishImages[i] as string).split("/").pop() || "Dish Image"
                  : (dishImages[i] as File)?.name;

              return (
                <div
                  key={i}
                  className={`flex flex-col bg-white border border-gray-200 rounded-2xl transition-all duration-200 overflow-hidden ${
                    isCollapsed
                      ? "shadow-none hover:border-gray-300"
                      : "shadow-sm border-gray-300"
                  }`}
                >
                  {/* Card Header Bar (Click to Collapse/Expand) */}
                  <div
                    onClick={() => toggleCardCollapse(i)}
                    className="flex items-center justify-between p-4 px-6 bg-gray-50/70 hover:bg-gray-100/80 cursor-pointer select-none transition-colors border-b border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                        #{i + 1}
                      </div>

                      {preview && (
                        <div className="w-8 h-8 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preview}
                            alt="Dish Thumb"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 leading-tight">
                          {dish.name || "Untitled Dish Item"}
                        </span>
                        {dish.tagline && (
                          <span className="text-xs text-gray-400 font-medium">
                            {dish.tagline}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => removeDishItem(i, e)}
                        className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 text-xs font-semibold px-2.5 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>

                      <div className="text-gray-400 p-1">
                        {isCollapsed ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronUp className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Body (Collapsible Content) */}
                  {!isCollapsed && (
                    <div className="flex flex-col gap-6 p-6 bg-white animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                          label="Dish Name"
                          value={dish.name}
                          onChange={(e) =>
                            handleChangeDishList(i, "name", e.target.value)
                          }
                        />
                        <InputField
                          label="Dish Tagline"
                          value={dish.tagline}
                          onChange={(e) =>
                            handleChangeDishList(i, "tagline", e.target.value)
                          }
                        />
                      </div>

                      <TextAreaField
                        label="Description Summary"
                        value={dish.description}
                        onChange={(e) =>
                          handleChangeDishList(i, "description", e.target.value)
                        }
                        rows={2}
                      />

                      {/* Image Picker */}
                      <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Dish Showcase Image
                        </span>

                        {preview ? (
                          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
                            <div className="flex items-center gap-3 text-gray-700">
                              <div className="w-8 h-8 rounded bg-gray-200 overflow-hidden relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={preview}
                                  alt="Dish Pic"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-xs font-bold text-gray-900 truncate max-w-xs">
                                {imgName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  fileInputRefs.current[i]?.click()
                                }
                                className="bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded text-[10px] font-bold shadow-sm hover:bg-gray-100 cursor-pointer"
                              >
                                Change
                              </button>
                              <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="text-red-500 p-1.5 bg-red-50 hover:bg-red-100 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInputRefs.current[i]?.click()}
                            className="w-full border border-dashed border-gray-200 hover:border-blue-500 bg-gray-50/50 p-6 rounded-xl text-center cursor-pointer group"
                          >
                            <CloudUpload className="w-6 h-6 text-gray-400 group-hover:text-blue-500 mx-auto mb-1" />
                            <p className="text-xs text-gray-500 font-semibold">
                              Upload Dish Photo
                            </p>
                          </div>
                        )}
                        <input
                          type="file"
                          ref={(el) => {
                            fileInputRefs.current[i] = el;
                          }}
                          onChange={(e) => handleFileChange(i, e)}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Action Bar */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <SaveButton
              onClick={handleSave}
              disabled={isSaving}
              className="w-44 h-12 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
