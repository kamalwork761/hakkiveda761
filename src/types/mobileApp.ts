export interface MobileAppHeroSlide {
  id: string;
  title: string;
  subtitle: string;
  eyebrow?: string;
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
  couponCode?: string;
  ctaText?: string;
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
  newArrivalProductIds?: string[];
  flagshipProductId?: string;
}

export interface MobileAppShopConcern {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  badge?: string;
  destination: string; // e.g. 'concern:hair_fall', 'quiz', 'category:cat-1'
  displayOrder: number;
  published: boolean;
}

export interface MobileAppProductOverride {
  productId: string; // Links to standard shared Product.id
  enabled: boolean;
  appTitle?: string; // App-only display title override
  appSubtitle?: string; // App short subtitle override
  appImage?: string; // App-specific primary image (1100x1100 1:1)
  appSecondaryImage?: string; // App-specific secondary image
  badge?: string; // e.g. "Best Seller", "New", "108 Herbs", "Flagship"
  cardCtaLabel?: string; // e.g. "Buy Now", "Quick Add", "Explore"
  featureOrder?: number;
  sectionAssignment?: 'all' | 'best_seller' | 'recommended' | 'featured' | 'flagship' | 'none';
  // App-specific Product Detail overrides (Requirement 10)
  appHeadline?: string;
  benefitBullets?: string[];
  quickIngredients?: string;
  usageSummary?: string;
  trustBadgeText?: string;
}

export interface MobileAppSettings {
  appName: string;
  headerTitle: string;
  headerSubtitle: string;
  contactPhone: string;
  whatsappNumber: string;
  supportEmail?: string;
  enableNotifications: boolean;
  freeDeliveryThreshold: number;
  brandAccentColor: string;
  brandDeepGreen: string;
  brandSecondaryColor?: string;
  headerLogoUrl?: string;
  splashImageUrl?: string;
  homeLogoUrl?: string;
  homeBackgroundUrl?: string;
}

export interface MobileAppMediaItem {
  id: string;
  filename: string;
  name: string;
  url: string;
  folder: 'heroes' | 'products' | 'banners' | 'categories' | 'concerns' | 'branding' | 'general';
  size: number;
  mimetype?: string;
  updatedAt: string;
}
