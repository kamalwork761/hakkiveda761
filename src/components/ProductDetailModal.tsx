import React, { useState, useEffect, useRef } from 'react';
import { X, Star, ShoppingBag, Heart, Shield, Check, Truck, ChevronLeft, ChevronRight, ZoomIn, Sparkles } from 'lucide-react';
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

  // Zoom on Hover state
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Mobile Touch Swipe state
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Reset image index when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
    setIsZoomed(false);
  }, [quickViewProduct?.id]);

  // Lock background scrolling and attach Esc key handler when open
  useEffect(() => {
    if (isQuickViewOpen) {
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeQuickView();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isQuickViewOpen, closeQuickView]);

  if (!isQuickViewOpen || !quickViewProduct) return null;

  const product = quickViewProduct;
  const productImages = [product.image, ...(product.additionalImages || [])].filter(Boolean);
  if (productImages.length === 0) {
    productImages.push('/images/hakkiveda_108_oil_gold.jpg');
  }

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  // Hover zoom handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y });
  };

  // Touch gestures for mobile swipe (allows vertical page scrolling while capturing horizontal swipes)
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = Math.abs(touchStartY.current - touchEndY.current);

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > deltaY) {
      if (deltaX > 0) {
        handleNextImage(); // Swiped left -> Next image
      } else {
        handlePrevImage(); // Swiped right -> Previous image
      }
    }
    touchStartX.current = 0;
    touchStartY.current = 0;
    touchEndX.current = 0;
    touchEndY.current = 0;
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
    <>
      {/* Fixed Close X Button: Always visible on mobile & tablet above safe area */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          closeQuickView();
        }}
        aria-label="Close product view"
        className="product-modal-close fixed z-[99999] w-12 h-12 rounded-full bg-black/90 text-white hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] active:scale-95 transition-all flex items-center justify-center border-2 border-white/30 shadow-2xl cursor-pointer"
        style={{
          top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
          right: '12px',
        }}
      >
        <X className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Backdrop overlay container starting below safe area top with independent scroll */}
      <div
        className="product-modal-overlay fixed inset-0 z-[99990] flex items-start justify-center p-3 sm:p-6 pt-[calc(env(safe-area-inset-top,0px)+16px)] pb-[calc(env(safe-area-inset-bottom,0px)+96px)] bg-black/85 backdrop-blur-md overflow-y-auto -webkit-overflow-scrolling-touch"
        onClick={closeQuickView}
      >
        {/* Modal content container */}
        <div
          className="product-modal-content product-detail-panel light-modal-content relative w-full max-w-4xl bg-white border border-[rgba(18,63,43,0.18)] rounded-2xl shadow-2xl text-[#123F2B] my-auto sm:my-4 overflow-y-auto -webkit-overflow-scrolling-touch flex flex-col animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left: Interactive Multi-Image Gallery */}
            <div className="lg:col-span-6 p-4 sm:p-6 bg-slate-900/5 flex flex-col justify-between space-y-4">
              {/* Main Stage Image with Desktop Hover Zoom & Mobile Touch Swipe */}
              <div
                ref={imageContainerRef}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="w-full aspect-square sm:aspect-auto sm:h-80 md:h-96 rounded-xl overflow-hidden relative border border-slate-200 bg-white flex items-center justify-center p-2 sm:p-4 cursor-crosshair group select-none shrink-0"
              >
                <img
                  src={productImages[selectedImageIndex]}
                  alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                  loading="lazy"
                  style={{
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                    width: '100%',
                    height: '100%',
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                  }}
                  className="product-main-image w-full h-full object-contain transition-transform duration-200 ease-out select-none"
                />

                {/* SKU Tag */}
                <span className="absolute top-3 left-3 bg-[#123F2B] text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border border-[var(--brand-gold)]/30 z-10 shadow-md">
                  SKU: {product.sku}
                </span>

                {/* Image Counter Badge */}
                <span className="absolute top-3 right-3 bg-black/75 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-white/20 z-10">
                  {selectedImageIndex + 1} / {productImages.length}
                </span>

                {/* Desktop Hover Zoom Hint */}
                <div className="hidden md:flex absolute bottom-3 left-3 bg-black/75 text-[#D4AF37] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[var(--brand-gold)]/30 opacity-80 group-hover:opacity-0 transition-opacity items-center gap-1 z-10">
                  <ZoomIn className="w-3 h-3" />
                  <span>Hover to zoom • Swipe on mobile</span>
                </div>

                {/* Prev / Next Navigation Arrows (Desktop Only) */}
                {productImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage();
                      }}
                      className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/70 text-white hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] transition-all items-center justify-center border border-white/20 shadow-xl cursor-pointer"
                      title="Previous Image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage();
                      }}
                      className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/70 text-white hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] transition-all items-center justify-center border border-white/20 shadow-xl cursor-pointer"
                      title="Next Image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Mobile Pagination Dots: Placed directly below the main image */}
              {productImages.length > 1 && (
                <div
                  className="flex md:hidden items-center justify-center gap-2 py-2 px-1 w-full select-none overflow-x-auto no-scrollbar"
                  aria-label="Product image pagination"
                >
                  {productImages.map((_, idx) => {
                    const isActive = selectedImageIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImageIndex(idx);
                        }}
                        className="p-1 -m-1 flex items-center justify-center cursor-pointer touch-manipulation focus:outline-none"
                        aria-label={`Go to slide ${idx + 1}`}
                        aria-current={isActive ? 'true' : 'false'}
                      >
                        <span
                          className={`block rounded-full transition-all duration-200 ${
                            isActive
                              ? 'w-6 h-2 bg-[var(--brand-gold,#D4AF37)] shadow-sm'
                              : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Clickable Gallery Thumbnails Bar (Desktop Only) */}
              {productImages.length > 1 && (
                <div className="hidden md:flex gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-none">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white p-1 flex items-center justify-center relative cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-[var(--brand-gold)] ring-2 ring-[var(--brand-gold)]/30 scale-105'
                          : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} loading="lazy" className="w-full h-full object-contain" />
                      {selectedImageIndex === idx && (
                        <span className="absolute bottom-0 inset-x-0 h-1 bg-[var(--brand-gold)]"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info & Actions */}
            <div className="product-detail-body lg:col-span-6 p-4 sm:p-8 flex flex-col justify-between space-y-5 sm:space-y-6 bg-white text-[#123F2B]">
              <div className="space-y-3">
                <div className="product-meta flex items-center gap-2">
                  <span className="text-xs uppercase tracking-widest text-[#B8891E] font-bold">
                    {product.category}
                  </span>
                  <span className="text-[#718176]">•</span>
                  <span className="text-xs text-[#008F62] font-semibold">In Stock ({product.stock} units)</span>
                </div>

                <h2 className="text-xl sm:text-3xl font-serif-luxury font-bold text-[#123F2B]">
                  {product.name}
                </h2>
                <p className="text-xs text-[#B8891E] font-sans font-medium">{product.subtitle}</p>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex text-[#B8891E]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="review-count text-xs text-[#5E7465] font-sans font-bold">
                    {product.rating} ({product.reviewsCount} verified reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="pt-1 sm:pt-2 flex items-baseline gap-3">
                  <span className="price text-xl sm:text-2xl font-bold font-sans text-[#B8891E]">
                    {formatPrice(product.priceINR)}
                  </span>
                  {product.originalPriceINR && (
                    <span className="old-price text-sm text-[#5F6F63] line-through">
                      {formatPrice(product.originalPriceINR)}
                    </span>
                  )}
                  <span className="secondary text-xs text-[#718176]">({product.volume})</span>
                </div>

                <p className="product-description text-xs text-[#405B4A] leading-relaxed font-sans">{product.description}</p>
              </div>

              {/* Tabs for Details */}
              <div className="border-t border-b border-[rgba(18,63,43,0.18)] py-3">
                <div className="flex gap-3 sm:gap-4 border-b border-[rgba(18,63,43,0.18)] pb-2 text-xs font-sans font-bold uppercase tracking-wider overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('benefits')}
                    className={`pb-1 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'benefits' ? 'text-[#B8891E] border-b-2 border-[#B8891E] tab-active' : 'text-[#5E7465] hover:text-[#B8891E]'}`}
                  >
                    Benefits
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('ingredients')}
                    className={`pb-1 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'ingredients' ? 'text-[#B8891E] border-b-2 border-[#B8891E] tab-active' : 'text-[#5E7465] hover:text-[#B8891E]'}`}
                  >
                    42 Herbs
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('ritual')}
                    className={`pb-1 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'ritual' ? 'text-[#B8891E] border-b-2 border-[#B8891E] tab-active' : 'text-[#5E7465] hover:text-[#B8891E]'}`}
                  >
                    Usage Ritual
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-1 transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'reviews' ? 'text-[#B8891E] border-b-2 border-[#B8891E] tab-active' : 'text-[#5E7465] hover:text-[#B8891E]'}`}
                  >
                    Reviews ({productReviews.length})
                  </button>
                </div>

                <div className="pt-3 text-xs text-[#405B4A] font-sans max-h-36 overflow-y-auto">
                  {activeTab === 'benefits' && (
                    <ul className="product-benefits space-y-1.5 text-[#405B4A]">
                      {product.benefits?.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#B8891E] shrink-0 mt-0.5" />
                          <span className="text-[#405B4A]">{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeTab === 'ingredients' && (
                    <div className="space-y-1">
                      <p className="text-[11px] text-[#B8891E] font-bold mb-1">Key Wild-Harvested Botanicals:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {product.ingredients?.map((ing, i) => (
                          <span key={i} className="bg-[#FAF8F1] border border-[rgba(18,63,43,0.18)] px-2 py-0.5 rounded text-[10px] text-[#123F2B] font-medium">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'ritual' && (
                    <p className="leading-relaxed text-[#405B4A] italic">
                      "{product.usageRitual || 'Massage onto dry scalp twice weekly before sleep. Wash off with warm water and herbal shampoo.'}"
                    </p>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => setIsAddingReview(!isAddingReview)}
                        className="text-[#245C3A] hover:text-[#B8891E] font-bold underline text-[11px] mb-2 block cursor-pointer"
                      >
                        {isAddingReview ? 'Cancel Review' : '+ Write a Customer Review'}
                      </button>

                      {isAddingReview && (
                        <form onSubmit={handleReviewSubmit} className="bg-[#FAF8F1] p-3 rounded-lg border border-[rgba(18,63,43,0.18)] space-y-2 mb-3">
                          <input
                            type="text"
                            placeholder="Your Name"
                            required
                            value={newReviewName}
                            onChange={(e) => setNewReviewName(e.target.value)}
                            className="w-full bg-white border border-[rgba(18,63,43,0.18)] p-1.5 text-xs rounded text-[#123F2B] focus:outline-none focus:border-[#245C3A]"
                          />
                          <input
                            type="text"
                            placeholder="Review Headline"
                            value={newReviewTitle}
                            onChange={(e) => setNewReviewTitle(e.target.value)}
                            className="w-full bg-white border border-[rgba(18,63,43,0.18)] p-1.5 text-xs rounded text-[#123F2B] focus:outline-none focus:border-[#245C3A]"
                          />
                          <textarea
                            placeholder="Your experience with this formula..."
                            required
                            rows={2}
                            value={newReviewComment}
                            onChange={(e) => setNewReviewComment(e.target.value)}
                            className="w-full bg-white border border-[rgba(18,63,43,0.18)] p-1.5 text-xs rounded text-[#123F2B] focus:outline-none focus:border-[#245C3A]"
                          ></textarea>
                          <button
                            type="submit"
                            className="bg-[#123F2B] text-white px-3 py-1 font-bold text-xs rounded uppercase hover:bg-[#245C3A] transition-colors cursor-pointer"
                          >
                            Submit Review
                          </button>
                        </form>
                      )}

                      {productReviews.length === 0 ? (
                        <p className="text-[#718176]">Be the first to review this herbal product.</p>
                      ) : (
                        productReviews.map((rev) => (
                          <div key={rev.id} className="border-b border-[rgba(18,63,43,0.18)] pb-2">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="font-bold text-[#123F2B]">{rev.customerName}</span>
                              <span className="text-[#B8891E]">{'★'.repeat(rev.rating)}</span>
                            </div>
                            <p className="text-[11px] font-semibold text-[#B8891E] mt-0.5">{rev.title}</p>
                            <p className="text-[10px] text-[#405B4A] mt-0.5">{rev.comment}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity & CTA */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center border border-[rgba(18,63,43,0.18)] rounded-lg overflow-hidden bg-[#FAF8F1] shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 text-[#123F2B] hover:text-[#B8891E] font-bold text-lg flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 font-bold text-sm text-[#123F2B]">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 text-[#123F2B] hover:text-[#B8891E] font-bold text-lg flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#123F2B] text-white min-h-[48px] py-3 px-4 rounded-lg font-sans text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-[#245C3A] transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                    <span>Add To Bag • {formatPrice(product.priceINR * quantity)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className={`p-3 rounded-lg border transition-colors shrink-0 cursor-pointer ${
                      isInWishlist(product.id)
                        ? 'border-[#B8891E] bg-[#B8891E] text-white'
                        : 'border-[rgba(18,63,43,0.18)] text-[#123F2B] hover:border-[#B8891E]'
                    }`}
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>

                {/* Shipping Guarantee */}
                <div className="product-delivery-info grid grid-cols-2 gap-3 text-[10px] font-sans text-[#5E7465] pt-2 border-t border-[rgba(18,63,43,0.18)]">
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-[#B8891E] shrink-0" />
                    <span>Worldwide Express Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#B8891E] shrink-0" />
                    <span>100% Herbal Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

};
