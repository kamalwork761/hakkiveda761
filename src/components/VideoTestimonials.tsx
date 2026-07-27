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
  if (url.includes('youtube.com/embed/')) return url;

  const videoId = extractYouTubeId(url);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  }
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
    <section className="py-20 bg-[#072a20] border-t border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-[#C8A24A] font-sans text-xs uppercase tracking-[0.28em] font-bold block">
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
          {displayVideos.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveVideo(item)}
              className="group bg-[#0B3D2E] border border-white/10 rounded-2xl overflow-hidden hover:border-[#C8A24A]/60 transition-all cursor-pointer shadow-xl flex flex-col"
            >
              <div className="relative h-56 overflow-hidden bg-black/40">
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D2E] via-transparent to-black/30"></div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#C8A24A] text-[#0B3D2E] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all">
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  </div>
                </div>

                <span className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-sans font-bold px-2.5 py-1 rounded-full">
                  {item.duration}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-300 font-sans mb-1">
                    <span className="font-bold text-slate-100">{item.name}</span>
                    <span className="flex items-center gap-1 text-[#C8A24A]">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location}</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-bold font-serif-luxury text-slate-100 group-hover:text-[#C8A24A] transition-colors leading-snug">
                    "{item.headline}"
                  </h4>
                </div>

                <div className="flex items-center gap-1 text-[#C8A24A] text-xs font-sans font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>5.0 Verified Video Review</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden border border-[#C8A24A]/40 shadow-2xl">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-[#C8A24A] hover:text-[#0B3D2E] transition-all flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-4 bg-[#072a20] border-b border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 font-serif-luxury">{activeVideo.name} ({activeVideo.location})</h3>
              <span className="text-xs text-[#C8A24A]">Verified Story</span>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                src={getYouTubeEmbedUrl(activeVideo.videoUrl)}
                title={activeVideo.name}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
