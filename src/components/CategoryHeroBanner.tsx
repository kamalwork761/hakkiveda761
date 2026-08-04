import React from 'react';
import { CategoryPageConfig } from '../types/store';

interface CategoryHeroBannerProps {
  config: CategoryPageConfig;
  fallbackTitle: string;
  fallbackDescription?: string;
  onNavigateHome: () => void;
  badgeTag?: string;
}

export const CategoryHeroBanner: React.FC<CategoryHeroBannerProps> = ({
  config,
  fallbackTitle,
  onNavigateHome,
}) => {
  const heightDesktop = config.heroHeightDesktop || '520px';
  const heightMobile = config.heroHeightMobile || '320px';
  const objectFit = config.heroObjectFit || 'contain';
  const focalPoint = config.heroFocalPoint || 'center';

  const getObjectPosition = (pos: string) => {
    switch (pos) {
      case 'left':
        return 'left center';
      case 'right':
        return 'right center';
      case 'top':
        return 'center top';
      case 'bottom':
        return 'center bottom';
      case 'center':
      default:
        return 'center center';
    }
  };

  const desktopImg = config.desktopHeroImage || '/images/hakkiveda_108_oil_gold.jpg';
  const mobileImg = config.mobileHeroImage || desktopImg;

  return (
    <section className="w-full bg-[#081811] pt-6 pb-4 sm:pt-8 sm:pb-6 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-300 font-sans px-1">
          <button
            type="button"
            onClick={onNavigateHome}
            className="hover:text-[var(--brand-gold)] transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-[var(--brand-gold)] font-bold">
            {config.categoryName || config.title || fallbackTitle}
          </span>
        </nav>

        {/* HERO CONTAINER - PURE ARTWORK ONLY, NO HTML OVERLAYS */}
        <div
          className={`hero-banner-container-${config.id} relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-[#0A1A12] flex items-center justify-center transition-all duration-300`}
        >
          {/* Responsive Heights */}
          <style>{`
            .hero-banner-container-${config.id} {
              height: ${heightMobile};
              min-height: ${heightMobile};
            }
            @media (min-width: 768px) {
              .hero-banner-container-${config.id} {
                height: ${heightDesktop} !important;
                min-height: ${heightDesktop} !important;
              }
            }
          `}</style>

          {/* Media Player or Responsive Image Artwork */}
          {config.heroVideo ? (
            <video
              src={config.heroVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full"
              style={{
                objectFit: objectFit as any,
                objectPosition: getObjectPosition(focalPoint),
              }}
            />
          ) : (
            <picture className="w-full h-full block">
              {/* Mobile Hero Artwork */}
              <source media="(max-width: 767px)" srcSet={mobileImg} />
              {/* Desktop Hero Artwork */}
              <img
                src={desktopImg}
                alt={config.seoTitle || config.title || fallbackTitle}
                loading="lazy"
                decoding="async"
                className="w-full h-full transition-all duration-300"
                style={{
                  objectFit: objectFit as any,
                  objectPosition: getObjectPosition(focalPoint),
                }}
              />
            </picture>
          )}
        </div>
      </div>
    </section>
  );
};
