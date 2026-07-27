import React, { useState } from 'react';
import { Star, ShoppingBag, Heart, Eye, Sparkles, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/store';

interface ProductGridProps {
  selectedCategory: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ selectedCategory }) => {
  const { products, formatPrice, addToCart, toggleWishlist, isInWishlist, openQuickView } = useStore();
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const displayedProducts = selectedCategory === 'ALL'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedToast(product.name);
    setTimeout(() => setAddedToast(null), 3000);
  };

  return (
    <section id="products" className="py-20 bg-[#0B3D2E] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Toast Notification */}
        {addedToast && (
          <div className="fixed bottom-8 left-8 z-50 bg-[#C8A24A] text-[#0B3D2E] px-5 py-3 rounded-xl shadow-2xl font-sans text-xs font-bold flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
            <Check className="w-5 h-5 bg-[#0B3D2E] text-[#C8A24A] rounded-full p-1" />
            <span>Added '{addedToast}' to your cart!</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6">
          <div>
            <span className="text-[#C8A24A] font-sans text-xs uppercase tracking-[0.25em] font-bold block mb-2">
              Authentic Tribal Formulations
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-slate-100">
              {selectedCategory === 'ALL' ? 'Bestsellers & Formulations' : selectedCategory}
            </h2>
          </div>
          <p className="text-xs text-slate-300 font-sans mt-3 md:mt-0 max-w-sm leading-relaxed">
            Every bottle is infused with 42 wild mountain herbs harvested in Karnataka forests and slow-cooked over 21 solar days.
          </p>
        </div>

        {displayedProducts.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p>No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProducts.map((product) => {
              const inWish = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => openQuickView(product)}
                  className="group bg-[#072a20] border border-white/10 rounded-2xl overflow-hidden hover:border-[#C8A24A]/60 transition-all duration-300 hover:shadow-2xl flex flex-col cursor-pointer relative"
                >
                  {/* Image Container */}
                  <div className="relative h-72 overflow-hidden bg-black/20">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      {product.isBestseller && (
                        <span className="bg-[#C8A24A] text-[#0B3D2E] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                          Bestseller
                        </span>
                      )}
                      {product.isNew && (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                          New Formula
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                        inWish ? 'bg-[#C8A24A] text-[#0B3D2E]' : 'bg-black/40 text-white hover:text-[#C8A24A]'
                      }`}
                      title={inWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart className={`w-4 h-4 ${inWish ? 'fill-current' : ''}`} />
                    </button>

                    {/* Quick View Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openQuickView(product);
                        }}
                        className="bg-white text-[#0B3D2E] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xl hover:bg-[#C8A24A] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick View</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-[#C8A24A]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-300 font-sans font-medium">
                          {product.rating} ({product.reviewsCount} reviews)
                        </span>
                      </div>

                      <h3 className="text-xl font-bold font-serif-luxury text-slate-100 group-hover:text-[#C8A24A] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#C8A24A] font-sans mt-0.5 line-clamp-1">
                        {product.subtitle}
                      </p>

                      <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Price and Add to Cart CTA */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold font-sans text-[#C8A24A]">
                          {formatPrice(product.priceINR)}
                        </span>
                        {product.originalPriceINR && (
                          <span className="text-xs font-sans text-slate-400 line-through ml-2">
                            {formatPrice(product.originalPriceINR)}
                          </span>
                        )}
                        <span className="block text-[10px] text-slate-400 font-sans mt-0.5">
                          {product.volume}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="bg-[#C8A24A] text-[#0B3D2E] px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white transition-all flex items-center gap-1.5 shadow-md"
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
        )}
      </div>
    </section>
  );
};
