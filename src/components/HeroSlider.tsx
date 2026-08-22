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
      <section className="relative w-full h-[520px] sm:h-[580px] lg:h-[620px] flex items-center justify-center bg-[var(--brand-primary-dark)] overflow-hidden">
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
    if (deltaX > 50) {
      setCurrentSlideIndex((prev) => (prev - 1 + slidesToRender.length) % slidesToRender.length);
    } else if (deltaX < -50) {
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

    if (link === '#ai-quiz' || link === '#quiz') {
      setIsQuizOpen(true);
      return;
    }

    if (link === '#b2b' || link === '#b2b-export' || link === '/b2b-enquiry' || link === '/b2b') {
      const b2bEl = document.getElementById('b2b') || document.getElementById('b2b-export');
      if (b2bEl && link !== '/b2b-enquiry') {
        b2bEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.history.pushState({}, '', '/b2b-enquiry');
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (link && link.startsWith('#')) {
      const targetEl = document.querySelector(link);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[540px] sm:h-[580px] lg:h-[620px] flex items-center overflow-hidden bg-white dark:bg-[var(--brand-primary-dark,#0B1D13)]"
    >
      {/* Media & Overlay Layer */}
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
              isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              zIndex: isActive ? 2 : 1,
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
                className="w-full h-full object-cover transform scale-105"
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
                  className="w-full h-full object-cover transform scale-105"
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
                zIndex: 1,
                pointerEvents: 'none',
                backgroundColor: slide.overlayColor || '#000000',
                opacity: (slide.overlayOpacity ?? 0) / 100,
                transitionDuration: `${transitionSpeed}ms`,
              }}
            />
          </div>
        );
      })}

      {/* Hero Content Layer (z-index 3) */}
      {slidesToRender.map((slide, idx) => {
        const isActive = idx === currentSlideIndex;

        return (
          <div
            key={`slide-content-${slide.id || idx}`}
            className={`hero-content absolute inset-0 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full flex items-end sm:items-center pb-16 sm:pb-0 transition-all ease-in-out ${
              isActive
                ? 'opacity-100 translate-y-0 pointer-events-auto visible'
                : 'opacity-0 translate-y-4 pointer-events-none invisible hidden'
            }`}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 3,
              opacity: isActive ? 1 : 0,
              visibility: isActive ? 'visible' : 'hidden',
              pointerEvents: isActive ? 'auto' : 'none',
              transitionDuration: `${transitionSpeed}ms`,
            }}
          >
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end sm:items-center">
              {/* Left Column: CTA Button(s) */}
              <div
                className={`lg:col-span-7 flex flex-wrap items-center gap-3 sm:gap-4 ${
                  slide.textPosition === 'CENTER'
                    ? 'justify-center mx-auto lg:col-span-12'
                    : slide.textPosition === 'RIGHT'
                    ? 'justify-end ml-auto lg:col-span-7'
                    : 'justify-start'
                }`}
              >
                {/* Main CTA Button */}
                {(slide.ctaText || 'Shop Tribal Elixir') && (
                  <a
                    href={slide.ctaLink || '#products'}
                    onClick={(e) => {
                      if (slide.ctaLink?.startsWith('#') || slide.ctaLink?.startsWith('/')) {
                        e.preventDefault();
                      }
                      handleCtaClick(slide.id, slide.ctaLink || '#products');
                    }}
                    className="bg-[var(--brand-gold,#C9A84E)] text-[#123F2A] hover:bg-white text-xs sm:text-sm font-bold uppercase tracking-[0.2em] px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2.5 cursor-pointer font-sans select-none"
                  >
                    <span>{slide.ctaText || 'Shop Tribal Elixir'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                )}

                {/* Optional Secondary CTA Button */}
                {slide.secondaryCtaText && (
                  <a
                    href={slide.secondaryCtaLink || '#ai-quiz'}
                    onClick={(e) => {
                      if (slide.secondaryCtaLink?.startsWith('#') || slide.secondaryCtaLink?.startsWith('/')) {
                        e.preventDefault();
                      }
                      handleCtaClick(slide.id, slide.secondaryCtaLink || '#ai-quiz');
                    }}
                    className="border border-[var(--brand-gold,#C9A84E)]/70 text-white hover:text-[var(--brand-gold,#C9A84E)] px-6 sm:px-8 py-3.5 sm:py-4 font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.18em] backdrop-blur-md bg-black/40 hover:bg-black/60 transition-all rounded-xl flex items-center gap-2 cursor-pointer shadow-lg select-none"
                  >
                    <Sparkles className="w-4 h-4 text-[var(--brand-gold,#C9A84E)]" />
                    <span>{slide.secondaryCtaText}</span>
                  </a>
                )}
              </div>

              {/* Right Feature Card (AI Trichology Engine) */}
              {slide.textPosition !== 'CENTER' && (
                <div className="hidden lg:flex lg:col-span-5 justify-end">
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

      {/* Controls & Dots Navigation */}
      {slidesToRender.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentSlideIndex((prev) => (prev - 1 + slidesToRender.length) % slidesToRender.length)
            }
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] transition-all cursor-pointer"
            style={{ zIndex: 4 }}
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slidesToRender.length)}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] transition-all cursor-pointer"
            style={{ zIndex: 4 }}
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2"
            style={{ zIndex: 4 }}
          >
            {slidesToRender.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  idx === currentSlideIndex ? 'w-8 bg-[var(--brand-gold)]' : 'w-2 bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

