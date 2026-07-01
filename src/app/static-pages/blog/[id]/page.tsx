"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft,
  ChevronLeft,
  CloudUpload,
  Globe,
  Loader2,
  Tag,
  MapPin,
  Clock,
  Calendar,
  Eye,
  Trash2
} from "lucide-react";
import { PageHeader } from "@/app/components/PageHeader";
import { InputField } from "@/app/components/InputField";
import { TextAreaField } from "@/app/components/TextAreaField";
import { SaveButton } from "@/app/components/SaveButton";
import { uploadFiles } from "@/app/lib/uploadHelpers";
import Link from "next/link";
import toast from "react-hot-toast";

// Dynamically import React Quill to prevent SSR window reference error
const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => (
    <div className="h-72 w-full bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
      <Loader2 className="w-6 h-6 animate-spin mr-2" />
      Loading editor...
    </div>
  )
});
import "react-quill-new/dist/quill.snow.css";

interface Blog {
  id: string;
  title: string;
  slug: string;
  visibility: string;
  featuredImage: string | null;
  excerpt: string;
  content: string;
  area: string;
  readTime: string;
  tag: string;
  views: number;
  date: string;
  metaTitle?: string;
  metaDescription?: string;
  schema?: string;
  headingTag?: string;
}

const defaultFormData: Partial<Blog> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  area: "",
  readTime: "3 min read",
  tag: "",
  views: 0,
  visibility: "draft",
  date: "",
  metaTitle: "",
  metaDescription: "",
  schema: "",
  headingTag: "h1",
};

export default function BlogFormPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const isNew = id === "new";

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Blog>>(defaultFormData);
  const [selectedImage, setSelectedImage] = useState<File | string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew) {
      setFormData({
        ...defaultFormData,
        date: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric"
        })
      });
    } else {
      fetchBlogDetails();
    }
  }, [id]);

  const fetchBlogDetails = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/blogs/${id}`);
      const json = await res.json();
      if (json.success && json.data) {
        const blog = json.data;
        setFormData({
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          content: blog.content,
          area: blog.area,
          readTime: blog.readTime,
          tag: blog.tag,
          views: blog.views,
          visibility: blog.visibility,
          date: blog.date,
          metaTitle: blog.metaTitle || "",
          metaDescription: blog.metaDescription || "",
          schema: blog.schema || "",
        });
        setSelectedImage(blog.featuredImage);
      } else {
        toast.error("Failed to load blog details");
        router.push("/static-pages/blog");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while loading blog data");
      router.push("/static-pages/blog");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "views" ? Number(value) : value
    }));
  };

  const handleContentChange = (contentVal: string) => {
    setFormData(prev => ({ ...prev, content: contentVal }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const generateSlug = () => {
    if (!formData.title) return;
    const slugified = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData(prev => ({ ...prev, slug: slugified }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title?.trim()) return toast.error("Title is required");
    if (!formData.excerpt?.trim()) return toast.error("Excerpt description is required");
    if (!formData.content?.trim() || formData.content === "<p><br></p>") return toast.error("Blog content is required");

    setIsSaving(true);
    const toastId = toast.loading(isNew ? "Creating blog post..." : "Saving blog post...");

    try {
      let imageUrl = formData.featuredImage || null;
      if (selectedImage instanceof File) {
        const uploadResult = await uploadFiles([selectedImage]);
        imageUrl = uploadResult[0] || null;
      } else if (typeof selectedImage === "string") {
        imageUrl = selectedImage;
      } else if (selectedImage === null) {
        imageUrl = null;
      }

      const payload = {
        ...formData,
        image: imageUrl,
        ...(!isNew && { id })
      };

      const res = await fetch("/api/blogs", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        toast.success(isNew ? "Blog post created successfully!" : "Blog post saved successfully!", { id: toastId });
        router.push("/static-pages/blog");
        router.refresh();
      } else {
        toast.error(json.error || "Operation failed", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error during save", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const previewImage = selectedImage instanceof File ? URL.createObjectURL(selectedImage) : selectedImage;

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "clean"],
    ],
  };

  if (isLoading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center text-gray-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#475DB1]" />
        <span className="text-sm font-medium">Loading form details...</span>
      </div>
    );
  }

  return (
    <div className="w-full pb-20">
      
      {/* Back button and page header */}
      <div className="flex flex-col gap-4 mb-8">
        <Link
          href="/static-pages/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#475DB1] hover:text-[#3b4f98] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Blog Posts List
        </Link>
        
        <PageHeader
          title={isNew ? "Create Blog Post" : "Edit Blog Post"}
          description={isNew ? "Fill in details to release a new article on the Seven Stars blog." : `Updating details and content for "${formData.title}"`}
        />
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
        
        {/* Title & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Blog Post Title *"
            placeholder="e.g. Traditional Sunday Roasts near Wallingford"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-4">
              URL Slug
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. traditional-sunday-roasts"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="flex-1 px-6 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:outline-none focus:border-[#475DB1] focus:ring-1 focus:ring-[#475DB1] outline-none transition-all text-gray-800"
              />
              <button
                type="button"
                onClick={generateSlug}
                className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 text-xs font-bold px-6 rounded-2xl transition-colors cursor-pointer h-[54px] hover:border-gray-300 transition-all shrink-0"
              >
                Generate
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="flex flex-col gap-1.5 px-0.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-4">
            Featured Cover Image
          </label>
          {previewImage ? (
            <div className="flex items-center justify-between p-3.5 px-5 bg-white border border-gray-200 rounded-2xl transition-all hover:bg-gray-50/50 mt-1">
              <div className="flex items-center gap-3.5 text-gray-700">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 border border-gray-300/40 relative flex-shrink-0">
                  <img src={previewImage} alt="Featured Cover Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                    {selectedImage instanceof File ? selectedImage.name : (typeof selectedImage === "string" ? selectedImage.split("/").pop() : "Featured Cover Image")}
                  </span>
                  <span className="text-[9px] text-gray-400 font-semibold mt-0.5">
                    Cover Banner Image
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
                  onClick={() => setSelectedImage(null)}
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
              className="w-full border-2 border-dashed border-gray-200 hover:border-[#475DB1] bg-white hover:bg-[#475DB1]/5 rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all group mt-1"
            >
              <CloudUpload className="w-8 h-8 text-gray-400 group-hover:text-[#475DB1] transition-colors mb-2" />
              <p className="text-xs text-gray-500 font-semibold group-hover:text-[#475DB1]">
                Drag and drop image here, or <span className="text-[#475DB1] hover:underline animate-pulse">browse</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-1">WebP, PNG, JPEG (1920x1080 recommended)</p>
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

        {/* Excerpt */}
        <TextAreaField
          label="Excerpt Description * (Brief intro shown on index page list)"
          placeholder="Write a catchy 1-2 sentence hook for the blog index page..."
          name="excerpt"
          value={formData.excerpt}
          onChange={handleInputChange}
          required
          rows={3}
        />

        {/* Details Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InputField
            label="Category / Tag"
            placeholder="e.g. Gastronomy / Abingdon"
            name="tag"
            value={formData.tag}
            onChange={handleInputChange}
          />
          <InputField
            label="Geographic Area"
            placeholder="e.g. Abingdon"
            name="area"
            value={formData.area}
            onChange={handleInputChange}
          />
          <InputField
            label="Read Time"
            placeholder="e.g. 3 min read"
            name="readTime"
            value={formData.readTime}
            onChange={handleInputChange}
          />
          <InputField
            label="Publish Date"
            placeholder="e.g. 22 Jun 2026"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
          />
        </div>

        {/* Views & Visibility */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="SEO Meta Description (Optional)"
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleInputChange}
            placeholder="e.g. In-depth guide on Abingdon attractions..."
          />
          <div className="flex flex-col gap-1.5 px-0.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-4">
              Visibility Status
            </label>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:outline-none focus:border-[#475DB1] focus:ring-1 focus:ring-[#475DB1] text-gray-800 cursor-pointer h-[54px]"
            >
              <option value="draft">Draft (Hidden from client)</option>
              <option value="published">Published (Visible on client)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 px-0.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-4">
              Hero Headline Tag (SEO)
            </label>
            <select
              name="headingTag"
              value={formData.headingTag || "h1"}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:outline-none focus:border-[#475DB1] focus:ring-1 focus:ring-[#475DB1] text-gray-800 cursor-pointer h-[54px]"
            >
              <option value="h1">H1 (Recommended standard title tag)</option>
              <option value="h2">H2 (Alternative heading tag)</option>
              <option value="h3">H3 (Sub-heading tag)</option>
              <option value="h4">H4 (Sub-heading tag)</option>
              <option value="h5">H5 (Sub-heading tag)</option>
              <option value="h6">H6 (Sub-heading tag)</option>
            </select>
          </div>
        </div>

        {/* JSON-LD Schema */}
        <TextAreaField
          label="JSON-LD Schema Markup (Optional)"
          placeholder='e.g. { "@context": "https://schema.org", "@type": "BlogPosting", "headline": "..." }'
          name="schema"
          value={formData.schema}
          onChange={handleInputChange}
          rows={6}
        />

        {/* Quill Editor */}
        <div className="flex flex-col gap-1.5 px-0.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-4">
            Full Article Content *
          </label>
          <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              modules={quillModules}
              placeholder="Write the full body of the article here..."
              className="quill-editor"
            />
          </div>
          <style jsx global>{`
            .quill-editor .ql-toolbar.ql-snow {
              border: none;
              border-bottom: 1px solid #f3f4f6;
              padding: 12px;
              background-color: #f9fafb;
            }
            .quill-editor .ql-container.ql-snow {
              border: none;
              font-family: var(--font-inter), sans-serif;
              font-size: 14px;
              min-height: 250px;
              max-height: 450px;
              overflow-y: auto;
            }
            
            /* Custom labels inside Quill Header Dropdown */
            .quill-editor .ql-snow .ql-picker.ql-header .ql-picker-label::before,
            .quill-editor .ql-snow .ql-picker.ql-header .ql-picker-item::before {
              content: 'Normal' !important;
            }
            .quill-editor .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
            .quill-editor .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
              content: 'H1' !important;
            }
            .quill-editor .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
            .quill-editor .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
              content: 'H2' !important;
            }
            .quill-editor .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
            .quill-editor .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
              content: 'H3' !important;
            }
            .quill-editor .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
            .quill-editor .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
              content: 'H4' !important;
            }
            .quill-editor .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
            .quill-editor .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
              content: 'H5' !important;
            }
            .quill-editor .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
            .quill-editor .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
              content: 'H6' !important;
            }

            .quill-editor .ql-editor {
              padding: 20px;
              line-height: 1.6;
              color: #1f2937;
            }
            .quill-editor .ql-editor p {
              margin-bottom: 1rem;
            }
          `}</style>
        </div>



        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            href="/static-pages/blog"
            className="px-6 py-3.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl text-sm font-bold text-gray-500 cursor-pointer transition-colors flex items-center justify-center"
          >
            Cancel
          </Link>
          <SaveButton
            label={isNew ? "Create Post" : "Save Changes"}
            disabled={isSaving}
            type="submit"
          />
        </div>

      </form>

    </div>
  );
}
