import React from 'react';
import { ArrowRight } from 'lucide-react';
import { resolveAssetUrl } from '../utils/nativeUrl';

interface AppStoryCardProps {
  imageUrl?: string;
  onReadStory: () => void;
}

export const AppStoryCard: React.FC<AppStoryCardProps> = ({ imageUrl, onReadStory }) => {
  const elderImg = resolveAssetUrl(imageUrl || '/images/hero_tribal_elders.jpg');

  return (
    <div className="w-full px-4 py-3">
      <div className="overflow-hidden rounded-3xl border border-[#C5A059]/25 bg-[#FFFDF7] shadow-md">
        <button type="button" onClick={onReadStory} className="block w-full text-left" aria-label="Explore HAKKIVEDA Our Story">
          <img src={elderImg} alt="HAKKIVEDA heritage" className="h-36 w-full object-cover object-center" loading="lazy" />
        </button>
        <div className="p-4">
          <p className="text-[11px] leading-relaxed text-slate-600">
            Discover the heritage, traditional preparation methods, and story behind our herbal formulations.
          </p>
          <button type="button" onClick={onReadStory} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0E382C] py-2.5 text-[11px] font-bold text-[#F6E7BD]">
            Read Our Story <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
