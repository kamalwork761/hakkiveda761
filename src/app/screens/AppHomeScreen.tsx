import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  MobileAppHeroSlide,
  MobileAppBanner,
  MobileAppSectionConfig,
  MobileAppFeaturedCategory,
  MobileAppFeaturedProducts,
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

interface AppHomeScreenProps {
  heroSlides: MobileAppHeroSlide[];
  banners: MobileAppBanner[];
  sections: MobileAppSectionConfig[];
  featuredCategories?: MobileAppFeaturedCategory[];
  featuredProducts?: MobileAppFeaturedProducts;
  onOpenProductDetail: (productId: string) => void;
  onNavigateToShop: (categoryId?: string, concernId?: string) => void;
  onNavigateToAnalysis: () => void;
  onActionClick: (destination: string) => void;
}

export const AppHomeScreen: React.FC<AppHomeScreenProps> = ({
  heroSlides,
  banners,
  sections,
  featuredCategories,
  featuredProducts,
  onOpenProductDetail,
  onNavigateToShop,
  onNavigateToAnalysis,
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

  // Flagship Product (prod-1 or first)
  const flagshipProduct = products.find((p) => p.id === 'prod-1') || products[0];

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
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
            onSelectConcern={(concernId) => onNavigateToShop(undefined, concernId)}
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
            onOpenProductDetail={onOpenProductDetail}
            onSeeAll={() => onNavigateToShop()}
          />
        );

      case 'promo_banner':
        return (
          <AppPromoBanner
            key="promo_banner"
            banners={banners}
            onNavigateAction={onActionClick}
          />
        );

      case 'flagship_product':
        return (
          <AppFlagshipFeature
            key="flagship_product"
            flagshipProduct={flagshipProduct}
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
            onOpenProductDetail={onOpenProductDetail}
            onSeeAll={() => onNavigateToShop()}
          />
        );

      case 'hair_analysis':
        return (
          <AppHairAnalysisCard
            key="hair_analysis"
            onStartAnalysis={onNavigateToAnalysis}
          />
        );

      case 'brand_story':
        return <AppStoryCard key="brand_story" />;

      case 'global_clients':
        return <AppGlobalClientsCompact key="global_clients" />;

      default:
        return null;
    }
  };

  return (
    <div className="w-full pb-20 overflow-y-auto no-scrollbar">
      {sortedSections.map((sec) => renderSection(sec.id))}
    </div>
  );
};
