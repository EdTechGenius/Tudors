// Builds a simplified, low-poly Hampton Court Palace.
// Layout (x = east, z = south, 1 unit ≈ 1 metre):
//   Base Court (west) → Anne Boleyn's Gateway → Clock Court
//   North of Clock Court: Great Hall, Chapel Royal; behind the Hall: Great Kitchens
//   East of Clock Court: the King's Apartments (Presence Chamber, Privy Chamber)
//   South of Clock Court: the Advisor's Study; south-east: the Privy Garden by the River Thames
import * as THREE from '../vendor/three.module.min.js';
import { Builder } from './builder.js';
import { buildProp } from './props.js';
import * as TX from './textures.js';

export const AREAS = [
  { id: 'westfront', name: 'The West Front', x1: -97, z1: -30, x2: -60, z2: 30, kind: 'outside', photo: 'westfront',
    blurb: 'The grand entrance. Visitors crossed the moat by a bridge lined with stone beasts holding the King\'s coats of arms, then passed through the Great Gatehouse.' },
  { id: 'base', photo: 'basecourt', name: 'Base Court', x1: -60, z1: -15, x2: -30, z2: 15, kind: 'court',
    blurb: 'The first courtyard visitors enter. Its rooms were lodgings for courtiers — Hampton Court had over 1,000 rooms!' },
  { id: 'clock', photo: 'clock', name: 'Clock Court', x1: -30, z1: -15, x2: 26, z2: 15, kind: 'court',
    blurb: 'The inner courtyard at the heart of the palace. Its gateway is called Anne Boleyn\'s Gateway.' },
  { id: 'hall', photo: 'greathall', name: 'Great Hall', x1: -24, z1: -35, x2: 6, z2: -15, kind: 'room',
    blurb: 'Where hundreds of courtiers ate together. Henry VIII rebuilt it between 1532 and 1535 with a magnificent hammerbeam roof.' },
  { id: 'kitchens', photo: 'kitchen', name: 'Great Kitchens', x1: -24, z1: -55, x2: 6, z2: -35, kind: 'room',
    blurb: 'Over 200 people worked here, cooking two meals a day for around 600 people at court.' },
  { id: 'chapel', photo: 'chapel', name: 'Chapel Royal', x1: 6, z1: -35, x2: 26, z2: -15, kind: 'room',
    blurb: 'The King\'s own chapel, with a ceiling painted blue and covered in golden stars.' },
  { id: 'presence', photo: 'armour', name: 'Presence Chamber', x1: 26, z1: -15, x2: 38, z2: 15, kind: 'room',
    blurb: 'Where important visitors waited to be "in the presence" of the King.' },
  { id: 'privy', photo: 'henry', name: 'Privy Chamber', x1: 38, z1: -15, x2: 50, z2: 15, kind: 'room',
    blurb: 'The King\'s private rooms. Only his closest servants and advisors were allowed in.' },
  { id: 'gallery', name: 'The Long Gallery', x1: -30, z1: 15, x2: -6, z2: 27, kind: 'room',
    blurb: 'Tudor palaces had long galleries where people could walk, talk and admire paintings, especially on rainy days. Tap a portrait to look at it closely. Hampton Court\'s real "Haunted Gallery" is said to be haunted by the ghost of Catherine Howard!' },
  { id: 'study', name: 'Your Study', x1: -6, z1: 15, x2: 10, z2: 27, kind: 'room',
    blurb: 'Your private office, with your writing desk. Come here to write letters.' },
  { id: 'garden', photo: 'privygarden', name: 'Privy Garden', x1: 26, z1: 15, x2: 60, z2: 50, kind: 'garden',
    blurb: 'The King\'s private garden beside the River Thames, with painted posts topped by heraldic beasts.' },
];

// Wall segments for the map (filled in as walls are built).
export const MAP_WALLS = [];

function mat(map, opts = {}) {
  return new THREE.MeshLambertMaterial({ map, ...opts });
}

export function buildWorld(scene, era) {
  const B = new Builder();
  const dynamic = new THREE.Group(); // things that animate or change
  const anchors = {}; // named positions used by chapters
  MAP_WALLS.length = 0;

  const M = {
    brick: mat(TX.brick()),
    stone: mat(TX.stone()),
    darkStone: mat(TX.stone('#9b9282', 8)),
    panel: mat(TX.panelling()),
    wash: mat(TX.whitewash()),
    boards: mat(TX.boards()),
    cobbles: mat(TX.cobbles()),
    grass: mat(TX.grass()),
    gravel: mat(TX.gravel()),
    chapelCeil: mat(TX.chapelCeiling()),
    water: mat(TX.water()),
    stripes: mat(TX.stripes()),
    wood: new THREE.MeshLambertMaterial({ color: 0x6b4426 }),
    darkWood: new THREE.MeshLambertMaterial({ color: 0x3e2614 }),
    oak: new THREE.MeshLambertMaterial({ color: 0x8a5a32 }),
    gold: new THREE.MeshLambertMaterial({ color: 0xd9ab3c, emissive: 0x3a2800 }),
    red: new THREE.MeshLambertMaterial({ color: 0x8e1f22 }),
    green: new THREE.MeshLambertMaterial({ color: 0x2f6b3a }),
    hedge: new THREE.MeshLambertMaterial({ color: 0x2e5a26 }),
    leaf: new THREE.MeshLambertMaterial({ color: 0x3d6e2c }),
    lead: new THREE.MeshLambertMaterial({ color: 0x5d6168 }),
    glass: new THREE.MeshLambertMaterial({ map: TX.leaded(false), emissive: 0x0d1720 }),
    glassLit: new THREE.MeshBasicMaterial({ map: TX.leaded(true) }),
    stained: new THREE.MeshBasicMaterial({ map: TX.stainedGlass(3) }),
    chimney: mat(TX.chimneyBrick()),
    terracotta: new THREE.MeshLambertMaterial({ color: 0xb5683f }),
    beastStone: new THREE.MeshLambertMaterial({ color: 0xd8d0be }),
    soot: new THREE.MeshBasicMaterial({ color: 0x1a1410 }),
    cloth: new THREE.MeshLambertMaterial({ color: 0xd8cfb8 }),
    iron: new THREE.MeshLambertMaterial({ color: 0x2b2b2e }),
    straw: new THREE.MeshLambertMaterial({ color: 0xcfae5a }),
    paper: new THREE.MeshLambertMaterial({ color: 0xf1e6c6 }),
    rugRed: new THREE.MeshLambertMaterial({ color: 0x7b1d26 }),
    blue: new THREE.MeshLambertMaterial({ color: 0x24407a }),
  };

  // ---------- Walls ----------
  // wall(x1,z1,x2,z2): axis-aligned. neg/pos = material on the -z/+z (or -x/+x) face.
  function wall(x1, z1, x2, z2, o = {}) {
    const { h = 10, t = 0.8, neg = M.brick, pos = M.brick, doors = [], battlements = false,
      win = null, winLit = null } = o;
    const horiz = z1 === z2;
    const a = horiz ? Math.min(x1, x2) : Math.min(z1, z2);
    const b = horiz ? Math.max(x1, x2) : Math.max(z1, z2);
    const fixed = horiz ? z1 : x1;
    const mats = horiz ? [neg, neg, M.stone, M.stone, pos, neg] : [pos, neg, M.stone, M.stone, neg, neg];
    const sorted = [...doors].sort((p, q) => p[0] - q[0]);
    let cur = a;
    const segs = [];
    for (const [d1, d2, dh] of sorted) {
      if (d1 > cur) segs.push([cur, d1, 0, h]);
      segs.push([d1, d2, dh, h]); // lintel above the doorway
      cur = d2;
    }
    if (cur < b) segs.push([cur, b, 0, h]);
    for (const [s1, s2, y1, y2] of segs) {
      const L = s2 - s1, mid = (s1 + s2) / 2, H = y2 - y1;
      if (L <= 0.01 || H <= 0.01) continue;
      if (horiz) B.box(L, H, t, mats, mid, y1 + H / 2, fixed, { uv: 4, collide: y1 === 0 });
      else B.box(t, H, L, mats, fixed, y1 + H / 2, mid, { uv: 4, collide: y1 === 0 });
      if (y1 === 0) MAP_WALLS.push(horiz ? [s1, fixed, s2, fixed] : [fixed, s1, fixed, s2]);
    }
    if (battlements) {
      for (let p = a + 0.6; p < b - 0.4; p += 1.7) {
        if (horiz) B.box(0.85, 0.9, t + 0.1, M.brick, p, h + 0.45, fixed, { uv: 4 });
        else B.box(t + 0.1, 0.9, 0.85, M.brick, fixed, h + 0.45, p, { uv: 4 });
      }
    }
    const addWins = (cfg, lit) => {
      if (!cfg) return;
      const { side = 'pos', ys = [3, 7], every = 5, w = 1.5, hh = 2, glass } = cfg;
      const sgn = side === 'pos' ? 1 : -1;
      for (let p = a + every / 2; p < b - 1; p += every) {
        if (doors.some(([d1, d2]) => p > d1 - 1.6 && p < d2 + 1.6)) continue;
        for (const y of ys) windowAt(horiz, p, fixed + sgn * (t / 2), y, w, hh, sgn, glass || (lit ? M.glassLit : M.glass));
      }
    };
    addWins(win, false);
    addWins(winLit, true);
  }

  function windowAt(horiz, p, f, y, w, h, sgn, glassMat) {
    const off = sgn * 0.07;
    if (horiz) {
      B.box(w + 0.35, h + 0.35, 0.12, M.stone, p, y, f + off * 0.5);
      B.box(w, h, 0.05, glassMat, p, y, f + off * 1.3, { uv: glassMat === M.stained ? w : 0.45 });
      B.box(0.1, h, 0.08, M.stone, p, y, f + off * 1.6);
      B.box(w, 0.1, 0.08, M.stone, p, y + h * 0.15, f + off * 1.6);
    } else {
      B.box(0.12, h + 0.35, w + 0.35, M.stone, f + off * 0.5, y, p);
      B.box(0.05, h, w, glassMat, f + off * 1.3, y, p, { uv: glassMat === M.stained ? w : 0.45 });
      B.box(0.08, h, 0.1, M.stone, f + off * 1.6, y, p);
      B.box(0.08, 0.1, w, M.stone, f + off * 1.6, y + h * 0.15, p);
    }
  }

  const courtWin = { ys: [3.2, 7], every: 5 };
  // Base Court
  wall(-60, -15, -30, -15, { battlements: true, win: { ...courtWin, side: 'pos' } });
  wall(-60, 15, -30, 15, { battlements: true, win: { ...courtWin, side: 'neg' } });
  wall(-60, -15, -60, 15, { h: 11, battlements: true, doors: [[-3, 3, 6]], win: { side: 'neg', ys: [3.2, 7.4], every: 5 } });
  // Wings of the West Front (seen from outside)
  wall(-60, -30, -60, -15, { battlements: true, win: { side: 'neg', ys: [3.2, 7], every: 4.2 } });
  wall(-60, 15, -60, 30, { battlements: true, win: { side: 'neg', ys: [3.2, 7], every: 4.2 } });
  wall(-60, -30, -46, -30, { battlements: true, win: { side: 'neg', ys: [3.2, 7], every: 4.6 } });
  wall(-60, 30, -46, 30, { battlements: true, win: { side: 'pos', ys: [3.2, 7], every: 4.6 } });
  // Anne Boleyn's Gateway
  wall(-30, -15, -30, 15, { h: 12, battlements: true, doors: [[-3, 3, 6]], win: { side: 'neg', ys: [9], every: 6 } });
  // Clock Court north side
  wall(-30, -15, -24, -15, { battlements: true });
  wall(-24, -15, 6, -15, { h: 15, neg: M.panel, doors: [[-14, -10, 4.5]],
    win: { side: 'pos', ys: [10.5], every: 4.2, w: 1.6, hh: 3.4 }, winLit: { side: 'neg', ys: [10.5], every: 4.2, w: 1.6, hh: 3.4, glass: M.stained } });
  wall(6, -15, 26, -15, { h: 12, neg: M.wash, doors: [[14, 18, 4.5]], battlements: true,
    win: { side: 'pos', ys: [6.5], every: 4.5, w: 1.4, hh: 3 }, winLit: { side: 'neg', ys: [6.5], every: 4.5, w: 1.4, hh: 3, glass: M.stained } });
  // Hall / kitchens / chapel back walls
  wall(-24, -35, 6, -35, { h: 15, neg: M.wash, pos: M.panel, doors: [[-20, -17, 3.5]],
    winLit: { side: 'pos', ys: [10.5], every: 4.2, w: 1.6, hh: 3.4 } });
  wall(6, -35, 26, -35, { h: 12, pos: M.wash, winLit: { side: 'pos', ys: [6.5], every: 4.5, w: 1.4, hh: 3, glass: M.stained } });
  wall(-24, -55, 6, -55, { pos: M.wash });
  wall(-24, -35, -24, -15, { h: 15, pos: M.panel });
  wall(-24, -55, -24, -35, { pos: M.wash, winLit: { side: 'pos', ys: [5.5], every: 5 } });
  wall(6, -35, 6, -15, { h: 15, neg: M.panel, pos: M.wash });
  wall(6, -55, 6, -35, { neg: M.wash });
  wall(26, -35, 26, -15, { h: 12, neg: M.wash, winLit: { side: 'neg', ys: [5.5], every: 6, w: 2.2, hh: 4, glass: M.stained } });
  // Clock Court south side and the study
  wall(-30, 15, -6, 15, { pos: M.panel, doors: [[-19.5, -16.5, 3.2]], battlements: true, win: { ...courtWin, side: 'neg', ys: [7] } });
  // The Long Gallery
  wall(-30, 27, -6, 27, { neg: M.panel, winLit: { side: 'neg', ys: [4.05], every: 3.9, w: 1.3, hh: 0.8 } });
  wall(-30, 15, -30, 27, { pos: M.panel });
  wall(-6, 15, 10, 15, { pos: M.panel, doors: [[0, 3, 3.2]], battlements: true, win: { ...courtWin, side: 'neg', ys: [7] } });
  wall(10, 15, 26, 15, { battlements: true, win: { ...courtWin, side: 'neg' } });
  wall(-6, 27, 10, 27, { neg: M.panel, winLit: { side: 'neg', ys: [2.6], every: 5, w: 1.3, hh: 1.6 } });
  wall(-6, 15, -6, 27, { neg: M.panel, pos: M.panel });
  wall(10, 15, 10, 27, { neg: M.panel, winLit: { side: 'neg', ys: [2.6], every: 6, w: 1.3, hh: 1.6 } });
  // King's apartments
  wall(26, -15, 26, 15, { pos: M.panel, doors: [[-2, 2, 3.5]], battlements: true, win: { ...courtWin, side: 'neg' } });
  wall(26, -15, 50, -15, { pos: M.panel });
  wall(26, 15, 50, 15, { neg: M.panel, doors: [[41.5, 44.5, 3.2]], win: { side: 'pos', ys: [3.2], every: 5 }, winLit: { side: 'neg', ys: [3.2], every: 5, w: 1.4, hh: 1.8 } });
  wall(50, -15, 50, 15, { neg: M.panel, winLit: { side: 'neg', ys: [3.2], every: 5, w: 1.4, hh: 1.8 } });
  wall(38, -15, 38, 15, { neg: M.panel, pos: M.panel, doors: [[-1.5, 1.5, 3]] });
  // Privy Garden walls
  wall(50, 15, 60, 15, { h: 3 });
  wall(26, 15, 26, 50, { h: 3 });
  wall(60, 15, 60, 50, { h: 3 });
  wall(26, 50, 60, 50, { h: 1.1, t: 0.6 });

  // ---------- Floors, ground, sky ----------
  // ground, with a gap for the moat in front of the West Front
  B.plane(74, 200, M.grass, -113, 0, -49.5, { rotX: -Math.PI / 2, uv: 6 });
  B.plane(216, 200, M.grass, 42, 0, -49.5, { rotX: -Math.PI / 2, uv: 6 });
  B.plane(10, 119.5, M.grass, -71, 0, -89.75, { rotX: -Math.PI / 2, uv: 6 });
  B.plane(10, 20.5, M.grass, -71, 0, 40.25, { rotX: -Math.PI / 2, uv: 6 });
  // the moat
  B.plane(10, 60, M.water, -71, -1.1, 0, { rotX: -Math.PI / 2, uv: 6 });
  B.box(0.6, 1.6, 60, M.stone, -76.3, -0.8, 0, { uv: 2 });
  B.box(0.6, 1.6, 60, M.stone, -65.7, -0.8, 0, { uv: 2 });
  B.box(10, 1.6, 0.6, M.stone, -71, -0.8, -30.3, { uv: 2 });
  B.box(10, 1.6, 0.6, M.stone, -71, -0.8, 30.3, { uv: 2 });
  B.collider(-71, -16.5, 10.6, 27);
  B.collider(-71, 16.5, 10.6, 27);
  // the bridge, lined with the King's Beasts
  B.box(10.6, 0.5, 6.4, M.stone, -71, -0.24, 0, { uv: 2 });
  B.box(10, 0.04, 5.6, M.gravel, -71, 0.03, 0, { uv: 3 });
  for (let k = 0; k < 3; k++) B.box(0.9, 1.1, 6, M.stone, -74 + k * 3, -0.9, 0); // arches' piers
  for (const sz of [-3.1, 3.1]) {
    B.box(10.6, 0.9, 0.4, M.stone, -71, 0.45, sz, { collide: true, uv: 2 });
    for (let k = 0; k < 5; k++) kingsBeast(-75.2 + k * 2.1, sz, k + (sz > 0 ? 5 : 0));
  }
  B.plane(36, 6, M.gravel, -78.5, 0.02, 0, { rotX: -Math.PI / 2, uv: 3 });
  // boundary hedges of the outer green
  B.box(0.9, 1.3, 60, M.hedge, -96.5, 0.65, 0, { collide: true });
  B.box(36, 1.3, 0.9, M.hedge, -78.5, 0.65, -30.5, { collide: true });
  B.box(36, 1.3, 0.9, M.hedge, -78.5, 0.65, 30.5, { collide: true });
  B.collider(-63, -30.5, 6, 1); B.collider(-63, 30.5, 6, 1);

  function kingsBeast(x, z, k) {
    const cols = [[0xd9ab3c, 0xa51d22], [0x24407a, 0xd9ab3c], [0xa51d22, 0xf2efe4], [0x2f6b3a, 0xf2efe4], [0xd9ab3c, 0x24407a]];
    const [c1, c2] = cols[k % 5];
    B.box(0.8, 0.6, 0.8, M.stone, x, 1.2, z);
    B.box(0.55, 0.9, 0.5, M.beastStone, x, 1.95, z); // body (sitting)
    B.sphere(0.24, M.beastStone, x, 2.55, z - Math.sign(z) * 0.05);
    B.box(0.12, 0.18, 0.2, M.beastStone, x - 0.1, 2.78, z); B.box(0.12, 0.18, 0.2, M.beastStone, x + 0.1, 2.78, z); // ears
    // shield held in front
    const sz = z - Math.sign(z) * 0.32;
    B.box(0.5, 0.62, 0.06, new THREE.MeshLambertMaterial({ color: c1 }), x, 1.95, sz);
    B.box(0.24, 0.3, 0.07, new THREE.MeshLambertMaterial({ color: c2 }), x + 0.12, 2.1, sz);
  }
  B.plane(300, 120, M.water, 0, -0.25, 110.5, { rotX: -Math.PI / 2, uv: 8 });
  B.plane(30, 30, M.cobbles, -45, 0.02, 0, { rotX: -Math.PI / 2, uv: 4 });
  B.plane(56, 30, M.cobbles, -2, 0.02, 0, { rotX: -Math.PI / 2, uv: 4 });
  B.plane(30, 20, M.stone, -9, 0.02, -25, { rotX: -Math.PI / 2, uv: 3 });
  B.plane(30, 20, M.darkStone, -9, 0.02, -45, { rotX: -Math.PI / 2, uv: 3 });
  B.plane(20, 20, M.stone, 16, 0.02, -25, { rotX: -Math.PI / 2, uv: 2 });
  B.plane(24, 30, M.boards, 38, 0.02, 0, { rotX: -Math.PI / 2, uv: 3 });
  B.plane(16, 12, M.boards, 2, 0.02, 21, { rotX: -Math.PI / 2, uv: 3 });
  B.plane(24, 12, M.boards, -18, 0.02, 21, { rotX: -Math.PI / 2, uv: 3 });
  B.box(20, 0.02, 2.4, M.rugRed, -18, 0.04, 21);
  // garden paths
  B.plane(3, 35, M.gravel, 43, 0.03, 32.5, { rotX: -Math.PI / 2, uv: 3 });
  B.plane(34, 3, M.gravel, 43, 0.031, 32, { rotX: -Math.PI / 2, uv: 3 });
  B.plane(34, 2.5, M.gravel, 43, 0.03, 48.5, { rotX: -Math.PI / 2, uv: 3 });

  // ---------- Ceilings and the Great Hall roof ----------
  const down = Math.PI / 2;
  B.plane(30, 20, M.wash, -9, 8, -45, { rotX: down, uv: 4 });
  B.plane(20, 20, M.chapelCeil, 16, 9, -25, { rotX: down, uv: 5 });
  B.plane(24, 30, M.wash, 38, 6, 0, { rotX: down, uv: 4 });
  B.plane(16, 12, M.wash, 2, 4.5, 21, { rotX: down, uv: 4 });
  B.plane(24, 12, M.wash, -18, 5, 21, { rotX: down, uv: 4 });
  for (let x = -28; x < -6; x += 2.4) B.box(0.3, 0.3, 12, M.darkWood, x, 4.85, 21);
  for (const bx of [-24, -12]) B.box(1.8, 0.45, 0.6, M.oak, bx, 0.23, 21, { collide: true }); // benches for admiring the paintings
  for (let x = -22; x < 6; x += 3) B.box(0.35, 0.4, 20, M.darkWood, x, 7.8, -45);
  for (let x = 28; x < 50; x += 3) B.box(0.3, 0.3, 30, M.darkWood, x, 5.85, 0);
  for (let x = -4; x < 10; x += 3) B.box(0.3, 0.3, 12, M.darkWood, x, 4.35, 21);
  // Chapel ribs
  for (let x = 8; x < 26; x += 4) B.box(0.3, 0.3, 20, M.gold, x, 8.85, -25);

  // Hall roof: two sloping sides and gable ends
  const slope = Math.atan2(5.5, 10);
  const roofMat = new THREE.MeshLambertMaterial({ color: 0x4a2f1a, side: THREE.DoubleSide });
  B.box(31, 0.3, 11.6, roofMat, -9, 15.75, -30, { rotX: -slope });
  B.box(31, 0.3, 11.6, roofMat, -9, 15.75, -20, { rotX: slope });
  for (const gx of [-24, 6]) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([gx, 13, -35, gx, 13, -15, gx, 18.6, -25], 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute([1, 0, 0, 1, 0, 0, 1, 0, 0], 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 5, 0, 2.5, 1.4], 2));
    B.raw(g, new THREE.MeshLambertMaterial({ map: M.brick.map, side: THREE.DoubleSide }));
  }
  // Hammerbeam trusses
  if (era.greatHall !== 'building') {
    for (let x = -21; x <= 3; x += 4) {
      for (const s of [-1, 1]) {
        const zw = -25 + s * 9.6;
        B.box(0.4, 0.5, 2.8, M.darkWood, x, 11.2, zw - s * 1.4);
        B.box(0.35, 3, 0.35, M.darkWood, x, 12.6, zw - s * 2.6);
        B.cone(0.25, 0.8, 6, M.gold, x, 10.6, zw - s * 2.6);
        B.box(0.3, 0.3, 4.2, M.darkWood, x, 14.6, zw - s * 4.4, { rotX: s * slope });
      }
      B.box(0.4, 0.4, 6, M.darkWood, x, 16.2, -25);
    }
  } else {
    // 1529–32: the old hall is being rebuilt. Scaffolding everywhere!
    for (let x = -20; x <= 4; x += 4) {
      for (const z of [-33, -17]) B.box(0.18, 13, 0.18, M.oak, x, 6.5, z);
      for (const y of [4, 8, 12]) {
        B.box(4.2, 0.12, 1.2, M.oak, x + 2, y, -33);
        B.box(4.2, 0.12, 1.2, M.oak, x + 2, y, -17);
      }
    }
    B.box(2, 0.6, 1, M.stone, -6, 0.3, -25, { collide: true });
    B.box(1.4, 0.6, 1, M.stone, -4, 0.3, -27, { collide: true });
  }

  // ---------- Gatehouses, turrets, chimneys ----------
  function turret(x, z, h, r = 1.6) {
    B.cyl(r, r, h, 8, M.brick, x, h / 2, z, { collide: true, uv: 4 });
    B.cyl(r + 0.15, r + 0.15, 0.4, 8, M.stone, x, h, z);
    B.cone(r * 0.9, 2.2, 8, M.lead, x, h + 1.3, z);
    B.sphere(0.25, M.gold, x, h + 2.5, z);
  }
  turret(-60, -4.6, 15); turret(-60, 4.6, 15);
  turret(-30, -4.6, 16); turret(-30, 4.6, 16);
  // the great west gate, standing open
  B.box(2.9, 5.6, 0.2, M.oak, -58.5, 2.8, -3.3, { rotY: -0.25 });
  B.box(2.9, 5.6, 0.2, M.oak, -58.5, 2.8, 3.3, { rotY: 0.25 });
  B.box(0.25, 1.4, 1.4, M.gold, -59.4, 7.0, 0); // Tudor rose plaque (inside)
  B.box(0.5, 0.6, 6.4, M.stone, -60, 6.3, 0); // arch moulding
  // Henry VIII's coat of arms above the outside of the gate, and an oriel window
  const armsMat = new THREE.MeshLambertMaterial({ map: TX.royalArms() });
  B.box(0.15, 2.2, 2.2, M.stone, -60.5, 7.9, 0);
  const arms = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), armsMat);
  arms.position.set(-60.6, 7.9, 0); arms.rotation.y = -Math.PI / 2; dynamic.add(arms);
  B.box(1.3, 2.6, 3.6, M.stone, -61, 10.4, 0);
  for (const oz of [-1.1, 0, 1.1]) B.box(0.05, 2, 0.9, M.glass, -61.67, 10.4, oz, { uv: 0.45 });
  B.box(1.5, 0.3, 3.8, M.stone, -61, 11.8, 0);
  anchors.westGate = [-57, 0];

  if (era.clock) {
    const clock = new THREE.Mesh(new THREE.CircleGeometry(1.5, 32), new THREE.MeshLambertMaterial({ map: TX.clockFace() }));
    clock.position.set(-29.5, 10.1, 0);
    clock.rotation.y = Math.PI / 2;
    dynamic.add(clock);
    B.box(0.2, 3.4, 3.4, M.stone, -29.65, 10.1, 0);
  }
  // Wolsey's terracotta coat of arms above the arch on the Clock Court side
  const wa = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.9), new THREE.MeshLambertMaterial({ map: TX.wolseyArms() }));
  wa.position.set(-29.52, 7.35, 0); wa.rotation.y = Math.PI / 2; dynamic.add(wa);
  B.box(0.12, 2.1, 2.1, M.terracotta, -29.6, 7.35, 0);
  // Bell turret on top of Anne Boleyn's Gateway
  B.box(2.6, 0.5, 2.6, M.stone, -30, 12.25, 0);
  for (const [dx, dz] of [[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9]]) B.box(0.22, 1.8, 0.22, M.stone, -30 + dx, 13.4, dz);
  B.sphere(0.45, M.gold, -30, 13.3, 0, 1, 1.1, 1);
  B.box(2.4, 0.25, 2.4, M.lead, -30, 14.4, 0);
  B.cone(1.35, 1.8, 8, M.lead, -30, 15.4, 0);
  B.cyl(0.04, 0.04, 1.2, 4, M.gold, -30, 16.8, 0);
  B.box(0.04, 0.4, 0.6, M.gold, -30, 17.1, 0.2);
  // Terracotta roundels of Roman emperors on the gateway turrets
  const rMats = [0, 1, 2, 3, 4, 5].map((i) => new THREE.MeshLambertMaterial({ map: TX.roundel(i) }));
  let ri = 0;
  for (const [tx, tz, face] of [[-30, -4.6, -1], [-30, 4.6, -1], [-30, -4.6, 1], [-30, 4.6, 1], [-60, -4.6, 1], [-60, 4.6, 1]]) {
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.75, 24), rMats[ri++ % 6]);
    disc.position.set(tx + face * 1.63, 8, tz);
    disc.rotation.y = face * Math.PI / 2;
    dynamic.add(disc);
  }

  // Hampton Court's famous decorated brick chimneys
  function chimney(x, z, base, n = 2) {
    B.box(n * 0.8 + 0.3, 0.8, 1.1, M.brick, x + (n - 1) * 0.4, base + 0.4, z, { uv: 4 });
    for (let i = 0; i < n; i++) {
      const cx = x + i * 0.8;
      B.cyl(0.3, 0.3, 3.4, 8, M.chimney, cx, base + 2.5, z, { uv: 1.2 });
      B.cyl(0.42, 0.34, 0.25, 8, M.brick, cx, base + 1.0, z, { uv: 2 });
      B.cyl(0.46, 0.36, 0.45, 8, M.brick, cx, base + 4.35, z, { uv: 2 });
      B.cyl(0.5, 0.5, 0.12, 8, M.stone, cx, base + 4.6, z);
    }
  }
  [[-55, -15], [-45, -15], [-36, -15], [-52, 15], [-40, 15], [-26, -15], [-20, 15], [-10, 15], [18, 15], [12, -35],
    [-10, -55], [-18, -55], [30, -15], [44, -15], [-60, 10], [-60, -22], [-60, 22], [-60, -27], [-52, -30], [-52, 30], [-33, 15], [8, 15]].forEach(([x, z]) => chimney(x - 0.4, z, z === -55 || x === -60 ? 10 : 10, 2 + (Math.abs(x) % 2)));

  // ---------- Base Court ----------
  // Wine fountain
  B.cyl(2, 2.2, 0.8, 8, M.stone, -45, 0.4, 0, { collide: true });
  B.cyl(0.4, 0.5, 2.4, 8, M.stone, -45, 1.6, 0);
  B.cyl(1, 0.6, 0.4, 8, M.gold, -45, 2.9, 0);
  B.cyl(0.18, 0.18, 0.8, 6, M.gold, -45, 3.4, 0);
  B.sphere(0.35, M.gold, -45, 4, 0);
  // cart and barrels
  B.box(3, 0.3, 1.6, M.wood, -52, 0.9, -10, { collide: true });
  B.cyl(0.6, 0.6, 0.15, 10, M.darkWood, -51, 0.6, -10.9, { rotX: Math.PI / 2 });
  B.cyl(0.6, 0.6, 0.15, 10, M.darkWood, -51, 0.6, -9.1, { rotX: Math.PI / 2 });
  B.box(1.2, 0.8, 1.2, M.straw, -53, 1.45, -10);
  barrel(-49, -12.8); barrel(-48, -12.6); barrel(-48.6, -11.8);
  barrel(-36, 12.5); barrel(-35, 12.8);
  // Green and white Tudor banners
  for (const bx of [-52, -38]) {
    B.box(1.6, 3, 0.05, M.stripes, bx, 7, -14.55);
    B.box(1.6, 3, 0.05, M.stripes, bx, 7, 14.55);
  }

  function barrel(x, z) {
    B.cyl(0.45, 0.45, 1.1, 10, M.oak, x, 0.55, z, { collide: true });
    B.cyl(0.47, 0.47, 0.08, 10, M.iron, x, 0.25, z);
    B.cyl(0.47, 0.47, 0.08, 10, M.iron, x, 0.85, z);
  }

  // ---------- Clock Court ----------
  barrel(20, -13.5); barrel(21, -13.2); barrel(-26, 13.2);
  B.box(1.4, 1, 1.4, M.wood, 22, 0.5, 13.3, { collide: true });
  B.box(1, 0.8, 1, M.wood, 23.3, 0.4, 13.4, { collide: true });

  // ---------- Great Hall ----------
  for (const tz of [-21, -29]) {
    B.box(16, 0.12, 1.3, M.oak, -10, 0.85, tz, { collide: true });
    for (const lx of [-17.5, -10, -2.5]) B.box(0.2, 0.8, 0.9, M.darkWood, lx, 0.4, tz);
    B.box(16, 0.1, 0.4, M.darkWood, -10, 0.45, tz - 1.05, { collide: true });
    B.box(16, 0.1, 0.4, M.darkWood, -10, 0.45, tz + 1.05, { collide: true });
    for (let px = -17; px <= -3; px += 3.5) {
      B.cyl(0.25, 0.3, 0.05, 8, M.iron, px, 0.93, tz); // pewter plates
      B.cyl(0.08, 0.06, 0.25, 6, M.gold, px + 0.6, 1.05, tz + 0.3); // cups
    }
  }
  B.box(5.5, 0.18, 20, M.oak, 3.2, 0.09, -25); // dais
  B.box(1.4, 0.12, 9, M.oak, 3.3, 1.0, -25, { collide: true });
  B.box(0.2, 0.9, 8.6, M.darkWood, 3.3, 0.5, -25);
  B.box(0.8, 1.6, 0.8, M.red, 4.6, 0.8, -25);
  B.box(0.1, 4, 6, M.red, 5.5, 3.5, -25);
  B.box(0.12, 0.6, 6, M.gold, 5.5, 5.6, -25);
  // tapestries
  const tapMats = [1, 2, 3, 4].map((i) => new THREE.MeshLambertMaterial({ map: TX.tapestry(i) }));
  [[-19, 0], [-11, 1], [-3, 2]].forEach(([x, i]) => {
    B.plane(6, 4.5, tapMats[i], x, 5.2, -15.45, { rotY: Math.PI, uv: 6 });
    B.plane(6, 4.5, tapMats[(i + 1) % 4], x, 5.2, -34.55, { uv: 6 });
  });
  fixPlaneUVs(B, tapMats);
  // Great Hall west wall screen and HA initials (1533 onwards)
  if (era.haInitials) {
    const ha = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8), new THREE.MeshLambertMaterial({ map: TX.initialsHA(), transparent: true }));
    ha.position.set(-23.5, 4, -19);
    ha.rotation.y = Math.PI / 2;
    dynamic.add(ha);
    for (let x = -21; x <= 3; x += 4) {
      for (const s of [-1, 1]) {
        const small = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), ha.material);
        small.position.set(x + 0.21, 11.2, -25 + s * 8.6);
        small.rotation.y = Math.PI / 2;
        dynamic.add(small);
      }
    }
  }
  anchors.haPlaque = [-22.6, -19];

  // ---------- Great Kitchens ----------
  const fires = [];
  for (const fx of [-18, -9, 0]) {
    B.box(6.4, 4.6, 1.4, M.brick, fx, 5.5, -54.1, { uv: 4 }); // chimney breast top
    B.box(1, 3.2, 1.4, M.brick, fx - 2.7, 1.6, -54.1, { collide: true, uv: 4 });
    B.box(1, 3.2, 1.4, M.brick, fx + 2.7, 1.6, -54.1, { collide: true, uv: 4 });
    B.box(4.4, 3.2, 0.2, M.soot, fx, 1.6, -54.6);
    B.box(4.4, 0.05, 1.3, M.soot, fx, 0.03, -54.1);
    B.box(3, 0.25, 0.25, M.darkWood, fx, 0.25, -54.2, { rotY: 0.2 });
    B.box(3, 0.25, 0.25, M.darkWood, fx, 0.3, -54.0, { rotY: -0.25 });
    B.cyl(0.04, 0.04, 4.6, 5, M.iron, fx, 1.5, -53.4, { rotZ: Math.PI / 2 }); // spit
    B.sphere(0.45, new THREE.MeshLambertMaterial({ color: 0x8a4b22 }), fx, 1.5, -53.4, 1.8, 0.8, 0.8);
    B.collider(fx, -53.6, 4.4, 1.2);
    const fire = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.6, 7), new THREE.MeshBasicMaterial({ color: 0xff8a2a, transparent: true, opacity: 0.9 }));
    fire.position.set(fx, 0.9, -54.1);
    fires.push(fire);
    dynamic.add(fire);
    const inner = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.1, 7), new THREE.MeshBasicMaterial({ color: 0xffd25a }));
    inner.position.set(fx, 0.7, -53.9);
    fires.push(inner);
    dynamic.add(inner);
  }
  for (const tz of [-44, -48]) {
    B.box(10, 0.15, 1.6, M.oak, -12, 0.9, tz, { collide: true });
    for (const lx of [-16.5, -7.5]) B.box(0.25, 0.85, 1.3, M.darkWood, lx, 0.43, tz);
  }
  // bread, pies and vegetables on the tables
  for (let i = 0; i < 6; i++) B.sphere(0.22, M.straw, -16 + i * 1.6, 1.08, -44, 1.3, 0.6, 1);
  for (let i = 0; i < 5; i++) B.cyl(0.3, 0.3, 0.18, 8, new THREE.MeshLambertMaterial({ color: 0xb8782e }), -15.5 + i * 1.8, 1.07, -48);
  B.cyl(0.8, 0.6, 1, 10, M.iron, -4, 0.5, -48.5, { collide: true }); // cauldron
  barrel(-22.5, -37); barrel(-22.5, -38.1); barrel(-21.4, -37.4); barrel(4.5, -38); barrel(4.5, -39.1);
  B.box(1.2, 0.8, 0.9, M.cloth, -22.4, 0.4, -41, { collide: true }); // flour sacks
  B.box(1.2, 0.6, 0.9, M.cloth, -22.4, 1.1, -41);
  anchors.kitchenFire = [-9, -51.5];

  // ---------- Chapel Royal ----------
  B.box(1.6, 1.1, 4, M.stone, 23.6, 0.55, -25, { collide: true }); // altar
  B.box(1.7, 0.05, 4.2, M.cloth, 23.6, 1.12, -25);
  B.box(0.12, 1.3, 0.12, M.gold, 23.9, 1.8, -25);
  B.box(0.12, 0.12, 0.7, M.gold, 23.9, 2.1, -25);
  for (const cz of [-26.5, -23.5]) {
    B.cyl(0.06, 0.06, 0.6, 6, M.paper, 23.6, 1.45, cz);
    B.cyl(0.1, 0.15, 0.1, 6, M.gold, 23.6, 1.17, cz);
  }
  B.box(0.1, 6, 6, M.blue, 25.3, 4.5, -25);
  for (let px = 11; px <= 20; px += 2.2) {
    for (const pz of [-29.5, -20.5]) {
      B.box(0.5, 0.5, 6, M.oak, px, 0.45, pz, { collide: true });
      B.box(0.12, 1, 6, M.darkWood, px + 0.3, 0.7, pz);
    }
  }
  // the King's pew (raised, at the back)
  B.box(2.6, 1.2, 5, M.oak, 8.4, 0.6, -25, { collide: true });
  B.box(2.6, 0.12, 5.2, M.gold, 8.4, 1.25, -25);
  B.box(1.2, 0.35, 3, M.rugRed, 8.4, 1.45, -25);
  B.box(0.15, 3, 5, M.rugRed, 7.2, 2.7, -25);
  anchors.kingsPew = [10.2, -25];

  // ---------- King's apartments ----------
  // Presence Chamber: cloth of estate over an empty chair
  B.box(4, 4, 0.1, M.rugRed, 32, 3, -14.5);
  B.box(4.4, 0.3, 1.6, M.gold, 32, 5.1, -13.8);
  chair(32, -13.5, 0, M.red);
  B.box(8, 0.02, 12, M.rugRed, 32, 0.04, 0);
  // Privy Chamber
  B.box(0.1, 4, 4, M.rugRed, 49.5, 3, 0);
  B.box(1.6, 0.3, 4.4, M.gold, 48.8, 5.1, 0);
  chair(48.6, 0, -Math.PI / 2, M.gold);
  B.box(8, 0.02, 10, M.rugRed, 44, 0.04, 0);
  B.box(4.5, 3.5, 0.9, M.stone, 44, 1.75, -14.3, { collide: true }); // fireplace
  B.box(3, 2.2, 0.2, M.soot, 44, 1.1, -13.8);
  const pfire = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1, 6), new THREE.MeshBasicMaterial({ color: 0xff8a2a }));
  pfire.position.set(44, 0.5, -13.9);
  fires.push(pfire);
  dynamic.add(pfire);
  B.box(3, 0.12, 1.6, M.oak, 44, 0.9, 10, { collide: true }); // table with a map
  for (const [lx, lz] of [[42.8, 9.5], [45.2, 9.5], [42.8, 10.5], [45.2, 10.5]]) B.box(0.15, 0.85, 0.15, M.darkWood, lx, 0.43, lz);
  B.box(1.6, 0.02, 1.1, M.paper, 44, 0.98, 10);
  B.sphere(0.35, M.blue, 45.2, 1.3, 10.2);
  const tapK = new THREE.MeshLambertMaterial({ map: TX.tapestry(5) });
  B.plane(6, 3.5, tapK, 32, 3, 14.55, { rotY: Math.PI, uv: 6 });
  B.plane(3.4, 2.6, tapK, 47.6, 3, 14.55, { rotY: Math.PI, uv: 6 });
  fixPlaneUVs(B, [tapK]);
  anchors.henry = [47.2, 0];

  function chair(x, z, rot, seatMat) {
    B.box(1, 0.15, 1, seatMat, x, 0.55, z, { rotY: rot, collide: true });
    const bx = x + Math.sin(rot) * -0.45, bz = z + Math.cos(rot) * -0.45;
    B.box(1, 1.8, 0.15, M.oak, bx, 1.1, bz, { rotY: rot });
    for (const [dx, dz] of [[-0.4, -0.4], [0.4, -0.4], [-0.4, 0.4], [0.4, 0.4]]) B.box(0.1, 0.5, 0.1, M.darkWood, x + dx, 0.25, z + dz);
  }

  // ---------- Your study ----------
  B.box(2.6, 0.12, 1.2, M.oak, 2, 0.85, 24.6, { collide: true });
  B.box(2.4, 0.8, 1, M.darkWood, 2, 0.4, 24.6);
  chair(2, 25.8, 0, M.red);
  B.box(1.2, 0.02, 0.8, M.paper, 1.6, 0.92, 24.4);
  B.cyl(0.07, 0.09, 0.14, 8, M.iron, 2.8, 0.98, 24.3); // inkpot
  B.box(0.02, 0.02, 0.5, M.cloth, 2.85, 1.15, 24.3, { rotX: 0.6 }); // quill
  B.cyl(0.05, 0.05, 0.3, 6, M.paper, 0.8, 1.06, 24.2); // candle
  const flame = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffd25a }));
  flame.position.set(0.8, 1.26, 24.2);
  flame.scale.y = 1.8;
  fires.push(flame);
  dynamic.add(flame);
  // bookshelves
  B.box(0.6, 3, 5, M.darkWood, -5.4, 1.5, 20, { collide: true });
  const bookCols = [0x7b1d26, 0x24407a, 0x2f6b3a, 0x6b4426, 0x8a6a2a];
  for (let s = 0; s < 4; s++) {
    for (let i = 0; i < 12; i++) {
      B.box(0.35, 0.5, 0.3, new THREE.MeshLambertMaterial({ color: bookCols[(i + s) % 5] }), -5.05, 0.5 + s * 0.7, 17.8 + i * 0.37);
    }
  }
  B.box(1.6, 0.8, 0.9, M.oak, 8.6, 0.4, 25.6, { collide: true }); // chest
  B.box(1.7, 0.1, 1, M.iron, 8.6, 0.82, 25.6);
  B.box(4, 0.02, 3, M.rugRed, 2, 0.04, 21);
  anchors.desk = [2, 23.2];

  // ---------- Privy Garden ----------
  const beds = [[34.5, 23.5], [51.5, 23.5], [34.5, 40.5], [51.5, 40.5]];
  for (const [bx, bz] of beds) {
    const w = 14, d = 13;
    B.box(w, 0.7, 0.5, M.hedge, bx, 0.35, bz - d / 2, { collide: true });
    B.box(w, 0.7, 0.5, M.hedge, bx, 0.35, bz + d / 2, { collide: true });
    B.box(0.5, 0.7, d, M.hedge, bx - w / 2, 0.35, bz, { collide: true });
    B.box(0.5, 0.7, d, M.hedge, bx + w / 2, 0.35, bz, { collide: true });
    B.box(w * 0.7, 0.5, 0.4, M.hedge, bx, 0.25, bz, { rotY: 0.75 });
    B.box(w * 0.7, 0.5, 0.4, M.hedge, bx, 0.25, bz, { rotY: -0.75 });
    B.sphere(0.8, M.leaf, bx, 1.1, bz);
    // heraldic beasts on striped posts at the corners
    for (const [cx, cz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const px = bx + cx * (w / 2), pz = bz + cz * (d / 2);
      B.cyl(0.13, 0.13, 3, 8, M.stripes, px, 1.5, pz, { uv: 1 });
      B.box(0.35, 0.5, 0.6, M.gold, px, 3.2, pz);
      B.sphere(0.18, M.gold, px, 3.55, pz + 0.25);
      B.box(0.5, 0.3, 0.05, M.green, px, 3.0, pz - 0.3);
    }
  }
  // sundial
  B.cyl(0.7, 0.9, 0.3, 10, M.stone, 43, 0.15, 32, { collide: true });
  B.cyl(0.25, 0.3, 1.1, 8, M.stone, 43, 0.8, 32);
  B.cyl(0.5, 0.5, 0.06, 12, M.gold, 43, 1.38, 32);
  B.box(0.04, 0.35, 0.4, M.gold, 43, 1.55, 32);
  // benches
  for (const [bx, bz] of [[30, 32], [56, 32]]) B.box(2.4, 0.5, 0.7, M.stone, bx, 0.25, bz, { collide: true, rotY: Math.PI / 2 });
  // royal barge on the Thames
  B.box(12, 1.2, 3, M.rugRed, 44, 0.2, 60);
  B.box(12.4, 0.2, 3.2, M.gold, 44, 0.85, 60);
  B.box(4, 2, 2.6, M.green, 41, 1.9, 60);
  B.box(4.2, 0.2, 2.8, M.gold, 41, 2.95, 60);
  B.cyl(0.08, 0.08, 4, 6, M.darkWood, 47, 2.5, 60);
  B.box(0.05, 1.2, 1.8, M.stripes, 47.9, 3.8, 60);

  // trees around the outside of the palace
  const r = mulberry(17);
  for (let i = 0; i < 46; i++) {
    const a = r() * Math.PI * 2, d = 82 + r() * 40;
    const tx = Math.cos(a) * d, tz = Math.sin(a) * d * 0.8 - 5;
    if (tz > 45 || (tx > -102 && tx < -55 && Math.abs(tz) < 38)) continue;
    B.cyl(0.4, 0.5, 4, 6, M.wood, tx, 2, tz);
    B.sphere(3 + r() * 1.5, M.leaf, tx, 6 + r(), tz, 1, 1.2, 1);
  }

  // ---------- Tudor objects to discover ----------
  for (const o of era.objects || []) if (o.model) buildProp(B, M, o);

  // ---------- Real paintings, hung where they belong ----------
  const loader = new THREE.TextureLoader();
  for (const pt of era.paintings || []) {
    const tex = loader.load('assets/img/' + pt.img + '.jpg');
    tex.colorSpace = THREE.SRGBColorSpace;
    const [x, y, z] = pt.pos;
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.rotation.y = pt.rot;
    const frame = new THREE.Mesh(new THREE.BoxGeometry(pt.w + 0.3, pt.h + 0.3, 0.1), M.gold);
    const pic = new THREE.Mesh(new THREE.PlaneGeometry(pt.w, pt.h), new THREE.MeshBasicMaterial({ map: tex, color: 0xe8e4dc }));
    pic.position.z = 0.06;
    g.add(frame, pic);
    dynamic.add(g);
  }

  // Hanging candle rings (chandeliers) in the Great Hall
  for (const cx of [-15, -3]) {
    B.cyl(1.1, 1.1, 0.12, 12, M.iron, cx, 7, -25);
    B.cyl(0.02, 0.02, 6, 4, M.iron, cx, 10, -25);
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      B.cyl(0.05, 0.05, 0.3, 5, M.paper, cx + Math.cos(a) * 1.05, 7.2, -25 + Math.sin(a) * 1.05);
    }
  }

  // ---------- Lights and sky ----------
  const world = B.finish();
  scene.add(world);
  scene.add(dynamic);

  const skyMesh = new THREE.Mesh(new THREE.SphereGeometry(280, 16, 12), new THREE.MeshBasicMaterial({ map: TX.sky(), side: THREE.BackSide, fog: false }));
  scene.add(skyMesh);
  scene.background = new THREE.Color(0xa9c6e6);
  scene.fog = new THREE.Fog(0xc7d6e2, 70, 260);

  const hemi = new THREE.HemisphereLight(0xeaf2ff, 0x7a6a55, 1.5);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff0d0, 1.7);
  sun.position.set(-40, 80, 30);
  scene.add(sun);

  return {
    colliders: B.colliders,
    anchors,
    objects: [world, dynamic, skyMesh, hemi, sun],
    update(t) {
      fires.forEach((f, i) => {
        const s = 0.85 + Math.sin(t * 9 + i * 1.7) * 0.1 + Math.sin(t * 23 + i) * 0.05;
        f.scale.set(s, f === flame ? 1.8 * s : s * 1.1, s);
      });
    },
  };
}

// Tapestry planes used world-UVs; reset them so the picture shows once.
function fixPlaneUVs(B, mats) {
  for (const m of mats) {
    const entries = B.buckets.get(m) || [];
    for (const { geo } of entries) {
      const uv = geo.attributes.uv;
      const vals = [0, 1, 1, 1, 0, 0, 1, 0];
      for (let i = 0; i < 4; i++) uv.setXY(i, vals[i * 2], vals[i * 2 + 1]);
    }
  }
}

function mulberry(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function areaAt(x, z) {
  // garden/rooms before courts (courts are bigger)
  const order = ['privy', 'presence', 'study', 'gallery', 'hall', 'kitchens', 'chapel', 'garden', 'base', 'clock', 'westfront'];
  for (const id of order) {
    const a = AREAS.find((q) => q.id === id);
    if (x >= a.x1 && x <= a.x2 && z >= a.z1 && z <= a.z2) return a;
  }
  return null;
}
