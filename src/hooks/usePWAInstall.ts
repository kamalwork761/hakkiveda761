import { useEffect, useState, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const DISMISS_KEY = 'hakkiveda_pwa_dismissed';
const DISMISS_DURATION_DAYS = 7;

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Detect standalone mode (already installed as PWA or native webview)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    setIsInstalled(isStandalone);

    // Detect iOS devices
    const userAgent = (window.navigator.userAgent || '').toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Check if user previously dismissed recently
    try {
      const dismissedTimestamp = localStorage.getItem(DISMISS_KEY);
      if (dismissedTimestamp) {
        const diffDays = (Date.now() - parseInt(dismissedTimestamp, 10)) / (1000 * 60 * 60 * 24);
        if (diffDays < DISMISS_DURATION_DAYS) {
          setIsDismissed(true);
        } else {
          localStorage.removeItem(DISMISS_KEY);
        }
      }
    } catch {
      // Ignore localStorage access failures
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent automatic browser mini-infobar on mobile
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      try {
        localStorage.removeItem(DISMISS_KEY);
      } catch {}
      console.log('[HAKKIVEDA PWA] App was installed successfully');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      } else {
        // User declined the native dialog
        setDeferredPrompt(null);
        return false;
      }
    } catch (err) {
      console.warn('[HAKKIVEDA PWA] Install prompt error:', err);
      return false;
    }
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    setIsDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {}
  }, []);

  return {
    isInstallable: Boolean(deferredPrompt),
    isInstalled,
    isIOS,
    isDismissed,
    install,
    dismiss,
  };
}
