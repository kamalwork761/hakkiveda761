import React, { useState } from 'react';
import { Leaf, Flame, HeartHandshake, Compass, Quote, ArrowRight, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const BrandStory: React.FC = () => {
  const { navLinks } = useStore();
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);

  // Find Tribal Heritage link
  const heritageLink = navLinks.find(
    (l) => l.label.toLowerCase().includes('heritage') || l.url === '#brand-story' || l.id === 'nav-2'
  );

  const content = heritageLink?.pageContent;

  // Defaults if pageContent is not provided
  const desktopHero = content?.desktopHeroImage || '/images/hero_tribal_elders.jpg';
  const mobileHero = content?.mobileHeroImage || desktopHero;
  const smallHeading = content?.smallHeading || 'The Genesis of HAKKIVEDA';
  const mainHeading = content?.mainHeading || 'Where Ancient Tribal Wisdom Meets Modern Hair Science';
  
  const paragraphs = content?.richText?.paragraphs && content.richText.paragraphs.length > 0
    ? content.richText.paragraphs
    : [
        'For centuries, the nomadic Hakki-Pikki tribe traversed the dense forest corridors of the Western Ghats in Karnataka, India. Unbounded by modern industrial cosmetics, they relied on a secret repertoire of 42 wild mountain herbs, tree barks, seeds, and flower juices to keep their hair thick, dark, and resilient well into old age.',
        'At HAKKIVEDA, we preserve this authentic living heritage. We work directly with tribal harvesters in Hunsur to sustainably gather rare botanicals at sunrise when nutrient concentration is highest.',
      ];

  const lists = content?.richText?.lists && content.richText.lists.length > 0
    ? content.richText.lists
    : [
        '42 Wild Herbs: Including Abrus precatorius, Jatamansi, and Bhringraj harvested in untouched forests.',
        '21-Day Woodfire Brew: Slow-cooked in pure copper cauldrons over woodfire for optimal phytonutrient retention.',
        'Tribal Empowerment: Fair-trade compensation directly supporting Hakki-Pikki artisan families in Mysore.',
        'Worldwide Shipping: Exported directly to India, Singapore, Malaysia, Fiji, Mauritius, and Global markets.',
      ];

  const quotes = content?.richText?.quotes && content.richText.quotes.length > 0
    ? content.richText.quotes
    : ['Every drop is small-batch brewed by Hakki-Pikki tribal elders in Mysore using 42 wild herbs.'];

  const highlightText = content?.richText?.highlightText || 'Ancestral Mysore Heritage • Door No. 574, V.P. Bore, Hunsur, Mysore, Karnataka';

  const gallery = content?.gallery && content.gallery.length > 0
    ? content.gallery
    : [
        {
          id: 'gal-1',
          url: '/images/hakkiveda_oil_couple_herbs.jpg',
          title: 'Tribal Elders & Herb Gathering',
          altText: 'Hakki-Pikki tribal elders with wild forest botanicals',
        },
        {
          id: 'gal-2',
          url: '/images/hakkiveda_108_herbs_infographic.jpg',
          title: '42 Wild Mountain Botanicals',
          altText: 'Botanical infographic of sacred mountain herbs',
        },
        {
          id: 'gal-3',
          url: '/images/hakkiveda_108_oil_gold.jpg',
          title: 'Traditional Copper Cauldron Extraction',
          altText: 'Pure golden herbal hair oil bottle handcrafted in Mysore',
        },
      ];

  const ctaText = content?.ctaText || 'Explore 42-Herb Formulations';
  const ctaLink = content?.ctaLink || '#products';
  const seoAlt = content?.seoAltText || 'Hakki-Pikki Forest Canopy and Tribal Elders';
  const seoTitle = content?.seoImageTitle || 'Ancestral Hakki-Pikki Herbal Hair Oil Brewing Tradition';

  return (
    <section id="brand-story" className="py-24 bg-[var(--brand-primary-dark)] relative overflow-hidden">
      {/* Anchor for Tribal Heritage navigation target */}
      <div id="tribal-heritage" className="absolute top-0 left-0 scroll-mt-24 pointer-events-none" />

      {/* Background Decorative Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--brand-gold)]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Visual Hero */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[var(--brand-gold)]/40 shadow-2xl group dark-media-card">
              {/* Responsive Hero Picture or Video */}
              {/\.(mp4|webm|ogg|mov)($|\?)/i.test(desktopHero) ? (
                <video
                  key={desktopHero}
                  src={desktopHero}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <picture className="w-full">
                  <source media="(max-width: 640px)" srcSet={mobileHero} />
                  <img
                    key={desktopHero}
                    src={desktopHero}
                    alt={seoAlt}
                    title={seoTitle}
                    className="w-full h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </picture>
              )}
              <div className="image-overlay bg-gradient-to-t from-[var(--brand-primary-dark)] via-transparent to-black/30"></div>

              {/* Floating Lore Quote Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/75 backdrop-blur-xl border border-[var(--brand-gold)]/50 rounded-xl space-y-2 overlay-card z-10">
                <div className="flex items-center gap-2 text-[var(--brand-gold)] accent">
                  <Quote className="w-4 h-4 accent" />
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest accent">
                    {highlightText}
                  </span>
                </div>
                {quotes.map((q, idx) => (
                  <p key={idx} className="text-xs font-sans italic leading-relaxed">
                    "{q.replace(/^"/, '').replace(/"$/, '')}"
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Right Brand Lore Content */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[var(--brand-gold)] font-sans text-xs uppercase tracking-[0.28em] font-bold block">
              {smallHeading}
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-slate-100 leading-tight">
              {mainHeading}
            </h2>

            {/* Paragraphs */}
            <div className="space-y-4">
              {paragraphs.map((p, idx) => (
                <p key={idx} className="text-sm text-slate-200 font-sans leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            {/* List Bullet Items */}
            {lists.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 font-sans">
                {lists.map((item, idx) => {
                  const parts = item.split(':');
                  const title = parts.length > 1 ? parts[0] : `Pillar ${idx + 1}`;
                  const desc = parts.length > 1 ? parts.slice(1).join(':') : item;

                  const icons = [<Leaf className="w-4 h-4" />, <Flame className="w-4 h-4" />, <HeartHandshake className="w-4 h-4" />, <Compass className="w-4 h-4" />];
                  const icon = icons[idx % icons.length];

                  return (
                    <div key={idx} className="p-4 bg-[var(--brand-primary-deep)] rounded-xl border border-white/10 space-y-1.5 hover:border-[var(--brand-gold)]/50 transition-all">
                      <div className="flex items-center gap-2 text-[var(--brand-gold)]">
                        {icon}
                        <h4 className="text-xs font-bold uppercase tracking-wider">{title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-normal">{desc}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* CTA Button */}
            {ctaText && (
              <div className="pt-2">
                <a
                  href={ctaLink}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold text-xs uppercase tracking-wider hover:bg-[#d8b25a] shadow-lg transition-all"
                >
                  <span>{ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        {gallery.length > 0 && (
          <div className="space-y-6 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[var(--brand-gold)] text-xs font-bold uppercase tracking-widest block">
                  Ancestral Archives
                </span>
                <h3 className="text-2xl font-serif-luxury font-bold text-slate-100">
                  Tribal Harvest & Extraction Gallery
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {gallery.length} Verified Photos
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {gallery.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setSelectedGalleryImg(img.url)}
                  className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-[var(--brand-gold)]/60 cursor-pointer shadow-lg transition-all dark-media-card"
                >
                  <img
                    src={img.url}
                    alt={img.altText || img.title || 'Tribal Gallery'}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="image-overlay bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="overlay-content p-4 flex flex-col justify-end h-full">
                    <span className="text-xs font-bold font-serif-luxury">
                      {img.title || 'Ancestral Heritage Image'}
                    </span>
                    {img.altText && (
                      <span className="text-[10px] secondary-text line-clamp-1">
                        {img.altText}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedGalleryImg && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setSelectedGalleryImg(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-[var(--brand-gold)]/50 shadow-2xl bg-[var(--brand-primary-dark)] p-2">
              <button
                onClick={() => setSelectedGalleryImg(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/70 hover:bg-black rounded-full text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedGalleryImg}
                alt="Enlarged view"
                className="max-h-[85vh] w-auto mx-auto rounded-xl object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
