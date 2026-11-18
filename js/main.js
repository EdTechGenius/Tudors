// The King's Advisor — main game engine.
import * as THREE from '../vendor/three.module.min.js';
import { buildWorld, AREAS, MAP_WALLS, areaAt } from './world.js';
import { buildCharacter, nameLabel, markerSprite, portraitURL } from './characters.js';
import { Controls } from './controls.js';
import * as TX from './textures.js';
import { WIVES, WIFE_STATUS, TIMELINE, STAFF } from './content/common.js';
import ch1 from './content/chapter1.js';
import ch2 from './content/chapter2.js';
import ch3 from './content/chapter3.js';
import ch4 from './content/chapter4.js';

const CHAPTERS = [ch1, ch2, ch3, ch4];
const PKEY = 'tudor-advisor-progress-v1';
const SKEY = 'tudor-advisor-save-v1';
const TEACHER_CODE = '1509';

const $ = (q) => document.querySelector(q);
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const strip = (h) => String(h).replace(/<br\s*\/?>/g, '. ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ---------------- Saving ----------------
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage may be blocked */ } },
  del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};
const defaultProgress = () => ({ name: '', unlocked: 1, completed: {}, settings: { autoRead: false, easyRead: false, bigText: false, look: 1 }, seenHowTo: false });
let progress = { ...defaultProgress(), ...store.get(PKEY, {}) };
progress.settings = { ...defaultProgress().settings, ...(progress.settings || {}) };
const saveProgress = () => store.set(PKEY, progress);

function applySettings() {
  document.body.classList.toggle('easy-read', !!progress.settings.easyRead);
  document.body.classList.toggle('big-text', !!progress.settings.bigText);
  controls.sensitivity = progress.settings.look || 1;
}

// ---------------- Speech ----------------
let voices = [];
function loadVoices() { try { voices = speechSynthesis.getVoices(); } catch { voices = []; } }
if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
function speak(html) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  if (!html) return;
  const u = new SpeechSynthesisUtterance(strip(html));
  u.lang = 'en-GB';
  const v = voices.find((x) => x.lang === 'en-GB') || voices.find((x) => x.lang && x.lang.startsWith('en'));
  if (v) u.voice = v;
  u.rate = 0.95;
  speechSynthesis.speak(u);
}
const autoSpeak = (t) => { if (progress.settings.autoRead) speak(t); };
const stopSpeech = () => { if ('speechSynthesis' in window) speechSynthesis.cancel(); };

// ---------------- Renderer ----------------
const canvas = $('#game');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch (e) {
  $('#loading').innerHTML = '<div class="panel"><h2>Sorry!</h2><p>This device could not start 3D graphics (WebGL). Please try another browser or device.</p></div>';
  throw e;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 600);
camera.rotation.order = 'YXZ';
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

const controls = new Controls($('#touch'), $('#joy'), $('#knob'));
applySettings();
window.__controls = controls;
window.__renderer = () => renderer;

// stop iOS pinch-zoom and double-tap zoom
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('dblclick', (e) => e.preventDefault());

// ---------------- Game state ----------------
const G = {
  ch: null, s: null, world: null,
  npcs: new Map(), sources: new Map(), spots: new Map(),
  pos: { x: 0, z: 0 }, mode: 'menu', area: null, current: null,
  lastSave: 0, mapBg: null, doneObjectives: new Set(),
};
window.__game = G; // handy for teachers' debugging and automated tests

function freshState(ch) {
  return { flags: {}, sources: {}, facts: [], favour: ch.meters.favour, honesty: ch.meters.honesty, letter: null };
}
const talked = (id) => !!G.s.flags['talked_' + id];

function disposeScene() {
  scene.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
    mats.forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
  });
  scene.clear();
}

// ---------------- Loading a chapter ----------------
function staffAsNpcs() {
  return STAFF.map((p) => ({
    ...p, optional: true, staff: true,
    dialogue: () => (talked(p.id) ? 'again' : 'main'),
    dialogues: {
      main: { start: 'a', nodes: { a: { text: p.facts[0], fact: p.facts[0] } } },
      again: { start: 'a', nodes: { a: { text: p.facts[1], fact: p.facts[1] } } },
    },
  }));
}

function loadChapter(ch, saved) {
  disposeScene();
  G.ch = ch;
  G.s = saved ? saved.s : freshState(ch);
  G.world = buildWorld(scene, ch.era);
  G.npcs.clear(); G.sources.clear(); G.spots.clear();

  for (const def of [...ch.npcs, ...staffAsNpcs()]) {
    const group = new THREE.Group();
    const model = buildCharacter(def.look);
    group.add(model);
    const sc = def.look.scale || 1;
    const label = nameLabel(def.name);
    label.position.y = 2.3 * sc;
    group.add(label);
    const marker = markerSprite(def.optional ? '?' : '!');
    marker.position.y = 2.8 * sc;
    marker.visible = false;
    group.add(marker);
    group.position.set(def.pos[0], 0, def.pos[1]);
    group.rotation.y = def.yaw || 0;
    scene.add(group);
    G.npcs.set(def.id, { def, group, label, marker, yaw: def.yaw || 0, phase: Math.random() * 6 });
  }

  for (const src of ch.sources) {
    const obj = makeSourceObject(src);
    scene.add(obj.group);
    G.sources.set(src.id, { def: src, ...obj });
  }

  for (const sp of ch.spots) {
    const [x, z] = G.world.anchors[sp.anchor];
    const ring = glowRing();
    ring.position.set(x, 0.05, z);
    const marker = markerSprite('!');
    marker.position.set(x, 2.2, z);
    scene.add(ring, marker);
    G.spots.set(sp.id, { def: sp, x, z, ring, marker });
  }

  const p = saved ? saved.pos : ch.start;
  G.pos.x = p.x; G.pos.z = p.z;
  controls.yaw = p.yaw; controls.pitch = 0;
  G.area = null;
  G.mapBg = drawMapBackground(220, 220);
  G.doneObjectives = new Set(ch.objectives.filter((o) => o.done(G.s)).map((o) => o.id));
  refresh();
}

function glowRing() {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.06, 6, 28), new THREE.MeshBasicMaterial({ color: 0xffd34d, transparent: true, opacity: 0.85 }));
  ring.rotation.x = Math.PI / 2;
  return ring;
}

const srcMat = {
  wood: new THREE.MeshLambertMaterial({ color: 0x5b3a22 }),
  page: new THREE.MeshLambertMaterial({ color: 0xf3e9cc }),
  cover: new THREE.MeshLambertMaterial({ color: 0x6b1d1d }),
  wax: new THREE.MeshLambertMaterial({ color: 0xa3161a }),
  gold: new THREE.MeshLambertMaterial({ color: 0xd9ab3c }),
};

function makeSourceObject(src) {
  const group = new THREE.Group();
  const [x, z] = src.pos;
  group.position.set(x, 0, z);
  group.rotation.y = src.rot || 0;
  const add = (geo, mat, px, py, pz, rx = 0, ry = 0, rz = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(px, py, pz);
    m.rotation.set(rx, ry, rz);
    group.add(m);
    return m;
  };
  if (src.kind === 'book') {
    add(new THREE.CylinderGeometry(0.08, 0.14, 1.1, 8), srcMat.wood, 0, 0.55, 0);
    add(new THREE.BoxGeometry(0.7, 0.06, 0.5), srcMat.wood, 0, 1.12, 0, -0.35);
    add(new THREE.BoxGeometry(0.62, 0.05, 0.44), srcMat.cover, 0, 1.17, 0.02, -0.35);
    add(new THREE.BoxGeometry(0.28, 0.03, 0.4), srcMat.page, -0.15, 1.21, 0.03, -0.35, 0, 0.06);
    add(new THREE.BoxGeometry(0.28, 0.03, 0.4), srcMat.page, 0.15, 1.21, 0.03, -0.35, 0, -0.06);
  } else if (src.kind === 'scroll' || src.kind === 'letter') {
    add(new THREE.BoxGeometry(0.9, 0.06, 0.6), srcMat.wood, 0, 0.85, 0);
    for (const [lx, lz] of [[-0.38, -0.24], [0.38, -0.24], [-0.38, 0.24], [0.38, 0.24]]) add(new THREE.BoxGeometry(0.06, 0.82, 0.06), srcMat.wood, lx, 0.41, lz);
    if (src.kind === 'scroll') {
      add(new THREE.BoxGeometry(0.5, 0.01, 0.4), srcMat.page, 0, 0.89, 0);
      add(new THREE.CylinderGeometry(0.04, 0.04, 0.55, 8), srcMat.page, 0, 0.92, -0.2, 0, 0, Math.PI / 2);
      add(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 10), srcMat.wax, 0.1, 0.9, 0.12);
    } else {
      add(new THREE.BoxGeometry(0.34, 0.01, 0.24), srcMat.page, 0, 0.89, 0, 0, 0.2);
      add(new THREE.CylinderGeometry(0.04, 0.04, 0.02, 10), srcMat.wax, 0.02, 0.9, 0.02);
    }
  } else if (src.kind === 'portrait') {
    const [bg, robe, hat] = src.portrait || ['#333', '#555', '#111'];
    add(new THREE.BoxGeometry(0.06, 1.7, 0.06), srcMat.wood, -0.35, 0.85, -0.1, 0.1);
    add(new THREE.BoxGeometry(0.06, 1.7, 0.06), srcMat.wood, 0.35, 0.85, -0.1, 0.1);
    add(new THREE.BoxGeometry(0.06, 1.6, 0.06), srcMat.wood, 0, 0.8, -0.35, -0.25);
    add(new THREE.BoxGeometry(1.0, 1.25, 0.06), srcMat.gold, 0, 1.45, -0.05, -0.1);
    add(new THREE.PlaneGeometry(0.86, 1.1), new THREE.MeshLambertMaterial({ map: TX.portrait(bg, robe, hat) }), 0, 1.45, -0.015, -0.1);
  }
  const ring = glowRing();
  ring.position.y = 0.05;
  group.add(ring);
  const marker = markerSprite('!');
  marker.position.y = src.kind === 'carving' ? 5.2 : 2.1;
  if (src.kind === 'carving') { ring.scale.setScalar(1.6); }
  group.add(marker);
  return { group, ring, marker, x, z };
}

// ---------------- Objectives ----------------
function objDone(o) { return o.done(G.s); }
function objUnlocked(o) {
  if (o.hideWhen && o.hideWhen(G.s)) return false;
  return (o.after || []).every((id) => objDone(G.ch.objectives.find((q) => q.id === id)));
}
function activeObjectives() { return G.ch.objectives.filter((o) => objUnlocked(o) && !objDone(o)); }

function targetPos(t) {
  const [kind, id] = t.split(':');
  if (kind === 'npc') { const n = G.npcs.get(id); return n && { x: n.group.position.x, z: n.group.position.z, name: n.def.name }; }
  if (kind === 'source') { const s = G.sources.get(id); return s && { x: s.x, z: s.z, name: s.def.name }; }
  if (kind === 'spot') { const s = G.spots.get(id); return s && { x: s.x, z: s.z, name: s.def.label }; }
  return null;
}
function targetDone(t, o) {
  if (o.targets.length === 1) return objDone(o);
  const [kind, id] = t.split(':');
  if (kind === 'npc') return talked(id);
  if (kind === 'source') return !!G.s.sources[id];
  return false;
}
function activeTargets() {
  const out = [];
  for (const o of activeObjectives()) for (const t of o.targets || []) if (!targetDone(t, o)) out.push({ t, optional: !!o.optional });
  return out;
}

function npcVisible(n) { return !n.def.when || n.def.when(G.s); }
function sourceVisible(s) { return !s.def.when || s.def.when(G.s); }
function spotEnabled(sp) {
  if (sp.def.when && !sp.def.when(G.s)) return false;
  if (sp.def.objective) {
    const o = G.ch.objectives.find((q) => q.id === sp.def.objective);
    return objUnlocked(o) && !objDone(o);
  }
  return true;
}

// Update everything that depends on the story state.
function refresh() {
  const tg = activeTargets();
  const tset = new Map(tg.map((x) => [x.t, x.optional]));
  for (const [id, n] of G.npcs) {
    n.group.visible = npcVisible(n);
    const key = 'npc:' + id;
    n.marker.visible = tset.has(key);
  }
  for (const [id, s] of G.sources) {
    s.group.visible = sourceVisible(s);
    const found = !!G.s.sources[id];
    s.ring.visible = !found;
    s.marker.visible = !found && tset.has('source:' + id);
  }
  for (const [, sp] of G.spots) {
    const on = spotEnabled(sp);
    sp.ring.visible = on;
    sp.marker.visible = on;
  }
  renderObjectives();
  renderMeters();
  // announce newly completed objectives
  for (const o of G.ch.objectives) {
    if (objDone(o) && !G.doneObjectives.has(o.id)) {
      G.doneObjectives.add(o.id);
      if (o.id !== 'audience' && o.id !== 'ring') toast('✅ ' + o.text, 'good');
    }
  }
}

function renderObjectives() {
  const list = activeObjectives();
  const box = $('#objectives');
  const items = list.map((o) => `<li class="${o.optional ? 'opt' : ''}"><span class="tick">${o.optional ? '☆' : '◆'}</span>${esc(o.text)}${o.count ? ` <b>(${o.count(G.s)})</b>` : ''}</li>`).join('');
  box.innerHTML = `<button class="obj-head" id="obj-toggle">📋 ${esc(G.ch.short)}'s Tasks</button><ul>${items || '<li>All done!</li>'}</ul>`;
  $('#obj-toggle').onclick = () => box.classList.toggle('collapsed');
}

function renderMeters() {
  const f = clamp(G.s.favour, 0, 100), h = clamp(G.s.honesty, 0, 100);
  $('#m-favour .fill').style.width = f + '%';
  $('#m-honesty .fill').style.width = h + '%';
  $('#m-favour').classList.toggle('danger', f < 25);
}

function applyFx(fx) {
  if (!fx) return;
  const parts = [];
  if (fx.favour) { G.s.favour = clamp(G.s.favour + fx.favour, 0, 100); parts.push(`${fx.favour > 0 ? '+' : ''}${fx.favour} 👑 King's Favour`); }
  if (fx.honesty) { G.s.honesty = clamp(G.s.honesty + fx.honesty, 0, 100); parts.push(`${fx.honesty > 0 ? '+' : ''}${fx.honesty} ⚖️ Honesty`); }
  if (parts.length) {
    toast(parts.join('   '), (fx.favour || 0) < 0 ? 'bad' : 'good');
    pulse(fx.favour ? '#m-favour' : '#m-honesty');
  }
  renderMeters();
}
function pulse(sel) { const e = $(sel); e.classList.remove('pulse'); void e.offsetWidth; e.classList.add('pulse'); }

function addFact(text) {
  if (!text || G.s.facts.includes(text)) return;
  G.s.facts.push(text);
  toast('📜 New fact added to your notebook');
}

function saveChapter() {
  if (!G.ch || G.background || G.s.flags.chapterDone) return;
  store.set(SKEY, { id: G.ch.id, s: G.s, pos: { x: G.pos.x, z: G.pos.z, yaw: controls.yaw } });
}

// ---------------- Toasts ----------------
function toast(text, kind = '') {
  const t = document.createElement('div');
  t.className = 'toast ' + kind;
  t.textContent = text;
  $('#toasts').appendChild(t);
  setTimeout(() => t.classList.add('out'), 2600);
  setTimeout(() => t.remove(), 3200);
}

// ---------------- Panels ----------------
function setMode(mode) {
  G.mode = mode;
  controls.enabled = mode === 'play';
  if (mode !== 'play') controls.reset();
  $('#hud').hidden = !(mode === 'play' || mode === 'dialogue');
  document.body.classList.toggle('in-dialogue', mode === 'dialogue');
}

function openPanel(html, cls = '') {
  const ov = $('#overlay');
  ov.innerHTML = `<div class="panel ${cls}">${html}</div>`;
  ov.classList.add('show');
  const p = ov.firstElementChild;
  p.querySelectorAll('[data-speak]').forEach((b) => { b.onclick = () => speak(p.querySelector(b.dataset.speak)?.innerHTML || ''); });
  p.scrollTop = 0;
  return p;
}
function closePanel() { stopSpeech(); $('#overlay').classList.remove('show'); $('#overlay').innerHTML = ''; }
const speakBtn = (sel) => `<button class="speak" data-speak="${sel}" aria-label="Read aloud">🔊</button>`;

function cardSequence(cards, { title = '', finalLabel = 'Continue' } = {}) {
  return new Promise((resolve) => {
    let i = 0;
    const show = () => {
      const c = cards[i];
      const p = openPanel(`
        ${title ? `<div class="kicker">${title}</div>` : ''}
        <div class="card-head">${c.icon ? `<span class="icon">${c.icon}</span>` : ''}${c.year ? `<span class="year">${esc(c.year)}</span>` : ''}<h2>${c.title}</h2>${speakBtn('.card-text')}</div>
        <div class="card-text">${c.text}</div>
        <div class="row"><span class="dots">${cards.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</span>
        <button class="btn primary" id="next">${i < cards.length - 1 ? 'Next ▶' : finalLabel}</button></div>`, 'card');
      autoSpeak(c.title + '. ' + c.text);
      p.querySelector('#next').onclick = () => { i++; if (i < cards.length) show(); else { closePanel(); resolve(); } };
    };
    show();
  });
}

function narrate(text, button = 'Continue') {
  return new Promise((resolve) => {
    const p = openPanel(`<div class="card-head"><h2>📜</h2>${speakBtn('.card-text')}</div><div class="card-text">${text}</div><div class="row"><span></span><button class="btn primary" id="ok">${button}</button></div>`, 'card narr');
    autoSpeak(text);
    p.querySelector('#ok').onclick = () => { closePanel(); resolve(); };
  });
}

// ---------------- Dialogue ----------------
function showLine({ name, role, portrait, text, choices, narrator }) {
  return new Promise((resolve) => {
    const d = $('#dialogue');
    d.className = narrator ? 'narrator show' : 'show';
    d.innerHTML = `
      ${narrator ? '' : `<img class="portrait" src="${portrait}" alt="">`}
      <div class="dbody">
        ${narrator ? '' : `<div class="dname">${esc(name)} <span>${esc(role || '')}</span></div>`}
        <div class="dtext">${text}</div>
        <div class="choices">${choices
          ? choices.map((c, i) => `<button class="btn choice" data-i="${i}">${esc(c.t)}</button>`).join('')
          : '<button class="btn primary" data-i="-1">Continue ▶</button>'}</div>
      </div>
      <button class="speak dspeak" aria-label="Read aloud">🔊</button>`;
    d.querySelector('.dspeak').onclick = () => speak(text);
    autoSpeak(text);
    d.querySelectorAll('[data-i]').forEach((b) => {
      b.onclick = () => { stopSpeech(); resolve(+b.dataset.i); };
    });
  });
}
function hideDialogue() { $('#dialogue').className = ''; $('#dialogue').innerHTML = ''; }

async function talkTo(n) {
  const def = n.def;
  const key = def.dialogue(G.s);
  const dlg = def.dialogues[key];
  setMode('dialogue');
  G.focus = n;
  let id = dlg.start, endChapter = false, teleport = null;
  const you = { name: G.ch.advisor, role: 'You', portrait: portraitURL(G.ch.you, 'you' + G.ch.id) };
  const them = { name: def.name, role: def.role, portrait: portraitURL(def.look, G.ch.id + def.id) };
  while (id) {
    const node = dlg.nodes[id];
    if (node.set) G.s.flags[node.set] = true;
    if (node.fact) addFact(node.fact);
    if (node.fx) applyFx(node.fx);
    if (node.teleport) teleport = node.teleport;
    const who = node.who === 'you' ? you : them;
    const i = await showLine({ ...who, text: node.text, choices: node.choices, narrator: node.who === 'narrator' });
    let next = node.next;
    if (node.choices) {
      const c = node.choices[i];
      if (c.fx) applyFx(c.fx);
      if (c.set) G.s.flags[c.set] = true;
      if (c.fact) addFact(c.fact);
      next = c.next;
    }
    if (node.end === 'chapter') { endChapter = true; break; }
    id = typeof next === 'function' ? next(G.s) : next;
    if (G.s.favour <= 0) break;
  }
  hideDialogue();
  G.focus = null;
  G.s.flags['talked_' + def.id] = true;
  G.s.flags['talked_' + def.id + '_' + key] = true;
  if (teleport) { G.pos.x = teleport[0]; G.pos.z = teleport[1]; controls.yaw = teleport[2]; controls.pitch = 0; G.area = null; }
  refresh();
  saveChapter();
  if (G.s.favour <= 0) return failChapter();
  if (endChapter) return finishChapter();
  setMode('play');
}

// ---------------- Sources ----------------
async function examineSource(src) {
  setMode('ui');
  const d = src.def;
  const already = G.s.sources[d.id];
  const body = `
    <div class="kicker">🔍 Source · ${esc(d.area)}</div>
    <div class="card-head"><h2>${esc(d.name)}</h2>${speakBtn('.src-all')}</div>
    <div class="src-all">
      <div class="src-meta"><span><b>When:</b> ${esc(d.date)}</span><span><b>Who made it:</b> ${esc(d.origin)}</span></div>
      <blockquote class="parch">${esc(d.text)}</blockquote>
      <p>${d.about}</p>
    </div>
    <p class="small muted">Words in sources have been simplified for this game.</p>`;
  if (already) {
    const p = openPanel(body + `<div class="row"><span></span><button class="btn primary" id="ok">Close</button></div>`, 'card source');
    await new Promise((r) => { p.querySelector('#ok').onclick = r; });
    closePanel();
    setMode('play');
    return;
  }
  const q = d.question;
  const p = openPanel(body + `
    <div class="question"><h3>🕵️ Source detective: ${esc(q.q)}</h3>
      <div class="opts">${q.options.map((o, i) => `<button class="btn choice" data-i="${i}">${esc(o.t)}</button>`).join('')}</div>
      <div class="feedback"></div>
    </div>`, 'card source');
  autoSpeak(d.name + '. ' + d.text + '. ' + d.about);
  const i = await new Promise((r) => p.querySelectorAll('.opts [data-i]').forEach((b) => { b.onclick = () => r(+b.dataset.i); }));
  const opt = q.options[i];
  p.querySelectorAll('.opts button').forEach((b, k) => {
    b.disabled = true;
    if (q.options[k].ok) b.classList.add('right');
    else if (k === i) b.classList.add('wrong');
  });
  p.querySelector('.feedback').innerHTML = `<p class="${opt.ok ? 'good' : 'bad'}">${opt.ok ? '✅ Correct!' : '❌ Not quite.'} ${esc(opt.why)}</p><div class="row"><span>📜 Added to your notebook</span><button class="btn primary" id="ok">Continue</button></div>`;
  autoSpeak((opt.ok ? 'Correct! ' : 'Not quite. ') + opt.why);
  G.s.sources[d.id] = { correct: !!opt.ok };
  saveChapter();
  await new Promise((r) => { p.querySelector('#ok').onclick = r; });
  closePanel();
  refresh();
  saveChapter();
  setMode('play');
}

// ---------------- Letter writing ----------------
function hasNeed(need) {
  if (!need) return true;
  if (need.startsWith('flag:')) return !!G.s.flags[need.slice(5)];
  return !!G.s.sources[need];
}
function needLabel(need) {
  if (need.startsWith('flag:talked_')) { const n = G.npcs.get(need.slice(12)); return 'Speak to ' + (n ? n.def.name : 'someone'); }
  const s = G.sources.get(need);
  return 'Find: ' + (s ? s.def.name : 'more evidence');
}

async function writeLetter() {
  setMode('ui');
  const L = G.ch.letter;
  const picks = L.parts.map(() => null);
  const p = openPanel(`
    <div class="kicker">✒️ ${esc(L.title)}</div>
    <p class="intro">${L.intro}</p>
    <div class="letter-wrap">
      <div class="letter-parts">${L.parts.map((part, pi) => `
        <div class="lpart" data-p="${pi}"><h3>${pi + 1}. ${esc(part.label)}</h3>
        ${part.options.map((o, oi) => {
          const ok = hasNeed(o.needs);
          return `<button class="btn choice ${ok ? '' : 'locked'}" data-p="${pi}" data-o="${oi}" ${ok ? '' : 'disabled'}>${ok ? '' : '🔒 '}${esc(o.t)}${ok ? '' : `<small>${esc(needLabel(o.needs))}</small>`}</button>`;
        }).join('')}</div>`).join('')}
      </div>
      <div class="parchment" id="lpreview"><div class="to">To ${esc(L.to)}</div><div id="ltext"></div><div class="seal" id="seal"></div></div>
    </div>
    <div class="row"><button class="btn" id="cancel">Not yet</button><button class="btn primary" id="send" disabled>🔴 Seal and send</button></div>`, 'wide letter');
  autoSpeak(L.intro);
  const update = () => {
    $('#ltext').innerHTML = picks.map((x, i) => (x === null ? `<p class="blank">…${esc(L.parts[i].label.toLowerCase())}…</p>` : `<p>${esc(L.parts[i].options[x].t)}</p>`)).join('');
    p.querySelector('#send').disabled = picks.some((x) => x === null);
    p.querySelectorAll('.lpart button').forEach((b) => b.classList.toggle('picked', picks[+b.dataset.p] === +b.dataset.o));
  };
  update();
  p.querySelectorAll('.lpart button').forEach((b) => { b.onclick = () => { picks[+b.dataset.p] = +b.dataset.o; update(); }; });
  const go = await new Promise((r) => { p.querySelector('#cancel').onclick = () => r(false); p.querySelector('#send').onclick = () => r(true); });
  if (!go) { closePanel(); setMode('play'); return; }
  // seal animation
  $('#seal').classList.add('stamp');
  p.querySelectorAll('button').forEach((b) => { b.disabled = true; });
  await wait(1100);
  let score = 0, max = 0;
  const chosen = picks.map((x, i) => L.parts[i].options[x]);
  for (const o of chosen) {
    score += o.score; max += 2;
    if (o.set) G.s.flags[o.set] = true;
  }
  const fx = { favour: 0, honesty: 0 };
  for (const o of chosen) { if (o.fx) { fx.favour += o.fx.favour || 0; fx.honesty += o.fx.honesty || 0; } }
  fx.favour += Math.round((score / max) * 14 - 6);
  G.s.letter = { score, max, lines: chosen.map((o) => o.t) };
  const stars = letterStars(score, max);
  const p2 = openPanel(`
    <div class="kicker">✒️ Your letter</div>
    <h2>${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</h2>
    <ul class="feedback-list">${chosen.map((o, i) => `<li class="${o.score === 2 ? 'good' : o.score === 1 ? 'ok' : 'bad'}"><b>${esc(L.parts[i].label)}:</b> "${esc(o.t)}"<br><span>${o.score === 2 ? '✅' : o.score === 1 ? '🤔' : '❌'} ${esc(o.why)}</span></li>`).join('')}</ul>
    <p class="parch">${esc(L.sent)}</p>
    <div class="row"><span></span><button class="btn primary" id="ok">Continue</button></div>`, 'card');
  autoSpeak(L.sent);
  await new Promise((r) => { p2.querySelector('#ok').onclick = r; });
  closePanel();
  applyFx(fx);
  refresh();
  saveChapter();
  if (G.s.favour <= 0) return failChapter();
  setMode('play');
}
const letterStars = (score, max) => (score / max >= 0.9 ? 3 : score / max >= 0.6 ? 2 : 1);

async function useSpot(sp) {
  if (sp.def.action === 'letter') return writeLetter();
  if (sp.def.action === 'flag') {
    setMode('ui');
    await narrate(sp.def.message);
    G.s.flags[sp.def.set] = true;
    refresh();
    saveChapter();
    setMode('play');
  }
}

// ---------------- Chapter end ----------------
async function finishChapter() {
  setMode('ui');
  G.s.flags.chapterDone = true;
  store.del(SKEY);
  const ch = G.ch;
  await cardSequence(ch.history, { title: `What really happened · ${ch.years}`, finalLabel: 'Continue ▶' });
  await showWivesUpdate();
  const quiz = await runQuiz(ch.quiz);
  const srcCorrect = Object.values(G.s.sources).filter((x) => x.correct).length;
  const result = {
    favour: Math.round(G.s.favour), honesty: Math.round(G.s.honesty),
    sources: srcCorrect, sourcesMax: ch.sources.length,
    letter: G.s.letter ? G.s.letter.score : 0, letterMax: G.s.letter ? G.s.letter.max : 10,
    letterLines: G.s.letter ? G.s.letter.lines : [],
    quiz, quizMax: ch.quiz.length, facts: G.s.facts.length, date: new Date().toLocaleDateString('en-GB'),
  };
  const pct = (result.sources / result.sourcesMax + result.letter / result.letterMax + result.quiz / result.quizMax) / 3;
  result.stars = pct >= 0.85 ? 3 : pct >= 0.6 ? 2 : 1;
  const prev = progress.completed[ch.id];
  if (!prev || result.stars >= prev.stars) progress.completed[ch.id] = result;
  progress.unlocked = Math.max(progress.unlocked, Math.min(4, ch.id + 1));
  saveProgress();
  await showReport(ch, result);
  if (ch.id === 4) await showFinale();
  showChapterSelect();
}

async function failChapter() {
  setMode('ui');
  hideDialogue();
  store.del(SKEY);
  const p = openPanel(`<div class="card-head"><h2>😠 The King is furious!</h2></div>
    <div class="card-text">You have lost all of King Henry's favour. He orders you to leave the court at once!<br><br>Tudor advisors had to be very careful. Upsetting the King could cost you your job — or even your life.</div>
    <div class="row"><button class="btn" id="menu">Chapter menu</button><button class="btn primary" id="retry">Try again</button></div>`, 'card');
  const r = await new Promise((res) => { p.querySelector('#retry').onclick = () => res('retry'); p.querySelector('#menu').onclick = () => res('menu'); });
  closePanel();
  if (r === 'retry') startChapter(G.ch, null, true); else showChapterSelect();
}

function wifeStatusMap(chId, done) {
  const w = WIFE_STATUS[chId];
  return done ? w.e : w.s;
}

function wivesHTML(statuses, highlight = {}) {
  return `<div class="wives">${WIVES.map((w, i) => {
    const st = statuses[w.id] || 'hidden';
    const isNew = highlight[w.id] && highlight[w.id] !== st;
    if (st === 'hidden') return `<div class="wife hidden"><div class="num">${i + 1}</div><div class="wimg q">?</div><div class="wname">???</div><div class="wfate">Not yet known</div></div>`;
    return `<div class="wife ${isNew ? 'new' : ''}"><div class="num">${i + 1}</div><img class="wimg" src="${portraitURL(w.look, 'wife' + w.id)}" alt="">
      <div class="wname">${esc(w.name)}</div>
      <div class="wfate">${st === 'fate' ? `<b class="fate-${w.fate.toLowerCase()}">${esc(w.fate)}</b><br><small>${esc(w.fateLong)}</small>` : st === 'married' ? `Married ${esc(w.married)}` : 'At court'}</div>
      <p class="wnote">${esc(st === 'fate' ? w.note : w.early || w.note)}</p></div>`;
  }).join('')}</div>`;
}

function showWivesUpdate() {
  const before = wifeStatusMap(G.ch.id, false), after = wifeStatusMap(G.ch.id, true);
  return new Promise((resolve) => {
    const p = openPanel(`<div class="kicker">👑 Henry's Six Wives</div><h2>Your wives tracker has been updated</h2>
      ${wivesHTML(after, before)}
      <p class="rhyme">"Divorced, beheaded, died; divorced, beheaded, survived."</p>
      <p class="small muted">Tip: the rhyme says "divorced", but Henry's first and fourth marriages were really <b>annulled</b> — declared never to have been true marriages at all.</p>
      <div class="row"><span></span><button class="btn primary" id="ok">Take the quiz ▶</button></div>`, 'wide');
    p.querySelector('#ok').onclick = () => { closePanel(); resolve(); };
  });
}

function runQuiz(questions) {
  return new Promise((resolve) => {
    let i = 0, score = 0;
    const show = () => {
      const q = questions[i];
      const p = openPanel(`<div class="kicker">🎓 Quiz · Question ${i + 1} of ${questions.length}</div>
        <div class="card-head"><h2 class="q">${esc(q.q)}</h2>${speakBtn('.q')}</div>
        <div class="opts">${q.options.map((o, k) => `<button class="btn choice" data-k="${k}">${esc(o)}</button>`).join('')}</div>
        <div class="feedback"></div>`, 'card');
      autoSpeak(q.q);
      p.querySelectorAll('[data-k]').forEach((b) => {
        b.onclick = () => {
          const k = +b.dataset.k, ok = k === q.answer;
          if (ok) score++;
          p.querySelectorAll('[data-k]').forEach((x, j) => { x.disabled = true; if (j === q.answer) x.classList.add('right'); else if (j === k) x.classList.add('wrong'); });
          p.querySelector('.feedback').innerHTML = `<p class="${ok ? 'good' : 'bad'}">${ok ? '✅ Correct!' : '❌ Not quite.'} ${esc(q.why)}</p><div class="row"><span>Score: ${score}/${i + 1}</span><button class="btn primary" id="next">${i < questions.length - 1 ? 'Next question ▶' : 'See my report ▶'}</button></div>`;
          p.querySelector('#next').onclick = () => { i++; if (i < questions.length) show(); else { closePanel(); resolve(score); } };
        };
      });
    };
    show();
  });
}

function reportHTML(ch, r, forPrint = false) {
  const bar = (v) => `<span class="rbar"><span style="width:${v}%"></span></span> ${v}%`;
  return `
    <div class="report ${forPrint ? 'print' : ''}">
      <div class="rhead"><div class="rose">🌹</div><div><h2>Royal Report</h2><div>${esc(progress.name || 'Pupil')} · ${esc(r.date)}</div></div><div class="stars">${'⭐'.repeat(r.stars)}${'☆'.repeat(3 - r.stars)}</div></div>
      <h3>Chapter ${ch.id}: ${esc(ch.title)} (${esc(ch.years)})</h3>
      <p>You played <b>${esc(ch.advisor)}</b>.</p>
      <table>
        <tr><td>👑 King's Favour</td><td>${bar(r.favour)}</td></tr>
        <tr><td>⚖️ Honesty</td><td>${bar(r.honesty)}</td></tr>
        <tr><td>🕵️ Source detective</td><td>${r.sources} / ${r.sourcesMax} questions correct</td></tr>
        <tr><td>✒️ Letter</td><td>${'⭐'.repeat(letterStars(r.letter, r.letterMax))} (${r.letter} / ${r.letterMax} points)</td></tr>
        <tr><td>🎓 Quiz</td><td>${r.quiz} / ${r.quizMax}</td></tr>
        <tr><td>📜 Facts discovered</td><td>${r.facts}</td></tr>
      </table>
      ${r.letterLines && r.letterLines.length ? `<h4>Your letter</h4><blockquote class="parch">${r.letterLines.map(esc).join('<br>')}</blockquote>` : ''}
      <h4>What really happened to ${esc(ch.short)}?</h4><p>${esc(ch.fate)}</p>
      <h4>Think about it</h4><p><b>${esc(ch.reflection)}</b></p>
      <div class="lines">${'<div></div>'.repeat(forPrint ? 6 : 0)}</div>
    </div>`;
}

function printHTML(html) {
  $('#print-area').innerHTML = html;
  window.print();
}

function showReport(ch, r) {
  return new Promise((resolve) => {
    const p = openPanel(reportHTML(ch, r) + `<div class="row"><button class="btn" id="print">🖨️ Print / Save as PDF</button><button class="btn primary" id="ok">Continue ▶</button></div>`, 'wide');
    p.querySelector('#print').onclick = () => printHTML(reportHTML(ch, r, true));
    p.querySelector('#ok').onclick = () => { closePanel(); resolve(); };
  });
}

function showFinale() {
  return new Promise((resolve) => {
    const all = WIFE_STATUS[4].e;
    const p = openPanel(`<div class="kicker">🏰 The End of Henry's Reign</div>
      <h2>You have served King Henry VIII!</h2>
      <p>Henry VIII ruled England for 38 years. He married six times, broke away from the Pope in Rome, closed the monasteries, and changed England forever. Here is what happened to the four men who advised him:</p>
      <div class="advisors">${CHAPTERS.map((c) => `<div class="adv"><img src="${portraitURL(c.you, 'you' + c.id)}" alt=""><div><b>${esc(c.advisor)}</b><br><small>${esc(c.fate)}</small></div></div>`).join('')}</div>
      <h3>Henry's six wives</h3>${wivesHTML(all)}
      <p class="rhyme">"Divorced, beheaded, died; divorced, beheaded, survived."</p>
      <p>All three of Henry's children became rulers: <b>Edward VI</b> (1547–1553), <b>Mary I</b> (1553–1558) and <b>Elizabeth I</b> (1558–1603).</p>
      <div class="row"><button class="btn" id="print">🖨️ Print all my reports</button><button class="btn primary" id="ok">Finish ▶</button></div>`, 'wide');
    p.querySelector('#print').onclick = () => printHTML(CHAPTERS.filter((c) => progress.completed[c.id]).map((c) => reportHTML(c, progress.completed[c.id], true)).join('<div class="pagebreak"></div>'));
    p.querySelector('#ok').onclick = () => { closePanel(); resolve(); };
  });
}

// ---------------- Notebook, map, menus ----------------
function openNotebook(tab = 'sources') {
  if (G.mode !== 'play') return;
  setMode('ui');
  const s = G.s, ch = G.ch;
  const tabs = { sources: '🔍 Sources', facts: '📜 Facts', wives: '👑 Wives', timeline: '⏳ Timeline', palace: '🏰 Palace' };
  const body = () => {
    if (tab === 'sources') {
      const list = ch.sources.filter((x) => s.sources[x.id]);
      return list.length ? list.map((x) => `<div class="note"><h4>${esc(x.name)} <small>(${esc(x.date)})</small></h4><blockquote class="parch">${esc(x.text)}</blockquote><p>${x.about}</p><p class="small"><b>Who made it:</b> ${esc(x.origin)}</p></div>`).join('') : '<p>You have not examined any sources yet. Look for golden rings on the floor!</p>';
    }
    if (tab === 'facts') return s.facts.length ? `<ul class="facts">${s.facts.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : '<p>Talk to people around the palace to discover facts.</p>';
    if (tab === 'wives') return wivesHTML(wifeStatusMap(ch.id, !!s.flags.chapterDone)) + '<p class="rhyme">"Divorced, beheaded, died; divorced, beheaded, survived."</p>';
    if (tab === 'timeline') {
      const ev = TIMELINE.filter((e) => e.ch < ch.id || (e.ch === ch.id && (e.at === 's' || s.flags.chapterDone)));
      return `<ol class="timeline">${ev.map((e) => `<li><b>${e.y}</b><span>${esc(e.t)}</span></li>`).join('')}<li class="now"><b>Now</b><span>You are ${esc(ch.advisor)}, ${esc(ch.years)}. What happens next? Play on to find out!</span></li></ol>`;
    }
    return AREAS.map((a) => `<div class="note"><h4>${esc(a.name)}</h4><p>${esc(a.blurb)}</p></div>`).join('');
  };
  const render = () => {
    const p = openPanel(`<div class="kicker">📖 Notebook</div>
      <div class="tabs">${Object.entries(tabs).map(([k, v]) => `<button class="tab ${k === tab ? 'on' : ''}" data-t="${k}">${v}</button>`).join('')}</div>
      <div class="tabbody">${body()}</div>
      <div class="row"><span></span><button class="btn primary" id="close">Close</button></div>`, 'wide notebook');
    p.querySelectorAll('[data-t]').forEach((b) => { b.onclick = () => { tab = b.dataset.t; render(); }; });
    p.querySelector('#close').onclick = () => { closePanel(); setMode('play'); };
  };
  render();
}

function openMap() {
  if (G.mode !== 'play') return;
  setMode('ui');
  const size = Math.min(window.innerWidth - 60, window.innerHeight - 170, 760);
  const p = openPanel(`<div class="kicker">🗺️ Hampton Court Palace</div><canvas id="bigmap" width="${size * 2}" height="${size * 2}" style="width:${size}px;height:${size}px"></canvas>
    <div class="row"><span class="small">🟡 Gold dot = your task · ⚪ White dot = bonus · 🔺 Red arrow = you</span><button class="btn primary" id="close">Close</button></div>`, 'mappanel');
  const c = p.querySelector('#bigmap');
  const bg = drawMapBackground(size * 2, size * 2, true);
  drawMap(c.getContext('2d'), bg, size * 2, true);
  p.querySelector('#close').onclick = () => { closePanel(); setMode('play'); };
}

function openMenu() {
  if (G.mode !== 'play') return;
  setMode('ui');
  const p = openPanel(`<h2>⏸️ Paused</h2>
    <div class="stack">
      <button class="btn primary" data-a="resume">▶ Resume</button>
      <button class="btn" data-a="howto">❓ How to play</button>
      <button class="btn" data-a="settings">⚙️ Settings</button>
      <button class="btn" data-a="restart">🔄 Restart this chapter</button>
      <button class="btn" data-a="quit">🏰 Save and go to chapter menu</button>
    </div>`, 'card small-panel');
  p.querySelectorAll('[data-a]').forEach((b) => {
    b.onclick = async () => {
      const a = b.dataset.a;
      closePanel();
      if (a === 'resume') setMode('play');
      if (a === 'howto') { await showHowTo(); setMode('play'); }
      if (a === 'settings') { await showSettings(); setMode('play'); }
      if (a === 'restart') {
        if (confirm('Restart this chapter from the beginning?')) { store.del(SKEY); startChapter(G.ch, null, true); } else setMode('play');
      }
      if (a === 'quit') { saveChapter(); showChapterSelect(); }
    };
  });
}

function showHowTo() {
  return new Promise((resolve) => {
    const p = openPanel(`<h2>How to play</h2>
      <div class="howto">
        <div><span class="big">👈</span><b>Move</b><br>Put your thumb on the <b>left</b> side of the screen and slide it.</div>
        <div><span class="big">👉</span><b>Look around</b><br>Drag your finger on the <b>right</b> side of the screen.</div>
        <div><span class="big">✋</span><b>Talk and examine</b><br>Walk up to people and glowing objects, then tap the <b>big gold button</b>.</div>
        <div><span class="big">🧭</span><b>Find your way</b><br>Follow the <b>arrow</b> at the top and the <b>!</b> markers. Tap the map for a bigger view.</div>
      </div>
      <p class="small muted">On a computer: W A S D or arrow keys to move, drag the mouse to look, E to interact.</p>
      <div class="row"><span></span><button class="btn primary" id="ok">Got it!</button></div>`, 'card');
    p.querySelector('#ok').onclick = () => { closePanel(); progress.seenHowTo = true; saveProgress(); resolve(); };
  });
}

function showSettings() {
  return new Promise((resolve) => {
    const st = progress.settings;
    const p = openPanel(`<h2>⚙️ Settings</h2>
      <label class="set"><input type="checkbox" id="s-read" ${st.autoRead ? 'checked' : ''}> 🔊 Read everything aloud automatically</label>
      <label class="set"><input type="checkbox" id="s-easy" ${st.easyRead ? 'checked' : ''}> 🔤 Easy-read text (clearer letters, more spacing)</label>
      <label class="set"><input type="checkbox" id="s-big" ${st.bigText ? 'checked' : ''}> 🔎 Bigger text</label>
      <label class="set">👀 Look speed <input type="range" id="s-look" min="0.4" max="2" step="0.1" value="${st.look}"></label>
      <details class="teacher"><summary>For teachers</summary>
        <p class="small">Enter the teacher code to unlock all chapters. (See the README.)</p>
        <div class="row"><input id="s-code" inputmode="numeric" placeholder="Code" maxlength="8"><button class="btn" id="s-unlock">Unlock all chapters</button></div>
        <p><button class="btn danger" id="s-reset">Delete all progress on this iPad</button></p>
      </details>
      <div class="row"><span></span><button class="btn primary" id="ok">Done</button></div>`, 'card');
    const upd = () => {
      st.autoRead = p.querySelector('#s-read').checked;
      st.easyRead = p.querySelector('#s-easy').checked;
      st.bigText = p.querySelector('#s-big').checked;
      st.look = +p.querySelector('#s-look').value;
      applySettings();
      saveProgress();
    };
    p.querySelectorAll('input').forEach((i) => { i.onchange = upd; });
    p.querySelector('#s-unlock').onclick = () => {
      if (p.querySelector('#s-code').value.trim() === TEACHER_CODE) { progress.unlocked = 4; saveProgress(); toast('🔓 All chapters unlocked', 'good'); } else toast('That code is not right', 'bad');
    };
    p.querySelector('#s-reset').onclick = () => {
      if (confirm('Delete ALL progress and reports on this device?')) {
        store.del(PKEY); store.del(SKEY);
        progress = defaultProgress();
        applySettings();
        closePanel();
        resolve();
        showTitle();
      }
    };
    p.querySelector('#ok').onclick = () => { upd(); closePanel(); resolve(); };
  });
}

// ---------------- Title & chapter select ----------------
function showTitle() {
  setMode('menu');
  const saved = store.get(SKEY, null);
  const p = openPanel(`
    <div class="title-art">🏰</div>
    <h1>The King's Advisor</h1>
    <p class="subtitle">A Tudor adventure at Hampton Court Palace</p>
    <p>Serve King Henry VIII as four of his most famous advisors. Explore the palace, examine real sources, talk to the court and write letters to keep the King happy… if you can!</p>
    <div class="stack">
      ${saved ? `<button class="btn primary" id="cont">▶ Continue Chapter ${saved.id}</button>` : ''}
      <button class="btn ${saved ? '' : 'primary'}" id="play">👑 ${saved ? 'Choose a chapter' : 'Start'}</button>
      <button class="btn" id="settings">⚙️ Settings</button>
    </div>`, 'card title');
  if (saved) p.querySelector('#cont').onclick = () => { closePanel(); startChapter(CHAPTERS[saved.id - 1], saved); };
  p.querySelector('#play').onclick = async () => { closePanel(); if (!progress.name) await askName(); showChapterSelect(); };
  p.querySelector('#settings').onclick = async () => { closePanel(); await showSettings(); showTitle(); };
}

function askName() {
  return new Promise((resolve) => {
    const p = openPanel(`<h2>Welcome to court!</h2><p>What is your name? (It will appear on your Royal Reports.)</p>
      <input id="name" maxlength="30" autocomplete="off" placeholder="Your first name" value="${esc(progress.name)}">
      <div class="row"><span></span><button class="btn primary" id="ok">Enter the palace ▶</button></div>`, 'card');
    const go = () => { progress.name = p.querySelector('#name').value.trim().slice(0, 30) || 'Courtier'; saveProgress(); closePanel(); resolve(); };
    p.querySelector('#ok').onclick = go;
    p.querySelector('#name').onkeydown = (e) => { if (e.key === 'Enter') go(); };
  });
}

function showChapterSelect() {
  setMode('menu');
  const saved = store.get(SKEY, null);
  const p = openPanel(`<div class="kicker">Hello, ${esc(progress.name || 'Courtier')}!</div><h2>Choose your advisor</h2>
    <div class="chapters">${CHAPTERS.map((c) => {
      const locked = c.id > progress.unlocked;
      const done = progress.completed[c.id];
      return `<button class="chap ${locked ? 'locked' : ''}" data-c="${c.id}" ${locked ? 'disabled' : ''}>
        <img src="${portraitURL(c.you, 'you' + c.id)}" alt="">
        <div><div class="cnum">Chapter ${c.id} · ${esc(c.years)}</div><b>${esc(c.advisor)}</b><div class="ctitle">${esc(c.title)}</div>
        <div class="cstat">${locked ? '🔒 Finish the chapter before to unlock' : done ? `${'⭐'.repeat(done.stars)}${'☆'.repeat(3 - done.stars)} Completed` : saved && saved.id === c.id ? '⏳ In progress' : '▶ Ready to play'}</div></div></button>`;
    }).join('')}</div>
    <div class="row"><button class="btn" id="back">◀ Title</button>${Object.keys(progress.completed).length ? '<button class="btn" id="reports">🖨️ My reports</button>' : ''}</div>`, 'wide');
  p.querySelectorAll('[data-c]').forEach((b) => {
    b.onclick = async () => {
      const ch = CHAPTERS[+b.dataset.c - 1];
      closePanel();
      if (saved && saved.id === ch.id) {
        const pp = openPanel(`<h2>Chapter ${ch.id}</h2><p>You have a saved game for this chapter.</p><div class="row"><button class="btn" id="new">Start again</button><button class="btn primary" id="cont">▶ Continue</button></div>`, 'card small-panel');
        const r = await new Promise((res) => { pp.querySelector('#new').onclick = () => res(false); pp.querySelector('#cont').onclick = () => res(true); });
        closePanel();
        startChapter(ch, r ? saved : null, !r);
      } else startChapter(ch, null);
    };
  });
  p.querySelector('#back').onclick = () => { closePanel(); showTitle(); };
  const rb = p.querySelector('#reports');
  if (rb) rb.onclick = () => printHTML(CHAPTERS.filter((c) => progress.completed[c.id]).map((c) => reportHTML(c, progress.completed[c.id], true)).join('<div class="pagebreak"></div>'));
}

async function startChapter(ch, saved, fresh = false) {
  if (fresh || !saved) store.del(SKEY);
  $('#loading').classList.add('show');
  await wait(30);
  G.background = false;
  loadChapter(ch, saved);
  renderer.render(scene, camera);
  $('#loading').classList.remove('show');
  if (!saved) {
    setMode('ui');
    await cardSequence(ch.intro, { title: `Chapter ${ch.id} · ${ch.title}`, finalLabel: 'Begin ▶' });
    if (!progress.seenHowTo) await showHowTo();
    saveChapter();
  }
  setMode('play');
}

// ---------------- Map drawing ----------------
const MAPB = { x1: -62, x2: 62, z1: -57, z2: 52 };
function mapXf(W, H) {
  const pad = W * 0.04;
  const s = Math.min((W - pad * 2) / (MAPB.x2 - MAPB.x1), (H - pad * 2) / (MAPB.z2 - MAPB.z1));
  const ox = (W - (MAPB.x2 - MAPB.x1) * s) / 2, oy = (H - (MAPB.z2 - MAPB.z1) * s) / 2;
  return { s, f: (x, z) => [ox + (x - MAPB.x1) * s, oy + (z - MAPB.z1) * s] };
}
function drawMapBackground(W, H, labels = false) {
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  const { s, f } = mapXf(W, H);
  g.fillStyle = '#6f9a4f'; g.fillRect(0, 0, W, H);
  const [, ry] = f(0, 50.5);
  g.fillStyle = '#4c7a8f'; g.fillRect(0, ry, W, H - ry);
  const cols = { court: '#cdbf9f', room: '#efe2c2', garden: '#8fb66a' };
  for (const a of AREAS) {
    const [x1, y1] = f(a.x1, a.z1), [x2, y2] = f(a.x2, a.z2);
    g.fillStyle = cols[a.kind];
    g.fillRect(x1, y1, x2 - x1, y2 - y1);
  }
  g.strokeStyle = '#8e3a24';
  g.lineWidth = Math.max(2, s * 0.8);
  g.lineCap = 'round';
  for (const [x1, z1, x2, z2] of MAP_WALLS) {
    const [a, b] = f(x1, z1), [c2, d] = f(x2, z2);
    g.beginPath(); g.moveTo(a, b); g.lineTo(c2, d); g.stroke();
  }
  if (labels) {
    g.fillStyle = '#3a2410';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    for (const a of AREAS) {
      const [cx, cy] = f((a.x1 + a.x2) / 2, (a.z1 + a.z2) / 2);
      g.font = `bold ${Math.round(W / 42)}px Georgia, serif`;
      const words = a.name.split(' ');
      if (a.x2 - a.x1 < 14 && words.length > 1) words.forEach((w, i) => g.fillText(w, cx, cy + (i - (words.length - 1) / 2) * W / 38));
      else g.fillText(a.name, cx, cy);
    }
    g.font = `italic ${Math.round(W / 46)}px Georgia, serif`;
    g.fillStyle = '#e8f2f6';
    g.fillText('River Thames', W / 2, (ry + H) / 2);
  }
  return c;
}
function drawMap(g, bg, W, big = false) {
  const H = W;
  g.drawImage(bg, 0, 0, W, H);
  const { f } = mapXf(W, H);
  const r = big ? W / 85 : W / 34;
  for (const { t, optional } of activeTargets()) {
    const p = targetPos(t);
    if (!p) continue;
    const [x, y] = f(p.x, p.z);
    g.fillStyle = optional ? '#e6edf5' : '#f4c430';
    g.strokeStyle = '#3a2400'; g.lineWidth = big ? 3 : 1.5;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); g.stroke();
  }
  const [px, py] = f(G.pos.x, G.pos.z);
  g.save();
  g.translate(px, py);
  g.rotate(-controls.yaw);
  g.fillStyle = '#c0141c'; g.strokeStyle = '#fff'; g.lineWidth = big ? 3 : 1.5;
  const k = big ? W / 50 : W / 22;
  g.beginPath(); g.moveTo(0, -k); g.lineTo(k * 0.6, k * 0.7); g.lineTo(0, k * 0.35); g.lineTo(-k * 0.6, k * 0.7); g.closePath(); g.fill(); g.stroke();
  g.restore();
}

// ---------------- Main loop ----------------
const PLAYER_R = 0.35;
function collide(x, z) {
  for (let iter = 0; iter < 3; iter++) {
    for (const b of G.world.colliders) {
      const cx = clamp(x, b.minX, b.maxX), cz = clamp(z, b.minZ, b.maxZ);
      const dx = x - cx, dz = z - cz, d2 = dx * dx + dz * dz;
      if (d2 < PLAYER_R * PLAYER_R) {
        if (d2 > 1e-8) {
          const d = Math.sqrt(d2), push = PLAYER_R - d;
          x += (dx / d) * push; z += (dz / d) * push;
        } else {
          const pen = [x - b.minX, b.maxX - x, z - b.minZ, b.maxZ - z];
          const m = Math.min(...pen), i = pen.indexOf(m);
          if (i === 0) x = b.minX - PLAYER_R; else if (i === 1) x = b.maxX + PLAYER_R; else if (i === 2) z = b.minZ - PLAYER_R; else z = b.maxZ + PLAYER_R;
        }
      }
    }
    for (const [, n] of G.npcs) {
      if (!n.group.visible) continue;
      const dx = x - n.group.position.x, dz = z - n.group.position.z, d = Math.hypot(dx, dz), min = PLAYER_R + 0.35 * (n.def.look.width || 1);
      if (d < min && d > 1e-6) { x = n.group.position.x + (dx / d) * min; z = n.group.position.z + (dz / d) * min; }
    }
  }
  return { x, z };
}

function interactables() {
  const out = [];
  for (const [, n] of G.npcs) if (n.group.visible) out.push({ x: n.group.position.x, z: n.group.position.z, r: 2.6, label: `💬 Talk to ${n.def.name}`, go: () => talkTo(n) });
  for (const [id, s] of G.sources) if (s.group.visible) out.push({ x: s.x, z: s.z, r: s.def.kind === 'carving' ? 3.2 : 2.2, label: G.s.sources[id] ? `🔍 Look again: ${s.def.name}` : `🔍 Examine: ${s.def.name}`, go: () => examineSource(s) });
  for (const [, sp] of G.spots) if (spotEnabled(sp)) out.push({ x: sp.x, z: sp.z, r: 2.2, label: `✒️ ${sp.def.label}`, go: () => useSpot(sp) });
  return out;
}

function nearestInteractable() {
  const fx = -Math.sin(controls.yaw), fz = -Math.cos(controls.yaw);
  let best = null, bestScore = Infinity;
  for (const it of interactables()) {
    const dx = it.x - G.pos.x, dz = it.z - G.pos.z, d = Math.hypot(dx, dz);
    if (d > it.r) continue;
    const ang = d > 0.01 ? Math.acos(clamp((dx * fx + dz * fz) / d, -1, 1)) : 0;
    if (ang > 1.4 && d > 1.3) continue;
    const score = d + ang * 1.2;
    if (score < bestScore) { bestScore = score; best = it; }
  }
  return best;
}

function updateGuide() {
  const el = $('#guide');
  const tg = activeTargets();
  const main = tg.filter((x) => !x.optional);
  const pool = main.length ? main : tg;
  let best = null, bd = Infinity;
  for (const { t } of pool) {
    const p = targetPos(t);
    if (!p) continue;
    const d = Math.hypot(p.x - G.pos.x, p.z - G.pos.z);
    if (d < bd) { bd = d; best = p; }
  }
  if (!best || bd < 3) { el.classList.remove('show'); return; }
  const dx = best.x - G.pos.x, dz = best.z - G.pos.z;
  const fwd = dx * -Math.sin(controls.yaw) + dz * -Math.cos(controls.yaw);
  const right = dx * Math.cos(controls.yaw) - dz * Math.sin(controls.yaw);
  const ang = Math.atan2(right, fwd);
  const area = areaAt(best.x, best.z);
  el.classList.add('show');
  el.querySelector('.arrow').style.transform = `rotate(${ang}rad)`;
  el.querySelector('.gtext').textContent = `${best.name}${area ? ' · ' + area.name : ''}`;
}

let lastT = performance.now(), frame = 0, actTarget = null;
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, (now - lastT) / 1000);
  lastT = now;
  frame++;
  if (!G.ch) return;
  const t = now / 1000;

  if (G.mode === 'play') {
    const mv = controls.input(dt);
    const speed = 4.3;
    const fx = -Math.sin(controls.yaw), fz = -Math.cos(controls.yaw);
    const rx = Math.cos(controls.yaw), rz = -Math.sin(controls.yaw);
    const nx = G.pos.x + (fx * mv.y + rx * mv.x) * speed * dt;
    const nz = G.pos.z + (fz * mv.y + rz * mv.x) * speed * dt;
    const p = collide(nx, nz);
    G.pos.x = p.x; G.pos.z = p.z;

    const a = areaAt(G.pos.x, G.pos.z);
    if (a && a !== G.area) {
      G.area = a;
      const at = $('#area-toast');
      at.innerHTML = `<b>${esc(a.name)}</b>`;
      at.classList.remove('show'); void at.offsetWidth; at.classList.add('show');
    }

    actTarget = nearestInteractable();
    const act = $('#act');
    if (actTarget) { act.hidden = false; act.querySelector('.alabel').textContent = actTarget.label; } else act.hidden = true;
    const k = controls.keys;
    if (actTarget && (k.has('e') || k.has('enter') || k.has(' '))) { k.delete('e'); k.delete('enter'); k.delete(' '); actTarget.go(); }

    if (frame % 3 === 0) updateGuide();
    if (now - G.lastSave > 5000) { G.lastSave = now; saveChapter(); }
  } else {
    $('#act').hidden = true;
  }

  if (G.mode === 'dialogue' && G.focus) {
    // Frame the person we are talking to at a comfortable distance.
    const n = G.focus, nx = n.group.position.x, nz = n.group.position.z;
    let dx = G.pos.x - nx, dz = G.pos.z - nz;
    const d = Math.hypot(dx, dz) || 1;
    dx /= d; dz /= d;
    const want = 2.3 * (n.def.look.scale || 1) + 0.4 * ((n.def.look.width || 1) - 1);
    const dist = Math.max(d, want);
    const cx = nx + dx * dist, cz = nz + dz * dist;
    const yawT = Math.atan2(-(nx - cx), -(nz - cz));
    let dy = yawT - controls.yaw;
    dy = Math.atan2(Math.sin(dy), Math.cos(dy));
    controls.yaw += dy * Math.min(1, dt * 6);
    const pitchT = Math.atan2(1.55 * (n.def.look.scale || 1) - 1.62, dist) + 0.06;
    controls.pitch += (pitchT - controls.pitch) * Math.min(1, dt * 6);
    camera.position.set(cx, 1.62, cz);
  } else {
    camera.position.set(G.pos.x, 1.62, G.pos.z);
  }
  camera.rotation.y = controls.yaw;
  camera.rotation.x = controls.pitch;

  // NPCs: breathe, and turn to face you when you are close.
  for (const [, n] of G.npcs) {
    if (!n.group.visible) continue;
    const dx = G.pos.x - n.group.position.x, dz = G.pos.z - n.group.position.z, d = Math.hypot(dx, dz);
    const target = d < 5 ? Math.atan2(dx, dz) : n.yaw;
    let diff = target - n.group.rotation.y;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    n.group.rotation.y += diff * Math.min(1, dt * 4);
    n.group.children[0].scale.y = (n.def.look.scale || 1) * (1 + Math.sin(t * 2 + n.phase) * 0.008);
    n.label.visible = d < 16 && d > 1.8 && G.focus !== n;
    if (G.focus === n) n.marker.visible = false;
    n.marker.position.y = 2.8 * (n.def.look.scale || 1) + Math.sin(t * 3) * 0.08;
  }
  for (const [, s] of G.sources) {
    if (s.ring.visible) { s.ring.material.opacity = 0.55 + Math.sin(t * 4) * 0.35; s.ring.rotation.z = t; }
    if (s.marker.visible) s.marker.position.y = (s.def.kind === 'carving' ? 5.2 : 2.1) + Math.sin(t * 3) * 0.08;
  }
  for (const [, sp] of G.spots) {
    if (sp.ring.visible) sp.ring.material.opacity = 0.55 + Math.sin(t * 4) * 0.35;
    sp.marker.position.y = 2.2 + Math.sin(t * 3) * 0.08;
  }
  G.world.update(t);

  if (G.mode === 'play' && frame % 2 === 0) {
    const mm = $('#minimap');
    drawMap(mm.getContext('2d'), G.mapBg, mm.width);
  }
  renderer.render(scene, camera);
}

// ---------------- HUD buttons ----------------
$('#act').onclick = () => { if (actTarget && G.mode === 'play') actTarget.go(); };
$('#btn-notes').onclick = () => openNotebook();
$('#btn-map').onclick = () => openMap();
$('#minimap').onclick = () => openMap();
$('#btn-menu').onclick = () => openMenu();
document.addEventListener('visibilitychange', () => { if (document.hidden) saveChapter(); });
window.addEventListener('pagehide', saveChapter);

// ---------------- Start ----------------
// Show a gentle palace view behind the title screen.
G.background = true;
loadChapter(CHAPTERS[0], { s: freshState(CHAPTERS[0]), pos: { x: -44, z: 12, yaw: -0.4 } });
$('#loading').classList.remove('show');
requestAnimationFrame(loop);
showTitle();
