export interface Currency {
  code: string; // 'INR' | 'SGD' | 'MYR' | 'FJD' | 'MUR' | 'USD'
  symbol: string; // '₹' | 'S$' | 'RM' | 'FJ$' | 'Rs' | '$'
  name: string;
  rateToINR: number; // e.g. 1 INR = 1 INR, 1 USD = 83 INR -> rateToINR = 83
  country: string;
  flag: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  priceINR: number;
  originalPriceINR?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  additionalImages: string[];
  description: string;
  benefits: string[];
  ingredients: string[];
  volume: string;
  usageRitual: string;
  stock: number;
  sku: string;
  isBestseller: boolean;
  isNew: boolean;
  inStock: boolean;
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
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    billingAddress?: string;
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
  estimatedVolume: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CLOSED';
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
  mediaType?: 'IMAGE' | 'VIDEO';
  ctaText: string; // Primary CTA Text
  ctaLink: string; // Primary CTA Link
  ctaType?: 'PRODUCT' | 'CATEGORY' | 'COLLECTION' | 'QUIZ' | 'JOURNAL' | 'EXTERNAL' | 'B2B' | 'CONTACT';
  secondaryCtaText?: string; // Secondary CTA Text
  secondaryCtaLink?: string; // Secondary CTA Link
  secondaryCtaType?: 'PRODUCT' | 'CATEGORY' | 'COLLECTION' | 'QUIZ' | 'JOURNAL' | 'EXTERNAL' | 'B2B' | 'CONTACT';
  active: boolean; // Enable/Disable status
  status?: 'ACTIVE' | 'DRAFT' | 'SCHEDULED';
  startDate?: string;
  endDate?: string;
  sortOrder?: number;
  textPosition?: 'LEFT' | 'CENTER' | 'RIGHT';
  textAlignment?: 'left' | 'center' | 'right';
  overlayColor?: string; // e.g. '#0B3D2E' or '#000000'
  overlayOpacity?: number; // 0 to 100
  textColor?: string; // e.g. 'white' or '#C8A24A'
  animation?: 'fade' | 'slide' | 'zoom' | 'parallax' | 'kenburns' | 'leaves' | 'goldsweep' | 'none';
  altText?: string;
  imageTitle?: string;
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
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: { text: string; dosha: string }[];
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'IMAGE' | 'VIDEO';
  url: string;
  uploadedAt: string;
}

export interface CountrySetting {
  code: string;
  name: string;
  flag: string;
  currencyCode: string;
  enabled: boolean;
}

export interface MegaMenuColumn {
  id: string;
  title: string;
  categorySlug?: string;
  links: { label: string; url: string; badge?: string }[];
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

