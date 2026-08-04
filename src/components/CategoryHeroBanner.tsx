import React from 'react';
import { Sparkles, ShieldCheck, Droplet, Award, ArrowRight } from 'lucide-react';
import { CategoryPageConfig } from '../types/store';

interface CategoryHeroBannerProps {
  config: CategoryPageConfig;
  fallbackTitle: string;
  fallbackDescription: string;
  onNavigateHome: () => void;
  badgeTag?: string;
  badges?: Array<{ icon: React.FC<{ className?: string }>; text: string }>;
}

export const CategoryHeroBanner: React.FC<CategoryHeroBannerProps> = ({
  config,
  fallbackTitle,
  fallbackDescription,
  onNavigateHome,
  badgeTag = 'Adivasi Botanical Legacy',
  badges = [
    { icon: ShieldCheck, text: '100% Herbal & Chemical-Free' },
    { icon: Droplet, text: 'Copper Cauldron Slow Brewed' },
    { icon: Award, text: 'Authentic Mysore Heritage' },
  ],
}) => {
  // Configurable dimensions
  const heightDesktop = config.heroHeightDesktop || '600px';
  const heightMobile = config.heroHeightMobile || '450px';
  const objectFit = config.heroObjectFit || 'cover';
  const focalPoint = config.heroFocalPoint || 'center';
  const overlayOpacity = (config.heroOverlayOpacity ?? 60) / 100;
  const textColor = config.heroTextColor || '#FFFFFF';

  // Map focal point string to object-position CSS
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
    <section className="relative w-full bg-[#081811] border-b border-white/10 pt-6 pb-8 sm:py-10 px-4 sm:px-8 lg:px-12 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--brand-gold)]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6 flex items-center gap-2 text-xs text-slate-300 font-sans">
          <button
            type="button"
            onClick={onNavigateHome}
            className="hover:text-[var(--brand-gold)] transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-[var(--brand-gold)] font-bold">{config.categoryName || config.title}</span>
        </nav>

        {/* HERO BANNER CONTAINER (Width fills content area, height approx 550-700px on desktop) */}
        <div
          className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/15 transition-all duration-300 flex items-center"
          style={{
            minHeight: heightMobile,
          }}
        >
          {/* Responsive Height Wrapper via Inline CSS Custom Class */}
          <style>{`
            @media (min-width: 768px) {
              .hero-banner-container-${config.id} {
                height: ${heightDesktop} !important;
                min-height: ${heightDesktop} !important;
              }
            }
          `}</style>

          {/* BACKGROUND MEDIA (Video or Responsive Picture) */}
          <div className={`hero-banner-container-${config.id} absolute inset-0 w-full h-full bg-[#0E281C]`}>
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
                {/* Mobile specific image source */}
                <source media="(max-width: 767px)" srcSet={mobileImg} />
                {/* Desktop fallback image source */}
                <img
                  src={desktopImg}
                  alt={config.seoTitle || config.title || fallbackTitle}
                  loading="eager"
                  // @ts-ignore
                  fetchpriority="high"
                  className="w-full h-full transition-all duration-300"
                  style={{
                    objectFit: objectFit as any,
                    objectPosition: getObjectPosition(focalPoint),
                  }}
                />
              </picture>
            )}

            {/* DARK OVERLAY WITH CONFIGURABLE OPACITY & GRADIENT SCRIM FOR HIGH READABILITY */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#081811] via-[#081811]/85 to-transparent"
              style={{
                opacity: overlayOpacity,
              }}
            />
          </div>

          {/* HTML EDITABLE OVERLAY CONTENT (SEO Compliant, Not embedded in image) */}
          <div className="relative z-10 w-full p-6 sm:p-10 lg:p-14 max-w-3xl space-y-5" style={{ color: textColor }}>
            {/* Category Subtitle Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--brand-gold)]/20 border border-[var(--brand-gold)]/40 text-[var(--brand-gold)] text-xs font-extrabold font-sans uppercase tracking-widest shadow-inner backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badgeTag}</span>
            </div>

            {/* Editable H1 Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold leading-tight drop-shadow-md">
              {config.title || fallbackTitle}
            </h1>

            {/* Editable Short Description */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed font-sans max-w-2xl drop-shadow">
              {config.shortDescription || fallbackDescription}
            </p>

            {/* Feature Badges */}
            <div className="pt-2 flex flex-wrap gap-3 text-xs font-sans">
              {badges.map((b, idx) => {
                const IconComponent = b.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-emerald-950/80 border border-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm text-slate-100 font-semibold"
                  >
                    <IconComponent className="w-4 h-4 text-[var(--brand-gold)] shrink-0" />
                    <span>{b.text}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="pt-3">
              <a
                href={config.ctaLink || '#products'}
                className="inline-flex items-center gap-2 bg-[var(--brand-gold,#D4AF37)] hover:bg-amber-400 text-emerald-950 px-6 py-3 rounded-full font-serif-luxury font-bold text-sm tracking-wide shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>{config.ctaText || 'Explore Formulations'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
