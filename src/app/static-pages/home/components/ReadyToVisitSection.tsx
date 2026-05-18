"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { CloudUpload, Trash2, Plus, Sparkles, Phone, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  upperTag: "",
  heading: "",
  lines: [
    "",
    "",
  ],
  bookLabel: "",
  bookUrl: "",
  phoneLabel: "",
  phoneUrl: "",
  image1: "",
  image2: "",
};

interface ReadyToVisitSectionProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function ReadyToVisitSection({
  sectionId,
  initialData,
  saveUrl = "/api/home",
  responseKey = "ReadyToVisit",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: ReadyToVisitSectionProps) {
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
  const [formData, setFormData] = useState(defaultFormData);
  
  // Custom states for files
  const [selectedImage1, setSelectedImage1] = useState<File | string>("");
  const [selectedImage2, setSelectedImage2] = useState<File | string>("");

  const fileRef1 = useRef<HTMLInputElement>(null);
  const fileRef2 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      const data = { ...defaultFormData, ...initialData };
      setFormData(data);
      if (data.image1) setSelectedImage1(data.image1);
      if (data.image2) setSelectedImage2(data.image2);
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey ? json.data?.[responseKey] : json.data;
          if (json.success && sectionData) {
            const data = { ...defaultFormData, ...sectionData };
            setFormData(data);
            if (data.image1) setSelectedImage1(data.image1);
            if (data.image2) setSelectedImage2(data.image2);
          } else {
            setSelectedImage1(defaultFormData.image1);
            setSelectedImage2(defaultFormData.image2);
          }
        })
        .catch(console.error);
    }
  }, [initialData, saveUrl, responseKey]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLineChange = (index: number, val: string) => {
    setFormData((prev) => {
      const nextLines = [...prev.lines];
      nextLines[index] = val;
      return { ...prev, lines: nextLines };
    });
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (index === 1) setSelectedImage1(file);
      if (index === 2) setSelectedImage2(file);
    }
  };

  const removeFile = (index: number) => {
    if (index === 1) setSelectedImage1("");
    if (index === 2) setSelectedImage2("");
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.upperTag.trim()) errs.push("Upper tag is required");
    if (!formData.heading.trim()) errs.push("Heading is required");
    if (formData.lines.some((l) => !l.trim())) errs.push("Copy lines cannot be empty");
    if (!formData.bookLabel.trim() || !formData.bookUrl.trim()) errs.push("Booking CTA label and url are required");
    if (!formData.phoneLabel.trim() || !formData.phoneUrl.trim()) errs.push("Phone Callout label and url are required");

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Plan Your Visit section...");
    try {
      const uploadedUrls = await uploadFiles([selectedImage1, selectedImage2]);
      const url1 = selectedImage1 instanceof File ? uploadedUrls[0] || "" : selectedImage1;
      const url2 = selectedImage2 instanceof File ? uploadedUrls[1] || "" : selectedImage2;

      const payload = {
        ...formData,
        image1: url1,
        image2: url2,
      };

      const body = sectionId
        ? { id: sectionId, content: payload }
        : { section: responseKey ?? "ReadyToVisit", content: payload };

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Ready To Visit section saved!", { id: toastId });
        setFormData(payload);
        setSelectedImage1(url1);
        setSelectedImage2(url2);
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

  const preview1 = selectedImage1 instanceof File ? URL.createObjectURL(selectedImage1) : selectedImage1;
  const preview2 = selectedImage2 instanceof File ? URL.createObjectURL(selectedImage2) : selectedImage2;

  const filename1 = typeof selectedImage1 === "string" ? selectedImage1.split("/").pop() || "Top Right Image" : selectedImage1?.name;
  const filename2 = typeof selectedImage2 === "string" ? selectedImage2.split("/").pop() || "Bottom Left Image" : selectedImage2?.name;

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Ready to Visit Section"
          description="Manage Plan Your Visit taglines, headings, book tables links, call-out icons, and background floating illustrations."
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
              
              {/* Layout copy details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                <InputField
                  label="Section Tag Label"
                  name="upperTag"
                  value={formData.upperTag}
                  onChange={handleChange}
                  placeholder="e.g. PLAN YOUR VISIT"
                  required
                />
                <InputField
                  label="Title Heading"
                  name="heading"
                  value={formData.heading}
                  onChange={handleChange}
                  placeholder="e.g. Ready to Visit?"
                  required
                />
                <InputField
                  label="Description Line 1"
                  value={formData.lines[0]}
                  onChange={(e) => handleLineChange(0, e.target.value)}
                  placeholder="Line 1 copy..."
                  containerClassName="col-span-1 md:col-span-2"
                  required
                />
                <InputField
                  label="Description Line 2"
                  value={formData.lines[1]}
                  onChange={(e) => handleLineChange(1, e.target.value)}
                  placeholder="Line 2 copy..."
                  containerClassName="col-span-1 md:col-span-2"
                  required
                />
              </div>

              {/* Action Buttons Link Block */}
              <div className="flex flex-col gap-5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Call-To-Actions and Booking Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                  <div className="flex flex-col gap-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Primary CTA: Book a Table Button
                    </span>
                    <InputField
                      label="Button Label"
                      name="bookLabel"
                      value={formData.bookLabel}
                      onChange={handleChange}
                      placeholder="e.g. Book a Table"
                      required
                    />
                    <InputField
                      label="Button Link URL"
                      name="bookUrl"
                      value={formData.bookUrl}
                      onChange={handleChange}
                      placeholder="e.g. /contact"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Secondary CTA: Phone Callout Button
                    </span>
                    <InputField
                      label="Button Label"
                      name="phoneLabel"
                      value={formData.phoneLabel}
                      onChange={handleChange}
                      placeholder="e.g. Call Us"
                      required
                    />
                    <InputField
                      label="Button Link URL"
                      name="phoneUrl"
                      value={formData.phoneUrl}
                      onChange={handleChange}
                      placeholder="e.g. tel:+441865343337"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Decorative Floating Background Images */}
              <div className="flex flex-col gap-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Floating Background Illustrations (2 Required)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Floating Image 1 */}
                  <div className="flex flex-col gap-3 bg-gray-50/40 p-5 border border-gray-100 rounded-3xl">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Position 1: Top Right Floating gourmet dish
                    </span>

                    {preview1 ? (
                      <div className="flex items-center justify-between p-3.5 px-5 bg-white border border-gray-200 rounded-2xl transition-all hover:bg-gray-50/50 mt-1">
                        <div className="flex items-center gap-3.5 text-gray-700">
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={preview1} alt="Top Right Floating" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-900 truncate max-w-[150px] sm:max-w-xs">
                              {filename1}
                            </span>
                            <span className="text-[9px] text-gray-400 font-semibold mt-0.5">
                              Top Right Image
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileRef1.current?.click()}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFile(1)}
                            className="text-red-500 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
                            title="Remove Image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileRef1.current?.click()}
                        className="w-full border-2 border-dashed border-gray-200 hover:border-blue-500 bg-white hover:bg-blue-50/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all group mt-1"
                      >
                        <CloudUpload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
                        <p className="text-xs text-gray-500 font-semibold group-hover:text-blue-600">
                          Drag and drop image here, or <span className="text-blue-500 hover:underline animate-pulse">browse</span>
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">PNG, JPG or WEBP (Floating gourmet dish)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileRef1}
                      onChange={(e) => handleFileChange(1, e)}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  {/* Floating Image 2 */}
                  <div className="flex flex-col gap-3 bg-gray-50/40 p-5 border border-gray-100 rounded-3xl">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Position 2: Bottom Left Floating historic facade
                    </span>

                    {preview2 ? (
                      <div className="flex items-center justify-between p-3.5 px-5 bg-white border border-gray-200 rounded-2xl transition-all hover:bg-gray-50/50 mt-1">
                        <div className="flex items-center gap-3.5 text-gray-700">
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={preview2} alt="Bottom Left Floating" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-900 truncate max-w-[150px] sm:max-w-xs">
                              {filename2}
                            </span>
                            <span className="text-[9px] text-gray-400 font-semibold mt-0.5">
                              Bottom Left Image
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileRef2.current?.click()}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFile(2)}
                            className="text-red-500 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
                            title="Remove Image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileRef2.current?.click()}
                        className="w-full border-2 border-dashed border-gray-200 hover:border-blue-500 bg-white hover:bg-blue-50/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all group mt-1"
                      >
                        <CloudUpload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
                        <p className="text-xs text-gray-500 font-semibold group-hover:text-blue-600">
                          Drag and drop image here, or <span className="text-blue-500 hover:underline animate-pulse">browse</span>
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">PNG, JPG or WEBP (Historic facade)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileRef2}
                      onChange={(e) => handleFileChange(2, e)}
                      accept="image/*"
                      className="hidden"
                    />
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
