/**
 * FOOTBALL MATCH ROULETTE - AUDIO ENGINE (Pure Web Audio API)
 * Menghasilkan efek suara sintetis tanpa file eksternal:
 * - Detak roulette acak (tick/click ratchet)
 * - Nada konfirmasi (lock)
 * - Suara lempar koin (coin flip)
 * - Kemenangan & fanfare pertandingan
 * - Swap swoosh
 * Dilengkapi pengingat status mute via localStorage.
 */

class MatchRouletteAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('gacha_audio_muted') === 'true';
    this._initOnFirstGesture();
  }

  /**
   * Menginisialisasi dan me-resume AudioContext pada gesture pertama pengguna
   * (Kebutuhan standar browser modern, iOS Safari, dan Android Chrome)
   */
  _initOnFirstGesture() {
    const unlock = () => {
      this.ensureContext();
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('click', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Toggle mute / unmute
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('gacha_audio_muted', this.isMuted ? 'true' : 'false');
    } catch (e) {}
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }

  /**
   * 1. Suara Detak / Tick Slot Roulette
   * Suara perkusif klik mekanik dengan sedikit modulasi frekuensi acak
   */
  playTick() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Sedikit random pitch agar suara berputar terkesan mekanik organik
      const baseFreq = 540 + Math.random() * 90;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.035);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      // safe fallback
    }
  }

  /**
   * 2. Suara Kunci Tim (Lock Sound)
   * Efek pukulan bass lembut ketika kartu melambat mengunci
   */
  playLock() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {}
  }

  /**
   * 3. Suara Lempar Koin (Coin Toss Ring)
   * Suara putaran koin metalik berdenting tinggi
   */
  playCoinToss() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, now); // C6
      osc.frequency.exponentialRampToValueAtTime(1567.98, now + 0.28); // G6

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.33);
    } catch (e) {}
  }

  /**
   * 4. Suara Hasil Koin (Coin Winner Chime)
   * Lonceng dua nada manis
   */
  playCoinResult() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const notes = [659.25, 880]; // E5, A5
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.42);
      });
    } catch (e) {}
  }

  /**
   * 5. Suara Kemenangan / Matchday Fanfare
   * Akor C-Major arpeggio megah yang menyala saat gacha selesai
   */
  playVictory() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      // C5, E5, G5, C6 (Akor Kemenangan Megah)
      const chord = [523.25, 659.25, 783.99, 1046.50];
      const now = ctx.currentTime;

      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Gabungan nada harmonis
        osc.type = idx === 3 ? 'sine' : 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.28, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.6);
      });
    } catch (e) {}
  }

  /**
   * 6. Suara Swap Tim
   */
  playSwap() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  }
}

// Global audio singleton
window.matchAudio = new MatchRouletteAudio();
