import React from 'react';
import { Check, AlertCircle, Sparkles } from 'lucide-react';
import { ProductVariant } from '../../types/store';

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelectVariant: (variant: ProductVariant) => void;
  formatPrice: (priceINR: number) => string;
}

export const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({
  variants,
  selectedVariant,
  onSelectVariant,
  formatPrice,
}) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div id="product-variant-selector" className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold font-sans uppercase tracking-wider text-[#123F2A] dark:text-slate-200 flex items-center gap-1.5">
          <span>Select Size / Packaging</span>
          {selectedVariant && (
            <span className="text-[var(--brand-gold)] font-serif-luxury lowercase font-normal">
              — {selectedVariant.name}
            </span>
          )}
        </label>
        {selectedVariant?.sku && (
          <span className="text-[10px] font-mono text-slate-400">
            SKU: {selectedVariant.sku}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const isOutOfStock = variant.stock <= 0 || variant.active === false;
          const isLowStock = !isOutOfStock && variant.stock <= 10;
          const variantDiscount =
            variant.originalPriceINR && variant.originalPriceINR > variant.priceINR
              ? Math.round(
                  ((variant.originalPriceINR - variant.priceINR) / variant.originalPriceINR) * 100
                )
              : 0;

          return (
            <button
              key={variant.id}
              type="button"
              disabled={isOutOfStock}
              onClick={() => onSelectVariant(variant)}
              className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-[var(--brand-gold)] bg-amber-500/10 dark:bg-[var(--brand-gold)]/10 ring-2 ring-[var(--brand-gold)]/40 shadow-sm'
                  : isOutOfStock
                  ? 'border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-black/20 opacity-50 cursor-not-allowed'
                  : 'border-[#E7E1D5] dark:border-white/10 bg-[#FAF8F2] dark:bg-black/20 hover:border-[var(--brand-gold)]/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs font-sans text-[#123F2A] dark:text-white">
                      {variant.name}
                    </span>
                    {variant.name.includes('Best Value') || variant.name.includes('Popular') ? (
                      <span className="bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>POPULAR</span>
                      </span>
                    ) : null}
                  </div>
                  {variant.weight && (
                    <span className="text-[10px] text-[#5F6B63] dark:text-slate-400 block mt-0.5">
                      Net Wt: {variant.weight}
                    </span>
                  )}
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[var(--brand-gold)] text-[#0B2F20] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Price Row */}
              <div className="flex items-baseline justify-between gap-2 mt-2 pt-2 border-t border-black/5 dark:border-white/5">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-extrabold text-sm text-[#123F2A] dark:text-[var(--brand-gold)]">
                    {formatPrice(variant.priceINR)}
                  </span>
                  {variant.originalPriceINR && variant.originalPriceINR > variant.priceINR && (
                    <span className="text-[10px] text-slate-400 line-through">
                      {formatPrice(variant.originalPriceINR)}
                    </span>
                  )}
                </div>

                {/* Badges / Discount */}
                <div>
                  {isOutOfStock ? (
                    <span className="text-[10px] font-bold text-rose-500">Out of Stock</span>
                  ) : isLowStock ? (
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                      <AlertCircle className="w-3 h-3" />
                      <span>Only {variant.stock} left</span>
                    </span>
                  ) : variantDiscount > 0 ? (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {variantDiscount}% OFF
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      In Stock
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
