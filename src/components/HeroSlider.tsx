import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const normalizeMediaUrl = (url?: string): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('uploads/')) {
    return '/' + trimmed;
  }
  return trimmed;
};

export const HeroSlider: React.FC = () => {
  const {
    heroSlides,
    heroSliderSettings,
    dbSyncStatus,
    setIsQuizOpen,
    setIsB2BModalOpen,
    playSound,
    trackSlideImpression,
    trackSlideClick,
  } = useStore();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const touchStartX = useRef<number | null>(null);
  const lastTrackedSlideId = useRef<string | null>(null);

  // Filter active and scheduled slides from server store
  const slidesToRender = useMemo(() => {
    return (Array.isArray(heroSlides) ? heroSlides : [])
      .filter((s) => {
        if (!s) return false;
        if (s.status === 'DRAFT') return false;
        if (s.status === 'SCHEDULED' && s.startDate && s.endDate) {
          const today = new Date().toISOString().split('T')[0];
          if (today < s.startDate || today > s.endDate) return false;
        }
        if (s.active === false && s.status !== 'ACTIVE') return false;
        return true;
      })
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }, [heroSlides]);

  const totalSlides = slidesToRender.length;
  const autoPlay = heroSliderSettings?.autoPlay ?? true;
  const autoPlayDelay = heroSliderSettings?.autoPlayDelay || 6;
  const pauseOnHover = heroSliderSettings?.pauseOnHover ?? true;
  const infiniteLoop = heroSliderSettings?.infiniteLoop ?? true;
  const transitionSpeed = heroSliderSettings?.transitionSpeed || 700;

  // Preload all hero slide images once and upcoming images for smooth, flicker-free transitions
  useEffect(() => {
    if (!slidesToRender.length) return;

    slidesToRender.forEach((slide) => {
      const isVideo =
        slide.mediaType === 'VIDEO' ||
        Boolean(
          slide.backgroundVideo ||
            (slide.image && /\.(mp4|webm|ogg|mov)($|\?)/i.test(slide.image))
        );

      if (!isVideo) {
        if (slide.image) {
          const img = new Image();
          img.src = normalizeMediaUrl(slide.image);
        }
        if (slide.mobileImage) {
          const mobImg = new Image();
          mobImg.src = normalizeMediaUrl(slide.mobileImage);
        }
      }

      // Preload 3D foreground cutout asset if present
      if (slide.enable3dOverflow && slide.foregroundCutoutUrl) {
        const fgImg = new Image();
        fgImg.src = normalizeMediaUrl(slide.foregroundCutoutUrl);
      }
    });
  }, [slidesToRender]);

  // Keep current slide index within valid bounds if slide list changes
  useEffect(() => {
    if (currentSlideIndex >= totalSlides && totalSlides > 0) {
      setCurrentSlideIndex(0);
    }
  }, [totalSlides, currentSlideIndex]);

  // Track impression only once when active slide changes
  useEffect(() => {
    if (dbSyncStatus !== 'loading' && slidesToRender[currentSlideIndex]) {
      const activeSlideId = slidesToRender[currentSlideIndex].id;
      if (activeSlideId && lastTrackedSlideId.current !== activeSlideId) {
        lastTrackedSlideId.current = activeSlideId;
        try {
          trackSlideImpression(activeSlideId);
        } catch (err) {
          console.error('[HeroSlider] Failed to track slide impression:', err);
        }
      }
    }
  }, [currentSlideIndex, totalSlides, dbSyncStatus, slidesToRender, trackSlideImpression]);

  // Stable Single Autoplay Timer
  useEffect(() => {
    if (dbSyncStatus === 'loading') return;
    if (totalSlides <= 1) return;
    if (!autoPlay) return;
    if (isHovered && pauseOnHover) return;

    const delayMs = Math.max(2000, autoPlayDelay * 1000);
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => {
        if (prev >= totalSlides - 1) {
          return infiniteLoop ? 0 : prev;
        }
        return prev + 1;
      });
    }, delayMs);

    return () => clearInterval(interval);
  }, [totalSlides, autoPlay, autoPlayDelay, pauseOnHover, infiniteLoop, isHovered, dbSyncStatus]);

  // Render a clean hero loading state while store data is hydrating from server
  if (dbSyncStatus === 'loading') {
    return (
      <section className="relative w-full h-[clamp(460px,66vh,540px)] sm:h-[580px] lg:h-[620px] flex items-center justify-center bg-[var(--brand-primary-dark)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80 animate-pulse" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 w-full space-y-6">
          <div className="h-6 w-48 bg-white/10 rounded-full animate-pulse" />
          <div className="h-16 w-3/4 max-w-2xl bg-white/10 rounded-lg animate-pulse" />
          <div className="h-10 w-1/2 max-w-lg bg-white/10 rounded-lg animate-pulse" />
          <div className="h-12 w-40 bg-[var(--brand-gold)]/20 rounded-md animate-pulse" />
        </div>
      </section>
    );
  }

  // If saved hero slides list is empty after hydration, gracefully hide the section
  if (slidesToRender.length === 0) return null;

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!heroSliderSettings?.swipeSupport) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!heroSliderSettings?.swipeSupport || touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 40) {
      setCurrentSlideIndex((prev) => (prev - 1 + slidesToRender.length) % slidesToRender.length);
    } else if (deltaX < -40) {
      setCurrentSlideIndex((prev) => (prev + 1) % slidesToRender.length);
    }
    touchStartX.current = null;
  };

  const handleCtaClick = (slideId: string, link?: string) => {
    playSound('cta_click');
    if (slideId) {
      try {
        trackSlideClick(slideId);
      } catch (err) {
        console.error('[HeroSlider] Failed to track slide click:', err);
      }
    }

    const resolvedLink = link?.trim() || '/tribal-wellness';

    // 1. External URLs
    if (resolvedLink.startsWith('http://') || resolvedLink.startsWith('https://')) {
      window.open(resolvedLink, '_blank', 'noopener,noreferrer');
      return;
    }

    // 2. AI Quiz modal trigger
    if (resolvedLink === '#ai-quiz' || resolvedLink === '#quiz' || resolvedLink === '/quiz') {
      setIsQuizOpen(true);
      return;
    }

    // 3. B2B routes
    if (resolvedLink === '#b2b' || resolvedLink === '#b2b-export' || resolvedLink === '/b2b-enquiry' || resolvedLink === '/b2b') {
      const b2bEl = document.getElementById('b2b') || document.getElementById('b2b-export');
      if (b2bEl && resolvedLink !== '/b2b-enquiry') {
        b2bEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.history.pushState({}, '', '/b2b-enquiry');
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // 4. Direct SPA Route Navigation (/tribal-wellness, /hair-care, /skin-care, /products/:slug, etc.)
    if (resolvedLink.startsWith('/')) {
      window.history.pushState({}, '', resolvedLink);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 5. Category query params e.g. #category-Hair Care
    if (resolvedLink.startsWith('#category-') || resolvedLink.startsWith('#category=')) {
      const catName = resolvedLink.replace('#category-', '').replace('#category=', '');
      window.history.pushState({}, '', `/?category=${encodeURIComponent(catName)}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 6. Section Hash anchors on homepage (#brand-story, #categories, #collections, etc.)
    if (resolvedLink.startsWith('#')) {
      const targetId = resolvedLink.replace('#', '');
      let targetEl = document.getElementById(targetId);
      if (!targetEl && (targetId === 'products' || targetId === 'collections')) {
        targetEl = document.getElementById('categories') || document.getElementById('bestsellers');
      }
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      } else if (targetId === 'products') {
        // If #products has no anchor, route to /tribal-wellness
        window.history.pushState({}, '', '/tribal-wellness');
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - (rect.left + rect.width * 0.7)) / (rect.width / 2);
    const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setMouseOffset({
      x: Math.max(-14, Math.min(14, relX * 14)),
      y: Math.max(-10, Math.min(10, relY * 10)),
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full max-w-full h-[clamp(460px,66vh,540px)] sm:h-[580px] lg:h-[620px] overflow-hidden sm:overflow-x-clip sm:overflow-y-visible select-none flex items-center bg-white dark:bg-[var(--brand-primary-dark,#0B1D13)]"
    >
      {/* 1. CLIPPED MEDIA & OVERLAY LAYER (z-index: 1) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        {slidesToRender.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          const isVideoUrl = (url?: string) =>
            Boolean(
              url &&
                (/\.(mp4|webm|ogg|mov)($|\?)/i.test(url) ||
                  url.startsWith('data:video/') ||
                  url.includes('/uploads/video'))
            );

          const isVideo =
            slide.mediaType === 'VIDEO'
              ? true
              : slide.mediaType === 'IMAGE'
              ? false
              : isVideoUrl(slide.backgroundVideo) || isVideoUrl(slide.image);

          const rawVideoUrl = slide.backgroundVideo || (isVideoUrl(slide.image) ? slide.image : '');
          const rawImageUrl = slide.image || slide.mobileImage || '/images/hero_tribal_elders.jpg';

          const videoUrl = normalizeMediaUrl(rawVideoUrl);
          const imageUrl = normalizeMediaUrl(rawImageUrl);
          const mobileImageUrl = normalizeMediaUrl(slide.mobileImage);

          return (
            <div
              key={`slide-media-${slide.id || idx}`}
              className={`absolute inset-0 transition-opacity ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transitionDuration: `${transitionSpeed}ms`,
              }}
            >
              {isVideo && videoUrl ? (
                <video
                  src={videoUrl}
                  autoPlay={isActive}
                  preload={isActive ? 'metadata' : 'none'}
                  muted
                  loop
                  playsInline
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  className="w-full h-full object-cover object-center sm:scale-105"
                />
              ) : (
                <picture className="w-full h-full block">
                  {mobileImageUrl && (
                    <source media="(max-width: 640px)" srcSet={mobileImageUrl} />
                  )}
                  <img
                    src={imageUrl}
                    alt={slide.altText || slide.title || 'HakkiVeda Hero Banner'}
                    onError={(e) => {
                      const fallback = '/images/hakkiveda_108_oil_gold.jpg';
                      if (e.currentTarget.src !== window.location.origin + fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                    className="w-full h-full object-cover object-center sm:scale-105"
                    loading="eager"
                    decoding="async"
                  />
                </picture>
              )}

              {/* Hero Overlay */}
              <div
                className="hero-overlay absolute inset-0 transition-opacity pointer-events-none"
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  backgroundColor: slide.overlayColor || '#000000',
                  opacity: (slide.overlayOpacity ?? 0) / 100,
                  transitionDuration: `${transitionSpeed}ms`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* 2. DEDICATED 3D LAYERED FOREGROUND OVERFLOW (z-index: 10) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden sm:overflow-visible w-full max-w-full" style={{ zIndex: 10 }}>
        {slidesToRender.map((slide, idx) => {
          if (!slide.enable3dOverflow || !slide.foregroundCutoutUrl) return null;
          const isActive = idx === currentSlideIndex;
          const cutoutUrl = normalizeMediaUrl(slide.foregroundCutoutUrl);

          // Desktop positioning settings
          const dPosX = slide.desktopPosX ?? 70;
          const dPosY = slide.desktopPosY ?? 0;
          const dWidth = slide.desktopWidth ?? 440;
          const dOverflow = slide.desktopBottomOverflow ?? 130;

          // Mobile positioning settings
          const mPosX = Math.min(55, Math.max(35, slide.mobilePosX ?? 50));
          const mPosY = slide.mobilePosY ?? 0;
          const mWidth = Math.min(240, slide.mobileWidth ?? 220);
          const mOverflow = slide.mobileBottomOverflow ?? 65;
          const disableMobile = slide.disableMobileOverflow ?? false;

          return (
            <div
              key={`slide-foreground-3d-${slide.id || idx}`}
              className={`absolute inset-0 pointer-events-none transition-opacity ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0'
              } ${disableMobile ? 'hidden sm:block' : 'block'}`}
              style={{
                transitionDuration: `${transitionSpeed}ms`,
              }}
            >
              {/* Desktop 3D Cutout Layer (Extending beyond bottom boundary into next section) */}
              <div
                className="hidden sm:block absolute select-none pointer-events-none transition-transform duration-300 ease-out"
                style={{
                  left: `${dPosX}%`,
                  bottom: `-${dOverflow}px`,
                  width: `${dWidth}px`,
                  transform: `translateX(-50%) translate(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.4 + dPosY}px)`,
                }}
              >
                <img
                  src={cutoutUrl}
                  alt={slide.title || '3D Foreground Subject Cutout'}
                  className="w-full h-auto object-contain pointer-events-none select-none hero-3d-overflow-shadow animate-subtle-hero-float"
                  loading="eager"
                  decoding="async"
                />
              </div>

              {/* Mobile 3D Cutout Layer (Adjusted overflow & position for small viewports) */}
              {!disableMobile && (
                <div
                  className="block sm:hidden absolute select-none pointer-events-none max-w-[calc(100vw-32px)]"
                  style={{
                    left: `${mPosX}%`,
                    bottom: `-${mOverflow}px`,
                    width: `${mWidth}px`,
                    transform: `translateX(-50%) translateY(${mPosY}px)`,
                  }}
                >
                  <img
                    src={cutoutUrl}
                    alt={slide.title || '3D Foreground Subject Cutout'}
                    className="w-full h-auto max-w-full object-contain pointer-events-none select-none hero-3d-overflow-shadow"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3 & 4. HERO CONTENT LAYER: CTA BUTTONS (z-index: 20) & AI TRICHOLOGY ENGINE (z-index: 30) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden sm:overflow-visible w-full max-w-full" style={{ zIndex: 20 }}>
        {slidesToRender.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;

          return (
            <div
              key={`slide-content-${slide.id || idx}`}
              className={`hero-content absolute inset-0 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full flex items-end sm:items-center pb-10 sm:pb-0 transition-all ease-in-out ${
                isActive
                  ? 'opacity-100 translate-y-0 pointer-events-auto visible'
                  : 'opacity-0 translate-y-4 pointer-events-none invisible hidden'
              }`}
              style={{
                opacity: isActive ? 1 : 0,
                visibility: isActive ? 'visible' : 'hidden',
                pointerEvents: isActive ? 'auto' : 'none',
                transitionDuration: `${transitionSpeed}ms`,
              }}
            >
              <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-end sm:items-center">
                {/* Left Column: CTA Button(s) (z-index: 20) */}
                <div
                  className={`relative lg:col-span-7 flex flex-wrap items-center gap-2.5 sm:gap-3.5 ${
                    slide.textPosition === 'CENTER'
                      ? 'justify-center mx-auto lg:col-span-12'
                      : slide.textPosition === 'RIGHT'
                      ? 'justify-end ml-auto lg:col-span-7'
                      : 'justify-start'
                  }`}
                  style={{ zIndex: 20 }}
                >
                  {/* Main Primary CTA Button */}
                  {Boolean(slide.ctaText || 'Shop Tribal Elixir') && (() => {
                    const rawMainLink = slide.ctaLink?.trim();
                    const mainCtaDestination = rawMainLink && rawMainLink !== '#products'
                      ? rawMainLink
                      : (slide.id === 'slide-1' || (slide.ctaText && slide.ctaText.toLowerCase().includes('tribal elixir'))
                          ? '/tribal-wellness'
                          : (rawMainLink || '/tribal-wellness'));

                    return (
                      <a
                        href={mainCtaDestination}
                        onClick={(e) => {
                          if (mainCtaDestination.startsWith('#') || mainCtaDestination.startsWith('/')) {
                            e.preventDefault();
                          }
                          handleCtaClick(slide.id, mainCtaDestination);
                        }}
                        className="bg-[var(--brand-gold,#C9A84E)] text-[#0F2E22] hover:bg-white text-xs sm:text-sm font-bold uppercase tracking-[0.14em] sm:tracking-[0.2em] px-5 xs:px-6 sm:px-9 py-3 sm:py-4 rounded-xl shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer font-sans select-none min-h-[46px] sm:min-h-[48px]"
                      >
                        <span className="font-bold">{slide.ctaText || 'Shop Tribal Elixir'}</span>
                        <ChevronRight className="w-4 h-4 text-[#0F2E22] shrink-0" />
                      </a>
                    );
                  })()}

                  {/* Secondary CTA Button (Ivory / Forest Green / Gold Highlight) */}
                  {slide.secondaryCtaText && (
                    <a
                      href={slide.secondaryCtaLink || '#ai-quiz'}
                      onClick={(e) => {
                        if (slide.secondaryCtaLink?.startsWith('#') || slide.secondaryCtaLink?.startsWith('/')) {
                          e.preventDefault();
                        }
                        handleCtaClick(slide.id, slide.secondaryCtaLink || '#ai-quiz');
                      }}
                      className="hero-secondary-cta bg-[#FFFDF5] hover:bg-[#FAF7F2] active:bg-[#F3EDE2] text-[#0F2E22] border border-[#C9A84E]/70 px-5 xs:px-6 sm:px-8 py-3 sm:py-4 font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.12em] sm:tracking-[0.18em] transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md select-none min-h-[46px] sm:min-h-[48px]"
                    >
                      <Sparkles className="w-4 h-4 text-[#C9A84E] shrink-0" />
                      <span className="text-[#0F2E22] font-bold">{slide.secondaryCtaText}</span>
                    </a>
                  )}
                </div>

                {/* Right Feature Card (AI Trichology Engine) (z-index: 30) */}
                {slide.textPosition !== 'CENTER' && (
                  <div className="hidden lg:flex lg:col-span-5 justify-end relative" style={{ zIndex: 30 }}>
                    <div className="w-[320px] p-6 bg-black/60 backdrop-blur-xl border border-[var(--brand-gold)]/50 rounded-2xl space-y-4 gold-border-glow shadow-2xl transform hover:scale-102 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[var(--brand-gold)] bg-[var(--brand-gold)]/10 px-2.5 py-1 rounded">
                          AI Trichology Engine
                        </span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-[var(--brand-primary-dark)] border-2 border-[var(--brand-gold)] flex items-center justify-center shrink-0 shadow-lg">
                          <Sparkles className="w-8 h-8 text-[var(--brand-gold)]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold font-serif-luxury text-slate-100">Personalized Hair Formula</h4>
                          <p className="text-xs text-slate-300 mt-1 leading-snug">Get custom tribal herbal dosage and scalp diagnostics in 60 seconds.</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          playSound('cta_click');
                          setIsQuizOpen(true);
                        }}
                        className="w-full bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-gold-light)] text-[var(--brand-primary-dark)] py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Analyze My Hair Now</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. SLIDER CONTROLS & DOTS NAVIGATION (z-index: 40) */}
      {slidesToRender.length > 1 && (
        <div className="pointer-events-none" style={{ zIndex: 40 }}>
          {/* Desktop Only Navigation Arrows (Hidden on Mobile/Tablet viewports < 1024px) */}
          <button
            onClick={() =>
              setCurrentSlideIndex((prev) => (prev - 1 + slidesToRender.length) % slidesToRender.length)
            }
            className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 border border-white/20 text-white items-center justify-center hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] transition-all cursor-pointer pointer-events-auto shadow-lg"
            style={{ zIndex: 40 }}
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slidesToRender.length)}
            className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 border border-white/20 text-white items-center justify-center hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] transition-all cursor-pointer pointer-events-auto shadow-lg"
            style={{ zIndex: 40 }}
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Pagination */}
          <div
            className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 pointer-events-auto"
            style={{ zIndex: 40 }}
          >
            {slidesToRender.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlideIndex
                    ? 'w-6 sm:w-8 bg-[var(--brand-gold,#C9A84E)] shadow-xs'
                    : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

