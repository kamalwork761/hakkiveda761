import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  CheckCircle,
  Plus,
  Filter,
  ThumbsUp,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { findProductBySlug, getProductUrl } from '../utils/productUtils';
import { Product, Review } from '../types/store';

interface ProductReviewsPageProps {
  slug: string;
  onReturnToProduct: () => void;
  onNavigateHome?: () => void;
  onNavigateProduct?: (product: Product) => void;
}

type SortOption = 'recent' | 'highest' | 'lowest' | 'photos';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1608248597359-21b6a7139d1b?auto=format&fit=crop&w=800&q=80';

export const ProductReviewsPage: React.FC<ProductReviewsPageProps> = ({
  slug,
  onReturnToProduct,
  onNavigateHome,
  onNavigateProduct,
}) => {
  const { products, reviews, addReview, playSound } = useStore();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Find target product using universal slug matching
  const product = useMemo(() => {
    if (!products || products.length === 0 || !slug) return undefined;
    return findProductBySlug(products, slug);
  }, [products, slug]);

  // Filter & Form States
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState<{ [id: string]: boolean }>({});
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<string | null>(null);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [customerName, setCustomerName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // Fallback if product not found
  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 text-[var(--brand-gold)] flex items-center justify-center mb-4 border border-amber-500/20">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif-luxury font-bold text-[#123F2A] dark:text-white mb-2">
          Product Formulation Not Found
        </h2>
        <p className="text-xs text-[#5F6B63] dark:text-slate-400 mb-6 max-w-md">
          The requested formulation reviews could not be located for slug &quot;{slug}&quot;.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReturnToProduct}
            className="px-6 py-2.5 bg-[#123F2A] hover:bg-[#0B2F20] text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--brand-gold)]" />
            <span>Back to Product</span>
          </button>
          {onNavigateHome && (
            <button
              type="button"
              onClick={onNavigateHome}
              className="px-5 py-2.5 border border-[#E7E1D5] dark:border-white/20 text-[#123F2A] dark:text-white rounded-xl text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            >
              Return Home
            </button>
          )}
        </div>
      </div>
    );
  }

  // Safe product image
  const primaryImage = (product.images && product.images.length > 0 && product.images[0]) || DEFAULT_IMAGE;

  // All reviews for this product with safe fallback
  const productReviews = useMemo(() => {
    if (!reviews || !Array.isArray(reviews)) return [];
    return reviews.filter((r) => r && r.productId === product.id);
  }, [reviews, product.id]);

  // Rating counts (safe distribution)
  const totalReviewsCount = productReviews.length > 0 ? productReviews.length : (product.reviewsCount || 0);
  const ratingCounts: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  productReviews.forEach((r) => {
    if (r) {
      const raw = Number(r.rating);
      const star = Math.max(1, Math.min(5, Math.round(!isNaN(raw) ? raw : 5)));
      if (ratingCounts[star] !== undefined) {
        ratingCounts[star]++;
      }
    }
  });

  // Calculate dynamic average rating
  const averageRating = useMemo(() => {
    if (productReviews.length > 0) {
      const validRatings = productReviews
        .map((r) => Number(r?.rating))
        .filter((val) => !isNaN(val) && val > 0);
      if (validRatings.length > 0) {
        const sum = validRatings.reduce((acc, val) => acc + val, 0);
        return (sum / validRatings.length).toFixed(2);
      }
    }
    return product.rating ? Number(product.rating).toFixed(2) : '4.95';
  }, [productReviews, product.rating]);

  // Filter and sort reviews
  const processedReviews = useMemo(() => {
    let list = [...productReviews];

    // Filter by star rating
    if (filterRating !== null) {
      list = list.filter((r) => {
        const raw = Number(r?.rating);
        const star = Math.max(1, Math.min(5, Math.round(!isNaN(raw) ? raw : 5)));
        return star === filterRating;
      });
    }

    // Sort
    if (sortOption === 'highest') {
      list.sort((a, b) => (Number(b?.rating) || 5) - (Number(a?.rating) || 5));
    } else if (sortOption === 'lowest') {
      list.sort((a, b) => (Number(a?.rating) || 5) - (Number(b?.rating) || 5));
    } else if (sortOption === 'photos') {
      list = list.filter((r) => (Array.isArray(r?.images) && r.images.length > 0) || r?.customerImage);
    } else {
      // Recent (default)
      list.sort((a, b) => {
        const timeA = a?.date ? new Date(a.date).getTime() : 0;
        const timeB = b?.date ? new Date(b.date).getTime() : 0;
        return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
      });
    }

    return list;
  }, [productReviews, filterRating, sortOption]);

  const handleToggleHelpful = (id: string) => {
    playSound('nav_click');
    setHelpfulReviews((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    addReview({
      productId: product.id,
      customerName: customerName.trim(),
      rating,
      title: title.trim() || 'Verified Authentic Tribal Formulation',
      comment: comment.trim(),
      verifiedPurchase: true,
      location: 'Verified Buyer',
    });

    playSound('success');
    setSubmittedMessage(true);
    setIsFormOpen(false);
    setCustomerName('');
    setTitle('');
    setComment('');
    setRating(5);

    setTimeout(() => {
      setSubmittedMessage(false);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] pb-24 font-sans">
      {/* Top Sticky Header */}
      <div className="sticky top-0 z-30 bg-[#FAF8F2]/95 dark:bg-[#0A261A]/95 backdrop-blur-md border-b border-[#E7E1D5] dark:border-white/10 px-4 py-3 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Back Button */}
          <button
            type="button"
            id="back-to-product-btn"
            onClick={() => {
              playSound('nav_click');
              onReturnToProduct();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-[#123F2A] dark:text-white hover:text-[var(--brand-gold)] dark:hover:text-[var(--brand-gold)] transition-colors py-1.5 px-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
            aria-label="Back to Product"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--brand-gold)]" />
            <span>Back to Product</span>
          </button>

          {/* Product Mini Pill */}
          <button
            type="button"
            onClick={onReturnToProduct}
            className="flex items-center gap-2 max-w-[220px] sm:max-w-xs text-left cursor-pointer truncate"
          >
            <img
              src={primaryImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-lg object-cover border border-[#E7E1D5] dark:border-white/20 shrink-0"
            />
            <span className="text-xs font-bold text-[#123F2A] dark:text-slate-100 truncate">
              {product.name}
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 sm:pt-8 space-y-6">
        {/* Product Card Header */}
        <div className="bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/10 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={primaryImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-[#E7E1D5] dark:border-white/15 shadow-sm shrink-0"
            />
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--brand-gold)]">
                Authentic Reviews
              </span>
              <h1 className="text-base sm:text-xl font-serif-luxury font-bold text-[#123F2A] dark:text-white leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-[#5F6B63] dark:text-slate-400 mt-0.5">
                {product.subtitle || '100% Herbal & Ancient Vaidya Certified'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onReturnToProduct}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#E7E1D5] dark:border-white/20 text-xs font-bold text-[#123F2A] dark:text-white hover:border-[var(--brand-gold)] hover:bg-[#FAF8F2] dark:hover:bg-white/5 transition-all text-center cursor-pointer shrink-0"
          >
            View Product Details
          </button>
        </div>

        {/* Overall Rating & Rating Distribution Dashboard */}
        <div className="bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/10 rounded-2xl p-5 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Big Score & Stars */}
            <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-[#E7E1D5] dark:border-white/10">
              <span className="text-5xl sm:text-6xl font-extrabold font-serif-luxury text-[#123F2A] dark:text-[var(--brand-gold)] tracking-tight">
                {averageRating}
              </span>

              <div className="flex items-center text-amber-500 my-2.5">
                {[1, 2, 3, 4, 5].map((st) => (
                  <Star key={st} className="w-5 h-5 fill-current" />
                ))}
              </div>

              <span className="text-xs font-bold text-[#123F2A] dark:text-slate-200">
                Based on {totalReviewsCount} verified reviews
              </span>

              <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                <span>100% Genuine Buyer Feedback</span>
              </div>
            </div>

            {/* Right: Star Rating Breakdown Bars */}
            <div className="md:col-span-7 space-y-2 font-sans">
              <div className="text-xs font-bold uppercase tracking-wider text-[#5F6B63] dark:text-slate-400 mb-2">
                Rating Distribution (Tap to filter)
              </div>

              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingCounts[star] || 0;
                const total = productReviews.length > 0 ? productReviews.length : (product.reviewsCount || 1);
                const percentage =
                  productReviews.length > 0
                    ? Math.round((count / total) * 100)
                    : star === 5
                    ? 88
                    : star === 4
                    ? 10
                    : 1;
                const isSelected = filterRating === star;

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      playSound('nav_click');
                      setFilterRating(isSelected ? null : star);
                    }}
                    className={`w-full flex items-center gap-3 p-1.5 rounded-xl transition-all text-xs cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border border-amber-400/30'
                        : 'hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span className="w-14 font-bold text-[#123F2A] dark:text-slate-200 shrink-0 flex items-center gap-1">
                      <span>{star}</span>
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                      <span className="text-[10px] text-slate-400 font-normal">star</span>
                    </span>

                    <div className="flex-1 h-3 bg-slate-200 dark:bg-black/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-[var(--brand-gold)] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="w-12 text-right text-[11px] font-mono font-bold text-[#5F6B63] dark:text-slate-400">
                      {percentage}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row: Write a Review Toggle */}
          <div className="mt-6 pt-5 border-t border-[#E7E1D5] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[#5F6B63] dark:text-slate-400 text-center sm:text-left">
              Have you experienced this sacred formulation?
            </p>
            <button
              type="button"
              id="write-a-review-btn"
              onClick={() => {
                playSound('nav_click');
                setIsFormOpen(!isFormOpen);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#123F2A] hover:bg-[#0B2F20] dark:bg-[var(--brand-gold)] dark:text-[#0B2F20] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isFormOpen ? 'Cancel Form' : 'Write a Review'}</span>
            </button>
          </div>
        </div>

        {/* Review Submission Success Alert */}
        {submittedMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-3 animate-in fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>Thank you! Your verified customer review has been published successfully.</span>
          </div>
        )}

        {/* Review Submission Form */}
        {isFormOpen && (
          <form
            onSubmit={handleFormSubmit}
            className="bg-white dark:bg-[#123F2B] border-2 border-[var(--brand-gold)]/40 rounded-2xl p-5 sm:p-7 shadow-lg space-y-4 animate-in fade-in duration-300 font-sans"
          >
            <div className="border-b border-[#E7E1D5] dark:border-white/10 pb-3">
              <h3 className="text-base font-bold font-serif-luxury text-[#123F2A] dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--brand-gold)]" />
                <span>Write a Verified Customer Review</span>
              </h3>
              <p className="text-xs text-[#5F6B63] dark:text-slate-400">
                Share your journey, application routine, and observable herbal benefits.
              </p>
            </div>

            {/* Star Rating Selector */}
            <div>
              <label className="block text-xs font-bold text-[#123F2A] dark:text-slate-200 mb-1.5">
                Overall Experience Rating *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((st) => (
                  <button
                    type="button"
                    key={st}
                    onClick={() => {
                      playSound('nav_click');
                      setRating(st);
                    }}
                    className="p-1.5 hover:scale-120 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        st <= rating ? 'text-amber-500 fill-current' : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-[#123F2A] dark:text-slate-200 ml-2">
                  {rating === 5 ? '5 Stars — Excellent / Highly Recommend' : `${rating} Stars`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#123F2A] dark:text-slate-200 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#FAF8F2] dark:bg-black/30 border border-[#E7E1D5] dark:border-white/15 p-3 text-xs rounded-xl text-[#123F2A] dark:text-white focus:outline-none focus:border-[var(--brand-gold)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123F2A] dark:text-slate-200 mb-1">
                  Review Headline / Summary
                </label>
                <input
                  type="text"
                  placeholder="e.g. Significant hair fall reduction within 3 weeks"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#FAF8F2] dark:bg-black/30 border border-[#E7E1D5] dark:border-white/15 p-3 text-xs rounded-xl text-[#123F2A] dark:text-white focus:outline-none focus:border-[var(--brand-gold)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123F2A] dark:text-slate-200 mb-1">
                Your Detailed Review & Routine *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Explain how often you massaged the oil/applied the herbs, scalp feel, absorption, and results..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-[#FAF8F2] dark:bg-black/30 border border-[#E7E1D5] dark:border-white/15 p-3 text-xs rounded-xl text-[#123F2A] dark:text-white focus:outline-none focus:border-[var(--brand-gold)]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-[#5F6B63] dark:text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#123F2A] hover:bg-[#0B2F20] dark:bg-[var(--brand-gold)] dark:text-[#0B2F20] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                Submit Verified Review
              </button>
            </div>
          </form>
        )}

        {/* Filter and Sorting Tabs */}
        <div className="bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/10 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Sorting buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none no-scrollbar pb-1 sm:pb-0">
            <span className="text-[11px] font-bold text-[#5F6B63] dark:text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Sort:</span>
            </span>

            {[
              { id: 'recent', label: 'Most Recent' },
              { id: 'highest', label: 'Highest Rated' },
              { id: 'lowest', label: 'Lowest Rated' },
              { id: 'photos', label: 'With Photos' },
            ].map((tab) => {
              const isActive = sortOption === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    playSound('nav_click');
                    setSortOption(tab.id as SortOption);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#123F2A] text-white dark:bg-[var(--brand-gold)] dark:text-[#0B2F20] shadow-xs'
                      : 'text-[#37463D] dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Active filter badge if star filter is active */}
          {filterRating !== null && (
            <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
              <span className="bg-amber-500/10 text-[#123F2A] dark:text-white px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                <span>{filterRating} Stars</span>
                <Star className="w-3 h-3 text-amber-500 fill-current" />
              </span>
              <button
                type="button"
                onClick={() => setFilterRating(null)}
                className="text-[var(--brand-gold)] font-bold text-xs underline cursor-pointer"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>

        {/* Complete Customer Reviews List */}
        <div className="space-y-4">
          {processedReviews.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#123F2B] rounded-2xl border border-[#E7E1D5] dark:border-white/10 space-y-3">
              <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold font-serif-luxury text-[#123F2A] dark:text-white">
                No reviews yet.
              </h3>
              <p className="text-xs text-[#5F6B63] dark:text-slate-400 max-w-sm mx-auto">
                {filterRating !== null || sortOption === 'photos'
                  ? 'No reviews match your currently applied filter.'
                  : 'Be the first to share your herbal journey with this ancient formulation!'}
              </p>
              {(filterRating !== null || sortOption !== 'recent') ? (
                <button
                  type="button"
                  onClick={() => {
                    setFilterRating(null);
                    setSortOption('recent');
                  }}
                  className="px-4 py-2 bg-[#123F2A] text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer mt-2"
                >
                  Show All Reviews
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsFormOpen(true)}
                  className="px-5 py-2.5 bg-[#123F2A] text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer mt-2 inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write the First Review</span>
                </button>
              )}
            </div>
          ) : (
            processedReviews.map((rev) => {
              if (!rev) return null;
              const isHelpful = helpfulReviews[rev.id];
              const starCount = Math.max(1, Math.min(5, Math.round(Number(rev.rating) || 5)));
              const userInitial = (rev.customerName || 'Customer').charAt(0).toUpperCase();

              return (
                <div
                  key={rev.id}
                  className="bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3 transition-all hover:border-[var(--brand-gold)]/40"
                >
                  {/* Top Row: User details & Stars */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#123F2A] to-[#0A261A] text-[var(--brand-gold)] font-serif-luxury font-bold text-sm flex items-center justify-center border border-[var(--brand-gold)]/30 shrink-0">
                        {userInitial}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-[#123F2A] dark:text-white">
                            {rev.customerName || 'Verified Patron'}
                          </h4>
                          {rev.verifiedPurchase && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <CheckCircle className="w-2.5 h-2.5" />
                              <span>Verified Purchase</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[#5F6B63] dark:text-slate-400 mt-0.5">
                          {rev.location && <span>{rev.location}</span>}
                          {rev.date && (
                            <>
                              <span>•</span>
                              <span>{rev.date}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center text-amber-500 shrink-0">
                      {[...Array(starCount)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Review Title */}
                  {rev.title && (
                    <h5 className="font-bold text-sm text-[#123F2A] dark:text-[var(--brand-gold)] font-sans">
                      {rev.title}
                    </h5>
                  )}

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-[#37463D] dark:text-slate-200 leading-relaxed">
                    {rev.comment}
                  </p>

                  {/* Review Photos (if attached) */}
                  {Array.isArray(rev.images) && rev.images.length > 0 && (
                    <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
                      {rev.images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedPhotoModal(img)}
                          className="w-16 h-16 rounded-xl overflow-hidden border border-[#E7E1D5] dark:border-white/20 hover:scale-105 transition-transform cursor-pointer shrink-0"
                        >
                          <img
                            src={img}
                            alt={`Customer Review Photo ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Helpful Button Bar */}
                  <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-[#5F6B63] dark:text-slate-400">
                    <button
                      type="button"
                      onClick={() => handleToggleHelpful(rev.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        isHelpful
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                          : 'border-[#E7E1D5] dark:border-white/10 hover:border-[var(--brand-gold)] text-[#37463D] dark:text-slate-300'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isHelpful ? 'fill-current' : ''}`} />
                      <span>{isHelpful ? 'Helpful (1)' : 'Helpful'}</span>
                    </button>

                    <span className="text-[10px] text-slate-400">
                      Certified Vaidya Archive
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Photo Zoom Modal */}
      {selectedPhotoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedPhotoModal(null)}
        >
          <div className="relative max-w-lg w-full">
            <img
              src={selectedPhotoModal}
              alt="Customer Review Expanded"
              referrerPolicy="no-referrer"
              className="w-full h-auto rounded-2xl shadow-2xl border border-white/20"
            />
            <button
              type="button"
              onClick={() => setSelectedPhotoModal(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
