import React, { useState } from 'react';
import { X, Star, Heart, Check, ShoppingBag, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { Product } from '../../types/store';
import { useStore } from '../../context/StoreContext';
import { resolveAssetUrl } from '../utils/nativeUrl';

interface AppProductDetailModalProps {
  productId: string | null;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const AppProductDetailModal: React.FC<AppProductDetailModalProps> = ({
  productId,
  onClose,
  onProceedToCheckout,
}) => {
  const { products, addToCart, wishlist, toggleWishlist, playSound } = useStore();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [added, setAdded] = useState(false);

  if (!productId) return null;

  const product = products.find((p) => p.id === productId);
  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);
  const hasVariants = product.variants && product.variants.length > 0;
  const currentVariant = hasVariants ? product.variants[selectedVariantIndex] : null;

  const price = currentVariant ? currentVariant.price : product.price;
  const originalPrice = currentVariant?.originalPrice || product.originalPrice || Math.round(price * 1.45);
  const discountPercent =
    originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const primaryImage = resolveAssetUrl(
    product.image || product.images?.[0] || '/images/hero_tribal_elders.jpg'
  );

  const handleAddToCart = () => {
    addToCart(product, 1, currentVariant || undefined);
    try {
      playSound('success');
    } catch {}
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, 1, currentVariant || undefined);
    try {
      playSound('success');
    } catch {}
    onClose();
    onProceedToCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Sheet Container */}
      <div
        className="relative z-10 w-full max-h-[92vh] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header bar with Drag pill and Close */}
        <div className="relative pt-2 pb-1.5 px-4 flex items-center justify-between border-b border-slate-100 bg-white">
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
          <div className="text-[10px] font-bold text-[#0E382C] uppercase tracking-wider pt-2">
            Remedy Details
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 active:scale-95"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {/* Main Product Image */}
          <div className="relative aspect-square w-full rounded-2xl bg-[#FAF7F2] overflow-hidden border border-emerald-950/10">
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/hero_tribal_elders.jpg';
              }}
            />

            {/* Wishlist button */}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-all ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-white/90 text-slate-600 hover:text-rose-600'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isWishlisted ? 'fill-current text-rose-600' : ''}`}
              />
            </button>

            {/* Badges */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
              <span className="bg-[#0E382C] text-[#C5A059] font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                108 Sacred Herbs
              </span>
              <span className="bg-[#C5A059] text-[#0E382C] font-extrabold text-[9px] uppercase px-2 py-0.5 rounded-full shadow-sm">
                Adivasi Heritage
              </span>
            </div>
          </div>

          {/* Title & Reviews */}
          <div>
            <span className="text-[11px] font-bold text-[#0E382C] uppercase tracking-wider">
              {product.category || 'Tribal Remedy'}
            </span>
            <h2 className="font-serif text-lg font-bold text-slate-900 leading-tight mt-0.5">
              {product.name}
            </h2>
            {product.subtitle && (
              <p className="text-xs text-slate-500 mt-1 font-sans">
                {product.subtitle}
              </p>
            )}

            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded-lg text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                <span>{product.rating || '4.9'}</span>
              </div>
              <span className="text-xs text-slate-500">
                ({product.reviewsCount || 248} verified reviews)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-emerald-950/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Special Offer Price
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-bold text-xl text-[#0E382C]">
                  ₹{price.toLocaleString('en-IN')}
                </span>
                {originalPrice > price && (
                  <span className="text-xs text-slate-400 line-through">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 justify-end">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>In Stock</span>
              </span>
              <span className="text-[10px] text-slate-500">Free Express Delivery</span>
            </div>
          </div>

          {/* Variants Selector */}
          {hasVariants && (
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                Select Bottle Volume:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.id || idx}
                    type="button"
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      selectedVariantIndex === idx
                        ? 'border-[#0E382C] bg-[#FAF7F2] ring-1 ring-[#0E382C]'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{v.name}</div>
                      <div className="text-[10px] text-slate-500">₹{v.price}</div>
                    </div>
                    {selectedVariantIndex === idx && (
                      <Check className="w-4 h-4 text-[#0E382C] stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botanical Ingredients Highlight */}
          <div className="border-t border-slate-100 pt-3">
            <h3 className="font-serif text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Key Wild Forest Botanicals
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs font-bold text-[#0E382C]">Bhringraj (Eclipta Alba)</div>
                <div className="text-[10px] text-slate-500">Stimulates dormant follicular roots</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs font-bold text-[#0E382C]">Gunja Seeds</div>
                <div className="text-[10px] text-slate-500">Reverses hairline miniaturization</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs font-bold text-[#0E382C]">Devadaru Himalayan Cedar</div>
                <div className="text-[10px] text-slate-500">Deep scalp circulation & cooling</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs font-bold text-[#0E382C]">Nagarmotha Roots</div>
                <div className="text-[10px] text-slate-500">Removes DHT buildup from sebum</div>
              </div>
            </div>
          </div>

          {/* How to use */}
          <div className="border-t border-slate-100 pt-3">
            <h3 className="font-serif text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              Nightly Application Ritual
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Apply 8-12 drops directly along scalp partings. Gently massage using circular fingertip strokes for 5 minutes. Leave overnight and wash with herbal shampoo 2-3 times weekly.
            </p>
          </div>
        </div>

        {/* Sticky Bottom Actions Bar */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 pb-[max(12px,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 py-3 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
              added
                ? 'bg-emerald-700 text-white border-emerald-700'
                : 'bg-white text-[#0E382C] border-[#0E382C] hover:bg-emerald-50 active:scale-98'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Added to Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 py-3 px-3 rounded-2xl bg-[#0E382C] text-[#C5A059] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-[#134E3F] active:scale-98 transition-all"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
