import React from 'react';
import {
  Building2,
  Globe,
  Package,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface PartnershipHighlight {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const PARTNERSHIP_HIGHLIGHTS: PartnershipHighlight[] = [
  {
    id: 'wholesale',
    icon: Package,
    title: 'WHOLESALE',
    description: 'For retailers, resellers and bulk buyers.',
  },
  {
    id: 'distribution',
    icon: Building2,
    title: 'DISTRIBUTION',
    description: 'Partner with HAKKIVEDA to grow in your market.',
  },
  {
    id: 'export',
    icon: Globe,
    title: 'GLOBAL EXPORT',
    description: 'International business and export enquiries.',
  },
];

export const B2BSection: React.FC = () => {
  const { b2bSectionConfig, playSound } = useStore();

  const handleNavigateToB2B = () => {
    playSound?.('nav_click');
    window.history.pushState({}, '', '/b2b-enquiry');
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const config = b2bSectionConfig;
  if (config && config.enabled === false) {
    return null;
  }

  // Fallback image from config or curated high-resolution sourcing visual
  const b2bImage =
    config?.bannerImage ||
    'https://images.unsplash.com/photo-1608248597289-53e30f146a7d?auto=format&fit=crop&w=1200&q=80';

  return (
    <section
      id="b2b"
      className="py-14 sm:py-16 md:py-20 bg-[#FAF8F2] relative overflow-hidden border-t border-b border-[#E5D8B5] scroll-mt-12 select-none"
      aria-label="B2B and Global Partnerships"
    >
      <div id="b2b-export" className="absolute -top-12 left-0" />

      {/* Subtle Background Radial Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#C5A059]/5 blur-[120px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Compact Feature Card */}
        <div className="bg-white border border-[#E5D8B5] rounded-3xl p-5 sm:p-8 md:p-10 lg:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN (Desktop) / TOP (Mobile): Premium Sourcing & Partnership Image */}
            <div className="lg:col-span-5 w-full">
              <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] lg:aspect-[4/3] rounded-2xl overflow-hidden border border-[#E5D8B5] shadow-md group">
                <img
                  src={b2bImage}
                  alt="HAKKIVEDA Global Partnerships & Wholesale Supply"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Floating International Quality Badge */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="bg-[#123F2B]/90 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold px-3 py-1 rounded-full border border-white/20 shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#C5A059]" />
                    <span>Mysore Tribal Source • Direct Export</span>
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (Desktop) / BOTTOM (Mobile): Partnership Intro + 3 Compact Highlights + CTA */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              
              {/* Header & Typography */}
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-[#123F2B]/10 text-[#123F2B] border border-[#123F2B]/20">
                  <Globe className="w-3 h-3 text-[#C5A059]" />
                  {config?.badgeText || 'GLOBAL PARTNERSHIPS'}
                </span>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif-luxury font-bold text-[#123F2B] tracking-tight leading-tight">
                  {config?.heading || 'PARTNER WITH HAKKIVEDA'}
                </h2>

                <p className="text-xs sm:text-sm font-sans leading-relaxed text-[#37463D] max-w-xl">
                  {config?.description ||
                    'Bring authentic HAKKIVEDA herbal rituals to your market. We welcome wholesale, distribution and international partnership enquiries.'}
                </p>
              </div>

              {/* 3 Compact Partnership Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1">
                {PARTNERSHIP_HIGHLIGHTS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="bg-[#FAF8F2] border border-[#E5D8B5] hover:border-[#C5A059]/60 rounded-xl p-3 sm:p-3.5 transition-all duration-200 shadow-2xs flex items-center sm:items-start gap-3 sm:gap-2.5 sm:flex-col group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-white border border-[#E5D8B5] flex items-center justify-center shrink-0 shadow-2xs group-hover:border-[#C5A059]/60 transition-colors">
                        <Icon className="w-4 h-4 text-[#123F2B]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-bold text-[#123F2B] font-serif-luxury tracking-wide">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-[#37463D] leading-snug font-sans mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Primary Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  id="homepage-b2b-become-partner-btn"
                  onClick={handleNavigateToB2B}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-xl bg-[#123F2B] hover:bg-[#0B2F20] text-white hover:text-amber-200 border border-[#C5A059]/40 hover:border-[#C5A059] font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.16em] transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer group"
                >
                  <Building2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>{config?.ctaText || 'BECOME A PARTNER'}</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A059] transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
