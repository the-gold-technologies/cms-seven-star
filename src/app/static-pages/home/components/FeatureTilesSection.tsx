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

const defaultFeatures = [
  {
    title: "",
    description: "",
    images: ["", "", ""],
  },
  {
    title: "",
    description: "",
    images: ["", "", ""],
  },
  {
    title: "",
    description: "",
    images: ["", "", ""],
  },
];

const defaultFormData = {
  regularHeading: "",
  italicHeading: "",
  tagLabel: "",
  features: defaultFeatures,
};

interface FeatureTilesSectionProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function FeatureTilesSection({
  sectionId,
  initialData,
  saveUrl = "/api/home",
  responseKey = "FeatureTiles",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: FeatureTilesSectionProps) {
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

  // A two-dimensional array matching card_index x slide_index
  const [tileImages, setTileImages] = useState<(File | string)[][]>(
    defaultFeatures.map((f) => [...f.images]),
  );

  const fileInputRefs = useRef<(HTMLInputElement | null)[][]>(
    defaultFeatures.map(() => [null, null, null]),
  );

  useEffect(() => {
    if (initialData) {
      const data = { ...defaultFormData, ...initialData };
      const mergedFeatures = defaultFeatures.map((df, fIdx) => {
        const customF = data.features?.[fIdx] || {};
        const mergedImages = [...df.images];
        if (Array.isArray(customF.images)) {
          customF.images.forEach((img: string, iIdx: number) => {
            if (iIdx < 3) mergedImages[iIdx] = img;
          });
        }
        return {
          title: customF.title || df.title,
          description: customF.description || df.description,
          images: mergedImages,
        };
      });
      data.features = mergedFeatures;
      setFormData(data);
      setTileImages(mergedFeatures.map((f) => [...f.images]));
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey
            ? json.data?.[responseKey]
            : json.data;
          if (json.success && sectionData) {
            const data = { ...defaultFormData, ...sectionData };
            const mergedFeatures = defaultFeatures.map((df, fIdx) => {
              const customF = data.features?.[fIdx] || {};
              const mergedImages = [...df.images];
              if (Array.isArray(customF.images)) {
                customF.images.forEach((img: string, iIdx: number) => {
                  if (iIdx < 3) mergedImages[iIdx] = img;
                });
              }
              return {
                title: customF.title || df.title,
                description: customF.description || df.description,
                images: mergedImages,
              };
            });
            data.features = mergedFeatures;
            setFormData(data);
            setTileImages(mergedFeatures.map((f) => [...f.images]));
          }
        })
        .catch(console.error);
    }
  }, [initialData, saveUrl, responseKey]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardFieldChange = (
    fIdx: number,
    field: "title" | "description",
    value: string,
  ) => {
    setFormData((prev) => {
      const updated = [...prev.features];
      updated[fIdx] = { ...updated[fIdx], [field]: value };
      return { ...prev, features: updated };
    });
  };

  const handleFileChange = (
    fIdx: number,
    sIdx: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTileImages((prev) => {
        const updated = prev.map((row) => [...row]);
        updated[fIdx][sIdx] = file;
        return updated;
      });
    }
  };

  const removeImage = (fIdx: number, sIdx: number) => {
    setTileImages((prev) => {
      const updated = prev.map((row) => [...row]);
      updated[fIdx][sIdx] = "";
      return updated;
    });
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.regularHeading?.trim()) errs.push("Heading is required");
    if (!formData.italicHeading?.trim())
      errs.push("Italic heading is required");

    formData.features.forEach((feat, fIdx) => {
      if (!feat.title?.trim())
        errs.push(`Feature ${fIdx + 1} Title is required`);
      if (tileImages[fIdx].some((img) => !img)) {
        errs.push(
          `All 3 slide images are required for Card ${fIdx + 1} (${feat.title})`,
        );
      }
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Feature Tiles Section...");
    try {
      // Flatten tileImages to upload in one batch
      const flatFiles: (File | null)[] = [];
      tileImages.forEach((row) => {
        row.forEach((cell) => {
          flatFiles.push(cell instanceof File ? cell : null);
        });
      });

      const uploadedUrls = await uploadFiles(flatFiles);

      // Reconstruct tileImages from uploaded batch URLs
      let uploadIndex = 0;
      const finalFeatures = formData.features.map((feat, fIdx) => {
        const finalImages = feat.images.map((_, sIdx) => {
          const cell = tileImages[fIdx][sIdx];
          const url =
            cell instanceof File ? uploadedUrls[uploadIndex] || "" : cell;
          uploadIndex++;
          return url;
        });
        return {
          title: feat.title,
          description: feat.description,
          images: finalImages,
        };
      });

      const payload = {
        ...formData,
        features: finalFeatures,
      };

      const body = sectionId
        ? { id: sectionId, content: payload }
        : { section: responseKey ?? "Integrations", content: payload };

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Feature Tiles section saved successfully!", {
          id: toastId,
        });
        setTileImages(finalFeatures.map((f) => [...f.images]));
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

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Feature Tiles Section (Pub Traditions)"
          description="Manage boutique gastro traditions, custom cards, descriptions, and the 3-image slide decks uploader."
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                <InputField
                  label="Heading (Regular)"
                  name="regularHeading"
                  value={formData.regularHeading}
                  onChange={handleChange}
                  placeholder="e.g. Discover Our"
                  required
                />
                <InputField
                  label="Heading (Italic Accent)"
                  name="italicHeading"
                  value={formData.italicHeading}
                  onChange={handleChange}
                  placeholder="e.g. Pub Traditions"
                  required
                />
                <InputField
                  label="Boutique Tag Label"
                  name="tagLabel"
                  value={formData.tagLabel}
                  onChange={handleChange}
                  placeholder="e.g. Boutique Gastro Experience"
                  required
                />
              </div>

              {/* Cards Grid */}
              <div className="flex flex-col gap-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Boutique Cards Manager (3 Cards Total)
                </h4>

                <div className="flex flex-col gap-8 mt-2">
                  {formData.features.map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className="flex flex-col gap-4 bg-gray-50/40 p-6 border border-gray-100 rounded-3xl shadow-sm relative"
                    >
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Card {fIdx + 1}: {feat.title || "Tradition Card"}
                      </span>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                          label="Tradition Title"
                          value={feat.title}
                          onChange={(e) =>
                            handleCardFieldChange(fIdx, "title", e.target.value)
                          }
                          placeholder="e.g. Sunday Roasts"
                          required
                        />

                        <TextAreaField
                          label="Short Description"
                          value={feat.description}
                          onChange={(e) =>
                            handleCardFieldChange(
                              fIdx,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="Tradition description..."
                          rows={2}
                        />
                      </div>

                      <div className="flex flex-col gap-3 mt-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
                          Slide Image Deck (3 Showcase Images Required)
                        </label>

                        <div className="flex flex-col gap-4 mt-1">
                          {[0, 1, 2].map((sIdx) => {
                            const imgVal = tileImages[fIdx][sIdx];
                            const preview =
                              imgVal instanceof File
                                ? URL.createObjectURL(imgVal)
                                : imgVal;
                            const name =
                              typeof imgVal === "string"
                                ? imgVal.split("/").pop() || `Slide ${sIdx + 1}`
                                : imgVal?.name || `Slide ${sIdx + 1}`;
                            return (
                              <div key={sIdx} className="flex flex-col gap-2">
                                <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">
                                  Slide Position {sIdx + 1}
                                </span>

                                {preview ? (
                                  <div className="flex items-center justify-between p-3.5 px-5 bg-white border border-gray-200 rounded-2xl transition-all hover:bg-gray-50/50">
                                    <div className="flex items-center gap-3.5 text-gray-700">
                                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                          src={preview}
                                          alt={`${feat.title} slide ${sIdx + 1}`}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                                          {name}
                                        </span>
                                        <span className="text-[9px] text-gray-400 font-semibold mt-0.5">
                                          {feat.title || "Tradition"} - Slide
                                          Position {sIdx + 1}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          fileInputRefs.current[fIdx][
                                            sIdx
                                          ]?.click()
                                        }
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                                      >
                                        Change
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => removeImage(fIdx, sIdx)}
                                        className="text-red-500 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
                                        title="Remove Image"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    onClick={() =>
                                      fileInputRefs.current[fIdx][sIdx]?.click()
                                    }
                                    className="w-full border-2 border-dashed border-gray-200 hover:border-blue-500 bg-white hover:bg-blue-50/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all group"
                                  >
                                    <CloudUpload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
                                    <p className="text-xs text-gray-500 font-semibold group-hover:text-blue-600">
                                      Drag and drop image here, or{" "}
                                      <span className="text-blue-500 hover:underline animate-pulse">
                                        browse
                                      </span>
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-1">
                                      PNG, JPG or WEBP (Slide {sIdx + 1})
                                    </p>
                                  </div>
                                )}
                                <input
                                  type="file"
                                  ref={(el) => {
                                    if (!fileInputRefs.current[fIdx])
                                      fileInputRefs.current[fIdx] = [];
                                    fileInputRefs.current[fIdx][sIdx] = el;
                                  }}
                                  onChange={(e) =>
                                    handleFileChange(fIdx, sIdx, e)
                                  }
                                  accept="image/*"
                                  className="hidden"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
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
