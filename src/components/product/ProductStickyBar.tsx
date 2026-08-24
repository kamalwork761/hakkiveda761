import React, { useEffect, useState } from 'react';
import { ShoppingBag, Sparkles, Plus, Minus } from 'lucide-react';
import { Product, ProductVariant } from '../../types/store';

interface ProductStickyBarProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  formatPrice: (priceINR: number) => string;
}

export const ProductStickyBar: React.FC<ProductStickyBarProps> = ({
  product,
  selectedVariant,
  quantity,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  formatPrice,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // On mobile (< 640px), keep it visible throughout PDP; on desktop, reveal when scrolled down
      if (window.innerWidth < 640 || window.scrollY > 480) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  if (!isVisible) return null;

  const currentPriceINR = selectedVariant?.priceINR || product.priceINR;
  const currentImage = selectedVariant?.image || product.image;

  return (
    <div
      id="product-sticky-action-bar"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#0B1D13]/95 backdrop-blur-md border-t border-[#E7E1D5] dark:border-white/10 p-3 sm:py-3.5 sm:px-6 shadow-2xl pb-[max(12px,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom duration-300 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Thumbnail & Details */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={currentImage}
            alt={product.name}
            className="w-11 h-11 sm:w-12 sm:h-12 object-contain rounded-xl border border-[#E7E1D5] dark:border-white/10 bg-[#FAF8F2] dark:bg-black/40 p-1 shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold font-serif-luxury text-[#123F2A] dark:text-white truncate">
              {product.name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs sm:text-sm font-extrabold text-[#123F2A] dark:text-[var(--brand-gold)] font-sans">
                {formatPrice(currentPriceINR * quantity)}
              </span>
              {selectedVariant && (
                <span className="text-[10px] bg-amber-500/10 text-[var(--brand-gold)] px-2 py-0.5 rounded-full font-medium truncate max-w-[120px]">
                  {selectedVariant.size || selectedVariant.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quantity & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quantity selector on larger screens */}
          <div className="hidden sm:flex items-center border border-[#E7E1D5] dark:border-white/20 rounded-xl overflow-hidden bg-[#FAF8F2] dark:bg-black/30 h-10 shadow-inner">
            <button
              type="button"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="px-2.5 h-full text-[#123F2A] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 font-bold transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-xs font-bold text-[#123F2A] dark:text-white font-sans">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(quantity + 1)}
              className="px-2.5 h-full text-[#123F2A] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 font-bold transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Bag */}
          <button
            type="button"
            onClick={onAddToCart}
            className="h-10 px-3.5 sm:px-5 rounded-xl bg-[#123F2A] hover:bg-[#0B2F20] dark:bg-white dark:text-[#0B2F20] text-white font-sans text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-98 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[var(--brand-gold)] dark:text-[#0B2F20]" />
            <span className="hidden xs:inline">Add to Bag</span>
            <span className="xs:hidden">Add</span>
          </button>

          {/* Buy Now */}
          <button
            type="button"
            onClick={onBuyNow}
            className="h-10 px-3.5 sm:px-5 rounded-xl bg-[var(--brand-gold,#D4AF37)] hover:bg-amber-400 text-[#0B2F20] font-sans text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Instant Buy</span>
            <span className="sm:hidden">Buy</span>
          </button>
        </div>
      </div>
    </div>
  );
};
