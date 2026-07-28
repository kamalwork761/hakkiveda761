import React, { useState, useEffect } from 'react';
import { Trees, Volume2, VolumeX, Radio, Sparkles, ChevronUp, ChevronDown, Music, Play } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AMBIENT_PRESETS } from '../config/soundConfig';
import { soundManager } from '../utils/soundManager';

export const AmbientSoundControl: React.FC = () => {
  const {
    ambientEnabled,
    ambientVolume,
    ambientPreset,
    toggleAmbient,
    setAmbientVolume,
    setAmbientPreset,
    adminMutedSound,
    playSound,
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleGesture = () => {
      soundManager.ensureAudioUnlocked();
      setHasInteracted(true);
    };

    window.addEventListener('click', handleGesture);
    window.addEventListener('touchstart', handleGesture);
    window.addEventListener('mousemove', handleGesture);
    window.addEventListener('pointermove', handleGesture);
    window.addEventListener('scroll', handleGesture);
    window.addEventListener('keydown', handleGesture);
    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('mousemove', handleGesture);
      window.removeEventListener('pointermove', handleGesture);
      window.removeEventListener('scroll', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, []);

  const activePreset = AMBIENT_PRESETS.find((p) => p.id === ambientPreset) || AMBIENT_PRESETS[0];
  const isPlaying = ambientEnabled && !adminMutedSound;

  const handleToggle = () => {
    soundManager.ensureAudioUnlocked();
    toggleAmbient();
    setHasInteracted(true);
  };

  return (
    <>
      {/* Top Welcome Tap Banner for Audio Autoplay Permission */}
      {!hasInteracted && !isPlaying && (
        <div
          onClick={() => {
            soundManager.ensureAudioUnlocked();
            if (!ambientEnabled) toggleAmbient();
            setHasInteracted(true);
          }}
          className="fixed top-0 left-0 right-0 z-50 bg-[var(--brand-primary-dark)] border-b border-[var(--brand-gold)]/60 py-2.5 px-4 text-center cursor-pointer shadow-lg hover:bg-[#083024] transition-all group"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-xs text-slate-100 font-medium">
            <Trees className="w-4 h-4 text-[var(--brand-gold)] animate-pulse" />
            <span>
              Tap anywhere or click here to enable <strong className="text-[var(--brand-gold)]">HAKKIVEDA Ayurvedic Forest & Nature Music</strong> 🌲
            </span>
            <span className="inline-flex items-center gap-1 bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-2.5 py-0.5 rounded-full text-[10px] font-bold ml-2 group-hover:scale-105 transition-transform">
              <Play className="w-3 h-3 fill-current" /> Play Nature Sound
            </span>
          </div>
        </div>
      )}

      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40">
        {/* Popover Menu */}
        {isOpen && (
          <div className="mb-3 w-72 bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/50 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between border-b border-[var(--brand-gold)]/20 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Trees className="w-4 h-4 text-[var(--brand-gold)] animate-pulse" />
                <span className="text-xs font-bold font-serif-luxury text-[var(--brand-gold)] tracking-wider uppercase">
                  Ayurvedic Forest Soundscape
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
              Continuous synthesized nature ambience recorded from Nilgiri & Western Ghats rainforests.
            </p>

            {/* Toggle Button */}
            <button
              onClick={handleToggle}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all mb-4 ${
                isPlaying
                  ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow-md shadow-[var(--brand-gold)]/20'
                  : 'bg-black/40 border border-white/20 text-slate-300 hover:text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <Volume2 className="w-4 h-4 animate-bounce" />
                  <span>Forest Ambience: ACTIVE</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span>Play Forest Ambience</span>
                </>
              )}
            </button>

            {/* Sound Preset Picker */}
            <div className="space-y-2 mb-4">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-gold)] block">
                Nature Soundscape Profile
              </label>
              <div className="space-y-1.5">
                {AMBIENT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      soundManager.ensureAudioUnlocked();
                      playSound('nav_click');
                      setAmbientPreset(preset.id);
                    }}
                    className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-start gap-2.5 border ${
                      ambientPreset === preset.id
                        ? 'bg-[var(--brand-primary-deep)] border-[var(--brand-gold)] text-[var(--brand-gold)]'
                        : 'bg-black/20 border-white/10 text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-base leading-none">{preset.icon}</span>
                    <div>
                      <div className="font-bold text-[11px]">{preset.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal line-clamp-1">
                        {preset.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Volume Control */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-semibold text-slate-300">
                <span>Nature Volume</span>
                <span className="text-[var(--brand-gold)] font-mono">{Math.round(ambientVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.01"
                value={ambientVolume}
                onChange={(e) => {
                  soundManager.ensureAudioUnlocked();
                  setAmbientVolume(parseFloat(e.target.value));
                }}
                className="w-full accent-[var(--brand-gold)] bg-black/40 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Floating Trigger Badge */}
        <button
          onClick={() => {
            soundManager.ensureAudioUnlocked();
            if (!isOpen && !isPlaying) {
              toggleAmbient();
            }
            setIsOpen(!isOpen);
            setHasInteracted(true);
          }}
          className={`group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full border shadow-2xl transition-all duration-300 ${
            isPlaying
              ? 'bg-[var(--brand-primary-dark)] border-[var(--brand-gold)] text-[var(--brand-gold)] shadow-[0_0_20px_rgba(200,162,74,0.35)] ring-2 ring-[var(--brand-gold)]/30'
              : 'bg-black/70 border-white/20 text-slate-300 hover:text-white hover:border-[var(--brand-gold)]/50 backdrop-blur-md'
          }`}
          title="Continuous Nature & Forest Music"
        >
          <div className="relative flex items-center justify-center">
            <Trees
              className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                isPlaying ? 'text-[var(--brand-gold)] animate-pulse' : 'text-slate-400'
              }`}
            />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--brand-gold)] animate-ping" />
            )}
          </div>

          <div className="flex items-center gap-1.5 text-left text-xs font-bold tracking-wider uppercase">
            <span className="hidden sm:inline">
              {isPlaying ? activePreset.name.split(' ')[0] + ' Sound' : 'Forest Sound'}
            </span>
            <span className="sm:hidden">{isPlaying ? 'Nature' : 'Sound'}</span>
            {isOpen ? <ChevronDown className="w-3.5 h-3.5 opacity-70" /> : <ChevronUp className="w-3.5 h-3.5 opacity-70" />}
          </div>
        </button>
      </div>
    </>
  );
};
