"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Sparkles, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

const defaultFormData = {
  timelineSteps: [
    {
      title: "",
      subtitle: "",
      desc: "",
      gridClass: "",
      lines: { mobile: "none", tablet: "none", desktop: "none" },
    },
  ],
};

interface StoryTimelineCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function StoryTimelineCMS({
  sectionId,
  initialData,
  saveUrl = "/api/our-story",
  responseKey = "StoryTimeline",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: StoryTimelineCMSProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
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

  useEffect(() => {
    if (initialData) {
      setFormData({ ...defaultFormData, ...initialData });
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey ? json.data?.[responseKey] : json.data;
          if (json.success && sectionData) {
            setFormData({ ...defaultFormData, ...sectionData });
          }
        })
        .catch(console.error);
    }
  }, [initialData, saveUrl, responseKey]);

  const addTimelineStep = () => {
    setFormData((prev) => ({
      ...prev,
      timelineSteps: [
        {
          title: "",
          subtitle: "",
          desc: "",
          gridClass: "col-span-1 md:col-span-2 lg:col-span-2",
          lines: { mobile: "none", tablet: "none", desktop: "none" },
        },
        ...prev.timelineSteps,
      ],
    }));
    toast.success("New timeline step card prepended to the top!");
  };

  const removeTimelineStep = (idx: number) => {
    if (formData.timelineSteps.length <= 1) {
      toast.error("At least one timeline step is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      timelineSteps: prev.timelineSteps.filter((_, i) => i !== idx),
    }));
  };

  const handleCardFieldChange = (idx: number, field: string, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.timelineSteps];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, timelineSteps: updated };
    });
  };

  const handleLineFieldChange = (idx: number, platform: string, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.timelineSteps];
      const updatedLines = { ...updated[idx].lines, [platform]: value };
      updated[idx] = { ...updated[idx], lines: updatedLines };
      return { ...prev, timelineSteps: updated };
    });
  };

  const handleSave = async () => {
    const errs: string[] = [];
    formData.timelineSteps.forEach((item, idx) => {
      if (!item.title.trim()) errs.push(`Timeline step ${idx + 1} date/title is required`);
      if (!item.subtitle.trim()) errs.push(`Timeline step ${idx + 1} mission/subtitle is required`);
      if (!item.desc.trim()) errs.push(`Timeline step ${idx + 1} description is required`);
      if (!item.gridClass.trim()) errs.push(`Timeline step ${idx + 1} CSS grid class is required`);
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving timeline steps...");
    try {
      const payload = {
        ...formData,
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
        toast.success("Timeline steps saved successfully!", { id: toastId });
        setFormData(payload);
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

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Story Timeline Milestones"
          description="Prepend and configure chronological milestone cards, connect lines, and grid offsets."
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
              
              {/* Timeline Prepend block */}
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Chronological Steps ({formData.timelineSteps.length})
                  </h4>
                  <button
                    type="button"
                    onClick={addTimelineStep}
                    className="text-xs text-blue-500 hover:text-blue-600 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Prepend Step Card
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                  {formData.timelineSteps.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-5 bg-gray-50/40 p-6 border border-gray-100 rounded-3xl shadow-sm relative text-left"
                    >
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block">
                          Milestone Step {idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeTimelineStep(idx)}
                          className="text-red-500 hover:text-red-600 p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-all cursor-pointer"
                          title="Remove Step"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 w-full">
                        <InputField
                          label="Timeline Date (e.g. Late 2012)"
                          value={item.title}
                          onChange={(e) => handleCardFieldChange(idx, "title", e.target.value)}
                          placeholder="e.g. Late 2012"
                          required
                          containerClassName="flex-1"
                        />
                        
                        <InputField
                          label="Subtitle label (e.g. Closure)"
                          value={item.subtitle}
                          onChange={(e) => handleCardFieldChange(idx, "subtitle", e.target.value)}
                          placeholder="e.g. Closure"
                          required
                          containerClassName="flex-1"
                        />
                      </div>

                      <TextAreaField
                        label="Milestone Description Summary"
                        value={item.desc}
                        onChange={(e) => handleCardFieldChange(idx, "desc", e.target.value)}
                        placeholder="Detail the events that transpired in this period..."
                        rows={3}
                        required
                      />

                      <InputField
                        label="Grid Span Class (Offsets & Sizing)"
                        value={item.gridClass}
                        onChange={(e) => handleCardFieldChange(idx, "gridClass", e.target.value)}
                        placeholder="e.g. col-span-1 md:col-span-2 lg:col-span-2 lg:col-start-1..."
                        required
                      />

                      {/* Directional Lines block */}
                      <div className="flex flex-col gap-3 bg-white p-4 border border-gray-100 rounded-2xl">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block border-b border-gray-50 pb-1.5">
                          Connector Lines Direction
                        </span>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-gray-400">Mobile</label>
                            <select
                              value={item.lines?.mobile || "none"}
                              onChange={(e) => handleLineFieldChange(idx, "mobile", e.target.value)}
                              className="bg-gray-50/50 border border-gray-200 rounded-lg p-1 text-[10px] focus:outline-none"
                            >
                              <option value="none">None</option>
                              <option value="down">Down</option>
                            </select>
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-gray-400">Tablet</label>
                            <select
                              value={item.lines?.tablet || "none"}
                              onChange={(e) => handleLineFieldChange(idx, "tablet", e.target.value)}
                              className="bg-gray-50/50 border border-gray-200 rounded-lg p-1 text-[10px] focus:outline-none"
                            >
                              <option value="none">None</option>
                              <option value="right">Right</option>
                              <option value="left">Left</option>
                              <option value="down">Down</option>
                              <option value="down-right">Down-Right</option>
                            </select>
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-gray-400">Desktop</label>
                            <select
                              value={item.lines?.desktop || "none"}
                              onChange={(e) => handleLineFieldChange(idx, "desktop", e.target.value)}
                              className="bg-gray-50/50 border border-gray-200 rounded-lg p-1 text-[10px] focus:outline-none"
                            >
                              <option value="none">None</option>
                              <option value="right">Right</option>
                              <option value="left">Left</option>
                              <option value="down">Down</option>
                              <option value="down-left">Down-Left</option>
                            </select>
                          </div>
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
