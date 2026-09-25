import React from 'react';
import { Search, ShoppingBag, Bell, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { resolveAssetUrl } from '../utils/nativeUrl';

interface AppHeaderProps {
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenNotifications?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenSearch,
  onOpenCart,
  onOpenNotifications,
}) => {
  const { cart, siteSettings } = useStore();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const logoSrc = resolveAssetUrl(
    siteSettings?.headerHvLogo || '/images/hakkiveda-logo.png',
    ''
  );

  return (
    <header className="sticky top-0 z-40 bg-[#0E382C] text-white shadow-md border-b border-[#C5A059]/20 pt-[max(6px,env(safe-area-inset-top))]">
      <div className="flex items-center justify-between px-4 py-2.5 h-14">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5">
          {logoSrc ? (
            <img
              src={logoSrc}
              alt="HAKKIVEDA"
              className="h-8 w-8 object-contain rounded-full border border-[#C5A059]/40 bg-[#07241C]"
              onError={(e) => {
                // If custom logo image fails, fallback to HV gold badge
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-[#C5A059] text-[#0E382C] flex items-center justify-center font-bold text-xs shadow-sm">
              HV
            </div>
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-serif tracking-widest font-bold text-base text-[#FDF8EC] uppercase leading-none">
                HAKKIVEDA
              </span>
              <span className="text-[9px] font-semibold tracking-wider text-[#C5A059] uppercase px-1 py-0.5 rounded bg-[#C5A059]/15 border border-[#C5A059]/30 leading-none">
                APP
              </span>
            </div>
            <span className="text-[10px] text-emerald-200/70 font-sans tracking-tight leading-none mt-0.5">
              108 Sacred Tribal Herbs
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          {/* Search Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="p-2 rounded-full text-emerald-100 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            aria-label="Search remedies"
          >
            <Search className="w-5 h-5 text-emerald-100" />
          </button>

          {/* Notification Button */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="p-2 rounded-full text-emerald-100 hover:text-white hover:bg-white/10 active:scale-95 transition-all relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-emerald-100" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C5A059] ring-2 ring-[#0E382C]" />
          </button>

          {/* Cart Button with Quantity Badge */}
          <button
            type="button"
            onClick={onOpenCart}
            className="p-2 rounded-full text-white bg-[#C5A059]/20 hover:bg-[#C5A059]/30 border border-[#C5A059]/40 active:scale-95 transition-all relative ml-1"
            aria-label={`Cart with ${cartItemCount} items`}
          >
            <ShoppingBag className="w-5 h-5 text-[#FDF8EC]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C5A059] text-[#0E382C] font-extrabold text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-md border border-[#0E382C]">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
