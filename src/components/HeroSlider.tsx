import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ChevronRight, ChevronLeft, ShieldCheck, Flame, Award } from 'lucide-react';
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
    playSound,
    trackSlideImpression,
    trackSlideClick,
  } = useStore();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Filter active and scheduled slides from server store
  const activeSlides = (Array.isArray(heroSlides) ? heroSlides : [])
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

  const slidesToRender = activeSlides;

  // Keep current slide index within valid bounds if slide list changes
  useEffect(() => {
    if (currentSlideIndex >= slidesToRender.length) {
      setCurrentSlideIndex(0);
    }
  }, [slidesToRender.length, currentSlideIndex]);

  // Track impression on active slide change
  useEffect(() => {
    if (dbSyncStatus !== 'loading' && slidesToRender[currentSlideIndex]) {
      try {
        trackSlideImpression(slidesToRender[currentSlideIndex].id);
      } catch (err) {
        console.error('[HeroSlider] Failed to track slide impression:', err);
      }
    }
  }, [currentSlideIndex, slidesToRender.length, dbSyncStatus]);

  // Autoplay Timer
  useEffect(() => {
    if (dbSyncStatus === 'loading') return;
    if (slidesToRender.length <= 1) return;
    if (!heroSliderSettings?.autoPlay) return;
    if (isHovered && heroSliderSettings?.pauseOnHover) return;

    const delayMs = (heroSliderSettings?.autoPlayDelay || 6) * 1000;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => {
        if (prev >= slidesToRender.length - 1) {
          return heroSliderSettings?.infiniteLoop ? 0 : prev;
        }
        return prev + 1;
      });
    }, delayMs);

    return () => clearInterval(interval);
  }, [slidesToRender.length, heroSliderSettings, isHovered, dbSyncStatus]);

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
      className="relative w-full h-[520px] sm:h-[580px] lg:h-[620px] flex items-center overflow-hidden bg-[var(--brand-primary-dark)]"
    >
      {/* Media Layer: Map through all active hero slides dynamically */}
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
            key={slide.id || `slide-media-${idx}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {isVideo && videoUrl ? (
              <video
                key={`video-${slide.id}-${videoUrl}`}
                src={videoUrl}
                autoPlay
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
                  key={`img-${slide.id}-${imageUrl}`}
                  src={imageUrl}
                  alt={slide.altText || slide.title || 'HakkiVeda Hero Banner'}
                  onError={(e) => {
                    const fallback = '/images/hakkiveda_108_oil_gold.jpg';
                    if (e.currentTarget.src !== window.location.origin + fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                  className={`w-full h-full object-cover transform scale-105 ${
                    slide.animation === 'kenburns' ? 'animate-pulse' : ''
                  }`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </picture>
            )}

            {/* Customizable Overlay Color & Opacity */}
            <div
              className="absolute inset-0 transition-opacity duration-700"
              style={{
                backgroundColor: slide.overlayColor || 'var(--brand-primary-dark)',
                opacity: (slide.overlayOpacity ?? 75) / 100,
              }}
            />

            {/* Gradient luxury depth vignetting */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-primary-dark)] via-transparent to-black/30 z-10" />
          </div>
        );
      })}

      {/* Content Layer: Map through all active hero slides dynamically */}
      {slidesToRender.map((slide, idx) => {
        const isActive = idx === currentSlideIndex;

        return (
          <div
            key={`slide-content-${slide.id || idx}`}
            className={`relative z-20 max-w-7xl mx-auto px-6 sm:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-all duration-700 ease-in-out ${
              isActive
                ? 'opacity-100 translate-y-0 z-20 pointer-events-auto block'
                : 'opacity-0 translate-y-4 z-0 pointer-events-none hidden'
            }`}
          >
            <div
              className={`lg:col-span-7 space-y-5 sm:space-y-6 ${
                slide.textPosition === 'CENTER'
                  ? 'text-center mx-auto lg:col-span-12'
                  : slide.textPosition === 'RIGHT'
                  ? 'text-right ml-auto lg:col-span-7'
                  : 'text-left'
              }`}
            >
              {/* Eyebrow / Tag Badge */}
              <span className="inline-flex items-center gap-2 px-3.5 py-1 border border-[var(--brand-gold)] text-[var(--brand-gold)] font-sans text-[10px] sm:text-xs uppercase tracking-[0.28em] rounded-full backdrop-blur-md bg-black/40 font-semibold shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                <span>{slide.tag || 'AUTHENTIC HAKKI-PIKKI SECRET'}</span>
              </span>

              {slide.smallHeading && (
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--brand-gold-light)]">
                  {slide.smallHeading}
                </p>
              )}

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif-luxury leading-[1.08] text-white">
                {slide.title}{' '}
                {slide.highlightText && (
                  <span className="italic text-[var(--brand-gold)] text-gold-gradient block sm:inline">
                    {slide.highlightText}
                  </span>
                )}
              </h1>

              <p className="text-sm sm:text-lg opacity-90 font-sans font-light leading-relaxed text-slate-200 max-w-xl">
                {slide.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {slide.ctaText && (
                  <a
                    href={slide.ctaLink || '#products'}
                    onClick={() => handleCtaClick(slide.id, slide.ctaLink)}
                    className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-8 py-3.5 font-sans text-xs font-bold uppercase tracking-[0.2em] hover:bg-white transition-all duration-300 shadow-2xl rounded-sm hover:scale-105 flex items-center gap-2"
                  >
                    <span>{slide.ctaText}</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                )}

                {slide.secondaryCtaText && (
                  <a
                    href={slide.secondaryCtaLink || '#ai-quiz'}
                    onClick={() => handleCtaClick(slide.id, slide.secondaryCtaLink)}
                    className="border border-[var(--brand-gold)]/60 text-white px-8 py-3.5 font-sans text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md bg-black/20 hover:bg-[var(--brand-gold)]/20 transition-all rounded-sm flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[var(--brand-gold)]" />
                    <span>{slide.secondaryCtaText}</span>
                  </a>
                )}
              </div>

              {/* Key Guarantee Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg font-sans text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--brand-gold)] shrink-0" />
                  <span>42 Rare Herbs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[var(--brand-gold)] shrink-0" />
                  <span>21-Day Woodfire Brew</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[var(--brand-gold)] shrink-0" />
                  <span>100% Organic</span>
                </div>
              </div>
            </div>

            {/* Right Feature Card (AI Hair Analysis Preview) */}
            {slide.textPosition !== 'CENTER' && (
              <div className="hidden lg:flex lg:col-span-5 justify-end">
                <div className="w-[320px] p-6 bg-black/40 backdrop-blur-xl border border-[var(--brand-gold)]/40 rounded-2xl space-y-4 gold-border-glow shadow-2xl transform hover:scale-102 transition-all">
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
                    onClick={() => {
                      playSound('cta_click');
                      setIsQuizOpen(true);
                    }}
                    className="w-full bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-gold-light)] text-[var(--brand-primary-dark)] py-2.5 rounded font-sans text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Analyze My Hair Now</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
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
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 border border-white/20 text-white flex items-center justify-center hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] transition-all"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slidesToRender.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 border border-white/20 text-white flex items-center justify-center hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] transition-all"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {slidesToRender.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentSlideIndex ? 'w-8 bg-[var(--brand-gold)]' : 'w-2 bg-white/40'
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

