import React, { useState } from 'react';
import { Tag, Check, ArrowRight } from 'lucide-react';
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
  const activeBanners = banners.filter((b) => b.published !== false);
  const banner = activeBanners[0];

  if (!banner) return null;

  const bgImage = resolveAssetUrl(banner.imageUrl);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText('TRIBAL200');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full px-4 py-2.5">
      <div
        onClick={() => onNavigateAction(banner.linkAction || 'shop')}
        className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#0E382C] via-[#134E3F] to-[#07241C] text-white p-4 shadow-md border border-[#C5A059]/30 cursor-pointer active:scale-[0.99] transition-all"
      >
        {/* Subtle Background Pattern / Image */}
        {bgImage && (
          <img
            src={bgImage}
            alt={banner.title}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-15 mix-blend-overlay pointer-events-none"
          />
        )}

        <div className="relative z-10 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="bg-[#C5A059] text-[#0E382C] font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Tag className="w-2.5 h-2.5" />
              <span>Special Offer</span>
            </span>
            <span className="text-[10px] text-emerald-200 font-medium">
              Limited Tribal Batch
            </span>
          </div>

          <h3 className="font-serif text-base font-bold text-[#FDF8EC] leading-tight">
            {banner.title}
          </h3>

          {banner.subtitle && (
            <p className="text-xs text-emerald-100/80 mt-1 leading-snug font-sans">
              {banner.subtitle}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between gap-2">
            {/* Coupon Code Pill */}
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 text-xs font-mono font-bold text-[#C5A059] transition-colors"
            >
              <span>TRIBAL200</span>
              {copied ? (
                <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
              ) : (
                <span className="text-[9px] uppercase tracking-wider text-white/70">
                  Tap to Copy
                </span>
              )}
            </button>

            {/* Action link */}
            <div className="flex items-center gap-1 text-xs font-bold text-[#C5A059]">
              <span>Claim Discount</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
