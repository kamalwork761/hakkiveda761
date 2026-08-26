import React, { useState, useMemo } from 'react';
import { BookOpen, Clock, Search, ArrowRight, ArrowLeft, Tag, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BlogArticle } from '../types/store';

interface JournalListingPageProps {
  onReturnHome: () => void;
  onSelectArticle: (slugOrId: string) => void;
}

export const JournalListingPage: React.FC<JournalListingPageProps> = ({
  onReturnHome,
  onSelectArticle,
}) => {
  const { blogs } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const publishedBlogs = useMemo(() => {
    return (blogs || []).filter((b) => b.status === 'PUBLISHED' || !b.status);
  }, [blogs]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    publishedBlogs.forEach((b) => {
      if (b.category) cats.add(b.category);
    });
    return ['ALL', ...Array.from(cats)];
  }, [publishedBlogs]);

  const filteredArticles = useMemo(() => {
    return publishedBlogs.filter((art) => {
      const matchesCat = selectedCategory === 'ALL' || art.category === selectedCategory;
      const matchesSearch =
        searchTerm === '' ||
        art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.author?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [publishedBlogs, selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb & Navigation */}
      <div className="max-w-6xl mx-auto mb-8">
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
          <span className="text-[var(--brand-gold)] font-semibold">The Botanical Journal</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10 sm:mb-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-gold)]/10 border border-[var(--brand-gold)]/25 text-[var(--brand-gold)] text-xs font-bold tracking-[0.2em] uppercase">
          <BookOpen className="w-3.5 h-3.5" />
          <span>THE BOTANICAL JOURNAL</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--color-heading)]">
          Ayurvedic Trichology & Tribal Lore
        </h1>
        <p className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
          Explore botanical hair wisdom, wildcrafting ethics, clinical insights, and authentic scalp preservation rituals.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="max-w-6xl mx-auto mb-10 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          
          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow-md font-bold'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--brand-gold)]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search stories & herbs..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text)] focus:border-[var(--brand-gold)] focus:outline-none transition-colors"
            />
          </div>

        </div>
      </div>

      {/* Article Grid */}
      <div className="max-w-6xl mx-auto">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] space-y-3">
            <BookOpen className="w-10 h-10 text-[var(--color-text-secondary)] mx-auto opacity-50" />
            <p className="text-base font-semibold text-[var(--color-heading)]">No stories match your criteria</p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchTerm('');
              }}
              className="text-xs font-bold text-[var(--brand-gold)] hover:underline uppercase"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArticles.map((article) => (
              <article
                key={article.id || article.slug}
                onClick={() => onSelectArticle(article.slug || article.id)}
                className="flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--brand-gold)]/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--brand-primary-dark)]">
                  <img
                    src={article.image || '/images/hakkiveda_108_oil_gold.jpg'}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50" />
                  
                  <span className="absolute top-3 left-3 bg-black/65 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-[var(--brand-gold)] border border-[var(--brand-gold)]/30 uppercase tracking-wider">
                    {article.category || 'Hair Rituals'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                        {article.readTime || '4 min read'}
                      </span>
                      <span>•</span>
                      <span>{article.date || 'Tribal Formulation'}</span>
                    </div>

                    <h2 className="font-serif text-lg font-bold text-[var(--color-heading)] group-hover:text-[var(--brand-gold)] transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] line-clamp-3 leading-relaxed font-normal">
                      {article.excerpt || (article.content ? article.content.substring(0, 140) + '...' : '')}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--color-border)]/50 flex items-center justify-between">
                    <span className="text-[11px] text-[var(--color-text-secondary)] italic truncate max-w-[140px]">
                      By {article.author}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--brand-gold)] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                      <span>READ</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
