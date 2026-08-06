import React from 'react';
import { Sparkles, Clock, ArrowRight, Bot, ShieldCheck } from 'lucide-react';
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
    imageFit: 'contain',
    desktopFocalPoint: 'center',
    mobileFocalPoint: 'center',
    imageAlignment: 'center',
  };

  const handleStartQuiz = () => {
    playSound('nav_click');
    if (config.ctaAction === 'OPEN_QUIZ' || !config.ctaAction) {
      setIsQuizOpen(true);
    } else {
      setIsQuizOpen(true);
    }
  };

  const desktopImg = config.desktopBanner || '/images/hakkiveda_108_oil_gold.jpg';
  const mobileImg = config.mobileBanner || desktopImg;

  const imageFitClass = config.imageFit === 'cover' ? 'object-cover' : 'object-contain';
  const alignClass =
    config.imageAlignment === 'left'
      ? 'justify-start'
      : config.imageAlignment === 'right'
      ? 'justify-end'
      : 'justify-center';

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="relative bg-gradient-to-br from-[#123F2B] via-[#0E281C] to-[#0A1F16] text-white rounded-3xl overflow-hidden border border-[var(--brand-gold)]/30 shadow-2xl">
        {/* Ambient Decorative Background Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--brand-gold)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center p-6 sm:p-10 lg:p-12 gap-8 lg:gap-12">
          {/* Left Text & Action Column (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Eyebrow */}
            {config.subheading && (
              <div className="inline-flex items-center gap-2 bg-[#0E281C]/80 px-3.5 py-1.5 rounded-full border border-[var(--brand-gold)]/40 shadow-sm">
                <Sparkles className="w-4 h-4 text-[var(--brand-gold)]" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--brand-gold)] font-sans">
                  {config.subheading}
                </span>
              </div>
            )}

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-slate-100 leading-tight">
              {config.heading}
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans max-w-2xl">
              {config.description}
            </p>

            {/* CTA & Time Indicator */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={handleStartQuiz}
                className="w-full sm:w-auto bg-[var(--brand-gold)] hover:bg-[#c49f2f] text-[#0E281C] font-extrabold text-sm sm:text-base px-8 py-4 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer group"
              >
                <Bot className="w-5 h-5 text-[#0E281C]" />
                <span>{config.ctaText || 'START AI HAIR QUIZ'}</span>
                <ArrowRight className="w-5 h-5 text-[#0E281C] group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-medium text-slate-300 font-sans">
                <Clock className="w-4 h-4 text-[var(--brand-gold)] shrink-0" />
                <span>Takes less than 2 minutes</span>
              </div>
            </div>

            {/* Trust Micro-badges */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-4 text-[11px] text-slate-300 font-sans">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Hakki-Pikki Herbal Formulations
              </span>
              <span className="text-slate-500">•</span>
              <span>No Chemical Preservatives</span>
              <span className="text-slate-500">•</span>
              <span>Tailored Scalp Diagnosis</span>
            </div>
          </div>

          {/* Right Image Column (5 cols on desktop) */}
          <div className={`lg:col-span-5 relative flex ${alignClass} items-center w-full`}>
            <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[var(--brand-gold)]/40 bg-black/40 shadow-2xl p-2 sm:p-3 flex items-center justify-center group">
              <picture className="w-full flex justify-center">
                <source media="(min-width: 1024px)" srcSet={desktopImg} />
                <img
                  src={mobileImg}
                  alt={config.heading || 'HAKKIVEDA AI Hair Analysis Ritual'}
                  loading="lazy"
                  decoding="async"
                  width={1080}
                  height={1350}
                  style={{
                    objectPosition: config.desktopFocalPoint || 'center',
                  }}
                  className={`w-full h-auto max-h-[480px] lg:max-h-[550px] ${imageFitClass} rounded-xl transition-transform duration-700 group-hover:scale-[1.01]`}
                />
              </picture>

              <div className="absolute bottom-4 left-4 right-4 bg-[#0E281C]/90 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-white/10 flex items-center justify-between text-xs pointer-events-none">
                <span className="font-serif font-bold text-[var(--brand-gold)]">
                  Adivasi Herbal Prescription
                </span>
                <span className="text-[10px] text-slate-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
                  AI Powered
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
