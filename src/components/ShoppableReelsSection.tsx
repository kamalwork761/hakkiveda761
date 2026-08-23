import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Eye,
  MessageCircle,
  Zap,
  CheckCircle2,
  Sparkles,
  Share2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ShoppableReel, Product } from '../types/store';

interface ShoppableReelsSectionProps {
  onSelectProduct: (product: Product) => void;
}

export const ShoppableReelsSection: React.FC<ShoppableReelsSectionProps> = ({
  onSelectProduct,
}) => {
  const {
    shoppableReels,
    products,
    formatPrice,
    addToCart,
    setIsCheckoutOpen,
    currentCurrency,
  } = useStore();

  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [expandedCaption, setExpandedCaption] = useState(false);

  // Filter active reels and sort by sortOrder
  const activeReels = shoppableReels
    .filter((r) => r.active !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const activeReel: ShoppableReel | null =
    activeReelIndex !== null && activeReels[activeReelIndex]
      ? activeReels[activeReelIndex]
      : null;

  const activeProduct: Product | null = activeReel
    ? products.find((p) => p.id === activeReel.linkedProductId) || null
    : null;

  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartY = useRef<number | null>(null);
  const wheelDebounce = useRef<boolean>(false);

  // Keyboard navigation & Esc key
  useEffect(() => {
    if (activeReelIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeReels();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        goToPrevReel();
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        goToNextReel();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    const handlePopState = () => {
      closeReels();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [activeReelIndex, activeReels.length]);

  const openReelAt = (index: number) => {
    setActiveReelIndex(index);
    setIsPlaying(true);
    setExpandedCaption(false);
  };

  const closeReels = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setActiveReelIndex(null);
  };

  const goToNextReel = () => {
    if (activeReelIndex === null) return;
    if (activeReelIndex < activeReels.length - 1) {
      setActiveReelIndex(activeReelIndex + 1);
      setIsPlaying(true);
      setExpandedCaption(false);
    }
  };

  const goToPrevReel = () => {
    if (activeReelIndex === null) return;
    if (activeReelIndex > 0) {
      setActiveReelIndex(activeReelIndex - 1);
      setIsPlaying(true);
      setExpandedCaption(false);
    }
  };

  // Touch Swipe Handler for Vertical Navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped UP -> Next video
        goToNextReel();
      } else {
        // Swiped DOWN -> Prev video
        goToPrevReel();
      }
    }
    touchStartY.current = null;
  };

  // Mouse Wheel Scroll Handler
  const handleWheel = (e: React.WheelEvent) => {
    if (wheelDebounce.current) return;
    wheelDebounce.current = true;
    setTimeout(() => {
      wheelDebounce.current = false;
    }, 400);

    if (e.deltaY > 30) {
      goToNextReel();
    } else if (e.deltaY < -30) {
      goToPrevReel();
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Buy Now Action
  const handleBuyNow = (product: Product) => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    closeReels();
    onSelectProduct(product);
  };

  // WhatsApp Enquiry Action
  const handleWhatsappEnquiry = (reel: ShoppableReel, product?: Product | null) => {
    const text = encodeURIComponent(
      `Hi HAKKIVEDA! I watched your video reel "${reel.title}" and would like to inquire about ${product ? product.name : 'this treatment'}.`
    );
    window.open(`https://wa.me/919900000000?text=${text}`, '_blank');
  };

  if (activeReels.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 relative overflow-hidden border-t border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="shoppable-reels-heading text-center max-w-3xl mx-auto mb-12">
          <div
            className="eyebrow inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#123F2B]/10 font-bold text-xs uppercase tracking-widest mb-3 border border-[#B8891E]/30"
            style={{ color: '#B8891E', WebkitTextFillColor: '#B8891E', opacity: 1, visibility: 'visible' }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: '#B8891E' }} />
            <span style={{ color: '#B8891E', WebkitTextFillColor: '#B8891E' }}>Shoppable Rituals</span>
          </div>
          <h2
            className="text-3xl md:text-5xl font-serif font-bold tracking-tight mb-4"
            style={{ color: '#123F2B', WebkitTextFillColor: '#123F2B', opacity: 1, visibility: 'visible' }}
          >
            HAKKIVEDA <span className="highlight" style={{ color: '#D4AF37', WebkitTextFillColor: '#D4AF37' }}>VIDEO RITUALS</span>
          </h2>
          <p
            className="text-base md:text-lg font-sans leading-relaxed"
            style={{ color: '#405B4A', WebkitTextFillColor: '#405B4A', opacity: 1, visibility: 'visible' }}
          >
            Watch real customer hair transformation journeys, 400-year-old Hakki-Pikki brewing traditions, and tap to shop authentic herbal formulas directly.
          </p>
        </div>

        {/* Reels Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {activeReels.map((reel, index) => {
            const product = products.find((p) => p.id === reel.linkedProductId);

            return (
              <div
                key={reel.id}
                onClick={() => openReelAt(index)}
                className="group relative rounded-2xl overflow-hidden aspect-[9/16] bg-slate-900 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 border border-[var(--brand-gold,#D4AF37)]/30 hover:border-[var(--brand-gold,#D4AF37)]"
              >
                {/* Poster Image / Video Thumbnail */}
                <img
                  src={reel.posterUrl || '/images/hakkiveda_108_oil_gold.jpg'}
                  alt={reel.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 group-hover:from-black/90 transition-all" />

                {/* Verified Customer Badge Top Left */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="truncate max-w-[100px]">{reel.customerName}</span>
                  {reel.verifiedBadge && (
                    <CheckCircle2 className="w-3 h-3 text-[var(--brand-gold,#D4AF37)] shrink-0" />
                  )}
                </div>

                {/* Country Pill Top Right */}
                {reel.country && (
                  <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[10px] font-semibold border border-white/10">
                    {reel.country}
                  </div>
                )}

                {/* Play Icon Center Button */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[var(--brand-gold,#D4AF37)]/90 text-[var(--brand-primary-dark,#123F2B)] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 md:w-7 md:h-7 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Bottom Content Area */}
                <div className="absolute bottom-0 inset-x-0 p-3.5 z-10 text-white">
                  <h3 className="text-sm md:text-base font-bold font-serif leading-tight mb-1 line-clamp-1 group-hover:text-[var(--brand-gold,#D4AF37)] transition-colors">
                    {reel.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 mb-2 font-sans opacity-90">
                    {reel.caption}
                  </p>

                  {/* Product Mini Tag */}
                  {product && (
                    <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-8 h-8 rounded-lg object-cover shrink-0 border border-white/30"
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold truncate text-white">
                            {product.name}
                          </p>
                          <p className="text-[10px] font-bold text-[var(--brand-gold,#D4AF37)]">
                            {formatPrice(product.priceINR)}
                          </p>
                        </div>
                      </div>
                      <span className="p-1.5 rounded-lg bg-[var(--brand-gold,#D4AF37)] text-[var(--brand-primary-dark,#123F2B)] text-[10px] font-bold shrink-0">
                        Shop
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Shoppable Reels Viewer Modal */}
      {activeReelIndex !== null && activeReel && (
        <div
          className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-fade-in select-none"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close Button Top Right */}
          <button
            onClick={closeReels}
            className="fixed top-4 right-4 z-50 p-3 rounded-full bg-black/70 hover:bg-black text-white hover:text-[var(--brand-gold,#D4AF37)] border border-white/20 transition-all cursor-pointer shadow-xl"
            aria-label="Close vertical video reels"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Reel Progress Bar Top */}
          <div className="fixed top-4 left-4 right-16 md:left-1/2 md:-translate-x-1/2 md:max-w-md z-50 flex gap-1.5 px-2">
            {activeReels.map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden"
              >
                <div
                  className={`h-full bg-[var(--brand-gold,#D4AF37)] transition-all duration-300 ${
                    i === activeReelIndex
                      ? 'w-full'
                      : i < activeReelIndex
                      ? 'w-full opacity-60'
                      : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Desktop Chevron Navigation Side Controls */}
          <button
            onClick={goToPrevReel}
            disabled={activeReelIndex === 0}
            className={`hidden md:flex fixed left-8 top-1/2 -translate-y-1/2 z-40 p-4 rounded-full bg-black/60 text-white border border-white/20 transition-all ${
              activeReelIndex === 0
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:bg-[var(--brand-gold,#D4AF37)] hover:text-[var(--brand-primary-dark,#123F2B)] cursor-pointer'
            }`}
            aria-label="Previous Reel"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNextReel}
            disabled={activeReelIndex === activeReels.length - 1}
            className={`hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 p-4 rounded-full bg-black/60 text-white border border-white/20 transition-all ${
              activeReelIndex === activeReels.length - 1
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:bg-[var(--brand-gold,#D4AF37)] hover:text-[var(--brand-primary-dark,#123F2B)] cursor-pointer'
            }`}
            aria-label="Next Reel"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Vertical Video Frame */}
          <div className="relative w-full h-[100dvh] max-w-md md:h-[88vh] md:max-h-[820px] bg-black md:rounded-3xl overflow-hidden shadow-2xl border-0 md:border-2 border-[var(--brand-gold,#D4AF37)]/40 flex flex-col justify-between">
            {/* HTML5 Video Tag */}
            <div className="relative w-full h-full bg-black">
              <video
                ref={videoRef}
                key={activeReel.id}
                src={activeReel.videoUrl}
                poster={activeReel.posterUrl}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={togglePlay}
              />

              {/* Gradient Overlays for Readability */}
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />

              {/* Top Control Buttons (Mute & Play Status) */}
              <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-30">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>{activeReel.customerName}</span>
                    {activeReel.verifiedBadge && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-gold,#D4AF37)]" />
                    )}
                  </div>
                  {activeReel.country && (
                    <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-medium border border-white/10">
                      {activeReel.country}
                    </span>
                  )}
                </div>

                <button
                  onClick={toggleMute}
                  className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-emerald-400" />
                  )}
                </button>
              </div>

              {/* Pause Overlay Indicator when paused */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-[var(--brand-gold,#D4AF37)] text-[var(--brand-primary-dark,#123F2B)] flex items-center justify-center shadow-2xl transform scale-110">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </div>
              )}

              {/* Side Floating Action Controls */}
              <div className="absolute right-3 bottom-32 z-30 flex flex-col items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => handleWhatsappEnquiry(activeReel, activeProduct)}
                  className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg"
                  title="Enquire on WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Bottom Overlay Info & Shoppable Product Card */}
              <div className="absolute bottom-4 inset-x-0 px-4 z-30 text-white">
                <div className="mb-3 max-w-[85%]">
                  <h3 className="text-base font-bold font-serif text-[var(--brand-gold,#D4AF37)] mb-1">
                    {activeReel.title}
                  </h3>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {expandedCaption
                      ? activeReel.caption
                      : `${activeReel.caption.slice(0, 90)}${
                          activeReel.caption.length > 90 ? '...' : ''
                        }`}
                    {activeReel.caption.length > 90 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCaption(!expandedCaption);
                        }}
                        className="ml-1 text-[var(--brand-gold,#D4AF37)] font-bold hover:underline"
                      >
                        {expandedCaption ? ' less' : ' more'}
                      </button>
                    )}
                  </p>
                </div>

                {/* Linked Product Shoppable Box */}
                {activeProduct && (
                  <div className="p-3 rounded-2xl bg-black/80 backdrop-blur-xl border border-[var(--brand-gold,#D4AF37)]/60 shadow-2xl space-y-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={activeProduct.image}
                          alt={activeProduct.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[var(--brand-gold,#D4AF37)]"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">
                            {activeProduct.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm font-bold text-[var(--brand-gold,#D4AF37)]">
                              {formatPrice(activeProduct.priceINR)}
                            </span>
                            {activeProduct.originalPriceINR && (
                              <span className="text-xs text-slate-400 line-through">
                                {formatPrice(activeProduct.originalPriceINR)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {activeReel.showViewProductButton !== false && (
                        <button
                          onClick={() => {
                            if (videoRef.current) videoRef.current.pause();
                            onSelectProduct(activeProduct);
                          }}
                          className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      )}

                      {activeReel.showAddToCartButton !== false && (
                        <button
                          onClick={() => addToCart(activeProduct, 1)}
                          className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      )}

                      {activeReel.showBuyNowButton !== false && (
                        <button
                          onClick={() => handleBuyNow(activeProduct)}
                          className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-[var(--brand-gold,#D4AF37)] hover:bg-amber-400 text-[var(--brand-primary-dark,#123F2B)] font-bold text-xs transition-all cursor-pointer shadow-md"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>Buy Now</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Swipe Guidance Hints */}
          <div className="fixed bottom-3 inset-x-0 text-center text-slate-400 text-[11px] font-medium pointer-events-none md:hidden z-50">
            Swipe UP/DOWN to watch next reel
          </div>
        </div>
      )}
    </section>
  );
};
