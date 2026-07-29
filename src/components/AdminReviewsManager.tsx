import React, { useState } from 'react';
import { uploadFileToServer } from '../utils/upload';
import {
  Star,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Upload,
  X,
  MessageSquare,
  ThumbsUp,
  Image as ImageIcon,
  Video,
  User,
  Filter,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Review } from '../types/store';

interface AdminReviewsManagerProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminReviewsManager: React.FC<AdminReviewsManagerProps> = ({ showToast }) => {
  const { reviews, products, addReview, updateReview, deleteReview } = useStore();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'ALL'>('ALL');
  const [filterProduct, setFilterProduct] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED'>('ALL');
  const [filterFeatured, setFilterFeatured] = useState<boolean | 'ALL'>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Confirmation Delete Modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerImage, setCustomerImage] = useState('');
  const [location, setLocation] = useState('Bangalore, India');
  const [productId, setProductId] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [verifiedPurchase, setVerifiedPurchase] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'APPROVED' | 'PENDING' | 'REJECTED'>('APPROVED');
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);

  // Helpers
  const resetForm = () => {
    setEditingReview(null);
    setCustomerName('');
    setCustomerImage('');
    setLocation('Bangalore, India');
    setProductId(products[0]?.id || '');
    setRating(5);
    setTitle('');
    setComment('');
    setVerifiedPurchase(true);
    setFeatured(false);
    setStatus('APPROVED');
    setImages([]);
    setVideos([]);
    setIsModalOpen(false);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rev: Review) => {
    setEditingReview(rev);
    setCustomerName(rev.customerName || '');
    setCustomerImage(rev.customerImage || '');
    setLocation(rev.location || 'India');
    setProductId(rev.productId || '');
    setRating(rev.rating || 5);
    setTitle(rev.title || '');
    setComment(rev.comment || '');
    setVerifiedPurchase(rev.verifiedPurchase ?? true);
    setFeatured(rev.featured ?? false);
    setStatus(rev.status || (rev.approved === false ? 'REJECTED' : 'APPROVED'));
    setImages(rev.images || []);
    setVideos(rev.videos || []);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) {
      showToast('Please enter customer name and review details.', 'error');
      return;
    }

    const reviewData = {
      productId: productId || (products[0]?.id ?? 'gen-1'),
      customerName,
      customerImage,
      rating,
      title: title || 'Exceptional Quality',
      comment,
      verifiedPurchase,
      location,
      status,
      approved: status === 'APPROVED',
      featured,
      images,
      videos,
    };

    if (editingReview) {
      updateReview(editingReview.id, reviewData);
      showToast('Review updated successfully.', 'success');
    } else {
      addReview(reviewData);
      showToast('New review added successfully.', 'success');
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteReview(id);
    showToast('Review deleted.', 'info');
    setDeleteId(null);
  };

  const handleToggleApprove = (rev: Review) => {
    const nextStatus = rev.status === 'APPROVED' || rev.approved !== false ? 'REJECTED' : 'APPROVED';
    updateReview(rev.id, {
      status: nextStatus,
      approved: nextStatus === 'APPROVED',
    });
    showToast(`Review status set to ${nextStatus}.`, 'success');
  };

  const handleToggleFeatured = (rev: Review) => {
    updateReview(rev.id, { featured: !rev.featured });
    showToast(rev.featured ? 'Removed from featured.' : 'Marked as featured review.', 'info');
  };

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files) as File[]) {
      try {
        const url = await uploadFileToServer(file);
        setImages((prev) => [...prev, url]);
      } catch (err) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
    e.target.value = '';
  };

  // Filter Logic
  const filteredReviews = reviews.filter((rev) => {
    const matchesSearch =
      rev.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = filterRating === 'ALL' || rev.rating === filterRating;
    const matchesProduct = filterProduct === 'ALL' || rev.productId === filterProduct;

    const revStatus = rev.status || (rev.approved === false ? 'REJECTED' : 'APPROVED');
    const matchesStatus = filterStatus === 'ALL' || revStatus === filterStatus;

    const matchesFeatured = filterFeatured === 'ALL' || !!rev.featured === filterFeatured;

    return matchesSearch && matchesRating && matchesProduct && matchesStatus && matchesFeatured;
  });

  // Analytics Stats
  const totalReviews = reviews.length;
  const approvedCount = reviews.filter((r) => (r.status || (r.approved === false ? 'REJECTED' : 'APPROVED')) === 'APPROVED').length;
  const pendingCount = reviews.filter((r) => r.status === 'PENDING').length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) : '5.0';

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-[var(--brand-gold)] text-xs font-bold uppercase tracking-wider block mb-1 font-sans">
            Customer Feedback & Moderation
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-slate-100">
            Reviews & Ratings Manager
          </h1>
          <p className="text-xs text-slate-300 font-sans mt-1">
            Moderate customer testimonials, upload photo/video reviews, and feature top feedback on product pages.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-5 py-2.5 rounded-xl font-bold hover:bg-white transition-all shadow-lg text-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Manual Review</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-400 block">Total Reviews</span>
          <span className="text-2xl font-bold font-serif-luxury text-slate-100">{totalReviews}</span>
        </div>
        <div className="bg-[var(--brand-primary-deep)] border border-emerald-500/20 rounded-xl p-4 space-y-1">
          <span className="text-xs text-emerald-400 block">Approved Live</span>
          <span className="text-2xl font-bold font-serif-luxury text-emerald-300">{approvedCount}</span>
        </div>
        <div className="bg-[var(--brand-primary-deep)] border border-amber-500/20 rounded-xl p-4 space-y-1">
          <span className="text-xs text-amber-400 block">Pending Review</span>
          <span className="text-2xl font-bold font-serif-luxury text-amber-300">{pendingCount}</span>
        </div>
        <div className="bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/30 rounded-xl p-4 space-y-1">
          <span className="text-xs text-[var(--brand-gold)] block">Average Rating</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-serif-luxury text-[var(--brand-gold)]">{avgRating}</span>
            <div className="flex text-[var(--brand-gold)]">
              <Star className="w-4 h-4 fill-current" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-xl p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, title, comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[var(--brand-gold)]"
            />
          </div>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[var(--brand-gold)]"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved Only</option>
            <option value="PENDING">Pending Approval</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* Filter Rating */}
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[var(--brand-gold)]"
          >
            <option value="ALL">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          {/* Filter Product */}
          <select
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
            className="bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[var(--brand-gold)]"
          >
            <option value="ALL">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-2xl p-12 text-center space-y-3">
          <MessageSquare className="w-12 h-12 text-slate-500 mx-auto opacity-50" />
          <h3 className="text-lg font-bold font-serif-luxury text-slate-200">No Reviews Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No customer reviews match your search filter criteria. Click "Add Manual Review" above to publish a new test or authentic review.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredReviews.map((rev) => {
            const productMatch = products.find((p) => p.id === rev.productId);
            const revStatus = rev.status || (rev.approved === false ? 'REJECTED' : 'APPROVED');

            return (
              <div
                key={rev.id}
                className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-[var(--brand-gold)]/40 transition-all shadow-md group relative"
              >
                <div className="space-y-3">
                  {/* Top Bar: Product & Badges */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                    <span className="text-[11px] font-bold text-[var(--brand-gold)] truncate max-w-[180px]">
                      {productMatch ? productMatch.name : 'General Herbal Review'}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {rev.featured && (
                        <span className="bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          revStatus === 'APPROVED'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : revStatus === 'PENDING'
                            ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {revStatus}
                      </span>
                    </div>
                  </div>

                  {/* Customer Info & Rating */}
                  <div className="flex items-center gap-3">
                    {rev.customerImage ? (
                      <img
                        src={rev.customerImage}
                        alt={rev.customerName}
                        className="w-9 h-9 rounded-full object-cover border border-[var(--brand-gold)]/40"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[var(--brand-primary-dark)] border border-white/15 flex items-center justify-center text-slate-300 text-xs font-bold">
                        {rev.customerName ? rev.customerName.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-100">{rev.customerName}</span>
                        {rev.verifiedPurchase && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" title="Verified Buyer" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block">{rev.location || 'India'}</span>
                    </div>
                  </div>

                  {/* Stars & Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex text-[var(--brand-gold)]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-slate-600'}`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-sans">{rev.date}</span>
                  </div>

                  {/* Title & Comment */}
                  <h4 className="text-xs font-bold text-slate-100 font-serif-luxury leading-snug">{rev.title}</h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-4 font-light">
                    "{rev.comment}"
                  </p>

                  {/* Photos/Videos Attached */}
                  {rev.images && rev.images.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
                      {rev.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="Review proof"
                          className="w-10 h-10 rounded-lg object-cover border border-white/15"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleApprove(rev)}
                      className={`p-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 ${
                        revStatus === 'APPROVED'
                          ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900'
                          : 'border-white/20 text-slate-300 hover:bg-white/10'
                      }`}
                      title={revStatus === 'APPROVED' ? 'Reject Review' : 'Approve Review'}
                    >
                      {revStatus === 'APPROVED' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Approved</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Approve Now</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleToggleFeatured(rev)}
                      className={`p-1.5 rounded-lg border text-[10px] font-bold transition-all flex items-center gap-1 ${
                        rev.featured
                          ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)]/20 text-[var(--brand-gold)]'
                          : 'border-white/15 text-slate-400 hover:text-slate-200'
                      }`}
                      title="Toggle Featured"
                    >
                      <Star className={`w-3.5 h-3.5 ${rev.featured ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(rev)}
                      className="p-1.5 rounded-lg border border-white/15 text-slate-300 hover:bg-white/10 transition-all"
                      title="Edit Review"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(rev.id)}
                      className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-950 transition-all"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[var(--brand-primary-dark)]">
              <h3 className="text-lg font-bold font-serif-luxury text-slate-100">
                {editingReview ? 'Edit Review' : 'Add Customer Review'}
              </h3>
              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Customer Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, India"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Product Reviewed</label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating (1-5 stars) */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Rating (1 to 5 Stars)</label>
                  <div className="flex items-center gap-1.5 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-[var(--brand-gold)] hover:scale-110 transition-all cursor-pointer"
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? 'fill-current' : 'text-slate-600'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-200 ml-2">{rating} Stars</span>
                  </div>
                </div>
              </div>

              {/* Review Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Review Title</label>
                <input
                  type="text"
                  placeholder="e.g. Hair fall reduced within 3 weeks!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[var(--brand-gold)]"
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Review Description / Comment *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detailed customer experience and results..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[var(--brand-gold)]"
                />
              </div>

              {/* Review Media Attachments */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Upload Review Photos</label>
                <div className="flex items-center gap-3">
                  <label className="bg-[var(--brand-primary-dark)] border border-dashed border-[var(--brand-gold)]/50 hover:border-[var(--brand-gold)] rounded-xl px-4 py-2 text-xs text-[var(--brand-gold)] font-bold cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload Images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {images.length > 0 && (
                    <span className="text-xs text-slate-300">{images.length} photo(s) attached</span>
                  )}
                </div>

                {images.length > 0 && (
                  <div className="flex items-center gap-2 mt-3 overflow-x-auto">
                    {images.map((img, index) => (
                      <div key={index} className="relative group shrink-0">
                        <img
                          src={img}
                          alt="Attached review photo"
                          className="w-16 h-16 rounded-xl object-cover border border-white/20"
                        />
                        <button
                          type="button"
                          onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                          className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full p-0.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggles & Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10">
                <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedPurchase}
                    onChange={(e) => setVerifiedPurchase(e.target.checked)}
                    className="accent-[var(--brand-gold)] w-4 h-4 rounded"
                  />
                  <span>Verified Buyer Badge</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="accent-[var(--brand-gold)] w-4 h-4 rounded"
                  />
                  <span>Featured Review</span>
                </label>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-lg px-2 py-1 text-xs text-slate-100"
                  >
                    <option value="APPROVED">Approved</option>
                    <option value="PENDING">Pending</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-xl border border-white/20 text-slate-300 hover:bg-white/10 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-6 py-2 rounded-xl font-bold hover:bg-white transition-all text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingReview ? 'Save Review' : 'Publish Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--brand-primary-deep)] border border-rose-500/30 rounded-2xl max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold font-serif-luxury text-slate-100">Delete Review?</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to permanently delete this customer review? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl border border-white/20 text-slate-300 hover:bg-white/10 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="bg-rose-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-rose-700 transition-all"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
