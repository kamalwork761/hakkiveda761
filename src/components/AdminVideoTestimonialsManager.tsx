import React, { useState } from 'react';
import {
  Video,
  Plus,
  Edit2,
  Trash2,
  Star,
  Search,
  CheckCircle2,
  XCircle,
  Play,
  Upload,
  X,
  ArrowUp,
  ArrowDown,
  User,
  Globe,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { TestimonialVideo } from '../types/store';

interface AdminVideoTestimonialsManagerProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminVideoTestimonialsManager: React.FC<AdminVideoTestimonialsManagerProps> = ({
  showToast,
}) => {
  const {
    testimonialVideos,
    products,
    addTestimonialVideo,
    updateTestimonialVideo,
    deleteTestimonialVideo,
    setAllTestimonialVideos,
  } = useStore();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProduct, setFilterProduct] = useState<string>('ALL');
  const [filterActive, setFilterActive] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [filterFeatured, setFilterFeatured] = useState<boolean | 'ALL'>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<TestimonialVideo | null>(null);

  // Video Playing Modal
  const [playingVideo, setPlayingVideo] = useState<TestimonialVideo | null>(null);

  // Delete Confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhoto, setCustomerPhoto] = useState('');
  const [country, setCountry] = useState('India');
  const [productUsed, setProductUsed] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [videoType, setVideoType] = useState<'FILE' | 'YOUTUBE_VIMEO'>('FILE');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [showOnHomepage, setShowOnHomepage] = useState(true);

  const resetForm = () => {
    setEditingVideo(null);
    setCustomerName('');
    setCustomerPhoto('');
    setCountry('India');
    setProductUsed(products[0]?.name || 'Hakki-Pikki Herbal Hair Oil');
    setRating(5);
    setReviewText('');
    setVideoType('FILE');
    setVideoUrl('');
    setThumbnail('');
    setFeatured(false);
    setActive(true);
    setShowOnHomepage(true);
    setIsModalOpen(false);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (vid: TestimonialVideo) => {
    setEditingVideo(vid);
    setCustomerName(vid.customerName || '');
    setCustomerPhoto(vid.customerPhoto || '');
    setCountry(vid.country || vid.location || 'India');
    setProductUsed(vid.productUsed || products[0]?.name || 'Hakki-Pikki Herbal Hair Oil');
    setRating(vid.rating || 5);
    setReviewText(vid.reviewText || '');
    setVideoUrl(vid.videoUrl || '');
    setThumbnail(vid.thumbnail || '');
    setVideoType(vid.videoUrl?.includes('youtube') || vid.videoUrl?.includes('vimeo') ? 'YOUTUBE_VIMEO' : 'FILE');
    setFeatured(vid.featured ?? false);
    setActive(vid.active ?? true);
    setShowOnHomepage(vid.showOnHomepage ?? true);
    setIsModalOpen(true);
  };

  const handleFileUpload = (file: File, callback: (res: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        callback(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !videoUrl) {
      showToast('Please enter customer name and provide a video file or link.', 'error');
      return;
    }

    const videoData = {
      customerName,
      customerPhoto,
      location: country,
      country,
      productUsed,
      rating,
      reviewText,
      videoUrl,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      featured,
      active,
      showOnHomepage,
    };

    if (editingVideo) {
      updateTestimonialVideo(editingVideo.id, videoData);
      showToast('Video testimonial updated successfully.', 'success');
    } else {
      addTestimonialVideo(videoData);
      showToast('New video testimonial published.', 'success');
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteTestimonialVideo(id);
    showToast('Video testimonial deleted.', 'info');
    setDeleteId(null);
  };

  const handleMove = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= testimonialVideos.length) return;

    const nextList = [...testimonialVideos];
    const [moved] = nextList.splice(index, 1);
    nextList.splice(targetIndex, 0, moved);

    setAllTestimonialVideos(nextList);
    showToast('Video order updated.', 'info');
  };

  // Convert YouTube/Vimeo URLs to embeddable URL format
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  };

  const filteredVideos = testimonialVideos.filter((v) => {
    const matchesSearch =
      v.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.reviewText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.country?.toLowerCase().includes(searchTerm.toLowerCase());

    const isAct = v.active ?? true;
    const matchesActive =
      filterActive === 'ALL' || (filterActive === 'ACTIVE' ? isAct : !isAct);

    const matchesFeatured = filterFeatured === 'ALL' || !!v.featured === filterFeatured;

    return matchesSearch && matchesActive && matchesFeatured;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-[var(--brand-gold)] text-xs font-bold uppercase tracking-wider block mb-1 font-sans">
            Video Reviews & Proof
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-slate-100">
            Video Testimonials Manager
          </h1>
          <p className="text-xs text-slate-300 font-sans mt-1">
            Manage customer video stories (MP4/WebM uploads or YouTube/Vimeo links).
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-5 py-2.5 rounded-xl font-bold hover:bg-white transition-all shadow-lg text-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Video Testimonial</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-400 block">Total Video Stories</span>
          <span className="text-2xl font-bold font-serif-luxury text-slate-100">
            {testimonialVideos.length}
          </span>
        </div>
        <div className="bg-[var(--brand-primary-deep)] border border-emerald-500/20 rounded-xl p-4 space-y-1">
          <span className="text-xs text-emerald-400 block">Active Live</span>
          <span className="text-2xl font-bold font-serif-luxury text-emerald-300">
            {testimonialVideos.filter((v) => v.active ?? true).length}
          </span>
        </div>
        <div className="bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/30 rounded-xl p-4 space-y-1">
          <span className="text-xs text-[var(--brand-gold)] block">Featured Stories</span>
          <span className="text-2xl font-bold font-serif-luxury text-[var(--brand-gold)]">
            {testimonialVideos.filter((v) => v.featured).length}
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer, text, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[var(--brand-gold)]"
            />
          </div>

          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value as any)}
            className="bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[var(--brand-gold)]"
          >
            <option value="ALL">All Visibility</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Video Grid */}
      {filteredVideos.length === 0 ? (
        <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-2xl p-12 text-center space-y-3">
          <Video className="w-12 h-12 text-slate-500 mx-auto opacity-50" />
          <h3 className="text-lg font-bold font-serif-luxury text-slate-200">No Video Testimonials</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click "Add Video Testimonial" above to upload MP4/WebM videos or paste YouTube links.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((v, index) => {
            const isActive = v.active ?? true;
            const isHomepage = v.showOnHomepage ?? true;

            return (
              <div
                key={v.id}
                className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between hover:border-[var(--brand-gold)]/40 transition-all shadow-lg group"
              >
                {/* Video Thumbnail Box */}
                <div className="relative h-52 bg-black/60 overflow-hidden">
                  <img
                    src={
                      v.thumbnail ||
                      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
                    }
                    alt={v.customerName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  />

                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <button
                      onClick={() => setPlayingVideo(v)}
                      className="w-12 h-12 rounded-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] flex items-center justify-center shadow-xl hover:scale-110 transition-all cursor-pointer"
                      title="Play Video"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                  </div>

                  {v.featured && (
                    <span className="absolute top-3 left-3 bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      Featured
                    </span>
                  )}
                </div>

                {/* Info Block */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {v.customerPhoto ? (
                        <img
                          src={v.customerPhoto}
                          alt={v.customerName}
                          className="w-8 h-8 rounded-full object-cover border border-[var(--brand-gold)]/40"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[var(--brand-primary-dark)] border border-white/15 flex items-center justify-center text-xs font-bold text-slate-200">
                          {v.customerName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">{v.customerName}</h4>
                        <span className="text-[10px] text-slate-400 block">
                          {v.country || v.location || 'India'}
                        </span>
                      </div>
                    </div>

                    <div className="flex text-[var(--brand-gold)]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < (v.rating || 5) ? 'fill-current' : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-sans line-clamp-3 font-light">
                    "{v.reviewText}"
                  </p>

                  {v.productUsed && (
                    <span className="inline-block bg-[var(--brand-primary-dark)] text-[var(--brand-gold)] border border-[var(--brand-gold)]/30 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Product: {v.productUsed}
                    </span>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="p-3 bg-[#052018] border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMove(index, 'UP')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg border border-white/15 text-slate-300 hover:bg-white/10 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'DOWN')}
                      disabled={index === testimonialVideos.length - 1}
                      className="p-1.5 rounded-lg border border-white/15 text-slate-300 hover:bg-white/10 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        updateTestimonialVideo(v.id, {
                          active: !isActive,
                        })
                      }
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                        isActive
                          ? 'border-emerald-500/40 bg-emerald-950 text-emerald-400'
                          : 'border-white/15 text-slate-400'
                      }`}
                    >
                      {isActive ? 'Active' : 'Inactive'}
                    </button>

                    <button
                      onClick={() =>
                        updateTestimonialVideo(v.id, {
                          featured: !v.featured,
                        })
                      }
                      className={`p-1.5 rounded-lg border text-[10px] ${
                        v.featured
                          ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)]/20 text-[var(--brand-gold)]'
                          : 'border-white/15 text-slate-400'
                      }`}
                      title="Toggle Featured"
                    >
                      <Star className={`w-3.5 h-3.5 ${v.featured ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(v)}
                      className="p-1.5 rounded-lg border border-white/15 text-slate-300 hover:bg-white/10"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(v.id)}
                      className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-950"
                      title="Delete"
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[var(--brand-primary-dark)]">
              <h3 className="text-lg font-bold font-serif-luxury text-slate-100">
                {editingVideo ? 'Edit Video Testimonial' : 'Add Video Testimonial'}
              </h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Meera Reddy"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Country / City</label>
                  <input
                    type="text"
                    placeholder="e.g. London, UK / Kerala, India"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Product Used</label>
                  <select
                    value={productUsed}
                    onChange={(e) => setProductUsed(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Rating</label>
                  <div className="flex items-center gap-1 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-[var(--brand-gold)]"
                      >
                        <Star className={`w-5 h-5 ${star <= rating ? 'fill-current' : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Video Source Type */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">Video Source</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVideoType('FILE')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                      videoType === 'FILE'
                        ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] border-[var(--brand-gold)]'
                        : 'border-white/15 text-slate-300'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload MP4 / WEBM</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoType('YOUTUBE_VIMEO')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                      videoType === 'YOUTUBE_VIMEO'
                        ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] border-[var(--brand-gold)]'
                        : 'border-white/15 text-slate-300'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>YouTube / Vimeo Link</span>
                  </button>
                </div>
              </div>

              {/* Video Input depending on source */}
              {videoType === 'FILE' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Video File (MP4/WEBM) *</label>
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center bg-[var(--brand-primary-dark)]">
                    {videoUrl && !videoUrl.startsWith('http') ? (
                      <div className="space-y-2">
                        <video src={videoUrl} controls className="w-full max-h-48 rounded-lg object-contain" />
                        <button
                          type="button"
                          onClick={() => setVideoUrl('')}
                          className="text-xs text-rose-400 underline font-bold"
                        >
                          Remove Video
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center py-4">
                        <Upload className="w-6 h-6 text-[var(--brand-gold)] mb-1" />
                        <span className="text-xs font-bold text-slate-200">Select MP4/WEBM Video</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm"
                          onChange={(e) =>
                            e.target.files?.[0] && handleFileUpload(e.target.files[0], setVideoUrl)
                          }
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">YouTube / Vimeo URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>
              )}

              {/* Thumbnail Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Custom Thumbnail Image</label>
                <div className="flex items-center gap-3">
                  {thumbnail && (
                    <img src={thumbnail} alt="Thumbnail" className="w-16 h-12 rounded-lg object-cover border" />
                  )}
                  <label className="bg-[var(--brand-primary-dark)] border border-dashed border-[var(--brand-gold)]/50 text-[var(--brand-gold)] text-xs font-bold px-3 py-2 rounded-xl cursor-pointer">
                    <span>Upload Thumbnail</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files?.[0] && handleFileUpload(e.target.files[0], setThumbnail)
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Review Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Testimonial Quote / Summary *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Customer quote about their hair revival results..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 pt-2 border-t border-white/10">
                <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="accent-[var(--brand-gold)] w-4 h-4 rounded"
                  />
                  <span>Featured Video</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="accent-[var(--brand-gold)] w-4 h-4 rounded"
                  />
                  <span>Active Live</span>
                </label>
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
                  <span>{editingVideo ? 'Save Changes' : 'Publish Testimonial'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Player Preview Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/40 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-lg font-bold font-serif-luxury text-slate-100">
                  {playingVideo.customerName}'s Story
                </h3>
                <span className="text-xs text-[var(--brand-gold)]">{playingVideo.country || 'India'}</span>
              </div>
              <button
                onClick={() => setPlayingVideo(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/15">
              {playingVideo.videoUrl?.includes('youtube') || playingVideo.videoUrl?.includes('vimeo') ? (
                <iframe
                  src={getEmbedUrl(playingVideo.videoUrl)}
                  title={playingVideo.customerName}
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : (
                <video src={playingVideo.videoUrl} controls autoPlay className="w-full h-full object-contain" />
              )}
            </div>

            <p className="text-xs text-slate-300 font-sans italic">"{playingVideo.reviewText}"</p>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--brand-primary-deep)] border border-rose-500/30 rounded-2xl max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold font-serif-luxury text-slate-100">Delete Video?</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete this video testimonial?
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
