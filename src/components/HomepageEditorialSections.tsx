import React from 'react';
import { ArrowRight, Sparkles, BookOpen, ShieldCheck, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { HomepageEditorialConfig, HomepageEditorialSectionItem } from '../types/store';
import { INITIAL_HOMEPAGE_EDITORIAL_CONFIG } from '../data/initialData';

interface HomepageEditorialSectionsProps {
  onNavigate?: (url: string) => void;
}

export const HomepageEditorialSections: React.FC<HomepageEditorialSectionsProps> = ({ onNavigate }) => {
  const { homepageEditorialConfig } = useStore();

  const config: HomepageEditorialConfig = {
    section1: { ...INITIAL_HOMEPAGE_EDITORIAL_CONFIG.section1, ...(homepageEditorialConfig?.section1 || {}) },
    section2: { ...INITIAL_HOMEPAGE_EDITORIAL_CONFIG.section2, ...(homepageEditorialConfig?.section2 || {}) },
    section3: { ...INITIAL_HOMEPAGE_EDITORIAL_CONFIG.section3, ...(homepageEditorialConfig?.section3 || {}) },
  };

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(url);
    } else {
      window.history.pushState({}, '', url);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div id="brand-story" className="w-full bg-[var(--color-surface)]/60 relative overflow-hidden border-y border-[var(--color-border)]/50">
      {/* Subtle Background Ambience */}
      <div className="absolute inset-0 bg-radial-gradient from-[var(--brand-gold)]/[0.03] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 space-y-16 sm:space-y-20 lg:space-y-28 relative z-10">
        
        {/* SECTION 1 — ROOTED IN TRIBAL WISDOM */}
        {config.section1.enabled !== false && (
          <section id="editorial-roots" className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
            {/* Image (Left on Desktop) */}
            <div className="lg:col-span-6 order-1">
              <div className="relative group mx-auto max-w-lg lg:max-w-none">
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--brand-gold)]/20 shadow-xl bg-[var(--brand-primary-dark)]">
                  <img
                    src={config.section1.image || '/images/hero_tribal_elders.jpg'}
                    alt={config.section1.imageAlt || config.section1.heading}
                    loading="lazy"
                    decoding="async"
                    className="w-full aspect-[4/3] object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
                  
                  {/* Subtle Badge */}
                  <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-semibold text-white/90">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                    <span>Mysuru Tribal Heritage</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content (Right on Desktop) */}
            <div className="lg:col-span-6 order-2 flex flex-col justify-center space-y-4 sm:space-y-5 text-left">
              <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-[var(--brand-gold)]/10 border border-[var(--brand-gold)]/25 text-[var(--brand-gold)] text-xs font-bold tracking-[0.18em] uppercase">
                <span>{config.section1.eyebrow || 'OUR ROOTS'}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--color-heading)] leading-tight">
                {config.section1.heading || 'ROOTED IN TRIBAL WISDOM'}
              </h2>

              <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed font-normal">
                {config.section1.description ||
                  'Inspired by generations of Hakki-Pikki herbal knowledge from Mysuru, HAKKIVEDA brings traditional botanical wisdom into thoughtfully crafted modern hair and wellness rituals.'}
              </p>

              <div className="pt-2">
                <a
                  href={config.section1.ctaLink || '/our-tribal-roots'}
                  onClick={(e) => handleLinkClick(e, config.section1.ctaLink || '/our-tribal-roots')}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-[var(--brand-gold-light)] hover:shadow-lg transition-all duration-200 group"
                >
                  <span>{config.section1.ctaText || 'KNOW MORE →'}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2 — INSIDE HAKKIVEDA */}
        {config.section2.enabled !== false && (
          <section id="editorial-craft" className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
            {/* Content (Left on Desktop, Below Image on Mobile) */}
            <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col justify-center space-y-4 sm:space-y-5 text-left">
              <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-[var(--brand-gold)]/10 border border-[var(--brand-gold)]/25 text-[var(--brand-gold)] text-xs font-bold tracking-[0.18em] uppercase">
                <span>{config.section2.eyebrow || 'OUR CRAFT'}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--color-heading)] leading-tight">
                {config.section2.heading || 'INSIDE HAKKIVEDA'}
              </h2>

              <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed font-normal">
                {config.section2.description ||
                  'Discover the botanical preparation behind HAKKIVEDA — from carefully selected herbs and traditional processing to the quality checks behind every finished formulation.'}
              </p>

              <div className="pt-2">
                <a
                  href={config.section2.ctaLink || '/how-hakkiveda-is-made'}
                  onClick={(e) => handleLinkClick(e, config.section2.ctaLink || '/how-hakkiveda-is-made')}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-[var(--brand-gold-light)] hover:shadow-lg transition-all duration-200 group"
                >
                  <span>{config.section2.ctaText || 'DISCOVER MORE →'}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Image (Right on Desktop, First on Mobile) */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative group mx-auto max-w-lg lg:max-w-none">
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--brand-gold)]/20 shadow-xl bg-[var(--brand-primary-dark)]">
                  <img
                    src={config.section2.image || '/images/hakkiveda_108_herbs_infographic.jpg'}
                    alt={config.section2.imageAlt || config.section2.heading}
                    loading="lazy"
                    decoding="async"
                    className="w-full aspect-[4/3] object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
                  
                  {/* Subtle Badge */}
                  <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-semibold text-white/90">
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                    <span>21-Day Slow Decoction</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 3 — THE HAKKIVEDA STORY */}
        {config.section3.enabled !== false && (
          <section id="editorial-story" className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
            {/* Image (Left on Desktop) */}
            <div className="lg:col-span-6 order-1">
              <div className="relative group mx-auto max-w-lg lg:max-w-none">
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--brand-gold)]/20 shadow-xl bg-[var(--brand-primary-dark)]">
                  <img
                    src={config.section3.image || '/images/hakkiveda_oil_couple_herbs.jpg'}
                    alt={config.section3.imageAlt || config.section3.heading}
                    loading="lazy"
                    decoding="async"
                    className="w-full aspect-[4/3] object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
                  
                  {/* Subtle Badge */}
                  <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-semibold text-white/90">
                    <Heart className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                    <span>Empowering Artisan Families</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content (Right on Desktop) */}
            <div className="lg:col-span-6 order-2 flex flex-col justify-center space-y-4 sm:space-y-5 text-left">
              <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-[var(--brand-gold)]/10 border border-[var(--brand-gold)]/25 text-[var(--brand-gold)] text-xs font-bold tracking-[0.18em] uppercase">
                <span>{config.section3.eyebrow || 'OUR JOURNEY'}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--color-heading)] leading-tight">
                {config.section3.heading || 'THE HAKKIVEDA STORY'}
              </h2>

              <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed font-normal">
                {config.section3.description ||
                  'A journey connecting Hakki-Pikki botanical traditions with a modern vision: preserving knowledge, creating authentic formulations and sharing those rituals with customers around the world.'}
              </p>

              <div className="pt-2">
                <a
                  href={config.section3.ctaLink || '/our-story'}
                  onClick={(e) => handleLinkClick(e, config.section3.ctaLink || '/our-story')}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-[var(--brand-gold-light)] hover:shadow-lg transition-all duration-200 group"
                >
                  <span>{config.section3.ctaText || 'READ OUR STORY →'}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
