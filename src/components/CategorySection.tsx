import React, { useMemo, useRef, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useSmoothAutoScroll } from '../hooks/useSmoothAutoScroll';

interface CategorySectionProps {
  selectedCategory?: string;
  onSelectCategory?: (categoryName: string) => void;
}

interface CategoryCardItem {
  id: string;
  name: string;
  route: string;
  categoryFilter: string;
  image: string;
  description: string;
  ctaText: string;
}

const HOMEPAGE_CATEGORIES: CategoryCardItem[] = [
  {
    id: 'hair-care',
    name: 'Hair Care',
    route: '/hair-care',
    categoryFilter: 'Hair Oils & Elixirs',
    image: '/images/hakkiveda_108_oil_gold.jpg',
    description: '100% authentic Adivasi herbal hair oils, follicle growth drops & root activation serums.',
    ctaText: 'Shop Hair Care',
  },
  {
    id: 'skin-care',
    name: 'Skin Care',
    route: '/skin-care',
    categoryFilter: 'Tribal Masks & Lepas',
    image: '/images/hakkiveda_baldness_powder.jpg',
    description: 'Traditional forest botanical muds, skin detox pastes and restorative herbal lepas.',
    ctaText: 'Shop Skin Care',
  },
  {
    id: 'tribal-wellness',
    name: 'Tribal Wellness',
    route: '/tribal-wellness',
    categoryFilter: 'Wellness Combos',
    image: '/images/hakkiveda_oil_couple_herbs.jpg',
    description: 'Holistic 90-day regrowth kits, wellness combos, and ancestral herbal therapies.',
    ctaText: 'Shop Tribal Wellness',
  },
];

export const CategorySection: React.FC<CategorySectionProps> = ({ onSelectCategory }) => {
  const { categories, categoryPages, playSound } = useStore();

  // Helper to append a timestamp cache-buster to prevent browser stale image caching
  const getFreshImageUrl = (url?: string) => {
    if (!url) return '/images/hakkiveda_108_oil_gold.jpg';
    if (url.startsWith('data:') || url.startsWith('blob:')) return url;
    const baseUrl = url.split('?')[0];
    const existingParam = url.match(/[?&]v=(\d+)/);
    const version = existingParam ? existingParam[1] : '1';
    return `${baseUrl}?v=${version}`;
  };

  // Derive dynamic active categories from Admin Category Pages and Catalog Categories
  const activeCategories: CategoryCardItem[] = useMemo(() => {
    const list: CategoryCardItem[] = [];
    const seenIds = new Set<string>();

    // 1. Check enabled categoryPages from Admin Panel
    if (categoryPages && categoryPages.length > 0) {
      categoryPages
        .filter((cp) => cp.enabled !== false)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        .forEach((cp) => {
          const catId = cp.id || cp.slug;
          seenIds.add(catId.toLowerCase());
          const route = `/${cp.slug || cp.id}`;
          list.push({
            id: catId,
            name: cp.categoryName || cp.title,
            route,
            categoryFilter: cp.categoryName || cp.title,
            image: getFreshImageUrl(cp.cardImage || cp.desktopHeroImage || cp.mobileHeroImage),
            description:
              cp.shortDescription ||
              cp.description ||
              'Authentic botanical formulations hand-prepared by the Hakki-Pikki tribe.',
            ctaText: cp.cardCtaText || `Shop ${cp.categoryName || cp.title}`,
          });
        });
    }

    // 2. Check active categories from Store Catalog (if any exist not yet represented)
    if (categories && categories.length > 0) {
      categories
        .filter((c) => (c.status === 'ACTIVE' || !c.status) && !seenIds.has((c.slug || c.id || c.name).toLowerCase()))
        .forEach((c) => {
          const catId = (c.slug || c.id || c.name).toLowerCase();
          if (!seenIds.has(catId)) {
            seenIds.add(catId);
            const route =
              catId === 'hair-care' || catId === 'skin-care' || catId === 'tribal-wellness'
                ? `/${catId}`
                : `/?category=${encodeURIComponent(c.name)}`;
            list.push({
              id: catId,
              name: c.name,
              route,
              categoryFilter: c.name,
              image: getFreshImageUrl(c.image),
              description: c.description || 'Ancestral herbal formulations prepared by the Hakki-Pikki tribe.',
              ctaText: `Shop ${c.name}`,
            });
          }
        });
    }

    // 3. Fallback if empty
    if (list.length === 0) {
      return HOMEPAGE_CATEGORIES;
    }

    return list;
  }, [categoryPages, categories]);

  const itemCount = activeCategories.length;

  // Repeat count for mobile marquee loop
  const repeatCount = useMemo(() => {
    if (itemCount <= 1) return 1;
    if (itemCount === 2) return 4;
    return 3;
  }, [itemCount]);

  const mobileDisplayItems = useMemo(() => {
    if (itemCount <= 1) return activeCategories;
    const duplicated: CategoryCardItem[] = [];
    for (let i = 0; i < repeatCount; i++) {
      duplicated.push(...activeCategories);
    }
    return duplicated;
  }, [activeCategories, itemCount, repeatCount]);

  // Mobile Smooth Auto Scroll Marquee
  const {
    containerRef: mobileContainerRef,
    handleTouchStart: handleMobileTouchStart,
    handleTouchMove: handleMobileTouchMove,
    handleTouchEnd: handleMobileTouchEnd,
    handleScroll: handleMobileScroll,
    isDragging: isMobileDragging,
  } = useSmoothAutoScroll({
    itemCount,
    repeatCount,
    pixelsPerSecond: 30,
    pauseDuration: 2500,
  });

  const handleCategoryClick = (route: string, categoryFilter: string) => {
    if (isMobileDragging()) return;
    playSound('nav_click');
    if (onSelectCategory) {
      onSelectCategory(categoryFilter);
    }
    // Update route history
    window.history.pushState({}, '', route);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <section
      id="categories"
      className="py-8 sm:py-16 bg-[#FAF8F2] dark:bg-[var(--brand-primary-dark,#0B1D13)] border-t border-b border-[var(--color-border,#E7E1D5)] dark:border-white/10 relative overflow-hidden scroll-mt-12 text-[#123F2A] dark:text-white"
    >
      <div id="collections" className="absolute -top-12 left-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-[var(--color-border,#E7E1D5)] dark:border-white/10 gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--brand-gold,#C9A84E)]" />
              <span className="text-[var(--brand-gold,#C9A84E)] font-sans text-xs uppercase tracking-[0.25em] font-bold">
                Botanical Catalog
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-[#123F2A] dark:text-slate-100">
              Shop by Category
            </h2>
          </div>

          {/* Desktop Only: View All Formulations Link */}
          <div className="hidden md:flex items-center gap-3 self-end">
            <button
              type="button"
              onClick={() => {
                playSound('nav_click');
                if (onSelectCategory) onSelectCategory('ALL');
                const el = document.getElementById('products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-sans uppercase tracking-widest font-bold text-[var(--brand-gold,#C9A84E)] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>View All Formulations ({categories.reduce((a, c) => a + c.itemCount, 0)})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 1. MOBILE AUTO-SCROLLING CAROUSEL (md:hidden) */}
        <div
          ref={mobileContainerRef}
          onTouchStart={handleMobileTouchStart}
          onTouchMove={handleMobileTouchMove}
          onTouchEnd={handleMobileTouchEnd}
          onMouseDown={handleMobileTouchStart}
          onMouseMove={handleMobileTouchMove}
          onMouseUp={handleMobileTouchEnd}
          onMouseLeave={handleMobileTouchEnd}
          onScroll={handleMobileScroll}
          className="flex md:hidden gap-3.5 sm:gap-4 overflow-x-auto scrollbar-none no-scrollbar px-1 py-2 select-none -mx-2"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {mobileDisplayItems.map((cat, idx) => (
            <div
              key={`mob-cat-${cat.id}-${idx}`}
              onClick={() => handleCategoryClick(cat.route, cat.categoryFilter)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCategoryClick(cat.route, cat.categoryFilter);
                }
              }}
              className="w-[82vw] max-w-[340px] shrink-0 rounded-2xl overflow-hidden border border-[#E7E1D5] dark:border-white/20 bg-white text-slate-900 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col group text-left focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold,#C9A84E)]"
            >
              {/* Image Box */}
              <div className="aspect-[4/3] w-full overflow-hidden relative bg-slate-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-85 group-hover:opacity-65 transition-opacity" />

                {/* Category Title Overlay Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-[#123F2A]/90 text-[var(--brand-gold,#C9A84E)] text-[10px] font-extrabold font-sans px-2.5 py-0.5 rounded-full border border-[var(--brand-gold,#C9A84E)]/40 shadow-md backdrop-blur-md">
                    Botanical Category
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 xs:p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
                <div>
                  <h3 className="text-lg xs:text-xl font-serif-luxury font-bold text-[#123F2A] group-hover:text-[#B8891E] transition-colors flex items-center justify-between">
                    <span>{cat.name}</span>
                    <ArrowRight className="w-4 h-4 text-[#123F2A] group-hover:text-[#B8891E] -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
                  </h3>
                  <p className="text-xs leading-relaxed text-[#37463D] mt-1.5 line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="pt-1">
                  <div className="w-full py-3 px-4 min-h-[48px] bg-[#123F2A] group-hover:bg-[#0B2F20] text-white rounded-xl text-xs font-bold font-sans uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98">
                    <span>{cat.ctaText}</span>
                    <ArrowRight className="w-4 h-4 text-[var(--brand-gold,#C9A84E)]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 2. DESKTOP GRID (hidden md:grid) */}
        <div className="hidden md:grid md:grid-cols-3 gap-5 sm:gap-6 py-2">
          {activeCategories.map((cat) => (
            <div
              key={`desk-cat-${cat.id}`}
              onClick={() => handleCategoryClick(cat.route, cat.categoryFilter)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCategoryClick(cat.route, cat.categoryFilter);
                }
              }}
              className="w-full flex-shrink-0 group relative rounded-2xl overflow-hidden border border-[#E7E1D5] dark:border-white/20 bg-white text-slate-900 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold,#C9A84E)]"
            >
              {/* Image Box */}
              <div className="h-52 sm:h-60 overflow-hidden relative w-full bg-slate-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Category Title Overlay Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-[#123F2A]/90 text-[var(--brand-gold,#C9A84E)] text-[11px] font-extrabold font-sans px-3 py-1 rounded-full border border-[var(--brand-gold,#C9A84E)]/40 shadow-lg backdrop-blur-md">
                    Botanical Category
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4 bg-white">
                <div>
                  <h3 className="text-xl font-serif-luxury font-bold text-[#123F2A] group-hover:text-[#B8891E] transition-colors flex items-center justify-between">
                    <span>{cat.name}</span>
                    <ArrowRight className="w-5 h-5 text-[#123F2A] group-hover:text-[#B8891E] -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
                  </h3>
                  <p className="text-xs leading-relaxed text-[#37463D] mt-2 line-clamp-3">
                    {cat.description}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <div className="w-full py-2.5 px-4 bg-[#123F2A] hover:bg-[#0B2F20] text-white rounded-xl text-xs font-bold font-sans uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md">
                    <span>{cat.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

