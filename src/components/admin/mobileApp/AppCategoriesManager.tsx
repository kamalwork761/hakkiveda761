import React, { useState } from 'react';
import {
  Grid,
  Plus,
  Trash2,
  Edit2,
  Upload,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Check,
  X,
} from 'lucide-react';
import { MobileAppFeaturedCategory } from '../../../types/mobileApp';
import { Category } from '../../../types/store';
import { resolveAssetUrl } from '../../../app/utils/nativeUrl';

interface AppCategoriesManagerProps {
  categories: Category[];
  featuredCategories: MobileAppFeaturedCategory[];
  onSave: (updated: MobileAppFeaturedCategory[]) => void;
  isSaving: boolean;
}

export const AppCategoriesManager: React.FC<AppCategoriesManagerProps> = ({
  categories,
  featuredCategories,
  onSave,
  isSaving,
}) => {
  const [editingCategory, setEditingCategory] = useState<MobileAppFeaturedCategory | null>(null);
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
    const nextOrder = featuredCategories.length > 0
      ? Math.max(...featuredCategories.map((c) => c.displayOrder || 0)) + 1
      : 1;

    setEditingCategory({
      id: `app-cat-${Date.now()}`,
      categoryId: categories[0]?.id || 'cat-1',
      customTitle: categories[0]?.name || 'Category',
      icon: 'Sparkles',
      imageUrl: '/images/hero_tribal_elders.jpg',
      displayOrder: nextOrder,
      enabled: true,
    });
    setUploadStatus({ uploading: false, progress: 0, error: null, success: false });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MobileAppFeaturedCategory) => {
    setEditingCategory({ ...item });
    setUploadStatus({ uploading: false, progress: 0, error: null, success: false });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Remove this category tile from the mobile app scroll?')) return;
    const updated = featuredCategories.filter((c) => c.id !== id);
    onSave(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= featuredCategories.length) return;
    const updated = [...featuredCategories];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    updated.forEach((c, idx) => {
      c.displayOrder = idx + 1;
    });
    onSave(updated);
  };

  const handleToggleEnabled = (id: string) => {
    const updated = featuredCategories.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c));
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

      const res = await fetch('/api/upload/mobile-app?folder=categories', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.url) {
        throw new Error(data.error || 'Server upload failed');
      }

      setUploadStatus({ uploading: false, progress: 100, error: null, success: true });
      if (editingCategory) {
        setEditingCategory({ ...editingCategory, imageUrl: data.url });
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
    if (!editingCategory) return;
    if (!editingCategory.customTitle.trim()) {
      alert('Please enter a display label.');
      return;
    }

    const existingIdx = featuredCategories.findIndex((c) => c.id === editingCategory.id);
    let updated: MobileAppFeaturedCategory[];
    if (existingIdx >= 0) {
      updated = [...featuredCategories];
      updated[existingIdx] = editingCategory;
    } else {
      updated = [...featuredCategories, editingCategory];
    }

    onSave(updated);
    setIsModalOpen(false);
  };

  const sortedCategories = [...featuredCategories].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Grid className="w-4 h-4 text-[#C5A059]" />
            <span>Featured App Categories</span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Quick-access circular and square pills at the top of the Android home screen.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-[#C5A059] text-[#0E382C] font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-[#d4af37] transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add App Category</span>
        </button>
      </div>

      {/* Recommended Specs */}
      <div className="bg-[#0E382C]/70 border border-[#C5A059]/30 rounded-xl p-3.5 flex items-start gap-3 text-xs text-emerald-100">
        <Sparkles className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-[#C5A059]">Recommended Artwork Specifications:</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-300">
            <span>• Aspect Ratio: <strong>1:1 Square</strong></span>
            <span>• Dimensions: <strong>600 × 600 px</strong></span>
            <span>• Formats: <strong>JPG, JPEG, PNG, WebP</strong></span>
            <span>• Storage: <code>/uploads/mobile-app/categories/</code></span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {sortedCategories.map((item, index) => {
          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl bg-black/30 border flex items-center justify-between gap-3 transition-all ${
                item.enabled ? 'border-white/10 hover:border-[#C5A059]/40' : 'border-red-500/20 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 overflow-hidden flex-shrink-0">
                  <img
                    src={resolveAssetUrl(item.imageUrl || '/images/hero_tribal_elders.jpg')}
                    alt={item.customTitle}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/hero_tribal_elders.jpg';
                    }}
                  />
                </div>

                <div className="min-w-0">
                  <span className="text-[10px] text-[#C5A059] font-bold block">
                    Order #{item.displayOrder}
                  </span>
                  <h4 className="font-serif text-xs font-bold text-white truncate">
                    {item.customTitle}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    Linked: {item.categoryId === 'ALL' ? 'All Remedies' : item.categoryId}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
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
                  disabled={index === sortedCategories.length - 1}
                  onClick={() => handleMove(index, 'down')}
                  className="p-1 rounded-lg bg-white/5 text-slate-300 hover:text-white disabled:opacity-30"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleEnabled(item.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.enabled ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {item.enabled ? 'Active' : 'Off'}
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-[#C5A059] hover:text-[#0E382C] transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-[#0c2920] border border-[#C5A059]/40 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center font-bold">
                  <Grid className="w-4 h-4" />
                </span>
                <h3 className="font-serif text-lg font-bold text-white">Configure App Category</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-slate-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Category Select */}
            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Link to Master Catalog Category
              </label>
              <select
                value={editingCategory.categoryId}
                onChange={(e) => {
                  const val = e.target.value;
                  const cat = categories.find((c) => c.id === val);
                  setEditingCategory({
                    ...editingCategory,
                    categoryId: val,
                    customTitle: cat ? cat.name : (val === 'ALL' ? 'All Remedies' : editingCategory.customTitle),
                  });
                }}
                className="w-full px-3 py-2 rounded-xl bg-[#0c2920] border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059]"
              >
                <option value="ALL">All Remedies (View All Catalog)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                App-Specific Display Label
              </label>
              <input
                type="text"
                value={editingCategory.customTitle}
                onChange={(e) => setEditingCategory({ ...editingCategory, customTitle: e.target.value })}
                placeholder="e.g. Hair Oils, Lepa Powder"
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Image Upload */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-bold text-white block">Category Icon / Image (600 × 600 px)</span>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-slate-900 border border-white/20 overflow-hidden flex-shrink-0">
                  <img
                    src={resolveAssetUrl(editingCategory.imageUrl || '/images/hero_tribal_elders.jpg')}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/hero_tribal_elders.jpg';
                    }}
                  />
                </div>

                <div className="flex-1 space-y-1.5">
                  <label className="cursor-pointer block">
                    <div className="px-3 py-2 rounded-xl border border-dashed border-[#C5A059]/50 hover:border-[#C5A059] bg-white/5 text-center transition-all flex items-center justify-center gap-2 text-xs font-semibold text-[#C5A059]">
                      <Upload className="w-4 h-4" />
                      <span>{uploadStatus.uploading ? `Uploading (${uploadStatus.progress}%)...` : 'Upload 1:1 Image'}</span>
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
                    value={editingCategory.imageUrl || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, imageUrl: e.target.value })}
                    placeholder="/uploads/mobile-app/categories/..."
                    className="w-full px-3 py-1 rounded-xl bg-black/40 border border-white/20 text-[11px] text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={editingCategory.displayOrder}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, displayOrder: parseInt(e.target.value, 10) || 1 })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Status
                </label>
                <select
                  value={editingCategory.enabled ? 'true' : 'false'}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, enabled: e.target.value === 'true' })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#0c2920] border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="true">Active in App</option>
                  <option value="false">Hidden</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-white/20 text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-[#C5A059] text-[#0E382C] font-bold text-xs shadow-md hover:bg-[#d4af37]"
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
