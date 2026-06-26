"use client";

import { useState, useRef, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { CloudUpload, Trash2, Plus, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

const defaultFormData = {
  tagline: "Culinary Delights",
  heading: "Download Our",
  headingHighlight: "Festive Menus",
  menusList: [
    {
      title: "Festive Party Menu",
      subtitle: "Corporate Events & Gatherings",
      description: "Our Festive Menu Is Here! Book Your Table and Enjoy Holiday Favorites! Don’t forget if you book your Christmas Party before the end of October 2025 you will receive a £20 voucher to use towards your booking. Minimum of 8 people dining and booking made before end of October 2025.",
      link: "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/Festive-Christmas-Menu.pdf",
      image: "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/christmas-celebration-2.webp",
      highlightsString: "Smoked Salmon Starter, Traditional Roast Turkey, Spiced Plum Pudding",
    },
    {
      title: "Christmas Day Menu",
      subtitle: "The Main Event on December 25th",
      description: "Indulge in our Special Christmas Menu: From Turkey to Truffles! Why Cook on Christmas Day when we can do it for you? Book your Christmas Lunch with us here at Seven Stars instead.",
      link: "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/Christmas-Day-Menu.pdf",
      image: "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/25-dec.webp",
      highlightsString: "Pan-Seared Scallops, Aged Beef Wellington, Decadent Chocolate Delice",
    },
    {
      title: "Children's Festive Menu",
      subtitle: "Special Treats for Younger Guests",
      description: "To make Christmas extra special for families, we’ve prepared a dedicated children’s menu — light, delicious, and perfect for younger guests.",
      link: "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/Childrens-Christmas-Menu-2.pdf",
      image: "https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2025/09/children-christmas.webp",
      highlightsString: "Mini Roast Turkey Dinner, Festive Mac & Cheese, Ice Cream Sundae",
    }
  ]
};

export function ChristmasMenusCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [menuImages, setMenuImages] = useState<(File | string)[]>([]);
  const [menuPdfs, setMenuPdfs] = useState<(File | string)[]>([]);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const pdfInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const saveUrl = "/api/christmas";
  const responseKey = "ChristmasMenus";

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.[responseKey];
        if (json.success && sectionData) {
          const data = { ...defaultFormData, ...sectionData };
          setFormData(data);
          setMenuImages(data.menusList.map((m: any) => m.image || ""));
          setMenuPdfs(data.menusList.map((m: any) => m.link || ""));
        } else {
          setMenuImages(defaultFormData.menusList.map((m) => m.image));
          setMenuPdfs(defaultFormData.menusList.map((m) => m.link));
        }
      })
      .catch(console.error);
  }, []);

  const handleChangeHeader = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeMenuList = (index: number, field: string, value: string) => {
    const updated = [...formData.menusList];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, menusList: updated }));
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const updated = [...menuImages];
      updated[index] = e.target.files[0];
      setMenuImages(updated);
    }
  };

  const handlePdfChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const updated = [...menuPdfs];
      updated[index] = e.target.files[0];
      setMenuPdfs(updated);
    }
  };

  const removeImage = (index: number) => {
    const updated = [...menuImages];
    updated[index] = "";
    setMenuImages(updated);
  };

  const removePdf = (index: number) => {
    const updated = [...menuPdfs];
    updated[index] = "";
    setMenuPdfs(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Menus Showcase...");
    try {
      const uploadedImageUrls = await uploadFiles(menuImages);
      const uploadedPdfUrls = await uploadFiles(menuPdfs);
      
      const savedMenusList = formData.menusList.map((menu, i) => {
        const imgUrl = menuImages[i] instanceof File ? uploadedImageUrls[i] || "" : menuImages[i] as string;
        const pdfUrl = menuPdfs[i] instanceof File ? uploadedPdfUrls[i] || "" : menuPdfs[i] as string;
        return {
          ...menu,
          image: imgUrl,
          link: pdfUrl,
          highlights: menu.highlightsString.split(",").map(item => item.trim()).filter(Boolean),
        };
      });

      const payload = {
        tagline: formData.tagline,
        heading: formData.heading,
        headingHighlight: formData.headingHighlight,
        menusList: savedMenusList,
      };

      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: responseKey, content: payload }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Menus section saved successfully!", { id: toastId });
        setFormData({
          ...payload,
          menusList: payload.menusList.map((m: any) => ({
            ...m,
            highlightsString: m.highlights.join(", ")
          }))
        });
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
      <SectionHeader
        title="Festive Menus Downloads"
        description="Manage the menu headings, PDF links, display images, and highlight points for all 3 seasonal menus."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="flex flex-col gap-8 pt-6">
          <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                label="Section Tagline"
                name="tagline"
                value={formData.tagline}
                onChange={handleChangeHeader}
              />
              <InputField
                label="Section Heading"
                name="heading"
                value={formData.heading}
                onChange={handleChangeHeader}
              />
              <InputField
                label="Heading Highlight (Italic text)"
                name="headingHighlight"
                value={formData.headingHighlight}
                onChange={handleChangeHeader}
              />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {formData.menusList.map((menu, i) => {
              const preview = menuImages[i] instanceof File ? URL.createObjectURL(menuImages[i] as File) : menuImages[i] as string;
              const imgName = typeof menuImages[i] === "string" ? (menuImages[i] as string).split("/").pop() || "Menu Image" : (menuImages[i] as File)?.name;

              return (
                <div key={i} className="flex flex-col gap-6 bg-gray-50/10 border border-gray-100 p-6 rounded-2xl">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest pb-1 border-b border-gray-200/50">
                    Menu Block #{i + 1} - {menu.title || "Untitled Menu"}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Menu Tab Title"
                      value={menu.title}
                      onChange={(e) => handleChangeMenuList(i, "title", e.target.value)}
                    />
                    <InputField
                      label="Menu Subtitle"
                      value={menu.subtitle}
                      onChange={(e) => handleChangeMenuList(i, "subtitle", e.target.value)}
                    />
                  </div>

                  <TextAreaField
                    label="Description Text"
                    value={menu.description}
                    onChange={(e) => handleChangeMenuList(i, "description", e.target.value)}
                    rows={2}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        PDF Menu Document
                      </span>

                      {menuPdfs[i] ? (
                        <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl">
                          <div className="flex items-center gap-3 text-gray-700">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                              <span>📄</span>
                            </div>
                            <span className="text-xs font-bold text-gray-900 truncate max-w-xs">{typeof menuPdfs[i] === "string" ? (menuPdfs[i] as string).split("/").pop() || "Menu Document" : (menuPdfs[i] as File)?.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => pdfInputRefs.current[i]?.click()}
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-[10px] font-bold shadow-sm"
                            >
                              Change
                            </button>
                            <button
                              type="button"
                              onClick={() => removePdf(i)}
                              className="text-red-500 p-1.5 bg-red-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => pdfInputRefs.current[i]?.click()}
                          className="w-full border border-dashed border-gray-200 hover:border-blue-500 bg-white p-6 rounded-xl text-center cursor-pointer group"
                        >
                          <CloudUpload className="w-6 h-6 text-gray-400 group-hover:text-blue-500 mx-auto mb-1" />
                          <p className="text-xs text-gray-500 font-semibold">Upload PDF File</p>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={(el) => { pdfInputRefs.current[i] = el; }}
                        onChange={(e) => handlePdfChange(i, e)}
                        accept=".pdf,application/pdf"
                        className="hidden"
                      />
                    </div>

                    <InputField
                      label="Menu Highlights (comma separated)"
                      value={menu.highlightsString}
                      onChange={(e) => handleChangeMenuList(i, "highlightsString", e.target.value)}
                      placeholder="e.g. Salmon, Turkey, Plum Pudding"
                    />
                  </div>

                  {/* Image Picker */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Menu Showcase Cover Image
                    </span>

                    {preview ? (
                      <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="w-8 h-8 rounded bg-gray-200 overflow-hidden relative">
                            <img src={preview} alt="Menu Cover" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs font-bold text-gray-900 truncate max-w-xs">{imgName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRefs.current[i]?.click()}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-[10px] font-bold shadow-sm"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="text-red-500 p-1.5 bg-red-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRefs.current[i]?.click()}
                        className="w-full border border-dashed border-gray-200 hover:border-blue-500 bg-white p-6 rounded-xl text-center cursor-pointer group"
                      >
                        <CloudUpload className="w-6 h-6 text-gray-400 group-hover:text-blue-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-500 font-semibold">Upload Menu Cover</p>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={(el) => { fileInputRefs.current[i] = el; }}
                      onChange={(e) => handleFileChange(i, e)}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <SaveButton onClick={handleSave} disabled={isSaving} className="w-44 h-12 text-sm" />
          </div>
        </div>
      )}
    </div>
  );
}
