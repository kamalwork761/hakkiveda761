import React from 'react';
import { ArrowLeft } from 'lucide-react';
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

  const handleBack = () => {
    onNavigateHome();
  };

  return (
    <section className="w-full bg-[#FAF8F2] dark:bg-[#081811] pt-3 pb-2 sm:pt-6 sm:pb-4 px-3 sm:px-8 lg:px-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-2.5 sm:space-y-4">
        {/* High-Contrast Navigation / Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-2 px-1">
          {/* Mobile Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="sm:hidden inline-flex items-center gap-1.5 text-xs font-bold text-[#123F2A] dark:text-[#E4C86A] py-1 px-2.5 rounded-full bg-white dark:bg-[#123F2B] border border-[#E5D8B5] dark:border-white/10 shadow-xs active:scale-95 transition-all cursor-pointer font-sans"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-sans select-none">
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-[#5F6B63] dark:text-white/90 hover:text-[#123F2A] dark:hover:text-[#E4C86A] font-semibold transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-[#C9A84E] font-bold select-none">/</span>
            <span className="text-[#123F2A] dark:text-[#E4C86A] font-bold truncate max-w-[200px] sm:max-w-none">
              {config.categoryName || config.title || fallbackTitle}
            </span>
          </nav>
        </div>

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

