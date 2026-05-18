"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { CloudUpload, Trash2, Sparkles, LayoutGrid, Award } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

interface CapabilityData {
  title: string;
  description: string;
  image: string;
  iconName: string;
}

const defaultFormData = {
  upperTag: "Our Capabilities",
  heading: "From Intimate to",
  headingHighlight: "Grand Occasions",
  capabilities: [
    {
      title: "Celebrations",
      description: "Birthdays, anniversaries, and family reunions find their perfect home in our versatile spaces.",
      image: "/images/gallery/gallery-3.jpg",
      iconName: "PartyPopper",
    },
    {
      title: "Live Events",
      description: "Our garden and bar often come alive with live acoustic sets and community performances.",
      image: "/images/gallery/gallery-4.jpg",
      iconName: "Music",
    },
    {
      title: "The Private Barn",
      description: "Our signature private space for up to 40 guests, offering an exclusive feel for your most special moments.",
      image: "/images/gallery/gallery-8.jpg",
      iconName: "Warehouse",
    },
  ] as CapabilityData[],
};

interface EventsCapabilitiesCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function EventsCapabilitiesCMS({
  sectionId,
  initialData,
  saveUrl = "/api/events",
  responseKey = "EventsCapabilities",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: EventsCapabilitiesCMSProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(!initialData);
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

  // Separate uploader status for all 3 cards
  const [selectedImages, setSelectedImages] = useState<(File | string)[]>([
    "",
    "",
    "",
  ]);

  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (initialData) {
      const data = { ...defaultFormData, ...initialData };
      setFormData(data);
      if (data.capabilities) {
        setSelectedImages(data.capabilities.map((c) => c.image || ""));
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
            if (data.capabilities) {
              setSelectedImages(data.capabilities.map((c: any) => c.image || ""));
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
    field: keyof CapabilityData,
    value: string,
  ) => {
    setFormData((prev) => {
      const updated = [...prev.capabilities];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, capabilities: updated };
    });
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!formData.upperTag?.trim()) errs.push("Eyebrow tag label is required");
    if (!formData.heading?.trim()) errs.push("Heading title is required");
    if (!formData.headingHighlight?.trim()) errs.push("Heading highlight part is required");

    formData.capabilities.forEach((c, index) => {
      if (!c.title?.trim()) errs.push(`Capability ${index + 1} Title is required`);
      if (!c.description?.trim()) errs.push(`Capability ${index + 1} Description is required`);
      if (!c.iconName?.trim()) errs.push(`Capability ${index + 1} Icon Name is required`);
      if (!selectedImages[index]) errs.push(`Capability ${index + 1} Image uploader is required`);
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Capabilities Grid...");
    try {
      const updatedCards = [...formData.capabilities];

      // Sequential image upload
      for (let i = 0; i < 3; i++) {
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
        capabilities: updatedCards,
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
        toast.success("Capabilities Grid saved successfully!", { id: toastId });
        setFormData(payload);
        setSelectedImages(payload.capabilities.map((c) => c.image));
        if (onSave) onSave(payload as unknown as Record<string, unknown>);
      } else {
        toast.error(json.error || "Save failed. Please try again.", { id: toastId });
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
          title="Events Capabilities Section"
          description="Edit global headings, icons, titles, and backgrounds for all 3 Capability Cards."
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
              
              {/* Heading configuration */}
              <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <LayoutGrid className="w-3.5 h-3.5 text-blue-500" />
                  Section Headers
                </h4>

                <InputField
                  label="Eyebrow Subtitle"
                  name="upperTag"
                  value={formData.upperTag}
                  onChange={handleChange}
                  placeholder="e.g. Our Capabilities"
                  required
                />

                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <InputField
                    label="Heading Regular Part"
                    name="heading"
                    value={formData.heading}
                    onChange={handleChange}
                    placeholder="e.g. From Intimate to"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Heading Italic Part"
                    name="headingHighlight"
                    value={formData.headingHighlight}
                    onChange={handleChange}
                    placeholder="e.g. Grand Occasions"
                    required
                    containerClassName="flex-1"
                  />
                </div>
              </div>

              {/* Capability Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {formData.capabilities.map((card, idx) => {
                  const preview =
                    selectedImages[idx] instanceof File
                      ? URL.createObjectURL(selectedImages[idx] as File)
                      : (selectedImages[idx] as string);
                  const name =
                    typeof selectedImages[idx] === "string"
                      ? (selectedImages[idx] as string).split("/").pop() || `Card ${idx + 1} Image`
                      : (selectedImages[idx] as File)?.name;

                  return (
                    <div
                      key={idx}
                      className="flex flex-col gap-6 p-6 bg-white border border-gray-200/80 rounded-3xl relative hover:border-gray-300 transition-all text-left"
                    >
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2 mb-1">
                        <Award className="w-3.5 h-3.5 text-blue-500" />
                        Capability Card #{idx + 1}
                      </span>

                      {/* Cover Photo */}
                      <div className="flex flex-col gap-2.5">
                        <label className="text-xs font-semibold text-gray-600">Cover Photo</label>
                        {preview ? (
                          <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 rounded-2xl">
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={preview}
                                alt={`Capability ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-[10px] font-bold text-gray-700 truncate max-w-[80px]">
                              {name}
                            </span>
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => fileInputRefs[idx].current?.click()}
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
                            <p className="text-[10px] text-gray-500 font-bold">Upload image</p>
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

                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          label="Card Title"
                          value={card.title}
                          onChange={(e) => handleCardFieldChange(idx, "title", e.target.value)}
                          placeholder="e.g. Celebrations"
                          required
                        />
                        <InputField
                          label="Icon Name"
                          value={card.iconName}
                          onChange={(e) => handleCardFieldChange(idx, "iconName", e.target.value)}
                          placeholder="e.g. PartyPopper, Music, Warehouse"
                          required
                        />
                      </div>

                      <TextAreaField
                        label="Description Copy"
                        value={card.description}
                        onChange={(e) => handleCardFieldChange(idx, "description", e.target.value)}
                        placeholder="e.g. Birthdays, anniversaries..."
                        rows={4}
                        required
                      />
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
