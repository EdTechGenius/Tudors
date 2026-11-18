// Touch controls for iPad (left thumb = move, right thumb = look),
// plus keyboard and mouse for teachers testing on a computer.
export class Controls {
  constructor(layer, joyBase, joyKnob) {
    this.layer = layer;
    this.joyBase = joyBase;
    this.joyKnob = joyKnob;
    this.yaw = 0;
    this.pitch = 0;
    this.move = { x: 0, y: 0 };
    this.enabled = false;
    this.sensitivity = 1;
    this.joyId = null;
    this.lookId = null;
    this.keys = new Set();
    this.joyRadius = 60;

    layer.addEventListener('pointerdown', (e) => this.down(e));
    window.addEventListener('pointermove', (e) => this.moveEv(e), { passive: false });
    window.addEventListener('pointerup', (e) => this.up(e));
    window.addEventListener('pointercancel', (e) => this.up(e));
    window.addEventListener('keydown', (e) => {
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      this.keys.add(e.key.toLowerCase());
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase()));
    window.addEventListener('blur', () => { this.keys.clear(); this.reset(); });
  }

  reset() {
    this.joyId = null;
    this.lookId = null;
    this.move.x = this.move.y = 0;
    this.joyBase.classList.remove('active');
  }

  down(e) {
    if (!this.enabled) return;
    e.preventDefault();
    const touchLike = e.pointerType !== 'mouse';
    this.tapStart = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now() };
    if (touchLike && e.clientX < window.innerWidth * 0.45 && this.joyId === null) {
      this.joyId = e.pointerId;
      this.joyStart = { x: e.clientX, y: e.clientY };
      this.joyBase.style.left = e.clientX + 'px';
      this.joyBase.style.top = e.clientY + 'px';
      this.joyKnob.style.transform = 'translate(-50%,-50%)';
      this.joyBase.classList.add('active');
    } else if (this.lookId === null) {
      this.lookId = e.pointerId;
      this.last = { x: e.clientX, y: e.clientY };
    }
  }

  moveEv(e) {
    if (e.pointerId === this.joyId) {
      e.preventDefault();
      let dx = e.clientX - this.joyStart.x, dy = e.clientY - this.joyStart.y;
      const len = Math.hypot(dx, dy), max = this.joyRadius;
      if (len > max) { dx = (dx / len) * max; dy = (dy / len) * max; }
      this.move.x = dx / max;
      this.move.y = dy / max;
      this.joyKnob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    } else if (e.pointerId === this.lookId) {
      e.preventDefault();
      const dx = e.clientX - this.last.x, dy = e.clientY - this.last.y;
      this.last = { x: e.clientX, y: e.clientY };
      const k = 0.0045 * this.sensitivity;
      this.yaw -= dx * k;
      this.pitch = Math.max(-1.1, Math.min(1.1, this.pitch - dy * k));
    }
  }

  up(e) {
    const ts = this.tapStart;
    if (ts && ts.id === e.pointerId && performance.now() - ts.t < 350 && Math.hypot(e.clientX - ts.x, e.clientY - ts.y) < 12 && this.onTap) {
      this.tapStart = null;
      this.onTap(e.clientX, e.clientY);
    }
    if (ts && ts.id === e.pointerId) this.tapStart = null;
    if (e.pointerId === this.joyId) {
      this.joyId = null;
      this.move.x = this.move.y = 0;
      this.joyBase.classList.remove('active');
    }
    if (e.pointerId === this.lookId) this.lookId = null;
  }

  // Combined input this frame: {x: strafe, y: forward}, turn from arrow keys.
  input(dt) {
    let x = this.move.x, y = -this.move.y;
    if (this.enabled) {
      const k = this.keys;
      if (k.has('w') || k.has('arrowup')) y += 1;
      if (k.has('s') || k.has('arrowdown')) y -= 1;
      if (k.has('a')) x -= 1;
      if (k.has('d')) x += 1;
      if (k.has('arrowleft')) this.yaw += 2.2 * dt;
      if (k.has('arrowright')) this.yaw -= 2.2 * dt;
    }
    const len = Math.hypot(x, y);
    if (len > 1) { x /= len; y /= len; }
    return { x, y };
  }
}
