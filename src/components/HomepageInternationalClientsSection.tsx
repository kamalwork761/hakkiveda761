import React from 'react';
import { Link } from './common/ClientLink';
import { useStore } from '../context/StoreContext';
import { Globe, ArrowRight, Sparkles, Building2, MapPin, Calendar, Award } from 'lucide-react';

export const HomepageInternationalClientsSection: React.FC = () => {
  const { globalClientCountries, globalClientStories } = useStore();

  // Published stories lookup
  const publishedStories = (globalClientStories || []).filter((s) => s.published);

  // Group published stories by country id or slug
  const storiesByCountry = new Map<string, number>();
  publishedStories.forEach((s) => {
    storiesByCountry.set(s.countryId, (storiesByCountry.get(s.countryId) || 0) + 1);
  });

  // Only show countries that are published AND have published client stories
  const activeCountries = (globalClientCountries || [])
    .filter((c) => c.published)
    .map((c) => {
      // Check match by country.id or country.slug
      const count =
        (storiesByCountry.get(c.id) || 0) +
        (storiesByCountry.get(c.slug) || 0);
      return { country: c, count };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => (a.country.displayOrder || 99) - (b.country.displayOrder || 99));

  // Featured stories for the lower subsection (up to 4)
  const featuredStories = publishedStories
    .filter((s) => s.featured)
    .slice(0, 4);

  // If there are no active countries, don't break layout
  if (activeCountries.length === 0) {
    return null;
  }

  return (
    <section className="relative py-16 sm:py-24 bg-[var(--color-surface)] border-t border-[var(--color-border)] overflow-hidden">
      {/* Decorative Botanical Ambient Backing */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--brand-gold)]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--brand-primary)]/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--brand-gold)]/10 border border-[var(--brand-gold)]/30 text-[var(--brand-gold)] text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
            <Globe className="w-3.5 h-3.5" />
            <span>GLOBAL PRESENCE & PARTNERS</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-heading)] leading-tight uppercase">
            OUR INTERNATIONAL CLIENTS
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[var(--color-text-secondary)] font-normal leading-relaxed">
            HAKKIVEDA products trusted by clients, retailers and partners across global markets.
          </p>
        </div>

        {/* Country Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {activeCountries.map(({ country, count }) => (
            <div
              key={country.id}
              className="group relative flex flex-col rounded-2xl overflow-hidden bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--brand-gold)]/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              {/* Cover Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--brand-primary-dark)]">
                <img
                  src={country.countryCoverImage || '/images/hero_tribal_elders.jpg'}
                  alt={`HAKKIVEDA in ${country.countryName}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Country Flag & Name Overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-md">
                  <span className="text-lg leading-none" role="img" aria-label={country.countryName}>
                    {country.flag || '🌐'}
                  </span>
                  <span className="text-xs font-bold tracking-wide uppercase">{country.countryName}</span>
                </div>

                {/* Published Count Pill */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-xs font-bold shadow-md">
                  {count} {count === 1 ? 'Client Story' : 'Client Stories'}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[var(--color-heading)] group-hover:text-[var(--brand-gold)] transition-colors">
                    {country.countryName}
                  </h3>
                  {country.shortDescription && (
                    <p className="mt-2 text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
                      {country.shortDescription}
                    </p>
                  )}
                </div>

                <div className="pt-5 mt-4 border-t border-[var(--color-border)]">
                  <Link
                    to={`/global-clients/${country.slug}`}
                    className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] group-hover:bg-[var(--brand-gold)] group-hover:border-[var(--brand-gold)] group-hover:text-[var(--brand-primary-dark)] text-xs font-bold tracking-wider text-[var(--color-heading)] uppercase transition-all duration-200"
                  >
                    <span>VIEW CLIENT STORIES</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Global Stories Subsection */}
        {featuredStories.length > 0 && (
          <div className="mt-20 pt-16 border-t border-[var(--color-border)]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[var(--brand-gold)] uppercase mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>CURATED CASE STUDIES</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">
                  Featured International Stories
                </h3>
              </div>
              <Link
                to="/global-clients"
                className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-[var(--brand-gold)] hover:underline uppercase"
              >
                <span>VIEW ALL GLOBAL STORIES</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredStories.map((story) => {
                const country = globalClientCountries.find(
                  (c) => c.id === story.countryId || c.slug === story.countryId
                );
                return (
                  <div
                    key={story.id}
                    className="group relative flex flex-col rounded-2xl overflow-hidden bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--brand-gold)]/40 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[var(--brand-primary-dark)]">
                      <img
                        src={story.coverImage || '/images/hero_tribal_elders.jpg'}
                        alt={story.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {story.clientType && (
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Award className="w-3 h-3 text-[var(--brand-gold)]" />
                          <span>{story.clientType}</span>
                        </div>
                      )}

                      {country && (
                        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 text-xs text-white drop-shadow">
                          <span>{country.flag}</span>
                          <span className="font-medium">{country.countryName}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-secondary)] mb-1.5">
                          <Building2 className="w-3 h-3 text-[var(--brand-gold)]" />
                          <span className="font-semibold text-[var(--color-heading)] truncate">
                            {story.businessName || story.clientName}
                          </span>
                          {story.city && <span>• {story.city}</span>}
                        </div>

                        <h4 className="font-serif text-sm font-bold text-[var(--color-heading)] group-hover:text-[var(--brand-gold)] transition-colors line-clamp-2 leading-snug">
                          {story.title}
                        </h4>

                        <p className="mt-2 text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
                          {story.shortDescription}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-[var(--color-border)]">
                        <Link
                          to={`/global-clients/${country ? country.slug : story.countryId}/${story.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand-gold)] hover:text-[var(--brand-primary)] transition-colors uppercase tracking-wider"
                        >
                          <span>READ CLIENT STORY</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Global Hub CTA Bar */}
        <div className="mt-14 text-center">
          <Link
            to="/global-clients"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white border border-[var(--brand-gold)]/40 text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.02]"
          >
            <Globe className="w-4 h-4 text-[var(--brand-gold)]" />
            <span>EXPLORE ALL GLOBAL CLIENTS & MARKETS</span>
            <ArrowRight className="w-4 h-4 text-[var(--brand-gold)]" />
          </Link>
        </div>
      </div>
    </section>
  );
};
