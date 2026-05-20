"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Mail, Tag, DollarSign, Calendar, ArrowRight, Loader2 } from "lucide-react";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  interestedIn: string | null;
  budget: string | null;
  createdAt: string;
}

export function RecentEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecent() {
      try {
        const res = await fetch("/api/enquiries?limit=5");
        const json = await res.json();
        if (json.success) {
          setEnquiries(json.data);
        }
      } catch (error) {
        console.error("Error fetching recent enquiries:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecent();
  }, []);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg text-[#0B0F29]">Recent Enquiries</h3>
          <p className="text-xs font-medium text-gray-400 mt-0.5">
            Latest incoming messages from the landing page.
          </p>
        </div>
        <Link
          href="/submissions/enquiries"
          className="text-xs font-bold text-[#475DB1] hover:text-black flex items-center gap-1 bg-blue-50/50 px-3 py-1.5 rounded-xl transition-all"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="py-8 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#475DB1]" />
        </div>
      ) : enquiries.length === 0 ? (
        <div className="py-8 text-center text-gray-400 text-xs italic">
          No enquiries received yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-gray-100 pb-2">
                <th className="pb-3 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Name & Email</th>
                <th className="pb-3 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Interest</th>
                <th className="pb-3 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Budget</th>
                <th className="pb-3 font-bold text-gray-400 uppercase tracking-widest text-[10px] text-right">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {enquiries.map((enquiry) => (
                <tr key={enquiry.id} className="hover:bg-gray-50/20 transition-colors">
                  <td className="py-3.5">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 flex items-center gap-1.5">
                        <User className="w-3 h-3 text-gray-400" />
                        {enquiry.name}
                      </span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 text-gray-400" />
                        {enquiry.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                      <Tag className="w-2.5 h-2.5" />
                      {enquiry.interestedIn || "General"}
                    </span>
                  </td>
                  <td className="py-3.5 font-semibold text-gray-800">
                    <span className="flex items-center gap-1 text-[11px]">
                      <DollarSign className="w-3 h-3 text-green-500" />
                      {enquiry.budget || "N/A"}
                    </span>
                  </td>
                  <td className="py-3.5 text-right text-gray-400 font-medium text-[11px]">
                    <span className="flex items-center justify-end gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
