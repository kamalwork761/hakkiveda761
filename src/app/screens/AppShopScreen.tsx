import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AppProductCard } from '../components/AppProductCard';

interface AppShopScreenProps {
  initialCategoryId?: string;
  initialConcernId?: string;
  onOpenProductDetail: (productId: string) => void;
}

export const AppShopScreen: React.FC<AppShopScreenProps> = ({
  initialCategoryId = 'ALL',
  initialConcernId,
  onOpenProductDetail,
}) => {
  const { products, categories } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryId);
  const [selectedConcern, setSelectedConcern] = useState<string | undefined>(initialConcernId);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const concernsList = [
    { id: 'hair-fall', label: 'Hair Fall' },
    { id: 'hair-growth', label: 'Growth' },
    { id: 'baldness', label: 'Baldness' },
    { id: 'dandruff', label: 'Dandruff' },
    { id: 'scalp-care', label: 'Scalp Care' },
  ];

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== 'ALL') {
      result = result.filter(
        (p) =>
          p.category === selectedCategory ||
          categories.find((c) => c.id === selectedCategory)?.name.toLowerCase().includes(p.category?.toLowerCase() || '')
      );
    }

    // Concern filter (search in name, subtitle, or tags)
    if (selectedConcern) {
      const q = selectedConcern.replace('-', ' ').toLowerCase();
      result = result.filter((p) => {
        const text = `${p.name} ${p.subtitle || ''} ${p.description || ''} ${p.tags?.join(' ') || ''}`.toLowerCase();
        return text.includes(q) || (selectedConcern === 'baldness' && text.includes('lepa'));
      });
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const text = `${p.name} ${p.subtitle || ''} ${p.category || ''} ${p.description || ''}`.toLowerCase();
        return text.includes(q);
      });
    }

    // Sorting
    switch (sortBy) {
      case 'price_low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
    }

    return result;
  }, [products, categories, selectedCategory, selectedConcern, searchQuery, sortBy]);

  return (
    <div className="w-full pb-24">
      {/* Top Search Bar */}
      <div className="sticky top-14 z-30 bg-[#FAF7F2] px-4 pt-3 pb-2 border-b border-emerald-950/10">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-emerald-900/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search herbal remedies, oil, lepa..."
            className="w-full pl-9 pr-8 py-2 bg-white rounded-xl text-xs text-slate-800 placeholder-slate-400 border border-emerald-950/15 focus:outline-none focus:ring-1 focus:ring-[#0E382C] shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5 pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('ALL');
              setSelectedConcern(undefined);
            }}
            className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'ALL' && !selectedConcern
                ? 'bg-[#0E382C] text-[#FDF8EC] font-bold shadow-xs'
                : 'bg-white text-slate-700 border border-emerald-950/10'
            }`}
          >
            All Products
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedConcern(undefined);
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#0E382C] text-[#FDF8EC] font-bold shadow-xs'
                    : 'bg-white text-slate-700 border border-emerald-950/10'
                }`}
              >
                {cat.name.replace(/Remedies|Care/gi, '').trim()}
              </button>
            );
          })}

          {/* Concern pills */}
          {concernsList.map((con) => {
            const isSelected = selectedConcern === con.id;
            return (
              <button
                key={con.id}
                type="button"
                onClick={() => {
                  setSelectedConcern(con.id);
                  setSelectedCategory('ALL');
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#C5A059] text-[#0E382C] font-bold shadow-xs'
                    : 'bg-[#C5A059]/10 text-emerald-950 border border-[#C5A059]/30'
                }`}
              >
                {con.label}
              </button>
            );
          })}
        </div>

        {/* Results Bar & Sort Toggle */}
        <div className="flex items-center justify-between pt-1.5">
          <span className="text-[11px] font-medium text-slate-500">
            Showing <strong className="text-slate-800">{filteredProducts.length}</strong> remedies
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-1 text-[11px] font-bold text-[#0E382C] bg-white px-2.5 py-1 rounded-lg border border-emerald-950/10 shadow-xs"
            >
              <ArrowUpDown className="w-3 h-3 text-[#C5A059]" />
              <span>
                {sortBy === 'featured'
                  ? 'Featured'
                  : sortBy === 'price_low'
                  ? 'Price: Low'
                  : sortBy === 'price_high'
                  ? 'Price: High'
                  : 'Top Rated'}
              </span>
            </button>

            {/* Sort Dropdown */}
            {isSortOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-emerald-950/10 py-1 z-40">
                <button
                  type="button"
                  onClick={() => {
                    setSortBy('featured');
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs ${
                    sortBy === 'featured' ? 'font-bold text-[#0E382C] bg-emerald-50' : 'text-slate-700'
                  }`}
                >
                  Featured
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortBy('price_low');
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs ${
                    sortBy === 'price_low' ? 'font-bold text-[#0E382C] bg-emerald-50' : 'text-slate-700'
                  }`}
                >
                  Price: Low to High
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortBy('price_high');
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs ${
                    sortBy === 'price_high' ? 'font-bold text-[#0E382C] bg-emerald-50' : 'text-slate-700'
                  }`}
                >
                  Price: High to Low
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortBy('rating');
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs ${
                    sortBy === 'rating' ? 'font-bold text-[#0E382C] bg-emerald-50' : 'text-slate-700'
                  }`}
                >
                  Customer Rating
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2-Column Product Grid */}
      <div className="px-4 pt-3">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-500 text-sm">No formulations found matching your filter.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedConcern(undefined);
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-1.5 rounded-full bg-[#0E382C] text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <AppProductCard
                key={product.id}
                product={product}
                onOpenDetail={onOpenProductDetail}
                layout="grid"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
