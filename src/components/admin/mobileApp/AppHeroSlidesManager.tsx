import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Upload,
  ArrowUp,
  ArrowDown,
  Eye,
  Check,
  AlertCircle,
  ExternalLink,
  Layers,
  Image as ImageIcon,
  Sparkles,
  X,
} from 'lucide-react';
import { MobileAppHeroSlide } from '../../../types/mobileApp';
import { Product, Category } from '../../../types/store';
import { resolveAssetUrl } from '../../../app/utils/nativeUrl';

interface AppHeroSlidesManagerProps {
  slides: MobileAppHeroSlide[];
  products: Product[];
  categories: Category[];
  onSave: (updatedSlides: MobileAppHeroSlide[]) => void;
  isSaving: boolean;
}

export const AppHeroSlidesManager: React.FC<AppHeroSlidesManagerProps> = ({
  slides,
  products,
  categories,
  onSave,
  isSaving,
}) => {
  const [editingSlide, setEditingSlide] = useState<MobileAppHeroSlide | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    uploading: boolean;
    progress: number;
    error: string | null;
    success: boolean;
  }>({
    uploading: false,
    progress: 0,
    error: null,
    success: false,
  });

  const handleOpenAdd = () => {
    const nextOrder = slides.length > 0 ? Math.max(...slides.map((s) => s.displayOrder || 0)) + 1 : 1;
    setEditingSlide({
      id: `app-hero-${Date.now()}`,
      title: '',
      subtitle: '',
      eyebrow: 'Pure Wild Harvest',
      imageUrl: '/images/hero_tribal_elders.jpg',
      ctaText: 'Shop Now',
      ctaDestination: 'shop',
      displayOrder: nextOrder,
      published: true,
    });
    setUploadStatus({ uploading: false, progress: 0, error: null, success: false });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slide: MobileAppHeroSlide) => {
    setEditingSlide({ ...slide });
    setUploadStatus({ uploading: false, progress: 0, error: null, success: false });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to remove this hero slide from the Android app?')) return;
    const updated = slides.filter((s) => s.id !== id);
    onSave(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    updated.forEach((s, idx) => {
      s.displayOrder = idx + 1;
    });
    onSave(updated);
  };

  const handleTogglePublished = (id: string) => {
    const updated = slides.map((s) => (s.id === id ? { ...s, published: !s.published } : s));
    onSave(updated);
  };

  const handleFileUpload = async (file: File) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setUploadStatus({
        uploading: false,
        progress: 0,
        error: 'Invalid file format. Accepted: JPG, JPEG, PNG, WebP.',
        success: false,
      });
      return;
    }

    setUploadStatus({ uploading: true, progress: 20, error: null, success: false });

    try {
      const formData = new FormData();
      formData.append('file', file);

      setUploadStatus((prev) => ({ ...prev, progress: 50 }));

      const res = await fetch('/api/upload/mobile-app?folder=heroes', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.url) {
        throw new Error(data.error || 'Server upload failed');
      }

      setUploadStatus({ uploading: false, progress: 100, error: null, success: true });
      if (editingSlide) {
        setEditingSlide({ ...editingSlide, imageUrl: data.url });
      }
    } catch (err: any) {
      setUploadStatus({
        uploading: false,
        progress: 0,
        error: err.message || 'Image upload failed. Please try again.',
        success: false,
      });
    }
  };

  const handleSaveModal = () => {
    if (!editingSlide) return;
    if (!editingSlide.title.trim()) {
      alert('Please enter a headline title for this hero slide.');
      return;
    }

    const existingIdx = slides.findIndex((s) => s.id === editingSlide.id);
    let updated: MobileAppHeroSlide[];
    if (existingIdx >= 0) {
      updated = [...slides];
      updated[existingIdx] = editingSlide;
    } else {
      updated = [...slides, editingSlide];
    }

    onSave(updated);
    setIsModalOpen(false);
  };

  const sortedSlides = [...slides].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#C5A059]" />
            <span>App Hero Carousel Slides</span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Full-width banners showcased at the top of the Android home screen.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-[#C5A059] text-[#0E382C] font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-[#d4af37] transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Hero Slide</span>
        </button>
      </div>

      {/* Recommended Specs Banner */}
      <div className="bg-[#0E382C]/70 border border-[#C5A059]/30 rounded-xl p-3.5 flex items-start gap-3 text-xs text-emerald-100">
        <Sparkles className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-[#C5A059]">Recommended Artwork Specifications:</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-300">
            <span>• Aspect Ratio: <strong>2:1 Landscape</strong></span>
            <span>• Dimensions: <strong>1080 × 540 px</strong> or <strong>1200 × 600 px</strong></span>
            <span>• Formats: <strong>JPG, JPEG, PNG, WebP</strong> (Max 25MB)</span>
            <span>• Persistent Server Storage: <code>/uploads/mobile-app/heroes/</code></span>
          </div>
        </div>
      </div>

      {/* Slide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedSlides.map((slide, index) => {
          return (
            <div
              key={slide.id}
              className={`rounded-2xl border bg-black/30 overflow-hidden flex flex-col justify-between transition-all ${
                slide.published
                  ? 'border-white/10 hover:border-[#C5A059]/50'
                  : 'border-red-500/20 opacity-60'
              }`}
            >
              {/* Image Preview with Aspect 2:1 */}
              <div className="relative aspect-[2/1] w-full bg-slate-900 overflow-hidden">
                <img
                  src={resolveAssetUrl(slide.imageUrl)}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  style={{ opacity: 1, filter: 'none' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/hero_tribal_elders.jpg';
                  }}
                />

                {/* Eyebrow & Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="bg-black/70 backdrop-blur-xs text-[#C5A059] px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#C5A059]/30">
                    Order #{slide.displayOrder}
                  </span>
                  {slide.published ? (
                    <span className="bg-emerald-900/80 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                      Live
                    </span>
                  ) : (
                    <span className="bg-red-900/80 text-red-300 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                      Draft
                    </span>
                  )}
                </div>

                {/* Eyebrow tag overlay */}
                {slide.eyebrow && (
                  <span className="absolute bottom-2 left-2.5 text-[9px] font-bold uppercase tracking-wider text-[#C5A059] bg-[#0E382C]/90 px-2 py-0.5 rounded">
                    {slide.eyebrow}
                  </span>
                )}
              </div>

              {/* Text Info */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#FDF8EC] line-clamp-1">
                    {slide.title}
                  </h3>
                  <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">
                    {slide.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                  <span>CTA: <strong className="text-[#C5A059]">{slide.ctaText}</strong></span>
                  <span className="text-[10px] text-emerald-100 truncate max-w-[120px]">
                    → {slide.ctaDestination}
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-2.5 bg-white/5 border-t border-white/10 flex items-center justify-between gap-1">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Move slide up"
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                    className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Move slide down"
                    disabled={index === sortedSlides.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleTogglePublished(slide.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      slide.published
                        ? 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800/80'
                        : 'bg-slate-700/60 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {slide.published ? 'Published' : 'Hidden'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(slide)}
                    className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-[#C5A059] hover:text-[#0E382C] transition-all"
                    title="Edit slide"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(slide.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                    title="Delete slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hero Slide Modal / Full Editor */}
      {isModalOpen && editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-[#0c2920] border border-[#C5A059]/40 rounded-3xl max-w-xl w-full p-6 text-white shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto mobile-app-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center font-bold">
                  <ImageIcon className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#FDF8EC]">
                    {editingSlide.id.startsWith('app-hero-') ? 'Configure Hero Slide' : 'Edit Hero Slide'}
                  </h3>
                  <span className="text-[11px] text-emerald-100">
                    2:1 ratio responsive Android hero banner
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/15 text-white hover:bg-white/25 flex items-center justify-center transition-all"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Live Preview Inside Modal */}
            <div>
              <label className="text-[11px] font-bold text-[#FDF8EC] uppercase tracking-wider block mb-1">
                Hero Slide Live Preview (2:1 Ratio)
              </label>
              <div className="relative aspect-[2/1] w-full rounded-2xl overflow-hidden border border-white/25 bg-slate-900 shadow-inner group">
                <img
                  src={resolveAssetUrl(editingSlide.imageUrl)}
                  alt="Slide preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/hero_tribal_elders.jpg';
                  }}
                />
                {Boolean(editingSlide.title || editingSlide.subtitle || editingSlide.ctaText || editingSlide.eyebrow) && (
                  <div className="absolute inset-0 p-4 flex flex-col justify-end pointer-events-none">
                    <div className="max-w-[85%] space-y-0.5">
                      {editingSlide.eyebrow && (
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#C5A059] bg-[#0E382C]/90 px-2 py-0.5 rounded w-max mb-1 shadow-xs">
                          {editingSlide.eyebrow}
                        </span>
                      )}
                      {editingSlide.title && (
                        <h4 className="font-serif text-base font-bold text-[#FDF8EC] leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
                          {editingSlide.title}
                        </h4>
                      )}
                      {editingSlide.subtitle && (
                        <p className="text-xs text-white/95 mt-1 line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                          {editingSlide.subtitle}
                        </p>
                      )}
                    </div>
                    {editingSlide.ctaText && (
                      <div className="mt-2.5">
                        <span className="px-3 py-1 rounded-xl bg-[#C5A059] text-[#0E382C] font-bold text-[11px] shadow-sm inline-block">
                          {editingSlide.ctaText}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Hero Image Upload & Replace Section */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#FDF8EC] block">Hero Banner Image</span>
                  <span className="text-[11px] text-emerald-100">
                    Recommended: 1080 × 540 px (2:1) • Saves to <code className="text-[#C5A059]">/uploads/mobile-app/heroes/</code>
                  </span>
                </div>

                {editingSlide.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setEditingSlide({ ...editingSlide, imageUrl: '/images/hero_tribal_elders.jpg' })}
                    className="text-[11px] text-red-300 hover:text-red-200 underline font-semibold"
                  >
                    Reset to Default
                  </button>
                )}
              </div>

              {/* Upload Input */}
              <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer">
                  <div className="px-4 py-2.5 rounded-xl border border-dashed border-[#C5A059] hover:border-[#E8D279] bg-white/10 hover:bg-white/15 text-center transition-all flex items-center justify-center gap-2 text-xs font-bold text-[#C5A059]">
                    <Upload className="w-4 h-4 stroke-[2.5]" />
                    <span>{uploadStatus.uploading ? `Uploading (${uploadStatus.progress}%)...` : 'Upload / Replace Hero Image'}</span>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    disabled={uploadStatus.uploading}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                </label>
              </div>

              {/* Upload Status Feedback */}
              {uploadStatus.uploading && (
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#C5A059] h-full transition-all duration-300"
                    style={{ width: `${uploadStatus.progress}%` }}
                  />
                </div>
              )}
              {uploadStatus.success && (
                <div className="text-[11px] text-emerald-300 flex items-center gap-1.5 font-semibold">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Image uploaded and persisted to /uploads/mobile-app/heroes/</span>
                </div>
              )}
              {uploadStatus.error && (
                <div className="text-[11px] text-rose-300 flex items-center gap-1.5 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{uploadStatus.error}</span>
                </div>
              )}

              {/* Or manual URL path */}
              <div>
                <label className="text-[11px] font-bold text-[#FDF8EC] uppercase tracking-wider block mb-1">
                  Or Direct Image URL / Asset Path:
                </label>
                <input
                  type="text"
                  value={editingSlide.imageUrl}
                  onChange={(e) => setEditingSlide({ ...editingSlide, imageUrl: e.target.value })}
                  placeholder="/uploads/mobile-app/heroes/your-image.jpg"
                  className="w-full px-3 py-2 rounded-xl bg-[#07241C] border border-white/25 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Eyebrow Tag */}
              <div>
                <label className="text-[11px] font-bold text-[#FDF8EC] uppercase tracking-wider block mb-1">
                  Eyebrow / Badge Text
                </label>
                <input
                  type="text"
                  value={editingSlide.eyebrow || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, eyebrow: e.target.value })}
                  placeholder="e.g. Pure Wild Harvest"
                  className="w-full px-3 py-2 rounded-xl bg-[#07241C] border border-white/25 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="text-[11px] font-bold text-[#FDF8EC] uppercase tracking-wider block mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={editingSlide.displayOrder}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, displayOrder: parseInt(e.target.value, 10) || 1 })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#07241C] border border-white/25 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-[11px] font-bold text-[#FDF8EC] uppercase tracking-wider block mb-1">
                Main Headline Title *
              </label>
              <input
                type="text"
                value={editingSlide.title}
                onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                placeholder="e.g. 108 Sacred Forest Herbs"
                className="w-full px-3 py-2 rounded-xl bg-[#07241C] border border-white/25 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="text-[11px] font-bold text-[#FDF8EC] uppercase tracking-wider block mb-1">
                Supporting Subtitle
              </label>
              <textarea
                rows={2}
                value={editingSlide.subtitle}
                onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                placeholder="e.g. Handmade by Hakki-Pikki tribal elders in Pakshirajapura forest"
                className="w-full px-3 py-2 rounded-xl bg-[#07241C] border border-white/25 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059] resize-none"
              />
            </div>

            {/* CTA Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#FDF8EC] uppercase tracking-wider block mb-1">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={editingSlide.ctaText}
                  onChange={(e) => setEditingSlide({ ...editingSlide, ctaText: e.target.value })}
                  placeholder="e.g. Shop Flagship Oil"
                  className="w-full px-3 py-2 rounded-xl bg-[#07241C] border border-white/25 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#FDF8EC] uppercase tracking-wider block mb-1">
                  Action Destination
                </label>
                <select
                  value={editingSlide.ctaDestination}
                  onChange={(e) => setEditingSlide({ ...editingSlide, ctaDestination: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#07241C] border border-white/25 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="shop">Shop All Remedies (Catalog)</option>
                  <option value="analysis">AI Hair Root Analysis</option>
                  <optgroup label="Direct Product Links">
                    {products.map((p) => (
                      <option key={p.id} value={`product:${p.id}`}>
                        Product: {p.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Direct Category Links">
                    {categories.map((c) => (
                      <option key={c.id} value={`category:${c.id}`}>
                        Category: {c.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Published Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
              <div>
                <span className="text-xs font-bold text-[#FDF8EC] block">Publish in Android App</span>
                <span className="text-[11px] text-emerald-100">
                  When enabled, this slide appears immediately in the live app carousel.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingSlide.published}
                  onChange={(e) => setEditingSlide({ ...editingSlide, published: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C5A059]"></div>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-white/25 text-xs text-white bg-white/5 hover:bg-white/15 font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-[#C5A059] text-[#0E382C] font-bold text-xs shadow-md hover:bg-[#d4af37] disabled:opacity-50 transition-all"
              >
                Save Slide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
