import React, { useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CategorySectionProps {
  selectedCategory?: string;
  onSelectCategory?: (categoryName: string) => void;
}

interface CategoryCardItem {
  id: string;
  name: string;
  route: string;
  categoryFilter: string;
  image: string;
  description: string;
  ctaText: string;
}

const HOMEPAGE_CATEGORIES: CategoryCardItem[] = [
  {
    id: 'hair-care',
    name: 'Hair Care',
    route: '/hair-care',
    categoryFilter: 'Hair Oils & Elixirs',
    image: '/images/hakkiveda_108_oil_gold.jpg',
    description: '100% authentic Adivasi herbal hair oils, follicle growth drops & root activation serums.',
    ctaText: 'Shop Hair Care',
  },
  {
    id: 'skin-care',
    name: 'Skin Care',
    route: '/skin-care',
    categoryFilter: 'Tribal Masks & Lepas',
    image: '/images/hakkiveda_baldness_powder.jpg',
    description: 'Traditional forest botanical muds, skin detox pastes and restorative herbal lepas.',
    ctaText: 'Shop Skin Care',
  },
  {
    id: 'tribal-wellness',
    name: 'Tribal Wellness',
    route: '/tribal-wellness',
    categoryFilter: 'Wellness Combos',
    image: '/images/hakkiveda_oil_couple_herbs.jpg',
    description: 'Holistic 90-day regrowth kits, wellness combos, and ancestral herbal therapies.',
    ctaText: 'Shop Tribal Wellness',
  },
];

export const CategorySection: React.FC<CategorySectionProps> = ({ onSelectCategory }) => {
  const { categories, categoryPages, playSound } = useStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Mouse drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Helper to append a timestamp cache-buster to prevent browser stale image caching
  const getFreshImageUrl = (url: string) => {
    if (!url) return url;
    if (url.startsWith('data:') || url.startsWith('blob:')) return url;
    const baseUrl = url.split('?')[0];
    const existingParam = url.match(/[?&]v=(\d+)/);
    const version = existingParam ? existingParam[1] : Date.now();
    return `${baseUrl}?v=${version}`;
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    playSound('nav_click');
    const container = scrollContainerRef.current;
    const cardWidth = container.firstElementChild?.clientWidth || 320;
    const scrollAmount = direction === 'left' ? -(cardWidth + 20) : (cardWidth + 20);
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleCategoryClick = (route: string, categoryFilter: string) => {
    playSound('nav_click');
    if (onSelectCategory) {
      onSelectCategory(categoryFilter);
    }
    // Update route history
    window.history.pushState({}, '', route);
    window.dispatchEvent(new Event('popstate'));
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section id="categories" className="py-12 sm:py-16 bg-[#123F2B] border-t border-b border-white/10 relative overflow-hidden scroll-mt-12 text-white">
      <div id="collections" className="absolute -top-12 left-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[var(--brand-gold)]" />
              <span className="text-[var(--brand-gold)] font-sans text-xs uppercase tracking-[0.25em] font-bold">
                Botanical Catalog
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-slate-100">
              Shop by Category
            </h2>
          </div>

          <div className="flex items-center gap-3 self-end">
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="p-2 rounded-full bg-white/10 border border-white/15 hover:bg-[var(--brand-gold)] hover:text-[#123F2B] transition-all cursor-pointer"
                aria-label="Previous category"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="p-2 rounded-full bg-white/10 border border-white/15 hover:bg-[var(--brand-gold)] hover:text-[#123F2B] transition-all cursor-pointer"
                aria-label="Next category"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                playSound('nav_click');
                if (onSelectCategory) onSelectCategory('ALL');
                const el = document.getElementById('products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-sans uppercase tracking-widest font-bold text-[var(--brand-gold)] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>View All Formulations ({categories.reduce((a, c) => a + c.itemCount, 0)})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Categories Carousel / Cards Grid */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex md:grid md:grid-cols-3 gap-5 sm:gap-6 overflow-x-auto md:overflow-x-visible scrollbar-none no-scrollbar snap-x snap-mandatory py-2 ${
            isDragging ? 'cursor-grabbing select-none' : ''
          }`}
        >
          {HOMEPAGE_CATEGORIES.map((cat) => {
            // Priority: categoryPages config -> DB category -> static fallback
            const matchedPage = categoryPages?.find(
              (cp) => cp.id === cat.id || cp.slug === cat.id
            );
            const matchedDbCat = categories.find(
              (c) => c.slug?.toLowerCase() === cat.id || c.name.toLowerCase().includes(cat.name.toLowerCase())
            );

            const rawImage = matchedPage?.cardImage || matchedDbCat?.image || cat.image;
            const imageSrc = getFreshImageUrl(rawImage);
            const cardTitle = matchedPage?.categoryName || matchedDbCat?.name || cat.name;
            const cardDescription = matchedPage?.shortDescription || matchedDbCat?.description || cat.description;
            const ctaText = matchedPage?.cardCtaText || cat.ctaText;

            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.route, cat.categoryFilter)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCategoryClick(cat.route, cat.categoryFilter);
                  }
                }}
                className="w-[82vw] sm:w-[46vw] md:w-full flex-shrink-0 snap-start group relative rounded-2xl overflow-hidden border border-white/20 bg-white text-slate-900 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]"
              >
                {/* Image Box */}
                <div className="h-52 sm:h-60 overflow-hidden relative w-full bg-slate-100">
                  <img
                    src={imageSrc}
                    alt={cardTitle}
                    loading="lazy"
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  
                  {/* Category Title Overlay Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-[#123F2B]/90 text-[var(--brand-gold)] text-[11px] font-extrabold font-sans px-3 py-1 rounded-full border border-[var(--brand-gold)]/40 shadow-lg backdrop-blur-md">
                      Botanical Category
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4 bg-white">
                  <div>
                    <h3 className="text-xl font-serif-luxury font-bold text-[#123F2B] group-hover:text-[#B8891E] transition-colors flex items-center justify-between">
                      <span>{cardTitle}</span>
                      <ArrowRight className="w-5 h-5 text-[#123F2B] group-hover:text-[#B8891E] -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
                    </h3>
                    <p className="text-xs leading-relaxed text-[#405B4A] mt-2 line-clamp-3">
                      {cardDescription}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-2">
                    <div className="w-full py-2.5 px-4 bg-[#123F2B] group-hover:bg-[#B8891E] text-white group-hover:text-[#123F2B] rounded-xl text-xs font-bold font-sans uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md">
                      <span>{ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
