import React, { useRef, useState, useMemo } from 'react';
import { Star, ShoppingBag, Heart, Eye, ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/store';
import { getProductUrl } from '../utils/productUtils';
import { useSmoothAutoScroll } from '../hooks/useSmoothAutoScroll';

export const BestSellersCarousel: React.FC = () => {
  const { products, formatPrice, addToCart, toggleWishlist, isInWishlist, openQuickView, playSound } = useStore();
  const desktopScrollContainerRef = useRef<HTMLDivElement>(null);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Desktop Mouse dragging state
  const [isDesktopDragging, setIsDesktopDragging] = useState(false);
  const [desktopStartX, setDesktopStartX] = useState(0);
  const [desktopScrollLeft, setDesktopScrollLeft] = useState(0);

  // Filter products for Best Sellers dynamically
  const bestSellers = useMemo(() => {
    const list = products.filter(
      (p) => p.isBestseller || p.featuredBestSeller || p.rating >= 4.8
    );
    return list.length > 0 ? list : products.slice(0, 8);
  }, [products]);

  const itemCount = bestSellers.length;

  // Repeat count for mobile infinite marquee
  const repeatCount = useMemo(() => {
    if (itemCount <= 1) return 1;
    if (itemCount === 2) return 4;
    return 3;
  }, [itemCount]);

  const mobileDisplayProducts = useMemo(() => {
    if (itemCount <= 1) return bestSellers;
    const duplicated: Product[] = [];
    for (let i = 0; i < repeatCount; i++) {
      duplicated.push(...bestSellers);
    }
    return duplicated;
  }, [bestSellers, itemCount, repeatCount]);

  // Mobile Smooth Auto Scroll Hook
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
    pixelsPerSecond: 26,
    pauseDuration: 2500,
  });

  const handleProductNavigate = (product: Product) => {
    if (isMobileDragging()) return;
    window.history.pushState({}, '', getProductUrl(product));
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleDesktopScroll = (direction: 'left' | 'right') => {
    if (!desktopScrollContainerRef.current) return;
    playSound('nav_click');
    const container = desktopScrollContainerRef.current;
    const cardWidth = container.firstElementChild?.clientWidth || 300;
    const scrollAmount = direction === 'left' ? -(cardWidth + 20) * 2 : (cardWidth + 20) * 2;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleDesktopKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handleDesktopScroll('left');
    } else if (e.key === 'ArrowRight') {
      handleDesktopScroll('right');
    }
  };

  // Mouse Drag Handlers for Desktop Swiping
  const handleDesktopMouseDown = (e: React.MouseEvent) => {
    if (!desktopScrollContainerRef.current) return;
    setIsDesktopDragging(true);
    setDesktopStartX(e.pageX - desktopScrollContainerRef.current.offsetLeft);
    setDesktopScrollLeft(desktopScrollContainerRef.current.scrollLeft);
  };

  const handleDesktopMouseLeave = () => {
    setIsDesktopDragging(false);
  };

  const handleDesktopMouseUp = () => {
    setIsDesktopDragging(false);
  };

  const handleDesktopMouseMove = (e: React.MouseEvent) => {
    if (!isDesktopDragging || !desktopScrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - desktopScrollContainerRef.current.offsetLeft;
    const walk = (x - desktopStartX) * 1.5;
    desktopScrollContainerRef.current.scrollLeft = desktopScrollLeft - walk;
  };

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

  return (
    <section
      id="bestsellers"
      className="py-8 sm:py-16 bg-white dark:bg-[var(--brand-primary-deep,#0A1810)] text-[#123F2A] dark:text-white relative overflow-hidden border-b border-[var(--color-border,#E7E1D5)] dark:border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header & Controls */}
        <div className="flex items-end justify-between mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-[var(--color-border,#E7E1D5)] dark:border-white/10">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--brand-gold,#C9A84E)]" />
              <span className="text-[var(--brand-gold,#C9A84E)] font-sans text-xs uppercase tracking-[0.25em] font-bold">
                Most Loved Formulations
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-[#123F2A] dark:text-slate-100">
              Our Best Sellers
            </h2>
          </div>

          {/* Nav Buttons for Desktop & Tablet ONLY (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleDesktopScroll('left')}
              className="p-2.5 rounded-full bg-[#FAF8F2] dark:bg-white/5 border border-[#E7E1D5] dark:border-white/10 text-[#123F2A] dark:text-white hover:bg-[var(--brand-gold)] hover:text-[#0B2F20] hover:border-[var(--brand-gold)] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]"
              aria-label="Previous Best Sellers"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleDesktopScroll('right')}
              className="p-2.5 rounded-full bg-[#FAF8F2] dark:bg-white/5 border border-[#E7E1D5] dark:border-white/10 text-[#123F2A] dark:text-white hover:bg-[var(--brand-gold)] hover:text-[#0B2F20] hover:border-[var(--brand-gold)] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]"
              aria-label="Next Best Sellers"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 1. MOBILE AUTO-MOVING PRODUCT CAROUSEL (md:hidden) */}
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
          aria-label="Mobile Best Sellers Carousel"
        >
          {mobileDisplayProducts.map((product, idx) => {
            const inWishlist = isInWishlist(product.id);
            const discountPct = product.originalPriceINR
              ? Math.round(((product.originalPriceINR - product.priceINR) / product.originalPriceINR) * 100)
              : 0;

            return (
              <div
                key={`mob-bs-${product.id}-${idx}`}
                onClick={() => handleProductNavigate(product)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleProductNavigate(product);
                  }
                }}
                className="w-[80vw] max-w-[325px] shrink-0 bg-white text-slate-900 rounded-2xl overflow-hidden border border-[#E7E1D5] dark:border-white/10 shadow-md hover:shadow-xl active:scale-[0.99] transition-all duration-300 flex flex-col group cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold,#C9A84E)]"
              >
                {/* Product Image Box */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#FAF8F2] flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    width={320}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                    <span className="bg-[#123F2A]/95 text-[var(--brand-gold,#C9A84E)] text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-[var(--brand-gold,#C9A84E)]/40 shadow-sm backdrop-blur-xs">
                      Best Seller
                    </span>
                    {discountPct > 0 && (
                      <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
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
                    className={`absolute top-2.5 right-2.5 w-9 h-9 rounded-full transition-all duration-200 shadow-md flex items-center justify-center z-10 cursor-pointer active:scale-95 ${
                      inWishlist
                        ? 'bg-[#0B4A35] text-[var(--brand-gold,#C9A84E)] border border-[var(--brand-gold,#C9A84E)]/60 shadow-[0_2px_8px_rgba(11,74,53,0.35)]'
                        : 'bg-white/95 text-[#0B4A35] border border-[rgba(201,168,76,0.35)] hover:border-[#0B4A35]/50 hover:bg-white hover:text-[#0B4A35]'
                    }`}
                    aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                    title={inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-3.5 h-3.5 transition-transform ${inWishlist ? 'fill-current scale-105' : ''}`} />
                  </button>
                </div>

                {/* Product Content Body */}
                <div className="p-3.5 xs:p-4 flex-1 flex flex-col justify-between space-y-2.5 bg-white">
                  <div>
                    {/* Category & Volume */}
                    <div className="flex items-center justify-between text-[10px] font-sans text-slate-500 mb-1">
                      <span className="font-semibold uppercase text-[#123F2A] tracking-wider truncate max-w-[65%]">
                        {product.category}
                      </span>
                      {product.volume && <span className="shrink-0">{product.volume}</span>}
                    </div>

                    {/* Title */}
                    <h3 className="font-serif-luxury font-bold text-sm xs:text-[15px] text-slate-900 line-clamp-2 hover:text-[#123F2A] transition-colors leading-snug min-h-[2.4rem]">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">{product.rating}</span>
                      <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="pt-2 border-t border-slate-100 space-y-2.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-extrabold text-[#123F2A] font-sans">
                        {formatPrice(product.priceINR)}
                      </span>
                      {product.originalPriceINR && product.originalPriceINR > product.priceINR && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatPrice(product.originalPriceINR)}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`w-full min-h-[44px] py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 ${
                          addedProductId === product.id
                            ? 'bg-emerald-700 text-white'
                            : 'bg-[#123F2A] hover:bg-[#0B2F20] text-white'
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
                        className="w-full min-h-[44px] py-2 px-2 bg-[var(--brand-gold,#C9A84E)] hover:bg-[#b8891e] text-[#0B2F20] rounded-xl text-xs font-bold flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-sm font-sans"
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

        {/* 2. DESKTOP CAROUSEL / GRID (hidden md:flex) */}
        <div
          ref={desktopScrollContainerRef}
          onKeyDown={handleDesktopKeyDown}
          onMouseDown={handleDesktopMouseDown}
          onMouseLeave={handleDesktopMouseLeave}
          onMouseUp={handleDesktopMouseUp}
          onMouseMove={handleDesktopMouseMove}
          tabIndex={0}
          className={`hidden md:flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none no-scrollbar snap-x snap-mandatory py-2 scroll-smooth cursor-grab ${
            isDesktopDragging ? 'cursor-grabbing select-none' : ''
          }`}
          aria-label="Best Sellers Product List"
        >
          {bestSellers.map((product) => {
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
                className="w-[78vw] sm:w-[42vw] md:w-[30%] lg:w-[calc(25%-18px)] flex-shrink-0 snap-start bg-white text-slate-900 rounded-2xl overflow-hidden border border-[#E7E1D5] dark:border-white/10 shadow-md hover:shadow-xl active:scale-[0.99] transition-all duration-300 flex flex-col group cursor-pointer"
              >
                {/* Product Image Box */}
                <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    width={320}
                    height={320}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    <span className="bg-[#123F2A] text-[var(--brand-gold)] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-[var(--brand-gold)]/30 shadow-md">
                      Best Seller
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
                    className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-10 h-10 rounded-full transition-all duration-200 shadow-md flex items-center justify-center z-10 cursor-pointer active:scale-95 ${
                      inWishlist
                        ? 'bg-[#0B4A35] text-[var(--brand-gold,#C9A84E)] border border-[var(--brand-gold,#C9A84E)]/60 shadow-[0_2px_8px_rgba(11,74,53,0.35)]'
                        : 'bg-white/95 text-[#0B4A35] border border-[rgba(201,168,76,0.35)] hover:border-[#0B4A35]/50 hover:bg-white hover:text-[#0B4A35] hover:scale-105'
                    }`}
                    aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                    title={inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 transition-transform ${inWishlist ? 'fill-current scale-105' : ''}`} />
                  </button>

                  {/* Overlay Quick View Button on Hover */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openQuickView(product);
                      }}
                      className="bg-white/90 hover:bg-white text-slate-900 font-bold text-xs px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-[#123F2A]" />
                      <span>Quick View</span>
                    </button>
                  </div>
                </div>

                {/* Product Content Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Category & Volume */}
                    <div className="flex items-center justify-between text-[11px] font-sans text-slate-500 mb-1">
                      <span className="font-semibold uppercase text-[#123F2A] tracking-wider">
                        {product.category}
                      </span>
                      {product.volume && <span>{product.volume}</span>}
                    </div>

                    {/* Title */}
                    <h3 className="font-serif-luxury font-bold text-sm sm:text-base text-slate-900 line-clamp-2 hover:text-[#123F2A] transition-colors leading-snug">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">{product.rating}</span>
                      <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-extrabold text-[#123F2A] font-sans">
                        {formatPrice(product.priceINR)}
                      </span>
                      {product.originalPriceINR && product.originalPriceINR > product.priceINR && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatPrice(product.originalPriceINR)}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`w-full py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 ${
                          addedProductId === product.id
                            ? 'bg-emerald-700 text-white'
                            : 'bg-[#123F2A] hover:bg-[#0B2F20] text-white'
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
                        className="w-full py-2 px-2 bg-[var(--brand-gold)] hover:bg-[#b8891e] text-[#0B2F20] rounded-lg text-xs font-bold flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-sm"
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
      </div>
    </section>
  );
};

