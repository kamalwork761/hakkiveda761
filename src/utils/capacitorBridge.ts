import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Browser } from '@capacitor/browser';

export const isNativeAndroid = (): boolean => {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
};

export const isNativeApp = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Configure production API redirection for Capacitor Android wrapper.
 * Ensures the native Android app communicates with live https://hakkiveda.com
 * without hardcoding or breaking local development or PWA desktop web.
 */
export function setupCapacitorApiProxy(): void {
  if (!isNativeApp()) return;

  const LIVE_BASE_URL = 'https://hakkiveda.com';
  const originalFetch = window.fetch;

  window.fetch = function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    try {
      if (typeof input === 'string') {
        if (input.startsWith('/api/') || input.startsWith('/uploads/')) {
          input = `${LIVE_BASE_URL}${input}`;
        }
      } else if (input instanceof URL) {
        if (
          (input.pathname.startsWith('/api/') || input.pathname.startsWith('/uploads/')) &&
          (input.hostname === 'localhost' || input.hostname === '127.0.0.1' || input.origin === window.location.origin)
        ) {
          input = new URL(input.pathname + input.search, LIVE_BASE_URL);
        }
      } else if (input instanceof Request) {
        const url = new URL(input.url);
        if (
          (url.pathname.startsWith('/api/') || url.pathname.startsWith('/uploads/')) &&
          (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.origin === window.location.origin)
        ) {
          const targetUrl = `${LIVE_BASE_URL}${url.pathname}${url.search}`;
          input = new Request(targetUrl, input);
        }
      }
    } catch (e) {
      console.warn('[HAKKIVEDA Capacitor] URL rewriting error:', e);
    }

    return originalFetch(input, init);
  };

  console.log('[HAKKIVEDA Capacitor] Native API proxy active -> targeting', LIVE_BASE_URL);
}

/**
 * Configure native UI: Status bar styling, splash screen dismissal, and back button handling.
 */
export function setupCapacitorApp(): void {
  if (!isNativeApp()) return;

  // 1. Setup Status Bar with HAKKIVEDA forest green theme
  try {
    StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    StatusBar.setBackgroundColor({ color: '#0E3B2E' }).catch(() => {});
  } catch (e) {
    console.warn('[HAKKIVEDA Capacitor] StatusBar init warning:', e);
  }

  // 2. Hide Splash Screen smoothly once React DOM is mounted
  try {
    setTimeout(() => {
      SplashScreen.hide({ fadeOutDuration: 400 }).catch(() => {});
    }, 500);
  } catch (e) {
    console.warn('[HAKKIVEDA Capacitor] SplashScreen warning:', e);
  }

  // 3. Android Back Button Handling
  try {
    CapApp.addListener('backButton', ({ canGoBack }) => {
      // Fire custom event to see if any modal / drawer / popup wants to handle closing
      const event = new CustomEvent('hakkiveda:android-back', {
        cancelable: true,
        bubbles: true,
      });

      const handled = !window.dispatchEvent(event);

      // If a modal or sheet handled it, do nothing further
      if (handled) {
        return;
      }

      // Check current route/history
      const currentPath = window.location.pathname;
      const isRoot = currentPath === '/' || currentPath === '';

      // If on root page and no modal is active, exit the app cleanly
      if (isRoot) {
        CapApp.exitApp();
      } else if (canGoBack) {
        window.history.back();
      } else {
        window.history.back();
      }
    });
  } catch (e) {
    console.warn('[HAKKIVEDA Capacitor] Back button listener warning:', e);
  }

  // 4. External link interceptor (WhatsApp, tel, mailto, external websites)
  setupExternalLinksHandler();
}

/**
 * Handle external links (WhatsApp, tel:, mailto:, external websites)
 */
function setupExternalLinksHandler(): void {
  if (typeof document === 'undefined') return;

  document.addEventListener(
    'click',
    (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Handle WhatsApp links
      if (href.startsWith('whatsapp://') || href.includes('wa.me/') || href.includes('api.whatsapp.com/')) {
        e.preventDefault();
        window.open(href, '_system');
        return;
      }

      // Handle Phone calls
      if (href.startsWith('tel:')) {
        e.preventDefault();
        window.open(href, '_system');
        return;
      }

      // Handle Emails
      if (href.startsWith('mailto:')) {
        e.preventDefault();
        window.open(href, '_system');
        return;
      }

      // Handle external web links
      if (href.startsWith('http://') || href.startsWith('https://')) {
        try {
          const parsed = new URL(href);
          const isInternal =
            parsed.hostname === window.location.hostname ||
            parsed.hostname === 'hakkiveda.com' ||
            parsed.hostname.endsWith('.hakkiveda.com');

          if (!isInternal && isNativeApp()) {
            e.preventDefault();
            Browser.open({ url: href }).catch(() => {
              window.open(href, '_system');
            });
          }
        } catch {
          // ignore parsing error
        }
      }
    },
    { capture: true }
  );
}

/**
 * Open external URL in system browser or native intent
 */
export async function openExternalUrl(url: string): Promise<void> {
  if (isNativeApp()) {
    try {
      await Browser.open({ url });
    } catch {
      window.open(url, '_system');
    }
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
