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
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

      {/* Main Header Container */}
      <div className="bg-[var(--brand-primary-dark)]/95 backdrop-blur-md border-b border-[var(--brand-gold)]/20 px-3 sm:px-8 py-2 sm:py-2.5 flex items-center justify-between shadow-2xl relative">
        {/* Brand Logo & Wordmark (Navigates to "/" Homepage on click) */}
        <a
          href="/"
          onClick={handleHomeClick}
          className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0 shrink cursor-pointer transition-opacity duration-200 hover:opacity-90 active:scale-[0.99]"
          title="Return to Homepage"
          id="header-home-logo-link"
        >
          {uploadedLogoUrl && !logoLoadError ? (
            <div className="flex items-center justify-center shrink-0">
              <picture className="flex items-center">
                {mobileUploadedLogoUrl !== uploadedLogoUrl && (
                  <source media="(max-width: 639px)" srcSet={mobileUploadedLogoUrl} />
                )}
                <img
                  src={uploadedLogoUrl}
                  alt={brandIdentity?.brandName || siteSettings?.companyName || 'HAKKIVEDA Header Logo'}
                  className="h-[44px] max-h-[44px] max-w-[44px] sm:h-[50px] sm:max-h-[50px] sm:max-w-[50px] lg:h-[58px] lg:max-h-[58px] lg:max-w-[58px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  style={{ objectFit: 'contain' }}
                  onError={() => setLogoLoadError(true)}
                  loading="eager"
                  decoding="async"
                />
              </picture>
            </div>
          ) : (
            <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 border-2 border-[var(--brand-gold,#D4AF37)] flex items-center justify-center rotate-45 group-hover:bg-[var(--brand-gold,#D4AF37)] transition-all duration-500 shadow-lg shrink-0">
              <span className="-rotate-45 font-bold font-brand text-[var(--brand-gold,#D4AF37)] group-hover:text-[#123F2A] text-xs sm:text-sm lg:text-base tracking-tighter">
                {brandIdentity?.brandInitials || siteSettings?.logoInitials || 'HV'}
              </span>
            </div>
          )}

          <div className="flex flex-col justify-center min-w-0">
            <HakkivedaWordmark size="md" theme="dark-header" />
            <span className="text-[7px] sm:text-[9px] tracking-[0.16em] sm:tracking-[0.28em] font-sans text-[#123F2A] font-semibold uppercase -mt-0.5 truncate drop-shadow-xs">
              {brandIdentity?.brandSubtitle || siteSettings?.logoSubtext || 'Hakki-Pikki Tribe & Ayurveda'}
            </span>
          </div>
        </a>

        {/* Dynamic Desktop Navigation Links */}
        {headerSettings.showMenu && (
          <nav className="hidden lg:flex items-center gap-6 font-sans text-[11px] uppercase tracking-[0.2em] font-medium text-slate-200">
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

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4 shrink-0">
          {/* Quick Search */}
          <div className="relative hidden md:block w-44 lg:w-56">
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
                      window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <div className="hidden sm:block">
            <SoundToggle variant="header" />
          </div>

          {/* User Account */}
          <button
            onClick={() => {
              playSound('nav_click');
              setIsAuthModalOpen(true);
            }}
            className="text-slate-200 hover:text-[var(--brand-gold)] transition-colors p-1 relative"
            title={currentUser ? `Account: ${currentUser.name}` : 'Login / Register'}
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
            className="text-[var(--brand-gold)] hover:text-white transition-colors p-1 relative flex items-center gap-1.5 bg-black/30 border border-[var(--brand-gold)]/40 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full"
            id="cart-btn"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-bold">{cartItemsCount}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => {
              playSound('menu_toggle');
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="lg:hidden text-slate-200 hover:text-[var(--brand-gold)] p-1.5 rounded-lg bg-black/20 border border-[var(--brand-gold)]/30 active:scale-95 transition-all"
            id="mobile-menu-btn"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-[var(--brand-gold)]" /> : <Menu className="w-5 h-5 text-[var(--brand-gold)]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[var(--brand-primary-deeper)] border-b border-[var(--brand-gold)]/30 px-5 py-5 space-y-3 font-sans text-xs uppercase tracking-widest shadow-2xl animate-in slide-in-from-top duration-300 z-50 relative">
          {/* Mobile Search Box */}
          <div className="relative pb-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[var(--brand-gold)]" />
            <input
              type="text"
              placeholder="Search products or herbs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--brand-primary-deeper)] border border-[var(--brand-gold)]/30 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[var(--brand-gold)]"
            />
            {filteredProducts.length > 0 && searchQuery.trim() && (
              <div className="mt-2 bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/30 rounded-lg p-2 max-h-48 overflow-y-auto space-y-2">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setSearchQuery('');
                      window.history.pushState({}, '', getProductUrl(prod));
                      window.dispatchEvent(new PopStateEvent('popstate'));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2 p-1.5 hover:bg-[var(--brand-primary-deeper)] rounded cursor-pointer"
                  >
                    <img src={prod.image} alt={prod.name} className="w-8 h-8 object-contain rounded bg-black/30 p-0.5 border border-white/10" />
                    <div>
                      <div className="font-bold text-white text-[11px] normal-case">{prod.name}</div>
                      <div className="text-[9px] text-[var(--brand-gold)] normal-case">{prod.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Collections & Categories Section */}
          <div className="border-b border-white/10 pb-2">
            <div className="flex items-center justify-between py-1 text-[var(--brand-gold)] font-bold text-[10px] tracking-widest uppercase">
              <span>Botanical Categories</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-1.5">
              <button
                onClick={() => {
                  if (onSelectCategory) onSelectCategory('ALL');
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left p-2 rounded-lg text-[11px] font-semibold transition-all ${
                  selectedCategory === 'ALL'
                    ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold'
                    : 'bg-[var(--brand-primary-dark)] text-slate-200 hover:text-[var(--brand-gold)]'
                }`}
              >
                All Formulations
              </button>
              {categories
                .filter((c) => (c.status || 'ACTIVE') === 'ACTIVE' && c.showInNav !== false)
                .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory(cat.name);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left p-2 rounded-lg text-[11px] font-semibold transition-all line-clamp-1 ${
                    selectedCategory === cat.name
                      ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold'
                      : 'bg-[var(--brand-primary-dark)] text-slate-200 hover:text-[var(--brand-gold)]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Mobile Nav Links */}
          <div className="space-y-2 pt-1">
            {activeNavLinks
              .filter((l) => l.showOnMobile !== false && !l.parentId)
              .map((link) => {
                const subLinks = getSubNavLinks(link.id);

                return (
                  <div key={link.id} className="space-y-1">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleNavClick(link);
                      }}
                      className="w-full text-left py-2 px-3 bg-[var(--brand-primary-dark)] rounded-xl text-slate-200 hover:text-[var(--brand-gold)] font-semibold text-xs flex items-center justify-between border border-white/5"
                    >
                      <div className="flex items-center gap-2">
                        {renderNavIcon(link.icon, 'w-4 h-4 text-[var(--brand-gold)]')}
                        <span>{link.label}</span>
                      </div>
                      {renderBadgeTag(link.badge, link.badgeCustomText)}
                    </button>

                    {/* Sub Links in Mobile */}
                    {subLinks.length > 0 && (
                      <div className="ml-4 space-y-1 pl-2 border-l border-[var(--brand-gold)]/30">
                        {subLinks.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              handleNavClick(sub);
                            }}
                            className="w-full text-left py-1.5 px-2 text-xs text-slate-300 hover:text-[var(--brand-gold)] flex items-center justify-between"
                          >
                            <span>{sub.label}</span>
                            {renderBadgeTag(sub.badge, sub.badgeCustomText)}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Mega Menu Columns in Mobile */}
                    {link.megaMenu?.enabled && link.megaMenu.columns && link.megaMenu.columns.length > 0 && (
                      <div className="ml-3 space-y-2.5 pl-3 border-l border-[var(--brand-gold)]/30 pt-1 pb-1">
                        {link.megaMenu.columns
                          .filter((c) => c.enabled !== false)
                          .map((col) => (
                            <div key={col.id} className="space-y-1">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-gold)]">
                                {col.title}
                              </div>
                              <div className="space-y-1 pl-1">
                                {(col.links || [])
                                  .filter((l) => l.enabled !== false)
                                  .map((lnk, lIdx) => {
                                    const isValid = Boolean(lnk.url && lnk.url.trim() && lnk.url !== '#');
                                    return (
                                      <button
                                        key={lIdx}
                                        onClick={() => {
                                          if (isValid) {
                                            handleMegaMenuLinkClick(lnk.url, lnk.label);
                                          }
                                        }}
                                        className={`w-full text-left py-1 px-1.5 text-xs flex items-center justify-between rounded ${
                                          isValid
                                            ? 'text-slate-300 hover:text-[var(--brand-gold)] hover:bg-white/5'
                                            : 'text-slate-500 opacity-60 cursor-not-allowed'
                                        }`}
                                      >
                                        <span>{lnk.label}</span>
                                        {renderBadgeTag(lnk.badge as any, lnk.badgeCustomText)}
                                      </button>
                                    );
                                  })}
                              </div>
                            </div>
                          ))}

                        {link.megaMenu.featuredImageUrl && link.megaMenu.featuredImageUrl.trim() !== '' && (
                          <div
                            onClick={() => {
                              if (link.megaMenu?.featuredImageLink) {
                                handleMegaMenuLinkClick(link.megaMenu.featuredImageLink, link.megaMenu.featuredImageTitle);
                              }
                            }}
                            className={`mt-2 bg-[var(--brand-primary-deeper)] p-2 rounded-lg border border-white/10 flex items-center gap-2.5 ${
                              link.megaMenu?.featuredImageLink ? 'cursor-pointer' : ''
                            }`}
                          >
                            <img
                              src={link.megaMenu.featuredImageUrl}
                              alt={link.megaMenu.featuredImageTitle || 'Featured'}
                              className="w-12 h-12 rounded object-cover border border-white/10 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-slate-100 truncate">
                                {link.megaMenu.featuredImageTitle || 'Featured Formulation'}
                              </div>
                              {link.megaMenu.featuredImageSubtitle && (
                                <div className="text-[10px] text-slate-400 truncate">
                                  {link.megaMenu.featuredImageSubtitle}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Floating Mobile Bottom Navigation Bar (Homepage / General views only) */}
      {!isSpecialBarPage && (
        <MobileBottomNav
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />
      )}
    </header>
  );
};
