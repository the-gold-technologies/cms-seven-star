"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/app/components/PageHeader";
import { SaveButton } from "@/app/components/SaveButton";
import { InputField } from "@/app/components/InputField";
import { TextAreaField } from "@/app/components/TextAreaField";
import { ImageUploadField } from "@/app/components/ImageUploadField";
import { uploadFiles } from "@/app/lib/uploadHelpers";
import { fetchWithCache } from "@/app/lib/apiCache";
import { Loader2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

// Dynamically import React Quill to prevent SSR window reference error
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-72 w-full bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
      <Loader2 className="w-6 h-6 animate-spin mr-2" />
      Loading editor...
    </div>
  ),
});
import "react-quill-new/dist/quill.snow.css";

const defaultFormData = {
  title: "Privacy Policy",
  introduction:
    "We value your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data and tell you about your privacy rights.",
  backgroundImage:
    "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/christmas-celebration-2.webp",
  content: "",
};

export default function PrivacyPolicyCMSPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [selectedImage, setSelectedImage] = useState<File | string | null>(
    null,
  );

  useEffect(() => {
    fetchWithCache("/api/privacy-policy")
      .then((json) => {
        if (json.success && json.data?.PrivacyPolicyContent) {
          const data = {
            ...defaultFormData,
            ...json.data.PrivacyPolicyContent,
          };
          setFormData(data);
          if (data.backgroundImage) {
            setSelectedImage(data.backgroundImage);
          }
        }
      })
      .catch((err) => {
        console.error("Error loading Privacy Policy:", err);
        toast.error("Failed to load Privacy Policy content.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuillChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Page Title is required");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Privacy Policy...");

    try {
      let imgUrl = formData.backgroundImage;

      // Upload background image if a new file is chosen
      if (selectedImage instanceof File) {
        const uploadedUrls = await uploadFiles([selectedImage]);
        if (uploadedUrls && uploadedUrls[0]) {
          imgUrl = uploadedUrls[0];
        }
      } else if (selectedImage === null) {
        imgUrl = "";
      } else if (typeof selectedImage === "string") {
        imgUrl = selectedImage;
      }

      const payload = {
        ...formData,
        backgroundImage: imgUrl,
      };

      const res = await fetch("/api/privacy-policy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "PrivacyPolicyContent",
          content: payload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Privacy Policy saved successfully!", { id: toastId });
        setFormData(payload);
        setSelectedImage(imgUrl);
      } else {
        toast.error(json.error || "Failed to save Privacy Policy.", {
          id: toastId,
        });
      }
    } catch (err) {
      console.error("Error saving Privacy Policy:", err);
      toast.error("Network error during save.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "clean"],
    ],
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <PageHeader
        title="Privacy Policy Page Content"
        description="Manage the legal terms, details of data collection, cookies notice, and user rights displayed on the website's Privacy Policy page."
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-6">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          General Page Layout & Hero Image
        </span>

        <InputField
          label="Page Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="e.g. Privacy Policy"
          required
        />

        <TextAreaField
          label="Page Introduction / Subtitle"
          name="introduction"
          value={formData.introduction}
          onChange={handleInputChange}
          placeholder="A brief opening statement..."
          rows={3}
        />

        <div className="mt-2">
          <ImageUploadField
            label="Hero Background Image"
            images={selectedImage ? [selectedImage] : []}
            onImagesChange={(imgs) => setSelectedImage(imgs[0] || null)}
            maxImages={1}
            tooltip="Choose a dark, atmospheric image to serve as the background for the page hero section."
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Detailed Content Clauses
          </label>
          <div className="quill-editor">
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleQuillChange}
              modules={quillModules}
              placeholder="Write the detailed Privacy Policy terms and conditions..."
            />
          </div>
          <style>{`
            .quill-editor .ql-toolbar.ql-snow {
              border-top-left-radius: 12px;
              border-top-right-radius: 12px;
              border-color: #f1f5f9;
              background-color: #f8fafc;
            }
            .quill-editor .ql-container.ql-snow {
              border-bottom-left-radius: 12px;
              border-bottom-right-radius: 12px;
              border-color: #f1f5f9;
              min-height: 350px;
              font-family: inherit;
              font-size: 15px;
            }
            .quill-editor .ql-editor {
              min-height: 350px;
            }
          `}</style>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
          <SaveButton
            onClick={handleSave}
            disabled={isSaving}
            className="w-44 h-12 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
