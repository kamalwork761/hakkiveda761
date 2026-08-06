import React from 'react';
import { ArrowRight, Bot } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HomepageQuizBanner: React.FC = () => {
  const { homepageQuizBannerConfig, setIsQuizOpen, playSound } = useStore();

  if (homepageQuizBannerConfig && !homepageQuizBannerConfig.enabled) {
    return null;
  }

  const config = homepageQuizBannerConfig || {
    enabled: true,
    desktopBanner: '/images/hakkiveda_108_oil_gold.jpg',
    mobileBanner: '/images/hakkiveda_108_oil_gold.jpg',
    heading: 'Find the Right HAKKIVEDA Hair Ritual',
    subheading: 'PERSONALIZED HAIR ANALYSIS',
    description:
      'Answer a few quick questions about your hair type, scalp condition and concerns to receive personalized HAKKIVEDA product recommendations.',
    ctaText: 'START AI HAIR QUIZ',
    ctaAction: 'OPEN_QUIZ',
    buttonPosition: 'bottom-left',
  };

  const handleStartQuiz = () => {
    playSound('nav_click');
    setIsQuizOpen(true);
  };

  const desktopImg = config.desktopBanner || '/images/hakkiveda_108_oil_gold.jpg';
  const mobileImg = config.mobileBanner || desktopImg;

  const getOverlayPosClass = (pos?: string) => {
    switch (pos) {
      case 'bottom-center':
        return 'items-end justify-center';
      case 'bottom-right':
        return 'items-end justify-end';
      case 'center-left':
        return 'items-center justify-start';
      case 'center':
        return 'items-center justify-center';
      case 'center-right':
        return 'items-center justify-end';
      case 'top-left':
        return 'items-start justify-start';
      case 'top-center':
        return 'items-start justify-center';
      case 'top-right':
        return 'items-start justify-end';
      case 'bottom-left':
      default:
        return 'items-end justify-start';
    }
  };

  const positionClass = getOverlayPosClass(config.buttonPosition);

  return (
    <section className="py-6 sm:py-10 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[var(--brand-gold)]/30 group bg-[#0E281C]">
        {/* Full Width Responsive Banner Artwork */}
        <picture className="w-full block">
          <source media="(min-width: 768px)" srcSet={desktopImg} />
          <img
            src={mobileImg}
            alt="HAKKIVEDA AI Hair Quiz"
            loading="lazy"
            decoding="async"
            width={1920}
            height={700}
            className="w-full h-auto block object-contain rounded-2xl sm:rounded-3xl transition-transform duration-700 group-hover:scale-[1.005]"
          />
        </picture>

        {/* Overlay Container for CTA Button */}
        <div className={`absolute inset-0 p-4 sm:p-8 md:p-10 flex pointer-events-none ${positionClass}`}>
          <button
            type="button"
            onClick={handleStartQuiz}
            className="pointer-events-auto bg-[var(--brand-gold)] hover:bg-[#c49f2f] text-[#0E281C] font-extrabold text-xs sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer border border-white/20 group/btn"
          >
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-[#0E281C]" />
            <span>{config.ctaText || 'START AI HAIR QUIZ'}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#0E281C] group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

