// Collects static geometry and merges it by material, so the whole palace
// draws in a few dozen calls (important for smooth play on iPads).
import * as THREE from '../vendor/three.module.min.js';

export class Builder {
  constructor() {
    this.buckets = new Map(); // material -> [{geo, group}]
    this.colliders = []; // {minX,maxX,minZ,maxZ}
  }

  _push(geo, mats) {
    if (Array.isArray(mats)) {
      geo.groups.forEach((g, i) => this._bucket(mats[g.materialIndex ?? i]).push({ geo, group: g }));
    } else {
      this._bucket(mats).push({ geo, group: null });
    }
  }

  _bucket(mat) {
    if (!this.buckets.has(mat)) this.buckets.set(mat, []);
    return this.buckets.get(mat);
  }

  collider(cx, cz, w, d) {
    this.colliders.push({ minX: cx - w / 2, maxX: cx + w / 2, minZ: cz - d / 2, maxZ: cz + d / 2 });
  }

  // Box with UVs scaled to world size so textures tile evenly.
  box(w, h, d, mat, x, y, z, { rotY = 0, rotX = 0, rotZ = 0, uv = 2, collide = false } = {}) {
    const geo = new THREE.BoxGeometry(w, h, d);
    worldUV(geo, w, h, d, uv);
    place(geo, x, y, z, rotX, rotY, rotZ);
    this._push(geo, mat);
    if (collide) {
      const swap = Math.abs(Math.sin(rotY)) > 0.7;
      this.collider(x, z, swap ? d : w, swap ? w : d);
    }
    return geo;
  }

  plane(w, h, mat, x, y, z, { rotX = 0, rotY = 0, uv = 2 } = {}) {
    const geo = new THREE.PlaneGeometry(w, h);
    const a = geo.attributes.uv;
    for (let i = 0; i < a.count; i++) a.setXY(i, (a.getX(i) * w) / uv, (a.getY(i) * h) / uv);
    place(geo, x, y, z, rotX, rotY, 0);
    this._push(geo, mat);
    return geo;
  }

  cyl(rt, rb, h, seg, mat, x, y, z, { collide = false, rotX = 0, rotZ = 0, uv = 2 } = {}) {
    const geo = new THREE.CylinderGeometry(rt, rb, h, seg);
    const a = geo.attributes.uv;
    const circ = Math.PI * 2 * Math.max(rt, rb);
    for (let i = 0; i < a.count; i++) a.setXY(i, (a.getX(i) * circ) / uv, (a.getY(i) * h) / uv);
    place(geo, x, y, z, rotX, 0, rotZ);
    this._push(geo, mat);
    if (collide) this.collider(x, z, rb * 2, rb * 2);
    return geo;
  }

  cone(r, h, seg, mat, x, y, z) {
    const geo = new THREE.ConeGeometry(r, h, seg);
    place(geo, x, y, z, 0, 0, 0);
    this._push(geo, mat);
  }

  sphere(r, mat, x, y, z, sx = 1, sy = 1, sz = 1) {
    const geo = new THREE.SphereGeometry(r, 10, 8);
    geo.scale(sx, sy, sz);
    place(geo, x, y, z, 0, 0, 0);
    this._push(geo, mat);
  }

  // Arbitrary geometry (already positioned).
  raw(geo, mat) {
    this._push(geo, mat);
  }

  // Merge everything into a Group of meshes.
  finish() {
    const group = new THREE.Group();
    for (const [mat, entries] of this.buckets) {
      const geo = merge(entries);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.matrixAutoUpdate = false;
      group.add(mesh);
    }
    this.buckets.clear();
    return group;
  }
}

function place(geo, x, y, z, rx, ry, rz) {
  const m = new THREE.Matrix4().compose(
    new THREE.Vector3(x, y, z),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz, 'YXZ')),
    new THREE.Vector3(1, 1, 1),
  );
  geo.applyMatrix4(m);
}

function worldUV(geo, w, h, d, s) {
  const uv = geo.attributes.uv;
  // face order: +x, -x, +y, -y, +z, -z (4 vertices each)
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) {
    for (let v = 0; v < 4; v++) {
      const i = f * 4 + v;
      uv.setXY(i, (uv.getX(i) * dims[f][0]) / s, (uv.getY(i) * dims[f][1]) / s);
    }
  }
}

function merge(entries) {
  let vcount = 0, icount = 0;
  for (const { geo, group } of entries) {
    vcount += geo.attributes.position.count;
    icount += group ? group.count : geo.index ? geo.index.count : geo.attributes.position.count;
  }
  const pos = new Float32Array(vcount * 3);
  const nor = new Float32Array(vcount * 3);
  const uvs = new Float32Array(vcount * 2);
  const idx = new Uint32Array(icount);
  let vo = 0, io = 0;
  for (const { geo, group } of entries) {
    const n = geo.attributes.position.count;
    pos.set(geo.attributes.position.array, vo * 3);
    nor.set(geo.attributes.normal.array, vo * 3);
    if (geo.attributes.uv) uvs.set(geo.attributes.uv.array, vo * 2);
    if (geo.index) {
      const start = group ? group.start : 0;
      const count = group ? group.count : geo.index.count;
      for (let i = 0; i < count; i++) idx[io++] = geo.index.array[start + i] + vo;
    } else {
      for (let i = 0; i < n; i++) idx[io++] = i + vo;
    }
    vo += n;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  out.setIndex(new THREE.BufferAttribute(idx, 1));
  out.computeBoundingSphere();
  return out;
}
