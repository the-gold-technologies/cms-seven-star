"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Clock, 
  Eye, 
  Tag, 
  MapPin, 
  Calendar,
  Loader2
} from "lucide-react";
import { PageHeader } from "@/app/components/PageHeader";
import Link from "next/link";
import toast from "react-hot-toast";

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
}

export default function BlogAdminPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Custom Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/blogs");
      const json = await res.json();
      if (json.success) {
        setBlogs(json.data);
      } else {
        toast.error("Failed to load blog posts");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while loading blogs");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerDeleteConfirm = (id: string) => {
    setBlogToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteBlog = async () => {
    if (!blogToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/blogs/${blogToDelete}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Blog post deleted successfully");
        fetchBlogs();
      } else {
        toast.error(json.error || "Failed to delete blog post");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setBlogToDelete(null);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (blog.tag && blog.tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (blog.area && blog.area.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = 
      statusFilter === "all" ||
      blog.visibility === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <section className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader 
          title="Blog Posts Manager" 
          description="Create, publish, edit, and manage articles, local guides, and dining announcements for the Seven Stars website."
        />
        <Link
          href="/static-pages/blog/new"
          className="flex items-center gap-2 bg-[#475DB1] hover:bg-[#3b4f98] text-white px-5 py-3 rounded-2xl shadow-sm text-sm font-semibold transition-all transform hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Blog Post
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search input container */}
        <div className="flex-1 w-full bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5 focus-within:ring-2 focus-within:ring-[#475DB1]/20 transition-all">
          <Search className="w-4.5 h-4.5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search blogs by title, excerpt, tag, or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-700 placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wider cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filter Dropdown Container */}
        <div className="w-full md:w-auto bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 focus-within:ring-2 focus-within:ring-[#475DB1]/20 transition-all">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest select-none">Status</span>
          <div className="h-4 w-px bg-gray-200" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-semibold text-gray-700 cursor-pointer pr-2"
          >
            <option value="all">All Posts</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Grid of posts */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-500 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#475DB1]" />
          <span className="text-sm font-medium">Fetching articles...</span>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-16 px-6 text-center">
          <p className="text-gray-400 text-sm">No blog posts found matching your search or filters.</p>
          <Link
            href="/static-pages/blog/new"
            className="mt-4 inline-flex items-center gap-2 text-[#475DB1] hover:text-[#3b4f98] text-sm font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add a new blog post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <div 
              key={blog.id} 
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col group relative"
            >
              {/* Image Header */}
              <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
                {blog.featuredImage ? (
                  <img 
                    src={blog.featuredImage} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                    No image configured
                  </div>
                )}
                {/* Status badge */}
                <span className={`absolute top-4 left-4 z-10 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-sm ${
                  blog.visibility === "published" 
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  {blog.visibility}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex flex-wrap gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {blog.tag && (
                    <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full">
                      <Tag className="w-3.5 h-3.5 text-amber-500" />
                      {blog.tag}
                    </span>
                  )}
                  {blog.area && (
                    <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full">
                      <MapPin className="w-3.5 h-3.5 text-[#475DB1]" />
                      {blog.area}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-lg font-bold text-gray-900 group-hover:text-[#475DB1] transition-colors leading-snug line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-gray-500 text-xs font-light leading-relaxed line-clamp-3">
                  {blog.excerpt}
                </p>

                {/* Card Footer Info */}
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 font-medium pb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {blog.date}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {blog.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {blog.views}
                    </span>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-50">
                  <Link
                    href={`/static-pages/blog/${blog.id}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-[#475DB1]/5 hover:bg-[#475DB1]/10 border border-[#475DB1]/10 rounded-xl text-xs font-bold text-[#475DB1] transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit Post
                  </Link>
                  <button
                    onClick={() => triggerDeleteConfirm(blog.id)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl text-xs font-bold text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] border border-gray-100 max-w-md w-full p-8 shadow-xl flex flex-col gap-6 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col gap-2">
              <h3 className="font-serif text-xl font-bold text-gray-900">
                Delete Blog Post
              </h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                Are you sure you want to delete this blog post? This action cannot be undone and the content will be permanently removed from the database.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setBlogToDelete(null);
                }}
                disabled={isDeleting}
                className="px-5 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl text-xs font-bold text-gray-500 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteBlog}
                disabled={isDeleting}
                className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-2 shadow-sm"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Post"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
