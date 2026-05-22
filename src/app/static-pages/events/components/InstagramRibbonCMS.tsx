"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Trash2, Plus, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";

interface ArchiveItem {
  src: string;
  name: string;
  postUrl: string;
}

const defaultFormData = {
  title: "",
  subtitle: "",
  oldEvents: [] as ArchiveItem[],
};

interface InstagramRibbonCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function InstagramRibbonCMS({
  sectionId,
  initialData,
  saveUrl = "/api/events",
  responseKey = "EventsArchive",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: InstagramRibbonCMSProps) {
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

  const handleItemPostUrlChange = (idx: number, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.oldEvents];
      updated[idx] = { ...updated[idx], postUrl: val };
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
      oldEvents: [...prev.oldEvents, { src: "", name: "", postUrl: "" }],
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
    if (!formData.title?.trim()) errs.push("Instagram Heading Title is required");
    if (!formData.subtitle?.trim()) errs.push("Instagram Subtitle is required");

    formData.oldEvents.forEach((ev, idx) => {
      if (!ev.name?.trim()) errs.push(`Instagram item ${idx + 1} Name caption is required`);
      if (!ev.src && !fileList[idx]) errs.push(`Instagram item ${idx + 1} Image is required`);
      if (!ev.postUrl?.trim()) errs.push(`Instagram item ${idx + 1} Post URL is required`);
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Instagram Ribbon details...");
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
        toast.success("Instagram Ribbon saved successfully!", { id: toastId });
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
          title="Instagram Ribbon Section"
          description="Manage continuous Instagram marquee items, dynamic uploaders, and post links."
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
        />

        <div
          className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-8 pt-6 animate-in fade-in duration-500 text-left font-sans">

              {/* Header Title block */}
              <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Instagram Header Options
                </h4>

                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <InputField
                    label="Instagram Ribbon Title / Eyebrow"
                    name="title"
                    value={formData.title || ""}
                    onChange={handleChange}
                    placeholder="e.g. Follow Us On Instagram"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Instagram Profile Link"
                    name="subtitle"
                    value={formData.subtitle || ""}
                    onChange={handleChange}
                    placeholder="e.g. https://www.instagram.com/sevenstarsatmarshbaldon/"
                    required
                    containerClassName="flex-1"
                  />
                </div>
              </div>

              {/* Dynamic Vault Cards List */}
              <div className="flex flex-col gap-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Instagram Marquee Ribbon Photos ({formData.oldEvents.length})
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
                            Instagram Image
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
                          label="Instagram Post Caption"
                          value={item.name}
                          onChange={(e) => handleItemNameChange(idx, e.target.value)}
                          placeholder="e.g. Signature cocktails, hand-shaken..."
                          required
                        />

                        <InputField
                          label="Instagram Post URL"
                          value={item.postUrl || ""}
                          onChange={(e) => handleItemPostUrlChange(idx, e.target.value)}
                          placeholder="e.g. https://www.instagram.com/p/..."
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
                      Add New Instagram Post Card
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
