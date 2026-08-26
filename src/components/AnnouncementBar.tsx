import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { SiteSettings, AnnouncementMessage } from '../types/store';

interface AnnouncementBarProps {
  siteSettings?: SiteSettings;
  selectedCountry?: {
    code?: string;
    name?: string;
    flag?: string;
    currency?: string;
    symbol?: string;
    currencyCode?: string;
    currencySymbol?: string;
  } | null;
  onOpenCountryModal: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  siteSettings,
  selectedCountry,
  onOpenCountryModal,
}) => {
  const showBar = siteSettings?.announcementActive ?? true;
  const mode = siteSettings?.announcementMode || 'slide';
  const pauseDurationSec = siteSettings?.announcementPauseDuration || 3;
  const transitionSpeed = siteSettings?.announcementTransitionSpeed || 'normal';
  const direction = siteSettings?.announcementDirection || 'right_to_left';

  // Duration in seconds mapping
  const transitionDuration = useMemo(() => {
    switch (transitionSpeed) {
      case 'fast':
        return 0.3;
      case 'slow':
        return 0.7;
      case 'normal':
      default:
        return 0.5;
    }
  }, [transitionSpeed]);

  // Active messages list with safe fallback
  const activeMessages: AnnouncementMessage[] = useMemo(() => {
    const rawMessages = siteSettings?.announcementMessages;
    if (Array.isArray(rawMessages) && rawMessages.length > 0) {
      const enabled = rawMessages
        .filter((m) => m && m.enabled !== false && m.text && typeof m.text === 'string' && m.text.trim().length > 0)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      if (enabled.length > 0) return enabled;
    }

    // Fallback to legacy single announcementText or default
    const fallbackText =
      (typeof siteSettings?.announcementText === 'string' && siteSettings.announcementText.trim()) ||
      'Worldwide Express Shipping • 100% Authentic 42 Mountain Herbs Formula';
    return [
      {
        id: 'default-ann-1',
        text: fallbackText,
        link: '',
        enabled: true,
        sortOrder: 1,
      },
    ];
  }, [siteSettings?.announcementMessages, siteSettings?.announcementText]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideDir, setSlideDir] = useState<1 | -1>(1); // 1 = right-to-left, -1 = left-to-right
  const touchResumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  // Set directional sign
  useEffect(() => {
    setSlideDir(direction === 'left_to_right' ? -1 : 1);
  }, [direction]);

  // Reset index if out of bounds
  useEffect(() => {
    if (currentIndex >= activeMessages.length) {
      setCurrentIndex(0);
    }
  }, [activeMessages.length, currentIndex]);

  // Auto-advance loop when in 'slide' mode
  useEffect(() => {
    if (!showBar || mode !== 'slide' || activeMessages.length <= 1 || isPaused) {
      return;
    }

    const intervalMs = Math.max(2000, pauseDurationSec * 1000);
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeMessages.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [showBar, mode, activeMessages.length, isPaused, pauseDurationSec]);

  // Hover handlers for Desktop
  const handleMouseEnter = () => {
    if (mode === 'slide') setIsPaused(true);
  };
  const handleMouseLeave = () => {
    if (mode === 'slide') setIsPaused(false);
  };

  // Touch handlers for Mobile
  const handleTouchStart = () => {
    if (mode === 'slide') {
      if (touchResumeTimeoutRef.current) {
        clearTimeout(touchResumeTimeoutRef.current);
      }
      setIsPaused(true);
    }
  };

  const handleTouchEnd = () => {
    if (mode === 'slide') {
      if (touchResumeTimeoutRef.current) {
        clearTimeout(touchResumeTimeoutRef.current);
      }
      // Resume after ~2 seconds
      touchResumeTimeoutRef.current = setTimeout(() => {
        setIsPaused(false);
      }, 2000);
    }
  };

  useEffect(() => {
    return () => {
      if (touchResumeTimeoutRef.current) {
        clearTimeout(touchResumeTimeoutRef.current);
      }
    };
  }, []);

  if (!showBar) return null;

  const currentMsg = activeMessages[currentIndex] || activeMessages[0] || {
    id: 'default-ann-fallback',
    text: 'Worldwide Express Shipping • 100% Authentic 42 Mountain Herbs Formula',
    link: '',
    enabled: true,
    sortOrder: 1,
  };
  const bgColor = siteSettings?.announcementBgColor || 'var(--brand-gold)';
  const textColor = siteSettings?.announcementTextColor || 'var(--brand-primary-dark)';

  // Slide Animation Variants
  const slideVariants = {
    initial: {
      x: prefersReducedMotion ? 0 : `${slideDir * 100}%`,
      opacity: prefersReducedMotion ? 0 : 0.8,
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        x: {
          duration: prefersReducedMotion ? 0.01 : transitionDuration,
          ease: [0.22, 1, 0.36, 1],
        },
        opacity: {
          duration: prefersReducedMotion ? 0.25 : transitionDuration * 0.7,
        },
      },
    },
    exit: {
      x: prefersReducedMotion ? 0 : `${-slideDir * 100}%`,
      opacity: prefersReducedMotion ? 0 : 0.8,
      transition: {
        x: {
          duration: prefersReducedMotion ? 0.01 : transitionDuration,
          ease: [0.22, 1, 0.36, 1],
        },
        opacity: {
          duration: prefersReducedMotion ? 0.25 : transitionDuration * 0.7,
        },
      },
    },
  };

  return (
    <aside
      id="top-announcement-bar"
      role="region"
      aria-label="Announcement Bar"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
      className="relative py-1.5 px-2 text-xs font-bold font-sans uppercase tracking-[0.12em] sm:tracking-[0.18em] overflow-hidden z-50 border-b border-[var(--brand-primary-dark)]/10 flex items-center justify-between select-none"
    >
      {/* Center Announcement Area */}
      <div
        className="overflow-hidden flex-1 relative flex items-center justify-center min-h-[22px] px-1 sm:px-4 cursor-default"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* 1. SLIDE ANIMATION MODE (DEFAULT & REQUESTED) */}
        {mode === 'slide' && (
          <div className="relative w-full h-[22px] flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={currentMsg ? `${currentMsg.id || 'msg'}-${currentIndex}` : `ann-fallback-${currentIndex}`}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full flex items-center justify-center text-center px-1"
              >
                {currentMsg?.link ? (
                  <a
                    href={currentMsg.link}
                    className="inline-flex items-center justify-center gap-1.5 sm:gap-2 hover:opacity-85 transition-opacity max-w-full"
                    title={currentMsg.text}
                  >
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 opacity-90 animate-pulse" />
                    <span className="text-[10px] xs:text-[11px] sm:text-xs font-semibold sm:font-bold truncate max-w-[85vw] sm:max-w-none">
                      {currentMsg.text}
                    </span>
                  </a>
                ) : (
                  <span
                    className="inline-flex items-center justify-center gap-1.5 sm:gap-2 max-w-full"
                    title={currentMsg?.text}
                  >
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 opacity-90 animate-pulse" />
                    <span className="text-[10px] xs:text-[11px] sm:text-xs font-semibold sm:font-bold truncate max-w-[85vw] sm:max-w-none">
                      {currentMsg?.text || 'Worldwide Express Shipping • 100% Authentic 42 Mountain Herbs Formula'}
                    </span>
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* 2. CONTINUOUS MARQUEE MODE (IF CONFIGURED) */}
        {mode === 'marquee' && (
          <div className="animate-marquee whitespace-nowrap flex items-center">
            <div className="flex items-center gap-8 px-4 shrink-0">
              {activeMessages.map((msg, idx) => (
                <span key={`marq-a-${msg.id || idx}-${idx}`} className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0" />
                  <span className="text-[11px] sm:text-xs font-bold">{msg.text}</span>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-8 px-4 shrink-0">
              {activeMessages.map((msg, idx) => (
                <span key={`marq-b-${msg.id || idx}-${idx}`} className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0" />
                  <span className="text-[11px] sm:text-xs font-bold">{msg.text}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 3. STATIC MODE (IF CONFIGURED) */}
        {mode === 'static' && (
          <div className="w-full flex items-center justify-center text-center px-1">
            {currentMsg?.link ? (
              <a
                href={currentMsg.link}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 hover:opacity-85 transition-opacity max-w-full"
                title={currentMsg.text}
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 opacity-90" />
                <span className="text-[10px] xs:text-[11px] sm:text-xs font-semibold sm:font-bold truncate max-w-[85vw] sm:max-w-none">
                  {currentMsg.text}
                </span>
              </a>
            ) : (
              <span
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 max-w-full"
                title={currentMsg?.text}
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 opacity-90" />
                <span className="text-[10px] xs:text-[11px] sm:text-xs font-semibold sm:font-bold truncate max-w-[85vw] sm:max-w-none">
                  {currentMsg?.text || 'Worldwide Express Shipping • 100% Authentic 42 Mountain Herbs Formula'}
                </span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Global Country & Currency Switcher (Pinned Right & Completely Stationary) */}
      <div className="relative shrink-0 z-10 pl-2 pr-1 sm:pl-3 sm:pr-2 flex items-center gap-2 sm:gap-3">
        <span className="hidden lg:inline text-[10px] tracking-wider uppercase opacity-80 font-bold">
          Country:
        </span>
        <button
          onClick={onOpenCountryModal}
          className="flex items-center gap-1.5 bg-[var(--brand-primary-dark)] text-[var(--brand-gold)] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[10.5px] sm:text-[11px] font-semibold hover:bg-[var(--brand-primary-deeper)] transition-colors shadow-sm border border-[var(--brand-gold)]/30 active:scale-95 cursor-pointer"
          id="country-selector-btn"
          title="Change Country"
          type="button"
        >
          <span className="text-xs sm:text-sm leading-none">{selectedCountry?.flag || '🇮🇳'}</span>
          <span className="max-w-[70px] sm:max-w-none truncate">{selectedCountry?.name || 'India'}</span>
          <ChevronDown className="w-3 h-3 text-[var(--brand-gold)] shrink-0" />
        </button>
      </div>
    </aside>
  );
};
