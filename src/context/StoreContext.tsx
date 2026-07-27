import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
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
  SiteSettings,
  NavLink,
  TestimonialVideo,
  QuizQuestion,
  MediaItem,
  CountrySetting,
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
  INITIAL_NAV_LINKS,
  INITIAL_TESTIMONIAL_VIDEOS,
  INITIAL_QUIZ_QUESTIONS,
  INITIAL_MEDIA_ITEMS,
  INITIAL_COUNTRIES,
} from '../data/initialData';
import { hashPassword, DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD_PLAIN } from '../utils/auth';
import { CountryItem, DEFAULT_COUNTRY } from '../data/countriesData';

import { soundManager } from '../utils/soundManager';
import { SoundType, SoundPackId, AmbientPresetId } from '../config/soundConfig';

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

  // Continuous Nature Ambient Music System
  ambientEnabled: boolean;
  ambientVolume: number;
  ambientPreset: AmbientPresetId;
  toggleAmbient: () => boolean;
  setAmbientEnabled: (enabled: boolean) => void;
  setAmbientVolume: (vol: number) => void;
  setAmbientPreset: (preset: AmbientPresetId) => void;
  // Admin Authentication
  adminAuthenticated: boolean;
  authenticateAdmin: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logoutAdmin: () => void;
  updateAdminPassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;

  // Site Settings & Branding
  siteSettings: SiteSettings;
  updateSiteSettings: (partial: Partial<SiteSettings>) => void;

  // Nav Links
  navLinks: NavLink[];
  addNavLink: (navLink: Omit<NavLink, 'id'>) => void;
  updateNavLink: (id: string, partial: Partial<NavLink>) => void;
  deleteNavLink: (id: string) => void;

  // Currency & Location
  currencies: Currency[];
  currentCurrency: Currency;
  setCurrencyByCode: (code: string) => void;
  formatPrice: (priceINR: number) => string;
  convertPrice: (priceINR: number) => number;
  updateCurrencyRate: (code: string, newRateToINR: number) => void;

  // Selected Country
  selectedCountry: CountryItem;
  selectCountry: (country: CountryItem) => void;

  // Countries
  countries: CountrySetting[];
  updateCountrySetting: (code: string, partial: Partial<CountrySetting>) => void;

  // Catalog
  products: Product[];
  categories: Category[];
  heroSlides: HeroSlide[];
  beforeAfterItems: BeforeAfterItem[];
  reviews: Review[];
  blogs: BlogArticle[];
  coupons: Coupon[];
  testimonialVideos: TestimonialVideo[];
  quizQuestions: QuizQuestion[];
  mediaItems: MediaItem[];

  // Cart & Checkout
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartItemsCount: number;
  cartSubtotalINR: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmountINR: number;
  cartTotalINR: number;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
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

  addHeroSlide: (slide: Omit<HeroSlide, 'id'>) => void;
  updateHeroSlide: (id: string, slide: Partial<HeroSlide>) => void;
  deleteHeroSlide: (id: string) => void;

  addBlog: (blog: Omit<BlogArticle, 'id'>) => void;
  updateBlog: (id: string, blog: Partial<BlogArticle>) => void;
  deleteBlog: (id: string) => void;

  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;

  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  updateReview: (id: string, partial: Partial<Review>) => void;
  deleteReview: (id: string) => void;

  addBeforeAfterItem: (item: Omit<BeforeAfterItem, 'id'>) => void;
  updateBeforeAfterItem: (id: string, partial: Partial<BeforeAfterItem>) => void;
  deleteBeforeAfterItem: (id: string) => void;

  addTestimonialVideo: (video: Omit<TestimonialVideo, 'id'>) => void;
  updateTestimonialVideo: (id: string, partial: Partial<TestimonialVideo>) => void;
  deleteTestimonialVideo: (id: string) => void;

  addQuizQuestion: (q: Omit<QuizQuestion, 'id'>) => void;
  updateQuizQuestion: (id: string, partial: Partial<QuizQuestion>) => void;
  deleteQuizQuestion: (id: string) => void;

  addMediaItem: (item: Omit<MediaItem, 'id' | 'uploadedAt'>) => void;
  deleteMediaItem: (id: string) => void;

  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage helper
  const getStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`hakkiveda_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  const setStored = <T,>(key: string, value: T) => {
    try {
      localStorage.setItem(`hakkiveda_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('Storage set failed', e);
    }
  };

  // Sound System State & Handlers
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => soundManager.isEnabled());
  const [soundVolume, setSoundVolumeState] = useState<number>(() => soundManager.getVolume());
  const [soundPack, setSoundPackState] = useState<SoundPackId>(() => soundManager.getPack());
  const [adminMutedSound, setAdminMutedSoundState] = useState<boolean>(() => soundManager.isAdminMuted());

  // Nature Ambient Sound Engine State & Handlers
  const [ambientEnabled, setAmbientEnabledState] = useState<boolean>(() => soundManager.isAmbientEnabled());
  const [ambientVolume, setAmbientVolumeState] = useState<number>(() => soundManager.getAmbientVolume());
  const [ambientPreset, setAmbientPresetState] = useState<AmbientPresetId>(() => soundManager.getAmbientPreset());

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

  const toggleAmbient = () => {
    const next = soundManager.toggleAmbient();
    setAmbientEnabledState(next);
    return next;
  };

  const setAmbientEnabled = (enabled: boolean) => {
    soundManager.setAmbientEnabled(enabled);
    setAmbientEnabledState(enabled);
  };

  const setAmbientVolume = (vol: number) => {
    soundManager.setAmbientVolume(vol);
    setAmbientVolumeState(vol);
  };

  const setAmbientPreset = (preset: AmbientPresetId) => {
    soundManager.setAmbientPreset(preset);
    setAmbientPresetState(preset);
  };
  const [adminAccount, setAdminAccount] = useState<{ email: string; passwordHash: string }>(() => {
    const stored = localStorage.getItem('hakkiveda_admin_credentials');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return { email: DEFAULT_ADMIN_EMAIL, passwordHash: '' };
  });

  const [adminAuthenticated, setAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('hakkiveda_admin_auth') === 'true';
  });

  // Seed admin account password hash if missing
  useEffect(() => {
    if (!adminAccount.passwordHash) {
      hashPassword(DEFAULT_ADMIN_PASSWORD_PLAIN).then((hash) => {
        const initAccount = { email: DEFAULT_ADMIN_EMAIL, passwordHash: hash };
        setAdminAccount(initAccount);
        localStorage.setItem('hakkiveda_admin_credentials', JSON.stringify(initAccount));
      });
    }
  }, [adminAccount.passwordHash]);

  const authenticateAdmin = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    if (email.trim().toLowerCase() !== adminAccount.email.toLowerCase()) {
      return { success: false, message: 'Invalid admin email address.' };
    }
    const inputHash = await hashPassword(password);
    if (inputHash !== adminAccount.passwordHash) {
      return { success: false, message: 'Invalid admin password.' };
    }
    setAdminAuthenticated(true);
    sessionStorage.setItem('hakkiveda_admin_auth', 'true');
    return { success: true, message: 'Admin authentication successful.' };
  };

  const logoutAdmin = () => {
    setAdminAuthenticated(false);
    sessionStorage.removeItem('hakkiveda_admin_auth');
  };

  const updateAdminPassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const oldHash = await hashPassword(oldPassword);
    if (oldHash !== adminAccount.passwordHash) {
      return { success: false, message: 'Current password does not match.' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }
    const newHash = await hashPassword(newPassword);
    const updated = { ...adminAccount, passwordHash: newHash };
    setAdminAccount(updated);
    localStorage.setItem('hakkiveda_admin_credentials', JSON.stringify(updated));
    return { success: true, message: 'Admin password updated securely.' };
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

  // Nav Links
  const [navLinks, setNavLinks] = useState<NavLink[]>(() => getStored('nav_links', INITIAL_NAV_LINKS));
  const addNavLink = (item: Omit<NavLink, 'id'>) => {
    const newLink: NavLink = { ...item, id: `nav-${Date.now()}` };
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
      const next = prev.filter((l) => l.id !== id);
      setStored('nav_links', next);
      return next;
    });
  };

  // Currencies & Countries
  const [currencies, setCurrencies] = useState<Currency[]>(() => getStored('currencies', INITIAL_CURRENCIES));
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(() => getStored('current_currency', INITIAL_CURRENCIES[0]));
  const [countries, setCountries] = useState<CountrySetting[]>(() => getStored('countries', INITIAL_COUNTRIES));

  // Selected Country Persistence & Modal
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

  const setCurrencyByCode = (code: string) => {
    const found = currencies.find((c) => c.code === code);
    if (found) {
      setCurrentCurrency(found);
      setStored('current_currency', found);
    } else {
      // Default to USD if currency code not directly in currencies array
      const usdCurrency = currencies.find((c) => c.code === 'USD') || INITIAL_CURRENCIES[5];
      setCurrentCurrency(usdCurrency);
      setStored('current_currency', usdCurrency);
    }
  };

  const selectCountry = (country: CountryItem) => {
    soundManager.play('country_select');
    setSelectedCountry(country);
    localStorage.setItem('hakkiveda_selected_country', JSON.stringify(country));
    setCurrencyByCode(country.currencyCode);
  };

  // Sync currency with selected country on mount
  useEffect(() => {
    if (selectedCountry?.currencyCode) {
      setCurrencyByCode(selectedCountry.currencyCode);
    }
  }, []);

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

  const updateCountrySetting = (code: string, partial: Partial<CountrySetting>) => {
    setCountries((prev) => {
      const next = prev.map((c) => (c.code === code ? { ...c, ...partial } : c));
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
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => getStored('hero_slides', INITIAL_HERO_SLIDES));
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
  const [wishlist, setWishlist] = useState<Product[]>(() => getStored('wishlist', []));
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStored('current_user', null));

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isB2BModalOpen, setIsB2BModalOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

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
  const addToCart = (product: Product, quantity = 1) => {
    soundManager.play('add_to_cart');
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = prev.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updated = [...prev, { product, quantity }];
      }
      setStored('cart', updated);
      return updated;
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId);
      setStored('cart', updated);
      return updated;
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => {
      const updated = prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item));
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
  const toggleWishlist = (product: Product) => {
    soundManager.play('wishlist');
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      const updated = exists ? prev.filter((p) => p.id !== product.id) : [...prev, product];
      setStored('wishlist', updated);
      return updated;
    });
  };

  const isInWishlist = (productId: string) => wishlist.some((p) => p.id === productId);

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
  const placeOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>) => {
    soundManager.play('order_success');
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `HV-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split('T')[0],
    };
    setOrders((prev) => {
      const next = [newOrder, ...prev];
      setStored('orders', next);
      return next;
    });
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: Order['trackingStatus'],
    trackingNumber?: string,
    courier?: string
  ) => {
    setOrders((prev) => {
      const next = prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              trackingStatus: status,
              trackingNumber: trackingNumber || o.trackingNumber,
              courierName: courier || o.courierName,
            }
          : o
      );
      setStored('orders', next);
      return next;
    });
  };

  const updateOrderDetails = (orderId: string, updates: Partial<Order>) => {
    setOrders((prev) => {
      const next = prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o));
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

  // CRUD Hero Slide
  const addHeroSlide = (s: Omit<HeroSlide, 'id'>) => {
    const newSlide: HeroSlide = { ...s, id: `slide-${Date.now()}` };
    setHeroSlides((prev) => {
      const next = [...prev, newSlide];
      setStored('hero_slides', next);
      return next;
    });
  };

  const updateHeroSlide = (id: string, partial: Partial<HeroSlide>) => {
    setHeroSlides((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...partial } : s));
      setStored('hero_slides', next);
      return next;
    });
  };

  const deleteHeroSlide = (id: string) => {
    setHeroSlides((prev) => {
      const next = prev.filter((s) => s.id !== id);
      setStored('hero_slides', next);
      return next;
    });
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
        ambientEnabled,
        ambientVolume,
        ambientPreset,
        toggleAmbient,
        setAmbientEnabled,
        setAmbientVolume,
        setAmbientPreset,
        adminAuthenticated,
        authenticateAdmin,
        logoutAdmin,
        updateAdminPassword,
        siteSettings,
        updateSiteSettings,
        navLinks,
        addNavLink,
        updateNavLink,
        deleteNavLink,
        currencies,
        currentCurrency,
        setCurrencyByCode,
        formatPrice,
        convertPrice,
        updateCurrencyRate,
        selectedCountry,
        selectCountry,
        countries,
        updateCountrySetting,
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
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
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
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addHeroSlide,
        updateHeroSlide,
        deleteHeroSlide,
        addBlog,
        updateBlog,
        deleteBlog,
        addCoupon,
        deleteCoupon,
        addReview,
        updateReview,
        deleteReview,
        addBeforeAfterItem,
        updateBeforeAfterItem,
        deleteBeforeAfterItem,
        addTestimonialVideo,
        updateTestimonialVideo,
        deleteTestimonialVideo,
        addQuizQuestion,
        updateQuizQuestion,
        deleteQuizQuestion,
        addMediaItem,
        deleteMediaItem,
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
