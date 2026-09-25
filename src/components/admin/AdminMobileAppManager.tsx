import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Plus,
  Trash2,
  Edit2,
  Save,
  Eye,
  Check,
  Upload,
  ArrowUp,
  ArrowDown,
  Layers,
  Image as ImageIcon,
  Tag,
  Grid,
  Star,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  MobileAppHeroSlide,
  MobileAppBanner,
  MobileAppSectionConfig,
  MobileAppFeaturedCategory,
  MobileAppFeaturedProducts,
} from '../../types/mobileApp';
import {
  INITIAL_MOBILE_APP_HERO_SLIDES,
  INITIAL_MOBILE_APP_BANNERS,
  INITIAL_MOBILE_APP_SECTIONS,
  INITIAL_MOBILE_APP_FEATURED_CATEGORIES,
  INITIAL_MOBILE_APP_FEATURED_PRODUCTS,
} from '../../data/initialData';
import { resolveAssetUrl } from '../../app/utils/nativeUrl';

export const AdminMobileAppManager: React.FC = () => {
  const { products, categories, playSound } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<
    'hero' | 'banners' | 'sections' | 'categories' | 'products'
  >('hero');

  const [heroSlides, setHeroSlides] = useState<MobileAppHeroSlide[]>(INITIAL_MOBILE_APP_HERO_SLIDES);
  const [banners, setBanners] = useState<MobileAppBanner[]>(INITIAL_MOBILE_APP_BANNERS);
  const [sections, setSections] = useState<MobileAppSectionConfig[]>(INITIAL_MOBILE_APP_SECTIONS);
  const [featuredCategories, setFeaturedCategories] = useState<MobileAppFeaturedCategory[]>(
    INITIAL_MOBILE_APP_FEATURED_CATEGORIES
  );
  const [featuredProducts, setFeaturedProducts] = useState<MobileAppFeaturedProducts>(
    INITIAL_MOBILE_APP_FEATURED_PRODUCTS
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Editing state for Hero Slide
  const [editingSlide, setEditingSlide] = useState<MobileAppHeroSlide | null>(null);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [slideUploading, setSlideUploading] = useState(false);

  // Editing state for Banner
  const [editingBanner, setEditingBanner] = useState<MobileAppBanner | null>(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);

  // Load existing configuration from server
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [slidesRes, bannersRes, sectionsRes, catsRes, prodsRes] = await Promise.all([
          fetch('/api/store/mobile_app_hero_slides').then((r) => r.json()).catch(() => null),
          fetch('/api/store/mobile_app_banners').then((r) => r.json()).catch(() => null),
          fetch('/api/store/mobile_app_sections').then((r) => r.json()).catch(() => null),
          fetch('/api/store/mobile_app_featured_categories').then((r) => r.json()).catch(() => null),
          fetch('/api/store/mobile_app_featured_products').then((r) => r.json()).catch(() => null),
        ]);

        if (slidesRes?.success && Array.isArray(slidesRes.data)) setHeroSlides(slidesRes.data);
        if (bannersRes?.success && Array.isArray(bannersRes.data)) setBanners(bannersRes.data);
        if (sectionsRes?.success && Array.isArray(sectionsRes.data)) setSections(sectionsRes.data);
        if (catsRes?.success && Array.isArray(catsRes.data)) setFeaturedCategories(catsRes.data);
        if (prodsRes?.success && prodsRes.data) setFeaturedProducts(prodsRes.data);
      } catch (e) {
        console.error('Error loading mobile app config', e);
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
        setStatusMessage(`Successfully saved ${key.replace('mobile_app_', '').replace(/_/g, ' ')}!`);
        try {
          playSound('success');
        } catch {}
      } else {
        setStatusMessage(`Save error: ${data.error || 'Failed'}`);
      }
    } catch (err: any) {
      setStatusMessage(`Network error saving: ${err.message}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const uploadAppImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    // Try dedicated mobile-app endpoint first
    try {
      const res = await fetch('/api/upload/mobile-app', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) return data.url;
      }
    } catch {}

    // Fallback to standard upload
    const fallbackRes = await fetch('/api/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    const fallbackData = await fallbackRes.json();
    if (fallbackData.success && fallbackData.url) return fallbackData.url;
    throw new Error(fallbackData.error || 'Upload failed');
  };

  // Section Move Up / Down
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Re-index display orders
    newSections.forEach((s, idx) => {
      s.displayOrder = idx + 1;
    });

    setSections(newSections);
    saveToServer('mobile_app_sections', newSections);
  };

  const toggleSectionEnabled = (sectionId: string) => {
    const updated = sections.map((s) =>
      s.id === sectionId ? { ...s, enabled: !s.enabled } : s
    );
    setSections(updated);
    saveToServer('mobile_app_sections', updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="bg-[#0E382C] rounded-2xl p-6 text-white border border-[#C5A059]/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-8 h-8 rounded-lg bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
              Android Capacitor App
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#FDF8EC]">
            Mobile App Manager
          </h1>
          <p className="text-xs text-emerald-100/80 mt-1 max-w-xl">
            Control the dedicated HAKKIVEDA Android app layout, hero carousel, promo banners, and featured products independently of the desktop website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/?view=app"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#C5A059] text-[#0E382C] font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-[#d4af37] transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Android App</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex border-b border-white/10 gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'hero', label: 'App Hero Slides', icon: ImageIcon },
          { id: 'banners', label: 'Promo Banners', icon: Tag },
          { id: 'sections', label: 'Home Sections Ordering', icon: Layers },
          { id: 'categories', label: 'Featured Categories', icon: Grid },
          { id: 'products', label: 'Curated Products', icon: Star },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white/10 text-[#C5A059] border-b-2 border-[#C5A059]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HERO SLIDES */}
      {activeSubTab === 'hero' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200">
              App Hero Carousel Slides ({heroSlides.length})
            </h2>
            <button
              type="button"
              onClick={() => {
                setEditingSlide({
                  id: `app-hero-${Date.now()}`,
                  title: '',
                  subtitle: '',
                  imageUrl: '/images/hero_tribal_elders.jpg',
                  ctaText: 'Shop Now',
                  ctaDestination: 'shop',
                  displayOrder: heroSlides.length + 1,
                  published: true,
                });
                setIsSlideModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#C5A059] text-[#0E382C] font-bold text-xs flex items-center gap-1.5 hover:bg-[#d4af37]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Slide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-[16/9] bg-black/40">
                  <img
                    src={resolveAssetUrl(slide.imageUrl)}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/hero_tribal_elders.jpg';
                    }}
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        slide.published !== false
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {slide.published !== false ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 text-[10px] bg-black/70 text-[#C5A059] px-2 py-0.5 rounded font-mono">
                    Order: {slide.displayOrder}
                  </div>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-white leading-tight">
                      {slide.title || 'Untitled Slide'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {slide.subtitle || 'No subtitle provided'}
                    </p>
                    <div className="mt-2 text-[11px] text-emerald-400 font-mono">
                      CTA: {slide.ctaText} → {slide.ctaDestination}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSlide(slide);
                        setIsSlideModalOpen(true);
                      }}
                      className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Delete this mobile app hero slide?')) {
                          const updated = heroSlides.filter((s) => s.id !== slide.id);
                          setHeroSlides(updated);
                          saveToServer('mobile_app_hero_slides', updated);
                        }
                      }}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20"
                      aria-label="Delete slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROMO BANNERS */}
      {activeSubTab === 'banners' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200">
              App Promotional Banners ({banners.length})
            </h2>
            <button
              type="button"
              onClick={() => {
                setEditingBanner({
                  id: `app-banner-${Date.now()}`,
                  title: '',
                  subtitle: '',
                  imageUrl: '/images/hakkiveda_baldness_powder.jpg',
                  linkAction: 'shop',
                  displayOrder: banners.length + 1,
                  published: true,
                });
                setIsBannerModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#C5A059] text-[#0E382C] font-bold text-xs flex items-center gap-1.5 hover:bg-[#d4af37]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Banner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between"
              >
                <div className="flex gap-3">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-black/40 flex-shrink-0">
                    <img
                      src={resolveAssetUrl(banner.imageUrl)}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/hero_tribal_elders.jpg';
                      }}
                    />
                  </div>
                  <div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mb-1 ${
                        banner.published !== false
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {banner.published !== false ? 'Published' : 'Draft'}
                    </span>
                    <h3 className="font-serif text-sm font-bold text-white leading-tight">
                      {banner.title}
                    </h3>
                    {banner.subtitle && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                        {banner.subtitle}
                      </p>
                    )}
                    <span className="text-[11px] font-mono text-[#C5A059] mt-1.5 block">
                      Target: {banner.linkAction}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBanner(banner);
                      setIsBannerModalOpen(true);
                    }}
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Delete this app banner?')) {
                        const updated = banners.filter((b) => b.id !== banner.id);
                        setBanners(updated);
                        saveToServer('mobile_app_banners', updated);
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HOME SECTIONS ORDERING */}
      {activeSubTab === 'sections' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-200">
                App Home Sections Order & Visibility
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Enable, disable, or reorder homepage modules specifically for the mobile app.
              </p>
            </div>
            <button
              type="button"
              onClick={() => saveToServer('mobile_app_sections', sections)}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-[#C5A059] text-[#0E382C] font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Section Order</span>
            </button>
          </div>

          <div className="space-y-2">
            {sections.map((section, idx) => (
              <div
                key={section.id}
                className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-mono text-xs font-bold text-slate-400">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{section.name}</h4>
                    <span className="text-[10px] font-mono text-slate-500">ID: {section.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Reorder Buttons */}
                  <div className="flex items-center bg-white/10 rounded-lg p-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveSection(idx, 'up')}
                      className="p-1 text-slate-300 hover:text-white disabled:opacity-20"
                      aria-label="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === sections.length - 1}
                      onClick={() => moveSection(idx, 'down')}
                      className="p-1 text-slate-300 hover:text-white disabled:opacity-20"
                      aria-label="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Enable / Disable Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleSectionEnabled(section.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      section.enabled !== false
                        ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {section.enabled !== false ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FEATURED CATEGORIES */}
      {activeSubTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-200">
                App Featured Categories
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure which category shortcuts appear in the app's top horizontal scroll.
              </p>
            </div>
            <button
              type="button"
              onClick={() => saveToServer('mobile_app_featured_categories', featuredCategories)}
              className="px-4 py-2 rounded-xl bg-[#C5A059] text-[#0E382C] font-bold text-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Categories</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {featuredCategories.map((fc, i) => (
              <div
                key={fc.id}
                className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{fc.customTitle}</h4>
                  <span className="text-[10px] text-slate-400">
                    Category: {categories.find((c) => c.id === fc.categoryId)?.name || fc.categoryId}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = featuredCategories.map((c, idx) =>
                        idx === i ? { ...c, enabled: !c.enabled } : c
                      );
                      setFeaturedCategories(updated);
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-bold ${
                      fc.enabled ? 'bg-emerald-600/30 text-emerald-300' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {fc.enabled ? 'Active' : 'Hidden'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CURATED PRODUCTS */}
      {activeSubTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-200">
                App Curated Products Selection
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Select which existing catalog remedies appear in the App Best Sellers and Recommended carousels.
              </p>
            </div>
            <button
              type="button"
              onClick={() => saveToServer('mobile_app_featured_products', featuredProducts)}
              className="px-4 py-2 rounded-xl bg-[#C5A059] text-[#0E382C] font-bold text-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Curated Products</span>
            </button>
          </div>

          {/* Best Sellers Selection */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              App Best Sellers Carousel
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {products.map((p) => {
                const isSelected = (featuredProducts.bestSellerProductIds || []).includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      const current = featuredProducts.bestSellerProductIds || [];
                      const updatedIds = isSelected
                        ? current.filter((id) => id !== p.id)
                        : [...current, p.id];
                      setFeaturedProducts({
                        ...featuredProducts,
                        bestSellerProductIds: updatedIds,
                      });
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? 'bg-emerald-950/60 border-[#C5A059] text-white'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isSelected ? 'bg-[#C5A059] border-[#C5A059] text-[#0E382C]' : 'border-slate-500'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-400">₹{p.price}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recommended Selection */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              App Recommended For You Carousel
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {products.map((p) => {
                const isSelected = (featuredProducts.recommendedProductIds || []).includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      const current = featuredProducts.recommendedProductIds || [];
                      const updatedIds = isSelected
                        ? current.filter((id) => id !== p.id)
                        : [...current, p.id];
                      setFeaturedProducts({
                        ...featuredProducts,
                        recommendedProductIds: updatedIds,
                      });
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-400 text-white'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isSelected ? 'bg-emerald-400 border-emerald-400 text-[#0E382C]' : 'border-slate-500'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-400">₹{p.price}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* EDIT SLIDE MODAL */}
      {isSlideModalOpen && editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#122A22] border border-[#C5A059]/40 rounded-2xl w-full max-w-lg p-5 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-base font-bold text-[#FDF8EC]">
              {editingSlide.id.startsWith('app-hero-') ? 'Edit Hero Slide' : 'Add Hero Slide'}
            </h3>

            {/* Image Preview & Upload */}
            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Slide Image (16:9 phone ratio recommended)
              </label>
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-black/50 border border-white/10 mb-2">
                <img
                  src={resolveAssetUrl(editingSlide.imageUrl)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <label className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 text-white">
                <Upload className="w-3.5 h-3.5" />
                <span>{slideUploading ? 'Uploading...' : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={slideUploading}
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setSlideUploading(true);
                    try {
                      const url = await uploadAppImage(file);
                      setEditingSlide({ ...editingSlide, imageUrl: url });
                    } catch (err: any) {
                      alert(`Image upload error: ${err.message}`);
                    } finally {
                      setSlideUploading(false);
                    }
                  }}
                />
              </label>
            </div>

            {/* Title */}
            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Slide Title
              </label>
              <input
                type="text"
                value={editingSlide.title}
                onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                placeholder="e.g. 108 Sacred Forest Herbs"
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Slide Subtitle
              </label>
              <input
                type="text"
                value={editingSlide.subtitle}
                onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                placeholder="e.g. Handcrafted by Hakki-Pikki tribal elders"
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* CTA Label */}
              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={editingSlide.ctaText}
                  onChange={(e) => setEditingSlide({ ...editingSlide, ctaText: e.target.value })}
                  placeholder="e.g. Shop Now"
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none"
                />
              </div>

              {/* CTA Destination */}
              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  CTA Destination
                </label>
                <select
                  value={editingSlide.ctaDestination}
                  onChange={(e) => setEditingSlide({ ...editingSlide, ctaDestination: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E382C] border border-white/20 text-xs text-white focus:outline-none"
                >
                  <option value="shop">Shop All Remedies</option>
                  <option value="analysis">Hair Root Analysis</option>
                  {products.map((p) => (
                    <option key={p.id} value={`product:${p.id}`}>
                      Product: {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Display Order & Published */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={editingSlide.published !== false}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, published: e.target.checked })
                  }
                  className="rounded text-[#C5A059]"
                />
                <span>Published in App</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300">Order:</span>
                <input
                  type="number"
                  value={editingSlide.displayOrder}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, displayOrder: parseInt(e.target.value) || 1 })
                  }
                  className="w-16 px-2 py-1 rounded bg-white/10 text-xs text-white text-center border border-white/20"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSlideModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-white/20 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const existingIndex = heroSlides.findIndex((s) => s.id === editingSlide.id);
                  let updated: MobileAppHeroSlide[];
                  if (existingIndex >= 0) {
                    updated = [...heroSlides];
                    updated[existingIndex] = editingSlide;
                  } else {
                    updated = [...heroSlides, editingSlide];
                  }
                  setHeroSlides(updated);
                  saveToServer('mobile_app_hero_slides', updated);
                  setIsSlideModalOpen(false);
                }}
                className="px-4 py-1.5 rounded-xl bg-[#C5A059] text-[#0E382C] font-bold text-xs shadow-sm hover:bg-[#d4af37]"
              >
                Save Slide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT BANNER MODAL */}
      {isBannerModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#122A22] border border-[#C5A059]/40 rounded-2xl w-full max-w-lg p-5 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-base font-bold text-[#FDF8EC]">
              Edit Promo Banner
            </h3>

            {/* Banner Image */}
            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Banner Background Image
              </label>
              <div className="relative aspect-[3/1] rounded-xl overflow-hidden bg-black/50 border border-white/10 mb-2">
                <img
                  src={resolveAssetUrl(editingBanner.imageUrl)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <label className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 text-white">
                <Upload className="w-3.5 h-3.5" />
                <span>{bannerUploading ? 'Uploading...' : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={bannerUploading}
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setBannerUploading(true);
                    try {
                      const url = await uploadAppImage(file);
                      setEditingBanner({ ...editingBanner, imageUrl: url });
                    } catch (err: any) {
                      alert(`Image upload error: ${err.message}`);
                    } finally {
                      setBannerUploading(false);
                    }
                  }}
                />
              </label>
            </div>

            {/* Title */}
            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Banner Title
              </label>
              <input
                type="text"
                value={editingBanner.title}
                onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                placeholder="e.g. Flat ₹200 OFF on Complete Kit"
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Banner Subtitle / Code Instructions
              </label>
              <input
                type="text"
                value={editingBanner.subtitle || ''}
                onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                placeholder="e.g. Use code TRIBAL200 at checkout"
                className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none"
              />
            </div>

            {/* Link Action */}
            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Link / Action Destination
              </label>
              <select
                value={editingBanner.linkAction}
                onChange={(e) => setEditingBanner({ ...editingBanner, linkAction: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0E382C] border border-white/20 text-xs text-white focus:outline-none"
              >
                <option value="shop">Shop All Remedies</option>
                <option value="analysis">Hair Root Analysis</option>
                {products.map((p) => (
                  <option key={p.id} value={`product:${p.id}`}>
                    Product: {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Published */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={editingBanner.published !== false}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, published: e.target.checked })
                  }
                  className="rounded text-[#C5A059]"
                />
                <span>Published in App</span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsBannerModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-white/20 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const existingIndex = banners.findIndex((b) => b.id === editingBanner.id);
                  let updated: MobileAppBanner[];
                  if (existingIndex >= 0) {
                    updated = [...banners];
                    updated[existingIndex] = editingBanner;
                  } else {
                    updated = [...banners, editingBanner];
                  }
                  setBanners(updated);
                  saveToServer('mobile_app_banners', updated);
                  setIsBannerModalOpen(false);
                }}
                className="px-4 py-1.5 rounded-xl bg-[#C5A059] text-[#0E382C] font-bold text-xs shadow-sm hover:bg-[#d4af37]"
              >
                Save Banner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
