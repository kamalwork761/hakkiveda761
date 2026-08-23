import React, { useState } from 'react';
import { Sparkles, Search, Check, Plus, X, Link2, Package } from 'lucide-react';
import { Product } from '../../types/store';

interface AdminProductRelatedEditorProps {
  currentProductId: string;
  allProducts: Product[];
  relatedProductIds?: string[];
  relatedProductsMode?: 'auto' | 'manual';
  onChange: (updates: { relatedProductIds: string[]; relatedProductsMode: 'auto' | 'manual' }) => void;
  onShowToast?: (msg: string) => void;
}

export const AdminProductRelatedEditor: React.FC<AdminProductRelatedEditorProps> = ({
  currentProductId,
  allProducts,
  relatedProductIds = [],
  relatedProductsMode = 'auto',
  onChange,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const otherProducts = allProducts.filter((p) => p.id !== currentProductId);

  const filteredProducts = otherProducts.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(allProducts.map((p) => p.category))).filter(Boolean);

  const selectedProducts = otherProducts.filter((p) => relatedProductIds.includes(p.id));

  const handleToggleProduct = (prodId: string) => {
    const isSelected = relatedProductIds.includes(prodId);
    let nextIds: string[];
    if (isSelected) {
      nextIds = relatedProductIds.filter((id) => id !== prodId);
    } else {
      nextIds = [...relatedProductIds, prodId];
    }
    onChange({
      relatedProductIds: nextIds,
      relatedProductsMode: 'manual',
    });
  };

  const handleSetMode = (mode: 'auto' | 'manual') => {
    onChange({
      relatedProductIds,
      relatedProductsMode: mode,
    });
  };

  return (
    <div className="space-y-5 text-xs font-sans">
      {/* Header */}
      <div className="border-b border-white/10 pb-3">
        <label className="text-slate-100 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
          <Link2 className="w-4 h-4 text-[var(--brand-gold)]" />
          <span>Cross-Sell & Related Products</span>
        </label>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Select complementary botanical formulations to recommend at the bottom of the Product Detail Page.
        </p>
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          onClick={() => handleSetMode('auto')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            relatedProductsMode === 'auto'
              ? 'bg-[var(--brand-primary-deep,#07150E)] border-[var(--brand-gold)] ring-1 ring-[var(--brand-gold)]/40'
              : 'bg-black/30 border-white/10 hover:border-white/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-100 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--brand-gold)]" />
              <span>Automatic Recommendation</span>
            </h4>
            <input
              type="radio"
              checked={relatedProductsMode === 'auto'}
              onChange={() => handleSetMode('auto')}
              className="accent-[var(--brand-gold)]"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Dynamically populates top bestsellers and items in the same botanical category.
          </p>
        </div>

        <div
          onClick={() => handleSetMode('manual')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            relatedProductsMode === 'manual'
              ? 'bg-[var(--brand-primary-deep,#07150E)] border-[var(--brand-gold)] ring-1 ring-[var(--brand-gold)]/40'
              : 'bg-black/30 border-white/10 hover:border-white/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-100 text-xs flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-400" />
              <span>Manual Custom Selection ({selectedProducts.length})</span>
            </h4>
            <input
              type="radio"
              checked={relatedProductsMode === 'manual'}
              onChange={() => handleSetMode('manual')}
              className="accent-[var(--brand-gold)]"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Handpick specific complementary formulations to cross-sell to customers.
          </p>
        </div>
      </div>

      {/* Manual Selection Interface */}
      {relatedProductsMode === 'manual' && (
        <div className="bg-[var(--brand-primary-deep,#07150E)] border border-white/10 rounded-2xl p-4 space-y-4 animate-fadeIn">
          {/* Selected Products Chips */}
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
              Selected Recommendations ({selectedProducts.length})
            </span>
            {selectedProducts.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedProducts.map((sp) => (
                  <div
                    key={sp.id}
                    className="bg-[var(--brand-primary-dark,#0B1D13)] border border-[var(--brand-gold)]/50 rounded-xl px-3 py-1.5 flex items-center gap-2 text-slate-200"
                  >
                    <img src={sp.image} alt={sp.name} className="w-6 h-6 object-contain rounded bg-black/40" />
                    <span className="font-bold text-xs truncate max-w-[150px]">{sp.name}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleProduct(sp.id)}
                      className="text-slate-400 hover:text-rose-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">No products chosen yet. Select items from below.</p>
            )}
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search formulations by name or SKU..."
                className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 rounded-lg pl-8 pr-3 py-1.5 text-slate-100 placeholder-slate-500 focus:border-[var(--brand-gold)] text-xs"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 rounded-lg px-3 py-1.5 text-slate-100 text-xs"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Available Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {filteredProducts.map((p) => {
              const isSelected = relatedProductIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => handleToggleProduct(p.id)}
                  className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[var(--brand-gold)]/10 border-[var(--brand-gold)]'
                      : 'bg-black/30 border-white/10 hover:border-white/30'
                  }`}
                >
                  <img src={p.image} alt={p.name} className="w-10 h-10 object-contain rounded-lg bg-black/40" />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-slate-100 text-xs truncate">{p.name}</h5>
                    <p className="text-[10px] text-slate-400 font-mono">₹{p.priceINR}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] border-[var(--brand-gold)]'
                        : 'border-white/20 text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
