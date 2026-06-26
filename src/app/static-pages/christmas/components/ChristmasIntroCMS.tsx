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
  tagline: "Warmth & Festive Cheer",
  heading: "Celebrate Christmas at",
  headingHighlight: "Seven Stars in Marsh Baldon!",
  description: "Are you looking for the perfect place to celebrate Christmas with your loved ones? Seven Stars located in Marsh Baldon, Oxford, is here to make your Christmas Day magical!",
  whyChooseHeading: "Why Choose Seven Stars:",
  reason1: "Cosy Pub with beautiful Christmas décor, spreading warmth and festive cheer.",
  reason2: "Savor festive Christmas dishes prepared by our chefs for the occasion.",
  reason3: "Our Pub serves wine, cocktails, and seasonal drinks to enhance Christmas joy.",
  showcaseImage: "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/christmas-santaclaus.webp",
};

export function ChristmasIntroCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [selectedImage, setSelectedImage] = useState<File | string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const saveUrl = "/api/christmas";
  const responseKey = "ChristmasIntro";

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.[responseKey];
        if (json.success && sectionData) {
          const data = { ...defaultFormData, ...sectionData };
          setFormData(data);
          if (data.showcaseImage) setSelectedImage(data.showcaseImage);
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    setIsSaving(true);
    const toastId = toast.loading("Saving Intro Section...");
    try {
      const uploadedUrls = await uploadFiles([selectedImage]);
      const imgUrl = selectedImage instanceof File ? uploadedUrls[0] || "" : selectedImage;

      const payload = {
        ...formData,
        showcaseImage: imgUrl,
      };

      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: responseKey, content: payload }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Intro section saved successfully!", { id: toastId });
        setFormData(payload);
        setSelectedImage(imgUrl);
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

  const preview = selectedImage instanceof File ? URL.createObjectURL(selectedImage) : selectedImage;
  const imageName = typeof selectedImage === "string" ? selectedImage.split("/").pop() || "Santa Showcase" : selectedImage?.name;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
      <SectionHeader
        title="Intro Section"
        description="Manage the introduction headings, paragraphs, checklist items, and Santa showcase image."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="flex flex-col gap-8 pt-6">
          <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
            <InputField
              label="Intro Section Tagline"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Heading Text"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
              />
              <InputField
                label="Heading Highlight (Highlight text)"
                name="headingHighlight"
                value={formData.headingHighlight}
                onChange={handleChange}
              />
            </div>

            <TextAreaField
              label="Description Text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />

            <InputField
              label="Checklist Heading"
              name="whyChooseHeading"
              value={formData.whyChooseHeading}
              onChange={handleChange}
            />

            <div className="flex flex-col gap-4 border-t border-gray-100 pt-6">
              <InputField
                label="Reason Item 1"
                name="reason1"
                value={formData.reason1}
                onChange={handleChange}
              />
              <InputField
                label="Reason Item 2"
                name="reason2"
                value={formData.reason2}
                onChange={handleChange}
              />
              <InputField
                label="Reason Item 3"
                name="reason3"
                value={formData.reason3}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Intro Showcase Image (Santa)
            </span>

            {preview ? (
              <div className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-2xl">
                <div className="flex items-center gap-3.5 text-gray-700">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                    <img src={preview} alt="Santa Showcase" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-900 truncate max-w-xs">{imageName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-1.5 rounded-xl text-[10px] font-bold shadow-sm cursor-pointer"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-red-500 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-xl cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-200 hover:border-blue-500 bg-white hover:bg-blue-50/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer group"
              >
                <CloudUpload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
                <p className="text-xs text-gray-500 font-semibold group-hover:text-blue-600">
                  Click to browse intro image
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

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <SaveButton onClick={handleSave} disabled={isSaving} className="w-44 h-12 text-sm" />
          </div>
        </div>
      )}
    </div>
  );
}
