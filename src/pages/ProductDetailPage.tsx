import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  ShoppingBag,
  Heart,
  Shield,
  Check,
  Truck,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Share2,
  Globe,
  Package,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, ProductVariant } from '../types/store';
import { findProductBySlug } from '../utils/productUtils';
import { resolveProductBackDestination, getProductCategoryRoute } from '../utils/navigationState';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductVariantSelector } from '../components/product/ProductVariantSelector';
import { ProductDetailSections } from '../components/product/ProductDetailSections';
import { ProductStickyBar } from '../components/product/ProductStickyBar';
import { MobileProductTrustStrip } from '../components/product/MobileProductTrustStrip';
import { MobileProductTopBar } from '../components/product/MobileProductTopBar';
import { MobileExploreTheseSection } from '../components/product/MobileExploreTheseSection';
import { MobileCategoryCarousel } from '../components/product/MobileCategoryCarousel';
import { MobileRecentlyViewedSection } from '../components/product/MobileRecentlyViewedSection';
import { recordRecentlyViewed } from '../utils/recentlyViewed';

interface ProductDetailPageProps {
  slug: string;
  onNavigateHome: () => void;
  onNavigateCategory?: (categoryName: string) => void;
  onNavigateProduct: (product: Product) => void;
  onNavigateReviews?: (product: Product) => void;
  onNavigateBack?: (destinationPath: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  slug,
  onNavigateHome,
  onNavigateCategory,
  onNavigateProduct,
  onNavigateReviews,
  onNavigateBack,
}) => {
  const {
    products,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    openQuickView,
    playSound,
    setIsCartOpen,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const [addedRelProductId, setAddedRelProductId] = useState<string | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  // Find product by slug
  const product = useMemo(() => {
    return findProductBySlug(products, slug);
  }, [products, slug]);

  // Set default variant when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setQuantity(1);
    if (product?.variants && product.variants.length > 0) {
      // Pick first active variant or the standard one
      const defaultVar =
        product.variants.find((v) => v.name.includes('Standard') || v.name.includes('200') || v.name.includes('250')) ||
        product.variants[0];
      setSelectedVariant(defaultVar);
    } else {
      setSelectedVariant(null);
    }
  }, [slug, product]);

  // Update Page Title and Meta Tags
  useEffect(() => {
    if (product) {
      document.title = product.seoTitle || `${product.name} | 100% Authentic Adivasi Formulation - HAKKIVEDA`;
      // Track product in Recently Viewed history
      recordRecentlyViewed(product.id);
    } else {
      document.title = `Product Not Found - HAKKIVEDA`;
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F2] dark:bg-[var(--brand-primary-dark,#0B1D13)] text-[#123F2A] dark:text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/10 rounded-2xl p-8 shadow-xl space-y-4">
          <div className="w-16 h-16 bg-amber-500/10 text-[var(--brand-gold,#D4AF37)] rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif-luxury font-bold text-[#123F2A] dark:text-white">
            Formulation Not Found
          </h2>
          <p className="text-xs text-[#37463D] dark:text-slate-300 leading-relaxed font-sans">
            The requested herbal formulation could not be located in our catalog.
          </p>
          <button
            onClick={onNavigateHome}
            className="w-full py-3 px-6 rounded-xl bg-[#123F2A] hover:bg-[#0B2F20] dark:bg-[var(--brand-gold)] dark:text-[#0B2F20] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Botanical Catalog</span>
          </button>
        </div>
      </div>
    );
  }

  // Active pricing, discount, and SKU derived from selected variant or base product
  const activePriceINR = selectedVariant ? selectedVariant.priceINR : product.priceINR;
  const activeOriginalPriceINR = selectedVariant?.originalPriceINR ?? product.originalPriceINR;
  const activeSku = selectedVariant?.sku || product.sku;
  const activeStock = selectedVariant ? selectedVariant.stock : (product.stock ?? 150);
  const isOutOfStock = activeStock <= 0;

  const discountPct =
    activeOriginalPriceINR && activeOriginalPriceINR > activePriceINR
      ? Math.round(((activeOriginalPriceINR - activePriceINR) / activeOriginalPriceINR) * 100)
      : 0;

  // Build product images list from database (no hardcoding)
  const productImages = useMemo(() => {
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

  const inWishlist = isInWishlist(product.id);

  // Related products (Manual selection or smart category fallback)
  const relatedProducts = useMemo(() => {
    if (product.relatedProductsMode === 'manual' && product.relatedProductIds && product.relatedProductIds.length > 0) {
      const manual = product.relatedProductIds
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean) as Product[];
      if (manual.length > 0) return manual;
    }
    return products
      .filter((p) => p.id !== product.id && (p.category === product.category || p.isBestseller))
      .slice(0, 4);
  }, [product, products]);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    playSound('add_to_cart');
    addToCart(product, quantity, selectedVariant || undefined);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    playSound('add_to_cart');
    addToCart(product, quantity, selectedVariant || undefined);
    setIsCartOpen(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.subtitle || product.description,
          url: window.location.href,
        });
      } catch (_) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const handleBack = () => {
    playSound('nav_click');
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else if (onNavigateBack) {
      const destination = resolveProductBackDestination(product, slug);
      onNavigateBack(destination);
    } else if (onNavigateCategory && (product.category === 'Hair Care' || product.category === 'Skin Care' || product.category === 'Tribal Wellness')) {
      const catRoute = getProductCategoryRoute(product);
      onNavigateCategory(catRoute);
    } else {
      onNavigateHome();
    }
  };

  return (
    <div className="product-detail-page bg-[#FAF8F2] dark:bg-[var(--brand-primary-dark,#0B1D13)] text-[#123F2A] dark:text-white min-h-screen pt-0 pb-28 sm:py-10 sm:pb-16 transition-colors duration-300">
      {/* Mobile Sticky Top Bar (Phone only) */}
      <MobileProductTopBar
        product={product}
        onBack={handleBack}
        onNavigateProduct={onNavigateProduct}
      />

      {/* Copy link toast Notification */}
      {copiedToast && (
        <div className="fixed bottom-24 sm:bottom-8 left-4 sm:left-8 z-50 bg-[#123F2A] text-[var(--brand-gold)] dark:bg-[var(--brand-gold)] dark:text-[#0B2F20] px-5 py-3.5 rounded-xl shadow-2xl font-sans text-xs font-bold flex items-center gap-3 border border-[var(--brand-gold)]/40 animate-in slide-in-from-bottom duration-300">
          <Check className="w-5 h-5 bg-[var(--brand-gold)] text-[#123F2A] rounded-full p-1 shrink-0" />
          <span>Product link copied to clipboard!</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-8 lg:px-12 pt-3 sm:pt-0">
        {/* Desktop Breadcrumb & Back Navigation */}
        <div className="hidden md:flex items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-[#E7E1D5] dark:border-white/10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-sans text-[#37463D] dark:text-slate-300 overflow-x-auto whitespace-nowrap scrollbar-none">
            <button
              onClick={onNavigateHome}
              className="hover:text-[var(--brand-gold)] transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <button
              onClick={() => {
                const catRoute = getProductCategoryRoute(product);
                if (onNavigateBack && catRoute && catRoute !== '/') {
                  onNavigateBack(catRoute);
                } else if (onNavigateCategory) {
                  onNavigateCategory(product.category);
                } else {
                  onNavigateHome();
                }
              }}
              className="hover:text-[var(--brand-gold)] transition-colors cursor-pointer font-medium"
            >
              <span>{product.category}</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[var(--brand-gold,#D4AF37)] font-bold truncate max-w-[140px] sm:max-w-md">
              {product.name}
            </span>
          </nav>

          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[#123F2A] dark:text-slate-200 hover:text-[var(--brand-gold)] transition-colors shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>

        {/* Main Product Hero Grid */}
        <div className="bg-transparent sm:bg-white dark:sm:bg-[#123F2B] border-0 sm:border border-[#E7E1D5] dark:border-white/10 rounded-none sm:rounded-3xl shadow-none sm:shadow-xl overflow-hidden mb-8 sm:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left: Product Image Gallery (6 Cols) */}
            <div className="lg:col-span-6 p-0 sm:p-8 bg-transparent sm:bg-[#FAF8F2]/60 dark:sm:bg-black/20 border-b-0 lg:border-b-0 lg:border-r border-[#E7E1D5] dark:border-white/10 flex flex-col justify-center">
              <ProductGallery
                images={productImages}
                productName={product.name}
                isBestseller={product.isBestseller}
                discountPct={discountPct}
                sku={activeSku}
                selectedVariantImage={selectedVariant?.image}
                isInWishlist={inWishlist}
                onToggleWishlist={() => {
                  playSound('wishlist_toggle');
                  toggleWishlist(product.id);
                }}
                onShare={handleShare}
              />
            </div>

            {/* Right: Product Details & Purchase Form (6 Cols) */}
            <div className="lg:col-span-6 px-0 py-4 sm:p-10 flex flex-col justify-between space-y-6 bg-transparent sm:bg-white dark:sm:bg-[#123F2B] text-[#123F2A] dark:text-white">
              <div className="space-y-4">
                {/* Category & Stock Status Row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-widest text-[var(--brand-gold)] font-extrabold font-sans">
                      {product.category}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs text-[#37463D] dark:text-slate-300 font-medium">
                      {selectedVariant ? selectedVariant.size || selectedVariant.name : product.volume}
                    </span>
                  </div>

                  {/* Stock Status Badge */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      isOutOfStock
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                        : activeStock <= 10
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isOutOfStock
                          ? 'bg-rose-500'
                          : activeStock <= 10
                          ? 'bg-amber-500 animate-ping'
                          : 'bg-emerald-500 animate-pulse'
                      }`}
                    ></span>
                    <span>
                      {isOutOfStock
                        ? 'Sold Out'
                        : activeStock <= 10
                        ? `Only ${activeStock} units left!`
                        : `In Stock (${activeStock} units ready to ship)`}
                    </span>
                  </div>
                </div>

                {/* Main Product Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-[#123F2A] dark:text-white leading-tight">
                  {product.name}
                </h1>

                {/* Subtitle */}
                {product.subtitle && (
                  <p className="text-sm font-sans font-medium text-[var(--brand-gold)]">
                    {product.subtitle}
                  </p>
                )}

                {/* Star Rating & Review Count */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#123F2A] dark:text-slate-100 font-sans">
                    {product.rating}
                  </span>
                  <span className="text-xs text-[#5F6B63] dark:text-slate-400 font-sans">
                    ({product.reviewsCount} verified customer reviews)
                  </span>
                  <button
                    onClick={() => {
                      const el = document.getElementById('section-reviews');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs text-[var(--brand-gold)] font-bold underline hover:text-[#123F2A] transition-colors ml-auto cursor-pointer"
                  >
                    Read Reviews
                  </button>
                </div>

                {/* Country of Origin Card */}
                <div className="p-3 bg-[#FAF8F2] dark:bg-black/20 border border-[#E7E1D5] dark:border-white/10 rounded-xl flex items-center justify-between text-xs font-sans text-[#37463D] dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[var(--brand-gold)] shrink-0" />
                    <span>
                      <strong className="text-[#123F2A] dark:text-white">Country of Origin:</strong> {product.countryOfOrigin || 'India (Mysore & Nilgiri Mountain Reserves)'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-gold)] bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded">
                    100% Authentic
                  </span>
                </div>

                {/* Price, MRP & Discount Section */}
                <div className="pt-2 pb-2 border-t border-b border-[#E7E1D5] dark:border-white/10 space-y-1">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-2xl sm:text-3xl font-extrabold font-sans text-[#123F2A] dark:text-[var(--brand-gold)]">
                      {formatPrice(activePriceINR)}
                    </span>
                    {activeOriginalPriceINR && activeOriginalPriceINR > activePriceINR && (
                      <span className="text-base text-slate-400 dark:text-slate-400 line-through font-sans">
                        MRP: {formatPrice(activeOriginalPriceINR)}
                      </span>
                    )}
                    {discountPct > 0 && (
                      <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm font-sans">
                        Save {discountPct}%
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#5F6B63] dark:text-slate-400 font-sans">
                    Inclusive of all taxes. Free express shipping automatically applied.
                  </p>
                </div>

                {/* Short Description */}
                {(product.shortDescription || product.description) && (
                  <p className="text-xs sm:text-sm text-[#37463D] dark:text-slate-200 leading-relaxed font-sans">
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
              </div>

              {/* Quantity Selector & Main Action Buttons */}
              <div className="space-y-3 sm:space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  {/* Quantity Control */}
                  <div className="flex items-center justify-between border border-[#E7E1D5] dark:border-white/20 rounded-xl overflow-hidden bg-[#FAF8F2] dark:bg-black/30 w-full sm:w-36 shrink-0 h-12 shadow-inner">
                    <button
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 sm:w-11 h-full text-[#123F2A] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 font-bold text-lg flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-2 font-bold text-sm text-[#123F2A] dark:text-white font-sans">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={isOutOfStock || quantity >= activeStock}
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 sm:w-11 h-full text-[#123F2A] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 font-bold text-lg flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button (Desktop only - mobile uses sticky bottom bar) */}
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    className={`hidden sm:flex flex-1 h-12 px-6 rounded-xl font-sans text-xs sm:text-sm font-bold uppercase tracking-wider transition-all items-center justify-center gap-2 shadow-lg active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      isAdded
                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-500 shadow-emerald-900/30'
                        : 'bg-[#123F2A] hover:bg-[#0B2F20] dark:bg-white dark:text-[#0B2F20] text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 text-[var(--brand-gold,#C9A84E)] stroke-[3]" />
                        <span>✓ ADDED TO CART</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[var(--brand-gold)] dark:text-[#0B2F20]" />
                        <span>
                          {isOutOfStock
                            ? 'Sold Out'
                            : `Add to Bag • ${formatPrice(activePriceINR * quantity)}`}
                        </span>
                      </>
                    )}
                  </button>

                  {/* Wishlist Button (Desktop only - mobile uses gallery heart overlay) */}
                  <button
                    type="button"
                    onClick={() => {
                      playSound('wishlist_toggle');
                      toggleWishlist(product.id);
                    }}
                    className={`hidden sm:flex h-12 w-12 rounded-xl border items-center justify-center transition-all shrink-0 cursor-pointer shadow-sm ${
                      inWishlist
                        ? 'border-rose-500 bg-rose-500 text-white shadow-rose-500/20'
                        : 'border-[#E7E1D5] dark:border-white/20 text-[#123F2A] dark:text-white hover:border-[var(--brand-gold)]'
                    }`}
                    aria-label="Add to Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>

                  {/* Share Button (Desktop only - mobile uses gallery share overlay) */}
                  <button
                    type="button"
                    onClick={handleShare}
                    className="hidden sm:flex h-12 w-12 rounded-xl border border-[#E7E1D5] dark:border-white/20 text-[#123F2A] dark:text-white hover:border-[var(--brand-gold)] items-center justify-center transition-all shrink-0 cursor-pointer shadow-sm"
                    aria-label="Share product"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Buy Now Immediate Checkout Button */}
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="w-full h-12 rounded-xl bg-[var(--brand-gold,#D4AF37)] hover:bg-amber-400 text-[#0B2F20] font-sans text-xs sm:text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isOutOfStock
                      ? 'Out of Stock'
                      : 'Buy Now — Instant Express Checkout'}
                  </span>
                </button>

                {/* Mobile-Only Auto-Sliding Payment/Trust Strip & Same-Day Dispatch Timer */}
                <MobileProductTrustStrip />

                {/* Worldwide Shipping & Authenticity Trust Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#E7E1D5] dark:border-white/10 text-xs font-sans text-[#37463D] dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[var(--brand-gold)] shrink-0" />
                    <span>
                      <strong className="text-[#123F2A] dark:text-white">Worldwide Shipping:</strong> USA, UK, Singapore, Malaysia, Mauritius, UAE & Global
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[var(--brand-gold)] shrink-0" />
                    <span>
                      <strong className="text-[#123F2A] dark:text-white">100% Authentic:</strong> Direct from Hakki-Pikki tribal vaidyas in Mysore
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rich Product Detail Sections (Description, Benefits, Ingredients, How to Use, Who It Is For, Specs, Safety, Storage, Shipping, Returns, Reviews) */}
        <ProductDetailSections
          product={product}
          onViewAllReviews={() => {
            if (onNavigateReviews) {
              onNavigateReviews(product);
            }
          }}
        />

        {/* Mobile Product Discovery Sections (Phone only: Explore These -> Shop by Category -> Recently Viewed) */}
        <div className="block md:hidden space-y-2 mt-4 mb-6">
          {/* 1. EXPLORE THESE */}
          <MobileExploreTheseSection
            currentProduct={product}
            onNavigateProduct={onNavigateProduct}
            onViewAll={onNavigateHome}
          />

          {/* 2. SHOP BY CATEGORY */}
          <MobileCategoryCarousel
            onNavigateCategory={(catName) => {
              if (onNavigateCategory) {
                onNavigateCategory(catName);
              } else {
                onNavigateHome();
              }
            }}
            onNavigateBack={onNavigateBack}
          />

          {/* 3. RECENTLY VIEWED */}
          <MobileRecentlyViewedSection
            currentProduct={product}
            onNavigateProduct={onNavigateProduct}
          />
        </div>

        {/* Desktop Related Formulations Section (Desktop only - unchanged) */}
        {relatedProducts.length > 0 && (
          <div className="hidden md:block mb-16">
            <div className="flex items-end justify-between mb-8 pb-4 border-b border-[#E7E1D5] dark:border-white/10">
              <div>
                <span className="text-[var(--brand-gold)] font-sans text-xs uppercase tracking-[0.25em] font-bold block mb-1">
                  Complete Your Regimen
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#123F2A] dark:text-white">
                  Related Tribal Formulations
                </h2>
              </div>
              <button
                onClick={onNavigateHome}
                className="text-xs font-sans font-bold text-[var(--brand-gold)] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>View All ({products.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => {
                const relInWish = isInWishlist(relProduct.id);
                const relDiscount =
                  relProduct.originalPriceINR && relProduct.originalPriceINR > relProduct.priceINR
                    ? Math.round(
                        ((relProduct.originalPriceINR - relProduct.priceINR) /
                          relProduct.originalPriceINR) *
                          100
                      )
                    : 0;

                return (
                  <div
                    key={relProduct.id}
                    onClick={() => onNavigateProduct(relProduct)}
                    className="bg-white text-slate-900 rounded-2xl overflow-hidden border border-[#E7E1D5] dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square w-full overflow-hidden bg-slate-100 p-2">
                      <img
                        src={relProduct.image}
                        alt={relProduct.name}
                        loading="lazy"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
                        <span className="bg-[#123F2A] text-[var(--brand-gold)] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-[var(--brand-gold)]/30 shadow-md">
                          {relProduct.category}
                        </span>
                        {relDiscount > 0 && (
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                            {relDiscount}% OFF
                          </span>
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playSound('wishlist_toggle');
                          toggleWishlist(relProduct.id);
                        }}
                        className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-10 h-10 rounded-full transition-all duration-200 shadow-md flex items-center justify-center z-10 cursor-pointer active:scale-95 ${
                          relInWish
                            ? 'bg-[#0B4A35] text-[var(--brand-gold,#C9A84E)] border border-[var(--brand-gold,#C9A84E)]/60 shadow-[0_2px_8px_rgba(11,74,53,0.35)]'
                            : 'bg-white/95 text-[#0B4A35] border border-[rgba(201,168,76,0.35)] hover:border-[#0B4A35]/50 hover:bg-white hover:text-[#0B4A35] hover:scale-105'
                        }`}
                        aria-label={relInWish ? `Remove ${relProduct.name} from wishlist` : `Add ${relProduct.name} to wishlist`}
                        title={relInWish ? 'In Wishlist' : 'Add to Wishlist'}
                      >
                        <Heart className={`w-4 h-4 transition-transform ${relInWish ? 'fill-current scale-105' : ''}`} />
                      </button>

                      {/* Quick View Button on Hover */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openQuickView(relProduct);
                          }}
                          className="bg-white/90 hover:bg-white text-slate-900 font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#123F2A]" />
                          <span>Quick View</span>
                        </button>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-sans text-slate-500 mb-1">
                          <span className="font-semibold uppercase text-[#123F2A] tracking-wider">
                            {relProduct.category}
                          </span>
                          {relProduct.volume && <span>{relProduct.volume}</span>}
                        </div>

                        <h3 className="font-serif-luxury font-bold text-sm sm:text-base text-slate-900 line-clamp-2 hover:text-[#123F2A] transition-colors leading-snug">
                          {relProduct.name}
                        </h3>

                        <div className="flex items-center gap-1.5 mt-2">
                          <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                          <span className="text-xs font-bold text-slate-800">{relProduct.rating}</span>
                          <span className="text-[11px] text-slate-400">({relProduct.reviewsCount})</span>
                        </div>
                      </div>

                      {/* Price & Add to Cart */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-base font-extrabold text-[#123F2A]">
                            {formatPrice(relProduct.priceINR)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playSound('add_to_cart');
                            addToCart(relProduct, 1);
                            setAddedRelProductId(relProduct.id);
                            setTimeout(() => setAddedRelProductId(null), 1800);
                          }}
                          className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs active:scale-95 ${
                            addedRelProductId === relProduct.id
                              ? 'bg-emerald-700 text-white'
                              : 'bg-[#123F2A] hover:bg-[#0B2F20] text-white'
                          }`}
                        >
                          {addedRelProductId === relProduct.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[var(--brand-gold,#C9A84E)] stroke-[3]" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar on Mobile/Desktop Scroll */}
      <ProductStickyBar
        product={product}
        selectedVariant={selectedVariant}
        quantity={quantity}
        onQuantityChange={setQuantity}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        formatPrice={formatPrice}
        isAdded={isAdded}
      />
    </div>
  );
};
