import React, { useState, useMemo } from 'react';
import {
  Play,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Youtube,
  Sparkles,
  Layers,
  Flame,
  BookOpen,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useSmoothAutoScroll } from '../hooks/useSmoothAutoScroll';
import { TestimonialVideo } from '../types/store';

export interface VideoGuideItem {
  id: string;
  title: string;
  category: 'Preparation' | 'Application' | 'Herbal Ritual' | 'Product Guide' | string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  description?: string;
  customerName?: string;
  location?: string;
}

export function extractYouTubeId(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.includes('youtu.be/')) {
    return trimmed.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0] || '';
  }
  if (trimmed.includes('youtube.com/shorts/')) {
    return trimmed.split('youtube.com/shorts/')[1]?.split('?')[0]?.split('&')[0] || '';
  }
  if (trimmed.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(trimmed.split('?')[1] || '');
    return urlParams.get('v') || '';
  }
  if (trimmed.includes('youtube.com/embed/')) {
    return trimmed.split('youtube.com/embed/')[1]?.split('?')[0]?.split('&')[0] || '';
  }
  return '';
}

export function getYouTubeThumbnailUrl(url: string, fallbackThumbnail?: string): string {
  const videoId = extractYouTubeId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return fallbackThumbnail || '/images/hakkiveda_108_oil_gold.jpg';
}

export function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  const videoId = extractYouTubeId(url);
  if (videoId) {
    const origin = typeof window !== 'undefined' && window.location ? window.location.origin : '';
    const originParam = origin ? `&origin=${encodeURIComponent(origin)}` : '';
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1&modestbranding=1${originParam}`;
  }
  if (url.includes('youtube.com/embed/')) return url;
  return url;
}

const DEFAULT_VIDEO_GUIDES: VideoGuideItem[] = [
  {
    id: 'vid-1',
    title: 'Traditional 21-Day Woodfire Decoction Method',
    category: 'Preparation',
    duration: '1:45',
    thumbnail: 'https://img.youtube.com/vi/1jzF9v5PEBY/hqdefault.jpg',
    videoUrl: 'https://youtu.be/1jzF9v5PEBY?si=AWftq4EOQ5cOXjt4',
    description: 'Watch how 108 wildcrafted herbs are simmered in copper cauldrons over woodfire.',
    customerName: 'HAKKIVEDA Rituals',
    location: 'Pakshirajapura, Karnataka',
  },
  {
    id: 'vid-2',
    title: 'Warm Scalp Massage & Night Ritual Guide',
    category: 'Application',
    duration: '0:58',
    thumbnail: 'https://img.youtube.com/vi/XV-Y5vXaKqU/hqdefault.jpg',
    videoUrl: 'https://youtube.com/shorts/XV-Y5vXaKqU?si=FTdChnp0Ei3dnLlS',
    description: 'Step-by-step tribal technique for deep root penetration and follicle activation.',
    customerName: 'Application Masterclass',
    location: 'Hakki-Pikki Heritage',
  },
  {
    id: 'vid-3',
    title: 'Pure Forest Herbs & Botanical Sourcing',
    category: 'Herbal Ritual',
    duration: '0:45',
    thumbnail: 'https://img.youtube.com/vi/5Q9IpbVpgZM/hqdefault.jpg',
    videoUrl: 'https://youtube.com/shorts/5Q9IpbVpgZM?si=5MBNXibq_8n0mLZB',
    description: 'Ethically foraged Bhringraj, Brahmi, and rare root botanicals in their purest state.',
    customerName: 'Herbal Potency',
    location: 'Western Ghats',
  },
  {
    id: 'vid-4',
    title: 'Choosing the Right Oil Formulation for Your Dosha',
    category: 'Product Guide',
    duration: '1:15',
    thumbnail: 'https://img.youtube.com/vi/1jzF9v5PEBY/hqdefault.jpg',
    videoUrl: 'https://youtu.be/1jzF9v5PEBY?si=AWftq4EOQ5cOXjt4',
    description: 'Understand the difference between 108 Herb Gold and Root Revival Elixir.',
    customerName: 'Product Education',
    location: 'HAKKIVEDA Lab',
  },
];

export const VideoTestimonials: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<VideoGuideItem | null>(null);
  const { testimonialVideos, brandIdentity } = useStore();

  const rawVideos: VideoGuideItem[] = useMemo(() => {
    if (testimonialVideos && testimonialVideos.length > 0) {
      const activeOnly = testimonialVideos.filter((v) => v.active !== false && v.showOnHomepage !== false);
      if (activeOnly.length > 0) {
        return activeOnly.map((v: TestimonialVideo, idx: number) => {
          const fallbackCat = ['Preparation', 'Application', 'Herbal Ritual', 'Product Guide'][idx % 4];
          return {
            id: v.id,
            title: v.title || v.reviewText || v.customerName || `HAKKIVEDA Ritual Guide #${idx + 1}`,
            category: (v.category as VideoGuideItem['category']) || fallbackCat,
            duration: v.duration || '1:30',
            thumbnail: getYouTubeThumbnailUrl(v.videoUrl, v.thumbnail),
            videoUrl: v.videoUrl,
            description: v.reviewText,
            customerName: v.customerName,
            location: v.location || v.country,
          };
        });
      }
    }
    return DEFAULT_VIDEO_GUIDES;
  }, [testimonialVideos]);

  // Multiply items for smooth continuous carousel auto-scrolling
  const REPEAT_COUNT = 4;
  const displayItems = useMemo(() => {
    return Array.from({ length: REPEAT_COUNT }).flatMap(() => rawVideos);
  }, [rawVideos]);

  const {
    containerRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleScroll,
    isDragging,
  } = useSmoothAutoScroll({
    itemCount: rawVideos.length,
    repeatCount: REPEAT_COUNT,
    pixelsPerSecond: 18, // Slow, elegant marquee (16–22px/sec target)
    pauseDuration: 2500,
    isPaused: Boolean(activeVideo), // Pause immediately while a video is playing
  });

  const handleCardClick = (item: VideoGuideItem) => {
    if (isDragging()) return;
    setActiveVideo(item);
  };

  const handleDesktopScroll = (direction: 'LEFT' | 'RIGHT') => {
    const container = containerRef.current;
    if (!container) return;
    const scrollAmount = 340;
    container.scrollBy({
      left: direction === 'LEFT' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const youtubeChannelUrl = brandIdentity?.socialYoutube || 'https://youtube.com/@hakkiveda';

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Preparation':
        return <Flame className="w-3 h-3 text-[var(--brand-gold)]" />;
      case 'Application':
        return <Sparkles className="w-3 h-3 text-[var(--brand-gold)]" />;
      case 'Herbal Ritual':
        return <Layers className="w-3 h-3 text-[var(--brand-gold)]" />;
      case 'Product Guide':
      default:
        return <BookOpen className="w-3 h-3 text-[var(--brand-gold)]" />;
    }
  };

  return (
    <section
      id="youtube-video-guides-section"
      className="py-12 sm:py-16 md:py-20 bg-[var(--brand-primary-deep)] border-t border-b border-white/10 relative overflow-hidden w-full max-w-full text-white"
    >
      {/* Background Decorative Ambient Radial Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[var(--brand-gold)]/5 blur-[120px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-[var(--brand-gold)]/30 backdrop-blur-sm">
            <Youtube className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span className="text-[var(--brand-gold)] font-sans text-[11px] uppercase tracking-[0.25em] font-bold">
              Official YouTube Series
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-slate-100 tracking-tight leading-tight">
            WATCH HAKKIVEDA ON YOUTUBE
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed max-w-2xl mx-auto font-normal">
            Preparation methods, application guides, herbal rituals and product education.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          {/* Desktop Navigation Arrows (Hidden on Mobile) */}
          <button
            onClick={() => handleDesktopScroll('LEFT')}
            className="hidden md:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/80 hover:bg-[var(--brand-gold)] text-white hover:text-[var(--brand-primary-dark)] border border-white/20 hover:border-[var(--brand-gold)] items-center justify-center shadow-xl transition-all duration-200 cursor-pointer backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
            aria-label="Scroll videos left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => handleDesktopScroll('RIGHT')}
            className="hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/80 hover:bg-[var(--brand-gold)] text-white hover:text-[var(--brand-primary-dark)] border border-white/20 hover:border-[var(--brand-gold)] items-center justify-center shadow-xl transition-all duration-200 cursor-pointer backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
            aria-label="Scroll videos right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Horizontal Swipeable Track */}
          <div
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onScroll={handleScroll}
            className="flex gap-3 sm:gap-3.5 md:gap-4 overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing touch-pan-x pb-4 pt-1"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {displayItems.map((item, index) => {
              const videoId = extractYouTubeId(item.videoUrl);
              const hasValidVideo = Boolean(videoId || item.videoUrl);

              return (
                <div
                  key={`${item.id}-${index}`}
                  onClick={() => handleCardClick(item)}
                  className="w-[47vw] min-w-[165px] max-w-[210px] sm:w-[220px] md:w-[270px] lg:w-[290px] shrink-0 bg-[#FAF7F2] border border-[#E5D8B5] hover:border-[#C5A059] rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 shadow-md shadow-black/10 flex flex-col cursor-pointer group"
                >
                  {/* Thumbnail Container (16:9 Aspect Ratio) - Clean & Bright */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#FAF7F2]">
                    {hasValidVideo ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        onError={(e) => {
                          // Fallback on broken thumbnail
                          (e.target as HTMLImageElement).src = '/images/hakkiveda_108_oil_gold.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-[#FAF7F2] text-[#37463D]">
                        <Youtube className="w-6 h-6 text-red-500 mb-1" />
                        <span className="text-[10px]">HAKKIVEDA Video</span>
                      </div>
                    )}

                    {/* Category Label (Top-Left) */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-[#0F2E22]/85 backdrop-blur-md border border-[#C5A059]/40 text-[#C5A059] text-[9px] sm:text-[10px] font-sans font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                        {getCategoryIcon(item.category)}
                        <span>{item.category}</span>
                      </span>
                    </div>

                    {/* Duration Badge (Bottom-Right) */}
                    {item.duration && (
                      <div className="absolute bottom-2 right-2 z-10">
                        <span className="bg-[#0F2E22]/85 backdrop-blur-md text-[#FAF7F2] text-[9px] sm:text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border border-[#C5A059]/30">
                          {item.duration}
                        </span>
                      </div>
                    )}

                    {/* Centered Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#C5A059] text-[#0F2E22] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#d8b368] transition-all duration-300 ring-2 ring-white/60">
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current translate-x-0.5 text-[#0F2E22]" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content - Clean Ivory Surface */}
                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2 bg-[#FAF7F2]">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold font-serif-luxury text-[#0F2E22] group-hover:text-[#8E7026] transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-[10px] sm:text-[11px] text-[#37463D] font-sans mt-1 line-clamp-2 leading-relaxed hidden sm:block">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-1.5 border-t border-[#E5D8B5] flex items-center justify-between text-[10px] sm:text-xs text-[#37463D]">
                      <span className="text-[#8E7026] font-sans font-bold flex items-center gap-1 group-hover:underline">
                        <span>Play Video</span>
                        <Play className="w-2.5 h-2.5 fill-current" />
                      </span>
                      <span className="text-[#64746B] text-[10px] truncate max-w-[90px]">
                        YouTube HD
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Watch More on YouTube CTA */}
        <div className="mt-8 sm:mt-10 text-center">
          <a
            href={youtubeChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white font-sans font-bold text-xs sm:text-sm tracking-wide uppercase shadow-xl hover:shadow-red-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all border border-red-400/30"
          >
            <Youtube className="w-4 h-4 text-white fill-current" />
            <span>WATCH MORE ON YOUTUBE →</span>
          </a>
        </div>
      </div>

      {/* Full 16:9 Video Modal Player */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-slate-950 rounded-2xl overflow-hidden border border-[var(--brand-gold)]/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-3 sm:p-4 bg-[var(--brand-primary-deep)] border-b border-white/15 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-sans font-bold text-[var(--brand-gold)] uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded border border-[var(--brand-gold)]/30">
                    {activeVideo.category}
                  </span>
                  {activeVideo.duration && (
                    <span className="text-[10px] text-slate-300 font-mono">
                      • {activeVideo.duration}
                    </span>
                  )}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-100 font-serif-luxury truncate">
                  {activeVideo.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={activeVideo.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex text-[11px] font-sans font-bold text-white hover:text-[var(--brand-gold)] bg-black/60 border border-white/20 hover:border-[var(--brand-gold)] px-3 py-1.5 rounded-full transition-colors items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in YouTube</span>
                </a>

                <button
                  onClick={() => setActiveVideo(null)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 text-white hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] transition-colors flex items-center justify-center border border-white/20"
                  aria-label="Close Video Player"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Responsive 16:9 Video Player */}
            <div className="aspect-video w-full bg-black relative">
              {extractYouTubeId(activeVideo.videoUrl) ? (
                <iframe
                  src={getYouTubeEmbedUrl(activeVideo.videoUrl)}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-300 space-y-3">
                  <Youtube className="w-12 h-12 text-red-500" />
                  <p className="text-sm font-sans">
                    Video link is unavailable or being updated.
                  </p>
                  <a
                    href={activeVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-xs font-bold"
                  >
                    <span>View on External Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer with Video Details */}
            {activeVideo.description && (
              <div className="p-3 sm:p-4 bg-slate-900/90 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                <p className="line-clamp-2 leading-relaxed">
                  {activeVideo.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
