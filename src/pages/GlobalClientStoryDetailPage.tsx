import React, { useState, useEffect, useMemo } from 'react';
import { Link } from '../components/common/ClientLink';
import { useStore } from '../context/StoreContext';
import { RichStoryRenderer } from '../components/common/RichStoryRenderer';
import { GlobalClientVideoPlayer } from '../components/common/GlobalClientVideoPlayer';
import { GlobalClientGalleryImage, GlobalClientStoryVideo } from '../types/store';
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
  Handshake,
  ExternalLink,
  Share2,
  Check,
  Quote,
  Sparkles,
  ShoppingBag,
  Star,
  Image as ImageIcon,
  Video as VideoIcon,
  X,
  User,
  Eye,
} from 'lucide-react';

interface GlobalClientStoryDetailPageProps {
  countrySlug?: string;
  clientSlug?: string;
  onNavigate?: (path: string) => void;
}

export const GlobalClientStoryDetailPage: React.FC<GlobalClientStoryDetailPageProps> = ({
  countrySlug: propCountrySlug,
  clientSlug: propClientSlug,
  onNavigate,
}) => {
  // Extract slugs from props or window.location.pathname (/global-clients/:countrySlug/:clientSlug)
  const pathParts =
    typeof window !== 'undefined'
      ? window.location.pathname.replace(/^\/global-clients\//, '').split('/')
      : [];
  const countrySlug = propCountrySlug || pathParts[0] || '';
  const clientSlug = propClientSlug || pathParts[1] || '';
  const { globalClientCountries, globalClientStories, products, addToCart } = useStore();

  const [lightboxImage, setLightboxImage] = useState<GlobalClientGalleryImage | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const country = (globalClientCountries || []).find(
    (c) =>
      c.slug.toLowerCase() === (countrySlug || '').toLowerCase() ||
      c.id.toLowerCase() === (countrySlug || '').toLowerCase() ||
      c.countryCode.toLowerCase() === (countrySlug || '').toLowerCase()
  );

  const story = (globalClientStories || []).find((s) => {
    const slugMatch = s.slug.toLowerCase() === (clientSlug || '').toLowerCase();
    const idMatch = s.id.toLowerCase() === (clientSlug || '').toLowerCase();
    const countryMatch =
      !country ||
      s.countryId === country.id ||
      s.countryId.toLowerCase() === (countrySlug || '').toLowerCase() ||
      s.countryId === country.slug;
    return (slugMatch || idMatch) && countryMatch;
  });

  // Related stories from the same country (excluding current story)
  const relatedStories = (globalClientStories || []).filter(
    (s) =>
      s.published &&
      s.id !== story?.id &&
      country &&
      (s.countryId === country.id || s.countryId === country.slug)
  ).slice(0, 3);

  // Linked Products from Catalog
  const linkedProducts = (story?.linkedProductIds || [])
    .map((pId) => products.find((p) => p.id === pId))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  // Dynamic SEO
  useEffect(() => {
    if (story) {
      document.title = story.seoTitle || `${story.title} | HAKKIVEDA International Case Study`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          story.seoMetaDescription || story.shortDescription || `${story.title} case study.`
        );
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [story]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Normalize gallery images and videos (safely handles legacy string arrays and modern objects)
  const normalizedGalleryImages: GlobalClientGalleryImage[] = useMemo(() => {
    if (!story?.galleryImages || !Array.isArray(story.galleryImages)) return [];
    return story.galleryImages
      .map((item: any, idx: number) => {
        if (typeof item === 'string') {
          return {
            id: `img-${idx}`,
            url: item,
            caption: '',
            altText: `Partnership documented moment ${idx + 1}`,
            displayOrder: idx + 1,
          };
        }
        return {
          id: item.id || `img-${idx}`,
          url: item.url || '',
          caption: item.caption || '',
          altText: item.altText || item.caption || `Partnership documented moment ${idx + 1}`,
          displayOrder: typeof item.displayOrder === 'number' ? item.displayOrder : idx + 1,
        };
      })
      .filter((img) => Boolean(img.url))
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [story?.galleryImages]);

  const normalizedVideos: GlobalClientStoryVideo[] = useMemo(() => {
    if (!story?.videos || !Array.isArray(story.videos)) return [];
    return story.videos
      .map((vid: any, idx: number) => {
        const rawType = (vid.type || 'UPLOAD').toUpperCase();
        const type = rawType.includes('YOUTUBE') ? 'YOUTUBE' : rawType.includes('VIMEO') ? 'VIMEO' : 'UPLOAD';
        return {
          id: vid.id || `vid-${idx}`,
          type: type as any,
          url: vid.url || '',
          title: vid.title || '',
          caption: vid.caption || '',
          thumbnail: vid.thumbnail || vid.thumbnailUrl || '',
          thumbnailUrl: vid.thumbnail || vid.thumbnailUrl || '',
          displayOrder: typeof vid.displayOrder === 'number' ? vid.displayOrder : idx + 1,
        };
      })
      .filter((v) => Boolean(v.url))
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [story?.videos]);

  if (!story || !country) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] py-20 px-4 text-center">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
          <Globe className="w-12 h-12 text-[var(--brand-gold)] mx-auto opacity-70" />
          <h2 className="font-serif text-2xl font-bold text-[var(--color-heading)]">Client Story Not Found</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            The requested international client story could not be found or has not yet been published.
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
      {/* Lightbox Modal for Gallery Images */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer z-10"
            aria-label="Close image preview"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage.url}
              alt={lightboxImage.altText || lightboxImage.caption || 'Enlarged gallery photo'}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            {(lightboxImage.caption || lightboxImage.altText) && (
              <div className="mt-3 px-4 py-2 bg-stone-900/90 border border-stone-800 rounded-xl text-center max-w-xl">
                {lightboxImage.caption && (
                  <p className="text-sm font-medium text-white">{lightboxImage.caption}</p>
                )}
                {lightboxImage.altText && !lightboxImage.caption && (
                  <p className="text-xs text-stone-300">{lightboxImage.altText}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] overflow-x-auto whitespace-nowrap">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-[var(--brand-gold)] transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-[var(--color-border)] shrink-0" />
            <Link to="/global-clients" className="hover:text-[var(--brand-gold)] transition-colors">
              Global Clients
            </Link>
            <ChevronRight className="w-3 h-3 text-[var(--color-border)] shrink-0" />
            <Link to={`/global-clients/${country.slug}`} className="hover:text-[var(--brand-gold)] transition-colors">
              {country.countryName}
            </Link>
            <ChevronRight className="w-3 h-3 text-[var(--color-border)] shrink-0" />
            <span className="font-semibold text-[var(--color-heading)] truncate max-w-[200px] sm:max-w-none">
              {story.businessName || story.clientName}
            </span>
          </nav>
        </div>
      </div>

      {/* Story Header */}
      <header className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8">
        <div className="space-y-6">
          {/* Territory & Badge Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to={`/global-clients/${country.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--brand-gold)] text-xs font-semibold text-[var(--color-heading)] shadow-sm transition-colors"
              >
                <span className="text-base">{country.flag}</span>
                <span>{country.countryName}</span>
              </Link>

              {story.clientType && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--brand-gold)]/15 border border-[var(--brand-gold)]/30 text-[var(--brand-gold)] text-xs font-bold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  <span>{story.clientType}</span>
                </span>
              )}

              {story.relationshipType && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-secondary)]">
                  <Handshake className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                  <span>{story.relationshipType}</span>
                </span>
              )}
            </div>

            {/* Share link button */}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--brand-gold)] text-xs font-semibold text-[var(--color-heading)] transition-all shadow-sm"
              title="Share story link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                  <span>Share Story</span>
                </>
              )}
            </button>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-heading)] leading-tight">
            {story.title}
          </h1>

          {/* Metadata Card Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Business / Client
              </span>
              <p className="text-sm font-semibold text-[var(--color-heading)] flex items-center gap-1.5 truncate">
                <Building2 className="w-3.5 h-3.5 text-[var(--brand-gold)] shrink-0" />
                <span className="truncate">{story.businessName || story.clientName}</span>
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Location
              </span>
              <p className="text-sm font-semibold text-[var(--color-heading)] flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-[var(--brand-gold)] shrink-0" />
                <span className="truncate">
                  {story.city ? `${story.city}, ` : ''}
                  {country.countryName}
                </span>
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Meeting / Order Date
              </span>
              <p className="text-sm font-semibold text-[var(--color-heading)] flex items-center gap-1.5 truncate">
                <Calendar className="w-3.5 h-3.5 text-[var(--brand-gold)] shrink-0" />
                <span className="truncate">{story.meetingDate || 'Ongoing Partner'}</span>
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Contact Person
              </span>
              <p className="text-sm font-semibold text-[var(--color-heading)] flex items-center gap-1.5 truncate">
                <User className="w-3.5 h-3.5 text-[var(--brand-gold)] shrink-0" />
                <span className="truncate">{story.clientName || 'Partner Representative'}</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-xl bg-[var(--brand-primary-dark)] aspect-[16/9] sm:aspect-[21/9]">
          <img
            src={story.coverImage || '/images/hero_tribal_elders.jpg'}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {story.productsPurchased && (
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 p-3 sm:p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center gap-3">
              <Package className="w-5 h-5 text-[var(--brand-gold)] shrink-0" />
              <div className="text-xs sm:text-sm truncate">
                <span className="font-bold text-[var(--brand-gold)] uppercase tracking-wider mr-2">
                  Formulations Procured:
                </span>
                <span className="font-medium text-stone-200">{story.productsPurchased}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content & Sidebar Layout */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Story Body */}
          <main className="lg:col-span-8 space-y-10">
            {/* Story Excerpt Highlight */}
            {story.shortDescription && (
              <div className="p-6 rounded-2xl bg-[var(--color-surface)] border-l-4 border-[var(--brand-gold)] border border-[var(--color-border)]">
                <p className="font-serif text-lg sm:text-xl text-[var(--color-heading)] italic leading-relaxed">
                  "{story.shortDescription}"
                </p>
              </div>
            )}

            {/* Rich Text Body */}
            <article className="prose-hakkiveda">
              <RichStoryRenderer content={story.content} />
            </article>

            {/* Testimonial Block */}
            {story.testimonial && story.testimonial.quote && (
              <div className="my-10 p-6 sm:p-8 rounded-3xl bg-[var(--brand-primary-dark)] text-white border border-[var(--brand-gold)]/40 relative shadow-xl">
                <Quote className="w-10 h-10 text-[var(--brand-gold)]/30 absolute top-6 right-6 pointer-events-none" />
                <div className="relative space-y-4">
                  <span className="text-xs font-bold tracking-widest text-[var(--brand-gold)] uppercase">
                    CLIENT TESTIMONIAL
                  </span>
                  <p className="font-serif text-lg sm:text-xl text-stone-100 italic leading-relaxed">
                    "{story.testimonial.quote}"
                  </p>
                  {(story.testimonial.authorName || story.testimonial.designation) && (
                    <div className="pt-2 border-t border-white/10 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold flex items-center justify-center font-serif text-sm">
                        {(story.testimonial.authorName || 'C')[0]}
                      </div>
                      <div>
                        {story.testimonial.authorName && (
                          <p className="text-sm font-bold text-white">{story.testimonial.authorName}</p>
                        )}
                        {story.testimonial.designation && (
                          <p className="text-xs text-stone-300">{story.testimonial.designation}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Photo Gallery Grid */}
            {normalizedGalleryImages.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[var(--brand-gold)] uppercase">
                  <ImageIcon className="w-4 h-4" />
                  <span>PARTNERSHIP PHOTO GALLERY</span>
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-heading)]">
                    Moments & Documented Batches
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    Visual archive of client meetings, formulation handoffs, batch deliveries, and packaging inspections.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {normalizedGalleryImages.map((img) => (
                    <figure
                      key={img.id}
                      onClick={() => setLightboxImage(img)}
                      className="group flex flex-col rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] cursor-pointer shadow-sm hover:shadow-md transition-all hover:border-[var(--brand-gold)]/60"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/10">
                        <img
                          src={img.url}
                          alt={img.altText || img.caption || 'Client documented moment'}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                          <Eye className="w-4 h-4" />
                          <span>Click to Enlarge</span>
                        </div>
                      </div>
                      {img.caption && (
                        <figcaption className="p-3 text-xs text-[var(--color-text)] bg-[var(--color-surface)] border-t border-[var(--color-border)] leading-relaxed">
                          {img.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            )}

            {/* Video Gallery */}
            {normalizedVideos.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[var(--brand-gold)] uppercase">
                  <VideoIcon className="w-4 h-4" />
                  <span>VIDEO ARCHIVE</span>
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-heading)]">
                    Video Documentaries & Footage
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    Watch recorded dispatch logs, client dialogues, and international partner spotlights.
                  </p>
                </div>
                <div className="space-y-6">
                  {normalizedVideos.map((vid) => (
                    <GlobalClientVideoPlayer key={vid.id} video={vid} />
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Right Sidebar: Products Supplied & Client Links */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Products Supplied Box */}
            {linkedProducts.length > 0 && (
              <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-5">
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[var(--brand-gold)] uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>PRODUCTS SUPPLIED</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[var(--color-heading)]">
                  Catalog Formulations Stocked
                </h3>

                <div className="space-y-4">
                  {linkedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="group flex gap-3 p-3 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--brand-gold)]/50 transition-colors"
                    >
                      <img
                        src={prod.image || prod.images?.[0] || '/images/hakkiveda_108_oil_gold.jpg'}
                        alt={prod.name}
                        className="w-16 h-16 rounded-xl object-cover border border-[var(--color-border)] bg-[var(--brand-primary-dark)] shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <h4 className="text-xs font-bold text-[var(--color-heading)] group-hover:text-[var(--brand-gold)] transition-colors truncate">
                            {prod.name}
                          </h4>
                          <div className="flex items-center gap-1 mt-1 text-[11px] text-[var(--brand-gold)]">
                            <Star className="w-3 h-3 fill-[var(--brand-gold)]" />
                            <span>{prod.rating || 4.9}</span>
                            <span className="text-[var(--color-text-secondary)]">({prod.reviewCount || 120})</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-[var(--color-border)]">
                          <span className="text-xs font-bold text-[var(--color-heading)]">
                            ₹{prod.priceINR || prod.price}
                          </span>
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/product/${prod.slug || prod.id}`}
                              className="text-[11px] font-bold text-[var(--brand-gold)] hover:underline"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => addToCart(prod, 1)}
                              className="p-1 rounded-md bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] hover:bg-amber-400"
                              title="Add to cart"
                            >
                              <ShoppingBag className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Official Client Links Card */}
            {(story.websiteUrl || story.socialUrl) && (
              <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-heading)]">
                  Verified Client Presence
                </h4>
                <div className="space-y-2">
                  {story.websiteUrl && (
                    <a
                      href={story.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--brand-gold)] text-xs font-semibold text-[var(--color-heading)] transition-colors"
                    >
                      <span className="truncate">Official Website</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[var(--brand-gold)] shrink-0" />
                    </a>
                  )}
                  {story.socialUrl && (
                    <a
                      href={story.socialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--brand-gold)] text-xs font-semibold text-[var(--color-heading)] transition-colors"
                    >
                      <span className="truncate">Social Media Profile</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[var(--brand-gold)] shrink-0" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* B2B Inquire CTA Box */}
            <div className="p-6 rounded-3xl bg-[var(--brand-primary-dark)] text-white border border-[var(--brand-gold)]/30 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand-gold)]">
                WHOLESALE & EXPORTS
              </span>
              <h4 className="font-serif text-lg font-bold text-white">
                Interested in stocking HAKKIVEDA in your region?
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed font-normal">
                We supply international salons, organic grocers, and distributors worldwide with verified Certificate of Analysis (COA) documentation.
              </p>
              <div className="pt-2">
                <Link
                  to="/b2b"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors"
                >
                  <span>CONNECT WITH US</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Stories from Same Country */}
        {relatedStories.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[var(--color-border)]">
            <h3 className="font-serif text-2xl font-bold text-[var(--color-heading)] mb-6">
              More Client Stories from {country.countryName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedStories.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/global-clients/${country.slug}/${rel.slug}`}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--brand-gold)]/50 transition-all p-4 shadow-sm hover:shadow-md"
                >
                  <div className="aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-[var(--brand-primary-dark)]">
                    <img
                      src={rel.coverImage || '/images/hero_tribal_elders.jpg'}
                      alt={rel.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h4 className="font-serif text-sm font-bold text-[var(--color-heading)] group-hover:text-[var(--brand-gold)] transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)] line-clamp-2">
                    {rel.shortDescription}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
