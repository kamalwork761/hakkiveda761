import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  GripVertical,
  Layers,
  Sparkles,
  DollarSign,
  Package,
  Image as ImageIcon,
  Check,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { ProductVariant } from '../../types/store';
import { uploadFileToServer } from '../../utils/upload';

interface AdminProductVariantsEditorProps {
  variants?: ProductVariant[];
  basePriceINR: number;
  baseSku: string;
  galleryImages: string[];
  onChange: (variants: ProductVariant[]) => void;
  onShowToast?: (msg: string) => void;
}

export const AdminProductVariantsEditor: React.FC<AdminProductVariantsEditorProps> = ({
  variants = [],
  basePriceINR,
  baseSku,
  galleryImages,
  onChange,
  onShowToast,
}) => {
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);

  const notify = (msg: string) => {
    if (onShowToast) onShowToast(msg);
  };

  const handleAddVariant = (presetName?: string, priceMultiplier = 1, weightPreset = '') => {
    const nextIndex = variants.length + 1;
    const name = presetName || `Variant ${nextIndex}`;
    const cleanSku = (baseSku || 'PROD').replace(/\s+/g, '-').toUpperCase();
    const variantSku = `${cleanSku}-${name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}`;
    const price = Math.round(basePriceINR * priceMultiplier) || basePriceINR || 999;
    const mrp = Math.round(price * 1.25);

    const newVariant: ProductVariant = {
      id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      sku: variantSku,
      priceINR: price,
      originalPriceINR: mrp,
      stock: 50,
      weight: weightPreset || '',
      size: name,
      image: galleryImages[0] || '',
      active: true,
    };

    const next = [...variants, newVariant];
    onChange(next);
    setEditingVariantId(newVariant.id);
    notify(`Added ${name} variant`);
  };

  const handleApplyPresets = (type: 'oil' | 'powder' | 'sizes') => {
    const cleanSku = (baseSku || 'HKV-PROD').replace(/\s+/g, '-').toUpperCase();
    let presetList: Array<{ name: string; mult: number; weight: string }> = [];

    if (type === 'oil') {
      presetList = [
        { name: '100 ml', mult: 0.65, weight: '120 g' },
        { name: '200 ml', mult: 1.0, weight: '240 g' },
        { name: '500 ml', mult: 2.2, weight: '560 g' },
        { name: '1 Litre Family Pack', mult: 3.8, weight: '1100 g' },
      ];
    } else if (type === 'powder') {
      presetList = [
        { name: '100 g Trial', mult: 0.6, weight: '110 g' },
        { name: '250 g Standard', mult: 1.0, weight: '270 g' },
        { name: '500 g Value Pack', mult: 1.8, weight: '540 g' },
      ];
    } else {
      presetList = [
        { name: 'Small', mult: 0.85, weight: '150 g' },
        { name: 'Medium (Standard)', mult: 1.0, weight: '250 g' },
        { name: 'Large / Jumbo', mult: 1.35, weight: '400 g' },
      ];
    }

    const newVariants: ProductVariant[] = presetList.map((p, idx) => {
      const price = Math.round(basePriceINR * p.mult) || 999;
      return {
        id: `var-${Date.now()}-${idx}`,
        name: p.name,
        sku: `${cleanSku}-${p.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}`,
        priceINR: price,
        originalPriceINR: Math.round(price * 1.3),
        stock: 100,
        weight: p.weight,
        size: p.name,
        image: galleryImages[idx % (galleryImages.length || 1)] || '',
        active: true,
      };
    });

    onChange(newVariants);
    notify(`Generated ${newVariants.length} standard variants!`);
  };

  const handleUpdateVariant = (id: string, updates: Partial<ProductVariant>) => {
    const next = variants.map((v) => (v.id === id ? { ...v, ...updates } : v));
    onChange(next);
  };

  const handleDeleteVariant = (id: string) => {
    const next = variants.filter((v) => v.id !== id);
    onChange(next);
    notify('Variant deleted');
  };

  const handleToggleActive = (id: string) => {
    const target = variants.find((v) => v.id === id);
    if (!target) return;
    handleUpdateVariant(id, { active: target.active === false ? true : false });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= variants.length) return;

    const next = [...variants];
    const temp = next[index];
    next[index] = next[newIndex];
    next[newIndex] = temp;
    onChange(next);
  };

  const handleUploadVariantImage = async (id: string, file: File) => {
    try {
      const url = await uploadFileToServer(file);
      handleUpdateVariant(id, { image: url });
      notify('Variant image updated');
    } catch (err: any) {
      notify(`Image upload failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-5 text-xs font-sans">
      {/* Header with Quick Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <label className="text-slate-100 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--brand-gold)]" />
            <span>Product Sizes & Pack Variants</span>
          </label>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Configure different volumes, weights, prices, SKUs, and stock quantities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleAddVariant()}
            className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider hover:bg-white transition-all flex items-center gap-1.5 shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Variant</span>
          </button>
        </div>
      </div>

      {/* Quick Generator Buttons */}
      <div className="p-3 bg-[var(--brand-primary-deep,#07150E)] border border-white/10 rounded-xl space-y-2">
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">
          ⚡ Quick Preset Generators
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleApplyPresets('oil')}
            className="bg-black/40 hover:bg-[var(--brand-gold)]/20 border border-white/10 hover:border-[var(--brand-gold)] text-slate-200 hover:text-[var(--brand-gold)] px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-[var(--brand-gold)]" />
            <span>+ Liquid Pack (100ml, 200ml, 500ml, 1L)</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPresets('powder')}
            className="bg-black/40 hover:bg-[var(--brand-gold)]/20 border border-white/10 hover:border-[var(--brand-gold)] text-slate-200 hover:text-[var(--brand-gold)] px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-[var(--brand-gold)]" />
            <span>+ Powder Pack (100g, 250g, 500g)</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPresets('sizes')}
            className="bg-black/40 hover:bg-[var(--brand-gold)]/20 border border-white/10 hover:border-[var(--brand-gold)] text-slate-200 hover:text-[var(--brand-gold)] px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-[var(--brand-gold)]" />
            <span>+ Size Pack (Small, Medium, Large)</span>
          </button>
          {variants.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm('Clear all variants? Base product pricing will be used.')) {
                  onChange([]);
                  notify('Cleared variants');
                }
              }}
              className="text-rose-400 hover:text-rose-300 text-[10px] underline ml-auto px-2"
            >
              Clear all variants
            </button>
          )}
        </div>
      </div>

      {/* Variants List Table / Cards */}
      {variants.length > 0 ? (
        <div className="space-y-3">
          {variants.map((v, idx) => {
            const isEditing = editingVariantId === v.id;
            const discountPct =
              v.originalPriceINR && v.originalPriceINR > v.priceINR
                ? Math.round(((v.originalPriceINR - v.priceINR) / v.originalPriceINR) * 100)
                : 0;

            return (
              <div
                key={v.id}
                className={`bg-[var(--brand-primary-deep,#07150E)] border rounded-2xl p-4 transition-all ${
                  v.active === false
                    ? 'opacity-60 border-dashed border-white/20'
                    : isEditing
                    ? 'border-[var(--brand-gold)] ring-1 ring-[var(--brand-gold)]/40 bg-[var(--brand-primary-dark,#0B1D13)]'
                    : 'border-white/15 hover:border-white/30'
                }`}
              >
                {/* Variant Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono text-[11px]">#{idx + 1}</span>

                    {/* Variant Thumbnail */}
                    <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center relative shrink-0">
                      {v.image ? (
                        <img src={v.image} alt={v.name} className="w-full h-full object-contain" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-slate-500" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-100 text-sm">{v.name}</h4>
                        {v.active === false && (
                          <span className="bg-rose-500/20 text-rose-300 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            Inactive
                          </span>
                        )}
                        {discountPct > 0 && (
                          <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {discountPct}% OFF
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                        <span>SKU: {v.sku}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">₹{v.priceINR}</span>
                        {v.originalPriceINR && (
                          <span className="line-through text-slate-500">₹{v.originalPriceINR}</span>
                        )}
                        <span>•</span>
                        <span>Stock: {v.stock}</span>
                        {v.weight && <span>• {v.weight}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-1.5">
                    {/* Reorder Buttons */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-1.5 bg-black/40 hover:bg-black/80 disabled:opacity-20 text-slate-300 rounded-lg border border-white/10"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === variants.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-1.5 bg-black/40 hover:bg-black/80 disabled:opacity-20 text-slate-300 rounded-lg border border-white/10"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Enable/Disable Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(v.id)}
                      className={`p-1.5 rounded-lg border flex items-center gap-1 text-[10px] font-bold ${
                        v.active !== false
                          ? 'bg-black/40 border-white/10 text-emerald-400'
                          : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                      }`}
                    >
                      {v.active !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    {/* Edit Form Toggle */}
                    <button
                      type="button"
                      onClick={() => setEditingVariantId(isEditing ? null : v.id)}
                      className="px-2.5 py-1 bg-[var(--brand-gold)]/20 hover:bg-[var(--brand-gold)] text-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/40 rounded-lg font-bold transition-all text-[11px]"
                    >
                      {isEditing ? 'Done' : 'Edit Details'}
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteVariant(v.id)}
                      className="p-1.5 bg-rose-950/40 hover:bg-rose-900 border border-rose-500/30 text-rose-300 rounded-lg"
                      title="Delete Variant"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Edit Form */}
                {isEditing && (
                  <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 animate-fadeIn">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1 text-[11px]">
                        Variant Title / Volume *
                      </label>
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => handleUpdateVariant(v.id, { name: e.target.value, size: e.target.value })}
                        placeholder="e.g. 200 ml or Family Pack 500ml"
                        className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 p-2 rounded-lg text-slate-100 focus:border-[var(--brand-gold)]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1 text-[11px]">SKU Code *</label>
                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) => handleUpdateVariant(v.id, { sku: e.target.value.toUpperCase() })}
                        placeholder="e.g. HKV-OIL-200ML"
                        className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 p-2 rounded-lg text-slate-100 font-mono focus:border-[var(--brand-gold)]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1 text-[11px]">Weight / Dimension</label>
                      <input
                        type="text"
                        value={v.weight || ''}
                        onChange={(e) => handleUpdateVariant(v.id, { weight: e.target.value })}
                        placeholder="e.g. 240 g"
                        className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 p-2 rounded-lg text-slate-100 focus:border-[var(--brand-gold)]"
                      />
                    </div>

                    <div>
                      <label className="block text-amber-300 font-bold mb-1 text-[11px]">Selling Price (INR ₹) *</label>
                      <input
                        type="number"
                        value={v.priceINR}
                        onChange={(e) => handleUpdateVariant(v.id, { priceINR: Number(e.target.value) })}
                        placeholder="e.g. 1499"
                        className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-amber-500/40 p-2 rounded-lg text-amber-300 font-bold focus:border-[var(--brand-gold)]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1 text-[11px]">MRP / Original Price (INR ₹)</label>
                      <input
                        type="number"
                        value={v.originalPriceINR || ''}
                        onChange={(e) => handleUpdateVariant(v.id, { originalPriceINR: Number(e.target.value) })}
                        placeholder="e.g. 1999"
                        className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 p-2 rounded-lg text-slate-100 focus:border-[var(--brand-gold)]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1 text-[11px]">Stock Quantity *</label>
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) => handleUpdateVariant(v.id, { stock: Number(e.target.value) })}
                        placeholder="e.g. 100"
                        className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 p-2 rounded-lg text-slate-100 focus:border-[var(--brand-gold)]"
                      />
                    </div>

                    {/* Variant Image Selector */}
                    <div className="sm:col-span-2 md:col-span-3 space-y-1.5 pt-1">
                      <label className="block text-slate-300 font-bold text-[11px]">
                        Variant Photo (Choose from gallery or upload)
                      </label>
                      <div className="flex items-center gap-2 flex-wrap">
                        {galleryImages.map((gImg, gIdx) => (
                          <button
                            key={gIdx}
                            type="button"
                            onClick={() => handleUpdateVariant(v.id, { image: gImg })}
                            className={`w-12 h-12 rounded-lg border overflow-hidden p-0.5 transition-all ${
                              v.image === gImg
                                ? 'border-[var(--brand-gold)] ring-2 ring-[var(--brand-gold)]/50'
                                : 'border-white/20 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={gImg} alt="choice" className="w-full h-full object-contain" />
                          </button>
                        ))}
                        <label className="bg-black/40 hover:bg-black/70 text-slate-300 border border-dashed border-white/30 rounded-lg px-3 py-2 flex items-center gap-1.5 cursor-pointer text-[10px]">
                          <Plus className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleUploadVariantImage(v.id, e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 bg-[var(--brand-primary-deep,#07150E)] border border-white/10 rounded-2xl text-center space-y-2">
          <Package className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-slate-300 font-bold">Single-Size Product (No Variants Defined)</p>
          <p className="text-slate-400 text-[11px] max-w-md mx-auto">
            Customers will purchase the standard base configuration at{' '}
            <strong className="text-[var(--brand-gold)]">₹{basePriceINR}</strong>. Use the preset buttons above or click "Add Custom Variant" to enable multiple sizes.
          </p>
        </div>
      )}
    </div>
  );
};
