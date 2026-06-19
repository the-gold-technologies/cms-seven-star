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
  infoHeading: "",
  infoHeadingItalic: "",
  infoDesc: "",
  locationTitle: "",
  addressLine1: "",
  addressLine2: "",
  phoneNumber: "",
  emailAddress: "",
  openingHours: [{ days: "", hours: "" }],
  mapEmbedUrl: "",
  mapHeading: "",
  mapDescription: "",
};

interface ContactInfoCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function ContactInfoCMS({
  sectionId,
  initialData,
  saveUrl = "/api/contact",
  responseKey = "ContactInfo",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: ContactInfoCMSProps) {
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

  useEffect(() => {
    if (initialData) {
      setFormData({ ...defaultFormData, ...initialData });
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey
            ? json.data?.[responseKey]
            : json.data;
          if (json.success && sectionData) {
            setFormData({ ...defaultFormData, ...sectionData });
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

  const addOpeningHour = () => {
    setFormData((prev) => ({
      ...prev,
      openingHours: [{ days: "", hours: "" }, ...prev.openingHours],
    }));
    toast.success("New opening hours card prepended to the top!");
  };

  const removeOpeningHour = (idx: number) => {
    if (formData.openingHours.length <= 1) {
      toast.error("At least one opening hours row is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      openingHours: prev.openingHours.filter((_, i) => i !== idx),
    }));
  };

  const handleCardFieldChange = (idx: number, field: string, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.openingHours];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, openingHours: updated };
    });
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.infoHeading?.trim()) errs.push("Heading Part 1 is required");
    if (!formData.infoHeadingItalic?.trim())
      errs.push("Italic Heading Part is required");
    if (!formData.infoDesc?.trim())
      errs.push("Description statement is required");
    if (!formData.locationTitle?.trim())
      errs.push("Location title / Pub name is required");
    if (!formData.addressLine1?.trim()) errs.push("Address line 1 is required");
    if (!formData.addressLine2?.trim()) errs.push("Address line 2 is required");
    if (!formData.phoneNumber?.trim()) errs.push("Phone number is required");
    if (!formData.emailAddress?.trim()) errs.push("Email address is required");
    if (!formData.mapEmbedUrl?.trim()) errs.push("Google Maps Embed URL is required");
    if (!formData.mapHeading?.trim()) errs.push("Map section heading is required");
    if (!formData.mapDescription?.trim()) errs.push("Map section description is required");

    formData.openingHours.forEach((item, idx) => {
      if (!item.days.trim())
        errs.push(`Opening Hours ${idx + 1} day description is required`);
      if (!item.hours.trim())
        errs.push(`Opening Hours ${idx + 1} time range is required`);
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving contact details...");
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
        toast.success("Contact details saved successfully!", { id: toastId });
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
          title="Contact Info & Hours"
          description="Manage main get-in-touch summaries, map locations, phone/email, and dynamic opening hours cards."
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
              {/* Heading Summary block */}
              <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Pillar Header & Subheading
                </span>

                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <InputField
                    label="Info Heading Part 1"
                    name="infoHeading"
                    value={formData.infoHeading}
                    onChange={handleChange}
                    placeholder="e.g. Get in"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Info Heading Part 2 (Italic)"
                    name="infoHeadingItalic"
                    value={formData.infoHeadingItalic}
                    onChange={handleChange}
                    placeholder="e.g. touch"
                    required
                    containerClassName="flex-1"
                  />
                </div>

                <TextAreaField
                  label="Atmospheric Summary Description"
                  name="infoDesc"
                  value={formData.infoDesc}
                  onChange={handleChange}
                  placeholder="Whether you're looking to book a table for Sunday roast..."
                  containerClassName="w-full"
                  rows={2}
                  required
                />
              </div>

              {/* Location & Contact Grid */}
              <div className="grid grid-cols-1 gap-8 items-start w-full">
                {/* Physical Location */}
                <div className="flex flex-col gap-5 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl flex-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Physical Address
                  </span>

                  <InputField
                    label="Pub/Location Title"
                    name="locationTitle"
                    value={formData.locationTitle}
                    onChange={handleChange}
                    placeholder="e.g. The Seven Stars"
                    required
                  />

                  <InputField
                    label="Address Line 1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="e.g. The Green, Marsh Baldon"
                    required
                  />

                  <InputField
                    label="Address Line 2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="e.g. Oxford, OX44 9LP"
                    required
                  />
                </div>

                {/* Map Configuration */}
                <div className="flex flex-col gap-5 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Map Configuration
                  </span>

                  <div className="flex flex-col md:flex-row gap-6 w-full">
                    <InputField
                      label="Map Section Heading"
                      name="mapHeading"
                      value={formData.mapHeading}
                      onChange={handleChange}
                      placeholder="e.g. Find Our Location"
                      required
                      containerClassName="flex-1"
                    />
                    <InputField
                      label="Map Section Description"
                      name="mapDescription"
                      value={formData.mapDescription}
                      onChange={handleChange}
                      placeholder="e.g. The Seven Stars at Marsh Baldon..."
                      required
                      containerClassName="flex-1"
                    />
                  </div>

                  <InputField
                    label="Google Maps Embed URL"
                    name="mapEmbedUrl"
                    value={formData.mapEmbedUrl}
                    onChange={handleChange}
                    placeholder="e.g. https://www.google.com/maps/embed?pb=..."
                    required
                  />
                </div>

                {/* Direct Communications */}
                <div className="flex flex-col gap-5 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl flex-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Direct Channels
                  </span>

                  <InputField
                    label="Telephone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="e.g. 01865 343337"
                    required
                  />

                  <InputField
                    label="Email Address"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    placeholder="e.g. info@sevenstarsmarshbaldon.co.uk"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Opening Hours Prependable block */}
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Opening Hours Schedule ({formData.openingHours.length})
                  </h4>
                  <button
                    type="button"
                    onClick={addOpeningHour}
                    className="text-xs text-blue-500 hover:text-blue-600 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Prepend Schedule Card
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
                  {formData.openingHours.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-4 bg-gray-50/40 p-5 border border-gray-100 rounded-3xl shadow-sm relative"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          Schedule Card {idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeOpeningHour(idx)}
                          className="text-red-500 hover:text-red-600 p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-all cursor-pointer"
                          title="Remove Row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <InputField
                        label="Days Description"
                        value={item.days}
                        onChange={(e) =>
                          handleCardFieldChange(idx, "days", e.target.value)
                        }
                        placeholder="e.g. Monday - Thursday"
                        required
                      />

                      <InputField
                        label="Hours Span"
                        value={item.hours}
                        onChange={(e) =>
                          handleCardFieldChange(idx, "hours", e.target.value)
                        }
                        placeholder="e.g. 12:00 - 23:00"
                        required
                      />
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
