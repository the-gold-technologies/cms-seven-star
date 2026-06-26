"use client";

import { useState, useEffect } from "react";
import { fetchWithCache, clearCache } from "@/app/lib/apiCache";
import { BadgeCheck, ShieldAlert, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export function ChristmasVisibilityCMS() {
  const [visibility, setVisibility] = useState<"published" | "draft">("draft");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const apiUrl = "/api/christmas";

  useEffect(() => {
    fetchWithCache(apiUrl)
      .then((json) => {
        if (json.success && json.visibility) {
          setVisibility(json.visibility);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleToggle = async () => {
    const nextVisibility = visibility === "published" ? "draft" : "published";
    setIsUpdating(true);
    const toastId = toast.loading(
      `Setting Christmas page status to ${nextVisibility === "published" ? "Published" : "Draft"}...`
    );

    try {
      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: nextVisibility }),
      });

      const json = await res.json();
      if (json.success && json.data?.visibility) {
        setVisibility(json.data.visibility);
        clearCache(apiUrl);
        toast.success(
          `Christmas page is now ${
            json.data.visibility === "published" ? "Published (visible on website)" : "Draft (hidden from website)"
          }!`,
          { id: toastId }
        );
      } else {
        toast.error(json.error || "Failed to update visibility.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error updating page status.", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  const isPublic = visibility === "published";

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex justify-center items-center h-28">
        <Loader2 className="w-6 h-6 animate-spin text-[#475DB1]" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 transition-all">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <h4 className="font-bold text-lg text-[#0B0F29]">Page Visibility Status</h4>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isPublic ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
            }`}
          >
            {isPublic ? (
              <>
                <BadgeCheck className="w-3 h-3" />
                Published
              </>
            ) : (
              <>
                <ShieldAlert className="w-3 h-3" />
                Draft
              </>
            )}
          </span>
        </div>
        <p className="text-gray-400 text-xs font-medium max-w-xl">
          Control the public visibility of the Christmas landing page. When set to Draft, the page is hidden from website navigation, and direct visits to the route will return a 404 page.
        </p>
      </div>

      <div className="flex items-center gap-4 bg-gray-50/50 border border-gray-100/80 px-6 py-4 rounded-2xl self-start sm:self-auto">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={handleToggle}
            disabled={isUpdating}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 disabled:opacity-50"></div>
          <span className="ml-3 text-xs font-bold text-gray-500 uppercase tracking-wider select-none">
            {isPublic ? "Visible (Published)" : "Hidden (Draft)"}
          </span>
        </label>
      </div>
    </div>
  );
}
