import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Star,
  Heart,
  Eye,
  Check,
  ChevronDown,
  HelpCircle,
  Feather,
  Search,
  ArrowUpDown,
  Filter,
  RotateCcw,
  PackageX,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, CategoryPageConfig } from '../types/store';
import { CategoryHeroBanner } from './CategoryHeroBanner';

interface HairCarePageProps {
  onNavigateHome: () => void;
}

const DEFAULT_HAIR_CARE_CONFIG: CategoryPageConfig = {
  id: 'hair-care',
  slug: 'hair-care',
  categoryName: 'Hair Care',
  enabled: true,
  title: 'Hair Care Formulations',
  shortDescription: '100% authentic Adivasi herbal hair oils, follicle growth drops, and root activation serums.',
  cardImage: '/images/hakkiveda_108_oil_gold.jpg',
  cardCtaText: 'Shop Hair Care',
  desktopHeroImage: '/images/hakkiveda_108_oil_gold.jpg',
  mobileHeroImage: '/images/hakkiveda_108_oil_gold.jpg',
  heroVideo: '',
  heroFocalPoint: 'center',
  heroObjectFit: 'cover',
  heroHeightDesktop: '600px',
  heroHeightMobile: '480px',
  heroOverlayOpacity: 60,
  heroTextColor: '#FFFFFF',
  ctaText: 'Explore Hair Care',
  ctaLink: '#products',
  displayOrder: 1,
  seoTitle: 'Hair Care Formulations | Adivasi Hair Oils & Serums - HAKKIVEDA',
  seoDescription: 'Shop authentic Hakki-Pikki Adivasi Hair Care formulations. 108 Mountain Herbs Hair Oil, 42 Herbs Shampoo, and Root Density Serums. Free express worldwide shipping.',
  ogImage: '/images/hakkiveda_108_oil_gold.jpg',
  sections: [],
};

export const HairCarePage: React.FC<HairCarePageProps> = ({ onNavigateHome }) => {
  const {
    products,
    categoryPages,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    openQuickView,
    playSound,
  } = useStore();

  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'bestseller' | 'price-asc' | 'price-desc' | 'rating' | 'name'>('bestseller');

  // Safeguard: Page Config with Fallback
  const pageConfig = useMemo(() => {
    if (!categoryPages || !Array.isArray(categoryPages)) return DEFAULT_HAIR_CARE_CONFIG;
    const found = categoryPages.find((c) => c.id === 'hair-care');
    return found || DEFAULT_HAIR_CARE_CONFIG;
  }, [categoryPages]);

  // Filter & Sort Hair Care products with full safeguards
  const hairCareProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];

    let result = products.filter((p) => {
      if (!p) return false;
      const isHairCat =
        p.primaryCategory === 'hair-care' ||
        p.category === 'Hair Oils & Elixirs' ||
        p.category === 'Herbal Cleansers' ||
        p.category === 'Follicle Serums' ||
        (p.name && (
          p.name.toLowerCase().includes('hair') ||
          p.name.toLowerCase().includes('oil') ||
          p.name.toLowerCase().includes('shampoo') ||
          p.name.toLowerCase().includes('serum')
        ));
      return isHairCat;
    });

    // 1. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.ingredients && p.ingredients.some((ing) => ing.toLowerCase().includes(q)))
      );
    }

    // 2. In-stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.inStock !== false);
    }

    // 3. Sorting
    return [...result].sort((a, b) => {
      if (sortBy === 'price-asc') return (a.priceINR || 0) - (b.priceINR || 0);
      if (sortBy === 'price-desc') return (b.priceINR || 0) - (a.priceINR || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      // default: bestseller & displayOrder
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      return (a.displayOrder || 0) - (b.displayOrder || 0);
    });
  }, [products, searchQuery, inStockOnly, sortBy]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    playSound('add_to_cart');
    addToCart(product, 1);
    setAddedToast(product.name);
    setTimeout(() => setAddedToast(null), 3000);
  };

  const handleBuyNow = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    playSound('add_to_cart');
    addToCart(product, 1);
    const cartBtn = document.querySelector('[aria-label="Shopping Cart"]') as HTMLButtonElement;
    if (cartBtn) cartBtn.click();
  };

  const FAQS = [
    {
      q: 'How soon can I expect visible hair growth and reduced hair fall?',
      a: 'Most customers notice a dramatic reduction in hair fall and root breakage within 14 to 21 days of consistent 3x weekly oiling and shampooing. Dormant follicle reactivation and baby hair sprouting typically appear within 45 to 60 days.',
    },
    {
      q: 'Is HAKKIVEDA Hair Care safe for color-treated or bleached hair?',
      a: 'Yes, 100%! All our hair care products are sulfate-free, paraben-free, and formulated with 100% cold-pressed virgin oils that preserve color vibrance while restoring moisture lost during chemical treatments.',
    },
    {
      q: 'How often should I apply the 108 Herbs Hair Oil?',
      a: 'For optimal scalp stimulation, apply 10-15ml of warm oil 3 times a week. Massage thoroughly into dry scalp for 5 minutes and leave it on overnight or for at least 2 hours before washing.',
    },
    {
      q: 'Do I need to wash out the Root Density Follicle Serum?',
      a: 'No! The Root Density Serum is a lightweight, non-greasy aqueous formula designed to be left on the scalp daily. Apply 1 full dropper onto scalp sections and leave it in.',
    },
  ];

  // Safeguard: Loading State
  if (!products) {
    return (
      <div className="min-h-screen bg-[#FAF8F2] dark:bg-[#0E281C] text-[#123F2A] dark:text-white flex items-center justify-center p-8">
        <div className="bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-emerald-800 rounded-3xl p-8 max-w-md w-full text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 bg-emerald-700/20 dark:bg-emerald-700/50 rounded-full mx-auto" />
          <div className="h-6 bg-emerald-700/20 dark:bg-emerald-700/50 rounded-lg w-3/4 mx-auto" />
          <div className="h-4 bg-emerald-700/20 dark:bg-emerald-700/50 rounded-lg w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F2] dark:bg-[#0E281C] text-[#123F2A] dark:text-white selection:bg-[var(--brand-gold)] selection:text-[#0E281C]">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-8 left-8 z-50 bg-[#123F2A] text-white dark:bg-[var(--brand-gold)] dark:text-[#0E281C] px-5 py-3 rounded-xl shadow-2xl font-sans text-xs font-bold flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <Check className="w-5 h-5 bg-[var(--brand-gold)] text-[#123F2A] rounded-full p-1" />
          <span>Added '{addedToast}' to your cart!</span>
        </div>
      )}

      {/* 1. HERO BANNER (Breadcrumb + Pure Artwork) */}
      <CategoryHeroBanner
        config={pageConfig}
        fallbackTitle="Hair Care Formulations"
        onNavigateHome={onNavigateHome}
      />

      {/* 2. PRODUCTS SECTION (HEADER, SEARCH, FILTERS & SORT) */}
      <section className="py-10 sm:py-14 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E7E1D5] dark:border-white/10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#123F2A] dark:text-slate-100">
              Hair Care Formulations
            </h2>
            <p className="text-xs text-[#37463D] dark:text-slate-300 mt-1 font-sans">
              Showing {hairCareProducts.length} authentic hair regrowth and scalp care formulations
            </p>
          </div>
          <div className="text-xs font-sans text-[#C9A84E] font-bold flex items-center gap-2">
            <Feather className="w-4 h-4" />
            <span>Free Express Worldwide Shipping</span>
          </div>
        </div>

        {/* SEARCH, IN-STOCK FILTER & SORT CONTROL BAR */}
        <div className="mb-8 bg-white dark:bg-[#123F2B] p-4 rounded-2xl border border-[#E7E1D5] dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          {/* Search Bar Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#123F2A] dark:text-emerald-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search oil, serum, shampoo..."
              className="w-full bg-[#FAF8F2] dark:bg-[#0E281C] text-xs text-[#123F2A] dark:text-white placeholder-[#5F6B63] dark:placeholder-slate-400 pl-10 pr-8 py-2.5 rounded-xl border border-[#E7E1D5] dark:border-white/10 focus:outline-none focus:border-[#C9A84E] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-[#123F2A] dark:hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Controls: In-Stock Toggle & Sort By */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* In-Stock Filter */}
            <label className="inline-flex items-center gap-2 bg-[#FAF8F2] dark:bg-[#0E281C] px-3.5 py-2 rounded-xl border border-[#E7E1D5] dark:border-white/10 text-xs font-bold text-[#123F2A] dark:text-slate-200 cursor-pointer hover:border-[#C9A84E] transition-colors select-none shadow-sm">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-[#123F2A] focus:ring-0 w-3.5 h-3.5 accent-[#123F2A] cursor-pointer"
              />
              <Filter className="w-3.5 h-3.5 text-[#C9A84E]" />
              <span>In Stock Only</span>
            </label>

            {/* Sort Control Dropdown */}
            <div className="flex items-center gap-2 bg-[#FAF8F2] dark:bg-[#0E281C] px-3.5 py-2 rounded-xl border border-[#E7E1D5] dark:border-white/10 text-xs font-bold text-[#123F2A] dark:text-slate-200 shadow-sm">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#C9A84E]" />
              <span className="text-[#5F6B63] dark:text-slate-400 font-normal">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-[#123F2A] dark:text-white font-bold focus:outline-none cursor-pointer pr-1"
              >
                <option value="bestseller" className="bg-white text-[#123F2A] dark:bg-[#0E281C] dark:text-white">Bestsellers</option>
                <option value="price-asc" className="bg-white text-[#123F2A] dark:bg-[#0E281C] dark:text-white">Price: Low to High</option>
                <option value="price-desc" className="bg-white text-[#123F2A] dark:bg-[#0E281C] dark:text-white">Price: High to Low</option>
                <option value="rating" className="bg-white text-[#123F2A] dark:bg-[#0E281C] dark:text-white">Top Rated</option>
                <option value="name" className="bg-white text-[#123F2A] dark:bg-[#0E281C] dark:text-white">Alphabetical</option>
              </select>
            </div>

            {/* Reset Filters button if any active */}
            {(searchQuery || inStockOnly || sortBy !== 'bestseller') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setInStockOnly(false);
                  setSortBy('bestseller');
                }}
                className="p-2 bg-[#FAF8F2] dark:bg-[#0E281C] hover:bg-slate-200 dark:hover:bg-emerald-900 text-[#123F2A] dark:text-slate-300 rounded-xl border border-[#E7E1D5] dark:border-white/10 text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                title="Reset Filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* EMPTY STATE SAFEGUARD */}
        {hairCareProducts.length === 0 ? (
          <div className="bg-white dark:bg-[#123F2B]/60 border-2 border-dashed border-[#E7E1D5] dark:border-white/15 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto my-8">
            <div className="w-16 h-16 bg-[#FAF8F2] dark:bg-[#0E281C] text-[#C9A84E] rounded-full flex items-center justify-center mx-auto border border-[#E7E1D5] dark:border-white/10 shadow-md">
              <PackageX className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif-luxury font-bold text-[#123F2A] dark:text-slate-100">
              No Hair Care Formulations Found
            </h3>
            <p className="text-xs text-[#37463D] dark:text-slate-300 max-w-md mx-auto leading-relaxed font-sans">
              No products matched your search "{searchQuery}" or current filters. Try resetting your search or filter options.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setInStockOnly(false);
                setSortBy('bestseller');
              }}
              className="bg-[#123F2A] hover:bg-[#0B2F20] text-white dark:bg-[var(--brand-gold)] dark:text-[#0E281C] font-extrabold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Search & Filters</span>
            </button>
          </div>
        ) : (
          /* Responsive Product Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {hairCareProducts.map((product) => {
              const inWishlist = isInWishlist(product.id);
              const discountPct = product.originalPriceINR
                ? Math.round(((product.originalPriceINR - product.priceINR) / product.originalPriceINR) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  onClick={() => openQuickView(product)}
                  className="bg-white text-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-2xl active:scale-[0.99] transition-all duration-300 flex flex-col group cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      width={320}
                      height={320}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
                      <span className="bg-[#123F2B] text-[var(--brand-gold)] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-[var(--brand-gold)]/30 shadow-md">
                        {product.category}
                      </span>
                      {discountPct > 0 && (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                          {discountPct}% OFF
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playSound('wishlist_toggle');
                        toggleWishlist(product.id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md z-10 cursor-pointer ${
                        inWishlist
                          ? 'bg-rose-500 text-white'
                          : 'bg-black/40 text-white hover:bg-white hover:text-rose-500'
                      }`}
                      aria-label={`Wishlist ${product.name}`}
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                    </button>

                    {/* Quick View Indicator Overlay */}
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                      <span className="bg-white/95 text-slate-900 font-bold text-xs px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                        <Eye className="w-4 h-4 text-[#123F2B]" />
                        <span>Quick View</span>
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-sans mb-1">
                        <span className="font-semibold text-[#123F2B] uppercase tracking-wider">
                          {product.category}
                        </span>
                        {product.volume && <span>{product.volume}</span>}
                      </div>

                      <h3 className="font-serif-luxury font-bold text-sm sm:text-base text-slate-900 line-clamp-2 hover:text-[#123F2B] transition-colors leading-snug">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-1.5 mt-2">
                        <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                        <span className="text-xs font-bold text-slate-800">{product.rating}</span>
                        <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Pricing & Actions */}
                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-extrabold text-[#123F2B]">
                          {formatPrice(product.priceINR)}
                        </span>
                        {product.originalPriceINR && product.originalPriceINR > product.priceINR && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatPrice(product.originalPriceINR)}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(e, product)}
                          className="w-full py-2 px-2 bg-[#FAF8F2] hover:bg-[#E7E1D5] text-[#123F2A] rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm active:scale-95 border border-[#E7E1D5]"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleBuyNow(e, product)}
                          className="w-full py-2 px-2 bg-[#123F2A] hover:bg-[#0B2F20] text-white rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer transition-colors shadow-sm active:scale-95"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. REVIEWS SECTION */}
      <section className="py-12 bg-white dark:bg-white/5 border-t border-b border-[#E7E1D5] dark:border-white/10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[#C9A84E] text-xs font-bold uppercase tracking-widest">
              Verified Customer Reviews
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#123F2A] dark:text-slate-100 mt-1">
              Trusted by 50,000+ Customers Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FAF8F2] dark:bg-[#123F2B] p-6 rounded-2xl border border-[#E7E1D5] dark:border-white/10 space-y-3 shadow-sm">
              <div className="flex items-center text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#37463D] dark:text-slate-200 italic leading-relaxed">
                "My hair fall dropped by 90% after just 2 weeks of using the 108 Herbs oil and shampoo. My scalp feels so healthy and clean!"
              </p>
              <p className="text-xs font-bold text-[#123F2A] dark:text-[var(--brand-gold)]">— Sunita K., Bengaluru</p>
            </div>

            <div className="bg-[#FAF8F2] dark:bg-[#123F2B] p-6 rounded-2xl border border-[#E7E1D5] dark:border-white/10 space-y-3 shadow-sm">
              <div className="flex items-center text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#37463D] dark:text-slate-200 italic leading-relaxed">
                "I was skeptical, but the Root Density Serum sprouted new baby hairs around my hairline within 50 days. Truly authentic!"
              </p>
              <p className="text-xs font-bold text-[#123F2A] dark:text-[var(--brand-gold)]">— Vikram S., Delhi</p>
            </div>

            <div className="bg-[#FAF8F2] dark:bg-[#123F2B] p-6 rounded-2xl border border-[#E7E1D5] dark:border-white/10 space-y-3 shadow-sm">
              <div className="flex items-center text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#37463D] dark:text-slate-200 italic leading-relaxed">
                "Free express shipping arrived in Singapore in 3 days. The smell of copper-cooked herbs is incredible and pure."
              </p>
              <p className="text-xs font-bold text-[#123F2A] dark:text-[var(--brand-gold)]">— Rajesh M., Singapore</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#C9A84E]" />
          <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#123F2A] dark:text-slate-100">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-white/5 border border-[#E7E1D5] dark:border-white/10 rounded-2xl overflow-hidden transition-colors shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between text-sm font-serif-luxury font-bold text-[#123F2A] dark:text-slate-100 hover:text-[#C9A84E] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#C9A84E]' : 'text-[#5F6B63]'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-[#37463D] dark:text-slate-300 leading-relaxed font-sans border-t border-[#E7E1D5] dark:border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

