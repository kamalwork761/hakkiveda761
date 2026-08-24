import React, { useEffect, useState } from 'react';
import { History, Trash2 } from 'lucide-react';
import { Product } from '../../types/store';
import { useStore } from '../../context/StoreContext';
import { getRecentlyViewedIds, clearRecentlyViewed } from '../../utils/recentlyViewed';
import { MobileProductCard } from './MobileProductCard';

interface MobileRecentlyViewedSectionProps {
  currentProduct: Product;
  onNavigateProduct: (product: Product) => void;
}

export const MobileRecentlyViewedSection: React.FC<MobileRecentlyViewedSectionProps> = ({
  currentProduct,
  onNavigateProduct,
}) => {
  const { products } = useStore();
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  const loadRecentProducts = () => {
    const ids = getRecentlyViewedIds(currentProduct.id);
    if (ids.length === 0) {
      setRecentProducts([]);
      return;
    }

    // Map stored IDs to actual Product objects while preserving order (newest first)
    const productMap = new Map<string, Product>();
    products.forEach((p) => productMap.set(p.id, p));

    const matched: Product[] = [];
    for (const id of ids) {
      const p = productMap.get(id);
      if (p && p.id !== currentProduct.id) {
        matched.push(p);
      }
    }

    setRecentProducts(matched);
  };

  useEffect(() => {
    loadRecentProducts();

    // Listen to custom updates from other components / tabs
    const handleStorageUpdate = () => {
      loadRecentProducts();
    };

    window.addEventListener('hakki:recently_viewed_updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('hakki:recently_viewed_updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [currentProduct.id, products]);

  // If visitor hasn't viewed any other products yet, hide the section gracefully
  if (recentProducts.length === 0) return null;

  return (
    <section className="py-5 border-t border-[#E7E1D5] dark:border-white/10 pb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
          <h3 className="text-xs font-sans uppercase tracking-[0.2em] font-extrabold text-[#123F2A] dark:text-[var(--brand-gold)]">
            Recently Viewed
          </h3>
        </div>
        <button
          type="button"
          onClick={() => {
            clearRecentlyViewed();
            setRecentProducts([]);
          }}
          className="text-[10px] text-slate-400 hover:text-rose-500 font-sans flex items-center gap-1 transition-colors"
          title="Clear history"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear</span>
        </button>
      </div>

      {/* Swipeable Horizontal Product Cards Carousel */}
      <div className="flex gap-3 overflow-x-auto scrollbar-none no-scrollbar px-4 pb-2 -mx-0">
        {recentProducts.map((p) => (
          <MobileProductCard
            key={`recent-${p.id}`}
            product={p}
            onNavigateProduct={onNavigateProduct}
          />
        ))}
      </div>
    </section>
  );
};
