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
        className="relative overflow-hidden rounded-3xl border border-[#D8B65D]/45 bg-[#FFF8E5] aspect-[3/1] p-3 shadow-none cursor-pointer active:scale-[0.99] transition-all"
      >
        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/35" />
        <div className="absolute right-4 bottom-2 opacity-10">
          <Gift className="w-24 h-24 text-[#0E382C]" />
        </div>

        {bgImage && (
          <>
            <img
              src={bgImage}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8E5]/95 via-[#FFF8E5]/72 to-transparent" />
          </>
        )}

        <div className="relative z-10 max-w-[62%]">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#0E382C] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#F7D978]">
              <Tag className="w-3 h-3" />
              Special Offer
            </span>

            <span className="text-[9px] font-bold text-[#7A5A18]">
              Limited Time
            </span>
          </div>

          <h3 className="mt-1.5 font-serif text-base font-bold leading-tight text-[#0B2E25]">
            {banner.title}
          </h3>

          {banner.subtitle && (
            <p className="mt-1 text-[9px] leading-snug text-[#4E5A52] line-clamp-2">
              {banner.subtitle}
            </p>
          )}

          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCode}
              className="rounded-lg border border-[#0E382C]/25 bg-white/80 px-2.5 py-1.5 text-[9px] font-black text-[#0E382C] shadow-sm"
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

            <div className="flex items-center gap-1 text-[10px] font-black text-[#0E382C]">
              {ctaLabel}
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
