import React from 'react';
import { MobileAppBanner } from '../../types/mobileApp';
import { resolveAssetUrl } from '../utils/nativeUrl';

interface AppPromoBannerProps {
  imageUrl?: string;
  banners: MobileAppBanner[];
  onNavigateAction: (linkAction: string) => void;
}

export const AppPromoBanner: React.FC<AppPromoBannerProps> = ({
  banners,
  imageUrl,
  onNavigateAction,
}) => {
  const banner = banners.filter((b) => b.published !== false && !/^(b2b|private-label|wholesale)$/i.test(b.linkAction || ''))[0];

  if (!banner) return null;

  const bgImage = resolveAssetUrl(imageUrl || banner.imageUrl);

  return (
    <div className="w-full px-4 py-3">
      <button
        type="button"
        onClick={() => onNavigateAction(banner.linkAction || 'shop')}
        className="relative w-full overflow-hidden rounded-3xl border border-[#D8B65D]/45 bg-[#FFF8E5] aspect-[3/1] shadow-none active:scale-[0.99] transition-all"
      >
        {bgImage ? (
          <img
            src={bgImage}
            alt={banner.title || 'Promotional Banner'}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8E5] to-[#F3E8CB]" />
        )}
      </button>
    </div>
  );
};
