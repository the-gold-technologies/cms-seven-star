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
  hubTagline: "",
  hubHeading: "",
  hubHeadingItalic: "",
  hubDesc1: "",
  hubDesc2: "",
  hubDesc3: "",
  cardTitle: "",
  cardDesc: "",
  rightImage: "",
  rightImageTitle: "",
  exp1: "",
  exp2: "",
  exp3: "",
  exp4: "",
};

interface StoryHubCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function StoryHubCMS({
  sectionId,
  initialData,
  saveUrl = "/api/our-story",
  responseKey = "StoryHub",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: StoryHubCMSProps) {
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
      if (data.rightImage) setSelectedImage(data.rightImage);
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey
            ? json.data?.[responseKey]
            : json.data;
          if (json.success && sectionData) {
            const data = { ...defaultFormData, ...sectionData };
            setFormData(data);
            if (data.rightImage) setSelectedImage(data.rightImage);
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
    if (!formData.hubTagline?.trim()) errs.push("Tagline is required");
    if (!formData.hubHeading?.trim())
      errs.push("Heading Regular Part is required");
    if (!formData.hubHeadingItalic?.trim())
      errs.push("Heading Italic Part is required");
    if (!formData.hubDesc1?.trim())
      errs.push("Description Paragraph 1 is required");
    if (!formData.cardTitle?.trim())
      errs.push("Experiences Card title is required");
    if (!formData.cardDesc?.trim())
      errs.push("Experiences Card description is required");
    if (!formData.exp1?.trim()) errs.push("Experience 1 text is required");
    if (!formData.exp2?.trim()) errs.push("Experience 2 text is required");
    if (!formData.exp3?.trim()) errs.push("Experience 3 text is required");
    if (!formData.exp4?.trim()) errs.push("Experience 4 text is required");
    if (!selectedImage) errs.push("Community Hub showcase image is required");

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Community Hub details...");
    try {
      const uploadedUrls = await uploadFiles([selectedImage]);
      const imgUrl =
        selectedImage instanceof File ? uploadedUrls[0] || "" : selectedImage;

      const payload = {
        ...formData,
        rightImage: imgUrl,
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
        toast.success("Community Hub saved successfully!", { id: toastId });
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
          title="Community Hub & Experiences"
          description="Manage community-owned highlights, key descriptions, experience cards, showcases, and four-column lists."
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
              {/* Header Titles */}
              <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <InputField
                  label="Hub Section Tagline"
                  name="hubTagline"
                  value={formData.hubTagline}
                  onChange={handleChange}
                  placeholder="e.g. Community Hub"
                  required
                />

                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <InputField
                    label="Hub Heading Regular Part"
                    name="hubHeading"
                    value={formData.hubHeading}
                    onChange={handleChange}
                    placeholder="e.g. A Pub By the People,"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Hub Heading Italic Part"
                    name="hubHeadingItalic"
                    value={formData.hubHeadingItalic}
                    onChange={handleChange}
                    placeholder="e.g. For the People"
                    required
                    containerClassName="flex-1"
                  />
                </div>
              </div>

              {/* Story Paragraphs */}
              <div className="flex flex-col gap-5 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Hub Story Copy paragraphs
                </span>

                <TextAreaField
                  label="Paragraph 1 (Required)"
                  name="hubDesc1"
                  value={formData.hubDesc1}
                  onChange={handleChange}
                  placeholder="e.g. We are truly community-owned, bought by the community..."
                  rows={2}
                  required
                />

                <TextAreaField
                  label="Paragraph 2 (Optional)"
                  name="hubDesc2"
                  value={formData.hubDesc2}
                  onChange={handleChange}
                  placeholder="e.g. Our doors are open to both locals and visitors alike..."
                  rows={2}
                />

                <TextAreaField
                  label="Paragraph 3 (Optional)"
                  name="hubDesc3"
                  value={formData.hubDesc3}
                  onChange={handleChange}
                  placeholder="e.g. We value our community members..."
                  rows={2}
                />
              </div>

              {/* Special Info highlight card */}
              <div className="flex flex-col gap-5 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Expect More Experiences Card
                </span>

                <InputField
                  label="Highlight Card Title"
                  name="cardTitle"
                  value={formData.cardTitle}
                  onChange={handleChange}
                  placeholder="e.g. Expect More Experiences"
                  required
                />

                <TextAreaField
                  label="Highlight Card Description"
                  name="cardDesc"
                  value={formData.cardDesc}
                  onChange={handleChange}
                  placeholder="e.g. You can also expect quiz nights, live music..."
                  rows={2}
                  required
                />
              </div>

              {/* Right showcase image uploader */}
              <div className="grid grid-cols-1  gap-6 w-full items-start">
                <div className="flex flex-col gap-3 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl flex-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Showcase Cover Image
                  </span>

                  {preview ? (
                    <div className="flex items-center justify-between p-3.5 px-5 bg-white border border-gray-200 rounded-2xl transition-all hover:bg-gray-50/50 mt-1">
                      <div className="flex items-center gap-3.5 text-gray-700">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preview}
                            alt="Hub Cover"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-900 truncate max-w-[120px] sm:max-w-xs">
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
                      <p className="text-[10px] text-gray-400 mt-1">
                        PNG, JPG or WEBP
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

                <div className="flex flex-col gap-4 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl flex-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Cover Overlay Title (Optional)
                  </span>

                  <InputField
                    label="Image Quote Caption Overlay (Optional)"
                    name="rightImageTitle"
                    value={formData.rightImageTitle}
                    onChange={handleChange}
                    placeholder="e.g. Our experiences look like:"
                  />
                </div>
              </div>

              {/* Experiences Labels Grid */}
              <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Showcase Experience Labels
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <InputField
                    label="Experience 1 label"
                    name="exp1"
                    value={formData.exp1}
                    onChange={handleChange}
                    placeholder="e.g. Friends catching up over a pint"
                    required
                  />
                  <InputField
                    label="Experience 2 label"
                    name="exp2"
                    value={formData.exp2}
                    onChange={handleChange}
                    placeholder="e.g. Families enjoying Sunday lunch"
                    required
                  />
                  <InputField
                    label="Experience 3 label"
                    name="exp3"
                    value={formData.exp3}
                    onChange={handleChange}
                    placeholder="e.g. Neighbours celebrating special moments"
                    required
                  />
                  <InputField
                    label="Experience 4 label"
                    name="exp4"
                    value={formData.exp4}
                    onChange={handleChange}
                    placeholder="e.g. Visitors discovering a true village pub"
                    required
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
