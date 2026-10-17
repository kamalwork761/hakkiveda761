import React, { useState } from 'react';
import { Tag, Check, ArrowRight, Gift } from 'lucide-react';
import { MobileAppBanner } from '../../types/mobileApp';
import { resolveAssetUrl } from '../utils/nativeUrl';

interface AppPromoBannerProps {
  banners: MobileAppBanner[];
  onNavigateAction: (linkAction: string) => void;
}

export const AppPromoBanner: React.FC<AppPromoBannerProps> = ({
  banners,
  onNavigateAction,
}) => {
  const [copied, setCopied] = useState(false);
  const banner = banners.filter((b) => b.published !== false)[0];

  if (!banner) return null;

  const bgImage = resolveAssetUrl(banner.imageUrl);
  const codeToCopy = banner.couponCode || 'TRIBAL200';
  const ctaLabel = banner.ctaText || 'Claim Discount';

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full px-4 py-3">
      <div
        onClick={() => onNavigateAction(banner.linkAction || 'shop')}
        className="relative overflow-hidden rounded-3xl border border-[#D8B65D]/45 bg-gradient-to-br from-[#FFF8E5] via-[#F8EAC2] to-[#E9C86D] p-4 shadow-lg cursor-pointer active:scale-[0.99] transition-all"
      >
        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/35" />
        <div className="absolute right-4 bottom-2 opacity-10">
          <Gift className="w-24 h-24 text-[#0E382C]" />
        </div>

        {bgImage && (
          <img
            src={bgImage}
            alt={banner.title}
            className="absolute right-0 bottom-0 h-full w-[38%] object-cover opacity-15"
          />
        )}

        <div className="relative z-10 max-w-[82%]">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#0E382C] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#F7D978]">
              <Tag className="w-3 h-3" />
              Special Offer
            </span>

            <span className="text-[9px] font-bold text-[#7A5A18]">
              Limited Time
            </span>
          </div>

          <h3 className="mt-2 font-serif text-lg font-bold leading-tight text-[#0B2E25]">
            {banner.title}
          </h3>

          {banner.subtitle && (
            <p className="mt-1 text-[11px] leading-relaxed text-[#4E5A52]">
              {banner.subtitle}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCode}
              className="rounded-xl border border-[#0E382C]/25 bg-white/75 px-3 py-2 text-[10px] font-black text-[#0E382C] shadow-sm"
            >
              {copied ? (
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  COPIED
                </span>
              ) : (
                <span>{codeToCopy} • TAP TO COPY</span>
              )}
            </button>

            <div className="flex items-center gap-1 text-[11px] font-black text-[#0E382C]">
              {ctaLabel}
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
