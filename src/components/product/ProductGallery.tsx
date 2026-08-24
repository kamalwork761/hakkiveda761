import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Maximize2,
  Sparkles,
  Heart,
  Share2,
} from 'lucide-react';
import { ProductFullscreenViewer } from './ProductFullscreenViewer';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  isBestseller?: boolean;
  discountPct?: number;
  sku?: string;
  selectedVariantImage?: string;
  isInWishlist?: boolean;
  onToggleWishlist?: () => void;
  onShare?: () => void;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  isBestseller = false,
  discountPct = 0,
  sku,
  selectedVariantImage,
  isInWishlist = false,
  onToggleWishlist,
  onShare,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [isZoomActive, setIsZoomActive] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });

  // Touch Swipe handlers for mobile
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const mainImageContainerRef = useRef<HTMLDivElement>(null);

  // If a variant has its own image and it exists in images or is provided, switch to it
  useEffect(() => {
    if (selectedVariantImage) {
      const idx = images.findIndex((img) => img === selectedVariantImage);
      if (idx !== -1) {
        setSelectedIndex(idx);
      }
    }
  }, [selectedVariantImage, images]);

  const currentImage = images[selectedIndex] || images[0] || '/images/hakkiveda_108_oil_gold.jpg';

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Mouse hover zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageContainerRef.current) return;
    const { left, top, width, height } = mainImageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomCoords({ x, y });
  };

  // Touch gestures for mobile swipe (allows vertical page scrolling while capturing horizontal swipes)
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const isSwipingHorizontal = useRef<boolean>(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    isSwipingHorizontal.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;

    const deltaX = Math.abs(touchEndX.current - touchStartX.current);
    const deltaY = Math.abs(touchEndY.current - touchStartY.current);

    // If horizontal movement exceeds vertical movement by a margin, lock horizontal intent
    if (deltaX > deltaY && deltaX > 10) {
      isSwipingHorizontal.current = true;
    }
  };

  const handleTouchEnd = () => {
    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = Math.abs(touchStartY.current - touchEndY.current);

    // Only trigger slide change if horizontal swipe is decisive (>40px) and greater than vertical scroll
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > deltaY) {
      if (deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = 0;
    touchStartY.current = 0;
    touchEndX.current = 0;
    touchEndY.current = 0;
    isSwipingHorizontal.current = false;
  };

  return (
    <div id="product-gallery" className="w-full flex flex-col-reverse lg:flex-row gap-4 select-none">
      {/* Desktop Vertical Thumbnails / Mobile Horizontal Thumbnails */}
      {images.length > 1 && (
        <div className="hidden md:flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto lg:max-h-[520px] pb-2 lg:pb-0 scrollbar-none shrink-0 no-scrollbar">
          {images.map((img, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white dark:bg-black/40 p-1 flex items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'border-[var(--brand-gold)] ring-2 ring-[var(--brand-gold)]/40 scale-102 shadow-md'
                    : 'border-[#E7E1D5] dark:border-white/10 opacity-70 hover:opacity-100 hover:border-slate-400'
                }`}
                aria-label={`Select product image view ${idx + 1}`}
              >
                <img
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
                {isSelected && (
                  <span className="absolute bottom-0 inset-x-0 h-1 bg-[var(--brand-gold)]"></span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Showcase Stage */}
      <div className="flex-1 relative w-full overflow-hidden">
        <div
          ref={mainImageContainerRef}
          onMouseEnter={() => setIsZoomActive(true)}
          onMouseLeave={() => setIsZoomActive(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsFullscreenOpen(true)}
          className="w-full aspect-square sm:aspect-auto sm:h-96 md:h-[480px] lg:h-[520px] rounded-2xl md:rounded-2xl overflow-hidden relative border-0 sm:border border-[#E7E1D5] dark:border-white/10 bg-white/70 dark:bg-black/30 flex items-center justify-center p-2 sm:p-4 cursor-zoom-in group shadow-none sm:shadow-sm transition-all"
        >
          {/* Main Product Image (Preloaded / Eager for LCP) */}
          <img
            src={currentImage}
            alt={`${productName} - Detail View ${selectedIndex + 1}`}
            fetchPriority="high"
            loading="eager"
            style={{
              transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
              transform: isZoomActive ? 'scale(2.2)' : 'scale(1)',
              width: '100%',
              height: '100%',
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
            }}
            className="w-full h-full object-contain transition-transform duration-150 ease-out select-none"
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            {isBestseller && (
              <span className="bg-[#123F2A] text-[var(--brand-gold)] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-[var(--brand-gold)]/40 shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[var(--brand-gold)]" />
                <span>Tribal Bestseller</span>
              </span>
            )}
            {discountPct > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md self-start">
                {discountPct}% OFF
              </span>
            )}
          </div>

          {/* SKU & Origin Badges */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 pointer-events-none">
            {sku && (
              <span className="bg-[#123F2A]/90 text-[var(--brand-gold)] text-[10px] uppercase font-mono font-bold tracking-wider px-2.5 py-1 rounded-full border border-[var(--brand-gold)]/30 backdrop-blur-xs shadow-xs">
                {sku}
              </span>
            )}
          </div>

          {/* Mobile Overlay Action Icons: Share & Wishlist (Stacked in bottom-right corner) */}
          <div className="flex md:hidden absolute bottom-3 right-3 z-20 flex-col gap-2 pointer-events-auto">
            {onShare && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare();
                }}
                className="w-9 h-9 rounded-full bg-white/90 dark:bg-black/75 text-[#123F2A] dark:text-white border border-[#E7E1D5] dark:border-white/20 shadow-md backdrop-blur-xs flex items-center justify-center active:scale-90 transition-all cursor-pointer hover:bg-white hover:border-[var(--brand-gold)]"
                aria-label="Share product formulation"
                title="Share product"
              >
                <Share2 className="w-4 h-4 text-[#123F2A] dark:text-slate-100" />
              </button>
            )}
            {onToggleWishlist && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist();
                }}
                className={`w-9 h-9 rounded-full border shadow-md backdrop-blur-xs flex items-center justify-center active:scale-90 transition-all cursor-pointer ${
                  isInWishlist
                    ? 'bg-rose-500 border-rose-500 text-white shadow-rose-500/30'
                    : 'bg-white/90 dark:bg-black/75 border-[#E7E1D5] dark:border-white/20 text-[#123F2A] dark:text-white hover:border-rose-400'
                }`}
                aria-label={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current text-white' : 'text-[#123F2A] dark:text-slate-100'}`} />
              </button>
            )}
          </div>

          {/* Fullscreen Button Trigger (Desktop Only, on mobile tapping image opens fullscreen) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreenOpen(true);
            }}
            className="hidden md:flex absolute bottom-3 right-3 p-2.5 rounded-xl bg-black/60 hover:bg-[var(--brand-gold)] text-white hover:text-[#0B2F20] border border-white/20 transition-all shadow-lg z-20 items-center gap-1 text-xs font-bold cursor-pointer"
            title="Open fullscreen viewer"
            aria-label="Open fullscreen image viewer"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden sm:inline text-[10px]">Fullscreen</span>
          </button>

          {/* Mobile swipe / Desktop zoom hint pill (Desktop Only) */}
          <div className="hidden md:flex absolute bottom-3 left-3 bg-black/60 text-slate-200 text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/10 opacity-70 group-hover:opacity-0 transition-opacity items-center gap-1.5 z-10 backdrop-blur-xs pointer-events-none">
            <ZoomIn className="w-3 h-3 text-[var(--brand-gold)]" />
            <span>Hover to zoom • Click for fullscreen</span>
          </div>

          {/* Gallery Prev / Next Controls (Desktop Only) */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-[var(--brand-gold)] text-white hover:text-[#0B2F20] transition-all items-center justify-center border border-white/20 shadow-xl opacity-80 hover:opacity-100 cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-[var(--brand-gold)] text-white hover:text-[#0B2F20] transition-all items-center justify-center border border-white/20 shadow-xl opacity-80 hover:opacity-100 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Desktop Only Inside-Overlay Dot Indicators (if any needed) */}
        </div>

        {/* Mobile Pagination Dots: Placed directly below the main image for clean visibility & easy tap */}
        {images.length > 1 && (
          <div
            className="flex md:hidden items-center justify-center gap-2 py-3 px-2 w-full select-none overflow-x-auto no-scrollbar"
            aria-label="Product image pagination"
          >
            {images.map((_, idx) => {
              const isActive = selectedIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(idx);
                  }}
                  className="p-1 -m-1 flex items-center justify-center cursor-pointer touch-manipulation focus:outline-none"
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-current={isActive ? 'true' : 'false'}
                >
                  <span
                    className={`block rounded-full transition-all duration-200 ${
                      isActive
                        ? 'w-6 h-2 bg-[var(--brand-gold,#D4AF37)] shadow-sm'
                        : 'w-2 h-2 bg-slate-300 dark:bg-white/30 hover:bg-slate-400 dark:hover:bg-white/50'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <ProductFullscreenViewer
        isOpen={isFullscreenOpen}
        images={images}
        initialIndex={selectedIndex}
        productName={productName}
        onClose={() => setIsFullscreenOpen(false)}
      />
    </div>
  );
};
