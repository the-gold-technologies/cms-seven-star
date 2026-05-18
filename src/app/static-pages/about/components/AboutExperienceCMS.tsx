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
  differentTag: "",
  differentHeading: "",
  differentHeadingItalic: "",
  differentDesc: "",
  differentImage: "",
  highlights: [""],
};

interface AboutExperienceCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AboutExperienceCMS({
  sectionId,
  initialData,
  saveUrl = "/api/about",
  responseKey = "AboutExperience",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: AboutExperienceCMSProps) {
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
      if (data.differentImage) setSelectedImage(data.differentImage);
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey
            ? json.data?.[responseKey]
            : json.data;
          if (json.success && sectionData) {
            const data = { ...defaultFormData, ...sectionData };
            setFormData(data);
            if (data.differentImage) setSelectedImage(data.differentImage);
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

  const handleHighlightChange = (index: number, val: string) => {
    setFormData((prev) => {
      const nextHighlights = [...prev.highlights];
      nextHighlights[index] = val;
      return { ...prev, highlights: nextHighlights };
    });
  };

  const addHighlight = () => {
    setFormData((prev) => ({
      ...prev,
      highlights: ["", ...prev.highlights], // Prepended at index 0!
    }));
  };

  const removeHighlight = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, idx) => idx !== indexToRemove),
    }));
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
    if (!formData.differentTag?.trim()) errs.push("Tag label is required");
    if (!formData.differentHeading?.trim()) errs.push("Heading is required");
    if (!formData.differentHeadingItalic?.trim())
      errs.push("Italic Heading Part is required");
    if (!formData.differentDesc?.trim()) errs.push("Description is required");
    if (!selectedImage) errs.push("Experience showcase photo is required");

    formData.highlights.forEach((h, idx) => {
      if (!h.trim()) errs.push(`Highlight bullet ${idx + 1} cannot be empty`);
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Experience details...");
    try {
      const uploadedUrls = await uploadFiles([selectedImage]);
      const imgUrl =
        selectedImage instanceof File ? uploadedUrls[0] || "" : selectedImage;

      const payload = {
        ...formData,
        differentImage: imgUrl,
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
        toast.success("About Experience saved successfully!", { id: toastId });
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
      ? selectedImage.split("/").pop() || "Showcase Image"
      : selectedImage?.name;

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="About Experience Section"
          description="Manage cozy village pub details, atmospheric interior highlights, and cover illustrations."
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
                  name="differentTag"
                  value={formData.differentTag}
                  onChange={handleChange}
                  placeholder="e.g. The Experience"
                  required
                  containerClassName="w-full"
                />

                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <InputField
                    label="Heading Regular Part"
                    name="differentHeading"
                    value={formData.differentHeading}
                    onChange={handleChange}
                    placeholder="e.g. Experience the"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Heading Italic Highlight"
                    name="differentHeadingItalic"
                    value={formData.differentHeadingItalic}
                    onChange={handleChange}
                    placeholder="e.g. best of both worlds."
                    required
                    containerClassName="flex-1"
                  />
                </div>

                <TextAreaField
                  label="Cozy Experience Description"
                  name="differentDesc"
                  value={formData.differentDesc}
                  onChange={handleChange}
                  placeholder="Walk into The Seven Stars and you'll find the character..."
                  containerClassName="w-full"
                  rows={3}
                  required
                />
              </div>

              {/* Cover Photo and Highlights List */}
              <div className="grid grid-cols-1 gap-8 items-start w-full">
                {/* Image Uploader */}
                <div className="flex flex-col gap-3 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block border-b border-gray-100 pb-2">
                    Experience Cover Photo
                  </span>

                  {preview ? (
                    <div className="flex items-center justify-between p-3.5 px-5 bg-white border border-gray-200 rounded-2xl transition-all hover:bg-gray-50/50 mt-1">
                      <div className="flex items-center gap-3.5 text-gray-700">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preview}
                            alt="Experience Cover"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-900 truncate max-w-[120px] sm:max-w-xs">
                            {name}
                          </span>
                          <span className="text-[9px] text-gray-400 font-semibold mt-0.5">
                            Showcase Image
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="text-red-500 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
                          title="Remove Image"
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
                        Drag and drop image here, or{" "}
                        <span className="text-blue-500 hover:underline animate-pulse">
                          browse
                        </span>
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        PNG, JPG or WEBP (Atmospheric Photo)
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

                {/* Bullets Highlight list */}
                <div className="flex flex-col gap-4 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Bullet Point Highlights ({formData.highlights.length})
                    </span>
                    <button
                      type="button"
                      onClick={addHighlight}
                      className="text-[10px] text-blue-500 hover:text-blue-600 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Prepend Highlight
                    </button>
                  </div>

                  <div className="flex flex-col gap-4 mt-1 max-h-[300px] overflow-y-auto pr-1">
                    {formData.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <InputField
                          label={`Highlight Bullet ${idx + 1}`}
                          value={highlight}
                          onChange={(e) =>
                            handleHighlightChange(idx, e.target.value)
                          }
                          placeholder="e.g. The character of a classic Oxfordshire village."
                          required
                          containerClassName="flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => removeHighlight(idx)}
                          className="text-red-500 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-all mt-6 cursor-pointer"
                          title="Remove Highlight"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
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
