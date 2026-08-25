import React, { useState } from 'react';
import { Star, ShieldCheck, ThumbsUp, MessageSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CustomerReviews: React.FC = () => {
  const { reviews } = useStore();
  const [starFilter, setStarFilter] = useState<number | null>(null);

  const filteredReviews = starFilter
    ? reviews.filter((r) => r.rating === starFilter)
    : reviews;

  return (
    <section className="py-20 bg-[var(--brand-primary-dark)] relative overflow-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 border-b border-white/10 pb-8">
          <div>
            <span className="text-[var(--brand-gold)] font-sans text-xs uppercase tracking-[0.28em] font-bold block mb-2">
              Verified Feedback
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-slate-100">
              Customer Reviews & Ratings
            </h2>
          </div>

          {/* Rating Summary Pill */}
          <div className="mt-6 lg:mt-0 flex items-center gap-4 bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/40 p-4 rounded-xl shadow-xl">
            <div className="text-3xl font-bold font-serif-luxury text-[var(--brand-gold)]">4.95</div>
            <div>
              <div className="flex text-[var(--brand-gold)]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-300 font-sans mt-0.5">Based on 2,450+ International Buyers</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 font-sans text-xs font-semibold w-full max-w-full scrollbar-none no-scrollbar">
          <span className="text-slate-400 uppercase text-[10px] tracking-wider shrink-0">Filter By Stars:</span>
          <button
            onClick={() => setStarFilter(null)}
            className={`px-3.5 py-1.5 rounded-full border transition-all ${
              starFilter === null
                ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold'
                : 'border-white/20 text-slate-300 hover:border-[var(--brand-gold)]'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          {[5, 4, 3].map((star) => (
            <button
              key={star}
              onClick={() => setStarFilter(star)}
              className={`px-3.5 py-1.5 rounded-full border transition-all flex items-center gap-1 ${
                starFilter === star
                  ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold'
                  : 'border-white/20 text-slate-300 hover:border-[var(--brand-gold)]'
              }`}
            >
              <span>{star} Stars</span>
              <Star className="w-3 h-3 fill-current" />
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-xl p-6 space-y-4 hover:border-[var(--brand-gold)]/40 transition-all shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-[var(--brand-gold)]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-slate-600'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-sans text-slate-400">{rev.date}</span>
                </div>

                <h4 className="text-base font-bold font-serif-luxury text-slate-100">{rev.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans font-light">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-sans">
                <div>
                  <span className="font-bold text-slate-100 block">{rev.customerName}</span>
                  <span className="text-[10px] text-slate-400">{rev.location}</span>
                </div>

                {rev.verifiedPurchase && (
                  <span className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
