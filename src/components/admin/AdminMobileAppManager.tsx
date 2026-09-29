import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Check,
  Eye,
  Layers,
  Image as ImageIcon,
  Tag,
  Grid,
  Star,
  Sparkles,
  Phone,
  FolderOpen,
  Leaf,
  Package,
  ExternalLink,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  MobileAppHeroSlide,
  MobileAppBanner,
  MobileAppSectionConfig,
  MobileAppFeaturedCategory,
  MobileAppFeaturedProducts,
  MobileAppSettings,
  MobileAppShopConcern,
  MobileAppProductOverride,
} from '../../types/mobileApp';
import {
  INITIAL_MOBILE_APP_HERO_SLIDES,
  INITIAL_MOBILE_APP_BANNERS,
  INITIAL_MOBILE_APP_SECTIONS,
  INITIAL_MOBILE_APP_FEATURED_CATEGORIES,
  INITIAL_MOBILE_APP_FEATURED_PRODUCTS,
  INITIAL_MOBILE_APP_SETTINGS,
  INITIAL_MOBILE_APP_CONCERNS,
  INITIAL_MOBILE_APP_PRODUCTS,
} from '../../data/initialData';

import { AppHeroSlidesManager } from './mobileApp/AppHeroSlidesManager';
import { AppProductsManager } from './mobileApp/AppProductsManager';
import { AppCuratedProductsManager } from './mobileApp/AppCuratedProductsManager';
import { AppPromoBannersManager } from './mobileApp/AppPromoBannersManager';
import { AppCategoriesManager } from './mobileApp/AppCategoriesManager';
import { AppConcernsManager } from './mobileApp/AppConcernsManager';
import { AppSectionsManager } from './mobileApp/AppSectionsManager';
import { AppBrandingManager } from './mobileApp/AppBrandingManager';
import { AppContactSettings } from './mobileApp/AppContactSettings';
import { AppMediaLibrary } from './mobileApp/AppMediaLibrary';
import { AppPhonePreviewModal } from './mobileApp/AppPhonePreviewModal';

type MobileAppTab =
  | 'hero'
  | 'app_products'
  | 'curated'
  | 'banners'
  | 'categories'
  | 'concerns'
  | 'sections'
  | 'branding'
  | 'contact'
  | 'media';

export const AdminMobileAppManager: React.FC = () => {
  const { products, categories, playSound } = useStore();

  const [activeTab, setActiveTab] = useState<MobileAppTab>('hero');

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
  const [overrides, setOverrides] = useState<Record<string, MobileAppProductOverride>>(
    INITIAL_MOBILE_APP_PRODUCTS
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPhonePreviewOpen, setIsPhonePreviewOpen] = useState(false);

  // Load initial configurations from API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
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
          fetch('/api/store/mobile_app_hero_slides').then((r) => r.json()).catch(() => null),
          fetch('/api/store/mobile_app_banners').then((r) => r.json()).catch(() => null),
          fetch('/api/store/mobile_app_sections').then((r) => r.json()).catch(() => null),
          fetch('/api/store/mobile_app_featured_categories').then((r) => r.json()).catch(() => null),
          fetch('/api/store/mobile_app_featured_products').then((r) => r.json()).catch(() => null),
          fetch('/api/store/mobile_app_settings').then((r) => r.json()).catch(() => null),
          fetch('/api/store/mobile_app_concerns').then((r) => r.json()).catch(() => null),
          fetch('/api/store/mobile_app_products').then((r) => r.json()).catch(() => null),
        ]);

        if (slidesRes?.success && Array.isArray(slidesRes.data)) setHeroSlides(slidesRes.data);
        if (bannersRes?.success && Array.isArray(bannersRes.data)) setBanners(bannersRes.data);
        if (sectionsRes?.success && Array.isArray(sectionsRes.data)) setSections(sectionsRes.data);
        if (catsRes?.success && Array.isArray(catsRes.data)) setFeaturedCategories(catsRes.data);
        if (prodsRes?.success && prodsRes.data) setFeaturedProducts(prodsRes.data);
        if (settingsRes?.success && settingsRes.data) setAppSettings((prev) => ({ ...prev, ...settingsRes.data }));
        if (concernsRes?.success && Array.isArray(concernsRes.data)) setConcerns(concernsRes.data);
        if (overridesRes?.success && overridesRes.data) setOverrides(overridesRes.data);
      } catch (err) {
        console.error('Failed to load mobile app configuration', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const saveToServer = async (key: string, value: any) => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/store/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ value }),
      });
      const data = await res.json();
      if (data.success) {
        const cleanName = key.replace('mobile_app_', '').replace(/_/g, ' ');
        setStatusMessage(`Successfully saved ${cleanName}!`);
        try {
          playSound('success');
        } catch {}
      } else {
        setStatusMessage(`Save failed: ${data.error || 'Server error'}`);
      }
    } catch (err: any) {
      setStatusMessage(`Save error: ${err.message}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const navTabs: { id: MobileAppTab; label: string; icon: any; badge?: number | string }[] = [
    { id: 'hero', label: 'App Hero Slides', icon: ImageIcon, badge: heroSlides.length },
    { id: 'app_products', label: 'App Products', icon: Package, badge: Object.keys(overrides).length },
    { id: 'curated', label: 'Curated Products', icon: Star },
    { id: 'banners', label: 'Promo Banners', icon: Tag, badge: banners.length },
    { id: 'categories', label: 'Featured Categories', icon: Grid, badge: featuredCategories.length },
    { id: 'concerns', label: 'Shop by Concern', icon: Leaf, badge: concerns.length },
    { id: 'sections', label: 'Home Sections Ordering', icon: Layers, badge: sections.filter((s) => s.enabled).length },
    { id: 'branding', label: 'App Branding', icon: Sparkles },
    { id: 'contact', label: 'WhatsApp & Support', icon: Phone },
    { id: 'media', label: 'App Media Library', icon: FolderOpen },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="bg-[#0E382C] rounded-3xl p-6 text-white border border-[#C5A059]/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-8 h-8 rounded-xl bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
              Android Capacitor App Control Center
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#FDF8EC]">
            Mobile App Manager
          </h1>
          <p className="text-xs text-emerald-100/80 mt-1 max-w-2xl leading-relaxed">
            Full administrative control over app-only presentation, hero carousels, product merchandising overrides,
            Shop by Concern cards, home layout ordering, branding and WhatsApp channels without modifying the desktop website.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsPhonePreviewOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#C5A059] text-[#0E382C] font-bold text-xs flex items-center gap-2 shadow-sm hover:bg-[#d4af37] transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Android App</span>
          </button>

          <a
            href="/?view=app"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
            title="Open Live App View in New Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Status Feedback Toast */}
      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-900/90 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-sm">
          <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Tab Navigation Strip */}
      <div className="flex border-b border-white/10 gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white/10 text-[#C5A059] border-b-2 border-[#C5A059]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                    isActive ? 'bg-[#C5A059] text-[#0E382C]' : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENTS */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading mobile app configuration...</div>
      ) : (
        <>
          {/* 1. APP HERO SLIDES */}
          {activeTab === 'hero' && (
            <AppHeroSlidesManager
              slides={heroSlides}
              products={products}
              categories={categories}
              isSaving={isSaving}
              onSave={(updated) => {
                setHeroSlides(updated);
                saveToServer('mobile_app_hero_slides', updated);
              }}
            />
          )}

          {/* 2. APP PRODUCTS MERCHANDISING */}
          {activeTab === 'app_products' && (
            <AppProductsManager
              products={products}
              overrides={overrides}
              isSaving={isSaving}
              onSave={(updated) => {
                setOverrides(updated);
                saveToServer('mobile_app_products', updated);
              }}
            />
          )}

          {/* 3. CURATED PRODUCTS */}
          {activeTab === 'curated' && (
            <AppCuratedProductsManager
              products={products}
              featuredProducts={featuredProducts}
              overrides={overrides}
              isSaving={isSaving}
              onSave={(updated) => {
                setFeaturedProducts(updated);
                saveToServer('mobile_app_featured_products', updated);
              }}
            />
          )}

          {/* 4. PROMO BANNERS */}
          {activeTab === 'banners' && (
            <AppPromoBannersManager
              banners={banners}
              products={products}
              categories={categories}
              isSaving={isSaving}
              onSave={(updated) => {
                setBanners(updated);
                saveToServer('mobile_app_banners', updated);
              }}
            />
          )}

          {/* 5. FEATURED CATEGORIES */}
          {activeTab === 'categories' && (
            <AppCategoriesManager
              categories={categories}
              featuredCategories={featuredCategories}
              isSaving={isSaving}
              onSave={(updated) => {
                setFeaturedCategories(updated);
                saveToServer('mobile_app_featured_categories', updated);
              }}
            />
          )}

          {/* 6. SHOP BY CONCERN */}
          {activeTab === 'concerns' && (
            <AppConcernsManager
              concerns={concerns}
              products={products}
              categories={categories}
              isSaving={isSaving}
              onSave={(updated) => {
                setConcerns(updated);
                saveToServer('mobile_app_concerns', updated);
              }}
            />
          )}

          {/* 7. HOME SECTIONS ORDERING */}
          {activeTab === 'sections' && (
            <AppSectionsManager
              sections={sections}
              isSaving={isSaving}
              onOpenLivePreview={() => setIsPhonePreviewOpen(true)}
              onSave={(updated) => {
                setSections(updated);
                saveToServer('mobile_app_sections', updated);
              }}
            />
          )}

          {/* 8. APP BRANDING */}
          {activeTab === 'branding' && (
            <AppBrandingManager
              settings={appSettings}
              isSaving={isSaving}
              onSave={(updated) => {
                setAppSettings(updated);
                saveToServer('mobile_app_settings', updated);
              }}
            />
          )}

          {/* 9. APP CONTACT SETTINGS */}
          {activeTab === 'contact' && (
            <AppContactSettings
              settings={appSettings}
              isSaving={isSaving}
              onSave={(updated) => {
                setAppSettings(updated);
                saveToServer('mobile_app_settings', updated);
              }}
            />
          )}

          {/* 10. APP MEDIA LIBRARY */}
          {activeTab === 'media' && <AppMediaLibrary />}
        </>
      )}

      {/* Phone Preview Modal */}
      <AppPhonePreviewModal
        isOpen={isPhonePreviewOpen}
        onClose={() => setIsPhonePreviewOpen(false)}
        heroSlides={heroSlides}
        banners={banners}
        sections={sections}
        featuredCategories={featuredCategories}
        featuredProducts={featuredProducts}
        appSettings={appSettings}
        concerns={concerns}
        overrides={overrides}
        products={products}
        categories={categories}
      />
    </div>
  );
};
