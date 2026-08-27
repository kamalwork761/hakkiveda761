import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, Play, Pause, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/store';

interface VideoPopupModalProps {
  forceShow?: boolean;
  onClosePreview?: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const VideoPopupModal: React.FC<VideoPopupModalProps> = ({
  forceShow = false,
  onClosePreview,
  onSelectProduct,
}) => {
  const { videoPopupConfig, products, setIsQuizOpen } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if popup should be shown
  useEffect(() => {
    if (forceShow) {
      setIsOpen(true);
      return;
    }

    if (!videoPopupConfig.enabled || videoPopupConfig.frequency === 'DISABLED') {
      return;
    }

    // Check device width
    const isMobile = window.innerWidth < 768;
    if (isMobile && !videoPopupConfig.enableMobile) return;
    if (!isMobile && !videoPopupConfig.enableDesktop) return;

    // Check date range
    const now = new Date().getTime();
    if (videoPopupConfig.startDate) {
      const start = new Date(videoPopupConfig.startDate).getTime();
      if (!isNaN(start) && now < start) return;
    }
    if (videoPopupConfig.endDate) {
      const end = new Date(videoPopupConfig.endDate).getTime();
      if (!isNaN(end) && now > end) return;
    }

    // Check frequency rule
    const freq = videoPopupConfig.frequency;
    if (freq === 'ONCE_PER_SESSION') {
      const seen = sessionStorage.getItem('hv_video_popup_seen');
      if (seen) return;
    } else if (freq === 'EVERY_3_DAYS') {
      const lastTime = localStorage.getItem('hv_video_popup_time');
      if (lastTime && now - parseInt(lastTime, 10) < 3 * 24 * 60 * 60 * 1000) {
        return;
      }
    } else if (freq === 'EVERY_7_DAYS') {
      const lastTime = localStorage.getItem('hv_video_popup_time');
      if (lastTime && now - parseInt(lastTime, 10) < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // Delay before opening
    const delayMs = (videoPopupConfig.delaySeconds || 2.5) * 1000;
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [videoPopupConfig, forceShow]);

  // Handle closing
  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsOpen(false);

    if (forceShow && onClosePreview) {
      onClosePreview();
      return;
    }

    // Record frequency
    const freq = videoPopupConfig.frequency;
    const now = new Date().getTime().toString();
    if (freq === 'ONCE_PER_SESSION') {
      sessionStorage.setItem('hv_video_popup_seen', 'true');
    } else if (freq === 'EVERY_3_DAYS' || freq === 'EVERY_7_DAYS') {
      localStorage.setItem('hv_video_popup_time', now);
    }
  };

  // Keyboard Escape & Popstate (Android back button)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    const handlePopState = () => {
      handleClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen]);

  // Toggle Video Play/Pause
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      } else {
        setIsPlaying(true);
      }
    }
  };

  // Toggle Mute/Unmute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Find linked product if available
  const linkedProduct = videoPopupConfig.linkedProductId
    ? products.find((p) => p.id === videoPopupConfig.linkedProductId)
    : null;

  // CTA Click handler
  const handleCTAClick = () => {
    handleClose();
    const dest = videoPopupConfig.ctaDestination || '#products';

    if (linkedProduct && onSelectProduct) {
      onSelectProduct(linkedProduct);
      return;
    }

    if (dest === '#ai-quiz' || dest === 'quiz') {
      setIsQuizOpen(true);
      return;
    }

    if (dest.startsWith('#')) {
      const targetEl = document.querySelector(dest);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (dest.startsWith('http')) {
      window.open(dest, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-lg md:max-w-xl bg-[var(--brand-surface,#FFFFFF)] rounded-2xl overflow-hidden shadow-2xl border-2 border-[var(--brand-gold,#D4AF37)] transition-all transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-[var(--brand-primary-dark,#123F2B)] text-white hover:bg-[var(--brand-gold,#D4AF37)] hover:text-[var(--brand-primary-dark,#123F2B)] transition-all shadow-lg border border-[var(--brand-gold,#D4AF37)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold,#D4AF37)] cursor-pointer"
          aria-label="Close promotional video popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Player Container */}
        <div className="relative w-full aspect-video bg-black overflow-hidden group">
          <video
            ref={videoRef}
            src={videoPopupConfig.videoUrl}
            poster={videoPopupConfig.posterUrl}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Subtle gradient overlay at bottom of video */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

          {/* Controls Bar on Video */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20">
            <button
              onClick={togglePlay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs font-semibold backdrop-blur-sm border border-white/20 transition-all cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={toggleMute}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs font-semibold backdrop-blur-sm border border-white/20 transition-all cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isMuted ? 'Unmute' : 'Muted'}</span>
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-5 md:p-6 bg-gradient-to-b from-[#FAF8F5] to-white text-[var(--brand-primary-dark,#123F2B)]">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-[var(--brand-gold,#D4AF37)]">
            <Sparkles className="w-4 h-4 fill-current text-[var(--brand-gold,#D4AF37)]" />
            <span>Exclusive Tribal Ritual</span>
          </div>

          <h3 className="text-xl md:text-2xl font-serif font-bold text-[var(--brand-primary-dark,#123F2B)] mb-2 leading-tight">
            {videoPopupConfig.heading || 'Special Herbal Announcement'}
          </h3>

          <p className="text-sm text-slate-700 leading-relaxed mb-4">
            {videoPopupConfig.description ||
              'Discover authentic Hakki-Pikki mountain herb formulations cooked over copper cauldrons for optimal hair density and scalp health.'}
          </p>

          {/* Linked Product Card Preview if attached */}
          {linkedProduct && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50/80 border border-[var(--brand-gold,#D4AF37)]/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={linkedProduct.image}
                  alt={linkedProduct.name}
                  className="w-12 h-12 object-cover rounded-lg border border-[var(--brand-gold,#D4AF37)] shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[var(--brand-primary-dark,#123F2B)] truncate">
                    {linkedProduct.name}
                  </div>
                  <div className="text-xs text-amber-800 font-semibold flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Special Offer Included</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleCTAClick}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--brand-gold,#D4AF37)] text-[var(--brand-primary-dark,#123F2B)] font-bold text-sm shadow-md hover:bg-amber-400 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>{videoPopupConfig.ctaText || 'Explore Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-3.5 rounded-xl border border-slate-300 text-slate-600 font-semibold text-sm hover:bg-slate-100 transition-all cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
