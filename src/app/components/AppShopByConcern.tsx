import React from 'react';
import { ArrowRight, Leaf } from 'lucide-react';
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
  const supportedConcernKeys = new Set(['hair_fall', 'hair_growth']);

  const displayConcerns = (
    concerns && concerns.length > 0
      ? concerns.filter((c) => c.published !== false)
      : INITIAL_MOBILE_APP_CONCERNS
  )
    .filter((c) => {
      const key = (c.destination || c.id).replace('concern:', '');
      return supportedConcernKeys.has(key);
    })
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const getConcernCopy = (c: MobileAppShopConcern) => {
    const key = (c.destination || c.id).replace('concern:', '');

    if (key === 'hair_fall') {
      return {
        title: 'Hair Fall & Weak Roots',
        support: 'For excessive shedding and weak-feeling roots',
        value: 'Recommended herbal routine',
      };
    }

    if (key === 'hair_growth') {
      return {
        title: 'Hair Growth & Density',
        support: 'For thin-looking or low-density hair',
        value: 'Personalized care options',
      };
    }

    return {
      title: c.title,
      support: c.subtitle,
      value: 'Explore recommended remedies',
    };
  };

  return (
    <div className="w-full py-4">
      <div className="px-4 mb-3">
        <h2 className="text-[13px] font-black uppercase tracking-[0.12em] text-[#0B4A3A]">
          What Would You Like to Improve?
        </h2>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Find a routine based on your hair concern
        </p>
      </div>

      <div className="space-y-3 px-4">
        {displayConcerns.map((c) => {
          const copy = getConcernCopy(c);

          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectConcern(c.destination || c.id)}
              className="w-full overflow-hidden rounded-2xl border border-[#DDD6C8] bg-[#FFFDF8] shadow-sm active:scale-[0.99] transition-all text-left"
            >
              <div className="flex items-stretch">
                <div className="w-[96px] min-h-[112px] flex-shrink-0 bg-[#F2EAD9]">
                  {c.imageUrl ? (
                    <img
                      src={resolveAssetUrl(c.imageUrl)}
                      alt={copy.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/hakkiveda-logo.png';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#0E6A54]">
                      <Leaf className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="flex-1 p-3 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-[15px] font-bold leading-tight text-[#123F34]">
                        {copy.title}
                      </h3>
                      <p className="mt-1 text-[10px] leading-snug text-slate-500">
                        {copy.support}
                      </p>
                    </div>

                    {c.badge && (
                      <span className="flex-shrink-0 rounded-full border border-[#D7B55B]/35 bg-[#FFF6DE] px-2 py-1 text-[8px] font-black uppercase text-[#A17B27]">
                        {c.badge}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#EAF5F0] px-2.5 py-1 text-[9px] font-bold text-[#0E6A54]">
                      {copy.value}
                    </span>

                    <span className="flex items-center gap-1 text-[10px] font-black text-[#0E4B3B]">
                      View Routine
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
