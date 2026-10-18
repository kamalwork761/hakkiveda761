import React from 'react';
import { Sparkles, Droplet, Leaf, Wind, Package, ArrowRight } from 'lucide-react';
import { Category } from '../../types/store';
import { MobileAppFeaturedCategory } from '../../types/mobileApp';
import { resolveAssetUrl } from '../utils/nativeUrl';

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
  const categoriesList =
    featuredCategories && featuredCategories.length > 0
      ? featuredCategories
          .filter((c) => c.enabled !== false)
          .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      : [
          {
            id: 'app-all',
            categoryId: 'ALL',
            customTitle: 'All Remedies',
            icon: 'Sparkles',
            displayOrder: 1,
            enabled: true,
          },
          ...storeCategories.map((c, i) => ({
            id: `app-${c.id}`,
            categoryId: c.id,
            customTitle: c.name,
            icon: i === 0 ? 'Droplet' : i === 1 ? 'Leaf' : i === 2 ? 'Wind' : 'Package',
            displayOrder: i + 2,
            enabled: true,
          })),
        ];

  const getValueLine = (title: string) => {
    const name = title.toLowerCase();

    if (name.includes('oil')) return 'Nourish & massage';
    if (name.includes('cleanser') || name.includes('shampoo')) return 'Cleanse scalp & hair';
    if (name.includes('mask') || name.includes('lepa')) return 'Intensive herbal care';
    if (name.includes('combo')) return 'Complete care routines';
    if (name.includes('all')) return 'Explore every remedy';

    return 'Traditional herbal care';
  };

  const renderIcon = (iconName?: string, isSelected?: boolean) => {
    const iconClass = `w-5 h-5 ${isSelected ? 'text-[#D9B65C]' : 'text-[#0E6A54]'}`;

    switch (iconName) {
      case 'Droplet':
        return <Droplet className={iconClass} />;
      case 'Leaf':
        return <Leaf className={iconClass} />;
      case 'Wind':
        return <Wind className={iconClass} />;
      case 'Package':
        return <Package className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  return (
    <div className="w-full py-4">
      <div className="px-4 mb-3">
        <h2 className="text-[13px] font-black uppercase tracking-[0.12em] text-[#0B4A3A]">
          Shop by Remedy
        </h2>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Choose the type of herbal care you need
        </p>
      </div>

      <div
        className="flex gap-3 px-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categoriesList.map((item) => {
          const isSelected = selectedCategoryId === item.categoryId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectCategory(item.categoryId)}
              className={`flex-shrink-0 w-[142px] overflow-hidden rounded-2xl border text-left transition-all active:scale-[0.98] ${
                isSelected
                  ? 'bg-[#0E382C] border-[#D1AF58] shadow-md'
                  : 'bg-[#FFFDF8] border-[#DDD6C8] shadow-sm'
              }`}
            >
              <div className="h-[76px] relative overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={resolveAssetUrl(item.imageUrl)}
                    alt={item.customTitle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#174D3D] to-[#0B2E25]'
                        : 'bg-gradient-to-br from-[#F8F2E5] to-[#EEE5D1]'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-white/10' : 'bg-white/80'
                      }`}
                    >
                      {renderIcon(item.icon, isSelected)}
                    </div>
                  </div>
                )}

                {isSelected && (
                  <span className="absolute top-2 right-2 rounded-full bg-[#D7B55B] px-2 py-0.5 text-[8px] font-black text-[#0B382C]">
                    SELECTED
                  </span>
                )}
              </div>

              <div className="p-2.5">
                <div
                  className={`text-[12px] font-bold leading-tight ${
                    isSelected ? 'text-[#FFF8E8]' : 'text-[#123F34]'
                  }`}
                >
                  {item.customTitle}
                </div>

                <div
                  className={`mt-1 text-[9px] leading-tight ${
                    isSelected ? 'text-emerald-100/80' : 'text-slate-500'
                  }`}
                >
                  {getValueLine(item.customTitle)}
                </div>

                <div
                  className={`mt-2 flex items-center gap-1 text-[9px] font-bold ${
                    isSelected ? 'text-[#E7C96F]' : 'text-[#0E6A54]'
                  }`}
                >
                  Explore
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
