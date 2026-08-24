import React, { useMemo } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { Product } from '../../types/store';
import { useStore } from '../../context/StoreContext';
import { MobileProductCard } from './MobileProductCard';
import { useSmoothAutoScroll } from '../../hooks/useSmoothAutoScroll';

interface MobileExploreTheseSectionProps {
  currentProduct: Product;
  onNavigateProduct: (product: Product) => void;
  onViewAll?: () => void;
}

export const MobileExploreTheseSection: React.FC<MobileExploreTheseSectionProps> = ({
  currentProduct,
  onNavigateProduct,
  onViewAll,
}) => {
  const { products } = useStore();

  // Smart Recommendation Algorithm:
  // 1. Manual related products if configured
  // 2. Same subcategory or concern matching
  // 3. Same category
  // 4. Bestsellers fallback
  const uniqueRecommendedProducts = useMemo(() => {
    // Check manual override first
    if (
      currentProduct.relatedProductsMode === 'manual' &&
      currentProduct.relatedProductIds &&
      currentProduct.relatedProductIds.length > 0
    ) {
      const manual = currentProduct.relatedProductIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p && p.id !== currentProduct.id));
      if (manual.length > 0) return manual;
    }

    const otherProducts = products.filter((p) => p.id !== currentProduct.id);

    // Filter by same subcategory / primary category
    const sameSubcategory = otherProducts.filter(
      (p) =>
        currentProduct.subcategory &&
        p.subcategory &&
        p.subcategory.toLowerCase() === currentProduct.subcategory.toLowerCase()
    );

    // Filter by same category
    const sameCategory = otherProducts.filter(
      (p) => p.category === currentProduct.category && !sameSubcategory.some((s) => s.id === p.id)
    );

    // Fallback: other top-rated / bestsellers
    const bestsellers = otherProducts.filter(
      (p) =>
        (p.isBestseller || p.featuredBestSeller || p.rating >= 4.7) &&
        !sameSubcategory.some((s) => s.id === p.id) &&
        !sameCategory.some((c) => c.id === p.id)
    );

    const pool = [...sameSubcategory, ...sameCategory, ...bestsellers, ...otherProducts];

    // Deduplicate and return up to 8 recommended products
    const seen = new Set<string>();
    const result: Product[] = [];
    for (const item of pool) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        result.push(item);
        if (result.length >= 8) break;
      }
    }

    return result;
  }, [currentProduct, products]);

  const itemCount = uniqueRecommendedProducts.length;

  // Determine repeat count: 1 item -> 1 copy (no loop), 2 items -> 4 copies, >= 3 items -> 3 copies
  const repeatCount = useMemo(() => {
    if (itemCount <= 1) return 1;
    if (itemCount === 2) return 4;
    return 3;
  }, [itemCount]);

  const displayProducts = useMemo(() => {
    if (itemCount <= 1) return uniqueRecommendedProducts;
    const duplicated: Product[] = [];
    for (let i = 0; i < repeatCount; i++) {
      duplicated.push(...uniqueRecommendedProducts);
    }
    return duplicated;
  }, [uniqueRecommendedProducts, itemCount, repeatCount]);

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
    speed: 0.55,
    pauseDuration: 2500,
  });

  if (itemCount === 0) return null;

  return (
    <section className="py-5 border-t border-[#E7E1D5] dark:border-white/10 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
          <h3 className="text-xs font-sans uppercase tracking-[0.2em] font-extrabold text-[#123F2A] dark:text-[var(--brand-gold)]">
            Explore These
          </h3>
        </div>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-[11px] font-sans font-bold text-[var(--brand-gold)] hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Swipeable & Continuous Auto-scrolling Product Cards Carousel */}
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
        {displayProducts.map((p, idx) => (
          <MobileProductCard
            key={`explore-${p.id}-${idx}`}
            product={p}
            onNavigateProduct={onNavigateProduct}
            isDragging={isDragging}
          />
        ))}
      </div>
    </section>
  );
};
