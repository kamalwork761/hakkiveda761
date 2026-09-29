import React, { useState } from 'react';
import {
  X,
  Smartphone,
  ExternalLink,
  Sparkles,
  Layers,
  ShoppingBag,
  Heart,
  Search,
  Check,
  Zap,
  Info,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import {
  MobileAppHeroSlide,
  MobileAppBanner,
  MobileAppSectionConfig,
  MobileAppFeaturedCategory,
  MobileAppFeaturedProducts,
  MobileAppSettings,
  MobileAppShopConcern,
  MobileAppProductOverride,
} from '../../../types/mobileApp';
import { Product, Category } from '../../../types/store';
import { resolveAssetUrl } from '../../../app/utils/nativeUrl';
import { formatSafeINR } from '../../../app/utils/formatMoney';

interface AppPhonePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  heroSlides: MobileAppHeroSlide[];
  banners: MobileAppBanner[];
  sections: MobileAppSectionConfig[];
  featuredCategories: MobileAppFeaturedCategory[];
  featuredProducts: MobileAppFeaturedProducts;
  appSettings: MobileAppSettings;
  concerns: MobileAppShopConcern[];
  overrides: Record<string, MobileAppProductOverride>;
  products: Product[];
  categories: Category[];
}

export const AppPhonePreviewModal: React.FC<AppPhonePreviewModalProps> = ({
  isOpen,
  onClose,
  heroSlides,
  banners,
  sections,
  featuredCategories,
  featuredProducts,
  appSettings,
  concerns,
  overrides,
  products,
  categories,
}) => {
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  if (!isOpen) return null;

  const sortedSections = [...sections]
    .filter((s) => s.enabled !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const sortedHeroSlides = [...heroSlides]
    .filter((s) => s.published !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const currentHeroSlide = sortedHeroSlides[activeSlideIdx] || sortedHeroSlides[0];

  const sortedBanners = [...banners]
    .filter((b) => b.published !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const bestSellerIds = featuredProducts.bestSellerProductIds || [];
  const bestSellerProducts = bestSellerIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const flagshipProduct = products.find((p) => p.id === featuredProducts.flagshipProductId) || products[0];
  const flagshipOverride = flagshipProduct ? overrides[flagshipProduct.id] : undefined;

  const renderSectionPreview = (sectionId: string) => {
    switch (sectionId) {
      case 'hero':
        if (!currentHeroSlide) return null;
        const hasHeroText = Boolean(currentHeroSlide.title || currentHeroSlide.subtitle || currentHeroSlide.ctaText);
        return (
          <div key="hero" className="w-full relative aspect-[2/1] bg-transparent overflow-hidden">
            <img
              src={resolveAssetUrl(currentHeroSlide.imageUrl)}
              alt={currentHeroSlide.title}
              className="w-full h-full object-cover object-center"
              style={{ opacity: 1, filter: 'none', mixBlendMode: 'normal' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/hero_tribal_elders.jpg';
              }}
            />
            {/* Localized text overlay only if configured - NO full-image scrim/gradient */}
            {hasHeroText && (
              <div className="absolute inset-0 p-3 flex flex-col justify-end pointer-events-none bg-transparent">
                {currentHeroSlide.eyebrow && (
                  <span
                    className="text-[8px] font-bold uppercase tracking-wider text-[#C5A059] mb-1"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.85)' }}
                  >
                    {currentHeroSlide.eyebrow}
                  </span>
                )}
                {currentHeroSlide.title && (
                  <h3
                    className="font-serif text-xs font-bold text-white leading-tight"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.85)' }}
                  >
                    {currentHeroSlide.title}
                  </h3>
                )}
                {currentHeroSlide.subtitle && (
                  <p
                    className="text-[9px] text-white/95 line-clamp-1 mt-0.5"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.85)' }}
                  >
                    {currentHeroSlide.subtitle}
                  </p>
                )}
                <div className="mt-1.5 flex items-center justify-between">
                  {currentHeroSlide.ctaText ? (
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#C5A059] text-[#0E382C] font-bold text-[9px] shadow-sm">
                      {currentHeroSlide.ctaText}
                    </span>
                  ) : <span />}
                  <div className="flex gap-1">
                    {sortedHeroSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSlideIdx(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          activeSlideIdx === idx ? 'bg-[#0E382C]' : 'bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'categories':
        return (
          <div key="categories" className="py-2.5 bg-white border-b border-slate-100">
            <div className="flex items-center gap-2 px-3 overflow-x-auto no-scrollbar">
              {featuredCategories.filter((c) => c.enabled !== false).map((cat) => (
                <div key={cat.id} className="flex-shrink-0 flex flex-col items-center gap-1 w-14 text-center">
                  <div className="w-11 h-11 rounded-full bg-[#FAF7F2] border border-[#C5A059]/30 p-0.5 overflow-hidden">
                    <img
                      src={resolveAssetUrl(cat.imageUrl || '/images/hero_tribal_elders.jpg')}
                      alt={cat.customTitle}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/hero_tribal_elders.jpg';
                      }}
                    />
                  </div>
                  <span className="text-[9px] font-bold text-slate-800 line-clamp-1 leading-tight">
                    {cat.customTitle}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'shop_by_concern':
        return (
          <div key="shop_by_concern" className="py-2.5 px-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                Shop by Concern
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {concerns.filter((c) => c.published !== false).map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-32 p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <img
                      src={resolveAssetUrl(item.imageUrl || '/images/hakkiveda_oil_couple_herbs.jpg')}
                      alt={item.title}
                      className="w-6 h-6 rounded-md object-cover border border-[#C5A059]/30"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/hakkiveda-logo.png';
                      }}
                    />
                    {item.badge && (
                      <span className="text-[7px] font-bold text-[#C5A059] bg-[#C5A059]/10 px-1 py-0.2 rounded">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif text-[10px] font-bold text-slate-900 line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[8px] text-slate-500 line-clamp-1">
                    {item.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'best_sellers':
        return (
          <div key="best_sellers" className="py-2.5 px-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                Our Best Sellers
              </span>
              <span className="text-[9px] text-[#0E382C] font-bold">See All →</span>
            </div>
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {bestSellerProducts.map((p) => {
                const ov = overrides[p.id];
                const displayImg = ov?.appImage || p.image || p.additionalImages?.[0];
                const displayName = ov?.appTitle || p.name;
                const badge = ov?.badge || (p.isBestseller || p.isBestSeller ? 'Bestseller' : null);

                return (
                  <div
                    key={p.id}
                    className="flex-shrink-0 w-32 rounded-xl bg-white border border-slate-200/80 p-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-square w-full rounded-lg bg-slate-100 overflow-hidden mb-1.5">
                        <img
                          src={resolveAssetUrl(displayImg)}
                          alt={displayName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/hero_tribal_elders.jpg';
                          }}
                        />
                        {badge && (
                          <span className="absolute top-1 left-1 bg-[#0E382C] text-[#C5A059] text-[7px] font-bold px-1 py-0.2 rounded">
                            {badge}
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif text-[10px] font-bold text-slate-900 line-clamp-2 leading-tight">
                        {displayName}
                      </h4>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="font-bold text-[10px] text-[#0E382C]">
                        {formatSafeINR(p.priceINR || p.price || 0)}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-[#0E382C] text-[#C5A059] font-bold text-[8px]">
                        {ov?.cardCtaLabel || 'Add'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'promo_banner':
        if (sortedBanners.length === 0) return null;
        const banner = sortedBanners[0];
        return (
          <div key="promo_banner" className="px-3 py-1.5">
            <div className="relative aspect-[3/1] w-full rounded-xl overflow-hidden bg-slate-900 shadow-xs">
              <img
                src={resolveAssetUrl(banner.imageUrl)}
                alt={banner.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/hakkiveda_baldness_powder.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent p-2.5 flex flex-col justify-center">
                {banner.couponCode && (
                  <span className="text-[7px] font-bold text-[#C5A059] bg-[#0E382C] px-1 py-0.2 rounded w-max mb-0.5">
                    CODE: {banner.couponCode}
                  </span>
                )}
                <h4 className="font-serif text-[10px] font-bold text-white line-clamp-1">
                  {banner.title}
                </h4>
                <p className="text-[8px] text-slate-200 line-clamp-1 mt-0.5">
                  {banner.subtitle}
                </p>
              </div>
            </div>
          </div>
        );

      case 'flagship_product':
        if (!flagshipProduct) return null;
        const flagshipImg = flagshipOverride?.appImage || flagshipProduct.image || flagshipProduct.additionalImages?.[0];
        const flagshipTitle = flagshipOverride?.appTitle || flagshipProduct.name;
        const flagshipSubtitle = flagshipOverride?.appSubtitle || flagshipProduct.subtitle;

        return (
          <div key="flagship_product" className="p-3">
            <div className="rounded-2xl p-2.5 bg-gradient-to-b from-[#FAF7F2] to-[#F3ECE1] border border-[#C5A059]/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-bold uppercase tracking-wider text-[#0E382C]">
                  Flagship Formulation
                </span>
                <span className="text-[8px] font-bold text-[#C5A059] bg-[#0E382C] px-1.5 py-0.2 rounded-full">
                  108 Forest Herbs
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <img
                  src={resolveAssetUrl(flagshipImg)}
                  alt={flagshipTitle}
                  className="w-16 h-16 rounded-xl object-cover border border-white"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/hero_tribal_elders.jpg';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-[11px] font-bold text-slate-900 leading-tight truncate">
                    {flagshipTitle}
                  </h4>
                  <p className="text-[9px] text-slate-600 line-clamp-2 mt-0.5">
                    {flagshipSubtitle}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-bold text-[11px] text-[#0E382C]">
                      {formatSafeINR(flagshipProduct.priceINR || flagshipProduct.price || 0)}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#0E382C] text-[#FDF8EC] font-bold text-[8px]">
                      {flagshipOverride?.cardCtaLabel || 'Claim Flagship'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'hair_analysis':
        return (
          <div key="hair_analysis" className="px-3 py-1.5">
            <div className="rounded-2xl p-3 bg-[#0E382C] text-white flex items-center justify-between">
              <div>
                <span className="text-[8px] font-bold text-[#C5A059] uppercase tracking-wider block">
                  AI Scalp Root Analysis
                </span>
                <h4 className="font-serif text-xs font-bold text-white mt-0.5">
                  Get Customized Herbal Regimen
                </h4>
              </div>
              <span className="px-2 py-1 rounded-lg bg-[#C5A059] text-[#0E382C] font-bold text-[9px]">
                Start Test
              </span>
            </div>
          </div>
        );

      case 'brand_story':
        return (
          <div key="brand_story" className="p-3 bg-[#FAF7F2] border-t border-slate-200/50">
            <h4 className="font-serif text-[11px] font-bold text-[#0E382C]">
              The Hakki-Pikki Tribal Wisdom
            </h4>
            <p className="text-[9px] text-slate-600 mt-0.5 leading-relaxed">
              Every drop is handcrafted by elders deep in Pakshirajapura forest using wood-fire brass vessels.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#0c2920] border border-[#C5A059]/40 rounded-3xl max-w-4xl w-full p-6 text-white shadow-2xl flex flex-col md:flex-row gap-6 max-h-[95vh] overflow-y-auto mobile-app-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Column: Realistic Phone Mockup */}
        <div className="flex-shrink-0 flex justify-center items-center">
          <div className="w-[320px] h-[640px] rounded-[42px] bg-black p-3 shadow-2xl border-4 border-slate-700 relative flex flex-col overflow-hidden">
            {/* Top Speaker Notch & Camera */}
            <div className="absolute top-4 inset-x-0 flex justify-center z-30 pointer-events-none">
              <div className="w-20 h-4 bg-black rounded-full flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-800" />
                <span className="w-8 h-1 bg-slate-800 rounded-full" />
              </div>
            </div>

            {/* Android Screen Display */}
            <div className="flex-1 w-full bg-[#FAF7F2] rounded-[32px] overflow-hidden flex flex-col justify-between text-slate-900 select-none">
              {/* App Native Header */}
              <div className="bg-[#0E382C] px-3.5 pt-6 pb-2 text-white flex items-center justify-between border-b border-[#C5A059]/20 shadow-xs">
                <div className="flex items-center gap-2">
                  <img
                    src={resolveAssetUrl(appSettings.headerLogoUrl || '/images/hakkiveda_hv_logo.png')}
                    alt="Logo"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/hakkiveda-logo.png';
                    }}
                  />
                  <div>
                    <h2 className="font-serif text-xs font-bold text-[#FDF8EC] leading-tight">
                      {appSettings.headerTitle || 'HAKKIVEDA'}
                    </h2>
                    <span className="text-[7px] text-[#C5A059] block">
                      {appSettings.headerSubtitle || 'Tribal Ayurveda'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-white">
                  <Search className="w-3.5 h-3.5" />
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Main Scrollable View */}
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
                {sortedSections.map((sec) => renderSectionPreview(sec.id))}
              </div>

              {/* App Bottom Navigation Bar */}
              <div className="bg-white border-t border-slate-200 py-1.5 px-4 flex items-center justify-between text-slate-500">
                <span className="text-[9px] font-bold text-[#0E382C] flex flex-col items-center">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  Home
                </span>
                <span className="text-[9px] flex flex-col items-center">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Shop
                </span>
                <span className="text-[9px] flex flex-col items-center">
                  <Heart className="w-3.5 h-3.5" />
                  Quiz
                </span>
                <span className="text-[9px] flex flex-col items-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Account
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Architectural Clarity & Details */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-serif text-lg font-bold text-[#FDF8EC]">
                  Live Android Content Preview
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/15 text-white hover:bg-white/25 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              This simulator reflects real-time content configurations saved inside the Mobile App Control Center.
            </p>

            {/* Live Updates vs APK Rebuild Details */}
            <div className="mt-4 space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-1.5">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span>Changes that Update LIVE without APK Rebuild:</span>
                </span>
                <ul className="text-[11px] text-emerald-100/90 space-y-1 list-disc list-inside">
                  <li>Hero banner images, text, and destination links</li>
                  <li>Promo banners & coupon codes</li>
                  <li>Curated product groups (Best Sellers, Recommended, Flagship)</li>
                  <li>App-specific product title, subtitle, image & badge overrides</li>
                  <li>Product detail headline bullets, ingredients & rituals</li>
                  <li>Featured category tiles & Shop by Concern cards</li>
                  <li>Home screen section sequence ordering & visibility toggles</li>
                  <li>In-app header logo, subtitle, and brand theme colors</li>
                  <li>WhatsApp numbers and customer support lines</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-1.5">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-400" />
                  <span>Changes that Require APK / AAB Rebuild:</span>
                </span>
                <ul className="text-[11px] text-amber-100/90 space-y-1 list-disc list-inside">
                  <li>Android home screen launcher icon (ic_launcher.png / mipmap vector)</li>
                  <li>Native Android launch splash screen drawable resource</li>
                  <li>Capacitor plugins, native permissions, and package ID (com.hakkiveda.app)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <a
              href="/?view=app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-all"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#C5A059] text-[#0E382C] font-bold text-xs shadow-md hover:bg-[#d4af37]"
            >
              Done Previewing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
