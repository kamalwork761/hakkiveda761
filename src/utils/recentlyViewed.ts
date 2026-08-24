/**
 * Recently Viewed Products Manager
 * Handles local persistence, deduplication, newest-first ordering, and max limit.
 */

const STORAGE_KEY = 'hakki_recently_viewed_products';
const MAX_RECENT_PRODUCTS = 20;

/**
 * Get the list of recently viewed product IDs from localStorage
 */
export const getRecentlyViewedIds = (currentProductId?: string): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    
    // Filter out strings only and exclude current product if provided
    const validIds = parsed.filter((id): id is string => typeof id === 'string' && Boolean(id.trim()));
    if (currentProductId) {
      return validIds.filter((id) => id !== currentProductId);
    }
    return validIds;
  } catch (err) {
    console.warn('[RecentlyViewed] Error reading from storage:', err);
    return [];
  }
};

/**
 * Record a viewed product ID into storage (deduplicated, newest first, max 20)
 */
export const recordRecentlyViewed = (productId: string): void => {
  if (typeof window === 'undefined' || !productId) return;
  try {
    const existing = getRecentlyViewedIds();
    // Remove if already exists so we can move it to the front (newest)
    const filtered = existing.filter((id) => id !== productId);
    const updated = [productId, ...filtered].slice(0, MAX_RECENT_PRODUCTS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch custom event for real-time reactivity
    window.dispatchEvent(new CustomEvent('hakki:recently_viewed_updated', { detail: { productId, list: updated } }));
  } catch (err) {
    console.warn('[RecentlyViewed] Error recording product view:', err);
  }
};

/**
 * Clear all recently viewed products
 */
export const clearRecentlyViewed = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('hakki:recently_viewed_updated', { detail: { list: [] } }));
  } catch (err) {
    console.warn('[RecentlyViewed] Error clearing storage:', err);
  }
};
