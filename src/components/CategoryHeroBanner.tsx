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
  const desktopImg = config.desktopHeroImage || '/images/hakkiveda_108_oil_gold.jpg';
  const mobileImg =
    config.mobileHeroImage && config.mobileHeroImage.trim() !== ''
      ? config.mobileHeroImage
      : desktopImg;

  return (
    <section className="w-full bg-[#FAF8F2] dark:bg-[#081811] pt-4 pb-2 sm:pt-6 sm:pb-4 px-4 sm:px-8 lg:px-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4">
        {/* High-Contrast Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-sans px-1 select-none">
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-[#5F6B63] dark:text-white/90 hover:text-[#123F2A] dark:hover:text-[#E4C86A] font-semibold transition-colors cursor-pointer"
          >
            Home
          </button>
          <span className="text-[#C9A84E] font-bold select-none">/</span>
          <span className="text-[#123F2A] dark:text-[#E4C86A] font-bold">
            {config.categoryName || config.title || fallbackTitle}
          </span>
        </nav>

        {/* HERO CONTAINER - PURE ARTWORK ONLY, ADAPTING NATURALLY TO IMAGE ASPECT RATIO */}
        <div
          id={`category-hero-container-${config.id}`}
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md sm:shadow-lg border border-[#E5D8B5] dark:border-white/15 bg-white dark:bg-[#0A1A12] flex items-center justify-center transition-all duration-300"
        >
          {config.heroVideo ? (
            <video
              src={config.heroVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto block rounded-2xl sm:rounded-3xl"
            />
          ) : (
            <picture className="w-full block">
              {/* Mobile Hero Artwork (if defined and different from desktop) */}
              {mobileImg !== desktopImg && (
                <source media="(max-width: 767px)" srcSet={mobileImg} />
              )}
              {/* Desktop / Responsive Hero Artwork */}
              <img
                src={desktopImg}
                alt={config.seoTitle || config.title || fallbackTitle}
                loading="eager"
                decoding="async"
                className="w-full h-auto block object-contain rounded-2xl sm:rounded-3xl"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 'none',
                  display: 'block',
                }}
              />
            </picture>
          )}
        </div>
      </div>
    </section>
  );
};

