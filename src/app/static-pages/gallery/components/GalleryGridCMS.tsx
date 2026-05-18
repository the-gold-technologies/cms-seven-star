"use client";

import { useState, useEffect, useRef } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Sparkles, Plus, Trash2, CloudUpload } from "lucide-react";
import toast from "react-hot-toast";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { uploadFiles } from "@/lib/uploadHelpers";

interface GalleryItem {
  id: number;
  src: File | string;
  category: string;
  aspect: string;
}

const defaultFormData = {
  galleryItems: [] as GalleryItem[],
};

interface GalleryGridCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

const CATEGORIES = ["Indoor", "Outdoor", "Food"];
const ASPECTS = [
  { label: "Square (1:1)", value: "aspect-square" },
  { label: "Standard (4:3)", value: "aspect-[4/3]" },
  { label: "Portrait (3:4)", value: "aspect-[3/4]" },
  { label: "Tall (4:5)", value: "aspect-[4/5]" },
  { label: "Wide (16:9)", value: "aspect-[16/9]" },
];

export function GalleryGridCMS({
  sectionId,
  initialData,
  saveUrl = "/api/gallery",
  responseKey = "GalleryGrid",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: GalleryGridCMSProps) {
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
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [adminFilter, setAdminFilter] = useState("All");

  const bulkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      const items = (initialData.galleryItems || []) as GalleryItem[];
      setGalleryItems(items);
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey ? json.data?.[responseKey] : json.data;
          if (json.success && sectionData) {
            const items = (sectionData.galleryItems || []) as GalleryItem[];
            setGalleryItems(items);
          }
        })
        .catch(console.error);
    }
  }, [initialData, saveUrl, responseKey]);

  const triggerBulkUpload = () => {
    bulkInputRef.current?.click();
  };

  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newItems = newFiles.map((file, idx) => ({
        id: Date.now() + idx,
        src: file,
        category: adminFilter === "All" ? "Indoor" : adminFilter,
        aspect: "aspect-[4/3]",
      }));

      setGalleryItems((prev) => [...newItems, ...prev]);
      toast.success(`${newFiles.length} photos prepended to the gallery grid!`);
    }
  };

  const removeGalleryItem = (id: number) => {
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCardFieldChange = (id: number, field: keyof GalleryItem, value: any) => {
    setGalleryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const triggerSingleFileChange = (id: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: any) => {
      if (e.target?.files?.[0]) {
        handleCardFieldChange(id, "src", e.target.files[0]);
      }
    };
    input.click();
  };

  const handleSave = async () => {
    if (galleryItems.length === 0) {
      toast.error("Please upload at least one image to save.");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Gallery Grid...");
    try {
      // 1. Identify which items need uploads (are Files)
      const filesToUpload: { index: number; file: File }[] = [];
      galleryItems.forEach((item, idx) => {
        if (item.src instanceof File) {
          filesToUpload.push({ index: idx, file: item.src });
        }
      });

      let uploadedUrls: (string | null)[] = [];
      if (filesToUpload.length > 0) {
        uploadedUrls = await uploadFiles(filesToUpload.map((f) => f.file));
      }

      // 2. Map back URL lists to items
      let uploadPointer = 0;
      const finalItems = galleryItems.map((item, idx) => {
        if (item.src instanceof File) {
          const url = uploadedUrls[uploadPointer] || "";
          uploadPointer++;
          return { ...item, src: url };
        }
        return item;
      });

      const payload = {
        galleryItems: finalItems,
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
        toast.success("Gallery Grid saved successfully!", { id: toastId });
        setGalleryItems(finalItems);
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

  // Filter items in admin panel for easy management
  const displayedItems = galleryItems.filter((item) => {
    if (adminFilter === "All") return true;
    return item.category === adminFilter;
  });

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Gallery Grid & Categories"
          description="Drag & drop, upload, categorize, select aspect ratios, and delete grid photos dynamically. Brand new uploads are prepended automatically."
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
              
              {/* Uploader Box */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    Manage Gallery Items ({galleryItems.length} photos)
                  </span>
                  <span className="text-[11px] text-gray-400 font-semibold mt-0.5">
                    Select a category tab to view and manage photos of that category.
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={triggerBulkUpload}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Upload & Prepend Photos
                  </button>
                  <input
                    type="file"
                    ref={bulkInputRef}
                    onChange={handleBulkFileChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                </div>
              </div>

              {/* Categorization filter for CMS admin */}
              <div className="flex gap-2.5 border-b border-gray-100 pb-4">
                {["All", ...CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setAdminFilter(cat)}
                    className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-wider font-bold transition-all ${
                      adminFilter === cat
                        ? "bg-gray-900 text-white shadow-sm"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {cat} ({cat === "All" ? galleryItems.length : galleryItems.filter(i => i.category === cat).length})
                  </button>
                ))}
              </div>

              {/* Grid cards */}
              {displayedItems.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center">
                  <CloudUpload className="w-10 h-10 text-gray-300 mb-2" />
                  <p className="text-xs text-gray-400 font-bold">No photos found in category: {adminFilter}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Upload some images to start populate.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {displayedItems.map((item) => {
                    const preview = item.src instanceof File ? URL.createObjectURL(item.src) : item.src;
                    const filename = typeof item.src === "string" ? item.src.split("/").pop() || "Gallery Image" : item.src.name;

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
                      >
                        {/* Image Preview Container */}
                        <div className="w-full aspect-[4/3] bg-gray-50 relative group border-b border-gray-100 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => triggerSingleFileChange(item.id)}
                              className="bg-white/95 hover:bg-white text-gray-800 font-bold px-3 py-1.5 rounded-lg text-[10px] transition-all cursor-pointer shadow-sm active:scale-95"
                            >
                              Replace Image
                            </button>
                          </div>
                        </div>

                        {/* Card Options */}
                        <div className="p-4 flex flex-col gap-3.5 text-left">
                          <span className="text-[9px] font-mono text-gray-400 truncate block" title={filename}>
                            {filename}
                          </span>

                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                              Category Allocation
                            </label>
                            <select
                              value={item.category}
                              onChange={(e) => handleCardFieldChange(item.id, "category", e.target.value)}
                              className="bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                            >
                              {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                              Aspect Ratio Display
                            </label>
                            <select
                              value={item.aspect}
                              onChange={(e) => handleCardFieldChange(item.id, "aspect", e.target.value)}
                              className="bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                            >
                              {ASPECTS.map((asp) => (
                                <option key={asp.value} value={asp.value}>
                                  {asp.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Delete Card */}
                          <div className="pt-2.5 border-t border-gray-100 flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeGalleryItem(item.id)}
                              className="text-red-500 hover:text-red-600 flex items-center gap-1 text-[10px] font-bold bg-red-50 px-2.5 py-1.5 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete Photo
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
