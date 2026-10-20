import React from 'react';
import { Leaf } from 'lucide-react';
import { MobileAppShopConcern } from '../../types/mobileApp';
import { INITIAL_MOBILE_APP_CONCERNS } from '../../data/initialData';
import { resolveAssetUrl } from '../utils/nativeUrl';

interface AppShopByConcernProps {
  concerns?: MobileAppShopConcern[];
  onSelectConcern: (concern: string) => void;
}

const JOURNEYS = [
  {
    key: 'hair',
    title: 'Hair Care',
    subtitle: 'Scalp cleansing, nourishment & stronger-looking hair',
    destination: 'care:hair',
  },
  {
    key: 'skin',
    title: 'Skin Care',
    subtitle: 'Cleanse, brighten & support an even-looking complexion',
    destination: 'care:skin',
  },
  {
    key: 'wellness',
    title: 'Wellness Care',
    subtitle: 'Traditional herbal care for everyday rituals',
    destination: 'care:wellness',
  },
] as const;

export const AppShopByConcern: React.FC<AppShopByConcernProps> = ({
  concerns,
  onSelectConcern,
}) => {
  const published = (
    concerns && concerns.length > 0
      ? concerns.filter((c) => c.published !== false)
      : INITIAL_MOBILE_APP_CONCERNS
  ).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const findJourneyImage = (key: string, fallbackIndex: number) => {
    const exact = published.find((c) =>
      (c.destination || '').toLowerCase() === `care:${key}` ||
      (c.id || '').toLowerCase() === `care-${key}`
    );
    return exact?.imageUrl || published[fallbackIndex]?.imageUrl || '';
  };

  return (
    <section className="w-full py-5">
      <div className="px-4 mb-4">
        <h2
          className="text-[20px] leading-tight font-black text-[#0B4A3A] tracking-[0.02em]"
          style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
        >
          What Do You Want to Improve Today?
        </h2>
        <p className="mt-1.5 text-[12px] leading-relaxed font-medium text-slate-600">
          Choose your care journey and discover a simple HAKKIVEDA routine.
        </p>
      </div>

      <div className="flex gap-4 px-4 overflow-x-auto no-scrollbar scroll-smooth pb-2">
        {JOURNEYS.map((journey, index) => {
          const imageUrl = findJourneyImage(journey.key, index);

          return (
            <button
              key={journey.key}
              type="button"
              onClick={() => onSelectConcern(journey.destination)}
              className="flex-shrink-0 w-[150px] text-left active:scale-[0.97] transition-transform"
              aria-label={`Open ${journey.title}`}
            >
              <div className="w-[150px] h-[160px] overflow-hidden relative flex items-center justify-center">
                {imageUrl ? (
                  <img
                    src={resolveAssetUrl(imageUrl)}
                    alt={journey.title}
                    className="w-full h-full object-contain select-none"
                    loading="lazy"
                    draggable={false}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#EDF7F1] to-[#F7EFD8] flex items-center justify-center">
                    <Leaf className="w-12 h-12 text-[#0E6A54]" />
                  </div>
                )}
              </div>

              <div className="pt-2 px-1">
                <h3
                  className="text-[15px] leading-tight font-black text-[#0B4A3A]"
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                >
                  {journey.title}
                </h3>
                <p className="mt-1 text-[10px] leading-snug font-medium text-slate-600">
                  {journey.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
