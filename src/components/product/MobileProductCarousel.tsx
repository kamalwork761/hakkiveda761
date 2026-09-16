import React, { useState, useRef, useEffect } from 'react';

interface MobileProductCarouselProps {
  images: string[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  productName: string;
  onImageClick?: (index: number) => void;
  badges?: React.ReactNode;
  topRightBadge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  showCounter?: boolean;
}

export const MobileProductCarousel: React.FC<MobileProductCarouselProps> = ({
  images,
  selectedIndex,
  onSelectIndex,
  productName,
  onImageClick,
  badges,
  topRightBadge,
  actions,
  className = '',
  showCounter = true,
}) => {
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchCurrentX = useRef<number>(0);
  const touchCurrentY = useRef<number>(0);
  const isSwipingHorizontal = useRef<boolean | null>(null);

  // Fallback if images array is empty
  const safeImages = images && images.length > 0 ? images : ['/images/hakkiveda_108_oil_gold.jpg'];
  const hasMultiple = safeImages.length > 1;

  // Coverflow dimension parameters
  // Slide width 88% allows active image to be wide and dominant with ~6% peeking adjacent preview on each side
  const SLIDE_WIDTH_PERCENT = 88;
  const GAP_PX = 10;
  const CENTER_OFFSET_PERCENT = (100 - SLIDE_WIDTH_PERCENT) / 2; // 6%

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasMultiple) return;
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    touchCurrentX.current = touch.clientX;
    touchCurrentY.current = touch.clientY;
    isSwipingHorizontal.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!hasMultiple) return;
    const touch = e.touches[0];
    touchCurrentX.current = touch.clientX;
    touchCurrentY.current = touch.clientY;

    const deltaX = touchCurrentX.current - touchStartX.current;
    const deltaY = touchCurrentY.current - touchStartY.current;

    // Detect user gesture intent on initial movement
    if (isSwipingHorizontal.current === null) {
      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        isSwipingHorizontal.current = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }

    // Only drag track if gesture is confirmed horizontal swipe
    if (isSwipingHorizontal.current === true) {
      let offset = deltaX;
      // Rubberband resistance when pulling past the boundaries
      if (
        (selectedIndex === 0 && deltaX > 0) ||
        (selectedIndex === safeImages.length - 1 && deltaX < 0)
      ) {
        offset = deltaX * 0.35;
      }
      setDragOffset(offset);
      setIsDragging(true);
    }
  };

  const handleTouchEnd = () => {
    if (!hasMultiple) return;

    if (isSwipingHorizontal.current === true) {
      const deltaX = touchCurrentX.current - touchStartX.current;
      const swipeThreshold = 35; // Responsive snap threshold in px

      if (deltaX < -swipeThreshold && selectedIndex < safeImages.length - 1) {
        onSelectIndex(selectedIndex + 1);
      } else if (deltaX > swipeThreshold && selectedIndex > 0) {
        onSelectIndex(selectedIndex - 1);
      }
    }

    setDragOffset(0);
    setIsDragging(false);
    isSwipingHorizontal.current = null;
    touchStartX.current = 0;
    touchStartY.current = 0;
    touchCurrentX.current = 0;
    touchCurrentY.current = 0;
  };

  const handleSlideClick = (index: number) => {
    // If user was dragging, ignore click
    const wasDragged = Math.abs(touchCurrentX.current - touchStartX.current) > 10;
    if (wasDragged && touchStartX.current !== 0) return;

    if (index === selectedIndex) {
      // Active slide clicked -> invoke image click / zoom handler
      onImageClick?.(index);
    } else {
      // Adjacent slide clicked -> snap it to center
      onSelectIndex(index);
    }
  };

  // Track translation style to perfectly center active slide
  const trackTransform = hasMultiple
    ? `translateX(calc(${CENTER_OFFSET_PERCENT}% - ${selectedIndex * SLIDE_WIDTH_PERCENT}% - ${
        selectedIndex * GAP_PX
      }px + ${dragOffset}px))`
    : 'translateX(0%)';

  return (
    <div
      className={`w-full max-w-full select-none flex flex-col items-center overflow-hidden ${className}`}
      aria-roledescription="carousel"
      aria-label={`${productName} mobile image gallery`}
    >
      {/* Carousel Stage Container */}
      <div
        className="w-full max-w-full relative overflow-hidden py-1 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {/* Badges Overlay (Top-Left) */}
        {badges && (
          <div className="absolute top-3 left-3 z-30 flex flex-col gap-1.5 pointer-events-none">
            {badges}
          </div>
        )}

        {/* Counter Badge or Custom Top-Right Badge (Top-Right) */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 pointer-events-none">
          {topRightBadge}
          {showCounter && hasMultiple && !topRightBadge && (
            <span className="bg-black/75 text-[var(--brand-gold,#D4AF37)] text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-[var(--brand-gold,#D4AF37)]/30 backdrop-blur-xs shadow-sm">
              {selectedIndex + 1} / {safeImages.length}
            </span>
          )}
        </div>

        {/* Action Overlay (Bottom-Right, e.g. Wishlist, Share) */}
        {actions && (
          <div className="absolute bottom-3 right-3 z-30 flex flex-col gap-2 pointer-events-auto">
            {actions}
          </div>
        )}

        {/* Carousel Track */}
        <div
          className="flex items-center will-change-transform"
          style={{
            transform: trackTransform,
            transition: isDragging
              ? 'none'
              : 'transform 350ms cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        >
          {safeImages.map((img, idx) => {
            const diff = Math.abs(idx - selectedIndex);
            const isActive = diff === 0;
            const isAdjacent = diff === 1;

            // Active slide is centered at full scale(1) and full opacity
            // Adjacent slides peek slightly from left/right at natural width
            const scale = isActive ? 1 : isAdjacent ? 0.96 : 0.92;
            const opacity = isActive ? 1 : isAdjacent ? 0.65 : 0.4;
            const zIndex = isActive ? 20 : isAdjacent ? 10 : 1;

            return (
              <div
                key={idx}
                onClick={() => handleSlideClick(idx)}
                style={{
                  width: hasMultiple ? `${SLIDE_WIDTH_PERCENT}%` : '100%',
                  marginRight: hasMultiple ? `${GAP_PX}px` : '0px',
                  transform: `scale(${scale})`,
                  opacity,
                  zIndex,
                  transition: isDragging
                    ? 'none'
                    : 'transform 350ms cubic-bezier(0.25, 1, 0.5, 1), opacity 350ms ease',
                }}
                className="shrink-0 cursor-pointer origin-center transform-gpu"
                role="group"
                aria-roledescription="slide"
                aria-label={`Image ${idx + 1} of ${safeImages.length}`}
              >
                {/* Full-width Image Slide without boxed card styling or borders */}
                <div
                  className="w-full relative flex items-center justify-center select-none"
                  style={{ aspectRatio: '1 / 1' }}
                >
                  <picture className="w-full h-full flex items-center justify-center pointer-events-none">
                    {img && (img.endsWith('.jpg') || img.endsWith('.png')) && (
                      <source type="image/webp" srcSet={img.replace(/\.(jpg|png)$/, '.webp')} />
                    )}
                    <img
                      src={img}
                      alt={`${productName} view ${idx + 1}`}
                      fetchPriority={idx === 0 ? 'high' : 'auto'}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      width="823"
                      height="823"
                      style={{
                        width: '100%',
                        height: 'auto',
                        aspectRatio: '1 / 1',
                        objectFit: 'contain',
                      }}
                      className="w-full h-auto aspect-square object-contain pointer-events-none select-none"
                    />
                  </picture>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Pagination Dots: Placed directly below carousel with clear active indicator */}
      {hasMultiple && (
        <div
          className="flex items-center justify-center gap-2 py-3 px-2 w-full select-none overflow-x-auto no-scrollbar"
          aria-label="Product image pagination"
        >
          {safeImages.map((_, idx) => {
            const isActive = selectedIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectIndex(idx);
                }}
                className="p-1.5 -m-1.5 flex items-center justify-center cursor-pointer touch-manipulation focus:outline-none"
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={isActive ? 'true' : 'false'}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
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
  );
};
