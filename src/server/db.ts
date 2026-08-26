import path from 'path';
import fs from 'fs';
import {
  INITIAL_CURRENCIES,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_HERO_SLIDES,
  INITIAL_BEFORE_AFTER,
  INITIAL_REVIEWS,
  INITIAL_BLOGS,
  INITIAL_COUPONS,
  INITIAL_CUSTOMER_ACCOUNTS,
  INITIAL_ORDERS,
  INITIAL_SITE_SETTINGS,
  INITIAL_BRAND_IDENTITY,
  INITIAL_NAV_LINKS,
  INITIAL_HEADER_LAYOUT_SETTINGS,
  INITIAL_FOOTER_CONFIG,
  INITIAL_TESTIMONIAL_VIDEOS,
  INITIAL_QUIZ_QUESTIONS,
  INITIAL_MEDIA_ITEMS,
  INITIAL_COUNTRIES,
  INITIAL_MARKETS,
  INITIAL_PAYMENT_GATEWAYS,
  INITIAL_COD_RULES,
  INITIAL_MARKET_GATEWAYS,
  INITIAL_PAYMENT_LOGS,
  INITIAL_B2B_SECTION_CONFIG,
  INITIAL_VIDEO_POPUP_CONFIG,
  INITIAL_SHOPPABLE_REELS,
  INITIAL_CATEGORY_PAGES,
  INITIAL_HOMEPAGE_QUIZ_BANNER_CONFIG,
  INITIAL_MOBILE_NAV_CONFIG,
  INITIAL_HOMEPAGE_EDITORIAL_CONFIG,
} from '../data/initialData';

const DEFAULT_HERO_SLIDER_SETTINGS = {
  autoPlay: true,
  autoPlayDelay: 6,
  transitionSpeed: 700,
  pauseOnHover: true,
  infiniteLoop: true,
  swipeSupport: true,
};

const dbDir = process.env.DB_DIR || path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.DB_PATH || path.join(dbDir, 'store.json');

interface StoreMemory {
  seeded?: boolean;
  [key: string]: any;
}

let storeMemoryCache: StoreMemory | null = null;
let saveDebounceTimer: NodeJS.Timeout | null = null;

// Read memory cache from disk synchronously on startup or return cached
function loadMemoryFromDisk(): StoreMemory {
  if (storeMemoryCache) return storeMemoryCache;

  if (fs.existsSync(dbPath)) {
    try {
      const raw = fs.readFileSync(dbPath, 'utf-8');
      storeMemoryCache = JSON.parse(raw);
      return storeMemoryCache!;
    } catch (err) {
      console.error('[File DB] Error reading store.json, reinitializing:', err);
    }
  }

  storeMemoryCache = {};
  return storeMemoryCache!;
}

// Atomic file write to avoid partial write corruption & race conditions
let isFlushing = false;
let needsFlush = false;

async function flushToDisk(): Promise<void> {
  if (!storeMemoryCache) return;
  if (isFlushing) {
    needsFlush = true;
    return;
  }
  isFlushing = true;

  try {
    if (!fs.existsSync(dbDir)) {
      await fs.promises.mkdir(dbDir, { recursive: true });
    }
    const tempPath = `${dbPath}.tmp`;
    const dataString = JSON.stringify(storeMemoryCache, null, 2);
    await fs.promises.writeFile(tempPath, dataString, 'utf-8');
    await fs.promises.rename(tempPath, dbPath);
  } catch (err) {
    console.error('[File DB] Error writing store.json:', err);
  } finally {
    isFlushing = false;
    if (needsFlush) {
      needsFlush = false;
      await flushToDisk();
    }
  }
}

function queueDiskSave() {
  if (saveDebounceTimer) clearTimeout(saveDebounceTimer);
  saveDebounceTimer = setTimeout(() => {
    flushToDisk();
  }, 100);
}

export async function getDb() {
  const store = loadMemoryFromDisk();

  if (!store.seeded) {
    console.log('[File DB] First-time startup detected. Seeding initial store data into', dbPath);

    const defaultDataMap: Record<string, any> = {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      hero_slides: INITIAL_HERO_SLIDES,
      hero_slider_settings: {
        autoPlay: true,
        autoPlayDelay: 6,
        transitionSpeed: 700,
        pauseOnHover: true,
        infiniteLoop: true,
        swipeSupport: true,
      },
      before_after: INITIAL_BEFORE_AFTER,
      reviews: INITIAL_REVIEWS,
      blogs: INITIAL_BLOGS,
      coupons: INITIAL_COUPONS,
      testimonial_videos: INITIAL_TESTIMONIAL_VIDEOS,
      quiz_questions: INITIAL_QUIZ_QUESTIONS,
      media_items: INITIAL_MEDIA_ITEMS,
      orders: INITIAL_ORDERS,
      b2b_leads: [],
      customer_accounts: INITIAL_CUSTOMER_ACCOUNTS,
      site_settings: INITIAL_SITE_SETTINGS,
      brand_identity: INITIAL_BRAND_IDENTITY,
      brand_identity_draft: INITIAL_BRAND_IDENTITY,
      header_layout_settings: INITIAL_HEADER_LAYOUT_SETTINGS,
      nav_links: INITIAL_NAV_LINKS,
      currencies: INITIAL_CURRENCIES,
      current_currency: INITIAL_CURRENCIES[0],
      markets: INITIAL_MARKETS,
      countries: INITIAL_COUNTRIES,
      payment_gateways: INITIAL_PAYMENT_GATEWAYS,
      cod_rules: INITIAL_COD_RULES,
      market_gateways: INITIAL_MARKET_GATEWAYS,
      payment_logs: INITIAL_PAYMENT_LOGS,
      b2b_section_config: INITIAL_B2B_SECTION_CONFIG,
      video_popup_config: INITIAL_VIDEO_POPUP_CONFIG,
      shoppable_reels: INITIAL_SHOPPABLE_REELS,
      category_pages: INITIAL_CATEGORY_PAGES,
      homepage_quiz_banner_config: INITIAL_HOMEPAGE_QUIZ_BANNER_CONFIG,
      mobile_nav_config: INITIAL_MOBILE_NAV_CONFIG,
      homepage_editorial_config: INITIAL_HOMEPAGE_EDITORIAL_CONFIG,
      max_bestsellers_count: 8,
      seeded: true,
    };

    Object.assign(store, defaultDataMap);
    await flushToDisk();
    console.log('[File DB] Successfully seeded initial store records!');
  } else {
    // Ensure missing configs and partial records are safely merged with defaults in existing database
    let needsFlush = false;
    if (store.site_settings) {
      store.site_settings = { ...INITIAL_SITE_SETTINGS, ...store.site_settings };
    } else {
      store.site_settings = INITIAL_SITE_SETTINGS;
      needsFlush = true;
    }
    if (store.brand_identity) {
      store.brand_identity = { ...INITIAL_BRAND_IDENTITY, ...store.brand_identity };
    } else {
      store.brand_identity = INITIAL_BRAND_IDENTITY;
      needsFlush = true;
    }
    if (store.header_layout_settings) {
      store.header_layout_settings = { ...INITIAL_HEADER_LAYOUT_SETTINGS, ...store.header_layout_settings };
    } else {
      store.header_layout_settings = INITIAL_HEADER_LAYOUT_SETTINGS;
      needsFlush = true;
    }
    if (store.footer_config) {
      store.footer_config = { ...INITIAL_FOOTER_CONFIG, ...store.footer_config };
    } else {
      store.footer_config = INITIAL_FOOTER_CONFIG;
      needsFlush = true;
    }
    if (store.hero_slider_settings) {
      store.hero_slider_settings = { ...DEFAULT_HERO_SLIDER_SETTINGS, ...store.hero_slider_settings };
    } else {
      store.hero_slider_settings = DEFAULT_HERO_SLIDER_SETTINGS;
      needsFlush = true;
    }
    if (!store.mobile_nav_config) {
      store.mobile_nav_config = INITIAL_MOBILE_NAV_CONFIG;
      needsFlush = true;
    } else {
      store.mobile_nav_config = { ...INITIAL_MOBILE_NAV_CONFIG, ...store.mobile_nav_config };
    }
    if (!store.homepage_quiz_banner_config) {
      store.homepage_quiz_banner_config = INITIAL_HOMEPAGE_QUIZ_BANNER_CONFIG;
      needsFlush = true;
    } else {
      store.homepage_quiz_banner_config = { ...INITIAL_HOMEPAGE_QUIZ_BANNER_CONFIG, ...store.homepage_quiz_banner_config };
    }
    if (!store.homepage_editorial_config) {
      store.homepage_editorial_config = INITIAL_HOMEPAGE_EDITORIAL_CONFIG;
      needsFlush = true;
    } else {
      store.homepage_editorial_config = { ...INITIAL_HOMEPAGE_EDITORIAL_CONFIG, ...store.homepage_editorial_config };
    }
    if (needsFlush) {
      await flushToDisk();
    }
    console.log('[File DB] Loaded existing database from', dbPath);
  }

  return store;
}

export async function getStoreValue<T = any>(key: string): Promise<T | null> {
  const store = loadMemoryFromDisk();
  if (!(key in store)) {
    if (key === 'site_settings') return INITIAL_SITE_SETTINGS as unknown as T;
    if (key === 'brand_identity') return INITIAL_BRAND_IDENTITY as unknown as T;
    if (key === 'header_layout_settings') return INITIAL_HEADER_LAYOUT_SETTINGS as unknown as T;
    if (key === 'footer_config') return INITIAL_FOOTER_CONFIG as unknown as T;
    if (key === 'homepage_quiz_banner_config') return INITIAL_HOMEPAGE_QUIZ_BANNER_CONFIG as unknown as T;
    if (key === 'mobile_nav_config') return INITIAL_MOBILE_NAV_CONFIG as unknown as T;
    if (key === 'homepage_editorial_config') return INITIAL_HOMEPAGE_EDITORIAL_CONFIG as unknown as T;
    return null;
  }
  return store[key] as T;
}

export async function setStoreValue(key: string, value: any): Promise<boolean> {
  const store = loadMemoryFromDisk();
  store[key] = value;
  await flushToDisk();
  console.log(`[File DB] setStoreValue updated '${key}'`);
  return true;
}

export async function getAllStoreData(): Promise<Record<string, any>> {
  const store = loadMemoryFromDisk();
  const result: Record<string, any> = {};
  for (const [k, v] of Object.entries(store)) {
    if (k !== 'seeded') {
      result[k] = v;
    }
  }
  return result;
}

export async function getPublicStoreData(): Promise<Record<string, any>> {
  const store = loadMemoryFromDisk();
  const privateKeys = new Set(['seeded', 'b2b_leads', 'customer_accounts', 'payment_logs']);
  const result: Record<string, any> = {};
  for (const [k, v] of Object.entries(store)) {
    if (!privateKeys.has(k)) {
      result[k] = v;
    }
  }
  return result;
}
