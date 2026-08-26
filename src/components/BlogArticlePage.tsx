import React, { useState } from 'react';
import { BookOpen, Clock, Calendar, ArrowLeft, Share2, Sparkles, ShoppingBag, Check, Copy, ArrowRight, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BlogArticle, Product } from '../types/store';

interface BlogArticlePageProps {
  slugOrId: string;
  onReturnToJournal: () => void;
  onReturnHome: () => void;
  onNavigateArticle: (slugOrId: string) => void;
  onNavigateProduct?: (product: Product) => void;
}

export const BlogArticlePage: React.FC<BlogArticlePageProps> = ({
  slugOrId,
  onReturnToJournal,
  onReturnHome,
  onNavigateArticle,
  onNavigateProduct,
}) => {
  const { blogs, products, addToCart } = useStore();
  const [copied, setCopied] = useState(false);

  // Find article by slug or id
  const article = (blogs || []).find(
    (b) => b.slug === slugOrId || b.id === slugOrId || b.slug?.toLowerCase() === slugOrId?.toLowerCase()
  ) || blogs?.[0];

  const relatedProducts = (products || []).filter((p) => {
    if (article?.relatedProducts && article.relatedProducts.includes(p.id)) return true;
    return p.category === 'Hair Oils' || p.category === 'Scalp Treatments';
  }).slice(0, 2);

  const otherArticles = (blogs || []).filter((b) => b.id !== article?.id).slice(0, 3);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold font-serif text-[var(--color-heading)]">Article Not Found</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">The requested journal story could not be located.</p>
        <button
          onClick={onReturnToJournal}
          className="px-6 py-2.5 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold text-xs uppercase"
        >
          Return to Journal
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Navigation */}
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={onReturnToJournal}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--brand-gold)] hover:text-[var(--brand-gold-light)] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO THE JOURNAL</span>
        </button>

        <nav className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] truncate">
          <span onClick={onReturnHome} className="cursor-pointer hover:underline">Home</span>
          <span>/</span>
          <span onClick={onReturnToJournal} className="cursor-pointer hover:underline">Journal</span>
          <span>/</span>
          <span className="text-[var(--brand-gold)] font-semibold truncate">{article.title}</span>
        </nav>
      </div>

      {/* Article Header */}
      <div className="max-w-4xl mx-auto space-y-6 mb-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-[var(--brand-gold)]/10 border border-[var(--brand-gold)]/30 text-[var(--brand-gold)] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            {article.category || 'Hair Rituals'}
          </span>
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <Clock className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
            <span>{article.readTime || '5 min read'}</span>
            <span>•</span>
            <span>{article.date || 'Mysuru Botanical Journal'}</span>
          </div>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--color-heading)] leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center justify-between border-y border-[var(--color-border)] py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/30 flex items-center justify-center font-serif font-bold text-[var(--brand-gold)]">
              HV
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--color-heading)]">{article.author || 'Dr. Hakki Vaidya'}</p>
              <p className="text-[11px] text-[var(--color-text-secondary)]">Ayurvedic Trichology & Forest Lore</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--brand-gold)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--brand-gold)] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="max-w-4xl mx-auto mb-10 sm:mb-12">
        <div className="rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-xl bg-[var(--brand-primary-dark)]">
          <img
            src={article.image || '/images/hakkiveda_108_oil_gold.jpg'}
            alt={article.title}
            className="w-full aspect-[16/9] object-cover"
          />
        </div>
      </div>

      {/* Article Body */}
      <article className="max-w-3xl mx-auto space-y-6 text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed font-normal">
        {article.excerpt && (
          <p className="font-serif text-xl sm:text-2xl text-[var(--color-heading)] leading-snug font-normal italic border-l-4 border-[var(--brand-gold)] pl-4 sm:pl-6 py-1 mb-8">
            "{article.excerpt}"
          </p>
        )}

        <div className="space-y-6 whitespace-pre-line">
          {article.content ? (
            article.content.split('\n\n').map((paragraph, pIdx) => (
              <p key={pIdx} className="leading-relaxed">
                {paragraph}
              </p>
            ))
          ) : (
            <p>
              Ancient Hakki-Pikki tribal hair rituals center on deep botanical scalp absorption. Using pure cold-pressed oils as natural bio-carriers, herbal phytonutrients penetrate root follicles, cooling excess Pitta heat and nourishing keratin structures.
            </p>
          )}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-8 border-t border-[var(--color-border)] flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-[var(--brand-gold)]" />
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Related Products Feature */}
      {relatedProducts.length > 0 && (
        <div className="max-w-4xl mx-auto my-14 p-6 sm:p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--brand-gold)]/25 space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[var(--brand-gold)] uppercase">
            <Sparkles className="w-4 h-4" />
            <span>FEATURED FORMULATIONS MENTIONED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedProducts.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] group"
              >
                <img
                  src={prod.images?.[0] || prod.image || '/images/hakkiveda_108_oil_gold.jpg'}
                  alt={prod.name}
                  className="w-20 h-20 rounded-xl object-cover bg-white/5"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-sm font-bold text-[var(--color-heading)] truncate group-hover:text-[var(--brand-gold)] transition-colors">
                    {prod.name}
                  </h4>
                  <p className="text-xs text-[var(--brand-gold)] font-bold mt-1">₹{prod.price}</p>
                  <button
                    onClick={() => {
                      if (onNavigateProduct) onNavigateProduct(prod);
                      else onReturnHome();
                    }}
                    className="mt-2 text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--brand-gold)] flex items-center gap-1 uppercase tracking-wider"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Stories */}
      {otherArticles.length > 0 && (
        <div className="max-w-4xl mx-auto pt-10 border-t border-[var(--color-border)] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-[var(--color-heading)]">More From The Journal</h3>
            <button
              onClick={onReturnToJournal}
              className="text-xs font-bold text-[var(--brand-gold)] hover:underline uppercase tracking-wider"
            >
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {otherArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => onNavigateArticle(art.slug || art.id)}
                className="rounded-2xl overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--brand-gold)]/60 cursor-pointer group transition-all"
              >
                <img
                  src={art.image || '/images/hakkiveda_108_oil_gold.jpg'}
                  alt={art.title}
                  className="w-full aspect-[16/10] object-cover"
                />
                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-bold text-[var(--brand-gold)] uppercase tracking-wider">
                    {art.category}
                  </span>
                  <h4 className="font-serif text-sm font-bold text-[var(--color-heading)] group-hover:text-[var(--brand-gold)] transition-colors line-clamp-2">
                    {art.title}
                  </h4>
                  <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">
                    {art.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
