import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ScrollToTopButton: React.FC = () => {
  const { mobileNavConfig, footerConfig, playSound } = useStore();
  const [isVisible, setIsVisible] = useState(false);
  const [pathname, setPathname] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  const isBottomNavEnabled = mobileNavConfig?.bottomNavEnabled === true;
  const isScrollEnabled = footerConfig?.mobileFooter?.scrollToTopEnabled !== false;

  useEffect(() => {
    const handleScroll = () => {
      // Show button after user scrolls past 350px
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const handleLocation = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('popstate', handleLocation);
    window.addEventListener('hashchange', handleLocation);
    window.addEventListener('app:navigate', handleLocation);

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', handleLocation);
      window.removeEventListener('hashchange', handleLocation);
      window.removeEventListener('app:navigate', handleLocation);
    };
  }, []);

  if (!isScrollEnabled) {
    return null;
  }

  // Determine active mobile context for bottom positioning (stacked directly above WhatsApp)
  const isReviewsPage = pathname.endsWith('/reviews');
  const isPdp = pathname.startsWith('/products/') && !isReviewsPage;
  const isCategory =
    pathname === '/hair-care' ||
    pathname === '/skin-care' ||
    pathname === '/tribal-wellness' ||
    pathname.startsWith('/categories/');

  // Mobile bottom offset: sits at bottom-left baseline, matching bottom spacing
  const mobileBottomStyle = isReviewsPage
    ? 'calc(18px + env(safe-area-inset-bottom, 0px))'
    : isPdp
    ? 'calc(76px + env(safe-area-inset-bottom, 0px))'
    : isCategory
    ? 'calc(62px + env(safe-area-inset-bottom, 0px))'
    : isBottomNavEnabled
    ? 'calc(68px + env(safe-area-inset-bottom, 0px))'
    : 'calc(18px + env(safe-area-inset-bottom, 0px))';

  const handleScrollToTop = () => {
    playSound?.('nav_click');
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      id="scroll-to-top-button"
      onClick={handleScrollToTop}
      style={{ bottom: mobileBottomStyle }}
      className={`fixed left-3.5 sm:left-auto sm:right-8 sm:!bottom-24 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FAF7F2] hover:bg-white text-[#0F2E22] border border-[#D8CDAF] hover:border-[#C5A059] shadow-xl shadow-[#0F2E22]/15 flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Back to top"
      title="Scroll to top"
    >
      <ArrowUp className="w-5 h-5 text-[#0F2E22] stroke-[2.4]" />
    </button>
  );
};
