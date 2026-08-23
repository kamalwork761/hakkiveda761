import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquare, ThumbsUp, Filter, Plus } from 'lucide-react';
import { Product, Review } from '../../types/store';
import { useStore } from '../../context/StoreContext';

interface ProductReviewsSectionProps {
  product: Product;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({ product }) => {
  const { reviews, addReview, playSound } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  // Review form state
  const [rating, setRating] = useState(5);
  const [customerName, setCustomerName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // Filter reviews for this product
  const productReviews = reviews.filter((r) => r.productId === product.id);

  // Calculate star distribution
  const totalReviews = productReviews.length;
  const ratingCounts: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  productReviews.forEach((r) => {
    const star = Math.round(r.rating || 5);
    if (ratingCounts[star] !== undefined) {
      ratingCounts[star]++;
    }
  });

  const filteredReviews = filterRating
    ? productReviews.filter((r) => Math.round(r.rating) === filterRating)
    : productReviews;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    addReview({
      productId: product.id,
      customerName: customerName.trim(),
      rating,
      title: title.trim() || 'Verified Authentic Formulation',
      comment: comment.trim(),
      verifiedPurchase: true,
      location: 'Verified Buyer',
    });

    playSound('nav_click');
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
    <div className="bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E1D5] dark:border-white/10 pb-5">
        <div>
          <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-[#123F2A] dark:text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-[var(--brand-gold)] fill-current" />
            <span>Customer Reviews & Testimonials</span>
          </h3>
          <span className="text-xs text-[#5F6B63] dark:text-slate-400 font-sans">
            Real stories from verified Hakki-Pikki herbal patrons
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2.5 rounded-xl bg-[#123F2A] hover:bg-[#0B2F20] dark:bg-[var(--brand-gold)] dark:text-[#0B2F20] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isFormOpen ? 'Cancel' : 'Write a Review'}</span>
        </button>
      </div>

      {/* Success Notification */}
      {submittedMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Thank you! Your verified review has been published successfully.</span>
        </div>
      )}

      {/* Overall Score & Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#FAF8F2] dark:bg-black/20 p-5 rounded-2xl border border-[#E7E1D5] dark:border-white/10">
        {/* Left: Overall Rating (4 cols) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-3 border-b md:border-b-0 md:border-r border-[#E7E1D5] dark:border-white/10">
          <span className="text-4xl sm:text-5xl font-extrabold font-serif-luxury text-[#123F2A] dark:text-[var(--brand-gold)]">
            {product.rating}
          </span>
          <div className="flex items-center text-amber-500 my-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <span className="text-xs text-[#5F6B63] dark:text-slate-300 font-medium">
            Based on {product.reviewsCount} verified experiences
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
            98.6% Customer Satisfaction Rate
          </span>
        </div>

        {/* Right: Star Breakdown Bars (8 cols) */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2 font-sans">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : star === 5 ? 85 : star === 4 ? 12 : 1;
            const isFilterActive = filterRating === star;

            return (
              <button
                key={star}
                type="button"
                onClick={() => setFilterRating(isFilterActive ? null : star)}
                className={`flex items-center gap-3 text-xs w-full p-1 rounded-lg transition-colors cursor-pointer text-left ${
                  isFilterActive
                    ? 'bg-amber-500/10 dark:bg-white/10'
                    : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <span className="w-12 font-bold text-[#123F2A] dark:text-slate-200 shrink-0 flex items-center gap-1">
                  <span>{star}</span>
                  <Star className="w-3 h-3 text-amber-500 fill-current" />
                </span>

                <div className="flex-1 h-2.5 bg-slate-200 dark:bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-[var(--brand-gold)] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-10 text-right text-[11px] text-[#5F6B63] dark:text-slate-400 font-mono">
                  {percentage}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#FAF8F2] dark:bg-black/30 p-5 sm:p-6 rounded-2xl border border-[#E7E1D5] dark:border-white/15 space-y-4 animate-in fade-in duration-200 font-sans"
        >
          <h4 className="text-sm font-bold font-serif-luxury text-[#123F2A] dark:text-white">
            Share Your Experience with this Formulation
          </h4>

          {/* Star Selection */}
          <div>
            <label className="block text-xs font-bold text-[#123F2A] dark:text-slate-200 mb-1.5">
              Overall Rating *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setRating(st)}
                  className="p-1 hover:scale-115 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      st <= rating ? 'text-amber-500 fill-current' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-[#123F2A] dark:text-slate-200 ml-2">
                {rating === 5 ? '5 Stars - Excellent' : `${rating} Stars`}
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
                placeholder="e.g. Ramesh Kulkarni"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/15 p-2.5 text-xs rounded-xl text-[#123F2A] dark:text-white focus:outline-none focus:border-[var(--brand-gold)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#123F2A] dark:text-slate-200 mb-1">
                Headline / Title
              </label>
              <input
                type="text"
                placeholder="e.g. Visible hair regrowth in 45 days!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/15 p-2.5 text-xs rounded-xl text-[#123F2A] dark:text-white focus:outline-none focus:border-[var(--brand-gold)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#123F2A] dark:text-slate-200 mb-1">
              Detailed Experience *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe how you applied the formula, your routine, and visible improvements in root strength or hair growth..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-white dark:bg-[#123F2B] border border-[#E7E1D5] dark:border-white/15 p-2.5 text-xs rounded-xl text-[#123F2A] dark:text-white focus:outline-none focus:border-[var(--brand-gold)]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 text-xs font-bold text-[#5F6B63] dark:text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#123F2A] hover:bg-[#0B2F20] dark:bg-[var(--brand-gold)] dark:text-[#0B2F20] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
            >
              Submit Verified Review
            </button>
          </div>
        </form>
      )}

      {/* Filter Reset if filter is active */}
      {filterRating && (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 text-xs font-bold text-[#123F2A] dark:text-white">
          <span>Filtering reviews with {filterRating} stars</span>
          <button
            type="button"
            onClick={() => setFilterRating(null)}
            className="text-[var(--brand-gold)] underline cursor-pointer text-[11px]"
          >
            Clear Filter (Show All)
          </button>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-3 font-sans">
        {filteredReviews.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#5F6B63] dark:text-slate-400 bg-[#FAF8F2] dark:bg-black/10 rounded-2xl border border-[#E7E1D5] dark:border-white/10">
            {filterRating
              ? `No reviews found with ${filterRating} stars.`
              : 'No verified reviews submitted yet for this product batch.'}
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F2] dark:bg-black/20 border border-[#E7E1D5] dark:border-white/10 space-y-2 transition-all hover:border-[var(--brand-gold)]/30"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[#123F2A] dark:text-white">
                      {rev.customerName}
                    </span>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle className="w-2.5 h-2.5" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>
                  {rev.location && (
                    <span className="text-[10px] text-[#5F6B63] dark:text-slate-400">
                      {rev.location}
                    </span>
                  )}
                </div>

                <div className="flex text-amber-500 shrink-0">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>

              {rev.title && (
                <h5 className="font-bold text-xs text-[var(--brand-gold)] font-sans">
                  {rev.title}
                </h5>
              )}

              <p className="text-xs text-[#37463D] dark:text-slate-300 leading-relaxed">
                {rev.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
