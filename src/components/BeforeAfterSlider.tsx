import React, { useState } from 'react';
import { Sparkles, MapPin, Calendar, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { INITIAL_BEFORE_AFTER } from '../data/initialData';

export const BeforeAfterSlider: React.FC = () => {
  const { beforeAfterItems } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50); // percentage

  // Check if store items contain unsplash images or are empty, fallback to updated INITIAL_BEFORE_AFTER
  const itemsToDisplay = beforeAfterItems && beforeAfterItems.length > 0 && !beforeAfterItems[0]?.beforeImage?.includes('unsplash')
    ? beforeAfterItems
    : INITIAL_BEFORE_AFTER;

  if (!itemsToDisplay || itemsToDisplay.length === 0) return null;

  const currentItem = itemsToDisplay[currentIndex] || itemsToDisplay[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  };

  return (
    <section id="before-after" className="py-20 bg-[#072a20] border-t border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-[#C8A24A] font-sans text-xs uppercase tracking-[0.28em] font-bold block">
            Real Verified Transformations
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-slate-100">
            Before & After Results
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            Drag the slider to compare original hair density with visible regrowth achieved using the 42 Mountain Herbs formula.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0B3D2E] border border-[#C8A24A]/30 rounded-2xl p-6 sm:p-10 shadow-2xl">
          {/* Interactive Dual Image Comparison Slider */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="relative h-80 sm:h-96 rounded-xl overflow-hidden cursor-ew-resize select-none border border-white/10 shadow-2xl"
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            >
              {/* After Image (Full background) */}
              <img
                src={currentItem.afterImage}
                alt="After"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute top-4 right-4 bg-[#C8A24A] text-[#0B3D2E] text-[11px] font-bold font-sans uppercase px-3 py-1 rounded-full z-10 shadow-lg">
                After ({currentItem.days} Days)
              </span>

              {/* Before Image (Clipped overlay) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={currentItem.beforeImage}
                  alt="Before"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: '100%', height: '100%' }}
                />
                <span className="absolute top-4 left-4 bg-black/80 text-white text-[11px] font-bold font-sans uppercase px-3 py-1 rounded-full z-10 shadow-lg">
                  Before
                </span>
              </div>

              {/* Draggable Divider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-[#C8A24A] z-20 cursor-ew-resize gold-glow"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#C8A24A] text-[#0B3D2E] flex items-center justify-center font-bold text-xs shadow-2xl border-2 border-[#0B3D2E]">
                  ↔
                </div>
              </div>
            </div>

            <p className="text-[11px] text-center text-slate-400 font-sans italic">
              *Slide left and right to inspect scalp density and root coverage.
            </p>
          </div>

          {/* Testimonial Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="bg-[#C8A24A]/20 text-[#C8A24A] border border-[#C8A24A]/40 text-xs font-bold font-sans uppercase px-3 py-1 rounded-full flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{currentItem.days} Days Transformation</span>
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-sans">
                <MapPin className="w-3.5 h-3.5 text-[#C8A24A]" />
                <span>{currentItem.location}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-serif-luxury font-bold text-slate-100">
                {currentItem.title}
              </h3>
              <p className="text-xs text-[#C8A24A] font-sans uppercase tracking-wider font-semibold">
                Concern: {currentItem.concern}
              </p>
              <div className="relative pt-2">
                <Quote className="w-8 h-8 text-[#C8A24A]/30 absolute -top-2 -left-2" />
                <p className="text-sm text-slate-200 leading-relaxed font-sans italic pl-4 border-l-2 border-[#C8A24A]">
                  "{currentItem.testimonial}"
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold font-serif-luxury text-slate-100">{currentItem.author}</h4>
                <p className="text-xs text-slate-400 font-sans">Verified Buyer • {currentItem.location}</p>
              </div>

              {/* Slider Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentIndex((prev) => (prev - 1 + itemsToDisplay.length) % itemsToDisplay.length)}
                  className="w-10 h-10 rounded-full bg-black/40 border border-white/20 text-white hover:bg-[#C8A24A] hover:text-[#0B3D2E] transition-all flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % itemsToDisplay.length)}
                  className="w-10 h-10 rounded-full bg-black/40 border border-white/20 text-white hover:bg-[#C8A24A] hover:text-[#0B3D2E] transition-all flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
