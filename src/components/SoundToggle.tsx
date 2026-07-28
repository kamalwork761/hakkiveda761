import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface SoundToggleProps {
  variant?: 'header' | 'footer' | 'admin' | 'compact' | 'pill';
  showLabel?: boolean;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({
  variant = 'header',
  showLabel = false,
}) => {
  const { soundEnabled, toggleSound, adminMutedSound, soundVolume } = useStore();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSound();
  };

  const isMuted = !soundEnabled || adminMutedSound || soundVolume === 0;

  if (variant === 'pill') {
    return (
      <button
        onClick={handleToggle}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-300 ${
          !isMuted
            ? 'bg-[var(--brand-gold)]/20 border-[var(--brand-gold)] text-[var(--brand-gold)] shadow-[0_0_12px_rgba(200,162,74,0.25)]'
            : 'bg-black/40 border-white/20 text-slate-400 hover:text-white'
        }`}
        title={isMuted ? 'Unmute HAKKIVEDA Sound System' : 'Mute Sound System'}
      >
        {!isMuted ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-[var(--brand-gold)] animate-pulse" />
            <span>Sound ON</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            <span>Sound OFF</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'footer') {
    return (
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-[var(--brand-gold)] transition-colors py-1 px-2 rounded-lg hover:bg-white/5"
      >
        {!isMuted ? (
          <>
            <Volume2 className="w-4 h-4 text-[var(--brand-gold)]" />
            <span>Audio: ON</span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-slate-400" />
            <span>Audio: OFF</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'admin') {
    return (
      <button
        onClick={handleToggle}
        className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
          !isMuted
            ? 'bg-[var(--brand-primary-dark)] border-[var(--brand-gold)] text-[var(--brand-gold)] shadow-md'
            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
        }`}
      >
        {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        <span>{isMuted ? 'Muted' : 'Sound Active'}</span>
      </button>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={handleToggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`p-2 rounded-full border transition-all duration-300 flex items-center justify-center relative ${
          !isMuted
            ? 'bg-[var(--brand-primary-dark)]/80 border-[var(--brand-gold)]/60 text-[var(--brand-gold)] hover:border-[var(--brand-gold)] hover:bg-[var(--brand-primary-dark)] shadow-[0_0_10px_rgba(200,162,74,0.2)]'
            : 'bg-black/30 border-white/10 text-slate-400 hover:text-white hover:border-white/30'
        }`}
        aria-label={isMuted ? 'Enable Sound Effects' : 'Mute Sound Effects'}
      >
        {!isMuted ? (
          <Volume2 className="w-4 h-4 text-[var(--brand-gold)]" />
        ) : (
          <VolumeX className="w-4 h-4 text-slate-400" />
        )}
        {showLabel && (
          <span className="text-[11px] font-bold uppercase tracking-wider ml-1.5 hidden sm:inline">
            {!isMuted ? 'Sound' : 'Muted'}
          </span>
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 bg-black/90 text-white text-[10px] font-bold rounded shadow-lg border border-[var(--brand-gold)]/30 whitespace-nowrap z-50 animate-in fade-in duration-200">
          {!isMuted ? 'Acoustic Sound: ON' : 'Acoustic Sound: OFF'}
        </div>
      )}
    </div>
  );
};
