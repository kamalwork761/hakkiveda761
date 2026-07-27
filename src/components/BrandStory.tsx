import React from 'react';
import { Flame, Compass, HeartHandshake, Leaf, ShieldAlert } from 'lucide-react';

export const BrandStory: React.FC = () => {
  return (
    <section id="brand-story" className="py-24 bg-[#0B3D2E] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Visuals */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#C8A24A]/40 shadow-2xl">
              <img
                src="/images/hero_tribal_elders.jpg"
                alt="Hakki-Pikki Forest Canopy and Tribal Elders"
                className="w-full h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D2E] via-transparent to-black/30"></div>

              {/* Floating Tribal Lore Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/60 backdrop-blur-xl border border-[#C8A24A]/40 rounded-xl space-y-2">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#C8A24A]">
                  Ancestral Mysore Heritage
                </span>
                <h4 className="text-lg font-serif-luxury font-bold text-slate-100">
                  Door No. 574, V.P. Bore, Hunsur, Mysore, Karnataka
                </h4>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Every drop is small-batch brewed by Hakki-Pikki tribal elders in Mysore using 42 wild herbs.
                </p>
              </div>
            </div>
          </div>

          {/* Right Brand Lore Story */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[#C8A24A] font-sans text-xs uppercase tracking-[0.28em] font-bold block">
              The Genesis of HAKKIVEDA
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-slate-100 leading-tight">
              Where Ancient Tribal Wisdom Meets Modern Hair Science
            </h2>

            <p className="text-sm text-slate-200 font-sans leading-relaxed">
              For centuries, the nomadic Hakki-Pikki tribe traversed the dense forest corridors of the Western Ghats in Karnataka, India. Unbounded by modern industrial cosmetics, they relied on a secret repertoire of 42 wild mountain herbs, tree barks, seeds, and flower juices to keep their hair thick, dark, and resilient well into old age.
            </p>

            <p className="text-sm text-slate-200 font-sans leading-relaxed">
              At HAKKIVEDA, we preserve this authentic living heritage. We work directly with tribal harvesters in Hunsur to sustainably gather rare botanicals at sunrise when nutrient concentration is highest.
            </p>

            {/* 4 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 font-sans">
              <div className="p-4 bg-[#072a20] rounded-xl border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-[#C8A24A]">
                  <Leaf className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">42 Wild Herbs</h4>
                </div>
                <p className="text-[11px] text-slate-300">
                  Including Abrus precatorius, Jatamansi, and Bhringraj harvested in untouched forests.
                </p>
              </div>

              <div className="p-4 bg-[#072a20] rounded-xl border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-[#C8A24A]">
                  <Flame className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">21-Day Woodfire Brew</h4>
                </div>
                <p className="text-[11px] text-slate-300">
                  Slow-cooked in pure copper cauldrons over woodfire for optimal phytonutrient retention.
                </p>
              </div>

              <div className="p-4 bg-[#072a20] rounded-xl border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-[#C8A24A]">
                  <HeartHandshake className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Tribal Empowerment</h4>
                </div>
                <p className="text-[11px] text-slate-300">
                  Fair-trade compensation directly supporting Hakki-Pikki artisan families in Mysore.
                </p>
              </div>

              <div className="p-4 bg-[#072a20] rounded-xl border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-[#C8A24A]">
                  <Compass className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Worldwide Shipping</h4>
                </div>
                <p className="text-[11px] text-slate-300">
                  Exported directly to India, Singapore, Malaysia, Fiji, Mauritius, and Global markets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
