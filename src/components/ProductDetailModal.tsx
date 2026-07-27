import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, Shield, Check, Truck, RotateCcw, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductDetailModal: React.FC = () => {
  const {
    isQuickViewOpen,
    quickViewProduct,
    closeQuickView,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    reviews,
    addReview,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'ritual' | 'reviews'>('benefits');
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewName, setNewReviewName] = useState('');

  if (!isQuickViewOpen || !quickViewProduct) return null;

  const product = quickViewProduct;
  const productImages = [product.image, ...(product.additionalImages || [])];
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment || !newReviewName) return;
    addReview({
      productId: product.id,
      customerName: newReviewName,
      rating: newRating,
      title: newReviewTitle || 'Wonderful Product',
      comment: newReviewComment,
      verifiedPurchase: true,
      location: 'Verified Buyer',
    });
    setIsAddingReview(false);
    setNewReviewTitle('');
    setNewReviewComment('');
    setNewReviewName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#072a20] border border-[#C8A24A]/40 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-100 animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 text-white hover:bg-[#C8A24A] hover:text-[#0B3D2E] transition-all flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-6 p-6 bg-black/20 flex flex-col justify-between">
            <div className="h-80 sm:h-96 rounded-xl overflow-hidden relative border border-white/10">
              <img
                src={productImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-[#0B3D2E]/90 text-[#C8A24A] text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-[#C8A24A]/30">
                SKU: {product.sku}
              </span>
            </div>

            {/* Gallery Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx ? 'border-[#C8A24A] scale-105' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info & Actions */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-[#C8A24A] font-bold">
                  {product.category}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-emerald-400 font-medium">In Stock ({product.stock} units)</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-100">
                {product.name}
              </h2>
              <p className="text-xs text-[#C8A24A] font-sans font-medium">{product.subtitle}</p>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex text-[#C8A24A]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-slate-300 font-sans font-bold">
                  {product.rating} ({product.reviewsCount} verified reviews)
                </span>
              </div>

              {/* Price */}
              <div className="pt-2 flex items-baseline gap-3">
                <span className="text-2xl font-bold font-sans text-[#C8A24A]">
                  {formatPrice(product.priceINR)}
                </span>
                {product.originalPriceINR && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(product.originalPriceINR)}
                  </span>
                )}
                <span className="text-xs text-slate-400">({product.volume})</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">{product.description}</p>
            </div>

            {/* Tabs for Details */}
            <div className="border-t border-b border-white/10 py-3">
              <div className="flex gap-4 border-b border-white/10 pb-2 text-xs font-sans font-bold uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab('benefits')}
                  className={`pb-1 transition-colors ${activeTab === 'benefits' ? 'text-[#C8A24A] border-b-2 border-[#C8A24A]' : 'text-slate-400'}`}
                >
                  Benefits
                </button>
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`pb-1 transition-colors ${activeTab === 'ingredients' ? 'text-[#C8A24A] border-b-2 border-[#C8A24A]' : 'text-slate-400'}`}
                >
                  42 Herbs
                </button>
                <button
                  onClick={() => setActiveTab('ritual')}
                  className={`pb-1 transition-colors ${activeTab === 'ritual' ? 'text-[#C8A24A] border-b-2 border-[#C8A24A]' : 'text-slate-400'}`}
                >
                  Usage Ritual
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-1 transition-colors ${activeTab === 'reviews' ? 'text-[#C8A24A] border-b-2 border-[#C8A24A]' : 'text-slate-400'}`}
                >
                  Reviews ({productReviews.length})
                </button>
              </div>

              <div className="pt-3 text-xs text-slate-200 font-sans max-h-36 overflow-y-auto">
                {activeTab === 'benefits' && (
                  <ul className="space-y-1.5">
                    {product.benefits?.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#C8A24A] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'ingredients' && (
                  <div className="space-y-1">
                    <p className="text-[11px] text-[#C8A24A] mb-1">Key Wild-Harvested Botanicals:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {product.ingredients?.map((ing, i) => (
                        <span key={i} className="bg-black/40 border border-[#C8A24A]/30 px-2 py-0.5 rounded text-[10px] text-slate-200">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'ritual' && (
                  <p className="leading-relaxed text-slate-300 italic">
                    "{product.usageRitual || 'Massage onto dry scalp twice weekly before sleep. Wash off with warm water and herbal shampoo.'}"
                  </p>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-3">
                    <button
                      onClick={() => setIsAddingReview(!isAddingReview)}
                      className="text-[#C8A24A] font-bold underline text-[11px] mb-2 block"
                    >
                      {isAddingReview ? 'Cancel Review' : '+ Write a Customer Review'}
                    </button>

                    {isAddingReview && (
                      <form onSubmit={handleReviewSubmit} className="bg-black/30 p-3 rounded-lg space-y-2 mb-3">
                        <input
                          type="text"
                          placeholder="Your Name"
                          required
                          value={newReviewName}
                          onChange={(e) => setNewReviewName(e.target.value)}
                          className="w-full bg-[#0B3D2E] border border-white/20 p-1.5 text-xs rounded text-slate-100"
                        />
                        <input
                          type="text"
                          placeholder="Review Headline"
                          value={newReviewTitle}
                          onChange={(e) => setNewReviewTitle(e.target.value)}
                          className="w-full bg-[#0B3D2E] border border-white/20 p-1.5 text-xs rounded text-slate-100"
                        />
                        <textarea
                          placeholder="Your experience with this formula..."
                          required
                          rows={2}
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          className="w-full bg-[#0B3D2E] border border-white/20 p-1.5 text-xs rounded text-slate-100"
                        ></textarea>
                        <button
                          type="submit"
                          className="bg-[#C8A24A] text-[#0B3D2E] px-3 py-1 font-bold text-xs rounded uppercase"
                        >
                          Submit Review
                        </button>
                      </form>
                    )}

                    {productReviews.length === 0 ? (
                      <p className="text-slate-400">Be the first to review this herbal product.</p>
                    ) : (
                      productReviews.map((rev) => (
                        <div key={rev.id} className="border-b border-white/10 pb-2">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-slate-200">{rev.customerName}</span>
                            <span className="text-[#C8A24A]">{'★'.repeat(rev.rating)}</span>
                          </div>
                          <p className="text-[11px] font-semibold text-[#C8A24A] mt-0.5">{rev.title}</p>
                          <p className="text-[10px] text-slate-300 mt-0.5">{rev.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quantity & CTA */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-white/20 rounded-lg overflow-hidden bg-black/30">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-300 hover:text-[#C8A24A]"
                  >
                    -
                  </button>
                  <span className="px-3 font-bold text-sm text-slate-100">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-slate-300 hover:text-[#C8A24A]"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#C8A24A] text-[#0B3D2E] py-3 rounded-lg font-sans text-xs font-bold uppercase tracking-wider hover:bg-white transition-all flex items-center justify-center gap-2 shadow-xl"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Bag • {formatPrice(product.priceINR * quantity)}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-lg border transition-colors ${
                    isInWishlist(product.id)
                      ? 'border-[#C8A24A] bg-[#C8A24A] text-[#0B3D2E]'
                      : 'border-white/20 text-slate-300 hover:border-[#C8A24A]'
                  }`}
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>

              {/* Shipping Guarantee */}
              <div className="grid grid-cols-2 gap-3 text-[10px] font-sans text-slate-300 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#C8A24A]" />
                  <span>Worldwide Express Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-[#C8A24A]" />
                  <span>100% Herbal Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
