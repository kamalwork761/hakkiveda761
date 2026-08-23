import React from 'react';
import {
  Search,
  Globe,
  Share2,
  Sparkles,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { Product } from '../../types/store';
import { slugify } from '../../utils/productUtils';
import { uploadFileToServer } from '../../utils/upload';

interface AdminProductSeoEditorProps {
  product: Product;
  galleryImages: string[];
  onChange: (updates: Partial<Product>) => void;
  onShowToast?: (msg: string) => void;
}

export const AdminProductSeoEditor: React.FC<AdminProductSeoEditorProps> = ({
  product,
  galleryImages,
  onChange,
  onShowToast,
}) => {
  const currentTitle = product.seoTitle || `${product.name} | 100% Authentic Adivasi Formulation - HAKKIVEDA`;
  const currentMetaDesc =
    product.seoMetaDescription ||
    product.seoDescription ||
    product.subtitle ||
    product.shortDescription ||
    product.description ||
    'Authentic Hakki-Pikki tribal herbal formulation handmade in Mysore forests.';
  const currentSlug = product.slug || slugify(product.name || 'product');
  const currentOgImage = product.ogImage || product.image || galleryImages[0] || '';

  const titleLength = currentTitle.length;
  const metaDescLength = currentMetaDesc.length;

  const handleRegenerateSlug = () => {
    const newSlug = slugify(product.name || 'product');
    onChange({ slug: newSlug });
    if (onShowToast) onShowToast(`Slug generated: ${newSlug}`);
  };

  const handleUploadOgImage = async (file: File) => {
    try {
      const url = await uploadFileToServer(file);
      onChange({ ogImage: url });
      if (onShowToast) onShowToast('OG Social image uploaded');
    } catch (err: any) {
      if (onShowToast) onShowToast(`Upload error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 text-xs font-sans">
      {/* Header Info */}
      <div className="border-b border-white/10 pb-3">
        <label className="text-slate-100 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
          <Search className="w-4 h-4 text-[var(--brand-gold)]" />
          <span>Search Engine Optimization (SEO) & Social Sharing</span>
        </label>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Configure Google Search snippets, custom clean URLs, and Open Graph social cards for WhatsApp & Facebook.
        </p>
      </div>

      {/* Live Google SERP Simulation Card */}
      <div className="bg-[#FAF8F2] border border-[#E7E1D5] rounded-2xl p-5 shadow-md space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-600 font-bold uppercase tracking-wider border-b border-slate-300 pb-2">
          <span className="flex items-center gap-1.5 text-slate-800">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Google Search Result Snippet Preview</span>
          </span>
          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-mono font-bold">
            Desktop & Mobile Indexing
          </span>
        </div>

        <div className="pt-2 space-y-1 font-sans">
          {/* Breadcrumb URL */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#202124]">
            <div className="w-4 h-4 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[9px] font-bold">
              H
            </div>
            <span className="font-medium">hakkiveda.com</span>
            <span className="text-slate-400">›</span>
            <span className="text-slate-600">products</span>
            <span className="text-slate-400">›</span>
            <span className="text-slate-600">{currentSlug}</span>
          </div>

          {/* SERP Title */}
          <h3 className="text-base sm:text-lg text-[#1a0dab] hover:underline font-medium leading-snug cursor-pointer line-clamp-1">
            {currentTitle}
          </h3>

          {/* SERP Description */}
          <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
            <span className="text-slate-500 font-medium">{product.priceINR ? `₹${product.priceINR} · In stock · ` : ''}</span>
            {currentMetaDesc}
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-[var(--brand-primary-deep,#07150E)] border border-white/10 rounded-2xl p-5 space-y-5">
        {/* SEO Title */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-slate-200 font-bold text-xs flex items-center gap-2">
              <span>SEO Page Title</span>
              <span className="text-[10px] text-slate-400 font-normal">(Optimal: 50–60 chars)</span>
            </label>
            <span
              className={`font-mono text-[11px] font-bold ${
                titleLength >= 40 && titleLength <= 65 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {titleLength} characters
            </span>
          </div>
          <input
            type="text"
            value={product.seoTitle || ''}
            onChange={(e) => onChange({ seoTitle: e.target.value })}
            placeholder={`${product.name} | 100% Authentic Adivasi Formulation - HAKKIVEDA`}
            className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 p-2.5 rounded-lg text-slate-100 focus:border-[var(--brand-gold)]"
          />
        </div>

        {/* SEO Meta Description */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-slate-200 font-bold text-xs flex items-center gap-2">
              <span>SEO Meta Description</span>
              <span className="text-[10px] text-slate-400 font-normal">(Optimal: 140–160 chars)</span>
            </label>
            <span
              className={`font-mono text-[11px] font-bold ${
                metaDescLength >= 120 && metaDescLength <= 165 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {metaDescLength} characters
            </span>
          </div>
          <textarea
            rows={3}
            value={product.seoMetaDescription || product.seoDescription || ''}
            onChange={(e) => onChange({ seoMetaDescription: e.target.value, seoDescription: e.target.value })}
            placeholder="Handcrafted by Hakki-Pikki tribal elders in Mysore forest with 42 rare mountain roots. 100% cold-pressed for maximum botanical vitality. Fast free shipping across India."
            className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 p-2.5 rounded-lg text-slate-100 leading-relaxed focus:border-[var(--brand-gold)]"
          />
        </div>

        {/* URL Slug & Canonical URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-slate-200 font-bold text-xs">URL Slug</label>
              <button
                type="button"
                onClick={handleRegenerateSlug}
                className="text-[var(--brand-gold)] hover:underline text-[10px] flex items-center gap-1 font-bold"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Regenerate from Title</span>
              </button>
            </div>
            <div className="flex items-center bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 rounded-lg overflow-hidden focus-within:border-[var(--brand-gold)]">
              <span className="px-3 text-slate-500 font-mono text-[11px] bg-black/30 border-r border-white/10 py-2.5 select-none">
                /products/
              </span>
              <input
                type="text"
                value={product.slug || ''}
                onChange={(e) => onChange({ slug: slugify(e.target.value) })}
                placeholder={slugify(product.name || 'product')}
                className="w-full bg-transparent px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-200 font-bold text-xs">Canonical URL (Optional)</label>
            <input
              type="url"
              value={product.canonicalUrl || ''}
              onChange={(e) => onChange({ canonicalUrl: e.target.value })}
              placeholder={`https://hakkiveda.com/products/${currentSlug}`}
              className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 p-2.5 rounded-lg text-slate-100 font-mono text-xs focus:border-[var(--brand-gold)]"
            />
          </div>
        </div>

        {/* Open Graph (OG) Social Image */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <label className="text-slate-200 font-bold text-xs flex items-center gap-2">
            <Share2 className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
            <span>Open Graph (OG) Social Share Card Image</span>
          </label>
          <p className="text-[11px] text-slate-400">
            Image shown when sharing the product link on WhatsApp, Facebook, iMessage, and Twitter.
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            {galleryImages.map((gImg, gIdx) => (
              <button
                key={gIdx}
                type="button"
                onClick={() => onChange({ ogImage: gImg })}
                className={`w-14 h-14 rounded-xl border overflow-hidden p-0.5 transition-all ${
                  (product.ogImage || product.image) === gImg
                    ? 'border-[var(--brand-gold)] ring-2 ring-[var(--brand-gold)]'
                    : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={gImg} alt="choice" className="w-full h-full object-contain" />
              </button>
            ))}

            <label className="bg-black/40 hover:bg-black/70 text-slate-300 border border-dashed border-white/30 rounded-xl px-3 py-3 flex items-center gap-1.5 cursor-pointer text-[11px]">
              <Plus className="w-4 h-4 text-[var(--brand-gold)]" />
              <span>Upload Custom OG Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleUploadOgImage(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
