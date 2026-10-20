import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  MobileAppHeroSlide,
  MobileAppBanner,
  MobileAppSectionConfig,
  MobileAppFeaturedCategory,
  MobileAppFeaturedProducts,
  MobileAppShopConcern,
  MobileAppProductOverride,
} from '../../types/mobileApp';
import { AppHeroCarousel } from '../components/AppHeroCarousel';
import { AppCategoriesScroll } from '../components/AppCategoriesScroll';
import { AppShopByConcern } from '../components/AppShopByConcern';
import { AppProductCarousel } from '../components/AppProductCarousel';
import { AppPromoBanner } from '../components/AppPromoBanner';
import { AppFlagshipFeature } from '../components/AppFlagshipFeature';
import { AppStoryCard } from '../components/AppStoryCard';
import { AppGlobalClientsCompact } from '../components/AppGlobalClientsCompact';
import { AppHairAnalysisCard } from '../components/AppHairAnalysisCard';
import { AppHomeValueSections } from '../components/AppHomeValueSections';
import { resolveAssetUrl } from '../utils/nativeUrl';

interface AppHomeScreenProps {
  heroSlides: MobileAppHeroSlide[];
  banners: MobileAppBanner[];
  sections: MobileAppSectionConfig[];
  featuredCategories?: MobileAppFeaturedCategory[];
  featuredProducts?: MobileAppFeaturedProducts;
  concerns?: MobileAppShopConcern[];
  appProductOverrides?: Record<string, MobileAppProductOverride>;
  onOpenProductDetail: (productId: string) => void;
  onNavigateToShop: (categoryId?: string, concernId?: string) => void;
  onNavigateToAnalysis: () => void;
  onOpenCareJourney: (journey: 'hair' | 'skin' | 'wellness') => void;
  onOpenGlobalCommunity: () => void;
  onOpenTrust: () => void;
  onOpenB2B: () => void;
  onActionClick: (destination: string) => void;
}

export const AppHomeScreen: React.FC<AppHomeScreenProps> = ({
  heroSlides,
  banners,
  sections,
  featuredCategories,
  featuredProducts,
  concerns,
  appProductOverrides,
  onOpenProductDetail,
  onNavigateToShop,
  onNavigateToAnalysis,
  onOpenCareJourney,
  onOpenGlobalCommunity,
  onOpenTrust,
  onOpenB2B,
  onActionClick,
}) => {
  const { products, categories } = useStore();

  // Sort sections according to displayOrder
  const sortedSections = [...sections]
    .filter((s) => s.enabled !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  // Determine Best Sellers
  const bestSellerIds = featuredProducts?.bestSellerProductIds || [];
  const bestSellerProducts =
    bestSellerIds.length > 0
      ? products.filter((p) => bestSellerIds.includes(p.id))
      : products.filter((p) => p.isBestSeller).length > 0
      ? products.filter((p) => p.isBestSeller)
      : products.slice(0, 4);

  // Determine Recommended Products
  const recommendedIds = featuredProducts?.recommendedProductIds || [];
  const recommendedProducts =
    recommendedIds.length > 0
      ? products.filter((p) => recommendedIds.includes(p.id))
      : products.slice(2, 6);

  // Flagship Product (prod-1 or configured)
  const flagshipId = featuredProducts?.flagshipProductId || 'prod-1';
  const flagshipProduct = products.find((p) => p.id === flagshipId) || products[0];
  const flagshipOverride = flagshipProduct ? appProductOverrides?.[flagshipProduct.id] : undefined;

  const renderSection = (section: MobileAppSectionConfig) => {
    switch (section.id) {
      case 'hero':
        return (
          <AppHeroCarousel
            key="hero"
            slides={heroSlides}
            onNavigateAction={onActionClick}
          />
        );

      case 'categories':
        return (
          <AppCategoriesScroll
            key="categories"
            featuredCategories={featuredCategories}
            storeCategories={categories}
            selectedCategoryId="ALL"
            onSelectCategory={(catId) => onNavigateToShop(catId)}
          />
        );

      case 'shop_by_concern':
        return (
          <AppShopByConcern
            key="shop_by_concern"
            concerns={concerns}
            onSelectConcern={(destination) => {
              if (destination.startsWith('care:')) {
                const journey = destination.replace('care:', '') as 'hair' | 'skin' | 'wellness';
                onOpenCareJourney(journey);
                return;
              }
              onNavigateToShop(undefined, destination);
            }}
          />
        );

      case 'best_sellers':
        return (
          <AppProductCarousel
            key="best_sellers"
            title="Our Best Sellers"
            subtitle="Most loved by 250,000+ customers across India"
            badge="Top Rated"
            products={bestSellerProducts}
            appProductOverrides={appProductOverrides}
            onOpenProductDetail={onOpenProductDetail}
            onSeeAll={() => onNavigateToShop()}
          />
        );

      case 'promo_banner':
        return (
          <AppPromoBanner
            key="promo_banner"
            banners={banners}
            imageUrl={section.imageUrl}
            onNavigateAction={onActionClick}
          />
        );

      case 'flagship_product':
        return (
          <AppFlagshipFeature
            key="flagship_product"
            flagshipProduct={flagshipProduct}
            override={flagshipOverride}
            onOpenProductDetail={onOpenProductDetail}
          />
        );

      case 'recommended':
        return (
          <AppProductCarousel
            key="recommended"
            title="Recommended For You"
            subtitle="Curated authentic remedies for dense holistic hair growth"
            products={recommendedProducts}
            appProductOverrides={appProductOverrides}
            onOpenProductDetail={onOpenProductDetail}
            onSeeAll={() => onNavigateToShop()}
          />
        );

      case 'hair_analysis':
        return (
          <AppHairAnalysisCard
            key="hair_analysis"
            imageUrl={section.imageUrl}
            onStartAnalysis={onNavigateToAnalysis}
          />
        );

      case 'brand_story':
        return (
          <AppStoryCard
            key="brand_story"
            imageUrl={section.imageUrl}
          />
        );

      case 'global_clients':
        return section.imageUrl ? (
          <div key="global_clients" className="w-full px-4 py-3">
            <button type="button" onClick={onOpenGlobalCommunity} className="block w-full overflow-hidden rounded-2xl active:scale-[0.99] transition-transform" aria-label="Explore our global community">
              <img src={resolveAssetUrl(section.imageUrl)} alt="HAKKIVEDA Global Tribal Community" className="block w-full h-auto" loading="lazy" />
            </button>
          </div>
        ) : (
          <AppGlobalClientsCompact key="global_clients" onOpen={onOpenGlobalCommunity} />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full pb-20 overflow-y-auto no-scrollbar">
      {sortedSections.map((sec) => renderSection(sec))}

      <AppHomeValueSections
        b2bImageUrl={banners.find((banner) => banner.published !== false && /^(b2b|private-label|wholesale)$/i.test(banner.linkAction || ''))?.imageUrl}
        onShop={() => onNavigateToShop()}
        onOpenTrust={onOpenTrust}
        onOpenB2B={onOpenB2B}
      />
    </div>
  );
};
