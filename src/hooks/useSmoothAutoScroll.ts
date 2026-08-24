import React, { useEffect, useRef, useCallback } from 'react';

interface UseSmoothAutoScrollOptions {
  itemCount: number;
  repeatCount: number;
  speed?: number; // pixels per frame (e.g. 0.6)
  pauseDuration?: number; // ms to pause after interaction (e.g. 2500)
}

export function useSmoothAutoScroll({
  itemCount,
  repeatCount,
  speed = 0.6,
  pauseDuration = 2500,
}: UseSmoothAutoScrollOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInteractingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const resumeTimerRef = useRef<number | null>(null);
  const subpixelAccumulatorRef = useRef(0);

  // Check prefers-reduced-motion
  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || itemCount <= 1 || isReducedMotion) return;

    let animId: number;

    const animate = () => {
      if (!isInteractingRef.current && container) {
        subpixelAccumulatorRef.current += speed;
        if (Math.abs(subpixelAccumulatorRef.current) >= 1) {
          const px = Math.floor(subpixelAccumulatorRef.current);
          container.scrollLeft += px;
          subpixelAccumulatorRef.current -= px;
        }

        const singleSetWidth = container.scrollWidth / repeatCount;
        if (singleSetWidth > 0 && container.scrollLeft >= singleSetWidth * (repeatCount - 1)) {
          container.scrollLeft -= singleSetWidth;
        }
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, [itemCount, repeatCount, speed, isReducedMotion]);

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
    // Resume auto-scroll after pauseDuration
    resumeTimerRef.current = window.setTimeout(() => {
      isInteractingRef.current = false;
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
