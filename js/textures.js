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

// ---------- Extra textures for a more realistic Hampton Court ----------

// Tudor windows were made of small diamond-shaped panes held together with lead strips.
export function leaded(lit = false) {
  const [c, g] = canvas(64, 64);
  g.fillStyle = lit ? '#dfeaf0' : '#2a3542';
  g.fillRect(0, 0, 64, 64);
  if (!lit) {
    const grad = g.createLinearGradient(0, 0, 64, 64);
    grad.addColorStop(0, 'rgba(160,190,220,0.25)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
  }
  g.strokeStyle = lit ? '#6c7178' : '#11161c';
  g.lineWidth = 2.5;
  for (let i = -64; i <= 128; i += 16) {
    g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 64, 64); g.stroke();
    g.beginPath(); g.moveTo(i, 64); g.lineTo(i + 64, 0); g.stroke();
  }
  return toTexture(c);
}

// Heraldic stained glass, like the windows of the Great Hall and Chapel Royal.
export function stainedGlass(seed = 1) {
  const [c, g] = canvas(128, 256);
  const r = rng(seed);
  const cols = ['#c9a43b', '#8e1f22', '#24407a', '#2f6b3a', '#e8dcb0', '#6b2a6b'];
  for (let y = 0; y < 256; y += 16) {
    for (let x = 0; x < 128; x += 16) {
      g.fillStyle = r() < 0.6 ? '#e8e2c8' : cols[Math.floor(r() * cols.length)];
      g.fillRect(x, y, 16, 16);
    }
  }
  // a shield with the royal colours
  g.fillStyle = '#24407a';
  g.beginPath(); g.moveTo(24, 70); g.lineTo(104, 70); g.lineTo(104, 140); g.quadraticCurveTo(104, 190, 64, 206); g.quadraticCurveTo(24, 190, 24, 140); g.closePath(); g.fill();
  g.fillStyle = '#8e1f22';
  g.fillRect(64, 70, 40, 68); g.fillRect(24, 138, 40, 55);
  g.fillStyle = '#e8c45a';
  for (const [x, y] of [[44, 100], [84, 160], [44, 120], [84, 100]]) { g.beginPath(); g.arc(x, y, 7, 0, Math.PI * 2); g.fill(); }
  // red rose on top
  g.fillStyle = '#c0141c'; g.beginPath(); g.arc(64, 40, 18, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#f2efe4'; g.beginPath(); g.arc(64, 40, 9, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#1a1a1a'; g.lineWidth = 2;
  for (let x = 0; x <= 128; x += 16) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 256); g.stroke(); }
  for (let y = 0; y <= 256; y += 16) { g.beginPath(); g.moveTo(0, y); g.lineTo(128, y); g.stroke(); }
  return toTexture(c, false);
}

// Hampton Court's famous chimneys are decorated with spirals, zig-zags and diamonds.
export function chimneyBrick() {
  const [c, g] = canvas(64, 128);
  g.fillStyle = '#a5452f';
  g.fillRect(0, 0, 64, 128);
  g.fillStyle = '#c9654a';
  for (let i = -128; i < 256; i += 22) {
    g.beginPath(); g.moveTo(0, i); g.lineTo(64, i + 40); g.lineTo(64, i + 50); g.lineTo(0, i + 10); g.fill();
  }
  g.strokeStyle = 'rgba(60,20,10,0.5)';
  g.lineWidth = 1;
  for (let y = 0; y < 128; y += 8) { g.beginPath(); g.moveTo(0, y); g.lineTo(64, y); g.stroke(); }
  return toTexture(c);
}

// Cardinal Wolsey's coat of arms, which still survives in terracotta above Anne Boleyn's Gateway.
export function wolseyArms() {
  const [c, g] = canvas(256, 256);
  g.fillStyle = '#b5683f'; g.fillRect(0, 0, 256, 256);
  g.strokeStyle = '#7a3f22'; g.lineWidth = 8; g.strokeRect(6, 6, 244, 244);
  // cardinal's hat
  g.fillStyle = '#8e1f22';
  g.beginPath(); g.ellipse(128, 48, 70, 14, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.ellipse(128, 34, 30, 18, 0, Math.PI, 0); g.fill();
  g.strokeStyle = '#8e1f22'; g.lineWidth = 4;
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(128 + s * (50 + i * 6), 52); g.lineTo(128 + s * (60 + i * 10), 110 + i * 25); g.stroke(); }
  // shield
  g.fillStyle = '#e9dcc0';
  g.beginPath(); g.moveTo(78, 70); g.lineTo(178, 70); g.lineTo(178, 150); g.quadraticCurveTo(178, 210, 128, 230); g.quadraticCurveTo(78, 210, 78, 150); g.closePath(); g.fill();
  g.fillStyle = '#1a1a1a'; g.fillRect(78, 125, 100, 16); // the cross band
  g.fillStyle = '#8e1f22'; g.beginPath(); g.arc(128, 100, 14, 0, Math.PI * 2); g.fill(); // a rose
  g.fillStyle = '#c9a43b';
  for (const [x, y] of [[100, 170], [156, 170], [128, 200]]) { g.beginPath(); g.arc(x, y, 9, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#3a1a0a'; g.font = 'bold 15px Georgia'; g.textAlign = 'center';
  g.fillText('DOMINVS MIHI ADIVTOR', 128, 247);
  return toTexture(c, false);
}

// Glazed terracotta roundels of Roman emperors, made for Wolsey by Giovanni da Maiano in 1521.
export function roundel(seed = 1) {
  const [c, g] = canvas(128, 128);
  g.fillStyle = '#e8dcc0'; g.beginPath(); g.arc(64, 64, 63, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#3a6aa8'; g.beginPath(); g.arc(64, 64, 52, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#c9a43b'; g.lineWidth = 6; g.beginPath(); g.arc(64, 64, 57, 0, Math.PI * 2); g.stroke();
  // bust of an emperor (profile)
  g.fillStyle = '#efe6d2';
  g.beginPath(); g.ellipse(64, 112, 34, 26, 0, Math.PI, 0); g.fill();
  g.beginPath(); g.ellipse(62, 60, 20, 25, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.moveTo(80, 56); g.lineTo(88, 68); g.lineTo(79, 70); g.fill(); // nose
  g.fillStyle = '#2f6b3a';
  for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse(48 + i * 6, 38 + Math.abs(i - 2.5) * 2, 6, 4, 0.5, 0, Math.PI * 2); g.fill(); } // laurel wreath
  g.fillStyle = '#c9a43b'; g.font = 'bold 11px Georgia'; g.textAlign = 'center';
  g.fillText(['TIBERIVS', 'NERO', 'TRAIANVS', 'HADRIANVS', 'IVLIVS', 'VITELLIVS'][seed % 6], 64, 22);
  return toTexture(c, false);
}

// Henry VIII's royal coat of arms (as used 1528 onwards: England quartered with France,
// supported by a lion and a dragon/greyhound).
export function royalArms() {
  const [c, g] = canvas(256, 256);
  g.fillStyle = 'rgba(0,0,0,0)'; g.clearRect(0, 0, 256, 256);
  g.fillStyle = '#d9c9a3'; g.fillRect(8, 8, 240, 240);
  g.strokeStyle = '#8a7650'; g.lineWidth = 8; g.strokeRect(8, 8, 240, 240);
  // crown
  g.fillStyle = '#d9ab3c';
  g.beginPath(); g.moveTo(88, 60); g.lineTo(96, 30); g.lineTo(112, 50); g.lineTo(128, 24); g.lineTo(144, 50); g.lineTo(160, 30); g.lineTo(168, 60); g.closePath(); g.fill();
  // shield quartered: France (blue, gold lilies) and England (red, gold lions)
  const sx = 80, sy = 70, sw = 96, sh = 120;
  g.save();
  g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + sw, sy); g.lineTo(sx + sw, sy + 70); g.quadraticCurveTo(sx + sw, sy + sh, sx + sw / 2, sy + sh + 14); g.quadraticCurveTo(sx, sy + sh, sx, sy + 70); g.closePath(); g.clip();
  for (let i = 0; i < 4; i++) {
    const qx = sx + (i % 2) * sw / 2, qy = sy + Math.floor(i / 2) * (sh / 2 + 7);
    const france = i === 0 || i === 3;
    g.fillStyle = france ? '#24407a' : '#a51d22';
    g.fillRect(qx, qy, sw / 2, sh / 2 + 7);
    g.fillStyle = '#e8c45a';
    if (france) { for (const [dx, dy] of [[12, 14], [36, 14], [24, 40]]) { g.beginPath(); g.arc(qx + dx, qy + dy, 6, 0, Math.PI * 2); g.fill(); } }
    else { for (let k = 0; k < 3; k++) g.fillRect(qx + 8, qy + 8 + k * 18, 32, 8); }
  }
  g.restore();
  // supporters: lion and dragon
  g.fillStyle = '#d9ab3c'; g.beginPath(); g.ellipse(52, 150, 22, 50, -0.2, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(56, 92, 16, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#a51d22'; g.beginPath(); g.ellipse(204, 150, 22, 50, 0.2, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(200, 92, 16, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#3a2410'; g.font = 'bold 14px Georgia'; g.textAlign = 'center';
  g.fillText('DIEU ET MON DROIT', 128, 232);
  return toTexture(c, false);
}

export function sparkle() {
  const [c, g] = canvas(64, 64);
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 30);
  grad.addColorStop(0, 'rgba(255,255,230,1)');
  grad.addColorStop(0.25, 'rgba(255,220,110,0.9)');
  grad.addColorStop(1, 'rgba(255,200,60,0)');
  g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
  g.fillStyle = 'rgba(255,255,240,0.95)';
  g.beginPath(); g.moveTo(32, 0); g.lineTo(36, 28); g.lineTo(64, 32); g.lineTo(36, 36); g.lineTo(32, 64); g.lineTo(28, 36); g.lineTo(0, 32); g.lineTo(28, 28); g.closePath(); g.fill();
  return toTexture(c, false);
}
