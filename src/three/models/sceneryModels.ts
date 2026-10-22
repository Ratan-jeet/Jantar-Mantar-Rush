import * as THREE from 'three';
import {
  createSandstoneTexture,
  createBannerTexture,
} from '../proceduralTextures';
import { TrackTheme } from '../../types/game';

let sandstoneTex: THREE.CanvasTexture | null = null;
function getSandstoneTex() {
  if (!sandstoneTex) sandstoneTex = createSandstoneTexture();
  return sandstoneTex;
}

/**
 * Procedural Samrat Yantra (The iconic monumental sundial gnomon of Jantar Mantar)
 */
export function createSamratYantra(): THREE.Group {
  const group = new THREE.Group();

  const stoneMat = new THREE.MeshStandardMaterial({
    map: getSandstoneTex(),
    roughness: 0.85,
    metalness: 0.05,
  });

  // Massive triangular ramp gnomon
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(16, 0);
  shape.lineTo(0, 14);
  shape.closePath();

  const extrudeSettings = {
    steps: 1,
    depth: 4.5,
    bevelEnabled: true,
    bevelThickness: 0.2,
    bevelSize: 0.2,
    bevelSegments: 2,
  };

  const gnomonGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const gnomonMesh = new THREE.Mesh(gnomonGeo, stoneMat);
  gnomonMesh.position.set(0, 0, -2.25);
  gnomonMesh.castShadow = true;
  group.add(gnomonMesh);

  // Quadrant curved arc wings (the measuring scales)
  const arcGeo = new THREE.TorusGeometry(8, 1.2, 8, 24, Math.PI / 2);
  arcGeo.rotateY(Math.PI / 2);
  const leftArc = new THREE.Mesh(arcGeo, stoneMat);
  leftArc.position.set(4, 0, 4);
  leftArc.castShadow = true;
  group.add(leftArc);

  const rightArc = new THREE.Mesh(arcGeo, stoneMat);
  rightArc.position.set(4, 0, -4);
  rightArc.castShadow = true;
  group.add(rightArc);

  // Decorative staircase steps along the gnomon slope
  const stepMat = new THREE.MeshStandardMaterial({ color: '#7c2d12', roughness: 0.9 });
  for (let i = 0; i < 7; i++) {
    const stepGeo = new THREE.BoxGeometry(1.4, 0.4, 4.8);
    const step = new THREE.Mesh(stepGeo, stepMat);
    step.position.set(i * 2.1, (7 - i) * 1.8, 0);
    group.add(step);
  }

  return group;
}

/**
 * Protest Encampment Tent at Jantar Mantar (Dharna sthal)
 */
export function createProtestTent(sloganText: string, subtext: string = ''): THREE.Group {
  const group = new THREE.Group();

  const canvasMat = new THREE.MeshStandardMaterial({
    color: '#0284c7', // Sky blue protest tent tarpaulin
    roughness: 0.9,
  });

  const poleMat = new THREE.MeshStandardMaterial({
    color: '#94a3b8',
    metalness: 0.7,
    roughness: 0.3,
  });

  // Pitched canopy roof
  const roofGeo = new THREE.ConeGeometry(3.2, 2.0, 4);
  roofGeo.rotateY(Math.PI / 4);
  const roof = new THREE.Mesh(roofGeo, canvasMat);
  roof.position.y = 2.4;
  roof.castShadow = true;
  group.add(roof);

  // 4 Corner bamboo/metal poles
  const poleGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.4, 8);
  const offsets = [
    [-1.8, 1.2, -1.8],
    [1.8, 1.2, -1.8],
    [-1.8, 1.2, 1.8],
    [1.8, 1.2, 1.8],
  ];

  offsets.forEach(([x, y, z]) => {
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(x, y, z);
    group.add(pole);
  });

  // Hanging Banner with Slogan
  const bannerTex = createBannerTexture(sloganText, subtext);
  const bannerGeo = new THREE.PlaneGeometry(3.6, 0.9);
  const bannerMat = new THREE.MeshStandardMaterial({
    map: bannerTex,
    roughness: 0.5,
    side: THREE.DoubleSide,
  });
  const banner = new THREE.Mesh(bannerGeo, bannerMat);
  banner.position.set(0, 1.7, 1.85);
  group.add(banner);

  return group;
}

/**
 * Connaught Place Georgian White Colonnade (Inner Circle arches and pillars)
 */
export function createCPColonnade(): THREE.Group {
  const group = new THREE.Group();

  const whiteMat = new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    roughness: 0.5,
    metalness: 0.1,
  });

  const corniceMat = new THREE.MeshStandardMaterial({
    color: '#e2e8f0',
    roughness: 0.4,
  });

  // Base platform
  const baseGeo = new THREE.BoxGeometry(4.0, 0.4, 12.0);
  const base = new THREE.Mesh(baseGeo, whiteMat);
  base.position.y = 0.2;
  group.add(base);

  // Classical Corinthian/Georgian pillars
  const pillarGeo = new THREE.CylinderGeometry(0.35, 0.4, 4.8, 16);
  for (let z = -4.5; z <= 4.5; z += 3.0) {
    const pillar = new THREE.Mesh(pillarGeo, whiteMat);
    pillar.position.set(1.2, 2.8, z);
    pillar.castShadow = true;
    group.add(pillar);

    // Capital & Base rings
    const ringGeo = new THREE.TorusGeometry(0.44, 0.08, 8, 16);
    ringGeo.rotateX(Math.PI / 2);
    const capital = new THREE.Mesh(ringGeo, corniceMat);
    capital.position.set(1.2, 5.1, z);
    group.add(capital);
  }

  // Grand Entablature & Cornice roof
  const roofGeo = new THREE.BoxGeometry(4.2, 1.2, 12.2);
  const roof = new THREE.Mesh(roofGeo, corniceMat);
  roof.position.set(0, 5.8, 0);
  roof.castShadow = true;
  group.add(roof);

  return group;
}

/**
 * Roadside Delhi Neem / Banyan Tree
 */
export function createDelhiTree(): THREE.Group {
  const group = new THREE.Group();

  const trunkMat = new THREE.MeshStandardMaterial({
    color: '#451a03',
    roughness: 0.9,
  });

  const foliageMat = new THREE.MeshStandardMaterial({
    color: '#15803d',
    roughness: 0.7,
  });

  // Trunk
  const trunkGeo = new THREE.CylinderGeometry(0.25, 0.4, 3.2, 8);
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 1.6;
  trunk.castShadow = true;
  group.add(trunk);

  // Clustered canopy
  const foliageGeo1 = new THREE.SphereGeometry(1.6, 8, 8);
  const f1 = new THREE.Mesh(foliageGeo1, foliageMat);
  f1.position.set(0, 3.8, 0);
  f1.castShadow = true;
  group.add(f1);

  const foliageGeo2 = new THREE.SphereGeometry(1.2, 8, 8);
  const f2 = new THREE.Mesh(foliageGeo2, foliageMat);
  f2.position.set(0.8, 4.4, 0.5);
  group.add(f2);

  const f3 = new THREE.Mesh(foliageGeo2, foliageMat);
  f3.position.set(-0.7, 4.2, -0.6);
  group.add(f3);

  return group;
}

/**
 * Streetlight Pole (Delhi Sansad Marg vintage lamp post)
 */
export function createStreetLamp(): THREE.Group {
  const group = new THREE.Group();

  const poleMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    metalness: 0.8,
    roughness: 0.3,
  });

  const lightMat = new THREE.MeshStandardMaterial({
    color: '#fef08a',
    emissive: '#fef08a',
    emissiveIntensity: 0.8,
  });

  const poleGeo = new THREE.CylinderGeometry(0.08, 0.1, 4.5, 8);
  const pole = new THREE.Mesh(poleGeo, poleMat);
  pole.position.y = 2.25;
  group.add(pole);

  // Curved arm
  const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.4, 8);
  armGeo.rotateZ(Math.PI / 4);
  const arm = new THREE.Mesh(armGeo, poleMat);
  arm.position.set(-0.45, 4.2, 0);
  group.add(arm);

  // Lantern bulb
  const bulbGeo = new THREE.SphereGeometry(0.25, 8, 8);
  const bulb = new THREE.Mesh(bulbGeo, lightMat);
  bulb.position.set(-0.9, 4.3, 0);
  group.add(bulb);

  return group;
}
