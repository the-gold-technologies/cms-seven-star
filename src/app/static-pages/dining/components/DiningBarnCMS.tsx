"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { CloudUpload, Trash2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

const defaultFormData = {
  barnTagline: "",
  barnHeading: "",
  barnHeadingItalic: "",
  barnDesc: "",
  barnImage: "",
  capacityTitle: "",
  capacityDesc: "",
  beerTentTitle: "",
  beerTentDesc: "",
  barnCtaText: "",
  barnCtaLink: "",
};

interface DiningBarnCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function DiningBarnCMS({
  sectionId,
  initialData,
  saveUrl = "/api/dining",
  responseKey = "DiningBarn",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: DiningBarnCMSProps) {
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
  const [selectedImage, setSelectedImage] = useState<File | string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      const data = { ...defaultFormData, ...initialData };
      setFormData(data);
      if (data.barnImage) setSelectedImage(data.barnImage);
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey
            ? json.data?.[responseKey]
            : json.data;
          if (json.success && sectionData) {
            const data = { ...defaultFormData, ...sectionData };
            setFormData(data);
            if (data.barnImage) setSelectedImage(data.barnImage);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setSelectedImage("");
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.barnTagline?.trim())
      errs.push("Barn Tagline label is required");
    if (!formData.barnHeading?.trim())
      errs.push("Barn Heading regular part is required");
    if (!formData.barnHeadingItalic?.trim())
      errs.push("Barn Heading italic part is required");
    if (!formData.barnDesc?.trim())
      errs.push("Barn description summary copy is required");
    if (!formData.capacityTitle?.trim())
      errs.push("Capacity Title is required");
    if (!formData.capacityDesc?.trim())
      errs.push("Capacity Description is required");
    if (!formData.beerTentTitle?.trim())
      errs.push("Beer Tent Title is required");
    if (!formData.beerTentDesc?.trim())
      errs.push("Beer Tent Description is required");
    if (!formData.barnCtaText?.trim()) errs.push("CTA Button Text is required");
    if (!selectedImage) errs.push("Barn cover image uploader is required");

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Dining Barn details...");
    try {
      const uploadedUrls = await uploadFiles([selectedImage]);
      const imgUrl =
        selectedImage instanceof File ? uploadedUrls[0] || "" : selectedImage;

      const payload = {
        ...formData,
        barnImage: imgUrl,
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
        toast.success("Dining Barn saved successfully!", { id: toastId });
        setFormData(payload);
        setSelectedImage(imgUrl);
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

  const preview =
    selectedImage instanceof File
      ? URL.createObjectURL(selectedImage)
      : selectedImage;
  const name =
    typeof selectedImage === "string"
      ? selectedImage.split("/").pop() || "Barn Image"
      : selectedImage?.name;

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Dining Barn Section"
          description="Manage Private Dining Barn titles, description summaries, capacity lists, beer tent metrics, and CTA triggers."
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
              {/* Titles */}
              <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <InputField
                  label="Barn Eyebrow Tag"
                  name="barnTagline"
                  value={formData.barnTagline}
                  onChange={handleChange}
                  placeholder="e.g. Private Dining"
                  required
                />

                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <InputField
                    label="Barn Heading Regular Part"
                    name="barnHeading"
                    value={formData.barnHeading}
                    onChange={handleChange}
                    placeholder="e.g. The"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Barn Heading Italic Part"
                    name="barnHeadingItalic"
                    value={formData.barnHeadingItalic}
                    onChange={handleChange}
                    placeholder="e.g. Barn"
                    required
                    containerClassName="flex-1"
                  />
                </div>

                <TextAreaField
                  label="Barn Description Copy"
                  name="barnDesc"
                  value={formData.barnDesc}
                  onChange={handleChange}
                  placeholder="e.g. Delicious meals, thoroughly enjoyed in our barn..."
                  rows={3}
                  required
                />
              </div>

              {/* Highlights */}
              <div className="flex flex-col md:flex-row gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <div className="flex flex-col gap-4 flex-1">
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block border-b border-gray-100 pb-1.5 mb-2">
                    Metric Highlight 1 (Capacity)
                  </span>
                  <InputField
                    label="Capacity Tag Title"
                    name="capacityTitle"
                    value={formData.capacityTitle}
                    onChange={handleChange}
                    placeholder="e.g. Capacity"
                    required
                  />
                  <InputField
                    label="Capacity Subtext Description"
                    name="capacityDesc"
                    value={formData.capacityDesc}
                    onChange={handleChange}
                    placeholder="e.g. Up to 40 guests for intimate gatherings."
                    required
                  />
                </div>

                <div className="flex flex-col gap-4 flex-1">
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block border-b border-gray-100 pb-1.5 mb-2">
                    Metric Highlight 2 (Versatility)
                  </span>
                  <InputField
                    label="Tent Option Tag Title"
                    name="beerTentTitle"
                    value={formData.beerTentTitle}
                    onChange={handleChange}
                    placeholder="e.g. Beer Tent Option"
                    required
                  />
                  <InputField
                    label="Tent Option Subtext Description"
                    name="beerTentDesc"
                    value={formData.beerTentDesc}
                    onChange={handleChange}
                    placeholder="e.g. Comes with an option for a covered Beer Tent..."
                    required
                  />
                </div>
              </div>

              {/* CTA Action */}
              <div className="flex flex-col gap-4 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block border-b border-gray-100 pb-1.5 mb-2">
                  Call To Action Settings
                </span>
                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <InputField
                    label="Enquiry Button Label"
                    name="barnCtaText"
                    value={formData.barnCtaText}
                    onChange={handleChange}
                    placeholder="e.g. Enquire About Private Dining"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Enquiry Button Link / Route"
                    name="barnCtaLink"
                    value={formData.barnCtaLink || ""}
                    onChange={handleChange}
                    placeholder="e.g. /contact or #contact"
                    containerClassName="flex-1"
                  />
                </div>
              </div>

              {/* Cover Photo */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Barn Showcase Cover Photo
                </span>

                {preview ? (
                  <div className="flex items-center justify-between p-3.5 px-5 bg-white border border-gray-200 rounded-2xl transition-all hover:bg-gray-50/50 mt-1">
                    <div className="flex items-center gap-3.5 text-gray-700">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preview}
                          alt="Dining Barn BG"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                          {name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="text-red-500 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-200 hover:border-blue-500 bg-white hover:bg-blue-50/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all group mt-1"
                  >
                    <CloudUpload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
                    <p className="text-xs text-gray-500 font-semibold group-hover:text-blue-600">
                      Drag and drop image here, or browse
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
