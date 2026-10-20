import React, { Component, useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  MobileAppHeroSlide,
  MobileAppBanner,
  MobileAppSectionConfig,
  MobileAppFeaturedCategory,
  MobileAppFeaturedProducts,
  MobileAppSettings,
  MobileAppShopConcern,
  MobileAppProductOverride,
} from '../types/mobileApp';
import {
  INITIAL_MOBILE_APP_HERO_SLIDES,
  INITIAL_MOBILE_APP_BANNERS,
  INITIAL_MOBILE_APP_SECTIONS,
  INITIAL_MOBILE_APP_FEATURED_CATEGORIES,
  INITIAL_MOBILE_APP_FEATURED_PRODUCTS,
  INITIAL_MOBILE_APP_SETTINGS,
  INITIAL_MOBILE_APP_CONCERNS,
  INITIAL_MOBILE_APP_PRODUCTS,
} from '../data/initialData';
import { AppHeader } from './components/AppHeader';
import { AppBottomNav, AppNavTab } from './navigation/AppBottomNav';
import { AppHomeScreen } from './screens/AppHomeScreen';
import { resolveApiUrl } from './utils/nativeUrl';
import { AppShopScreen } from './screens/AppShopScreen';
import { AppHairAnalysisScreen } from './screens/AppHairAnalysisScreen';
import { AppOrdersScreen } from './screens/AppOrdersScreen';
import { AppAccountScreen } from './screens/AppAccountScreen';
import { AppGlobalCommunityScreen } from './screens/AppGlobalCommunityScreen';
import { AppOurStoryScreen } from './screens/AppOurStoryScreen';
import { AppTrustAuthenticityScreen } from './screens/AppTrustAuthenticityScreen';
import { AppB2BScreen } from './screens/AppB2BScreen';
import { AppCareJourneyScreen } from './screens/AppCareJourneyScreen';
import { AppProductDetailModal } from './screens/AppProductDetailModal';
import { AppCartDrawer } from './screens/AppCartDrawer';
import { AppSearchModal } from './screens/AppSearchModal';
import { CheckoutModal } from '../components/CheckoutModal';
import { Heart, X, Trash2 } from 'lucide-react';
import { resolveAssetUrl } from './utils/nativeUrl';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  screenName: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class AppScreenErrorBoundary extends (React.Component as new (props: ErrorBoundaryProps) => any) {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: any, errorInfo: any) {
    console.error(`[HAKKIVEDA App] Error in ${this.props.screenName}:`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center my-8 bg-white mx-4 rounded-2xl border border-emerald-950/10 shadow-xs">
          <p className="text-xs text-slate-700 font-medium">Unable to display this section right now.</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 px-4 py-1.5 rounded-full bg-[#0E382C] text-[#C5A059] text-xs font-bold shadow-xs active:scale-95"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const HakkivedaAndroidApp: React.FC = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, playSound, wishlist, removeFromWishlist, clearWishlist } = useStore();

  const [activeTab, setActiveTab] = useState<AppNavTab>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');
  const [selectedConcernId, setSelectedConcernId] = useState<string | undefined>();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [extraScreen, setExtraScreen] = useState<'story' | 'global' | 'trust' | 'b2b' | 'care-hair' | 'care-skin' | 'care-wellness' | null>(null);

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
  const [appSettings, setAppSettings] = useState<MobileAppSettings>(INITIAL_MOBILE_APP_SETTINGS);
  const [concerns, setConcerns] = useState<MobileAppShopConcern[]>(INITIAL_MOBILE_APP_CONCERNS);
  const [appProductOverrides, setAppProductOverrides] = useState<Record<string, MobileAppProductOverride>>(
    INITIAL_MOBILE_APP_PRODUCTS
  );

  // Fetch live app manager data from API on mount
  useEffect(() => {
    const fetchAppData = async () => {
      try {
        const [
          slidesRes,
          bannersRes,
          sectionsRes,
          catsRes,
          prodsRes,
          settingsRes,
          concernsRes,
          overridesRes,
        ] = await Promise.all([
          fetch(resolveApiUrl('/api/store/mobile_app_hero_slides')).then((r) => r.json()).catch(() => null),
          fetch(resolveApiUrl('/api/store/mobile_app_banners')).then((r) => r.json()).catch(() => null),
          fetch(resolveApiUrl('/api/store/mobile_app_sections')).then((r) => r.json()).catch(() => null),
          fetch(resolveApiUrl('/api/store/mobile_app_featured_categories')).then((r) => r.json()).catch(() => null),
          fetch(resolveApiUrl('/api/store/mobile_app_featured_products')).then((r) => r.json()).catch(() => null),
          fetch(resolveApiUrl('/api/store/mobile_app_settings')).then((r) => r.json()).catch(() => null),
          fetch(resolveApiUrl('/api/store/mobile_app_concerns')).then((r) => r.json()).catch(() => null),
          fetch(resolveApiUrl('/api/store/mobile_app_products')).then((r) => r.json()).catch(() => null),
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
        if (settingsRes?.success && settingsRes.data) {
          setAppSettings(settingsRes.data);
        }
        if (concernsRes?.success && Array.isArray(concernsRes.data)) {
          setConcerns(concernsRes.data);
        }
        if (overridesRes?.success && overridesRes.data) {
          setAppProductOverrides(overridesRes.data);
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
      if (extraScreen) {
        e.preventDefault();
        setExtraScreen(null);
        return;
      }

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
  }, [extraScreen, isCheckoutOpen, selectedProductId, isCartOpen, isSearchOpen, activeTab, setIsCheckoutOpen]);

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
      setSelectedConcernId(undefined);
      setActiveTab('shop');
    } else if (destination.startsWith('concern:')) {
      const conId = destination.replace('concern:', '').trim();
      setSelectedCategoryId('ALL');
      setSelectedConcernId(conId);
      setActiveTab('shop');
    }
  };

  const handleNavigateToShop = (categoryId?: string, concernId?: string) => {
    try {
      playSound('click');
    } catch {}
    setSelectedCategoryId(categoryId || 'ALL');
    setSelectedConcernId(concernId);
    setActiveTab('shop');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-slate-900 font-sans flex flex-col justify-between selection:bg-[#C5A059]/30">
      {/* Top Native Header */}
      <AppHeader
        headerLogoUrl={appSettings.headerLogoUrl}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenNotifications={() => {
          // Toast notifications info
          alert('You have 1 notification: Flat ₹200 OFF on Complete Hair Revival Kit with code TRIBAL200!');
        }}
      />

      {/* Main View Area */}
      <main className="flex-1 overflow-x-hidden">
        {extraScreen === 'story' && (
          <AppScreenErrorBoundary screenName="Our Story">
            <AppOurStoryScreen
              onBack={() => setExtraScreen(null)}
              imageUrl={sections.find((section) => section.id === 'brand_story')?.imageUrl}
              onShop={() => {
                setExtraScreen(null);
                setSelectedCategoryId('ALL');
                setSelectedConcernId(undefined);
                setActiveTab('shop');
                window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
              }}
            />
          </AppScreenErrorBoundary>
        )}

        {extraScreen === 'global' && (
          <AppScreenErrorBoundary screenName="Global Community">
            <AppGlobalCommunityScreen onBack={() => setExtraScreen(null)} />
          </AppScreenErrorBoundary>
        )}

        {extraScreen === 'trust' && (
          <AppScreenErrorBoundary screenName="Trust & Authenticity">
            <AppTrustAuthenticityScreen onBack={() => setExtraScreen(null)} />
          </AppScreenErrorBoundary>
        )}

        {extraScreen === 'b2b' && (
          <AppScreenErrorBoundary screenName="B2B">
            <AppB2BScreen onBack={() => setExtraScreen(null)} />
          </AppScreenErrorBoundary>
        )}

        {(extraScreen === 'care-hair' || extraScreen === 'care-skin' || extraScreen === 'care-wellness') && (
          <AppScreenErrorBoundary screenName="Care Journey">
            <AppCareJourneyScreen
              journey={extraScreen.replace('care-', '') as 'hair' | 'skin' | 'wellness'}
              onBack={() => setExtraScreen(null)}
              onShop={(categoryId) => {
                setExtraScreen(null);
                setSelectedCategoryId(categoryId || 'ALL');
                setSelectedConcernId(undefined);
                setActiveTab('shop');
                window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
              }}
            />
          </AppScreenErrorBoundary>
        )}

        {!extraScreen && activeTab === 'home' && (
          <AppScreenErrorBoundary screenName="Home">
            <AppHomeScreen
              heroSlides={heroSlides}
              banners={banners}
              sections={sections}
              featuredCategories={featuredCategories}
              featuredProducts={featuredProducts}
              concerns={concerns}
              appProductOverrides={appProductOverrides}
              onOpenProductDetail={(id) => setSelectedProductId(id)}
              onNavigateToShop={handleNavigateToShop}
              onNavigateToAnalysis={() => setActiveTab('analysis')}
              onOpenCareJourney={(journey) => {
                setExtraScreen(`care-${journey}` as 'care-hair' | 'care-skin' | 'care-wellness');
                window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
              }}
              onOpenOurStory={() => {
                setExtraScreen('story');
                window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
              }}
              onOpenGlobalCommunity={() => {
                setExtraScreen('global');
                window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
              }}
              onOpenTrust={() => {
                setExtraScreen('trust');
                window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
              }}
              onOpenB2B={() => {
                setExtraScreen('b2b');
                window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
              }}
              onActionClick={handleActionClick}
            />
          </AppScreenErrorBoundary>
        )}

        {!extraScreen && activeTab === 'shop' && (
          <AppScreenErrorBoundary screenName="Shop">
            <AppShopScreen
              initialCategoryId={selectedCategoryId}
              initialConcernId={selectedConcernId}
              concerns={concerns}
              appProductOverrides={appProductOverrides}
              onOpenProductDetail={(id) => setSelectedProductId(id)}
            />
          </AppScreenErrorBoundary>
        )}

        {!extraScreen && activeTab === 'analysis' && (
          <AppScreenErrorBoundary screenName="Hair Analysis">
            <AppHairAnalysisScreen
              onOpenProductDetail={(id) => setSelectedProductId(id)}
            />
          </AppScreenErrorBoundary>
        )}

        {!extraScreen && activeTab === 'orders' && (
          <AppScreenErrorBoundary screenName="Orders">
            <AppOrdersScreen />
          </AppScreenErrorBoundary>
        )}

        {!extraScreen && activeTab === 'account' && (
          <AppScreenErrorBoundary screenName="Account">
            <AppAccountScreen
              appSettings={appSettings}
              onOpenWishlist={() => setIsWishlistOpen(true)}
              onNavigateToOrders={() => setActiveTab('orders')}
            />
          </AppScreenErrorBoundary>
        )}
      </main>

      {/* App Bottom Navigation */}
      {!extraScreen && (
      <AppBottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          try {
            playSound('click');
          } catch {}
          if (tab === 'shop') {
            setSelectedCategoryId('ALL');
            setSelectedConcernId(undefined);
          }
          setActiveTab(tab);
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }}
      />
      )}

      {/* Overlays */}
      <AppProductDetailModal
        productId={selectedProductId}
        override={selectedProductId ? appProductOverrides[selectedProductId] : undefined}
        whatsappNumber={appSettings.whatsappNumber}
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
          setSelectedCategoryId('ALL');
          setSelectedConcernId(undefined);
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
          setSelectedConcernId(undefined);
          setActiveTab('shop');
        }}
      />

      {/* Android-native wishlist: product objects are managed and persisted by StoreContext. */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-[110] flex flex-col bg-[#FCF9F2]" role="dialog" aria-modal="true" aria-label="My Wishlist">
          <div className="flex items-center justify-between bg-[#003D30] px-5 py-4 text-white">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-[#E8C46D]" />
              <h2 className="font-serif text-xl font-bold text-white">My Wishlist ({wishlist.length})</h2>
            </div>
            <button type="button" aria-label="Close wishlist" onClick={() => setIsWishlistOpen(false)} className="rounded-full p-2 text-white"><X className="h-6 w-6" /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-5">
            {wishlist.length === 0 ? (
              <div className="mx-auto mt-16 max-w-xs text-center">
                <Heart className="mx-auto h-14 w-14 text-[#C5A059]" />
                <h3 className="mt-4 font-serif text-xl font-bold text-[#003D30]">Your wishlist is empty</h3>
                <p className="mt-2 text-sm text-slate-600">Tap the heart on products to save them here.</p>
                <button type="button" className="mt-6 rounded-xl bg-[#003D30] px-6 py-3 font-bold text-white" onClick={() => { setIsWishlistOpen(false); setActiveTab('shop'); }}>Explore Products</button>
              </div>
            ) : (
              <div className="space-y-3">
                {wishlist.map((product) => (
                  <div key={product.id} className="flex items-center gap-3 rounded-2xl border border-[#E6DDC8] bg-white p-3 shadow-sm">
                    <button type="button" onClick={() => { setIsWishlistOpen(false); setSelectedProductId(product.id); }} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                      <img src={resolveAssetUrl(product.image || product.images?.[0] || '/images/hero_tribal_elders.jpg')} alt={product.name} className="h-20 w-20 shrink-0 rounded-xl bg-[#F6F0E5] object-contain" />
                      <span className="min-w-0 font-semibold text-[#003D30]">{product.name}</span>
                    </button>
                    <button type="button" onClick={() => removeFromWishlist(product.id)} aria-label={`Remove ${product.name} from wishlist`} className="rounded-full p-2 text-rose-600"><Trash2 className="h-5 w-5" /></button>
                  </div>
                ))}
                <button type="button" className="mt-3 w-full py-3 text-sm font-semibold text-rose-700" onClick={() => { if (window.confirm('Clear all saved products?')) clearWishlist(); }}>Clear Wishlist</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Standard Checkout Modal Integration */}
      <CheckoutModal />
    </div>
  );
};
