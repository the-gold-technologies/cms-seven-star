"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { CloudUpload, Trash2, Sparkles, Calendar, Award, Plus, ChevronDown, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

interface EventData {
  title: string;
  date: string;
  time: string;
  description: string;
  pricing: string;
  highlight: string;
  contactInfo: string;
  image: string;
  category: string;
}

const defaultFormData = {
  upperTag: "",
  heading: "",
  description: "",
  upcomingEvents: [] as EventData[],
};

interface UpcomingEventsCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function UpcomingEventsCMS({
  sectionId,
  initialData,
  saveUrl = "/api/events",
  responseKey = "UpcomingEvents",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: UpcomingEventsCMSProps) {
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

  // Maintain separate upload state arrays for each upcoming event photo
  const [selectedImages, setSelectedImages] = useState<(File | string)[]>([]);

  const [collapsedCards, setCollapsedCards] = useState<Record<number, boolean>>({});

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (initialData) {
      const data = { ...defaultFormData, ...initialData };
      setFormData(data);
      if (data.upcomingEvents) {
        setSelectedImages(data.upcomingEvents.map((e) => e.image || ""));
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
            if (data.upcomingEvents) {
              setSelectedImages(
                data.upcomingEvents.map((e: any) => e.image || ""),
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

  const handleEventFieldChange = (
    index: number,
    field: keyof EventData,
    value: string,
  ) => {
    setFormData((prev) => {
      const updated = [...prev.upcomingEvents];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, upcomingEvents: updated };
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

  const toggleCardCollapse = (index: number) => {
    setCollapsedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const addEvent = () => {
    setFormData((prev) => ({
      ...prev,
      upcomingEvents: [
        ...prev.upcomingEvents,
        {
          title: "",
          date: "",
          time: "",
          description: "",
          pricing: "",
          highlight: "",
          contactInfo: "",
          image: "",
          category: "",
        },
      ],
    }));
    setSelectedImages((prev) => [...prev, ""]);
  };

  const deleteEvent = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      upcomingEvents: prev.upcomingEvents.filter((_, i) => i !== index),
    }));
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.upperTag?.trim()) errs.push("Calendar tag label is required");
    if (!formData.heading?.trim()) errs.push("Heading is required");
    if (!formData.description?.trim())
      errs.push("Calendar description copy is required");

    formData.upcomingEvents.forEach((ev, index) => {
      if (!ev.title?.trim()) errs.push(`Event ${index + 1} Title is required`);
      if (!ev.date?.trim())
        errs.push(`Event ${index + 1} Date label is required`);
      if (!ev.time?.trim())
        errs.push(`Event ${index + 1} Time label is required`);
      if (!ev.description?.trim())
        errs.push(`Event ${index + 1} Description is required`);
      if (!ev.pricing?.trim())
        errs.push(`Event ${index + 1} Pricing detail is required`);
      if (!ev.highlight?.trim())
        errs.push(`Event ${index + 1} Glass highlight is required`);
      if (!ev.contactInfo?.trim())
        errs.push(`Event ${index + 1} Contact detail is required`);
      if (!ev.category?.trim())
        errs.push(`Event ${index + 1} Category tag is required`);
      if (!selectedImages[index])
        errs.push(`Event ${index + 1} Cover Photo is required`);
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Upcoming Calendar events...");
    try {
      const updatedEvents = [...formData.upcomingEvents];

      // Upload images sequentially
      for (let i = 0; i < updatedEvents.length; i++) {
        const item = selectedImages[i];
        if (item instanceof File) {
          const oldUrl = formData.upcomingEvents[i]?.image;
          const urls = await uploadFiles([item], oldUrl ? [oldUrl] : []);
          updatedEvents[i].image = urls[0] || "";
        } else {
          updatedEvents[i].image = item || "";
        }
      }

      const payload = {
        ...formData,
        upcomingEvents: updatedEvents,
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
        toast.success("Calendar Events saved successfully!", { id: toastId });
        setFormData(payload);
        setSelectedImages(payload.upcomingEvents.map((e) => e.image));
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
          title="Upcoming Calendar Section"
          description="Edit global schedule headers and fully customize details across all active upcoming events."
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
              {/* Section Header Copy */}
              <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  Section Headers
                </h4>

                <InputField
                  label="Eyebrow Subtitle"
                  name="upperTag"
                  value={formData.upperTag}
                  onChange={handleChange}
                  placeholder="e.g. Seven Stars Calendar"
                  required
                />

                <InputField
                  label="Heading Title"
                  name="heading"
                  value={formData.heading}
                  onChange={handleChange}
                  placeholder="e.g. Upcoming & Past Occasions"
                  required
                />

                <TextAreaField
                  label="Description Tagline"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g. Experience the vibrant tapestry..."
                  rows={2}
                  required
                />
              </div>

              {/* Dynamic Upcoming Cards */}
              <div className="grid grid-cols-1 gap-8">
                {formData.upcomingEvents.map((ev, idx) => {
                  const preview =
                    selectedImages[idx] instanceof File
                      ? URL.createObjectURL(selectedImages[idx] as File)
                      : (selectedImages[idx] as string);
                  const name =
                    typeof selectedImages[idx] === "string"
                      ? (selectedImages[idx] as string).split("/").pop() ||
                        `Event ${idx + 1} Image`
                      : (selectedImages[idx] as File)?.name;

                  return (
                    <div
                      key={idx}
                      className="flex flex-col gap-6 p-6 bg-white border border-gray-200/80 rounded-3xl relative hover:border-gray-300 transition-all text-left"
                    >
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-1 cursor-pointer" onClick={() => toggleCardCollapse(idx)}>
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2">
                          <Award className="w-3.5 h-3.5 text-blue-500" />
                          Upcoming Event Card #{idx + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${collapsedCards[idx] ? 'rotate-180' : ''}`} />
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); deleteEvent(idx); }}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-red-100 flex items-center gap-1 transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete Event
                          </button>
                        </div>
                      </div>

                      <div className={`grid transition-all duration-300 ${collapsedCards[idx] ? 'grid-rows-[0fr] opacity-0 overflow-hidden' : 'grid-rows-[1fr] opacity-100'}`}>
                        <div className="overflow-hidden flex flex-col gap-6">
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
                                    alt={`Event ${idx + 1}`}
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
                                      fileInputRefs.current[idx]?.click()
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
                                onClick={() => fileInputRefs.current[idx]?.click()}
                                className="border-2 border-dashed border-gray-200 hover:border-blue-500 bg-white hover:bg-blue-50/5 rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all"
                              >
                                <CloudUpload className="w-6 h-6 text-gray-400 mb-1" />
                                <p className="text-[10px] text-gray-500 font-bold">
                                  Upload cover
                                </p>
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

                          <div className="grid grid-cols-2 gap-4">
                            <InputField
                              label="Event Title"
                              value={ev.title}
                              onChange={(e) =>
                                handleEventFieldChange(idx, "title", e.target.value)
                              }
                              placeholder="e.g. Mother's Day Lunch"
                              required
                            />
                            <InputField
                              label="Category Tag"
                              value={ev.category}
                              onChange={(e) =>
                                handleEventFieldChange(
                                  idx,
                                  "category",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. Special Occasion"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <InputField
                              label="Schedule Date"
                              value={ev.date}
                              onChange={(e) =>
                                handleEventFieldChange(idx, "date", e.target.value)
                              }
                              placeholder="e.g. March 30th"
                              required
                            />
                            <InputField
                              label="Schedule Time"
                              value={ev.time}
                              onChange={(e) =>
                                handleEventFieldChange(idx, "time", e.target.value)
                              }
                              placeholder="e.g. Set Luncheon"
                              required
                            />
                          </div>

                          <TextAreaField
                            label="Description Summary"
                            value={ev.description}
                            onChange={(e) =>
                              handleEventFieldChange(
                                idx,
                                "description",
                                e.target.value,
                              )
                            }
                            placeholder="Treat Mum to a special day out..."
                            rows={3}
                            required
                          />

                          <InputField
                            label="Pricing Detail"
                            value={ev.pricing}
                            onChange={(e) =>
                              handleEventFieldChange(idx, "pricing", e.target.value)
                            }
                            placeholder="e.g. ADULTS £28.95 / CHILDREN £17.95"
                            required
                          />

                          <InputField
                            label="Glass Highlight Tag"
                            value={ev.highlight}
                            onChange={(e) =>
                              handleEventFieldChange(
                                idx,
                                "highlight",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. GLASS OF PROSECCO FOR MOMS"
                            required
                          />

                          <InputField
                            label="Reservation Contact Info"
                            value={ev.contactInfo}
                            onChange={(e) =>
                              handleEventFieldChange(
                                idx,
                                "contactInfo",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. 01865 343337 | info@..."
                            required
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Event Action */}
              <div className="flex justify-start pt-2">
                <button
                  type="button"
                  onClick={addEvent}
                  className="bg-white hover:bg-gray-50 text-blue-600 px-4 py-2.5 rounded-xl text-xs font-bold border border-blue-200 shadow-sm flex items-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add New Event
                </button>
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
