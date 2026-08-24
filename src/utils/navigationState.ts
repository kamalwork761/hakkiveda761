import { Product } from '../types/store';
import { slugify } from './productUtils';

// In-memory cache for fast lookup during active session
const entrySourceMap = new Map<string, string>();

const STORAGE_PREFIX = 'hakki_pdp_entry_src_';

/**
 * Normalizes a URL path to check if it's a product reviews page
 */
export const isReviewsPath = (path?: string | null): boolean => {
  if (!path) return false;
  const clean = path.split('?')[0].split('#')[0].toLowerCase().trim();
  return /^\/products\/[^/]+\/reviews\/?$/.test(clean);
};

/**
 * Checks if path is a product detail page (and not reviews)
 */
export const isProductPath = (path?: string | null): boolean => {
  if (!path) return false;
  const clean = path.split('?')[0].split('#')[0].toLowerCase().trim();
  return /^\/products\/[^/]+\/?$/.test(clean) && !clean.endsWith('/reviews');
};

/**
 * Extracts product slug from a product path
 */
export const extractProductSlugFromPath = (path?: string | null): string | null => {
  if (!path) return null;
  const clean = path.split('?')[0].split('#')[0].trim();
  const match = clean.match(/^\/products\/([^/]+)/i);
  return match ? decodeURIComponent(match[1]).toLowerCase() : null;
};

/**
 * Normalizes any category identifier to its clean route path
 */
export const getCategoryRouteFromId = (catIdOrName?: string | null): string => {
  if (!catIdOrName) return '/';
  const clean = catIdOrName.toLowerCase().trim();

  if (
    clean === 'hair-care' ||
    clean === 'hair care' ||
    clean.includes('hair') ||
    clean.includes('cleanser') ||
    clean.includes('serum') ||
    clean.includes('oil')
  ) {
    return '/hair-care';
  }

  if (
    clean === 'skin-care' ||
    clean === 'skin care' ||
    clean.includes('skin') ||
    clean.includes('lepa') ||
    clean.includes('mask') ||
    clean.includes('powder')
  ) {
    return '/skin-care';
  }

  if (
    clean === 'tribal-wellness' ||
    clean === 'tribal wellness' ||
    clean.includes('wellness') ||
    clean.includes('combo') ||
    clean.includes('kit')
  ) {
    return '/tribal-wellness';
  }

  return '/';
};

/**
 * Records the source page when entering a product page.
 * Crucial: If entering from reviews (e.g. Back to Product), do NOT overwrite the original entry source!
 */
export const recordNavigationSource = (targetPath: string, currentPath?: string) => {
  const current = currentPath || (typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}${window.location.hash}` : '');

  // Only track when landing on a valid product detail page
  if (isProductPath(targetPath)) {
    const targetSlug = extractProductSlugFromPath(targetPath);
    if (!targetSlug) return;

    // If currently coming from a reviews page, NEVER overwrite the original product source!
    if (isReviewsPath(current)) {
      return;
    }

    // If current is the exact same product path, do not overwrite
    if (isProductPath(current) && extractProductSlugFromPath(current) === targetSlug) {
      return;
    }

    // A valid source is any non-reviews page (e.g. /hair-care, /skin-care, /, /search?..., or previous product /products/other)
    if (current && !isReviewsPath(current)) {
      entrySourceMap.set(targetSlug, current);
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem(`${STORAGE_PREFIX}${targetSlug}`, current);
        }
      } catch (_) {}
    }
  }
};

/**
 * Explicitly sets the product entry source for a slug (e.g. when opening from a product card)
 */
export const setProductEntrySource = (slug: string, sourcePath: string) => {
  if (!slug || !sourcePath || isReviewsPath(sourcePath)) return;
  const cleanSlug = slug.toLowerCase().trim();
  
  entrySourceMap.set(cleanSlug, sourcePath);
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(`${STORAGE_PREFIX}${cleanSlug}`, sourcePath);
    }
  } catch (_) {}
};

/**
 * Gets the stored original entry source for a product slug.
 * Returns null if not found or if invalid (e.g. points to a reviews page).
 */
export const getProductEntrySource = (slug: string): string | null => {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();

  let source = entrySourceMap.get(cleanSlug) || null;

  if (!source && typeof window !== 'undefined' && window.sessionStorage) {
    try {
      source = window.sessionStorage.getItem(`${STORAGE_PREFIX}${cleanSlug}`);
    } catch (_) {}
  }

  // Safety check: if source points to a reviews page, discard it
  if (source && isReviewsPath(source)) {
    return null;
  }

  // Safety check: if source points to the same product page, discard to avoid self-loop
  if (source && isProductPath(source) && extractProductSlugFromPath(source) === cleanSlug) {
    return null;
  }

  return source;
};

/**
 * Determines the category fallback route for a product
 */
export const getProductCategoryRoute = (product: { category?: string; primaryCategory?: string }): string => {
  if (product.primaryCategory) {
    const route = getCategoryRouteFromId(product.primaryCategory);
    if (route !== '/') return route;
  }
  return getCategoryRouteFromId(product.category);
};

/**
 * Resolves the ultimate Back destination for a product detail page:
 * Priority 1: Stored original product-entry source (e.g. /hair-care, /skin-care, /tribal-wellness, /search?q=..., previous product)
 * Priority 2: Homepage '/' fallback for direct visits
 */
export const resolveProductBackDestination = (
  product: Product,
  currentSlug?: string
): string => {
  const slug = currentSlug || product.slug || slugify(product.name) || product.id;

  // 1. Try original entry source
  const entrySource = getProductEntrySource(slug);
  if (entrySource && !isReviewsPath(entrySource)) {
    return entrySource;
  }

  // 2. Direct product URL visit fallback: Homepage '/'
  return '/';
};
