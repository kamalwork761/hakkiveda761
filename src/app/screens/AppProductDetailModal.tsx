import React, { useState } from 'react';
import {
  X,
  Star,
  Heart,
  Check,
  ShoppingBag,
  ShieldCheck,
  Zap,
  Sparkles,
  MessageSquare,
  Leaf,
  Droplet,
} from 'lucide-react';
import { Product } from '../../types/store';
import { MobileAppProductOverride } from '../../types/mobileApp';
import { useStore } from '../../context/StoreContext';
import { resolveAssetUrl } from '../utils/nativeUrl';
import { formatSafeINR } from '../utils/formatMoney';
import { getAuthoritativePriceINR, getAuthoritativeOriginalPriceINR } from '../utils/productPrice';

interface AppProductDetailModalProps {
  productId: string | null;
  override?: MobileAppProductOverride;
  whatsappNumber?: string;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const AppProductDetailModal: React.FC<AppProductDetailModalProps> = ({
  productId,
  override,
  whatsappNumber = '+917619536831',
  onClose,
  onProceedToCheckout,
}) => {
  const { products, addToCart, wishlist, toggleWishlist, playSound } = useStore();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  if (!productId) return null;

  const product = products.find((p) => p.id === productId);
  if (!product) return null;

  const isWishlisted = wishlist?.includes(product.id) || false;
  const hasVariants = product.variants && product.variants.length > 0;
  const currentVariant = hasVariants ? product.variants[selectedVariantIndex] : null;

  // Master shared pricing & stock using authoritative priceINR
  const authoritativePrice = getAuthoritativePriceINR(product, currentVariant);
  const hasValidPrice = authoritativePrice !== null && authoritativePrice > 0;
  const numPrice = hasValidPrice ? authoritativePrice : 0;

  const authoritativeOriginal = getAuthoritativeOriginalPriceINR(product, currentVariant);
  const numOriginal = authoritativeOriginal !== null && authoritativeOriginal > 0
    ? authoritativeOriginal
    : (hasValidPrice ? Math.round(numPrice * 1.45) : 0);

  const discountPercent =
    hasValidPrice && numOriginal > numPrice
      ? Math.round(((numOriginal - numPrice) / numOriginal) * 100)
      : 0;

  // Product gallery: use all active Admin-uploaded images
  const gallerySources = [
    ...(override?.appImage ? [override.appImage] : []),
    ...(product.galleryItems || [])
      .filter((item) => item.active !== false && item.url)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .map((item) => item.url),
    ...(product.image ? [product.image] : []),
    ...(product.images || []),
    ...(product.additionalImages || []),
    ...(currentVariant?.image ? [currentVariant.image] : []),
  ].filter(Boolean);

  const galleryImages = Array.from(new Set(gallerySources)).map(resolveAssetUrl);

  if (galleryImages.length === 0) {
    galleryImages.push(resolveAssetUrl('/images/hero_tribal_elders.jpg'));
  }

  const primaryImage =
    selectedGalleryImage && galleryImages.includes(selectedGalleryImage)
      ? selectedGalleryImage
      : galleryImages[0];
  const displayName = override?.appTitle || product.name;
  const displaySubtitle = override?.appSubtitle || product.subtitle;
  const customBadge = override?.badge || (product.isBestSeller ? '108 Sacred Herbs' : null);
  const appHeadline = override?.appHeadline;
  const benefitBullets =
    override?.benefitBullets && override.benefitBullets.length > 0
      ? override.benefitBullets
      : product.benefits && product.benefits.length > 0
        ? product.benefits
        : null;

  const quickIngredients =
    override?.quickIngredients ||
    (product.ingredients && product.ingredients.length > 0
      ? product.ingredients.join(', ')
      : '');

  const usageSummary =
    override?.usageSummary ||
    (product.howToUse && product.howToUse.length > 0
      ? product.howToUse.join(' ')
      : product.usageRitual || '');
  const trustBadgeText = override?.trustBadgeText || '100% Forest-Crafted • Tribal Certified';
  const ctaLabel = override?.cardCtaLabel || 'Add to Cart';

  const cleanWaNumber = (whatsappNumber || '+917619536831').replace(/[^\d]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    `Namaste HAKKIVEDA! I want to enquire about ${displayName}.`
  )}`;

  const handleAddToCart = () => {
    if (!hasValidPrice) return;
    addToCart(product, 1, currentVariant || undefined);
    try {
      playSound('success');
    } catch {}
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!hasValidPrice) return;
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
          <div className="text-[10px] font-bold text-[#0E382C] uppercase tracking-wider pt-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Tribal Remedy Details</span>
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
              alt={displayName}
              className="w-full h-full object-contain object-center p-2"
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
              {customBadge && (
                <span className="bg-[#0E382C] text-[#C5A059] font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-sm border border-[#C5A059]/30">
                  {customBadge}
                </span>
              )}
              <span className="bg-[#C5A059] text-[#0E382C] font-extrabold text-[9px] uppercase px-2 py-0.5 rounded-full shadow-sm">
                Adivasi Heritage
              </span>
            </div>
          </div>

          {galleryImages.length > 1 && (
            <div
              className="flex gap-2 overflow-x-auto no-scrollbar pb-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {galleryImages.map((imageUrl, index) => (
                <button
                  key={`${imageUrl}-${index}`}
                  type="button"
                  onClick={() => setSelectedGalleryImage(imageUrl)}
                  className={`w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 bg-[#FAF7F2] ${
                    primaryImage === imageUrl
                      ? 'border-[#C5A059]'
                      : 'border-emerald-950/10'
                  }`}
                  aria-label={`View product image ${index + 1}`}
                >
                  <img
                    src={imageUrl}
                    alt={`${displayName} ${index + 1}`}
                    className="w-full h-full object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Title, Headline & Reviews */}
          <div>
            <span className="text-[11px] font-bold text-[#0E382C] uppercase tracking-wider">
              {product.category || 'Tribal Remedy'}
            </span>
            <h2 className="font-serif text-lg font-bold text-slate-900 leading-tight mt-0.5">
              {displayName}
            </h2>

            {appHeadline && (
              <p className="text-xs font-semibold text-[#0E382C] mt-1 font-serif">
                {appHeadline}
              </p>
            )}

            {displaySubtitle && (
              <p className="text-xs text-slate-600 mt-1 font-sans leading-relaxed">
                {displaySubtitle}
              </p>
            )}

            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded-lg text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                <span>{product.rating || '4.9'}</span>
              </div>
              <span className="text-xs text-slate-500">
                ({product.reviewsCount || 248} verified tribal reviews)
              </span>
            </div>
          </div>

          {/* Pricing & Stock (Shared Master Catalog Data) */}
          <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-emerald-950/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Special App Offer Price
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                {hasValidPrice ? (
                  <span className="font-bold text-xl text-[#0E382C]">
                    {formatSafeINR(numPrice)}
                  </span>
                ) : (
                  <span className="font-bold text-sm text-slate-500">
                    Contact for Price
                  </span>
                )}
                {hasValidPrice && numOriginal > numPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatSafeINR(numOriginal)}
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
                      <div className="text-[10px] text-slate-500">{formatSafeINR(v.priceINR ?? (v as any).price)}</div>
                    </div>
                    {selectedVariantIndex === idx && (
                      <Check className="w-4 h-4 text-[#0E382C] stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* App Benefit Bullets Override */}
          {benefitBullets && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/5 border border-emerald-950/10 space-y-1.5">
              <h3 className="text-xs font-bold text-[#0E382C] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Key Proven Benefits</span>
              </h3>
              <ul className="space-y-1 text-xs text-slate-700 font-sans">
                {benefitBullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#C5A059] font-bold">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Botanical Ingredients Highlight */}
          <div className="border-t border-slate-100 pt-3">
            <h3 className="font-serif text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-[#0E382C]" />
              <span>Key Ingredients</span>
            </h3>

            <p className="text-xs text-slate-700 leading-relaxed font-sans bg-slate-50 p-3 rounded-xl border border-slate-100">
              {quickIngredients || 'Ingredient details will be updated soon.'}
            </p>
          </div>

          {/* How to use / Ritual */}
          <div className="border-t border-slate-100 pt-3">
            <h3 className="font-serif text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-[#0E382C]" />
              <span>How to Use</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              {usageSummary || 'Usage instructions will be updated soon.'}
            </p>
          </div>

          {/* Trust Badge */}
          <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/30 text-center text-xs font-semibold text-[#0E382C] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>{trustBadgeText}</span>
          </div>

          {/* WhatsApp Direct Consult Button */}
          <div className="pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>Ask Tribal Vaidya on WhatsApp ({whatsappNumber})</span>
            </a>
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
                <span>{ctaLabel}</span>
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
