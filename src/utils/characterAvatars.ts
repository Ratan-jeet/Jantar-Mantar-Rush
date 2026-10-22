import * as THREE from 'three';
import { CHARACTERS } from '../data/charactersAndFacts';
import { CharacterInfo } from '../types/game';

// In-memory cache for data URLs and Three.js textures
const avatarDataUrlCache = new Map<string, string>();
const avatarTextureCache = new Map<string, THREE.CanvasTexture>();

interface DefaultFeatures {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  beard?: string;
  glasses?: string;
  accessory?: string;
}

const DEFAULT_FEATURES: DefaultFeatures = {
  skinTone: '#d49b72',
  hairStyle: 'short',
  hairColor: '#18181b',
  beard: 'none',
  glasses: 'none',
  accessory: 'none',
};

/**
 * Procedurally paints an authentic, high-fidelity portrait face photo for each character.
 * Uses realistic skin shading, individualized eyes, facial hair, glasses, unique headgear,
 * protest accessories (red headband, lawyer bands, press ID badge, tricolor cheek mark, Ladakhi cap, mic).
 */
export function generateCharacterAvatar(info: CharacterInfo, size = 256): string {
  if (avatarDataUrlCache.has(info.id)) {
    return avatarDataUrlCache.get(info.id)!;
  }

  const features = { ...DEFAULT_FEATURES, ...(info.features || {}) };
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const s = size / 256; // scale factor

  // 1. Studio Lighting Background with subtle radial vignette
  const bgGrad = ctx.createRadialGradient(128 * s, 100 * s, 30 * s, 128 * s, 128 * s, 160 * s);
  bgGrad.addColorStop(0, info.primaryColor + 'ee');
  bgGrad.addColorStop(0.7, '#0f172a');
  bgGrad.addColorStop(1, '#020617');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // Subtle circular spotlight rim behind head
  ctx.save();
  ctx.beginPath();
  ctx.arc(128 * s, 110 * s, 85 * s, 0, Math.PI * 2);
  ctx.fillStyle = info.accentColor + '22';
  ctx.filter = 'blur(12px)';
  ctx.fill();
  ctx.restore();

  // 2. Shoulders & Torso Clothing
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(128 * s, 250 * s, 80 * s, 65 * s, 0, 0, Math.PI * 2);
  ctx.fillStyle = info.primaryColor;
  ctx.fill();

  // Collar / Inner garment
  ctx.beginPath();
  ctx.moveTo(105 * s, 195 * s);
  ctx.lineTo(128 * s, 230 * s);
  ctx.lineTo(151 * s, 195 * s);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // Specific Torso Attire
  if (info.id === 'priya_advocate') {
    // Supreme Court lawyer black coat & dual white bands
    ctx.fillStyle = '#09090b';
    ctx.fillRect(80 * s, 205 * s, 96 * s, 60 * s);
    // White lawyer neckband tabs
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(122 * s, 200 * s, 5 * s, 30 * s);
    ctx.fillRect(129 * s, 200 * s, 5 * s, 30 * s);
  } else if (info.id === 'sonam_wangchuk') {
    // Traditional Ladakhi Maroon Goncha & Gold Sash
    ctx.fillStyle = '#78350f';
    ctx.fillRect(75 * s, 200 * s, 106 * s, 60 * s);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(80 * s, 235 * s, 96 * s, 12 * s);
  } else if (info.id === 'dev_kisan') {
    // Green farmer gamchha across shoulder
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.moveTo(80 * s, 200 * s);
    ctx.lineTo(115 * s, 260 * s);
    ctx.lineTo(140 * s, 260 * s);
    ctx.lineTo(100 * s, 195 * s);
    ctx.fill();
  } else if (info.id === 'abhijeet_dipake') {
    // Cobalt blue jacket with 'School Thik Karo' and CJP resilience badge
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(80 * s, 205 * s, 96 * s, 60 * s);
    ctx.fillStyle = '#f59e0b';
    ctx.font = `bold ${7 * s}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('CJP • CITZN', 128 * s, 226 * s);
    ctx.fillStyle = '#ef4444';
    ctx.font = `bold ${5.5 * s}px sans-serif`;
    ctx.fillText('SCHOOL THIK KARO', 128 * s, 238 * s);
  } else if (info.id === 'vikas_divyakirti') {
    // Distinguished dark slate Nehru/scholarly jacket
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(80 * s, 205 * s, 96 * s, 60 * s);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(126 * s, 205 * s, 4 * s, 50 * s); // Gold button line
  } else if (info.id === 'alakh_pandey') {
    // Black PW branded tee
    ctx.fillStyle = '#18181b';
    ctx.fillRect(80 * s, 205 * s, 96 * s, 60 * s);
    ctx.fillStyle = '#ef4444';
    ctx.font = `bold ${11 * s}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('PW', 128 * s, 230 * s);
  } else if (
    info.category === 'Journalist' ||
    info.id === 'saurabh_das' ||
    info.id === 'meera_press'
  ) {
    // Press Card Lanyard
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3 * s;
    ctx.beginPath();
    ctx.moveTo(110 * s, 195 * s);
    ctx.lineTo(128 * s, 225 * s);
    ctx.lineTo(146 * s, 195 * s);
    ctx.stroke();

    // PRESS ID badge
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(116 * s, 222 * s, 24 * s, 28 * s);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(116 * s, 222 * s, 24 * s, 6 * s);
    ctx.fillStyle = '#0f172a';
    ctx.font = `bold ${5 * s}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('PRESS', 128 * s, 236 * s);
  }
  ctx.restore();

  // 3. Neck
  const skinTone = features.skinTone || '#d49b72';
  ctx.save();
  ctx.fillStyle = skinTone;
  ctx.fillRect(112 * s, 160 * s, 32 * s, 40 * s);
  // Neck shadow under chin
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(128 * s, 172 * s, 18 * s, 8 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 4. Head / Face Shape
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(128 * s, 122 * s, 48 * s, 56 * s, 0, 0, Math.PI * 2);
  const faceGrad = ctx.createLinearGradient(90 * s, 70 * s, 160 * s, 175 * s);
  faceGrad.addColorStop(0, skinTone);
  faceGrad.addColorStop(1, adjustBrightness(skinTone, -0.15));
  ctx.fillStyle = faceGrad;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 10 * s;
  ctx.fill();
  ctx.restore();

  // Ears
  ctx.save();
  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.ellipse(78 * s, 124 * s, 8 * s, 14 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(178 * s, 124 * s, 8 * s, 14 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 5. Eyes & Eyebrows
  const eyeY = 118 * s;
  ctx.save();
  // Eyebrows
  ctx.strokeStyle = features.hairColor || '#18181b';
  ctx.lineWidth = 3.5 * s;
  ctx.lineCap = 'round';
  // Left eyebrow
  ctx.beginPath();
  ctx.moveTo(102 * s, eyeY - 14 * s);
  ctx.quadraticCurveTo(112 * s, eyeY - 18 * s, 122 * s, eyeY - 14 * s);
  ctx.stroke();
  // Right eyebrow
  ctx.beginPath();
  ctx.moveTo(134 * s, eyeY - 14 * s);
  ctx.quadraticCurveTo(144 * s, eyeY - 18 * s, 154 * s, eyeY - 14 * s);
  ctx.stroke();

  // Eye Sclera (White)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(112 * s, eyeY, 9 * s, 6 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(144 * s, eyeY, 9 * s, 6 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // Iris & Pupil (Dark Brown)
  ctx.fillStyle = '#26170d';
  ctx.beginPath();
  ctx.arc(113 * s, eyeY, 4.5 * s, 0, Math.PI * 2);
  ctx.arc(143 * s, eyeY, 4.5 * s, 0, Math.PI * 2);
  ctx.fill();

  // Eye Specular Highlight
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(114.5 * s, eyeY - 1.5 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.arc(144.5 * s, eyeY - 1.5 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 6. Nose
  ctx.save();
  ctx.strokeStyle = adjustBrightness(skinTone, -0.3);
  ctx.lineWidth = 2 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(128 * s, eyeY - 2 * s);
  ctx.lineTo(126 * s, eyeY + 16 * s);
  ctx.lineTo(131 * s, eyeY + 16 * s);
  ctx.stroke();
  ctx.restore();

  // 7. Mouth & Expression
  ctx.save();
  ctx.strokeStyle = adjustBrightness(skinTone, -0.4);
  ctx.lineWidth = 2.5 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(118 * s, eyeY + 30 * s);
  ctx.quadraticCurveTo(128 * s, eyeY + 33 * s, 138 * s, eyeY + 30 * s);
  ctx.stroke();
  ctx.restore();

  // 8. Facial Hair (Beard / Stubble / Goatee)
  if (features.beard && features.beard !== 'none') {
    ctx.save();
    ctx.fillStyle = features.hairColor || '#18181b';
    if (features.beard === 'full') {
      ctx.beginPath();
      ctx.ellipse(128 * s, 148 * s, 36 * s, 26 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      // Cut out mouth area
      ctx.fillStyle = skinTone;
      ctx.beginPath();
      ctx.ellipse(128 * s, 142 * s, 16 * s, 8 * s, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (features.beard === 'trim' || features.beard === 'stubble') {
      ctx.globalAlpha = features.beard === 'trim' ? 0.6 : 0.35;
      ctx.beginPath();
      ctx.arc(128 * s, 150 * s, 30 * s, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.lineWidth = 9 * s;
      ctx.strokeStyle = features.hairColor || '#18181b';
      ctx.stroke();
      // Mustache
      ctx.lineWidth = 4 * s;
      ctx.beginPath();
      ctx.moveTo(116 * s, eyeY + 24 * s);
      ctx.lineTo(140 * s, eyeY + 24 * s);
      ctx.stroke();
    } else if (features.beard === 'goatee') {
      ctx.beginPath();
      ctx.ellipse(128 * s, 154 * s, 12 * s, 16 * s, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 9. Tricolor mark or protest tape on cheeks
  if (
    features.accessory === 'tricolor_cheek' ||
    info.id === 'aarav_student' ||
    info.id === 'tanvi_deshmukh' ||
    info.id === 'diya_mukherjee'
  ) {
    ctx.save();
    const cx = 96 * s;
    const cy = 132 * s;
    ctx.fillStyle = '#f97316';
    ctx.fillRect(cx, cy, 14 * s, 3 * s);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx, cy + 3 * s, 14 * s, 3 * s);
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(cx, cy + 6 * s, 14 * s, 3 * s);
    ctx.restore();
  }

  // 10. Hair & Iconic Headwear
  const hairColor = features.hairColor || '#18181b';
  ctx.save();
  ctx.fillStyle = hairColor;

  if (info.id === 'sonam_wangchuk' || features.accessory === 'ladakhi_cap') {
    // Iconic traditional Ladakhi Tibi wool cap with upward brim
    ctx.fillStyle = '#571f11';
    ctx.beginPath();
    ctx.ellipse(128 * s, 80 * s, 48 * s, 26 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    // Warm fur brim flap
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.ellipse(128 * s, 86 * s, 52 * s, 12 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    // Golden thread crest badge
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(128 * s, 78 * s, 5 * s, 0, Math.PI * 2);
    ctx.fill();
  } else if (features.hairStyle === 'long_tied') {
    // Hair parted and tied back
    ctx.beginPath();
    ctx.ellipse(128 * s, 86 * s, 48 * s, 24 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    // Bun / ponytail shoulder cascade
    ctx.beginPath();
    ctx.ellipse(82 * s, 130 * s, 10 * s, 30 * s, 0, 0, Math.PI * 2);
    ctx.ellipse(174 * s, 130 * s, 10 * s, 30 * s, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (features.hairStyle === 'curly') {
    // Textured curly hair (Samdish Bhatia / Dev)
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI + Math.PI;
      const hx = 128 * s + Math.cos(angle) * 44 * s;
      const hy = 96 * s + Math.sin(angle) * 36 * s;
      ctx.beginPath();
      ctx.arc(hx, hy, 14 * s, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (features.hairStyle === 'receding_silver' || info.id === 'ravish_kumar') {
    // Silver-grey hair around temples and crown
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.ellipse(86 * s, 104 * s, 14 * s, 20 * s, 0, 0, Math.PI * 2);
    ctx.ellipse(170 * s, 104 * s, 14 * s, 20 * s, 0, 0, Math.PI * 2);
    ctx.ellipse(128 * s, 84 * s, 36 * s, 14 * s, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Standard neat or parted haircut
    ctx.beginPath();
    ctx.ellipse(128 * s, 86 * s, 48 * s, 26 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    // Sideburns
    ctx.fillRect(80 * s, 95 * s, 8 * s, 28 * s);
    ctx.fillRect(168 * s, 95 * s, 8 * s, 28 * s);
  }
  ctx.restore();

  // 11. Headband / Red Protest Band
  if (features.accessory === 'red_band' || info.id === 'abhijeet_dipake') {
    ctx.save();
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(82 * s, 86 * s, 92 * s, 12 * s);
    // Protest slogan hint
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${6 * s}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('JUSTICE', 128 * s, 94 * s);
    ctx.restore();
  }

  // 12. Spectacles / Glasses
  if (features.glasses && features.glasses !== 'none') {
    ctx.save();
    if (features.glasses === 'round_wire') {
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5 * s;
      // Left rim
      ctx.beginPath();
      ctx.arc(112 * s, eyeY, 13 * s, 0, Math.PI * 2);
      ctx.stroke();
      // Right rim
      ctx.beginPath();
      ctx.arc(144 * s, eyeY, 13 * s, 0, Math.PI * 2);
      ctx.stroke();
      // Bridge
      ctx.beginPath();
      ctx.moveTo(125 * s, eyeY);
      ctx.lineTo(131 * s, eyeY);
      ctx.stroke();
    } else {
      // Rectangular or bold black frames
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 3.5 * s;
      // Left frame
      ctx.strokeRect(98 * s, eyeY - 11 * s, 26 * s, 22 * s);
      // Right frame
      ctx.strokeRect(132 * s, eyeY - 11 * s, 26 * s, 22 * s);
      // Bridge
      ctx.beginPath();
      ctx.moveTo(124 * s, eyeY);
      ctx.lineTo(132 * s, eyeY);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 13. Outer Ring Badge with Indian Tricolor Accent
  ctx.save();
  ctx.strokeStyle = info.accentColor;
  ctx.lineWidth = 4 * s;
  ctx.beginPath();
  ctx.arc(128 * s, 128 * s, 124 * s, 0, Math.PI * 2);
  ctx.stroke();

  // Category Tag on bottom
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fillRect(30 * s, 232 * s, 196 * s, 20 * s);
  ctx.fillStyle = info.accentColor;
  ctx.font = `900 ${9 * s}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(info.category.toUpperCase(), 128 * s, 245 * s);
  ctx.restore();

  const dataUrl = canvas.toDataURL('image/png');
  avatarDataUrlCache.set(info.id, dataUrl);
  return dataUrl;
}

/**
 * Returns a 3D Three.js CanvasTexture of the character's face
 * mapped to their 3D head model so players actually see their real faces in the run.
 */
export function getCharacterFaceTexture(characterId: string): THREE.CanvasTexture {
  if (avatarTextureCache.has(characterId)) {
    return avatarTextureCache.get(characterId)!;
  }

  const char = CHARACTERS.find((c) => c.id === characterId) || CHARACTERS[0];
  const features = { ...DEFAULT_FEATURES, ...(char.features || {}) };
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Face-focused texture (tight crop on eyes, nose, mouth, glasses, and expression)
    const skinTone = features.skinTone || '#d49b72';
    ctx.fillStyle = skinTone;
    ctx.fillRect(0, 0, 256, 256);

    // Cheeks & lighting
    const grad = ctx.createRadialGradient(128, 128, 30, 128, 128, 130);
    grad.addColorStop(0, skinTone);
    grad.addColorStop(1, adjustBrightness(skinTone, -0.2));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    // Eyebrows
    ctx.strokeStyle = features.hairColor || '#18181b';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(50, 75);
    ctx.lineTo(105, 75);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(151, 75);
    ctx.lineTo(206, 75);
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(80, 105, 24, 14, 0, 0, Math.PI * 2);
    ctx.ellipse(176, 105, 24, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dark pupils
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.arc(82, 105, 10, 0, Math.PI * 2);
    ctx.arc(174, 105, 10, 0, Math.PI * 2);
    ctx.fill();

    // Specular highlight
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(85, 101, 3, 0, Math.PI * 2);
    ctx.arc(177, 101, 3, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.strokeStyle = adjustBrightness(skinTone, -0.35);
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(128, 90);
    ctx.lineTo(124, 145);
    ctx.lineTo(135, 145);
    ctx.stroke();

    // Mouth / Smile
    ctx.strokeStyle = adjustBrightness(skinTone, -0.45);
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(90, 185);
    ctx.quadraticCurveTo(128, 200, 166, 185);
    ctx.stroke();

    // Facial hair
    if (features.beard && features.beard !== 'none') {
      ctx.fillStyle = features.hairColor || '#18181b';
      if (features.beard === 'full') {
        ctx.beginPath();
        ctx.ellipse(128, 205, 70, 45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = skinTone;
        ctx.beginPath();
        ctx.ellipse(128, 185, 30, 12, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.lineWidth = 7;
        ctx.strokeStyle = features.hairColor || '#18181b';
        ctx.beginPath();
        ctx.moveTo(85, 172);
        ctx.lineTo(171, 172);
        ctx.stroke();
      }
    }

    // Glasses
    if (features.glasses && features.glasses !== 'none') {
      ctx.strokeStyle = features.glasses === 'round_wire' ? '#94a3b8' : '#09090b';
      ctx.lineWidth = 7;
      if (features.glasses === 'round_wire') {
        ctx.beginPath();
        ctx.arc(80, 105, 30, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(176, 105, 30, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(110, 105);
        ctx.lineTo(146, 105);
        ctx.stroke();
      } else {
        ctx.strokeRect(48, 75, 65, 55);
        ctx.strokeRect(143, 75, 65, 55);
        ctx.beginPath();
        ctx.moveTo(113, 102);
        ctx.lineTo(143, 102);
        ctx.stroke();
      }
    }

    // Cheek tricolor
    if (
      features.accessory === 'tricolor_cheek' ||
      char.id === 'aarav_student' ||
      char.id === 'tanvi_deshmukh' ||
      char.id === 'diya_mukherjee'
    ) {
      ctx.fillStyle = '#f97316';
      ctx.fillRect(40, 140, 26, 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(40, 146, 26, 6);
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(40, 152, 26, 6);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  avatarTextureCache.set(characterId, texture);
  return texture;
}

/**
 * Returns face photo data URL for any character
 */
export function getCharacterPhotoUrl(characterId: string): string {
  const char = CHARACTERS.find((c) => c.id === characterId) || CHARACTERS[0];
  return generateCharacterAvatar(char, 256);
}

// Utility function to adjust hex color brightness
function adjustBrightness(col: string, percent: number): string {
  let num = parseInt(col.replace('#', ''), 16);
  if (isNaN(num)) return '#c68642';
  let r = (num >> 16) + Math.round(255 * percent);
  let g = ((num >> 8) & 0x00ff) + Math.round(255 * percent);
  let b = (num & 0x0000ff) + Math.round(255 * percent);
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
