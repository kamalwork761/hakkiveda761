import React, { useRef, useState, useMemo } from 'react';
import { Star, ShoppingBag, Heart, Eye, ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/store';
import { getProductUrl } from '../utils/productUtils';

export const BestSellersCarousel: React.FC = () => {
  const { products, formatPrice, addToCart, toggleWishlist, isInWishlist, openQuickView, playSound } = useStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Mouse dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Filter products for Best Sellers
  const bestSellers = useMemo(() => {
    const list = products.filter(
      (p) => p.isBestseller || p.featuredBestSeller || p.rating >= 4.8
    );
    return list.length > 0 ? list : products.slice(0, 8);
  }, [products]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    playSound('nav_click');
    const container = scrollContainerRef.current;
    const cardWidth = container.firstElementChild?.clientWidth || 300;
    const scrollAmount = direction === 'left' ? -(cardWidth + 20) * 2 : (cardWidth + 20) * 2;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handleScroll('left');
    } else if (e.key === 'ArrowRight') {
      handleScroll('right');
    }
  };

  // Mouse Drag Handlers for Desktop Swiping
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

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
    // open cart drawer or checkout
    const cartBtn = document.querySelector('[aria-label="Shopping Cart"]') as HTMLButtonElement;
    if (cartBtn) cartBtn.click();
  };

  return (
    <section id="bestsellers" className="py-12 sm:py-16 bg-white dark:bg-[var(--brand-primary-deep,#0A1810)] text-[#123F2A] dark:text-white relative overflow-hidden border-b border-[var(--color-border,#E7E1D5)] dark:border-white/10">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-8 left-8 z-50 bg-[var(--brand-gold)] text-[#0B2F20] px-5 py-3 rounded-xl shadow-2xl font-sans text-xs font-bold flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <Check className="w-5 h-5 bg-[#0B2F20] text-[var(--brand-gold)] rounded-full p-1" />
          <span>Added '{addedToast}' to your cart!</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header & Arrow Controls */}
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-[var(--color-border,#E7E1D5)] dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[var(--brand-gold)]" />
              <span className="text-[var(--brand-gold)] font-sans text-xs uppercase tracking-[0.25em] font-bold">
                Most Loved Formulations
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-[#123F2A] dark:text-slate-100">
              Our Best Sellers
            </h2>
          </div>

          {/* Nav Buttons for Desktop & Tablet */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="p-2.5 rounded-full bg-[#FAF8F2] dark:bg-white/5 border border-[#E7E1D5] dark:border-white/10 text-[#123F2A] dark:text-white hover:bg-[var(--brand-gold)] hover:text-[#0B2F20] hover:border-[var(--brand-gold)] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]"
              aria-label="Previous Best Sellers"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="p-2.5 rounded-full bg-[#FAF8F2] dark:bg-white/5 border border-[#E7E1D5] dark:border-white/10 text-[#123F2A] dark:text-white hover:bg-[var(--brand-gold)] hover:text-[#0B2F20] hover:border-[var(--brand-gold)] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]"
              aria-label="Next Best Sellers"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollContainerRef}
          onKeyDown={handleKeyDown}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          tabIndex={0}
          className={`flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none no-scrollbar snap-x snap-mandatory py-2 scroll-smooth cursor-grab ${
            isDragging ? 'cursor-grabbing select-none' : ''
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
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md z-10 cursor-pointer ${
                      inWishlist
                        ? 'bg-rose-500 text-white'
                        : 'bg-black/40 text-white hover:bg-white hover:text-rose-500'
                    }`}
                    aria-label={`Add ${product.name} to wishlist`}
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
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
                    <h3
                      className="font-serif-luxury font-bold text-sm sm:text-base text-slate-900 line-clamp-2 hover:text-[#123F2A] transition-colors leading-snug"
                    >
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
                        className="w-full py-2 px-2 bg-[#123F2A] hover:bg-[#0B2F20] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
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
