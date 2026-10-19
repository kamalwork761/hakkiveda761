import React from 'react';
import { Sparkles, Droplet, Leaf, Wind, Package } from 'lucide-react';
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
    <div className="w-full py-5">
      <div className="px-4 mb-4">
        <h2
          className="text-[20px] leading-tight font-black text-[#0B4A3A] tracking-[0.035em]"
          style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
        >
          Shop by Remedy
        </h2>
        <p className="mt-1 text-[12px] font-medium text-slate-600">
          Choose the herbal care that fits your routine
        </p>
      </div>

      <div
        className="flex gap-4 px-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categoriesList.map((item) => {
          const isSelected = selectedCategoryId === item.categoryId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectCategory(item.categoryId)}
              className="group flex-shrink-0 w-[150px] text-left active:scale-[0.97] transition-transform"
              aria-label={`Shop ${item.customTitle}`}
            >
              <div
                className={`relative w-[150px] h-[178px] flex items-center justify-center rounded-[24px] transition-all ${
                  isSelected
                    ? 'ring-2 ring-[#D1AF58] shadow-[0_8px_22px_rgba(14,56,44,0.18)]'
                    : ''
                }`}
              >
                {item.imageUrl ? (
                  <img
                    src={resolveAssetUrl(item.imageUrl)}
                    alt={item.customTitle}
                    className="w-full h-full object-contain select-none"
                    loading="lazy"
                    draggable={false}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-[24px] bg-gradient-to-br from-[#F8F2E5] to-[#EEE5D1] flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/85 flex items-center justify-center shadow-sm">
                      {renderIcon(item.icon, isSelected)}
                    </div>
                  </div>
                )}

                {isSelected && (
                  <span className="absolute top-2 right-2 rounded-full bg-[#E2BF5E] px-2 py-1 text-[8px] font-black uppercase tracking-wide text-[#0B382C] shadow-sm">
                    Selected
                  </span>
                )}
              </div>

              <div className="pt-2 px-1 text-center">
                <div
                  className={`text-[13px] leading-tight font-black ${
                    isSelected ? 'text-[#0B4A3A]' : 'text-[#123F34]'
                  }`}
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                >
                  {item.customTitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
