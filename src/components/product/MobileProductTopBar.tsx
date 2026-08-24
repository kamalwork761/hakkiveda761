import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Search,
  Heart,
  ShoppingBag,
  X,
  Star,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/store';
import { getProductUrl } from '../../utils/productUtils';

interface MobileProductTopBarProps {
  product: Product;
  onBack: () => void;
  onNavigateProduct: (product: Product) => void;
}

export const MobileProductTopBar: React.FC<MobileProductTopBarProps> = ({
  product,
  onBack,
  onNavigateProduct,
}) => {
  const {
    products,
    cartItemsCount,
    isInWishlist,
    toggleWishlist,
    setIsCartOpen,
    playSound,
    formatPrice,
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isWishlisted = isInWishlist(product.id);

  // Focus input when search overlay is opened
  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery('');
    }
  }, [isSearchOpen]);

  // Close search overlay on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Filtered products for live search
  const searchResults = searchQuery.trim()
    ? products.filter((p) => {
        const q = searchQuery.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
        );
      })
    : [];

  const handleWishlistToggle = () => {
    playSound('wishlist_toggle');
    toggleWishlist(product.id);
  };

  const handleCartClick = () => {
    playSound('menu_toggle');
    setIsCartOpen(true);
  };

  const handleSelectSearchResult = (prod: Product) => {
    playSound('nav_click');
    setIsSearchOpen(false);
    setSearchQuery('');
    onNavigateProduct(prod);
  };

  return (
    <>
      {/* Mobile Sticky Top Utility Bar */}
      <div
        id="mobile-product-sticky-top-bar"
        className="md:hidden sticky top-0 z-40 w-full bg-[#FAF8F2]/95 dark:bg-[#0B1D13]/95 backdrop-blur-md border-b border-[#E7E1D5] dark:border-white/10 pt-[env(safe-area-inset-top,0px)] shadow-xs transition-colors duration-200"
      >
        <div className="flex items-center justify-between px-3 h-13 min-h-[48px] max-w-lg mx-auto">
          {/* LEFT: Back Arrow */}
          <button
            type="button"
            id="mobile-pdp-back-btn"
            onClick={onBack}
            className="w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#123F2A] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
            aria-label="Back to previous screen"
          >
            <ArrowLeft className="w-5 h-5 text-[#123F2A] dark:text-[var(--brand-gold,#D4AF37)]" />
          </button>

          {/* CENTER: Mini Product Name (Shown subtly) */}
          <div className="flex-1 px-2 text-center min-w-0 pointer-events-none">
            <span className="text-xs font-bold font-serif-luxury text-[#123F2A] dark:text-white truncate block">
              {product.name}
            </span>
          </div>

          {/* RIGHT: Search + Wishlist + Cart Icons */}
          <div className="flex items-center gap-1">
            {/* Search Icon */}
            <button
              type="button"
              id="mobile-pdp-search-btn"
              onClick={() => {
                playSound('search');
                setIsSearchOpen(true);
              }}
              className="w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#123F2A] dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
              aria-label="Search herbal formulations"
            >
              <Search className="w-4.5 h-4.5 text-[#123F2A] dark:text-slate-200" />
            </button>

            {/* Wishlist Icon */}
            <button
              type="button"
              id="mobile-pdp-wishlist-btn"
              onClick={handleWishlistToggle}
              className="w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#123F2A] dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 active:scale-90 transition-all cursor-pointer relative"
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={`w-4.5 h-4.5 transition-colors ${
                  isWishlisted
                    ? 'fill-rose-500 text-rose-500 scale-110'
                    : 'text-[#123F2A] dark:text-slate-200'
                }`}
              />
            </button>

            {/* Cart Icon with Counter */}
            <button
              type="button"
              id="mobile-pdp-cart-btn"
              onClick={handleCartClick}
              className="w-10 h-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#123F2A] dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 active:scale-90 transition-all cursor-pointer relative"
              aria-label={`Open Cart (${cartItemsCount} items)`}
            >
              <ShoppingBag className="w-4.5 h-4.5 text-[#123F2A] dark:text-[var(--brand-gold,#D4AF37)]" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#123F2A] dark:bg-[var(--brand-gold,#D4AF37)] text-[var(--brand-gold,#D4AF37)] dark:text-[#0B2F20] text-[9px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center border border-white dark:border-[#0B1D13] shadow-xs">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Global Search Overlay (Opens when Search icon is tapped) */}
      {isSearchOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col animate-in fade-in duration-200 pt-[env(safe-area-inset-top,0px)]"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-[#FAF8F2] dark:bg-[#0B2618] border-b border-[#E7E1D5] dark:border-white/10 p-3 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--brand-gold,#D4AF37)]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search oils, herbs, formulations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-black/40 border border-[#E7E1D5] dark:border-white/20 rounded-xl pl-9 pr-8 py-2.5 text-xs text-[#123F2A] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[var(--brand-gold,#D4AF37)] shadow-inner font-sans"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="px-3 py-2 text-xs font-bold text-[#123F2A] dark:text-slate-200 hover:text-[var(--brand-gold)] cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {/* Search Results Dropdown */}
            {searchQuery.trim() && (
              <div className="mt-3 max-h-[65vh] overflow-y-auto divide-y divide-black/5 dark:divide-white/10 rounded-xl bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/10 shadow-lg">
                {searchResults.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                    No herbal formulations found matching &quot;{searchQuery}&quot;.
                  </div>
                ) : (
                  searchResults.map((res) => (
                    <div
                      key={res.id}
                      onClick={() => handleSelectSearchResult(res)}
                      className="p-3 flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 cursor-pointer transition-colors"
                    >
                      <img
                        src={res.image}
                        alt={res.name}
                        className="w-11 h-11 rounded-lg object-contain bg-[#FAF8F2] dark:bg-black/30 p-1 border border-black/5 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-[#123F2A] dark:text-white truncate font-serif-luxury">
                            {res.name}
                          </h4>
                          <span className="text-xs font-extrabold text-[#123F2A] dark:text-[var(--brand-gold,#D4AF37)] shrink-0">
                            {formatPrice(res.priceINR)}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {res.subtitle || res.category}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 text-amber-500 fill-current" />
                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                            {res.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
