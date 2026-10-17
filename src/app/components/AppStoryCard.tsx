import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { resolveAssetUrl } from '../utils/nativeUrl';

export const AppStoryCard: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const elderImg = resolveAssetUrl('/images/hero_tribal_elders.jpg');

  return (
    <div className="w-full px-4 py-3">
      <div className="overflow-hidden rounded-3xl border border-[#C5A059]/25 bg-[#FFFDF7] shadow-md">
        <div className="relative h-36 overflow-hidden">
          <img
            src={elderImg}
            alt="HAKKIVEDA heritage"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B2E25]/85 via-[#0B2E25]/20 to-transparent" />

          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-1.5 text-[#F4D77E]">
              <Sparkles className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-[0.18em]">
                Sacred Heritage
              </span>
            </div>

            <h3 className="mt-1 font-serif text-lg font-bold leading-tight text-white">
              The Story Behind HAKKIVEDA
            </h3>
          </div>
        </div>

        <div className="p-4">
          <p className="text-[11px] leading-relaxed text-slate-600">
            Discover the heritage, traditional preparation methods, and story behind our herbal formulations.
          </p>

          {expanded && (
            <div className="mt-3 space-y-2 border-t border-[#C5A059]/20 pt-3 text-[11px] leading-relaxed text-slate-600">
              <p>
                Our formulations draw inspiration from traditional botanical knowledge and long-standing herbal care practices.
              </p>
              <p>
                Learn more about the ingredients, preparation process, and the people behind HAKKIVEDA.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-[#0E382C] py-2.5 text-[11px] font-bold text-[#F6E7BD]"
          >
            {expanded ? 'Show Less' : 'Read Our Story'}
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
