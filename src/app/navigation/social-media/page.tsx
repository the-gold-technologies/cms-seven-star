"use client";

import React, { useState, useEffect } from "react";
import { DataTable } from "@/app/components/DataTable";
import { PageHeader } from "@/app/components/PageHeader";
import { Link as LinkIcon, Edit, X } from "lucide-react";
import toast from "react-hot-toast";

interface SocialItem {
  id: string;
  platform: string;
  url: string;
}

export default function SocialLinksPage() {
  const [footerCMS, setFooterCMS] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [editingUrl, setEditingUrl] = useState("");

  const fetchFooterCMS = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/home");
      const json = await res.json();
      if (json.success && json.data) {
        setFooterCMS(json.data.FooterCMS || {});
      } else {
        toast.error("Failed to load footer configuration");
      }
    } catch {
      toast.error("Network error while loading links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooterCMS();
  }, []);

  const socials: SocialItem[] = [
    { id: "instagram", platform: "Instagram", url: footerCMS.instagramUrl || "" },
    { id: "facebook", platform: "Facebook", url: footerCMS.facebookUrl || "" },
    { id: "youtube", platform: "YouTube", url: footerCMS.youtubeUrl || "" },
  ];

  const handleEdit = (platformId: string, currentUrl: string) => {
    setEditingPlatform(platformId);
    setEditingUrl(currentUrl);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedFooterCMS = {
        ...footerCMS,
        [`${editingPlatform}Url`]: editingUrl,
      };

      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "FooterCMS",
          content: updatedFooterCMS,
        }),
      });

      if (res.ok) {
        toast.success("Social media URL updated successfully");
        setIsModalOpen(false);
        fetchFooterCMS();
      } else {
        toast.error("Failed to save changes");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const columns = [
    {
      header: "Platform",
      accessorKey: "platform" as keyof SocialItem,
      className: "font-bold text-gray-900 w-[180px]",
    },
    {
      header: "URL Link",
      accessorKey: (row: SocialItem) => (
        row.url ? (
          <a
            href={row.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[#475DB1] hover:underline font-mono text-xs"
          >
            <LinkIcon className="w-3 h-3" />
            {row.url}
          </a>
        ) : (
          <span className="text-gray-400 italic text-xs">Not configured</span>
        )
      ),
    },
    {
      header: "Actions",
      accessorKey: (row: SocialItem) => (
        <button
          onClick={() => handleEdit(row.id, row.url)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-black font-semibold text-[11px] transition-all"
        >
          <Edit className="w-3 h-3" />
          Edit Link
        </button>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title="Social Media Links"
        description="Manage the social media icons and URLs configured in your Seven Stars website footer."
      />

      <DataTable
        data={socials}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={loading}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#0B0F29] capitalize">
                Edit {editingPlatform} URL
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div className="space-y-1.5 flex flex-col">
                <label className="text-sm font-bold text-gray-700">
                  Destination URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={editingUrl}
                  onChange={(e) => setEditingUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#475DB1] focus:border-transparent outline-none transition-all text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-bold bg-[#0B0F29] text-white rounded-full hover:bg-black transition-all"
                >
                  Save URL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
