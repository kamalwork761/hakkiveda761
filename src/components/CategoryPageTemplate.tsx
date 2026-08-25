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
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, CategoryPageConfig } from '../types/store';
import { CategoryHeroBanner } from './CategoryHeroBanner';
import {
  MobileCategorySortFilterBar,
  CategorySortOption,
  CategoryFilterState,
} from './MobileCategorySortFilterBar';
import { getProductUrl } from '../utils/productUtils';

interface CategoryPageTemplateProps {
  categoryId: string; // e.g., 'hair-care', 'skin-care', 'tribal-wellness'
  onNavigateHome: () => void;
  defaultConfig?: Partial<CategoryPageConfig>;
}

// Category fallback defaults
const CATEGORY_DEFAULTS: Record<string, CategoryPageConfig> = {
  'hair-care': {
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
    heroObjectFit: 'contain',
    heroHeightDesktop: 'auto',
    heroHeightMobile: 'auto',
    heroOverlayOpacity: 0,
    heroTextColor: '#FFFFFF',
    ctaText: 'Explore Hair Care',
    ctaLink: '#products',
    displayOrder: 1,
    seoTitle: 'Hair Care Formulations | Adivasi Hair Oils & Serums - HAKKIVEDA',
    seoDescription: 'Shop authentic Hakki-Pikki Adivasi Hair Care formulations. 108 Mountain Herbs Hair Oil, 42 Herbs Shampoo, and Root Density Serums. Free express worldwide shipping.',
    ogImage: '/images/hakkiveda_108_oil_gold.jpg',
    sections: [],
  },
  'skin-care': {
    id: 'skin-care',
    slug: 'skin-care',
    categoryName: 'Skin Care',
    enabled: true,
    title: 'Skin Care & Herbal Lepas',
    shortDescription: 'Ancient tribal herbal pastes, wild forest ubtans, and soothing botanical clays for natural glow.',
    cardImage: '/images/hakkiveda_108_oil_gold.jpg',
    cardCtaText: 'Shop Skin Care',
    desktopHeroImage: '/images/hakkiveda_108_oil_gold.jpg',
    mobileHeroImage: '/images/hakkiveda_108_oil_gold.jpg',
    heroVideo: '',
    heroFocalPoint: 'center',
    heroObjectFit: 'contain',
    heroHeightDesktop: 'auto',
    heroHeightMobile: 'auto',
    heroOverlayOpacity: 0,
    heroTextColor: '#FFFFFF',
    ctaText: 'Explore Skin Care',
    ctaLink: '#products',
    displayOrder: 2,
    seoTitle: 'Skin Care & Herbal Lepas | Tribal Face Masks - HAKKIVEDA',
    seoDescription: 'Authentic Adivasi skin care rituals. Hand-ground botanical lepas, soothing forest clays, and herbal ubtans.',
    ogImage: '/images/hakkiveda_108_oil_gold.jpg',
    sections: [],
  },
  'tribal-wellness': {
    id: 'tribal-wellness',
    slug: 'tribal-wellness',
    categoryName: 'Tribal Wellness',
    enabled: true,
    title: 'Tribal Wellness & Regrowth Combos',
    shortDescription: 'Holistic 90-day regrowth kits, copper-cooked elixirs, and restorative tribal remedies.',
    cardImage: '/images/hakkiveda_108_oil_gold.jpg',
    cardCtaText: 'Shop Wellness Combos',
    desktopHeroImage: '/images/hakkiveda_108_oil_gold.jpg',
    mobileHeroImage: '/images/hakkiveda_108_oil_gold.jpg',
    heroVideo: '',
    heroFocalPoint: 'center',
    heroObjectFit: 'contain',
    heroHeightDesktop: 'auto',
    heroHeightMobile: 'auto',
    heroOverlayOpacity: 0,
    heroTextColor: '#FFFFFF',
    ctaText: 'Explore Wellness',
    ctaLink: '#products',
    displayOrder: 3,
    seoTitle: 'Tribal Wellness & Kits | Complete Regrowth Regimens - HAKKIVEDA',
    seoDescription: 'Complete 90-day Adivasi wellness kits, hair density combos, and traditional massage tools.',
    ogImage: '/images/hakkiveda_108_oil_gold.jpg',
    sections: [],
  },
};

const CATEGORY_FAQS: Record<string, Array<{ q: string; a: string }>> = {
  'hair-care': [
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
  ],
  'skin-care': [
    {
      q: 'What is an Adivasi Lepa and how is it used?',
      a: 'Lepa is a traditional Adivasi paste made by mixing finely ground wild herbs, clay, and botanicals with water, hydrosol, or oil. It is applied topically to detoxify, soothe, and nourish the skin or scalp.',
    },
    {
      q: 'Is the Lepa suitable for sensitive skin or facial use?',
      a: 'Yes, our Lepas are 100% natural and free from chemical fillers. We recommend performing a 24-hour patch test behind the ear or inner wrist prior to full facial or scalp application.',
    },
    {
      q: 'How often should I apply the Skin Care Lepa?',
      a: 'Apply 2 to 3 times a week for optimal deep cleansing and skin barrier replenishment. Leave on for 15-20 minutes until semi-dry, then rinse with lukewarm water.',
    },
  ],
  'tribal-wellness': [
    {
      q: 'What is included in the Tribal Wellness Regrowth Kit?',
      a: 'The complete kit includes 1x HAKKIVEDA 108 Herbs Hair Oil (200ml), 1x Herbal Baldness Care Powder (150g), 1x 42 Herbs Shampoo (250ml), plus a complimentary handcrafted brass head massager tool.',
    },
    {
      q: 'Why is a 90-day regimen recommended for tribal remedies?',
      a: 'Hair growth follows natural 90-day follicular cycles. The Hakki-Pikki tribe traditional regimen aligns with 3 lunar cycles to allow deep botanical lipid absorption, scalp detoxification, and new root sprouting.',
    },
    {
      q: 'Are there any dietary or lifestyle guidelines during the regimen?',
      a: 'For best results, maintain good hydration, avoid washing hair with scalding hot water, and allow hair to air-dry naturally after applying the shampoo and oil.',
    },
  ],
};

const CATEGORY_REVIEWS: Record<string, Array<{ name: string; location: string; text: string }>> = {
  'hair-care': [
    {
      name: 'Sunita K.',
      location: 'Bengaluru',
      text: 'My hair fall dropped by 90% after just 2 weeks of using the 108 Herbs oil and shampoo. My scalp feels so healthy and clean!',
    },
    {
      name: 'Vikram S.',
      location: 'Delhi',
      text: 'I was skeptical, but the Root Density Serum sprouted new baby hairs around my hairline within 50 days. Truly authentic!',
    },
    {
      name: 'Rajesh M.',
      location: 'Singapore',
      text: 'Free express shipping arrived in Singapore in 3 days. The smell of copper-cooked herbs is incredible and pure.',
    },
  ],
  'skin-care': [
    {
      name: 'Pooja R.',
      location: 'Mumbai',
      text: 'The herbal lepa cleared my stubborn blemishes and pigmentation in 3 weeks. Skin feels velvety smooth and calm.',
    },
    {
      name: 'Ananya D.',
      location: 'Hyderabad',
      text: 'Completely natural cooling sensation! Great for sun exposure recovery and soothing sensitive skin flare-ups.',
    },
    {
      name: 'Meera N.',
      location: 'Chennai',
      text: 'Pure clay and forest herbs without artificial fragrance. Truly a sacred Adivasi formulation.',
    },
  ],
  'tribal-wellness': [
    {
      name: 'Karthik V.',
      location: 'Pune',
      text: 'The 90-day complete kit gave me full density revival across my crown. Worth every single rupee!',
    },
    {
      name: 'Deepa S.',
      location: 'Dubai',
      text: 'The brass massager combined with warm 108 Herbs oil is a nightly therapy that cured my stress-induced hair thinning.',
    },
    {
      name: 'Arjun P.',
      location: 'London',
      text: 'Global shipping to UK was seamless. Authentic forest ingredients and noticeable regrowth in 2 months.',
    },
  ],
};

export const CategoryPageTemplate: React.FC<CategoryPageTemplateProps> = ({
  categoryId,
  onNavigateHome,
  defaultConfig,
}) => {
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

  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<CategorySortOption>('bestseller');
  const [filters, setFilters] = useState<CategoryFilterState>({
    subcategory: '',
    concern: '',
    priceRange: 'all',
    inStockOnly: false,
    minRating: 0,
  });

  // Normalize categoryId (e.g. '/hair-care' -> 'hair-care')
  const cleanCatId = categoryId.replace(/^\//, '').replace(/^categories\//, '').toLowerCase();

  // Safeguard: Page Config with Fallback
  const pageConfig = useMemo(() => {
    const fallback = CATEGORY_DEFAULTS[cleanCatId] || {
      id: cleanCatId,
      slug: cleanCatId,
      categoryName: cleanCatId.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      enabled: true,
      title: `${cleanCatId.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')} Formulations`,
      shortDescription: 'Authentic Hakki-Pikki Adivasi tribal botanical formulations.',
      cardImage: '/images/hakkiveda_108_oil_gold.jpg',
      cardCtaText: 'Shop Now',
      desktopHeroImage: '/images/hakkiveda_108_oil_gold.jpg',
      mobileHeroImage: '/images/hakkiveda_108_oil_gold.jpg',
      heroVideo: '',
      heroFocalPoint: 'center',
      heroObjectFit: 'contain',
      heroHeightDesktop: 'auto',
      heroHeightMobile: 'auto',
      heroOverlayOpacity: 0,
      heroTextColor: '#FFFFFF',
      ctaText: 'Explore Collection',
      ctaLink: '#products',
      displayOrder: 99,
      seoTitle: `${cleanCatId.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')} | HAKKIVEDA`,
      seoDescription: 'Shop authentic Hakki-Pikki tribal formulations with free express shipping.',
      ogImage: '/images/hakkiveda_108_oil_gold.jpg',
      sections: [],
      ...defaultConfig,
    };

    if (!categoryPages || !Array.isArray(categoryPages)) return fallback;
    const found = categoryPages.find((c) => c.id === cleanCatId || c.slug === cleanCatId);
    return found || fallback;
  }, [categoryPages, cleanCatId, defaultConfig]);

  // Extract available subcategories & concerns for this category
  const rawBaseCategoryProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    return products.filter((p) => {
      if (!p) return false;
      if (p.primaryCategory && p.primaryCategory.toLowerCase() === cleanCatId) return true;
      if (cleanCatId === 'hair-care') {
        return (
          p.primaryCategory === 'hair-care' ||
          p.category === 'Hair Oils & Elixirs' ||
          p.category === 'Herbal Cleansers' ||
          p.category === 'Follicle Serums' ||
          (p.name && (
            p.name.toLowerCase().includes('hair') ||
            p.name.toLowerCase().includes('oil') ||
            p.name.toLowerCase().includes('shampoo') ||
            p.name.toLowerCase().includes('serum')
          ))
        );
      }
      if (cleanCatId === 'skin-care') {
        return (
          p.primaryCategory === 'skin-care' ||
          p.category === 'Tribal Masks & Lepas' ||
          (p.name && (
            p.name.toLowerCase().includes('lepa') ||
            p.name.toLowerCase().includes('skin') ||
            p.name.toLowerCase().includes('powder') ||
            p.name.toLowerCase().includes('mask')
          ))
        );
      }
      if (cleanCatId === 'tribal-wellness') {
        return (
          p.primaryCategory === 'tribal-wellness' ||
          p.category === 'Wellness Combos' ||
          (p.name && (
            p.name.toLowerCase().includes('combo') ||
            p.name.toLowerCase().includes('kit') ||
            p.name.toLowerCase().includes('bundle')
          ))
        );
      }
      const formattedName = cleanCatId.replace(/-/g, ' ');
      return (
        (p.category && p.category.toLowerCase().includes(formattedName)) ||
        (p.name && p.name.toLowerCase().includes(formattedName))
      );
    });
  }, [products, cleanCatId]);

  const availableSubcategories = useMemo(() => {
    const set = new Set<string>();
    rawBaseCategoryProducts.forEach((p) => {
      if (p.subcategory) set.add(p.subcategory);
      else if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [rawBaseCategoryProducts]);

  const availableConcerns = useMemo(() => {
    const set = new Set<string>();
    rawBaseCategoryProducts.forEach((p) => {
      if (Array.isArray(p.benefits)) {
        p.benefits.slice(0, 3).forEach((b) => set.add(b));
      }
    });
    return Array.from(set).slice(0, 8);
  }, [rawBaseCategoryProducts]);

  // Filter & Sort Category Products
  const categoryProducts = useMemo(() => {
    let result = [...rawBaseCategoryProducts];

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

    // 2. In-stock filter (from desktop or mobile filter)
    if (inStockOnly || filters.inStockOnly) {
      result = result.filter((p) => p.inStock !== false);
    }

    // 3. Mobile subcategory filter
    if (filters.subcategory) {
      result = result.filter(
        (p) => p.subcategory === filters.subcategory || p.category === filters.subcategory
      );
    }

    // 4. Mobile concern filter
    if (filters.concern) {
      result = result.filter(
        (p) =>
          p.benefits &&
          p.benefits.some((b) => b.toLowerCase().includes(filters.concern.toLowerCase()))
      );
    }

    // 5. Price range filter
    if (filters.priceRange === 'under-999') {
      result = result.filter((p) => (p.priceINR || 0) < 999);
    } else if (filters.priceRange === '999-1999') {
      result = result.filter((p) => (p.priceINR || 0) >= 999 && (p.priceINR || 0) <= 1999);
    } else if (filters.priceRange === 'above-1999') {
      result = result.filter((p) => (p.priceINR || 0) > 1999);
    }

    // 6. Minimum rating filter
    if (filters.minRating > 0) {
      result = result.filter((p) => (p.rating || 0) >= filters.minRating);
    }

    // 7. Sorting
    return [...result].sort((a, b) => {
      if (sortBy === 'price-asc') return (a.priceINR || 0) - (b.priceINR || 0);
      if (sortBy === 'price-desc') return (b.priceINR || 0) - (a.priceINR || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      // default: bestseller & displayOrder
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      return (a.displayOrder || 0) - (b.displayOrder || 0);
    });
  }, [rawBaseCategoryProducts, searchQuery, inStockOnly, filters, sortBy]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    playSound('add_to_cart');
    addToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1800);
  };

  const handleBuyNow = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    playSound('nav_click');
    window.history.pushState({}, '', getProductUrl(product));
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const faqs = CATEGORY_FAQS[cleanCatId] || CATEGORY_FAQS['hair-care'];
  const reviews = CATEGORY_REVIEWS[cleanCatId] || CATEGORY_REVIEWS['hair-care'];

  // Loading State
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
    <div className="category-page min-h-screen pb-24 sm:pb-12 bg-white dark:bg-[#0E281C] text-[#123F2A] dark:text-white selection:bg-[var(--brand-gold,#C9A84E)] selection:text-[#0E281C] transition-colors duration-300">
      {/* 1. HERO BANNER (Breadcrumb + Pure Artwork) */}
      <CategoryHeroBanner
        config={pageConfig}
        fallbackTitle={pageConfig.title || 'Formulations'}
        onNavigateHome={onNavigateHome}
      />

      {/* 2. PRODUCTS SECTION (HEADER, SEARCH, FILTERS & SORT) */}
      <section className="category-products-section py-4 sm:py-14 px-3 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-8 pb-3 sm:pb-4 border-b border-[#E5D8B5] dark:border-white/10 gap-2 sm:gap-4">
          <div>
            <h2 className="category-heading text-xl sm:text-3xl font-serif-luxury font-bold text-[#123F2A] dark:text-slate-100">
              {pageConfig.title || 'Formulations'}
            </h2>
            <p className="category-description text-[11px] sm:text-xs text-[#37463D] dark:text-slate-300 mt-0.5 sm:mt-1 font-sans">
              Showing {categoryProducts.length} authentic {pageConfig.categoryName.toLowerCase()} formulations
            </p>
          </div>
          <div className="text-[11px] sm:text-xs font-sans text-[#C9A84E] font-bold flex items-center gap-1.5 sm:gap-2">
            <Feather className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Free Express Worldwide Shipping</span>
          </div>
        </div>

        {/* SEARCH, IN-STOCK FILTER & SORT CONTROL BAR (DESKTOP / TABLET ONLY: hidden on mobile md:flex) */}
        <div className="hidden md:flex category-filter-bar mb-8 bg-[#FAF8F2] dark:bg-[#123F2B] p-4 rounded-2xl border border-[#E5D8B5] dark:border-white/10 flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          {/* Search Bar Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#123F2A] dark:text-emerald-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formulations, ingredients..."
              className="w-full bg-white dark:bg-[#0E281C] text-xs text-[#123F2A] dark:text-white placeholder-[#6B756E] dark:placeholder-slate-400 pl-10 pr-8 py-2.5 rounded-xl border border-[#E5D8B5] dark:border-white/10 focus:outline-none focus:border-[#C9A84E] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-[#123F2A] dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Controls: In-Stock Toggle & Sort By */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* In-Stock Filter */}
            <label className="inline-flex items-center gap-2 bg-white dark:bg-[#0E281C] px-3.5 py-2 rounded-xl border border-[#E5D8B5] dark:border-white/10 text-xs font-bold text-[#123F2A] dark:text-slate-200 cursor-pointer hover:border-[#C9A84E] transition-colors select-none shadow-xs">
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
            <div className="flex items-center gap-2 bg-white dark:bg-[#0E281C] px-3.5 py-2 rounded-xl border border-[#E5D8B5] dark:border-white/10 text-xs font-bold text-[#123F2A] dark:text-slate-200 shadow-xs">
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
                className="p-2 bg-white dark:bg-[#0E281C] hover:bg-slate-100 dark:hover:bg-emerald-900 text-[#123F2A] dark:text-slate-300 rounded-xl border border-[#E5D8B5] dark:border-white/10 text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                title="Reset Filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* EMPTY STATE SAFEGUARD */}
        {categoryProducts.length === 0 ? (
          <div className="bg-[#FAF8F2] dark:bg-[#123F2B]/60 border-2 border-dashed border-[#E5D8B5] dark:border-white/15 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto my-8">
            <div className="w-16 h-16 bg-white dark:bg-[#0E281C] text-[#C9A84E] rounded-full flex items-center justify-center mx-auto border border-[#E5D8B5] dark:border-white/10 shadow-md">
              <PackageX className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif-luxury font-bold text-[#123F2A] dark:text-slate-100">
              No Formulations Found
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
          /* Responsive Product Cards Grid - 2 columns on mobile, 3 on md, 4 on lg */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {categoryProducts.map((product) => {
              const inWishlist = isInWishlist(product.id);
              const discountPct = product.originalPriceINR
                ? Math.round(((product.originalPriceINR - product.priceINR) / product.originalPriceINR) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  onClick={() => {
                    window.history.pushState({}, '', getProductUrl(product));
                    window.dispatchEvent(new PopStateEvent('popstate'));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white dark:bg-[#123F2B] text-slate-900 dark:text-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#E5D8B5]/80 dark:border-white/10 shadow-xs sm:shadow-sm hover:shadow-xl active:scale-[0.99] transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  {/* Product Image Container */}
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-50 dark:bg-[#0A1A12]">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      width={320}
                      height={320}
                      className="w-full h-full object-contain p-1 sm:p-2 group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badges */}
                    <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex flex-col gap-1 z-10 pointer-events-none">
                      {discountPct > 0 ? (
                        <span className="bg-[#B8891E] text-white text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">
                          {discountPct}% OFF
                        </span>
                      ) : (
                        <span className="hidden sm:inline-block bg-[#123F2A] text-[#C9A84E] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border border-[#C9A84E]/30 shadow-xs">
                          {product.category}
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
                      className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-10 h-10 rounded-full transition-all duration-200 shadow-md flex items-center justify-center z-10 cursor-pointer active:scale-95 ${
                        inWishlist
                          ? 'bg-[#0B4A35] text-[var(--brand-gold,#C9A84E)] border border-[var(--brand-gold,#C9A84E)]/60 shadow-[0_2px_8px_rgba(11,74,53,0.35)]'
                          : 'bg-white/95 text-[#0B4A35] border border-[rgba(201,168,76,0.35)] hover:border-[#0B4A35]/50 hover:bg-white hover:text-[#0B4A35] hover:scale-105'
                      }`}
                      aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Wishlist ${product.name}`}
                      title={inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart className={`w-4 h-4 transition-transform ${inWishlist ? 'fill-current scale-105' : ''}`} />
                    </button>

                    {/* Quick View Indicator Overlay (Desktop Only) */}
                    <div className="hidden md:flex absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center p-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openQuickView(product);
                        }}
                        className="bg-white/95 hover:bg-white text-slate-900 font-bold text-xs px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-[#123F2A]" />
                        <span>Quick View</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-2 sm:p-4 flex-1 flex flex-col justify-between space-y-1.5 sm:space-y-3">
                    <div>
                      {/* Rating & Reviews */}
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#5F6B63] dark:text-slate-300 font-sans mb-1">
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current text-amber-500 shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-100">{product.rating}</span>
                        <span className="text-slate-400">({product.reviewsCount})</span>
                      </div>

                      {/* Product Name */}
                      <h3 className="font-serif-luxury font-bold text-xs sm:text-sm md:text-base text-slate-900 dark:text-white line-clamp-2 hover:text-[#123F2A] dark:hover:text-[#C9A84E] transition-colors leading-tight min-h-[2rem] sm:min-h-[2.5rem]">
                        {product.name}
                      </h3>
                    </div>

                    {/* Pricing & Actions */}
                    <div className="pt-1.5 sm:pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-1 sm:block sm:space-y-3">
                      {/* Prices */}
                      <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
                        <span className="text-xs sm:text-base font-extrabold text-[#123F2A] dark:text-[#E4C86A] font-sans">
                          {formatPrice(product.priceINR)}
                        </span>
                        {product.originalPriceINR && product.originalPriceINR > product.priceINR && (
                          <span className="text-[10px] sm:text-xs text-slate-400 line-through font-sans">
                            {formatPrice(product.originalPriceINR)}
                          </span>
                        )}
                        {discountPct > 0 && (
                          <span className="hidden sm:inline text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            {discountPct}% OFF
                          </span>
                        )}
                      </div>

                      {/* Mobile: Small Quick Add Cart Icon */}
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`sm:hidden w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer border border-[#E5D8B5]/40 shrink-0 ${
                          addedProductId === product.id
                            ? 'bg-emerald-700 text-white'
                            : 'bg-[#123F2A] text-white hover:bg-[#B8891E] active:scale-90'
                        }`}
                        aria-label={`Add ${product.name} to cart`}
                      >
                        {addedProductId === product.id ? (
                          <Check className="w-3.5 h-3.5 text-[var(--brand-gold,#C9A84E)] stroke-[3]" />
                        ) : (
                          <ShoppingBag className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Desktop: Full Action Buttons */}
                      <div className="hidden sm:grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(e, product)}
                          className={`w-full py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs active:scale-95 border ${
                            addedProductId === product.id
                              ? 'bg-emerald-700 text-white border-emerald-600'
                              : 'bg-[#FAF8F2] dark:bg-[#0E281C] hover:bg-[#E5D8B5] text-[#123F2A] dark:text-[#E4C86A] border-[#E5D8B5] dark:border-white/10'
                          }`}
                        >
                          {addedProductId === product.id ? (
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
                        <button
                          type="button"
                          onClick={(e) => handleBuyNow(e, product)}
                          className="w-full py-2 px-2 bg-[#123F2A] hover:bg-[#0B2F20] text-white rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer transition-colors shadow-xs active:scale-95"
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

      {/* 3. REVIEWS SECTION */}
      <section className="py-12 bg-[#FAF8F2] dark:bg-white/5 border-t border-b border-[#E5D8B5] dark:border-white/10 px-4 sm:px-8">
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
            {reviews.map((rev, i) => (
              <div key={i} className="bg-white dark:bg-[#123F2B] p-6 rounded-2xl border border-[#E5D8B5] dark:border-white/10 space-y-3 shadow-xs">
                <div className="flex items-center text-amber-500 gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#37463D] dark:text-slate-200 italic leading-relaxed">
                  "{rev.text}"
                </p>
                <p className="text-xs font-bold text-[#123F2A] dark:text-[var(--brand-gold)]">
                  — {rev.name}, {rev.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FAQ SECTION */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#C9A84E]" />
          <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#123F2A] dark:text-slate-100">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#FAF8F2] dark:bg-white/5 border border-[#E5D8B5] dark:border-white/10 rounded-2xl overflow-hidden transition-colors shadow-xs"
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
                  <div className="px-4 pb-5 sm:px-5 text-xs text-[#37463D] dark:text-slate-300 leading-relaxed font-sans border-t border-[#E5D8B5] dark:border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Mobile Context-Aware Sticky Sort/Filter Bottom Bar */}
      <MobileCategorySortFilterBar
        sortBy={sortBy}
        onSelectSort={(newSort) => setSortBy(newSort)}
        filters={filters}
        onApplyFilters={(newFilters) => {
          setFilters(newFilters);
          setInStockOnly(newFilters.inStockOnly);
        }}
        onClearFilters={() => {
          setFilters({
            subcategory: '',
            concern: '',
            priceRange: 'all',
            inStockOnly: false,
            minRating: 0,
          });
          setInStockOnly(false);
          setSortBy('bestseller');
        }}
        availableSubcategories={availableSubcategories}
        availableConcerns={availableConcerns}
        totalResultsCount={categoryProducts.length}
      />
    </div>
  );
};
