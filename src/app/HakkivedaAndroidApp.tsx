import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  MobileAppHeroSlide,
  MobileAppBanner,
  MobileAppSectionConfig,
  MobileAppFeaturedCategory,
  MobileAppFeaturedProducts,
} from '../types/mobileApp';
import {
  INITIAL_MOBILE_APP_HERO_SLIDES,
  INITIAL_MOBILE_APP_BANNERS,
  INITIAL_MOBILE_APP_SECTIONS,
  INITIAL_MOBILE_APP_FEATURED_CATEGORIES,
  INITIAL_MOBILE_APP_FEATURED_PRODUCTS,
} from '../data/initialData';
import { AppHeader } from './components/AppHeader';
import { AppBottomNav, AppNavTab } from './navigation/AppBottomNav';
import { AppHomeScreen } from './screens/AppHomeScreen';
import { AppShopScreen } from './screens/AppShopScreen';
import { AppHairAnalysisScreen } from './screens/AppHairAnalysisScreen';
import { AppOrdersScreen } from './screens/AppOrdersScreen';
import { AppAccountScreen } from './screens/AppAccountScreen';
import { AppProductDetailModal } from './screens/AppProductDetailModal';
import { AppCartDrawer } from './screens/AppCartDrawer';
import { AppSearchModal } from './screens/AppSearchModal';
import { CheckoutModal } from '../components/CheckoutModal';

export const HakkivedaAndroidApp: React.FC = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, playSound, openWishlist } = useStore();

  const [activeTab, setActiveTab] = useState<AppNavTab>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');
  const [selectedConcernId, setSelectedConcernId] = useState<string | undefined>();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // App-specific admin configurable state
  const [heroSlides, setHeroSlides] = useState<MobileAppHeroSlide[]>(INITIAL_MOBILE_APP_HERO_SLIDES);
  const [banners, setBanners] = useState<MobileAppBanner[]>(INITIAL_MOBILE_APP_BANNERS);
  const [sections, setSections] = useState<MobileAppSectionConfig[]>(INITIAL_MOBILE_APP_SECTIONS);
  const [featuredCategories, setFeaturedCategories] = useState<MobileAppFeaturedCategory[]>(
    INITIAL_MOBILE_APP_FEATURED_CATEGORIES
  );
  const [featuredProducts, setFeaturedProducts] = useState<MobileAppFeaturedProducts>(
    INITIAL_MOBILE_APP_FEATURED_PRODUCTS
  );

  // Fetch live app manager data from API on mount
  useEffect(() => {
    const fetchAppData = async () => {
      try {
        const [slidesRes, bannersRes, sectionsRes, catsRes, prodsRes] = await Promise.all([
          fetch('/api/store/mobile_app_hero_slides').then((r) => r.json()).catch(() => null),
          fetch('/api/store/mobile_app_banners').then((r) => r.json()).catch(() => null),
          fetch('/api/store/mobile_app_sections').then((r) => r.json()).catch(() => null),
          fetch('/api/store/mobile_app_featured_categories').then((r) => r.json()).catch(() => null),
          fetch('/api/store/mobile_app_featured_products').then((r) => r.json()).catch(() => null),
        ]);

        if (slidesRes?.success && Array.isArray(slidesRes.data) && slidesRes.data.length > 0) {
          setHeroSlides(slidesRes.data);
        }
        if (bannersRes?.success && Array.isArray(bannersRes.data) && bannersRes.data.length > 0) {
          setBanners(bannersRes.data);
        }
        if (sectionsRes?.success && Array.isArray(sectionsRes.data) && sectionsRes.data.length > 0) {
          setSections(sectionsRes.data);
        }
        if (catsRes?.success && Array.isArray(catsRes.data) && catsRes.data.length > 0) {
          setFeaturedCategories(catsRes.data);
        }
        if (prodsRes?.success && prodsRes.data) {
          setFeaturedProducts(prodsRes.data);
        }
      } catch (e) {
        console.warn('[HAKKIVEDA App] Using fallback initial configuration');
      }
    };

    fetchAppData();
  }, []);

  // Native Android back button listener
  useEffect(() => {
    const handleAndroidBack = (e: Event) => {
      if (isCheckoutOpen) {
        e.preventDefault();
        setIsCheckoutOpen(false);
        return;
      }
      if (selectedProductId) {
        e.preventDefault();
        setSelectedProductId(null);
        return;
      }
      if (isCartOpen) {
        e.preventDefault();
        setIsCartOpen(false);
        return;
      }
      if (isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(false);
        return;
      }
      if (activeTab !== 'home') {
        e.preventDefault();
        setActiveTab('home');
        return;
      }
    };

    window.addEventListener('hakkiveda:android-back', handleAndroidBack);
    return () => {
      window.removeEventListener('hakkiveda:android-back', handleAndroidBack);
    };
  }, [isCheckoutOpen, selectedProductId, isCartOpen, isSearchOpen, activeTab, setIsCheckoutOpen]);

  const handleActionClick = (destination: string) => {
    try {
      playSound('click');
    } catch {}

    if (!destination) return;
    if (destination === 'shop') {
      setSelectedCategoryId('ALL');
      setSelectedConcernId(undefined);
      setActiveTab('shop');
    } else if (destination === 'analysis' || destination === 'quiz') {
      setActiveTab('analysis');
    } else if (destination.startsWith('product:')) {
      const pId = destination.replace('product:', '').trim();
      setSelectedProductId(pId);
    } else if (destination.startsWith('category:')) {
      const cId = destination.replace('category:', '').trim();
      setSelectedCategoryId(cId);
      setActiveTab('shop');
    } else if (destination.startsWith('concern:')) {
      const conId = destination.replace('concern:', '').trim();
      setSelectedConcernId(conId);
      setActiveTab('shop');
    }
  };

  const handleNavigateToShop = (categoryId?: string, concernId?: string) => {
    try {
      playSound('click');
    } catch {}
    if (categoryId) setSelectedCategoryId(categoryId);
    if (concernId) setSelectedConcernId(concernId);
    setActiveTab('shop');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-slate-900 font-sans flex flex-col justify-between selection:bg-[#C5A059]/30">
      {/* Top Native Header */}
      <AppHeader
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenNotifications={() => {
          // Toast notifications info
          alert('You have 1 notification: Flat ₹200 OFF on Complete Hair Revival Kit with code TRIBAL200!');
        }}
      />

      {/* Main View Area */}
      <main className="flex-1 overflow-x-hidden">
        {activeTab === 'home' && (
          <AppHomeScreen
            heroSlides={heroSlides}
            banners={banners}
            sections={sections}
            featuredCategories={featuredCategories}
            featuredProducts={featuredProducts}
            onOpenProductDetail={(id) => setSelectedProductId(id)}
            onNavigateToShop={handleNavigateToShop}
            onNavigateToAnalysis={() => setActiveTab('analysis')}
            onActionClick={handleActionClick}
          />
        )}

        {activeTab === 'shop' && (
          <AppShopScreen
            initialCategoryId={selectedCategoryId}
            initialConcernId={selectedConcernId}
            onOpenProductDetail={(id) => setSelectedProductId(id)}
          />
        )}

        {activeTab === 'analysis' && (
          <AppHairAnalysisScreen
            onOpenProductDetail={(id) => setSelectedProductId(id)}
          />
        )}

        {activeTab === 'orders' && <AppOrdersScreen />}

        {activeTab === 'account' && (
          <AppAccountScreen
            onOpenWishlist={() => openWishlist?.()}
            onNavigateToOrders={() => setActiveTab('orders')}
          />
        )}
      </main>

      {/* App Bottom Navigation */}
      <AppBottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          try {
            playSound('click');
          } catch {}
          setActiveTab(tab);
        }}
      />

      {/* Overlays */}
      <AppProductDetailModal
        productId={selectedProductId}
        onClose={() => setSelectedProductId(null)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <AppCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onExploreShop={() => {
          setIsCartOpen(false);
          setActiveTab('shop');
        }}
      />

      <AppSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpenProductDetail={(id) => {
          setSelectedProductId(id);
        }}
        onSearchCategory={(catId) => {
          setSelectedCategoryId(catId);
          setActiveTab('shop');
        }}
      />

      {/* Standard Checkout Modal Integration */}
      <CheckoutModal />
    </div>
  );
};
