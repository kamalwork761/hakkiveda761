import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { MobileAppHeroSlide } from '../../types/mobileApp';
import { resolveAssetUrl } from '../utils/nativeUrl';

interface AppHeroCarouselProps {
  slides: MobileAppHeroSlide[];
  onNavigateAction: (destination: string) => void;
}

export const AppHeroCarousel: React.FC<AppHeroCarouselProps> = ({
  slides,
  onNavigateAction,
}) => {
  const publishedSlides = slides
    .filter((s) => s.published !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInteractingRef = useRef(false);

  // Auto-scroll every 5 seconds if user is not actively swiping
  useEffect(() => {
    if (publishedSlides.length <= 1) return;

    const timer = setInterval(() => {
      if (isInteractingRef.current) return;
      setActiveIndex((prev) => {
        const next = (prev + 1) % publishedSlides.length;
        if (containerRef.current) {
          const width = containerRef.current.clientWidth;
          containerRef.current.scrollTo({
            left: next * width,
            behavior: 'smooth',
          });
        }
        return next;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [publishedSlides.length]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, clientWidth } = containerRef.current;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / clientWidth);
      if (index !== activeIndex && index >= 0 && index < publishedSlides.length) {
        setActiveIndex(index);
      }
    }
  };

  const scrollToSlide = (idx: number) => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    containerRef.current.scrollTo({
      left: idx * width,
      behavior: 'smooth',
    });
    setActiveIndex(idx);
  };

  if (publishedSlides.length === 0) return null;

  return (
    <div className="relative w-full px-4 pt-3 pb-2">
      {/* Scrollable Container with Snap */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onTouchStart={() => {
          isInteractingRef.current = true;
        }}
        onTouchEnd={() => {
          setTimeout(() => {
            isInteractingRef.current = false;
          }, 3000);
        }}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar rounded-2xl shadow-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {publishedSlides.map((slide) => {
          const imgSrc = resolveAssetUrl(slide.imageUrl);
          const hasTextOverlay = Boolean(slide.title || slide.subtitle || slide.ctaText);

          return (
            <div
              key={slide.id}
              className="min-w-full w-full flex-shrink-0 snap-center relative aspect-[2/1] rounded-2xl overflow-hidden bg-transparent"
            >
              {/* Background Image - Full opacity, original brightness and colors */}
              <img
                src={imgSrc}
                alt={slide.title || 'Hero Banner'}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/hero_tribal_elders.jpg';
                }}
              />

              {/* Localized Text Overlay ONLY if title/subtitle/CTA configured (NO full-image scrim/gradient) */}
              {hasTextOverlay && (
                <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-end pointer-events-none">
                  <div className="max-w-[85%] space-y-0.5">
                    {slide.eyebrow && (
                      <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-[#C5A059] bg-[#0E382C]/90 px-2 py-0.5 rounded shadow-xs mb-0.5">
                        {slide.eyebrow}
                      </span>
                    )}
                    {slide.title && (
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#FDF8EC] line-clamp-1 leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
                        {slide.title}
                      </h3>
                    )}
                    {slide.subtitle && (
                      <p className="text-[11px] sm:text-xs text-white/95 line-clamp-1 leading-snug font-sans drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                        {slide.subtitle}
                      </p>
                    )}
                  </div>

                  {slide.ctaText && (
                    <div className="mt-2 pointer-events-auto">
                      <button
                        type="button"
                        onClick={() => onNavigateAction(slide.ctaDestination)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C5A059] text-[#0E382C] font-bold text-xs shadow-md hover:bg-[#d4af37] active:scale-95 transition-all"
                      >
                        <span>{slide.ctaText}</span>
                        <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination Dots */}
      {publishedSlides.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          {publishedSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToSlide(i)}
              className={`transition-all duration-300 rounded-full h-1.5 ${
                i === activeIndex
                  ? 'w-5 bg-[#0E382C]'
                  : 'w-1.5 bg-emerald-950/20 hover:bg-emerald-950/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
