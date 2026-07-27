import React, { useState } from 'react';
import { BookOpen, Clock, ArrowRight, X, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BlogArticle } from '../types/store';

export const BlogSection: React.FC = () => {
  const { blogs } = useStore();
  const [activeBlog, setActiveBlog] = useState<BlogArticle | null>(null);

  return (
    <section id="blogs" className="py-20 bg-[#072a20] border-t border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[#C8A24A] font-sans text-xs uppercase tracking-[0.28em] font-bold block mb-2">
              The Botanical Journal
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-slate-100">
              Ayurvedic Trichology & Tribal Lore
            </h2>
          </div>
          <p className="text-xs text-slate-300 font-sans mt-3 md:mt-0 max-w-sm leading-relaxed">
            Discover the science of ancient hair remedies, wildcrafting ethics, and herbal scalp preservation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              onClick={() => setActiveBlog(blog)}
              className="group bg-[#0B3D2E] border border-white/10 rounded-2xl overflow-hidden hover:border-[#C8A24A]/60 transition-all duration-300 cursor-pointer shadow-xl flex flex-col justify-between"
            >
              <div className="h-60 overflow-hidden relative">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                <span className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-[#C8A24A] text-[10px] font-bold font-sans uppercase px-3 py-1 rounded-full border border-[#C8A24A]/30">
                  {blog.category}
                </span>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-sans mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C8A24A]" />
                      <span>{blog.readTime}</span>
                    </span>
                    <span>•</span>
                    <span>{blog.date}</span>
                  </div>

                  <h3 className="text-xl font-bold font-serif-luxury text-slate-100 group-hover:text-[#C8A24A] transition-colors leading-snug">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-sans mt-2 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-sans italic">By {blog.author}</span>
                  <span className="text-xs font-bold font-sans text-[#C8A24A] uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
      {activeBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#072a20] border border-[#C8A24A]/40 rounded-2xl shadow-2xl p-6 sm:p-10 my-8 text-slate-100 font-sans max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveBlog(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 text-white hover:bg-[#C8A24A] hover:text-[#0B3D2E] transition-all flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <span className="bg-[#C8A24A]/20 text-[#C8A24A] border border-[#C8A24A] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                {activeBlog.category}
              </span>

              <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-slate-100 leading-tight">
                {activeBlog.title}
              </h2>

              <div className="flex items-center gap-4 text-xs text-slate-400 border-b border-white/10 pb-4">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#C8A24A]" />
                  <span>{activeBlog.author}</span>
                </span>
                <span>•</span>
                <span>{activeBlog.date}</span>
                <span>•</span>
                <span>{activeBlog.readTime}</span>
              </div>

              <div className="rounded-xl overflow-hidden my-4 border border-white/10 h-64">
                <img src={activeBlog.image} alt={activeBlog.title} className="w-full h-full object-cover" />
              </div>

              <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 leading-relaxed space-y-4 whitespace-pre-line font-sans">
                {activeBlog.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
