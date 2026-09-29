import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Upload,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  Tag,
  Leaf,
  Layers,
} from 'lucide-react';
import { MobileAppShopConcern } from '../../../types/mobileApp';
import { Product, Category } from '../../../types/store';
import { resolveAssetUrl } from '../../../app/utils/nativeUrl';

interface AppConcernsManagerProps {
  concerns: MobileAppShopConcern[];
  products: Product[];
  categories: Category[];
  onSave: (updated: MobileAppShopConcern[]) => void;
  isSaving: boolean;
}

export const AppConcernsManager: React.FC<AppConcernsManagerProps> = ({
  concerns,
  products,
  categories,
  onSave,
  isSaving,
}) => {
  const [editingConcern, setEditingConcern] = useState<MobileAppShopConcern | null>(null);
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
    const nextOrder = concerns.length > 0 ? Math.max(...concerns.map((c) => c.displayOrder || 0)) + 1 : 1;
    setEditingConcern({
      id: `concern-${Date.now()}`,
      title: '',
      subtitle: '',
      imageUrl: '/images/hakkiveda_oil_couple_herbs.jpg',
      badge: 'High Impact',
      destination: 'concern:hair_fall',
      displayOrder: nextOrder,
      published: true,
    });
    setUploadStatus({ uploading: false, progress: 0, error: null, success: false });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MobileAppShopConcern) => {
    setEditingConcern({ ...item });
    setUploadStatus({ uploading: false, progress: 0, error: null, success: false });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this Shop by Concern card from the Android app?')) return;
    const updated = concerns.filter((c) => c.id !== id);
    onSave(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= concerns.length) return;
    const updated = [...concerns];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    updated.forEach((c, idx) => {
      c.displayOrder = idx + 1;
    });
    onSave(updated);
  };

  const handleTogglePublished = (id: string) => {
    const updated = concerns.map((c) => (c.id === id ? { ...c, published: !c.published } : c));
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

      const res = await fetch('/api/upload/mobile-app?folder=concerns', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.url) {
        throw new Error(data.error || 'Server upload failed');
      }

      setUploadStatus({ uploading: false, progress: 100, error: null, success: true });
      if (editingConcern) {
        setEditingConcern({ ...editingConcern, imageUrl: data.url });
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
    if (!editingConcern) return;
    if (!editingConcern.title.trim()) {
      alert('Please enter a concern title (e.g. Hair Fall, Baldness).');
      return;
    }

    const existingIdx = concerns.findIndex((c) => c.id === editingConcern.id);
    let updated: MobileAppShopConcern[];
    if (existingIdx >= 0) {
      updated = [...concerns];
      updated[existingIdx] = editingConcern;
    } else {
      updated = [...concerns, editingConcern];
    }

    onSave(updated);
    setIsModalOpen(false);
  };

  const sortedConcerns = [...concerns].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <div className="space-y-6 mobile-app-admin text-white">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#C5A059]" />
            <span>Shop by Concern Manager</span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Manage app-only cards such as Hair Fall, Hair Growth, Baldness, Dandruff, Scalp Care and Hair Thinning.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-[#C5A059] text-[#0E382C] font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-[#d4af37] transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Concern Card</span>
        </button>
      </div>

      {/* Recommended Specs Banner */}
      <div className="bg-[#0E382C]/70 border border-[#C5A059]/30 rounded-xl p-3.5 flex items-start gap-3 text-xs text-emerald-100">
        <Sparkles className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-[#C5A059]">Recommended Concern Artwork:</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-300">
            <span>• Aspect Ratio: <strong>1:1 Square</strong></span>
            <span>• Dimensions: <strong>512 × 512 px</strong></span>
            <span>• Formats: <strong>JPG, JPEG, PNG, WebP</strong></span>
            <span>• Storage Location: <code>/uploads/mobile-app/concerns/</code></span>
          </div>
        </div>
      </div>

      {/* Grid of Concern Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {sortedConcerns.map((item, index) => {
          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl bg-black/30 border flex flex-col justify-between transition-all ${
                item.published ? 'border-white/10 hover:border-[#C5A059]/40' : 'border-red-500/20 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 overflow-hidden flex-shrink-0">
                    <img
                      src={resolveAssetUrl(item.imageUrl || '/images/hakkiveda_oil_couple_herbs.jpg')}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/hakkiveda_oil_couple_herbs.jpg';
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30">
                        {item.badge}
                      </span>
                    )}
                    <span className="bg-black/60 text-slate-400 px-2 py-0.5 rounded text-[10px] font-mono">
                      #{item.displayOrder}
                    </span>
                  </div>
                </div>

                <h3 className="font-serif text-sm font-bold text-white leading-tight">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                  {item.subtitle}
                </p>

                <div className="mt-2 text-[10px] text-emerald-400/90 font-mono">
                  Target: {item.destination}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between">
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
                    disabled={index === sortedConcerns.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    className="p-1 rounded-lg bg-white/5 text-slate-300 hover:text-white disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleTogglePublished(item.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.published ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {item.published ? 'Published' : 'Hidden'}
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
            </div>
          );
        })}
      </div>

      {/* Concern Modal */}
      {isModalOpen && editingConcern && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-[#0c2920] border border-[#C5A059]/40 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto mobile-app-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center font-bold">
                  <Leaf className="w-4 h-4" />
                </span>
                <h3 className="font-serif text-lg font-bold text-[#FDF8EC]">
                  {editingConcern.id.startsWith('concern-') && !editingConcern.title
                    ? 'New Concern Card'
                    : `Edit Concern: ${editingConcern.title || 'Untitled'}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/15 text-white hover:bg-white/25 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="text-[10px] font-bold text-[#FDF8EC] uppercase tracking-wider block mb-1">
                Concern Title *
              </label>
              <input
                type="text"
                value={editingConcern.title}
                onChange={(e) => setEditingConcern({ ...editingConcern, title: e.target.value })}
                placeholder="e.g. Severe Hair Fall, Baldness & Receding Line"
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="text-[10px] font-bold text-[#FDF8EC] uppercase tracking-wider block mb-1">
                Concern Subtitle / Remedy Description
              </label>
              <textarea
                rows={2}
                value={editingConcern.subtitle}
                onChange={(e) => setEditingConcern({ ...editingConcern, subtitle: e.target.value })}
                placeholder="e.g. Strengthen weak roots within 14 days with 108 wood-fired herbs"
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059] resize-none"
              />
            </div>

            {/* Badge & Order */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-[#FDF8EC] uppercase tracking-wider block mb-1">
                  Card Badge (e.g. High Impact, Popular)
                </label>
                <input
                  type="text"
                  value={editingConcern.badge || ''}
                  onChange={(e) => setEditingConcern({ ...editingConcern, badge: e.target.value })}
                  placeholder="e.g. High Impact, Tribal Specialty"
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#FDF8EC] uppercase tracking-wider block mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={editingConcern.displayOrder}
                  onChange={(e) =>
                    setEditingConcern({ ...editingConcern, displayOrder: parseInt(e.target.value, 10) || 1 })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="text-[10px] font-bold text-[#FDF8EC] uppercase tracking-wider block mb-1">
                Click Destination
              </label>
              <select
                value={editingConcern.destination}
                onChange={(e) => setEditingConcern({ ...editingConcern, destination: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0c2920] border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059]"
              >
                <option value="concern:hair_fall">Filter Shop: Hair Fall</option>
                <option value="concern:hair_growth">Filter Shop: Hair Growth</option>
                <option value="concern:baldness">Filter Shop: Baldness</option>
                <option value="concern:dandruff">Filter Shop: Dandruff</option>
                <option value="concern:greying">Filter Shop: Premature Greying</option>
                <option value="concern:frizz">Filter Shop: Dry & Frizzy</option>
                <option value="analysis">Launch Hair Root Diagnostic Quiz</option>
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

            {/* Image Upload (512x512) */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-bold text-white block">Concern Icon / Artwork (512 × 512 px)</span>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-slate-900 border border-white/20 overflow-hidden flex-shrink-0">
                  <img
                    src={resolveAssetUrl(editingConcern.imageUrl || '/images/hakkiveda_oil_couple_herbs.jpg')}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/hakkiveda_oil_couple_herbs.jpg';
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
                    value={editingConcern.imageUrl}
                    onChange={(e) => setEditingConcern({ ...editingConcern, imageUrl: e.target.value })}
                    placeholder="/uploads/mobile-app/concerns/..."
                    className="w-full px-3 py-1 rounded-xl bg-black/40 border border-white/20 text-[11px] text-white placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>

            {/* Published Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-xs font-bold text-white">Active in Android App</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingConcern.published !== false}
                  onChange={(e) => setEditingConcern({ ...editingConcern, published: e.target.checked })}
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
                Save Concern Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
