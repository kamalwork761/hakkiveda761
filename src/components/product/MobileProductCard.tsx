import React from 'react';
import { Heart, Star } from 'lucide-react';
import { Product } from '../../types/store';
import { useStore } from '../../context/StoreContext';

interface MobileProductCardProps {
  product: Product;
  onNavigateProduct: (product: Product) => void;
  isDragging?: () => boolean;
}

export const MobileProductCard: React.FC<MobileProductCardProps> = ({
  product,
  onNavigateProduct,
  isDragging,
}) => {
  const { isInWishlist, toggleWishlist, formatPrice, playSound } = useStore();
  const inWishlist = isInWishlist(product.id);

  const discount =
    product.originalPriceINR && product.originalPriceINR > product.priceINR
      ? Math.round(
          ((product.originalPriceINR - product.priceINR) / product.originalPriceINR) * 100
        )
      : 0;

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDragging && isDragging()) {
      return;
    }
    playSound('nav_click');
    onNavigateProduct(product);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDragging && isDragging()) {
      return;
    }
    playSound('wishlist_toggle');
    toggleWishlist(product);
  };

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNavigateProduct(product);
        }
      }}
      className="w-[155px] sm:w-[180px] shrink-0 bg-white dark:bg-[#123F2B] rounded-xl border border-[#E7E1D5] dark:border-white/10 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer select-none group text-left"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-[#FAF8F2] dark:bg-black/20 p-2 overflow-hidden flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
              {discount}% OFF
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          title={inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
          className={`absolute top-2 right-2 w-10 h-10 rounded-full transition-all duration-200 shadow-md flex items-center justify-center z-10 cursor-pointer active:scale-95 ${
            inWishlist
              ? 'bg-[#0B4A35] text-[var(--brand-gold,#C9A84E)] border border-[var(--brand-gold,#C9A84E)]/60 shadow-[0_2px_8px_rgba(11,74,53,0.35)]'
              : 'bg-white/95 text-[#0B4A35] border border-[rgba(201,168,76,0.35)] hover:border-[#0B4A35]/50 hover:bg-white hover:text-[#0B4A35]'
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform ${inWishlist ? 'fill-current scale-105' : ''}`} />
        </button>
      </div>

      {/* Product Information */}
      <div className="p-2.5 flex-1 flex flex-col justify-between space-y-1.5">
        <div>
          {/* Subtitle / Volume / Category Tag */}
          <div className="flex items-center justify-between text-[10px] text-[#5F6B63] dark:text-slate-400 font-sans mb-0.5">
            <span className="truncate max-w-[85px] font-semibold text-[#123F2A] dark:text-[var(--brand-gold)] uppercase tracking-wider">
              {product.category}
            </span>
            {product.volume && <span className="shrink-0">{product.volume}</span>}
          </div>

          {/* Product Title */}
          <h4 className="font-serif-luxury font-bold text-xs text-[#123F2A] dark:text-white line-clamp-2 leading-snug group-hover:text-[var(--brand-gold)] transition-colors">
            {product.name}
          </h4>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              {product.rating.toFixed(1)}
            </span>
            {product.reviewsCount > 0 && (
              <span className="text-[10px] text-slate-400">({product.reviewsCount})</span>
            )}
          </div>
        </div>

        {/* Price Row */}
        <div className="pt-1.5 border-t border-[#E7E1D5]/60 dark:border-white/10 flex items-baseline justify-between gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-xs sm:text-sm font-extrabold text-[#123F2A] dark:text-[var(--brand-gold)]">
              {formatPrice(product.priceINR)}
            </span>
            {product.originalPriceINR && product.originalPriceINR > product.priceINR && (
              <span className="text-[10px] text-slate-400 line-through">
                {formatPrice(product.originalPriceINR)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
