import React from 'react';
import { Home, Grid, Sparkles, Heart, ShoppingBag, Menu, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface MobileBottomNavProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onToggleMobileMenu,
  isMobileMenuOpen,
}) => {
  const { cartItemsCount, wishlist, setIsCartOpen, setIsWishlistOpen, setIsQuizOpen, playSound } = useStore();

  const handleScrollTo = (id: string) => {
    playSound('nav_click');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#072a20]/95 backdrop-blur-lg border-t border-[#C8A24A]/30 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] px-2 py-2 font-sans">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={() => handleScrollTo('hero')}
          className="flex flex-col items-center justify-center gap-1 text-slate-300 hover:text-[#C8A24A] active:scale-95 transition-all p-1"
          aria-label="Home"
        >
          <Home className="w-5 h-5 text-slate-200" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Home</span>
        </button>

        {/* Collections */}
        <button
          onClick={() => handleScrollTo('products')}
          className="flex flex-col items-center justify-center gap-1 text-slate-300 hover:text-[#C8A24A] active:scale-95 transition-all p-1"
          aria-label="Collections"
        >
          <Grid className="w-5 h-5 text-slate-200" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Shop</span>
        </button>

        {/* AI Quiz Highlight Button */}
        <button
          onClick={() => setIsQuizOpen(true)}
          className="flex flex-col items-center justify-center gap-1 text-[#C8A24A] hover:text-white active:scale-95 transition-all p-1 relative"
          aria-label="AI Hair Quiz"
        >
          <div className="w-8 h-8 rounded-full bg-[#C8A24A]/20 border border-[#C8A24A] flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-[#C8A24A] animate-pulse" />
          </div>
          <span className="text-[9px] uppercase tracking-wider font-bold text-[#C8A24A]">AI Quiz</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setIsWishlistOpen(true)}
          className="flex flex-col items-center justify-center gap-1 text-slate-300 hover:text-[#C8A24A] active:scale-95 transition-all p-1 relative"
          aria-label="Wishlist"
        >
          <div className="relative">
            <Heart className="w-5 h-5 text-slate-200" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#C8A24A] text-[#0B3D2E] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[9px] uppercase tracking-wider font-semibold">Saved</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center gap-1 text-slate-300 hover:text-[#C8A24A] active:scale-95 transition-all p-1 relative"
          aria-label="Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#C8A24A]" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#C8A24A] text-[#0B3D2E] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </div>
          <span className="text-[9px] uppercase tracking-wider font-bold text-[#C8A24A]">Cart</span>
        </button>

        {/* Menu Drawer */}
        <button
          onClick={onToggleMobileMenu}
          className={`flex flex-col items-center justify-center gap-1 active:scale-95 transition-all p-1 ${
            isMobileMenuOpen ? 'text-[#C8A24A]' : 'text-slate-300 hover:text-[#C8A24A]'
          }`}
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Menu</span>
        </button>
      </div>
    </div>
  );
};
