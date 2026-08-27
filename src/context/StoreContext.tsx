import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Product,
  ProductVariant,
  Category,
  CartItem,
  Currency,
  Order,
  User,
  SavedAddress,
  Coupon,
  B2BLead,
  Review,
  BeforeAfterItem,
  BlogArticle,
  HeroSlide,
  HeroSliderSettings,
  SiteSettings,
  BrandIdentityConfig,
  NavLink,
  HeaderLayoutSettings,
  TestimonialVideo,
  QuizQuestion,
  MediaItem,
  CountrySetting,
  Market,
  PaymentGatewayConfig,
  CodRulesConfig,
  MarketPaymentGatewayMapping,
  PaymentLog,
  PaymentGatewayId,
  FooterConfig,
  B2BSectionConfig,
  VideoPopupConfig,
  ShoppableReel,
  ShiprocketSettings,
  CategoryPageConfig,
  HomepageQuizBannerConfig,
  MobileNavConfig,
  HomepageEditorialConfig,
} from '../types/store';
import {
  INITIAL_CURRENCIES,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_HERO_SLIDES,
  INITIAL_BEFORE_AFTER,
  INITIAL_REVIEWS,
  INITIAL_BLOGS,
  INITIAL_COUPONS,
  INITIAL_ADMIN_USER,
  INITIAL_CUSTOMER_ACCOUNTS,
  INITIAL_ORDERS,
  INITIAL_SITE_SETTINGS,
  INITIAL_BRAND_IDENTITY,
  INITIAL_NAV_LINKS,
  INITIAL_HEADER_LAYOUT_SETTINGS,
  INITIAL_TESTIMONIAL_VIDEOS,
  INITIAL_QUIZ_QUESTIONS,
  INITIAL_MEDIA_ITEMS,
  INITIAL_COUNTRIES,
  INITIAL_MARKETS,
  INITIAL_PAYMENT_GATEWAYS,
  INITIAL_COD_RULES,
  INITIAL_MARKET_GATEWAYS,
  INITIAL_PAYMENT_LOGS,
  INITIAL_FOOTER_CONFIG,
  INITIAL_B2B_SECTION_CONFIG,
  INITIAL_VIDEO_POPUP_CONFIG,
  INITIAL_SHOPPABLE_REELS,
  INITIAL_CATEGORY_PAGES,
  INITIAL_HOMEPAGE_QUIZ_BANNER_CONFIG,
  INITIAL_MOBILE_NAV_CONFIG,
  INITIAL_HOMEPAGE_EDITORIAL_CONFIG,
} from '../data/initialData';
import { idbGet, idbSet, idbClear } from '../utils/idbStorage';
import { CountryItem, DEFAULT_COUNTRY } from '../data/countriesData';

import { soundManager } from '../utils/soundManager';
import { SoundType, SoundPackId } from '../config/soundConfig';

interface StoreContextType {
  // Sound System (UI Clicks & Chimes)
  soundEnabled: boolean;
  soundVolume: number;
  soundPack: SoundPackId;
  adminMutedSound: boolean;
  toggleSound: () => boolean;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (vol: number) => void;
  setSoundPack: (pack: SoundPackId) => void;
  setAdminMutedSound: (muted: boolean) => void;
  playSound: (type: SoundType) => void;
  // Admin Authentication
  adminAuthenticated: boolean;
  authenticateAdmin: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logoutAdmin: () => void;
  updateAdminPassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;

  // Site Settings & Branding
  siteSettings: SiteSettings;
  updateSiteSettings: (partial: Partial<SiteSettings>) => void;
  brandIdentity: BrandIdentityConfig;
  draftBrandIdentity: BrandIdentityConfig;
  updateBrandIdentity: (partial: Partial<BrandIdentityConfig>) => void;
  saveBrandDraft: (draft: BrandIdentityConfig) => void;
  publishBrandTheme: (theme: BrandIdentityConfig) => void;
  reloadThemeCache: () => void;
  applyBrandStyles: (brand: BrandIdentityConfig) => void;
  isPreviewingWebsiteTheme: boolean;
  setIsPreviewingWebsiteTheme: (val: boolean) => void;

  // Footer Configuration
  footerConfig: FooterConfig;
  updateFooterConfig: (updater: Partial<FooterConfig> | ((prev: FooterConfig) => FooterConfig)) => Promise<boolean>;
  resetFooterConfig: () => Promise<boolean>;

  // B2B Homepage Section Manager Configuration
  b2bSectionConfig: B2BSectionConfig;
  updateB2BSectionConfig: (updater: Partial<B2BSectionConfig> | ((prev: B2BSectionConfig) => B2BSectionConfig)) => Promise<boolean>;

  // Promotional Video Popup Configuration
  videoPopupConfig: VideoPopupConfig;
  updateVideoPopupConfig: (updater: Partial<VideoPopupConfig> | ((prev: VideoPopupConfig) => VideoPopupConfig)) => Promise<boolean>;

  // Homepage AI Hair Quiz Banner Configuration
  homepageQuizBannerConfig: HomepageQuizBannerConfig;
  updateHomepageQuizBannerConfig: (updater: Partial<HomepageQuizBannerConfig> | ((prev: HomepageQuizBannerConfig) => HomepageQuizBannerConfig)) => Promise<boolean>;

  // Homepage Editorial Stories Configuration
  homepageEditorialConfig: HomepageEditorialConfig;
  updateHomepageEditorialConfig: (updater: Partial<HomepageEditorialConfig> | ((prev: HomepageEditorialConfig) => HomepageEditorialConfig)) => Promise<boolean>;

  // Shoppable Video Reels
  shoppableReels: ShoppableReel[];
  addShoppableReel: (reel: Omit<ShoppableReel, 'id'>) => Promise<boolean>;
  updateShoppableReel: (id: string, partial: Partial<ShoppableReel>) => Promise<boolean>;
  deleteShoppableReel: (id: string) => Promise<boolean>;
  reorderShoppableReels: (newList: ShoppableReel[]) => Promise<boolean>;
  setAllShoppableReels: (reels: ShoppableReel[]) => Promise<boolean>;

  // Nav Links & Header Layout
  navLinks: NavLink[];
  addNavLink: (navLink: Omit<NavLink, 'id'>) => void;
  updateNavLink: (id: string, partial: Partial<NavLink>) => void;
  deleteNavLink: (id: string) => void;
  reorderNavLinks: (newList: NavLink[]) => void;
  duplicateNavLink: (id: string) => void;
  trackNavClick: (id: string) => void;
  trackNavImpression: (id: string) => void;
  resetNavAnalytics: () => void;
  headerLayoutSettings: HeaderLayoutSettings;
  updateHeaderLayoutSettings: (partial: Partial<HeaderLayoutSettings>) => void;

  // Currency & Location
  currencies: Currency[];
  currentCurrency: Currency;
  setCurrencyByCode: (code: string) => void;
  formatPrice: (priceINR: number) => string;
  convertPrice: (priceINR: number) => number;
  updateCurrencyRate: (code: string, newRateToINR: number) => void;

  // Selected Country & Market
  selectedCountry: CountryItem;
  selectCountry: (country: CountryItem) => void;
  currentMarket: Market;

  // Markets
  markets: Market[];
  updateMarket: (id: string, partial: Partial<Market>) => void;

  // Countries & Bulk Actions
  countries: CountrySetting[];
  updateCountrySetting: (code: string, partial: Partial<CountrySetting>) => void;
  bulkUpdateCountries: (action: 'ENABLE_ALL' | 'DISABLE_ALL' | 'ENABLE_REGION', region?: string) => void;

  // Catalog
  products: Product[];
  categories: Category[];
  heroSlides: HeroSlide[];
  heroSliderSettings: HeroSliderSettings;
  updateHeroSliderSettings: (partial: Partial<HeroSliderSettings>) => void;
  beforeAfterItems: BeforeAfterItem[];
  reviews: Review[];
  blogs: BlogArticle[];
  coupons: Coupon[];
  testimonialVideos: TestimonialVideo[];
  quizQuestions: QuizQuestion[];
  mediaItems: MediaItem[];

  // Cart & Checkout
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (productIdOrKey: string) => void;
  updateCartQuantity: (productIdOrKey: string, quantity: number) => void;
  clearCart: () => void;
  cartItemsCount: number;
  cartSubtotalINR: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmountINR: number;
  cartTotalINR: number;
  cartToast: { show: boolean; message: string; productName?: string } | null;
  showCartToast: (message?: string, productName?: string) => void;
  hideCartToast: () => void;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (productOrId: Product | string) => void;
  isInWishlist: (productIdOrProduct: string | Product | undefined | null) => boolean;
  removeFromWishlist: (productIdOrProduct: string | Product) => void;
  clearWishlist: () => void;

  // Orders
  orders: Order[];
  addOrder: (newOrder: Order) => void;
  refreshOrders: () => Promise<Order[] | undefined>;
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['trackingStatus'], trackingNumber?: string, courier?: string) => void;
  updateOrderDetails: (orderId: string, updates: Partial<Order>) => void;

  // User & Customer Account Management
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  customerAccounts: User[];
  loginUser: (email: string, password?: string) => { success: boolean; message: string };
  registerUser: (data: { name: string; email: string; phone?: string; password?: string }) => { success: boolean; message: string };
  guestLogin: (email: string, name?: string) => void;
  logoutUser: () => void;
  updateCustomerAccount: (id: string, partial: Partial<User>) => void;
  updateUserProfile: (partial: Partial<User>) => void;
  addSavedAddress: (address: Omit<SavedAddress, 'id'>) => void;
  updateSavedAddress: (addressId: string, address: Partial<SavedAddress>) => void;
  deleteSavedAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  toggleBlockCustomer: (userId: string) => void;
  deleteCustomerAccount: (id: string) => void;
  exportCustomerData: (userId?: string) => void;

  // Modals & UI States
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isQuickViewOpen: boolean;
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authInitialTab: 'SIGN_IN' | 'CREATE_ACCOUNT';
  setAuthInitialTab: (tab: 'SIGN_IN' | 'CREATE_ACCOUNT') => void;
  openAuthModal: (tab?: 'SIGN_IN' | 'CREATE_ACCOUNT') => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isB2BModalOpen: boolean;
  setIsB2BModalOpen: (open: boolean) => void;
  isQuizOpen: boolean;
  setIsQuizOpen: (open: boolean) => void;
  isCountryModalOpen: boolean;
  setIsCountryModalOpen: (open: boolean) => void;

  // B2B & Engagement
  b2bLeads: B2BLead[];
  addB2BLead: (lead: Omit<B2BLead, 'id' | 'createdAt' | 'status'>) => void;
  updateB2BLeadStatus: (id: string, status: B2BLead['status']) => void;
  deleteB2BLead: (id: string) => void;

  // Admin Management CRUD
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (newCategories: Category[]) => void;

  addHeroSlide: (slide: Omit<HeroSlide, 'id'>) => Promise<void>;
  updateHeroSlide: (id: string, slide: Partial<HeroSlide>) => Promise<void>;
  deleteHeroSlide: (id: string) => Promise<void>;
  reorderHeroSlides: (newSlides: HeroSlide[]) => Promise<void>;
  duplicateHeroSlide: (id: string) => Promise<void>;
  saveHeroSlides: (slides: HeroSlide[]) => Promise<boolean>;
  trackSlideImpression: (id: string) => void;
  trackSlideClick: (id: string) => void;

  addBlog: (blog: Omit<BlogArticle, 'id'>) => void;
  updateBlog: (id: string, blog: Partial<BlogArticle>) => void;
  deleteBlog: (id: string) => void;
  setAllBlogs: (blogs: BlogArticle[]) => void;

  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;

  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  updateReview: (id: string, partial: Partial<Review>) => void;
  deleteReview: (id: string) => void;
  setAllReviews: (reviews: Review[]) => void;

  addBeforeAfterItem: (item: Omit<BeforeAfterItem, 'id'>) => void;
  updateBeforeAfterItem: (id: string, partial: Partial<BeforeAfterItem>) => void;
  deleteBeforeAfterItem: (id: string) => void;
  setAllBeforeAfterItems: (items: BeforeAfterItem[]) => void;

  addTestimonialVideo: (video: Omit<TestimonialVideo, 'id'>) => void;
  updateTestimonialVideo: (id: string, partial: Partial<TestimonialVideo>) => void;
  deleteTestimonialVideo: (id: string) => void;
  setAllTestimonialVideos: (videos: TestimonialVideo[]) => void;

  addQuizQuestion: (q: Omit<QuizQuestion, 'id'>) => void;
  updateQuizQuestion: (id: string, partial: Partial<QuizQuestion>) => void;
  deleteQuizQuestion: (id: string) => void;
  setAllQuizQuestions: (questions: QuizQuestion[]) => void;

  addMediaItem: (item: Omit<MediaItem, 'id' | 'uploadedAt'>) => void;
  deleteMediaItem: (id: string) => void;

  // Payment Management System
  paymentGateways: PaymentGatewayConfig[];
  updatePaymentGateway: (id: PaymentGatewayId, partial: Partial<PaymentGatewayConfig>) => void;
  reorderPaymentGateways: (newList: PaymentGatewayConfig[]) => void;
  testGatewayConnection: (id: PaymentGatewayId) => Promise<{ success: boolean; message: string }>;
  codRules: CodRulesConfig;
  updateCodRules: (partial: Partial<CodRulesConfig>) => void;
  marketGateways: MarketPaymentGatewayMapping[];
  updateMarketGateways: (marketId: string, gateways: PaymentGatewayId[]) => void;
  paymentLogs: PaymentLog[];
  addPaymentLog: (log: Omit<PaymentLog, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => void;
  refundPaymentLog: (logId: string, refundAmount: number, refundReason: string) => void;

  // Shiprocket Settings Manager
  shiprocketSettings: ShiprocketSettings;
  updateShiprocketSettings: (partial: Partial<ShiprocketSettings>) => void;

  // Category Page Manager
  categoryPages: CategoryPageConfig[];
  updateCategoryPage: (id: string, partial: Partial<CategoryPageConfig>) => Promise<boolean>;
  reorderCategoryPages: (newList: CategoryPageConfig[]) => Promise<boolean>;
  
  // Best Sellers Settings
  maxBestSellersCount: number;
  updateMaxBestSellersCount: (count: number) => Promise<boolean>;

  // Mobile Navigation Manager (Phase 3)
  mobileNavConfig: MobileNavConfig;
  updateMobileNavConfig: (partial: Partial<MobileNavConfig>) => Promise<boolean>;
  resetMobileNavConfig: () => Promise<boolean>;

  dbSyncStatus: 'loading' | 'synced' | 'saving' | 'error';
  serverSaveError: string | null;
  resetToDefaults: () => void;
}

const normalizeSlide = (s: Partial<HeroSlide>): HeroSlide => {
  const activeVal = s.active ?? s.enabled ?? true;
  const enabledVal = activeVal;
  const mediaTypeVal = s.mediaType || (s.backgroundVideo ? 'VIDEO' : 'IMAGE');
  const imageVal = s.image || s.mediaUrl || '';
  const mediaUrlVal = s.backgroundVideo || imageVal || s.mediaUrl || '';

  return {
    ...s,
    id: s.id || `slide-${Date.now()}`,
    title: s.title || '',
    subtitle: s.subtitle || '',
    tag: s.tag || '',
    highlightText: s.highlightText || '',
    image: imageVal,
    mediaUrl: mediaUrlVal,
    mediaType: mediaTypeVal,
    active: activeVal,
    enabled: enabledVal,
    ctaText: s.ctaText || '',
    ctaLink: s.ctaLink || '',
    enable3dOverflow: s.enable3dOverflow ?? false,
    foregroundCutoutUrl: s.foregroundCutoutUrl || '',
    foregroundCutoutFilename: s.foregroundCutoutFilename || '',
    desktopPosX: s.desktopPosX ?? 70,
    desktopPosY: s.desktopPosY ?? 0,
    desktopWidth: s.desktopWidth ?? 440,
    desktopBottomOverflow: s.desktopBottomOverflow ?? 130,
    mobilePosX: s.mobilePosX ?? 60,
    mobilePosY: s.mobilePosY ?? 0,
    mobileWidth: s.mobileWidth ?? 260,
    mobileBottomOverflow: s.mobileBottomOverflow ?? 65,
    disableMobileOverflow: s.disableMobileOverflow ?? false,
  } as HeroSlide;
};

export function isLightThemeBg(hexColor?: string, modeOverride?: string): boolean {
  if (modeOverride === 'light') return true;
  if (modeOverride === 'dark') return false;
  if (!hexColor || typeof hexColor !== 'string') return true;

  const cleanHex = hexColor.replace('#', '').trim();
  let r = 248, g = 245, b = 238;
  if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16) || 248;
    g = parseInt(cleanHex.substring(2, 4), 16) || 245;
    b = parseInt(cleanHex.substring(4, 6), 16) || 238;
  } else if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16) || 248;
    g = parseInt(cleanHex[1] + cleanHex[1], 16) || 245;
    b = parseInt(cleanHex[2] + cleanHex[2], 16) || 238;
  }
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140;
}

export function getContrastTextColor(hexColor: string, defaultColor: string = '#FFFFFF'): string {
  if (!hexColor) return defaultColor;
  let hex = hexColor.trim().replace('#', '');
  if (hex.startsWith('rgba') || hex.startsWith('rgb')) {
    const match = hex.match(/\d+/g);
    if (match && match.length >= 3) {
      const r = parseInt(match[0], 10);
      const g = parseInt(match[1], 10);
      const b = parseInt(match[2], 10);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 150 ? '#173A25' : '#FFFFFF';
    }
  }
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  if (hex.length !== 6) return defaultColor;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return defaultColor;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? '#173A25' : '#FFFFFF';
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('[HAKKIVEDA STARTUP] StoreProvider started');
  const [dbSyncStatus, setDbSyncStatus] = useState<'loading' | 'synced' | 'saving' | 'error'>('loading');
  const [serverSaveError, setServerSaveError] = useState<string | null>(null);

  // Local storage helper (used ONLY for temporary user preferences like cart, selected country)
  const getStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`hakkiveda_${key}`);
      if (!item) return fallback;
      const parsed = JSON.parse(item);
      if (typeof fallback === 'object' && fallback !== null && !Array.isArray(fallback) && typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return { ...fallback, ...parsed };
      }
      return parsed;
    } catch (e) {
      return fallback;
    }
  };

  // Server persistence helper (Saves all admin content to backend server DB)
  const setStored = <T,>(key: string, value: T): Promise<boolean> => {
    setDbSyncStatus('saving');
    setServerSaveError(null);

    return fetch(`/api/store/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ value: value, data: value }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server HTTP ${res.status}`);
        }
        setDbSyncStatus('synced');
        return true;
      })
      .catch((err) => {
        console.warn(`[StoreContext] Could not save '${key}' to server DB:`, err);
        setDbSyncStatus('error');
        setServerSaveError(`Server database save failed for '${key}': ${err?.message || 'Network issue'}`);
        return false;
      });
  };

  // Sound System State & Handlers
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => soundManager.isEnabled());
  const [soundVolume, setSoundVolumeState] = useState<number>(() => soundManager.getVolume());
  const [soundPack, setSoundPackState] = useState<SoundPackId>(() => soundManager.getPack());
  const [adminMutedSound, setAdminMutedSoundState] = useState<boolean>(() => soundManager.isAdminMuted());

  const toggleSound = () => {
    const next = soundManager.toggleEnabled();
    setSoundEnabledState(next);
    return next;
  };

  const setSoundEnabled = (enabled: boolean) => {
    soundManager.setEnabled(enabled);
    setSoundEnabledState(enabled);
  };

  const setSoundVolume = (vol: number) => {
    soundManager.setVolume(vol);
    setSoundVolumeState(vol);
  };

  const setSoundPack = (pack: SoundPackId) => {
    soundManager.setPack(pack);
    setSoundPackState(pack);
  };

  const setAdminMutedSound = (muted: boolean) => {
    soundManager.setAdminMuted(muted);
    setAdminMutedSoundState(muted);
  };

  const playSound = (type: SoundType) => {
    soundManager.play(type);
  };

  // Server-Authoritative Admin Authentication State
  const [adminAuthenticated, setAdminAuthenticated] = useState<boolean>(false);

  // Helper to load privileged full store data for authenticated admin
  const loadFullStoreData = async () => {
    try {
      const res = await fetch('/api/store', { credentials: 'include' });
      if (!res.ok) return;
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        if (Array.isArray(d.orders)) setOrders(d.orders);
        if (Array.isArray(d.b2b_leads)) setB2BLeads(d.b2b_leads);
        if (Array.isArray(d.customer_accounts)) setCustomerAccounts(d.customer_accounts);
        if (Array.isArray(d.payment_logs)) setPaymentLogs(d.payment_logs);
        if (Array.isArray(d.shoppable_reels)) setShoppableReels(d.shoppable_reels);
      }
    } catch (e) {
      console.warn('[StoreContext] Could not load full store data:', e);
    }
  };

  // Check admin session status on mount
  useEffect(() => {
    fetch('/api/admin/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.admin) {
          setAdminAuthenticated(true);
          loadFullStoreData();
        } else {
          setAdminAuthenticated(false);
        }
      })
      .catch(() => {
        setAdminAuthenticated(false);
      });
  }, []);

  const authenticateAdmin = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminAuthenticated(true);
        loadFullStoreData();
        return { success: true, message: data.message || 'Admin authentication successful.' };
      } else {
        setAdminAuthenticated(false);
        return { success: false, message: data.error || 'Invalid email or password.' };
      }
    } catch (err: any) {
      setAdminAuthenticated(false);
      return { success: false, message: 'Invalid email or password.' };
    }
  };

  const logoutAdmin = () => {
    fetch('/api/admin/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    setAdminAuthenticated(false);
  };

  const updateAdminPassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, message: data.message || 'Master password updated successfully.' };
      } else {
        return { success: false, message: data.error || 'Failed to update password.' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to update password.' };
    }
  };

  // Site Settings & Branding
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => getStored('site_settings', INITIAL_SITE_SETTINGS));
  const updateSiteSettings = (partial: Partial<SiteSettings>) => {
    setSiteSettings((prev) => {
      const next = { ...prev, ...partial };
      setStored('site_settings', next);
      return next;
    });
  };

  const [brandIdentity, setBrandIdentity] = useState<BrandIdentityConfig>(() =>
    getStored('brand_identity', INITIAL_BRAND_IDENTITY)
  );

  const [draftBrandIdentity, setDraftBrandIdentity] = useState<BrandIdentityConfig>(() =>
    getStored('brand_identity_draft', getStored('brand_identity', INITIAL_BRAND_IDENTITY))
  );

  const [isPreviewingWebsiteTheme, setIsPreviewingWebsiteTheme] = useState<boolean>(false);

  // Footer Configuration State & Functions
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(() =>
    getStored('footer_config', INITIAL_FOOTER_CONFIG)
  );

  const updateFooterConfig = async (
    updater: Partial<FooterConfig> | ((prev: FooterConfig) => FooterConfig)
  ): Promise<boolean> => {
    let next: FooterConfig;
    if (typeof updater === 'function') {
      next = updater(footerConfig);
    } else {
      next = { ...footerConfig, ...updater };
    }
    setFooterConfig(next);
    try {
      localStorage.setItem('hakkiveda_footer_config', JSON.stringify(next));
    } catch (_) {}
    return await setStored('footer_config', next);
  };

  const resetFooterConfig = async (): Promise<boolean> => {
    setFooterConfig(INITIAL_FOOTER_CONFIG);
    try {
      localStorage.setItem('hakkiveda_footer_config', JSON.stringify(INITIAL_FOOTER_CONFIG));
    } catch (_) {}
    return await setStored('footer_config', INITIAL_FOOTER_CONFIG);
  };

  // B2B Section Manager State & Functions
  const [b2bSectionConfig, setB2BSectionConfig] = useState<B2BSectionConfig>(() =>
    getStored('b2b_section_config', INITIAL_B2B_SECTION_CONFIG)
  );

  const updateB2BSectionConfig = async (
    updater: Partial<B2BSectionConfig> | ((prev: B2BSectionConfig) => B2BSectionConfig)
  ): Promise<boolean> => {
    let next: B2BSectionConfig;
    if (typeof updater === 'function') {
      next = updater(b2bSectionConfig);
    } else {
      next = { ...b2bSectionConfig, ...updater };
    }
    setB2BSectionConfig(next);
    try {
      localStorage.setItem('hakkiveda_b2b_section_config', JSON.stringify(next));
    } catch (_) {}
    return await setStored('b2b_section_config', next);
  };

  // Video Popup Config State & Functions
  const [videoPopupConfig, setVideoPopupConfig] = useState<VideoPopupConfig>(() =>
    getStored('video_popup_config', INITIAL_VIDEO_POPUP_CONFIG)
  );

  const updateVideoPopupConfig = async (
    updater: Partial<VideoPopupConfig> | ((prev: VideoPopupConfig) => VideoPopupConfig)
  ): Promise<boolean> => {
    let next: VideoPopupConfig;
    if (typeof updater === 'function') {
      next = updater(videoPopupConfig);
    } else {
      next = { ...videoPopupConfig, ...updater };
    }
    setVideoPopupConfig(next);
    try {
      localStorage.setItem('hakkiveda_video_popup_config', JSON.stringify(next));
    } catch (_) {}
    return await setStored('video_popup_config', next);
  };

  // Homepage AI Hair Quiz Banner Config State & Functions
  const [homepageQuizBannerConfig, setHomepageQuizBannerConfig] = useState<HomepageQuizBannerConfig>(() =>
    getStored('homepage_quiz_banner_config', INITIAL_HOMEPAGE_QUIZ_BANNER_CONFIG)
  );

  const updateHomepageQuizBannerConfig = async (
    updater: Partial<HomepageQuizBannerConfig> | ((prev: HomepageQuizBannerConfig) => HomepageQuizBannerConfig)
  ): Promise<boolean> => {
    let next: HomepageQuizBannerConfig;
    if (typeof updater === 'function') {
      next = updater(homepageQuizBannerConfig);
    } else {
      next = { ...homepageQuizBannerConfig, ...updater };
    }
    setHomepageQuizBannerConfig(next);
    try {
      localStorage.setItem('hakkiveda_homepage_quiz_banner_config', JSON.stringify(next));
    } catch (_) {}
    return await setStored('homepage_quiz_banner_config', next);
  };

  // Homepage Editorial Stories Config State & Functions
  const [homepageEditorialConfig, setHomepageEditorialConfig] = useState<HomepageEditorialConfig>(() =>
    getStored('homepage_editorial_config', INITIAL_HOMEPAGE_EDITORIAL_CONFIG)
  );

  const updateHomepageEditorialConfig = async (
    updater: Partial<HomepageEditorialConfig> | ((prev: HomepageEditorialConfig) => HomepageEditorialConfig)
  ): Promise<boolean> => {
    let next: HomepageEditorialConfig;
    if (typeof updater === 'function') {
      next = updater(homepageEditorialConfig);
    } else {
      next = { ...homepageEditorialConfig, ...updater };
    }
    setHomepageEditorialConfig(next);
    try {
      localStorage.setItem('hakkiveda_homepage_editorial_config', JSON.stringify(next));
    } catch (_) {}
    return await setStored('homepage_editorial_config', next);
  };

  // Shoppable Video Reels State & Functions
  const [shoppableReels, setShoppableReels] = useState<ShoppableReel[]>(() =>
    getStored('shoppable_reels', INITIAL_SHOPPABLE_REELS)
  );

  // Category Pages State & Handlers
  const [categoryPages, setCategoryPages] = useState<CategoryPageConfig[]>(() =>
    getStored('category_pages', INITIAL_CATEGORY_PAGES)
  );

  const [maxBestSellersCount, setMaxBestSellersCount] = useState<number>(() =>
    getStored('max_bestsellers_count', 8)
  );

  const updateCategoryPage = async (id: string, partial: Partial<CategoryPageConfig>): Promise<boolean> => {
    const next = categoryPages.map((c) => (c.id === id ? { ...c, ...partial } : c));
    setCategoryPages(next);
    try {
      localStorage.setItem('hakkiveda_category_pages', JSON.stringify(next));
    } catch (_) {}
    return await setStored('category_pages', next);
  };

  const reorderCategoryPages = async (newList: CategoryPageConfig[]): Promise<boolean> => {
    setCategoryPages(newList);
    try {
      localStorage.setItem('hakkiveda_category_pages', JSON.stringify(newList));
    } catch (_) {}
    return await setStored('category_pages', newList);
  };

  const updateMaxBestSellersCount = async (count: number): Promise<boolean> => {
    setMaxBestSellersCount(count);
    try {
      localStorage.setItem('hakkiveda_max_bestsellers_count', JSON.stringify(count));
    } catch (_) {}
    return await setStored('max_bestsellers_count', count);
  };

  const addShoppableReel = async (newReel: Omit<ShoppableReel, 'id'>): Promise<boolean> => {
    const reel: ShoppableReel = {
      ...newReel,
      id: `reel-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    const next = [...shoppableReels, reel];
    setShoppableReels(next);
    return await setStored('shoppable_reels', next);
  };

  const updateShoppableReel = async (id: string, partial: Partial<ShoppableReel>): Promise<boolean> => {
    const next = shoppableReels.map((r) => (r.id === id ? { ...r, ...partial } : r));
    setShoppableReels(next);
    return await setStored('shoppable_reels', next);
  };

  const deleteShoppableReel = async (id: string): Promise<boolean> => {
    const next = shoppableReels.filter((r) => r.id !== id);
    setShoppableReels(next);
    return await setStored('shoppable_reels', next);
  };

  const reorderShoppableReels = async (newList: ShoppableReel[]): Promise<boolean> => {
    setShoppableReels(newList);
    return await setStored('shoppable_reels', newList);
  };

  const setAllShoppableReels = async (reels: ShoppableReel[]): Promise<boolean> => {
    setShoppableReels(reels);
    return await setStored('shoppable_reels', reels);
  };

  const applyBrandStyles = (brand: BrandIdentityConfig) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    const bg = brand.backgroundColor || '#F8F5EE';
    const isLight = isLightThemeBg(bg, brand.themeMode);

    // Set data-theme attribute on <html> element for CSS selectors
    root.setAttribute('data-theme', isLight ? 'light' : 'dark');

    const primary = brand.primaryColor || (isLight ? '#123F2A' : '#0B1D13');
    const gold = brand.secondaryGold || (isLight ? '#C9A84E' : '#D4AF37');
    const accent = brand.accentColor || (isLight ? '#123F2A' : '#3AA91F');
    const fontHeading = brand.headingFont || 'Cinzel, Playfair Display, serif';
    const fontBody = brand.bodyFont || 'Plus Jakarta Sans, sans-serif';
    const fontButton = brand.buttonFont || 'Plus Jakarta Sans, sans-serif';

    // Strict Light vs Dark theme specifications according to design system
    let cardBg = '#FFFFFF';
    let primaryText = brand.textColor || (isLight ? '#123F2A' : '#FFFFFF');
    let secondaryText = isLight ? '#37463D' : '#CBD5E1';
    let mutedText = isLight ? '#5F6B63' : 'rgba(248, 250, 252, 0.70)';
    let buttonBg = brand.buttonColor || (isLight ? '#123F2A' : '#D4AF37');
    let buttonText = isLight ? '#FFFFFF' : '#0B1D13';
    let buttonHoverBg = brand.hoverColor || (isLight ? '#0B2F20' : '#E8D279');
    let buttonHoverText = isLight ? '#FFFFFF' : '#0B1D13';
    let inputBg = isLight ? '#FFFFFF' : '#122B1E';
    let inputText = isLight ? '#123F2A' : '#FFFFFF';
    let inputBorder = brand.borderColor || (isLight ? '#E7E1D5' : 'rgba(212, 175, 55, 0.3)');
    let border = brand.borderColor || (isLight ? '#E7E1D5' : 'rgba(212, 175, 55, 0.3)');
    let iconColor = isLight ? '#123F2A' : (brand.secondaryGold || '#D4AF37');
    let linkColor = brand.accentColor || (isLight ? '#123F2A' : '#3AA91F');
    let linkHoverColor = isLight ? '#0B2F20' : '#E8D279';
    let deepBg = isLight ? '#FFFFFF' : '#122B1E';
    let deeperBg = isLight ? '#FAF8F2' : '#05120B';

    if (!isLight) {
      cardBg = '#122B1E';
    }

    // PART 1 — COMPLETE SEMANTIC COLOUR SYSTEM VARIABLES
    root.style.setProperty('--page-background', bg);
    root.style.setProperty('--surface-background', deepBg);
    root.style.setProperty('--surface-elevated', isLight ? '#F9FBF8' : '#173827');
    root.style.setProperty('--surface-muted', deeperBg);
    root.style.setProperty('--text-primary', primaryText);
    root.style.setProperty('--text-secondary', secondaryText);
    root.style.setProperty('--text-muted', mutedText);
    root.style.setProperty('--text-disabled', isLight ? '#A3B1A8' : '#64748B');
    root.style.setProperty('--text-inverse', isLight ? '#FFFFFF' : '#0B1D13');
    root.style.setProperty('--heading-primary', isLight ? primary : gold);
    root.style.setProperty('--heading-on-dark', '#FFFFFF');
    root.style.setProperty('--border-default', border);
    root.style.setProperty('--border-muted', isLight ? '#E2DDD0' : 'rgba(212, 175, 55, 0.15)');
    root.style.setProperty('--border-strong', gold);
    root.style.setProperty('--button-primary-bg', buttonBg);
    root.style.setProperty('--button-primary-text', buttonText);
    root.style.setProperty('--button-primary-hover', buttonHoverBg);
    root.style.setProperty('--button-secondary-bg', gold);
    root.style.setProperty('--button-secondary-text', isLight ? '#123F2A' : '#0B1D13');
    root.style.setProperty('--button-disabled-bg', isLight ? '#E2E8F0' : '#1E293B');
    root.style.setProperty('--button-disabled-text', isLight ? '#94A3B8' : '#475569');
    root.style.setProperty('--input-background', inputBg);
    root.style.setProperty('--input-text', inputText);
    root.style.setProperty('--input-label', isLight ? '#123F2A' : '#F8FAFC');
    root.style.setProperty('--input-placeholder', isLight ? '#64748B' : '#94A3B8');
    root.style.setProperty('--input-border', inputBorder);
    root.style.setProperty('--input-focus-border', gold);
    root.style.setProperty('--overlay-background', isLight ? 'rgba(8, 31, 19, 0.78)' : 'rgba(0, 0, 0, 0.85)');
    root.style.setProperty('--overlay-heading', '#FFFFFF');
    root.style.setProperty('--overlay-body', '#F1F5F9');
    root.style.setProperty('--overlay-accent', gold);
    root.style.setProperty('--card-light-background', '#FFFFFF');
    root.style.setProperty('--card-light-heading', '#173A25');
    root.style.setProperty('--card-light-body', '#224230');
    root.style.setProperty('--card-light-muted', '#526A5C');
    root.style.setProperty('--card-dark-background', '#122B1E');
    root.style.setProperty('--card-dark-heading', '#FFFFFF');
    root.style.setProperty('--card-dark-body', '#E2E8F0');
    root.style.setProperty('--card-dark-muted', '#94A3B8');
    root.style.setProperty('--success', isLight ? '#16A34A' : '#22C55E');
    root.style.setProperty('--warning', isLight ? '#D97706' : '#F59E0B');
    root.style.setProperty('--error', isLight ? '#DC2626' : '#EF4444');
    root.style.setProperty('--info', isLight ? '#2563EB' : '#3B82F6');

    // Global --color-* CSS Variables
    root.style.setProperty('--color-primary', primary);
    root.style.setProperty('--color-primary-dark', bg);
    root.style.setProperty('--color-gold', gold);
    root.style.setProperty('--color-background', bg);
    root.style.setProperty('--color-card-background', cardBg);
    root.style.setProperty('--color-text', primaryText);
    root.style.setProperty('--color-secondary-text', secondaryText);
    root.style.setProperty('--color-muted-text', mutedText);
    root.style.setProperty('--color-accent', accent);
    root.style.setProperty('--color-button', buttonBg);
    root.style.setProperty('--color-button-hover', buttonHoverBg);
    root.style.setProperty('--color-button-text', buttonText);
    root.style.setProperty('--color-button-hover-text', buttonHoverText);
    root.style.setProperty('--color-input-background', inputBg);
    root.style.setProperty('--color-input-text', inputText);
    root.style.setProperty('--color-input-border', inputBorder);
    root.style.setProperty('--color-border', border);
    root.style.setProperty('--color-icon', iconColor);
    root.style.setProperty('--color-link', linkColor);
    root.style.setProperty('--color-link-hover', linkHoverColor);

    // Core Brand Identity Aliases
    root.style.setProperty('--brand-primary', primary);
    root.style.setProperty('--brand-primary-green', primary);
    root.style.setProperty('--brand-gold', gold);
    root.style.setProperty('--brand-accent', accent);
    root.style.setProperty('--button-primary', buttonBg);
    root.style.setProperty('--brand-btn-color', buttonBg);
    root.style.setProperty('--button-hover', buttonHoverBg);
    root.style.setProperty('--brand-btn-hover', buttonHoverBg);
    root.style.setProperty('--button-text', buttonText);
    root.style.setProperty('--brand-btn-text', buttonText);
    root.style.setProperty('--background', bg);
    root.style.setProperty('--brand-bg', bg);
    root.style.setProperty('--brand-primary-dark', bg);
    root.style.setProperty('--brand-primary-deep', deepBg);
    root.style.setProperty('--brand-primary-deeper', deeperBg);
    root.style.setProperty('--text-primary', primaryText);
    root.style.setProperty('--brand-text-color', primaryText);
    root.style.setProperty('--text-secondary', secondaryText);
    root.style.setProperty('--brand-border', border);
    root.style.setProperty('--brand-border-color', border);

    // Typography
    root.style.setProperty('--font-heading', fontHeading);
    root.style.setProperty('--font-body', fontBody);
    root.style.setProperty('--font-button', fontButton);

    if (brand.browserTitle) {
      document.title = brand.browserTitle;
    }
  };

  const reloadThemeCache = () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('theme_css_cache');
    } catch (e) {
      console.warn('Unable to clear theme_css_cache', e);
    }
    const currentActiveTheme = isPreviewingWebsiteTheme ? draftBrandIdentity : brandIdentity;
    applyBrandStyles(currentActiveTheme);
    window.dispatchEvent(new CustomEvent('themeUpdated', { detail: currentActiveTheme }));
  };

  useEffect(() => {
    applyBrandStyles(isPreviewingWebsiteTheme ? draftBrandIdentity : brandIdentity);
  }, [brandIdentity, draftBrandIdentity, isPreviewingWebsiteTheme]);

  useEffect(() => {
    const handleThemeUpdate = (e: any) => {
      if (e.detail) {
        applyBrandStyles(e.detail);
      }
    };
    window.addEventListener('themeUpdated', handleThemeUpdate);
    return () => window.removeEventListener('themeUpdated', handleThemeUpdate);
  }, []);

  const saveBrandDraft = (draft: BrandIdentityConfig) => {
    setDraftBrandIdentity(draft);
    setStored('brand_identity_draft', draft);
  };

  const publishBrandTheme = (theme: BrandIdentityConfig) => {
    setBrandIdentity(theme);
    setStored('brand_identity', theme);

    setDraftBrandIdentity(theme);
    setStored('brand_identity_draft', theme);

    setIsPreviewingWebsiteTheme(false);
    applyBrandStyles(theme);

    // Keep siteSettings in sync automatically
    const siteUpdates: Partial<SiteSettings> = {};
    if (theme.headerHvLogo !== undefined) {
      siteUpdates.headerHvLogo = theme.headerHvLogo;
      siteUpdates.logoImageUrl = theme.headerHvLogo;
    }
    if (theme.brandName) siteUpdates.logoText = theme.brandName;
    if (theme.brandSubtitle) siteUpdates.logoSubtext = theme.brandSubtitle;
    if (theme.brandInitials) siteUpdates.logoInitials = theme.brandInitials;
    if (theme.browserTitle) siteUpdates.seoTitle = theme.browserTitle;
    if (Object.keys(siteUpdates).length > 0) {
      updateSiteSettings(siteUpdates);
    }

    reloadThemeCache();
  };

  const updateBrandIdentity = (partial: Partial<BrandIdentityConfig>) => {
    setBrandIdentity((prev) => {
      const next = { ...prev, ...partial };
      setStored('brand_identity', next);
      setDraftBrandIdentity(next);
      setStored('brand_identity_draft', next);
      applyBrandStyles(next);

      // Keep siteSettings in sync automatically
      const siteUpdates: Partial<SiteSettings> = {};
      if (partial.headerHvLogo !== undefined) {
        siteUpdates.headerHvLogo = partial.headerHvLogo;
        siteUpdates.logoImageUrl = partial.headerHvLogo;
      }
      if (partial.brandName) siteUpdates.logoText = partial.brandName;
      if (partial.brandSubtitle) siteUpdates.logoSubtext = partial.brandSubtitle;
      if (partial.brandInitials) siteUpdates.logoInitials = partial.brandInitials;
      if (partial.browserTitle) siteUpdates.seoTitle = partial.browserTitle;
      if (Object.keys(siteUpdates).length > 0) {
        updateSiteSettings(siteUpdates);
      }

      reloadThemeCache();
      return next;
    });
  };

  // Header Layout Settings
  const [headerLayoutSettings, setHeaderLayoutSettings] = useState<HeaderLayoutSettings>(() =>
    getStored('header_layout_settings', INITIAL_HEADER_LAYOUT_SETTINGS)
  );

  const updateHeaderLayoutSettings = (partial: Partial<HeaderLayoutSettings>) => {
    setHeaderLayoutSettings((prev) => {
      const next = { ...prev, ...partial };
      setStored('header_layout_settings', next);
      return next;
    });
  };

  // Mobile Navigation Manager (Phase 3)
  const [mobileNavConfig, setMobileNavConfig] = useState<MobileNavConfig>(() =>
    getStored('mobile_nav_config', INITIAL_MOBILE_NAV_CONFIG)
  );

  const updateMobileNavConfig = async (partial: Partial<MobileNavConfig>): Promise<boolean> => {
    const next: MobileNavConfig = { ...mobileNavConfig, ...partial };
    setMobileNavConfig(next);
    setStored('mobile_nav_config', next);
    setDbSyncStatus('saving');
    try {
      const res = await fetch('/api/store/mobile_nav_config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ value: next, data: next }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDbSyncStatus('synced');
      return true;
    } catch (err) {
      console.error('[StoreContext] Failed to persist mobile_nav_config:', err);
      setDbSyncStatus('error');
      return false;
    }
  };

  const resetMobileNavConfig = async (): Promise<boolean> => {
    setMobileNavConfig(INITIAL_MOBILE_NAV_CONFIG);
    setStored('mobile_nav_config', INITIAL_MOBILE_NAV_CONFIG);
    try {
      await fetch('/api/store/mobile_nav_config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ value: INITIAL_MOBILE_NAV_CONFIG, data: INITIAL_MOBILE_NAV_CONFIG }),
      });
      return true;
    } catch (err) {
      return false;
    }
  };

  // Nav Links
  const [navLinks, setNavLinks] = useState<NavLink[]>(() => {
    const raw = getStored('nav_links', INITIAL_NAV_LINKS);
    if (Array.isArray(raw)) {
      const migrated = raw.map((item) => {
        if (item.id === 'nav-1' || item.label === 'Collections') {
          let updatedMega = item.megaMenu;
          if (updatedMega) {
            if (updatedMega.featuredImageUrl && updatedMega.featuredImageUrl.includes('photo-1526947425960-945c6e72858f')) {
              updatedMega = { ...updatedMega, featuredImageUrl: '', featuredImageTitle: '', featuredImageSubtitle: '', featuredImageLink: '' };
            }
            if (updatedMega.columns && Array.isArray(updatedMega.columns)) {
              const updatedCols = updatedMega.columns.map((col: any) => {
                const updatedLinks = (col.links || []).map((lnk: any) => {
                  if (lnk.url === '#products') {
                    if (lnk.label === 'Hair Fall Control' || lnk.label === 'Scalp Nourishment & Dandruff' || lnk.label === 'Premature Greying Repair') {
                      return { ...lnk, url: '/hair-care', enabled: lnk.enabled !== false };
                    }
                    if (lnk.label === 'Growth Boost Elixir') {
                      return { ...lnk, url: '/products/root-density-follicle-serum', enabled: lnk.enabled !== false };
                    }
                    if (lnk.label === '42 Mountain Herbs Oil') {
                      return { ...lnk, url: '/products/hakkiveda-108-herbs-hair-oil', enabled: lnk.enabled !== false };
                    }
                    if (lnk.label === 'Amla & Bhringraj Scalp Pack') {
                      return { ...lnk, url: '/products/baldness-care-powder', enabled: lnk.enabled !== false };
                    }
                    if (lnk.label === 'Forest Honey & Neem Cleanser') {
                      return { ...lnk, url: '/products/neem-face-cleanser', enabled: lnk.enabled !== false };
                    }
                  }
                  if (lnk.url === '#b2b') {
                    return { ...lnk, url: '/b2b-enquiry', enabled: lnk.enabled !== false };
                  }
                  return lnk;
                });
                return { ...col, links: updatedLinks };
              });
              updatedMega = { ...updatedMega, columns: updatedCols };
            }
            return { ...item, megaMenu: updatedMega };
          }
        }
        return item;
      });
      return migrated;
    }
    return INITIAL_NAV_LINKS;
  });

  const addNavLink = (item: Omit<NavLink, 'id'>) => {
    const newLink: NavLink = {
      status: 'ACTIVE',
      sortOrder: navLinks.length + 1,
      clicks: 0,
      impressions: 0,
      showOnDesktop: true,
      showOnTablet: true,
      showOnMobile: true,
      userVisibility: 'EVERYONE',
      allowedCountries: [],
      ...item,
      id: `nav-${Date.now()}`,
    };
    setNavLinks((prev) => {
      const next = [...prev, newLink];
      setStored('nav_links', next);
      return next;
    });
  };

  const updateNavLink = (id: string, partial: Partial<NavLink>) => {
    setNavLinks((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, ...partial } : l));
      setStored('nav_links', next);
      return next;
    });
  };

  const deleteNavLink = (id: string) => {
    setNavLinks((prev) => {
      // Also reset parentId of any child links if parent is deleted
      const next = prev
        .filter((l) => l.id !== id)
        .map((l) => (l.parentId === id ? { ...l, parentId: null } : l));
      setStored('nav_links', next);
      return next;
    });
  };

  const reorderNavLinks = (newList: NavLink[]) => {
    const updated = newList.map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
    setNavLinks(updated);
    setStored('nav_links', updated);
  };

  const duplicateNavLink = (id: string) => {
    const target = navLinks.find((l) => l.id === id);
    if (!target) return;
    const duplicated: NavLink = {
      ...JSON.parse(JSON.stringify(target)),
      id: `nav-${Date.now()}`,
      label: `${target.label} (Copy)`,
      clicks: 0,
      impressions: 0,
      sortOrder: navLinks.length + 1,
    };
    setNavLinks((prev) => {
      const next = [...prev, duplicated];
      setStored('nav_links', next);
      return next;
    });
  };

  const trackNavClick = (id: string) => {
    setNavLinks((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, clicks: (l.clicks || 0) + 1 } : l));
      setStored('nav_links', next);
      return next;
    });
  };

  const trackNavImpression = (id: string) => {
    setNavLinks((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, impressions: (l.impressions || 0) + 1 } : l));
      setStored('nav_links', next);
      return next;
    });
  };

  const resetNavAnalytics = () => {
    setNavLinks((prev) => {
      const next = prev.map((l) => ({ ...l, clicks: 0, impressions: 0 }));
      setStored('nav_links', next);
      return next;
    });
  };

  // Currencies, Markets & Countries
  const [currencies, setCurrencies] = useState<Currency[]>(() => {
    const stored = getStored<Currency[]>('currencies', INITIAL_CURRENCIES);
    if (!Array.isArray(stored) || stored.length === 0) return INITIAL_CURRENCIES;
    const map = new Map<string, Currency>();
    INITIAL_CURRENCIES.forEach((c) => map.set(c.code, c));
    stored.forEach((c) => map.set(c.code, { ...map.get(c.code), ...c }));
    return Array.from(map.values());
  });

  const [markets, setMarkets] = useState<Market[]>(() => getStored('markets', INITIAL_MARKETS));
  const [countries, setCountries] = useState<CountrySetting[]>(() => {
    const stored = getStored('countries', INITIAL_COUNTRIES);
    // Guarantee full list of countries if stored has fewer or incomplete entries
    if (!stored || stored.length < 200) {
      return INITIAL_COUNTRIES;
    }
    return stored;
  });

  // Selected Country Persistence & Modal (Single Global Source of Truth)
  const [selectedCountry, setSelectedCountry] = useState<CountryItem>(() => {
    const stored = localStorage.getItem('hakkiveda_selected_country');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.code && parsed.currencyCode) {
          return parsed;
        }
      } catch (e) {}
    }
    return DEFAULT_COUNTRY;
  });

  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);

  // Helper to find currency object for a given currency code
  const resolveCurrencyForCode = (code: string, activeCurrencies: Currency[]): Currency => {
    const found =
      activeCurrencies.find((c) => c.code === code) ||
      INITIAL_CURRENCIES.find((c) => c.code === code);
    if (found) return found;
    return (
      activeCurrencies.find((c) => c.code === 'USD') ||
      INITIAL_CURRENCIES.find((c) => c.code === 'USD') ||
      INITIAL_CURRENCIES[0]
    );
  };

  const [currentCurrency, setCurrentCurrency] = useState<Currency>(() =>
    resolveCurrencyForCode(selectedCountry.currencyCode, INITIAL_CURRENCIES)
  );

  const currentMarket = markets.find((m) => m.currencyCode === currentCurrency.code) || markets[0];

  const setCurrencyByCode = (code: string) => {
    const active = resolveCurrencyForCode(code, currencies);
    setCurrentCurrency(active);
    setStored('current_currency', active);
  };

  const selectCountry = (country: CountryItem) => {
    soundManager.play('country_select');
    setSelectedCountry(country);
    try {
      localStorage.setItem('hakkiveda_selected_country', JSON.stringify(country));
    } catch (_) {}
    const active = resolveCurrencyForCode(country.currencyCode, currencies);
    setCurrentCurrency(active);
    setStored('current_currency', active);
  };

  // Keep currency strictly synchronized with selected country at all times
  useEffect(() => {
    if (selectedCountry?.currencyCode) {
      const active = resolveCurrencyForCode(selectedCountry.currencyCode, currencies);
      setCurrentCurrency(active);
      setStored('current_currency', active);
    }
  }, [selectedCountry?.code, selectedCountry?.currencyCode, currencies]);

  const updateCurrencyRate = (code: string, newRateToINR: number) => {
    setCurrencies((prev) => {
      const next = prev.map((c) => (c.code === code ? { ...c, rateToINR: newRateToINR } : c));
      setStored('currencies', next);
      if (currentCurrency.code === code) {
        const updatedCurrent = next.find((c) => c.code === code) || currentCurrency;
        setCurrentCurrency(updatedCurrent);
        setStored('current_currency', updatedCurrent);
      }
      return next;
    });
  };

  const updateMarket = (id: string, partial: Partial<Market>) => {
    setMarkets((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, ...partial } : m));
      setStored('markets', next);
      return next;
    });
  };

  // Payment Management System State
  const [paymentGateways, setPaymentGateways] = useState<PaymentGatewayConfig[]>(() =>
    getStored('payment_gateways', INITIAL_PAYMENT_GATEWAYS)
  );

  const [codRules, setCodRules] = useState<CodRulesConfig>(() =>
    getStored('cod_rules', INITIAL_COD_RULES)
  );

  const [marketGateways, setMarketGateways] = useState<MarketPaymentGatewayMapping[]>(() =>
    getStored('market_gateways', INITIAL_MARKET_GATEWAYS)
  );

  const [paymentLogs, setPaymentLogs] = useState<PaymentLog[]>(() =>
    getStored('payment_logs', INITIAL_PAYMENT_LOGS)
  );

  const DEFAULT_SHIPROCKET_SETTINGS: ShiprocketSettings = {
    enabled: true,
    autoCreateOrder: true,
    autoGenerateAwb: false,
    autoSchedulePickup: false,
    pickupPincode: '560001',
    defaultLengthCm: 15,
    defaultWidthCm: 10,
    defaultHeightCm: 10,
    defaultWeightKg: 0.5,
    courierPreference: 'SURFACE',
    codEnabled: true,
    codFeeINR: 0,
    codMinAmountINR: 1,
    codMaxAmountINR: 50000,
  };

  const [shiprocketSettings, setShiprocketSettings] = useState<ShiprocketSettings>(() => ({
    ...DEFAULT_SHIPROCKET_SETTINGS,
    ...(getStored('shiprocket_settings', DEFAULT_SHIPROCKET_SETTINGS) || {}),
  }));

  const updateShiprocketSettings = (partial: Partial<ShiprocketSettings>) => {
    setShiprocketSettings((prev) => {
      const next = { ...prev, ...partial };
      setStored('shiprocket_settings', next);
      return next;
    });
  };

  const updatePaymentGateway = (id: PaymentGatewayId, partial: Partial<PaymentGatewayConfig>) => {
    setPaymentGateways((prev) => {
      const next = prev.map((gw) => (gw.id === id ? { ...gw, ...partial } : gw));
      setStored('payment_gateways', next);
      return next;
    });
  };

  const reorderPaymentGateways = (newList: PaymentGatewayConfig[]) => {
    const ordered = newList.map((gw, idx) => ({ ...gw, sortOrder: idx + 1 }));
    setPaymentGateways(ordered);
    setStored('payment_gateways', ordered);
  };

  const testGatewayConnection = async (id: PaymentGatewayId): Promise<{ success: boolean; message: string }> => {
    const gw = paymentGateways.find((g) => g.id === id);
    if (!gw) return { success: false, message: 'Gateway not found.' };

    const isLive = gw.mode === 'LIVE';
    const apiKey = isLive ? gw.liveApiKey : gw.testApiKey;
    const secretKey = isLive ? gw.liveSecretKey : gw.testSecretKey;

    if (!apiKey || !secretKey || apiKey.trim() === '' || secretKey.trim() === '') {
      updatePaymentGateway(id, {
        connectionStatus: 'FAILED',
        webhookStatus: 'DISCONNECTED',
        lastTestedAt: new Date().toLocaleString(),
      });
      return { success: false, message: `Missing ${gw.mode} API Key or Secret Key for ${gw.name}.` };
    }

    await new Promise((res) => setTimeout(res, 800));

    const updatedTime = new Date().toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    updatePaymentGateway(id, {
      connectionStatus: 'CONNECTED',
      webhookStatus: 'SYNCED',
      lastTestedAt: updatedTime,
    });

    return {
      success: true,
      message: `Successfully verified ${gw.mode} credentials and webhook connection for ${gw.name}!`,
    };
  };

  const updateCodRules = (partial: Partial<CodRulesConfig>) => {
    setCodRules((prev) => {
      const next = { ...prev, ...partial };
      setStored('cod_rules', next);
      return next;
    });
  };

  const updateMarketGateways = (marketId: string, gateways: PaymentGatewayId[]) => {
    setMarketGateways((prev) => {
      const exists = prev.some((m) => m.marketId === marketId);
      let next: MarketPaymentGatewayMapping[];
      if (exists) {
        next = prev.map((m) => (m.marketId === marketId ? { ...m, gateways } : m));
      } else {
        next = [...prev, { marketId, countryCode: marketId.toUpperCase(), marketName: marketId, currencyCode: 'USD', gateways }];
      }
      setStored('market_gateways', next);
      return next;
    });
  };

  const addPaymentLog = (logData: Omit<PaymentLog, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => {
    const newLog: PaymentLog = {
      ...logData,
      id: logData.id || `paylog-${Date.now()}`,
      createdAt: logData.createdAt || new Date().toLocaleString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
    setPaymentLogs((prev) => {
      const next = [newLog, ...prev];
      setStored('payment_logs', next);
      return next;
    });
  };

  const refundPaymentLog = (logId: string, refundAmount: number, refundReason: string) => {
    const refundId = `rfnd_${Date.now()}`;
    const refundedAt = new Date().toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    setPaymentLogs((prev) => {
      const target = prev.find((l) => l.id === logId);
      if (!target) return prev;

      const next = prev.map((l) =>
        l.id === logId
          ? {
              ...l,
              status: 'REFUNDED' as const,
              refundId,
              refundAmount,
              refundReason,
              refundedAt,
            }
          : l
      );
      setStored('payment_logs', next);

      if (target.orderId || target.orderNumber) {
        setOrders((orderList) => {
          const updatedOrders = orderList.map((ord) =>
            ord.id === target.orderId || ord.orderNumber === target.orderNumber
              ? { ...ord, paymentStatus: 'REFUNDED' as const }
              : ord
          );
          setStored('orders', updatedOrders);
          return updatedOrders;
        });
      }

      return next;
    });
  };

  const updateCountrySetting = (code: string, partial: Partial<CountrySetting>) => {
    setCountries((prev) => {
      const next = prev.map((c) => (c.code === code ? { ...c, ...partial } : c));
      setStored('countries', next);
      return next;
    });
  };

  const bulkUpdateCountries = (action: 'ENABLE_ALL' | 'DISABLE_ALL' | 'ENABLE_REGION', region?: string) => {
    setCountries((prev) => {
      const next = prev.map((c) => {
        if (action === 'ENABLE_ALL') return { ...c, enabled: true };
        if (action === 'DISABLE_ALL') return { ...c, enabled: false };
        if (action === 'ENABLE_REGION' && region) {
          const isMatch = c.region?.toLowerCase() === region.toLowerCase();
          return isMatch ? { ...c, enabled: true } : c;
        }
        return c;
      });
      setStored('countries', next);
      return next;
    });
  };

  // Pricing Helpers
  const convertPrice = (priceINR: number) => {
    if (currentCurrency.code === 'INR') return priceINR;
    return Math.round(priceINR / currentCurrency.rateToINR);
  };

  const formatPrice = (priceINR: number) => {
    const converted = convertPrice(priceINR);
    return `${currentCurrency.symbol}${converted.toLocaleString()}`;
  };

  // Catalog State
  const hasUserMutatedHeroSlidesRef = useRef(false);

  const [products, setProducts] = useState<Product[]>(() => {
    const stored = getStored('products', INITIAL_PRODUCTS);
    if (!stored || stored.length === 0 || stored[0]?.image?.includes('unsplash')) {
      return INITIAL_PRODUCTS;
    }
    return stored;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = getStored('categories', INITIAL_CATEGORIES);
    if (!stored || stored.length === 0 || stored[0]?.image?.includes('unsplash')) {
      return INITIAL_CATEGORIES;
    }
    return stored;
  });
  const DEFAULT_HERO_SLIDER_SETTINGS: HeroSliderSettings = {
    autoPlay: true,
    autoPlayDelay: 6,
    transitionSpeed: 700,
    pauseOnHover: true,
    infiniteLoop: true,
    swipeSupport: true,
  };

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    const stored = getStored<HeroSlide[] | null>('hero_slides', null);
    if (Array.isArray(stored)) {
      return stored.map(normalizeSlide);
    }
    return INITIAL_HERO_SLIDES.map(normalizeSlide);
  });
  const [heroSliderSettings, setHeroSliderSettings] = useState<HeroSliderSettings>(() => getStored('hero_slider_settings', DEFAULT_HERO_SLIDER_SETTINGS));
  const [beforeAfterItems, setBeforeAfterItems] = useState<BeforeAfterItem[]>(() => getStored('before_after', INITIAL_BEFORE_AFTER));
  const [reviews, setReviews] = useState<Review[]>(() => getStored('reviews', INITIAL_REVIEWS));
  const [blogs, setBlogs] = useState<BlogArticle[]>(() => getStored('blogs', INITIAL_BLOGS));
  const [coupons, setCoupons] = useState<Coupon[]>(() => getStored('coupons', INITIAL_COUPONS));
  const [testimonialVideos, setTestimonialVideos] = useState<TestimonialVideo[]>(() => getStored('testimonial_videos', INITIAL_TESTIMONIAL_VIDEOS));
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() => getStored('quiz_questions', INITIAL_QUIZ_QUESTIONS));
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => getStored('media_items', INITIAL_MEDIA_ITEMS));

  // Orders & B2B Leads - Start with initial data for demo
  const [orders, setOrders] = useState<Order[]>(() => getStored('orders', INITIAL_ORDERS));
  const [b2bLeads, setB2BLeads] = useState<B2BLead[]>(() => getStored('b2b_leads', []));
  const [customerAccounts, setCustomerAccounts] = useState<User[]>(() => getStored('customer_accounts', INITIAL_CUSTOMER_ACCOUNTS));

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => getStored('cart', []));
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => getStored('applied_coupon', null));
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem('hakkiveda_wishlist');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      const result: Product[] = [];
      const seenIds = new Set<string>();

      for (const item of parsed) {
        if (!item) continue;
        const itemId = typeof item === 'string' ? item : item.id;
        if (!itemId || seenIds.has(itemId)) continue;

        const fromCatalog = INITIAL_PRODUCTS.find((p) => p.id === itemId);
        if (fromCatalog) {
          result.push(typeof item === 'object' ? { ...fromCatalog, ...item } : fromCatalog);
          seenIds.add(itemId);
        } else if (typeof item === 'object' && item.name && typeof item.priceINR === 'number') {
          result.push(item as Product);
          seenIds.add(itemId);
        }
      }
      return result;
    } catch (e) {
      console.warn('[StoreContext] Failed to load wishlist from localStorage:', e);
      return [];
    }
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStored('current_user', null));

  // Hydrate public state directly from SQLite Server Database (/app/data/hakkiveda.db)
  useEffect(() => {
    let isMounted = true;
    setDbSyncStatus('loading');

    fetch('/api/store/public')
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!isMounted) return;
        if (json.success && json.data) {
          const d = json.data;
          if (Array.isArray(d.products)) setProducts(d.products);
          if (Array.isArray(d.categories)) setCategories(d.categories);
          if (Array.isArray(d.hero_slides)) {
            if (!hasUserMutatedHeroSlidesRef.current) {
              console.log('Loaded hero slides from backend', d.hero_slides);
              const normalized = d.hero_slides.map(normalizeSlide);
              setHeroSlides(normalized);
              try {
                localStorage.setItem('hakkiveda_hero_slides', JSON.stringify(normalized));
              } catch (e) {}
            }
          } else if (d.hero_slides === undefined || d.hero_slides === null) {
            if (!hasUserMutatedHeroSlidesRef.current) {
              console.log('hero_slides key missing on backend, checking local cache');
              const cached = getStored<HeroSlide[] | null>('hero_slides', null);
              if (cached && Array.isArray(cached)) {
                setHeroSlides(cached.map(normalizeSlide));
                setStored('hero_slides', cached);
              } else {
                const initial = INITIAL_HERO_SLIDES.map(normalizeSlide);
                setHeroSlides(initial);
                setStored('hero_slides', INITIAL_HERO_SLIDES);
              }
            }
          }
          if (d.hero_slider_settings) setHeroSliderSettings((prev) => ({ ...DEFAULT_HERO_SLIDER_SETTINGS, ...prev, ...d.hero_slider_settings }));
          if (Array.isArray(d.before_after)) setBeforeAfterItems(d.before_after);
          if (Array.isArray(d.reviews)) setReviews(d.reviews);
          if (Array.isArray(d.blogs)) setBlogs(d.blogs);
          if (Array.isArray(d.coupons)) setCoupons(d.coupons);
          if (Array.isArray(d.testimonial_videos)) setTestimonialVideos(d.testimonial_videos);
          if (Array.isArray(d.quiz_questions)) setQuizQuestions(d.quiz_questions);
          if (Array.isArray(d.media_items)) setMediaItems(d.media_items);
          if (Array.isArray(d.orders)) setOrders(d.orders);
          if (Array.isArray(d.b2b_leads)) setB2BLeads(d.b2b_leads);
          if (Array.isArray(d.customer_accounts)) setCustomerAccounts(d.customer_accounts);
          if (d.site_settings) setSiteSettings((prev) => ({ ...INITIAL_SITE_SETTINGS, ...prev, ...d.site_settings }));
          if (d.brand_identity) {
            const mergedBrand = { ...INITIAL_BRAND_IDENTITY, ...d.brand_identity };
            setBrandIdentity(mergedBrand);
            applyBrandStyles(mergedBrand);
          }
          if (d.brand_identity_draft) setDraftBrandIdentity((prev) => ({ ...INITIAL_BRAND_IDENTITY, ...prev, ...d.brand_identity_draft }));
          if (d.header_layout_settings) setHeaderLayoutSettings((prev) => ({ ...INITIAL_HEADER_LAYOUT_SETTINGS, ...prev, ...d.header_layout_settings }));
          if (d.footer_config) setFooterConfig((prev) => ({ ...INITIAL_FOOTER_CONFIG, ...prev, ...d.footer_config }));
          if (d.b2b_section_config) setB2BSectionConfig((prev) => ({ ...INITIAL_B2B_SECTION_CONFIG, ...prev, ...d.b2b_section_config }));
          if (d.video_popup_config) setVideoPopupConfig((prev) => ({ ...INITIAL_VIDEO_POPUP_CONFIG, ...prev, ...d.video_popup_config }));
          if (d.homepage_quiz_banner_config) setHomepageQuizBannerConfig((prev) => ({ ...INITIAL_HOMEPAGE_QUIZ_BANNER_CONFIG, ...prev, ...d.homepage_quiz_banner_config }));
          if (d.homepage_editorial_config) setHomepageEditorialConfig((prev) => ({ ...INITIAL_HOMEPAGE_EDITORIAL_CONFIG, ...prev, ...d.homepage_editorial_config }));
          if (Array.isArray(d.shoppable_reels)) setShoppableReels(d.shoppable_reels);
          if (Array.isArray(d.nav_links)) setNavLinks(d.nav_links);
          if (Array.isArray(d.currencies)) {
            const map = new Map<string, Currency>();
            INITIAL_CURRENCIES.forEach((c) => map.set(c.code, c));
            d.currencies.forEach((c: Currency) => map.set(c.code, { ...map.get(c.code), ...c }));
            setCurrencies(Array.from(map.values()));
          }
          if (Array.isArray(d.markets)) setMarkets(d.markets);
          if (Array.isArray(d.countries)) setCountries(d.countries);
          if (Array.isArray(d.payment_gateways)) setPaymentGateways(d.payment_gateways);
          if (d.cod_rules) setCodRules((prev) => ({ ...INITIAL_COD_RULES, ...prev, ...d.cod_rules }));
          if (Array.isArray(d.market_gateways)) setMarketGateways(d.market_gateways);
          if (Array.isArray(d.payment_logs)) setPaymentLogs(d.payment_logs);
          if (Array.isArray(d.category_pages)) setCategoryPages(d.category_pages);
          if (typeof d.max_bestsellers_count === 'number') setMaxBestSellersCount(d.max_bestsellers_count);
          if (d.mobile_nav_config) setMobileNavConfig((prev) => ({ ...INITIAL_MOBILE_NAV_CONFIG, ...prev, ...d.mobile_nav_config }));

          setDbSyncStatus('synced');
          console.log('[HAKKIVEDA STARTUP] Store data initialized (from server DB)');
        }
      })
      .catch((err) => {
        console.warn('[StoreContext] Could not load from server SQLite DB:', err);
        if (isMounted) {
          setDbSyncStatus('error');
          console.log('[HAKKIVEDA STARTUP] Store data initialized (using fallback defaults)');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'SIGN_IN' | 'CREATE_ACCOUNT'>('SIGN_IN');

  const openAuthModal = (tab?: 'SIGN_IN' | 'CREATE_ACCOUNT') => {
    if (tab) {
      setAuthInitialTab(tab);
    }
    setIsAuthModalOpen(true);
  };

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isB2BModalOpen, setIsB2BModalOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Non-blocking Cart Toast System
  const [cartToast, setCartToast] = useState<{ show: boolean; message: string; productName?: string } | null>(null);
  const cartToastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showCartToast = (message: string = 'Added to cart', productName?: string) => {
    if (cartToastTimerRef.current) {
      clearTimeout(cartToastTimerRef.current);
    }
    setCartToast({ show: true, message, productName });
    cartToastTimerRef.current = setTimeout(() => {
      setCartToast(null);
    }, 3800);
  };

  const hideCartToast = () => {
    if (cartToastTimerRef.current) {
      clearTimeout(cartToastTimerRef.current);
    }
    setCartToast(null);
  };

  // Cart Calculations
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotalINR = cart.reduce((sum, item) => sum + item.product.priceINR * item.quantity, 0);

  const discountAmountINR = appliedCoupon
    ? appliedCoupon.discountType === 'PERCENT'
      ? Math.round((cartSubtotalINR * appliedCoupon.value) / 100)
      : appliedCoupon.value
    : 0;

  const cartTotalINR = Math.max(0, cartSubtotalINR - discountAmountINR);

  // Cart Actions
  const addToCart = (product: Product, quantity = 1, variant?: ProductVariant) => {
    soundManager.play('add_to_cart');

    const activeVariant = variant || product.selectedVariant;
    const finalProduct: Product = activeVariant
      ? {
          ...product,
          priceINR: activeVariant.priceINR,
          originalPriceINR: activeVariant.originalPriceINR ?? product.originalPriceINR,
          volume: activeVariant.size || activeVariant.name || product.volume,
          sku: activeVariant.sku || product.sku,
          stock: activeVariant.stock,
          image: activeVariant.image || product.image,
          selectedVariant: activeVariant,
        }
      : product;

    const variantKey = activeVariant ? `${product.id}-${activeVariant.id}` : product.id;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => {
        const itemKey = item.selectedVariant ? `${item.product.id}-${item.selectedVariant.id}` : item.product.id;
        return itemKey === variantKey;
      });

      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = prev.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updated = [...prev, { product: finalProduct, quantity, selectedVariant: activeVariant }];
      }
      setStored('cart', updated);
      return updated;
    });

    // Show non-blocking toast confirmation (Cart drawer stays closed)
    showCartToast('Added to cart', product.name);
  };

  const removeFromCart = (productIdOrKey: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => {
        const itemKey = item.selectedVariant ? `${item.product.id}-${item.selectedVariant.id}` : item.product.id;
        return itemKey !== productIdOrKey && item.product.id !== productIdOrKey;
      });
      setStored('cart', updated);
      return updated;
    });
  };

  const updateCartQuantity = (productIdOrKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productIdOrKey);
      return;
    }
    setCart((prev) => {
      const updated = prev.map((item) => {
        const itemKey = item.selectedVariant ? `${item.product.id}-${item.selectedVariant.id}` : item.product.id;
        if (itemKey === productIdOrKey || item.product.id === productIdOrKey) {
          return { ...item, quantity };
        }
        return item;
      });
      setStored('cart', updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setStored('cart', []);
    setStored('applied_coupon', null);
  };

  const applyCoupon = (code: string) => {
    const formatted = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code === formatted && c.isActive);
    if (!found) {
      soundManager.play('error_warning');
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (cartSubtotalINR < found.minOrderINR) {
      soundManager.play('error_warning');
      return {
        success: false,
        message: `Minimum order amount of ${formatPrice(found.minOrderINR)} required for this coupon.`,
      };
    }
    soundManager.play('form_submit');
    setAppliedCoupon(found);
    setStored('applied_coupon', found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    soundManager.play('toggle_switch');
    setAppliedCoupon(null);
    setStored('applied_coupon', null);
  };

  // Wishlist Actions
  const toggleWishlist = (productOrId: Product | string) => {
    soundManager.play('wishlist');
    setWishlist((prev) => {
      const targetId = typeof productOrId === 'string' ? productOrId : productOrId?.id;
      if (!targetId) return prev;

      const exists = prev.some((p) => {
        if (!p) return false;
        const pid = typeof p === 'string' ? p : p.id;
        return pid === targetId;
      });

      let updated: Product[];
      if (exists) {
        // Remove product with this targetId
        updated = prev.filter((p) => {
          if (!p) return false;
          const pid = typeof p === 'string' ? p : p.id;
          return pid !== targetId;
        });
      } else {
        // Find full product object to add
        let prodToAdd: Product | undefined;
        if (typeof productOrId === 'object' && productOrId !== null && productOrId.id) {
          prodToAdd = productOrId;
        } else {
          prodToAdd = products.find((p) => p.id === targetId) || INITIAL_PRODUCTS.find((p) => p.id === targetId);
        }

        if (prodToAdd) {
          // Remove any possible prior item with same id and append resolved full product
          const cleanPrev = prev.filter((p) => {
            if (!p) return false;
            const pid = typeof p === 'string' ? p : p.id;
            return pid !== targetId;
          });
          updated = [...cleanPrev, prodToAdd];
        } else {
          updated = prev;
        }
      }

      // Persist to localStorage safely
      try {
        localStorage.setItem('hakkiveda_wishlist', JSON.stringify(updated));
      } catch (e) {
        console.warn('[StoreContext] Could not save wishlist to localStorage:', e);
      }

      return updated;
    });
  };

  const isInWishlist = (productIdOrProduct: string | Product | undefined | null): boolean => {
    if (!productIdOrProduct) return false;
    const targetId = typeof productIdOrProduct === 'string' ? productIdOrProduct : productIdOrProduct?.id;
    if (!targetId) return false;
    return wishlist.some((p) => {
      if (!p) return false;
      const pid = typeof p === 'string' ? p : p.id;
      return pid === targetId;
    });
  };

  const removeFromWishlist = (productIdOrProduct: string | Product) => {
    const targetId = typeof productIdOrProduct === 'string' ? productIdOrProduct : productIdOrProduct?.id;
    if (!targetId) return;
    setWishlist((prev) => {
      const updated = prev.filter((p) => {
        if (!p) return false;
        const pid = typeof p === 'string' ? p : p.id;
        return pid !== targetId;
      });
      try {
        localStorage.setItem('hakkiveda_wishlist', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
    try {
      localStorage.setItem('hakkiveda_wishlist', JSON.stringify([]));
    } catch (e) {}
  };

  // Sync wishlist product details whenever catalog updates
  useEffect(() => {
    if (products.length > 0) {
      setWishlist((prev) => {
        let hasChanges = false;
        const updated = prev.map((item) => {
          if (!item) return item;
          const fresh = products.find((p) => p.id === item.id);
          if (fresh && (fresh.name !== item.name || fresh.priceINR !== item.priceINR || fresh.image !== item.image || fresh.stock !== item.stock)) {
            hasChanges = true;
            return { ...item, ...fresh };
          }
          return item;
        }).filter(Boolean);

        if (hasChanges) {
          try {
            localStorage.setItem('hakkiveda_wishlist', JSON.stringify(updated));
          } catch (e) {}
          return updated;
        }
        return prev;
      });
    }
  }, [products]);

  // Quick view
  const openQuickView = (product: Product) => {
    soundManager.play('menu_toggle');
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    soundManager.play('menu_toggle');
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  // Orders
  const addOrder = (newOrder: Order) => {
    soundManager.play('order_success');
    setOrders((prev) => {
      const filtered = prev.filter((o) => o.id !== newOrder.id && o.orderNumber !== newOrder.orderNumber);
      const next = [newOrder, ...filtered];
      setStored('orders', next);
      return next;
    });
  };

  const refreshOrders = async (): Promise<Order[] | undefined> => {
    try {
      const res = await fetch('/api/store/orders', { credentials: 'include' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data || json.value)) {
        const fetchedOrders = json.data || json.value;
        setOrders(fetchedOrders);
        return fetchedOrders;
      }
    } catch (e) {
      console.error('[StoreContext] Error refreshing orders:', e);
    }
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>) => {
    const orderNumber = `HV-ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      date: new Date().toISOString().split('T')[0],
    };
    addOrder(newOrder);

    // Decrease stock ONLY for confirmed Paid or COD orders
    if (newOrder.paymentStatus === 'PAID' || newOrder.paymentStatus === 'COD_DUE' || newOrder.paymentStatus === 'Paid' || newOrder.paymentStatus === 'Awaiting Fulfillment') {
      setProducts((prev) => {
        const nextProducts = prev.map((p) => {
          const itemInCart = orderData.items.find((ci) => ci.product.id === p.id);
          if (itemInCart) {
            const currentStock = typeof p.stock === 'number' ? p.stock : 100;
            const updatedStock = Math.max(0, currentStock - itemInCart.quantity);
            return {
              ...p,
              stock: updatedStock,
              inStock: updatedStock > 0,
            };
          }
          return p;
        });
        setStored('products', nextProducts);
        return nextProducts;
      });
    }

    // Automatically create real PaymentLog
    const gwId: PaymentGatewayId = (newOrder.paymentMethod as PaymentGatewayId) || 'RAZORPAY';
    const isCod = gwId === 'COD';
    const status = isCod ? 'PENDING' : (newOrder.paymentStatus === 'PAID' || newOrder.paymentStatus === 'Paid' ? 'SUCCESSFUL' : 'PENDING');

    addPaymentLog({
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      customerName: newOrder.customer.name,
      customerEmail: newOrder.customer.email,
      gateway: gwId,
      amount: newOrder.convertedTotal || newOrder.totalAmountINR,
      currency: newOrder.currencyCode || 'INR',
      amountINR: newOrder.totalAmountINR,
      status,
      transactionId: isCod ? `COD_${newOrder.orderNumber}` : `pay_${gwId.toLowerCase()}_${Date.now()}`,
      paymentMethodDetails: `${gwId} Direct Checkout`,
    });

    clearCart();
    return newOrder;
  };

  const restoreStockForOrder = (targetOrder: Order) => {
    if (targetOrder.stockRestored) return;
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((p) => {
        const itemInOrder = targetOrder.items.find((item) => item.product.id === p.id);
        if (itemInOrder) {
          const currentStock = typeof p.stock === 'number' ? p.stock : 100;
          const newStock = currentStock + itemInOrder.quantity;
          return {
            ...p,
            stock: newStock,
            inStock: newStock > 0,
          };
        }
        return p;
      });
      setStored('products', updatedProducts);
      return updatedProducts;
    });
  };

  const updateOrderStatus = (
    orderId: string,
    status: Order['trackingStatus'],
    trackingNumber?: string,
    courier?: string
  ) => {
    setOrders((prev) => {
      const targetOrder = prev.find((o) => o.id === orderId);
      const isCancelling = status === 'CANCELLED' || status === 'Cancelled';
      if (targetOrder && isCancelling && !targetOrder.stockRestored) {
        restoreStockForOrder(targetOrder);
      }

      const next = prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              trackingStatus: status,
              trackingNumber: trackingNumber || o.trackingNumber,
              courierName: courier || o.courierName,
              stockRestored: isCancelling ? true : o.stockRestored,
            }
          : o
      );
      setStored('orders', next);
      return next;
    });
  };

  const updateOrderDetails = (orderId: string, updates: Partial<Order>) => {
    setOrders((prev) => {
      const targetOrder = prev.find((o) => o.id === orderId);
      const isCancelling = updates.trackingStatus === 'CANCELLED' || updates.trackingStatus === 'Cancelled';
      const isRefunding = updates.paymentStatus === 'REFUNDED' || updates.paymentStatus === 'Refunded';

      if (targetOrder && (isCancelling || isRefunding) && !targetOrder.stockRestored) {
        restoreStockForOrder(targetOrder);
      }

      const next = prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              ...updates,
              stockRestored: (isCancelling || isRefunding) ? true : o.stockRestored,
            }
          : o
      );
      setStored('orders', next);
      return next;
    });
  };

  // User Accounts & Customer Portal Actions
  const loginUser = (email: string, _password?: string) => {
    const formattedEmail = email.trim().toLowerCase();
    const existing = customerAccounts.find((c) => c.email.toLowerCase() === formattedEmail);
    if (existing) {
      if (existing.status === 'BLOCKED') {
        soundManager.play('error_warning');
        return {
          success: false,
          message: 'Your account has been restricted by administration. Please contact support@hakkiveda.com',
        };
      }
      const updatedUser: User = {
        ...existing,
        lastLogin: new Date().toLocaleString() + ' IST',
        loginHistory: [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleString() + ' IST',
            ipLocation: 'Mysore, Karnataka, India (Web Session)',
            device: 'Desktop / Mobile Browser',
          },
          ...(existing.loginHistory || []),
        ],
      };
      updateCustomerAccount(existing.id, updatedUser);
      setCurrentUser(updatedUser);
      setStored('current_user', updatedUser);
      soundManager.play('order_success');
      return { success: true, message: `Welcome back, ${existing.name}!` };
    }
    soundManager.play('error_warning');
    return { success: false, message: 'Account not found. Please click "Create Account" below.' };
  };

  const registerUser = (data: { name: string; email: string; phone?: string; password?: string }) => {
    const formattedEmail = data.email.trim().toLowerCase();
    const existing = customerAccounts.find((c) => c.email.toLowerCase() === formattedEmail);
    if (existing) {
      soundManager.play('error_warning');
      return { success: false, message: 'An account with this email already exists. Please Sign In.' };
    }
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      email: formattedEmail,
      phone: data.phone?.trim() || '',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`,
      addresses: [],
      isAdmin: false,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toLocaleString() + ' IST',
      loyaltyPoints: 100,
      referralCode: `HAKKI-${data.name.trim().split(' ')[0].toUpperCase()}-${Math.floor(10 + Math.random() * 89)}`,
      preferences: {
        country: selectedCountry.name,
        currency: currentCurrency.code,
        language: 'English',
        emailOrders: true,
        whatsappUpdates: true,
        promotional: true,
      },
      loginHistory: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleString() + ' IST',
          ipLocation: 'Web App Session',
          device: 'Browser Applet',
        },
      ],
    };
    setCustomerAccounts((prev) => {
      const next = [newUser, ...prev];
      setStored('customer_accounts', next);
      return next;
    });
    setCurrentUser(newUser);
    setStored('current_user', newUser);
    soundManager.play('order_success');
    return { success: true, message: `Account created successfully! 100 Welcome Points awarded.` };
  };

  const guestLogin = (email: string, name?: string) => {
    const guestUser: User = {
      id: `usr-guest-${Date.now()}`,
      name: name || email.split('@')[0] || 'Guest Customer',
      email: email || 'guest@hakkiveda.com',
      phone: '',
      addresses: [],
      isAdmin: false,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Just Now',
    };
    setCurrentUser(guestUser);
    setStored('current_user', guestUser);
    soundManager.play('form_submit');
  };

  const logoutUser = () => {
    soundManager.play('toggle_switch');
    setCurrentUser(null);
    setStored('current_user', null);
  };

  const updateUserProfile = (partial: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...partial };
    setCurrentUser(updated);
    setStored('current_user', updated);
    updateCustomerAccount(currentUser.id, partial);
    soundManager.play('form_submit');
  };

  const addSavedAddress = (addressData: Omit<SavedAddress, 'id'>) => {
    if (!currentUser) return;
    const newAddress: SavedAddress = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };
    let updatedAddresses = [...currentUser.addresses];
    if (newAddress.isDefault || updatedAddresses.length === 0) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
      newAddress.isDefault = true;
    }
    updatedAddresses.push(newAddress);
    updateUserProfile({ addresses: updatedAddresses });
  };

  const updateSavedAddress = (addressId: string, partial: Partial<SavedAddress>) => {
    if (!currentUser) return;
    let updatedAddresses = currentUser.addresses.map((a) =>
      a.id === addressId ? { ...a, ...partial } : a
    );
    if (partial.isDefault) {
      updatedAddresses = updatedAddresses.map((a) =>
        a.id === addressId ? { ...a, isDefault: true } : { ...a, isDefault: false }
      );
    }
    updateUserProfile({ addresses: updatedAddresses });
  };

  const deleteSavedAddress = (addressId: string) => {
    if (!currentUser) return;
    const updatedAddresses = currentUser.addresses.filter((a) => a.id !== addressId);
    updateUserProfile({ addresses: updatedAddresses });
  };

  const setDefaultAddress = (addressId: string) => {
    if (!currentUser) return;
    const updatedAddresses = currentUser.addresses.map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
    updateUserProfile({ addresses: updatedAddresses });
  };

  const toggleBlockCustomer = (userId: string) => {
    setCustomerAccounts((prev) => {
      const next = prev.map((u) => {
        if (u.id === userId) {
          const newStatus: 'ACTIVE' | 'BLOCKED' = u.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
          return { ...u, status: newStatus };
        }
        return u;
      });
      setStored('customer_accounts', next);
      return next;
    });
    soundManager.play('toggle_switch');
  };

  const updateCustomerAccount = (id: string, partial: Partial<User>) => {
    setCustomerAccounts((prev) => {
      const next = prev.map((u) => (u.id === id ? { ...u, ...partial } : u));
      setStored('customer_accounts', next);
      return next;
    });
  };

  const deleteCustomerAccount = (id: string) => {
    setCustomerAccounts((prev) => {
      const next = prev.filter((u) => u.id !== id);
      setStored('customer_accounts', next);
      return next;
    });
    if (currentUser?.id === id) {
      logoutUser();
    }
    soundManager.play('form_submit');
  };

  const exportCustomerData = (userId?: string) => {
    soundManager.play('form_submit');
    if (userId) {
      const target = customerAccounts.find((c) => c.id === userId);
      if (!target) return;
      const targetOrders = orders.filter((o) => o.customer.email.toLowerCase() === target.email.toLowerCase());
      const dossier = {
        customerProfile: target,
        associatedOrders: targetOrders,
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(dossier, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HAKKIVEDA_Customer_${target.name.replace(/\s+/g, '_')}_Dossier.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = ['ID', 'Name', 'Email', 'Phone', 'Status', 'Joined Date', 'Last Login', 'Loyalty Points', 'Saved Addresses Count'];
      const rows = customerAccounts.map((c) => [
        c.id,
        `"${c.name}"`,
        `"${c.email}"`,
        `"${c.phone}"`,
        c.status || 'ACTIVE',
        c.createdAt || 'N/A',
        `"${c.lastLogin || 'N/A'}"`,
        c.loyaltyPoints || 0,
        c.addresses?.length || 0,
      ]);
      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HAKKIVEDA_Customers_List_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // B2B Leads
  const addB2BLead = (lead: Omit<B2BLead, 'id' | 'createdAt' | 'status'>) => {
    const newLead: B2BLead = {
      ...lead,
      id: `b2b-${Date.now()}`,
      status: 'NEW',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setB2BLeads((prev) => {
      const next = [newLead, ...prev];
      setStored('b2b_leads', next);
      return next;
    });
  };

  const updateB2BLeadStatus = (id: string, status: B2BLead['status']) => {
    setB2BLeads((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, status } : l));
      setStored('b2b_leads', next);
      return next;
    });
  };

  const deleteB2BLead = (id: string) => {
    setB2BLeads((prev) => {
      const next = prev.filter((l) => l.id !== id);
      setStored('b2b_leads', next);
      return next;
    });
  };

  // CRUD Product
  const addProduct = (p: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...p, id: `prod-${Date.now()}` };
    setProducts((prev) => {
      const next = [...prev, newProduct];
      setStored('products', next);
      return next;
    });
  };

  const updateProduct = (id: string, partial: Partial<Product>) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...partial } : p));
      setStored('products', next);
      return next;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      setStored('products', next);
      return next;
    });
  };

  // CRUD Category
  const addCategory = (c: Omit<Category, 'id'>) => {
    const newCat: Category = { ...c, id: `cat-${Date.now()}` };
    setCategories((prev) => {
      const next = [...prev, newCat];
      setStored('categories', next);
      return next;
    });
  };

  const updateCategory = (id: string, partial: Partial<Category>) => {
    setCategories((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...partial } : c));
      setStored('categories', next);
      return next;
    });
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => {
      const next = prev.filter((c) => c.id !== id);
      setStored('categories', next);
      return next;
    });
  };

  const reorderCategories = (newCategories: Category[]) => {
    const next = newCategories.map((cat, idx) => ({
      ...cat,
      sortOrder: idx + 1,
    }));
    setCategories(next);
    setStored('categories', next);
  };

  // Hero Slider Settings & Operations
  const updateHeroSliderSettings = (partial: Partial<HeroSliderSettings>) => {
    setHeroSliderSettings((prev) => {
      const next = { ...prev, ...partial };
      setStored('hero_slider_settings', next);
      return next;
    });
  };

  const saveHeroSlides = async (slides: HeroSlide[]): Promise<boolean> => {
    console.log('Save hero slides function called:', slides);
    hasUserMutatedHeroSlidesRef.current = true;
    const normalized = slides.map(normalizeSlide);
    setHeroSlides(normalized);
    try {
      localStorage.setItem('hakkiveda_hero_slides', JSON.stringify(normalized));
    } catch (e) {}

    setDbSyncStatus('saving');
    setServerSaveError(null);

    try {
      const res = await fetch('/api/store/hero_slides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ value: normalized, data: normalized }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(errJson.error || `Server HTTP ${res.status}`);
      }

      const resData = await res.json().catch(() => null);
      const savedSlides = Array.isArray(resData?.data)
        ? resData.data
        : Array.isArray(resData?.value)
        ? resData.value
        : normalized;
      const finalSlides = savedSlides.map(normalizeSlide);

      setHeroSlides(finalSlides);
      try {
        localStorage.setItem('hakkiveda_hero_slides', JSON.stringify(finalSlides));
      } catch (e) {}

      await fetch('/api/hero-slides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ value: finalSlides, data: finalSlides }),
      }).catch(() => {});

      setDbSyncStatus('synced');
      console.log('Save successful and persisted hero slides:', finalSlides);
      return true;
    } catch (err: any) {
      console.error('[StoreContext] Save hero slides error:', err);
      setDbSyncStatus('error');
      setServerSaveError(`Server database save failed for hero_slides: ${err.message || 'Network issue'}`);
      throw err;
    }
  };

  const addHeroSlide = async (s: Omit<HeroSlide, 'id'>) => {
    hasUserMutatedHeroSlidesRef.current = true;
    const newSlide = normalizeSlide({
      ...s,
      id: `slide-${Date.now()}`,
      sortOrder: (heroSlides.length || 0) + 1,
      impressions: s.impressions || 0,
      clicks: s.clicks || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    const nextSlides = [...heroSlides, newSlide].map(normalizeSlide);
    setHeroSlides(nextSlides);
    try {
      localStorage.setItem('hakkiveda_hero_slides', JSON.stringify(nextSlides));
    } catch (e) {}
    await saveHeroSlides(nextSlides);
  };

  const updateHeroSlide = async (id: string, partial: Partial<HeroSlide>) => {
    hasUserMutatedHeroSlidesRef.current = true;
    const nextSlides = heroSlides.map((s) =>
      s.id === id ? normalizeSlide({ ...s, ...partial, updatedAt: new Date().toISOString() }) : normalizeSlide(s)
    );
    setHeroSlides(nextSlides);
    try {
      localStorage.setItem('hakkiveda_hero_slides', JSON.stringify(nextSlides));
    } catch (e) {}
    await saveHeroSlides(nextSlides);
  };

  const deleteHeroSlide = async (id: string) => {
    console.log('Delete slide clicked with id', id);
    hasUserMutatedHeroSlidesRef.current = true;
    const nextSlides = heroSlides.filter((s) => s.id !== id).map(normalizeSlide);
    console.log('Slides after deletion', nextSlides);
    setHeroSlides(nextSlides);
    try {
      localStorage.setItem('hakkiveda_hero_slides', JSON.stringify(nextSlides));
    } catch (e) {}
    await saveHeroSlides(nextSlides);
  };

  const reorderHeroSlides = async (newSlides: HeroSlide[]) => {
    hasUserMutatedHeroSlidesRef.current = true;
    const nextSlides = newSlides.map((slide, idx) =>
      normalizeSlide({
        ...slide,
        sortOrder: idx + 1,
      })
    );
    setHeroSlides(nextSlides);
    try {
      localStorage.setItem('hakkiveda_hero_slides', JSON.stringify(nextSlides));
    } catch (e) {}
    await saveHeroSlides(nextSlides);
  };

  const duplicateHeroSlide = async (id: string) => {
    hasUserMutatedHeroSlidesRef.current = true;
    const target = heroSlides.find((s) => s.id === id);
    if (!target) return;
    const copy = normalizeSlide({
      ...target,
      id: `slide-${Date.now()}`,
      title: `${target.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      impressions: 0,
      clicks: 0,
      sortOrder: heroSlides.length + 1,
    });
    const nextSlides = [...heroSlides, copy].map(normalizeSlide);
    setHeroSlides(nextSlides);
    try {
      localStorage.setItem('hakkiveda_hero_slides', JSON.stringify(nextSlides));
    } catch (e) {}
    await saveHeroSlides(nextSlides);
  };

  const trackSlideImpression = (id: string) => {
    setHeroSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, impressions: (s.impressions || 0) + 1 } : s))
    );
  };

  const trackSlideClick = (id: string) => {
    setHeroSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, clicks: (s.clicks || 0) + 1 } : s))
    );
  };

  // CRUD Blog
  const addBlog = (b: Omit<BlogArticle, 'id'>) => {
    const newBlog: BlogArticle = { ...b, id: `blog-${Date.now()}` };
    setBlogs((prev) => {
      const next = [...prev, newBlog];
      setStored('blogs', next);
      return next;
    });
  };

  const updateBlog = (id: string, partial: Partial<BlogArticle>) => {
    setBlogs((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, ...partial } : b));
      setStored('blogs', next);
      return next;
    });
  };

  const deleteBlog = (id: string) => {
    setBlogs((prev) => {
      const next = prev.filter((b) => b.id !== id);
      setStored('blogs', next);
      return next;
    });
  };

  const setAllBlogs = (nextBlogs: BlogArticle[]) => {
    setBlogs(nextBlogs);
    setStored('blogs', nextBlogs);
  };

  // CRUD Coupons
  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => {
      const next = [...prev.filter((c) => c.code !== coupon.code), coupon];
      setStored('coupons', next);
      return next;
    });
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => {
      const next = prev.filter((c) => c.code !== code);
      setStored('coupons', next);
      return next;
    });
  };

  // CRUD Reviews
  const addReview = (review: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => {
      const next = [newRev, ...prev];
      setStored('reviews', next);
      return next;
    });
  };

  const updateReview = (id: string, partial: Partial<Review>) => {
    setReviews((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...partial } : r));
      setStored('reviews', next);
      return next;
    });
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => {
      const next = prev.filter((r) => r.id !== id);
      setStored('reviews', next);
      return next;
    });
  };

  const setAllReviews = (nextReviews: Review[]) => {
    setReviews(nextReviews);
    setStored('reviews', nextReviews);
  };

  // CRUD Before & After
  const addBeforeAfterItem = (item: Omit<BeforeAfterItem, 'id'>) => {
    const newItem: BeforeAfterItem = { ...item, id: `ba-${Date.now()}` };
    setBeforeAfterItems((prev) => {
      const next = [...prev, newItem];
      setStored('before_after', next);
      return next;
    });
  };

  const updateBeforeAfterItem = (id: string, partial: Partial<BeforeAfterItem>) => {
    setBeforeAfterItems((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...partial } : item));
      setStored('before_after', next);
      return next;
    });
  };

  const deleteBeforeAfterItem = (id: string) => {
    setBeforeAfterItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      setStored('before_after', next);
      return next;
    });
  };

  const setAllBeforeAfterItems = (nextItems: BeforeAfterItem[]) => {
    setBeforeAfterItems(nextItems);
    setStored('before_after', nextItems);
  };

  // CRUD Testimonial Videos
  const addTestimonialVideo = (v: Omit<TestimonialVideo, 'id'>) => {
    const newVideo: TestimonialVideo = { ...v, id: `tv-${Date.now()}` };
    setTestimonialVideos((prev) => {
      const next = [...prev, newVideo];
      setStored('testimonial_videos', next);
      return next;
    });
  };

  const updateTestimonialVideo = (id: string, partial: Partial<TestimonialVideo>) => {
    setTestimonialVideos((prev) => {
      const next = prev.map((v) => (v.id === id ? { ...v, ...partial } : v));
      setStored('testimonial_videos', next);
      return next;
    });
  };

  const deleteTestimonialVideo = (id: string) => {
    setTestimonialVideos((prev) => {
      const next = prev.filter((v) => v.id !== id);
      setStored('testimonial_videos', next);
      return next;
    });
  };

  const setAllTestimonialVideos = (nextVideos: TestimonialVideo[]) => {
    setTestimonialVideos(nextVideos);
    setStored('testimonial_videos', nextVideos);
  };

  // CRUD Quiz Questions
  const addQuizQuestion = (q: Omit<QuizQuestion, 'id'>) => {
    const newQ: QuizQuestion = { ...q, id: `qq-${Date.now()}` };
    setQuizQuestions((prev) => {
      const next = [...prev, newQ];
      setStored('quiz_questions', next);
      return next;
    });
  };

  const updateQuizQuestion = (id: string, partial: Partial<QuizQuestion>) => {
    setQuizQuestions((prev) => {
      const next = prev.map((q) => (q.id === id ? { ...q, ...partial } : q));
      setStored('quiz_questions', next);
      return next;
    });
  };

  const deleteQuizQuestion = (id: string) => {
    setQuizQuestions((prev) => {
      const next = prev.filter((q) => q.id !== id);
      setStored('quiz_questions', next);
      return next;
    });
  };

  const setAllQuizQuestions = (nextQuestions: QuizQuestion[]) => {
    setQuizQuestions(nextQuestions);
    setStored('quiz_questions', nextQuestions);
  };

  // CRUD Media Items
  const addMediaItem = (item: Omit<MediaItem, 'id' | 'uploadedAt'>) => {
    const newMedia: MediaItem = {
      ...item,
      id: `med-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    setMediaItems((prev) => {
      const next = [newMedia, ...prev];
      setStored('media_items', next);
      return next;
    });
  };

  const deleteMediaItem = (id: string) => {
    setMediaItems((prev) => {
      const next = prev.filter((m) => m.id !== id);
      setStored('media_items', next);
      return next;
    });
  };

  const resetToDefaults = () => {
    localStorage.clear();
    sessionStorage.clear();
    idbClear().catch(() => {});
    setCurrencies(INITIAL_CURRENCIES);
    setCurrentCurrency(INITIAL_CURRENCIES[0]);
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setHeroSlides(INITIAL_HERO_SLIDES);
    setBeforeAfterItems(INITIAL_BEFORE_AFTER);
    setReviews(INITIAL_REVIEWS);
    setBlogs(INITIAL_BLOGS);
    setCoupons(INITIAL_COUPONS);
    setSiteSettings(INITIAL_SITE_SETTINGS);
    setNavLinks(INITIAL_NAV_LINKS);
    setTestimonialVideos(INITIAL_TESTIMONIAL_VIDEOS);
    setQuizQuestions(INITIAL_QUIZ_QUESTIONS);
    setMediaItems(INITIAL_MEDIA_ITEMS);
    setCountries(INITIAL_COUNTRIES);
    setPaymentGateways(INITIAL_PAYMENT_GATEWAYS);
    setCodRules(INITIAL_COD_RULES);
    setMarketGateways(INITIAL_MARKET_GATEWAYS);
    setPaymentLogs(INITIAL_PAYMENT_LOGS);
    setOrders([]);
    setB2BLeads([]);
    setCustomerAccounts([]);
    setCart([]);
    setAppliedCoupon(null);
    setWishlist([]);
    setCurrentUser(null);
    setAdminAuthenticated(false);
  };

  return (
    <StoreContext.Provider
      value={{
        soundEnabled,
        soundVolume,
        soundPack,
        adminMutedSound,
        toggleSound,
        setSoundEnabled,
        setSoundVolume,
        setSoundPack,
        setAdminMutedSound,
        playSound,
        adminAuthenticated,
        authenticateAdmin,
        logoutAdmin,
        updateAdminPassword,
        siteSettings,
        updateSiteSettings,
        brandIdentity,
        draftBrandIdentity,
        updateBrandIdentity,
        saveBrandDraft,
        publishBrandTheme,
        reloadThemeCache,
        applyBrandStyles,
        isPreviewingWebsiteTheme,
        setIsPreviewingWebsiteTheme,
        footerConfig,
        updateFooterConfig,
        resetFooterConfig,
        navLinks,
        addNavLink,
        updateNavLink,
        deleteNavLink,
        reorderNavLinks,
        duplicateNavLink,
        trackNavClick,
        trackNavImpression,
        resetNavAnalytics,
        headerLayoutSettings,
        updateHeaderLayoutSettings,
        currencies,
        currentCurrency,
        setCurrencyByCode,
        formatPrice,
        convertPrice,
        updateCurrencyRate,
        selectedCountry,
        selectCountry,
        currentMarket,
        markets,
        updateMarket,
        countries,
        updateCountrySetting,
        bulkUpdateCountries,
        products,
        categories,
        heroSlides,
        beforeAfterItems,
        reviews,
        blogs,
        coupons,
        testimonialVideos,
        quizQuestions,
        mediaItems,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartItemsCount,
        cartSubtotalINR,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmountINR,
        cartTotalINR,
        cartToast,
        showCartToast,
        hideCartToast,
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        orders,
        addOrder,
        refreshOrders,
        placeOrder,
        updateOrderStatus,
        updateOrderDetails,
        currentUser,
        setCurrentUser,
        customerAccounts,
        loginUser,
        registerUser,
        guestLogin,
        logoutUser,
        updateCustomerAccount,
        updateUserProfile,
        addSavedAddress,
        updateSavedAddress,
        deleteSavedAddress,
        setDefaultAddress,
        toggleBlockCustomer,
        deleteCustomerAccount,
        exportCustomerData,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isQuickViewOpen,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authInitialTab,
        setAuthInitialTab,
        openAuthModal,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isB2BModalOpen,
        setIsB2BModalOpen,
        isQuizOpen,
        setIsQuizOpen,
        isCountryModalOpen,
        setIsCountryModalOpen,
        b2bLeads,
        addB2BLead,
        updateB2BLeadStatus,
        deleteB2BLead,
        b2bSectionConfig,
        updateB2BSectionConfig,
        videoPopupConfig,
        updateVideoPopupConfig,
        homepageQuizBannerConfig,
        updateHomepageQuizBannerConfig,
        homepageEditorialConfig,
        updateHomepageEditorialConfig,
        shoppableReels,
        addShoppableReel,
        updateShoppableReel,
        deleteShoppableReel,
        reorderShoppableReels,
        setAllShoppableReels,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        heroSliderSettings,
        updateHeroSliderSettings,
        addHeroSlide,
        updateHeroSlide,
        deleteHeroSlide,
        reorderHeroSlides,
        duplicateHeroSlide,
        saveHeroSlides,
        trackSlideImpression,
        trackSlideClick,
        addBlog,
        updateBlog,
        deleteBlog,
        setAllBlogs,
        addCoupon,
        deleteCoupon,
        addReview,
        updateReview,
        deleteReview,
        setAllReviews,
        addBeforeAfterItem,
        updateBeforeAfterItem,
        deleteBeforeAfterItem,
        setAllBeforeAfterItems,
        addTestimonialVideo,
        updateTestimonialVideo,
        deleteTestimonialVideo,
        setAllTestimonialVideos,
        addQuizQuestion,
        updateQuizQuestion,
        deleteQuizQuestion,
        setAllQuizQuestions,
        addMediaItem,
        deleteMediaItem,
        paymentGateways,
        updatePaymentGateway,
        reorderPaymentGateways,
        testGatewayConnection,
        codRules,
        updateCodRules,
        marketGateways,
        updateMarketGateways,
        paymentLogs,
        addPaymentLog,
        refundPaymentLog,
        shiprocketSettings,
        updateShiprocketSettings,
        categoryPages,
        updateCategoryPage,
        reorderCategoryPages,
        maxBestSellersCount,
        updateMaxBestSellersCount,
        mobileNavConfig,
        updateMobileNavConfig,
        resetMobileNavConfig,
        dbSyncStatus,
        serverSaveError,
        resetToDefaults,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
