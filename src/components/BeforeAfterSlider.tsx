import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, MapPin, Calendar, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { INITIAL_BEFORE_AFTER } from '../data/initialData';

export const BeforeAfterSlider: React.FC = () => {
  const { beforeAfterItems } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50); // percentage (0 to 100)
  const [isScrubbing, setIsScrubbing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if store items contain unsplash images or are empty, fallback to updated INITIAL_BEFORE_AFTER
  const itemsToDisplay =
    beforeAfterItems && beforeAfterItems.length > 0 && !beforeAfterItems[0]?.beforeImage?.includes('unsplash')
      ? beforeAfterItems
      : INITIAL_BEFORE_AFTER;

  if (!itemsToDisplay || itemsToDisplay.length === 0) return null;

  const currentItem = itemsToDisplay[currentIndex] || itemsToDisplay[0];

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, Math.round((x / rect.width) * 100)));
    setSliderPos(percent);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsScrubbing(true);
    updatePosition(e.clientX);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isScrubbing) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsScrubbing(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + itemsToDisplay.length) % itemsToDisplay.length);
    setSliderPos(50);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % itemsToDisplay.length);
    setSliderPos(50);
  };

  return (
    <section
      id="before-after"
      className="py-12 sm:py-16 lg:py-20 bg-[var(--brand-primary-deep,#0A1810)] text-white border-t border-b border-white/10 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 justify-center">
            <Sparkles className="w-3.5 h-3.5 text-[var(--brand-gold,#C9A84E)]" />
            <span className="text-[var(--brand-gold,#C9A84E)] font-sans text-[11px] sm:text-xs uppercase tracking-[0.25em] font-extrabold">
              Real Verified Transformations
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-slate-100">
            Before &amp; After Results
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed max-w-lg mx-auto">
            Drag the gold slider left and right to compare verified hair density and crown coverage.
          </p>
        </div>

        {/* Main Comparison Card */}
        <div className="max-w-5xl mx-auto bg-[var(--brand-primary-dark,#0E281C)] border border-[var(--brand-gold,#C9A84E)]/30 rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-9 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* 1. Interactive Dual Image Comparison Slider */}
            <div className="lg:col-span-7 space-y-3">
              <div
                ref={containerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="relative w-full max-w-[390px] lg:max-w-none mx-auto aspect-[4/5] sm:aspect-square md:aspect-auto md:h-96 lg:h-[400px] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-white/15 shadow-2xl bg-black touch-none group"
                aria-label="Interactive Before and After Hair Density Slider"
                role="slider"
                aria-valuenow={sliderPos}
                aria-valuemin={0}
                aria-valuemax={100}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowLeft') setSliderPos((p) => Math.max(5, p - 5));
                  if (e.key === 'ArrowRight') setSliderPos((p) => Math.min(95, p + 5));
                }}
              >
                {/* AFTER IMAGE (Base Layer) */}
                <img
                  src={currentItem.afterImage}
                  alt={`After ${currentItem.days} days transformation`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                />

                {/* AFTER BADGE */}
                <span className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#123F2A]/90 backdrop-blur-xs text-[var(--brand-gold,#C9A84E)] text-[10px] sm:text-[11px] font-extrabold font-sans uppercase px-2.5 sm:px-3 py-1 rounded-full z-10 shadow-md border border-[var(--brand-gold,#C9A84E)]/40 pointer-events-none">
                  After ({currentItem.days}d)
                </span>

                {/* BEFORE IMAGE (Clipped Layer — 100% distortion-free with clipPath) */}
                <img
                  src={currentItem.beforeImage}
                  alt="Before transformation"
                  loading="lazy"
                  style={{
                    clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
                    WebkitClipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
                  }}
                  className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                />

                {/* BEFORE BADGE */}
                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black/80 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-extrabold font-sans uppercase px-2.5 sm:px-3 py-1 rounded-full z-10 shadow-md border border-white/15 pointer-events-none">
                  Before
                </span>

                {/* DRAGGABLE DIVIDER LINE & HANDLE */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 sm:w-1 bg-[var(--brand-gold,#C9A84E)] z-20 pointer-events-none shadow-[0_0_10px_rgba(201,168,76,0.6)]"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[var(--brand-gold,#C9A84E)] text-[#0B2F20] flex items-center justify-center font-extrabold text-xs shadow-2xl border-2 border-[#0A1810] transition-transform ${
                      isScrubbing ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                  >
                    <span className="tracking-tighter font-mono select-none">‹ ❙ ›</span>
                  </div>
                </div>
              </div>

              {/* Slider Instruction & Pagination Dots */}
              <div className="flex items-center justify-between px-1 max-w-[390px] lg:max-w-none mx-auto">
                <p className="text-[11px] text-slate-400 font-sans italic">
                  *Drag handle to inspect follicle density
                </p>

                {/* Pagination Dots */}
                {itemsToDisplay.length > 1 && (
                  <div className="flex items-center gap-1.5">
                    {itemsToDisplay.map((item, idx) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setCurrentIndex(idx);
                          setSliderPos(50);
                        }}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          idx === currentIndex
                            ? 'w-5 bg-[var(--brand-gold,#C9A84E)]'
                            : 'w-2 bg-white/20 hover:bg-white/40'
                        }`}
                        aria-label={`Go to result ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 2. Customer Case Details */}
            <div className="lg:col-span-5 space-y-4 max-w-[390px] lg:max-w-none mx-auto w-full">
              {/* Meta Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="bg-[var(--brand-gold,#C9A84E)]/15 text-[var(--brand-gold,#C9A84E)] border border-[var(--brand-gold,#C9A84E)]/40 text-[11px] sm:text-xs font-bold font-sans uppercase px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{currentItem.days} Days Transformation</span>
                </span>
                <div className="flex items-center gap-1 text-xs text-slate-300 font-sans">
                  <MapPin className="w-3.5 h-3.5 text-[var(--brand-gold,#C9A84E)]" />
                  <span>{currentItem.location}</span>
                </div>
              </div>

              {/* Story Content */}
              <div className="space-y-2.5">
                <h3 className="text-lg sm:text-2xl font-serif-luxury font-bold text-slate-100 leading-snug">
                  {currentItem.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-[var(--brand-gold,#C9A84E)] font-sans uppercase tracking-wider font-semibold">
                  Concern: {currentItem.concern}
                </p>
                <div className="relative pt-1">
                  <Quote className="w-6 h-6 text-[var(--brand-gold,#C9A84E)]/25 absolute -top-1 -left-1" />
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans italic pl-4 border-l-2 border-[var(--brand-gold,#C9A84E)]/70">
                    "{currentItem.testimonial}"
                  </p>
                </div>
              </div>

              {/* Author & Result Navigation */}
              <div className="pt-2 flex items-center justify-between border-t border-white/10">
                <div>
                  <h4 className="text-sm sm:text-base font-bold font-serif-luxury text-slate-100">
                    {currentItem.author}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Verified Buyer • {currentItem.location}
                  </p>
                </div>

                {/* Case Switcher Buttons */}
                {itemsToDisplay.length > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                      {currentIndex + 1} / {itemsToDisplay.length}
                    </span>
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 border border-white/20 text-white hover:bg-[var(--brand-gold,#C9A84E)] hover:text-[#0B2F20] transition-all flex items-center justify-center cursor-pointer active:scale-95"
                      aria-label="Previous Transformation"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 border border-white/20 text-white hover:bg-[var(--brand-gold,#C9A84E)] hover:text-[#0B2F20] transition-all flex items-center justify-center cursor-pointer active:scale-95"
                      aria-label="Next Transformation"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

