"use client";

/**
 * Robust Web Audio API sound engine using a single reusable AudioContext instance.
 * Sounds are synthesized so no external audio files are required.
 */
export function createSoundEngine(muted = false) {
  let _muted = muted;
  let _ctx = null;

  function getCtx() {
    if (typeof window === "undefined") return null;
    try {
      if (!_ctx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) _ctx = new Ctx();
      }
      if (_ctx && _ctx.state === "suspended") {
        _ctx.resume().catch(() => {});
      }
      return _ctx;
    } catch (e) {
      return null;
    }
  }

  function beep(freq, type, duration, volume = 0.08, rampTo = 0.001) {
    if (_muted) return;
    const ctx = getCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(rampTo, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  function chord(notes, type, duration, volume) {
    notes.forEach(f => beep(f, type, duration, volume));
  }

  const sounds = {
    click: () => beep(800, "square", 0.06, 0.04),
    back: () => beep(400, "sine", 0.1, 0.05),
    roomCreated: () => chord([523, 659, 784], "sine", 0.4, 0.06),
    joined: () => chord([440, 554, 659], "sine", 0.35, 0.06),
    start: () => chord([392, 523, 659, 784], "triangle", 0.5, 0.07),
    reveal: () => chord([659, 784, 988], "sine", 0.55, 0.07),
    spyReveal: () => beep(220, "sawtooth", 0.6, 0.06),
    vote: () => beep(600, "square", 0.12, 0.05),
    voteSubmit: () => chord([523, 659], "sine", 0.3, 0.06),
    win: () => chord([523, 659, 784, 1047], "sine", 0.8, 0.07),
    lose: () => chord([311, 370, 415], "sawtooth", 0.6, 0.05),
    countdown: () => beep(880, "square", 0.08, 0.04),
    timer: () => beep(660, "sine", 0.15, 0.06),
    playAgain: () => chord([440, 523, 659], "triangle", 0.4, 0.06),
  };

  return {
    play: (name) => {
      try {
        if (sounds[name]) sounds[name]();
      } catch (e) {}
    },
    setMuted: (v) => { _muted = v; },
    isMuted: () => _muted,
  };
}

let _engine = null;

export function getSoundEngine() {
  if (typeof window === "undefined") {
    return { play: () => {}, setMuted: () => {}, isMuted: () => true };
  }
  if (!_engine) {
    _engine = createSoundEngine(false);
  }
  return _engine;
}
