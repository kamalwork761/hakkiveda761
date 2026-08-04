import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Star,
  Heart,
  Eye,
  Check,
  ChevronDown,
  HelpCircle,
  Feather,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/store';
import { CategoryHeroBanner } from './CategoryHeroBanner';

interface TribalWellnessPageProps {
  onNavigateHome: () => void;
}

export const TribalWellnessPage: React.FC<TribalWellnessPageProps> = ({ onNavigateHome }) => {
  const {
    products,
    categoryPages,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    openQuickView,
    playSound,
  } = useStore();

  const pageConfig = categoryPages?.find((c) => c.id === 'tribal-wellness');

  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Filter ONLY active Tribal Wellness products
  const wellnessProducts = useMemo(() => {
    return products.filter((p) => {
      const isWellnessCat =
        p.primaryCategory === 'tribal-wellness' ||
        p.category === 'Wellness Combos' ||
        p.name.toLowerCase().includes('combo') ||
        p.name.toLowerCase().includes('kit') ||
        p.name.toLowerCase().includes('bundle');
      return isWellnessCat && p.inStock !== false;
    }).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [products]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    playSound('add_to_cart');
    addToCart(product, 1);
    setAddedToast(product.name);
    setTimeout(() => setAddedToast(null), 3000);
  };

  const handleBuyNow = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    playSound('add_to_cart');
    addToCart(product, 1);
    const cartBtn = document.querySelector('[aria-label="Shopping Cart"]') as HTMLButtonElement;
    if (cartBtn) cartBtn.click();
  };

  const FAQS = [
    {
      q: 'What is included in the Tribal Wellness Regrowth Kit?',
      a: 'The complete kit includes 1x HAKKIVEDA 108 Herbs Hair Oil (200ml), 1x Herbal Baldness Care Powder (150g), 1x 42 Herbs Shampoo (250ml), plus a complimentary handcrafted brass head massager tool.',
    },
    {
      q: 'Why is a 90-day regimen recommended for tribal remedies?',
      a: 'Hair growth follows natural 90-day follicular cycles. The Hakki-Pikki tribe traditional regimen aligns with 3 lunar cycles to allow deep botanical lipid absorption, scalp detoxification, and new root sprouting.',
    },
    {
      q: 'Are there any dietary or lifestyle guidelines during the regimen?',
      a: 'For best results, maintain good hydration, avoid washing hair with scalding hot water, and allow hair to air-dry naturally after applying the shampoo and oil.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#111A24] text-white selection:bg-[var(--brand-gold)] selection:text-[#111A24]">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-8 left-8 z-50 bg-[var(--brand-gold)] text-[#111A24] px-5 py-3 rounded-xl shadow-2xl font-sans text-xs font-bold flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <Check className="w-5 h-5 bg-[#111A24] text-[var(--brand-gold)] rounded-full p-1" />
          <span>Added '{addedToast}' to your cart!</span>
        </div>
      )}

      {/* 1. HERO BANNER (Breadcrumb + Pure Artwork) */}
      {pageConfig ? (
        <CategoryHeroBanner
          config={pageConfig}
          fallbackTitle="Tribal Wellness & Bundles"
          onNavigateHome={onNavigateHome}
        />
      ) : null}

      {/* 2. PRODUCTS SECTION */}
      <section className="py-10 sm:py-14 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-100">
              Tribal Wellness Products
            </h2>
            <p className="text-xs text-slate-300 mt-1 font-sans">
              Showing all {wellnessProducts.length} authentic multi-step Adivasi regrowth systems and holistic bundles
            </p>
          </div>
          <div className="text-xs font-sans text-[var(--brand-gold)] font-bold flex items-center gap-2">
            <Feather className="w-4 h-4" />
            <span>Ancestral Mysore Regimens</span>
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wellnessProducts.map((product) => {
            const inWishlist = isInWishlist(product.id);
            const discountPct = product.originalPriceINR
              ? Math.round(((product.originalPriceINR - product.priceINR) / product.originalPriceINR) * 100)
              : 0;

            return (
              <div
                key={product.id}
                onClick={() => openQuickView(product)}
                className="bg-white text-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-2xl active:scale-[0.99] transition-all duration-300 flex flex-col group cursor-pointer"
              >
                {/* Product Image */}
                <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    width={320}
                    height={320}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
                    <span className="bg-[#1E2D3B] text-[var(--brand-gold)] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-[var(--brand-gold)]/30 shadow-md">
                      {product.category}
                    </span>
                    {discountPct > 0 && (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        {discountPct}% OFF
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSound('wishlist_toggle');
                      toggleWishlist(product.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md z-10 cursor-pointer ${
                      inWishlist
                        ? 'bg-rose-500 text-white'
                        : 'bg-black/40 text-white hover:bg-white hover:text-rose-500'
                    }`}
                    aria-label={`Wishlist ${product.name}`}
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>

                  {/* Quick View Indicator Overlay */}
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                    <span className="bg-white/95 text-slate-900 font-bold text-xs px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                      <Eye className="w-4 h-4 text-[#1E2D3B]" />
                      <span>Quick View</span>
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-sans mb-1">
                      <span className="font-semibold text-[#1E2D3B] uppercase tracking-wider">
                        {product.category}
                      </span>
                      {product.volume && <span>{product.volume}</span>}
                    </div>

                    <h3 className="font-serif-luxury font-bold text-sm sm:text-base text-slate-900 line-clamp-2 hover:text-[#1E2D3B] transition-colors leading-snug">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1.5 mt-2">
                      <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                      <span className="text-xs font-bold text-slate-800">{product.rating}</span>
                      <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-extrabold text-[#1E2D3B]">
                        {formatPrice(product.priceINR)}
                      </span>
                      {product.originalPriceINR && product.originalPriceINR > product.priceINR && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatPrice(product.originalPriceINR)}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full py-2 px-2 bg-[#1E2D3B] hover:bg-[#111A24] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleBuyNow(e, product)}
                        className="w-full py-2 px-2 bg-[var(--brand-gold)] hover:bg-[#b8891e] text-[#1E2D3B] rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer transition-colors shadow-sm active:scale-95"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. REVIEWS SECTION */}
      <section className="py-12 bg-white/5 border-t border-b border-white/10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[var(--brand-gold)] text-xs font-bold uppercase tracking-widest">
              Verified Buyer Results
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-100 mt-1">
              Trusted for Complete Hair Regrowth Systems
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1E2D3B] p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                "The 3-step wellness bundle was worth every rupee. My bald patches started filling with fine baby hairs by week 6."
              </p>
              <p className="text-xs font-bold text-[var(--brand-gold)]">— Ramesh K., Hyderabad</p>
            </div>

            <div className="bg-[#1E2D3B] p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                "Loved the free brass massager tool and authentic smell of herbs. Great savings on the combo pack."
              </p>
              <p className="text-xs font-bold text-[var(--brand-gold)]">— Priya V., Pune</p>
            </div>

            <div className="bg-[#1E2D3B] p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                "Received in Canada in 4 days. Exceptional quality and true Hakki-Pikki tribal heritage."
              </p>
              <p className="text-xs font-bold text-[var(--brand-gold)]">— Sanjay N., Toronto</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ SECTION */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[var(--brand-gold)]" />
          <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-slate-100">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between text-sm font-serif-luxury font-bold text-slate-100 hover:text-[var(--brand-gold)] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[var(--brand-gold)]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-slate-300 leading-relaxed font-sans border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
