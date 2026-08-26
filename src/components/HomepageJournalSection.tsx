import React, { useState } from 'react';
import { BookOpen, Clock, Calendar, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useSmoothAutoScroll } from '../hooks/useSmoothAutoScroll';
import { BlogArticle } from '../types/store';

interface HomepageJournalSectionProps {
  onNavigate?: (url: string) => void;
}

export const HomepageJournalSection: React.FC<HomepageJournalSectionProps> = ({ onNavigate }) => {
  const { blogs } = useStore();

  // Filter published blogs
  const publishedArticles = (blogs || []).filter((b) => b.status === 'PUBLISHED' || !b.status);
  const displayArticles = publishedArticles.length > 0 ? publishedArticles.slice(0, 8) : [];

  const handleArticleClick = (e: React.MouseEvent, slugOrId: string) => {
    e.preventDefault();
    const url = `/journal/${slugOrId}`;
    if (onNavigate) {
      onNavigate(url);
    } else {
      window.history.pushState({}, '', url);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleExploreAllClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = '/journal';
    if (onNavigate) {
      onNavigate(url);
    } else {
      window.history.pushState({}, '', url);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Mobile auto-scroll hook
  const repeatCount = 3;
  const {
    containerRef: mobileContainerRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleScroll,
    isDragging,
  } = useSmoothAutoScroll({
    itemCount: displayArticles.length,
    repeatCount,
    pixelsPerSecond: 26,
    pauseDuration: 2500,
  });

  if (displayArticles.length === 0) {
    return null;
  }

  return (
    <section
      id="blogs"
      className="w-full bg-[var(--color-background)] py-12 sm:py-16 lg:py-24 border-b border-[var(--color-border)]/50 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-gold)]/10 border border-[var(--brand-gold)]/25 text-[var(--brand-gold)] text-xs font-bold tracking-[0.2em] uppercase">
            <BookOpen className="w-3.5 h-3.5" />
            <span>THE JOURNAL</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--color-heading)]">
            EXPLORE OUR LATEST STORIES
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] font-normal leading-relaxed">
            Botanical traditions, Ayurvedic hair science and authentic wellness rituals from the elders of Mysuru.
          </p>
        </div>

        {/* Mobile Auto-Moving Carousel (Visible on Mobile & Tablet < md) */}
        <div className="md:hidden -mx-4 px-4 overflow-hidden relative">
          <div
            ref={mobileContainerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing pb-2"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {Array.from({ length: repeatCount }).flatMap((_, setIdx) =>
              displayArticles.map((article, idx) => {
                const uniqueKey = `mobile-blog-${setIdx}-${article.id || article.slug || idx}`;
                return (
                  <div
                    key={uniqueKey}
                    className="w-[80vw] max-w-[320px] flex-shrink-0 flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)]/70 hover:border-[var(--brand-gold)]/50 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 group"
                  >
                    {/* Card Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-[var(--brand-primary-dark)]">
                      <img
                        src={article.image || '/images/hakkiveda_108_oil_gold.jpg'}
                        alt={article.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
                      
                      {/* Category Tag */}
                      <span className="absolute top-3 left-3 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-[var(--brand-gold)] border border-[var(--brand-gold)]/30 uppercase tracking-wider">
                        {article.category || 'Hair Rituals'}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-secondary)]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[var(--brand-gold)]" />
                            {article.readTime || '4 min read'}
                          </span>
                          <span>•</span>
                          <span>{article.date || 'Mysuru Botanical Rituals'}</span>
                        </div>

                        <h3 className="font-serif text-base sm:text-lg font-bold text-[var(--color-heading)] group-hover:text-[var(--brand-gold)] transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed font-normal">
                          {article.excerpt || (article.content ? article.content.substring(0, 100) + '...' : '')}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[var(--color-border)]/50">
                        <a
                          href={`/journal/${article.slug || article.id}`}
                          onClick={(e) => {
                            if (isDragging()) {
                              e.preventDefault();
                              return;
                            }
                            handleArticleClick(e, article.slug || article.id);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand-gold)] hover:text-[var(--brand-gold-light)] uppercase tracking-wider group-hover:translate-x-1 transition-all"
                        >
                          <span>READ MORE</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Desktop Editorial Grid (Visible on Desktop md+) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayArticles.slice(0, 3).map((article) => (
            <article
              key={article.id || article.slug}
              className="flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)]/70 hover:border-[var(--brand-gold)]/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              {/* Card Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--brand-primary-dark)]">
                <img
                  src={article.image || '/images/hakkiveda_108_oil_gold.jpg'}
                  alt={article.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 pointer-events-none" />

                <span className="absolute top-3 left-3 bg-black/65 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[var(--brand-gold)] border border-[var(--brand-gold)]/30 uppercase tracking-wider">
                  {article.category || 'Hair Rituals'}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                      {article.readTime || '4 min read'}
                    </span>
                    <span>•</span>
                    <span>{article.date || 'Traditional Formulation'}</span>
                  </div>

                  <h3 className="font-serif text-lg lg:text-xl font-bold text-[var(--color-heading)] group-hover:text-[var(--brand-gold)] transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 leading-relaxed font-normal">
                    {article.excerpt || (article.content ? article.content.substring(0, 140) + '...' : '')}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--color-border)]/50">
                  <a
                    href={`/journal/${article.slug || article.id}`}
                    onClick={(e) => handleArticleClick(e, article.slug || article.id)}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--brand-gold)] hover:text-[var(--brand-gold-light)] uppercase tracking-wider group-hover:translate-x-1.5 transition-all"
                  >
                    <span>READ ARTICLE</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Explore All Journals CTA Button */}
        <div className="mt-10 sm:mt-14 text-center">
          <a
            href="/journal"
            onClick={handleExploreAllClick}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl border border-[var(--brand-gold)] text-[var(--brand-gold)] hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-sm hover:shadow-lg group"
          >
            <span>EXPLORE ALL JOURNALS</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};
