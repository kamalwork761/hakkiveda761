import React, { useMemo } from 'react';
import { ArrowLeft, Sparkles, ShoppingBag, Star, Heart, Eye, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/store';

interface CategoryLandingPageProps {
  categoryPath: string;
  onReturnHome: () => void;
}

const CATEGORY_DETAILS: Record<string, { title: string; categoryName: string; subtitle: string; description: string; image: string }> = {
  '/hair-care': {
    title: 'Hair Care Formulations',
    categoryName: 'Hair Oils & Elixirs',
    subtitle: 'Adivasi Regrowth Oils, Follicle Serums & Herbal Cleansers',
    description: 'Slow-brewed in copper cauldrons with 42 wild mountain herbs for deep scalp penetration and follicle reactivation.',
    image: '/images/hakkiveda_108_oil_gold.jpg',
  },
  '/skin-care': {
    title: 'Skin Care & Lepas',
    categoryName: 'Tribal Masks & Lepas',
    subtitle: 'Ancestral Forest Botanical Muds & Restorative Herbal Lepas',
    description: 'Pure tribal mud packs and detox pastes made from wild forest roots, red volcanic clay, and neem leaves.',
    image: '/images/hakkiveda_baldness_powder.jpg',
  },
  '/tribal-wellness': {
    title: 'Tribal Wellness Bundles',
    categoryName: 'Wellness Combos',
    subtitle: 'Holistic Regrowth Bundles & 90-Day REGIMEN Kits',
    description: 'Curated 90-day hair restoration and scalp rehabilitation kits crafted according to century-old Hakki-Pikki tribal wisdom.',
    image: '/images/hakkiveda_oil_couple_herbs.jpg',
  },
};

export const CategoryLandingPage: React.FC<CategoryLandingPageProps> = ({ categoryPath, onReturnHome }) => {
  const { products, formatPrice, addToCart, toggleWishlist, isInWishlist, openQuickView, playSound } = useStore();
  const [addedToast, setAddedToast] = React.useState<string | null>(null);

  const config = CATEGORY_DETAILS[categoryPath] || {
    title: 'Herbal Category',
    categoryName: 'Hair Oils & Elixirs',
    subtitle: 'Authentic Adivasi Formulations',
    description: 'Slow-cooked in Mysore forests using wild-harvested herbs.',
    image: '/images/hakkiveda_108_oil_gold.jpg',
  };

  // Match products for this category path
  const categoryProducts = useMemo(() => {
    if (categoryPath === '/hair-care') {
      return products.filter(
        (p) =>
          p.category === 'Hair Oils & Elixirs' ||
          p.category === 'Follicle Serums' ||
          p.category === 'Herbal Cleansers' ||
          p.name.toLowerCase().includes('oil') ||
          p.name.toLowerCase().includes('hair')
      );
    }
    if (categoryPath === '/skin-care') {
      return products.filter(
        (p) =>
          p.category === 'Tribal Masks & Lepas' ||
          p.name.toLowerCase().includes('lepa') ||
          p.name.toLowerCase().includes('powder') ||
          p.name.toLowerCase().includes('mask')
      );
    }
    if (categoryPath === '/tribal-wellness') {
      return products.filter(
        (p) =>
          p.category === 'Wellness Combos' ||
          p.name.toLowerCase().includes('combo') ||
          p.name.toLowerCase().includes('kit') ||
          p.name.toLowerCase().includes('bundle')
      );
    }
    return products;
  }, [products, categoryPath]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    playSound('add_to_cart');
    addToCart(product, 1);
    setAddedToast(product.name);
    setTimeout(() => setAddedToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0E281C] text-white py-10 px-4 sm:px-8">
      {addedToast && (
        <div className="fixed bottom-8 left-8 z-50 bg-[var(--brand-gold)] text-[#0E281C] px-5 py-3 rounded-xl shadow-2xl font-sans text-xs font-bold flex items-center gap-3">
          <Check className="w-5 h-5 bg-[#0E281C] text-[var(--brand-gold)] rounded-full p-1" />
          <span>Added '{addedToast}' to your cart!</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Navigation / Back Button */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onReturnHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-[var(--brand-gold)] hover:text-[#0E281C] text-xs font-bold transition-all cursor-pointer border border-white/15"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Products</span>
          </button>

          <span className="text-[10px] font-sans font-bold uppercase tracking-widest bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] border border-[var(--brand-gold)]/40 px-3 py-1 rounded-full">
            Phase 1 Category Preview
          </span>
        </div>

        {/* Category Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-r from-[#123F2B] to-[#081811] shadow-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--brand-gold)]" />
              <span className="text-[var(--brand-gold)] text-xs uppercase tracking-[0.2em] font-extrabold">
                {config.subtitle}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-slate-100">
              {config.title}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {config.description}
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-sans text-[var(--brand-gold)] font-bold">
              <span>{categoryProducts.length} Formulations Available</span>
              <span>•</span>
              <span>100% Organic Adivasi Heritage</span>
            </div>
          </div>

          <div className="w-full md:w-72 h-56 sm:h-64 rounded-2xl overflow-hidden border border-white/20 shadow-xl shrink-0">
            <img src={config.image} alt={config.title} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Category Product Grid */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-slate-100 border-b border-white/10 pb-4">
            Featured Products in {config.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => {
              const inWishlist = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  className="bg-white text-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playSound('wishlist_toggle');
                        toggleWishlist(product.id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md z-10 cursor-pointer ${
                        inWishlist ? 'bg-rose-500 text-white' : 'bg-black/40 text-white hover:bg-white hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                    </button>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                      <button
                        type="button"
                        onClick={() => openQuickView(product)}
                        className="bg-white/90 hover:bg-white text-slate-900 font-bold text-xs px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
                      >
                        <Eye className="w-4 h-4 text-[#123F2B]" />
                        <span>Quick View</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[11px] font-bold text-[#123F2B] uppercase">
                        {product.category}
                      </span>
                      <h3
                        onClick={() => openQuickView(product)}
                        className="font-serif-luxury font-bold text-sm text-slate-900 line-clamp-2 cursor-pointer hover:text-[#123F2B]"
                      >
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                        <span className="text-xs font-bold">{product.rating}</span>
                        <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-base font-extrabold text-[#123F2B]">
                        {formatPrice(product.priceINR)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        className="py-2 px-3 bg-[#123F2B] hover:bg-[#0E281C] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
