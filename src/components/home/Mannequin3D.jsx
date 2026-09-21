import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { HEALTH_NEEDS } from '../../data/healthNeeds';

/**
 * Procedural anatomical mannequin ("муляж") — a translucent, skin-tinted
 * figure with a real anatomical interior: brain with gyri, lungs +
 * trachea, beating heart, aorta and leg vessels, thymus, liver, stomach,
 * intestines, uterus, ribs, spine and ivory ball-joints.
 *
 * Every organ group is wired to one of the 8 health needs:
 *   sleep_stress → brain          immunity_energy → lungs + throat
 *   vitamins_minerals → skin/hands + whole-body glow
 *   joints_muscles → ball joints  gastro_digestion → stomach/liver/gut
 *   women_health → uterus         kids_health → thymus
 *   veins_vessels → heart + vessels
 * Hovering a need bubble (activeNeed prop) makes that organ glow and shows
 * a label; hovering / clicking the organ itself does the reverse.
 *
 * It's fully generated in code — no model file, no third-party likeness.
 * Head + eyes follow the cursor; drag to spin the figure.
 */

const GLOW = {
  sleep_stress: '#a5b4fc',
  immunity_energy: '#34d399',
  vitamins_minerals: '#fbbf24',
  joints_muscles: '#60a5fa',
  gastro_digestion: '#bef264',
  women_health: '#fb7185',
  kids_health: '#38bdf8',
  veins_vessels: '#f87171'
};

// ---------- geometry helpers ----------
const noise3 = (x, y, z) =>
  Math.sin(x * 1.7 + Math.sin(y * 2.1) * 1.4) * Math.sin(y * 1.9 + Math.sin(z * 2.3) * 1.5) +
  0.5 * Math.sin(z * 3.1 + x * 2.7);

function blobGeometry({ rx, ry, rz, detail = 14, amp = 0, freq = 6, seed = 0 }) {
  let g = new THREE.IcosahedronGeometry(1, detail);
  g.deleteAttribute('normal');
  g.deleteAttribute('uv');
  g = mergeVertices(g, 1e-4);
  const p = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = amp ? noise3(v.x * freq + seed, v.y * freq, v.z * freq + seed * 0.5) : 0;
    const s = 1 + amp * n;
    p.setXYZ(i, v.x * rx * s, v.y * ry * s, v.z * rz * s);
  }
  g.computeVertexNormals();
  return g;
}

const sphereGeo = new THREE.SphereGeometry(1, 40, 28);

// ---------- materials ----------
function makeShellMaterial() {
  const m = new THREE.MeshPhysicalMaterial({
    color: 0xf0c4a2,
    roughness: 0.32,
    metalness: 0,
    clearcoat: 0.7,
    clearcoatRoughness: 0.25,
    transparent: true,
    opacity: 0.32,
    depthWrite: false,
    emissive: new THREE.Color('#fbbf24'),
    emissiveIntensity: 0,
    envMapIntensity: 0.9
  });
  // Fresnel rim: edges of the body catch light and turn more opaque, which
  // gives the "glass mannequin" read instead of a flat ghost.
  m.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <opaque_fragment>',
      `
      float fres = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition))), 2.4);
      outgoingLight += vec3(0.55, 0.95, 0.82) * fres * 0.32;
      diffuseColor.a = clamp(diffuseColor.a + fres * 0.5, 0.0, 0.92);
      #include <opaque_fragment>
      `
    );
  };
  return m;
}

const organMaterial = (color, extra = {}) =>
  new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.42,
    metalness: 0,
    clearcoat: 0.75, // wet, glossy tissue look
    clearcoatRoughness: 0.22,
    emissive: new THREE.Color(0x000000),
    emissiveIntensity: 0,
    envMapIntensity: 0.8,
    ...extra
  });

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.45)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function shadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(2,44,34,0.55)');
  g.addColorStop(0.6, 'rgba(2,44,34,0.18)');
  g.addColorStop(1, 'rgba(2,44,34,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

// ---------- the scene ----------
function buildScene(scene, lang) {
  const disposables = [];
  const track = (o) => { disposables.push(o); return o; };

  const root = new THREE.Group();
  scene.add(root);

  // Registry: one entry per health need
  const reg = {};
  HEALTH_NEEDS.forEach((n) => {
    reg[n.id] = { meshes: [], mats: new Set(), anchor: new THREE.Object3D(), k: 0, color: new THREE.Color(GLOW[n.id]), sprite: null };
  });
  const pickables = [];
  const register = (id, mesh) => {
    mesh.userData.needId = id;
    reg[id].meshes.push(mesh);
    reg[id].mats.add(mesh.material);
    pickables.push(mesh);
    return mesh;
  };

  const shellMat = track(makeShellMaterial());
  const boneMat = track(organMaterial(0xece3cf, { roughness: 0.38, clearcoat: 0.35 }));

  const add = (parent, geo, mat, pos = [0, 0, 0], scale = null) => {
    const m = new THREE.Mesh(track(geo), mat);
    m.position.set(...pos);
    if (scale) m.scale.set(...scale);
    parent.add(m);
    return m;
  };
  const ell = (parent, mat, r, pos) => add(parent, sphereGeo, mat, pos, r);
  const tube = (parent, pts, r, mat, seg = 64, radial = 8) => {
    const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
    return add(parent, new THREE.TubeGeometry(curve, seg, r, radial, false), mat);
  };
  const limb = (parent, mat, a, b, r1, r2, caps = true) => {
    const p1 = new THREE.Vector3(...a);
    const p2 = new THREE.Vector3(...b);
    const dir = p2.clone().sub(p1);
    const len = dir.length();
    const geo = new THREE.CylinderGeometry(r2, r1, len, 28, 1, true);
    const m = new THREE.Mesh(track(geo), mat);
    m.position.copy(p1.clone().add(p2).multiplyScalar(0.5));
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    parent.add(m);
    if (caps) {
      ell(parent, mat, [r1, r1, r1], a);
      ell(parent, mat, [r2, r2, r2], b);
    }
    return m;
  };

  // ---- Groups ----
  const body = new THREE.Group();
  root.add(body);
  const head = new THREE.Group();
  head.position.set(0, 3.02, 0);
  body.add(head);
  const lungs = new THREE.Group();
  lungs.position.set(0, 2.4, -0.01);
  body.add(lungs);
  const heart = new THREE.Group();
  heart.position.set(0.045, 2.28, 0.05);
  body.add(heart);

  // ================= SHELL (skin) =================
  const profile = new THREE.CatmullRomCurve3(
    [
      [0.001, 1.27], [0.15, 1.28], [0.26, 1.35], [0.305, 1.5], [0.29, 1.68], [0.25, 1.9],
      [0.24, 2.03], [0.27, 2.2], [0.3, 2.4], [0.315, 2.57], [0.27, 2.7], [0.15, 2.79], [0.001, 2.83]
    ].map(([r, y]) => new THREE.Vector3(r, y, 0))
  ).getPoints(90).map((p) => new THREE.Vector2(Math.max(p.x, 0.0005), p.y));
  const torso = add(body, new THREE.LatheGeometry(profile, 56), shellMat, [0, 0, 0], [1, 1, 0.6]);
  torso.renderOrder = 2;

  const shellPart = (m) => { m.renderOrder = 2; return m; };
  // neck
  shellPart(add(body, new THREE.CylinderGeometry(0.085, 0.095, 0.34, 28, 1, true), shellMat, [0, 2.95, 0]));
  // shoulders (deltoid caps)
  [-1, 1].forEach((s) => shellPart(ell(body, shellMat, [0.1, 0.11, 0.095], [s * 0.4, 2.6, 0])));
  // arms
  const armPts = { S: [0.4, 2.6, 0], E: [0.5, 1.98, 0.01], W: [0.56, 1.42, 0.07] };
  [-1, 1].forEach((s) => {
    const P = (a) => [a[0] * s, a[1], a[2]];
    shellPart(limb(body, shellMat, P(armPts.S), P(armPts.E), 0.09, 0.07));
    shellPart(limb(body, shellMat, P(armPts.E), P(armPts.W), 0.07, 0.048));
  });
  // legs
  const legPts = { H: [0.15, 1.38, 0], K: [0.16, 0.77, 0.02], A: [0.16, 0.15, 0] };
  [-1, 1].forEach((s) => {
    const P = (a) => [a[0] * s, a[1], a[2]];
    shellPart(limb(body, shellMat, P(legPts.H), P(legPts.K), 0.16, 0.1));
    shellPart(limb(body, shellMat, P(legPts.K), P(legPts.A), 0.1, 0.06));
    shellPart(ell(body, shellMat, [0.062, 0.05, 0.16], [s * 0.16, 0.06, 0.09]));
  });

  // head shell + facial features (mannequin face: soft, unpainted)
  shellPart(ell(head, shellMat, [0.19, 0.25, 0.225], [0, 0.28, 0]));
  shellPart(ell(head, shellMat, [0.028, 0.05, 0.042], [0, 0.23, 0.215])); // nose
  shellPart(ell(head, shellMat, [0.075, 0.05, 0.07], [0, 0.07, 0.13])); // chin
  shellPart(ell(head, shellMat, [0.155, 0.022, 0.06], [0, 0.35, 0.185])); // brow ridge
  shellPart(ell(head, shellMat, [0.05, 0.02, 0.03], [0, 0.15, 0.2])); // lips
  [-1, 1].forEach((s) => shellPart(ell(head, shellMat, [0.02, 0.05, 0.035], [s * 0.19, 0.27, -0.01]))); // ears

  // eyes — small, matte, track the cursor
  const eyes = new THREE.Group();
  head.add(eyes);
  const eyeWhite = track(organMaterial(0xf6f2ea, { roughness: 0.25, clearcoat: 1 }));
  const iris = track(organMaterial(0x2f5d62, { roughness: 0.2 }));
  const pupil = track(organMaterial(0x0b1416, { roughness: 0.15 }));
  const eyeBalls = [-1, 1].map((s) => {
    const g = new THREE.Group();
    g.position.set(s * 0.07, 0.3, 0.165);
    ell(g, eyeWhite, [0.032, 0.032, 0.032], [0, 0, 0]);
    ell(g, iris, [0.017, 0.017, 0.008], [0, 0, 0.028]);
    ell(g, pupil, [0.008, 0.008, 0.006], [0, 0, 0.034]);
    eyes.add(g);
    return g;
  });

  // ================= SKELETON =================
  // spine
  for (let i = 0; i < 15; i++) {
    const y = 1.44 + i * 0.092;
    const z = -0.115 - 0.02 * Math.sin((y - 1.4) * 2.2);
    const w = 0.03 + 0.008 * (1 - i / 15);
    add(body, new THREE.CylinderGeometry(w, w * 1.05, 0.06, 14), boneMat, [0, y, z]);
  }
  // ribs
  for (let i = 0; i < 8; i++) {
    const y0 = 2.62 - i * 0.078;
    const rx = 0.16 + 0.1 * Math.sin((Math.PI * (i + 1.4)) / 9.6);
    const rz = rx * 0.5;
    const A = Math.PI - 0.22;
    const pts = [];
    for (let k = 0; k <= 22; k++) {
      const a = -A + (2 * A * k) / 22;
      pts.push([rx * Math.sin(a), y0 - 0.075 * (Math.abs(a) / Math.PI), -rz * Math.cos(a) * 1.0 + 0.0]);
    }
    tube(body, pts, 0.0105, boneMat, 60, 6);
  }
  // sternum + clavicles
  add(body, new THREE.BoxGeometry(0.06, 0.3, 0.014), boneMat, [0, 2.45, 0.135]);
  [-1, 1].forEach((s) => {
    tube(body, [[0.02 * s, 2.7, 0.1], [0.14 * s, 2.72, 0.06], [0.28 * s, 2.7, 0.0], [0.38 * s, 2.66, -0.03]], 0.012, boneMat, 20, 6);
  });
  // pelvis wings
  [-1, 1].forEach((s) => {
    const w = ell(body, boneMat, [0.13, 0.1, 0.055], [s * 0.16, 1.52, -0.03]);
    w.rotation.z = s * 0.35;
  });
  // long bones
  const shaft = (a, b, r) => limb(body, boneMat, a, b, r, r * 0.85, false);
  [-1, 1].forEach((s) => {
    const P = (a) => [a[0] * s, a[1], a[2]];
    shaft(P(armPts.S), P(armPts.E), 0.02);
    shaft(P(armPts.E), P(armPts.W), 0.016);
    shaft(P(legPts.H), P(legPts.K), 0.032);
    shaft(P(legPts.K), P(legPts.A), 0.025);
  });
  // skull base + cervical vertebrae
  add(body, new THREE.CylinderGeometry(0.03, 0.033, 0.3, 12), boneMat, [0, 2.93, -0.07]);

  // ================= BALL JOINTS (joints_muscles) =================
  const jointMat = track(organMaterial(0xe9edf5, { roughness: 0.3, clearcoat: 0.6 }));
  const jointSpots = [
    ...[-1, 1].map((s) => [[0.4 * s, 2.6, 0], 0.062]), // shoulders
    ...[-1, 1].map((s) => [[0.5 * s, 1.98, 0.01], 0.046]), // elbows
    ...[-1, 1].map((s) => [[0.15 * s, 1.38, 0], 0.07]), // hips
    ...[-1, 1].map((s) => [[0.16 * s, 0.77, 0.02], 0.066]), // knees
    ...[-1, 1].map((s) => [[0.16 * s, 0.15, 0], 0.04]) // ankles
  ];
  jointSpots.forEach(([p, r]) => register('joints_muscles', ell(body, jointMat, [r, r, r], p)));
  reg.joints_muscles.anchor.position.set(0.16, 0.77, 0.06);
  body.add(reg.joints_muscles.anchor);

  // ================= BRAIN (sleep_stress) =================
  const brainMat = track(organMaterial(0xe7a1a7, { roughness: 0.5, clearcoat: 0.9 }));
  const cerebMat = track(organMaterial(0xd88790, { roughness: 0.55 }));
  [-1, 1].forEach((s) => {
    const g = blobGeometry({ rx: 0.088, ry: 0.105, rz: 0.14, detail: 24, amp: 0.085, freq: 7.5, seed: s * 3.7 });
    register('sleep_stress', add(head, g, brainMat, [s * 0.052, 0.33, 0.005]));
  });
  register('sleep_stress', add(head, blobGeometry({ rx: 0.075, ry: 0.05, rz: 0.06, detail: 16, amp: 0.1, freq: 14 }), cerebMat, [0, 0.22, -0.11]));
  register('sleep_stress', add(head, new THREE.CylinderGeometry(0.02, 0.016, 0.1, 12), cerebMat, [0, 0.16, -0.05]));
  reg.sleep_stress.anchor.position.set(0.05, 0.36, 0.1);
  head.add(reg.sleep_stress.anchor);

  // ================= LUNGS + THROAT (immunity_energy) =================
  const lungMat = track(organMaterial(0xd9909a, { roughness: 0.55 }));
  [-1, 1].forEach((s) => {
    const g = blobGeometry({ rx: 0.088, ry: 0.2, rz: 0.088, detail: 16, amp: 0.05, freq: 3.5, seed: s });
    const m = register('immunity_energy', add(lungs, g, lungMat, [s * 0.118, 0, 0]));
    m.rotation.z = -s * 0.08;
  });
  const airMat = track(organMaterial(0xe3d3c8, { roughness: 0.4 }));
  register('immunity_energy', add(body, new THREE.CylinderGeometry(0.021, 0.021, 0.3, 14), airMat, [0, 2.7, 0.035]));
  [-1, 1].forEach((s) => {
    const m = register('immunity_energy', add(body, new THREE.CylinderGeometry(0.012, 0.012, 0.16, 10), airMat, [s * 0.05, 2.5, 0.025]));
    m.rotation.z = s * 0.55;
  });
  // thyroid
  const thyMat = track(organMaterial(0xc9865a));
  [-1, 1].forEach((s) => register('immunity_energy', add(body, blobGeometry({ rx: 0.022, ry: 0.035, rz: 0.018, detail: 8 }), thyMat, [s * 0.03, 2.88, 0.055])));
  reg.immunity_energy.anchor.position.set(-0.11, 2.5, 0.09);
  body.add(reg.immunity_energy.anchor);

  // ================= HEART + VESSELS (veins_vessels) =================
  const heartMat = track(organMaterial(0xb3202c, { roughness: 0.4, clearcoat: 0.95 }));
  const heartMesh = register('veins_vessels', add(heart, blobGeometry({ rx: 0.07, ry: 0.088, rz: 0.066, detail: 16, amp: 0.03, freq: 5 }), heartMat));
  heartMesh.rotation.z = 0.5;
  const arteryMat = track(organMaterial(0xc4232d, { roughness: 0.4 }));
  const veinMat = track(organMaterial(0x3d63c9, { roughness: 0.4 }));
  register('veins_vessels', tube(body, [[0.035, 2.34, 0.05], [0.03, 2.5, 0.03], [-0.02, 2.56, -0.02], [-0.05, 2.46, -0.07], [-0.05, 2.2, -0.085], [-0.04, 1.9, -0.09], [-0.02, 1.6, -0.08]], 0.018, arteryMat, 60, 10));
  register('veins_vessels', tube(body, [[0.06, 2.35, 0.04], [0.07, 2.55, 0.0], [0.06, 2.75, -0.02]], 0.013, veinMat, 20, 8));
  [-1, 1].forEach((s) => {
    const wob = (i) => 0.006 * Math.sin(i * 1.7);
    register('veins_vessels', tube(body, [[-0.02, 1.6, -0.08], [0.09 * s, 1.44, -0.03], [0.14 * s, 1.3, 0.03], [(0.15 + wob(1)) * s, 1.05, 0.06], [(0.16 + wob(2)) * s, 0.78, 0.075], [(0.165 + wob(3)) * s, 0.5, 0.05], [0.16 * s, 0.16, 0.035]], 0.012, arteryMat, 60, 8));
    register('veins_vessels', tube(body, [[0.0, 1.62, -0.06], [0.12 * s, 1.44, -0.0], [0.18 * s, 1.28, 0.045], [(0.17 + wob(4)) * s, 1.02, 0.085], [(0.185 + wob(5)) * s, 0.78, 0.09], [(0.19 + wob(6)) * s, 0.5, 0.06], [0.175 * s, 0.17, 0.045]], 0.011, veinMat, 60, 8));
  });
  reg.veins_vessels.anchor.position.set(0.16, 1.0, 0.11);
  body.add(reg.veins_vessels.anchor);

  // ================= THYMUS (kids_health) =================
  const thymusMat = track(organMaterial(0xf1d089, { roughness: 0.5 }));
  [-1, 1].forEach((s) => {
    const m = register('kids_health', add(body, blobGeometry({ rx: 0.032, ry: 0.052, rz: 0.022, detail: 10, amp: 0.05, freq: 8 }), thymusMat, [s * 0.03, 2.55, 0.1]));
    m.rotation.z = s * 0.3;
  });
  reg.kids_health.anchor.position.set(0.02, 2.55, 0.12);
  body.add(reg.kids_health.anchor);

  // ================= DIGESTIVE (gastro_digestion) =================
  const liverMat = track(organMaterial(0x8e3a33, { roughness: 0.45 }));
  const stomachMat = track(organMaterial(0xd97b7d, { roughness: 0.42 }));
  const gutMat = track(organMaterial(0xe6a58d, { roughness: 0.4 }));
  const colonMat = track(organMaterial(0xcf7f69, { roughness: 0.45 }));
  const liver = register('gastro_digestion', add(body, blobGeometry({ rx: 0.145, ry: 0.07, rz: 0.085, detail: 14, amp: 0.03, freq: 3 }), liverMat, [-0.085, 2.08, 0.035]));
  liver.rotation.z = 0.18;
  const stomach = register('gastro_digestion', add(body, blobGeometry({ rx: 0.068, ry: 0.105, rz: 0.06, detail: 14, amp: 0.03, freq: 4 }), stomachMat, [0.105, 2.03, 0.06]));
  stomach.rotation.z = -0.85;
  // small intestine — serpentine loops
  const coil = [];
  for (let r = 0; r < 6; r++) {
    const y = 1.86 - r * 0.056;
    const dirx = r % 2 === 0 ? 1 : -1;
    for (let k = 0; k <= 6; k++) {
      const x = dirx * (-0.13 + (0.26 * k) / 6);
      coil.push([x, y + 0.012 * Math.sin(k * 2.1), 0.045 + 0.03 * Math.sin(k * 1.3 + r)]);
    }
  }
  register('gastro_digestion', tube(body, coil, 0.026, gutMat, 260, 8));
  // large intestine frame
  register('gastro_digestion', tube(body, [[0.17, 1.5, 0.03], [0.185, 1.7, 0.04], [0.175, 1.93, 0.045], [0.08, 1.985, 0.05], [-0.08, 1.985, 0.05], [-0.175, 1.93, 0.045], [-0.185, 1.7, 0.04], [-0.17, 1.52, 0.03]], 0.03, colonMat, 100, 8));
  reg.gastro_digestion.anchor.position.set(0.12, 1.95, 0.12);
  body.add(reg.gastro_digestion.anchor);

  // ================= UTERUS (women_health) =================
  const uterusMat = track(organMaterial(0xd9668a, { roughness: 0.5 }));
  const ovaryMat = track(organMaterial(0xf08fa8, { roughness: 0.5 }));
  register('women_health', add(body, blobGeometry({ rx: 0.052, ry: 0.07, rz: 0.042, detail: 12, amp: 0.02, freq: 4 }), uterusMat, [0, 1.47, 0.055]));
  [-1, 1].forEach((s) => {
    register('women_health', tube(body, [[0.03 * s, 1.5, 0.055], [0.08 * s, 1.56, 0.06], [0.12 * s, 1.53, 0.055]], 0.007, ovaryMat, 20, 6));
    register('women_health', ell(body, ovaryMat, [0.022, 0.026, 0.02], [0.13 * s, 1.51, 0.055]));
  });
  reg.women_health.anchor.position.set(-0.1, 1.47, 0.1);
  body.add(reg.women_health.anchor);

  // ================= SKIN / HANDS (vitamins_minerals) =================
  const skinMat = track(organMaterial(0xf0c3a1, { roughness: 0.5, clearcoat: 0.25 }));
  [-1, 1].forEach((s) => {
    const h = register('vitamins_minerals', ell(body, skinMat, [0.046, 0.105, 0.028], [0.575 * s, 1.31, 0.075]));
    h.rotation.z = s * 0.1;
    const th = register('vitamins_minerals', ell(body, skinMat, [0.018, 0.05, 0.02], [0.6 * s, 1.36, 0.1]));
    th.rotation.z = s * 0.5;
  });
  reg.vitamins_minerals.anchor.position.set(0.64, 1.25, 0.1);
  body.add(reg.vitamins_minerals.anchor);
  reg.vitamins_minerals.mats.add(shellMat); // the whole body glows amber for this need

  // ================= STAND + shadow =================
  const pedMat = track(new THREE.MeshPhysicalMaterial({ color: 0x0b7a5c, roughness: 0.25, metalness: 0.35, clearcoat: 1, envMapIntensity: 1.1 }));
  add(root, new THREE.CylinderGeometry(0.62, 0.68, 0.05, 64), pedMat, [0, -0.03, 0]);
  const ringMat = track(new THREE.MeshBasicMaterial({ color: 0x6ee7b7, transparent: true, opacity: 0.85 }));
  const ring = add(root, new THREE.TorusGeometry(0.66, 0.008, 8, 96), ringMat, [0, 0.0, 0]);
  ring.rotation.x = Math.PI / 2;
  const shTex = track(shadowTexture());
  const shadow = new THREE.Mesh(track(new THREE.PlaneGeometry(1.9, 1.9)), track(new THREE.MeshBasicMaterial({ map: shTex, transparent: true, depthWrite: false })));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.002;
  root.add(shadow);

  // ---- glow sprites at each organ anchor ----
  const gTex = track(glowTexture());
  HEALTH_NEEDS.forEach((n) => {
    const mat = track(new THREE.SpriteMaterial({ map: gTex, color: GLOW[n.id], transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    const sp = new THREE.Sprite(mat);
    sp.scale.setScalar(0.55);
    reg[n.id].anchor.add(sp);
    reg[n.id].sprite = sp;
  });

  // sparkles orbiting the body for vitamins_minerals
  const N = 60;
  const sparkGeo = track(new THREE.BufferGeometry());
  const sparkPos = new Float32Array(N * 3);
  const sparkSeed = Array.from({ length: N }, () => ({ a: Math.random() * Math.PI * 2, y: Math.random() * 3.4, r: 0.55 + Math.random() * 0.35, s: 0.3 + Math.random() * 0.6 }));
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
  const sparkMat = track(new THREE.PointsMaterial({ map: gTex, color: 0xfde68a, size: 0.09, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  const sparkles = new THREE.Points(sparkGeo, sparkMat);
  root.add(sparkles);

  return { root, body, head, eyes, eyeBalls, lungs, heart, reg, pickables, ring, sparkles, sparkSeed, sparkPos, sparkMat, shellMat, disposables };
}

// =====================================================================
export default function Mannequin3D({ className = '', activeNeed = null, lang = 'ru', onPick, onHover, onUnsupported }) {
  const wrapRef = useRef(null);
  const labelRef = useRef(null);
  const labelTextRef = useRef(null);
  const labelDotRef = useRef(null);
  const activeRef = useRef(activeNeed);
  const langRef = useRef(lang);
  const cbRef = useRef({ onPick, onHover });

  useEffect(() => { activeRef.current = activeNeed; }, [activeNeed]);
  useEffect(() => { langRef.current = lang; }, [lang]);
  useEffect(() => { cbRef.current = { onPick, onHover }; }, [onPick, onHover]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) {
      onUnsupported && onUnsupported();
      return undefined;
    }
    renderer.setClearAlpha(0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    const canvas = renderer.domElement;
    canvas.style.cssText = 'width:100%;height:100%;display:block;touch-action:pan-y;cursor:grab;';
    wrap.appendChild(canvas);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.85;

    const camera = new THREE.PerspectiveCamera(30, 2 / 3, 0.1, 50);
    camera.position.set(0, 1.92, 7.5);
    camera.lookAt(0, 1.72, 0);

    const key = new THREE.DirectionalLight(0xfff3e6, 2.3);
    key.position.set(3, 5, 6);
    const rim = new THREE.DirectionalLight(0x5eead4, 2.0);
    rim.position.set(-4, 3, -4);
    scene.add(key, rim, new THREE.HemisphereLight(0xeafff5, 0x0b3b2e, 0.55));

    const S = buildScene(scene, langRef.current);
    const { root, body, head, eyeBalls, lungs, heart, reg, pickables, ring, sparkles, sparkSeed, sparkPos, sparkMat, shellMat } = S;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---- sizing ----
    const resize = () => {
      const w = wrap.clientWidth || 300;
      const h = wrap.clientHeight || 450;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // ---- pointer: gaze (global) + hover/click/drag (canvas) ----
    const gaze = { x: 0, y: 0, has: false };
    const cur = { headYaw: 0, headPitch: 0, bodyYaw: 0, eyeX: 0, eyeY: 0, drag: 0 };
    const drag = { on: false, x0: 0, y0: 0, base: 0, moved: 0, target: 0 };
    const ndc = new THREE.Vector2();
    const ray = new THREE.Raycaster();
    let internalHover = null;

    const onWindowMove = (e) => {
      const r = wrap.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.2; // head level
      gaze.x = Math.max(-1, Math.min(1, (e.clientX - cx) / 640));
      gaze.y = Math.max(-1, Math.min(1, (e.clientY - cy) / 520));
      gaze.has = true;
    };
    const onWindowLeave = () => { gaze.has = false; };
    window.addEventListener('pointermove', onWindowMove);
    window.addEventListener('blur', onWindowLeave);
    document.addEventListener('pointerleave', onWindowLeave);

    const pick = (e) => {
      const r = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(pickables, false)[0];
      return hit ? hit.object.userData.needId : null;
    };

    const onCanvasMove = (e) => {
      if (drag.on) {
        const dx = e.clientX - drag.x0;
        drag.moved = Math.max(drag.moved, Math.abs(dx) + Math.abs(e.clientY - drag.y0));
        drag.target = drag.base + dx * 0.012;
        return;
      }
      const id = pick(e);
      if (id !== internalHover) {
        internalHover = id;
        canvas.style.cursor = id ? 'pointer' : 'grab';
        cbRef.current.onHover && cbRef.current.onHover(id);
      }
    };
    const onCanvasDown = (e) => {
      drag.on = true;
      drag.x0 = e.clientX;
      drag.y0 = e.clientY;
      drag.base = drag.target;
      drag.moved = 0;
      canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = 'grabbing';
    };
    const onCanvasUp = (e) => {
      const wasClick = drag.on && drag.moved < 6;
      drag.on = false;
      drag.target = 0; // spring back to facing the viewer
      canvas.style.cursor = internalHover ? 'pointer' : 'grab';
      if (wasClick) {
        const id = pick(e);
        if (id) cbRef.current.onPick && cbRef.current.onPick(id);
      }
    };
    const onCanvasLeave = () => {
      if (internalHover) {
        internalHover = null;
        cbRef.current.onHover && cbRef.current.onHover(null);
      }
    };
    canvas.addEventListener('pointermove', onCanvasMove);
    canvas.addEventListener('pointerdown', onCanvasDown);
    canvas.addEventListener('pointerup', onCanvasUp);
    canvas.addEventListener('pointercancel', onCanvasUp);
    canvas.addEventListener('pointerleave', onCanvasLeave);

    // ---- visibility gating ----
    let visible = true;
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0.01 });
    io.observe(wrap);

    // ---- label overlay ----
    const tmp = new THREE.Vector3();
    let shownLabel = null;
    const updateLabel = (id, k) => {
      const el = labelRef.current;
      if (!el) return;
      if (!id || k < 0.05) { el.style.opacity = '0'; return; }
      if (shownLabel !== id + langRef.current) {
        shownLabel = id + langRef.current;
        const need = HEALTH_NEEDS.find((n) => n.id === id);
        if (labelTextRef.current) labelTextRef.current.textContent = langRef.current === 'uz' ? need.organ_uz : need.organ_ru;
        if (labelDotRef.current) labelDotRef.current.style.background = GLOW[id];
      }
      reg[id].anchor.getWorldPosition(tmp);
      tmp.project(camera);
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const x = (tmp.x * 0.5 + 0.5) * w;
      const y = (-tmp.y * 0.5 + 0.5) * h;
      const right = x < w * 0.55;
      el.style.transform = `translate(${x}px, ${y}px)`;
      el.style.flexDirection = right ? 'row' : 'row-reverse';
      el.style.opacity = String(Math.min(1, k * 1.4));
    };

    // ---- loop ----
    let raf = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      // gaze targets
      const gx = reduced ? 0 : gaze.has ? gaze.x : Math.sin(t * 0.6) * 0.25;
      const gy = reduced ? 0 : gaze.has ? gaze.y : 0;
      const e = 1 - Math.pow(0.001, dt); // frame-rate independent ease
      cur.headYaw += (gx * 0.75 - cur.headYaw) * e * 0.9;
      cur.headPitch += (gy * 0.32 - cur.headPitch) * e * 0.9;
      cur.bodyYaw += (gx * 0.16 - cur.bodyYaw) * e * 0.6;
      cur.eyeX += (gx * 0.5 - cur.eyeX) * e * 1.4;
      cur.eyeY += (gy * 0.3 - cur.eyeY) * e * 1.4;
      cur.drag += (drag.target - cur.drag) * e * (drag.on ? 1.6 : 0.7);

      root.rotation.y = cur.drag + cur.bodyYaw * 0.4;
      body.rotation.y = cur.bodyYaw;
      head.rotation.y = cur.headYaw - cur.bodyYaw * 0.4;
      head.rotation.x = cur.headPitch;
      head.rotation.z = -cur.headYaw * 0.06;
      eyeBalls.forEach((b) => { b.rotation.y = cur.eyeX - cur.headYaw * 0.6; b.rotation.x = cur.eyeY * 0.6; });

      // life: breathing + heartbeat
      if (!reduced) {
        lungs.scale.set(1 + Math.sin(t * 1.5) * 0.02, 1 + Math.sin(t * 1.5) * 0.028, 1 + Math.sin(t * 1.5) * 0.02);
        const beat = Math.pow(Math.max(0, Math.sin(t * 5.2)), 10);
        heart.scale.setScalar(1 + beat * 0.09);
        body.position.y = Math.sin(t * 1.5) * 0.008;
        ring.rotation.z = t * 0.3;
      }

      // highlights
      const active = internalHover || activeRef.current;
      let labelK = 0;
      HEALTH_NEEDS.forEach((n) => {
        const r = reg[n.id];
        const target = n.id === active ? 1 : 0;
        r.k += (target - r.k) * (1 - Math.pow(0.0005, dt));
        const pulse = 0.65 + 0.35 * Math.sin(t * 4.2);
        const isShell = n.id === 'vitamins_minerals';
        r.mats.forEach((m) => {
          if (m === shellMat) {
            m.emissive.copy(r.color);
            m.emissiveIntensity = r.k * (0.22 + 0.08 * pulse);
          } else {
            m.emissive.copy(r.color);
            m.emissiveIntensity = r.k * (0.55 + 0.4 * pulse);
          }
        });
        r.sprite.material.opacity = r.k * (0.55 + 0.3 * pulse);
        r.sprite.scale.setScalar(0.4 + 0.25 * pulse * r.k + (isShell ? 0.1 : 0));
        if (n.id === active) labelK = r.k;
      });
      // sparkles for the skin/vitamin need
      const vk = reg.vitamins_minerals.k;
      sparkMat.opacity = vk * 0.9;
      if (vk > 0.02) {
        for (let i = 0; i < sparkSeed.length; i++) {
          const s = sparkSeed[i];
          const a = s.a + t * s.s;
          const y = (s.y + t * 0.18 * s.s) % 3.5;
          sparkPos[i * 3] = Math.cos(a) * s.r;
          sparkPos[i * 3 + 1] = y;
          sparkPos[i * 3 + 2] = Math.sin(a) * s.r * 0.6;
        }
        sparkles.geometry.attributes.position.needsUpdate = true;
      }
      updateLabel(active, labelK);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onWindowMove);
      window.removeEventListener('blur', onWindowLeave);
      document.removeEventListener('pointerleave', onWindowLeave);
      canvas.removeEventListener('pointermove', onCanvasMove);
      canvas.removeEventListener('pointerdown', onCanvasDown);
      canvas.removeEventListener('pointerup', onCanvasUp);
      canvas.removeEventListener('pointercancel', onCanvasUp);
      canvas.removeEventListener('pointerleave', onCanvasLeave);
      S.disposables.forEach((d) => d.dispose && d.dispose());
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (canvas.parentNode === wrap) wrap.removeChild(canvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={wrapRef} className={`relative select-none ${className}`} role="img" aria-label={lang === 'uz' ? "Interaktiv anatomik maneken" : 'Интерактивный анатомический манекен'}>
      {/* Organ label — moved every frame by the render loop */}
      <div
        ref={labelRef}
        className="absolute left-0 top-0 z-10 flex items-center gap-1.5 pointer-events-none transition-opacity duration-200"
        style={{ opacity: 0 }}
      >
        <span ref={labelDotRef} className="w-2.5 h-2.5 -mx-1 rounded-full ring-4 ring-white/70 shadow-md shrink-0" />
        <span ref={labelTextRef} className="px-2.5 py-1 rounded-full bg-slate-900/85 text-white text-[11px] font-bold backdrop-blur-sm shadow-lg whitespace-nowrap" />
      </div>
    </div>
  );
}
