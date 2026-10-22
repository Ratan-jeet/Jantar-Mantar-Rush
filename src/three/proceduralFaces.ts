import * as THREE from 'three';

export interface FaceFeatures {
  skinTone: string;
  hairStyle: 'short' | 'curly' | 'receding_silver' | 'slick' | 'long_tied' | 'tibi_cap' | 'cap' | 'side_part';
  hairColor: string;
  beard: 'none' | 'stubble' | 'full' | 'goatee' | 'trim';
  glasses: 'none' | 'rectangular' | 'round_wire' | 'black_thick';
  accessory?: 'none' | 'press_badge' | 'red_band' | 'ladakhi_cap' | 'tricolor_cheek';
}

const faceTextureCache: Record<string, THREE.CanvasTexture> = {};
const faceDataUrlCache: Record<string, string> = {};

export function renderFaceCanvas(features: FaceFeatures, characterName: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Background portrait gradient
  const bgGrad = ctx.createRadialGradient(128, 128, 20, 128, 128, 130);
  bgGrad.addColorStop(0, '#1e293b');
  bgGrad.addColorStop(1, '#090d16');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 256, 256);

  // Neck
  ctx.fillStyle = features.skinTone;
  ctx.beginPath();
  ctx.roundRect(100, 175, 56, 60, [8, 8, 0, 0]);
  ctx.fill();

  // Neck shadow
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(100, 175, 56, 14);

  // Collar/Shirt trim
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(85, 235);
  ctx.lineTo(128, 215);
  ctx.lineTo(171, 235);
  ctx.lineTo(171, 256);
  ctx.lineTo(85, 256);
  ctx.closePath();
  ctx.fill();

  // Head/Jaw contour
  ctx.fillStyle = features.skinTone;
  ctx.beginPath();
  ctx.ellipse(128, 125, 54, 68, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.beginPath();
  ctx.ellipse(71, 125, 10, 16, 0, 0, Math.PI * 2);
  ctx.ellipse(185, 125, 10, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cheek contours & blush
  ctx.fillStyle = 'rgba(180, 50, 40, 0.08)';
  ctx.beginPath();
  ctx.arc(102, 135, 14, 0, Math.PI * 2);
  ctx.arc(154, 135, 14, 0, Math.PI * 2);
  ctx.fill();

  // Tricolor flag sticker on cheek for youth/protesters
  if (features.accessory === 'tricolor_cheek') {
    ctx.fillStyle = '#ff9933';
    ctx.fillRect(156, 134, 14, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(156, 138, 14, 4);
    ctx.fillStyle = '#138808';
    ctx.fillRect(156, 142, 14, 4);
  }

  // Eyes (Sclera)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(106, 118, 11, 7, -0.05, 0, Math.PI * 2);
  ctx.ellipse(150, 118, 11, 7, 0.05, 0, Math.PI * 2);
  ctx.fill();

  // Irises
  ctx.fillStyle = '#26170d';
  ctx.beginPath();
  ctx.arc(106, 118, 5.5, 0, Math.PI * 2);
  ctx.arc(150, 118, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = '#050505';
  ctx.beginPath();
  ctx.arc(106, 118, 2.8, 0, Math.PI * 2);
  ctx.arc(150, 118, 2.8, 0, Math.PI * 2);
  ctx.fill();

  // Specular catchlight reflection in eyes
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(104, 116, 1.4, 0, Math.PI * 2);
  ctx.arc(148, 116, 1.4, 0, Math.PI * 2);
  ctx.fill();

  // Eyebrows
  ctx.fillStyle = features.hairColor;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(93, 107);
  ctx.quadraticCurveTo(106, 102, 120, 107);
  ctx.moveTo(136, 107);
  ctx.quadraticCurveTo(150, 102, 163, 107);
  ctx.stroke();

  // Nose
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(128, 114);
  ctx.lineTo(125, 140);
  ctx.lineTo(133, 140);
  ctx.stroke();

  // Nostrils
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath();
  ctx.arc(122, 142, 2, 0, Math.PI * 2);
  ctx.arc(134, 142, 2, 0, Math.PI * 2);
  ctx.fill();

  // Lips
  ctx.fillStyle = '#b0574f';
  ctx.beginPath();
  ctx.moveTo(116, 158);
  ctx.quadraticCurveTo(128, 154, 140, 158);
  ctx.quadraticCurveTo(128, 165, 116, 158);
  ctx.fill();

  // Beard / Stubble
  if (features.beard === 'stubble') {
    ctx.fillStyle = 'rgba(24, 24, 27, 0.22)';
    ctx.beginPath();
    ctx.arc(128, 152, 28, 0.2, Math.PI - 0.2);
    ctx.fill();
  } else if (features.beard === 'full' || features.beard === 'trim') {
    ctx.fillStyle = features.hairColor;
    ctx.beginPath();
    ctx.arc(128, 145, 34, 0.2, Math.PI - 0.2);
    ctx.fill();
    // mustache
    ctx.beginPath();
    ctx.ellipse(128, 153, 18, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (features.beard === 'goatee') {
    ctx.fillStyle = features.hairColor;
    ctx.beginPath();
    ctx.arc(128, 160, 14, 0, Math.PI);
    ctx.fill();
  }

  // Hair styling
  ctx.fillStyle = features.hairColor;
  if (features.hairStyle === 'tibi_cap') {
    // Ladakhi Tibi wool cap
    ctx.fillStyle = '#571f11';
    ctx.beginPath();
    ctx.ellipse(128, 78, 56, 32, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wool earflap trim
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.roundRect(70, 75, 116, 22, 6);
    ctx.fill();
  } else if (features.hairStyle === 'cap') {
    // Baseball/activist cap
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    ctx.ellipse(128, 85, 54, 26, 0, Math.PI, 0);
    ctx.fill();
    // Visor
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.ellipse(128, 88, 58, 10, 0, 0, Math.PI);
    ctx.fill();
  } else if (features.hairStyle === 'receding_silver') {
    // Silver sides
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.ellipse(75, 115, 14, 28, 0, 0, Math.PI * 2);
    ctx.ellipse(181, 115, 14, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    // Top sparse
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.ellipse(128, 72, 46, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (features.hairStyle === 'curly') {
    for (let angle = 0; angle < Math.PI; angle += 0.25) {
      const x = 128 - Math.cos(angle) * 52;
      const y = 88 - Math.sin(angle) * 32;
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (features.hairStyle === 'long_tied') {
    ctx.beginPath();
    ctx.ellipse(128, 76, 56, 32, 0, 0, Math.PI * 2);
    ctx.fill();
    // Hair strands falling
    ctx.fillRect(72, 90, 16, 55);
    ctx.fillRect(168, 90, 16, 55);
  } else {
    // Default short / side part
    ctx.beginPath();
    ctx.ellipse(128, 76, 56, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(72, 85, 14, 30);
    ctx.fillRect(170, 85, 14, 30);
  }

  // Glasses
  if (features.glasses !== 'none') {
    ctx.strokeStyle = features.glasses === 'round_wire' ? '#94a3b8' : '#09090b';
    ctx.lineWidth = features.glasses === 'black_thick' ? 3.5 : 2.0;

    if (features.glasses === 'round_wire') {
      ctx.beginPath();
      ctx.arc(106, 118, 14, 0, Math.PI * 2);
      ctx.arc(150, 118, 14, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.roundRect(91, 107, 28, 22, 4);
      ctx.roundRect(137, 107, 28, 22, 4);
      ctx.stroke();
    }

    // Bridge
    ctx.beginPath();
    ctx.moveTo(119, 116);
    ctx.lineTo(137, 116);
    ctx.stroke();

    // Glare reflection on glasses lens
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.beginPath();
    ctx.moveTo(94, 110);
    ctx.lineTo(108, 110);
    ctx.lineTo(98, 126);
    ctx.closePath();
    ctx.fill();
  }

  // Nametag banner on bottom
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(12, 220, 232, 28);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(12, 220, 232, 28);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(characterName, 128, 234);

  return canvas;
}

export function getFaceTexture(id: string, features: FaceFeatures, name: string): THREE.CanvasTexture {
  if (faceTextureCache[id]) return faceTextureCache[id];
  const canvas = renderFaceCanvas(features, name);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  faceTextureCache[id] = tex;
  return tex;
}

export function getFaceDataUrl(id: string, features: FaceFeatures, name: string): string {
  if (faceDataUrlCache[id]) return faceDataUrlCache[id];
  const canvas = renderFaceCanvas(features, name);
  const dataUrl = canvas.toDataURL('image/png');
  faceDataUrlCache[id] = dataUrl;
  return dataUrl;
}
