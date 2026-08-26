import React, { useState } from 'react';
import { ArrowRight, Bot, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

/**
 * Resolves media URLs safely for development, Docker containers, and production VPS environments.
 */
function resolveMediaUrl(url?: string): string {
  if (!url) return '';
  let cleaned = url.trim();
  // Strip any accidental localhost / 127.0.0.1 development origin
  cleaned = cleaned.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, '');
  // Normalize relative uploads path
  if (cleaned.startsWith('uploads/')) {
    cleaned = '/' + cleaned;
  } else if (cleaned.startsWith('images/')) {
    cleaned = '/' + cleaned;
  }
  return cleaned;
}

export const HomepageQuizBanner: React.FC = () => {
  const { homepageQuizBannerConfig, setIsQuizOpen, playSound } = useStore();
  const [imgError, setImgError] = useState(false);

  if (homepageQuizBannerConfig && !homepageQuizBannerConfig.enabled) {
    return null;
  }

  const config = homepageQuizBannerConfig || {
    enabled: true,
    desktopBanner: '/images/hakkiveda_108_oil_gold.jpg',
    mobileBanner: '/images/hakkiveda_108_oil_gold.jpg',
    heading: 'Discover Your Personalized Hair Ritual',
    subheading: 'AI-POWERED HAIR ANALYSIS',
    description:
      'Take our quick hair quiz and discover the HAKKIVEDA ritual suited to your hair concerns.',
    ctaText: 'START AI HAIR QUIZ',
    ctaAction: 'OPEN_QUIZ',
    buttonPosition: 'bottom-left',
  };

  const handleStartQuiz = () => {
    playSound('nav_click');
    setIsQuizOpen(true);
  };

  const defaultFallbackImage = '/images/hakkiveda_108_oil_gold.jpg';
  const resolvedDesktop = resolveMediaUrl(config.desktopBanner);
  const resolvedMobile = resolveMediaUrl(config.mobileBanner);

  // Seamless fallback: mobile uses desktop if mobile not uploaded, and vice versa
  const desktopImg = resolvedDesktop || resolvedMobile || defaultFallbackImage;
  const mobileImg = resolvedMobile || resolvedDesktop || defaultFallbackImage;

  const headingText = config.heading || 'Discover Your Personalized Hair Ritual';
  const subheadingText = config.subheading || 'AI-POWERED HAIR ANALYSIS';
  const descriptionText =
    config.description ||
    'Take our quick hair quiz and discover the HAKKIVEDA ritual suited to your hair concerns.';
  const ctaButtonText = config.ctaText || 'START AI HAIR QUIZ';

  return (
    <section className="py-6 sm:py-10 bg-[#FAF8F2] dark:bg-[var(--brand-primary-deep,#0A1810)] border-t border-b border-[var(--color-border,#E7E1D5)] dark:border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* 1. MOBILE RESPONSIVE BANNER (md:hidden) — Height approx 270–320px */}
        <div className="block md:hidden relative w-full h-[280px] xs:h-[300px] rounded-2xl overflow-hidden shadow-xl border border-[var(--brand-gold,#C9A84E)]/30 group bg-[#0A1810]">
          {/* Background Image */}
          {!imgError ? (
            <img
              src={mobileImg}
              alt="HAKKIVEDA AI Hair Quiz"
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0B2F20] via-[#0E3D2B] to-[#061B12]" />
          )}

          {/* Gradient Overlay Scrim for Crisp Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#061810]/95 via-[#061810]/65 to-black/20 pointer-events-none" />

          {/* Content Container */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 xs:p-5 text-white z-10">
            {/* Top Pill / Eyebrow */}
            <div className="flex items-center gap-1.5 self-start bg-[#061810]/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-[#C5A059]/60 shadow-sm">
              <Bot className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#C5A059] font-sans">
                {subheadingText}
              </span>
            </div>

            {/* Bottom Content & CTA */}
            <div className="space-y-2">
              <h3 className="font-serif-luxury font-bold text-lg xs:text-xl text-[#FAF7F2] leading-snug drop-shadow-md">
                {headingText}
              </h3>
              <p className="text-xs text-[#E5D8B5] font-sans line-clamp-2 leading-relaxed drop-shadow-xs">
                {descriptionText}
              </p>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleStartQuiz}
                  className="w-full min-h-[46px] bg-[var(--brand-gold,#C9A84E)] hover:bg-[#b8891e] active:scale-98 text-[#0B2F20] font-extrabold text-xs xs:text-sm px-5 py-3 rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer border border-white/20 font-sans"
                  aria-label="Start AI Hair Quiz"
                >
                  <Sparkles className="w-4 h-4 text-[#0B2F20]" />
                  <span>{ctaButtonText}</span>
                  <ArrowRight className="w-4 h-4 text-[#0B2F20]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. DESKTOP RESPONSIVE BANNER (hidden md:block) — Aspect 16:5.5 */}
        <div className="hidden md:block relative w-full aspect-[16/5.5] min-h-[280px] max-h-[380px] rounded-3xl overflow-hidden shadow-2xl border border-[var(--brand-gold,#C9A84E)]/30 group bg-[#0A1810]">
          {/* Background Image */}
          {!imgError ? (
            <img
              src={desktopImg}
              alt="HAKKIVEDA AI Hair Quiz"
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#0B2F20] via-[#0E3D2B] to-[#061B12]" />
          )}

          {/* Gradient Scrim for Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061810]/90 via-[#061810]/60 to-transparent flex items-center p-8 lg:p-12 text-white" />

          {/* Content Container */}
          <div className="absolute inset-0 flex items-center p-8 lg:p-12 z-10">
            <div className="max-w-xl space-y-3.5 text-white">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 bg-[#061810]/70 backdrop-blur-xs px-3 py-1 rounded-full border border-[#C5A059]/50">
                <Bot className="w-4 h-4 text-[#C5A059]" />
                <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#C5A059] font-sans">
                  {subheadingText}
                </span>
              </div>

              {/* Heading */}
              <h2 className="font-serif-luxury font-bold text-2xl lg:text-3xl text-[#FAF7F2] leading-tight drop-shadow-md">
                {headingText}
              </h2>

              {/* Description */}
              <p className="text-sm text-[#E5D8B5] font-sans line-clamp-2 leading-relaxed max-w-lg drop-shadow-xs">
                {descriptionText}
              </p>

              {/* CTA Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleStartQuiz}
                  className="bg-[var(--brand-gold,#C9A84E)] hover:bg-white text-[#0B2F20] font-extrabold text-sm px-7 py-3.5 rounded-xl transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-2.5 cursor-pointer border border-white/20 group/btn font-sans"
                  aria-label="Start AI Hair Quiz"
                >
                  <Bot className="w-4 h-4 text-[#0B2F20]" />
                  <span>{ctaButtonText}</span>
                  <ArrowRight className="w-4 h-4 text-[#0B2F20] group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


