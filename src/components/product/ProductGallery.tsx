import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { ProductFullscreenViewer } from './ProductFullscreenViewer';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  isBestseller?: boolean;
  discountPct?: number;
  sku?: string;
  selectedVariantImage?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  isBestseller = false,
  discountPct = 0,
  sku,
  selectedVariantImage,
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

  // Mobile Touch Gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div id="product-gallery" className="w-full flex flex-col-reverse lg:flex-row gap-4 select-none">
      {/* Desktop Vertical Thumbnails / Mobile Horizontal Thumbnails */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto lg:max-h-[520px] pb-2 lg:pb-0 scrollbar-none shrink-0 no-scrollbar">
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
      <div className="flex-1 relative">
        <div
          ref={mainImageContainerRef}
          onMouseEnter={() => setIsZoomActive(true)}
          onMouseLeave={() => setIsZoomActive(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsFullscreenOpen(true)}
          className="w-full h-80 sm:h-96 md:h-[480px] lg:h-[520px] rounded-2xl overflow-hidden relative border border-[#E7E1D5] dark:border-white/10 bg-white dark:bg-black/30 flex items-center justify-center p-4 cursor-zoom-in group shadow-sm transition-all"
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
              height: 'auto',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
            className="w-full h-auto max-h-full object-contain transition-transform duration-150 ease-out"
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

          {/* Fullscreen Button Trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreenOpen(true);
            }}
            className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-black/60 hover:bg-[var(--brand-gold)] text-white hover:text-[#0B2F20] border border-white/20 transition-all shadow-lg z-20 flex items-center gap-1 text-xs font-bold cursor-pointer"
            title="Open fullscreen viewer"
            aria-label="Open fullscreen image viewer"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden sm:inline text-[10px]">Fullscreen</span>
          </button>

          {/* Mobile swipe / Desktop zoom hint pill */}
          <div className="absolute bottom-3 left-3 bg-black/60 text-slate-200 text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/10 opacity-70 group-hover:opacity-0 transition-opacity flex items-center gap-1.5 z-10 backdrop-blur-xs pointer-events-none">
            <ZoomIn className="w-3 h-3 text-[var(--brand-gold)]" />
            <span>Hover to zoom • Click for fullscreen</span>
          </div>

          {/* Gallery Prev / Next Controls */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-[var(--brand-gold)] text-white hover:text-[#0B2F20] transition-all flex items-center justify-center border border-white/20 shadow-xl opacity-80 hover:opacity-100 cursor-pointer"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-[var(--brand-gold)] text-white hover:text-[#0B2F20] transition-all flex items-center justify-center border border-white/20 shadow-xl opacity-80 hover:opacity-100 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Mobile Dot Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-3 inset-x-0 flex lg:hidden items-center justify-center gap-1.5 z-10 pointer-events-none">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    selectedIndex === idx
                      ? 'w-5 bg-[var(--brand-gold)] shadow'
                      : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
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
