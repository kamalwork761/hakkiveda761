import React, { useState } from 'react';
import { Heart, Plus, Star, Check } from 'lucide-react';
import { Product } from '../../types/store';
import { useStore } from '../../context/StoreContext';
import { resolveAssetUrl } from '../utils/nativeUrl';

interface AppProductCardProps {
  product: Product;
  onOpenDetail: (productId: string) => void;
  layout?: 'carousel' | 'grid';
}

export const AppProductCard: React.FC<AppProductCardProps> = ({
  product,
  onOpenDetail,
  layout = 'carousel',
}) => {
  const { addToCart, wishlist, toggleWishlist, playSound } = useStore();
  const [justAdded, setJustAdded] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const primaryImage = resolveAssetUrl(
    product.image || product.images?.[0] || '/images/hero_tribal_elders.jpg'
  );

  const price = product.price;
  const originalPrice = product.originalPrice || Math.round(price * 1.45);
  const discountPercent =
    originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    try {
      playSound('success');
    } catch {}
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    try {
      playSound('click');
    } catch {}
  };

  const cardWidth = layout === 'carousel' ? 'w-44 flex-shrink-0' : 'w-full';

  return (
    <div
      onClick={() => onOpenDetail(product.id)}
      className={`${cardWidth} bg-white rounded-2xl border border-emerald-950/10 shadow-sm overflow-hidden flex flex-col justify-between active:scale-[0.98] transition-all cursor-pointer relative group`}
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-[#f4ede2] overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/hero_tribal_elders.jpg';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          {discountPercent > 0 && (
            <span className="bg-[#0E382C] text-[#C5A059] font-bold text-[9px] px-1.5 py-0.5 rounded-md shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#C5A059] text-[#0E382C] font-extrabold text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-md shadow-sm">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-all ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/80 text-slate-600 hover:text-rose-600'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current text-rose-600' : ''}`}
          />
        </button>

        {/* Rating overlay pill */}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-md flex items-center gap-1 text-[10px] font-semibold">
          <Star className="w-2.5 h-2.5 text-amber-400 fill-current" />
          <span>{product.rating || '4.9'}</span>
          <span className="text-white/60 text-[8px]">
            ({product.reviewsCount || 128})
          </span>
        </div>
      </div>

      {/* Product Details Area */}
      <div className="p-3 flex flex-col flex-grow justify-between">
        <div>
          <span className="text-[10px] font-semibold text-[#0E382C] uppercase tracking-wider">
            {product.category?.replace(/Remedies|Care/gi, '').trim() || 'Remedy'}
          </span>
          <h3 className="font-serif text-xs font-bold text-slate-900 line-clamp-2 leading-tight mt-0.5">
            {product.name}
          </h3>
          <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
            {product.subtitle || '108 wild forest herbs extracted over firewood'}
          </p>
        </div>

        {/* Price & Add to Cart button */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-sm text-[#0E382C]">
                ₹{price.toLocaleString('en-IN')}
              </span>
              {originalPrice > price && (
                <span className="text-[10px] text-slate-400 line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[9px] text-emerald-700 font-medium">
              Free Delivery
            </span>
          </div>

          {/* Quick Add Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`h-8 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all ${
              justAdded
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-[#0E382C] text-[#FDF8EC] hover:bg-[#134E3F] active:scale-95 shadow-sm'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span className="text-[10px]">Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[3] text-[#C5A059]" />
                <span className="text-[11px]">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
