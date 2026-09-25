import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { resolveAssetUrl } from '../utils/nativeUrl';

interface AppSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProductDetail: (productId: string) => void;
  onSearchCategory: (categoryId: string) => void;
}

export const AppSearchModal: React.FC<AppSearchModalProps> = ({
  isOpen,
  onClose,
  onOpenProductDetail,
  onSearchCategory,
}) => {
  const { products, categories } = useStore();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const quickTerms = ['108 Forest Herbs Oil', 'Baldness Lepa', 'Hair Fall Oil', 'Shikakai Shampoo', 'Hair Growth'];

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter((p) => {
      const text = `${p.name} ${p.subtitle || ''} ${p.category || ''} ${p.description || ''}`.toLowerCase();
      return text.includes(q);
    });
  }, [products, query]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white animate-fadeIn">
      {/* Search Header */}
      <div className="pt-[max(8px,env(safe-area-inset-top))] px-4 pb-3 border-b border-slate-100 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-emerald-900/60" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search herbal remedies, oil, lepa..."
            className="w-full pl-9 pr-8 py-2 bg-slate-100 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0E382C]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-xs font-bold text-[#0E382C] px-2 py-1.5"
        >
          Cancel
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {!query.trim() ? (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Trending Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickTerms.map((term, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-bold text-slate-800">No matching remedies found</p>
            <p className="text-xs text-slate-500 mt-1">Try searching for "oil", "lepa", or "shampoo".</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onClose();
                  onOpenProductDetail(product.id);
                }}
                className="py-3 flex items-center gap-3 cursor-pointer active:bg-slate-50 transition-colors"
              >
                <img
                  src={resolveAssetUrl(product.image)}
                  alt={product.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-[#0E382C] uppercase tracking-wider">
                    {product.category || 'Remedy'}
                  </div>
                  <h4 className="font-serif text-xs font-bold text-slate-900 truncate">
                    {product.name}
                  </h4>
                  <div className="text-xs font-bold text-[#0E382C] mt-0.5">
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
