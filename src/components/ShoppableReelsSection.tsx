import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ShoppableReel, Product } from '../types/store';

interface ShoppableReelsSectionProps {
  onSelectProduct?: (product: Product) => void;
  onExploreMore?: () => void;
}

export const ShoppableReelsSection: React.FC<ShoppableReelsSectionProps> = ({
  onSelectProduct,
  onExploreMore,
}) => {
  const { shoppableReels } = useStore();

  // Filter active reels and sort by display order
  const activeReels = useMemo(() => {
    return shoppableReels
      .filter((r) => r.active !== false)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }, [shoppableReels]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Dragging / Touch state for smooth snapping
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isHorizontalSwipe = useRef<boolean | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const hasMovedSignificant = useRef<boolean>(false);

  // Active Center Video Element Ref
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-advance state
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const lastUserInteraction = useRef<number>(Date.now());

  const total = activeReels.length;

  // Safe navigation handlers
  const goToNext = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
    lastUserInteraction.current = Date.now();
  }, [total]);

  const goToPrev = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    lastUserInteraction.current = Date.now();
  }, [total]);

  // Navigate to dedicated /video-rituals page
  const handleOpenExploreMore = useCallback(() => {
    if (onExploreMore) {
      onExploreMore();
    } else if (typeof window !== 'undefined') {
      window.location.pathname = '/video-rituals';
    }
  }, [onExploreMore]);

  // Auto-advance timer (advances 1 card every 8 seconds when idle and not dragging)
  useEffect(() => {
    if (total <= 1) return;

    const interval = setInterval(() => {
      const timeSinceInteraction = Date.now() - lastUserInteraction.current;
      if (!isHovered && !isDragging && timeSinceInteraction >= 8000) {
        setCurrentIndex((prev) => (prev + 1) % total);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [total, isHovered, isDragging]);

  // Autoplay active center video after snap completes
  useEffect(() => {
    const video = activeVideoRef.current;
    if (!video) return;

    video.muted = isMuted;

    // Small delay to ensure card snap transition has settled before playing
    const timer = setTimeout(() => {
      if (!isDragging) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => {
              // Autoplay blocked by browser policy — remains gracefully on poster
              setIsPlaying(false);
            });
        }
      }
    }, 120);

    return () => {
      clearTimeout(timer);
      if (video) {
        video.pause();
      }
    };
  }, [currentIndex, isDragging, isMuted]);

  // Mute / Unmute toggle
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => {
      const next = !prev;
      if (activeVideoRef.current) {
        activeVideoRef.current.muted = next;
      }
      return next;
    });
  };

  // Keyboard navigation on section
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    },
    [goToPrev, goToNext]
  );

  // Touch Handlers for Spotlight Carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = null;
    hasMovedSignificant.current = false;
    setIsDragging(true);
    setDragOffset(0);
    lastUserInteraction.current = Date.now();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX.current;
    const diffY = currentY - touchStartY.current;

    // Detect lock direction on first significant movement
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
        isHorizontalSwipe.current = Math.abs(diffX) >= Math.abs(diffY);
      }
    }

    if (isHorizontalSwipe.current) {
      if (e.cancelable) e.preventDefault();
      setDragOffset(diffX);
      if (Math.abs(diffX) > 10) {
        hasMovedSignificant.current = true;
      }
    }
  };

  const handleTouchEnd = () => {
    if (isHorizontalSwipe.current && Math.abs(dragOffset) > 40) {
      if (dragOffset > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }
    setIsDragging(false);
    setDragOffset(0);
    touchStartX.current = null;
    touchStartY.current = null;
    isHorizontalSwipe.current = null;
    lastUserInteraction.current = Date.now();
  };

  // Mouse Drag Handlers for Desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
    hasMovedSignificant.current = false;
    setIsDragging(true);
    setDragOffset(0);
    lastUserInteraction.current = Date.now();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mouseStartX.current === null || !isDragging) return;
    const diffX = e.clientX - mouseStartX.current;
    setDragOffset(diffX);
    if (Math.abs(diffX) > 8) {
      hasMovedSignificant.current = true;
    }
  };

  const handleMouseUp = () => {
    if (mouseStartX.current !== null && isDragging) {
      if (Math.abs(dragOffset) > 45) {
        if (dragOffset > 0) {
          goToPrev();
        } else {
          goToNext();
        }
      }
    }
    setIsDragging(false);
    setDragOffset(0);
    mouseStartX.current = null;
    lastUserInteraction.current = Date.now();
  };

  const handleCardClick = (index: number) => {
    if (hasMovedSignificant.current) return;
    if (index === currentIndex) {
      // Tap on active center card navigates to dedicated /video-rituals experience
      handleOpenExploreMore();
    } else {
      // Tap on side card brings it to center stage
      setCurrentIndex(index);
      lastUserInteraction.current = Date.now();
    }
  };

  if (total === 0) return null;

  return (
    <section
      id="shoppable-video-rituals-section"
      className="py-14 sm:py-18 md:py-24 bg-gradient-to-b from-[#f8f5ee] via-[#ffffff] to-[#f4efe4] relative overflow-hidden border-t border-b border-amber-900/10 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Shoppable Video Rituals Spotlight Carousel"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#123F2B]/10 font-bold text-xs uppercase tracking-widest border border-[#B8891E]/30 text-[#B8891E] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#B8891E]" />
            <span>Shoppable Rituals</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif-luxury font-bold tracking-tight text-[#123F2B] leading-tight">
            HAKKIVEDA <span className="text-[#C5A059]">VIDEO RITUALS</span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-[#405B4A] font-sans leading-relaxed max-w-2xl mx-auto font-normal px-2">
            Watch authentic tribal rituals, herbal preparations, and real customer hair regrowth journeys.
          </p>
        </div>

        {/* Premium Spotlight / Coverflow Carousel Stage */}
        <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center min-h-[460px] sm:min-h-[520px] md:min-h-[580px]">
          {/* Left Arrow Button */}
          <button
            onClick={goToPrev}
            aria-label="Previous video"
            className="absolute left-1 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-[#0a1d13]/85 hover:bg-[#C5A059] text-white hover:text-[#0a1d13] border border-white/20 hover:border-[#C5A059] flex items-center justify-center shadow-xl transition-all duration-300 cursor-pointer backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={goToNext}
            aria-label="Next video"
            className="absolute right-1 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-[#0a1d13]/85 hover:bg-[#C5A059] text-white hover:text-[#0a1d13] border border-white/20 hover:border-[#C5A059] flex items-center justify-center shadow-xl transition-all duration-300 cursor-pointer backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Cards Track Container */}
          <div
            className="relative w-full h-[460px] sm:h-[520px] md:h-[580px] flex items-center justify-center overflow-visible touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {activeReels.map((reel, index) => {
              // Circular offset from active card
              let diff = index - currentIndex;
              if (diff > total / 2) diff -= total;
              if (diff < -total / 2) diff += total;

              // Only render items within 2 steps away
              const isVisible = Math.abs(diff) <= 2;
              const isActive = diff === 0;
              const isNear = Math.abs(diff) === 1;
              const isFar = Math.abs(diff) === 2;

              // Mobile spacing: ~180px, Desktop spacing: ~255px
              const baseSpacing = typeof window !== 'undefined' && window.innerWidth < 640 ? 180 : 255;
              const translateXPercent = diff * baseSpacing + (isDragging ? dragOffset : 0);

              let scale = 1;
              let opacity = 1;
              let zIndex = 30;
              let brightness = 1;

              if (isActive) {
                scale = 1;
                opacity = 1;
                zIndex = 30;
                brightness = 1;
              } else if (isNear) {
                scale = 0.91;
                opacity = 0.80;
                zIndex = 20;
                brightness = 0.85;
              } else if (isFar) {
                scale = 0.83;
                opacity = 0.45;
                zIndex = 10;
                brightness = 0.70;
              } else {
                scale = 0.75;
                opacity = 0;
                zIndex = 0;
                brightness = 0.50;
              }

              if (!isVisible) return null;

              return (
                <div
                  key={reel.id}
                  onClick={() => handleCardClick(index)}
                  style={{
                    transform: `translate3d(calc(-50% + ${translateXPercent}px), -50%, 0) scale(${scale})`,
                    zIndex,
                    opacity,
                    filter: `brightness(${brightness})`,
                    transition: isDragging
                      ? 'none'
                      : 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1), filter 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                  className={`absolute top-1/2 left-1/2 w-[76vw] sm:w-[280px] md:w-[320px] max-w-[320px] aspect-[9/16] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer group bg-[#0A1810] transition-all duration-300 ${
                    isActive
                      ? 'border border-[#C5A059] shadow-lg shadow-black/25'
                      : 'border border-white/20 shadow-md shadow-black/20 hover:border-[#C5A059]/60'
                  }`}
                >
                  {/* Center Video (Active Card) vs Poster Image (Side Cards) */}
                  {isActive ? (
                    <div className="relative w-full h-full bg-black">
                      <video
                        ref={activeVideoRef}
                        src={reel.videoUrl}
                        poster={reel.posterUrl || '/images/hakkiveda_108_oil_gold.jpg'}
                        autoPlay
                        playsInline
                        loop
                        muted={isMuted}
                        preload="metadata"
                        className="w-full h-full object-cover select-none pointer-events-none"
                      />

                      {/* Small Mute / Unmute Control Top Right */}
                      <button
                        onClick={toggleMute}
                        className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-lg"
                        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                        title={isMuted ? 'Click to unmute' : 'Click to mute'}
                      >
                        {isMuted ? (
                          <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-full h-full bg-black">
                      <img
                        src={reel.posterUrl || '/images/hakkiveda_108_oil_gold.jpg'}
                        alt={reel.title}
                        className="w-full h-full object-cover select-none pointer-events-none group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                        draggable={false}
                      />
                      {/* Play Icon Placeholder on side cards */}
                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none opacity-70">
                        <div className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center border border-white/20">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gradient Lighting Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />

                  {/* Top Badges (Customer / Location) */}
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-1 pointer-events-none">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[11px] font-medium border border-white/20 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="truncate max-w-[100px] sm:max-w-[120px]">
                        {reel.customerName}
                      </span>
                      {reel.verifiedBadge && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      )}
                    </div>

                    {reel.country && (
                      <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[10px] font-semibold border border-white/15">
                        {reel.country}
                      </span>
                    )}
                  </div>

                  {/* Bottom Reel Caption & Title Info */}
                  <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 z-20 text-white space-y-1.5 pointer-events-none">
                    <h3 className="text-xs sm:text-sm md:text-base font-bold font-serif-luxury leading-snug line-clamp-1 group-hover:text-[#C5A059] transition-colors">
                      {reel.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-200 line-clamp-2 font-sans opacity-90 leading-relaxed">
                      {reel.caption}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
          {activeReels.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                lastUserInteraction.current = Date.now();
              }}
              aria-label={`Go to video slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentIndex
                  ? 'w-7 bg-[#123F2B]'
                  : 'w-2 bg-[#123F2B]/25 hover:bg-[#123F2B]/50'
              }`}
            />
          ))}
        </div>

        {/* Primary Overall Section CTA — EXPLORE MORE */}
        <div className="text-center mt-8 sm:mt-10">
          <button
            onClick={handleOpenExploreMore}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-full bg-[#123F2B] hover:bg-[#184f37] text-[#C5A059] hover:text-[#e4c379] border border-[#C5A059]/40 hover:border-[#C5A059] font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer group"
          >
            <span>EXPLORE ALL VIDEO RITUALS</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
