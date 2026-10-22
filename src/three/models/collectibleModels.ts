import * as THREE from 'three';
import {
  createConstitutionTexture,
  createExamPaperTexture,
  createVoteBallotTexture,
} from '../proceduralTextures';
import { CollectibleType, PowerUpType } from '../../types/game';

export interface CollectibleInstance {
  group: THREE.Group;
  type: CollectibleType | PowerUpType;
  isPowerUp: boolean;
  lane: number;
  z: number;
  y: number;
  collected: boolean;
  update: (delta: number, time: number) => void;
}

let constitutionTex: THREE.CanvasTexture | null = null;
let examPaperTex: THREE.CanvasTexture | null = null;
let voteTex: THREE.CanvasTexture | null = null;

function getConstitutionTex() {
  if (!constitutionTex) constitutionTex = createConstitutionTexture();
  return constitutionTex;
}

function getExamPaperTex() {
  if (!examPaperTex) examPaperTex = createExamPaperTexture();
  return examPaperTex;
}

function getVoteTex() {
  if (!voteTex) voteTex = createVoteBallotTexture();
  return voteTex;
}

export function createCollectible(
  type: CollectibleType | PowerUpType,
  lane: number,
  z: number,
  y: number = 1.0
): CollectibleInstance {
  const group = new THREE.Group();
  group.position.set(lane * 3.2, y, z);

  const isPowerUp = [
    'hoverboard',
    'super_boots',
    'magnet',
    'double_score',
    'shield',
  ].includes(type);

  // Power-up halo glow base if powerup
  if (isPowerUp) {
    const haloGeo = new THREE.RingGeometry(0.5, 0.75, 16);
    haloGeo.rotateX(-Math.PI / 2);
    const haloMat = new THREE.MeshBasicMaterial({
      color: '#facc15',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.y = -0.4;
    group.add(halo);
  }

  if (type === 'exam_paper') {
    // Exam Paper sheet
    const paperGeo = new THREE.PlaneGeometry(0.7, 0.95);
    const paperMat = new THREE.MeshStandardMaterial({
      map: getExamPaperTex(),
      roughness: 0.8,
      side: THREE.DoubleSide,
    });
    const paperMesh = new THREE.Mesh(paperGeo, paperMat);
    paperMesh.castShadow = true;
    group.add(paperMesh);

    // Subtle paper backing thickness
    const backGeo = new THREE.BoxGeometry(0.72, 0.97, 0.02);
    const backMat = new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.9 });
    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.position.z = -0.01;
    group.add(backMesh);
  } else if (type === 'constitution') {
    // Constitution Book (Samvidhan)
    const bookGeo = new THREE.BoxGeometry(0.8, 1.1, 0.22);
    const bookMat = new THREE.MeshStandardMaterial({
      map: getConstitutionTex(),
      roughness: 0.3,
      metalness: 0.4,
    });
    const bookMesh = new THREE.Mesh(bookGeo, bookMat);
    bookMesh.castShadow = true;
    group.add(bookMesh);

    // Golden aura particle ring
    const goldRingGeo = new THREE.TorusGeometry(0.7, 0.04, 8, 24);
    const goldRingMat = new THREE.MeshStandardMaterial({
      color: '#fbbf24',
      emissive: '#d97706',
      emissiveIntensity: 0.9,
    });
    const goldRing = new THREE.Mesh(goldRingGeo, goldRingMat);
    group.add(goldRing);
  } else if (type === 'vote') {
    // Vote Ballot Card
    const ballotGeo = new THREE.BoxGeometry(0.75, 0.75, 0.04);
    const ballotMat = new THREE.MeshStandardMaterial({
      map: getVoteTex(),
      roughness: 0.5,
    });
    const ballotMesh = new THREE.Mesh(ballotGeo, ballotMat);
    ballotMesh.castShadow = true;
    group.add(ballotMesh);
  } else if (type === 'rti_query') {
    // RTI Scroll / Cylinder
    const scrollGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.9, 16);
    const scrollMat = new THREE.MeshStandardMaterial({
      color: '#fef08a',
      roughness: 0.7,
    });
    const scroll = new THREE.Mesh(scrollGeo, scrollMat);
    scroll.rotation.z = Math.PI / 4;
    group.add(scroll);

    // Red ribbon tie
    const ribbonGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.15, 16);
    const ribbonMat = new THREE.MeshStandardMaterial({ color: '#dc2626' });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbon.rotation.z = Math.PI / 4;
    group.add(ribbon);
  } else if (type === 'hoverboard') {
    // PowerUp: Hoverboard
    const boardGeo = new THREE.BoxGeometry(0.4, 0.1, 1.1);
    const boardMat = new THREE.MeshStandardMaterial({
      color: '#0284c7',
      emissive: '#38bdf8',
      emissiveIntensity: 0.6,
      metalness: 0.8,
    });
    const boardMesh = new THREE.Mesh(boardGeo, boardMat);
    group.add(boardMesh);
  } else if (type === 'super_boots') {
    // PowerUp: Winged Boots
    const bootGeo = new THREE.BoxGeometry(0.35, 0.5, 0.65);
    const bootMat = new THREE.MeshStandardMaterial({
      color: '#ef4444',
      emissive: '#f87171',
      emissiveIntensity: 0.5,
      metalness: 0.4,
    });
    const bootMesh = new THREE.Mesh(bootGeo, bootMat);
    group.add(bootMesh);

    // Wings
    const wingGeo = new THREE.ConeGeometry(0.2, 0.4, 4);
    wingGeo.rotateZ(Math.PI / 3);
    const wingMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3 });
    const wing = new THREE.Mesh(wingGeo, wingMat);
    wing.position.set(-0.25, 0.2, 0);
    group.add(wing);
  } else if (type === 'magnet') {
    // PowerUp: Horseshoe Magnet
    const magnetGeo = new THREE.TorusGeometry(0.38, 0.1, 8, 16, Math.PI);
    const magnetMat = new THREE.MeshStandardMaterial({
      color: '#dc2626',
      emissive: '#b91c1c',
      emissiveIntensity: 0.4,
      metalness: 0.8,
    });
    const magnetMesh = new THREE.Mesh(magnetGeo, magnetMat);
    magnetMesh.rotation.z = Math.PI;
    group.add(magnetMesh);

    // Silver poles
    const poleGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.18, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', metalness: 0.9 });
    const pole1 = new THREE.Mesh(poleGeo, poleMat);
    pole1.position.set(-0.38, -0.09, 0);
    group.add(pole1);
    const pole2 = new THREE.Mesh(poleGeo, poleMat);
    pole2.position.set(0.38, -0.09, 0);
    group.add(pole2);
  } else if (type === 'double_score') {
    // PowerUp: Megaphone
    const coneGeo = new THREE.ConeGeometry(0.35, 0.75, 16);
    coneGeo.rotateZ(-Math.PI / 2);
    const coneMat = new THREE.MeshStandardMaterial({
      color: '#f59e0b',
      emissive: '#d97706',
      emissiveIntensity: 0.7,
      metalness: 0.8,
    });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    group.add(cone);
  } else if (type === 'shield') {
    // PowerUp: Supreme Court Shield
    const shieldGeo = new THREE.IcosahedronGeometry(0.45, 1);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: '#06b6d4',
      emissive: '#0891b2',
      emissiveIntensity: 0.8,
      wireframe: true,
    });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    group.add(shield);
  }

  const initialY = y;

  const update = (_delta: number, time: number) => {
    // Continuous rotation
    group.rotation.y = time * 2.2;
    // Gentle floating bob
    group.position.y = initialY + Math.sin(time * 3.5 + lane) * 0.15;
  };

  return {
    group,
    type,
    isPowerUp,
    lane,
    z,
    y: initialY,
    collected: false,
    update,
  };
}
