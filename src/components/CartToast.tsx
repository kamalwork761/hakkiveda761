import React from 'react';
import { Check, ShoppingBag, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartToast: React.FC = () => {
  const { cartToast, hideCartToast, setIsCartOpen, playSound } = useStore();

  if (!cartToast?.show) return null;

  const handleViewCart = () => {
    playSound('nav_click');
    hideCartToast();
    setIsCartOpen(true);
  };

  return (
    <aside
      id="cart-confirmation-toast"
      aria-label="Cart confirmation notification"
      className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 left-3 sm:left-auto z-50 sm:max-w-md w-auto bg-[#0B2F20]/95 dark:bg-[#07160F]/95 text-white backdrop-blur-md px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.35)] border border-[var(--brand-gold,#C9A84E)]/40 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300 transition-all select-none"
    >
      {/* Icon & Message */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-[var(--brand-gold,#C9A84E)] text-[#0B2F20] flex items-center justify-center shrink-0 shadow-xs">
          <Check className="w-4 h-4 stroke-[3]" />
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-bold font-serif-luxury text-white tracking-wide leading-tight">
            {cartToast.message || 'Added to cart'}
          </p>
          {cartToast.productName && (
            <p className="text-[11px] text-[#E4C86A] font-sans truncate max-w-[150px] sm:max-w-[210px] opacity-90 mt-0.5">
              {cartToast.productName}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleViewCart}
          className="px-3.5 py-1.5 bg-[var(--brand-gold,#C9A84E)] hover:bg-[#b8891e] active:scale-95 text-[#0B2F20] rounded-lg text-xs font-bold font-sans uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>View Cart</span>
        </button>

        <button
          type="button"
          onClick={hideCartToast}
          className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
