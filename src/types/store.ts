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
  image: string;
  description: string;
  itemCount: number;
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
  };
  paymentMethod: 'RAZORPAY' | 'COD' | 'INTERNATIONAL_PREPAID';
  paymentStatus: 'PAID' | 'PENDING' | 'COD_DUE';
  trackingStatus: 'ORDER_PLACED' | 'PROCESSING' | 'DISPATCHED' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  trackingNumber: string;
  courierName: string;
  estimatedDeliveryDate: string;
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
  tag: string;
  title: string;
  highlightText: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
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

export interface NavLink {
  id: string;
  label: string;
  url: string;
  isExternal?: boolean;
  isModal?: boolean;
  modalType?: 'QUIZ' | 'B2B' | 'WISHLIST';
  visible: boolean;
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

