import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Leaf, MapPin, Compass, ArrowLeft, BookOpen } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface OurTribalRootsPageProps {
  onReturnHome: () => void;
  onNavigateJournal?: (slug: string) => void;
  onNavigateProducts?: () => void;
}

export const OurTribalRootsPage: React.FC<OurTribalRootsPageProps> = ({
  onReturnHome,
  onNavigateJournal,
  onNavigateProducts,
}) => {
  const { blogs } = useStore();
  const relatedArticles = (blogs || []).filter((b) => b.category?.includes('Tribal') || b.category?.includes('Wisdom') || b.category?.includes('Rituals')).slice(0, 2);

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
          <span className="text-[var(--brand-gold)] font-semibold">Our Tribal Roots</span>
        </nav>
      </div>

      {/* Hero Header */}
      <div className="max-w-5xl mx-auto mb-12 sm:mb-16">
        <div className="relative rounded-3xl overflow-hidden border border-[var(--brand-gold)]/25 shadow-2xl bg-[var(--brand-primary-dark)]">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
            <img
              src="/images/hero_tribal_elders.jpg"
              alt="Hakki-Pikki tribal elders in Karnataka forests"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-primary-dark)] via-[var(--brand-primary-dark)]/60 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-gold)]/20 border border-[var(--brand-gold)]/40 text-[var(--brand-gold)] text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md">
              <MapPin className="w-3.5 h-3.5" />
              <span>FORESTS OF MYSURU & HUNSUR</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              ROOTED IN TRIBAL WISDOM
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl font-light">
              Centuries of botanical knowledge nurtured by the Hakki-Pikki community, translated into authentic restorative hair and wellness rituals.
            </p>
          </div>
        </div>
      </div>

      {/* Main Editorial Story Content */}
      <div className="max-w-4xl mx-auto space-y-12 sm:space-y-16">
        
        {/* Intro Block */}
        <section className="space-y-6 text-[var(--color-text-secondary)] leading-relaxed text-base sm:text-lg">
          <p className="font-serif text-xl sm:text-2xl text-[var(--color-heading)] leading-snug font-normal italic border-l-4 border-[var(--brand-gold)] pl-4 sm:pl-6 py-1">
            "We do not own the forest; we listen to its rhythms. Every root, leaf, and resin has its season and sacred hour."
          </p>
          <p>
            The Hakki-Pikki tribe represents one of Karnataka’s most revered indigenous botanical communities. For generations centered around the pristine green corridors of Hunsur and Mysuru, community elders have practiced intuitive ethno-botanical medicine—identifying wild herbs, roots, barks, and floral nectars at the exact phase of their seasonal vitality.
          </p>
          <p>
            HAKKIVEDA was founded to honor this irreplaceable heritage. Rather than modern industrial homogenization, we collaborate directly with native gatherers and herbal practitioners to bring authentic tribal scalp nourishment rituals to homes worldwide.
          </p>
        </section>

        {/* 3 Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-gold)]/10 border border-[var(--brand-gold)]/30 flex items-center justify-center text-[var(--brand-gold)]">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[var(--color-heading)]">Wildcrafted Harvesting</h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Herbs are gathered naturally from deep forest habitats without chemical cultivation or fertilizers, preserving pure elemental potency.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-gold)]/10 border border-[var(--brand-gold)]/30 flex items-center justify-center text-[var(--brand-gold)]">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[var(--color-heading)]">Oral Lineage</h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Formulation recipes are preserved through oral traditions, carefully passed down from tribal elders to maintain botanical balance.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-gold)]/10 border border-[var(--brand-gold)]/30 flex items-center justify-center text-[var(--brand-gold)]">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[var(--color-heading)]">Community Fair Trade</h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Every formulation supports native artisan livelihoods, fair remuneration, and sustainable forest regeneration initiatives.
            </p>
          </div>
        </div>

        {/* Visual Storytelling Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-6">
          <div className="rounded-2xl overflow-hidden border border-[var(--brand-gold)]/20 shadow-lg">
            <img
              src="/images/hakkiveda_oil_couple_herbs.jpg"
              alt="HAKKIVEDA tribal herbal artisans"
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
          <div className="space-y-4">
            <span className="text-xs font-bold tracking-[0.2em] text-[var(--brand-gold)] uppercase">ANCIENT KNOWLEDGE</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">
              The Living Botanical Tradition
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
              Unlike fast-manufactured cosmetics, Hakki-Pikki formulations respect the time required for plants to release their active fat-soluble phytoconstituents into cold-pressed oils. This creates a dense, dark, nutrient-rich oil with natural botanical sediment.
            </p>
          </div>
        </section>

        {/* Related Journal Links */}
        {relatedArticles.length > 0 && (
          <section className="pt-8 border-t border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-bold text-[var(--color-heading)]">
                Related Stories From The Journal
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
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">Experience Sacred Mysuru Hair Rituals</h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto font-light">
            Discover our hand-crafted 108 Mountain Herb Hair Oil, Scalp Densifying Serums, and Herbal Cleansers.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                if (onNavigateProducts) onNavigateProducts();
                else onReturnHome();
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-[var(--brand-gold-light)] shadow-lg transition-all"
            >
              <span>EXPLORE AUTHENTIC FORMULATIONS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
