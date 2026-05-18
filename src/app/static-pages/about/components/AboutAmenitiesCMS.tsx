"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Sparkles, Plus, Trash2, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

const iconOptions = [
  { value: "Car", label: "Car (Free Parking)" },
  { value: "Sun", label: "Sun (Beer Garden)" },
  { value: "Flame", label: "Flame (Open Fireplace)" },
  { value: "Beer", label: "Beer (Local Ales)" },
  { value: "Home", label: "Home (Private Barn)" },
  { value: "Music", label: "Music (Live Music)" },
  { value: "CloudRain", label: "CloudRain (Covered Outdoors)" },
  { value: "Utensils", label: "Utensils (Dining/Food)" },
  { value: "Heart", label: "Heart (Passion)" },
  { value: "Users", label: "Users (Community)" },
];

const defaultFormData = {
  amenitiesTag: "",
  amenitiesHeading: "",
  amenities: [
    { label: "Free Parking", icon: "Car" },
    { label: "Beer Garden", icon: "Sun" },
    { label: "Open Fireplace", icon: "Flame" },
    { label: "Local Ales & Ciders", icon: "Beer" },
    { label: "Private Barn", icon: "Home" },
    { label: "Live Music", icon: "Music" },
    { label: "Covered Outdoor Space", icon: "CloudRain" },
  ],
};

interface AboutAmenitiesCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AboutAmenitiesCMS({
  sectionId,
  initialData,
  saveUrl = "/api/about",
  responseKey = "AboutAmenities",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: AboutAmenitiesCMSProps) {
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

  useEffect(() => {
    if (initialData) {
      setFormData({ ...defaultFormData, ...initialData });
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey ? json.data?.[responseKey] : json.data;
          if (json.success && sectionData) {
            setFormData({ ...defaultFormData, ...sectionData });
          }
        })
        .catch(console.error);
    }
  }, [initialData, saveUrl, responseKey]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardFieldChange = (index: number, field: "label" | "icon", value: string) => {
    setFormData((prev) => {
      const nextAmenities = [...prev.amenities];
      nextAmenities[index] = { ...nextAmenities[index], [field]: value };
      return { ...prev, amenities: nextAmenities };
    });
  };

  const addAmenity = () => {
    setFormData((prev) => ({
      ...prev,
      amenities: [
        { label: "", icon: "Beer" },
        ...prev.amenities, // Prepended at index 0!
      ],
    }));
  };

  const removeAmenity = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.amenitiesTag?.trim()) errs.push("Tag tagline is required");
    if (!formData.amenitiesHeading?.trim()) errs.push("Heading is required");
    
    formData.amenities.forEach((item, idx) => {
      if (!item.label?.trim()) errs.push(`Amenity label ${idx + 1} is required`);
      if (!item.icon) errs.push(`Amenity icon selection ${idx + 1} is required`);
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Amenities details...");
    try {
      const payload = {
        ...formData,
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
        toast.success("About Amenities saved successfully!", { id: toastId });
        setFormData(payload);
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

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="About Amenities Section"
          description="Manage boutique gastro garden features, open fireplaces, local ales, private barn icons and titles."
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
              <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <InputField
                    label="Section Tag Label"
                    name="amenitiesTag"
                    value={formData.amenitiesTag}
                    onChange={handleChange}
                    placeholder="e.g. Amenities"
                    required
                    containerClassName="flex-1"
                  />
                  
                  <InputField
                    label="Title Heading"
                    name="amenitiesHeading"
                    value={formData.amenitiesHeading}
                    onChange={handleChange}
                    placeholder="e.g. Everything you need"
                    required
                    containerClassName="flex-1"
                  />
                </div>
              </div>

              {/* Amenities List */}
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Curated Amenities ({formData.amenities.length})
                  </h4>
                  <button
                    type="button"
                    onClick={addAmenity}
                    className="text-xs text-blue-500 hover:text-blue-600 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Prepend Amenity Card
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
                  {formData.amenities.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-4 bg-gray-50/40 p-5 border border-gray-100 rounded-3xl shadow-sm relative"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          Card {idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAmenity(idx)}
                          className="text-red-500 hover:text-red-600 p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-all cursor-pointer"
                          title="Remove Amenity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <InputField
                        label="Amenity Label"
                        value={item.label}
                        onChange={(e) => handleCardFieldChange(idx, "label", e.target.value)}
                        placeholder="e.g. Beer Garden"
                        required
                      />

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Select Feature Icon
                        </label>
                        <select
                          value={item.icon}
                          onChange={(e) => handleCardFieldChange(idx, "icon", e.target.value)}
                          className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                        >
                          {iconOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
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
