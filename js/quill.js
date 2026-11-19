// Quill-and-ink handwriting pad, designed for Apple Pencil (also works with a finger or mouse).
// - Pencil pressure changes the line thickness.
// - A slanted "nib" makes strokes thick and thin like a real quill.
// - The ink runs out as you write: dip the quill in the inkpot to refill it!
// - When a Pencil is being used, palm/finger touches on the pad are ignored.

export function createQuillPad(host, opts = {}) {
  const { height = 220, guideImg = null, guideText = '', lines = false, placeholder = 'Write here with your quill…' } = opts;
  host.innerHTML = `
    <div class="quill-pad${lines ? ' lined' : ''}" style="height:${height}px">
      ${guideImg ? `<img class="quill-guide" src="${guideImg}" alt="">` : ''}
      ${guideText ? `<div class="quill-guide-text">${guideText}</div>` : ''}
      <canvas></canvas>
      <div class="quill-placeholder">${placeholder}</div>
    </div>
    <div class="quill-tools">
      <button class="btn ink-btn" type="button" aria-label="Dip your quill in the ink">
        <span class="inkpot"><span class="ink-level"></span></span> Dip quill
      </button>
      <button class="btn" type="button" data-q="undo">↩️ Undo</button>
      <button class="btn" type="button" data-q="clear">🧽 Clear</button>
    </div>`;
  const pad = host.querySelector('.quill-pad');
  const canvas = pad.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const levelEl = host.querySelector('.ink-level');
  const placeholderEl = pad.querySelector('.quill-placeholder');
  let dpr = 1, W = 0, H = 0;
  let ink = 1, justDipped = true, penSeen = false;
  const strokes = [];
  let cur = null, activeId = null;

  function size() {
    const r = pad.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(10, r.width); H = Math.max(10, r.height);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    redraw();
  }

  // Draw one segment of a stroke with a calligraphic nib.
  function segment(a, b) {
    const nib = -0.6; // nib angle (radians)
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len < 0.01) return;
    const ang = Math.atan2(dy, dx);
    const slant = 0.35 + 0.65 * Math.abs(Math.sin(ang - nib));
    const w = Math.max(0.8, b.base * slant);
    ctx.strokeStyle = `rgba(32, 20, 10, ${b.alpha})`;
    ctx.lineWidth = w * dpr;
    ctx.beginPath();
    ctx.moveTo(a.x * dpr, a.y * dpr);
    ctx.lineTo(b.x * dpr, b.y * dpr);
    ctx.stroke();
  }
  function drawStroke(s) {
    if (s.blot) {
      ctx.fillStyle = 'rgba(32,20,10,0.85)';
      ctx.beginPath(); ctx.arc(s.pts[0].x * dpr, s.pts[0].y * dpr, s.blot * dpr, 0, Math.PI * 2); ctx.fill();
    }
    for (let i = 1; i < s.pts.length; i++) segment(s.pts[i - 1], s.pts[i]);
    if (s.pts.length === 1) {
      ctx.fillStyle = `rgba(32,20,10,${s.pts[0].alpha})`;
      ctx.beginPath(); ctx.arc(s.pts[0].x * dpr, s.pts[0].y * dpr, (s.pts[0].base / 2) * dpr, 0, Math.PI * 2); ctx.fill();
    }
  }
  function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    strokes.forEach(drawStroke);
    placeholderEl.style.display = strokes.length ? 'none' : '';
  }
  function showInk() {
    levelEl.style.height = Math.round(ink * 100) + '%';
    host.querySelector('.ink-btn').classList.toggle('empty', ink < 0.15);
  }

  function point(e, prev) {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    let pressure = e.pointerType === 'pen' ? (e.pressure || 0.5) : 0.5;
    if (e.pointerType !== 'pen' && prev) {
      // fingers and mice have no pressure: write thinner when moving fast
      const v = Math.hypot(x - prev.x, y - prev.y);
      pressure = Math.max(0.25, 0.6 - v * 0.012);
    }
    const base = 1.2 + pressure * 5.5;
    const alpha = Math.max(0.12, Math.min(0.95, 0.15 + ink * 0.85));
    return { x, y, base, alpha };
  }

  let locked = false;
  canvas.addEventListener('pointerdown', (e) => {
    if (locked) return;
    if (e.pointerType === 'pen') penSeen = true;
    if (penSeen && e.pointerType === 'touch') return; // palm rejection
    if (activeId !== null) return;
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    activeId = e.pointerId;
    const p = point(e, null);
    cur = { pts: [p], blot: justDipped && Math.random() < 0.5 ? 2 + Math.random() * 2.5 : 0 };
    justDipped = false;
    strokes.push(cur);
    drawStroke(cur);
    placeholderEl.style.display = 'none';
  });
  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerId !== activeId || !cur) return;
    e.preventDefault();
    const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of events) {
      const prev = cur.pts[cur.pts.length - 1];
      const p = point(ev, prev);
      const d = Math.hypot(p.x - prev.x, p.y - prev.y);
      if (d < 0.6) continue;
      cur.pts.push(p);
      segment(prev, p);
      ink = Math.max(0, ink - d / 2600); // the quill slowly runs dry
    }
    showInk();
  });
  const end = (e) => {
    if (e.pointerId !== activeId) return;
    activeId = null;
    cur = null;
    opts.onChange && opts.onChange();
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  host.querySelector('.ink-btn').addEventListener('click', () => {
    ink = 1; justDipped = true; showInk();
    const b = host.querySelector('.ink-btn');
    b.classList.remove('dip'); void b.offsetWidth; b.classList.add('dip');
  });
  host.querySelector('[data-q="undo"]').addEventListener('click', () => { strokes.pop(); redraw(); opts.onChange && opts.onChange(); });
  host.querySelector('[data-q="clear"]').addEventListener('click', () => { strokes.length = 0; redraw(); opts.onChange && opts.onChange(); });

  requestAnimationFrame(size);
  window.addEventListener('resize', size);
  showInk();

  return {
    isEmpty: () => strokes.length === 0 || strokes.reduce((n, s) => n + s.pts.length, 0) < 4,
    // A small transparent PNG of the writing, cropped to the ink.
    toDataURL(maxW = 600) {
      if (!strokes.length) return null;
      let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
      for (const s of strokes) for (const p of s.pts) { x1 = Math.min(x1, p.x); y1 = Math.min(y1, p.y); x2 = Math.max(x2, p.x); y2 = Math.max(y2, p.y); }
      const pad2 = 8;
      x1 = Math.max(0, x1 - pad2); y1 = Math.max(0, y1 - pad2); x2 = Math.min(W, x2 + pad2); y2 = Math.min(H, y2 + pad2);
      const w = x2 - x1, h = y2 - y1;
      const scale = Math.min(1, maxW / w);
      const out = document.createElement('canvas');
      out.width = Math.max(1, Math.round(w * scale)); out.height = Math.max(1, Math.round(h * scale));
      out.getContext('2d').drawImage(canvas, x1 * dpr, y1 * dpr, w * dpr, h * dpr, 0, 0, out.width, out.height);
      return out.toDataURL('image/png');
    },
    destroy() { window.removeEventListener('resize', size); },
    lock() { locked = true; host.querySelectorAll('.quill-tools button').forEach((b) => { b.disabled = true; }); },
  };
}
