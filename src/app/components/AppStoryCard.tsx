import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { resolveAssetUrl } from '../utils/nativeUrl';

export const AppStoryCard: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  const elderImg = resolveAssetUrl('/images/hero_tribal_elders.jpg');

  return (
    <div className="w-full px-4 py-3">
      <div className="rounded-3xl bg-[#0E382C] text-white p-4 shadow-md border border-[#C5A059]/30 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">
            Sacred Heritage
          </span>
        </div>

        <h3 className="font-serif text-base font-bold text-[#FDF8EC] leading-tight">
          Handcrafted by Hakki-Pikki Tribal Elders
        </h3>

        <div className="mt-3 flex gap-3 items-center">
          <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-[#C5A059]/40 bg-[#07241C]">
            <img
              src={elderImg}
              alt="Hakki-Pikki Tribal Elders"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/hero_tribal_elders.jpg';
              }}
            />
          </div>

          <p className="text-xs text-emerald-100/90 leading-relaxed font-sans flex-1">
            In the dense forests of Pakshirajapura, our family continues 5 generations of wood-fired copper vessel botanical extraction. No machines, no chemicals.
          </p>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-emerald-800/60 text-xs text-emerald-200/90 space-y-2 leading-relaxed animate-fadeIn">
            <p>
              Each batch takes 21 days of slow brewing. We gather 108 rare forest barks, roots, and wild seeds during the auspicious lunar phases to ensure maximum prana (vitality) in every drop.
            </p>
            <p>
              When you use HAKKIVEDA, you are supporting the livelihood of over 120 indigenous tribal families.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#C5A059] font-bold text-xs flex items-center justify-center gap-1 transition-colors"
        >
          <span>{expanded ? 'Show Less' : 'Read Sacred Story'}</span>
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
          )}
        </button>
      </div>
    </div>
  );
};
