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

export interface SoundConfig {
  enabled: boolean;
  volume: number; // Default 0.35 (35% for UI clicks)
  pack: SoundPackId;
  adminMuted: boolean; // Master override from Admin Dashboard
  audioFiles?: Record<SoundType, string>;
}

export const DEFAULT_SOUND_CONFIG: SoundConfig = {
  enabled: true,
  volume: 0.35, // 35% default volume for UI clicks
  pack: 'luxury_ayurveda',
  adminMuted: false,
};

