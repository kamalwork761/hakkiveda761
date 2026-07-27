import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X, Sparkles, Globe, ChevronDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { HakkivedaWordmark } from './HakkivedaWordmark';
import { MobileBottomNav } from './MobileBottomNav';
import { SoundToggle } from './SoundToggle';

interface HeaderProps {
  selectedCategory?: string;
  onSelectCategory?: (catName: string) => void;
}

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
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Premium Top Running Announcement Bar */}
      {showBar && (
        <div
          style={{
            backgroundColor: siteSettings?.announcementBgColor || '#C8A24A',
            color: siteSettings?.announcementTextColor || '#0B3D2E',
          }}
          className="relative py-1.5 px-2 text-xs font-bold font-sans uppercase tracking-[0.18em] overflow-hidden z-50 border-b border-[#0B3D2E]/10 flex items-center justify-between"
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
              className="flex items-center gap-1.5 bg-[#0B3D2E] text-[#C8A24A] px-2.5 py-1 rounded text-[11px] font-semibold hover:bg-[#072a20] transition-colors shadow-sm border border-[#C8A24A]/30 active:scale-95"
              id="country-selector-btn"
              title="Change Country"
            >
              <span className="text-sm leading-none">{selectedCountry.flag}</span>
              <span>{selectedCountry.name}</span>
              <ChevronDown className="w-3 h-3 text-[#C8A24A]" />
            </button>
          </div>
        </div>
      )}

      {/* Main Header Container */}
      <div className="bg-[#0B3D2E]/95 backdrop-blur-md border-b border-[#C8A24A]/20 px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between shadow-2xl relative">
        {/* Brand Logo & Wordmark */}
        <a href="#" className="flex items-center gap-2 sm:gap-3.5 group min-w-0 shrink">
          <div className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-[#C8A24A] flex items-center justify-center rotate-45 group-hover:bg-[#C8A24A] transition-all duration-500 shadow-lg shrink-0">
            <span className="-rotate-45 font-bold font-brand text-[#C8A24A] group-hover:text-[#0B3D2E] text-xs sm:text-sm tracking-tighter">
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

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 font-sans text-[11px] uppercase tracking-[0.2em] font-medium text-slate-200">
          <div
            className="relative"
            onMouseEnter={() => setIsCategoryMenuOpen(true)}
            onMouseLeave={() => setIsCategoryMenuOpen(false)}
          >
            <button
              onClick={() => {
                playSound('nav_click');
                if (onSelectCategory) onSelectCategory('ALL');
                setIsCategoryMenuOpen(!isCategoryMenuOpen);
              }}
              className="hover:text-[#C8A24A] transition-colors py-2 border-b border-transparent hover:border-[#C8A24A] flex items-center gap-1.5"
            >
              <span>Collections</span>
              <ChevronDown className={`w-3 h-3 text-[#C8A24A] transition-transform duration-200 ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Collections Category Dropdown */}
            {isCategoryMenuOpen && (
              <div className="absolute left-0 top-full pt-1 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="bg-[#072a20] border border-[#C8A24A]/40 rounded-xl shadow-2xl p-2 font-sans normal-case">
                  <div className="text-[10px] uppercase font-bold text-[#C8A24A] px-3 py-1.5 tracking-widest border-b border-white/10 flex items-center justify-between">
                    <span>Herbal Categories</span>
                    <span className="text-[9px] opacity-70">Instant Filter</span>
                  </div>
                  
                  <button
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory('ALL');
                      setIsCategoryMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedCategory === 'ALL' ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-[#0B3D2E] hover:text-[#C8A24A]'
                    }`}
                  >
                    <span>All Formulations</span>
                    <span className="text-[10px] opacity-80">View All</span>
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        if (onSelectCategory) onSelectCategory(cat.name);
                        setIsCategoryMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        selectedCategory === cat.name ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold' : 'text-slate-200 hover:bg-[#0B3D2E] hover:text-[#C8A24A]'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/30 border border-white/10 font-bold text-[#C8A24A]">
                        {cat.itemCount}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <a
            href="#brand-story"
            onClick={() => playSound('nav_click')}
            className="hover:text-[#C8A24A] transition-colors py-1 border-b border-transparent hover:border-[#C8A24A]"
          >
            Tribal Heritage
          </a>
          <button
            onClick={() => {
              playSound('cta_click');
              setIsQuizOpen(true);
            }}
            className="flex items-center gap-1.5 text-[#C8A24A] font-semibold hover:text-white transition-colors py-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Hair Quiz</span>
          </button>
          <a
            href="#before-after"
            onClick={() => playSound('nav_click')}
            className="hover:text-[#C8A24A] transition-colors py-1 border-b border-transparent hover:border-[#C8A24A]"
          >
            Results
          </a>
          <button
            onClick={() => {
              playSound('nav_click');
              setIsB2BModalOpen(true);
            }}
            className="hover:text-[#C8A24A] transition-colors py-1 border-b border-transparent hover:border-[#C8A24A]"
          >
            B2B / Export
          </button>
          <a
            href="#blogs"
            onClick={() => playSound('nav_click')}
            className="hover:text-[#C8A24A] transition-colors py-1 border-b border-transparent hover:border-[#C8A24A]"
          >
            Journal
          </a>
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* Quick Search */}
          <div className="relative hidden md:block w-44 lg:w-56">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A24A]" />
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
                className="w-full bg-black/30 border border-[#C8A24A]/30 rounded-full pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#C8A24A] transition-all"
              />
            </div>

            {/* Live Search Autocomplete Popup */}
            {isSearchFocused && filteredProducts.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-[#072a20] border border-[#C8A24A]/40 rounded-xl shadow-2xl p-2 z-50">
                <div className="text-[10px] uppercase font-bold text-[#C8A24A] px-2 py-1 tracking-wider border-b border-white/10">
                  Matching Herbal Formulations
                </div>
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      playSound('nav_click');
                      openQuickView(prod);
                    }}
                    className="flex items-center gap-3 p-2 hover:bg-[#0B3D2E] rounded-lg cursor-pointer transition-colors"
                  >
                    <img src={prod.image} alt={prod.name} className="w-10 h-10 object-contain rounded bg-black/30 p-0.5 border border-white/10" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{prod.name}</h4>
                      <p className="text-[10px] text-[#C8A24A]">{prod.subtitle}</p>
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
            className="text-slate-200 hover:text-[#C8A24A] transition-colors p-1 relative"
            title={currentUser ? `Account: ${currentUser.name}` : 'Login / Register'}
            id="user-account-btn"
          >
            <User className="w-5 h-5" />
            {currentUser && <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#C8A24A]"></span>}
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={() => {
              playSound('menu_toggle');
              setIsWishlistOpen(true);
            }}
            className="text-slate-200 hover:text-[#C8A24A] transition-colors p-1 relative"
            title="Wishlist"
            id="wishlist-btn"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#C8A24A] text-[#0B3D2E] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
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
            className="text-[#C8A24A] hover:text-white transition-colors p-1 relative flex items-center gap-1.5 bg-black/30 border border-[#C8A24A]/40 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full"
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
            className="lg:hidden text-slate-200 hover:text-[#C8A24A] p-1.5 rounded-lg bg-black/20 border border-[#C8A24A]/30 active:scale-95 transition-all"
            id="mobile-menu-btn"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-[#C8A24A]" /> : <Menu className="w-5 h-5 text-[#C8A24A]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#072a20] border-b border-[#C8A24A]/30 px-5 py-5 space-y-3 font-sans text-xs uppercase tracking-widest shadow-2xl animate-in slide-in-from-top duration-300 z-50 relative">
          {/* Mobile Search Box */}
          <div className="relative pb-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#C8A24A]" />
            <input
              type="text"
              placeholder="Search products or herbs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#041a13] border border-[#C8A24A]/30 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#C8A24A]"
            />
            {filteredProducts.length > 0 && searchQuery.trim() && (
              <div className="mt-2 bg-[#0B3D2E] border border-[#C8A24A]/30 rounded-lg p-2 max-h-48 overflow-y-auto space-y-2">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openQuickView(prod);
                    }}
                    className="flex items-center gap-2 p-1.5 hover:bg-[#072a20] rounded cursor-pointer"
                  >
                    <img src={prod.image} alt={prod.name} className="w-8 h-8 object-contain rounded bg-black/30 p-0.5 border border-white/10" />
                    <div>
                      <div className="font-bold text-white text-[11px] normal-case">{prod.name}</div>
                      <div className="text-[9px] text-[#C8A24A] normal-case">{prod.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Collections & Categories Section */}
          <div className="border-b border-white/10 pb-2">
            <div className="flex items-center justify-between py-1 text-[#C8A24A] font-bold text-[10px] tracking-widest uppercase">
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
                    ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold'
                    : 'bg-[#0B3D2E] text-slate-200 hover:text-[#C8A24A]'
                }`}
              >
                All Formulations
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory(cat.name);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left p-2 rounded-lg text-[11px] font-semibold transition-all line-clamp-1 ${
                    selectedCategory === cat.name
                      ? 'bg-[#C8A24A] text-[#0B3D2E] font-bold'
                      : 'bg-[#0B3D2E] text-slate-200 hover:text-[#C8A24A]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <a
            href="#brand-story"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-[#C8A24A] border-b border-white/10"
          >
            Tribal Heritage
          </a>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsQuizOpen(true);
            }}
            className="w-full text-left py-2 text-[#C8A24A] font-bold flex items-center gap-2 border-b border-white/10"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Hair Quiz</span>
          </button>
          <a
            href="#before-after"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-[#C8A24A] border-b border-white/10"
          >
            Before & After
          </a>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsB2BModalOpen(true);
            }}
            className="w-full text-left py-2 text-slate-200 hover:text-[#C8A24A] border-b border-white/10"
          >
            B2B / Export Enquiries
          </button>
          <a
            href="#blogs"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-[#C8A24A]"
          >
            Journal & Guides
          </a>
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
