import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Sparkles,
  Globe,
  ChevronDown,
  ChevronRight,
  Leaf,
  Shield,
  Flame,
  Briefcase,
  MessageSquare,
  Tag,
  HelpCircle,
  Star,
  Phone,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { NavLink } from '../types/store';
import { HakkivedaWordmark } from './HakkivedaWordmark';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileNavDrawer } from './MobileNavDrawer';
import { SoundToggle } from './SoundToggle';
import { getProductUrl } from '../utils/productUtils';

interface HeaderProps {
  selectedCategory?: string;
  onSelectCategory?: (catName: string) => void;
}

const NAV_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  Leaf,
  Shield,
  Flame,
  Briefcase,
  MessageSquare,
  Tag,
  Heart,
  Globe,
  User,
  HelpCircle,
  Star,
  Phone,
  ExternalLink,
  ShoppingBag,
};

export const Header: React.FC<HeaderProps> = ({ selectedCategory, onSelectCategory }) => {
  const {
    siteSettings,
    brandIdentity,
    selectedCountry,
    setIsCountryModalOpen,
    cartItemsCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAuthModalOpen,
    openAuthModal,
    setIsB2BModalOpen,
    setIsQuizOpen,
    currentUser,
    products,
    categories,
    openQuickView,
    playSound,
    navLinks,
    headerLayoutSettings,
    trackNavClick,
    mobileNavConfig,
  } = useStore();

  const isBottomNavEnabled = mobileNavConfig?.bottomNavEnabled === true;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);
  const [currentPathname, setCurrentPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPathname(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('app:navigate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('app:navigate', handlePopState);
    };
  }, []);

  // Determine if this is a Product Detail Page or Category Listing Page
  const isPdpPage = currentPathname.startsWith('/products/');
  const isCategoryListingPage =
    currentPathname === '/hair-care' ||
    currentPathname === '/skin-care' ||
    currentPathname === '/tribal-wellness' ||
    currentPathname.startsWith('/categories/');
  const isSpecialBarPage = isPdpPage || isCategoryListingPage;

  // Preferred uploaded HEADER HV LOGO from Admin Brand Manager / Site Settings
  const uploadedLogoUrl =
    brandIdentity?.headerHvLogo ||
    siteSettings?.headerHvLogo ||
    siteSettings?.logoImageUrl ||
    brandIdentity?.mainLogoLight ||
    brandIdentity?.mainLogoDark ||
    brandIdentity?.transparentLogo ||
    brandIdentity?.svgLogo ||
    brandIdentity?.mobileLogo ||
    '';

  const mobileUploadedLogoUrl =
    brandIdentity?.mobileLogo ||
    brandIdentity?.headerHvLogo ||
    siteSettings?.headerHvLogo ||
    uploadedLogoUrl;

  useEffect(() => {
    setLogoLoadError(false);
  }, [uploadedLogoUrl]);

  const [hoveredNavId, setHoveredNavId] = useState<string | null>(null);

  const headerSettings = headerLayoutSettings || {
    showLogo: true,
    showSearch: true,
    showCountrySelector: true,
    showWishlist: true,
    showAccount: true,
    showCart: true,
    showMenu: true,
    hoverStyle: 'gold_line',
    headerLayout: 'standard',
  };

  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const textToDisplay = siteSettings?.announcementText || 'Worldwide Express Shipping • 100% Authentic 42 Mountain Herbs Formula';
  const showBar = siteSettings?.announcementActive ?? true;

  // Filter Active Nav Links according to visibility, roles, country, publish schedule
  const activeNavLinks = (Array.isArray(navLinks) ? navLinks : [])
    .filter((link) => {
      if (link.visible === false) return false;
      if (link.status === 'DRAFT') return false;
      if (link.status === 'SCHEDULED') {
        const today = new Date().toISOString().split('T')[0];
        if (link.startDate && link.startDate > today) return false;
        if (link.endDate && link.endDate < today) return false;
      }
      if (link.allowedCountries && link.allowedCountries.length > 0) {
        if (selectedCountry?.code && !link.allowedCountries.includes(selectedCountry.code)) {
          return false;
        }
      }
      if (link.userVisibility === 'ADMIN' && currentUser?.role !== 'ADMIN') return false;
      if (link.userVisibility === 'CUSTOMER' && !currentUser) return false;
      if (link.userVisibility === 'GUEST' && currentUser) return false;
      return true;
    })
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const rootNavLinks = activeNavLinks.filter((l) => !l.parentId && l.showOnDesktop !== false);
  const getSubNavLinks = (parentId: string) => activeNavLinks.filter((l) => l.parentId === parentId);

  // Home click action (opens homepage "/" cleanly without full-page reload)
  const handleHomeClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    playSound('nav_click');
    setIsMobileMenuOpen(false);
    setIsCategoryMenuOpen(false);
    setIsSearchFocused(false);
    if (onSelectCategory) {
      onSelectCategory('ALL', false);
    }
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mega Menu Link Click Action
  const handleMegaMenuLinkClick = (url?: string, label?: string, openInNewTab?: boolean) => {
    setHoveredNavId(null);
    setIsMobileMenuOpen(false);
    playSound('nav_click');

    if (!url || url === '#' || !url.trim()) {
      return;
    }

    const targetUrl = url.trim();
    const urlLower = targetUrl.toLowerCase();
    const labelLower = (label || '').toLowerCase();

    // 1. External URLs
    if (openInNewTab || targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // 2. AI Quiz
    if (urlLower === '#ai-quiz' || urlLower === '/quiz' || labelLower.includes('quiz')) {
      setIsQuizOpen(true);
      return;
    }

    // 3. B2B routes
    if (urlLower === '/b2b' || urlLower === '/b2b-enquiry' || urlLower === '#b2b' || urlLower === '#b2b-export' || labelLower.includes('b2b') || labelLower.includes('wholesale')) {
      window.history.pushState({}, '', '/b2b-enquiry');
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 4. Internal SPA routes (/hair-care, /skin-care, /tribal-wellness, /products/:slug, /search..., /categories/...)
    if (targetUrl.startsWith('/')) {
      window.history.pushState({}, '', targetUrl);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 5. Category hash navigation (#category-X or #category=X)
    if (targetUrl.startsWith('#category-') || targetUrl.startsWith('#category=')) {
      const catName = targetUrl.replace('#category-', '').replace('#category=', '');
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', `/?category=${encodeURIComponent(catName)}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
      } else {
        if (onSelectCategory) onSelectCategory(catName);
      }
      const el = document.getElementById('products') || document.getElementById('categories');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    // 6. Section Anchors (#products, #brand-story, #tribal-heritage, #reviews, #blogs, etc.)
    if (targetUrl.startsWith('#')) {
      const targetId = targetUrl.replace('#', '');
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', `/${targetUrl}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (targetId === 'products' || targetId === 'categories') {
          if (onSelectCategory) onSelectCategory('ALL');
        }
      }
      return;
    }
  };

  // Nav click action
  const handleNavClick = (link: NavLink) => {
    playSound('nav_click');
    if (link.id) trackNavClick(link.id);

    const labelLower = (link.label || '').toLowerCase().trim();
    const urlLower = (link.url || '').toLowerCase().trim();

    // 1. Check Tribal Heritage FIRST (must ONLY scroll to Tribal Heritage section and NEVER trigger quiz/modals)
    if (
      link.id === 'nav-2' ||
      labelLower.includes('heritage') ||
      labelLower.includes('tribal lore') ||
      urlLower === '#brand-story' ||
      urlLower === '#tribal-heritage' ||
      urlLower === '/tribal-heritage'
    ) {
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/#brand-story');
        window.dispatchEvent(new PopStateEvent('popstate'));
        setTimeout(() => {
          const el = document.getElementById('tribal-heritage') || document.getElementById('brand-story');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        const el = document.getElementById('tribal-heritage') || document.getElementById('brand-story');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      return;
    }

    // 2. Check B2B links
    if (
      link.linkType === 'B2B' ||
      link.modalType === 'B2B' ||
      urlLower === '#b2b' ||
      urlLower === '#b2b-export' ||
      urlLower === '/b2b-enquiry' ||
      urlLower === '/b2b' ||
      labelLower.includes('b2b') ||
      labelLower.includes('export')
    ) {
      if (urlLower === '/b2b-enquiry' || urlLower === '/b2b' || link.linkType === 'B2B') {
        window.history.pushState({}, '', '/b2b-enquiry');
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const b2bEl = document.getElementById('b2b') || document.getElementById('b2b-export');
      if (b2bEl) {
        b2bEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.history.pushState({}, '', '/b2b-enquiry');
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // 3. Check AI Hair Quiz links ONLY (must trigger quiz modal ONLY when customer clicks quiz)
    if (
      link.linkType === 'QUIZ' ||
      link.modalType === 'QUIZ' ||
      urlLower === '#ai-quiz' ||
      labelLower.includes('hair quiz') ||
      labelLower.includes('ai quiz')
    ) {
      setIsQuizOpen(true);
      return;
    }

    // 4. Check general modal flag
    if (link.isModal) {
      if ((link.modalType as string) === 'B2B') {
        setIsB2BModalOpen(true);
        return;
      }
      if ((link.modalType as string) === 'QUIZ' || urlLower === '#ai-quiz') {
        setIsQuizOpen(true);
        return;
      }
    }

    // 5. Open in new tab
    if (link.openInNewTab && link.url && link.url !== '#') {
      window.open(link.url, '_blank', 'noopener,noreferrer');
      return;
    }

    // 6. Direct internal SPA Routes (/hair-care, /skin-care, /tribal-wellness, /products/:slug, etc.)
    if (link.url && link.url.startsWith('/')) {
      window.history.pushState({}, '', link.url);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 7. Hash navigation & categories
    if (link.url) {
      if (link.url.startsWith('#category-')) {
        const catName = link.url.replace('#category-', '');
        if (window.location.pathname !== '/') {
          window.history.pushState({}, '', `/?category=${encodeURIComponent(catName)}`);
          window.dispatchEvent(new PopStateEvent('popstate'));
        } else {
          if (onSelectCategory) onSelectCategory(catName);
        }
        const el = document.getElementById('products');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (link.url === '#products' || link.url === '#categories' || link.url === '#collections') {
        if (window.location.pathname !== '/') {
          window.history.pushState({}, '', '/#products');
          window.dispatchEvent(new PopStateEvent('popstate'));
          setTimeout(() => {
            const el = document.getElementById('categories') || document.getElementById('collections') || document.getElementById('products');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        } else {
          const el = document.getElementById('categories') || document.getElementById('collections') || document.getElementById('products');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (onSelectCategory) onSelectCategory('ALL');
        }
      } else if (link.url.startsWith('#')) {
        const targetId = link.url.replace('#', '');
        if (window.location.pathname !== '/') {
          window.history.pushState({}, '', `/${link.url}`);
          window.dispatchEvent(new PopStateEvent('popstate'));
          setTimeout(() => {
            const el = document.getElementById(targetId);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        } else {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  // Render Lucide Icon helper
  const renderNavIcon = (iconName?: string, className: string = 'w-3.5 h-3.5') => {
    if (!iconName) return null;
    const IconComponent = NAV_ICON_MAP[iconName];
    if (IconComponent) return <IconComponent className={className} />;
    return <Sparkles className={className} />;
  };

  // Render Badge helper
  const renderBadgeTag = (badge?: NavLink['badge'], customText?: string) => {
    if (!badge || badge === 'NONE') return null;
    let bg = 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]';
    let text = badge;
    if (badge === 'HOT') bg = 'bg-rose-500 text-white animate-pulse';
    if (badge === 'NEW') bg = 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]';
    if (badge === 'SALE') bg = 'bg-emerald-500 text-white';
    if (badge === 'B2B') bg = 'bg-amber-500 text-slate-950 font-bold';
    if (badge === 'CUSTOM' && customText) text = customText as any;

    return (
      <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded shadow-sm ${bg}`}>
        {text}
      </span>
    );
  };

  // Hover Class Helper
  const getHoverStyleClass = () => {
    const style = headerSettings.hoverStyle || 'gold_line';
    if (style === 'gold_line') {
      return 'hover:text-[var(--brand-gold)] border-b-2 border-transparent hover:border-[var(--brand-gold)]';
    }
    if (style === 'underline') {
      return 'hover:underline hover:text-[var(--brand-gold)]';
    }
    if (style === 'glow') {
      return 'hover:text-[var(--brand-gold)] hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]';
    }
    return 'hover:text-[var(--brand-gold)]';
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Premium Top Running Announcement Bar */}
      {showBar && (
        <div
          style={{
            backgroundColor: siteSettings?.announcementBgColor || 'var(--brand-gold)',
            color: siteSettings?.announcementTextColor || 'var(--brand-primary-dark)',
          }}
          className="relative py-1.5 px-2 text-xs font-bold font-sans uppercase tracking-[0.18em] overflow-hidden z-50 border-b border-[var(--brand-primary-dark)]/10 flex items-center justify-between"
        >
          {/* Continuous Running Ticker Track */}
          <div className="overflow-hidden flex-1 relative flex items-center py-0.5">
            <div className="animate-marquee whitespace-nowrap flex items-center">
              <div className="flex items-center gap-8 px-4 shrink-0">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0" />
                  <span>{textToDisplay}</span>
                </span>
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0" />
                  <span>{textToDisplay}</span>
                </span>
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0" />
                  <span>{textToDisplay}</span>
                </span>
              </div>
              <div className="flex items-center gap-8 px-4 shrink-0">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0" />
                  <span>{textToDisplay}</span>
                </span>
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0" />
                  <span>{textToDisplay}</span>
                </span>
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0" />
                  <span>{textToDisplay}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Global Country & Currency Switcher Pinned Right */}
          <div className="relative shrink-0 z-10 pl-3 pr-2 flex items-center gap-3">
            <span className="hidden lg:inline text-[10px] tracking-wider uppercase opacity-80 font-bold">Country:</span>
            <button
              onClick={() => setIsCountryModalOpen(true)}
              className="flex items-center gap-1.5 bg-[var(--brand-primary-dark)] text-[var(--brand-gold)] px-2.5 py-1 rounded text-[11px] font-semibold hover:bg-[var(--brand-primary-deeper)] transition-colors shadow-sm border border-[var(--brand-gold)]/30 active:scale-95"
              id="country-selector-btn"
              title="Change Country"
            >
              <span className="text-sm leading-none">{selectedCountry.flag}</span>
              <span>{selectedCountry.name}</span>
              <ChevronDown className="w-3 h-3 text-[var(--brand-gold)]" />
            </button>
          </div>
        </div>
      )}

      {/* NEW MOBILE HEADER CONTAINER (lg:hidden) */}
      <div className="flex lg:hidden bg-[var(--brand-primary-dark)]/95 backdrop-blur-md border-b border-[var(--brand-gold)]/20 px-2.5 sm:px-4 py-2 items-center justify-between shadow-2xl relative z-40">
        {/* Left Area: Hamburger Menu + Compact Round Search */}
        <div className="flex items-center gap-1.5 xs:gap-2 shrink-0 z-10">
          <button
            onClick={() => {
              playSound('menu_toggle');
              setIsMobileSearchOpen(false);
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="w-8.5 h-8.5 xs:w-9 xs:h-9 flex items-center justify-center rounded-full bg-black/25 border border-[var(--brand-gold)]/30 text-slate-200 hover:text-[var(--brand-gold)] active:scale-95 transition-all shadow-xs"
            id="mobile-menu-btn"
            aria-label="Toggle navigation menu"
            title="Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-4.5 h-4.5 text-[var(--brand-gold)]" />
            ) : (
              <Menu className="w-4.5 h-4.5 text-[var(--brand-gold)]" />
            )}
          </button>

          <button
            onClick={() => {
              playSound('search');
              setIsMobileMenuOpen(false);
              setIsMobileSearchOpen(!isMobileSearchOpen);
            }}
            className={`w-8.5 h-8.5 xs:w-9 xs:h-9 flex items-center justify-center rounded-full border transition-all active:scale-95 shadow-xs ${
              isMobileSearchOpen
                ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] border-[var(--brand-gold)] shadow-md'
                : 'bg-black/25 border-[var(--brand-gold)]/30 text-slate-200 hover:text-[var(--brand-gold)]'
            }`}
            id="mobile-search-toggle-btn"
            aria-label="Toggle search"
            title="Search products"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Center Area: HV Logo + Animated HAKKIVEDA Word Branding */}
        <div className="flex-1 flex items-center justify-center min-w-0 px-1">
          <a
            href="/"
            onClick={handleHomeClick}
            className="flex items-center gap-1.5 xs:gap-2 group cursor-pointer transition-opacity duration-200 hover:opacity-90 active:scale-[0.99] min-w-0 max-w-full justify-center"
            title="Return to Homepage"
            id="mobile-header-home-logo-link"
          >
            {uploadedLogoUrl && !logoLoadError ? (
              <div className="flex items-center justify-center shrink-0">
                <img
                  src={mobileUploadedLogoUrl || uploadedLogoUrl}
                  alt={brandIdentity?.brandName || siteSettings?.companyName || 'HAKKIVEDA Logo'}
                  className="h-7 max-h-7 max-w-[28px] xs:h-8 xs:max-h-8 xs:max-w-[32px] w-auto object-contain transition-transform duration-300"
                  onError={() => setLogoLoadError(true)}
                  loading="eager"
                  decoding="async"
                />
              </div>
            ) : (
              <div className="w-6.5 h-6.5 xs:w-7.5 xs:h-7.5 border border-[var(--brand-gold,#D4AF37)] flex items-center justify-center rotate-45 group-hover:bg-[var(--brand-gold,#D4AF37)] transition-all duration-300 shadow-sm shrink-0">
                <span className="-rotate-45 font-bold font-brand text-[var(--brand-gold,#D4AF37)] group-hover:text-[#123F2A] text-[9px] xs:text-[10px] tracking-tighter">
                  {brandIdentity?.brandInitials || siteSettings?.logoInitials || 'HV'}
                </span>
              </div>
            )}

            <div className="flex flex-col justify-center min-w-0 text-left">
              <HakkivedaWordmark size="sm" theme="dark-header" className="max-w-[105px] xs:max-w-[125px] sm:max-w-[145px]" />
              <span className="text-[6px] xs:text-[7px] tracking-[0.14em] xs:tracking-[0.18em] font-sans text-[var(--brand-gold)]/85 font-semibold uppercase -mt-0.5 truncate drop-shadow-xs">
                {brandIdentity?.brandSubtitle || siteSettings?.logoSubtext || 'Hakki-Pikki Tribe & Ayurveda'}
              </span>
            </div>
          </a>
        </div>

        {/* Right Area: Cart Icon + Account Icon (Wishlist removed from top mobile header) */}
        <div className="flex items-center gap-1.5 xs:gap-2 shrink-0 z-10">
          {/* Cart Icon with Counter Badge */}
          <button
            onClick={() => {
              playSound('menu_toggle');
              setIsCartOpen(true);
            }}
            className="w-8.5 h-8.5 xs:w-9 xs:h-9 flex items-center justify-center rounded-full bg-black/25 border border-[var(--brand-gold)]/30 text-[var(--brand-gold)] hover:text-white transition-colors active:scale-95 relative shadow-xs"
            id="mobile-cart-btn"
            aria-label={`Cart (${cartItemsCount} items)`}
            title="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-[9px] font-black rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center shadow-md">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* User Account */}
          <button
            onClick={() => {
              playSound('nav_click');
              if (currentUser) {
                setIsAuthModalOpen(true);
              } else {
                openAuthModal('SIGN_IN');
              }
            }}
            className="w-8.5 h-8.5 xs:w-9 xs:h-9 flex items-center justify-center rounded-full bg-black/25 border border-[var(--brand-gold)]/30 text-slate-200 hover:text-[var(--brand-gold)] transition-colors active:scale-95 relative shadow-xs"
            title={currentUser ? `Account: ${currentUser.name}` : 'Sign In'}
            id="mobile-user-account-btn"
            aria-label="User Account"
          >
            <User className="w-4 h-4" />
            {currentUser && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--brand-gold)] shadow-xs"></span>}
          </button>
        </div>
      </div>

      {/* MOBILE COMPACT SEARCH EXPANDABLE BAR (lg:hidden) */}
      {isMobileSearchOpen && (
        <div className="lg:hidden bg-[var(--brand-primary-deeper)] border-b border-[var(--brand-gold)]/30 px-3 py-2.5 shadow-2xl animate-in slide-in-from-top duration-200 z-50 relative">
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--brand-gold)]" />
              <input
                type="text"
                autoFocus
                placeholder="Search products, herbs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-[var(--brand-gold)]/40 rounded-full pl-8 pr-8 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[var(--brand-gold)] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                  aria-label="Clear search text"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setIsMobileSearchOpen(false);
                setSearchQuery('');
              }}
              className="text-[11px] font-bold text-[var(--brand-gold)] uppercase tracking-wider px-2 py-1 rounded hover:bg-white/5 shrink-0"
            >
              Cancel
            </button>
          </div>

          {/* Live Mobile Search Autocomplete Results */}
          {filteredProducts.length > 0 && searchQuery.trim() && (
            <div className="mt-2 bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/30 rounded-xl p-2 max-h-60 overflow-y-auto space-y-1.5 shadow-2xl">
              <div className="text-[9px] uppercase font-bold text-[var(--brand-gold)] px-2 py-0.5 tracking-wider border-b border-white/10 flex items-center justify-between">
                <span>Matching Formulations</span>
                <span className="text-slate-400">{filteredProducts.length} results</span>
              </div>
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    playSound('nav_click');
                    setIsMobileSearchOpen(false);
                    setSearchQuery('');
                    window.history.pushState({}, '', getProductUrl(prod));
                    window.dispatchEvent(new PopStateEvent('popstate'));
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  className="flex items-center gap-2.5 p-2 hover:bg-[var(--brand-primary-deeper)] rounded-lg cursor-pointer transition-colors"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-9 h-9 object-contain rounded bg-black/30 p-0.5 border border-white/10 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white text-xs truncate">{prod.name}</div>
                    <div className="text-[10px] text-[var(--brand-gold)] truncate">{prod.subtitle}</div>
                  </div>
                  <div className="text-xs font-bold text-white shrink-0">
                    ₹{prod.price}
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchQuery.trim() && filteredProducts.length === 0 && (
            <div className="mt-2 text-center py-3 text-xs text-slate-400">
              No herbal formulations found for "{searchQuery}"
            </div>
          )}
        </div>
      )}

      {/* DESKTOP HEADER CONTAINER (hidden lg:flex) */}
      <div className="hidden lg:flex bg-[var(--brand-primary-dark)]/95 backdrop-blur-md border-b border-[var(--brand-gold)]/20 px-8 py-2.5 items-center justify-between shadow-2xl relative">
        {/* Brand Logo & Wordmark (Navigates to "/" Homepage on click) */}
        <a
          href="/"
          onClick={handleHomeClick}
          className="flex items-center gap-3.5 group min-w-0 shrink cursor-pointer transition-opacity duration-200 hover:opacity-90 active:scale-[0.99]"
          title="Return to Homepage"
          id="header-home-logo-link"
        >
          {uploadedLogoUrl && !logoLoadError ? (
            <div className="flex items-center justify-center shrink-0">
              <img
                src={uploadedLogoUrl}
                alt={brandIdentity?.brandName || siteSettings?.companyName || 'HAKKIVEDA Header Logo'}
                className="h-[58px] max-h-[58px] max-w-[58px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                style={{ objectFit: 'contain' }}
                onError={() => setLogoLoadError(true)}
                loading="eager"
                decoding="async"
              />
            </div>
          ) : (
            <div className="w-12 h-12 border-2 border-[var(--brand-gold,#D4AF37)] flex items-center justify-center rotate-45 group-hover:bg-[var(--brand-gold,#D4AF37)] transition-all duration-500 shadow-lg shrink-0">
              <span className="-rotate-45 font-bold font-brand text-[var(--brand-gold,#D4AF37)] group-hover:text-[#123F2A] text-base tracking-tighter">
                {brandIdentity?.brandInitials || siteSettings?.logoInitials || 'HV'}
              </span>
            </div>
          )}

          <div className="flex flex-col justify-center min-w-0">
            <HakkivedaWordmark size="md" theme="dark-header" />
            <span className="text-[9px] tracking-[0.28em] font-sans text-[#123F2A] font-semibold uppercase -mt-0.5 truncate drop-shadow-xs">
              {brandIdentity?.brandSubtitle || siteSettings?.logoSubtext || 'Hakki-Pikki Tribe & Ayurveda'}
            </span>
          </div>
        </a>

        {/* Dynamic Desktop Navigation Links */}
        {headerSettings.showMenu && (
          <nav className="flex items-center gap-6 font-sans text-[11px] uppercase tracking-[0.2em] font-medium text-slate-200">
            {rootNavLinks.map((item) => {
              const subLinks = getSubNavLinks(item.id);
              const hasMegaMenu = item.megaMenu?.enabled;
              const isHovered = hoveredNavId === item.id;

              return (
                <div
                  key={item.id}
                  className="relative py-2"
                  onMouseEnter={() => setHoveredNavId(item.id)}
                  onMouseLeave={() => setHoveredNavId(null)}
                >
                  <a
                    href={item.url || '#'}
                    onClick={(e) => {
                      if (!item.url || item.url === '#' || item.url.startsWith('#')) e.preventDefault();
                      handleNavClick(item);
                    }}
                    className={`flex items-center gap-1.5 transition-colors py-1 ${getHoverStyleClass()}`}
                  >
                    {renderNavIcon(item.icon, 'w-3.5 h-3.5 text-[var(--brand-gold)]')}
                    <span>{item.label}</span>
                    {renderBadgeTag(item.badge, item.badgeCustomText)}
                    {(subLinks.length > 0 || hasMegaMenu) && (
                      <ChevronDown className="w-3 h-3 text-[var(--brand-gold)] transition-transform duration-200" />
                    )}
                  </a>

                  {/* Mega Menu Dropdown */}
                  {hasMegaMenu && isHovered && (() => {
                    const hasPromo = Boolean(item.megaMenu?.featuredImageUrl && item.megaMenu.featuredImageUrl.trim() !== '');
                    const activeCols = (item.megaMenu?.columns || []).filter((c) => c.enabled !== false);
                    const colCount = Math.max(1, activeCols.length);

                    return (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div
                          className={`bg-[var(--brand-primary-deeper)] border border-[var(--brand-gold)]/40 rounded-xl shadow-2xl p-5 text-left normal-case font-sans ${
                            hasPromo ? 'w-[720px] grid grid-cols-12 gap-5' : 'w-auto min-w-[360px] max-w-[680px]'
                          }`}
                        >
                          {/* Content Columns Area */}
                          <div
                            className={
                              hasPromo
                                ? `col-span-8 grid grid-cols-${colCount === 1 ? '1' : '2'} gap-5`
                                : `grid grid-cols-${colCount === 1 ? '1' : colCount === 3 ? '3' : '2'} gap-6`
                            }
                          >
                            {activeCols.map((col) => (
                              <div key={col.id} className="space-y-2.5">
                                <h4 className="text-[11px] font-bold text-[var(--brand-gold)] uppercase tracking-wider border-b border-white/10 pb-1.5 flex items-center justify-between">
                                  <span>{col.title}</span>
                                </h4>
                                <ul className="space-y-1.5 text-xs text-slate-200">
                                  {(col.links || [])
                                    .filter((l) => l.enabled !== false)
                                    .map((link, lIdx) => {
                                      const isValid = Boolean(link.url && link.url.trim() && link.url !== '#');
                                      return (
                                        <li key={lIdx}>
                                          <a
                                            href={link.url || '#'}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              if (isValid) {
                                                handleMegaMenuLinkClick(link.url, link.label);
                                              }
                                            }}
                                            className={`flex items-center justify-between py-1 transition-all rounded px-1.5 -mx-1.5 ${
                                              isValid
                                                ? 'hover:text-[var(--brand-gold)] hover:bg-white/5 cursor-pointer text-slate-200'
                                                : 'text-slate-500 cursor-not-allowed opacity-60'
                                            }`}
                                          >
                                            <span className="font-medium">{link.label}</span>
                                            {renderBadgeTag(link.badge as any, link.badgeCustomText)}
                                          </a>
                                        </li>
                                      );
                                    })}
                                </ul>
                              </div>
                            ))}
                          </div>

                          {/* Promotional Image / Card Area (ONLY rendered if promo image is present and non-empty) */}
                          {hasPromo && (
                            <div
                              onClick={() => {
                                if (item.megaMenu?.featuredImageLink) {
                                  handleMegaMenuLinkClick(item.megaMenu.featuredImageLink, item.megaMenu.featuredImageTitle);
                                }
                              }}
                              className={`col-span-4 bg-[var(--brand-primary-dark)] p-3 rounded-xl border border-white/10 flex flex-col justify-between ${
                                item.megaMenu?.featuredImageLink ? 'cursor-pointer hover:border-[var(--brand-gold)]/40 transition-colors group' : ''
                              }`}
                            >
                              <div className="overflow-hidden rounded-lg mb-2 border border-white/10">
                                <img
                                  src={item.megaMenu!.featuredImageUrl}
                                  alt={item.megaMenu?.featuredImageTitle || 'Featured'}
                                  className="w-full h-28 object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                              <div>
                                <div className="font-bold text-xs text-slate-100 line-clamp-1 group-hover:text-[var(--brand-gold)] transition-colors">
                                  {item.megaMenu?.featuredImageTitle || 'Featured Formulation'}
                                </div>
                                {item.megaMenu?.featuredImageSubtitle && (
                                  <p className="text-[10px] text-slate-300 mt-0.5 line-clamp-2">
                                    {item.megaMenu.featuredImageSubtitle}
                                  </p>
                                )}
                                {item.megaMenu?.featuredImageLink && (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-[var(--brand-gold)] font-semibold mt-2 group-hover:underline">
                                    Explore Now →
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Standard Multi-Level Sub-Menu Dropdown */}
                  {!hasMegaMenu && subLinks.length > 0 && isHovered && (
                    <div className="absolute left-0 top-full pt-1 w-56 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="bg-[var(--brand-primary-deeper)] border border-[var(--brand-gold)]/40 rounded-xl shadow-2xl p-2 font-sans normal-case">
                        {subLinks.map((sub) => (
                          <a
                            key={sub.id}
                            href={sub.url}
                            onClick={() => handleNavClick(sub)}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:bg-[var(--brand-primary-dark)] hover:text-[var(--brand-gold)] transition-colors flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              {renderNavIcon(sub.icon, 'w-3.5 h-3.5 text-[var(--brand-gold)]')}
                              <span>{sub.label}</span>
                            </div>
                            {renderBadgeTag(sub.badge, sub.badgeCustomText)}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        )}

        {/* Desktop Header Right Actions */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Quick Search */}
          <div className="relative w-44 lg:w-56">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--brand-gold)]" />
              <input
                type="text"
                placeholder="Search products, herbs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  playSound('search');
                  setIsSearchFocused(true);
                }}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full bg-black/30 border border-[var(--brand-gold)]/30 rounded-full pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[var(--brand-gold)] transition-all"
              />
            </div>

            {/* Live Search Autocomplete Popup */}
            {isSearchFocused && filteredProducts.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-[var(--brand-primary-deeper)] border border-[var(--brand-gold)]/40 rounded-xl shadow-2xl p-2 z-50">
                <div className="text-[10px] uppercase font-bold text-[var(--brand-gold)] px-2 py-1 tracking-wider border-b border-white/10">
                  Matching Herbal Formulations
                </div>
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      playSound('nav_click');
                      setIsSearchFocused(false);
                      setSearchQuery('');
                      window.history.pushState({}, '', getProductUrl(prod));
                      window.dispatchEvent(new PopStateEvent('popstate'));
                      window.scrollTo({ top: 0, behavior: 'instant' });
                    }}
                    className="flex items-center gap-3 p-2 hover:bg-[var(--brand-primary-dark)] rounded-lg cursor-pointer transition-colors"
                  >
                    <img src={prod.image} alt={prod.name} className="w-10 h-10 object-contain rounded bg-black/30 p-0.5 border border-white/10" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{prod.name}</h4>
                      <p className="text-[10px] text-[var(--brand-gold)]">{prod.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sound Toggle Button (Desktop/Tablet) */}
          <SoundToggle variant="header" />

          {/* User Account */}
          <button
            onClick={() => {
              playSound('nav_click');
              if (currentUser) {
                setIsAuthModalOpen(true);
              } else {
                openAuthModal('SIGN_IN');
              }
            }}
            className="text-slate-200 hover:text-[var(--brand-gold)] transition-colors p-1 relative"
            title={currentUser ? `Account: ${currentUser.name}` : 'Sign In'}
            id="user-account-btn"
          >
            <User className="w-5 h-5" />
            {currentUser && <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[var(--brand-gold)]"></span>}
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={() => {
              playSound('menu_toggle');
              setIsWishlistOpen(true);
            }}
            className="text-slate-200 hover:text-[var(--brand-gold)] transition-colors p-1 relative"
            title="Wishlist"
            id="wishlist-btn"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => {
              playSound('menu_toggle');
              setIsCartOpen(true);
            }}
            className="text-[var(--brand-gold)] hover:text-white transition-colors p-1 relative flex items-center gap-1.5 bg-black/30 border border-[var(--brand-gold)]/40 px-3 py-1.5 rounded-full"
            id="cart-btn"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-bold">{cartItemsCount}</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer (Phase 2 Redesign) */}
      <MobileNavDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />

      {/* Floating Mobile Bottom Navigation Bar (Homepage / General views only - When Enabled in Admin) */}
      {!isSpecialBarPage && isBottomNavEnabled && (
        <MobileBottomNav
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />
      )}
    </header>
  );
};
