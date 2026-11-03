/**
 * DIGESTA - Layanan Audio Native Web Audio API Terpusat (Singleton)
 *
 * Mencegah error 'AudioContext was not allowed to start' dan batas maksimum
 * 6 audio context browser dengan mengelola satu shared AudioContext yang aman.
 */

export type SoundType = 'pop' | 'chime' | 'soft' | 'success' | 'error';

let sharedAudioCtx: AudioContext | null = null;
let userGestureOccurred = false;

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

    if (sharedAudioCtx.state === 'suspended' && userGestureOccurred) {
      sharedAudioCtx.resume().catch(() => {});
    }

    return sharedAudioCtx;
  } catch {
    return null;
  }
}

// Buka kunci AudioContext secara otomatis begitu pengguna berinteraksi pertama kali (click, touch, pointerdown, keydown)
if (typeof window !== 'undefined') {
  const onUserGesture = () => {
    userGestureOccurred = true;
    try {
      const ctx = ensureAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    } catch {
      // fallback
    }
  };

  window.addEventListener('click', onUserGesture, { capture: true, passive: true });
  window.addEventListener('keydown', onUserGesture, { capture: true, passive: true });
  window.addEventListener('touchstart', onUserGesture, { capture: true, passive: true });
  window.addEventListener('pointerdown', onUserGesture, { capture: true, passive: true });
}

/**
 * Memainkan efek suara sintetis prosedural secara aman
 */
export function playSound(type: SoundType, enabled = true): void {
  if (!enabled || typeof window === 'undefined') return;

  // Jika sound adalah hover ('soft') dan belum ada user gesture atau AudioContext belum running,
  // abaikan secara senyap agar browser tidak mencatat warning autoplay
  if (type === 'soft' && (!userGestureOccurred || !sharedAudioCtx || sharedAudioCtx.state !== 'running')) {
    return;
  }

  // Jika belum ada gesture dan belum ada AudioContext, jangan buat pada event non-gesture
  if (!userGestureOccurred && !sharedAudioCtx) {
    return;
  }

  try {
    const ctx = ensureAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      if (userGestureOccurred) {
        ctx.resume().catch(() => {});
      } else {
        return;
      }
    }

    if (ctx.state !== 'running') {
      return;
    }

    const now = ctx.currentTime;

    if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.1);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'chime') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.setValueAtTime(840, now + 0.08);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'soft') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'success') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.setValueAtTime(520, now + 0.08);
      osc.frequency.setValueAtTime(680, now + 0.16);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } else if (type === 'error') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.18);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    }
  } catch {
    // Fallback jika audio device disconnect / error renderer
  }
}
