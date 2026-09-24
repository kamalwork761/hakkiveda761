import React, { useState, useEffect } from 'react';
import { Home, ShoppingBag, Sparkles, Package, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface MobileBottomNavProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentPath = window.location.pathname, onNavigate }) => {
  const {
    currentUser,
    isAuthModalOpen,
    openAuthModal,
    setIsAuthModalOpen,
    isCheckoutOpen,
    playSound,
  } = useStore();

  const [pathname, setPathname] = useState(currentPath);

  useEffect(() => {
    const handleLocationChange = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('app:navigate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('app:navigate', handleLocationChange);
    };
  }, []);

  // Never render on checkout / payment flow or admin pages
  if (isCheckoutOpen || pathname.startsWith('/admin')) {
    return null;
  }

  const navigateInternal = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new Event('app:navigate'));
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handleHomeClick = () => {
    playSound('nav_click');
    if (isAuthModalOpen) {
      setIsAuthModalOpen(false);
    }
    if (pathname === '/' || pathname === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigateInternal('/');
    }
  };

  const handleShopClick = () => {
    playSound('nav_click');
    if (isAuthModalOpen) {
      setIsAuthModalOpen(false);
    }
    if (pathname === '/' || pathname === '') {
      const el = document.getElementById('products') || document.getElementById('featured-products');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 450, behavior: 'smooth' });
      }
    } else {
      navigateInternal('/');
      setTimeout(() => {
        const el = document.getElementById('products') || document.getElementById('featured-products');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 120);
    }
  };

  const handleHairAnalysisClick = () => {
    playSound('nav_click');
    if (isAuthModalOpen) {
      setIsAuthModalOpen(false);
    }
    navigateInternal('/hair-analysis');
  };

  const handleOrdersClick = () => {
    playSound('nav_click');
    if (currentUser) {
      window.dispatchEvent(new CustomEvent('open:customer-portal', { detail: { tab: 'orders' } }));
    } else {
      // Prompt user to sign in to view their orders
      openAuthModal('SIGN_IN');
      // Set portal tab for once they are signed in
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('open:customer-portal', { detail: { tab: 'orders' } }));
      }, 50);
    }
  };

  const handleAccountClick = () => {
    playSound('nav_click');
    if (currentUser) {
      window.dispatchEvent(new CustomEvent('open:customer-portal', { detail: { tab: 'profile' } }));
    } else {
      openAuthModal('SIGN_IN');
    }
  };

  // Determine active states
  const isHomeActive = !isAuthModalOpen && (pathname === '/' || pathname === '') && !window.location.hash.includes('products');
  const isShopActive = !isAuthModalOpen && (
    pathname === '/hair-care' ||
    pathname === '/skin-care' ||
    pathname === '/tribal-wellness' ||
    pathname.startsWith('/categories/') ||
    (pathname === '/' && window.location.hash.includes('products'))
  );
  const isHairAnalysisActive = !isAuthModalOpen && (
    pathname === '/hair-analysis' ||
    pathname === '/hair-quiz' ||
    pathname === '/root-analysis' ||
    pathname === '/consultation'
  );
  const isOrdersActive = isAuthModalOpen && currentUser;
  const isAccountActive = isAuthModalOpen && !isOrdersActive;

  return (
    <nav
      id="hakkiveda-mobile-app-nav"
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#072418]/95 backdrop-blur-xl border-t border-[#D4AF37]/35 shadow-[0_-8px_30px_rgba(0,0,0,0.65)] px-2 pt-1.5 pb-[max(8px,env(safe-area-inset-bottom,8px))] font-sans select-none transition-all duration-300"
    >
      <div className="grid grid-cols-5 items-center justify-items-center max-w-md mx-auto">
        {/* 1. Home */}
        <button
          type="button"
          onClick={handleHomeClick}
          className={`w-full flex flex-col items-center justify-center py-1 transition-all active:scale-95 cursor-pointer ${
            isHomeActive ? 'text-[#D4AF37]' : 'text-slate-300 hover:text-white'
          }`}
          aria-label="Home"
        >
          <div className="relative flex items-center justify-center">
            <Home className={`w-5 h-5 transition-transform duration-200 ${isHomeActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.7]'}`} />
            {isHomeActive && (
              <span className="absolute -top-1 w-1 h-1 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]" />
            )}
          </div>
          <span className={`text-[10px] tracking-wide mt-1 font-medium ${isHomeActive ? 'font-bold text-[#D4AF37]' : ''}`}>
            Home
          </span>
        </button>

        {/* 2. Shop */}
        <button
          type="button"
          onClick={handleShopClick}
          className={`w-full flex flex-col items-center justify-center py-1 transition-all active:scale-95 cursor-pointer ${
            isShopActive ? 'text-[#D4AF37]' : 'text-slate-300 hover:text-white'
          }`}
          aria-label="Shop Catalog"
        >
          <div className="relative flex items-center justify-center">
            <ShoppingBag className={`w-5 h-5 transition-transform duration-200 ${isShopActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.7]'}`} />
            {isShopActive && (
              <span className="absolute -top-1 w-1 h-1 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]" />
            )}
          </div>
          <span className={`text-[10px] tracking-wide mt-1 font-medium ${isShopActive ? 'font-bold text-[#D4AF37]' : ''}`}>
            Shop
          </span>
        </button>

        {/* 3. Hair Analysis */}
        <button
          type="button"
          onClick={handleHairAnalysisClick}
          className={`w-full flex flex-col items-center justify-center py-1 transition-all active:scale-95 cursor-pointer ${
            isHairAnalysisActive ? 'text-[#D4AF37]' : 'text-[#D4AF37]/90 hover:text-[#D4AF37]'
          }`}
          aria-label="Hair Analysis"
        >
          <div className="relative flex items-center justify-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              isHairAnalysisActive
                ? 'bg-[#D4AF37] text-[#082214] shadow-[0_0_10px_rgba(212,175,55,0.6)]'
                : 'bg-[#D4AF37]/20 border border-[#D4AF37]/60 text-[#D4AF37]'
            }`}>
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap ${isHairAnalysisActive ? 'font-bold text-[#D4AF37]' : 'font-semibold text-[#D4AF37]'}`}>
            Analysis
          </span>
        </button>

        {/* 4. Orders */}
        <button
          type="button"
          onClick={handleOrdersClick}
          className={`w-full flex flex-col items-center justify-center py-1 transition-all active:scale-95 cursor-pointer ${
            isOrdersActive ? 'text-[#D4AF37]' : 'text-slate-300 hover:text-white'
          }`}
          aria-label="My Orders"
        >
          <div className="relative flex items-center justify-center">
            <Package className={`w-5 h-5 transition-transform duration-200 ${isOrdersActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.7]'}`} />
            {isOrdersActive && (
              <span className="absolute -top-1 w-1 h-1 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]" />
            )}
          </div>
          <span className={`text-[10px] tracking-wide mt-1 font-medium ${isOrdersActive ? 'font-bold text-[#D4AF37]' : ''}`}>
            Orders
          </span>
        </button>

        {/* 5. Account */}
        <button
          type="button"
          onClick={handleAccountClick}
          className={`w-full flex flex-col items-center justify-center py-1 transition-all active:scale-95 cursor-pointer ${
            isAccountActive ? 'text-[#D4AF37]' : 'text-slate-300 hover:text-white'
          }`}
          aria-label="Customer Account"
        >
          <div className="relative flex items-center justify-center">
            <User className={`w-5 h-5 transition-transform duration-200 ${isAccountActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.7]'}`} />
            {currentUser && (
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-[#D4AF37] border border-[#072418]" />
            )}
            {isAccountActive && !currentUser && (
              <span className="absolute -top-1 w-1 h-1 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]" />
            )}
          </div>
          <span className={`text-[10px] tracking-wide mt-1 font-medium ${isAccountActive ? 'font-bold text-[#D4AF37]' : ''}`}>
            Account
          </span>
        </button>
      </div>
    </nav>
  );
};
