import React from 'react';
import { GlobalClientStoryVideo } from '../../types/store';
import { Play } from 'lucide-react';

interface GlobalClientVideoPlayerProps {
  video: GlobalClientStoryVideo;
  className?: string;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return `https://www.youtube-nocookie.com/embed/${match[2]}?rel=0&modestbranding=1`;
  }
  if (trimmed.includes('/embed/')) {
    return trimmed;
  }
  return null;
}

export function getVimeoEmbedUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /(?:vimeo)\.com.*(?:videos\/|groups\/[^\/]*\/videos\/|channels\/[^\/]*\/|video\/)?(\d+)/;
  const match = trimmed.match(regExp);
  if (match && match[1]) {
    return `https://player.vimeo.com/video/${match[1]}?dnt=1`;
  }
  if (trimmed.includes('player.vimeo.com')) {
    return trimmed;
  }
  return null;
}

export const GlobalClientVideoPlayer: React.FC<GlobalClientVideoPlayerProps> = ({ video, className = '' }) => {
  if (!video || !video.url) return null;

  const rawType = (video.type || '').toLowerCase();
  const isYouTube = rawType === 'youtube' || video.url.includes('youtube.com') || video.url.includes('youtu.be');
  const isVimeo = rawType === 'vimeo' || video.url.includes('vimeo.com');

  const ytEmbed = isYouTube ? getYouTubeEmbedUrl(video.url) : null;
  const vimeoEmbed = isVimeo ? getVimeoEmbedUrl(video.url) : null;
  const posterUrl = video.thumbnail || video.thumbnailUrl;

  return (
    <div className={`overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--brand-primary-dark)] shadow-lg ${className}`}>
      {video.title && (
        <div className="px-4 py-3 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center gap-2">
          <Play className="w-4 h-4 text-[var(--brand-gold)] fill-[var(--brand-gold)]" />
          <h4 className="text-sm font-semibold text-[var(--color-heading)] truncate">{video.title}</h4>
        </div>
      )}

      <div className="relative aspect-video w-full bg-black/40">
        {ytEmbed ? (
          <iframe
            src={ytEmbed}
            title={video.title || 'Client Story Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : vimeoEmbed ? (
          <iframe
            src={vimeoEmbed}
            title={video.title || 'Client Story Video'}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <video
            src={video.url}
            controls
            playsInline
            preload="metadata"
            poster={posterUrl}
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {video.caption && (
        <div className="px-4 py-2.5 bg-[var(--color-surface)] border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] italic">
          {video.caption}
        </div>
      )}
    </div>
  );
};
