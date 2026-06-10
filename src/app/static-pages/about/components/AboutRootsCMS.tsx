"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import {
  CloudUpload,
  Trash2,
  Sparkles,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

const defaultFormData = {
  rootsTag: "",
  rootsHeading: "",
  rootsHeadingItalic: "",
  rootsDesc1: "",
  rootsDesc2: "",
  rootsImage: "",
  rootsImages: [] as string[],
  rootsQuote: "",
  pillar1: "",
  pillar2: "",
  pillar3: "",
};

interface AboutRootsCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AboutRootsCMS({
  sectionId,
  initialData,
  saveUrl = "/api/about",
  responseKey = "AboutRoots",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: AboutRootsCMSProps) {
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
  const [rootsImages, setRootsImages] = useState<(File | string)[]>([""]);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (initialData) {
      const data = { ...defaultFormData, ...initialData };
      setFormData(data);
      if (Array.isArray(data.rootsImages) && data.rootsImages.length > 0) {
        setRootsImages(data.rootsImages);
      } else if (data.rootsImage) {
        setRootsImages([data.rootsImage]);
      } else {
        setRootsImages([""]);
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
            if (Array.isArray(data.rootsImages) && data.rootsImages.length > 0) {
              setRootsImages(data.rootsImages);
            } else if (data.rootsImage) {
              setRootsImages([data.rootsImage]);
            } else {
              setRootsImages([""]);
            }
          } else {
            setRootsImages([""]);
          }
        })
        .catch((err) => {
          console.error(err);
          setRootsImages([""]);
        });
    }
  }, [initialData, saveUrl, responseKey]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.rootsTag?.trim()) errs.push("Tag label is required");
    if (!formData.rootsHeading?.trim()) errs.push("Heading is required");
    if (!formData.rootsHeadingItalic?.trim())
      errs.push("Italic Heading Part is required");
    if (!formData.rootsDesc1?.trim())
      errs.push("Description Paragraph 1 is required");
    if (!formData.pillar1?.trim())
      errs.push("Pillar 1 label is required");
    if (!formData.pillar2?.trim())
      errs.push("Pillar 2 label is required");
    if (!formData.pillar3?.trim())
      errs.push("Pillar 3 label is required");
    const validImages = rootsImages.filter((img) => img !== "");
    if (validImages.length === 0) errs.push("At least one Roots photo is required");

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving About Roots section...");
    try {
      const uploadedUrls = await uploadFiles(validImages);
      const finalImages = validImages.map((img, idx) => {
        return img instanceof File ? uploadedUrls[idx] || "" : img;
      });

      const payload = {
        ...formData,
        rootsImage: finalImages[0] || "",
        rootsImages: finalImages,
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
        toast.success("About Roots saved successfully!", { id: toastId });
        setFormData(payload);
        setRootsImages(finalImages.length > 0 ? finalImages : [""]);
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
          title="About Roots & History Section"
          description="Manage community-owned history paragraphs, headers, and local spirit highlight photos."
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
                <InputField
                  label="Section Tag Label"
                  name="rootsTag"
                  value={formData.rootsTag}
                  onChange={handleChange}
                  placeholder="e.g. Our Roots"
                  required
                  containerClassName="w-full"
                />

                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <InputField
                    label="Heading Regular Part"
                    name="rootsHeading"
                    value={formData.rootsHeading}
                    onChange={handleChange}
                    placeholder="e.g. More than a pub, it belongs to its"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Heading Italic Highlight"
                    name="rootsHeadingItalic"
                    value={formData.rootsHeadingItalic}
                    onChange={handleChange}
                    placeholder="e.g. community."
                    required
                    containerClassName="flex-1"
                  />
                </div>

                <TextAreaField
                  label="Roots History Paragraph 1"
                  name="rootsDesc1"
                  value={formData.rootsDesc1}
                  onChange={handleChange}
                  placeholder="The first paragraph detailing the story..."
                  containerClassName="w-full"
                  rows={3}
                  required
                />

                <TextAreaField
                  label="Roots History Paragraph 2 (Optional)"
                  name="rootsDesc2"
                  value={formData.rootsDesc2}
                  onChange={handleChange}
                  placeholder="The second paragraph detailing the story..."
                  containerClassName="w-full"
                  rows={3}
                />

                <div className="flex flex-col md:flex-row gap-6 w-full border-t border-gray-100 pt-6 mt-2">
                  <InputField
                    label="Pillar 1 (e.g. Community)"
                    name="pillar1"
                    value={formData.pillar1}
                    onChange={handleChange}
                    placeholder="e.g. Community"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Pillar 2 (e.g. Passion)"
                    name="pillar2"
                    value={formData.pillar2}
                    onChange={handleChange}
                    placeholder="e.g. Passion"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Pillar 3 (e.g. Quality)"
                    name="pillar3"
                    value={formData.pillar3}
                    onChange={handleChange}
                    placeholder="e.g. Quality"
                    required
                    containerClassName="flex-1"
                  />
                </div>
              </div>
              {/* Carousel Images and Caption Quote */}
              <div className="grid grid-cols-1 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                {/* Carousel Images Collection */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Carousel Images ({rootsImages.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setRootsImages((prev) => [...prev, ""])}
                      className="text-xs text-[#475DB1] hover:text-[#475DB1]/80 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Photo
                    </button>
                  </div>

                  <div className="flex flex-col gap-4 mt-1 w-full">
                    {rootsImages.map((img, idx) => {
                      const preview =
                        img instanceof File
                          ? URL.createObjectURL(img)
                          : img;
                      const name =
                        typeof img === "string"
                          ? img.split("/").pop() || `Photo ${idx + 1}`
                          : img?.name || `Photo ${idx + 1}`;
                      return (
                        <div key={idx} className="w-full">
                          {preview ? (
                            <div className="flex items-center justify-between p-3.5 px-5 bg-white border border-gray-200 rounded-2xl transition-all hover:bg-gray-50/50">
                              <div className="flex items-center gap-3.5 text-gray-700 overflow-hidden">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={preview}
                                    alt={`Roots Preview ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                  <span className="text-xs font-bold text-gray-900 truncate max-w-[120px] sm:max-w-xs md:max-w-md">
                                    {name}
                                  </span>
                                  <span className="text-[9px] text-gray-400 font-semibold mt-0.5">
                                    Showcase Image
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => fileInputRefs.current[idx]?.click()}
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                                >
                                  Change
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRootsImages((prev) => {
                                      const updated = prev.filter((_, i) => i !== idx);
                                      return updated.length > 0 ? updated : [""];
                                    });
                                  }}
                                  className="text-red-500 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
                                  title="Delete Photo"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => fileInputRefs.current[idx]?.click()}
                              className="w-full border-2 border-dashed border-gray-200 hover:border-blue-500 bg-white hover:bg-blue-50/10 rounded-xl flex flex-col items-center justify-center h-[120px] p-6 text-center cursor-pointer transition-all group"
                            >
                              <CloudUpload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
                              <p className="text-xs text-gray-500 font-semibold group-hover:text-blue-600">
                                Drag and drop image here, or{" "}
                                <span className="text-blue-500 hover:underline">
                                  browse
                                </span>
                              </p>
                              <p className="text-[10px] text-gray-400 mt-1">
                                PNG, JPG or WEBP (Carousel Photo {idx + 1})
                              </p>
                            </div>
                          )}
                          <input
                            type="file"
                            ref={(el) => {
                              fileInputRefs.current[idx] = el;
                            }}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                setRootsImages((prev) => {
                                  const updated = [...prev];
                                  updated[idx] = file;
                                  return updated;
                                });
                              }
                            }}
                            accept="image/*"
                            className="hidden"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block border-b border-gray-100 pb-2">
                    Showcase Overlay Quote Caption (Optional)
                  </span>
                  <InputField
                    label="Image Caption Quote (Optional)"
                    name="rootsQuote"
                    value={formData.rootsQuote}
                    onChange={handleChange}
                    placeholder="e.g. Keeping something genuinely valuable alive."
                  />
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
