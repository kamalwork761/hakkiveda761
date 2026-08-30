import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ShoppingBag,
  MessageCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ShoppableReel, Product } from '../types/store';
import { getProductUrl } from '../utils/productUtils';

interface VideoRitualsPageProps {
  onReturnHome: () => void;
  onSelectProduct: (product: Product) => void;
}

export const VideoRitualsPage: React.FC<VideoRitualsPageProps> = ({
  onReturnHome,
  onSelectProduct,
}) => {
  const {
    shoppableReels,
    products,
    formatPrice,
  } = useStore();

  // Active / sorted reels
  const activeReels = useMemo(() => {
    return shoppableReels
      .filter((r) => r.active !== false)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }, [shoppableReels]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showPlayPulse, setShowPlayPulse] = useState<boolean>(false);
  const [expandedCaptions, setExpandedCaptions] = useState<Record<string, boolean>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const total = activeReels.length;

  // IntersectionObserver to detect which reel is active in vertical scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container || total === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index) && index !== activeIndex) {
              setActiveIndex(index);
              setIsPlaying(true);
            }
          }
        });
      },
      {
        root: container,
        threshold: [0.55, 0.75],
      }
    );

    reelRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [total, activeIndex]);

  // Video play/pause lifecycle management on activeIndex change
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;

      if (idx === activeIndex) {
        video.muted = isMuted;
        if (isPlaying) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Browser blocked autoplay
            });
          }
        } else {
          video.pause();
        }
      } else {
        video.pause();
        try {
          video.currentTime = 0;
        } catch (_) {}
      }
    });
  }, [activeIndex, isPlaying, isMuted]);

  // Handle Mute toggle across all reels
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (videoRefs.current[activeIndex]) {
        videoRefs.current[activeIndex]!.muted = next;
      }
      return next;
    });
  }, [activeIndex]);

  // Tap video to play/pause
  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev;
      setShowPlayPulse(true);
      setTimeout(() => setShowPlayPulse(false), 600);
      return next;
    });
  }, []);

  // Programmatic scroll to next/prev reel
  const scrollToReel = useCallback((index: number) => {
    if (index < 0 || index >= total) return;
    const targetEl = reelRefs.current[index];
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [total]);

  // Keyboard navigation for desktop users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToReel(activeIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToReel(activeIndex - 1);
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'Escape') {
        onReturnHome();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, scrollToReel, togglePlayPause, toggleMute, onReturnHome]);

  const toggleCaption = (reelId: string) => {
    setExpandedCaptions((prev) => ({
      ...prev,
      [reelId]: !prev[reelId],
    }));
  };

  const handleWhatsappEnquiry = (reel: ShoppableReel, product?: Product | null) => {
    const text = encodeURIComponent(
      `Hi HAKKIVEDA! I watched your video ritual "${reel.title}" and would like to inquire about ${
        product ? product.name : 'your tribal hair formulas'
      }.`
    );
    window.open(`https://wa.me/917619536831?text=${text}`, '_blank');
  };

  if (total === 0) {
    return (
      <div className="min-h-screen bg-[#07160e] text-white flex flex-col items-center justify-center p-6 text-center">
        <Sparkles className="w-12 h-12 text-[#C5A059] mb-4 animate-pulse" />
        <h1 className="text-2xl font-serif-luxury font-bold text-white mb-2">
          HAKKIVEDA Video Rituals
        </h1>
        <p className="text-slate-300 text-sm max-w-md mb-6">
          No video rituals are currently published. Check back soon for authentic customer stories and hair care guides.
        </p>
        <button
          onClick={onReturnHome}
          className="px-6 py-3 rounded-full bg-[#C5A059] text-[#0a1d13] font-bold text-sm hover:bg-amber-300 transition-colors cursor-pointer"
        >
          Return to Store
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#07160e] text-white flex flex-col select-none overflow-hidden font-sans">
      {/* Top Floating Navigation Bar */}
      <header className="absolute top-0 inset-x-0 z-40 px-4 py-3 sm:py-4 flex items-center justify-between bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-auto">
        <button
          onClick={onReturnHome}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white hover:text-[#C5A059] backdrop-blur-md border border-white/20 transition-all text-xs font-semibold shadow-lg cursor-pointer group"
          aria-label="Back to Store"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C5A059] animate-pulse" />
          <h1 className="text-xs sm:text-sm font-serif-luxury font-bold tracking-wider text-[#C5A059] uppercase drop-shadow-md">
            HAKKIVEDA Video Rituals
          </h1>
        </div>

        {/* Global Sound Control */}
        <button
          onClick={toggleMute}
          className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg"
          aria-label={isMuted ? 'Unmute videos' : 'Mute videos'}
          title={isMuted ? 'Click to unmute' : 'Click to mute'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-amber-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          )}
        </button>
      </header>

      {/* Main Vertical Reels Snapping Container */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-y-auto snap-y snap-mandatory scroll-smooth focus:outline-none"
        tabIndex={0}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {activeReels.map((reel, index) => {
          const isActive = index === activeIndex;
          const linkedProduct = reel.linkedProductId
            ? products.find((p) => p.id === reel.linkedProductId) || null
            : null;
          const isCaptionExpanded = Boolean(expandedCaptions[reel.id]);

          return (
            <div
              key={reel.id}
              ref={(el) => { reelRefs.current[index] = el; }}
              data-index={index}
              className="w-full h-[100dvh] snap-start snap-always relative flex items-center justify-center p-0 md:py-6 overflow-hidden bg-black"
            >
              {/* Desktop Portrait Frame wrapper */}
              <div className="relative w-full h-full md:max-w-[420px] md:h-[90vh] md:max-h-[850px] md:rounded-3xl overflow-hidden bg-black shadow-2xl md:border-2 md:border-[#C5A059]/40 flex flex-col justify-between">
                {/* Background Video or Thumbnail */}
                <div
                  className="relative w-full h-full bg-black cursor-pointer"
                  onClick={togglePlayPause}
                >
                  <video
                    ref={(el) => { videoRefs.current[index] = el; }}
                    src={reel.videoUrl}
                    poster={reel.posterUrl}
                    playsInline
                    loop
                    muted={isMuted}
                    preload={Math.abs(index - activeIndex) <= 1 ? 'metadata' : 'none'}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient overlays for contrast */}
                  <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />

                  {/* Play / Pause pulse animation indicator */}
                  {showPlayPulse && isActive && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                      <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/30 text-white flex items-center justify-center animate-ping">
                        {isPlaying ? (
                          <Play className="w-8 h-8 fill-current ml-1" />
                        ) : (
                          <Pause className="w-8 h-8" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Top Customer / Verified Badge */}
                  <div className="absolute top-16 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{reel.customerName}</span>
                        {reel.verifiedBadge && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                        )}
                      </div>

                      {reel.country && (
                        <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-medium border border-white/10 shadow-sm">
                          {reel.country}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Side floating controls (WhatsApp enquiry, Sound toggle) */}
                  <div className="absolute right-3.5 bottom-36 z-30 flex flex-col items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayPause();
                      }}
                      className="w-10 h-10 rounded-full bg-black/65 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg"
                      title={isPlaying ? 'Pause' : 'Play'}
                      aria-label="Play or pause reel"
                    >
                      {isActive && isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                      }}
                      className="w-10 h-10 rounded-full bg-black/65 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg"
                      title={isMuted ? 'Unmute' : 'Mute'}
                      aria-label="Toggle mute"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </button>

                    {reel.showWhatsappButton !== false && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWhatsappEnquiry(reel, linkedProduct);
                        }}
                        className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg"
                        title="Chat on WhatsApp"
                        aria-label="Enquire on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Bottom Reel Content Area */}
                  <div className="absolute bottom-4 inset-x-0 px-4 z-30 space-y-3 pointer-events-auto">
                    {/* Title & Caption */}
                    <div className="max-w-[85%] text-left">
                      <h2 className="text-sm sm:text-base font-bold font-serif-luxury text-[#C5A059] leading-snug drop-shadow-sm mb-1">
                        {reel.title}
                      </h2>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans opacity-95">
                        {isCaptionExpanded
                          ? reel.caption
                          : `${reel.caption.slice(0, 95)}${
                              reel.caption.length > 95 ? '...' : ''
                            }`}
                        {reel.caption.length > 95 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCaption(reel.id);
                            }}
                            className="ml-1 text-[#C5A059] font-bold hover:underline cursor-pointer"
                          >
                            {isCaptionExpanded ? 'less' : 'more'}
                          </button>
                        )}
                      </p>
                    </div>

                    {/* Associated Product Shopping Card */}
                    {linkedProduct && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(linkedProduct);
                        }}
                        className="p-3 rounded-2xl bg-black/85 backdrop-blur-xl border border-[#C5A059]/70 hover:border-[#C5A059] shadow-2xl flex items-center justify-between gap-3 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={linkedProduct.image}
                            alt={linkedProduct.name}
                            className="w-11 h-11 rounded-xl object-cover shrink-0 border border-[#C5A059]"
                            loading="lazy"
                          />
                          <div className="min-w-0">
                            <h3 className="text-xs font-bold text-white truncate group-hover:text-[#C5A059] transition-colors">
                              {linkedProduct.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-bold text-[#C5A059]">
                                {formatPrice(linkedProduct.priceINR)}
                              </span>
                              {linkedProduct.originalPriceINR && (
                                <span className="text-[11px] text-slate-400 line-through">
                                  {formatPrice(linkedProduct.originalPriceINR)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* SHOP NOW Button linking to /products/:slug */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProduct(linkedProduct);
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C5A059] hover:bg-amber-300 text-[#0a1d13] text-xs font-bold shrink-0 transition-all shadow-md cursor-pointer"
                        >
                          <span>SHOP NOW</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Desktop Scroll Up / Down Helpers */}
              <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-3 z-40">
                <button
                  onClick={() => scrollToReel(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  className="p-3 rounded-full bg-black/60 hover:bg-[#C5A059] hover:text-[#0a1d13] text-white disabled:opacity-30 disabled:hover:bg-black/60 disabled:hover:text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-xl"
                  title="Previous Reel (Up Arrow)"
                  aria-label="Previous reel"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>

                <div className="text-center text-xs font-mono font-bold text-[#C5A059]">
                  {activeIndex + 1}/{total}
                </div>

                <button
                  onClick={() => scrollToReel(activeIndex + 1)}
                  disabled={activeIndex === total - 1}
                  className="p-3 rounded-full bg-black/60 hover:bg-[#C5A059] hover:text-[#0a1d13] text-white disabled:opacity-30 disabled:hover:bg-black/60 disabled:hover:text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-xl"
                  title="Next Reel (Down Arrow)"
                  aria-label="Next reel"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
