"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import {
  Plus,
  Trash2,
  CloudUpload,
  Settings,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { uploadFiles } from "@/lib/uploadHelpers";

interface MenuSection {
  id: string;
  title: string;
  pdf: string;
  pages?: any[];
}

const defaultFormData = {
  menuSections: [] as MenuSection[],
  menuPdfs: [] as string[],
  sectionNumber: "",
  tagline: "",
  headingPart1: "",
  headingItalicHighlight: "",
  description: "",
  locationName: "",
  locationCounty: "",
  ctaText: "",
  ctaLink: "",
};

interface MenuBookCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function MenuBookCMS({
  sectionId,
  initialData,
  saveUrl = "/api/menu",
  responseKey = "MenuBook",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: MenuBookCMSProps) {
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
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);

  useEffect(() => {
    const processData = (rawData: any) => {
      const data = { ...defaultFormData, ...rawData };
      if (Array.isArray(data.menuSections)) {
        data.menuSections = data.menuSections.map((sec: any, i: number) => ({
          ...sec,
          pdf: sec.pdf || (Array.isArray(data.menuPdfs) ? data.menuPdfs[i] || "" : ""),
          pages: Array.isArray(sec.pages) && sec.pages.length > 0 ? sec.pages : [{}],
        }));
      }
      return data;
    };

    if (initialData) {
      setFormData(processData(initialData));
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey
            ? json.data?.[responseKey]
            : json.data;
          if (json.success && sectionData) {
            setFormData(processData(sectionData));
          }
        })
        .catch(console.error);
    }
  }, [initialData, saveUrl, responseKey]);

  const handleUploadCategoryPdf = async (
    e: React.ChangeEvent<HTMLInputElement>,
    secIdx: number,
  ) => {
    const inputElement = e.target;
    if (inputElement.files && inputElement.files[0]) {
      const file = inputElement.files[0];
      const toastId = toast.loading(`Uploading ${file.name}...`);
      try {
        const urls = await uploadFiles([file]);
        const uploadedUrl = urls[0];
        if (uploadedUrl) {
          setFormData((prev) => {
            const updated = [...prev.menuSections];
            updated[secIdx] = {
              ...updated[secIdx],
              pdf: uploadedUrl,
            };
            return { ...prev, menuSections: updated };
          });
          toast.success(`PDF uploaded for category!`, { id: toastId });
        }
      } catch (err) {
        console.error(err);
        toast.error("Upload failed.", { id: toastId });
      } finally {
        inputElement.value = "";
      }
    }
  };

  const addSection = () => {
    const title = prompt(
      "Enter the name of your new Menu Category (e.g. Kids Menu, Christmas Menu):",
    );
    if (!title || !title.trim()) return;

    const id = title.toLowerCase().replace(/[^a-z0-9]/g, "-");
    if (formData.menuSections.some((s) => s.id === id)) {
      toast.error("A category with this title already exists!");
      return;
    }

    const newSection: MenuSection = {
      id,
      title: title.trim(),
      pdf: "",
      pages: [{}],
    };

    setFormData((prev) => ({
      ...prev,
      menuSections: [...prev.menuSections, newSection],
    }));
    setActiveSectionIdx(formData.menuSections.length);
    toast.success(`Category "${title}" added successfully!`);
  };

  const deleteSection = (index: number) => {
    if (formData.menuSections.length <= 1) {
      toast.error("You must have at least one menu category!");
      return;
    }
    const sec = formData.menuSections[index];
    if (
      !confirm(
        `Are you sure you want to delete the entire "${sec.title}" category?`,
      )
    ) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      menuSections: prev.menuSections.filter((_, i) => i !== index),
    }));
    setActiveSectionIdx(0);
    toast.success(`Category "${sec.title}" deleted.`);
  };

  const handleSave = async () => {
    const errs: string[] = [];
    formData.menuSections.forEach((s) => {
      if (!s.title?.trim()) errs.push(`Category Title is required`);
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving 3D Menu Book...");
    try {
      const payload = {
        ...formData,
        menuPdfs: formData.menuSections
          .map((s) => s.pdf)
          .filter((url) => Boolean(url) && url !== "#"),
        menuSections: formData.menuSections.map((s) => ({
          ...s,
          pdf: s.pdf || "",
          pages: s.pages || [{}],
        })),
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
        toast.success("3D Menu Book saved successfully!", { id: toastId });
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

  const activeSection = formData.menuSections[activeSectionIdx];

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="3D Menu Book Sheets Editor"
          description="Manage 3D book categories and category-specific PDF menu files for display & download."
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
              {/* Global Configuration */}
              <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Settings className="w-3.5 h-3.5 text-blue-500" />
                  Header & Global Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <InputField
                    label="Section Number"
                    value={formData.sectionNumber || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sectionNumber: e.target.value,
                      })
                    }
                    placeholder="e.g. 05"
                  />
                  <InputField
                    label="Tagline"
                    value={formData.tagline || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, tagline: e.target.value })
                    }
                    placeholder="e.g. Seasonal Selection"
                  />
                  <InputField
                    label="Heading (Part 1)"
                    value={formData.headingPart1 || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, headingPart1: e.target.value })
                    }
                    placeholder="e.g. Our"
                  />
                  <InputField
                    label="Heading (Italic Highlight)"
                    value={formData.headingItalicHighlight || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        headingItalicHighlight: e.target.value,
                      })
                    }
                    placeholder="e.g. Menu"
                  />
                  <InputField
                    label="Location Name"
                    value={formData.locationName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, locationName: e.target.value })
                    }
                    placeholder="e.g. Marsh Baldon"
                  />
                  <InputField
                    label="Location County"
                    value={formData.locationCounty || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        locationCounty: e.target.value,
                      })
                    }
                    placeholder="e.g. Oxfordshire"
                  />
                  <InputField
                    label="CTA Button Text"
                    value={formData.ctaText || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, ctaText: e.target.value })
                    }
                    placeholder="e.g. Enquire For Private Dining"
                  />
                  <InputField
                    label="CTA Button Link"
                    value={formData.ctaLink || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, ctaLink: e.target.value })
                    }
                    placeholder="e.g. /contact"
                  />
                  <div className="md:col-span-2 lg:col-span-4">
                    <InputField
                      label="Description"
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="e.g. At The Seven Stars..."
                    />
                  </div>
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <div className="flex items-center flex-wrap gap-2">
                  <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-1 flex-wrap">
                    {formData.menuSections.map((sec, i) => (
                      <button
                        key={sec.id || i}
                        type="button"
                        onClick={() => setActiveSectionIdx(i)}
                        className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          activeSectionIdx === i
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        {sec.title}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addSection}
                    className="flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Category
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={formData.menuSections.length <= 1}
                    onClick={() => deleteSection(activeSectionIdx)}
                    className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 disabled:opacity-40 disabled:hover:bg-red-50 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Active Category
                  </button>
                </div>
              </div>

              {/* Title & PDF Editor for Active Category */}
              {activeSection && (
                <div className="flex flex-col gap-6 bg-slate-50/70 p-6 border border-slate-200/60 rounded-2xl w-full">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex flex-col gap-1 flex-1 w-full">
                      <span className="text-xs font-bold text-gray-700">
                        Category Title
                      </span>
                      <input
                        type="text"
                        value={activeSection.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => {
                            const updated = [...prev.menuSections];
                            updated[activeSectionIdx] = {
                              ...updated[activeSectionIdx],
                              title: val,
                            };
                            return { ...prev, menuSections: updated };
                          });
                        }}
                        placeholder="e.g. Main Menu"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-700 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1 w-full">
                      <span className="text-xs font-bold text-gray-700">
                        Category Menu PDF / Image (Displayed on Sheet & Downloadable)
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={activeSection.pdf || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => {
                              const updated = [...prev.menuSections];
                              updated[activeSectionIdx] = {
                                ...updated[activeSectionIdx],
                                pdf: val,
                              };
                              return { ...prev, menuSections: updated };
                            });
                          }}
                          placeholder="Upload PDF or enter URL..."
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-700 focus:outline-none"
                        />
                        <input
                          type="file"
                          accept="application/pdf,image/*"
                          onChange={(e) =>
                            handleUploadCategoryPdf(e, activeSectionIdx)
                          }
                          className="hidden"
                          id={`category-pdf-upload-${activeSectionIdx}`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            document
                              .getElementById(
                                `category-pdf-upload-${activeSectionIdx}`,
                              )
                              ?.click()
                          }
                          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer active:scale-95 shadow-2xs"
                        >
                          <CloudUpload className="w-4 h-4" /> Upload PDF / Image
                        </button>
                      </div>
                    </div>
                  </div>

                  {activeSection.pdf && activeSection.pdf !== "#" && (
                    <div className="flex items-center gap-3 bg-white p-3.5 border border-emerald-200/60 rounded-xl text-emerald-800 text-xs">
                      <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium truncate flex-1">
                        Active Menu File: <span className="font-bold">{activeSection.pdf}</span>
                      </span>
                      <a
                        href={activeSection.pdf}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-blue-600 hover:underline shrink-0"
                      >
                        Preview File ↗
                      </a>
                    </div>
                  )}
                </div>
              )}

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
