import React from 'react';
import {
  ArrowUpDown,
  Filter,
  Check,
  X,
  RotateCcw,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export type CategorySortOption =
  | 'bestseller'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'newest'
  | 'name';

export interface CategoryFilterState {
  subcategory: string;
  concern: string;
  priceRange: 'all' | 'under-999' | '999-1999' | 'above-1999';
  inStockOnly: boolean;
  minRating: number;
}

interface MobileCategorySortFilterBarProps {
  sortBy: CategorySortOption;
  onSelectSort: (option: CategorySortOption) => void;
  filters: CategoryFilterState;
  onApplyFilters: (filters: CategoryFilterState) => void;
  onClearFilters: () => void;
  availableSubcategories: string[];
  availableConcerns: string[];
  totalResultsCount: number;
}

export const MobileCategorySortFilterBar: React.FC<MobileCategorySortFilterBarProps> = ({
  sortBy,
  onSelectSort,
  filters,
  onApplyFilters,
  onClearFilters,
  availableSubcategories,
  availableConcerns,
  totalResultsCount,
}) => {
  const { playSound, formatPrice } = useStore();
  const [isSortOpen, setIsSortOpen] = React.useState(false);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  // Draft filters inside the sheet before applying
  const [draftFilters, setDraftFilters] = React.useState<CategoryFilterState>(filters);

  // Sync draft state whenever filter drawer opens
  React.useEffect(() => {
    if (isFilterOpen) {
      setDraftFilters(filters);
    }
  }, [isFilterOpen, filters]);

  // Compute active filters count
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    if (filters.subcategory) count++;
    if (filters.concern) count++;
    if (filters.priceRange !== 'all') count++;
    if (filters.inStockOnly) count++;
    if (filters.minRating > 0) count++;
    return count;
  }, [filters]);

  const sortOptions: { id: CategorySortOption; label: string; subtext?: string }[] = [
    { id: 'bestseller', label: 'Recommended / Featured', subtext: 'Tribal bestsellers first' },
    { id: 'rating', label: 'Highest Rated', subtext: 'Top customer reviews' },
    { id: 'price-asc', label: 'Price: Low to High', subtext: 'Affordable to premium' },
    { id: 'price-desc', label: 'Price: High to Low', subtext: 'Value packs & kits' },
    { id: 'newest', label: 'Newest Arrivals', subtext: 'Latest batches' },
    { id: 'name', label: 'Alphabetical: A to Z' },
  ];

  const handleOpenSort = () => {
    playSound('nav_click');
    setIsSortOpen(true);
  };

  const handleOpenFilter = () => {
    playSound('nav_click');
    setIsFilterOpen(true);
  };

  const handleSelectSortOption = (id: CategorySortOption) => {
    playSound('nav_click');
    onSelectSort(id);
    setIsSortOpen(false);
  };

  const handleApplyDraft = () => {
    playSound('nav_click');
    onApplyFilters(draftFilters);
    setIsFilterOpen(false);
  };

  const handleClearAllDraft = () => {
    playSound('nav_click');
    const emptyFilters: CategoryFilterState = {
      subcategory: '',
      concern: '',
      priceRange: 'all',
      inStockOnly: false,
      minRating: 0,
    };
    setDraftFilters(emptyFilters);
    onClearFilters();
    setIsFilterOpen(false);
  };

  return (
    <>
      {/* 50/50 Mobile Sticky Bottom Bar */}
      <div
        id="mobile-category-sticky-bar"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F2] dark:bg-[#0B1D13] border-t border-[#E5D8B5] dark:border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] pb-[env(safe-area-inset-bottom)] transition-colors duration-200"
      >
        <div className="grid grid-cols-2 divide-x divide-[#E5D8B5] dark:divide-white/10 max-w-lg mx-auto">
          {/* SORT BUTTON */}
          <button
            type="button"
            id="mobile-sort-trigger-btn"
            onClick={handleOpenSort}
            className="flex items-center justify-center gap-2 py-3.5 px-3 text-[#123F2A] dark:text-[#E4C86A] font-sans text-xs font-bold uppercase tracking-wider active:bg-[#F3EEDF] dark:active:bg-white/5 transition-colors cursor-pointer select-none"
            aria-label="Open Sort Options"
          >
            <ArrowUpDown className="w-4 h-4 text-[#B8891E] shrink-0" />
            <span className="truncate">
              Sort By
              {sortBy !== 'bestseller' && (
                <span className="text-[10px] lowercase text-[#B8891E] ml-1 font-semibold">
                  ({sortOptions.find((s) => s.id === sortBy)?.label.split(':')[0] || 'active'})
                </span>
              )}
            </span>
          </button>

          {/* FILTER BUTTON */}
          <button
            type="button"
            id="mobile-filter-trigger-btn"
            onClick={handleOpenFilter}
            className="flex items-center justify-center gap-2 py-3.5 px-3 text-[#123F2A] dark:text-[#E4C86A] font-sans text-xs font-bold uppercase tracking-wider active:bg-[#F3EEDF] dark:active:bg-white/5 transition-colors cursor-pointer select-none"
            aria-label="Open Filter Options"
          >
            <Filter className="w-4 h-4 text-[#B8891E] shrink-0" />
            <span className="truncate">Filter By</span>
            {activeFiltersCount > 0 && (
              <span className="inline-flex items-center justify-center bg-[#123F2A] text-[#FAF8F2] dark:bg-[#B8891E] dark:text-[#0B1D13] text-[10px] font-black rounded-full min-w-[18px] h-[18px] px-1 shadow-xs">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SORT BY BOTTOM SHEET */}
      {/* ========================================================================= */}
      {isSortOpen && (
        <div
          id="mobile-sort-bottom-sheet"
          className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsSortOpen(false)}
        >
          <div
            className="bg-[#FAF8F2] dark:bg-[#0E2419] border-t border-[#E5D8B5] dark:border-white/10 rounded-t-3xl shadow-2xl p-5 pb-[max(20px,env(safe-area-inset-bottom))] max-h-[85vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b border-[#E5D8B5] dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-[#B8891E]" />
                <h3 className="font-serif-luxury font-bold text-base text-[#123F2A] dark:text-white">
                  Sort Formulations
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSortOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 cursor-pointer"
                aria-label="Close sort sheet"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sort Options List */}
            <div className="space-y-1.5 pt-1">
              {sortOptions.map((opt) => {
                const isSelected = sortBy === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectSortOption(opt.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left transition-colors cursor-pointer border ${
                      isSelected
                        ? 'bg-[#123F2A] text-white border-[#123F2A] dark:bg-[#B8891E] dark:text-[#0B1D13] dark:border-[#B8891E] font-bold shadow-xs'
                        : 'bg-white dark:bg-[#123F2B] text-slate-800 dark:text-slate-100 border-[#E5D8B5]/70 dark:border-white/5 hover:border-[#B8891E]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-sans font-bold">{opt.label}</div>
                      {opt.subtext && (
                        <div
                          className={`text-[11px] font-sans mt-0.5 ${
                            isSelected
                              ? 'text-white/80 dark:text-[#0B1D13]/80'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {opt.subtext}
                        </div>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FILTER BY BOTTOM SHEET */}
      {/* ========================================================================= */}
      {isFilterOpen && (
        <div
          id="mobile-filter-bottom-sheet"
          className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsFilterOpen(false)}
        >
          <div
            className="bg-[#FAF8F2] dark:bg-[#0E2419] border-t border-[#E5D8B5] dark:border-white/10 rounded-t-3xl shadow-2xl p-5 pb-[max(16px,env(safe-area-inset-bottom))] max-h-[88vh] flex flex-col space-y-4 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b border-[#E5D8B5] dark:border-white/10 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#B8891E]" />
                <h3 className="font-serif-luxury font-bold text-base text-[#123F2A] dark:text-white">
                  Filter Formulations
                </h3>
                {activeFiltersCount > 0 && (
                  <span className="text-[10px] font-sans font-bold bg-[#B8891E] text-white px-2 py-0.5 rounded-full">
                    {activeFiltersCount} active
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 cursor-pointer"
                aria-label="Close filter sheet"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Content Scrollable Body */}
            <div className="overflow-y-auto space-y-5 pr-1 flex-1">
              {/* 1. Subcategory / Type (if available) */}
              {availableSubcategories.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-[#123F2A] dark:text-[#E4C86A] block">
                    Product Type / Subcategory
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDraftFilters({ ...draftFilters, subcategory: '' })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer border ${
                        !draftFilters.subcategory
                          ? 'bg-[#123F2A] text-white border-[#123F2A] dark:bg-[#B8891E] dark:text-[#0B1D13]'
                          : 'bg-white dark:bg-[#123F2B] text-slate-700 dark:text-slate-200 border-[#E5D8B5] dark:border-white/10'
                      }`}
                    >
                      All Types
                    </button>
                    {availableSubcategories.map((sub) => {
                      const isSelected = draftFilters.subcategory === sub;
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() =>
                            setDraftFilters({
                              ...draftFilters,
                              subcategory: isSelected ? '' : sub,
                            })
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-[#123F2A] text-white border-[#123F2A] dark:bg-[#B8891E] dark:text-[#0B1D13]'
                              : 'bg-white dark:bg-[#123F2B] text-slate-700 dark:text-slate-200 border-[#E5D8B5] dark:border-white/10'
                          }`}
                        >
                          {sub}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Concern / Benefit (if available) */}
              {availableConcerns.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-[#123F2A] dark:text-[#E4C86A] block">
                    Target Concern
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDraftFilters({ ...draftFilters, concern: '' })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer border ${
                        !draftFilters.concern
                          ? 'bg-[#123F2A] text-white border-[#123F2A] dark:bg-[#B8891E] dark:text-[#0B1D13]'
                          : 'bg-white dark:bg-[#123F2B] text-slate-700 dark:text-slate-200 border-[#E5D8B5] dark:border-white/10'
                      }`}
                    >
                      All Concerns
                    </button>
                    {availableConcerns.map((con) => {
                      const isSelected = draftFilters.concern === con;
                      return (
                        <button
                          key={con}
                          type="button"
                          onClick={() =>
                            setDraftFilters({
                              ...draftFilters,
                              concern: isSelected ? '' : con,
                            })
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-[#123F2A] text-white border-[#123F2A] dark:bg-[#B8891E] dark:text-[#0B1D13]'
                              : 'bg-white dark:bg-[#123F2B] text-slate-700 dark:text-slate-200 border-[#E5D8B5] dark:border-white/10'
                          }`}
                        >
                          {con}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Price Range Filter */}
              <div className="space-y-2">
                <label className="text-xs font-sans font-bold uppercase tracking-wider text-[#123F2A] dark:text-[#E4C86A] block">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under-999', label: `Under ${formatPrice(999)}` },
                    { id: '999-1999', label: `${formatPrice(999)} - ${formatPrice(1999)}` },
                    { id: 'above-1999', label: `Above ${formatPrice(1999)}` },
                  ].map((range) => {
                    const isSelected = draftFilters.priceRange === range.id;
                    return (
                      <button
                        key={range.id}
                        type="button"
                        onClick={() =>
                          setDraftFilters({
                            ...draftFilters,
                            priceRange: range.id as any,
                          })
                        }
                        className={`p-2.5 rounded-xl text-xs font-sans font-semibold text-center transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#123F2A] text-white border-[#123F2A] dark:bg-[#B8891E] dark:text-[#0B1D13]'
                            : 'bg-white dark:bg-[#123F2B] text-slate-700 dark:text-slate-200 border-[#E5D8B5] dark:border-white/10'
                        }`}
                      >
                        {range.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Minimum Rating Filter */}
              <div className="space-y-2">
                <label className="text-xs font-sans font-bold uppercase tracking-wider text-[#123F2A] dark:text-[#E4C86A] block">
                  Customer Rating
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 0, label: 'Any Rating' },
                    { val: 4.5, label: '4.5 ★ & Up' },
                    { val: 4.8, label: '4.8 ★ & Up' },
                  ].map((rate) => {
                    const isSelected = draftFilters.minRating === rate.val;
                    return (
                      <button
                        key={rate.val}
                        type="button"
                        onClick={() =>
                          setDraftFilters({ ...draftFilters, minRating: rate.val })
                        }
                        className={`p-2 rounded-xl text-xs font-sans font-semibold text-center transition-all cursor-pointer border flex items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-[#123F2A] text-white border-[#123F2A] dark:bg-[#B8891E] dark:text-[#0B1D13]'
                            : 'bg-white dark:bg-[#123F2B] text-slate-700 dark:text-slate-200 border-[#E5D8B5] dark:border-white/10'
                        }`}
                      >
                        {rate.val > 0 && <Star className="w-3 h-3 fill-current text-amber-400" />}
                        <span>{rate.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. In-Stock Switch */}
              <div className="pt-2 border-t border-[#E5D8B5] dark:border-white/10">
                <label className="flex items-center justify-between bg-white dark:bg-[#123F2B] p-3 rounded-xl border border-[#E5D8B5] dark:border-white/10 cursor-pointer select-none">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#B8891E]" />
                    <span className="text-xs font-sans font-bold text-[#123F2A] dark:text-white">
                      In Stock Only
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={draftFilters.inStockOnly}
                    onChange={(e) =>
                      setDraftFilters({ ...draftFilters, inStockOnly: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#123F2A] rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Bottom Actions Toolbar */}
            <div className="pt-3 border-t border-[#E5D8B5] dark:border-white/10 grid grid-cols-2 gap-3 shrink-0">
              <button
                type="button"
                onClick={handleClearAllDraft}
                className="py-3 px-4 rounded-xl border border-[#E5D8B5] dark:border-white/20 text-[#123F2A] dark:text-white font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 active:bg-black/5 dark:active:bg-white/5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>

              <button
                type="button"
                onClick={handleApplyDraft}
                className="py-3 px-4 rounded-xl bg-[#123F2A] dark:bg-[#B8891E] text-white dark:text-[#0B1D13] font-sans text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all cursor-pointer"
              >
                <span>Apply Filters</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
