import React, { useState } from 'react';
import { formatAdminINR } from '../utils/adminCurrency';
import {
  Film,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  Upload,
  Save,
  CheckCircle2,
  X,
  Sparkles,
  Smartphone,
  Video,
  ShoppingBag,
  MessageCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { uploadFileToServer } from '../utils/upload';
import { ShoppableReel } from '../types/store';

interface AdminShoppableReelsManagerProps {
  showToast?: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminShoppableReelsManager: React.FC<AdminShoppableReelsManagerProps> = ({
  showToast,
}) => {
  const {
    shoppableReels,
    addShoppableReel,
    updateShoppableReel,
    deleteShoppableReel,
    reorderShoppableReels,
    products,
    formatPrice,
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<ShoppableReel | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [country, setCountry] = useState('');
  const [caption, setCaption] = useState('');
  const [verifiedBadge, setVerifiedBadge] = useState(true);
  const [linkedProductId, setLinkedProductId] = useState('');
  const [showViewProductButton, setShowViewProductButton] = useState(true);
  const [showAddToCartButton, setShowAddToCartButton] = useState(true);
  const [showBuyNowButton, setShowBuyNowButton] = useState(true);
  const [showWhatsappButton, setShowWhatsappButton] = useState(true);
  const [active, setActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(1);

  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);

  // Open modal for new reel
  const handleOpenAddModal = () => {
    setEditingReel(null);
    setTitle('');
    setVideoUrl('');
    setPosterUrl('');
    setCustomerName('');
    setCountry('');
    setCaption('');
    setVerifiedBadge(true);
    setLinkedProductId(products[0]?.id || 'prod-1');
    setShowViewProductButton(true);
    setShowAddToCartButton(true);
    setShowBuyNowButton(true);
    setShowWhatsappButton(true);
    setActive(true);
    setSortOrder(shoppableReels.length + 1);
    setIsModalOpen(true);
  };

  // Open modal for editing reel
  const handleOpenEditModal = (reel: ShoppableReel) => {
    setEditingReel(reel);
    setTitle(reel.title);
    setVideoUrl(reel.videoUrl);
    setPosterUrl(reel.posterUrl);
    setCustomerName(reel.customerName);
    setCountry(reel.country);
    setCaption(reel.caption);
    setVerifiedBadge(reel.verifiedBadge);
    setLinkedProductId(reel.linkedProductId);
    setShowViewProductButton(reel.showViewProductButton !== false);
    setShowAddToCartButton(reel.showAddToCartButton !== false);
    setShowBuyNowButton(reel.showBuyNowButton !== false);
    setShowWhatsappButton(reel.showWhatsappButton !== false);
    setActive(reel.active !== false);
    setSortOrder(reel.sortOrder || 1);
    setIsModalOpen(true);
  };

  // File Upload Handlers
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    try {
      const url = await uploadFileToServer(file);
      setVideoUrl(url);
      if (showToast) showToast('Reel video uploaded successfully!', 'success');
    } catch (err) {
      if (showToast) showToast('Failed to upload video.', 'error');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPoster(true);
    try {
      const url = await uploadFileToServer(file);
      setPosterUrl(url);
      if (showToast) showToast('Poster thumbnail uploaded successfully!', 'success');
    } catch (err) {
      if (showToast) showToast('Failed to upload thumbnail.', 'error');
    } finally {
      setIsUploadingPoster(false);
    }
  };

  // Submit Save
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) {
      if (showToast) showToast('Title and video URL/file are required.', 'error');
      return;
    }

    const reelData = {
      title,
      videoUrl,
      posterUrl,
      customerName,
      country,
      caption,
      verifiedBadge,
      linkedProductId,
      showViewProductButton,
      showAddToCartButton,
      showBuyNowButton,
      showWhatsappButton,
      active,
      sortOrder,
    };

    try {
      if (editingReel) {
        await updateShoppableReel(editingReel.id, reelData);
        if (showToast) showToast('Reel updated successfully!', 'success');
      } else {
        await addShoppableReel(reelData);
        if (showToast) showToast('New shoppable reel added!', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      if (showToast) showToast('Error saving reel.', 'error');
    }
  };

  // Reorder Handlers
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...shoppableReels];
    const temp = newList[index];
    newList[index] = newList[index - 1];
    newList[index - 1] = temp;
    reorderShoppableReels(newList);
  };

  const handleMoveDown = (index: number) => {
    if (index === shoppableReels.length - 1) return;
    const newList = [...shoppableReels];
    const temp = newList[index];
    newList[index] = newList[index + 1];
    newList[index + 1] = temp;
    reorderShoppableReels(newList);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this shoppable reel?')) {
      await deleteShoppableReel(id);
      if (showToast) showToast('Reel deleted.', 'success');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[var(--brand-primary-dark,#123F2B)] to-[#1b5038] text-white p-6 rounded-2xl shadow-lg border border-[var(--brand-gold,#D4AF37)]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--brand-gold,#D4AF37)] mb-1">
            <Film className="w-4 h-4" />
            <span>Vertical Video Commerce</span>
          </div>
          <h2 className="text-2xl font-serif font-bold">Shoppable Reels Manager</h2>
          <p className="text-sm text-slate-200 mt-1">
            Manage 9:16 vertical video reels featuring customer transformations, tribal rituals, and linked product buy buttons.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--brand-gold,#D4AF37)] text-[var(--brand-primary-dark,#123F2B)] font-bold text-sm shadow-md hover:bg-amber-300 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Reel</span>
        </button>
      </div>

      {/* Reels Table / Grid List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Total Reels: {shoppableReels.length}
          </span>
        </div>

        {shoppableReels.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Film className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">No shoppable reels added yet.</p>
            <p className="text-xs text-slate-500 mt-1">
              Click "Add New Reel" to upload your first vertical video.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {shoppableReels.map((reel, index) => {
              const product = products.find((p) => p.id === reel.linkedProductId);

              return (
                <div
                  key={reel.id}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Thumbnail */}
                    <div className="relative w-16 h-24 rounded-xl overflow-hidden bg-black shrink-0 border border-[var(--brand-gold,#D4AF37)]/40 shadow-sm">
                      <img
                        src={reel.posterUrl || '/images/hakkiveda_108_oil_gold.jpg'}
                        alt={reel.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Video className="w-5 h-5 text-white opacity-80" />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm md:text-base truncate">
                          {reel.title}
                        </h3>
                        {reel.active === false && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-600">
                            Inactive
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="font-semibold text-slate-700">{reel.customerName}</span>
                        {reel.country && <span>• {reel.country}</span>}
                        {reel.verifiedBadge && (
                          <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3 text-[var(--brand-gold,#D4AF37)]" />
                            Verified
                          </span>
                        )}
                      </div>

                      {product && (
                        <div className="text-xs text-amber-800 font-semibold flex items-center gap-1.5 pt-0.5">
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Linked: {product.name} ({formatAdminINR(product.priceINR)})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === shoppableReels.length - 1}
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(reel)}
                      className="px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs border border-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(reel.id)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Reel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            {/* Header */}
            <div className="bg-[var(--brand-primary-dark,#123F2B)] text-white p-5 flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold flex items-center gap-2">
                <Film className="w-5 h-5 text-[var(--brand-gold,#D4AF37)]" />
                <span>{editingReel ? 'Edit Shoppable Reel' : 'Add New Shoppable Reel'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Reel Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 60 Days Hair Regrowth Story"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Customer / Creator Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Country / City</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. India or Dubai, UAE"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={verifiedBadge}
                      onChange={(e) => setVerifiedBadge(e.target.checked)}
                      className="w-4 h-4 accent-[var(--brand-primary-dark,#123F2B)]"
                    />
                    <span>Show Verified Customer Badge</span>
                  </label>
                </div>
              </div>

              {/* Video Source Upload / URL */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Video File (9:16 Vertical MP4 / WEBM URL) *
                </label>
                <input
                  type="text"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://assets.mixkit.co/videos/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer border border-slate-300">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingVideo ? 'Uploading...' : 'Upload Video File'}</span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={handleVideoUpload}
                    className="hidden"
                    disabled={isUploadingVideo}
                  />
                </label>
              </div>

              {/* Poster Thumbnail Upload / URL */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Poster Thumbnail Image</label>
                <input
                  type="text"
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  placeholder="/images/after_female_parting.jpg"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer border border-slate-300">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingPoster ? 'Uploading...' : 'Upload Thumbnail Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterUpload}
                    className="hidden"
                    disabled={isUploadingPoster}
                  />
                </label>
              </div>

              {/* Caption Text Area */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Caption / Review Quote
                </label>
                <textarea
                  rows={3}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write customer review or reel description..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              {/* Linked Product Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Linked Product (Shoppable Integration)
                </label>
                <select
                  value={linkedProductId}
                  onChange={(e) => setLinkedProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="">None (No linked product)</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatAdminINR(p.priceINR)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Button Toggles */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Visible Action Buttons on Reel
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={showViewProductButton}
                      onChange={(e) => setShowViewProductButton(e.target.checked)}
                      className="w-4 h-4 accent-[var(--brand-primary-dark,#123F2B)]"
                    />
                    <span>"View Product" Button</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={showAddToCartButton}
                      onChange={(e) => setShowAddToCartButton(e.target.checked)}
                      className="w-4 h-4 accent-[var(--brand-primary-dark,#123F2B)]"
                    />
                    <span>"Add to Cart" Button</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={showBuyNowButton}
                      onChange={(e) => setShowBuyNowButton(e.target.checked)}
                      className="w-4 h-4 accent-[var(--brand-primary-dark,#123F2B)]"
                    />
                    <span>"Buy Now" Button</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={showWhatsappButton}
                      onChange={(e) => setShowWhatsappButton(e.target.checked)}
                      className="w-4 h-4 accent-[var(--brand-primary-dark,#123F2B)]"
                    />
                    <span>"WhatsApp Enquiry" Button</span>
                  </label>
                </div>
              </div>

              {/* Status and Order */}
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-4 h-4 accent-[var(--brand-primary-dark,#123F2B)]"
                  />
                  <span>Active (Visible on Homepage)</span>
                </label>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold text-sm cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[var(--brand-primary-dark,#123F2B)] text-white font-bold text-sm hover:bg-[#1b5038] cursor-pointer shadow-md border border-[var(--brand-gold,#D4AF37)]"
                >
                  Save Reel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
