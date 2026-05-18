"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { CloudUpload, Trash2, Sparkles, LayoutGrid } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

const defaultFormData = {
  tagline: "",
  heading: "",
  headingHighlight: "",
  description: "",
  backgroundImage: "",
  sideImage: "",
  drinksList: [] as string[],
};

interface MenuCellarCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function MenuCellarCMS({
  sectionId,
  initialData,
  saveUrl = "/api/menu",
  responseKey = "MenuCellar",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: MenuCellarCMSProps) {
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

  // Background and Side photo uploads
  const [bgImage, setBgImage] = useState<File | string>("");
  const [sideImage, setSideImage] = useState<File | string>("");

  const bgInputRef = useRef<HTMLInputElement>(null);
  const sideInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      const data = { ...defaultFormData, ...initialData };
      setFormData(data);
      if (data.backgroundImage) setBgImage(data.backgroundImage);
      if (data.sideImage) setSideImage(data.sideImage);
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey
            ? json.data?.[responseKey]
            : json.data;
          if (json.success && sectionData) {
            const data = { ...defaultFormData, ...sectionData };
            setFormData(data);
            if (data.backgroundImage) setBgImage(data.backgroundImage);
            if (data.sideImage) setSideImage(data.sideImage);
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

  const handleDrinkNameChange = (idx: number, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.drinksList];
      updated[idx] = val;
      return { ...prev, drinksList: updated };
    });
  };

  const handleBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBgImage(e.target.files[0]);
    }
  };

  const handleSideChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSideImage(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.tagline?.trim()) errs.push("Cellar Tagline is required");
    if (!formData.heading?.trim()) errs.push("Cellar Heading is required");
    if (!formData.headingHighlight?.trim()) errs.push("Cellar Heading highlight is required");
    if (!formData.description?.trim()) errs.push("Cellar Description is required");
    if (!bgImage) errs.push("Background parallax photo is required");
    if (!sideImage) errs.push("Side featured showcase photo is required");

    formData.drinksList.forEach((drink, idx) => {
      if (!drink.trim()) errs.push(`Drink category ${idx + 1} cannot be empty`);
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Cellar & Drinks configuration...");
    try {
      const bgUrl = (bgImage instanceof File ? (await uploadFiles([bgImage]))[0] : bgImage) || "";
      const sideUrl = (sideImage instanceof File ? (await uploadFiles([sideImage]))[0] : sideImage) || "";

      const payload = {
        ...formData,
        backgroundImage: bgUrl,
        sideImage: sideUrl,
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
        toast.success("Cellar and Drinks saved successfully!", { id: toastId });
        setFormData(payload);
        setBgImage(bgUrl);
        setSideImage(sideUrl);
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

  const bgPreview = bgImage instanceof File ? URL.createObjectURL(bgImage) : bgImage;
  const bgName = typeof bgImage === "string" ? bgImage.split("/").pop() || "Background Image" : bgImage?.name;

  const sidePreview = sideImage instanceof File ? URL.createObjectURL(sideImage) : sideImage;
  const sideName = typeof sideImage === "string" ? sideImage.split("/").pop() || "Side Image" : sideImage?.name;

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Drinks & The Cellar Section"
          description="Manage atmospheric drink banners, side covers, split titles, and all four drinks categories."
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
              
              {/* Heading properties */}
              <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <InputField
                  label="Eyebrow Subtitle"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="e.g. The Cellar"
                  required
                />

                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <InputField
                    label="Heading Regular Part"
                    name="heading"
                    value={formData.heading}
                    onChange={handleChange}
                    placeholder="e.g. We take our drinks"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Heading Italic Highlight"
                    name="headingHighlight"
                    value={formData.headingHighlight}
                    onChange={handleChange}
                    placeholder="e.g. as seriously as our food."
                    required
                    containerClassName="flex-1"
                  />
                </div>

                <TextAreaField
                  label="Drinks Copy Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="The Seven Stars stocks a carefully chosen range..."
                  rows={3}
                  required
                />
              </div>

              {/* Uploader double pack */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Background Parallax */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Parallax Background Image
                  </span>

                  {bgPreview ? (
                    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-2xl mt-1">
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={bgPreview}
                            alt="Cellar Background"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-gray-900 truncate max-w-[120px]">
                          {bgName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => bgInputRef.current?.click()}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-xl text-[10px] font-bold"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() => setBgImage("")}
                          className="text-red-500 p-1.5 hover:bg-red-50 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => bgInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer"
                    >
                      <CloudUpload className="w-6 h-6 text-gray-400 mb-1" />
                      <p className="text-[10px] text-gray-500 font-bold">Select Parallax BG</p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={bgInputRef}
                    onChange={handleBgChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Side featured */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Featured Side Image
                  </span>

                  {sidePreview ? (
                    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-2xl mt-1">
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={sidePreview}
                            alt="Cellar Side"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-gray-900 truncate max-w-[120px]">
                          {sideName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => sideInputRef.current?.click()}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-xl text-[10px] font-bold"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() => setSideImage("")}
                          className="text-red-500 p-1.5 hover:bg-red-50 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => sideInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer"
                    >
                      <CloudUpload className="w-6 h-6 text-gray-400 mb-1" />
                      <p className="text-[10px] text-gray-500 font-bold">Select Side Image</p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={sideInputRef}
                    onChange={handleSideChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* 4 categories */}
              <div className="flex flex-col gap-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <LayoutGrid className="w-3.5 h-3.5 text-blue-500" />
                  Drinks Categories Showcase
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {formData.drinksList.map((drink, idx) => (
                    <InputField
                      key={idx}
                      label={`Showcase Category #${idx + 1}`}
                      value={drink}
                      onChange={(e) => handleDrinkNameChange(idx, e.target.value)}
                      placeholder="e.g. Local Ales"
                      required
                    />
                  ))}
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
