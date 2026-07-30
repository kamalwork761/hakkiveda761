import React from 'react';
import { Leaf, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CategorySectionProps {
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ selectedCategory, onSelectCategory }) => {
  const { categories, playSound } = useStore();

  const handleCategoryClick = (catName: string) => {
    playSound('nav_click');
    onSelectCategory(catName);
  };

  return (
    <section className="py-16 bg-[var(--brand-primary-deep)] border-t border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[var(--brand-gold)] font-sans text-xs uppercase tracking-[0.25em] font-bold block mb-2">
              Botanical Catalog
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-slate-100">
              Hakki-Pikki Herbal Categories
            </h2>
          </div>
          <button
            onClick={() => handleCategoryClick('ALL')}
            className={`mt-4 md:mt-0 text-xs font-sans uppercase tracking-widest font-bold border-b pb-1 transition-colors ${
              selectedCategory === 'ALL'
                ? 'text-[var(--brand-gold)] border-[var(--brand-gold)]'
                : 'text-slate-400 border-transparent hover:text-[var(--brand-gold)]'
            }`}
          >
            View All Formulations ({categories.reduce((a, c) => a + c.itemCount, 0)})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories
            .filter((c) => (c.status || 'ACTIVE') === 'ACTIVE' && c.showOnHomepage !== false)
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
            .map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className={`group relative rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer active:scale-98 ${
                  isSelected
                    ? 'border-[var(--brand-gold)] ring-2 ring-[var(--brand-gold)]/50 bg-[var(--brand-primary-dark)] shadow-xl'
                    : 'border-white/10 bg-[var(--brand-primary-dark)]/80 hover:border-[var(--brand-gold)]/60 hover:bg-[var(--brand-primary-dark)]'
                }`}
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-100"
                  />
                  <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-[var(--brand-gold)] text-[10px] font-bold font-sans px-2.5 py-0.5 rounded-full border border-[var(--brand-gold)]/30">
                    {cat.itemCount} Items
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold font-serif-luxury text-slate-100 group-hover:text-[var(--brand-gold)] transition-colors flex items-center justify-between">
                    <span>{cat.name}</span>
                    <ArrowRight className="w-4 h-4 text-[var(--brand-gold)] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed opacity-80">
                    {cat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
