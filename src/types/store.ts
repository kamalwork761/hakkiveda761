export interface Currency {
  code: string; // 'INR' | 'SGD' | 'MYR' | 'FJD' | 'MUR' | 'USD'
  symbol: string; // '₹' | 'S$' | 'RM' | 'FJ$' | 'Rs' | '$'
  name: string;
  rateToINR: number; // e.g. 1 INR = 1 INR, 1 USD = 83 INR -> rateToINR = 83
  country: string;
  flag: string;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "100 ml", "200 ml", "500 ml", "1 L", "150 g", "Small"
  sku: string;
  priceINR: number;
  originalPriceINR?: number;
  stock: number;
  weight?: string;
  size?: string;
  image?: string;
  active?: boolean;
}

export interface ProductDetailAttribute {
  label: string;
  value: string;
}

export interface ProductGalleryItem {
  id: string;
  url: string;
  altText?: string;
  active?: boolean;
  sortOrder?: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  primaryCategory?: 'hair-care' | 'skin-care' | 'tribal-wellness' | string;
  subcategory?: string;
  subtitle: string;
  priceINR: number;
  originalPriceINR?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  additionalImages: string[];
  galleryItems?: ProductGalleryItem[];
  description: string;
  shortDescription?: string;
  fullDescription?: string;
  benefits: string[];
  ingredients: string[];
  volume: string;
  usageRitual: string;
  stock: number;
  sku: string;
  isBestseller: boolean;
  featuredBestSeller?: boolean;
  isNew: boolean;
  inStock: boolean;
  status?: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  displayOrder?: number;
  countryOfOrigin?: string;
  
  // Variants & Detail Sections
  variants?: ProductVariant[];
  selectedVariant?: ProductVariant;
  howToUse?: string[];
  whoItIsFor?: string[];
  safetyPrecautions?: string[];
  storageInstructions?: string;
  shippingAndDelivery?: string;
  returnsPolicy?: string;
  productAttributes?: ProductDetailAttribute[];

  // Related Products
  relatedProductIds?: string[];
  relatedProductsMode?: 'auto' | 'manual';

  // SEO & Social Meta
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoMetaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string; // Thumbnail
  imageFilename?: string;
  desktopBanner?: string;
  desktopBannerFilename?: string;
  mobileBanner?: string;
  mobileBannerFilename?: string;
  description: string; // Short Description
  fullDescription?: string; // Rich Text Description
  itemCount: number;
  status: 'ACTIVE' | 'DRAFT' | 'HIDDEN';
  showInNav?: boolean;
  showOnHomepage?: boolean;
  isFeatured?: boolean;
  parentId?: string | null;
  sortOrder?: number;
  seoTitle?: string;
  seoMetaDescription?: string;
  seoKeywords?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface SavedAddress {
  id: string;
  title: string; // 'Home' | 'Office' | 'Other'
  name: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  provider: 'RAZORPAY' | 'STRIPE' | 'PAYPAL' | 'COD';
  title: string;
  details: string; // e.g. '•••• 4242' or 'rajesh@upi'
  isDefault: boolean;
}

export interface LoginActivity {
  id: string;
  timestamp: string;
  ipLocation: string;
  device: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  addresses: SavedAddress[];
  savedPayments?: PaymentMethod[];
  isAdmin: boolean;
  status: 'ACTIVE' | 'BLOCKED';
  createdAt: string;
  lastLogin: string;
  loginHistory?: LoginActivity[];
  loyaltyPoints?: number;
  referralCode?: string;
  preferences?: {
    country: string;
    currency: string;
    language: string;
    emailOrders: boolean;
    whatsappUpdates: boolean;
    promotional: boolean;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  totalAmountINR: number;
  currencyCode: string;
  convertedTotal: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    phoneCode?: string;
    localPhone?: string;
    altPhone?: string;
    address: string;
    line1?: string;
    line2?: string;
    landmark?: string;
    companyName?: string;
    taxNumber?: string;
    city: string;
    state: string;
    country: string;
    countryCode?: string;
    pincode: string;
    isBillingSame?: boolean;
    billingName?: string;
    billingPhone?: string;
    billingAddress?: string;
    billingLine1?: string;
    billingLine2?: string;
    billingCity?: string;
    billingState?: string;
    billingPincode?: string;
    billingCountry?: string;
  };
  paymentMethod: 'RAZORPAY' | 'COD' | 'INTERNATIONAL_PREPAID' | string;
  paymentStatus: 'PAID' | 'PENDING' | 'COD_DUE' | 'REFUNDED' | 'FAILED' | string;
  trackingStatus: 'ORDER_PLACED' | 'PROCESSING' | 'DISPATCHED' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | string;
  trackingNumber: string;
  courierName: string;
  estimatedDeliveryDate: string;
  subtotalINR?: number;
  discountINR?: number;
  shippingChargesINR?: number;
  taxINR?: number;
  customerNotes?: string;
  adminNotes?: string;
  timeline?: {
    status: string;
    label: string;
    timestamp: string;
    completed: boolean;
  }[];
  // Shiprocket integration fields
  shiprocketOrderId?: string | number;
  shipmentId?: string | number;
  awbCode?: string;
  trackingUrl?: string;
  shipmentStatus?: string;
  pickupScheduledDate?: string;
  labelUrl?: string;
  invoiceUrl?: string;
  displayAmount?: number;
  displayCurrency?: string;
  chargeAmount?: number;
  chargeCurrency?: string;
  exchangeRateUsed?: number;
  settlementCurrency?: string;
  stockRestored?: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'PERCENT' | 'FLAT';
  value: number; // percent e.g. 15 or flat INR e.g. 500
  minOrderINR: number;
  isActive: boolean;
}

export interface B2BLead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  businessType?: string;
  productsInterested?: string;
  estimatedVolume?: string;
  targetMarket?: string;
  preferredContactMethod?: 'WhatsApp' | 'Phone' | 'Email';
  message: string;
  status: 'NEW' | 'CONTACTED' | 'NEGOTIATING' | 'SAMPLE_REQUESTED' | 'CONVERTED' | 'CLOSED' | 'QUALIFIED';
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  location: string;
  customerImage?: string;
  status?: 'APPROVED' | 'PENDING' | 'REJECTED';
  approved?: boolean;
  featured?: boolean;
  images?: string[];
  videos?: string[];
}

export interface BeforeAfterItem {
  id: string;
  title: string;
  days: number;
  concern: string;
  beforeImage: string;
  afterImage: string;
  testimonial: string;
  author: string;
  location: string;
  description?: string;
  customerName?: string;
  treatmentDuration?: string;
  active?: boolean;
  showOnHomepage?: boolean;
  sortOrder?: number;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
  scheduledDate?: string;
  gallery?: string[];
  tags?: string[];
  seoTitle?: string;
  metaDescription?: string;
  relatedProducts?: string[];
  relatedArticles?: string[];
}

export interface HeroSlide {
  id: string;
  tag: string; // Badge text e.g. "AUTHENTIC HAKKI-PIKKI SECRET"
  smallHeading?: string; // Small Heading above main title
  title: string; // Main Title
  highlightText: string; // Highlighted Gold Text
  subtitle: string; // Description / Subtitle
  image: string; // Desktop Hero Image
  imageFilename?: string;
  mobileImage?: string; // Mobile Hero Image
  mobileImageFilename?: string;
  backgroundVideo?: string; // Optional Background Video (MP4/WebM)
  backgroundVideoFilename?: string;
  mediaType?: 'IMAGE' | 'VIDEO' | 'image' | 'video';
  mediaUrl?: string;
  ctaText: string; // Primary CTA Text
  ctaLink: string; // Primary CTA Link
  ctaType?: 'PRODUCT' | 'CATEGORY' | 'COLLECTION' | 'QUIZ' | 'JOURNAL' | 'EXTERNAL' | 'B2B' | 'CONTACT';
  secondaryCtaText?: string; // Secondary CTA Text
  secondaryCtaLink?: string; // Secondary CTA Link
  secondaryCtaType?: 'PRODUCT' | 'CATEGORY' | 'COLLECTION' | 'QUIZ' | 'JOURNAL' | 'EXTERNAL' | 'B2B' | 'CONTACT';
  active: boolean; // Enable/Disable status
  enabled?: boolean;
  status?: 'ACTIVE' | 'DRAFT' | 'SCHEDULED';
  startDate?: string;
  endDate?: string;
  sortOrder?: number;
  textPosition?: 'LEFT' | 'CENTER' | 'RIGHT';
  textAlignment?: 'left' | 'center' | 'right';
  overlayColor?: string; // e.g. 'var(--brand-primary-dark)' or '#000000'
  overlayOpacity?: number; // 0 to 100
  textColor?: string; // e.g. 'white' or 'var(--brand-gold)'
  animation?: 'fade' | 'slide' | 'zoom' | 'parallax' | 'kenburns' | 'leaves' | 'goldsweep' | 'none';
  altText?: string;
  imageTitle?: string;
  // 3D Layered Foreground Overflow Effect
  enable3dOverflow?: boolean;
  foregroundCutoutUrl?: string; // Transparent PNG / WebP / SVG cutout
  foregroundCutoutFilename?: string;
  desktopPosX?: number; // Horizontal position % or px offset
  desktopPosY?: number; // Vertical offset
  desktopWidth?: number; // Width in px on desktop
  desktopBottomOverflow?: number; // Pixels extending below bottom boundary on desktop (e.g. 140px)
  mobilePosX?: number; // Horizontal position % on mobile
  mobilePosY?: number; // Vertical offset on mobile
  mobileWidth?: number; // Width in px on mobile
  mobileBottomOverflow?: number; // Pixels extending below bottom boundary on mobile (e.g. 60px)
  disableMobileOverflow?: boolean; // Option to disable overflow on mobile devices
  impressions?: number;
  clicks?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface HeroSliderSettings {
  autoPlay: boolean;
  autoPlayDelay: number; // in seconds
  transitionSpeed: number; // in ms
  pauseOnHover: boolean;
  infiniteLoop: boolean;
  swipeSupport: boolean;
}

export interface QuizResultData {
  summary: string;
  doshaType: string;
  recommendationTitle?: string;
  recommendedProductIds?: string[];
  recommendedRoutine: string[];
  keyHerbs: string[];
  estimatedResultsWeeks: number;
}

export interface TestimonialVideo {
  id: string;
  customerName: string;
  location: string;
  rating: number;
  videoUrl: string;
  thumbnail: string;
  reviewText: string;
  title?: string;
  category?: 'Preparation' | 'Application' | 'Herbal Ritual' | 'Product Guide' | string;
  duration?: string;
  customerPhoto?: string;
  country?: string;
  productUsed?: string;
  featured?: boolean;
  sortOrder?: number;
  active?: boolean;
  showOnHomepage?: boolean;
}

export interface QuizOption {
  id?: string;
  text: string;
  image?: string;
  dosha?: string;
  score?: number;
  hairType?: string;
  scalpCondition?: string;
  recommendedProductIds?: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  subtitle?: string;
  type?: 'single' | 'multiple' | 'text' | 'image';
  options: QuizOption[];
  conditionalLogic?: {
    dependsOnQuestionId?: string;
    dependsOnOptionIndex?: number;
  };
  sortOrder?: number;
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'IMAGE' | 'VIDEO';
  url: string;
  uploadedAt: string;
}

export type PaymentGatewayId = 'RAZORPAY' | 'STRIPE' | 'PAYPAL' | 'PHONEPE' | 'UPI' | 'COD';

export interface PaymentGatewayConfig {
  id: PaymentGatewayId;
  name: string;
  enabled: boolean;
  mode: 'TEST' | 'LIVE';
  liveApiKey: string;
  liveSecretKey: string;
  testApiKey: string;
  testSecretKey: string;
  webhookStatus: 'ACTIVE' | 'PENDING' | 'DISCONNECTED' | 'SYNCED';
  webhookUrl?: string;
  lastTestedAt?: string;
  connectionStatus?: 'CONNECTED' | 'FAILED' | 'UNTESTED';
  supportedCurrencies: string[];
  sortOrder: number;
  description: string;
  badgeText?: string;
}

export interface CodRulesConfig {
  enabled: boolean;
  indiaOnly: boolean;
  minOrderINR: number;
  maxOrderINR: number;
  codFeeINR: number;
}

export interface MarketPaymentGatewayMapping {
  marketId: string;
  countryCode: string; // 'IN' | 'SG' | 'MY' | 'MU' | 'FJ' | 'AE' | 'SA' | 'NP' | 'INT'
  marketName: string;
  currencyCode: string;
  gateways: PaymentGatewayId[];
}

export interface PaymentLog {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  gateway: PaymentGatewayId;
  amount: number;
  currency: string;
  amountINR: number;
  status: 'SUCCESSFUL' | 'PENDING' | 'FAILED' | 'REFUNDED';
  transactionId: string;
  paymentMethodDetails?: string;
  createdAt: string;
  errorMessage?: string;
  refundId?: string;
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: string;
}

export interface Market {
  id: string;
  name: string;
  code: string; // e.g. 'IN', 'SG', 'MY', 'MU', 'FJ', 'AE', 'SA', 'NP', 'INT'
  currencyCode: string;
  shippingRule: 'COD_AND_PREPAID' | 'PREPAID_ONLY' | 'BLOCK_ORDERS';
  paymentGateways: PaymentGatewayId[];
  freeShippingThreshold: number;
  enabled: boolean;
  includedCountriesCount?: number;
}

export interface CountrySetting {
  code: string;
  name: string;
  flag: string;
  currencyCode: string;
  enabled: boolean;
  region: string; // 'Asia' | 'GCC' | 'Europe' | 'Africa' | 'North America' | 'South America' | 'Oceania' | 'Antarctica'
  marketId: string;
  shippingRule: 'COD_AND_PREPAID' | 'PREPAID_ONLY' | 'BLOCK_ORDERS';
  paymentRule: 'COD_AND_PREPAID' | 'PREPAID_ONLY' | 'BLOCK_ORDERS';
}

export interface MegaMenuLink {
  id?: string;
  label: string;
  url: string;
  badge?: 'NEW' | 'HOT' | 'SALE' | 'B2B' | 'CUSTOM' | 'NONE' | string;
  badgeCustomText?: string;
  enabled?: boolean;
  imageUrl?: string;
  sortOrder?: number;
}

export interface MegaMenuColumn {
  id: string;
  title: string;
  categorySlug?: string;
  enabled?: boolean;
  sortOrder?: number;
  links: MegaMenuLink[];
}

export interface GalleryImageItem {
  id: string;
  url: string;
  filename?: string;
  title?: string;
  altText?: string;
  sortOrder?: number;
}

export interface TribalHeritagePageContent {
  // Hero Image
  desktopHeroImage?: string;
  desktopHeroFilename?: string;
  mobileHeroImage?: string;
  mobileHeroFilename?: string;

  // Story Content
  mainHeading?: string;
  smallHeading?: string;
  richText?: {
    paragraphs: string[];
    lists: string[];
    quotes: string[];
    highlightText: string;
  };

  // Gallery
  gallery?: GalleryImageItem[];

  // Optional Video
  videoMp4Url?: string;
  videoYoutubeUrl?: string;

  // CTA
  ctaText?: string;
  ctaLink?: string;

  // SEO
  seoAltText?: string;
  seoImageTitle?: string;
}

export interface MegaMenuConfig {
  enabled: boolean;
  featuredImageUrl?: string;
  featuredImageTitle?: string;
  featuredImageSubtitle?: string;
  featuredImageLink?: string;
  featuredProductId?: string;
  columns: MegaMenuColumn[];
}

export interface NavLink {
  id: string;
  label: string;
  url: string;
  parentId?: string | null;
  linkType?: 'HOMEPAGE' | 'PRODUCT' | 'CATEGORY' | 'COLLECTION' | 'QUIZ' | 'JOURNAL' | 'CONTACT' | 'B2B' | 'EXTERNAL';
  openInNewTab?: boolean;
  isExternal?: boolean;
  isModal?: boolean;
  modalType?: 'QUIZ' | 'B2B' | 'WISHLIST';
  visible: boolean;
  icon?: string;
  badge?: 'NEW' | 'HOT' | 'SALE' | 'B2B' | 'CUSTOM' | 'NONE';
  badgeCustomText?: string;
  
  // Visibility
  showOnDesktop?: boolean;
  showOnTablet?: boolean;
  showOnMobile?: boolean;
  
  // User Visibility
  userVisibility?: 'EVERYONE' | 'GUEST' | 'CUSTOMER' | 'ADMIN';
  
  // Country Visibility (e.g. ['IN', 'US', 'AE'], empty = ALL)
  allowedCountries?: string[];
  
  // Schedule
  status?: 'ACTIVE' | 'DRAFT' | 'SCHEDULED';
  startDate?: string;
  endDate?: string;
  
  // Mega Menu
  megaMenu?: MegaMenuConfig;

  // Page Content Manager
  pageContent?: TribalHeritagePageContent;
  
  // Ordering & Analytics
  sortOrder?: number;
  clicks?: number;
  impressions?: number;
}

export interface HeaderLayoutSettings {
  showLogo: boolean;
  showSearch: boolean;
  showCountrySelector: boolean;
  showWishlist: boolean;
  showAccount: boolean;
  showCart: boolean;
  showMenu: boolean;
  hoverStyle: 'underline' | 'gold_line' | 'glow' | 'none';
  headerLayout: 'standard' | 'centered' | 'compact';
}

export interface BrandIdentityConfig {
  // 1. Logo Management
  headerHvLogo?: string;
  headerHvLogoFilename?: string;
  mainLogoLight?: string;
  mainLogoDark?: string;
  mobileLogo?: string;
  footerLogo?: string;
  adminLogo?: string;
  emailLogo?: string;
  favicon?: string;
  appleTouchIcon?: string;
  svgLogo?: string;
  transparentLogo?: string;

  // 2. Brand Identity
  brandName: string;
  brandSubtitle: string;
  brandInitials: string;
  brandDescription: string;
  companyMotto: string;

  // 3. Brand Colours
  primaryColor: string; // Default: #3AA91F
  secondaryGold: string; // Default: #D4AF37
  backgroundColor: string; // Default: #0B1D13
  textColor: string; // Default: #F8FAFC
  accentColor: string; // Default: #10B981
  buttonColor: string; // Default: #D4AF37
  hoverColor: string; // Default: #B8962E
  borderColor: string; // Default: rgba(212, 175, 55, 0.3)

  // 4. Typography
  headingFont: string;
  bodyFont: string;
  buttonFont: string;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';

  // 5. Theme Manager
  themeMode: 'light' | 'dark' | 'auto';

  // 6. Brand Animation
  enableLoadingAnimation: boolean;
  animationType: 'fade' | 'pulse' | 'gold_glow' | 'spin_emblem' | 'shimmer';
  animationDuration: number;
  introSoundEnabled: boolean;

  // 7. Social Branding
  socialFacebook: string;
  socialInstagram: string;
  socialYoutube: string;
  socialWhatsapp: string;
  socialLinkedin: string;
  socialTwitter: string;

  // 8. Browser & PWA Branding
  browserTitle: string;
  themeColor: string;
  pwaIcon192?: string;
  pwaIcon512?: string;

  // 9. Email Branding
  emailHeaderLogo?: string;
  emailFooterLogo?: string;
  emailAccentColor: string;
  emailSignature: string;

  // 10. Brand Assets
  brandGuidelinesPdf?: string;
  brandGuidelinesFilename?: string;
  watermarkLogo?: string;
  whiteLogo?: string;
  blackLogo?: string;
}

export interface SiteSettings {
  // Announcement Bar
  announcementText: string;
  announcementActive: boolean;
  announcementBgColor: string;
  announcementTextColor: string;

  // Logo & Branding
  logoText: string;
  logoSubtext: string;
  logoInitials: string;
  headerHvLogo?: string;
  logoImageUrl?: string;

  // Contact Info
  companyName: string;
  address: string;
  phone: string;
  whatsappNumber: string;
  email: string;

  // Hero Section CTA
  heroCtaText: string;
  heroCtaLink: string;

  // Footer Settings
  footerAbout: string;
  footerCopyright: string;

  // SEO & Website Settings
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  maintenanceMode: boolean;

  // Shipping & Payments
  freeShippingThresholdINR: number;
  codEnabled: boolean;
  razorpayKeyId: string;
  expressCourierPartner: string;

  // Quiz Settings
  quizHeadline: string;
  quizSubtitle: string;
}

export interface FooterNavLink {
  id: string;
  label: string;
  url: string;
  isExternal?: boolean;
  isBadge?: boolean;
  badgeText?: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  enabled: boolean;
  links: FooterNavLink[];
}

export interface FooterShippingItem {
  id: string;
  text: string;
  icon?: string;
}

export interface FooterSocialLink {
  id: string;
  platform: 'facebook' | 'instagram' | 'youtube' | 'whatsapp' | 'twitter' | 'linkedin';
  url: string;
  enabled: boolean;
}

export interface FooterPaymentMethods {
  upi: boolean;
  visa: boolean;
  mastercard: boolean;
  rupay: boolean;
  netbanking: boolean;
  cod: boolean;
  paypal: boolean;
}

export interface MobileFooterConfig {
  enabled?: boolean;
  showWarningSection?: boolean;
  warningHeading?: string;
  warningLines?: string[];
  copyrightText?: string;
  sloganText?: string;
  scrollToTopEnabled?: boolean;
}

export interface FooterConfig {
  showBrandColumn: boolean;
  brandLogo: string;
  brandLogoText: string;
  brandDescription: string;
  address: string;
  phone: string;
  whatsappNumber: string;
  email: string;

  columns: FooterColumn[];

  showShippingColumn: boolean;
  shippingTitle: string;
  shippingItems: FooterShippingItem[];
  shippingPolicyButtonText: string;
  shippingPolicyModalContent: string;
  wholesaleLinkText: string;

  showNewsletterColumn: boolean;
  newsletterHeading: string;
  newsletterSubtext: string;
  newsletterPlaceholder: string;
  newsletterButtonText: string;
  newsletterSuccessMessage: string;

  showSocialLinks: boolean;
  socialLinks: FooterSocialLink[];

  showPaymentBadges: boolean;
  paymentBadgesTitle: string;
  paymentMethods: FooterPaymentMethods;

  copyrightText: string;
  showSoundToggle: boolean;
  showBottomLinks: boolean;
  bottomLinks: FooterNavLink[];

  mobileFooter?: MobileFooterConfig;
}

export interface B2BFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
  sortOrder: number;
}

export interface B2BSectionTheme {
  backgroundColor: string;
  overlayColor: string;
  overlayOpacity: number;
  textColor: string;
  buttonColor: string;
}

export interface B2BSectionConfig {
  enabled: boolean;
  bannerImage: string;
  backgroundImage: string;
  badgeText: string;
  heading: string;
  subheading: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  features: B2BFeature[];
  selectedProductIds: string[];
  showcaseTitle: string;
  showcaseSubtitle: string;
  supportedCountries: string[];
  theme: B2BSectionTheme;
}

export interface HomepageQuizBannerConfig {
  enabled: boolean;
  desktopBanner: string;
  desktopBannerFilename?: string;
  mobileBanner: string;
  mobileBannerFilename?: string;
  heading: string;
  subheading: string;
  description: string;
  ctaText: string;
  ctaAction: 'OPEN_QUIZ' | string;
  imageFit?: 'contain' | 'cover';
  desktopFocalPoint?: string;
  mobileFocalPoint?: string;
  imageAlignment?: 'center' | 'left' | 'right';
  buttonPosition?: 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center-left' | 'center' | 'center-right' | 'top-left' | 'top-center' | 'top-right' | string;
}

export type VideoPopupFrequency = 'ONCE_PER_SESSION' | 'EVERY_3_DAYS' | 'EVERY_7_DAYS' | 'ALWAYS' | 'DISABLED';

export interface VideoPopupConfig {
  enabled: boolean;
  frequency: VideoPopupFrequency;
  delaySeconds: number;
  videoUrl: string;
  posterUrl: string;
  heading: string;
  description: string;
  ctaText: string;
  ctaDestination: string;
  linkedProductId?: string;
  startDate?: string;
  endDate?: string;
  enableDesktop: boolean;
  enableMobile: boolean;
}

export interface ShoppableReel {
  id: string;
  title: string;
  videoUrl: string;
  posterUrl: string;
  customerName: string;
  country: string;
  caption: string;
  verifiedBadge: boolean;
  linkedProductId: string;
  showViewProductButton: boolean;
  showAddToCartButton: boolean;
  showBuyNowButton: boolean;
  showWhatsappButton: boolean;
  active: boolean;
  sortOrder: number;
}

export interface ShiprocketSettings {
  enabled: boolean;
  autoCreateOrder: boolean;
  autoGenerateAwb: boolean;
  autoSchedulePickup: boolean;
  pickupPincode: string;
  defaultLengthCm: number;
  defaultWidthCm: number;
  defaultHeightCm: number;
  defaultWeightKg: number;
  courierPreference: 'SURFACE' | 'EXPRESS' | 'LOWEST_COST';
  codEnabled: boolean;
  codFeeINR: number;
  codMinAmountINR: number;
  codMaxAmountINR: number;
}

export interface CategoryPageSectionItem {
  id?: string;
  q?: string;
  a?: string;
  title?: string;
  desc?: string;
  author?: string;
  rating?: number;
}

export interface CategoryPageSection {
  id: string;
  type: 'routine' | 'quiz' | 'reviews' | 'faq' | 'safety' | 'story' | 'custom' | string;
  title: string;
  subtitle?: string;
  content?: string;
  enabled: boolean;
  displayOrder: number;
  items?: CategoryPageSectionItem[];
}

export interface CategoryPageConfig {
  id: string; // 'hair-care' | 'skin-care' | 'tribal-wellness'
  slug: string; // 'hair-care' | 'skin-care' | 'tribal-wellness'
  categoryName: string; // e.g. "Hair Care"
  enabled: boolean;
  title: string;
  shortDescription: string;
  cardImage: string;
  cardCtaText: string;
  desktopHeroImage: string;
  mobileHeroImage: string;
  heroVideo?: string;
  heroFocalPoint?: 'center' | 'left' | 'right' | 'top' | 'bottom';
  heroObjectFit?: 'cover' | 'contain';
  heroHeightDesktop?: string;
  heroHeightMobile?: string;
  heroOverlayOpacity: number; // 0 to 100
  heroTextColor: string;
  ctaText: string;
  ctaLink: string;
  displayOrder: number;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  sections: CategoryPageSection[];
}

export type MobileNavBadgeType = 'gold' | 'green' | 'amber' | 'red' | 'purple';

export interface MobileNavChildLink {
  id: string;
  label: string;
  route: string;
  icon?: string;
  enabled: boolean;
  sortOrder: number;
  badge?: 'NONE' | 'NEW' | 'HOT' | 'SALE' | 'B2B' | 'CUSTOM';
  badgeText?: string;
  badgeType?: MobileNavBadgeType;
  openInNewTab?: boolean;
  isModal?: boolean;
  modalType?: 'quiz' | 'auth' | 'wishlist' | 'shipping' | 'faq' | 'b2b';
}

export interface MobileNavItem {
  id: string;
  type: 'STATIC' | 'CATEGORY_GROUP' | 'ACCORDION' | 'LINK' | 'CUSTOM';
  label: string;
  route: string;
  icon?: string;
  enabled: boolean;
  sortOrder: number;
  badge?: 'NONE' | 'NEW' | 'HOT' | 'SALE' | 'B2B' | 'CUSTOM';
  badgeText?: string;
  badgeType?: MobileNavBadgeType;
  openInNewTab?: boolean;
  isModal?: boolean;
  modalType?: 'quiz' | 'auth' | 'wishlist' | 'cart' | 'b2b' | 'faq' | 'shipping';
  isAccordion?: boolean;
  children?: MobileNavChildLink[];
}

export interface MobileNavCategoryOverride {
  show?: boolean;
  customLabel?: string;
  customIcon?: string;
  sortOrder?: number;
  showSubcategories?: boolean;
}

export interface MobileNavCategorySettings {
  showCategories: boolean;
  showSubcategories: boolean;
  categoryOverrides: Record<string, MobileNavCategoryOverride>;
}

export interface MobileNavSocialLink {
  id: string;
  platform: 'facebook' | 'instagram' | 'youtube' | 'whatsapp' | 'twitter' | 'linkedin';
  url: string;
  enabled: boolean;
  sortOrder: number;
}

export interface MobileNavAuthBarConfig {
  show: boolean;
  signInText: string;
  registerText: string;
  accountText: string;
  logoutText: string;
}

export interface MobileNavConfig {
  enabled: boolean;
  bottomNavEnabled?: boolean;
  authBar: MobileNavAuthBarConfig;
  categorySettings: MobileNavCategorySettings;
  menuItems: MobileNavItem[];
  socialLinks: MobileNavSocialLink[];
  copyrightText: string;
}

export interface HomepageEditorialSectionItem {
  id: string;
  enabled: boolean;
  eyebrow: string;
  heading: string;
  description: string;
  image: string;
  imageAlt?: string;
  ctaText: string;
  ctaLink: string;
}

export interface HomepageEditorialConfig {
  section1: HomepageEditorialSectionItem; // OUR ROOTS -> ROOTED IN TRIBAL WISDOM -> /our-tribal-roots
  section2: HomepageEditorialSectionItem; // OUR CRAFT -> INSIDE HAKKIVEDA -> /how-hakkiveda-is-made
  section3: HomepageEditorialSectionItem; // OUR JOURNEY -> THE HAKKIVEDA STORY -> /our-story
}


