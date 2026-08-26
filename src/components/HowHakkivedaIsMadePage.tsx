import React from 'react';
import { ShieldCheck, Flame, Droplets, CheckCircle2, Sparkles, ArrowRight, ArrowLeft, Beaker, FileCheck, Layers } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HowHakkivedaIsMadePageProps {
  onReturnHome: () => void;
  onNavigateJournal?: (slug: string) => void;
  onNavigateProducts?: () => void;
}

export const HowHakkivedaIsMadePage: React.FC<HowHakkivedaIsMadePageProps> = ({
  onReturnHome,
  onNavigateJournal,
  onNavigateProducts,
}) => {
  const { blogs } = useStore();
  const relatedArticles = (blogs || []).filter((b) => b.category?.includes('Science') || b.category?.includes('Rituals') || b.category?.includes('Scalp')).slice(0, 2);

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
          <span className="text-[var(--brand-gold)] font-semibold">Inside HAKKIVEDA — How It Is Made</span>
        </nav>
      </div>

      {/* Hero Header */}
      <div className="max-w-5xl mx-auto mb-12 sm:mb-16">
        <div className="relative rounded-3xl overflow-hidden border border-[var(--brand-gold)]/25 shadow-2xl bg-[var(--brand-primary-dark)]">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
            <img
              src="/images/hakkiveda_108_herbs_infographic.jpg"
              alt="HAKKIVEDA authentic botanical herbs and preparation"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-primary-dark)] via-[var(--brand-primary-dark)]/60 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-gold)]/20 border border-[var(--brand-gold)]/40 text-[var(--brand-gold)] text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md">
              <Flame className="w-3.5 h-3.5" />
              <span>THE 21-DAY SLOW CRAFT</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              INSIDE HAKKIVEDA
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl font-light">
              From hand-selected mountain botanicals to traditional copper cauldron woodfire decoction and verified laboratory safety checks.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-12 sm:space-y-16">
        
        {/* Intro */}
        <section className="space-y-4 text-[var(--color-text-secondary)] leading-relaxed text-base sm:text-lg">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">
            Authentic Traditional Formulation Process
          </h2>
          <p>
            Unlike mass-produced commercial hair oils that rely on mineral oil (liquid paraffin), chemical preservatives, and synthetic perfumes, HAKKIVEDA follows traditional classical Ayurvedic preparation principles (*Sneha Kalpana*). Every batch undergoes a meticulous 4-stage artisan cycle spanning 21 continuous days.
          </p>
        </section>

        {/* 4 Stages Timeline */}
        <div className="space-y-8">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-heading)] border-b border-[var(--color-border)] pb-3">
            The 4-Stage Preparation Cycle
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Stage 1 */}
            <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--brand-gold)] uppercase tracking-widest">STAGE 01</span>
                <span className="text-xs text-[var(--color-text-secondary)]">Days 1–3</span>
              </div>
              <h4 className="font-serif text-lg font-bold text-[var(--color-heading)]">Botanical Sourcing & Sun-Drying</h4>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                42+ wild mountain botanicals (Bhringraj, Amla, Gunja, Jatamansi, Nagarmotha, Brahmi, Hibiscus, Vetiver, and Shikakai) are gathered by tribal elders in Mysuru and naturally shadow-dried to retain active bio-nutrients.
              </p>
            </div>

            {/* Stage 2 */}
            <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--brand-gold)] uppercase tracking-widest">STAGE 02</span>
                <span className="text-xs text-[var(--color-text-secondary)]">Days 4–18</span>
              </div>
              <h4 className="font-serif text-lg font-bold text-[var(--color-heading)]">21-Day Slow Copper Decoction</h4>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Herbal kashayam (decoction) is infused with cold-pressed virgin sesame and coconut oils in pure heavy-bottom copper cauldrons over a regulated low flame until all water moisture evaporates and lipid absorption reaches peak concentration.
              </p>
            </div>

            {/* Stage 3 */}
            <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--brand-gold)] uppercase tracking-widest">STAGE 03</span>
                <span className="text-xs text-[var(--color-text-secondary)]">Days 19–20</span>
              </div>
              <h4 className="font-serif text-lg font-bold text-[var(--color-heading)]">Natural Settling & Triple Filtration</h4>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                The rich dark formulation is allowed to settle in earthen vessels, then filtered through unbleached multi-layered cotton cloths to separate coarse plant fibers while preserving active micronutrients and aromatic volatile botanicals.
              </p>
            </div>

            {/* Stage 4 */}
            <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--brand-gold)] uppercase tracking-widest">STAGE 04</span>
                <span className="text-xs text-[var(--color-text-secondary)]">Day 21</span>
              </div>
              <h4 className="font-serif text-lg font-bold text-[var(--color-heading)]">Laboratory Verification & Hand-Bottling</h4>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Every finished batch undergoes independent laboratory verification for purity, safety, and physical properties before being hand-bottled and sealed in Mysuru with unique batch traceability codes.
              </p>
            </div>

          </div>
        </div>

        {/* Quality Testing & Claim Discipline */}
        <section className="p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--brand-gold)]/30 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--brand-gold)]/10 text-[var(--brand-gold)] border border-[var(--brand-gold)]/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-[var(--brand-gold)] tracking-widest uppercase">QUALITY & SAFETY VERIFICATION</span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-heading)]">
                Tested For Pure Botanical Integrity
              </h3>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
            We adhere strictly to transparent, verifiable safety criteria. We never make unsubstantiated or misleading claims. Every batch is verified against stringent laboratory quality benchmarks:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]">
              <CheckCircle2 className="w-5 h-5 text-[var(--brand-gold)] flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-sm text-[var(--color-heading)]">Heavy Metal Screened</h5>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Tested for Lead, Mercury, Arsenic & Cadmium limits.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]">
              <CheckCircle2 className="w-5 h-5 text-[var(--brand-gold)] flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-sm text-[var(--color-heading)]">Microbiological Purity</h5>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Certified pathogen-free and sterile production conditions.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]">
              <CheckCircle2 className="w-5 h-5 text-[var(--brand-gold)] flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-sm text-[var(--color-heading)]">Zero Mineral Oil / Paraffin</h5>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">100% pure cold-pressed botanical carrier oil base.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]">
              <CheckCircle2 className="w-5 h-5 text-[var(--brand-gold)] flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-sm text-[var(--color-heading)]">Zero Artificial Fragrance</h5>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Natural herbal aroma derived purely from wild roots and herbs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Journal Links */}
        {relatedArticles.length > 0 && (
          <section className="pt-8 border-t border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-bold text-[var(--color-heading)]">
                Related Formulation Insights
              </h3>
              <a
                href="/journal"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigateJournal) onNavigateJournal('');
                }}
                className="text-xs font-bold text-[var(--brand-gold)] hover:underline uppercase tracking-wider"
              >
                View All Stories →
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
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">Discover Small-Batch Herbal Formulations</h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto font-light">
            Every bottle is hand-poured in Mysuru with 108 mountain herbs and traditional cold-pressed oils.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                if (onNavigateProducts) onNavigateProducts();
                else onReturnHome();
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-[var(--brand-gold-light)] shadow-lg transition-all"
            >
              <span>SHOP HAKKIVEDA FORMULATIONS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
