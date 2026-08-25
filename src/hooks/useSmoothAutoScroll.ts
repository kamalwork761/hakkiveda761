import React, { useEffect, useRef, useCallback } from 'react';

interface UseSmoothAutoScrollOptions {
  itemCount: number;
  repeatCount: number;
  pixelsPerSecond?: number; // default ~32px/s (smooth, slow ecommerce marquee)
  pauseDuration?: number; // ms to pause after interaction (default 2500ms)
}

export function useSmoothAutoScroll({
  itemCount,
  repeatCount,
  pixelsPerSecond = 32,
  pauseDuration = 2500,
}: UseSmoothAutoScrollOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInteractingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const isVisibleRef = useRef(true);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const resumeTimerRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const subpixelAccumulatorRef = useRef(0);
  const hasInitializedScrollRef = useRef(false);

  // Check prefers-reduced-motion
  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // IntersectionObserver to only scroll when visible
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Main continuous auto-scroll loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container || itemCount <= 1 || isReducedMotion) return;

    // Ensure immediate, non-smooth programmatic scroll increments
    container.style.scrollBehavior = 'auto';

    let animId: number;

    // Center scroll on middle copy once measured
    const initTimer = setTimeout(() => {
      if (container && !hasInitializedScrollRef.current) {
        const singleSetWidth = container.scrollWidth / repeatCount;
        if (singleSetWidth > 0 && container.scrollLeft === 0) {
          container.scrollLeft = singleSetWidth;
          hasInitializedScrollRef.current = true;
        }
      }
    }, 150);

    const animate = (currentTime: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = currentTime;
      }
      const deltaMs = Math.min(currentTime - lastTimeRef.current, 100); // cap delta to avoid jumps
      lastTimeRef.current = currentTime;

      if (!isInteractingRef.current && isVisibleRef.current && container) {
        const distance = (pixelsPerSecond * deltaMs) / 1000;
        subpixelAccumulatorRef.current += distance;

        if (subpixelAccumulatorRef.current >= 1) {
          const px = Math.floor(subpixelAccumulatorRef.current);
          container.scrollLeft += px;
          subpixelAccumulatorRef.current -= px;
        }

        const singleSetWidth = container.scrollWidth / repeatCount;
        if (singleSetWidth > 0) {
          if (container.scrollLeft >= singleSetWidth * (repeatCount - 1)) {
            container.scrollLeft -= singleSetWidth;
          } else if (container.scrollLeft <= 5) {
            container.scrollLeft += singleSetWidth;
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(initTimer);
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
      lastTimeRef.current = null;
    };
  }, [itemCount, repeatCount, pixelsPerSecond, isReducedMotion]);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    isInteractingRef.current = true;
    isDraggingRef.current = false;
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startXRef.current = clientX;
    startYRef.current = clientY;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    isInteractingRef.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaX = Math.abs(clientX - startXRef.current);
    const deltaY = Math.abs(clientY - startYRef.current);

    if (deltaX > 6 || deltaY > 6) {
      isDraggingRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    // Resume auto-scroll after pauseDuration (2.5s)
    resumeTimerRef.current = window.setTimeout(() => {
      isInteractingRef.current = false;
      lastTimeRef.current = null;
    }, pauseDuration);

    // Reset isDragging after brief delay so click events can read whether a drag occurred
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 120);
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container || itemCount <= 1) return;

    // Handle seamless infinite wrap during manual swipe or inertia scroll
    const singleSetWidth = container.scrollWidth / repeatCount;
    if (singleSetWidth > 0) {
      if (container.scrollLeft >= singleSetWidth * (repeatCount - 1)) {
        container.scrollLeft -= singleSetWidth;
      } else if (container.scrollLeft <= 5) {
        container.scrollLeft += singleSetWidth;
      }
    }
  };

  const isDragging = useCallback(() => isDraggingRef.current, []);

  return {
    containerRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleScroll,
    isDragging,
  };
}
