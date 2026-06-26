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
  tagline: "Festive Season 2026",
  headingPart1: "Celebrate",
  headingItalicHighlight: "Christmas",
  headingPart2: "at Seven Stars",
  description: "Step into the warmth of our decorated countryside pub in Marsh Baldon, Oxford. Savor award-winning festive menus, cozy up next to glowing fireplaces, and celebrate the season in style.",
  ctaText1: "Reserve Your Table",
  ctaLink1: "https://www.opentable.co.uk/r/the-seven-stars-at-marsh-baldon-reservations-oxford?restref=459243&lang=en-GB&ot_source=Restaurant%20website",
  ctaText2: "Discover Menus",
  ctaLink2: "#menus",
  backgroundImage: "/christmas-pub-hero.png",
  musicTrack: "/christmas-tune.mp3",
};

export function ChristmasHeroCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [selectedImage, setSelectedImage] = useState<File | string>("");
  const [selectedAudio, setSelectedAudio] = useState<File | string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const saveUrl = "/api/christmas";
  const responseKey = "ChristmasHero";

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.[responseKey];
        if (json.success && sectionData) {
          const data = { ...defaultFormData, ...sectionData };
          setFormData(data);
          if (data.backgroundImage) setSelectedImage(data.backgroundImage);
          if (data.musicTrack) setSelectedAudio(data.musicTrack);
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

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedAudio(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setSelectedImage("");
  };

  const removeAudio = () => {
    setSelectedAudio("");
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Hero Section...");
    try {
      const uploadedImageUrls = await uploadFiles([selectedImage]);
      const imgUrl = selectedImage instanceof File ? uploadedImageUrls[0] || "" : selectedImage;

      const uploadedAudioUrls = await uploadFiles([selectedAudio]);
      const audioUrl = selectedAudio instanceof File ? uploadedAudioUrls[0] || "" : selectedAudio;

      const payload = {
        ...formData,
        backgroundImage: imgUrl,
        musicTrack: audioUrl,
      };

      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: responseKey, content: payload }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Hero section saved successfully!", { id: toastId });
        setFormData(payload);
        setSelectedImage(imgUrl);
        setSelectedAudio(audioUrl);
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
  const imageName = typeof selectedImage === "string" ? selectedImage.split("/").pop() || "Hero Image" : selectedImage?.name;

  const audioPreviewName = typeof selectedAudio === "string" ? selectedAudio.split("/").pop() || "Background Music" : selectedAudio?.name;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
      <SectionHeader
        title="Hero Section"
        description="Manage the top screen tagline badge, titles, descriptions, action links, and background image."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="flex flex-col gap-8 pt-6">
          <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
            <InputField
              label="Tagline Label"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="e.g. Festive Season 2026"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                label="Heading Part 1 (Regular)"
                name="headingPart1"
                value={formData.headingPart1}
                onChange={handleChange}
                placeholder="e.g. Celebrate"
              />
              <InputField
                label="Heading Highlight (Italic highlight)"
                name="headingItalicHighlight"
                value={formData.headingItalicHighlight}
                onChange={handleChange}
                placeholder="e.g. Christmas"
              />
              <InputField
                label="Heading Part 2 (Regular)"
                name="headingPart2"
                value={formData.headingPart2}
                onChange={handleChange}
                placeholder="e.g. at Seven Stars"
              />
            </div>

            <TextAreaField
              label="Description Copy"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Explain the celebration details..."
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
              <InputField
                label="Primary CTA Text"
                name="ctaText1"
                value={formData.ctaText1}
                onChange={handleChange}
              />
              <InputField
                label="Primary CTA Link"
                name="ctaLink1"
                value={formData.ctaLink1}
                onChange={handleChange}
              />
              <InputField
                label="Secondary CTA Text"
                name="ctaText2"
                value={formData.ctaText2}
                onChange={handleChange}
              />
              <InputField
                label="Secondary CTA Link"
                name="ctaLink2"
                value={formData.ctaLink2}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Hero Background Image
            </span>

            {preview ? (
              <div className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-2xl">
                <div className="flex items-center gap-3.5 text-gray-700">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                    <img src={preview} alt="Hero Background" className="w-full h-full object-cover" />
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
                  Click to browse background image
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

          {/* Background Music Audio track settings */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Christmas Background Music (Audio Track / MP3)
            </span>
            
            {selectedAudio ? (
              <div className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-2xl">
                <div className="flex items-center gap-3.5 text-gray-700">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <span>🎵</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-900 truncate max-w-xs">{audioPreviewName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => audioInputRef.current?.click()}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-1.5 rounded-xl text-[10px] font-bold shadow-sm cursor-pointer"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={removeAudio}
                    className="text-red-500 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-xl cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => audioInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-200 hover:border-blue-500 bg-white hover:bg-blue-50/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer group"
              >
                <CloudUpload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
                <p className="text-xs text-gray-500 font-semibold group-hover:text-blue-600">
                  Click to upload background audio track (.mp3, .wav)
                </p>
              </div>
            )}
            <input
              type="file"
              ref={audioInputRef}
              onChange={handleAudioChange}
              accept="audio/*"
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
