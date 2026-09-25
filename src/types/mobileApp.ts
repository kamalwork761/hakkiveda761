export interface MobileAppHeroSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaDestination: string; // 'shop' | 'analysis' | 'product:<id>' | 'category:<id>'
  displayOrder: number;
  published: boolean;
}

export interface MobileAppBanner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkAction: string; // 'shop' | 'analysis' | 'product:<id>' | 'category:<id>'
  displayOrder: number;
  published: boolean;
}

export type MobileAppSectionId =
  | 'hero'
  | 'categories'
  | 'shop_by_concern'
  | 'best_sellers'
  | 'promo_banner'
  | 'flagship_product'
  | 'recommended'
  | 'hair_analysis'
  | 'brand_story'
  | 'global_clients';

export interface MobileAppSectionConfig {
  id: MobileAppSectionId;
  name: string;
  enabled: boolean;
  displayOrder: number;
}

export interface MobileAppFeaturedCategory {
  id: string;
  categoryId: string; // Matches Category.id or 'ALL'
  customTitle: string;
  imageUrl?: string;
  icon?: string;
  displayOrder: number;
  enabled: boolean;
}

export interface MobileAppFeaturedProducts {
  bestSellerProductIds: string[];
  recommendedProductIds: string[];
  featuredProductIds: string[];
}

export interface MobileAppSettings {
  appName: string;
  headerTitle: string;
  headerSubtitle: string;
  contactPhone: string;
  whatsappNumber: string;
  enableNotifications: boolean;
  freeDeliveryThreshold: number;
  brandAccentColor: string;
  brandDeepGreen: string;
}
