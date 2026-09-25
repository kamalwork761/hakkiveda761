import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Product } from '../../types/store';
import { AppProductCard } from './AppProductCard';

interface AppProductCarouselProps {
  title: string;
  subtitle?: string;
  badge?: string;
  products: Product[];
  onOpenProductDetail: (productId: string) => void;
  onSeeAll?: () => void;
}

export const AppProductCarousel: React.FC<AppProductCarouselProps> = ({
  title,
  subtitle,
  badge,
  products,
  onOpenProductDetail,
  onSeeAll,
}) => {
  if (products.length === 0) return null;

  return (
    <div className="w-full py-3">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-2.5">
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="font-serif text-base font-bold text-slate-900 leading-tight">
              {title}
            </h2>
            {badge && (
              <span className="text-[9px] font-bold text-[#C5A059] bg-[#C5A059]/10 px-1.5 py-0.5 rounded-full border border-[#C5A059]/20 uppercase tracking-wider">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] text-slate-500 font-sans mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {onSeeAll && (
          <button
            type="button"
            onClick={onSeeAll}
            className="flex items-center text-xs font-bold text-[#0E382C] hover:text-[#C5A059] transition-colors py-1 pl-2"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        )}
      </div>

      {/* Horizontal Carousel */}
      <div
        className="flex items-stretch gap-3 px-4 overflow-x-auto no-scrollbar scroll-smooth pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <AppProductCard
            key={product.id}
            product={product}
            onOpenDetail={onOpenProductDetail}
            layout="carousel"
          />
        ))}
      </div>
    </div>
  );
};
