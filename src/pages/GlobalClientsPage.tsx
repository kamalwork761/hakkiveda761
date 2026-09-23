import React, { useState, useEffect } from 'react';
import { Link } from '../components/common/ClientLink';
import { useStore } from '../context/StoreContext';
import { Globe, ArrowRight, Search, MapPin, Building2, Award, ChevronRight, Home, Sparkles } from 'lucide-react';

interface GlobalClientsPageProps {
  onNavigate?: (path: string) => void;
}

export const GlobalClientsPage: React.FC<GlobalClientsPageProps> = ({ onNavigate }) => {
  const { globalClientCountries, globalClientStories } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  // SEO
  useEffect(() => {
    document.title = 'Global Clients & International Stories | HAKKIVEDA Around the World';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const publishedStories = (globalClientStories || []).filter((s) => s.published);

  // Map published stories count per country
  const storiesByCountry = new Map<string, number>();
  publishedStories.forEach((s) => {
    storiesByCountry.set(s.countryId, (storiesByCountry.get(s.countryId) || 0) + 1);
  });

  // Filter countries
  const activeCountries = (globalClientCountries || [])
    .filter((c) => c.published)
    .map((c) => {
      const count =
        (storiesByCountry.get(c.id) || 0) +
        (storiesByCountry.get(c.slug) || 0);
      return { country: c, count };
    })
    .filter((item) => item.count > 0)
    .filter(({ country }) => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        country.countryName.toLowerCase().includes(term) ||
        country.shortDescription.toLowerCase().includes(term) ||
        country.countryCode.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => (a.country.displayOrder || 99) - (b.country.displayOrder || 99));

  // Featured stories
  const featuredStories = publishedStories.filter((s) => s.featured).slice(0, 4);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] pb-20">
      {/* Breadcrumb Navigation */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-[var(--brand-gold)] transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-[var(--color-border)]" />
            <span className="font-semibold text-[var(--color-heading)]">Global Clients</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-16 sm:py-24 bg-[var(--brand-primary-dark)] text-white overflow-hidden">
        {/* Subtle decorative gold/green gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--brand-gold)]/10 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-32 -mb-32" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--brand-gold)]/20 border border-[var(--brand-gold)]/40 text-[var(--brand-gold)] text-xs font-bold tracking-widest uppercase shadow-sm">
            <Globe className="w-4 h-4" />
            <span>INTERNATIONAL NETWORK</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            HAKKIVEDA Around the World
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-xl text-stone-300 font-normal leading-relaxed">
            Meet the international retailers, distributors, business partners and clients who have worked with HAKKIVEDA to bring authentic Hakki-Pikki tribal hair and wellness rituals across the globe.
          </p>

          {/* Quick Search */}
          <div className="max-w-md mx-auto pt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search countries, regions..."
                className="w-full pl-11 pr-4 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)] transition-all shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        {/* Country Showcase Grid */}
        <div className="space-y-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">
                Global Markets & Countries
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                Showing {activeCountries.length} {activeCountries.length === 1 ? 'country' : 'countries'} with active client relationships
              </p>
            </div>
          </div>
        </div>

        {activeCountries.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <Globe className="w-12 h-12 text-[var(--brand-gold)] mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-lg font-bold text-[var(--color-heading)]">No countries match your search</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">Try searching for a different country name or reset your filter.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-xs font-bold uppercase tracking-wider"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {activeCountries.map(({ country, count }) => (
              <div
                key={country.id}
                className="group relative flex flex-col rounded-2xl overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--brand-gold)]/60 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                {/* Cover Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--brand-primary-dark)]">
                  <img
                    src={country.countryCoverImage || '/images/hero_tribal_elders.jpg'}
                    alt={country.countryName}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Flag and Country badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-md">
                    <span className="text-xl leading-none" role="img" aria-label={country.countryName}>
                      {country.flag || '🌐'}
                    </span>
                    <span className="text-xs font-bold tracking-wide uppercase">{country.countryName}</span>
                  </div>

                  {/* Stories Count */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-xs font-bold shadow-md">
                    {count} {count === 1 ? 'Client Story' : 'Client Stories'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[var(--color-heading)] group-hover:text-[var(--brand-gold)] transition-colors">
                      {country.countryName}
                    </h3>
                    <p className="mt-2 text-xs text-[var(--color-text-secondary)] line-clamp-3 leading-relaxed">
                      {country.shortDescription}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-[var(--color-border)]">
                    <Link
                      to={`/global-clients/${country.slug}`}
                      className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] group-hover:bg-[var(--brand-gold)] group-hover:border-[var(--brand-gold)] group-hover:text-[var(--brand-primary-dark)] text-xs font-bold tracking-wider text-[var(--color-heading)] uppercase transition-all duration-200"
                    >
                      <span>VIEW STORIES</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured Case Studies Spotlight */}
        {featuredStories.length > 0 && (
          <div className="mt-20 pt-16 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[var(--brand-gold)] uppercase mb-2">
              <Sparkles className="w-4 h-4" />
              <span>CASE STUDIES & COLLABORATIONS</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-heading)] mb-8">
              Highlighted International Case Studies
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredStories.map((story) => {
                const country = globalClientCountries.find(
                  (c) => c.id === story.countryId || c.slug === story.countryId
                );
                return (
                  <div
                    key={story.id}
                    className="group relative flex flex-col rounded-2xl overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--brand-gold)]/50 transition-all duration-300 shadow-sm hover:shadow-lg"
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
                          <span>READ FULL STORY</span>
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

        {/* Global Partnership CTA Banner */}
        <div className="mt-20 rounded-3xl bg-[var(--brand-primary-dark)] text-white p-8 sm:p-12 relative overflow-hidden border border-[var(--brand-gold)]/30 shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[var(--brand-gold)]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-[var(--brand-gold)]/20 border border-[var(--brand-gold)]/40 text-[var(--brand-gold)] text-xs font-bold uppercase tracking-widest">
              BECOME A GLOBAL PARTNER
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Bring Authentic Hakki-Pikki Herbal Formulations to Your Country
            </h3>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
              Whether you operate a boutique spa, organic retail chain, Ayurvedic clinic, or international distribution network, HAKKIVEDA supports export documentation, fresh batch manufacturing, and dedicated partner logistics.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/b2b"
                className="px-6 py-3 rounded-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-lg"
              >
                SUBMIT WHOLESALE / EXPORT ENQUIRY
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold tracking-wider transition-colors border border-white/20"
              >
                CONTACT INTERNATIONAL DESK
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
