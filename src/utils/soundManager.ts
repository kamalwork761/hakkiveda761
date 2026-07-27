import { SoundType, SoundPackId, SOUND_PACKS, DEFAULT_SOUND_CONFIG, AmbientPresetId, AMBIENT_PRESETS } from '../config/soundConfig';

const LOCAL_STORAGE_KEY_ENABLED = 'hakkiveda_sound_enabled';
const LOCAL_STORAGE_KEY_VOLUME = 'hakkiveda_sound_volume';
const LOCAL_STORAGE_KEY_PACK = 'hakkiveda_sound_pack';
const LOCAL_STORAGE_KEY_ADMIN_MUTED = 'hakkiveda_sound_admin_muted';
const LOCAL_STORAGE_KEY_AMBIENT_ENABLED = 'hakkiveda_ambient_enabled';
const LOCAL_STORAGE_KEY_AMBIENT_VOLUME = 'hakkiveda_ambient_volume';
const LOCAL_STORAGE_KEY_AMBIENT_PRESET = 'hakkiveda_ambient_preset';

class SoundManager {
  private audioCtx: AudioContext | null = null;
  private isUnlocked: boolean = false;
  private enabled: boolean = true;
  private volume: number = 0.20; // 20% default volume (15-25% range)
  private pack: SoundPackId = 'luxury_ayurveda';
  private adminMuted: boolean = false;
  private listenersAttached: boolean = false;

  // Ambient Sound Engine State
  private ambientEnabled: boolean = false;
  private ambientVolume: number = 0.15; // 15% default continuous background
  private ambientPreset: AmbientPresetId = 'nilgiri_forest';
  private ambientGainNode: GainNode | null = null;
  private ambientNodes: (AudioNode | number)[] = []; // Stores active osc/source nodes/intervals
  private birdTimer: any = null;

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

      const storedAmbientEnabled = localStorage.getItem(LOCAL_STORAGE_KEY_AMBIENT_ENABLED);
      if (storedAmbientEnabled !== null) {
        this.ambientEnabled = storedAmbientEnabled === 'true';
      }

      const storedAmbientVol = localStorage.getItem(LOCAL_STORAGE_KEY_AMBIENT_VOLUME);
      if (storedAmbientVol !== null) {
        const parsedVol = parseFloat(storedAmbientVol);
        if (!isNaN(parsedVol) && parsedVol >= 0 && parsedVol <= 1) {
          this.ambientVolume = parsedVol;
        }
      }

      const storedAmbientPreset = localStorage.getItem(LOCAL_STORAGE_KEY_AMBIENT_PRESET) as AmbientPresetId;
      if (storedAmbientPreset && AMBIENT_PRESETS.some((p) => p.id === storedAmbientPreset)) {
        this.ambientPreset = storedAmbientPreset;
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
      localStorage.setItem(LOCAL_STORAGE_KEY_AMBIENT_ENABLED, String(this.ambientEnabled));
      localStorage.setItem(LOCAL_STORAGE_KEY_AMBIENT_VOLUME, String(this.ambientVolume));
      localStorage.setItem(LOCAL_STORAGE_KEY_AMBIENT_PRESET, this.ambientPreset);
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
      window.addEventListener('pointerdown', unlock);
      window.addEventListener('pointermove', unlock);
      window.addEventListener('mousemove', unlock);
      window.addEventListener('click', unlock);
      window.addEventListener('touchstart', unlock);
      window.addEventListener('scroll', unlock);
      window.addEventListener('keydown', unlock);
      window.addEventListener('mouseenter', unlock);
      this.listenersAttached = true;

      // Periodic check if suspended until unlocked
      const checkTimer = setInterval(() => {
        if (this.audioCtx && this.audioCtx.state === 'running' && this.isUnlocked) {
          clearInterval(checkTimer);
        } else {
          this.ensureAudioUnlocked();
        }
      }, 2000);
    }
  }

  public ensureAudioUnlocked() {
    this.initAudioContext();
    if (this.audioCtx) {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch((e) => console.warn('AudioContext resume error:', e));
      }
      this.isUnlocked = true;
      if (this.ambientEnabled && !this.adminMuted) {
        if (!this.ambientGainNode) {
          this.startAmbientEngine();
        }
      }
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
    if (this.adminMuted) {
      this.stopAmbientEngine();
    } else if (this.ambientEnabled) {
      this.startAmbientEngine();
    }
  }

  // Continuous Ambient Nature Sound System
  public isAmbientEnabled(): boolean {
    return this.ambientEnabled && !this.adminMuted;
  }

  public setAmbientEnabled(value: boolean) {
    this.ambientEnabled = value;
    this.saveSettings();
    if (this.ambientEnabled && !this.adminMuted) {
      this.startAmbientEngine();
    } else {
      this.stopAmbientEngine();
    }
  }

  public toggleAmbient(): boolean {
    const next = !this.ambientEnabled;
    this.setAmbientEnabled(next);
    if (next) {
      this.play('cta_click');
    }
    return next;
  }

  public getAmbientVolume(): number {
    return this.ambientVolume;
  }

  public setAmbientVolume(vol: number) {
    this.ambientVolume = Math.max(0, Math.min(1, vol));
    this.saveSettings();
    if (this.ambientGainNode && this.audioCtx) {
      this.ambientGainNode.gain.linearRampToValueAtTime(
        this.ambientVolume,
        this.audioCtx.currentTime + 0.1
      );
    }
  }

  public getAmbientPreset(): AmbientPresetId {
    return this.ambientPreset;
  }

  public setAmbientPreset(preset: AmbientPresetId) {
    this.ambientPreset = preset;
    this.saveSettings();
    if (this.ambientEnabled && !this.adminMuted) {
      this.startAmbientEngine();
    }
  }

  public startAmbientEngine() {
    this.stopAmbientEngine(); // Clear existing

    this.initAudioContext();
    if (!this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Master Ambient Gain Node
    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0.001, now);
    mainGain.gain.linearRampToValueAtTime(this.ambientVolume, now + 1.5); // Smooth 1.5s fade in
    mainGain.connect(ctx.destination);
    this.ambientGainNode = mainGain;

    if (this.ambientPreset === 'nilgiri_forest') {
      this.buildNilgiriForestSoundscape(ctx, mainGain);
    } else if (this.ambientPreset === 'ayurvedic_garden') {
      this.buildAyurvedicGardenSoundscape(ctx, mainGain);
    } else if (this.ambientPreset === 'monsoon_rain') {
      this.buildMonsoonRainSoundscape(ctx, mainGain);
    }
  }

  public stopAmbientEngine() {
    if (this.birdTimer) {
      clearInterval(this.birdTimer);
      this.birdTimer = null;
    }

    if (this.ambientGainNode && this.audioCtx) {
      try {
        const now = this.audioCtx.currentTime;
        this.ambientGainNode.gain.linearRampToValueAtTime(0.0001, now + 0.5);
      } catch (e) {}
    }

    setTimeout(() => {
      this.ambientNodes.forEach((node) => {
        try {
          if (typeof node === 'number') {
            clearInterval(node);
          } else if ('stop' in node && typeof (node as any).stop === 'function') {
            (node as any).stop();
          } else if ('disconnect' in node) {
            (node as any).disconnect();
          }
        } catch (e) {}
      });
      this.ambientNodes = [];
      this.ambientGainNode = null;
    }, 600);
  }

  // 1. Nilgiri Forest & Sacred River Soundscape (Pure Music: C# Tanpura Drone + Bansuri Flute + Gentle Water Sine Waves + Bird Chirps)
  private buildNilgiriForestSoundscape(ctx: AudioContext, destination: GainNode) {
    const now = ctx.currentTime;

    // A. Gentle Water Stream Ripple using Smooth Dual Sine Osc LFO Modulation (Zero Static Noise)
    const streamOsc1 = ctx.createOscillator();
    const streamOsc2 = ctx.createOscillator();
    const streamGain = ctx.createGain();

    streamOsc1.type = 'sine';
    streamOsc2.type = 'sine';
    streamOsc1.frequency.setValueAtTime(174.61, now); // F3 soft harmonic
    streamOsc2.frequency.setValueAtTime(261.63, now); // C4 soft harmonic

    // LFO for slow undulating stream ripple motion
    const streamLfo = ctx.createOscillator();
    streamLfo.frequency.setValueAtTime(0.18, now); // 0.18 Hz slow wave
    const streamLfoGain = ctx.createGain();
    streamLfoGain.gain.setValueAtTime(0.04, now);

    streamLfo.connect(streamLfoGain);
    streamLfoGain.connect(streamGain.gain);

    streamGain.gain.setValueAtTime(0.08, now);

    streamOsc1.connect(streamGain);
    streamOsc2.connect(streamGain);
    streamGain.connect(destination);

    streamOsc1.start(now);
    streamOsc2.start(now);
    streamLfo.start(now);

    this.ambientNodes.push(streamOsc1 as any, streamOsc2 as any, streamLfo as any, streamGain as any);

    // B. Deep Warm Ayurvedic Tanpura C# Drone (138.59 Hz C#3 + 207.65 Hz G#3 + 277.18 Hz C#4)
    const droneFreqs = [138.59, 207.65, 277.18, 415.30];
    droneFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const dGain = ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      const vol = idx === 0 ? 0.25 : 0.10;
      dGain.gain.setValueAtTime(vol, now);

      osc.connect(dGain);
      dGain.connect(destination);

      osc.start(now);
      this.ambientNodes.push(osc as any, dGain as any);
    });

    // C. Periodic Nilgiri Forest Bird Calls
    const playBirdCall = () => {
      if (!this.ambientEnabled || this.adminMuted || !this.audioCtx) return;
      const bCtx = this.audioCtx;
      const bNow = bCtx.currentTime;

      const birdOsc = bCtx.createOscillator();
      const birdGain = bCtx.createGain();

      birdOsc.type = 'sine';
      const startF = 2400 + Math.random() * 600;
      birdOsc.frequency.setValueAtTime(startF, bNow);
      birdOsc.frequency.exponentialRampToValueAtTime(startF + 800, bNow + 0.08);
      birdOsc.frequency.exponentialRampToValueAtTime(startF - 300, bNow + 0.18);

      birdGain.gain.setValueAtTime(0.001, bNow);
      birdGain.gain.linearRampToValueAtTime(0.18, bNow + 0.05);
      birdGain.gain.exponentialRampToValueAtTime(0.0001, bNow + 0.22);

      birdOsc.connect(birdGain);
      birdGain.connect(destination);

      birdOsc.start(bNow);
      birdOsc.stop(bNow + 0.25);
    };

    // D. Ayurvedic Organic Bansuri Flute Melodies (Raag Yaman Scale)
    const fluteNotes = [277.18, 311.13, 349.23, 415.30, 466.16, 554.37]; // C#4, D#4, F4, G#4, A#4, C#5
    const playFlutePhrase = () => {
      if (!this.ambientEnabled || this.adminMuted || !this.audioCtx) return;
      const fCtx = this.audioCtx;
      const fNow = fCtx.currentTime;

      const noteFreq = fluteNotes[Math.floor(Math.random() * fluteNotes.length)];
      const duration = 2.5 + Math.random() * 2.0;

      const fluteOsc = fCtx.createOscillator();
      const fluteGain = fCtx.createGain();

      fluteOsc.type = 'sine';
      fluteOsc.frequency.setValueAtTime(noteFreq, fNow);

      const vibrato = fCtx.createOscillator();
      const vibratoGain = fCtx.createGain();
      vibrato.frequency.setValueAtTime(5.2, fNow);
      vibratoGain.gain.setValueAtTime(3.5, fNow);
      vibrato.connect(vibratoGain);
      vibratoGain.connect(fluteOsc.frequency);
      vibrato.start(fNow);

      fluteGain.gain.setValueAtTime(0.0001, fNow);
      fluteGain.gain.linearRampToValueAtTime(0.15, fNow + 0.6);
      fluteGain.gain.exponentialRampToValueAtTime(0.0001, fNow + duration);

      fluteOsc.connect(fluteGain);
      fluteGain.connect(destination);

      fluteOsc.start(fNow);
      fluteOsc.stop(fNow + duration + 0.1);
      vibrato.stop(fNow + duration + 0.1);
    };

    // Trigger immediate sounds on unlock
    setTimeout(() => playBirdCall(), 500);
    setTimeout(() => playFlutePhrase(), 1200);

    this.birdTimer = setInterval(() => {
      if (Math.random() > 0.2) playBirdCall();
      if (Math.random() > 0.3) playFlutePhrase();
    }, 4000);
    this.ambientNodes.push(this.birdTimer);
  }

  // 2. Ayurvedic Herbal Garden Soundscape (D Major 432Hz Meditation Pad & Veena Harmonics)
  private buildAyurvedicGardenSoundscape(ctx: AudioContext, destination: GainNode) {
    const now = ctx.currentTime;

    // Deep Soothing 432Hz D Major Harmonious Chord (D3, A3, F#4, A4, D5)
    const chord = [146.83, 220.0, 369.99, 440.0, 587.33];
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Slow organic breath swell for pad warmth
      const padLfo = ctx.createOscillator();
      padLfo.frequency.setValueAtTime(0.1, now);
      const padLfoGain = ctx.createGain();
      padLfoGain.gain.setValueAtTime(0.05, now);

      padLfo.connect(padLfoGain);
      padLfoGain.connect(gain.gain);

      gain.gain.setValueAtTime(idx === 0 ? 0.25 : 0.12, now);

      osc.connect(gain);
      gain.connect(destination);

      osc.start(now);
      padLfo.start(now);
      this.ambientNodes.push(osc as any, padLfo as any, gain as any);
    });

    // Plucked Veena / Santoor Acoustic Chimes
    const veenaNotes = [293.66, 369.99, 440.0, 587.33, 739.99];
    const playVeenaPluck = () => {
      if (!this.ambientEnabled || this.adminMuted || !this.audioCtx) return;
      const vCtx = this.audioCtx;
      const vNow = vCtx.currentTime;

      const note = veenaNotes[Math.floor(Math.random() * veenaNotes.length)];
      const vOsc = vCtx.createOscillator();
      const vGain = vCtx.createGain();

      vOsc.type = 'sine';
      vOsc.frequency.setValueAtTime(note, vNow);

      vGain.gain.setValueAtTime(0.18, vNow);
      vGain.gain.exponentialRampToValueAtTime(0.0001, vNow + 3.0);

      vOsc.connect(vGain);
      vGain.connect(destination);

      vOsc.start(vNow);
      vOsc.stop(vNow + 3.1);
    };

    setTimeout(() => playVeenaPluck(), 800);
    this.birdTimer = setInterval(() => {
      if (Math.random() > 0.3) playVeenaPluck();
    }, 5000);
    this.ambientNodes.push(this.birdTimer);
  }

  // 3. Western Ghats Monsoon Sanctuary & Temple Bell Soundscape
  private buildMonsoonRainSoundscape(ctx: AudioContext, destination: GainNode) {
    const now = ctx.currentTime;

    // Deep F Low Ambient Harmonic Pad (F2 87.31Hz, F3 174.61Hz, C4 261.63Hz, F4 349.23Hz)
    const padChord = [87.31, 174.61, 261.63, 349.23, 523.25];
    padChord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(idx === 0 ? 0.30 : 0.12, now);

      osc.connect(gain);
      gain.connect(destination);

      osc.start(now);
      this.ambientNodes.push(osc as any, gain as any);
    });

    // Occasional Soft Sanctuary Bell Chime & Singing Bowl
    const playBell = () => {
      if (!this.ambientEnabled || this.adminMuted || !this.audioCtx) return;
      const bCtx = this.audioCtx;
      const bNow = bCtx.currentTime;

      const bellOsc = bCtx.createOscillator();
      const bellGain = bCtx.createGain();

      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(1046.5, bNow); // C6 bell tone

      bellGain.gain.setValueAtTime(0.20, bNow);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, bNow + 3.5);

      bellOsc.connect(bellGain);
      bellGain.connect(destination);

      bellOsc.start(bNow);
      bellOsc.stop(bNow + 3.6);
    };

    setTimeout(() => playBell(), 1000);

    this.birdTimer = setInterval(() => {
      if (Math.random() > 0.3) {
        playBell();
      }
    }, 6000);
    this.ambientNodes.push(this.birdTimer);
  }

  // Master Play Method
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

    // Master gain node applying configured volume (default ~0.20)
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
