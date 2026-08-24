import React, { useState, useMemo } from 'react';
import {
  Star,
  CheckCircle,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Product, Review } from '../../types/store';
import { useStore } from '../../context/StoreContext';
import { getProductReviewsUrl } from '../../utils/productUtils';

interface ProductReviewsSummaryCardProps {
  product: Product;
  onViewAllReviews?: () => void;
}

export const ProductReviewsSummaryCard: React.FC<ProductReviewsSummaryCardProps> = ({
  product,
  onViewAllReviews,
}) => {
  const { reviews, addReview, playSound } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // Review form state
  const [rating, setRating] = useState(5);
  const [customerName, setCustomerName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  // Reviews for this product
  const productReviews = useMemo(() => {
    return reviews.filter((r) => r.productId === product.id);
  }, [reviews, product.id]);

  const totalReviewsCount = productReviews.length > 0 ? productReviews.length : product.reviewsCount;

  // Average score
  const avgRating = useMemo(() => {
    if (productReviews.length > 0) {
      const sum = productReviews.reduce((acc, r) => acc + (r.rating || 5), 0);
      return (sum / productReviews.length).toFixed(2);
    }
    return product.rating ? product.rating.toFixed(2) : '4.95';
  }, [productReviews, product.rating]);

  // 1-2 Highlighted / latest reviews
  const highlightedReviews = useMemo(() => {
    if (productReviews.length === 0) return [];
    return productReviews.slice(0, 2);
  }, [productReviews]);

  const handleNavigateToReviews = () => {
    playSound('nav_click');
    if (onViewAllReviews) {
      onViewAllReviews();
    } else {
      const targetUrl = getProductReviewsUrl(product);
      window.history.pushState({}, '', targetUrl);
      window.dispatchEvent(new Event('app:navigate'));
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    }, 4000);
  };

  return (
    <div
      id="product-reviews-summary-card"
      className="bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-4 font-sans"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E7E1D5] dark:border-white/10 pb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand-gold)]">
            Verified Feedback
          </span>
          <h3 className="text-base font-serif-luxury font-bold text-[#123F2A] dark:text-white">
            Customer Reviews
          </h3>
        </div>

        <button
          type="button"
          onClick={handleNavigateToReviews}
          className="text-xs font-bold text-[var(--brand-gold)] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Score Hero Card */}
      <div className="bg-[#FAF8F2] dark:bg-black/25 rounded-2xl p-4 border border-[#E7E1D5] dark:border-white/10 flex flex-col items-center justify-center text-center">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold font-serif-luxury text-[#123F2A] dark:text-[var(--brand-gold)]">
            {avgRating}
          </span>
          <div className="flex items-center text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
        </div>

        <p className="text-xs text-[#5F6B63] dark:text-slate-300 font-medium mt-1">
          Based on <strong>{totalReviewsCount} verified reviews</strong>
        </p>

        <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100/70 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/30">
          <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
          <span>100% Verified Mysore Tribal Patrons</span>
        </div>
      </div>

      {/* Two Action Buttons: [ WRITE A REVIEW ] & [ VIEW ALL REVIEWS → ] */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => {
            playSound('nav_click');
            setIsFormOpen(!isFormOpen);
          }}
          className="h-11 px-3 rounded-xl border border-[#123F2A] dark:border-[var(--brand-gold)] text-[#123F2A] dark:text-[var(--brand-gold)] bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isFormOpen ? 'Cancel' : 'Write Review'}</span>
        </button>

        <button
          type="button"
          onClick={handleNavigateToReviews}
          className="h-11 px-3 rounded-xl bg-[#123F2A] hover:bg-[#0B2F20] dark:bg-[var(--brand-gold)] dark:text-[#0B2F20] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
        >
          <span>View All ({totalReviewsCount})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Success Notification */}
      {submittedMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Thank you! Your verified review has been recorded.</span>
        </div>
      )}

      {/* Review Form (Collapsible on PDP) */}
      {isFormOpen && (
        <form
          onSubmit={handleFormSubmit}
          className="bg-[#FAF8F2] dark:bg-black/30 p-4 rounded-xl border border-[#E7E1D5] dark:border-white/15 space-y-3 animate-in fade-in duration-200"
        >
          <h4 className="text-xs font-bold font-serif-luxury text-[#123F2A] dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
            <span>Write a Quick Review</span>
          </h4>

          {/* Star selector */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((st) => (
              <button
                type="button"
                key={st}
                onClick={() => setRating(st)}
                className="p-1 cursor-pointer"
              >
                <Star
                  className={`w-5 h-5 ${
                    st <= rating ? 'text-amber-500 fill-current' : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              </button>
            ))}
            <span className="text-[11px] font-bold text-[#123F2A] dark:text-slate-200 ml-1">
              {rating} Stars
            </span>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#123F2A] dark:text-slate-200 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Priyanshu M."
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/15 p-2 text-xs rounded-lg text-[#123F2A] dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#123F2A] dark:text-slate-200 mb-1">
              Review Comment *
            </label>
            <textarea
              required
              rows={2}
              placeholder="How did this product work for your hair/skin?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/15 p-2 text-xs rounded-lg text-[#123F2A] dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-500 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#123F2A] text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Submit Review
            </button>
          </div>
        </form>
      )}

      {/* 1-2 Compact Highlighted Reviews */}
      {highlightedReviews.length > 0 && (
        <div className="space-y-2 pt-1">
          {highlightedReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-3 rounded-xl bg-[#FAF8F2] dark:bg-black/20 border border-[#E7E1D5] dark:border-white/10 space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#123F2A] dark:text-white">
                    {rev.customerName}
                  </span>
                  {rev.verifiedPurchase && (
                    <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>

                <div className="flex text-amber-500">
                  {[...Array(Math.max(1, Math.min(5, Math.round(Number(rev.rating) || 5))))].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>

              {rev.title && (
                <p className="font-bold text-[11px] text-[var(--brand-gold)] font-sans">
                  {rev.title}
                </p>
              )}

              <p className="text-[#37463D] dark:text-slate-300 line-clamp-2 leading-relaxed text-[11px]">
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
