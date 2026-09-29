import React from 'react';
import { ShieldCheck, Sparkles, AlertCircle, Droplets, Zap, Leaf } from 'lucide-react';
import { MobileAppShopConcern } from '../../types/mobileApp';
import { INITIAL_MOBILE_APP_CONCERNS } from '../../data/initialData';
import { resolveAssetUrl } from '../utils/nativeUrl';

interface AppShopByConcernProps {
  concerns?: MobileAppShopConcern[];
  onSelectConcern: (concern: string) => void;
}

export const AppShopByConcern: React.FC<AppShopByConcernProps> = ({
  concerns,
  onSelectConcern,
}) => {
  const displayConcerns = (concerns && concerns.length > 0
    ? concerns.filter((c) => c.published !== false)
    : INITIAL_MOBILE_APP_CONCERNS
  ).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <div className="w-full py-3">
      <div className="flex items-center justify-between px-4 mb-2">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-950/70 font-sans">
            Shop by Concern
          </h2>
          <p className="text-[11px] text-slate-500 font-sans">
            Targeted tribal formulations for specific hair needs
          </p>
        </div>
      </div>

      <div
        className="flex items-stretch gap-3 px-4 overflow-x-auto no-scrollbar scroll-smooth pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayConcerns.map((c) => {
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectConcern(c.destination || c.id)}
              className="flex-shrink-0 w-44 rounded-2xl p-3 bg-white border border-emerald-950/10 shadow-sm hover:shadow-md active:scale-98 transition-all flex flex-col justify-between text-left group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  {c.imageUrl ? (
                    <img
                      src={resolveAssetUrl(c.imageUrl)}
                      alt={c.title}
                      className="w-9 h-9 rounded-xl object-cover border border-[#C5A059]/30"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/hakkiveda-logo.png';
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-[#0E382C]/10 text-[#0E382C] flex items-center justify-center group-hover:bg-[#0E382C] group-hover:text-[#C5A059] transition-colors">
                      <Leaf className="w-4 h-4" />
                    </div>
                  )}
                  {c.badge && (
                    <span className="text-[9px] font-bold text-[#C5A059] bg-[#C5A059]/10 px-1.5 py-0.5 rounded-full border border-[#C5A059]/20">
                      {c.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-sm font-bold text-slate-900 leading-tight">
                  {c.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  {c.subtitle}
                </p>
              </div>

              <div className="mt-3 flex items-center text-[11px] font-semibold text-[#0E382C] group-hover:text-[#C5A059] transition-colors">
                <span>Explore Remedies</span>
                <span className="ml-1 text-xs">→</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

