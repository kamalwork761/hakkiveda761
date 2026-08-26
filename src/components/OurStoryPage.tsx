import React from 'react';
import { Heart, Sparkles, ArrowRight, ArrowLeft, Globe, Users, Award, Shield, BookOpen } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface OurStoryPageProps {
  onReturnHome: () => void;
  onNavigateJournal?: (slug: string) => void;
  onNavigateProducts?: () => void;
}

export const OurStoryPage: React.FC<OurStoryPageProps> = ({
  onReturnHome,
  onNavigateJournal,
  onNavigateProducts,
}) => {
  const { blogs } = useStore();
  const relatedArticles = (blogs || []).slice(0, 2);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb & Top Bar */}
      <div className="max-w-5xl mx-auto mb-8">
        <button
          onClick={onReturnHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--brand-gold)] hover:text-[var(--brand-gold-light)] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO HOMEPAGE</span>
        </button>

        <nav className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
          <span onClick={onReturnHome} className="cursor-pointer hover:underline">Home</span>
          <span>/</span>
          <span className="text-[var(--brand-gold)] font-semibold">The HAKKIVEDA Story</span>
        </nav>
      </div>

      {/* Hero Header */}
      <div className="max-w-5xl mx-auto mb-12 sm:mb-16">
        <div className="relative rounded-3xl overflow-hidden border border-[var(--brand-gold)]/25 shadow-2xl bg-[var(--brand-primary-dark)]">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
            <img
              src="/images/hakkiveda_oil_couple_herbs.jpg"
              alt="The Founders & Artisans of HAKKIVEDA"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-primary-dark)] via-[var(--brand-primary-dark)]/60 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-gold)]/20 border border-[var(--brand-gold)]/40 text-[var(--brand-gold)] text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md">
              <Heart className="w-3.5 h-3.5" />
              <span>A SACRED VOCATION</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              THE HAKKIVEDA STORY
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl font-light">
              Connecting Hakki-Pikki botanical traditions with modern quality standards to share authentic hair and scalp wellness rituals with the world.
            </p>
          </div>
        </div>
      </div>

      {/* Main Narrative */}
      <div className="max-w-4xl mx-auto space-y-12 sm:space-y-16">
        
        {/* Section 1: The Origin */}
        <section className="space-y-6 text-[var(--color-text-secondary)] leading-relaxed text-base sm:text-lg">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">
            Where Ancient Forest Knowledge Meets Purpose
          </h2>
          <p>
            HAKKIVEDA began with a single realization: the ancient tribal communities of Karnataka possessed unmatched knowledge of forest botanicals for hair vitality and scalp longevity—yet this irreplaceable wisdom was at risk of fading as modern industrial cosmetics flooded the marketplace with petrochemical shortcuts.
          </p>
          <p>
            Determined to protect and celebrate this legacy, our founders established HAKKIVEDA in Mysuru as an ethical botanical bridge. We set out to create pure, uncompromised hair rituals formulated with real herbs harvested by Hakki-Pikki tribal elders.
          </p>
        </section>

        {/* 3 Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-gold)]/10 border border-[var(--brand-gold)]/30 flex items-center justify-center text-[var(--brand-gold)]">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[var(--color-heading)]">Absolute Integrity</h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              We reject cheap fillers, mineral oil, artificial colorants, and synthetic fragrances. Every bottle is 100% plant-powered.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-gold)]/10 border border-[var(--brand-gold)]/30 flex items-center justify-center text-[var(--brand-gold)]">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[var(--color-heading)]">Tribal Empowerment</h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              We work directly with native gatherers, ensuring fair compensation and preserving ancestral forest foraging traditions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-gold)]/10 border border-[var(--brand-gold)]/30 flex items-center justify-center text-[var(--brand-gold)]">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[var(--color-heading)]">Global Availability</h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Delivering authentic sacred Indian rituals to conscious consumers across India, the Middle East, Southeast Asia, and worldwide.
            </p>
          </div>
        </div>

        {/* Section 2: The Promise */}
        <section className="p-8 sm:p-10 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">
            Our Promise to You
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
            When you apply HAKKIVEDA to your roots, you are participating in a timeless ritual. You are connecting with the restorative richness of 108 mountain herbs, the warmth of copper cauldron woodfire decoction, and the sacred craftsmanship of Mysuru elders.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--brand-gold)]">
              <Sparkles className="w-4 h-4" />
              <span>Small-Batch Handcrafted</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--brand-gold)]">
              <Sparkles className="w-4 h-4" />
              <span>Lab Verified Safety</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--brand-gold)]">
              <Sparkles className="w-4 h-4" />
              <span>100% Cruelty-Free & Natural</span>
            </div>
          </div>
        </section>

        {/* Related Journal Links */}
        {relatedArticles.length > 0 && (
          <section className="pt-8 border-t border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-bold text-[var(--color-heading)]">
                More From The Journal
              </h3>
              <a
                href="/journal"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigateJournal) onNavigateJournal('');
                }}
                className="text-xs font-bold text-[var(--brand-gold)] hover:underline uppercase tracking-wider"
              >
                View All →
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => onNavigateJournal && onNavigateJournal(art.slug || art.id)}
                  className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--brand-gold)] cursor-pointer transition-all flex gap-4 items-center group"
                >
                  <img
                    src={art.image || '/images/hakkiveda_108_oil_gold.jpg'}
                    alt={art.title}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <span className="text-[11px] text-[var(--brand-gold)] font-bold uppercase">{art.category}</span>
                    <h4 className="font-serif text-sm font-bold text-[var(--color-heading)] group-hover:text-[var(--brand-gold)] transition-colors line-clamp-2">
                      {art.title}
                    </h4>
                    <span className="text-xs text-[var(--color-text-secondary)]">{art.readTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[var(--brand-primary-dark)] to-[#092218] text-white text-center space-y-4 border border-[var(--brand-gold)]/30 shadow-xl">
          <Sparkles className="w-8 h-8 text-[var(--brand-gold)] mx-auto" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">Start Your Sacred Hair Ritual</h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto font-light">
            Explore our complete line of tribal-inspired herbal formulations crafted with care in Mysuru.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                if (onNavigateProducts) onNavigateProducts();
                else onReturnHome();
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-[var(--brand-gold-light)] shadow-lg transition-all"
            >
              <span>EXPLORE ALL FORMULATIONS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
