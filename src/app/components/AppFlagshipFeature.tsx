import React from 'react';
import { Sparkles, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Product } from '../../types/store';
import { useStore } from '../../context/StoreContext';
import { resolveAssetUrl } from '../utils/nativeUrl';

interface AppFlagshipFeatureProps {
  flagshipProduct?: Product;
  onOpenProductDetail: (productId: string) => void;
}

export const AppFlagshipFeature: React.FC<AppFlagshipFeatureProps> = ({
  flagshipProduct,
  onOpenProductDetail,
}) => {
  const { addToCart, playSound } = useStore();

  const product = flagshipProduct;
  if (!product) return null;

  const imgSrc = resolveAssetUrl(
    product.image || '/images/hakkiveda_oil_couple_herbs.jpg'
  );

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    try {
      playSound('success');
    } catch {}
  };

  return (
    <div className="w-full px-4 py-3">
      <div className="rounded-3xl p-4 bg-gradient-to-b from-[#FAF7F2] to-[#F3ECE1] border border-[#C5A059]/30 shadow-sm relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0E382C] animate-pulse" />
            <span className="text-[10px] font-bold text-[#0E382C] uppercase tracking-widest">
              Flagship Formulation
            </span>
          </div>
          <span className="text-[9px] font-bold text-[#C5A059] bg-[#0E382C] px-2 py-0.5 rounded-full shadow-xs">
            108 Forest Herbs
          </span>
        </div>

        {/* Content grid */}
        <div className="flex gap-3.5 items-center">
          <div
            onClick={() => onOpenProductDetail(product.id)}
            className="w-28 h-28 flex-shrink-0 rounded-2xl bg-white p-1 border border-emerald-950/10 shadow-sm overflow-hidden cursor-pointer"
          >
            <img
              src={imgSrc}
              alt={product.name}
              className="w-full h-full object-cover object-center rounded-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/hero_tribal_elders.jpg';
              }}
            />
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3
                onClick={() => onOpenProductDetail(product.id)}
                className="font-serif text-sm font-bold text-slate-900 leading-snug cursor-pointer line-clamp-2"
              >
                {product.name}
              </h3>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                Slow-simmered over wood fire with 108 wild Nilgiri herbs for deep follicular revival.
              </p>
            </div>

            <div className="mt-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-base text-[#0E382C]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-[10px] text-slate-400 line-through ml-1.5">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleQuickAdd}
                className="px-3 py-1.5 rounded-xl bg-[#0E382C] text-[#FDF8EC] font-bold text-xs flex items-center gap-1.5 hover:bg-[#134E3F] active:scale-95 shadow-sm transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Herb Badges */}
        <div className="mt-3.5 pt-3 border-t border-emerald-950/10 grid grid-cols-4 gap-1.5 text-center">
          <div className="bg-white/80 rounded-lg p-1 border border-emerald-950/5">
            <span className="text-[10px] font-bold text-slate-800 block">Bhringraj</span>
            <span className="text-[8px] text-slate-500">Root Density</span>
          </div>
          <div className="bg-white/80 rounded-lg p-1 border border-emerald-950/5">
            <span className="text-[10px] font-bold text-slate-800 block">Gunja</span>
            <span className="text-[8px] text-slate-500">Regrowth</span>
          </div>
          <div className="bg-white/80 rounded-lg p-1 border border-emerald-950/5">
            <span className="text-[10px] font-bold text-slate-800 block">Devadaru</span>
            <span className="text-[8px] text-slate-500">Scalp Vigor</span>
          </div>
          <div className="bg-white/80 rounded-lg p-1 border border-emerald-950/5">
            <span className="text-[10px] font-bold text-slate-800 block">Nagarmotha</span>
            <span className="text-[8px] text-slate-500">Follicle Grip</span>
          </div>
        </div>
      </div>
    </div>
  );
};
