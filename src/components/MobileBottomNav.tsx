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

  const handleHomeClick = () => {
    playSound('nav_click');
    const pathname = window.location.pathname;
    if (pathname === '/' || pathname === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleShopClick = () => {
    playSound('nav_click');
    const pathname = window.location.pathname;
    if (pathname === '/' || pathname === '') {
      const el = document.getElementById('products');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    } else {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      setTimeout(() => {
        const el = document.getElementById('products');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleQuizClick = () => {
    playSound('nav_click');
    setIsQuizOpen(true);
  };

  const handleSavedClick = () => {
    playSound('nav_click');
    setIsWishlistOpen(true);
  };

  const handleCartClick = () => {
    playSound('nav_click');
    setIsCartOpen(true);
  };

  const handleMenuClick = () => {
    playSound('nav_click');
    onToggleMobileMenu();
  };

  return (
    <div
      id="homepage-mobile-bottom-nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--brand-primary-deep)]/95 backdrop-blur-lg border-t border-[var(--brand-gold)]/30 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] px-2 py-2 pb-[max(8px,env(safe-area-inset-bottom))] font-sans transition-all duration-200"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          type="button"
          onClick={handleHomeClick}
          className="flex flex-col items-center justify-center gap-1 text-slate-300 hover:text-[var(--brand-gold)] active:scale-95 transition-all p-1 cursor-pointer"
          aria-label="Home"
        >
          <Home className="w-5 h-5 text-slate-200" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Home</span>
        </button>

        {/* Collections / Shop */}
        <button
          type="button"
          onClick={handleShopClick}
          className="flex flex-col items-center justify-center gap-1 text-slate-300 hover:text-[var(--brand-gold)] active:scale-95 transition-all p-1 cursor-pointer"
          aria-label="Shop Catalog"
        >
          <Grid className="w-5 h-5 text-slate-200" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Shop</span>
        </button>

        {/* AI Quiz Highlight Button */}
        <button
          type="button"
          onClick={handleQuizClick}
          className="flex flex-col items-center justify-center gap-1 text-[var(--brand-gold)] hover:text-white active:scale-95 transition-all p-1 relative cursor-pointer"
          aria-label="AI Hair Quiz"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--brand-gold)]/20 border border-[var(--brand-gold)] flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-[var(--brand-gold)] animate-pulse" />
          </div>
          <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--brand-gold)]">AI Quiz</span>
        </button>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleSavedClick}
          className="flex flex-col items-center justify-center gap-1 text-slate-300 hover:text-[var(--brand-gold)] active:scale-95 transition-all p-1 relative cursor-pointer"
          aria-label="Saved Items"
        >
          <div className="relative">
            <Heart className="w-5 h-5 text-slate-200" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[9px] uppercase tracking-wider font-semibold">Saved</span>
        </button>

        {/* Cart */}
        <button
          type="button"
          onClick={handleCartClick}
          className="flex flex-col items-center justify-center gap-1 text-slate-300 hover:text-[var(--brand-gold)] active:scale-95 transition-all p-1 relative cursor-pointer"
          aria-label="View Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[var(--brand-gold)]" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </div>
          <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--brand-gold)]">Cart</span>
        </button>

        {/* Menu Drawer */}
        <button
          type="button"
          onClick={handleMenuClick}
          className={`flex flex-col items-center justify-center gap-1 active:scale-95 transition-all p-1 cursor-pointer ${
            isMobileMenuOpen ? 'text-[var(--brand-gold)]' : 'text-slate-300 hover:text-[var(--brand-gold)]'
          }`}
          aria-label="Open Menu"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Menu</span>
        </button>
      </div>
    </div>
  );
};
