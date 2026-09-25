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
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar rounded-2xl shadow-lg border border-emerald-950/10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {publishedSlides.map((slide) => {
          const imgSrc = resolveAssetUrl(slide.imageUrl);
          return (
            <div
              key={slide.id}
              className="min-w-full w-full flex-shrink-0 snap-center relative aspect-[16/9] max-h-[220px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#0E382C] to-[#07241C]"
            >
              {/* Background Image */}
              <img
                src={imgSrc}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/hero_tribal_elders.jpg';
                }}
              />

              {/* Gradient Scrim for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07241C] via-[#0E382C]/60 to-transparent" />

              {/* Slide Content */}
              <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#C5A059] mb-1">
                  Forest Formulation
                </span>
                <h3 className="font-serif text-lg font-bold text-[#FDF8EC] line-clamp-1 leading-tight drop-shadow-sm">
                  {slide.title}
                </h3>
                <p className="text-xs text-emerald-100/90 line-clamp-1 mt-0.5 leading-snug font-sans">
                  {slide.subtitle}
                </p>

                {/* CTA Button */}
                <div className="mt-2.5">
                  <button
                    type="button"
                    onClick={() => onNavigateAction(slide.ctaDestination)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C5A059] text-[#0E382C] font-bold text-xs shadow-md hover:bg-[#d4af37] active:scale-95 transition-all"
                  >
                    <span>{slide.ctaText || 'Shop Now'}</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
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
