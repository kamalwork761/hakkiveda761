import { isNativeApp } from '../../utils/capacitorBridge';

export const LIVE_BASE_URL = 'https://hakkiveda.com';

/**
 * Checks if the current environment is running inside native Android / Capacitor app
 * or in developer preview mode.
 */
export function isRunningInNativeApp(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    isNativeApp() ||
    new URLSearchParams(window.location.search).get('view') === 'app' ||
    new URLSearchParams(window.location.search).get('app') === 'android' ||
    window.localStorage.getItem('preview_android_app') === 'true'
  );
}

/**
 * Resolves any relative API or upload/asset path to the live production server
 * when running inside native Android Capacitor, while leaving standard website paths intact.
 */
export function resolveNativeUrl(url: string | null | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  const native = isNativeApp();

  // If already absolute URL
  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    if (native) {
      try {
        const parsed = new URL(trimmed, LIVE_BASE_URL);
        if (
          parsed.hostname === 'localhost' ||
          parsed.hostname === '127.0.0.1' ||
          parsed.hostname === '10.0.2.2' ||
          parsed.protocol === 'capacitor:'
        ) {
          return `${LIVE_BASE_URL}${parsed.pathname}${parsed.search}${parsed.hash}`;
        }
      } catch {
        // Return original if parsing fails
      }
    }
    return trimmed;
  }

  // Inside native Android app, relative paths must resolve to https://hakkiveda.com
  if (native) {
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${LIVE_BASE_URL}${cleanPath}`;
  }

  // Standard website / PWA: keep path as is
  return trimmed;
}

/**
 * Specifically resolves image and media asset URLs with fallback support.
 */
export function resolveAssetUrl(
  url: string | null | undefined,
  fallback: string = '/images/hero_tribal_elders.jpg'
): string {
  if (!url || typeof url !== 'string' || !url.trim()) return fallback;
  const resolved = resolveNativeUrl(url);
  return resolved || fallback;
}

/**
 * Specifically resolves API endpoint URLs
 */
export function resolveApiUrl(endpoint: string): string {
  return resolveNativeUrl(endpoint);
}
