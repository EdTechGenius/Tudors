// Procedurally drawn textures, so the game needs no image downloads.
import * as THREE from '../vendor/three.module.min.js';

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

function toTexture(c, repeat = true) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

// Simple seeded random so textures look the same every time.
function rng(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
  const b = Math.max(0, Math.min(255, (n & 255) + amt));
  return `rgb(${r},${g},${b})`;
}

// Tudor red brick with the dark blue-grey "diaper" diamond pattern seen at Hampton Court.
export function brick() {
  const [c, g] = canvas(256, 256);
  const r = rng(7);
  g.fillStyle = '#cbbfa8';
  g.fillRect(0, 0, 256, 256);
  const bh = 16, bw = 32;
  for (let row = 0; row < 16; row++) {
    const off = row % 2 ? bw / 2 : 0;
    for (let col = -1; col < 9; col++) {
      const x = col * bw + off, y = row * bh;
      // diaper diamonds: dark headers along diagonal lines
      const hx = (((col * 2 + (row % 2)) % 16) + 16) % 16;
      const diamond = Math.abs(hx - 8) + Math.abs((row % 8) - 4) === 4;
      const base = diamond ? '#3e4150' : ['#a5452f', '#b14e33', '#9a3e2b', '#b85a3c'][Math.floor(r() * 4)];
      g.fillStyle = shade(base, Math.floor(r() * 24 - 12));
      g.fillRect(x + 1, y + 1, bw - 2, bh - 2);
    }
  }
  return toTexture(c);
}

export function stone(color = '#cfc6b4', seed = 3) {
  const [c, g] = canvas(256, 256);
  const r = rng(seed);
  g.fillStyle = color;
  g.fillRect(0, 0, 256, 256);
  for (let row = 0; row < 4; row++) {
    const off = row % 2 ? 32 : 0;
    for (let col = -1; col < 4; col++) {
      g.fillStyle = shade(color, Math.floor(r() * 26 - 13));
      g.fillRect(col * 64 + off + 2, row * 64 + 2, 60, 60);
    }
  }
  return toTexture(c);
}

export function cobbles() {
  const [c, g] = canvas(256, 256);
  const r = rng(11);
  g.fillStyle = '#7d766b';
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 260; i++) {
    const x = r() * 256, y = r() * 256, s = 7 + r() * 8;
    g.fillStyle = shade('#a39a8a', Math.floor(r() * 40 - 20));
    g.beginPath();
    g.ellipse(x, y, s, s * 0.8, r() * 3, 0, Math.PI * 2);
    g.fill();
  }
  return toTexture(c);
}

export function grass() {
  const [c, g] = canvas(128, 128);
  const r = rng(5);
  g.fillStyle = '#5f8f3e';
  g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 900; i++) {
    g.fillStyle = shade('#5f8f3e', Math.floor(r() * 40 - 20));
    g.fillRect(r() * 128, r() * 128, 2, 3);
  }
  return toTexture(c);
}

export function gravel() {
  const [c, g] = canvas(128, 128);
  const r = rng(9);
  g.fillStyle = '#c9b88f';
  g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 700; i++) {
    g.fillStyle = shade('#c9b88f', Math.floor(r() * 50 - 25));
    g.fillRect(r() * 128, r() * 128, 2, 2);
  }
  return toTexture(c);
}

export function boards() {
  const [c, g] = canvas(256, 256);
  const r = rng(13);
  for (let i = 0; i < 8; i++) {
    g.fillStyle = shade('#7a5132', Math.floor(r() * 30 - 15));
    g.fillRect(0, i * 32, 256, 31);
    g.fillStyle = 'rgba(0,0,0,0.25)';
    g.fillRect(Math.floor(r() * 256), i * 32, 2, 31);
  }
  return toTexture(c);
}

// Oak "linenfold" panelling below, warm plaster above.
export function panelling() {
  const [c, g] = canvas(256, 512);
  g.fillStyle = '#e9dcc0';
  g.fillRect(0, 0, 256, 512);
  g.fillStyle = '#5b3a22';
  g.fillRect(0, 256, 256, 256);
  for (let i = 0; i < 4; i++) {
    const x = i * 64;
    g.fillStyle = '#6e4829';
    g.fillRect(x + 6, 270, 52, 228);
    for (let f = 0; f < 4; f++) {
      g.fillStyle = f % 2 ? '#7d5531' : '#5f3c22';
      g.fillRect(x + 12 + f * 11, 290, 9, 190);
    }
  }
  g.fillStyle = '#3f2814';
  g.fillRect(0, 250, 256, 10);
  return toTexture(c);
}

export function whitewash() {
  const [c, g] = canvas(128, 128);
  const r = rng(21);
  g.fillStyle = '#e4ddcf';
  g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 300; i++) {
    g.fillStyle = `rgba(90,80,60,${r() * 0.12})`;
    g.fillRect(r() * 128, r() * 128, 4, 4);
  }
  return toTexture(c);
}

export function chapelCeiling() {
  const [c, g] = canvas(256, 256);
  g.fillStyle = '#1d3a7a';
  g.fillRect(0, 0, 256, 256);
  g.strokeStyle = '#c9a43b';
  g.lineWidth = 6;
  g.strokeRect(0, 0, 256, 256);
  g.fillStyle = '#e8c45a';
  const r = rng(4);
  for (let i = 0; i < 14; i++) {
    const x = 20 + r() * 216, y = 20 + r() * 216;
    star(g, x, y, 7);
  }
  return toTexture(c);
}

function star(g, x, y, s) {
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5, rr = i % 2 ? s / 2.5 : s;
    g.lineTo(x + Math.sin(a) * rr, y - Math.cos(a) * rr);
  }
  g.fill();
}

export function tapestry(seed = 1) {
  const [c, g] = canvas(256, 192);
  const r = rng(seed);
  const pal = ['#7b2a2a', '#2f4a2a', '#2a3b6b', '#7a5a22'];
  g.fillStyle = pal[seed % 4];
  g.fillRect(0, 0, 256, 192);
  g.strokeStyle = '#d6b45a';
  g.lineWidth = 8;
  g.strokeRect(6, 6, 244, 180);
  // stylised figures and trees
  for (let i = 0; i < 5; i++) {
    const x = 30 + i * 48;
    g.fillStyle = shade('#3a5a2a', Math.floor(r() * 30));
    g.beginPath(); g.arc(x, 70, 18, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#5a3a1a'; g.fillRect(x - 3, 85, 6, 30);
    g.fillStyle = ['#d8c9a0', '#a83a3a', '#3a5aa8'][i % 3];
    g.fillRect(x + 10, 110, 14, 40);
    g.beginPath(); g.arc(x + 17, 102, 7, 0, Math.PI * 2); g.fillStyle = '#e8c8a8'; g.fill();
  }
  g.fillStyle = 'rgba(0,0,0,0.12)';
  for (let y = 0; y < 192; y += 3) g.fillRect(0, y, 256, 1);
  return toTexture(c, false);
}

export function stripes(a = '#2f6b3a', b = '#f2efe4') {
  const [c, g] = canvas(64, 64);
  g.fillStyle = b; g.fillRect(0, 0, 64, 64);
  g.fillStyle = a;
  for (let i = -64; i < 128; i += 16) {
    g.beginPath();
    g.moveTo(i, 0); g.lineTo(i + 8, 0); g.lineTo(i + 72, 64); g.lineTo(i + 64, 64);
    g.fill();
  }
  return toTexture(c);
}

export function water() {
  const [c, g] = canvas(128, 128);
  const r = rng(31);
  g.fillStyle = '#4c7a8f';
  g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 120; i++) {
    g.fillStyle = 'rgba(255,255,255,0.18)';
    g.fillRect(r() * 128, r() * 128, 10 + r() * 14, 1.5);
  }
  return toTexture(c);
}

export function sky() {
  const [c, g] = canvas(16, 256);
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#5f8fc9');
  grad.addColorStop(0.5, '#a9c6e6');
  grad.addColorStop(1, '#e9eef0');
  g.fillStyle = grad;
  g.fillRect(0, 0, 16, 256);
  const t = toTexture(c, false);
  return t;
}

// A label texture: text on a rounded panel.
export function label(text, { font = 'bold 40px Georgia, serif', bg = 'rgba(40,24,10,0.78)', fg = '#fff3d6', pad = 18 } = {}) {
  const [m, mg] = canvas(8, 8);
  mg.font = font;
  const w = Math.ceil(mg.measureText(text).width) + pad * 2;
  const h = 64;
  const [c, g] = canvas(w, h);
  g.font = font;
  g.fillStyle = bg;
  roundRect(g, 0, 0, w, h, 18);
  g.fill();
  g.fillStyle = fg;
  g.textBaseline = 'middle';
  g.fillText(text, pad, h / 2 + 2);
  const t = toTexture(c, false);
  t.userData = { w, h };
  return t;
}

function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

export function marker(symbol = '!', color = '#f4c430') {
  const [c, g] = canvas(128, 128);
  g.fillStyle = color;
  g.strokeStyle = '#5a3a00';
  g.lineWidth = 8;
  g.beginPath(); g.arc(64, 64, 52, 0, Math.PI * 2); g.fill(); g.stroke();
  g.fillStyle = '#3a2400';
  g.font = 'bold 84px Georgia, serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(symbol, 64, 70);
  return toTexture(c, false);
}

// Carved "H & A" initials for the Great Hall clue.
export function initialsHA() {
  const [c, g] = canvas(256, 256);
  g.fillStyle = '#5b3a1e';
  g.beginPath(); g.moveTo(20, 20); g.lineTo(236, 20); g.lineTo(236, 150); g.quadraticCurveTo(236, 230, 128, 246); g.quadraticCurveTo(20, 230, 20, 150); g.closePath(); g.fill();
  g.strokeStyle = '#d9b24a'; g.lineWidth = 10; g.stroke();
  g.fillStyle = '#e8c45a';
  g.font = 'bold 110px Georgia, serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('H', 92, 128);
  g.fillText('A', 166, 128);
  g.fillRect(70, 190, 116, 8);
  return toTexture(c, false);
}

export function clockFace() {
  const [c, g] = canvas(256, 256);
  g.fillStyle = '#1c2f6b';
  g.beginPath(); g.arc(128, 128, 124, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#e0bb4f'; g.lineWidth = 8;
  for (const rr of [118, 80, 46]) { g.beginPath(); g.arc(128, 128, rr, 0, Math.PI * 2); g.stroke(); }
  g.fillStyle = '#e0bb4f';
  g.font = 'bold 20px Georgia'; g.textAlign = 'center'; g.textBaseline = 'middle';
  const nums = ['XII', 'III', 'VI', 'IX'];
  nums.forEach((n, i) => { const a = (i * Math.PI) / 2; g.fillText(n, 128 + Math.sin(a) * 99, 128 - Math.cos(a) * 99); });
  g.beginPath(); g.arc(128, 128, 20, 0, Math.PI * 2); g.fillStyle = '#3d7bd1'; g.fill(); // the Earth at the centre
  g.fillStyle = '#f6d25c'; g.beginPath(); g.arc(128 + 62, 128 - 20, 13, 0, Math.PI * 2); g.fill(); // the Sun
  return toTexture(c, false);
}

export function portrait(bg, robe, hat) {
  const [c, g] = canvas(128, 160);
  g.fillStyle = bg; g.fillRect(0, 0, 128, 160);
  g.fillStyle = robe; g.beginPath(); g.ellipse(64, 160, 54, 60, 0, Math.PI, 0); g.fill();
  g.fillStyle = '#e9c9a6'; g.beginPath(); g.ellipse(64, 70, 22, 27, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = hat; g.fillRect(36, 34, 56, 16);
  g.strokeStyle = '#c9a43b'; g.lineWidth = 10; g.strokeRect(0, 0, 128, 160);
  return toTexture(c, false);
}

export function parchment(lines = 6) {
  const [c, g] = canvas(128, 128);
  g.fillStyle = '#efe0b9'; g.fillRect(0, 0, 128, 128);
  g.fillStyle = '#5a4630';
  for (let i = 0; i < lines; i++) g.fillRect(14, 18 + i * 16, 80 + ((i * 37) % 20), 3);
  return toTexture(c, false);
}
