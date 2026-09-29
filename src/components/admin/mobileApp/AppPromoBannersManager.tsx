import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  Upload,
  ArrowUp,
  ArrowDown,
  Eye,
  Check,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { MobileAppBanner } from '../../../types/mobileApp';
import { Product, Category } from '../../../types/store';
import { resolveAssetUrl } from '../../../app/utils/nativeUrl';

interface AppPromoBannersManagerProps {
  banners: MobileAppBanner[];
  products: Product[];
  categories: Category[];
  onSave: (updatedBanners: MobileAppBanner[]) => void;
  isSaving: boolean;
}

export const AppPromoBannersManager: React.FC<AppPromoBannersManagerProps> = ({
  banners,
  products,
  categories,
  onSave,
  isSaving,
}) => {
  const [editingBanner, setEditingBanner] = useState<MobileAppBanner | null>(null);
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
    const nextOrder = banners.length > 0 ? Math.max(...banners.map((b) => b.displayOrder || 0)) + 1 : 1;
    setEditingBanner({
      id: `app-banner-${Date.now()}`,
      title: '',
      subtitle: '',
      couponCode: 'TRIBAL100',
      imageUrl: '/images/hakkiveda_baldness_powder.jpg',
      ctaText: 'Claim Discount',
      linkAction: 'shop',
      displayOrder: nextOrder,
      published: true,
    });
    setUploadStatus({ uploading: false, progress: 0, error: null, success: false });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner: MobileAppBanner) => {
    setEditingBanner({ ...banner });
    setUploadStatus({ uploading: false, progress: 0, error: null, success: false });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this promo banner from the Android app?')) return;
    const updated = banners.filter((b) => b.id !== id);
    onSave(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= banners.length) return;
    const updated = [...banners];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    updated.forEach((b, idx) => {
      b.displayOrder = idx + 1;
    });
    onSave(updated);
  };

  const handleTogglePublished = (id: string) => {
    const updated = banners.map((b) => (b.id === id ? { ...b, published: !b.published } : b));
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

      const res = await fetch('/api/upload/mobile-app?folder=banners', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.url) {
        throw new Error(data.error || 'Server upload failed');
      }

      setUploadStatus({ uploading: false, progress: 100, error: null, success: true });
      if (editingBanner) {
        setEditingBanner({ ...editingBanner, imageUrl: data.url });
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
    if (!editingBanner) return;
    if (!editingBanner.title.trim()) {
      alert('Please enter a banner title.');
      return;
    }

    const existingIdx = banners.findIndex((b) => b.id === editingBanner.id);
    let updated: MobileAppBanner[];
    if (existingIdx >= 0) {
      updated = [...banners];
      updated[existingIdx] = editingBanner;
    } else {
      updated = [...banners, editingBanner];
    }

    onSave(updated);
    setIsModalOpen(false);
  };

  const sortedBanners = [...banners].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#C5A059]" />
            <span>App Promotional & Offer Banners</span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Strip banners placed between carousels featuring special tribal kits, discounts and coupon codes.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-[#C5A059] text-[#0E382C] font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-[#d4af37] transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Promo Banner</span>
        </button>
      </div>

      {/* Recommended Specs Banner */}
      <div className="bg-[#0E382C]/70 border border-[#C5A059]/30 rounded-xl p-3.5 flex items-start gap-3 text-xs text-emerald-100">
        <Sparkles className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-[#C5A059]">Recommended Artwork Specifications:</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-300">
            <span>• Aspect Ratio: <strong>3:1 Panoramic Strip</strong></span>
            <span>• Dimensions: <strong>1080 × 360 px</strong></span>
            <span>• Formats: <strong>JPG, JPEG, PNG, WebP</strong></span>
            <span>• Persistent Server Storage: <code>/uploads/mobile-app/banners/</code></span>
          </div>
        </div>
      </div>

      {/* Banner Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedBanners.map((banner, index) => {
          return (
            <div
              key={banner.id}
              className={`rounded-2xl border bg-black/30 overflow-hidden flex flex-col justify-between transition-all ${
                banner.published ? 'border-white/10 hover:border-[#C5A059]/40' : 'border-red-500/20 opacity-60'
              }`}
            >
              <div className="relative aspect-[3/1] w-full bg-slate-900 overflow-hidden">
                <img
                  src={resolveAssetUrl(banner.imageUrl)}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/hakkiveda_baldness_powder.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent p-3 flex flex-col justify-center">
                  {banner.couponCode && (
                    <span className="text-[9px] font-bold text-[#C5A059] bg-[#0E382C] px-2 py-0.5 rounded w-max border border-[#C5A059]/30 mb-1">
                      CODE: {banner.couponCode}
                    </span>
                  )}
                  <h4 className="font-serif text-xs font-bold text-white line-clamp-1">
                    {banner.title}
                  </h4>
                  {banner.subtitle && (
                    <p className="text-[10px] text-slate-300 line-clamp-1 mt-0.5">
                      {banner.subtitle}
                    </p>
                  )}
                </div>

                <div className="absolute top-2 right-2">
                  <span className="bg-black/70 text-[#C5A059] px-2 py-0.5 rounded text-[9px] font-bold">
                    #{banner.displayOrder}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white/5 border-t border-white/10 flex items-center justify-between">
                <div className="text-[10px] text-slate-300">
                  CTA: <strong className="text-white">{banner.ctaText || 'Claim'}</strong> →{' '}
                  <span className="text-slate-400">{banner.linkAction}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                    className="p-1 rounded-lg bg-white/5 text-slate-300 hover:text-white disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === sortedBanners.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    className="p-1 rounded-lg bg-white/5 text-slate-300 hover:text-white disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTogglePublished(banner.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      banner.published ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {banner.published ? 'Live' : 'Hidden'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(banner)}
                    className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-[#C5A059] hover:text-[#0E382C] transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(banner.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Banner Modal */}
      {isModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-[#0c2920] border border-[#C5A059]/40 rounded-3xl max-w-xl w-full p-6 text-white shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto mobile-app-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center font-bold">
                  <Tag className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#FDF8EC]">
                    {editingBanner.id.startsWith('app-banner-') ? 'New Promo Banner' : 'Edit Promo Banner'}
                  </h3>
                  <span className="text-[11px] text-emerald-100">
                    Recommended 1080 × 360 px (3:1)
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

            {/* Live Preview */}
            <div className="relative aspect-[3/1] w-full rounded-2xl overflow-hidden border border-white/25 bg-slate-900 shadow-inner">
              <img
                src={resolveAssetUrl(editingBanner.imageUrl)}
                alt="Banner preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/hakkiveda_baldness_powder.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent p-4 flex flex-col justify-center">
                {editingBanner.couponCode && (
                  <span className="text-[9px] font-bold text-[#C5A059] bg-[#0E382C] px-2 py-0.5 rounded w-max border border-[#C5A059]/30 mb-1">
                    USE CODE: {editingBanner.couponCode}
                  </span>
                )}
                <h4 className="font-serif text-sm font-bold text-[#FDF8EC] leading-tight">
                  {editingBanner.title || 'Promo Banner Title'}
                </h4>
                {editingBanner.subtitle && (
                  <p className="text-[11px] text-slate-200 mt-0.5">
                    {editingBanner.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Upload Area */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-bold text-[#FDF8EC] block">Banner Artwork</span>
              <label className="block cursor-pointer">
                <div className="px-4 py-2 rounded-xl border border-dashed border-[#C5A059] hover:border-[#E8D279] bg-white/10 hover:bg-white/15 text-center transition-all flex items-center justify-center gap-2 text-xs font-bold text-[#C5A059]">
                  <Upload className="w-4 h-4 stroke-[2.5]" />
                  <span>{uploadStatus.uploading ? `Uploading (${uploadStatus.progress}%)...` : 'Upload 3:1 Promo Banner'}</span>
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

              <input
                type="text"
                value={editingBanner.imageUrl}
                onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                placeholder="Or enter direct URL /uploads/mobile-app/banners/..."
                className="w-full px-3 py-1.5 rounded-xl bg-[#07241C] border border-white/25 text-[11px] text-white placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Inputs */}
            <div>
              <label className="text-[11px] font-bold text-[#FDF8EC] uppercase tracking-wider block mb-1">
                Banner Headline Title *
              </label>
              <input
                type="text"
                value={editingBanner.title}
                onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                placeholder="e.g. Flat ₹200 OFF on Complete Hair Revival Kit"
                className="w-full px-3 py-2 rounded-xl bg-[#07241C] border border-white/25 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#FDF8EC] uppercase tracking-wider block mb-1">
                Subtitle / Offer Details
              </label>
              <input
                type="text"
                value={editingBanner.subtitle || ''}
                onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                placeholder="e.g. Free Express Delivery across India with wooden neem comb gift"
                className="w-full px-3 py-2 rounded-xl bg-[#07241C] border border-white/25 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#FDF8EC] uppercase tracking-wider block mb-1">
                  Coupon Code (Optional)
                </label>
                <input
                  type="text"
                  value={editingBanner.couponCode || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, couponCode: e.target.value })}
                  placeholder="e.g. TRIBAL200"
                  className="w-full px-3 py-2 rounded-xl bg-[#07241C] border border-white/25 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#FDF8EC] uppercase tracking-wider block mb-1">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={editingBanner.ctaText || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, ctaText: e.target.value })}
                  placeholder="e.g. Claim Discount"
                  className="w-full px-3 py-2 rounded-xl bg-[#07241C] border border-white/25 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#FDF8EC] uppercase tracking-wider block mb-1">
                  Link / Action Destination
                </label>
                <select
                  value={editingBanner.linkAction}
                  onChange={(e) => setEditingBanner({ ...editingBanner, linkAction: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#07241C] border border-white/25 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="shop">Shop All Remedies</option>
                  <option value="analysis">Hair Root Analysis</option>
                  <optgroup label="Direct Products">
                    {products.map((p) => (
                      <option key={p.id} value={`product:${p.id}`}>
                        Product: {p.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Direct Categories">
                    {categories.map((c) => (
                      <option key={c.id} value={`category:${c.id}`}>
                        Category: {c.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#FDF8EC] uppercase tracking-wider block mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={editingBanner.displayOrder}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, displayOrder: parseInt(e.target.value, 10) || 1 })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#07241C] border border-white/25 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

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
                Save Banner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
