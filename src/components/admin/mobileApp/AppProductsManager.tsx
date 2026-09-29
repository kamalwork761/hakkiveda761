import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Upload,
  Eye,
  Check,
  AlertCircle,
  Sparkles,
  X,
  Search,
  Tag,
  ShieldCheck,
  Package,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { MobileAppProductOverride } from '../../../types/mobileApp';
import { Product } from '../../../types/store';
import { resolveAssetUrl } from '../../../app/utils/nativeUrl';
import { formatSafeINR } from '../../../app/utils/formatMoney';

interface AppProductsManagerProps {
  products: Product[];
  overrides: Record<string, MobileAppProductOverride>;
  onSave: (updatedOverrides: Record<string, MobileAppProductOverride>) => void;
  isSaving: boolean;
}

export const AppProductsManager: React.FC<AppProductsManagerProps> = ({
  products,
  overrides,
  onSave,
  isSaving,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [editingOverride, setEditingOverride] = useState<MobileAppProductOverride | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulletInput, setBulletInput] = useState('');

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

  const handleOpenNewOverride = (pId?: string) => {
    const prod = pId ? products.find((p) => p.id === pId) : products[0];
    if (!prod) return;

    const existing = overrides[prod.id];
    if (existing) {
      setEditingOverride({ ...existing });
    } else {
      setEditingOverride({
        productId: prod.id,
        enabled: true,
        appTitle: '',
        appSubtitle: '',
        appImage: '',
        appSecondaryImage: '',
        badge: 'Featured',
        cardCtaLabel: 'Buy Now',
        featureOrder: 1,
        sectionAssignment: 'all',
        appHeadline: '',
        benefitBullets: [],
        quickIngredients: '',
        usageSummary: '',
        trustBadgeText: '100% Forest-Crafted • Tribal Certified',
      });
    }
    setUploadStatus({ uploading: false, progress: 0, error: null, success: false });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (override: MobileAppProductOverride) => {
    setEditingOverride({
      ...override,
      benefitBullets: Array.isArray(override.benefitBullets) ? [...override.benefitBullets] : [],
    });
    setUploadStatus({ uploading: false, progress: 0, error: null, success: false });
    setIsModalOpen(true);
  };

  const handleDeleteOverride = (productId: string) => {
    if (!window.confirm('Remove app-specific presentation overrides for this product? Shared catalog data will remain intact.')) return;
    const updated = { ...overrides };
    delete updated[productId];
    onSave(updated);
  };

  const handleToggleEnabled = (productId: string) => {
    const current = overrides[productId];
    if (!current) return;
    const updated = {
      ...overrides,
      [productId]: { ...current, enabled: !current.enabled },
    };
    onSave(updated);
  };

  const handleFileUpload = async (file: File, field: 'appImage' | 'appSecondaryImage') => {
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

      const res = await fetch('/api/upload/mobile-app?folder=products', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.url) {
        throw new Error(data.error || 'Server upload failed');
      }

      setUploadStatus({ uploading: false, progress: 100, error: null, success: true });
      if (editingOverride) {
        setEditingOverride({ ...editingOverride, [field]: data.url });
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

  const handleAddBullet = () => {
    if (!bulletInput.trim() || !editingOverride) return;
    const currentBullets = editingOverride.benefitBullets || [];
    setEditingOverride({
      ...editingOverride,
      benefitBullets: [...currentBullets, bulletInput.trim()],
    });
    setBulletInput('');
  };

  const handleRemoveBullet = (index: number) => {
    if (!editingOverride) return;
    const currentBullets = editingOverride.benefitBullets || [];
    setEditingOverride({
      ...editingOverride,
      benefitBullets: currentBullets.filter((_, idx) => idx !== index),
    });
  };

  const handleSaveModal = () => {
    if (!editingOverride) return;
    const updated = {
      ...overrides,
      [editingOverride.productId]: editingOverride,
    };
    onSave(updated);
    setIsModalOpen(false);
  };

  const overrideList: MobileAppProductOverride[] = Object.values(overrides) as MobileAppProductOverride[];
  const activeProduct = editingOverride
    ? products.find((p) => p.id === editingOverride.productId)
    : null;

  // Filter products for quick override creation
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              App Product Merchandising & Detail Manager
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            Customize how products appear inside the Android app without touching master pricing, stock, SKU, or reviews.
            If no app image or title override is set, the app automatically inherits the master catalog values.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedProductId}
            onChange={(e) => {
              if (e.target.value) {
                handleOpenNewOverride(e.target.value);
                setSelectedProductId('');
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-[#0c2920] border border-[#C5A059]/40 text-xs text-[#C5A059] font-bold focus:outline-none"
          >
            <option value="">+ Customize a Product for App...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {overrides[p.id] ? '★ (Configured)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Shared Principles Notice */}
      <div className="bg-[#0E382C]/70 border border-[#C5A059]/30 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-100">
        <Info className="w-5 h-5 text-[#C5A059] flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-[#C5A059]">Shared vs App-Specific Architecture:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
            <div className="bg-black/20 p-2 rounded-lg border border-white/5">
              <strong className="text-emerald-300 block mb-0.5">Shared From Master Products (Automatic):</strong>
              <span>Price, MRP, SKU, Inventory Stock, Reviews, Customer Orders, Gateways.</span>
            </div>
            <div className="bg-black/20 p-2 rounded-lg border border-white/5">
              <strong className="text-[#C5A059] block mb-0.5">App-Exclusive Overrides (Optional):</strong>
              <span>App title, short subtitle, 1100×1100 1:1 image, custom badges, headline bullets & ritual text.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Configured App Products List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Active App Overrides ({overrideList.length})
          </h3>
          <span className="text-[11px] text-slate-400">
            Saved to <code>/api/store/mobile_app_products</code>
          </span>
        </div>

        {overrideList.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center space-y-3">
            <Package className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-xs text-slate-300">
              No app-specific product overrides created yet. The Android app currently displays normal catalog data.
            </p>
            <button
              type="button"
              onClick={() => handleOpenNewOverride(products[0]?.id)}
              className="px-4 py-2 rounded-xl bg-[#C5A059] text-[#0E382C] font-bold text-xs shadow-sm hover:bg-[#d4af37]"
            >
              Customize First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {overrideList.map((item) => {
              const origProduct = products.find((p) => p.id === item.productId);
              if (!origProduct) return null;

              const displayImg = item.appImage || origProduct.image || origProduct.images?.[0];
              const isUsingOverrideImg = Boolean(item.appImage);

              return (
                <div
                  key={item.productId}
                  className={`rounded-2xl border p-3.5 bg-black/30 flex gap-3 items-start justify-between transition-all ${
                    item.enabled ? 'border-white/10 hover:border-[#C5A059]/40' : 'border-red-500/20 opacity-60'
                  }`}
                >
                  <div className="flex gap-3 items-center min-w-0">
                    <div className="relative w-16 h-16 rounded-xl bg-slate-900 overflow-hidden flex-shrink-0 border border-white/10">
                      <img
                        src={resolveAssetUrl(displayImg)}
                        alt={origProduct.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/hero_tribal_elders.jpg';
                        }}
                      />
                      {isUsingOverrideImg && (
                        <span className="absolute bottom-0 inset-x-0 bg-[#0E382C] text-[#C5A059] text-[8px] font-bold text-center py-0.5 uppercase tracking-tighter">
                          App Image
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30">
                            {item.badge}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {origProduct.id}
                        </span>
                      </div>

                      <h4 className="font-serif text-xs font-bold text-white truncate mt-1">
                        {item.appTitle || origProduct.name}
                      </h4>
                      <p className="text-[10px] text-slate-300 truncate mt-0.5">
                        {item.appSubtitle || origProduct.subtitle || 'Shared catalog subtitle'}
                      </p>

                      <div className="mt-1 flex items-center gap-2 text-[10px]">
                        <span className="text-emerald-400 font-bold">
                          {formatSafeINR(origProduct.price)} (Shared)
                        </span>
                        <span className="text-slate-400">• CTA: "{item.cardCtaLabel || 'Buy Now'}"</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleEnabled(item.productId)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.enabled ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {item.enabled ? 'Active' : 'Muted'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-[#C5A059] hover:text-[#0E382C] transition-all"
                        title="Edit override"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteOverride(item.productId)}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                        title="Remove override"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit / Configure Modal */}
      {isModalOpen && editingOverride && activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-[#0c2920] border border-[#C5A059]/40 rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center font-bold">
                  <Tag className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    App Overrides: {activeProduct.name}
                  </h3>
                  <span className="text-[11px] text-emerald-200/70">
                    Product ID: {activeProduct.id} • SKU: {activeProduct.sku || 'N/A'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-slate-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Read-only Shared Catalog Info */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Master Price</span>
                <span className="font-bold text-emerald-400 text-sm">{formatSafeINR(activeProduct.price)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">MRP / Original</span>
                <span className="text-slate-300">{formatSafeINR(activeProduct.originalPrice || activeProduct.price * 1.45)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Inventory Stock</span>
                <span className="text-slate-300 font-bold">{activeProduct.stock || 250} units</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Master Category</span>
                <span className="text-slate-300">{activeProduct.category || 'Remedies'}</span>
              </div>
            </div>

            {/* App Image Upload (1100x1100 square 1:1) */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    App-Specific Product Image (1:1 Square)
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Recommended: 1100 × 1100 px • Uploads to <code>/uploads/mobile-app/products/</code>
                  </span>
                </div>

                {editingOverride.appImage && (
                  <button
                    type="button"
                    onClick={() => setEditingOverride({ ...editingOverride, appImage: '' })}
                    className="text-[10px] text-red-300 hover:text-red-200 underline"
                  >
                    Clear Override (Use Catalog Image)
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-slate-900 border border-white/20 overflow-hidden flex-shrink-0">
                  <img
                    src={resolveAssetUrl(editingOverride.appImage || activeProduct.image || activeProduct.images?.[0])}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/hero_tribal_elders.jpg';
                    }}
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <label className="cursor-pointer block">
                    <div className="px-3 py-2 rounded-xl border border-dashed border-[#C5A059]/60 hover:border-[#C5A059] bg-white/5 hover:bg-white/10 text-center transition-all flex items-center justify-center gap-2 text-xs font-semibold text-[#C5A059]">
                      <Upload className="w-4 h-4" />
                      <span>{uploadStatus.uploading ? `Uploading (${uploadStatus.progress}%)...` : 'Upload 1:1 App Product Image'}</span>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      disabled={uploadStatus.uploading}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'appImage');
                      }}
                    />
                  </label>

                  <input
                    type="text"
                    value={editingOverride.appImage || ''}
                    onChange={(e) => setEditingOverride({ ...editingOverride, appImage: e.target.value })}
                    placeholder="Or enter direct URL /uploads/mobile-app/products/..."
                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/20 text-[11px] text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {uploadStatus.uploading && (
                <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div className="bg-[#C5A059] h-full transition-all" style={{ width: `${uploadStatus.progress}%` }} />
                </div>
              )}
            </div>

            {/* Overrides: Title, Subtitle, Badges, CTA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  App Display Title Override
                </label>
                <input
                  type="text"
                  value={editingOverride.appTitle || ''}
                  onChange={(e) => setEditingOverride({ ...editingOverride, appTitle: e.target.value })}
                  placeholder={`Catalog: ${activeProduct.name}`}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  App Short Subtitle Override
                </label>
                <input
                  type="text"
                  value={editingOverride.appSubtitle || ''}
                  onChange={(e) => setEditingOverride({ ...editingOverride, appSubtitle: e.target.value })}
                  placeholder={`Catalog: ${activeProduct.subtitle || '108 Sacred Forest Herbs'}`}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  App Badge Label
                </label>
                <input
                  type="text"
                  value={editingOverride.badge || ''}
                  onChange={(e) => setEditingOverride({ ...editingOverride, badge: e.target.value })}
                  placeholder="e.g. Best Seller, New, 108 Herbs"
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Card CTA Button Label
                </label>
                <input
                  type="text"
                  value={editingOverride.cardCtaLabel || ''}
                  onChange={(e) => setEditingOverride({ ...editingOverride, cardCtaLabel: e.target.value })}
                  placeholder="e.g. Buy Now, Quick Add"
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  App Section Placement
                </label>
                <select
                  value={editingOverride.sectionAssignment || 'all'}
                  onChange={(e) => setEditingOverride({ ...editingOverride, sectionAssignment: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0c2920] border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="all">All App Carousels</option>
                  <option value="best_seller">Best Seller Carousel</option>
                  <option value="recommended">Recommended Products</option>
                  <option value="flagship">Flagship Feature</option>
                  <option value="featured">Featured Collection</option>
                  <option value="none">Only In Catalog Shop</option>
                </select>
              </div>
            </div>

            {/* Requirement 10: APP-SPECIFIC PRODUCT DETAIL CONTENT */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                  App-Specific Product Detail Content (Optional Overrides)
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Enhance the mobile product detail view with custom headlines, benefit bullet points, ingredients and usage ritual. If blank, standard catalog data is used.
              </p>

              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Short Detail Headline
                </label>
                <input
                  type="text"
                  value={editingOverride.appHeadline || ''}
                  onChange={(e) => setEditingOverride({ ...editingOverride, appHeadline: e.target.value })}
                  placeholder="e.g. Handmade by Hakki-Pikki Elders in Pakshirajapura Forest"
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Benefit Bullets */}
              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Key Benefit Bullets
                </label>
                <div className="space-y-1.5 mb-2">
                  {(editingOverride.benefitBullets || []).map((bullet, idx) => (
                    <div key={idx} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-xs text-slate-200">
                      <span>• {bullet}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBullet(idx)}
                        className="text-red-400 hover:text-red-300 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={bulletInput}
                    onChange={(e) => setBulletInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddBullet();
                      }
                    }}
                    placeholder="Type benefit bullet and press Add..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    type="button"
                    onClick={handleAddBullet}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-[#C5A059]"
                  >
                    + Add Bullet
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Quick Key Ingredients Summary
                  </label>
                  <textarea
                    rows={2}
                    value={editingOverride.quickIngredients || ''}
                    onChange={(e) => setEditingOverride({ ...editingOverride, quickIngredients: e.target.value })}
                    placeholder="e.g. Bhringraj, Wild Amla, Brahmi, Gunja, Neelambari..."
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059] resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Application Ritual / Usage Summary
                  </label>
                  <textarea
                    rows={2}
                    value={editingOverride.usageSummary || ''}
                    onChange={(e) => setEditingOverride({ ...editingOverride, usageSummary: e.target.value })}
                    placeholder="e.g. Warm 5ml between palms, massage scalp for 10 minutes at bedtime..."
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059] resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Trust Badge Text
                </label>
                <input
                  type="text"
                  value={editingOverride.trustBadgeText || ''}
                  onChange={(e) => setEditingOverride({ ...editingOverride, trustBadgeText: e.target.value })}
                  placeholder="e.g. 100% Forest-Crafted • Tribal Certified"
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>
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
                className="px-5 py-2 rounded-xl bg-[#C5A059] text-[#0E382C] font-bold text-xs shadow-md hover:bg-[#d4af37] disabled:opacity-50"
              >
                Save App Overrides
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
