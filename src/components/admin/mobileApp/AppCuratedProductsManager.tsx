import React, { useState } from 'react';
import {
  Star,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Search,
  Check,
  Package,
  Sparkles,
  Zap,
  Tag,
  Eye,
} from 'lucide-react';
import { MobileAppFeaturedProducts, MobileAppProductOverride } from '../../../types/mobileApp';
import { Product } from '../../../types/store';
import { resolveAssetUrl } from '../../../app/utils/nativeUrl';
import { formatSafeINR } from '../../../app/utils/formatMoney';

interface AppCuratedProductsManagerProps {
  products: Product[];
  featuredProducts: MobileAppFeaturedProducts;
  overrides?: Record<string, MobileAppProductOverride>;
  onSave: (updated: MobileAppFeaturedProducts) => void;
  isSaving: boolean;
}

export const AppCuratedProductsManager: React.FC<AppCuratedProductsManagerProps> = ({
  products,
  featuredProducts,
  overrides = {},
  onSave,
  isSaving,
}) => {
  const [activeGroup, setActiveGroup] = useState<
    'bestsellers' | 'recommended' | 'featured' | 'new_arrivals' | 'flagship'
  >('bestsellers');
  const [searchQuery, setSearchQuery] = useState('');

  const bestSellerIds = featuredProducts.bestSellerProductIds || [];
  const recommendedIds = featuredProducts.recommendedProductIds || [];
  const featuredIds = featuredProducts.featuredProductIds || [];
  const newArrivalIds = featuredProducts.newArrivalProductIds || [];
  const flagshipId = featuredProducts.flagshipProductId || 'prod-1';

  const getCurrentGroupIds = (): string[] => {
    switch (activeGroup) {
      case 'bestsellers':
        return bestSellerIds;
      case 'recommended':
        return recommendedIds;
      case 'featured':
        return featuredIds;
      case 'new_arrivals':
        return newArrivalIds;
      case 'flagship':
        return flagshipId ? [flagshipId] : [];
    }
  };

  const updateCurrentGroup = (newIds: string[]) => {
    const updated = { ...featuredProducts };
    switch (activeGroup) {
      case 'bestsellers':
        updated.bestSellerProductIds = newIds;
        break;
      case 'recommended':
        updated.recommendedProductIds = newIds;
        break;
      case 'featured':
        updated.featuredProductIds = newIds;
        break;
      case 'new_arrivals':
        updated.newArrivalProductIds = newIds;
        break;
      case 'flagship':
        updated.flagshipProductId = newIds[0] || 'prod-1';
        break;
    }
    onSave(updated);
  };

  const handleAddProduct = (productId: string) => {
    if (activeGroup === 'flagship') {
      updateCurrentGroup([productId]);
      return;
    }
    const current = getCurrentGroupIds();
    if (!current.includes(productId)) {
      updateCurrentGroup([...current, productId]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    const current = getCurrentGroupIds();
    updateCurrentGroup(current.filter((id) => id !== productId));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const current = [...getCurrentGroupIds()];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= current.length) return;
    const temp = current[index];
    current[index] = current[targetIdx];
    current[targetIdx] = temp;
    updateCurrentGroup(current);
  };

  const currentIds = getCurrentGroupIds();
  const currentProducts = currentIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[];

  const availableToAdd = products.filter(
    (p) =>
      !currentIds.includes(p.id) &&
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="space-y-6 mobile-app-admin text-white">
      {/* Header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4 text-[#C5A059]" />
            <span>Curated App Product Sections</span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Organize which catalog products appear in the Android carousels and flagship spotlight.
          </p>
        </div>
      </div>

      {/* Group Navigation Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-white/20">
        {[
          { id: 'bestsellers', label: 'Best Sellers Carousel', count: bestSellerIds.length },
          { id: 'recommended', label: 'Recommended Products', count: recommendedIds.length },
          { id: 'featured', label: 'Featured Collection', count: featuredIds.length },
          { id: 'new_arrivals', label: 'New Arrivals', count: newArrivalIds.length },
          { id: 'flagship', label: 'Flagship Formulation Spotlight', count: flagshipId ? 1 : 0 },
        ].map((tab) => {
          const isActive = activeGroup === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveGroup(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-[#C5A059] text-[#0E382C] shadow-sm font-extrabold'
                  : 'bg-white/10 text-[#FDF8EC] hover:bg-white/20 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  isActive ? 'bg-[#0E382C] text-[#C5A059]' : 'bg-black/40 text-[#FDF8EC]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Active In Group vs Available To Add */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Currently Curated Items */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FDF8EC]">
              Active in {activeGroup.replace('_', ' ').toUpperCase()} ({currentProducts.length})
            </h3>
            <span className="text-[11px] text-emerald-100">Order determines mobile carousel sequence</span>
          </div>

          {currentProducts.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center text-xs text-slate-300">
              No products assigned to this group yet. Select from the catalog on the right.
            </div>
          ) : (
            <div className="space-y-2">
              {currentProducts.map((p, idx) => {
                const ov = overrides[p.id];
                const displayImg = ov?.appImage || p.image || p.additionalImages?.[0];
                const displayName = ov?.appTitle || p.name;
                const displaySubtitle = ov?.appSubtitle || p.subtitle;

                return (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-black/40 border border-white/15 flex items-center justify-between gap-3 hover:border-[#C5A059]/40 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-white/15 text-[#C5A059] flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {idx + 1}
                      </span>

                      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/15 overflow-hidden flex-shrink-0">
                        <img
                          src={resolveAssetUrl(displayImg)}
                          alt={displayName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/hero_tribal_elders.jpg';
                          }}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-serif text-xs font-bold text-[#FDF8EC] truncate">
                            {displayName}
                          </h4>
                          {ov?.badge && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30">
                              {ov.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-300 truncate">
                          {displaySubtitle || p.category}
                        </p>
                        <span className="text-[10px] text-emerald-400 font-bold">
                          {formatSafeINR(p.priceINR || p.price || 0)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {activeGroup !== 'flagship' && (
                        <>
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMove(idx, 'up')}
                            className="p-1 rounded-lg bg-white/10 text-slate-200 hover:text-white disabled:opacity-30 transition-all"
                            title="Move up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === currentProducts.length - 1}
                            onClick={() => handleMove(idx, 'down')}
                            className="p-1 rounded-lg bg-white/10 text-slate-200 hover:text-white disabled:opacity-30 transition-all"
                            title="Move down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(p.id)}
                        className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white transition-all ml-1"
                        title="Remove from group"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Add From Existing Catalog */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FDF8EC]">
              Add Products from Shared Catalog
            </h3>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog by name..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#07241C] border border-white/25 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
            {availableToAdd.map((p) => {
              const ov = overrides[p.id];
              const displayImg = ov?.appImage || p.image || p.additionalImages?.[0];

              return (
                <div
                  key={p.id}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={resolveAssetUrl(displayImg)}
                      alt={p.name}
                      className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-white/10"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/hero_tribal_elders.jpg';
                      }}
                    />
                    <div className="min-w-0">
                      <h5 className="font-serif text-xs font-bold text-[#FDF8EC] truncate">
                        {p.name}
                      </h5>
                      <span className="text-[10px] text-emerald-400 font-bold">
                        {formatSafeINR(p.priceINR || p.price || 0)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddProduct(p.id)}
                    className="px-2.5 py-1 rounded-lg bg-[#C5A059] text-[#0E382C] font-bold text-[11px] shadow-sm hover:bg-[#d4af37] flex-shrink-0"
                  >
                    + Add
                  </button>
                </div>
              );
            })}

            {availableToAdd.length === 0 && (
              <p className="text-center text-xs text-slate-400 py-4">
                No matching products found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
