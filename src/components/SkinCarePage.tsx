import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Star,
  Heart,
  Eye,
  Check,
  ChevronDown,
  ShieldCheck,
  Feather,
  HelpCircle,
  Award,
  Flower2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/store';

interface SkinCarePageProps {
  onNavigateHome: () => void;
}

export const SkinCarePage: React.FC<SkinCarePageProps> = ({ onNavigateHome }) => {
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

  const pageConfig = categoryPages?.find((c) => c.id === 'skin-care');

  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Filter ONLY active Skin Care products
  const skinCareProducts = useMemo(() => {
    return products.filter((p) => {
      const isSkinCat =
        p.primaryCategory === 'skin-care' ||
        p.category === 'Tribal Masks & Lepas' ||
        p.name.toLowerCase().includes('lepa') ||
        p.name.toLowerCase().includes('skin') ||
        p.name.toLowerCase().includes('powder') ||
        p.name.toLowerCase().includes('mask');
      return isSkinCat && p.inStock !== false;
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
      q: 'What is an Adivasi Lepa and how is it used?',
      a: 'Lepa is a traditional Adivasi paste made by mixing finely ground wild herbs, clay, and botanicals with water, hydrosol, or oil. It is applied topically to detoxify, soothe, and nourish the skin or scalp.',
    },
    {
      q: 'Is the Lepa suitable for sensitive skin or facial use?',
      a: 'Yes, our Lepas are 100% natural and free from chemical fillers. We recommend performing a 24-hour patch test behind the ear or inner wrist prior to full facial or scalp application.',
    },
    {
      q: 'How often should I apply the Skin Care Lepa?',
      a: 'Apply 2 to 3 times a week for optimal deep cleansing and skin barrier replenishment. Leave on for 15-20 minutes until semi-dry, then rinse with lukewarm water.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#14231E] text-white selection:bg-[var(--brand-gold)] selection:text-[#14231E]">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-8 left-8 z-50 bg-[var(--brand-gold)] text-[#14231E] px-5 py-3 rounded-xl shadow-2xl font-sans text-xs font-bold flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <Check className="w-5 h-5 bg-[#14231E] text-[var(--brand-gold)] rounded-full p-1" />
          <span>Added '{addedToast}' to your cart!</span>
        </div>
      )}

      {/* 1. HERO BANNER */}
      <section className="relative bg-gradient-to-b from-[#1C362C] via-[#14231E] to-[#0A1411] border-b border-white/10 pt-8 pb-14 px-4 sm:px-8 lg:px-12 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-300 font-sans">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-[var(--brand-gold)] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-[var(--brand-gold)] font-bold">Skin Care</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold font-sans uppercase tracking-widest shadow-inner">
                <Flower2 className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                <span>Forest Botanical Lepas & Muds</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold text-slate-100 leading-tight">
                {pageConfig?.title || 'Skin Care & Herbal Lepas'}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-sans">
                {pageConfig?.shortDescription ||
                  'Authentic Adivasi herbal powders, detoxifying clay masks, and restorative skin lepas prepared from wild-harvested Neem, Multani Mitti, and Devadaru tree resins.'}
              </p>

              {/* Badges */}
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-sans text-slate-200">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-[var(--brand-gold)]" />
                  <span>100% Pure Botanical Powders</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                  <Award className="w-4 h-4 text-[var(--brand-gold)]" />
                  <span>Wild Harvested Ingredients</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-square rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                {pageConfig?.heroVideo ? (
                  <video
                    src={pageConfig.heroVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={pageConfig?.desktopHeroImage || '/images/hakkiveda_baldness_powder.jpg'}
                    alt={pageConfig?.title || 'HAKKIVEDA Skin Care & Lepas'}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                )}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#14231E]/90 via-transparent to-transparent"
                  style={{
                    opacity: pageConfig?.heroOverlayOpacity !== undefined ? pageConfig.heroOverlayOpacity / 100 : 0.4,
                  }}
                />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#1C362C]/90 border border-white/15 backdrop-blur-md">
                  <p className="text-xs font-serif-luxury font-bold text-white">
                    Natural Adivasi Herbal Lepa
                  </p>
                  <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                    Traditional clay & leaf ash paste for scalp and skin detox
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT GRID SECTION */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-100">
              Active Skin Care Formulations
            </h2>
            <p className="text-xs text-slate-300 mt-1 font-sans">
              Showing all {skinCareProducts.length} authentic skin & scalp lepas
            </p>
          </div>
          <div className="text-xs font-sans text-[var(--brand-gold)] font-bold flex items-center gap-2">
            <Feather className="w-4 h-4" />
            <span>Ethically Harvested in Mysore Valleys</span>
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skinCareProducts.map((product) => {
            const inWishlist = isInWishlist(product.id);
            const discountPct = product.originalPriceINR
              ? Math.round(((product.originalPriceINR - product.priceINR) / product.originalPriceINR) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="bg-white text-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group"
              >
                {/* Image */}
                <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    width={320}
                    height={320}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    <span className="bg-[#1C362C] text-[var(--brand-gold)] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-[var(--brand-gold)]/30 shadow-md">
                      {product.category}
                    </span>
                    {discountPct > 0 && (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        {discountPct}% OFF
                      </span>
                    )}
                  </div>

                  {/* Wishlist */}
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

                  {/* Quick View Hover */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                    <button
                      type="button"
                      onClick={() => openQuickView(product)}
                      className="bg-white/95 hover:bg-white text-slate-900 font-bold text-xs px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-[#1C362C]" />
                      <span>Quick View</span>
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-sans mb-1">
                      <span className="font-semibold text-[#1C362C] uppercase tracking-wider">
                        {product.category}
                      </span>
                      {product.volume && <span>{product.volume}</span>}
                    </div>

                    <h3
                      onClick={() => openQuickView(product)}
                      className="font-serif-luxury font-bold text-sm sm:text-base text-slate-900 line-clamp-2 hover:text-[#1C362C] cursor-pointer transition-colors leading-snug"
                    >
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
                      <span className="text-base font-extrabold text-[#1C362C]">
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
                        className="w-full py-2 px-2 bg-[#1C362C] hover:bg-[#14231E] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleBuyNow(e, product)}
                        className="w-full py-2 px-2 bg-[var(--brand-gold)] hover:bg-[#b8891e] text-[#1C362C] rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
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

      {/* 3. SKIN RITUAL / HOW-TO-USE */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[var(--brand-gold)] font-sans text-xs uppercase tracking-[0.2em] font-bold">
            Skin Ritual Guide
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-slate-100 mt-2">
            How to Apply Adivasi Herbal Lepa
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 font-sans">
            Follow this ancient 3-step paste ritual for deep skin cleansing and follicle unclogging.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
            <span className="text-3xl font-serif-luxury font-extrabold text-[var(--brand-gold)]">01</span>
            <h3 className="text-lg font-serif-luxury font-bold text-slate-100">Mix Paste</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Take 2 tablespoons of Lepa powder. Add warm water, rose hydrosol, or Herbal Hair Oil to form a smooth, workable herbal paste.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
            <span className="text-3xl font-serif-luxury font-extrabold text-[var(--brand-gold)]">02</span>
            <h3 className="text-lg font-serif-luxury font-bold text-slate-100">Apply & Rest</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Apply evenly on clean skin, scalp, or thinning hair patches. Let the active botanical minerals sit for 15 to 20 minutes until semi-dry.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
            <span className="text-3xl font-serif-luxury font-extrabold text-[var(--brand-gold)]">03</span>
            <h3 className="text-lg font-serif-luxury font-bold text-slate-100">Gentle Rinse</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Rinse thoroughly with cool or lukewarm water. Pat dry with a soft cloth. Repeat 2-3 times weekly for clear, healthy skin and scalp.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SKIN CARE FAQ */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[var(--brand-gold)]" />
          <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-slate-100">
            Skin Care Frequently Asked Questions
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
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--brand-gold)]' : ''}`} />
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
