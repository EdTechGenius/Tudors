// Simple 3D models for the Tudor objects pupils can discover (the King's Inventory).
// Each model is built from basic shapes and merged into the palace geometry.
import * as THREE from '../vendor/three.module.min.js';

const cache = new Map();
const col = (c) => {
  if (!cache.has(c)) cache.set(c, new THREE.MeshLambertMaterial({ color: c }));
  return cache.get(c);
};

// Rotate a local offset (dx, dz) by the object's rotation.
function rot(o, dx, dz) {
  const r = o.rot || 0, c = Math.cos(r), s = Math.sin(r);
  return [o.pos[0] + dx * c + dz * s, o.pos[1] - dx * s + dz * c];
}

export function buildProp(B, M, o) {
  const r = o.rot || 0;
  const at = (dx, dz) => rot(o, dx, dz);
  const box = (w, h, d, m, dx, y, dz, extra = {}) => { const [x, z] = at(dx, dz); B.box(w, h, d, m, x, y, z, { rotY: r, ...extra }); };
  const cyl = (rt, rb, h, seg, m, dx, y, dz, extra = {}) => { const [x, z] = at(dx, dz); B.cyl(rt, rb, h, seg, m, x, y, z, extra); };
  const sph = (rad, m, dx, y, dz, sx = 1, sy = 1, sz = 1) => { const [x, z] = at(dx, dz); B.sphere(rad, m, x, y, z, sx, sy, sz); };
  const smallTable = (h = 0.8, w = 0.8, d = 0.6) => {
    box(w, 0.06, d, M.oak, 0, h, 0, { collide: true });
    for (const [lx, lz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) box(0.06, h, 0.06, M.darkWood, lx * (w / 2 - 0.06), h / 2, lz * (d / 2 - 0.06));
  };
  const wood = M.wood, gold = M.gold, iron = M.iron;

  switch (o.model) {
    case 'halberds': // a rack of the Yeomen's halberds
      box(1.6, 0.12, 0.25, wood, 0, 0.5, 0, { collide: true });
      box(1.6, 0.12, 0.25, wood, 0, 1.6, 0);
      for (let k = 0; k < 3; k++) {
        cyl(0.03, 0.03, 2.4, 5, M.darkWood, -0.5 + k * 0.5, 1.2, 0);
        box(0.05, 0.35, 0.3, iron, -0.5 + k * 0.5, 2.3, 0.05);
        box(0.03, 0.3, 0.03, iron, -0.5 + k * 0.5, 2.55, 0);
      }
      break;
    case 'racquet': // real tennis racquet and balls on a crate
      box(0.08, 0.02, 0.62, wood, 0, 1.03, 0, { rotY: r + 0.4 });
      sph(0.06, col(0xf2efe4), 0.25, 1.06, 0.15);
      sph(0.06, col(0xf2efe4), 0.35, 1.06, 0.05);
      { const [x, z] = at(-0.05, -0.15); B.cyl(0.16, 0.16, 0.02, 12, col(0xe8dcb0), x, 1.04, z); }
      break;
    case 'trencher': // a square wooden plate with bread and meat
      box(0.36, 0.03, 0.36, wood, 0, 0.93, 0);
      sph(0.1, M.straw, -0.05, 0.98, 0, 1.4, 0.5, 1);
      sph(0.07, col(0x7a3a1a), 0.08, 0.98, 0.06, 1.2, 0.6, 1);
      break;
    case 'saltcellar':
      cyl(0.09, 0.12, 0.1, 10, gold, 0, 1.12, 0);
      cyl(0.04, 0.05, 0.14, 8, gold, 0, 1.24, 0);
      cyl(0.11, 0.08, 0.08, 10, gold, 0, 1.35, 0);
      sph(0.06, col(0xffffff), 0, 1.4, 0, 1, 0.4, 1);
      break;
    case 'lute':
      box(0.45, 0.45, 0.45, wood, 0, 0.23, 0, { collide: true }); // stool
      sph(0.22, col(0xb07a3a), 0, 0.68, 0, 1, 1.25, 0.55);
      box(0.09, 0.42, 0.04, M.darkWood, 0, 1.08, 0.02);
      box(0.12, 0.1, 0.05, M.darkWood, 0, 1.32, -0.03);
      break;
    case 'subtlety': // a castle made of sugar and marchpane
      smallTable(0.85, 1.0, 0.8);
      box(0.6, 0.28, 0.45, col(0xf6efe0), 0, 1.02, 0);
      for (const [dx, dz] of [[-0.28, -0.2], [0.28, -0.2], [-0.28, 0.2], [0.28, 0.2]]) {
        cyl(0.07, 0.07, 0.42, 8, col(0xf6efe0), dx, 1.1, dz);
        { const [x, z] = at(dx, dz); B.cone(0.09, 0.14, 8, col(0xe58aa0), x, 1.38, z); }
      }
      box(0.04, 0.2, 0.12, col(0x2f6b3a), 0, 1.25, 0);
      break;
    case 'spicechest':
      box(0.8, 0.55, 0.5, col(0x6b3a1a), 0, 0.28, 0, { collide: true });
      box(0.82, 0.06, 0.52, gold, 0, 0.57, 0);
      for (let k = 0; k < 3; k++) cyl(0.06, 0.06, 0.12, 8, [col(0x5a2a10), col(0x2a1a0a), col(0xc0802a)][k], -0.22 + k * 0.22, 0.67, 0);
      break;
    case 'gamebirds': // birds hung up before cooking
      box(0.08, 0.08, 2, M.darkWood, 0, 2.6, 0);
      for (let k = 0; k < 4; k++) {
        cyl(0.01, 0.01, 0.4, 3, col(0x3a2a1a), 0, 2.4, -0.75 + k * 0.5);
        sph(0.16, [col(0x6b5a3a), col(0xeeeeee), col(0x4a5a3a), col(0x8a6a3a)][k], 0, 2.05, -0.75 + k * 0.5, 0.8, 1.4, 0.8);
      }
      break;
    case 'block': // chopping block and cleaver
      cyl(0.4, 0.45, 0.8, 10, col(0x8a5a32), 0, 0.4, 0, { collide: true });
      box(0.06, 0.02, 0.35, iron, 0.05, 0.82, 0, { rotY: r + 0.5 });
      box(0.04, 0.04, 0.2, M.darkWood, 0.15, 0.83, 0.2, { rotY: r + 0.5 });
      break;
    case 'priedieu': // a prayer desk with a Book of Hours
      box(0.7, 0.9, 0.12, M.oak, 0, 0.45, -0.15, { collide: true });
      box(0.7, 0.12, 0.35, M.oak, 0, 0.12, 0.15);
      box(0.7, 0.05, 0.3, M.oak, 0, 0.95, -0.12, { rotX: -0.4 });
      box(0.36, 0.05, 0.26, col(0x24407a), 0, 1.0, -0.12, { rotX: -0.4 });
      box(0.6, 0.12, 0.25, M.rugRed, 0, 0.24, 0.17);
      break;
    case 'rosary':
      for (let k = 0; k < 10; k++) {
        const a = (k / 10) * Math.PI * 2;
        sph(0.025, col(0x5a2a10), Math.cos(a) * 0.1, 0.73, Math.sin(a) * 0.1);
      }
      box(0.02, 0.1, 0.02, gold, 0, 0.68, 0.14);
      break;
    case 'candlestand':
      for (const dx of [-0.35, 0.35]) {
        cyl(0.18, 0.22, 0.06, 8, gold, dx, 0.03, 0);
        cyl(0.04, 0.05, 1.5, 6, gold, dx, 0.78, 0);
        cyl(0.07, 0.07, 0.35, 8, col(0xf4e9c8), dx, 1.7, 0);
      }
      break;
    case 'armour': // a suit of the King's armour on a stand
      box(0.8, 0.12, 0.8, M.darkWood, 0, 0.06, 0, { collide: true });
      for (const dx of [-0.13, 0.13]) cyl(0.08, 0.07, 0.85, 8, col(0xb8bcc2), dx, 0.55, 0);
      cyl(0.34, 0.3, 0.6, 10, col(0xb8bcc2), 0, 1.3, 0);
      cyl(0.32, 0.36, 0.25, 10, col(0xb8bcc2), 0, 0.95, 0);
      for (const dx of [-0.42, 0.42]) { sph(0.16, col(0xb8bcc2), dx, 1.55, 0); cyl(0.07, 0.07, 0.6, 8, col(0xb8bcc2), dx * 1.05, 1.15, 0); }
      sph(0.17, col(0xb8bcc2), 0, 1.85, 0, 1, 1.2, 1.1);
      box(0.22, 0.04, 0.05, col(0x222222), 0, 1.87, 0.17);
      box(0.2, 0.22, 0.04, gold, 0, 1.3, 0.3);
      break;
    case 'virginals': // a box-shaped keyboard instrument
      smallTable(0.7, 1.5, 0.55);
      box(1.4, 0.25, 0.5, col(0x2a4a2a), 0, 0.86, 0);
      box(0.9, 0.04, 0.14, col(0xf2efe4), 0, 0.99, 0.18);
      box(1.38, 0.02, 0.4, gold, 0, 1.0, -0.04);
      break;
    case 'closestool': // the King's private toilet, covered in velvet
      box(0.6, 0.5, 0.5, col(0x2a2a6a), 0, 0.25, 0, { collide: true });
      box(0.62, 0.06, 0.52, gold, 0, 0.53, 0);
      box(0.4, 0.04, 0.3, M.rugRed, 0, 0.57, 0.02);
      box(0.6, 0.45, 0.06, col(0x2a2a6a), 0, 0.8, -0.24);
      break;
    case 'chesstable':
      smallTable(0.75, 0.7, 0.7);
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) box(0.14, 0.01, 0.14, (i + j) % 2 ? col(0x222222) : col(0xf2efe4), -0.21 + i * 0.14, 0.79, -0.21 + j * 0.14);
      for (let k = 0; k < 4; k++) { cyl(0.03, 0.04, 0.12, 6, col(0xf2efe4), -0.21 + k * 0.14, 0.86, -0.21); cyl(0.03, 0.04, 0.12, 6, col(0x2a1a0a), -0.21 + k * 0.14, 0.86, 0.21); }
      break;
    case 'pomander':
      cyl(0.12, 0.18, 1.0, 8, M.darkWood, 0, 0.5, 0, { collide: true });
      cyl(0.22, 0.22, 0.04, 10, M.oak, 0, 1.02, 0);
      sph(0.07, gold, 0, 1.12, 0);
      box(0.01, 0.12, 0.01, gold, 0, 1.22, 0);
      break;
    case 'writingslope': // quill, inkpot and paper on a sloping desk
      smallTable(0.75, 0.8, 0.55);
      box(0.6, 0.12, 0.45, M.darkWood, 0, 0.84, 0, { rotX: 0.15 });
      box(0.4, 0.01, 0.3, M.paper, 0, 0.91, 0.02, { rotX: 0.15 });
      cyl(0.05, 0.06, 0.08, 8, iron, 0.27, 0.83, -0.12);
      box(0.015, 0.015, 0.36, col(0xf8f8f0), 0.27, 0.98, -0.08, { rotX: 0.9 });
      break;
    case 'sealset': // wax, a seal and a candle on the chest
      cyl(0.04, 0.04, 0.16, 6, M.rugRed, -0.15, 0.93, 0, { rotZ: Math.PI / 2 });
      cyl(0.05, 0.03, 0.14, 8, gold, 0.1, 0.92, 0);
      cyl(0.06, 0.06, 0.03, 10, gold, 0.1, 0.86, 0);
      cyl(0.03, 0.03, 0.18, 6, M.paper, 0.3, 0.94, 0.1);
      break;
    case 'hourglass':
      smallTable(0.75, 0.6, 0.5);
      cyl(0.12, 0.12, 0.03, 8, M.darkWood, 0, 0.8, 0);
      cyl(0.12, 0.12, 0.03, 8, M.darkWood, 0, 1.12, 0);
      { const [x, z] = at(0, 0); B.cone(0.09, 0.15, 10, col(0xe6d6a0), x, 0.89, z); }
      cyl(0.09, 0.01, 0.15, 10, col(0xdde8ee), 0, 1.03, 0);
      for (const [dx, dz] of [[-0.1, 0], [0.1, 0]]) cyl(0.01, 0.01, 0.32, 4, M.darkWood, dx, 0.96, dz);
      break;
    case 'countingboard': // a cloth marked with lines, with counters (jettons)
      smallTable(0.75, 0.9, 0.6);
      box(0.8, 0.01, 0.5, col(0x2f5a3a), 0, 0.785, 0);
      for (let k = 0; k < 4; k++) box(0.78, 0.005, 0.01, col(0xf2efe4), 0, 0.792, -0.18 + k * 0.12);
      for (let k = 0; k < 7; k++) cyl(0.025, 0.025, 0.01, 8, gold, -0.3 + (k % 4) * 0.15, 0.797, -0.12 + Math.floor(k / 4) * 0.24);
      break;
    case 'hornbook':
      box(0.45, 0.45, 0.45, wood, 0, 0.23, 0, { collide: true });
      box(0.2, 0.01, 0.26, M.oak, 0, 0.47, 0);
      box(0.15, 0.01, 0.18, M.paper, 0, 0.48, -0.02);
      box(0.05, 0.01, 0.1, M.oak, 0, 0.47, 0.17);
      break;
    case 'coins':
      smallTable(0.75, 0.6, 0.5);
      sph(0.1, col(0x6b3a1a), -0.1, 0.84, 0, 1, 0.8, 1);
      for (let k = 0; k < 6; k++) cyl(0.03, 0.03, 0.01, 10, col(0xc8c8c8), 0.05 + (k % 3) * 0.07, 0.79 + Math.floor(k / 3) * 0.012, 0.05 + (k % 2) * 0.05);
      break;
    case 'bowls':
      for (let k = 0; k < 4; k++) sph(0.12, col(0x5a3a1a), -0.4 + k * 0.28, 0.12, (k % 2) * 0.2, 1, 0.85, 1);
      sph(0.05, col(0xf2efe4), 0.9, 0.05, 0.1);
      break;
    case 'archery': // a straw target (butt) and a longbow
      box(1.4, 1.3, 0.5, M.straw, 0, 0.65, 0, { collide: true });
      { const [x, z] = at(0, 0.26); const g = new THREE.CircleGeometry(0.5, 20); g.rotateY(r); g.translate(x, 0.75, z); B.raw(g, col(0xf2efe4)); }
      { const [x, z] = at(0, 0.27); const g = new THREE.CircleGeometry(0.32, 20); g.rotateY(r); g.translate(x, 0.75, z); B.raw(g, col(0x24407a)); }
      { const [x, z] = at(0, 0.28); const g = new THREE.CircleGeometry(0.14, 20); g.rotateY(r); g.translate(x, 0.75, z); B.raw(g, M.gold); }
      box(0.04, 1.8, 0.04, wood, 0.95, 0.9, 0.3, { rotZ: 0.15 });
      box(0.01, 1.7, 0.01, col(0xf2efe4), 0.85, 0.9, 0.3, { rotZ: 0.15 });
      break;
    case 'falcon': // a hawk on its perch
      cyl(0.04, 0.05, 1.2, 6, M.darkWood, 0, 0.6, 0);
      box(0.5, 0.06, 0.06, M.darkWood, 0, 1.2, 0);
      sph(0.14, col(0x6b5a4a), 0, 1.38, 0, 0.9, 1.3, 0.9);
      sph(0.08, col(0x8a7a6a), 0, 1.6, 0.03);
      { const [x, z] = at(0, 0.11); B.cone(0.03, 0.06, 4, M.gold, x, 1.59, z); }
      break;
    case 'skep': // a straw beehive
      cyl(0.3, 0.3, 0.6, 8, M.darkWood, 0, 0.3, 0, { collide: true });
      sph(0.33, M.straw, 0, 0.78, 0, 1, 1.1, 1);
      for (let k = 0; k < 3; k++) cyl(0.335 - k * 0.04, 0.335 - k * 0.04, 0.03, 12, col(0xa88a3a), 0, 0.72 + k * 0.12, 0);
      break;
    case 'herbbasket':
      cyl(0.28, 0.2, 0.3, 10, col(0x9a7a4a), 0, 0.15, 0, { collide: true });
      for (let k = 0; k < 6; k++) box(0.04, 0.32, 0.04, [col(0x8a7ab8), col(0x4a7a3a)][k % 2], -0.12 + (k % 3) * 0.12, 0.42, -0.06 + Math.floor(k / 3) * 0.12);
      break;
    default:
      break;
  }
}
