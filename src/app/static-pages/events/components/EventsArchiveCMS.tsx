"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { CloudUpload, Trash2, Plus, Sparkles, FolderHeart } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";

interface ArchiveItem {
  src: string;
  name: string;
}

const defaultFormData = {
  title: "Historic Archive",
  subtitle: "Moments From Our Vault",
  description: "Hover over any archived photograph below to reveal the signature occasion name.",
  oldEvents: [
    {
      src: "/images/481171001_957353706531406_1040071741557670337_nlow.png",
      name: "Mother's Day Classic Luncheon",
    },
    {
      src: "/images/481171001_957353706531406_1040071741557670337_nlow.webp",
      name: "Mother's Day Reserve Banquet",
    },
    {
      src: "/images/481171001_957353706531406_1040071741557670337_nlow (1).webp",
      name: "Mother's Day Set Luncheon",
    },
    {
      src: "/images/481983309_18036627329600436_7680148243878380970_nlow.webp",
      name: "Indian Heritage Tasting Gathering",
    },
    {
      src: "/images/481171001_957353706531406_1040071741557670337_nlow.png",
      name: "Spring Classic Gathering",
    },
    {
      src: "/images/481983309_18036627329600436_7680148243878380970_nlow.webp",
      name: "Heritage Spices Showcase Banquet",
    },
  ] as ArchiveItem[],
};

interface EventsArchiveCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function EventsArchiveCMS({
  sectionId,
  initialData,
  saveUrl = "/api/events",
  responseKey = "EventsArchive",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: EventsArchiveCMSProps) {
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

  // Keep track of pending files to upload
  const [fileList, setFileList] = useState<(File | null)[]>([]);

  useEffect(() => {
    if (initialData) {
      const data = { ...defaultFormData, ...initialData };
      setFormData(data);
      if (data.oldEvents) {
        setFileList(new Array(data.oldEvents.length).fill(null));
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
            if (data.oldEvents) {
              setFileList(new Array(data.oldEvents.length).fill(null));
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

  const handleItemNameChange = (idx: number, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.oldEvents];
      updated[idx] = { ...updated[idx], name: val };
      return { ...prev, oldEvents: updated };
    });
  };

  const handleFileChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileList((prev) => {
        const updated = [...prev];
        updated[idx] = file;
        return updated;
      });
    }
  };

  const addArchiveCard = () => {
    setFormData((prev) => ({
      ...prev,
      oldEvents: [...prev.oldEvents, { src: "", name: "" }],
    }));
    setFileList((prev) => [...prev, null]);
  };

  const deleteArchiveCard = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      oldEvents: prev.oldEvents.filter((_, i) => i !== idx),
    }));
    setFileList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.title?.trim()) errs.push("Archive Heading Title is required");
    if (!formData.subtitle?.trim()) errs.push("Archive Subtitle is required");
    if (!formData.description?.trim()) errs.push("Archive Description is required");

    formData.oldEvents.forEach((ev, idx) => {
      if (!ev.name?.trim()) errs.push(`Archive item ${idx + 1} Name caption is required`);
      if (!ev.src && !fileList[idx]) errs.push(`Archive item ${idx + 1} Image is required`);
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Past Archive Vault details...");
    try {
      const updatedEvents = [...formData.oldEvents];

      for (let i = 0; i < updatedEvents.length; i++) {
        const pendingFile = fileList[i];
        if (pendingFile) {
          const urls = await uploadFiles([pendingFile]);
          updatedEvents[i].src = urls[0] || "";
        }
      }

      const payload = {
        ...formData,
        oldEvents: updatedEvents,
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
        toast.success("Past Archive Vault saved successfully!", { id: toastId });
        setFormData(payload);
        setFileList(new Array(payload.oldEvents.length).fill(null));
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
          title="Past Events Archive Section"
          description="Manage continuous vault marquee items, dynamic uploaders, and archive labels."
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
              
              {/* Titles block */}
              <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <FolderHeart className="w-3.5 h-3.5 text-blue-500" />
                  Archive Page Info
                </h4>

                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <InputField
                    label="Archive Tag / Eyebrow"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Historic Archive"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Archive Main Heading"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    placeholder="e.g. Moments From Our Vault"
                    required
                    containerClassName="flex-1"
                  />
                </div>

                <InputField
                  label="Archive Subtext Caption"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g. Hover over any archived photograph below to reveal..."
                  required
                />
              </div>

              {/* Dynamic Vault Cards List */}
              <div className="flex flex-col gap-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Continuous Marquee Slide Photos ({formData.oldEvents.length})
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formData.oldEvents.map((item, idx) => {
                    const preview = fileList[idx]
                      ? URL.createObjectURL(fileList[idx] as File)
                      : item.src;
                    const filename = fileList[idx]
                      ? fileList[idx]?.name
                      : item.src.split("/").pop() || "Archived Cover";

                    return (
                      <div
                        key={idx}
                        className="flex flex-col gap-4 p-5 bg-white border border-gray-200 rounded-3xl relative transition-all hover:shadow-sm"
                      >
                        <button
                          type="button"
                          onClick={() => deleteArchiveCard(idx)}
                          className="absolute top-4 right-4 text-red-500 hover:text-red-600 p-1.5 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer z-10"
                          title="Delete card"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Image Preview Block */}
                        <div className="flex flex-col gap-1 text-left">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Archive Image
                          </label>
                          {preview ? (
                            <div className="flex items-center gap-3.5 p-3 bg-gray-50/50 border border-gray-200 rounded-2xl relative">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 relative shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={preview}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-[10px] font-bold text-gray-900 truncate max-w-[120px]">
                                {filename}
                              </span>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-gray-200 hover:border-blue-500 bg-white rounded-2xl p-4 text-center cursor-pointer">
                              <p className="text-[10px] text-gray-400 font-bold">Select Cover</p>
                            </div>
                          )}
                          <input
                            type="file"
                            onChange={(e) => handleFileChange(idx, e)}
                            accept="image/*"
                            className="text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 mt-2"
                          />
                        </div>

                        <InputField
                          label="Archived Occasion Name"
                          value={item.name}
                          onChange={(e) => handleItemNameChange(idx, e.target.value)}
                          placeholder="e.g. Mother's Day Luncheon"
                          required
                        />
                      </div>
                    );
                  })}

                  {/* Add New Archive Card */}
                  <div
                    onClick={addArchiveCard}
                    className="border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50/5 rounded-3xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all group min-h-[220px]"
                  >
                    <Plus className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
                    <p className="text-xs text-gray-500 font-semibold group-hover:text-blue-600">
                      Add New Vault Card
                    </p>
                  </div>
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
