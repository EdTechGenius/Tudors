// Quiet Tudor background music: "Greensleaves", played on a synthesised lute and recorder.
// Everything is generated in the browser with the Web Audio API, so no audio files are needed.
//
// The lute uses the Karplus–Strong method: a short burst of noise is fed round a delay line,
// which makes a convincing plucked-string sound.

const BEAT = 0.52; // seconds per beat (a gentle, slow pace)

// Melody: "note:beats" in 3/4 time, starting with a one-beat pick-up.
const MELODY = `
A4:1
C5:2 D5:1 | E5:1.5 F5:0.5 E5:1 | D5:2 B4:1 | G4:1.5 A4:0.5 B4:1 | C5:2 A4:1 | A4:1.5 G#4:0.5 A4:1 | B4:2 G#4:1 | E4:2 A4:1 |
C5:2 D5:1 | E5:1.5 F5:0.5 E5:1 | D5:2 B4:1 | G4:1.5 A4:0.5 B4:1 | C5:1.5 B4:0.5 A4:1 | G#4:1.5 F#4:0.5 G#4:1 | A4:3 | A4:3 |
G5:3 | G5:1.5 F#5:0.5 E5:1 | D5:2 B4:1 | G4:1.5 A4:0.5 B4:1 | C5:2 A4:1 | A4:1.5 G#4:0.5 A4:1 | B4:2 G#4:1 | E4:3 |
G5:3 | G5:1.5 F#5:0.5 E5:1 | D5:2 B4:1 | G4:1.5 A4:0.5 B4:1 | C5:1.5 B4:0.5 A4:1 | G#4:1.5 F#4:0.5 G#4:1 | A4:3 | A4:5
`;
// One chord per bar (32 bars), played as a soft lute accompaniment.
const CHORDS = 'Am C G Em Am E E Am  Am C G Em Am E Am Am  C Em G Em Am E E E  C Em G Em Am E Am Am'.split(/\s+/);
const CHORD_NOTES = {
  Am: ['A2', 'E3', 'A3'], C: ['C3', 'G3', 'C4'], G: ['G2', 'D3', 'G3'], Em: ['E2', 'B2', 'E3'], E: ['E2', 'B2', 'G#3'],
};

function midi(name) {
  const m = /^([A-G])(#?)(\d)$/.exec(name);
  const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]];
  return 12 * (+m[3] + 1) + base + (m[2] ? 1 : 0);
}
const freq = (n) => 440 * Math.pow(2, (n - 69) / 12);

// Build the list of notes for one time through the tune.
function buildEvents() {
  const ev = [];
  let t = 0;
  for (const tok of MELODY.replace(/\|/g, ' ').trim().split(/\s+/)) {
    const [n, d] = tok.split(':');
    ev.push({ t, n: midi(n), d: +d, voice: 'melody' });
    t += +d;
  }
  CHORDS.forEach((c, bar) => {
    const start = 1 + bar * 3;
    CHORD_NOTES[c].forEach((n, k) => ev.push({ t: start + k, n: midi(n), d: 3 - k, voice: 'bass' }));
  });
  ev.sort((a, b) => a.t - b.t);
  return { events: ev, length: t }; // the pick-up of the next time round falls on the last beat
}
const TUNE = buildEvents();

export class Music {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.volume = 0.5;
    this.playing = false;
    this.ducked = false;
    this.buffers = new Map();
  }

  ensure() {
    if (this.ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    const tone = this.ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = 3200;
    this.master.connect(tone).connect(this.ctx.destination);
    return true;
  }

  level() { return this.enabled ? this.volume * 0.28 * (this.ducked ? 0.3 : 1) : 0; }
  applyLevel(seconds = 0.6) {
    if (!this.ctx) return;
    const g = this.master.gain, now = this.ctx.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(this.level(), now + seconds);
  }

  // Must be called from a tap or click the first time (browsers block sound until the user interacts).
  start() {
    if (!this.enabled || !this.ensure()) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    if (this.playing) { this.applyLevel(); return; }
    this.playing = true;
    this.loopStart = this.ctx.currentTime + 0.3;
    this.loopIdx = 0;
    this.next = 0;
    this.timer = setInterval(() => this.tick(), 120);
    this.applyLevel(1.5);
  }

  stop() {
    if (!this.ctx || !this.playing) return;
    this.playing = false;
    const g = this.master.gain, now = this.ctx.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(0, now + 0.5);
    clearInterval(this.timer);
  }

  setEnabled(on) { this.enabled = on; if (on) this.start(); else this.stop(); }
  setVolume(v) { this.volume = v; this.applyLevel(0.2); }
  duck(on) { this.ducked = on; this.applyLevel(0.4); }
  pause() { if (this.ctx && this.ctx.state === 'running') this.ctx.suspend(); }
  resume() { if (this.ctx && this.enabled && this.playing) this.ctx.resume(); }

  tick() {
    const ahead = this.ctx.currentTime + 0.5;
    for (;;) {
      const e = TUNE.events[this.next];
      const t = this.loopStart + e.t * BEAT;
      if (t > ahead) break;
      if (t > this.ctx.currentTime - 0.05) this.play(e, t);
      this.next++;
      if (this.next >= TUNE.events.length) {
        this.next = 0;
        this.loopStart += TUNE.length * BEAT;
        this.loopIdx++;
      }
    }
  }

  play(e, t) {
    if (e.voice === 'melody' && this.loopIdx % 2 === 1) this.recorder(e.n, t, e.d * BEAT);
    else this.lute(e.n, t, e.voice === 'bass' ? 0.32 : 0.75);
  }

  // A plucked lute string (Karplus–Strong synthesis), cached per note.
  luteBuffer(n) {
    if (this.buffers.has(n)) return this.buffers.get(n);
    const sr = this.ctx.sampleRate, len = Math.floor(sr * 2.2);
    const buf = this.ctx.createBuffer(1, len, sr);
    const d = buf.getChannelData(0);
    const N = Math.max(2, Math.round(sr / freq(n)));
    let prev = 0;
    for (let i = 0; i < N; i++) { const r = Math.random() * 2 - 1; prev = prev * 0.5 + r * 0.5; d[i] = prev; } // softened noise burst
    const decay = 0.9965;
    for (let i = N; i < len; i++) d[i] = decay * 0.5 * (d[i - N] + d[i - N - 1 < 0 ? 0 : i - N - 1]);
    this.buffers.set(n, buf);
    return buf;
  }

  lute(n, t, vol) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.luteBuffer(n);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 2.1);
    src.connect(g).connect(this.master);
    src.start(t);
    src.stop(t + 2.2);
  }

  // A soft recorder: a rounded tone with gentle vibrato.
  recorder(n, t, dur) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq(n);
    const vib = ctx.createOscillator();
    vib.frequency.value = 5;
    const vibAmt = ctx.createGain();
    vibAmt.gain.value = freq(n) * 0.004;
    vib.connect(vibAmt).connect(osc.frequency);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.32, t + 0.06);
    g.gain.setValueAtTime(0.32, t + Math.max(0.07, dur - 0.08));
    g.gain.linearRampToValueAtTime(0, t + dur);
    osc.connect(g).connect(this.master);
    osc.start(t); vib.start(t);
    osc.stop(t + dur + 0.05); vib.stop(t + dur + 0.05);
  }
}
