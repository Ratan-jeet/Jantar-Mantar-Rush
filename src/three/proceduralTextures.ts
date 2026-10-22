import * as THREE from 'three';

/**
 * Procedural canvas textures with SRGBColorSpace and maximum anisotropy.
 * Zero external image dependencies.
 */

export function createAsphaltTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Dark asphalt base
  ctx.fillStyle = '#22252a';
  ctx.fillRect(0, 0, 512, 512);

  // Gravel flecks
  for (let i = 0; i < 2500; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const size = Math.random() * 2 + 1;
    const shade = Math.floor(Math.random() * 50 + 40);
    ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
    ctx.fillRect(x, y, size, size);
  }

  // Dash lane lines
  ctx.fillStyle = '#e2b024';
  ctx.fillRect(166, 60, 12, 140);
  ctx.fillRect(166, 320, 12, 140);
  ctx.fillRect(334, 60, 12, 140);
  ctx.fillRect(334, 320, 12, 140);

  // White edge lines
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(8, 0, 8, 512);
  ctx.fillRect(496, 0, 8, 512);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 4);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createPoliceBarricadeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // High-visibility Delhi Police Yellow
  ctx.fillStyle = '#ffcc00';
  ctx.fillRect(0, 0, 512, 256);

  // Black hazard stripes on edges
  ctx.fillStyle = '#111827';
  const stripeWidth = 24;
  for (let x = -256; x < 512; x += stripeWidth * 2) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + stripeWidth, 0);
    ctx.lineTo(x + stripeWidth + 60, 60);
    ctx.lineTo(x + 60, 60);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, 196);
    ctx.lineTo(x + stripeWidth, 196);
    ctx.lineTo(x + stripeWidth + 60, 256);
    ctx.lineTo(x + 60, 256);
    ctx.closePath();
    ctx.fill();
  }

  // Central white-bordered plate
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(30, 70, 452, 116);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(34, 74, 444, 108);

  // Stenciled Text: DELHI POLICE
  ctx.fillStyle = '#fbbf24';
  ctx.font = '900 44px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('DELHI POLICE', 256, 114);

  // Subtext
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px Arial, sans-serif';
  ctx.fillText('SECURITY CORDON · JANTAR MANTAR', 256, 154);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createSection144Texture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 0, 512, 256);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(12, 12, 488, 232);

  ctx.fillStyle = '#b91c1c';
  ctx.font = '900 40px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SECTION 144 CrPC', 256, 68);

  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.fillText('RESTRICTED PASSAGE', 256, 120);

  ctx.fillStyle = '#475569';
  ctx.font = '18px Arial, sans-serif';
  ctx.fillText('SLIDE UNDER OR SWITCH LANE', 256, 168);
  ctx.fillText('CIVIC DEMOCRACY CORRIDOR', 256, 204);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createConstitutionTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 340;
  const ctx = canvas.getContext('2d')!;

  // Deep majestic blue leather
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 256, 340);

  // Ornate Gold border
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 6;
  ctx.strokeRect(12, 12, 232, 316);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.strokeRect(18, 18, 220, 304);

  // Gold emblem circle (Ashok Chakra motif)
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(128, 120, 42, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(128, 120, 34, 0, Math.PI * 2);
  ctx.fill();

  // 24 Spokes in emblem
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  for (let i = 0; i < 24; i++) {
    const angle = (i * Math.PI) / 12;
    ctx.beginPath();
    ctx.moveTo(128, 120);
    ctx.lineTo(128 + Math.cos(angle) * 34, 120 + Math.sin(angle) * 34);
    ctx.stroke();
  }

  // Text
  ctx.fillStyle = '#fbbf24';
  ctx.font = '900 20px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('CONSTITUTION', 128, 204);
  ctx.fillText('OF INDIA', 128, 230);

  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 15px Georgia, serif';
  ctx.fillText('SAMVIDHAN · ART 19', 128, 268);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createExamPaperTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 340;
  const ctx = canvas.getContext('2d')!;

  // Crisp paper white
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 256, 340);

  // Blue ruled lines
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  for (let y = 60; y < 320; y += 18) {
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(236, y);
    ctx.stroke();
  }

  // Margin red line
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(45, 10);
  ctx.lineTo(45, 330);
  ctx.stroke();

  // Header
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 16px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('NEET-UG / NTA EXAM', 135, 34);

  // Stamp: "CONFIDENTIAL / MERIT FIRST"
  ctx.save();
  ctx.translate(130, 180);
  ctx.rotate(-0.25);
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 3;
  ctx.strokeRect(-80, -22, 160, 44);
  ctx.fillStyle = '#dc2626';
  ctx.font = '900 16px Arial, sans-serif';
  ctx.fillText('LEAK-FREE MERIT', 0, 4);
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createVoteBallotTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 240, 240);

  // Ballot emblem
  ctx.fillStyle = '#1d4ed8';
  ctx.font = '900 24px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DEMOCRATIC', 128, 60);
  ctx.fillText('VOTE', 128, 90);

  // Inked finger symbol or checkmark
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(128, 150, 36, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(112, 150);
  ctx.lineTo(124, 164);
  ctx.lineTo(146, 136);
  ctx.stroke();

  ctx.fillStyle = '#475569';
  ctx.font = 'bold 15px Arial, sans-serif';
  ctx.fillText('PEOPLE\'S MANDATE', 128, 218);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createSandstoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Delhi Jantar Mantar red sandstone
  ctx.fillStyle = '#a4422f';
  ctx.fillRect(0, 0, 256, 256);

  // Grain & stone blocks
  ctx.strokeStyle = '#7c2d12';
  ctx.lineWidth = 2;
  for (let y = 0; y < 256; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();

    const offset = (y % 64 === 0) ? 0 : 32;
    for (let x = offset; x < 256; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 32);
      ctx.stroke();
    }
  }

  // Subtle sandstone noise
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    ctx.fillStyle = Math.random() > 0.5 ? '#b94c37' : '#8e3523';
    ctx.fillRect(x, y, 2, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createBannerTexture(text: string, subtext: string = ''): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 128);

  // Tricolor stripe on top and bottom
  ctx.fillStyle = '#ff9933'; // Saffron
  ctx.fillRect(0, 0, 512, 10);
  ctx.fillStyle = '#138808'; // Green
  ctx.fillRect(0, 118, 512, 10);

  // Slogan
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 28px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 52);

  if (subtext) {
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 16px Arial, sans-serif';
    ctx.fillText(subtext, 256, 88);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
