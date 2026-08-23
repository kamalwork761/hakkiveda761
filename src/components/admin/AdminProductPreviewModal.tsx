import React, { useState } from 'react';
import { X, Monitor, Tablet, Smartphone, ExternalLink, Sparkles, Check, Eye } from 'lucide-react';
import { Product, ProductVariant } from '../../types/store';
import { ProductGallery } from '../product/ProductGallery';
import { ProductVariantSelector } from '../product/ProductVariantSelector';
import { ProductDetailSections } from '../product/ProductDetailSections';
import { ProductStickyBar } from '../product/ProductStickyBar';
import { ShieldCheck, Sparkles as SparklesIcon, Truck, RotateCcw, Heart, Share2, Star, CheckCircle, Flame, Award, Globe, ShoppingBag } from 'lucide-react';

interface AdminProductPreviewModalProps {
  product: Product;
  onClose: () => void;
  onSaveAndClose?: () => void;
  allProducts: Product[];
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export const AdminProductPreviewModal: React.FC<AdminProductPreviewModalProps> = ({
  product,
  onClose,
  onSaveAndClose,
  allProducts,
}) => {
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(() => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.find((v) => v.active !== false) || product.variants[0];
    }
    return null;
  });
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  const activePriceINR = selectedVariant ? selectedVariant.priceINR : product.priceINR;
  const activeOriginalPriceINR = selectedVariant?.originalPriceINR ?? product.originalPriceINR;
  const activeSku = selectedVariant?.sku || product.sku;
  const activeStock = selectedVariant ? selectedVariant.stock : (product.stock ?? 150);
  const isOutOfStock = activeStock <= 0;

  const discountPct =
    activeOriginalPriceINR && activeOriginalPriceINR > activePriceINR
      ? Math.round(((activeOriginalPriceINR - activePriceINR) / activeOriginalPriceINR) * 100)
      : 0;

  // Build product images list
  const productImages = React.useMemo(() => {
    let list: string[] = [];
    if (product.galleryItems && product.galleryItems.length > 0) {
      list = product.galleryItems
        .filter((item) => item.active !== false)
        .map((item) => item.url);
    }
    if (list.length === 0) {
      list = [product.image, ...(product.additionalImages || [])];
    }
    if (product.variants) {
      product.variants.forEach((v) => {
        if (v.image && !list.includes(v.image)) {
          list.push(v.image);
        }
      });
    }
    return list.filter(Boolean);
  }, [product]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Device width wrappers
  const getDeviceContainerClass = () => {
    switch (device) {
      case 'mobile':
        return 'w-[390px] max-w-full rounded-3xl border-8 border-slate-800 shadow-2xl overflow-hidden my-4';
      case 'tablet':
        return 'w-[768px] max-w-full rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden my-4';
      case 'desktop':
      default:
        return 'w-full max-w-6xl rounded-xl shadow-xl';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-between p-2 sm:p-4 overflow-hidden animate-fadeIn">
      {/* Top Controls Toolbar */}
      <div className="w-full max-w-6xl bg-[var(--brand-primary-dark,#0B1D13)] border border-[var(--brand-gold,#D4AF37)]/40 rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xl text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] flex items-center justify-center">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 font-serif-luxury text-sm">
                Product Detail Page Live Preview
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {product.status || 'Active'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Interactive preview matching live customer viewport experience
            </p>
          </div>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center gap-1 bg-black/40 border border-white/10 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              device === 'desktop'
                ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              device === 'tablet'
                ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              device === 'mobile'
                ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onSaveAndClose && (
            <button
              type="button"
              onClick={onSaveAndClose}
              className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] hover:bg-white px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider transition-all shadow flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Publish</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-xl transition-all"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Preview Screen Scroll Area */}
      <div className="w-full flex-1 overflow-y-auto flex justify-center items-start p-2 sm:p-4">
        <div className={`bg-[#FAF8F2] text-[#123F2A] transition-all duration-300 ${getDeviceContainerClass()}`}>
          
          {/* Mock Breadcrumb Bar */}
          <div className="bg-[#123F2B] text-slate-200 px-4 sm:px-6 py-2.5 text-[11px] font-sans flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400">Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-[var(--brand-gold)] font-semibold">{product.category}</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-200 font-bold truncate max-w-[200px]">{product.name}</span>
            </div>
            <span className="text-[10px] text-[var(--brand-gold)] uppercase font-mono tracking-widest hidden sm:inline">
              PREVIEW MODE
            </span>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-10">
            {/* Top Product Hero Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Product Image Gallery */}
              <div className="lg:col-span-7">
                <ProductGallery
                  images={productImages}
                  productName={product.name}
                  isBestseller={product.isBestseller}
                  isNew={product.isNew}
                />
              </div>

              {/* Product Info & Actions Panel */}
              <div className="lg:col-span-5 space-y-5">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--brand-gold)] bg-[#123F2B] px-3 py-1 rounded-full shadow-sm">
                    {product.category}
                  </span>
                  {product.isBestseller && (
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <Flame className="w-3 h-3 fill-current text-amber-600" />
                      <span>Best Seller</span>
                    </span>
                  )}
                  {product.isNew && (
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <SparklesIcon className="w-3 h-3 text-emerald-600" />
                      <span>New Launch</span>
                    </span>
                  )}
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#123F2A] leading-tight">
                    {product.name}
                  </h1>
                  {product.subtitle && (
                    <p className="text-xs sm:text-sm text-[var(--brand-gold)] font-medium mt-1">
                      {product.subtitle}
                    </p>
                  )}
                </div>

                {/* Rating & Reviews Bar */}
                <div className="flex items-center gap-3 py-1 text-xs">
                  <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-[#123F2A]">
                      {product.rating ? product.rating.toFixed(1) : '4.9'}
                    </span>
                  </div>
                  <span className="text-[#5F6B63]">
                    ({product.reviewsCount || 128} verified customer reviews)
                  </span>
                </div>

                {/* Country of Origin Card */}
                <div className="p-3 bg-white border border-[#E7E1D5] rounded-xl flex items-center justify-between text-xs font-sans text-[#37463D] shadow-sm">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[var(--brand-gold)] shrink-0" />
                    <span>
                      <strong className="text-[#123F2A]">Country of Origin:</strong> {product.countryOfOrigin || 'India (Mysore & Nilgiri Mountain Reserves)'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-gold)] bg-black/5 px-2 py-0.5 rounded">
                    100% Authentic
                  </span>
                </div>

                {/* Price, MRP & Discount Section */}
                <div className="pt-2 pb-2 border-t border-b border-[#E7E1D5] space-y-1">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-2xl sm:text-3xl font-extrabold font-sans text-[#123F2A]">
                      {formatPrice(activePriceINR)}
                    </span>
                    {activeOriginalPriceINR && activeOriginalPriceINR > activePriceINR && (
                      <span className="text-base text-slate-400 line-through font-sans">
                        MRP: {formatPrice(activeOriginalPriceINR)}
                      </span>
                    )}
                    {discountPct > 0 && (
                      <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm font-sans">
                        Save {discountPct}%
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#5F6B63] font-sans">
                    Inclusive of all taxes. Free express shipping automatically applied.
                  </p>
                </div>

                {/* Short Description */}
                {(product.shortDescription || product.description) && (
                  <p className="text-xs sm:text-sm text-[#37463D] leading-relaxed font-sans">
                    {product.shortDescription || product.description}
                  </p>
                )}

                {/* Product Variants Selector */}
                {product.variants && product.variants.length > 0 && (
                  <ProductVariantSelector
                    variants={product.variants}
                    selectedVariant={selectedVariant}
                    onSelectVariant={(variant) => setSelectedVariant(variant)}
                    formatPrice={formatPrice}
                  />
                )}

                {/* Stock & SKU status */}
                <div className="flex items-center justify-between text-xs font-sans text-[#5F6B63]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-medium text-emerald-700">
                      {isOutOfStock ? 'Currently Out of Stock' : `In Stock (${activeStock} units available)`}
                    </span>
                  </div>
                  {activeSku && <span className="font-mono text-[11px]">SKU: {activeSku}</span>}
                </div>

                {/* Quantity & CTA Buttons */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-[#E7E1D5] bg-white rounded-xl overflow-hidden shadow-sm">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3.5 py-2.5 hover:bg-slate-100 font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="px-4 py-2.5 font-bold font-mono text-sm">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="px-3.5 py-2.5 hover:bg-slate-100 font-bold text-sm"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="flex-1 bg-[#123F2A] hover:bg-[#0B2F20] text-white py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
                    >
                      <ShoppingBag className="w-4 h-4 text-[var(--brand-gold)]" />
                      <span>Add to Sacred Bag</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="w-full bg-[var(--brand-gold)] hover:bg-[#c49f2c] text-[#0B2F20] py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Instant Ayurvedic Checkout →</span>
                  </button>
                </div>

                {/* Trust Highlights */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E7E1D5] text-xs font-sans text-[#37463D]">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#E7E1D5]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>100% Hakki-Pikki Tribe Made</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#E7E1D5]">
                    <Truck className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span>Free All-India Fast Shipping</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#E7E1D5]">
                    <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>7-Day Easy Exchange Policy</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#E7E1D5]">
                    <Award className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Certified Pure Botanicals</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comprehensive Detail Sections */}
            <div className="pt-8 border-t border-[#E7E1D5]">
              <ProductDetailSections product={product} />
            </div>

          </div>

          {/* Sticky Bottom Bar on Mobile/Tablet */}
          <ProductStickyBar
            product={product}
            selectedVariant={selectedVariant}
            formatPrice={formatPrice}
            onAddToCart={() => {}}
            onBuyNow={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
