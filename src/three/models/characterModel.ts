import * as THREE from 'three';
import { CharacterInfo } from '../../types/game';
import { CharacterSkin } from '../../types/challenges';
import { getCharacterFaceTexture } from '../../utils/characterAvatars';

export interface AnimatedCharacter {
  group: THREE.Group;
  updateAnimation: (time: number, isGrounded: boolean, isSliding: boolean, isHoverboarding: boolean, speed: number) => void;
  setHoverboardVisible: (visible: boolean) => void;
  setShieldVisible: (visible: boolean) => void;
  characterInfo: CharacterInfo;
  skin?: CharacterSkin;
}

export function createCharacter(info: CharacterInfo, skin?: CharacterSkin): AnimatedCharacter {
  const rootGroup = new THREE.Group();
  rootGroup.name = `character_${info.id}_${skin ? skin.id : 'default'}`;

  const primaryCol = skin ? skin.primaryColor : info.primaryColor;
  const accentCol = skin ? skin.accentColor : info.accentColor;
  const pantsCol = skin?.pantsColor || '#1e293b';

  // Materials with varied roughness/metalness
  const skinMat = new THREE.MeshStandardMaterial({
    color: '#d49b72',
    roughness: 0.7,
    metalness: 0.05,
  });

  const clothesMat = new THREE.MeshStandardMaterial({
    color: primaryCol,
    roughness: 0.75,
    metalness: 0.15,
  });

  const pantsMat = new THREE.MeshStandardMaterial({
    color: pantsCol,
    roughness: 0.85,
    metalness: 0.05,
  });

  const shoesMat = new THREE.MeshStandardMaterial({
    color: '#f8fafc', // White running sneakers
    roughness: 0.5,
    metalness: 0.15,
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: '#18181b', // Black hair
    roughness: 0.9,
    metalness: 0.0,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: accentCol,
    roughness: 0.4,
    metalness: 0.3,
  });

  // Hips & Pelvis
  const hips = new THREE.Group();
  hips.position.y = 1.0;
  rootGroup.add(hips);

  const pelvisGeo = new THREE.BoxGeometry(0.5, 0.25, 0.35);
  const pelvisMesh = new THREE.Mesh(pelvisGeo, pantsMat);
  pelvisMesh.castShadow = true;
  hips.add(pelvisMesh);

  // Torso
  const torsoGeo = new THREE.BoxGeometry(0.55, 0.65, 0.36);
  const torsoMesh = new THREE.Mesh(torsoGeo, clothesMat);
  torsoMesh.position.y = 0.45;
  torsoMesh.castShadow = true;
  hips.add(torsoMesh);

  // Character-specific secondary read (backpack / khadi vest / press badge)
  if (info.id === 'aarav_student') {
    // Student backpack
    const bagGeo = new THREE.BoxGeometry(0.42, 0.48, 0.22);
    const bagMesh = new THREE.Mesh(bagGeo, accentMat);
    bagMesh.position.set(0, 0.45, -0.24);
    bagMesh.castShadow = true;
    hips.add(bagMesh);
  } else if (info.id === 'priya_advocate') {
    // White lawyer neckband & black formal coat accent
    const bandGeo = new THREE.BoxGeometry(0.18, 0.24, 0.05);
    const bandMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3 });
    const bandMesh = new THREE.Mesh(bandGeo, bandMat);
    bandMesh.position.set(0, 0.58, 0.19);
    hips.add(bandMesh);
  } else if (info.id === 'dev_kisan') {
    // Tricolor / Green agrarian gamchha scarf draped over shoulder
    const scarfGeo = new THREE.BoxGeometry(0.58, 0.14, 0.38);
    const scarfMat = new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.7 });
    const scarfMesh = new THREE.Mesh(scarfGeo, scarfMat);
    scarfMesh.position.set(0, 0.72, 0);
    hips.add(scarfMesh);
  } else if (info.id === 'meera_press') {
    // Press lanyard badge
    const lanyardGeo = new THREE.BoxGeometry(0.15, 0.2, 0.05);
    const lanyardMat = new THREE.MeshStandardMaterial({ color: '#ea580c', roughness: 0.5 });
    const lanyardMesh = new THREE.Mesh(lanyardGeo, lanyardMat);
    lanyardMesh.position.set(0, 0.48, 0.19);
    hips.add(lanyardMesh);
  } else if (info.id === 'sonam_wangchuk') {
    // Ladakhi Goncha sash across waist & shoulder
    const sashGeo = new THREE.BoxGeometry(0.58, 0.12, 0.38);
    const sashMat = new THREE.MeshStandardMaterial({ color: '#f59e0b', roughness: 0.6 });
    const sashMesh = new THREE.Mesh(sashGeo, sashMat);
    sashMesh.position.set(0, 0.25, 0);
    hips.add(sashMesh);

    // Wool collar wrap
    const collarGeo = new THREE.BoxGeometry(0.48, 0.12, 0.34);
    const collarMat = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.9 });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.position.set(0, 0.72, 0);
    hips.add(collar);
  } else if (info.id === 'abhijeet_dipake') {
    // Student protest hoodie pocket pouch
    const pouchGeo = new THREE.BoxGeometry(0.38, 0.22, 0.08);
    const pouchMat = new THREE.MeshStandardMaterial({ color: '#1e40af', roughness: 0.8 });
    const pouch = new THREE.Mesh(pouchGeo, pouchMat);
    pouch.position.set(0, 0.32, 0.19);
    hips.add(pouch);
  } else if (info.id === 'saurabh_das') {
    // Formal journalist press ID card
    const pressIdGeo = new THREE.BoxGeometry(0.16, 0.22, 0.04);
    const pressIdMat = new THREE.MeshStandardMaterial({ color: '#06b6d4', roughness: 0.4 });
    const pressId = new THREE.Mesh(pressIdGeo, pressIdMat);
    pressId.position.set(0, 0.52, 0.19);
    hips.add(pressId);
  }

  // Neck & Head
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.82, 0);
  hips.add(headGroup);

  const headGeo = new THREE.BoxGeometry(0.36, 0.38, 0.36);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.position.y = 0.2;
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Photographic front face texture decal
  const faceTexture = getCharacterFaceTexture(info.id);
  const faceMat = new THREE.MeshStandardMaterial({
    map: faceTexture,
    roughness: 0.6,
    metalness: 0.0,
    transparent: true,
  });
  const facePlaneGeo = new THREE.PlaneGeometry(0.35, 0.36);
  const facePlane = new THREE.Mesh(facePlaneGeo, faceMat);
  facePlane.position.set(0, 0.2, 0.182); // flush on front face
  headGroup.add(facePlane);

  // Hair / Headgear
  if (info.id === 'sonam_wangchuk') {
    // Traditional Ladakhi wool cap (Tibi)
    const tibiGeo = new THREE.CylinderGeometry(0.24, 0.22, 0.22, 16);
    const tibiMat = new THREE.MeshStandardMaterial({ color: '#571f11', roughness: 0.85 });
    const tibi = new THREE.Mesh(tibiGeo, tibiMat);
    tibi.position.y = 0.44;
    tibi.castShadow = true;
    headGroup.add(tibi);

    // Curved wool ear flap
    const flapGeo = new THREE.BoxGeometry(0.42, 0.1, 0.42);
    const flap = new THREE.Mesh(flapGeo, tibiMat);
    flap.position.y = 0.34;
    headGroup.add(flap);
  } else {
    // Standard hair
    const hairGeo = new THREE.BoxGeometry(0.38, 0.14, 0.38);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.y = 0.38;
    headGroup.add(hairMesh);
  }

  // Spectacles for student / advocate / Wangchuk / Saurabh
  if (
    info.id === 'aarav_student' ||
    info.id === 'priya_advocate' ||
    info.id === 'sonam_wangchuk' ||
    info.id === 'saurabh_das'
  ) {
    const glassesGeo = new THREE.BoxGeometry(0.34, 0.08, 0.06);
    const glassesMat = new THREE.MeshStandardMaterial({
      color: info.id === 'sonam_wangchuk' ? '#94a3b8' : '#09090b',
      roughness: 0.2,
      metalness: 0.8,
    });
    const glassesMesh = new THREE.Mesh(glassesGeo, glassesMat);
    glassesMesh.position.set(0, 0.22, 0.19);
    headGroup.add(glassesMesh);
  }

  // Arms with Pivots
  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.35, 0.7, 0);
  hips.add(leftArmPivot);

  const leftArmGeo = new THREE.BoxGeometry(0.16, 0.6, 0.16);
  const leftArmMesh = new THREE.Mesh(leftArmGeo, clothesMat);
  leftArmMesh.position.y = -0.3;
  leftArmMesh.castShadow = true;
  leftArmPivot.add(leftArmMesh);

  // Red rally wristband for Abhijeet Dipake
  if (info.id === 'abhijeet_dipake') {
    const wristbandGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 12);
    const wristbandMat = new THREE.MeshStandardMaterial({ color: '#dc2626' });
    const wristband = new THREE.Mesh(wristbandGeo, wristbandMat);
    wristband.position.set(0, -0.45, 0);
    leftArmPivot.add(wristband);
  }

  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.35, 0.7, 0);
  hips.add(rightArmPivot);

  const rightArmGeo = new THREE.BoxGeometry(0.16, 0.6, 0.16);
  const rightArmMesh = new THREE.Mesh(rightArmGeo, clothesMat);
  rightArmMesh.position.y = -0.3;
  rightArmMesh.castShadow = true;
  rightArmPivot.add(rightArmMesh);

  // Handheld props
  if (info.id === 'abhijeet_dipake') {
    // Megaphone in hand
    const hornGeo = new THREE.ConeGeometry(0.14, 0.28, 12);
    hornGeo.rotateZ(-Math.PI / 2);
    const hornMat = new THREE.MeshStandardMaterial({ color: '#ef4444', roughness: 0.3 });
    const horn = new THREE.Mesh(hornGeo, hornMat);
    horn.position.set(0.08, -0.58, 0.12);
    rightArmPivot.add(horn);
  } else if (info.id === 'sonam_wangchuk') {
    // Himalayan parchment scroll in hand
    const scrollGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.32, 12);
    const scrollMat = new THREE.MeshStandardMaterial({ color: '#fef3c7', roughness: 0.6 });
    const scroll = new THREE.Mesh(scrollGeo, scrollMat);
    scroll.rotation.x = Math.PI / 4;
    scroll.position.set(0, -0.58, 0.1);
    rightArmPivot.add(scroll);
  } else if (info.id === 'saurabh_das') {
    // Reporter's notebook
    const noteGeo = new THREE.BoxGeometry(0.14, 0.22, 0.04);
    const noteMat = new THREE.MeshStandardMaterial({ color: '#38bdf8', roughness: 0.5 });
    const note = new THREE.Mesh(noteGeo, noteMat);
    note.position.set(0, -0.58, 0.08);
    rightArmPivot.add(note);
  } else {
    // Default mini Constitution book in hand
    const propGeo = new THREE.BoxGeometry(0.15, 0.22, 0.08);
    const propMat = new THREE.MeshStandardMaterial({ color: '#f59e0b', roughness: 0.4, metalness: 0.3 });
    const propMesh = new THREE.Mesh(propGeo, propMat);
    propMesh.position.set(0, -0.58, 0.06);
    rightArmPivot.add(propMesh);
  }

  // Legs with Pivots
  const leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.16, -0.1, 0);
  hips.add(leftLegPivot);

  const leftLegGeo = new THREE.BoxGeometry(0.18, 0.65, 0.2);
  const leftLegMesh = new THREE.Mesh(leftLegGeo, pantsMat);
  leftLegMesh.position.y = -0.32;
  leftLegMesh.castShadow = true;
  leftLegPivot.add(leftLegMesh);

  const shoeGeo = new THREE.BoxGeometry(0.2, 0.14, 0.32);
  const leftShoe = new THREE.Mesh(shoeGeo, shoesMat);
  leftShoe.position.set(0, -0.68, 0.05);
  leftShoe.castShadow = true;
  leftLegPivot.add(leftShoe);

  const rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.16, -0.1, 0);
  hips.add(rightLegPivot);

  const rightLegGeo = new THREE.BoxGeometry(0.18, 0.65, 0.2);
  const rightLegMesh = new THREE.Mesh(rightLegGeo, pantsMat);
  rightLegMesh.position.y = -0.32;
  rightLegMesh.castShadow = true;
  rightLegPivot.add(rightLegMesh);

  const rightShoe = new THREE.Mesh(shoeGeo, shoesMat);
  rightShoe.position.set(0, -0.68, 0.05);
  rightShoe.castShadow = true;
  rightLegPivot.add(rightShoe);

  // Hoverboard (Subway Surfers signature hoverboard with Indian Tricolor theme)
  const hoverboardGroup = new THREE.Group();
  hoverboardGroup.position.set(0, 0.15, 0);
  hoverboardGroup.visible = false;
  rootGroup.add(hoverboardGroup);

  const deckGeo = new THREE.BoxGeometry(0.65, 0.08, 1.6);
  const deckMat = new THREE.MeshStandardMaterial({
    color: '#0284c7',
    metalness: 0.7,
    roughness: 0.2,
  });
  const deckMesh = new THREE.Mesh(deckGeo, deckMat);
  deckMesh.castShadow = true;
  hoverboardGroup.add(deckMesh);

  // Hover thrusters with emissive glow
  const thrusterGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.1, 16);
  const thrusterMat = new THREE.MeshStandardMaterial({
    color: '#38bdf8',
    emissive: '#0284c7',
    emissiveIntensity: 0.8,
  });
  const thrusterFront = new THREE.Mesh(thrusterGeo, thrusterMat);
  thrusterFront.position.set(0, -0.06, 0.55);
  hoverboardGroup.add(thrusterFront);

  const thrusterRear = new THREE.Mesh(thrusterGeo, thrusterMat);
  thrusterRear.position.set(0, -0.06, -0.55);
  hoverboardGroup.add(thrusterRear);

  // Energy Shield Bubble (Sphere around player)
  const shieldGeo = new THREE.SphereGeometry(1.2, 24, 24);
  const shieldMat = new THREE.MeshStandardMaterial({
    color: '#38bdf8',
    emissive: '#0284c7',
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.35,
    wireframe: true,
  });
  const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
  shieldMesh.position.set(0, 1.0, 0);
  shieldMesh.visible = false;
  rootGroup.add(shieldMesh);

  // Animation Update
  const updateAnimation = (
    time: number,
    isGrounded: boolean,
    isSliding: boolean,
    isHoverboarding: boolean,
    speed: number
  ) => {
    if (shieldMesh.visible) {
      shieldMesh.rotation.y += 0.03;
      shieldMesh.rotation.x += 0.01;
    }

    if (isHoverboarding) {
      // Hoverboard glide stance
      hoverboardGroup.visible = true;
      hips.position.y = 1.05;
      hips.rotation.x = 0;
      hips.rotation.z = Math.sin(time * 3) * 0.05;

      leftLegPivot.rotation.x = 0.2;
      rightLegPivot.rotation.x = -0.2;
      leftArmPivot.rotation.x = -0.3;
      rightArmPivot.rotation.x = -0.3;
      return;
    }

    hoverboardGroup.visible = false;

    if (isSliding) {
      // Subway Surfers duck / slide
      hips.position.y = 0.45;
      torsoMesh.rotation.x = 0.7;
      leftLegPivot.rotation.x = -1.4;
      rightLegPivot.rotation.x = -1.2;
      leftArmPivot.rotation.x = -1.1;
      rightArmPivot.rotation.x = -1.1;
      return;
    }

    // Reset slide rotation
    torsoMesh.rotation.x = 0;

    if (!isGrounded) {
      // Airborne jump
      hips.position.y = 1.0;
      leftLegPivot.rotation.x = -0.4;
      rightLegPivot.rotation.x = 0.3;
      leftArmPivot.rotation.x = -1.2;
      rightArmPivot.rotation.x = -1.2;
      return;
    }

    // Running gait cadence
    const gaitSpeed = Math.max(12, speed * 0.7);
    const swing = Math.sin(time * gaitSpeed);

    hips.position.y = 1.0 + Math.abs(swing) * 0.08;
    hips.rotation.y = swing * 0.06;

    leftLegPivot.rotation.x = swing * 0.75;
    rightLegPivot.rotation.x = -swing * 0.75;

    leftArmPivot.rotation.x = -swing * 0.8;
    rightArmPivot.rotation.x = swing * 0.8;
  };

  const setHoverboardVisible = (visible: boolean) => {
    hoverboardGroup.visible = visible;
  };

  const setShieldVisible = (visible: boolean) => {
    shieldMesh.visible = visible;
  };

  return {
    group: rootGroup,
    updateAnimation,
    setHoverboardVisible,
    setShieldVisible,
    characterInfo: info,
    skin,
  };
}
