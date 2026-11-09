/**
 * DIGESTA - Layanan Audio Native Web Audio API Terpusat (Singleton)
 *
 * Menggunakan sintesis prosedural akustik FM & physical modeling murni
 * (marimba hangat, woodblock gelembung ramah anak, lonceng celesta)
 * tanpa dependensi unduhan berkas mp3/wav eksternal, bebas 'AI slop' / beep kaku.
 *
 * Mencegah error 'AudioContext was not allowed to start' dan batas maksimum
 * 6 audio context browser dengan mengelola satu shared AudioContext yang aman.
 */

export type SoundType = 'pop' | 'chime' | 'soft' | 'success' | 'error';

const STORAGE_KEY_SOUND = 'digiesta_sound_enabled';

let sharedAudioCtx: AudioContext | null = null;
let userGestureOccurred = false;

/**
 * Memeriksa status aktif efek suara (tersinkronisasi ke localStorage)
 */
export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(STORAGE_KEY_SOUND);
  return stored !== null ? stored === 'true' : true;
}

/**
 * Mengubah status aktif efek suara secara global
 */
export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_SOUND, enabled ? 'true' : 'false');
}

/**
 * Mengambil atau menginisialisasi shared AudioContext secara aman
 */
function ensureAudioContext(): AudioContext | null {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioContextClass();
    }

    return sharedAudioCtx;
  } catch {
    return null;
  }
}

// Buka kunci AudioContext secara otomatis begitu pengguna berinteraksi pertama kali (click, touchend, keydown)
if (typeof window !== 'undefined') {
  const gestureEvents: (keyof WindowEventMap)[] = ['click', 'touchend', 'keydown'];

  const cleanUpListeners = () => {
    gestureEvents.forEach((ev) => {
      window.removeEventListener(ev, onUserGesture, { capture: true });
    });
  };

  const onUserGesture = () => {
    userGestureOccurred = true;
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().then(() => {
        cleanUpListeners();
      }).catch(() => {});
    } else {
      cleanUpListeners();
    }
  };

  gestureEvents.forEach((ev) => {
    window.addEventListener(ev, onUserGesture, { capture: true, passive: true });
  });
}

/**
 * 1. Pop: Woodblock / Bubble Pop Akustik Taktil
 */
function synthesizePop(ctx: AudioContext, now: number): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(760, now);
  osc.frequency.exponentialRampToValueAtTime(260, now + 0.055);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1400, now);
  filter.Q.setValueAtTime(2, now);

  gain.gain.setValueAtTime(0.32, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.075);

  // Resonansi badan kayu halus
  const oscBody = ctx.createOscillator();
  const gainBody = ctx.createGain();
  oscBody.type = 'triangle';
  oscBody.frequency.setValueAtTime(390, now);
  gainBody.gain.setValueAtTime(0.12, now);
  gainBody.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  oscBody.connect(gainBody);
  gainBody.connect(ctx.destination);
  oscBody.start(now);
  oscBody.stop(now + 0.055);
}

/**
 * 2. Success: Akord Marimba / Kalimba Kayu Alami (C5 - E5 - G5 - C6)
 */
function synthesizeSuccess(ctx: AudioContext, now: number): void {
  const notes = [
    { freq: 523.25, time: 0 },
    { freq: 659.25, time: 0.045 },
    { freq: 783.99, time: 0.09 },
    { freq: 1046.5, time: 0.145 },
  ];

  notes.forEach(({ freq, time }) => {
    const noteStart = now + time;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, noteStart);
    filter.Q.setValueAtTime(1.2, noteStart);
    filter.connect(ctx.destination);

    // Nada dasar (fundamental) hangat
    const oscFund = ctx.createOscillator();
    const gainFund = ctx.createGain();
    oscFund.type = 'sine';
    oscFund.frequency.setValueAtTime(freq, noteStart);

    gainFund.gain.setValueAtTime(0.2, noteStart);
    gainFund.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.36);

    oscFund.connect(gainFund);
    gainFund.connect(filter);
    oscFund.start(noteStart);
    oscFund.stop(noteStart + 0.38);

    // Ketukan mallet kayu (overtone 4x frekuensi dengan decay cepat)
    const oscHarm = ctx.createOscillator();
    const gainHarm = ctx.createGain();
    oscHarm.type = 'sine';
    oscHarm.frequency.setValueAtTime(freq * 4, noteStart);

    gainHarm.gain.setValueAtTime(0.06, noteStart);
    gainHarm.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.065);

    oscHarm.connect(gainHarm);
    gainHarm.connect(filter);
    oscHarm.start(noteStart);
    oscHarm.stop(noteStart + 0.075);
  });
}

/**
 * 3. Error: Nada 'Plop' Kartun Kayu Lembut (Thud 2-Step Ramah Anak)
 */
function synthesizeError(ctx: AudioContext, now: number): void {
  const steps = [
    { startFreq: 240, endFreq: 170, time: 0, dur: 0.12, gainVal: 0.25 },
    { startFreq: 165, endFreq: 110, time: 0.08, dur: 0.16, gainVal: 0.2 },
  ];

  steps.forEach(({ startFreq, endFreq, time, dur, gainVal }) => {
    const stepStart = now + time;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(startFreq, stepStart);
    osc.frequency.exponentialRampToValueAtTime(endFreq, stepStart + dur * 0.9);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, stepStart);
    filter.Q.setValueAtTime(1.5, stepStart);

    gain.gain.setValueAtTime(gainVal, stepStart);
    gain.gain.exponentialRampToValueAtTime(0.001, stepStart + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(stepStart);
    osc.stop(stepStart + dur + 0.02);
  });
}

/**
 * 4. Chime: Celesta / Lonceng Melodi FM Sintetis Lembut
 */
function synthesizeChime(ctx: AudioContext, now: number): void {
  const carrier = ctx.createOscillator();
  const modulator = ctx.createOscillator();
  const modGain = ctx.createGain();
  const carrierGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  carrier.type = 'sine';
  carrier.frequency.setValueAtTime(880, now);

  modulator.type = 'sine';
  modulator.frequency.setValueAtTime(880 * 2.756, now);

  modGain.gain.setValueAtTime(480, now);
  modGain.gain.exponentialRampToValueAtTime(0.1, now + 0.14);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(3200, now);

  carrierGain.gain.setValueAtTime(0.22, now);
  carrierGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

  modulator.connect(modGain);
  modGain.connect(carrier.frequency);

  carrier.connect(filter);
  filter.connect(carrierGain);
  carrierGain.connect(ctx.destination);

  modulator.start(now);
  carrier.start(now);
  modulator.stop(now + 0.46);
  carrier.stop(now + 0.46);
}

/**
 * 5. Soft: Haptic Wood Tap Halus
 */
function synthesizeSoft(ctx: AudioContext, now: number): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(280, now);
  osc.frequency.exponentialRampToValueAtTime(160, now + 0.04);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, now);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
}

function triggerSynthesis(ctx: AudioContext, type: SoundType): void {
  const now = ctx.currentTime;
  switch (type) {
    case 'pop':
      synthesizePop(ctx, now);
      break;
    case 'chime':
      synthesizeChime(ctx, now);
      break;
    case 'soft':
      synthesizeSoft(ctx, now);
      break;
    case 'success':
      synthesizeSuccess(ctx, now);
      break;
    case 'error':
      synthesizeError(ctx, now);
      break;
  }
}

/**
 * Memainkan efek suara sintetis prosedural akustik secara aman
 */
export function playSound(type: SoundType, enabled = isSoundEnabled()): void {
  if (!enabled || !isSoundEnabled() || typeof window === 'undefined') return;

  // Jika sound adalah hover ('soft') dan belum ada user gesture atau AudioContext belum running,
  // abaikan secara senyap agar browser tidak mencatat warning autoplay
  if (type === 'soft' && (!userGestureOccurred || !sharedAudioCtx || sharedAudioCtx.state !== 'running')) {
    return;
  }

  // Jika belum ada gesture pengguna, jangan pemicu AudioContext sama sekali
  if (!userGestureOccurred) {
    return;
  }

  try {
    const ctx = ensureAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        if (ctx.state === 'running') {
          triggerSynthesis(ctx, type);
        }
      }).catch(() => {});
      return;
    }

    if (ctx.state === 'running') {
      triggerSynthesis(ctx, type);
    }
  } catch {
    // Fallback jika audio device disconnect / error renderer
  }
}
