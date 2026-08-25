import React, { useState, useEffect, useMemo } from 'react';
import { Star, ShoppingBag, Heart, Eye, Check, Search, ChevronRight, SlidersHorizontal, ArrowUpDown, Filter, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/store';
import { getProductUrl } from '../utils/productUtils';

interface ProductGridProps {
  selectedCategory: string;
  onSelectCategory?: (catName: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ selectedCategory, onSelectCategory }) => {
  const { products, categories, formatPrice, addToCart, toggleWishlist, isInWishlist, openQuickView, playSound } = useStore();
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'bestseller' | 'price-asc' | 'price-desc' | 'rating' | 'name'>('bestseller');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Trigger quick skeleton animation when category changes for smooth visual feedback
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 120);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  // Compute product counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filter & Sort Products
  const displayedProducts = useMemo(() => {
    let result = products;

    // 1. Category Filter
    if (selectedCategory !== 'ALL') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 2. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.ingredients.some((ing) => ing.toLowerCase().includes(q))
      );
    }

    // 3. In Stock Filter
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // 4. Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceINR - b.priceINR;
      if (sortBy === 'price-desc') return b.priceINR - a.priceINR;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      // default: bestseller
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      return 0;
    });

    return result;
  }, [products, selectedCategory, searchQuery, inStockOnly, sortBy]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    playSound('add_to_cart');
    addToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1800);
  };

  const handleCategoryTabClick = (catName: string) => {
    if (onSelectCategory) {
      onSelectCategory(catName);
    }
  };

  return (
    <section id="products" className="py-16 sm:py-20 bg-[var(--brand-primary-dark)] relative scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

        {/* Dynamic Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-sans text-slate-300 mb-6 overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => handleCategoryTabClick('ALL')}
            className="hover:text-[var(--brand-gold)] transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
          <button
            onClick={() => handleCategoryTabClick('ALL')}
            className="hover:text-[var(--brand-gold)] transition-colors"
          >
            Botanical Catalog
          </button>
          {selectedCategory !== 'ALL' && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
              <span className="text-[var(--brand-gold)] font-semibold">{selectedCategory}</span>
            </>
          )}
        </nav>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-white/10 pb-6 gap-4">
          <div>
            <span className="text-[var(--brand-gold)] font-sans text-xs uppercase tracking-[0.25em] font-bold block mb-1">
              Authentic Tribal Formulations
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-slate-100 flex items-center gap-3">
              <span>{selectedCategory === 'ALL' ? 'All Bestsellers & Formulations' : selectedCategory}</span>
              <span className="text-xs font-sans bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] border border-[var(--brand-gold)]/30 px-3 py-1 rounded-full font-bold">
                {displayedProducts.length} Items
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-300 font-sans max-w-sm leading-relaxed">
            Every bottle is infused with 42 wild mountain herbs harvested in Karnataka forests and slow-cooked over 21 solar days.
          </p>
        </div>

        {/* Category Pills Bar (Horizontal Scroll on Mobile) */}
        <div className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
            <button
              onClick={() => handleCategoryTabClick('ALL')}
              className={`px-4 py-2 rounded-full text-xs font-bold font-sans uppercase tracking-wider whitespace-nowrap transition-all duration-200 flex items-center gap-2 border ${
                selectedCategory === 'ALL'
                  ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] border-[var(--brand-gold)] shadow-lg scale-105'
                  : 'bg-[var(--brand-primary-deep)] text-slate-200 border-white/10 hover:border-[var(--brand-gold)]/50 hover:text-white'
              }`}
            >
              <span>All Formulations</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] ${
                  selectedCategory === 'ALL' ? 'bg-[var(--brand-primary-dark)] text-[var(--brand-gold)]' : 'bg-black/40 text-slate-300'
                }`}
              >
                {categoryCounts['ALL'] || products.length}
              </span>
            </button>

            {categories
              .filter((c) => (c.status || 'ACTIVE') === 'ACTIVE')
              .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
              .map((cat) => {
              const isSelected = selectedCategory === cat.name;
              const count = categoryCounts[cat.name] || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryTabClick(cat.name)}
                  className={`px-4 py-2 rounded-full text-xs font-bold font-sans uppercase tracking-wider whitespace-nowrap transition-all duration-200 flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] border-[var(--brand-gold)] shadow-lg scale-105'
                      : 'bg-[var(--brand-primary-deep)] text-slate-200 border-white/10 hover:border-[var(--brand-gold)]/50 hover:text-white'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] ${
                      isSelected ? 'bg-[var(--brand-primary-dark)] text-[var(--brand-gold)]' : 'bg-black/40 text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter & Sort Controls Toolbar */}
        <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-xl p-3 sm:p-4 mb-8 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Quick Search in Category */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--brand-gold)]" />
            <input
              type="text"
              placeholder={`Search in ${selectedCategory === 'ALL' ? 'all products' : selectedCategory}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--brand-primary-dark)] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[var(--brand-gold)] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Controls Right: In Stock Toggle & Sorting */}
          <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end">
            {/* In Stock Toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--brand-gold)] bg-[var(--brand-primary-dark)] border-white/20 cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 bg-[var(--brand-primary-dark)] border border-white/10 rounded-lg px-3 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
              <span className="text-[11px] font-sans text-slate-300 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-sans text-slate-100 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="bestseller" className="bg-[var(--brand-primary-deep)] text-slate-100">Bestsellers First</option>
                <option value="price-asc" className="bg-[var(--brand-primary-deep)] text-slate-100">Price: Low to High</option>
                <option value="price-desc" className="bg-[var(--brand-primary-deep)] text-slate-100">Price: High to Low</option>
                <option value="rating" className="bg-[var(--brand-primary-deep)] text-slate-100">Highest Rated (4.9+)</option>
                <option value="name" className="bg-[var(--brand-primary-deep)] text-slate-100">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading Skeleton View */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-2xl p-4 animate-pulse space-y-4">
                <div className="h-64 bg-white/5 rounded-xl"></div>
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-3 bg-white/5 rounded w-1/2"></div>
                <div className="h-10 bg-white/10 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          /* Empty Filter State */
          <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-2xl p-12 text-center text-slate-300 max-w-md mx-auto my-12">
            <Filter className="w-12 h-12 text-[var(--brand-gold)] mx-auto mb-4 opacity-80" />
            <h3 className="text-xl font-bold font-serif-luxury text-slate-100 mb-2">No Formulations Found</h3>
            <p className="text-xs text-slate-300 mb-6">
              We couldn't find any products matching your current filters in <span className="text-[var(--brand-gold)] font-bold">{selectedCategory}</span>.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setInStockOnly(false);
                if (onSelectCategory) onSelectCategory('ALL');
              }}
              className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors inline-flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          /* Product Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProducts.map((product) => {
              const inWish = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => {
                    window.history.pushState({}, '', getProductUrl(product));
                    window.dispatchEvent(new PopStateEvent('popstate'));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group bg-[var(--brand-primary-deep)] border border-white/10 rounded-2xl overflow-hidden hover:border-[var(--brand-gold)]/60 transition-all duration-300 hover:shadow-2xl flex flex-col cursor-pointer relative"
                >
                  {/* Image Container */}
                  <div className="relative h-72 overflow-hidden bg-black/30 flex items-center justify-center p-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Multi-Image Gallery Indicator Badge */}
                    {([product.image, ...(product.additionalImages || [])].filter(Boolean).length > 1) && (
                      <div className="absolute bottom-3 left-3 bg-black/60 text-[var(--brand-gold)] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[var(--brand-gold)]/30 z-10 flex items-center gap-1 backdrop-blur-xs">
                        <span>📷</span>
                        <span>{[product.image, ...(product.additionalImages || [])].filter(Boolean).length} Images</span>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      {product.isBestseller && (
                        <span className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
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
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playSound('wishlist_toggle');
                        toggleWishlist(product);
                      }}
                      className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-10 h-10 rounded-full transition-all duration-200 shadow-md flex items-center justify-center z-10 cursor-pointer active:scale-95 ${
                        inWish
                          ? 'bg-[#0B4A35] text-[var(--brand-gold,#C9A84E)] border border-[var(--brand-gold,#C9A84E)]/60 shadow-[0_2px_8px_rgba(11,74,53,0.35)]'
                          : 'bg-white/95 text-[#0B4A35] border border-[rgba(201,168,76,0.35)] hover:border-[#0B4A35]/50 hover:bg-white hover:text-[#0B4A35] hover:scale-105'
                      }`}
                      aria-label={inWish ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                      title={inWish ? 'In Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart className={`w-4 h-4 transition-transform ${inWish ? 'fill-current scale-105' : ''}`} />
                    </button>

                    {/* Quick View Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openQuickView(product);
                        }}
                        className="bg-white text-[var(--brand-primary-dark)] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xl hover:bg-[var(--brand-gold)] transition-colors"
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
                        <div className="flex text-[var(--brand-gold)]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-300 font-sans font-medium">
                          {product.rating} ({product.reviewsCount} reviews)
                        </span>
                      </div>

                      <h3 className="text-xl font-bold font-serif-luxury text-slate-100 group-hover:text-[var(--brand-gold)] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[var(--brand-gold)] font-sans mt-0.5 line-clamp-1">
                        {product.subtitle}
                      </p>

                      <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed opacity-90">
                        {product.description}
                      </p>
                    </div>

                    {/* Price and Add to Cart CTA */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold font-sans text-[var(--brand-gold)]">
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
                        className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer ${
                          addedProductId === product.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] hover:bg-white'
                        }`}
                      >
                        {addedProductId === product.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
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
