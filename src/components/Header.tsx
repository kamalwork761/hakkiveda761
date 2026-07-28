import React, { useState } from 'react';
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

  // Nav click action
  const handleNavClick = (link: NavLink) => {
    playSound('nav_click');
    if (link.id) trackNavClick(link.id);

    if (link.isModal || link.linkType === 'QUIZ') {
      setIsQuizOpen(true);
      return;
    }
    if (link.linkType === 'B2B') {
      setIsB2BModalOpen(true);
      return;
    }
    if (link.openInNewTab && link.url && link.url !== '#') {
      window.open(link.url, '_blank');
      return;
    }
    if (link.url) {
      if (link.url.startsWith('#category-')) {
        const catName = link.url.replace('#category-', '');
        if (onSelectCategory) onSelectCategory(catName);
      } else if (link.url === '#products') {
        if (onSelectCategory) onSelectCategory('ALL');
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
      <div className="bg-[var(--brand-primary-dark)]/95 backdrop-blur-md border-b border-[var(--brand-gold)]/20 px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between shadow-2xl relative">
        {/* Brand Logo & Wordmark */}
        <a href="#" className="flex items-center gap-2 sm:gap-3.5 group min-w-0 shrink">
          <div className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-[var(--brand-gold)] flex items-center justify-center rotate-45 group-hover:bg-[var(--brand-gold)] transition-all duration-500 shadow-lg shrink-0">
            <span className="-rotate-45 font-bold font-brand text-[var(--brand-gold)] group-hover:text-[var(--brand-primary-dark)] text-xs sm:text-sm tracking-tighter">
              HV
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <HakkivedaWordmark size="sm" className="sm:hidden" theme="dark-header" />
            <HakkivedaWordmark size="md" className="hidden sm:inline-flex" theme="dark-header" />
            <span className="text-[7px] sm:text-[9px] tracking-[0.16em] sm:tracking-[0.28em] font-sans text-slate-300 opacity-80 uppercase -mt-0.5 truncate">
              Hakki-Pikki Tribe & Ayurveda
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
                      if (!item.url || item.url === '#') e.preventDefault();
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
                  {hasMegaMenu && isHovered && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 w-[680px] z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="bg-[var(--brand-primary-deeper)] border border-[var(--brand-gold)]/40 rounded-xl shadow-2xl p-5 text-left grid grid-cols-3 gap-5 normal-case font-sans">
                        {item.megaMenu?.columns.map((col) => (
                          <div key={col.id} className="space-y-2">
                            <h4 className="text-[11px] font-bold text-[var(--brand-gold)] uppercase tracking-wider border-b border-white/10 pb-1 flex items-center justify-between">
                              <span>{col.title}</span>
                            </h4>
                            <ul className="space-y-1.5 text-xs text-slate-200">
                              {col.links.map((link, lIdx) => (
                                <li key={lIdx}>
                                  <a
                                    href={link.url}
                                    onClick={() => playSound('nav_click')}
                                    className="hover:text-[var(--brand-gold)] flex items-center justify-between py-0.5 transition-colors"
                                  >
                                    <span>{link.label}</span>
                                    {renderBadgeTag(link.badge as any)}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}

                        {item.megaMenu?.featuredImageUrl && (
                          <div className="bg-[var(--brand-primary-dark)] p-3 rounded-xl border border-white/10 flex flex-col justify-between">
                            <img
                              src={item.megaMenu.featuredImageUrl}
                              alt="Featured"
                              className="w-full h-28 object-cover rounded-lg mb-2 border border-white/10"
                            />
                            <div>
                              <div className="font-bold text-xs text-slate-100 line-clamp-1">
                                {item.megaMenu.featuredImageTitle || 'Featured formulation'}
                              </div>
                              <p className="text-[10px] text-slate-300 mt-0.5 line-clamp-1">
                                {item.megaMenu.featuredImageSubtitle}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

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
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
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
                      openQuickView(prod);
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

          {/* Sound Toggle Button */}
          <SoundToggle variant="header" />

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
                      openQuickView(prod);
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
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Floating Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />
    </header>
  );
};
