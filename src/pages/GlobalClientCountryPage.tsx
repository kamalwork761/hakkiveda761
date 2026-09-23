import React, { useEffect } from 'react';
import { Link } from '../components/common/ClientLink';
import { useStore } from '../context/StoreContext';
import {
  Globe,
  ArrowRight,
  ChevronRight,
  Home,
  Building2,
  MapPin,
  Calendar,
  Award,
  Package,
  Layers,
  Handshake,
} from 'lucide-react';

interface GlobalClientCountryPageProps {
  countrySlug?: string;
  onNavigate?: (path: string) => void;
}

export const GlobalClientCountryPage: React.FC<GlobalClientCountryPageProps> = ({
  countrySlug: propCountrySlug,
  onNavigate,
}) => {
  // Extract slug from prop or URL pathname: /global-clients/:countrySlug
  const extractedSlug =
    propCountrySlug ||
    (typeof window !== 'undefined'
      ? window.location.pathname.replace(/^\/global-clients\//, '').split('/')[0]
      : '');
  const countrySlug = extractedSlug;
  const { globalClientCountries, globalClientStories } = useStore();

  const country = (globalClientCountries || []).find(
    (c) =>
      c.slug.toLowerCase() === (countrySlug || '').toLowerCase() ||
      c.id.toLowerCase() === (countrySlug || '').toLowerCase() ||
      c.countryCode.toLowerCase() === (countrySlug || '').toLowerCase()
  );

  const stories = (globalClientStories || []).filter(
    (s) =>
      s.published &&
      (s.countryId === country?.id ||
        s.countryId.toLowerCase() === (countrySlug || '').toLowerCase() ||
        s.countryId === country?.slug)
  ).sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));

  // Dynamic SEO
  useEffect(() => {
    if (country) {
      document.title = country.seoTitle || `HAKKIVEDA Clients in ${country.countryName} | International Stories`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          country.seoMetaDescription ||
            `Explore HAKKIVEDA authentic tribal hair oil retailers, distributors, and wellness partners in ${country.countryName}.`
        );
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [country]);

  if (!country) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] py-20 px-4 text-center">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
          <Globe className="w-12 h-12 text-[var(--brand-gold)] mx-auto opacity-70" />
          <h2 className="font-serif text-2xl font-bold text-[var(--color-heading)]">Country Not Found</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            We couldn't locate the requested international market directory.
          </p>
          <div className="pt-2">
            <Link
              to="/global-clients"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-xs font-bold uppercase tracking-wider"
            >
              <span>RETURN TO GLOBAL CLIENTS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] pb-24">
      {/* Breadcrumb Navigation */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-[var(--brand-gold)] transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-[var(--color-border)]" />
            <Link to="/global-clients" className="hover:text-[var(--brand-gold)] transition-colors">
              Global Clients
            </Link>
            <ChevronRight className="w-3 h-3 text-[var(--color-border)]" />
            <span className="font-semibold text-[var(--color-heading)]">{country.countryName}</span>
          </nav>
        </div>
      </div>

      {/* Country Header Hero */}
      <div className="relative py-14 sm:py-20 bg-[var(--brand-primary-dark)] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src={country.countryCoverImage || '/images/hero_tribal_elders.jpg'}
            alt={country.countryName}
            className="w-full h-full object-cover filter blur-sm scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-primary-dark)] via-[var(--brand-primary-dark)]/90 to-transparent" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white shadow-md text-xs font-bold uppercase tracking-wider">
            <span className="text-xl leading-none">{country.flag}</span>
            <span>{country.countryName} Market Directory</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            HAKKIVEDA Clients in {country.countryName}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
            {country.shortDescription ||
              `Discover verified international retailers, clinics, and wholesale clients in ${country.countryName} stocking authentic HAKKIVEDA tribal botanical formulations.`}
          </p>

          <div className="pt-2 flex items-center justify-center gap-4 text-xs font-semibold text-[var(--brand-gold)]">
            <span className="px-3 py-1 rounded-full bg-[var(--brand-gold)]/15 border border-[var(--brand-gold)]/30">
              {stories.length} {stories.length === 1 ? 'Published Client Story' : 'Published Client Stories'}
            </span>
          </div>
        </div>
      </div>

      {/* Stories Listing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        {stories.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4 max-w-xl mx-auto">
            <Layers className="w-12 h-12 text-[var(--brand-gold)] mx-auto opacity-60" />
            <h3 className="font-serif text-xl font-bold text-[var(--color-heading)]">
              No Client Stories Yet for {country.countryName}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Client stories for this territory are currently being prepared by our editorial team. Check back shortly!
            </p>
            <div className="pt-2">
              <Link
                to="/global-clients"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-xs font-bold uppercase tracking-wider"
              >
                <span>EXPLORE OTHER COUNTRIES</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story) => (
                <article
                  key={story.id}
                  className="group relative flex flex-col rounded-3xl overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--brand-gold)]/60 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Cover Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[var(--brand-primary-dark)]">
                    <img
                      src={story.coverImage || '/images/hero_tribal_elders.jpg'}
                      alt={story.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Client Type Badge */}
                    {story.clientType && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                        <Award className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                        <span>{story.clientType}</span>
                      </div>
                    )}

                    {/* Meeting Date */}
                    {story.meetingDate && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-stone-300 text-[10px] font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[var(--brand-gold)]" />
                        <span>{story.meetingDate}</span>
                      </div>
                    )}

                    {/* City & Country */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white drop-shadow">
                      <MapPin className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                      <span className="font-semibold">
                        {story.city ? `${story.city}, ` : ''}
                        {country.countryName}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Business & Client Header */}
                      <div className="flex items-center gap-2 text-xs text-[var(--brand-gold)] font-bold uppercase tracking-wider">
                        <Building2 className="w-3.5 h-3.5" />
                        <span className="truncate">{story.businessName || story.clientName}</span>
                      </div>

                      {/* Title */}
                      <h2 className="font-serif text-xl font-bold text-[var(--color-heading)] group-hover:text-[var(--brand-gold)] transition-colors leading-snug">
                        {story.title}
                      </h2>

                      {/* Short Description */}
                      <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] line-clamp-3 leading-relaxed">
                        {story.shortDescription}
                      </p>

                      {/* Products Purchased Snippet */}
                      {story.productsPurchased && (
                        <div className="pt-2 flex items-start gap-2 text-xs text-[var(--color-text-secondary)] bg-[var(--color-bg)] p-3 rounded-xl border border-[var(--color-border)]">
                          <Package className="w-4 h-4 text-[var(--brand-gold)] shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-[var(--color-heading)]">Products: </span>
                            <span className="italic">{story.productsPurchased}</span>
                          </div>
                        </div>
                      )}

                      {/* Relationship Type */}
                      {story.relationshipType && (
                        <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-secondary)]">
                          <Handshake className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                          <span>Partnership: <strong className="text-[var(--color-heading)]">{story.relationshipType}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4 border-t border-[var(--color-border)]">
                      <Link
                        to={`/global-clients/${country.slug}/${story.slug}`}
                        className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] group-hover:bg-[var(--brand-gold)] group-hover:border-[var(--brand-gold)] group-hover:text-[var(--brand-primary-dark)] text-xs font-bold tracking-wider text-[var(--color-heading)] uppercase transition-all duration-200"
                      >
                        <span>READ CLIENT STORY</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Back Link & B2B Footer bar */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--color-border)]">
          <Link
            to="/global-clients"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-[var(--brand-gold)] hover:underline uppercase"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>BACK TO ALL GLOBAL CLIENTS</span>
          </Link>

          <Link
            to="/b2b"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--color-surface)] border border-[var(--brand-gold)]/40 hover:border-[var(--brand-gold)] text-xs font-bold text-[var(--color-heading)] uppercase tracking-wider transition-colors"
          >
            <span>INQUIRE ABOUT {country.countryName.toUpperCase()} DISTRIBUTION</span>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
          </Link>
        </div>
      </div>
    </div>
  );
};
