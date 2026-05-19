"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import {
  Plus,
  Trash2,
  BookOpen,
  FileText,
  ArrowRight,
  ArrowLeft,
  CloudUpload,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { uploadFiles } from "@/lib/uploadHelpers";

interface MenuItem {
  name: string;
  price: string;
  desc?: string;
}

interface MenuCategory {
  name: string;
  subtitle?: string;
  items: MenuItem[];
}

interface MenuPage {
  categories: MenuCategory[];
}

interface MenuSection {
  id: string;
  title: string;
  pdf: string;
  pages: MenuPage[];
}

const defaultFormData = {
  menuSections: [] as MenuSection[],
  sectionNumber: "",
  tagline: "",
  headingPart1: "",
  headingItalicHighlight: "",
  description: "",
  locationName: "",
  locationCounty: "",
  activeSectionSubtitle: "",
  ctaText: "",
  ctaLink: "",
};

interface MenuBookCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function MenuBookCMS({
  sectionId,
  initialData,
  saveUrl = "/api/menu",
  responseKey = "MenuBook",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: MenuBookCMSProps) {
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

  // Active section tab & page selection states
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [activePageIdx, setActivePageIdx] = useState(0);

  // Maintain separate upload state arrays for each of the menu categories (PDFs)
  const [selectedPdfs, setSelectedPdfs] = useState<(File | string)[]>([]);

  useEffect(() => {
    if (initialData) {
      const data = { ...defaultFormData, ...initialData };
      setFormData(data);
      if (data.menuSections) {
        setSelectedPdfs(data.menuSections.map((s) => s.pdf || ""));
      }
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey
            ? json.data?.[responseKey]
            : json.data;
          if (json.success && sectionData) {
            const data = { ...defaultFormData, ...sectionData };
            setFormData(data);
            if (data.menuSections) {
              setSelectedPdfs(data.menuSections.map((s: any) => s.pdf || ""));
            }
          }
        })
        .catch(console.error);
    }
  }, [initialData, saveUrl, responseKey]);

  const handleSectionPdfChange = (val: string) => {
    setFormData((prev) => {
      const updated = [...prev.menuSections];
      updated[activeSectionIdx] = { ...updated[activeSectionIdx], pdf: val };
      return { ...prev, menuSections: updated };
    });
  };

  const handlePdfFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        toast.error("Please upload a valid PDF file!");
        return;
      }
      setSelectedPdfs((prev) => {
        const updated = [...prev];
        updated[index] = file;
        return updated;
      });
    }
  };

  const removePdfFile = (index: number) => {
    setSelectedPdfs((prev) => {
      const updated = [...prev];
      updated[index] = "";
      return updated;
    });
  };

  // Section (Category) level methods
  const addSection = () => {
    const title = prompt(
      "Enter the name of your new Menu Category (e.g. Kids Menu, Christmas Menu):",
    );
    if (!title || !title.trim()) return;

    const id = title.toLowerCase().replace(/[^a-z0-9]/g, "-");
    if (formData.menuSections.some((s) => s.id === id)) {
      toast.error("A category with this title already exists!");
      return;
    }

    const newSection: MenuSection = {
      id,
      title: title.trim(),
      pdf: "",
      pages: [
        {
          categories: [
            {
              name: "Welcome",
              items: [],
            },
          ],
        },
      ],
    };

    setFormData((prev) => ({
      ...prev,
      menuSections: [...prev.menuSections, newSection],
    }));
    setSelectedPdfs((prev) => [...prev, ""]);
    setActiveSectionIdx(formData.menuSections.length);
    setActivePageIdx(0);
    toast.success(`Category "${title}" added successfully!`);
  };

  const deleteSection = (index: number) => {
    if (formData.menuSections.length <= 1) {
      toast.error("You must have at least one menu category!");
      return;
    }
    const sec = formData.menuSections[index];
    if (
      !confirm(
        `Are you sure you want to delete the entire "${sec.title}" category? This will delete all of its pages, categories, and dishes.`,
      )
    ) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      menuSections: prev.menuSections.filter((_, i) => i !== index),
    }));
    setSelectedPdfs((prev) => prev.filter((_, i) => i !== index));
    setActiveSectionIdx(0);
    setActivePageIdx(0);
    toast.success(`Category "${sec.title}" deleted.`);
  };

  // Page level methods
  const addPage = () => {
    setFormData((prev) => {
      const updated = [...prev.menuSections];
      const pages = [...updated[activeSectionIdx].pages, { categories: [] }];
      updated[activeSectionIdx] = { ...updated[activeSectionIdx], pages };
      return { ...prev, menuSections: updated };
    });
    setActivePageIdx(formData.menuSections[activeSectionIdx].pages.length);
    toast.success("Page added to menu!");
  };

  const deletePage = (pIdx: number) => {
    if (formData.menuSections[activeSectionIdx].pages.length <= 1) {
      toast.error("Menu section must have at least 1 page!");
      return;
    }
    setFormData((prev) => {
      const updated = [...prev.menuSections];
      const pages = updated[activeSectionIdx].pages.filter(
        (_, i) => i !== pIdx,
      );
      updated[activeSectionIdx] = { ...updated[activeSectionIdx], pages };
      return { ...prev, menuSections: updated };
    });
    setActivePageIdx(0);
    toast.success("Page deleted!");
  };

  // Category level methods
  const addCategory = () => {
    setFormData((prev) => {
      const updated = [...prev.menuSections];
      const pages = [...updated[activeSectionIdx].pages];
      const categories = [
        ...pages[activePageIdx].categories,
        { name: "New Category", items: [] },
      ];
      pages[activePageIdx] = { ...pages[activePageIdx], categories };
      updated[activeSectionIdx] = { ...updated[activeSectionIdx], pages };
      return { ...prev, menuSections: updated };
    });
    toast.success("Category added!");
  };

  const deleteCategory = (catIdx: number) => {
    setFormData((prev) => {
      const updated = [...prev.menuSections];
      const pages = [...updated[activeSectionIdx].pages];
      const categories = pages[activePageIdx].categories.filter(
        (_, i) => i !== catIdx,
      );
      pages[activePageIdx] = { ...pages[activePageIdx], categories };
      updated[activeSectionIdx] = { ...updated[activeSectionIdx], pages };
      return { ...prev, menuSections: updated };
    });
    toast.success("Category deleted!");
  };

  const handleCategoryNameChange = (catIdx: number, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.menuSections];
      const pages = [...updated[activeSectionIdx].pages];
      const categories = [...pages[activePageIdx].categories];
      categories[catIdx] = { ...categories[catIdx], name: val };
      pages[activePageIdx] = { ...pages[activePageIdx], categories };
      updated[activeSectionIdx] = { ...updated[activeSectionIdx], pages };
      return { ...prev, menuSections: updated };
    });
  };

  const handleCategorySubtitleChange = (catIdx: number, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.menuSections];
      const pages = [...updated[activeSectionIdx].pages];
      const categories = [...pages[activePageIdx].categories];
      categories[catIdx] = { ...categories[catIdx], subtitle: val };
      pages[activePageIdx] = { ...pages[activePageIdx], categories };
      updated[activeSectionIdx] = { ...updated[activeSectionIdx], pages };
      return { ...prev, menuSections: updated };
    });
  };

  // Dish level methods
  const addDish = (catIdx: number) => {
    setFormData((prev) => {
      const updated = [...prev.menuSections];
      const pages = [...updated[activeSectionIdx].pages];
      const categories = [...pages[activePageIdx].categories];
      const items = [...categories[catIdx].items, { name: "", price: "" }];
      categories[catIdx] = { ...categories[catIdx], items };
      pages[activePageIdx] = { ...pages[activePageIdx], categories };
      updated[activeSectionIdx] = { ...updated[activeSectionIdx], pages };
      return { ...prev, menuSections: updated };
    });
  };

  const deleteDish = (catIdx: number, dishIdx: number) => {
    setFormData((prev) => {
      const updated = [...prev.menuSections];
      const pages = [...updated[activeSectionIdx].pages];
      const categories = [...pages[activePageIdx].categories];
      const items = categories[catIdx].items.filter((_, i) => i !== dishIdx);
      categories[catIdx] = { ...categories[catIdx], items };
      pages[activePageIdx] = { ...pages[activePageIdx], categories };
      updated[activeSectionIdx] = { ...updated[activeSectionIdx], pages };
      return { ...prev, menuSections: updated };
    });
  };

  const handleDishFieldChange = (
    catIdx: number,
    dishIdx: number,
    field: keyof MenuItem,
    val: string,
  ) => {
    setFormData((prev) => {
      const updated = [...prev.menuSections];
      const pages = [...updated[activeSectionIdx].pages];
      const categories = [...pages[activePageIdx].categories];
      const items = [...categories[catIdx].items];
      items[dishIdx] = { ...items[dishIdx], [field]: val };
      categories[catIdx] = { ...categories[catIdx], items };
      pages[activePageIdx] = { ...pages[activePageIdx], categories };
      updated[activeSectionIdx] = { ...updated[activeSectionIdx], pages };
      return { ...prev, menuSections: updated };
    });
  };

  const handleSave = async () => {
    // Validate
    const errs: string[] = [];
    formData.menuSections.forEach((s) => {
      if (!s.title?.trim()) errs.push(`Section Title is required`);

      s.pages.forEach((p, pIdx) => {
        p.categories.forEach((cat, catIdx) => {
          if (!cat.name?.trim())
            errs.push(
              `${s.title} Page ${pIdx + 1} Category ${catIdx + 1} Name is required`,
            );
          cat.items.forEach((dish, dishIdx) => {
            if (!dish.name?.trim())
              errs.push(
                `${s.title} Page ${pIdx + 1} Cat "${cat.name}" Dish ${dishIdx + 1} Name is required`,
              );
            if (!dish.price?.trim())
              errs.push(
                `${s.title} Page ${pIdx + 1} Cat "${cat.name}" Dish "${dish.name}" Price is required`,
              );
          });
        });
      });
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving 3D Menu Book Sheets...");
    try {
      const updatedSections = [...formData.menuSections];

      // Sequential PDF upload
      for (let i = 0; i < updatedSections.length; i++) {
        const item = selectedPdfs[i];
        if (item instanceof File) {
          const urls = await uploadFiles([item]);
          updatedSections[i].pdf = urls[0] || "";
        } else {
          updatedSections[i].pdf = item || "";
        }
      }

      const payload = {
        ...formData,
        menuSections: updatedSections,
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
        toast.success("Menu book sheets saved successfully!", { id: toastId });
        setFormData(payload);
        setSelectedPdfs(payload.menuSections.map((s) => s.pdf || ""));
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

  const activeSection = formData.menuSections[activeSectionIdx];
  const activePage = activeSection?.pages[activePageIdx] || { categories: [] };

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="3D Menu Book Sheets Editor"
          description="Manage nested lists of categories, descriptions, individual dishes, prices, and PDF download files."
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
              {/* Global Configuration */}
              <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Settings className="w-3.5 h-3.5 text-blue-500" />
                  Header & Global Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InputField
                    label="Section Number"
                    value={formData.sectionNumber || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sectionNumber: e.target.value,
                      })
                    }
                    placeholder="e.g. 05"
                  />
                  <InputField
                    label="Tagline"
                    value={formData.tagline || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, tagline: e.target.value })
                    }
                    placeholder="e.g. Seasonal Selection"
                  />
                  <InputField
                    label="Heading (Part 1)"
                    value={formData.headingPart1 || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, headingPart1: e.target.value })
                    }
                    placeholder="e.g. Our"
                  />
                  <InputField
                    label="Heading (Italic Highlight)"
                    value={formData.headingItalicHighlight || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        headingItalicHighlight: e.target.value,
                      })
                    }
                    placeholder="e.g. Menu"
                  />
                  <InputField
                    label="Location Name"
                    value={formData.locationName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, locationName: e.target.value })
                    }
                    placeholder="e.g. Marsh Baldon"
                  />
                  <InputField
                    label="Location County"
                    value={formData.locationCounty || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        locationCounty: e.target.value,
                      })
                    }
                    placeholder="e.g. Oxfordshire"
                  />
                  <InputField
                    label="Active Section Subtitle"
                    value={formData.activeSectionSubtitle || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        activeSectionSubtitle: e.target.value,
                      })
                    }
                    placeholder="e.g. Gastronomic Journey"
                  />
                  <InputField
                    label="CTA Button Text"
                    value={formData.ctaText || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, ctaText: e.target.value })
                    }
                    placeholder="e.g. Enquire For Private Dining"
                  />
                  <InputField
                    label="CTA Button Link"
                    value={formData.ctaLink || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, ctaLink: e.target.value })
                    }
                    placeholder="e.g. /contact"
                  />
                  <div className="md:col-span-2 lg:col-span-3">
                    <InputField
                      label="Description"
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="e.g. At The Seven Stars..."
                    />
                  </div>
                </div>
              </div>

              {/* Premium Tabs for Section Menu Sheet selection */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <div className="flex items-center flex-wrap gap-2">
                  <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-1 flex-wrap">
                    {formData.menuSections.map((sec, i) => (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => {
                          setActiveSectionIdx(i);
                          setActivePageIdx(0);
                        }}
                        className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          activeSectionIdx === i
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        {sec.title}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addSection}
                    className="flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Category
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={formData.menuSections.length <= 1}
                    onClick={() => deleteSection(activeSectionIdx)}
                    className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 disabled:opacity-40 disabled:hover:bg-red-50 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Active Category
                  </button>
                </div>
              </div>

              {/* Title & PDF Uploader */}
              {activeSection && (
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-slate-50/50 p-4 border border-slate-200/50 rounded-2xl w-full">
                  <div className="flex flex-col gap-1 flex-1 w-full">
                    <span className="text-xs font-bold text-gray-600">
                      Category Name
                    </span>
                    <input
                      type="text"
                      value={activeSection.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => {
                          const updated = [...prev.menuSections];
                          updated[activeSectionIdx] = {
                            ...updated[activeSectionIdx],
                            title: val,
                          };
                          return { ...prev, menuSections: updated };
                        });
                      }}
                      placeholder="e.g. Main Menu"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-700 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1 w-full md:w-auto">
                    <span className="text-xs font-bold text-gray-600">
                      Upload PDF Menu File
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) =>
                          handlePdfFileChange(activeSectionIdx, e)
                        }
                        className="hidden"
                        id={`pdf-file-input-${activeSectionIdx}`}
                      />
                      {selectedPdfs[activeSectionIdx] ? (
                        <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <span className="text-[10px] text-gray-700 font-bold max-w-[120px] truncate">
                            {selectedPdfs[activeSectionIdx] instanceof File
                              ? (selectedPdfs[activeSectionIdx] as File).name
                              : (selectedPdfs[activeSectionIdx] as string)
                                  .split("/")
                                  .pop()}
                          </span>
                          <button
                            type="button"
                            onClick={() => removePdfFile(activeSectionIdx)}
                            className="text-red-500 hover:text-red-600 p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            document
                              .getElementById(
                                `pdf-file-input-${activeSectionIdx}`,
                              )
                              ?.click()
                          }
                          className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                        >
                          <CloudUpload className="w-4 h-4 text-gray-400" />{" "}
                          Choose PDF File
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Page Selection Bar */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200/60 p-4 rounded-2xl w-full">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-bold text-slate-800">
                    Menu Sheet Pages ({activeSection?.pages.length || 0})
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex bg-white border border-gray-200 p-1 rounded-xl items-center gap-1">
                    <button
                      type="button"
                      disabled={activePageIdx === 0}
                      onClick={() => setActivePageIdx((p) => p - 1)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-gray-700 px-3">
                      Page {activePageIdx + 1} of{" "}
                      {activeSection?.pages.length || 1}
                    </span>
                    <button
                      type="button"
                      disabled={
                        activePageIdx >= (activeSection?.pages.length || 1) - 1
                      }
                      onClick={() => setActivePageIdx((p) => p + 1)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={addPage}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
                    >
                      Add Page
                    </button>
                    <button
                      type="button"
                      disabled={(activeSection?.pages.length || 1) <= 1}
                      onClick={() => deletePage(activePageIdx)}
                      className="bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold px-3 py-2 rounded-xl transition-all disabled:opacity-45 cursor-pointer active:scale-95"
                    >
                      Delete Page
                    </button>
                  </div>
                </div>
              </div>

              {/* Categories & Dishes Grid */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Categories on Page {activePageIdx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={addCategory}
                    className="flex items-center gap-1.5 text-blue-500 hover:text-blue-600 text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Category Card
                  </button>
                </div>

                {activePage.categories.length === 0 ? (
                  <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center">
                    <BookOpen className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400 font-bold">
                      No categories added on this page yet.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-8">
                    {activePage.categories.map((cat, catIdx) => (
                      <div
                        key={catIdx}
                        className="bg-white border border-gray-200 hover:border-gray-300 rounded-3xl p-6 flex flex-col gap-6 transition-all"
                      >
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                          <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                            Category #{catIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => deleteCategory(catIdx)}
                            className="text-red-500 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-xl"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Title & optional subtitle */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <InputField
                            label="Category Name"
                            value={cat.name}
                            onChange={(e) =>
                              handleCategoryNameChange(catIdx, e.target.value)
                            }
                            placeholder="e.g. Small Plates"
                            required
                          />
                          <InputField
                            label="Category Subtitle (Optional)"
                            value={cat.subtitle || ""}
                            onChange={(e) =>
                              handleCategorySubtitleChange(
                                catIdx,
                                e.target.value,
                              )
                            }
                            placeholder="e.g. Served with Yorkshire Pudding..."
                          />
                        </div>

                        {/* Dishes items inside Category */}
                        <div className="flex flex-col gap-4 bg-gray-50/50 p-6 border border-gray-100 rounded-2xl">
                          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                              Dishes / Menu Items ({cat.items.length})
                            </span>
                            <button
                              type="button"
                              onClick={() => addDish(catIdx)}
                              className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-xs font-bold cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Dish
                            </button>
                          </div>

                          {cat.items.length === 0 ? (
                            <p className="text-[10px] text-gray-400 italic text-center py-2">
                              No dishes in this category. Click Add Dish above
                              to start.
                            </p>
                          ) : (
                            <div className="flex flex-col gap-4">
                              {cat.items.map((dish, dishIdx) => (
                                <div
                                  key={dishIdx}
                                  className="flex flex-col sm:flex-row gap-4 bg-white p-4 border border-gray-200 rounded-2xl relative animate-in fade-in duration-300"
                                >
                                  <button
                                    type="button"
                                    onClick={() => deleteDish(catIdx, dishIdx)}
                                    className="absolute -top-1.5 -right-1.5 sm:top-4 sm:right-4 text-red-500 hover:text-red-600 p-1 bg-red-50 hover:bg-red-100 rounded-lg active:scale-95"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>

                                  <div className="flex-1">
                                    <InputField
                                      label="Dish Name"
                                      value={dish.name}
                                      onChange={(e) =>
                                        handleDishFieldChange(
                                          catIdx,
                                          dishIdx,
                                          "name",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="e.g. Marinated Olives (VG) (GF)"
                                      required
                                    />
                                  </div>
                                  <div className="w-full sm:w-28 shrink-0">
                                    <InputField
                                      label="Price"
                                      value={dish.price}
                                      onChange={(e) =>
                                        handleDishFieldChange(
                                          catIdx,
                                          dishIdx,
                                          "price",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="e.g. £4.95"
                                      required
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <InputField
                                      label="Short Description (Optional)"
                                      value={dish.desc || ""}
                                      onChange={(e) =>
                                        handleDishFieldChange(
                                          catIdx,
                                          dishIdx,
                                          "desc",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="e.g. Served with sourdough"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
