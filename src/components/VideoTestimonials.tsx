import React, { useState } from 'react';
import { Play, Star, MapPin, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface VideoTestimonial {
  id: string;
  name: string;
  location: string;
  headline: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
}

export function extractYouTubeId(url: string): string {
  if (!url) return '';
  if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0] || '';
  }
  if (url.includes('youtube.com/shorts/')) {
    return url.split('youtube.com/shorts/')[1]?.split('?')[0]?.split('&')[0] || '';
  }
  if (url.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(url.split('?')[1] || '');
    return urlParams.get('v') || '';
  }
  if (url.includes('youtube.com/embed/')) {
    return url.split('youtube.com/embed/')[1]?.split('?')[0]?.split('&')[0] || '';
  }
  return '';
}

export function getYouTubeThumbnailUrl(url: string, fallbackThumbnail?: string): string {
  const videoId = extractYouTubeId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return fallbackThumbnail || '';
}

export function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  const videoId = extractYouTubeId(url);
  if (videoId) {
    const origin = typeof window !== 'undefined' && window.location ? window.location.origin : '';
    const originParam = origin ? `&origin=${encodeURIComponent(origin)}` : '';
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1${originParam}`;
  }
  if (url.includes('youtube.com/embed/')) return url;
  return url;
}

const DEFAULT_TESTIMONIAL_VIDEOS: VideoTestimonial[] = [
  {
    id: 'vid-1',
    name: 'DILJIT KUMAR',
    location: 'London, UK',
    headline: 'How HAKKIVEDA stopped my post-covid hair shedding in 30 days',
    duration: '1:45',
    thumbnail: 'https://img.youtube.com/vi/1jzF9v5PEBY/hqdefault.jpg',
    videoUrl: 'https://youtu.be/1jzF9v5PEBY?si=AWftq4EOQ5cOXjt4',
  },
  {
    id: 'vid-2',
    name: 'Arjun Verma',
    location: 'Singapore',
    headline: 'My crown thinning filled up after 2 bottles of Tribal Gold Oil',
    duration: '0:58',
    thumbnail: 'https://img.youtube.com/vi/XV-Y5vXaKqU/hqdefault.jpg',
    videoUrl: 'https://youtube.com/shorts/XV-Y5vXaKqU?si=FTdChnp0Ei3dnLlS',
  },
  {
    id: 'vid-3',
    name: 'Priya Sundaram',
    location: 'Bengaluru, India',
    headline: 'The 42-herb formulation cured my severe scalp itching & dandruff',
    duration: '0:45',
    thumbnail: 'https://img.youtube.com/vi/5Q9IpbVpgZM/hqdefault.jpg',
    videoUrl: 'https://youtube.com/shorts/5Q9IpbVpgZM?si=5MBNXibq_8n0mLZB',
  }
];

export const VideoTestimonials: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null);
  const [playingInlineId, setPlayingInlineId] = useState<string | null>(null);
  const { testimonialVideos } = useStore();

  const displayVideos: VideoTestimonial[] = testimonialVideos && testimonialVideos.length > 0
    ? testimonialVideos.map((v) => ({
        id: v.id,
        name: v.customerName,
        location: v.location,
        headline: v.reviewText,
        duration: '1:30',
        thumbnail: getYouTubeThumbnailUrl(v.videoUrl, v.thumbnail),
        videoUrl: v.videoUrl,
      }))
    : DEFAULT_TESTIMONIAL_VIDEOS.map((v) => ({
        ...v,
        thumbnail: getYouTubeThumbnailUrl(v.videoUrl, v.thumbnail),
      }));

  return (
    <section className="py-20 bg-[var(--brand-primary-deep)] border-t border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-[var(--brand-gold)] font-sans text-xs uppercase tracking-[0.28em] font-bold block">
            Video Testimonials
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-slate-100">
            Hear From Our Global Customers
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            Real unedited stories from customers in Singapore, India, Malaysia, Fiji, and Mauritius.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayVideos.map((item) => {
            const isPlayingInline = playingInlineId === item.id;
            return (
              <div
                key={item.id}
                className="group bg-[var(--brand-primary-dark)] border border-white/10 rounded-2xl overflow-hidden hover:border-[var(--brand-gold)]/80 transition-all duration-300 shadow-xl flex flex-col dark-media-card"
              >
                <div className="relative h-60 sm:h-72 overflow-hidden bg-slate-900">
                  {isPlayingInline ? (
                    <div className="relative w-full h-full">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingInlineId(null);
                        }}
                        className="absolute top-3 right-3 z-20 bg-black/80 text-white hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] p-2 rounded-full transition-colors shadow-lg cursor-pointer"
                        title="Close Video"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <iframe
                        src={getYouTubeEmbedUrl(item.videoUrl)}
                        title={item.name}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <div
                      onClick={() => setPlayingInlineId(item.id)}
                      className="relative w-full h-full cursor-pointer group overflow-hidden"
                    >
                      {/* Fully visible video thumbnail with natural colors */}
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />

                      {/* Small badge top-left */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-black/75 backdrop-blur-md border border-white/15 text-[var(--brand-gold)] text-[10px] font-sans font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 accent">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>Verified Customer</span>
                        </span>
                      </div>

                      {/* Centered Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-amber-300 transition-all duration-300 ring-4 ring-black/40">
                          <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current translate-x-0.5" />
                        </div>
                      </div>

                      {/* Small duration pill bottom-right */}
                      <span className="absolute bottom-3 right-3 z-10 bg-black/80 backdrop-blur-md text-slate-100 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border border-white/15 shadow-md">
                        {item.duration}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3 overlay-content">
                  <div>
                    <div className="flex items-center justify-between text-xs font-sans mb-1">
                      <span className="font-bold">{item.name}</span>
                      <span className="flex items-center gap-1 text-[var(--brand-gold)] accent">
                        <MapPin className="w-3 h-3 accent" />
                        <span>{item.location}</span>
                      </span>
                    </div>

                    <h4
                      onClick={() => setActiveVideo(item)}
                      className="text-sm font-bold font-serif-luxury hover:text-[var(--brand-gold)] transition-colors leading-snug cursor-pointer"
                    >
                      "{item.headline}"
                    </h4>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-3">
                    <div className="flex items-center gap-1 text-[var(--brand-gold)] text-xs font-sans font-semibold accent">
                      <Star className="w-3.5 h-3.5 fill-current accent" />
                      <span>5.0 Verified Review</span>
                    </div>

                    <button
                      onClick={() => setActiveVideo(item)}
                      className="text-[11px] font-sans text-slate-300 hover:text-[var(--brand-gold)] underline font-medium"
                    >
                      Pop-out Modal
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden border border-[var(--brand-gold)]/40 shadow-2xl">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] transition-all flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-4 bg-[var(--brand-primary-deep)] border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-serif-luxury">{activeVideo.name} ({activeVideo.location})</h3>
                <p className="text-[11px] text-[var(--brand-gold)]">Verified Customer Story</p>
              </div>
              <a
                href={activeVideo.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-sans font-bold text-[var(--brand-gold)] hover:text-white bg-black/40 border border-[var(--brand-gold)]/40 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
              >
                <span>Watch on YouTube</span>
              </a>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                src={getYouTubeEmbedUrl(activeVideo.videoUrl)}
                title={activeVideo.name}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
