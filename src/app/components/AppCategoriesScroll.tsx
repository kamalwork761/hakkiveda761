import React from 'react';
import { Sparkles, Droplet, Leaf, Wind, Package } from 'lucide-react';
import { Category } from '../../types/store';
import { MobileAppFeaturedCategory } from '../../types/mobileApp';

interface AppCategoriesScrollProps {
  featuredCategories?: MobileAppFeaturedCategory[];
  storeCategories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export const AppCategoriesScroll: React.FC<AppCategoriesScrollProps> = ({
  featuredCategories,
  storeCategories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  // If admin has featured categories configured, use them, otherwise build from storeCategories
  const categoriesList =
    featuredCategories && featuredCategories.length > 0
      ? featuredCategories.filter((c) => c.enabled !== false)
      : [
          {
            id: 'app-all',
            categoryId: 'ALL',
            customTitle: 'All',
            icon: 'Sparkles',
            displayOrder: 1,
            enabled: true,
          },
          ...storeCategories.map((c, i) => ({
            id: `app-${c.id}`,
            categoryId: c.id,
            customTitle: c.name.replace(/Remedies|Care/gi, '').trim(),
            icon: i === 0 ? 'Droplet' : i === 1 ? 'Leaf' : i === 2 ? 'Wind' : 'Package',
            displayOrder: i + 2,
            enabled: true,
          })),
        ];

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Droplet':
        return <Droplet className="w-5 h-5 text-emerald-800" />;
      case 'Leaf':
        return <Leaf className="w-5 h-5 text-emerald-800" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-emerald-800" />;
      case 'Package':
        return <Package className="w-5 h-5 text-emerald-800" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-5 h-5 text-emerald-800" />;
    }
  };

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between px-4 mb-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-950/70 font-sans">
          Remedy Categories
        </h2>
      </div>

      <div
        className="flex items-center gap-3 px-4 overflow-x-auto no-scrollbar scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categoriesList.map((item) => {
          const isSelected = selectedCategoryId === item.categoryId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectCategory(item.categoryId)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group active:scale-95 transition-transform"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#0E382C] text-[#C5A059] shadow-md ring-2 ring-[#C5A059]'
                    : 'bg-white text-emerald-900 shadow-sm border border-emerald-950/10 group-hover:border-[#C5A059]/40'
                }`}
              >
                <div className={isSelected ? 'text-[#C5A059]' : 'text-emerald-800'}>
                  {renderIcon(item.icon)}
                </div>
              </div>
              <span
                className={`text-[11px] font-medium tracking-tight whitespace-nowrap text-center max-w-[68px] truncate ${
                  isSelected ? 'text-[#0E382C] font-bold' : 'text-slate-700'
                }`}
              >
                {item.customTitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
