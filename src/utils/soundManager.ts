import { SoundType, SoundPackId, SOUND_PACKS, DEFAULT_SOUND_CONFIG } from '../config/soundConfig';

const LOCAL_STORAGE_KEY_ENABLED = 'hakkiveda_sound_enabled';
const LOCAL_STORAGE_KEY_VOLUME = 'hakkiveda_sound_volume';
const LOCAL_STORAGE_KEY_PACK = 'hakkiveda_sound_pack';
const LOCAL_STORAGE_KEY_ADMIN_MUTED = 'hakkiveda_sound_admin_muted';

class SoundManager {
  private audioCtx: AudioContext | null = null;
  private isUnlocked: boolean = false;
  private enabled: boolean = true;
  private volume: number = 0.35; // Default volume for UI interaction sounds
  private pack: SoundPackId = 'luxury_ayurveda';
  private adminMuted: boolean = false;
  private listenersAttached: boolean = false;

  constructor() {
    this.loadSettings();
    if (typeof window !== 'undefined') {
      this.attachUnlockListeners();
    }
  }

  private loadSettings() {
    if (typeof window === 'undefined') return;

    try {
      const storedEnabled = localStorage.getItem(LOCAL_STORAGE_KEY_ENABLED);
      if (storedEnabled !== null) {
        this.enabled = storedEnabled === 'true';
      } else {
        this.enabled = DEFAULT_SOUND_CONFIG.enabled;
      }

      const storedVolume = localStorage.getItem(LOCAL_STORAGE_KEY_VOLUME);
      if (storedVolume !== null) {
        const parsed = parseFloat(storedVolume);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          this.volume = parsed;
        }
      } else {
        this.volume = DEFAULT_SOUND_CONFIG.volume;
      }

      const storedPack = localStorage.getItem(LOCAL_STORAGE_KEY_PACK) as SoundPackId;
      if (storedPack && SOUND_PACKS.some((p) => p.id === storedPack)) {
        this.pack = storedPack;
      } else {
        this.pack = DEFAULT_SOUND_CONFIG.pack;
      }

      const storedAdminMuted = localStorage.getItem(LOCAL_STORAGE_KEY_ADMIN_MUTED);
      if (storedAdminMuted !== null) {
        this.adminMuted = storedAdminMuted === 'true';
      }
    } catch (e) {
      console.warn('Error reading sound settings from localStorage:', e);
    }
  }

  private saveSettings() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ENABLED, String(this.enabled));
      localStorage.setItem(LOCAL_STORAGE_KEY_VOLUME, String(this.volume));
      localStorage.setItem(LOCAL_STORAGE_KEY_PACK, this.pack);
      localStorage.setItem(LOCAL_STORAGE_KEY_ADMIN_MUTED, String(this.adminMuted));
    } catch (e) {
      console.warn('Error saving sound settings to localStorage:', e);
    }
  }

  private attachUnlockListeners() {
    if (this.listenersAttached) return;
    const unlock = () => {
      this.ensureAudioUnlocked();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('pointerdown', unlock, { once: true });
      window.addEventListener('click', unlock, { once: true });
      window.addEventListener('touchstart', unlock, { once: true });
      window.addEventListener('keydown', unlock, { once: true });
      this.listenersAttached = true;
    }
  }

  public ensureAudioUnlocked() {
    this.initAudioContext();
    if (this.audioCtx) {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch((e) => console.warn('AudioContext resume error:', e));
      }
      this.isUnlocked = true;
    }
  }

  private initAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  // Public Getters and Setters
  public isEnabled(): boolean {
    return this.enabled && !this.adminMuted;
  }

  public setEnabled(value: boolean) {
    this.enabled = value;
    this.saveSettings();
  }

  public toggleEnabled(): boolean {
    this.enabled = !this.enabled;
    this.saveSettings();
    if (this.enabled) {
      this.play('toggle_switch');
    }
    return this.enabled;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.saveSettings();
  }

  public getPack(): SoundPackId {
    return this.pack;
  }

  public setPack(packId: SoundPackId) {
    this.pack = packId;
    this.saveSettings();
    this.play('cta_click');
  }

  public isAdminMuted(): boolean {
    return this.adminMuted;
  }

  public setAdminMuted(value: boolean) {
    this.adminMuted = value;
    this.saveSettings();
  }

  // Master Play Method for UI Interaction Sounds
  public play(type: SoundType) {
    if (!this.enabled || this.adminMuted || this.volume <= 0) return;

    this.initAudioContext();
    if (!this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    const currentPack = SOUND_PACKS.find((p) => p.id === this.pack) || SOUND_PACKS[0];
    const pitchMul = currentPack.basePitchMultiplier || 1.0;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Master gain node applying configured UI volume
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);
    masterGain.connect(ctx.destination);

    switch (type) {
      case 'nav_click':
        this.playSoftWoodenClick(ctx, masterGain, now, pitchMul);
        break;
      case 'cta_click':
        this.playCrystalChime(ctx, masterGain, now, pitchMul);
        break;
      case 'add_to_cart':
        this.playAddToCartChime(ctx, masterGain, now, pitchMul);
        break;
      case 'wishlist':
        this.playWishlistSparkle(ctx, masterGain, now, pitchMul);
        break;
      case 'search':
        this.playSoftPop(ctx, masterGain, now, pitchMul);
        break;
      case 'country_select':
        this.playElegantTick(ctx, masterGain, now, pitchMul);
        break;
      case 'menu_toggle':
        this.playSoftSlide(ctx, masterGain, now, pitchMul);
        break;
      case 'toggle_switch':
        this.playGentleClick(ctx, masterGain, now, pitchMul);
        break;
      case 'form_submit':
        this.playConfirmationTone(ctx, masterGain, now, pitchMul);
        break;
      case 'order_success':
        this.playOrderSuccessSound(ctx, masterGain, now, pitchMul);
        break;
      case 'error_warning':
        this.playSoftMutedWarning(ctx, masterGain, now, pitchMul);
        break;
    }
  }

  // 1. Soft Wooden Click (Nav buttons)
  private playSoftWoodenClick(ctx: AudioContext, destination: GainNode, now: number, pitchMul: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260 * pitchMul, now);
    osc.frequency.exponentialRampToValueAtTime(160 * pitchMul, now + 0.045);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // 2. CTA Buttons (Shop Now, AI Hair Quiz) - Elegant Crystal Chime
  private playCrystalChime(ctx: AudioContext, destination: GainNode, now: number, pitchMul: number) {
    const freqs = [1318 * pitchMul, 2637 * pitchMul]; // E6 & E7 glass harmonics
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.012);

      const level = idx === 0 ? 0.35 : 0.18;
      gain.gain.setValueAtTime(level, now + idx * 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc.connect(gain);
      gain.connect(destination);

      osc.start(now + idx * 0.012);
      osc.stop(now + 0.3);
    });
  }

  // 3. Add to Cart - Soft Success Chime (Pentatonic Arpeggio)
  private playAddToCartChime(ctx: AudioContext, destination: GainNode, now: number, pitchMul: number) {
    const notes = [784, 987, 1174]; // G5, B5, D6
    notes.forEach((freq, i) => {
      const startTime = now + i * 0.028;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * pitchMul, startTime);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

      osc.connect(gain);
      gain.connect(destination);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }

  // 4. Wishlist - Gentle Sparkle
  private playWishlistSparkle(ctx: AudioContext, destination: GainNode, now: number, pitchMul: number) {
    const notes = [880, 1108, 1318, 1661]; // A5, C#6, E6, G#6
    notes.forEach((freq, i) => {
      const startTime = now + i * 0.02;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * pitchMul, startTime);

      gain.gain.setValueAtTime(0.22, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

      osc.connect(gain);
      gain.connect(destination);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  // 5. Search - Soft Pop
  private playSoftPop(ctx: AudioContext, destination: GainNode, now: number, pitchMul: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220 * pitchMul, now);
    osc.frequency.exponentialRampToValueAtTime(580 * pitchMul, now + 0.035);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, now);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(filter);
    filter.connect(destination);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  // 6. Country Selection - Elegant Tick
  private playElegantTick(ctx: AudioContext, destination: GainNode, now: number, pitchMul: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1800 * pitchMul, now);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, now);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    osc.start(now);
    osc.stop(now + 0.02);
  }

  // 7. Menu Open / Close - Soft Slide Sound
  private playSoftSlide(ctx: AudioContext, destination: GainNode, now: number, pitchMul: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220 * pitchMul, now);
    osc.frequency.exponentialRampToValueAtTime(360 * pitchMul, now + 0.08);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // 8. Toggle Switches - Gentle Click
  private playGentleClick(ctx: AudioContext, destination: GainNode, now: number, pitchMul: number) {
    // High click
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(800 * pitchMul, now);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    osc1.connect(gain1);
    gain1.connect(destination);
    osc1.start(now);
    osc1.stop(now + 0.025);

    // Low thud 10ms later
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(320 * pitchMul, now + 0.01);
    gain2.gain.setValueAtTime(0.2, now + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc2.connect(gain2);
    gain2.connect(destination);
    osc2.start(now + 0.01);
    osc2.stop(now + 0.035);
  }

  // 9. Form Submission - Smooth Confirmation Tone
  private playConfirmationTone(ctx: AudioContext, destination: GainNode, now: number, pitchMul: number) {
    const chord1 = [349, 523]; // F4, C5
    const chord2 = [440, 698]; // A4, F5

    chord1.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * pitchMul, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(destination);
      osc.start(now);
      osc.stop(now + 0.16);
    });

    chord2.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * pitchMul, now + 0.1);
      gain.gain.setValueAtTime(0.25, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc.connect(gain);
      gain.connect(destination);
      osc.start(now + 0.1);
      osc.stop(now + 0.35);
    });
  }

  // 10. Order Placed Successfully - Premium Success Sound
  private playOrderSuccessSound(ctx: AudioContext, destination: GainNode, now: number, pitchMul: number) {
    const notes = [
      { freq: 293, time: 0 },
      { freq: 370, time: 0.08 },
      { freq: 440, time: 0.16 },
      { freq: 587, time: 0.24 },
    ]; // D4, F#4, A4, D5

    notes.forEach((item) => {
      const startTime = now + item.time;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(item.freq * pitchMul, startTime);

      const maxGain = item.time === 0.24 ? 0.35 : 0.22;
      gain.gain.setValueAtTime(maxGain, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.5);

      osc.connect(gain);
      gain.connect(destination);

      osc.start(startTime);
      osc.stop(startTime + 0.55);
    });
  }

  // 11. Error or Invalid Action - Soft Muted Warning Tone
  private playSoftMutedWarning(ctx: AudioContext, destination: GainNode, now: number, pitchMul: number) {
    const freqs = [210 * pitchMul, 180 * pitchMul];
    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(480, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(destination);

      osc.start(now);
      osc.stop(now + 0.13);
    });
  }
}

export const soundManager = new SoundManager();
