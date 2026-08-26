import React, { useState, useEffect } from 'react';
import {
  X,
  Home,
  ChevronDown,
  ChevronRight,
  Heart,
  Facebook,
  Instagram,
  Youtube,
  User,
  LogOut,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Layers,
  ShoppingBag,
  Tag,
  Building2,
  FileText,
  HelpCircle,
  BookOpen,
  Globe,
  Shield,
  Leaf,
  Link as LinkIcon,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Category, MobileNavBadgeType } from '../types/store';
import { HakkivedaWordmark } from './HakkivedaWordmark';
import { INITIAL_MOBILE_NAV_CONFIG } from '../data/initialData';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory?: string;
  onSelectCategory?: (catName: string) => void;
}

const AVAILABLE_ICONS: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Home,
  Layers,
  ShoppingBag,
  Heart,
  Tag,
  Building2,
  FileText,
  HelpCircle,
  Sparkles,
  BookOpen,
  User,
  MessageCircle,
  ExternalLink,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  Shield,
  Leaf,
  Link: LinkIcon,
};

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
}) => {
  const {
    categories,
    currentUser,
    logoutUser,
    wishlist,
    brandIdentity,
    siteSettings,
    mobileNavConfig: storeMobileNavConfig,
    setIsAuthModalOpen,
    openAuthModal,
    setIsWishlistOpen,
    setIsQuizOpen,
    playSound,
  } = useStore();

  const mobileNavConfig = storeMobileNavConfig || INITIAL_MOBILE_NAV_CONFIG;

  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({});

  // Lock body scroll and handle Escape key when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  // Active Categories from admin/store
  const activeCategories = (categories || [])
    .filter((c) => (c.status || 'ACTIVE') === 'ACTIVE' && c.showInNav !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  // Determine top-level categories vs child categories
  const topCategories = activeCategories.filter((cat) => {
    const override = mobileNavConfig?.categorySettings?.categoryOverrides?.[cat.id];
    if (override && override.show === false) return false;

    if (!cat.parentId || cat.parentId === 'null' || cat.parentId === '') {
      return true;
    }
    return !activeCategories.some((p) => p.id === cat.parentId);
  });

  const getSubcategories = (parentId: string): Category[] => {
    return activeCategories.filter((cat) => cat.parentId === parentId);
  };

  // Helper Navigation Handlers
  const handleHomeClick = () => {
    playSound('nav_click');
    onClose();
    const currentPath = window.location.pathname;
    if (currentPath === '/' || currentPath === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    playSound('nav_click');
    onClose();
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    }
    const currentPath = window.location.pathname;
    if (currentPath === '/' || currentPath === '') {
      const el = document.getElementById('products');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.history.pushState(
        {},
        '',
        categoryName === 'ALL'
          ? '/#products'
          : `/?category=${encodeURIComponent(categoryName)}`
      );
      window.dispatchEvent(new PopStateEvent('popstate'));
      setTimeout(() => {
        const el = document.getElementById('products');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 80);
    }
  };

  const handleSectionScrollOrNavigate = (sectionId: string) => {
    playSound('nav_click');
    onClose();
    const currentPath = window.location.pathname;
    if (currentPath === '/' || currentPath === '') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.history.pushState({}, '', `/#${sectionId}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleB2BClick = () => {
    playSound('nav_click');
    onClose();
    window.history.pushState({}, '', '/b2b-enquiry');
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWishlistClick = () => {
    playSound('nav_click');
    onClose();
    setIsWishlistOpen(true);
  };

  const handleQuizClick = () => {
    playSound('nav_click');
    onClose();
    setIsQuizOpen(true);
  };

  const handleSignInClick = () => {
    playSound('nav_click');
    onClose();
    openAuthModal('SIGN_IN');
  };

  const handleRegisterClick = () => {
    playSound('nav_click');
    onClose();
    openAuthModal('CREATE_ACCOUNT');
  };

  const handleAccountClick = () => {
    playSound('nav_click');
    onClose();
    setIsAuthModalOpen(true);
  };

  const handleLogoutClick = () => {
    playSound('nav_click');
    logoutUser();
    onClose();
  };

  const handleGenericRoute = (route?: string) => {
    if (!route) return;
    playSound('nav_click');
    onClose();

    if (route === '/' || route === '') {
      handleHomeClick();
      return;
    }
    if (route === 'modal:wishlist') {
      setIsWishlistOpen(true);
      return;
    }
    if (route === 'modal:quiz') {
      setIsQuizOpen(true);
      return;
    }
    if (route === 'modal:auth') {
      setIsAuthModalOpen(true);
      return;
    }
    if (route.startsWith('/#')) {
      handleSectionScrollOrNavigate(route.substring(2));
      return;
    }
    if (route === '/#products' || route === '/collections') {
      handleCategorySelect('ALL');
      return;
    }
    if (route === '/b2b-enquiry') {
      handleB2BClick();
      return;
    }
    if (route.startsWith('http')) {
      window.open(route, '_blank', 'noopener,noreferrer');
      return;
    }

    // Default internal route navigation
    window.history.pushState({}, '', route);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAccordion = (accordionId: string) => {
    playSound('nav_click');
    setOpenAccordions((prev) => ({
      ...prev,
      [accordionId]: !prev[accordionId],
    }));
  };

  // Badge Style Helper
  const getBadgeStyle = (badgeType?: MobileNavBadgeType) => {
    switch (badgeType) {
      case 'green':
        return 'bg-[#0A5A2A] text-white';
      case 'amber':
        return 'bg-amber-600 text-white';
      case 'red':
        return 'bg-red-600 text-white';
      case 'purple':
        return 'bg-purple-700 text-white';
      case 'gold':
      default:
        return 'bg-[#D4AF37] text-[#123F2A]';
    }
  };

  const renderIcon = (iconName?: string, className: string = 'w-4 h-4 text-[#123F2A]/80') => {
    if (!iconName) return null;
    const IconComp = AVAILABLE_ICONS[iconName] || LinkIcon;
    return <IconComp className={className} />;
  };

  if (!isOpen) return null;

  const authBarConfig = mobileNavConfig?.authBar || INITIAL_MOBILE_NAV_CONFIG.authBar;
  const menuItems = (mobileNavConfig?.menuItems || INITIAL_MOBILE_NAV_CONFIG.menuItems)
    .filter((item) => item.enabled !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const categorySettings = mobileNavConfig?.categorySettings || INITIAL_MOBILE_NAV_CONFIG.categorySettings;
  const socialLinks = (mobileNavConfig?.socialLinks || INITIAL_MOBILE_NAV_CONFIG.socialLinks).filter(
    (s) => s.enabled !== false
  );
  const copyrightText = mobileNavConfig?.copyrightText || '© 2026 HAKKIVEDA';

  return (
    <div
      id="mobile-navigation-drawer-root"
      className="lg:hidden fixed inset-0 z-[999] transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      {/* Translucent Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Navigation Drawer (85% to 90% viewport width) */}
      <aside
        className="fixed inset-y-0 left-0 w-[86vw] max-w-[360px] bg-[#FAF8F4] text-[#123F2A] shadow-2xl flex flex-col z-[1000] animate-in slide-in-from-left duration-300 ease-out font-sans select-none overflow-hidden border-r border-[#E5DEC9]"
      >
        {/* ========================================================= */}
        {/* 1. TOP HEADER BAR: BRANDING + CLOSE BUTTON */}
        {/* ========================================================= */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#E5DEC9] bg-[#F3EFE6] shrink-0">
          <div className="flex items-center gap-2">
            <HakkivedaWordmark size="sm" />
          </div>

          <button
            type="button"
            onClick={() => {
              playSound('nav_click');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#E9E3D3] text-[#123F2A] hover:bg-[#D4AF37] hover:text-[#0B2F20] active:scale-95 transition-all flex items-center justify-center border border-[#D8CDAF] cursor-pointer"
            aria-label="Close navigation menu"
            title="Close menu (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* 2. SIGN IN | REGISTER ROW (ADMIN CONTROLLED) */}
        {/* ========================================================= */}
        {authBarConfig.show !== false && (
          <div className="px-5 py-3 border-b border-[#E5DEC9] bg-[#FAF8F4] shrink-0">
            {!currentUser ? (
              <div className="flex items-center justify-start gap-4 text-xs font-bold uppercase tracking-widest text-[#123F2A]">
                <button
                  type="button"
                  onClick={handleSignInClick}
                  className="hover:text-[#0A5A2A] transition-colors py-1 cursor-pointer"
                  id="mobile-drawer-signin-btn"
                >
                  {authBarConfig.signInText || 'Sign In'}
                </button>
                <span className="text-[#C8BEA7] font-normal select-none">|</span>
                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="hover:text-[#0A5A2A] transition-colors py-1 cursor-pointer"
                  id="mobile-drawer-register-btn"
                >
                  {authBarConfig.registerText || 'Register'}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs font-bold tracking-wider text-[#123F2A]">
                <button
                  type="button"
                  onClick={handleAccountClick}
                  className="flex items-center gap-2 hover:text-[#0A5A2A] transition-colors py-1 cursor-pointer"
                  id="mobile-drawer-account-btn"
                >
                  <div className="w-6 h-6 rounded-full bg-[#0A5A2A] text-white flex items-center justify-center text-[10px] font-bold uppercase">
                    {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                  </div>
                  <span className="truncate max-w-[170px] uppercase font-bold text-[11px]">
                    {currentUser.name || authBarConfig.accountText || 'My Account'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="text-[10px] text-[#7A6E58] hover:text-red-700 transition-colors uppercase font-semibold flex items-center gap-1 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{authBarConfig.logoutText || 'Logout'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. PRIMARY SCROLLABLE NAVIGATION LIST */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#EFE9DC] text-[#123F2A]">
          {menuItems.map((item) => {
            // CATEGORY GROUP (Botanical categories)
            if (item.type === 'CATEGORY_GROUP') {
              if (categorySettings.showCategories === false) return null;

              return (
                <React.Fragment key={item.id}>
                  {topCategories.map((cat) => {
                    const subcategories = getSubcategories(cat.id);
                    const hasSubcategories =
                      subcategories.length > 0 && categorySettings.showSubcategories !== false;
                    const isExpanded = openCategoryId === cat.id;

                    return (
                      <div key={cat.id} className="w-full">
                        {hasSubcategories ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                playSound('nav_click');
                                setOpenCategoryId(isExpanded ? null : cat.id);
                              }}
                              className={`w-full px-5 py-3.5 flex items-center justify-between text-left font-semibold text-[13px] hover:bg-[#F3EFE6] transition-colors cursor-pointer ${
                                isExpanded ? 'bg-[#F3EFE6] text-[#0A5A2A]' : ''
                              }`}
                              aria-expanded={isExpanded}
                            >
                              <span className="truncate pr-2">{cat.name}</span>
                              <ChevronDown
                                className={`w-4 h-4 text-[#7A6E58] transition-transform duration-200 shrink-0 ${
                                  isExpanded ? 'rotate-180 text-[#0A5A2A]' : ''
                                }`}
                              />
                            </button>

                            {/* Subcategory Accordion Content */}
                            {isExpanded && (
                              <div className="bg-[#F4EFE6]/70 border-y border-[#E5DEC9] py-1 pl-7 pr-4 space-y-0.5 text-xs">
                                <button
                                  type="button"
                                  onClick={() => handleCategorySelect(cat.name)}
                                  className="w-full text-left py-2.5 px-2 text-[#0A5A2A] font-bold hover:text-[#063819] transition-colors flex items-center justify-between cursor-pointer"
                                >
                                  <span>View All {cat.name}</span>
                                  <ChevronRight className="w-3.5 h-3.5 text-[#0A5A2A]" />
                                </button>
                                {subcategories.map((sub) => (
                                  <button
                                    key={sub.id}
                                    type="button"
                                    onClick={() => handleCategorySelect(sub.name)}
                                    className="w-full text-left py-2 px-2 text-[#2C3E2D] hover:text-[#0A5A2A] font-medium transition-colors cursor-pointer"
                                  >
                                    {sub.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleCategorySelect(cat.name)}
                            className={`w-full px-5 py-3.5 flex items-center justify-between text-left font-semibold text-[13px] hover:bg-[#F3EFE6] transition-colors cursor-pointer ${
                              selectedCategory === cat.name
                                ? 'text-[#0A5A2A] font-bold bg-[#F3EFE6]'
                                : ''
                            }`}
                          >
                            <span className="truncate pr-2">{cat.name}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            }

            // ACCORDION ITEMS (e.g. Blogs & More, Quick Links, or custom accordions)
            if (item.type === 'ACCORDION' || (item.children && item.children.length > 0)) {
              const isAccordionOpen = !!openAccordions[item.id];
              const enabledChildren = (item.children || [])
                .filter((c) => c.enabled !== false)
                .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

              return (
                <div key={item.id} className="w-full">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(item.id)}
                    className={`w-full px-5 py-3.5 flex items-center justify-between text-left font-semibold text-[13px] uppercase tracking-wider hover:bg-[#F3EFE6] transition-colors cursor-pointer ${
                      isAccordionOpen ? 'bg-[#F3EFE6] text-[#0A5A2A]' : ''
                    }`}
                    aria-expanded={isAccordionOpen}
                  >
                    <div className="flex items-center gap-2.5">
                      {renderIcon(item.icon, 'w-4 h-4 text-[#123F2A]/80')}
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && item.badge !== 'NONE' && (
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded shadow-2xs ${getBadgeStyle(
                            item.badgeType
                          )}`}
                        >
                          {item.badgeText || item.badge}
                        </span>
                      )}
                      <ChevronDown
                        className={`w-4 h-4 text-[#7A6E58] transition-transform duration-200 shrink-0 ${
                          isAccordionOpen ? 'rotate-180 text-[#0A5A2A]' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isAccordionOpen && (
                    <div className="bg-[#F4EFE6]/70 border-y border-[#E5DEC9] py-1.5 pl-7 pr-4 space-y-0.5 text-xs font-medium">
                      {enabledChildren.map((child) => {
                        const isExternal =
                          child.route?.startsWith('http') || child.route?.includes('wa.me');

                        return (
                          <button
                            key={child.id}
                            type="button"
                            onClick={() => handleGenericRoute(child.route)}
                            className="w-full text-left py-2 px-2 text-[#2C3E2D] hover:text-[#0A5A2A] transition-colors flex items-center justify-between cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              {renderIcon(child.icon, 'w-3.5 h-3.5 text-[#0A5A2A]')}
                              <span>{child.label}</span>
                            </span>

                            <div className="flex items-center gap-1.5">
                              {child.badge && child.badge !== 'NONE' && (
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded shadow-2xs ${getBadgeStyle(
                                    child.badgeType
                                  )}`}
                                >
                                  {child.badgeText || child.badge}
                                </span>
                              )}
                              {isExternal && <ExternalLink className="w-3 h-3 opacity-60" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // STANDARD LINK ITEMS (Home, All Products, Wishlist, Offers, B2B, Custom Links)
            const isWishlist = item.id === 'mnav-wishlist' || item.route === 'modal:wishlist';
            const isHome = item.id === 'mnav-home' || item.route === '/';
            const isAllProducts = item.id === 'mnav-all-products' || item.route === '/#products';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (isHome) {
                    handleHomeClick();
                  } else if (isAllProducts) {
                    handleCategorySelect('ALL');
                  } else if (isWishlist) {
                    handleWishlistClick();
                  } else {
                    handleGenericRoute(item.route);
                  }
                }}
                className={`w-full px-5 py-3.5 flex items-center justify-between text-left font-semibold text-[13px] uppercase tracking-wider hover:bg-[#F3EFE6] transition-colors cursor-pointer ${
                  (isAllProducts && selectedCategory === 'ALL') ? 'text-[#0A5A2A] font-bold bg-[#F3EFE6]' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {renderIcon(item.icon, 'w-4 h-4 text-[#123F2A]/80')}
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && item.badge !== 'NONE' && (
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded shadow-2xs ${getBadgeStyle(
                        item.badgeType
                      )}`}
                    >
                      {item.badgeText || item.badge}
                    </span>
                  )}
                  {isWishlist && wishlist.length > 0 && (
                    <span className="bg-[#0A5A2A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {wishlist.length}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* 4. BOTTOM AREA: FOLLOW US ON & COPYRIGHT */}
        {/* ========================================================= */}
        <div className="p-5 border-t border-[#E5DEC9] bg-[#F3EFE6] shrink-0 space-y-3">
          {socialLinks.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#123F2A]/70 block mb-2 font-sans">
                FOLLOW US ON
              </span>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#FAF8F4] border border-[#D8CDAF] text-[#123F2A] hover:bg-[#0A5A2A] hover:text-white hover:border-[#0A5A2A] transition-all flex items-center justify-center shadow-2xs"
                    aria-label={`Follow HAKKIVEDA on ${social.platform}`}
                  >
                    {renderIcon(
                      social.platform === 'facebook'
                        ? 'Facebook'
                        : social.platform === 'instagram'
                        ? 'Instagram'
                        : social.platform === 'youtube'
                        ? 'Youtube'
                        : 'MessageCircle',
                      'w-4 h-4'
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-[#E5DEC9]/60 text-center">
            <p className="text-[11px] text-[#123F2A]/60 font-medium tracking-wider">
              {copyrightText}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};
