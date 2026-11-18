// Low-poly Tudor characters built from simple shapes, plus matching 2D portraits for dialogue.
import * as THREE from '../vendor/three.module.min.js';
import { Builder } from './builder.js';
import * as TX from './textures.js';

const matCache = new Map();
function m(color) {
  if (!matCache.has(color)) matCache.set(color, new THREE.MeshLambertMaterial({ color }));
  return matCache.get(color);
}

const DEFAULT = {
  skin: '#e8c4a0', robe: '#333333', trim: '#c9a43b', legs: '#222222', hat: 'bonnet', hatColor: '#1a1a1a',
  hair: '#5a3a22', beard: null, female: false, long: false, width: 1, scale: 1, chain: false, apron: false, sleeves: null,
};

export function buildCharacter(lookIn) {
  const L = { ...DEFAULT, ...lookIn };
  const w = L.width;
  const B = new Builder();
  const skin = m(L.skin), robe = m(L.robe), trim = m(L.trim), sleeves = m(L.sleeves || L.robe);

  if (L.female) {
    B.cyl(0.24, 0.55, 1.2, 12, robe, 0, 0.6, 0);
    B.cyl(0.25, 0.27, 0.06, 12, trim, 0, 1.2, 0);
    B.cyl(0.19, 0.24, 0.32, 10, robe, 0, 1.37, 0);
    B.cyl(0.2, 0.2, 0.05, 10, trim, 0, 1.52, 0); // square neckline edge
    for (const s of [-1, 1]) {
      B.cyl(0.07, 0.17, 0.5, 8, sleeves, s * 0.27, 1.22, 0.02, { rotZ: s * 0.25 });
      B.sphere(0.055, skin, s * 0.33, 0.95, 0.05);
    }
  } else {
    if (L.long) {
      B.cyl(0.3 * w, 0.44 * w, 1.35, 10, robe, 0, 0.68, 0);
    } else {
      for (const s of [-1, 1]) B.cyl(0.08, 0.07, 0.8, 6, m(L.legs), s * 0.12, 0.4, 0);
      for (const s of [-1, 1]) B.box(0.14, 0.08, 0.26, m('#1a1410'), s * 0.12, 0.04, 0.05);
      B.cyl(0.3 * w, 0.4 * w, 0.42, 10, robe, 0, 0.92, 0); // skirts of the doublet
    }
    B.cyl(0.27 * w, 0.31 * w, 0.62, 10, robe, 0, 1.33, 0);
    B.cyl(0.24 * w, 0.26 * w, 0.06, 10, trim, 0, 1.07, 0); // belt
    if (L.apron) B.box(0.5, 0.75, 0.05, m('#efe8d8'), 0, 0.95, 0.3 * w);
    for (const s of [-1, 1]) {
      B.sphere(0.16, sleeves, s * 0.33 * w, 1.5, 0, 1.1 * w, 1, 1);
      B.cyl(0.08, 0.11, 0.62, 8, sleeves, s * (0.36 * w + 0.03), 1.13, 0.02, { rotZ: s * 0.12 });
      B.sphere(0.06, skin, s * (0.38 * w + 0.06), 0.8, 0.04);
    }
    if (L.gown) {
      // an open over-gown (fur-trimmed coat)
      B.cyl(0.33 * w, 0.46 * w, 1.05, 10, m(L.gown), 0, 1.0, -0.04);
      B.box(0.08, 1.0, 0.04, m(L.trim), -0.14 * w, 1.0, 0.33 * w);
      B.box(0.08, 1.0, 0.04, m(L.trim), 0.14 * w, 1.0, 0.33 * w);
    }
  }
  if (L.chain) B.cyl(0.29 * w, 0.33 * w, 0.06, 12, m('#d9ab3c'), 0, 1.55, 0.02, { rotX: 0.25 });

  // head
  B.cyl(0.06, 0.07, 0.12, 8, skin, 0, 1.66, 0);
  B.sphere(0.14, skin, 0, 1.8, 0, 1, 1.12, 1);
  B.sphere(0.02, m('#2a1a10'), -0.05, 1.83, 0.13);
  B.sphere(0.02, m('#2a1a10'), 0.05, 1.83, 0.13);
  if (L.beard) B.sphere(0.12, m(L.beard), 0, 1.72, 0.05, 1, 0.8, 0.9);
  if (!L.female && L.hair) B.sphere(0.145, m(L.hair), 0, 1.84, -0.03, 1, 0.9, 1);

  const hc = m(L.hatColor);
  switch (L.hat) {
    case 'bonnet': // flat Tudor cap
      B.cyl(0.24, 0.22, 0.07, 14, hc, 0.02, 1.98, 0);
      if (L.feather) B.sphere(0.08, m(L.feather), 0.18, 2.04, 0, 1.6, 0.6, 0.6);
      if (L.jewel) B.sphere(0.035, m('#d9ab3c'), 0, 1.99, 0.21);
      break;
    case 'cardinal': // square red cap
      B.box(0.27, 0.15, 0.27, hc, 0, 1.97, 0);
      B.box(0.06, 0.06, 0.06, hc, 0, 2.07, 0);
      break;
    case 'cap': // close-fitting cap
      B.sphere(0.15, hc, 0, 1.87, -0.01, 1.03, 0.75, 1.03);
      break;
    case 'chef':
      B.cyl(0.15, 0.13, 0.22, 10, m('#f3efe6'), 0, 2.0, 0);
      break;
    case 'french': // curved French hood worn by Anne Boleyn and Catherine Howard
      B.sphere(0.15, m(L.hair || '#3a2214'), 0, 1.84, -0.01, 1.02, 1, 1);
      B.cyl(0.17, 0.17, 0.05, 14, m('#d9ab3c'), 0, 1.9, -0.06, { rotX: -1.1 });
      B.box(0.3, 0.4, 0.06, hc, 0, 1.75, -0.16);
      break;
    case 'gable': // pointed English gable hood worn by Catherine of Aragon and Jane Seymour
      B.cone(0.21, 0.24, 4, hc, 0, 2.0, 0);
      B.box(0.06, 0.32, 0.06, m(L.trim), -0.15, 1.78, 0.08);
      B.box(0.06, 0.32, 0.06, m(L.trim), 0.15, 1.78, 0.08);
      B.box(0.32, 0.45, 0.06, hc, 0, 1.75, -0.14);
      break;
    case 'coif':
      B.sphere(0.155, m('#efe8d8'), 0, 1.84, -0.01, 1.05, 1, 1.05);
      break;
    case 'hood': // monk's hood
      B.sphere(0.17, hc, 0, 1.82, -0.04, 1.05, 1.05, 1.1);
      break;
    default:
      break;
  }

  const group = B.finish();
  group.scale.setScalar(L.scale);
  return group;
}

export function nameLabel(text) {
  const tex = TX.label(text);
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: true, transparent: true }));
  const h = 0.32;
  spr.scale.set((h * tex.userData.w) / tex.userData.h, h, 1);
  return spr;
}

export function markerSprite(symbol) {
  const tex = symbol === '?' ? TX.marker('?', '#dfe7f0') : TX.marker(symbol);
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
  spr.scale.set(0.5, 0.5, 1);
  spr.renderOrder = 10;
  return spr;
}

// A small painted portrait (data URL) for dialogue boxes.
const portraitCache = new Map();
export function portraitURL(lookIn, key) {
  if (lookIn && lookIn.photo) return `assets/img/${lookIn.photo}.jpg`; // a real Tudor portrait
  if (key && portraitCache.has(key)) return portraitCache.get(key);
  const L = { ...DEFAULT, ...lookIn };
  const c = document.createElement('canvas');
  c.width = c.height = 160;
  const g = c.getContext('2d');
  g.fillStyle = L.bg || '#2e4a3a';
  g.fillRect(0, 0, 160, 160);
  // body
  g.fillStyle = L.gown || L.robe;
  g.beginPath(); g.ellipse(80, 175, 70 * Math.min(L.width, 1.3), 70, 0, Math.PI, 0); g.fill();
  if (L.female) {
    g.fillStyle = L.skin; g.fillRect(56, 112, 48, 20);
    g.fillStyle = L.trim; g.fillRect(54, 130, 52, 6);
  }
  if (L.chain) { g.strokeStyle = '#d9ab3c'; g.lineWidth = 6; g.beginPath(); g.arc(80, 112, 40, 0.2, Math.PI - 0.2); g.stroke(); }
  // neck & face
  g.fillStyle = L.skin;
  g.fillRect(70, 92, 20, 22);
  g.beginPath(); g.ellipse(80, 72, 27, 33, 0, 0, Math.PI * 2); g.fill();
  if (!L.female && L.hair) { g.fillStyle = L.hair; g.beginPath(); g.ellipse(80, 56, 28, 18, 0, Math.PI, 0); g.fill(); }
  if (L.beard) { g.fillStyle = L.beard; g.beginPath(); g.ellipse(80, 92, 22, 16, 0, 0, Math.PI); g.fill(); }
  g.fillStyle = '#2a1a10';
  g.beginPath(); g.arc(70, 70, 3, 0, 7); g.arc(90, 70, 3, 0, 7); g.fill();
  g.strokeStyle = '#8a4a3a'; g.lineWidth = 2; g.beginPath(); g.arc(80, 86, 7, 0.3, Math.PI - 0.3); g.stroke();
  // hats
  g.fillStyle = L.hatColor;
  switch (L.hat) {
    case 'bonnet':
      g.beginPath(); g.ellipse(82, 44, 42, 13, -0.08, 0, Math.PI * 2); g.fill();
      if (L.feather) { g.fillStyle = L.feather; g.beginPath(); g.ellipse(112, 38, 18, 6, -0.4, 0, Math.PI * 2); g.fill(); }
      break;
    case 'cardinal': g.fillRect(56, 26, 48, 22); g.fillRect(76, 18, 8, 8); break;
    case 'cap': g.beginPath(); g.ellipse(80, 50, 30, 18, 0, Math.PI, 0); g.fill(); break;
    case 'chef': g.fillStyle = '#f3efe6'; g.fillRect(58, 12, 44, 36); break;
    case 'coif': g.fillStyle = '#efe8d8'; g.beginPath(); g.ellipse(80, 60, 32, 36, 0, Math.PI, 0); g.fill(); break;
    case 'hood': g.beginPath(); g.ellipse(80, 66, 38, 46, 0, Math.PI, 0); g.fill(); g.fillRect(42, 66, 14, 40); g.fillRect(104, 66, 14, 40); break;
    case 'french':
      g.fillRect(44, 50, 18, 70); g.fillRect(98, 50, 18, 70);
      g.beginPath(); g.ellipse(80, 50, 38, 26, 0, Math.PI, 0); g.fill();
      g.strokeStyle = '#d9ab3c'; g.lineWidth = 5; g.beginPath(); g.ellipse(80, 52, 30, 20, 0, Math.PI, 0); g.stroke();
      break;
    case 'gable':
      g.beginPath(); g.moveTo(42, 70); g.lineTo(80, 22); g.lineTo(118, 70); g.lineTo(118, 120); g.lineTo(106, 120); g.lineTo(106, 64); g.lineTo(80, 38); g.lineTo(54, 64); g.lineTo(54, 120); g.lineTo(42, 120); g.closePath(); g.fill();
      g.strokeStyle = L.trim; g.lineWidth = 4; g.beginPath(); g.moveTo(54, 64); g.lineTo(80, 38); g.lineTo(106, 64); g.stroke();
      break;
    default: break;
  }
  g.strokeStyle = '#c9a43b'; g.lineWidth = 10; g.strokeRect(0, 0, 160, 160);
  const url = c.toDataURL();
  if (key) portraitCache.set(key, url);
  return url;
}
