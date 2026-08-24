import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  RotateCcw,
  BadgeCheck,
  Clock,
  Landmark,
} from 'lucide-react';

export const MobileProductTrustStrip: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  // Auto-slide every 3 seconds (loop between slide 0 and slide 1)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const diff = touchStartXRef.current - touchEndXRef.current;
      // If swiped left (> 40px), move to next slide
      if (diff > 40) {
        setCurrentSlide(1);
      } else if (diff < -40) {
        // If swiped right (< -40px), move to previous slide
        setCurrentSlide(0);
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
    // Resume auto-slide after 2 seconds
    setTimeout(() => setIsPaused(false), 2000);
  };

  // Same-Day Dispatch Countdown Timer
  // Operational cutoff: 17:00 (5:00 PM local/IST)
  const [timeLeft, setTimeLeft] = useState<{
    hours: string;
    minutes: string;
    seconds: string;
  }>({
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(17, 0, 0, 0); // 5:00 PM Cutoff

      // If already past 5 PM today, cutoff is 5 PM tomorrow
      if (now.getTime() > cutoff.getTime()) {
        cutoff.setDate(cutoff.getDate() + 1);
      }

      const diff = Math.max(0, cutoff.getTime() - now.getTime());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      });
    };

    calculateTimeLeft();
    const timerId = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="block sm:hidden w-full space-y-2.5 pt-2">
      {/* 1. AUTO-SLIDING TRUST / PAYMENT CAROUSEL */}
      <div
        className="relative bg-gradient-to-b from-[#FAF8F2] to-[#F4EFE6] dark:from-[#082218] dark:to-[#051811] border border-[#E5D8B5]/80 dark:border-white/10 rounded-2xl p-2.5 shadow-xs overflow-hidden select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {/* SLIDE 1: PAYMENT METHODS ACCEPTED */}
          <div className="w-full shrink-0 flex flex-col items-center justify-center gap-1.5 px-1">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-[#123F2A] dark:text-[var(--brand-gold)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>We Accept</span>
            </div>

            <div className="flex items-center justify-center gap-2 flex-wrap">
              {/* UPI */}
              <div className="h-6 px-2 bg-white dark:bg-white/90 rounded border border-gray-200 dark:border-transparent flex items-center shadow-2xs">
                <svg className="h-3 w-auto" viewBox="0 0 70 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 2L15 22H23L13 2H5Z" fill="#008000" />
                  <path d="M15 2L25 22H33L23 2H15Z" fill="#FF8C00" />
                  <text x="35" y="18" fill="#111827" fontWeight="900" fontSize="15" fontFamily="sans-serif">
                    UPI
                  </text>
                </svg>
              </div>

              {/* Google Pay */}
              <div className="h-6 px-2 bg-white dark:bg-white/90 rounded border border-gray-200 dark:border-transparent flex items-center gap-1 shadow-2xs">
                <svg className="h-3 w-auto" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="text-[10px] font-bold text-gray-800 font-sans tracking-tight">GPay</span>
              </div>

              {/* PhonePe */}
              <div className="h-6 px-2 bg-[#5F259F] rounded flex items-center gap-1 shadow-2xs">
                <div className="w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center font-bold text-[#5F259F] text-[8px] font-sans">
                  पे
                </div>
                <span className="text-white font-extrabold text-[10px] font-sans tracking-tight">PhonePe</span>
              </div>

              {/* Visa */}
              <div className="h-6 px-2 bg-[#1434CB] rounded flex items-center shadow-2xs">
                <span className="text-white italic font-black text-[10px] tracking-wider font-sans">VISA</span>
              </div>

              {/* Mastercard */}
              <div className="h-6 px-2 bg-[#0A0A0A] rounded flex items-center gap-0.5 shadow-2xs">
                <div className="flex -space-x-1.5 items-center">
                  <div className="w-3 h-3 rounded-full bg-[#EB001B]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#F79E1B] opacity-90"></div>
                </div>
                <span className="text-white text-[9px] font-bold tracking-tighter pl-1">Mastercard</span>
              </div>

              {/* Net Banking */}
              <div className="h-6 px-1.5 bg-emerald-950/80 dark:bg-black/60 rounded border border-emerald-700/40 flex items-center gap-1 shadow-2xs">
                <Landmark className="w-3 h-3 text-[var(--brand-gold)]" />
                <span className="text-[9px] font-bold text-slate-100 uppercase tracking-tighter">NetBanking</span>
              </div>
            </div>
          </div>

          {/* SLIDE 2: TRUST & ASSURANCE (3 Compact Items) */}
          <div className="w-full shrink-0 flex items-center justify-around px-1">
            {/* 1. Secure Checkout */}
            <div className="flex flex-col items-center text-center gap-1">
              <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/50 flex items-center justify-center shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              </div>
              <span className="text-[10px] font-bold text-[#123F2A] dark:text-slate-200 leading-tight">
                Secure Checkout
              </span>
            </div>

            {/* 2. Easy Returns */}
            <div className="flex flex-col items-center text-center gap-1">
              <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/50 flex items-center justify-center shadow-2xs">
                <RotateCcw className="w-3.5 h-3.5 text-amber-700 dark:text-[var(--brand-gold)]" />
              </div>
              <span className="text-[10px] font-bold text-[#123F2A] dark:text-slate-200 leading-tight">
                Easy Returns
              </span>
            </div>

            {/* 3. Quality Checked */}
            <div className="flex flex-col items-center text-center gap-1">
              <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/50 flex items-center justify-center shadow-2xs">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              </div>
              <span className="text-[10px] font-bold text-[#123F2A] dark:text-slate-200 leading-tight">
                Quality Checked
              </span>
            </div>
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex justify-center items-center gap-1.5 mt-2">
          <button
            type="button"
            onClick={() => setCurrentSlide(0)}
            aria-label="Payment methods slide"
            className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
              currentSlide === 0
                ? 'w-5 bg-[var(--brand-gold,#D4AF37)]'
                : 'w-1.5 bg-gray-300 dark:bg-white/20'
            }`}
          />
          <button
            type="button"
            onClick={() => setCurrentSlide(1)}
            aria-label="Trust & guarantee slide"
            className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
              currentSlide === 1
                ? 'w-5 bg-[var(--brand-gold,#D4AF37)]'
                : 'w-1.5 bg-gray-300 dark:bg-white/20'
            }`}
          />
        </div>
      </div>

      {/* 2. STATIC SAME-DAY DISPATCH COUNTDOWN TIMER */}
      <div
        id="mobile-same-day-dispatch-timer"
        className="w-full bg-[#123F2A] text-white rounded-xl py-2 px-3 flex items-center justify-between border border-[var(--brand-gold)]/40 shadow-sm"
      >
        <div className="flex items-center gap-1.5 text-left">
          <Clock className="w-3.5 h-3.5 text-[var(--brand-gold)] shrink-0 animate-pulse" />
          <span className="text-[11px] font-sans font-medium text-slate-100 tracking-tight">
            Order within for <strong className="text-[var(--brand-gold)] font-bold">same-day dispatch</strong>:
          </span>
        </div>

        {/* Numeric Countdown Digits */}
        <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-white shrink-0">
          <span className="bg-black/40 px-1.5 py-0.5 rounded border border-white/20 text-[var(--brand-gold)]">
            {timeLeft.hours}
          </span>
          <span className="text-[var(--brand-gold)] font-bold">:</span>
          <span className="bg-black/40 px-1.5 py-0.5 rounded border border-white/20 text-[var(--brand-gold)]">
            {timeLeft.minutes}
          </span>
          <span className="text-[var(--brand-gold)] font-bold">:</span>
          <span className="bg-black/40 px-1.5 py-0.5 rounded border border-white/20 text-[var(--brand-gold)]">
            {timeLeft.seconds}
          </span>
        </div>
      </div>
    </div>
  );
};
