"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import {
  CloudUpload,
  X,
  Plus,
  Trash2,
  Instagram,
  Facebook,
  Youtube,
  Link,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { TextAreaField } from "@/components/TextAreaField";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  headlineLine1: "",
  headlineLine2Italic: "",
  description: "",
  primaryBtnLabel: "",
  primaryBtnUrl: "",
  secondaryBtnLabel: "",
  secondaryBtnUrl: "",
  marqueePills: [] as string[],
  instagramUrl: "",
  facebookUrl: "",
  youtubeUrl: "",
};

interface HeroSectionProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function HeroSection({
  sectionId,
  initialData,
  saveUrl = "/api/home",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: HeroSectionProps) {
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
  const [formData, setFormData] = useState(defaultFormData);
  const [sliderImages, setSliderImages] = useState<(File | string)[]>([]);
  const [newPillText, setNewPillText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
      if (initialData.images && Array.isArray(initialData.images)) {
        setSliderImages(initialData.images as string[]);
      }
    } else if (saveUrl === "/api/home") {
      fetchWithCache("/api/home")
        .then((json) => {
          if (json.success && json.data?.HeroSection) {
            const data = json.data.HeroSection;
            setFormData((prev) => ({ ...prev, ...data }));
            if (data.images && Array.isArray(data.images)) {
              setSliderImages(data.images as string[]);
            }
          } else {
            // Fallback default images
            setSliderImages([]);
          }
        })
        .catch(console.error);
    }
  }, [initialData, saveUrl]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Image handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSliderImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setSliderImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Marquee Pills handling
  const addPill = () => {
    if (newPillText.trim()) {
      if (formData.marqueePills.includes(newPillText.trim())) {
        toast.error("Tag already exists");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        marqueePills: [...prev.marqueePills, newPillText.trim()],
      }));
      setNewPillText("");
    }
  };

  const removePill = (pillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      marqueePills: prev.marqueePills.filter((p) => p !== pillToRemove),
    }));
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.headlineLine1?.trim())
      errs.push("Headline Line 1 is required");
    if (!formData.description?.trim()) errs.push("Description is required");
    if (sliderImages.length === 0)
      errs.push("At least one slideshow image is required");

    if (errs.length > 0) {
      errs.forEach((m) => toast.error(m));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Home Hero section...");
    try {
      // Upload any new File objects to Supabase Storage
      const uploadedUrls = await uploadFiles(sliderImages);
      const validImages = uploadedUrls.filter(
        (url): url is string => typeof url === "string",
      );

      const payload = {
        ...formData,
        images: validImages,
      };

      const body = sectionId
        ? { id: sectionId, content: payload }
        : { section: "HeroSection", content: payload };

      const method = sectionId ? "PUT" : "PUT"; // In the home controller, PUT upserts section by type

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Home Hero section saved successfully!", { id: toastId });
        setSliderImages(validImages);
        if (onSave) onSave(payload as unknown as Record<string, unknown>);
      } else {
        toast.error(json.error || "Save failed. Please try again.", {
          id: toastId,
        });
      }
    } catch (err: any) {
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
          title="Home Hero Section"
          description="Manage the main welcome banner elements, background images slideshow, headline text, buttons, and social media profile links."
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
              {/* Headlines and Text Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                    Hero Text Content
                  </h3>
                </div>

                <InputField
                  label="Headline Line 1"
                  name="headlineLine1"
                  value={formData.headlineLine1 || ""}
                  onChange={handleChange}
                  placeholder="e.g. Where Village \n Warmth Meets"
                  required
                  tooltip="First line of the main welcome headline. You can use '\n' for line breaks if needed."
                />

                <InputField
                  label="Headline Line 2 (Italic Highlight)"
                  name="headlineLine2Italic"
                  value={formData.headlineLine2Italic || ""}
                  onChange={handleChange}
                  placeholder="e.g. Great Food"
                  required
                  tooltip="Second line of the main welcome headline, styled in an elegant italic font."
                />

                <TextAreaField
                  label="Hero Description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  placeholder="e.g. We're your neighborhood pub situated in Marsh Baldon..."
                  containerClassName="col-span-2"
                  rows={3}
                  required
                  tooltip="Brief introductory paragraph text displayed below the headlines."
                />
              </div>

              {/* Call to Actions (Buttons) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <Link className="w-4 h-4 text-purple-500" />
                    Call to Action Buttons
                  </h3>
                </div>

                <div className="border border-gray-50 bg-gray-50/20 rounded-2xl p-5 flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Primary CTA (Outline style)
                  </h4>
                  <InputField
                    label="Button Label"
                    name="primaryBtnLabel"
                    value={formData.primaryBtnLabel || ""}
                    onChange={handleChange}
                    placeholder="e.g. Discover Menu"
                  />
                  <InputField
                    label="Destination URL / Route"
                    name="primaryBtnUrl"
                    value={formData.primaryBtnUrl || ""}
                    onChange={handleChange}
                    placeholder="e.g. /menu"
                  />
                </div>

                <div className="border border-gray-50 bg-gray-50/20 rounded-2xl p-5 flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Secondary CTA (Filled style)
                  </h4>
                  <InputField
                    label="Button Label"
                    name="secondaryBtnLabel"
                    value={formData.secondaryBtnLabel || ""}
                    onChange={handleChange}
                    placeholder="e.g. Book a Table"
                  />
                  <InputField
                    label="Destination URL / Route"
                    name="secondaryBtnUrl"
                    value={formData.secondaryBtnUrl || ""}
                    onChange={handleChange}
                    placeholder="e.g. /contact"
                  />
                </div>
              </div>

              {/* Bottom Marquee Pills / Tags */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-500" />
                  Bottom Scrolling Marquee Pills
                </h3>

                <div className="flex flex-wrap gap-2.5 bg-gray-50/50 p-4 border border-gray-100 rounded-2xl min-h-[50px] items-center">
                  {formData.marqueePills.map((pill) => (
                    <span
                      key={pill}
                      className="bg-white border border-gray-200 text-gray-700 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                    >
                      {pill}
                      <button
                        type="button"
                        onClick={() => removePill(pill)}
                        className="text-gray-400 hover:text-red-500 p-0.5 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  {formData.marqueePills.length === 0 && (
                    <p className="text-xs text-gray-400 font-medium italic">
                      No scrolling tags added yet.
                    </p>
                  )}
                </div>

                <div className="flex gap-3 w-full mt-1">
                  <input
                    type="text"
                    value={newPillText}
                    onChange={(e) => setNewPillText(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addPill())
                    }
                    placeholder="Add marquee tag (e.g. Sunday Roasts)"
                    className="flex-1 px-6 py-4 bg-white border border-gray-200 text-sm rounded-2xl focus:ring-2 focus:outline-none focus:border-[#475DB1] focus:ring-1 focus:ring-[#475DB1] outline-none text-gray-800 transition-all"
                  />
                  <button
                    type="button"
                    onClick={addPill}
                    className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs px-6 rounded-2xl transition-colors flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add Tag
                  </button>
                </div>
              </div>

              {/* Slideshow Image Gallery */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-500" />
                    Hero Background Slideshow Images
                  </h3>
                  <span className="text-xs text-gray-400 font-medium">
                    {sliderImages.length} images active
                  </span>
                </div>

                {/* Clean Horizontal Line List */}
                <div className="flex flex-col gap-2.5 mt-2">
                  {sliderImages.map((image, index) => {
                    const name =
                      typeof image === "string"
                        ? image.split("/").pop() || `Hero Slide ${index + 1}`
                        : image.name;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3.5 px-5 bg-gray-50/50 border border-gray-100 rounded-2xl transition-all hover:bg-gray-100/50"
                      >
                        <div className="flex items-center gap-3.5 text-gray-700">
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={
                                typeof image === "string"
                                  ? image
                                  : URL.createObjectURL(image)
                              }
                              alt={name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                              {name}
                            </span>
                            <span className="text-[9px] text-gray-400 font-semibold mt-0.5">
                              Slide Position: {index + 1}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-red-500 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
                          title="Remove Image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Full-width Drag & Drop Upload Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 hover:border-blue-500 bg-gray-50/50 hover:bg-blue-50/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all group mt-3"
                >
                  <CloudUpload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
                  <p className="text-xs text-gray-500 font-semibold group-hover:text-blue-600">
                    Drag and drop slideshow images here, or{" "}
                    <span className="text-blue-500 hover:underline animate-pulse">
                      browse
                    </span>
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    PNG, JPG or WEBP (Cinematic Background Slideshow)
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                </div>
              </div>

              {/* Social Media Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-3">
                  <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2 flex items-center gap-2">
                    Social Media Profile Links
                  </h3>
                </div>

                <InputField
                  label="Instagram URL"
                  name="instagramUrl"
                  value={formData.instagramUrl || ""}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                  icon={<Instagram className="w-4 h-4 text-pink-500" />}
                />

                <InputField
                  label="Facebook URL"
                  name="facebookUrl"
                  value={formData.facebookUrl || ""}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                  icon={<Facebook className="w-4 h-4 text-blue-600" />}
                />

                <InputField
                  label="YouTube URL"
                  name="youtubeUrl"
                  value={formData.youtubeUrl || ""}
                  onChange={handleChange}
                  placeholder="https://youtube.com/..."
                  icon={<Youtube className="w-4 h-4 text-red-500" />}
                />
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
