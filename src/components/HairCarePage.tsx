import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Star,
  Heart,
  Eye,
  Check,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Droplet,
  Feather,
  HelpCircle,
  Award,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/store';

interface HairCarePageProps {
  onNavigateHome: () => void;
}

export const HairCarePage: React.FC<HairCarePageProps> = ({ onNavigateHome }) => {
  const {
    products,
    categoryPages,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    openQuickView,
    setIsQuizOpen,
    playSound,
  } = useStore();

  const pageConfig = categoryPages?.find((c) => c.id === 'hair-care');

  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Filter ONLY active Hair Care products
  const hairCareProducts = useMemo(() => {
    return products.filter((p) => {
      const isHairCat =
        p.primaryCategory === 'hair-care' ||
        p.category === 'Hair Oils & Elixirs' ||
        p.category === 'Herbal Cleansers' ||
        p.category === 'Follicle Serums' ||
        p.name.toLowerCase().includes('hair') ||
        p.name.toLowerCase().includes('oil') ||
        p.name.toLowerCase().includes('shampoo') ||
        p.name.toLowerCase().includes('serum');
      return isHairCat && p.inStock !== false;
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
      q: 'How soon can I expect visible hair growth and reduced hair fall?',
      a: 'Most customers notice a dramatic reduction in hair fall and root breakage within 14 to 21 days of consistent 3x weekly oiling and shampooing. Dormant follicle reactivation and baby hair sprouting typically appear within 45 to 60 days.',
    },
    {
      q: 'Is HAKKIVEDA Hair Care safe for color-treated or bleached hair?',
      a: 'Yes, 100%! All our hair care products are sulfate-free, paraben-free, and formulated with 100% cold-pressed virgin oils that preserve color vibrance while restoring moisture lost during chemical treatments.',
    },
    {
      q: 'How often should I apply the 108 Herbs Hair Oil?',
      a: 'For optimal scalp stimulation, apply 10-15ml of warm oil 3 times a week. Massage thoroughly into dry scalp for 5 minutes and leave it on overnight or for at least 2 hours before washing.',
    },
    {
      q: 'Do I need to wash out the Root Density Follicle Serum?',
      a: 'No! The Root Density Serum is a lightweight, non-greasy aqueous formula designed to be left on the scalp daily. Apply 1 full dropper onto scalp sections and leave it in.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0E281C] text-white selection:bg-[var(--brand-gold)] selection:text-[#0E281C]">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-8 left-8 z-50 bg-[var(--brand-gold)] text-[#0E281C] px-5 py-3 rounded-xl shadow-2xl font-sans text-xs font-bold flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <Check className="w-5 h-5 bg-[#0E281C] text-[var(--brand-gold)] rounded-full p-1" />
          <span>Added '{addedToast}' to your cart!</span>
        </div>
      )}

      {/* 1. HERO BANNER */}
      <section className="relative bg-gradient-to-b from-[#123F2B] via-[#0E281C] to-[#081811] border-b border-white/10 pt-8 pb-14 px-4 sm:px-8 lg:px-12 overflow-hidden">
        {/* Preloaded Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--brand-gold)]/10 blur-[120px] rounded-full pointer-events-none" />

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
            <span className="text-[var(--brand-gold)] font-bold">Hair Care</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--brand-gold)]/15 border border-[var(--brand-gold)]/30 text-[var(--brand-gold)] text-xs font-extrabold font-sans uppercase tracking-widest shadow-inner">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Adivasi Hair Restoration Legacy</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold text-slate-100 leading-tight">
                {pageConfig?.title || 'Hair Care Formulations'}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-sans">
                {pageConfig?.shortDescription ||
                  '100% authentic Hakki-Pikki tribal hair oils, scalp cleansers, and follicle activation serums slow-brewed in copper cauldrons with 108 wild mountain herbs harvested from Mysore forest valleys.'}
              </p>

              {/* Badges */}
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-sans text-slate-200">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-[var(--brand-gold)]" />
                  <span>100% Herbal & Chemical-Free</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                  <Droplet className="w-4 h-4 text-[var(--brand-gold)]" />
                  <span>Copper Cauldron Slow Brewed</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                  <Award className="w-4 h-4 text-[var(--brand-gold)]" />
                  <span>Authentic Mysore Heritage</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
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
                    src={pageConfig?.desktopHeroImage || '/images/hakkiveda_108_oil_gold.jpg'}
                    alt={pageConfig?.title || 'HAKKIVEDA Hair Care Formulations'}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                )}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#0E281C]/90 via-transparent to-transparent"
                  style={{
                    opacity: pageConfig?.heroOverlayOpacity !== undefined ? pageConfig.heroOverlayOpacity / 100 : 0.4,
                  }}
                />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#123F2B]/90 border border-white/15 backdrop-blur-md">
                  <p className="text-xs font-serif-luxury font-bold text-white">
                    108 Wild Mountain Herbs Formula
                  </p>
                  <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                    Reactivates dormant hair roots & halts severe hair fall
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
              Active Hair Care Formulations
            </h2>
            <p className="text-xs text-slate-300 mt-1 font-sans">
              Showing all {hairCareProducts.length} authentic hair regrowth and scalp care products
            </p>
          </div>
          <div className="text-xs font-sans text-[var(--brand-gold)] font-bold flex items-center gap-2">
            <Feather className="w-4 h-4" />
            <span>Free Express Worldwide Shipping</span>
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {hairCareProducts.map((product) => {
            const inWishlist = isInWishlist(product.id);
            const discountPct = product.originalPriceINR
              ? Math.round(((product.originalPriceINR - product.priceINR) / product.originalPriceINR) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="bg-white text-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group"
              >
                {/* Product Image */}
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
                    <span className="bg-[#123F2B] text-[var(--brand-gold)] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-[var(--brand-gold)]/30 shadow-md">
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
                      <Eye className="w-4 h-4 text-[#123F2B]" />
                      <span>Quick View</span>
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-sans mb-1">
                      <span className="font-semibold text-[#123F2B] uppercase tracking-wider">
                        {product.category}
                      </span>
                      {product.volume && <span>{product.volume}</span>}
                    </div>

                    <h3
                      onClick={() => openQuickView(product)}
                      className="font-serif-luxury font-bold text-sm sm:text-base text-slate-900 line-clamp-2 hover:text-[#123F2B] cursor-pointer transition-colors leading-snug"
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
                      <span className="text-base font-extrabold text-[#123F2B]">
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
                        className="w-full py-2 px-2 bg-[#123F2B] hover:bg-[#0E281C] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleBuyNow(e, product)}
                        className="w-full py-2 px-2 bg-[var(--brand-gold)] hover:bg-[#b8891e] text-[#123F2B] rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
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

      {/* 3. AI HAIR QUIZ CTA BANNER */}
      <section className="py-12 bg-gradient-to-r from-[#123F2B] to-[#081811] border-y border-white/10 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto rounded-3xl bg-white/5 border border-white/15 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[var(--brand-gold)] text-xs font-bold uppercase tracking-widest flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Customized Scalp Analysis</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-100">
              Unsure Which Formula Fits Your Scalp?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-sans">
              Take our 60-second AI Hair Quiz to get a personalized 3-step Adivasi regrowth ritual tailored to your exact hair loss pattern and scalp condition.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              playSound('nav_click');
              setIsQuizOpen(true);
            }}
            className="px-6 py-3.5 bg-[var(--brand-gold)] hover:bg-[#b8891e] text-[#123F2B] font-sans text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer shrink-0 flex items-center gap-2"
          >
            <span>Start AI Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. HAIR CARE ROUTINE / HOW-TO-USE */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[var(--brand-gold)] font-sans text-xs uppercase tracking-[0.2em] font-bold">
            Sacred Tribal Regimen
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-slate-100 mt-2">
            The 3-Step Hair Regrowth Routine
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 font-sans">
            Follow this ancestral Mysore tribal ritual 3 times a week for maximum follicle stimulation and root density.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <span className="text-3xl font-serif-luxury font-extrabold text-[var(--brand-gold)]">01</span>
            <h3 className="text-lg font-serif-luxury font-bold text-slate-100">Deep Scalp Oiling</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Warm 10-15ml of HAKKIVEDA 108 Herbs Hair Oil in your palms. Apply onto dry scalp using fingertips in gentle circular motions. Leave overnight or for at least 2 hours.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <span className="text-3xl font-serif-luxury font-extrabold text-[var(--brand-gold)]">02</span>
            <h3 className="text-lg font-serif-luxury font-bold text-slate-100">Herbal Scalp Cleansing</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Dilute a coin-sized amount of 42 Mountain Herbs Shampoo with water. Massage into damp scalp for 2 minutes to lift impurities without stripping natural scalp lipids. Rinse thoroughly.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <span className="text-3xl font-serif-luxury font-extrabold text-[var(--brand-gold)]">03</span>
            <h3 className="text-lg font-serif-luxury font-bold text-slate-100">Daily Follicle Drops</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Apply 1 full dropper of Root Density Follicle Serum directly onto thinning areas daily. Non-greasy leave-in formula shields roots against DHT and environmental damage.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER RESULTS / REVIEWS SUMMARY */}
      <section className="py-12 bg-white/5 border-t border-b border-white/10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[var(--brand-gold)] text-xs font-bold uppercase tracking-widest">
              Verified Buyer Results
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-100 mt-1">
              Trusted by 50,000+ Customers Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#123F2B] p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                "My hair fall dropped by 90% after just 2 weeks of using the 108 Herbs oil and shampoo. My scalp feels so healthy and clean!"
              </p>
              <p className="text-xs font-bold text-[var(--brand-gold)]">— Sunita K., Bengaluru</p>
            </div>

            <div className="bg-[#123F2B] p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                "I was skeptical, but the Root Density Serum sprouted new baby hairs around my hairline within 50 days. Truly authentic!"
              </p>
              <p className="text-xs font-bold text-[var(--brand-gold)]">— Vikram S., Delhi</p>
            </div>

            <div className="bg-[#123F2B] p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                "Free express shipping arrived in Singapore in 3 days. The smell of copper-cooked herbs is incredible and pure."
              </p>
              <p className="text-xs font-bold text-[var(--brand-gold)]">— Rajesh M., Singapore</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HAIR CARE FAQ */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[var(--brand-gold)]" />
          <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-slate-100">
            Hair Care Frequently Asked Questions
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
