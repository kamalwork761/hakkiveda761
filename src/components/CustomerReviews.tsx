import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Star, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useSmoothAutoScroll } from '../hooks/useSmoothAutoScroll';
import { Review, Product } from '../types/store';

export const CustomerReviews: React.FC = () => {
  const { reviews, products } = useStore();
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [expandedReviewIds, setExpandedReviewIds] = useState<Record<string, boolean>>({});
  const [isReadingPaused, setIsReadingPaused] = useState<boolean>(false);
  const resumeTimerRef = useRef<number | null>(null);

  // Map products by ID for fast lookup
  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    products.forEach((p) => map.set(p.id, p));
    return map;
  }, [products]);

  // Only consider approved reviews (or reviews without rejected status)
  const approvedReviews = useMemo(() => {
    return reviews.filter((r) => r.status !== 'REJECTED');
  }, [reviews]);

  // Aggregate Rating calculation (preserves authentic 4.95 / 2,450+ buyers)
  const { avgRatingDisplay, totalBuyersDisplay } = useMemo(() => {
    if (approvedReviews.length === 0) {
      return { avgRatingDisplay: '4.95', totalBuyersDisplay: '2,450+' };
    }
    const sum = approvedReviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    const avg = sum / approvedReviews.length;
    // Format to 2 decimal places e.g., 4.95 or 5.00
    const formattedAvg = avg.toFixed(2);
    return {
      avgRatingDisplay: formattedAvg,
      totalBuyersDisplay: '2,450+',
    };
  }, [approvedReviews]);

  // Filtered reviews based on active star pill
  const filteredReviews = useMemo(() => {
    if (starFilter === null) return approvedReviews;
    return approvedReviews.filter((r) => r.rating === starFilter);
  }, [approvedReviews, starFilter]);

  // Counts for filter pills
  const starCounts = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0 };
    approvedReviews.forEach((r) => {
      if (counts[r.rating] !== undefined) {
        counts[r.rating]++;
      }
    });
    return counts;
  }, [approvedReviews]);

  // Toggle Read More / Show Less for a review card
  const toggleExpand = useCallback((reviewId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedReviewIds((prev) => {
      const nextState = !prev[reviewId];
      // When expanding to read, pause auto-scroll
      if (nextState) {
        setIsReadingPaused(true);
        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      } else {
        // When collapsing, resume auto-scroll after 4 seconds
        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = window.setTimeout(() => {
          setIsReadingPaused(false);
        }, 4000);
      }
      return {
        ...prev,
        [reviewId]: nextState,
      };
    });
  }, []);

  // Handle user interaction pause on mobile carousel
  const handleUserInteract = useCallback(() => {
    setIsReadingPaused(true);
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = window.setTimeout(() => {
      setIsReadingPaused(false);
    }, 4000);
  }, []);

  // Configure smooth auto-scroll for mobile horizontal carousel
  // Target speed: 16px/sec (slow, readable 14-18px/sec range)
  // Pause duration: 4000ms (4 seconds)
  const repeatCount = filteredReviews.length > 0 && filteredReviews.length < 5 ? 4 : 2;
  const {
    containerRef: mobileScrollRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleScroll,
  } = useSmoothAutoScroll({
    itemCount: filteredReviews.length,
    repeatCount,
    pixelsPerSecond: 16,
    pauseDuration: 4000,
    isPaused: isReadingPaused || Object.values(expandedReviewIds).some(Boolean),
  });

  // Render a single review card
  const renderReviewCard = (rev: Review, indexKey: string) => {
    const isExpanded = Boolean(expandedReviewIds[rev.id]);
    const linkedProduct = rev.productId ? productMap.get(rev.productId) : null;
    const isLongComment = rev.comment && rev.comment.length > 130;

    return (
      <div
        key={indexKey}
        onClick={handleUserInteract}
        className="w-[84vw] max-w-[340px] md:w-auto shrink-0 bg-[#0a1d13] border border-white/15 hover:border-[#C5A059]/50 rounded-2xl p-4 sm:p-5 space-y-3.5 transition-all duration-300 shadow-xl flex flex-col justify-between group"
      >
        <div className="space-y-2.5">
          {/* Top Row: Stars + Date */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-[#C5A059]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < (rev.rating || 5)
                      ? 'fill-current text-[#C5A059]'
                      : 'text-white/20 fill-none'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-sans text-slate-400 shrink-0">{rev.date}</span>
          </div>

          {/* Linked Product Name Tag (if present) */}
          {linkedProduct && (
            <div className="inline-block">
              <span className="text-[10px] font-semibold text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/25 px-2 py-0.5 rounded-md truncate max-w-[220px] block">
                {linkedProduct.name}
              </span>
            </div>
          )}

          {/* Review Title */}
          <h4 className="text-sm sm:text-base font-bold font-serif-luxury text-slate-100 leading-snug line-clamp-1 group-hover:text-[#C5A059] transition-colors">
            {rev.title}
          </h4>

          {/* Review Comment / Body with 4-5 line clamping and Read More */}
          <div className="text-xs text-slate-200 leading-relaxed font-sans font-light">
            <p className={isExpanded ? '' : 'line-clamp-4'}>
              &ldquo;{rev.comment}&rdquo;
            </p>
            {isLongComment && (
              <button
                type="button"
                onClick={(e) => toggleExpand(rev.id, e)}
                className="mt-1.5 text-[11px] font-bold text-[#C5A059] hover:text-amber-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{isExpanded ? 'Show Less' : 'READ MORE →'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Author Info + Verified Badge */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs font-sans">
          <div className="min-w-0">
            <span className="font-bold text-slate-100 block truncate">{rev.customerName}</span>
            <span className="text-[10px] text-slate-400 block truncate">{rev.location}</span>
          </div>

          {rev.verifiedPurchase && (
            <span className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 font-medium shadow-sm">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Verified</span>
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <section
      id="customer-reviews-section"
      className="py-12 sm:py-16 md:py-20 bg-[#07160e] relative overflow-hidden w-full max-w-full select-none"
      aria-label="Customer Reviews and Ratings"
    >
      {/* Background Decorative Ambient Radial Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C5A059]/5 blur-[120px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        {/* Section Header + Rating Summary Card */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8 sm:mb-10 border-b border-white/10 pb-6 sm:pb-8">
          <div className="space-y-1.5">
            <span className="text-[#C5A059] font-sans text-xs uppercase tracking-[0.24em] font-bold block">
              VERIFIED FEEDBACK
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-slate-100 tracking-tight">
              CUSTOMER REVIEWS &amp; RATINGS
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-xl font-normal leading-relaxed">
              Real experiences shared by HAKKIVEDA customers.
            </p>
          </div>

          {/* Compact Rating Summary Card (Mobile & Desktop) */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4 bg-[#0a1d13] border border-[#C5A059]/40 px-4 py-3.5 sm:px-5 sm:py-4 rounded-2xl shadow-xl">
            <div className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#C5A059] tracking-tight">
              {avgRatingDisplay}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-[#C5A059]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-[#C5A059]" />
                ))}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 font-sans">
                Based on {totalBuyersDisplay} International Buyers
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 mb-6 sm:mb-8 overflow-x-auto pb-2 font-sans text-xs font-semibold w-full max-w-full no-scrollbar">
          <span className="text-slate-400 uppercase text-[10px] tracking-wider shrink-0 mr-1 hidden sm:inline">
            Filter:
          </span>

          {/* All Reviews Pill */}
          <button
            type="button"
            onClick={() => setStarFilter(null)}
            className={`px-3.5 py-1.5 rounded-full border text-xs transition-all duration-200 shrink-0 cursor-pointer ${
              starFilter === null
                ? 'border-[#C5A059] bg-[#C5A059] text-[#07160e] font-bold shadow-md'
                : 'border-white/20 bg-[#0a1d13]/80 hover:bg-[#0a1d13] text-slate-300 hover:border-[#C5A059]'
            }`}
          >
            All Reviews ({approvedReviews.length})
          </button>

          {/* Star Filter Pills */}
          {[5, 4, 3].map((star) => {
            const count = starCounts[star] || 0;
            const isActive = starFilter === star;

            return (
              <button
                key={star}
                type="button"
                onClick={() => setStarFilter(star)}
                className={`px-3.5 py-1.5 rounded-full border text-xs transition-all duration-200 flex items-center gap-1 shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-[#C5A059] bg-[#C5A059] text-[#07160e] font-bold shadow-md'
                    : 'border-white/20 bg-[#0a1d13]/80 hover:bg-[#0a1d13] text-slate-300 hover:border-[#C5A059]'
                }`}
              >
                <span>{star} Stars</span>
                <Star
                  className={`w-3 h-3 ${
                    isActive ? 'fill-[#07160e] text-[#07160e]' : 'fill-[#C5A059] text-[#C5A059]'
                  }`}
                />
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Empty State if filter yields no reviews */}
        {filteredReviews.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0a1d13] border border-white/10 text-center space-y-3 max-w-md mx-auto">
            <p className="text-sm text-slate-300 font-sans">
              No reviews found matching the selected star rating.
            </p>
            <button
              type="button"
              onClick={() => setStarFilter(null)}
              className="px-4 py-2 rounded-full bg-[#C5A059] text-[#07160e] font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <>
            {/* MOBILE LAYOUT: Smooth Auto-Scrolling & Swipeable Horizontal Carousel */}
            <div className="block md:hidden -mx-4 px-4 overflow-hidden relative">
              <div
                ref={mobileScrollRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStart}
                onMouseMove={handleTouchMove}
                onMouseUp={handleTouchEnd}
                onScroll={handleScroll}
                className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {Array.from({ length: repeatCount }).map((_, copyIndex) =>
                  filteredReviews.map((rev, revIndex) =>
                    renderReviewCard(rev, `mobile-${copyIndex}-${rev.id}-${revIndex}`)
                  )
                )}
              </div>
            </div>

            {/* DESKTOP LAYOUT: Clean Responsive Grid (Approx 3 Columns) */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((rev) => renderReviewCard(rev, `desktop-${rev.id}`))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
