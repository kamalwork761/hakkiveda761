export type SoundType =
  | 'nav_click'
  | 'cta_click'
  | 'add_to_cart'
  | 'wishlist'
  | 'search'
  | 'country_select'
  | 'menu_toggle'
  | 'toggle_switch'
  | 'form_submit'
  | 'order_success'
  | 'error_warning';

export type SoundPackId = 'luxury_ayurveda' | 'crystal_zen' | 'subtle_wood';

export interface SoundPack {
  id: SoundPackId;
  name: string;
  description: string;
  basePitchMultiplier: number;
}

export const SOUND_PACKS: SoundPack[] = [
  {
    id: 'luxury_ayurveda',
    name: 'Luxury Ayurveda (Warm Wood & Crystal)',
    description: 'Organic warm wooden resonances with soft crystal harmonic chimes.',
    basePitchMultiplier: 1.0,
  },
  {
    id: 'crystal_zen',
    name: 'Crystal Zen (Pure Harmonic Glass)',
    description: 'Higher frequency, shimmering glassy overtones with silky decays.',
    basePitchMultiplier: 1.18,
  },
  {
    id: 'subtle_wood',
    name: 'Subtle Wood (Deep Forest Timber)',
    description: 'Deep, muted earthy timber clicks and soft organic bass tones.',
    basePitchMultiplier: 0.85,
  },
];

export type AmbientPresetId = 'nilgiri_forest' | 'ayurvedic_garden' | 'monsoon_rain';

export interface AmbientPreset {
  id: AmbientPresetId;
  name: string;
  description: string;
  icon: string;
}

export const AMBIENT_PRESETS: AmbientPreset[] = [
  {
    id: 'nilgiri_forest',
    name: 'Nilgiri Forest & River Stream',
    description: 'Flowing forest stream, gentle breeze, periodic bird chirps, and warm Ayurvedic drone.',
    icon: '🌲',
  },
  {
    id: 'ayurvedic_garden',
    name: 'Ayurvedic Herbal Garden & Drone',
    description: 'Soothing Tanpura meditation frequencies with soft bamboo wind resonance.',
    icon: '🍃',
  },
  {
    id: 'monsoon_rain',
    name: 'Western Ghats Monsoon & Rain',
    description: 'Calm herbal rainfall soundscape with subtle sanctuary temple bell notes.',
    icon: '🌧️',
  },
];

export interface SoundConfig {
  enabled: boolean;
  volume: number; // Default 0.20 (20%)
  pack: SoundPackId;
  adminMuted: boolean; // Master override from Admin Dashboard
  ambientEnabled: boolean; // Nature continuous background ambience
  ambientVolume: number; // Default 0.15 (15% background level)
  ambientPreset: AmbientPresetId;
  audioFiles?: Record<SoundType, string>;
}

export const DEFAULT_SOUND_CONFIG: SoundConfig = {
  enabled: true,
  volume: 0.35, // 35% default volume for UI clicks
  pack: 'luxury_ayurveda',
  adminMuted: false,
  ambientEnabled: true, // Enabled out of the box so forest music starts on first click/interaction
  ambientVolume: 0.25, // Rich 25% continuous background level
  ambientPreset: 'nilgiri_forest',
};
