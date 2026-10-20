import React from 'react';
import { MobileAppBanner } from '../../types/mobileApp';
import { resolveAssetUrl } from '../utils/nativeUrl';

interface AppPromoBannerProps {
  imageUrl?: string;
  index?: number;
  banners: MobileAppBanner[];
  onNavigateAction: (linkAction: string) => void;
}

export const AppPromoBanner: React.FC<AppPromoBannerProps> = ({
  banners,
  imageUrl,
  index = 0,
  onNavigateAction,
}) => {
  const activeBanners = banners.filter((b) => b.published !== false && !/^(b2b|private-label|wholesale)$/i.test(b.linkAction || '')).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  const banner = activeBanners[index % activeBanners.length];

  if (!banner) return null;

  const bgImage = resolveAssetUrl(imageUrl || banner.imageUrl);

  return (
    <div className="w-full px-4 py-3">
      <style>{`@keyframes hvGoldOrbit { to { transform: rotate(360deg); } } @media (prefers-reduced-motion: reduce) { .hv-gold-orbit { animation: none !important; } }`}</style>
      <div className="relative overflow-hidden rounded-[26px] border-[2px] border-[#754609] bg-[#4F300A] p-[4px] shadow-[0_7px_22px_rgba(105,62,8,0.32)]">
        <div aria-hidden="true" className="hv-gold-orbit pointer-events-none absolute -inset-[110%] bg-[conic-gradient(from_0deg,#4A2803_0%,#A56A12_20%,#FFFBE0_27%,#FFD34B_33%,#593203_42%,#B57A19_65%,#FFF2A1_72%,#5A3307_82%,#4A2803_100%)]" style={{ animation: "hvGoldOrbit 5s linear infinite" }} />
      <button
        type="button"
        onClick={() => onNavigateAction(banner.linkAction || 'shop')}
        className="relative block w-full overflow-hidden rounded-[19px] bg-[#FFF8E5] aspect-[3/1] active:scale-[0.99] transition-all"
      >
        {bgImage ? (
          <img
            src={bgImage}
            alt={banner.title || 'Promotional Banner'}
            className="absolute inset-0 w-full h-full object-contain object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8E5] to-[#F3E8CB]" />
        )}
      </button>
      </div>
    </div>
  );
};
