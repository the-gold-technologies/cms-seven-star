"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Mail,
  Tag,
  Calendar,
  Clock,
  MessageSquare,
  Copy,
  Check,
  Send,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  interestedIn: string | null;
  budget: string | null;
  projectGoals: string | null;
  status?: string;
  createdAt: string;
}

interface EnquiryModalProps {
  enquiry: Enquiry | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EnquiryModal({ enquiry, isOpen, onClose }: EnquiryModalProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !enquiry) return null;

  const initials = enquiry.name
    ? enquiry.name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "E";

  const firstName = enquiry.name ? enquiry.name.trim().split(/\s+/)[0] : "Sender";

  const formattedDate = new Date(enquiry.createdAt).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = new Date(enquiry.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCopyEmail = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(enquiry.email);
    setCopiedEmail(true);
    toast.success("Email copied to clipboard!");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyMessage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!enquiry.projectGoals) {
      toast.error("No message to copy");
      return;
    }
    navigator.clipboard.writeText(enquiry.projectGoals);
    setCopiedMessage(true);
    toast.success("Message copied to clipboard!");
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-[28px] shadow-[0_25px_60px_-15px_rgba(11,15,41,0.2)] border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Customer Profile Card */}
        <div className="px-7 pt-7 pb-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              {/* Avatar Initial */}
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#475DB1] via-[#546ecf] to-[#7890ec] text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-[#475DB1]/20 ring-4 ring-blue-50/80 shrink-0 select-none">
                {initials}
              </div>

              {/* Name & Contact */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-[#0B0F29] tracking-tight truncate">
                    {enquiry.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <a
                    href={`mailto:${enquiry.email}`}
                    className="text-xs font-medium text-slate-500 hover:text-[#475DB1] transition-colors flex items-center gap-1.5 truncate max-w-sm group"
                    title={`Send email to ${enquiry.email}`}
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#475DB1] shrink-0" />
                    <span className="truncate">{enquiry.email}</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="p-1 text-slate-400 hover:text-[#475DB1] hover:bg-slate-100 rounded-md transition-colors"
                    title="Copy email address"
                  >
                    {copiedEmail ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Details Badges Ribbon */}
          <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-100/80">
            {/* Subject / Category Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/90 text-[#475DB1] text-xs font-semibold border border-blue-100/60 shadow-2xs">
              <Tag className="w-3 h-3" />
              <span>{enquiry.interestedIn || "General Question"}</span>
            </div>

            {/* Submission Date & Time Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 text-slate-600 text-xs font-medium border border-slate-200/50 shadow-2xs">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{formattedDate}</span>
              <span className="text-slate-300">•</span>
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{formattedTime}</span>
            </div>

            {/* Budget / Party Size (if present) */}
            {enquiry.budget && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200/60 shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{enquiry.budget}</span>
              </div>
            )}
          </div>
        </div>

        {/* Message Container Section */}
        <div className="p-7 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#475DB1]" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Message Content
              </span>
            </div>

            {enquiry.projectGoals && (
              <button
                type="button"
                onClick={handleCopyMessage}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#475DB1] transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-100"
              >
                {copiedMessage ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy text</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Styled Message Card */}
          <div className="relative bg-[#fbfbfd] border border-slate-200/70 rounded-2xl p-5 shadow-2xs">
            <div className="text-slate-800 text-[14px] leading-relaxed whitespace-pre-wrap select-text min-h-[70px] max-h-72 overflow-y-auto">
              {enquiry.projectGoals ? (
                enquiry.projectGoals
              ) : (
                <span className="italic text-slate-400 text-sm">
                  No additional message content provided.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-7 py-4.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold text-xs tracking-wider uppercase transition-all shadow-2xs"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <a
              href={`mailto:${enquiry.email}?subject=${encodeURIComponent(
                `Re: ${enquiry.interestedIn || "Enquiry"} - Seven Stars`
              )}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#475DB1] hover:bg-[#3a4ea1] active:scale-[0.98] text-white text-xs font-bold tracking-wider uppercase transition-all shadow-sm shadow-[#475DB1]/25 hover:shadow-md hover:shadow-[#475DB1]/30"
            >
              <Send className="w-3.5 h-3.5" />
              Reply to {firstName}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
