import * as THREE from 'three';
import {
  createPoliceBarricadeTexture,
  createSection144Texture,
} from '../proceduralTextures';

export type ObstacleType =
  | 'police_barricade_low' // Jump or switch
  | 'section144_high'      // Slide or switch
  | 'police_van'           // Dodge only
  | 'rpf_checkpoint'       // Jump or switch
  | 'bsf_heavy_cordon';    // Dodge only

export interface ObstacleInstance {
  group: THREE.Group;
  type: ObstacleType;
  lane: number;
  z: number;
  box: THREE.Box3;
  dodgeType: 'jump' | 'slide' | 'dodge_only';
  update?: (delta: number, time: number) => void;
}

// Reusable shared materials and textures
let policeBarricadeTex: THREE.CanvasTexture | null = null;
let section144Tex: THREE.CanvasTexture | null = null;

function getPoliceTex(): THREE.CanvasTexture {
  if (!policeBarricadeTex) policeBarricadeTex = createPoliceBarricadeTexture();
  return policeBarricadeTex;
}

function getSectionTex(): THREE.CanvasTexture {
  if (!section144Tex) section144Tex = createSection144Texture();
  return section144Tex;
}

/**
 * 1. Delhi Police Yellow Low Barricade (Jump or switch)
 */
export function createPoliceBarricadeLow(): ObstacleInstance {
  const group = new THREE.Group();

  const yellowMat = new THREE.MeshStandardMaterial({
    color: '#ffcc00',
    roughness: 0.4,
    metalness: 0.3,
  });

  const blackMat = new THREE.MeshStandardMaterial({
    color: '#18181b',
    roughness: 0.8,
  });

  const boardMat = new THREE.MeshStandardMaterial({
    map: getPoliceTex(),
    roughness: 0.5,
  });

  // Main banner board
  const boardGeo = new THREE.BoxGeometry(2.3, 0.9, 0.08);
  const boardMesh = new THREE.Mesh(boardGeo, boardMat);
  boardMesh.position.y = 0.75;
  boardMesh.castShadow = true;
  group.add(boardMesh);

  // Metal tube frames (top, bottom, sides)
  const pipeGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.4, 8);
  pipeGeo.rotateZ(Math.PI / 2);
  const topPipe = new THREE.Mesh(pipeGeo, yellowMat);
  topPipe.position.y = 1.25;
  topPipe.castShadow = true;
  group.add(topPipe);

  const bottomPipe = new THREE.Mesh(pipeGeo, yellowMat);
  bottomPipe.position.y = 0.25;
  group.add(bottomPipe);

  // Vertical legs
  const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.25, 8);
  const leftLeg = new THREE.Mesh(legGeo, yellowMat);
  leftLeg.position.set(-1.15, 0.625, 0);
  leftLeg.castShadow = true;
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, yellowMat);
  rightLeg.position.set(1.15, 0.625, 0);
  rightLeg.castShadow = true;
  group.add(rightLeg);

  // Triangular stabilizer feet
  const footGeo = new THREE.BoxGeometry(0.12, 0.06, 0.9);
  const leftFoot = new THREE.Mesh(footGeo, blackMat);
  leftFoot.position.set(-1.15, 0.03, 0);
  group.add(leftFoot);

  const rightFoot = new THREE.Mesh(footGeo, blackMat);
  rightFoot.position.set(1.15, 0.03, 0);
  group.add(rightFoot);

  const box = new THREE.Box3();
  box.setFromObject(group);

  return {
    group,
    type: 'police_barricade_low',
    lane: 0,
    z: 0,
    box,
    dodgeType: 'jump',
  };
}

/**
 * 2. Section 144 Overhead Barrier (Slide / Duck or switch)
 */
export function createSection144High(): ObstacleInstance {
  const group = new THREE.Group();

  const steelMat = new THREE.MeshStandardMaterial({
    color: '#cbd5e1',
    metalness: 0.8,
    roughness: 0.2,
  });

  const signMat = new THREE.MeshStandardMaterial({
    map: getSectionTex(),
    roughness: 0.4,
  });

  // Tall vertical support poles on the outer sides
  const poleGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.2, 12);
  const leftPole = new THREE.Mesh(poleGeo, steelMat);
  leftPole.position.set(-1.25, 1.6, 0);
  leftPole.castShadow = true;
  group.add(leftPole);

  const rightPole = new THREE.Mesh(poleGeo, steelMat);
  rightPole.position.set(1.25, 1.6, 0);
  rightPole.castShadow = true;
  group.add(rightPole);

  // Cross beam high up
  const beamGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.6, 12);
  beamGeo.rotateZ(Math.PI / 2);
  const beam = new THREE.Mesh(beamGeo, steelMat);
  beam.position.y = 3.0;
  beam.castShadow = true;
  group.add(beam);

  // Hanging Section 144 Warning Board (hangs from y=2.8 down to y=1.2)
  // Clearance under board is ~1.1m (Slide under height!)
  const boardGeo = new THREE.BoxGeometry(2.3, 1.4, 0.08);
  const boardMesh = new THREE.Mesh(boardGeo, signMat);
  boardMesh.position.y = 2.0;
  boardMesh.castShadow = true;
  group.add(boardMesh);

  // Red beacon lights on top corners
  const lightGeo = new THREE.SphereGeometry(0.09, 8, 8);
  const lightMat = new THREE.MeshStandardMaterial({
    color: '#ef4444',
    emissive: '#dc2626',
    emissiveIntensity: 0.8,
  });
  const leftLight = new THREE.Mesh(lightGeo, lightMat);
  leftLight.position.set(-1.25, 3.15, 0);
  group.add(leftLight);

  const rightLight = new THREE.Mesh(lightGeo, lightMat);
  rightLight.position.set(1.25, 3.15, 0);
  group.add(rightLight);

  const box = new THREE.Box3();
  box.setFromObject(group);

  return {
    group,
    type: 'section144_high',
    lane: 0,
    z: 0,
    box,
    dodgeType: 'slide',
  };
}

/**
 * 3. Delhi Police / Security Van (Varun / Riot control vehicle) - Dodge only
 */
export function createPoliceVan(): ObstacleInstance {
  const group = new THREE.Group();

  const blueMat = new THREE.MeshStandardMaterial({
    color: '#1e3a8a', // Deep Delhi Police Navy
    roughness: 0.3,
    metalness: 0.6,
  });

  const whiteMat = new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    roughness: 0.4,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: '#0f172a',
    roughness: 0.1,
    metalness: 0.9,
  });

  const wheelMat = new THREE.MeshStandardMaterial({
    color: '#18181b',
    roughness: 0.9,
  });

  const redMat = new THREE.MeshStandardMaterial({
    color: '#ef4444',
    emissive: '#dc2626',
    emissiveIntensity: 0.9,
  });

  const cyanMat = new THREE.MeshStandardMaterial({
    color: '#38bdf8',
    emissive: '#0284c7',
    emissiveIntensity: 0.9,
  });

  // Van Chassis / Body
  const bodyGeo = new THREE.BoxGeometry(2.0, 1.5, 4.2);
  const bodyMesh = new THREE.Mesh(bodyGeo, blueMat);
  bodyMesh.position.y = 1.1;
  bodyMesh.castShadow = true;
  group.add(bodyMesh);

  // White side stripe
  const stripeGeo = new THREE.BoxGeometry(2.05, 0.25, 4.22);
  const stripeMesh = new THREE.Mesh(stripeGeo, whiteMat);
  stripeMesh.position.y = 1.0;
  group.add(stripeMesh);

  // Cab / Windshield
  const windshieldGeo = new THREE.BoxGeometry(1.8, 0.6, 0.1);
  const windshield = new THREE.Mesh(windshieldGeo, glassMat);
  windshield.position.set(0, 1.45, 2.11);
  group.add(windshield);

  // Roof siren bar
  const sirenBarGeo = new THREE.BoxGeometry(1.1, 0.12, 0.3);
  const sirenBar = new THREE.Mesh(sirenBarGeo, whiteMat);
  sirenBar.position.set(0, 1.95, 0.5);
  group.add(sirenBar);

  const leftBeacon = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.18, 0.25), redMat);
  leftBeacon.position.set(-0.35, 2.05, 0.5);
  group.add(leftBeacon);

  const rightBeacon = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.18, 0.25), cyanMat);
  rightBeacon.position.set(0.35, 2.05, 0.5);
  group.add(rightBeacon);

  // Roof water cannon nozzle
  const cannonGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.8, 12);
  cannonGeo.rotateX(Math.PI / 3);
  const cannon = new THREE.Mesh(cannonGeo, whiteMat);
  cannon.position.set(0, 2.15, 1.2);
  group.add(cannon);

  // 4 Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 16);
  wheelGeo.rotateZ(Math.PI / 2);

  const wheelPositions = [
    [-1.05, 0.35, 1.2],
    [1.05, 0.35, 1.2],
    [-1.05, 0.35, -1.2],
    [1.05, 0.35, -1.2],
  ];

  wheelPositions.forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.position.set(x, y, z);
    wheel.castShadow = true;
    group.add(wheel);
  });

  const box = new THREE.Box3();
  box.setFromObject(group);

  // Siren flashing animation
  const update = (_delta: number, time: number) => {
    const flash = Math.sin(time * 12) > 0;
    redMat.emissiveIntensity = flash ? 1.5 : 0.2;
    cyanMat.emissiveIntensity = flash ? 0.2 : 1.5;
  };

  return {
    group,
    type: 'police_van',
    lane: 0,
    z: 0,
    box,
    dodgeType: 'dodge_only',
    update,
  };
}

/**
 * 4. RPF (Railway Protection Force) Checkpoint Gate (Jump or switch)
 */
export function createRpfCheckpoint(): ObstacleInstance {
  const group = new THREE.Group();

  const rpfRedMat = new THREE.MeshStandardMaterial({
    color: '#991b1b',
    roughness: 0.5,
  });

  const barrierMat = new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    roughness: 0.3,
  });

  // Left & Right pillar posts
  const postGeo = new THREE.BoxGeometry(0.3, 1.5, 0.3);
  const leftPost = new THREE.Mesh(postGeo, rpfRedMat);
  leftPost.position.set(-1.2, 0.75, 0);
  leftPost.castShadow = true;
  group.add(leftPost);

  const rightPost = new THREE.Mesh(postGeo, rpfRedMat);
  rightPost.position.set(1.2, 0.75, 0);
  rightPost.castShadow = true;
  group.add(rightPost);

  // Horizontal striped arm
  const armGeo = new THREE.BoxGeometry(2.3, 0.22, 0.12);
  const armMesh = new THREE.Mesh(armGeo, barrierMat);
  armMesh.position.y = 0.95;
  armMesh.castShadow = true;
  group.add(armMesh);

  // Red accent stripes
  for (let i = -3; i <= 3; i += 2) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.23, 0.13), rpfRedMat);
    stripe.position.set(i * 0.3, 0.95, 0);
    group.add(stripe);
  }

  // RPF Badge emblem
  const badgeGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.04, 16);
  badgeGeo.rotateX(Math.PI / 2);
  const badgeMat = new THREE.MeshStandardMaterial({ color: '#f59e0b', metalness: 0.8 });
  const badge = new THREE.Mesh(badgeGeo, badgeMat);
  badge.position.set(0, 1.25, 0);
  group.add(badge);

  const box = new THREE.Box3();
  box.setFromObject(group);

  return {
    group,
    type: 'rpf_checkpoint',
    lane: 0,
    z: 0,
    box,
    dodgeType: 'jump',
  };
}

/**
 * 5. BSF Heavy Concrete & Barricade Cordon (Dodge only)
 */
export function createBsfHeavyCordon(): ObstacleInstance {
  const group = new THREE.Group();

  const concreteMat = new THREE.MeshStandardMaterial({
    color: '#71717a',
    roughness: 0.9,
    metalness: 0.05,
  });

  const camoMat = new THREE.MeshStandardMaterial({
    color: '#365314', // Olive/khaki
    roughness: 0.8,
  });

  const wireMat = new THREE.MeshStandardMaterial({
    color: '#94a3b8',
    metalness: 0.9,
    roughness: 0.2,
    wireframe: true,
  });

  // Heavy concrete base
  const baseGeo = new THREE.BoxGeometry(2.2, 0.8, 1.2);
  const baseMesh = new THREE.Mesh(baseGeo, concreteMat);
  baseMesh.position.y = 0.4;
  baseMesh.castShadow = true;
  group.add(baseMesh);

  // Steel wire cordon frame
  const frameGeo = new THREE.BoxGeometry(2.1, 1.0, 0.1);
  const frameMesh = new THREE.Mesh(frameGeo, camoMat);
  frameMesh.position.set(0, 1.2, 0);
  frameMesh.castShadow = true;
  group.add(frameMesh);

  // Barbed concertina wire rolls on top
  const coilGeo = new THREE.TorusGeometry(0.4, 0.12, 8, 20);
  coilGeo.rotateY(Math.PI / 2);

  const coil1 = new THREE.Mesh(coilGeo, wireMat);
  coil1.position.set(-0.6, 1.85, 0);
  group.add(coil1);

  const coil2 = new THREE.Mesh(coilGeo, wireMat);
  coil2.position.set(0.6, 1.85, 0);
  group.add(coil2);

  const box = new THREE.Box3();
  box.setFromObject(group);

  return {
    group,
    type: 'bsf_heavy_cordon',
    lane: 0,
    z: 0,
    box,
    dodgeType: 'dodge_only',
  };
}
