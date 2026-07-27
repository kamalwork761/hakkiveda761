import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronRight, ChevronLeft, ShieldCheck, Flame, Award } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { INITIAL_HERO_SLIDES } from '../data/initialData';

export const HeroSlider: React.FC = () => {
  const { heroSlides, setIsQuizOpen, playSound } = useStore();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const activeSlides = (heroSlides && heroSlides.length > 0 ? heroSlides : INITIAL_HERO_SLIDES)
    .filter((s) => s.active)
    .map((s, idx) => {
      if (idx === 0 && s.image.includes('unsplash')) {
        return { ...s, image: '/images/hero_tribal_elders.jpg' };
      }
      return s;
    });

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  if (activeSlides.length === 0) return null;

  const currentSlide = activeSlides[currentSlideIndex];

  return (
    <section className="relative w-full h-[520px] sm:h-[580px] lg:h-[620px] flex items-center overflow-hidden bg-[#0B3D2E]">
      {/* Background Slide Image with Luxury Gradient Overlays */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
        style={{ backgroundImage: `url('${currentSlide.image}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B3D2E] via-[#0B3D2E]/80 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D2E] via-transparent to-black/40 z-10"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 border border-[#C8A24A] text-[#C8A24A] font-sans text-[10px] sm:text-xs uppercase tracking-[0.28em] rounded-full backdrop-blur-md bg-black/30 font-semibold shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A24A]" />
            <span>{currentSlide.tag}</span>
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif-luxury leading-[1.08] text-white">
            {currentSlide.title} <br />
            <span className="italic text-[#C8A24A] text-gold-gradient">{currentSlide.highlightText}</span>
          </h1>

          <p className="text-sm sm:text-lg opacity-90 font-sans font-light leading-relaxed text-slate-200 max-w-xl">
            {currentSlide.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#products"
              onClick={() => playSound('cta_click')}
              className="bg-[#C8A24A] text-[#0B3D2E] px-8 py-3.5 font-sans text-xs font-bold uppercase tracking-[0.2em] hover:bg-white transition-all duration-300 shadow-2xl rounded-sm hover:scale-105 flex items-center gap-2"
            >
              <span>{currentSlide.ctaText}</span>
              <ChevronRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => {
                playSound('cta_click');
                setIsQuizOpen(true);
              }}
              className="border border-[#C8A24A]/60 text-white px-8 py-3.5 font-sans text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md bg-black/20 hover:bg-[#C8A24A]/20 transition-all rounded-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#C8A24A]" />
              <span>AI Scalp Quiz</span>
            </button>
          </div>

          {/* Key Guarantee Badges */}
          <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg font-sans text-[11px] text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C8A24A] shrink-0" />
              <span>42 Rare Herbs</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#C8A24A] shrink-0" />
              <span>21-Day Woodfire Brew</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C8A24A] shrink-0" />
              <span>100% Organic</span>
            </div>
          </div>
        </div>

        {/* Right Feature Card (AI Hair Analysis Preview) */}
        <div className="hidden lg:flex lg:col-span-5 justify-end">
          <div className="w-[320px] p-6 bg-black/40 backdrop-blur-xl border border-[#C8A24A]/40 rounded-2xl space-y-4 gold-border-glow shadow-2xl transform hover:scale-102 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#C8A24A] bg-[#C8A24A]/10 px-2.5 py-1 rounded">
                AI Trichology Engine
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#0B3D2E] border-2 border-[#C8A24A] flex items-center justify-center shrink-0 shadow-lg">
                <Sparkles className="w-8 h-8 text-[#C8A24A]" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-serif-luxury text-slate-100">Personalized Hair Formula</h4>
                <p className="text-xs text-slate-300 mt-1 leading-snug">Get custom tribal herbal dosage and scalp diagnostics in 60 seconds.</p>
              </div>
            </div>

            <button
              onClick={() => setIsQuizOpen(true)}
              className="w-full bg-gradient-to-r from-[#C8A24A] to-[#E5C880] text-[#0B3D2E] py-2.5 rounded font-sans text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Analyze My Hair Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slider Controls & Dots */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 border border-white/20 text-white flex items-center justify-center hover:bg-[#C8A24A] hover:text-[#0B3D2E] transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 border border-white/20 text-white flex items-center justify-center hover:bg-[#C8A24A] hover:text-[#0B3D2E] transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentSlideIndex ? 'w-8 bg-[#C8A24A]' : 'w-2 bg-white/40'
                }`}
              ></button>
            ))}
          </div>
        </>
      )}
    </section>
  );
};
