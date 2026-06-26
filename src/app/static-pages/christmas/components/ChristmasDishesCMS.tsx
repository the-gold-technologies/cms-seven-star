"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { CloudUpload, Trash2, Sparkles } from "lucide-react";
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
      description: "A selection of beautiful, chef-prepared seasonal appetizers to kick off your Christmas meal.",
      image: "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish1.webp",
    },
    {
      name: "Traditional Mains",
      tagline: "The Heart of Christmas",
      description: "Hearty, classic holiday main courses prepared using the finest locally sourced ingredients.",
      image: "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish2.webp",
    },
    {
      name: "Decadent Desserts",
      tagline: "A Sweet Finale",
      description: "Indulgent treats and festive showstoppers to end your celebration on a sweet note.",
      image: "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish3.webp",
    },
    {
      name: "Festive Canapés",
      tagline: "Perfect for Parties",
      description: "Bite-sized delights crafted to complement your festive drinks and social gatherings.",
      image: "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish4.webp",
    },
    {
      name: "Gourmet Selections",
      tagline: "Chef's Handcrafted Specialties",
      description: "Unique, seasonal creations highlighting the best of winter game and local produce.",
      image: "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish5.webp",
    },
    {
      name: "Festive Roast Sides",
      tagline: "The Perfect Accompaniments",
      description: "Crispy roast potatoes, honey-glazed root veg, and all the classic trimmings.",
      image: "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish6.webp",
    },
    {
      name: "Artisan Cheeseboard",
      tagline: "Savory Indulgence",
      description: "A curated selection of British cheeses served with crackers, seasonal chutney, and grapes.",
      image: "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish7.webp",
    },
    {
      name: "Holiday Treats",
      tagline: "Festive Sweet Treats",
      description: "Homemade mince pies, truffles, and warm festive cookies served alongside your coffee.",
      image: "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/dish8.webp",
    }
  ]
};

export function ChristmasDishesCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [dishImages, setDishImages] = useState<(File | string)[]>([]);

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

  const handleChangeHeader = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeDishList = (index: number, field: string, value: string) => {
    const updated = [...formData.dishesList];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, dishesList: updated }));
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
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
        const imgUrl = dishImages[i] instanceof File ? uploadedUrls[i] || "" : dishImages[i] as string;
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

          <div className="flex flex-col gap-8">
            {formData.dishesList.map((dish, i) => {
              const preview = dishImages[i] instanceof File ? URL.createObjectURL(dishImages[i] as File) : dishImages[i] as string;
              const imgName = typeof dishImages[i] === "string" ? (dishImages[i] as string).split("/").pop() || "Dish Image" : (dishImages[i] as File)?.name;

              return (
                <div key={i} className="flex flex-col gap-6 bg-gray-50/10 border border-gray-100 p-6 rounded-2xl">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest pb-1 border-b border-gray-200/50">
                    Dish Carousel Item #{i + 1} - {dish.name || "Untitled"}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Dish Name"
                      value={dish.name}
                      onChange={(e) => handleChangeDishList(i, "name", e.target.value)}
                    />
                    <InputField
                      label="Dish Tagline"
                      value={dish.tagline}
                      onChange={(e) => handleChangeDishList(i, "tagline", e.target.value)}
                    />
                  </div>

                  <TextAreaField
                    label="Description Summary"
                    value={dish.description}
                    onChange={(e) => handleChangeDishList(i, "description", e.target.value)}
                    rows={2}
                  />

                  {/* Image Picker */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Dish Showcase Image
                    </span>

                    {preview ? (
                      <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="w-8 h-8 rounded bg-gray-200 overflow-hidden relative">
                            <img src={preview} alt="Dish Pic" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs font-bold text-gray-900 truncate max-w-xs">{imgName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRefs.current[i]?.click()}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-[10px] font-bold shadow-sm"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="text-red-500 p-1.5 bg-red-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRefs.current[i]?.click()}
                        className="w-full border border-dashed border-gray-200 hover:border-blue-500 bg-white p-6 rounded-xl text-center cursor-pointer group"
                      >
                        <CloudUpload className="w-6 h-6 text-gray-400 group-hover:text-blue-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-500 font-semibold">Upload Dish Photo</p>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={(el) => { fileInputRefs.current[i] = el; }}
                      onChange={(e) => handleFileChange(i, e)}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <SaveButton onClick={handleSave} disabled={isSaving} className="w-44 h-12 text-sm" />
          </div>
        </div>
      )}
    </div>
  );
}
