"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import {
  CloudUpload,
  Trash2,
  Link,
  Image as ImageIcon,
  Plus,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { TextAreaField } from "@/components/TextAreaField";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  sectionNumber: "",
  upperTag: "",
  headingLabel: "",
  headingItalicHighlight: "",
  paragraphs: [] as string[],
  ctaLabel: "",
  ctaUrl: "",
  image: "",
  imageAlt: "",
};

interface AboutUsProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AboutUs({
  sectionId,
  initialData,
  saveUrl = "/api/home",
  responseKey = "AboutUs",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: AboutUsProps) {
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
  const [selectedImage, setSelectedImage] = useState<File | string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      const data = { ...defaultFormData, ...initialData };
      setFormData(data);
      if (data.image) {
        setSelectedImage(data.image);
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
            if (data.image) {
              setSelectedImage(data.image);
            }
          } else {
            setSelectedImage("");
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

  const handleParagraphChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newParas = [...prev.paragraphs];
      newParas[index] = value;
      return { ...prev, paragraphs: newParas };
    });
  };

  const addParagraph = () => {
    setFormData((prev) => ({
      ...prev,
      paragraphs: [...prev.paragraphs, ""],
    }));
  };

  const removeParagraph = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      paragraphs: prev.paragraphs.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.headingLabel?.trim()) errs.push("Heading is required");
    if (!formData.upperTag?.trim()) errs.push("Tag label is required");
    if (formData.paragraphs.some((p) => !p.trim()))
      errs.push("Paragraphs cannot be empty");

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving About section...");
    try {
      let finalImageUrl = formData.image;
      if (selectedImage instanceof File) {
        const uploaded = await uploadFiles([selectedImage]);
        if (uploaded[0]) {
          finalImageUrl = uploaded[0];
        }
      } else if (typeof selectedImage === "string") {
        finalImageUrl = selectedImage;
      }

      const payload = {
        ...formData,
        image: finalImageUrl,
      };

      const body = sectionId
        ? { id: sectionId, content: payload }
        : { section: responseKey ?? "AboutUs", content: payload };

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("About Us section saved successfully!", { id: toastId });
        setSelectedImage(finalImageUrl);
        setFormData(payload);
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

  const previewSrc =
    selectedImage instanceof File
      ? URL.createObjectURL(selectedImage)
      : selectedImage;

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="About Us Section"
          description="Manage the featured pub image, story headings, description paragraphs, and call-to-action link."
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
              <div className="flex flex-col gap-8 w-full">
                {/* 1. Header Copy & Titles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                  <InputField
                    label="Section Order Code"
                    name="sectionNumber"
                    value={formData.sectionNumber || ""}
                    onChange={handleChange}
                    placeholder="e.g. 01"
                    tooltip="The sequence step number printed at the top header (e.g. 01, 02)"
                  />
                  <InputField
                    label="Upper Tag Label"
                    name="upperTag"
                    value={formData.upperTag || ""}
                    onChange={handleChange}
                    placeholder="e.g. Our Story"
                    containerClassName="md:col-span-2"
                    required
                  />
                  <InputField
                    label="Heading Part 1 (Regular)"
                    name="headingLabel"
                    value={formData.headingLabel || ""}
                    onChange={handleChange}
                    placeholder="e.g. Welcome to"
                    required
                  />
                  <InputField
                    label="Heading Part 2 (Italic Highlight)"
                    name="headingItalicHighlight"
                    value={formData.headingItalicHighlight || ""}
                    onChange={handleChange}
                    placeholder="e.g. The Seven Stars"
                    containerClassName="md:col-span-2"
                    required
                  />
                </div>

                {/* 2. Story Paragraphs Editor */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Story Paragraphs
                    </h4>
                    <button
                      type="button"
                      onClick={addParagraph}
                      className="text-xs text-blue-500 hover:text-blue-600 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Paragraph
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {formData.paragraphs.map((para, i) => (
                      <div
                        key={i}
                        className="relative flex flex-col gap-1.5 bg-gray-50/30 border border-gray-50 p-4 rounded-2xl group"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Paragraph {i + 1}
                          </span>
                          {formData.paragraphs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeParagraph(i)}
                              className="text-gray-400 hover:text-red-500 p-1 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete Paragraph"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <TextAreaField
                          name={`paragraph-${i}`}
                          value={para}
                          onChange={(e) =>
                            handleParagraphChange(i, e.target.value)
                          }
                          placeholder={`Type paragraph ${i + 1} content here...`}
                          rows={3}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Featured Image (Hero-Style Line Format) */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-500" />
                    Story Showcase Image
                  </h4>

                  {selectedImage ? (
                    <div className="flex items-center justify-between p-3.5 px-5 bg-gray-50/50 border border-gray-100 rounded-2xl transition-all hover:bg-gray-100/50 mt-1">
                      <div className="flex items-center gap-3.5 text-gray-700">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={previewSrc}
                            alt="About Us"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                            {typeof selectedImage === "string"
                              ? selectedImage.split("/").pop() ||
                                "About Us Image"
                              : selectedImage.name}
                          </span>
                          <span className="text-[9px] text-gray-400 font-semibold mt-0.5">
                            Story Cinematic Background Image
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedImage("")}
                        className="text-red-500 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
                        title="Remove Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-200 hover:border-blue-500 bg-gray-50/50 hover:bg-blue-50/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all group mt-1"
                    >
                      <CloudUpload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
                      <p className="text-xs text-gray-500 font-semibold group-hover:text-blue-600">
                        Drag and drop About Us image here, or{" "}
                        <span className="text-blue-500 hover:underline animate-pulse">
                          browse
                        </span>
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        PNG, JPG or WEBP (Cinematic Story Image)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <InputField
                    label="Image SEO Alt Tag"
                    name="imageAlt"
                    value={formData.imageAlt || ""}
                    onChange={handleChange}
                    placeholder="e.g. Traditional facade of Seven Stars pub"
                    containerClassName="mt-2"
                  />
                </div>

                {/* 4. Call to Action Link */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/30 border border-gray-55 rounded-2xl p-5">
                  <div className="col-span-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Link className="w-3.5 h-3.5 text-purple-500" />
                      Call to Action Button Link
                    </h4>
                  </div>
                  <InputField
                    label="Link Button Label"
                    name="ctaLabel"
                    value={formData.ctaLabel || ""}
                    onChange={handleChange}
                    placeholder="e.g. Explore our dining"
                  />
                  <InputField
                    label="Link Button Destination URL"
                    name="ctaUrl"
                    value={formData.ctaUrl || ""}
                    onChange={handleChange}
                    placeholder="e.g. /dining"
                  />
                </div>
              </div>

              {/* Action Save Button */}
              <div className="flex justify-end pt-4 border-t border-gray-50">
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
