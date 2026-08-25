import React, { useMemo } from 'react';
import { Layers, ChevronRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useSmoothAutoScroll } from '../../hooks/useSmoothAutoScroll';

interface MobileCategoryCarouselProps {
  onNavigateCategory: (categoryNameOrRoute: string) => void;
  onNavigateBack?: (destinationPath: string) => void;
}

interface ActiveCategoryItem {
  id: string;
  name: string;
  route: string;
  categoryFilter: string;
  image: string;
  shortDescription?: string;
}

// Fallback baseline categories
const FALLBACK_CATEGORIES: ActiveCategoryItem[] = [
  {
    id: 'hair-care',
    name: 'Hair Care',
    route: '/hair-care',
    categoryFilter: 'Hair Care',
    image: '/images/hakkiveda_108_oil_gold.jpg',
    shortDescription: 'Regrowth & Anti-Hairfall Oils',
  },
  {
    id: 'skin-care',
    name: 'Skin Care',
    route: '/skin-care',
    categoryFilter: 'Skin Care',
    image: '/images/hakkiveda_baldness_powder.jpg',
    shortDescription: 'Forest Detox Lepas & Pastes',
  },
  {
    id: 'tribal-wellness',
    name: 'Tribal Wellness',
    route: '/tribal-wellness',
    categoryFilter: 'Tribal Wellness',
    image: '/images/hakkiveda_oil_couple_herbs.jpg',
    shortDescription: 'Holistic 90-Day Regimens',
  },
];

export const MobileCategoryCarousel: React.FC<MobileCategoryCarouselProps> = ({
  onNavigateCategory,
  onNavigateBack,
}) => {
  const { categoryPages, categories, playSound } = useStore();

  // Helper to ensure fresh image URLs with cache-busting if needed
  const getFreshImageUrl = (url: string) => {
    if (!url) return '/images/hakkiveda_108_oil_gold.jpg';
    if (url.startsWith('data:') || url.startsWith('blob:')) return url;
    const baseUrl = url.split('?')[0];
    const existingParam = url.match(/[?&]v=(\d+)/);
    const version = existingParam ? existingParam[1] : '1';
    return `${baseUrl}?v=${version}`;
  };

  // Derive dynamic active categories from Admin Category Pages and Catalog Categories
  const uniqueActiveCategories: ActiveCategoryItem[] = useMemo(() => {
    const list: ActiveCategoryItem[] = [];
    const seenIds = new Set<string>();

    // 1. Check enabled category pages from Admin Panel
    if (categoryPages && categoryPages.length > 0) {
      categoryPages
        .filter((cp) => cp.enabled !== false)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        .forEach((cp) => {
          const catId = cp.id || cp.slug;
          const route = `/${cp.slug || cp.id}`;
          seenIds.add(catId);
          list.push({
            id: catId,
            name: cp.categoryName || cp.title,
            route,
            categoryFilter: cp.categoryName || cp.title,
            image: getFreshImageUrl(cp.cardImage || cp.desktopHeroImage || cp.mobileHeroImage),
            shortDescription: cp.shortDescription || cp.title,
          });
        });
    }

    // 2. Check active categories from Store Catalog
    if (categories && categories.length > 0) {
      categories
        .filter((c) => c.status === 'ACTIVE' || (!c.status && !seenIds.has(c.slug || c.id)))
        .forEach((c) => {
          const catId = c.slug || c.id;
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
              shortDescription: c.description || c.name,
            });
          }
        });
    }

    // 3. Fallback if empty
    if (list.length === 0) {
      return FALLBACK_CATEGORIES;
    }

    return list;
  }, [categoryPages, categories]);

  const itemCount = uniqueActiveCategories.length;

  // Determine repeat count: 1 item -> 1 copy (no loop), 2 items -> 4 copies, >= 3 items -> 3 copies
  const repeatCount = useMemo(() => {
    if (itemCount <= 1) return 1;
    if (itemCount === 2) return 4;
    return 3;
  }, [itemCount]);

  const displayItems = useMemo(() => {
    if (itemCount <= 1) return uniqueActiveCategories;
    const duplicated: ActiveCategoryItem[] = [];
    for (let i = 0; i < repeatCount; i++) {
      duplicated.push(...uniqueActiveCategories);
    }
    return duplicated;
  }, [uniqueActiveCategories, itemCount, repeatCount]);

  const {
    containerRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleScroll,
    isDragging,
  } = useSmoothAutoScroll({
    itemCount,
    repeatCount,
    pixelsPerSecond: 32,
    pauseDuration: 2500,
  });

  const handleCategoryClick = (cat: ActiveCategoryItem) => {
    if (isDragging()) return;
    playSound('nav_click');
    if (
      onNavigateBack &&
      (cat.route === '/hair-care' || cat.route === '/skin-care' || cat.route === '/tribal-wellness')
    ) {
      onNavigateBack(cat.route);
    } else {
      onNavigateCategory(cat.categoryFilter || cat.name);
    }
  };

  if (itemCount === 0) return null;

  return (
    <section className="py-5 border-t border-[#E7E1D5] dark:border-white/10 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
          <h3 className="text-xs font-sans uppercase tracking-[0.2em] font-extrabold text-[#123F2A] dark:text-[var(--brand-gold)]">
            Shop by Category
          </h3>
        </div>
        <span className="text-[10px] text-[#5F6B63] dark:text-slate-400 font-sans">
          {itemCount} Collections
        </span>
      </div>

      {/* Swipeable & Continuous Auto-scrolling Category Carousel */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto scrollbar-none no-scrollbar px-4 pb-2 select-none -mx-0"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {displayItems.map((cat, idx) => (
          <div
            key={`cat-${cat.id}-${idx}`}
            onClick={() => handleCategoryClick(cat)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCategoryClick(cat);
              }
            }}
            className="w-[140px] sm:w-[160px] shrink-0 rounded-xl overflow-hidden border border-[#E7E1D5] dark:border-white/15 bg-white dark:bg-[#123F2B] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col group text-left"
          >
            {/* Category Image Box with Gradient Overlay */}
            <div className="relative h-24 sm:h-28 w-full bg-slate-100 dark:bg-black/30 overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              {/* Category Name Overlay */}
              <div className="absolute bottom-2 left-2 right-2 z-10">
                <span className="text-white font-serif-luxury font-bold text-xs sm:text-sm line-clamp-1 drop-shadow-md">
                  {cat.name}
                </span>
              </div>
            </div>

            {/* Category Subtext & Action */}
            <div className="p-2 flex items-center justify-between gap-1 bg-white dark:bg-[#123F2B]">
              <span className="text-[10px] text-[#5F6B63] dark:text-slate-300 font-sans truncate font-medium">
                {cat.shortDescription || 'Explore Products'}
              </span>
              <ChevronRight className="w-3 h-3 text-[var(--brand-gold)] shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
