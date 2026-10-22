import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  CharacterInfo,
  CollectibleType,
  PowerUpType,
  PowerUpState,
  RunStats,
  TrackTheme,
} from '../types/game';
import { CharacterSkin } from '../types/challenges';
import { soundEngine } from '../audio/soundEffects';
import { createAsphaltTexture } from './proceduralTextures';
import { createCharacter, AnimatedCharacter } from './models/characterModel';
import {
  createPoliceBarricadeLow,
  createSection144High,
  createPoliceVan,
  createRpfCheckpoint,
  createBsfHeavyCordon,
  ObstacleInstance,
} from './models/obstacleModels';
import {
  createCollectible,
  CollectibleInstance,
} from './models/collectibleModels';
import {
  createSamratYantra,
  createProtestTent,
  createCPColonnade,
  createDelhiTree,
  createStreetLamp,
} from './models/sceneryModels';

// Pre-allocated math objects to avoid GC in the render loop
const _playerBox = new THREE.Box3();
const _obsBox = new THREE.Box3();
const _tempVec3 = new THREE.Vector3();

export interface GameEngineCallbacks {
  onScoreUpdate: (score: number, distance: number) => void;
  onItemCollected: (type: CollectibleType, totalCount: number) => void;
  onPowerUpUpdate: (powerUps: Record<PowerUpType, PowerUpState>) => void;
  onGameOver: (stats: RunStats) => void;
  onFactTrigger?: (factId: string) => void;
}

export class GameEngine {
  private container: HTMLElement;
  private callbacks: GameEngineCallbacks;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private animFrameId: number | null = null;
  private clock: THREE.Clock;

  // Game state
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private hitstopTimer: number = 0;
  private cameraShake: number = 0;

  // Track & Environment
  private trackTheme: TrackTheme = 'jantar_mantar';
  private chunks: THREE.Group[] = [];
  private nextChunkZ: number = 0;
  private readonly chunkSize: number = 40;
  private readonly totalChunks: number = 7;
  private roadMaterial: THREE.MeshStandardMaterial;

  // Active entities
  private obstacles: ObstacleInstance[] = [];
  private collectibles: CollectibleInstance[] = [];

  // Player
  private characterActor: AnimatedCharacter | null = null;
  private characterInfo: CharacterInfo;
  private currentSkin?: CharacterSkin;
  private playerLane: number = 0; // -1, 0, 1
  private playerX: number = 0;
  private playerY: number = 0;
  private playerZ: number = 0;
  private playerVy: number = 0;
  private isGrounded: boolean = true;
  private isSliding: boolean = false;
  private slideTimer: number = 0;
  private baseSpeed: number = 18; // units per second
  private currentSpeed: number = 18;

  // Stats
  private distance: number = 0;
  private score: number = 0;
  private examPapersCount: number = 0;
  private constitutionsCount: number = 0;
  private votesCount: number = 0;
  private rtisCount: number = 0;

  // Power-ups
  private powerUps: Record<PowerUpType, PowerUpState> = {
    hoverboard: { type: 'hoverboard', duration: 15, timeLeft: 0, active: false },
    super_boots: { type: 'super_boots', duration: 12, timeLeft: 0, active: false },
    magnet: { type: 'magnet', duration: 12, timeLeft: 0, active: false },
    double_score: { type: 'double_score', duration: 12, timeLeft: 0, active: false },
    shield: { type: 'shield', duration: 10, timeLeft: 0, active: false },
  };

  // Keyboard and touch listeners
  private keydownHandler: (e: KeyboardEvent) => void;
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private touchStartTime: number = 0;
  private touchHandlerStart: (e: TouchEvent) => void;
  private touchHandlerEnd: (e: TouchEvent) => void;

  constructor(
    container: HTMLElement,
    character: CharacterInfo,
    theme: TrackTheme,
    callbacks: GameEngineCallbacks,
    skin?: CharacterSkin
  ) {
    this.container = container;
    this.characterInfo = character;
    this.currentSkin = skin;
    this.trackTheme = theme;
    this.callbacks = callbacks;
    this.clock = new THREE.Clock();

    // Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(theme === 'jantar_mantar' ? '#cbd5e1' : '#e2e8f0');
    this.scene.fog = new THREE.Fog(
      theme === 'jantar_mantar' ? '#cbd5e1' : '#e2e8f0',
      45,
      140
    );

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 300);
    this.camera.position.set(0, 4.2, -6.5);
    this.camera.lookAt(0, 1.8, 12);

    // Renderer
    const isHeadless =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = !isHeadless;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // PMREM Environment Map
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting
    this.setupLighting();

    // Shared Road Material
    const asphaltTex = createAsphaltTexture();
    this.roadMaterial = new THREE.MeshStandardMaterial({
      map: asphaltTex,
      roughness: 0.8,
      metalness: 0.1,
    });

    // Spawn Player
    this.characterActor = createCharacter(character, skin);
    this.scene.add(this.characterActor.group);

    // Build initial track chunks
    for (let i = 0; i < this.totalChunks; i++) {
      this.spawnTrackChunk(i === 0);
    }

    // Input handlers
    this.keydownHandler = (e: KeyboardEvent) => this.handleKeyDown(e);
    window.addEventListener('keydown', this.keydownHandler);

    this.touchHandlerStart = (e: TouchEvent) => this.handleTouchStart(e);
    this.touchHandlerEnd = (e: TouchEvent) => this.handleTouchEnd(e);
    window.addEventListener('touchstart', this.touchHandlerStart, { passive: true });
    window.addEventListener('touchend', this.touchHandlerEnd, { passive: true });

    // Handle Window Resize
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  private setupLighting() {
    // Warm Sun Directional Light
    const sunLight = new THREE.DirectionalLight('#fffbeb', 1.8);
    sunLight.position.set(20, 35, 15);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 80;
    sunLight.shadow.camera.left = -15;
    sunLight.shadow.camera.right = 15;
    sunLight.shadow.camera.top = 25;
    sunLight.shadow.camera.bottom = -10;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;
    this.scene.add(sunLight);

    // Cool Hemisphere Fill Light
    const hemiLight = new THREE.HemisphereLight('#38bdf8', '#ea580c', 0.9);
    this.scene.add(hemiLight);

    // Ambient light
    const ambLight = new THREE.AmbientLight('#ffffff', 0.4);
    this.scene.add(ambLight);
  }

  public setCharacter(character: CharacterInfo, skin?: CharacterSkin) {
    this.characterInfo = character;
    if (skin !== undefined) {
      this.currentSkin = skin;
    }
    if (this.characterActor) {
      this.scene.remove(this.characterActor.group);
    }
    this.characterActor = createCharacter(character, this.currentSkin);
    this.characterActor.group.position.set(this.playerX, this.playerY, this.playerZ);
    this.scene.add(this.characterActor.group);
  }

  public setSkin(skin: CharacterSkin) {
    this.currentSkin = skin;
    if (this.characterActor) {
      this.scene.remove(this.characterActor.group);
      this.characterActor = createCharacter(this.characterInfo, skin);
      this.characterActor.group.position.set(this.playerX, this.playerY, this.playerZ);
      this.scene.add(this.characterActor.group);
    }
  }

  public setTrackTheme(theme: TrackTheme) {
    this.trackTheme = theme;
    this.scene.background = new THREE.Color(theme === 'jantar_mantar' ? '#cbd5e1' : '#e2e8f0');
    this.scene.fog = new THREE.Fog(
      theme === 'jantar_mantar' ? '#cbd5e1' : '#e2e8f0',
      45,
      140
    );
  }

  /**
   * Spawns a 40m track segment along Z with asphalt, sidewalks, landmarks, obstacles, and items.
   */
  private spawnTrackChunk(isFirstChunk: boolean) {
    const chunkGroup = new THREE.Group();
    const chunkZ = this.nextChunkZ;
    chunkGroup.position.z = chunkZ;

    // Road surface (3 lanes, total width 10.5m)
    const roadGeo = new THREE.PlaneGeometry(10.5, this.chunkSize);
    roadGeo.rotateX(-Math.PI / 2);
    const roadMesh = new THREE.Mesh(roadGeo, this.roadMaterial);
    roadMesh.receiveShadow = true;
    chunkGroup.add(roadMesh);

    // Sidewalks on Left & Right
    const curbGeo = new THREE.BoxGeometry(4.0, 0.35, this.chunkSize);
    const curbMat = new THREE.MeshStandardMaterial({
      color: this.trackTheme === 'jantar_mantar' ? '#b45309' : '#94a3b8',
      roughness: 0.8,
    });

    const leftCurb = new THREE.Mesh(curbGeo, curbMat);
    leftCurb.position.set(-7.25, 0.175, 0);
    leftCurb.receiveShadow = true;
    chunkGroup.add(leftCurb);

    const rightCurb = new THREE.Mesh(curbGeo, curbMat);
    rightCurb.position.set(7.25, 0.175, 0);
    rightCurb.receiveShadow = true;
    chunkGroup.add(rightCurb);

    // Environmental Landmark scenery placement
    if (this.trackTheme === 'jantar_mantar') {
      // Protest tent on one side
      const tentSlogans = [
        ['JUSTICE FOR NEET ASPIRANTS', 'MERIT & TRANSPARENCY NOW'],
        ['ARTICLE 19: RIGHT TO ASSEMBLE', 'CONSTITUTIONAL CITIZEN VOICE'],
        ['NO TO EXAM LEAKS', 'SAFEGUARD STUDENT DREAMS'],
        ['WE DEMAND REFORMS', 'ACCOUNTABILITY & CBI PROBE'],
        ['PUBLIC EXAMS INTEGRITY', 'SAVE DEMOCRATIC MERIT'],
      ];
      const slogan = tentSlogans[Math.floor(Math.random() * tentSlogans.length)];
      const tent = createProtestTent(slogan[0], slogan[1]);
      tent.position.set(-8.5, 0.35, 10);
      chunkGroup.add(tent);

      // Samrat Yantra monumental gnomon on the right every other chunk
      if (Math.random() > 0.4) {
        const samrat = createSamratYantra();
        samrat.position.set(12.0, 0.35, 0);
        samrat.scale.set(0.65, 0.65, 0.65);
        chunkGroup.add(samrat);
      }

      // Green trees & Sansad Marg streetlamps
      const tree = createDelhiTree();
      tree.position.set(8.5, 0.35, -12);
      chunkGroup.add(tree);

      const lamp = createStreetLamp();
      lamp.position.set(-5.6, 0.35, -5);
      chunkGroup.add(lamp);
    } else {
      // Connaught Place Georgian Colonnade
      const cpColonnadeLeft = createCPColonnade();
      cpColonnadeLeft.position.set(-10.0, 0.35, 0);
      chunkGroup.add(cpColonnadeLeft);

      const cpColonnadeRight = createCPColonnade();
      cpColonnadeRight.position.set(10.0, 0.35, 0);
      cpColonnadeRight.rotation.y = Math.PI;
      chunkGroup.add(cpColonnadeRight);

      const lamp = createStreetLamp();
      lamp.position.set(-5.6, 0.35, 12);
      chunkGroup.add(lamp);
    }

    this.scene.add(chunkGroup);
    this.chunks.push(chunkGroup);

    // Don't spawn obstacles on the very first starting chunk so player starts safely
    if (!isFirstChunk) {
      this.populateChunkGameplay(chunkZ);
    }

    this.nextChunkZ += this.chunkSize;
  }

  /**
   * Spawns obstacles, collectibles, and power-ups in fair rhythmic Subway Surfers cadence
   */
  private populateChunkGameplay(chunkZ: number) {
    const lanes = [-1, 0, 1];
    // Pick 1 or 2 obstacle positions in this chunk
    const zOffsets = [-10, 10];

    zOffsets.forEach((offsetZ) => {
      const zPos = chunkZ + offsetZ;
      const occupiedLanes = new Set<number>();

      // Decide obstacle count for this hurdle line (1 or 2 lanes blocked, never all 3)
      const numObstacles = Math.random() < 0.65 ? 1 : 2;
      const shuffledLanes = [...lanes].sort(() => Math.random() - 0.5);

      for (let i = 0; i < numObstacles; i++) {
        const lane = shuffledLanes[i];
        occupiedLanes.add(lane);

        // Pick obstacle type
        const roll = Math.random();
        let obs: ObstacleInstance;

        if (roll < 0.35) {
          obs = createPoliceBarricadeLow();
        } else if (roll < 0.6) {
          obs = createSection144High();
        } else if (roll < 0.8) {
          obs = createPoliceVan();
        } else if (roll < 0.92) {
          obs = createRpfCheckpoint();
        } else {
          obs = createBsfHeavyCordon();
        }

        obs.lane = lane;
        obs.z = zPos;
        obs.group.position.set(lane * 3.2, 0, zPos);
        this.scene.add(obs.group);
        this.obstacles.push(obs);

        // If low barricade or checkpoint, place an airborne collectible on top of it to encourage jumping!
        if (obs.dodgeType === 'jump' && Math.random() < 0.7) {
          const itemType: CollectibleType = Math.random() < 0.5 ? 'exam_paper' : 'constitution';
          const item = createCollectible(itemType, lane, zPos, 2.4);
          this.scene.add(item.group);
          this.collectibles.push(item);
        }
      }

      // In the free lane(s), spawn collectible arcs (papers, votes, constitutions, or powerups)
      lanes.forEach((freeLane) => {
        if (!occupiedLanes.has(freeLane)) {
          // Check if power-up spawn
          const spawnPowerUpRoll = Math.random();
          if (spawnPowerUpRoll < 0.08) {
            const powerUpList: PowerUpType[] = [
              'hoverboard',
              'super_boots',
              'magnet',
              'double_score',
              'shield',
            ];
            const pType = powerUpList[Math.floor(Math.random() * powerUpList.length)];
            const powerUpItem = createCollectible(pType, freeLane, zPos, 1.2);
            this.scene.add(powerUpItem.group);
            this.collectibles.push(powerUpItem);
          } else {
            // Spawn a rhythmic trail of 3 collectibles in this lane
            const collectibleTypes: CollectibleType[] = [
              'exam_paper',
              'vote',
              'constitution',
              'rti_query',
            ];
            const chosenType =
              collectibleTypes[Math.floor(Math.random() * collectibleTypes.length)];

            for (let k = -2; k <= 2; k += 2) {
              const item = createCollectible(chosenType, freeLane, zPos + k, 1.0);
              this.scene.add(item.group);
              this.collectibles.push(item);
            }
          }
        }
      });
    });
  }

  public start() {
    this.isRunning = true;
    this.isPaused = false;
    this.clock.start();
    soundEngine.startBGM();
    this.loop();
  }

  public pause() {
    this.isPaused = true;
    soundEngine.stopBGM();
  }

  public resume() {
    this.isPaused = false;
    this.clock.start();
    soundEngine.startBGM();
    this.loop();
  }

  public activateHoverboardManual() {
    this.powerUps.hoverboard.active = true;
    this.powerUps.hoverboard.timeLeft = this.powerUps.hoverboard.duration;
    soundEngine.playPowerUp();
    if (this.characterActor) {
      this.characterActor.setHoverboardVisible(true);
    }
    this.callbacks.onPowerUpUpdate({ ...this.powerUps });
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (!this.isRunning || this.isPaused) return;

    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      this.shiftLane(-1);
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      this.shiftLane(1);
    } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      this.jump();
    } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      this.slide();
    } else if (e.code === 'Space') {
      // Activate hoverboard
      this.activateHoverboardManual();
    }
  }

  private handleTouchStart(e: TouchEvent) {
    if (!this.isRunning || this.isPaused || e.touches.length === 0) return;
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.touchStartTime = performance.now();
  }

  private handleTouchEnd(e: TouchEvent) {
    if (!this.isRunning || this.isPaused || e.changedTouches.length === 0) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const dt = performance.now() - this.touchStartTime;

    const dx = endX - this.touchStartX;
    const dy = endY - this.touchStartY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    // Minimum swipe threshold
    if (Math.max(absX, absY) < 25) {
      // Tap / double tap could trigger hoverboard
      if (dt < 250) {
        this.activateHoverboardManual();
      }
      return;
    }

    if (absX > absY) {
      if (dx > 0) {
        this.shiftLane(1);
      } else {
        this.shiftLane(-1);
      }
    } else {
      if (dy > 0) {
        this.slide();
      } else {
        this.jump();
      }
    }
  }

  public shiftLane(direction: number) {
    const newLane = this.playerLane + direction;
    if (newLane >= -1 && newLane <= 1) {
      this.playerLane = newLane;
      soundEngine.playWhoosh();
    }
  }

  public jump() {
    if (this.isGrounded) {
      const jumpVel = this.powerUps.super_boots.active ? 22 : 16.5;
      this.playerVy = jumpVel;
      this.isGrounded = false;
      this.isSliding = false;
      soundEngine.playJump();
    }
  }

  public slide() {
    // If airborne, slam down immediately
    if (!this.isGrounded) {
      this.playerVy = -32;
    }
    this.isSliding = true;
    this.slideTimer = 0.75;
    soundEngine.playSlide();
  }

  private loop() {
    if (!this.isRunning || this.isPaused) return;

    this.animFrameId = requestAnimationFrame(() => this.loop());

    const rawDt = this.clock.getDelta();
    // Clamp frame delta time to prevent simulation explosion on tab unfocus
    const dt = Math.min(rawDt, 0.05);

    // Hitstop freeze handling
    if (this.hitstopTimer > 0) {
      this.hitstopTimer -= dt;
      this.renderer.render(this.scene, this.camera);
      return;
    }

    this.update(dt);
    this.renderer.render(this.scene, this.camera);
  }

  private update(dt: number) {
    const time = this.clock.getElapsedTime();

    // Gradually ramp speed over distance (Subway Surfers difficulty ramp)
    this.currentSpeed = Math.min(34, this.baseSpeed + (this.distance / 120) * 1.5);

    // Advance forward
    const forwardStep = this.currentSpeed * dt;
    this.playerZ += forwardStep;
    this.distance += forwardStep;

    // Score accumulation
    const scoreMultiplier =
      (this.powerUps.double_score.active ? 2 : 1) *
      (this.characterInfo.perkMultiplier.scoreMultiplier || 1);
    this.score += forwardStep * 1.5 * scoreMultiplier;
    this.callbacks.onScoreUpdate(Math.floor(this.score), Math.floor(this.distance));

    // Smooth horizontal lane transition (exponential damping)
    const targetX = this.playerLane * 3.2;
    this.playerX = THREE.MathUtils.damp(this.playerX, targetX, 15, dt);

    // Jump & Gravity physics
    if (!this.isGrounded) {
      this.playerVy -= 38 * dt; // gravity
      this.playerY += this.playerVy * dt;
      if (this.playerY <= 0) {
        this.playerY = 0;
        this.playerVy = 0;
        this.isGrounded = true;
      }
    }

    // Slide timer
    if (this.isSliding) {
      this.slideTimer -= dt;
      if (this.slideTimer <= 0) {
        this.isSliding = false;
      }
    }

    // Update Player Actor position & procedural animation
    if (this.characterActor) {
      this.characterActor.group.position.set(this.playerX, this.playerY, this.playerZ);
      this.characterActor.updateAnimation(
        time,
        this.isGrounded,
        this.isSliding,
        this.powerUps.hoverboard.active,
        this.currentSpeed
      );
    }

    // Camera follow with smooth damping & shake
    let shakeOffsetX = 0;
    let shakeOffsetY = 0;
    if (this.cameraShake > 0) {
      this.cameraShake -= dt * 3.5;
      shakeOffsetX = (Math.random() - 0.5) * this.cameraShake * 0.4;
      shakeOffsetY = (Math.random() - 0.5) * this.cameraShake * 0.4;
    }

    const camTargetX = this.playerX * 0.4 + shakeOffsetX;
    const camTargetY = 4.2 + (this.playerY > 0 ? this.playerY * 0.4 : 0) + shakeOffsetY;
    const camTargetZ = this.playerZ - 6.8;

    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, camTargetX, 12, dt);
    this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, camTargetY, 12, dt);
    this.camera.position.z = camTargetZ;
    this.camera.lookAt(this.playerX * 0.7, 1.8 + this.playerY * 0.3, this.playerZ + 12);

    // Update active power-ups
    this.updatePowerUps(dt);

    // Update obstacles
    this.updateObstacles(dt, time);

    // Update collectibles & magnet attraction
    this.updateCollectibles(dt, time);

    // Recycle track chunks
    this.recycleChunks();

    // Check collisions
    this.checkCollisions();
  }

  private updatePowerUps(dt: number) {
    let changed = false;

    for (const key of Object.keys(this.powerUps) as PowerUpType[]) {
      const p = this.powerUps[key];
      if (p.active) {
        p.timeLeft -= dt;
        changed = true;
        if (p.timeLeft <= 0) {
          p.active = false;
          p.timeLeft = 0;
          if (p.type === 'hoverboard' && this.characterActor) {
            this.characterActor.setHoverboardVisible(false);
          }
          if (p.type === 'shield' && this.characterActor) {
            this.characterActor.setShieldVisible(false);
          }
        }
      }
    }

    if (changed) {
      this.callbacks.onPowerUpUpdate({ ...this.powerUps });
    }
  }

  private updateObstacles(dt: number, time: number) {
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      if (obs.update) {
        obs.update(dt, time);
      }
      // Clean up past obstacles
      if (obs.z < this.playerZ - 20) {
        this.scene.remove(obs.group);
        this.obstacles.splice(i, 1);
      }
    }
  }

  private updateCollectibles(dt: number, time: number) {
    const magnetActive = this.powerUps.magnet.active;
    const baseMagnetRange = 14;
    const magnetRange =
      baseMagnetRange * (this.characterInfo.perkMultiplier.magnetRangeBonus || 1);

    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const item = this.collectibles[i];
      if (item.collected) continue;

      item.update(dt, time);

      // Magnet physics
      const distToPlayer = Math.hypot(
        item.group.position.x - this.playerX,
        item.group.position.z - this.playerZ
      );

      if (magnetActive && distToPlayer < magnetRange && !item.isPowerUp) {
        // Smoothly suck toward player
        item.group.position.x = THREE.MathUtils.damp(
          item.group.position.x,
          this.playerX,
          10,
          dt
        );
        item.group.position.z = THREE.MathUtils.damp(
          item.group.position.z,
          this.playerZ,
          10,
          dt
        );
        item.group.position.y = THREE.MathUtils.damp(
          item.group.position.y,
          this.playerY + 1.0,
          10,
          dt
        );
      }

      // Check pickup overlap
      const closeZ = Math.abs(item.group.position.z - this.playerZ);
      const closeX = Math.abs(item.group.position.x - this.playerX);
      const closeY = Math.abs(item.group.position.y - (this.playerY + 1.0));

      if (closeZ < 1.3 && closeX < 1.3 && closeY < 1.8) {
        this.collectItem(item);
        this.scene.remove(item.group);
        this.collectibles.splice(i, 1);
        continue;
      }

      // Remove items passed far behind
      if (item.z < this.playerZ - 20) {
        this.scene.remove(item.group);
        this.collectibles.splice(i, 1);
      }
    }
  }

  private collectItem(item: CollectibleInstance) {
    item.collected = true;

    if (item.isPowerUp) {
      const pType = item.type as PowerUpType;
      this.activatePowerUp(pType);
      soundEngine.playPowerUp();
      return;
    }

    const cType = item.type as CollectibleType;
    let pointVal = 10;

    if (cType === 'exam_paper') {
      const bonus = this.characterInfo.perkMultiplier.paperBonus || 1.0;
      pointVal = Math.floor(10 * bonus);
      this.examPapersCount++;
      this.callbacks.onItemCollected('exam_paper', this.examPapersCount);
    } else if (cType === 'constitution') {
      pointVal = 30;
      this.constitutionsCount++;
      this.callbacks.onItemCollected('constitution', this.constitutionsCount);
    } else if (cType === 'vote') {
      pointVal = 15;
      this.votesCount++;
      this.callbacks.onItemCollected('vote', this.votesCount);
    } else if (cType === 'rti_query') {
      pointVal = 25;
      this.rtisCount++;
      this.callbacks.onItemCollected('rti_query', this.rtisCount);
    }

    const multiplier =
      (this.powerUps.double_score.active ? 2 : 1) *
      (this.characterInfo.perkMultiplier.scoreMultiplier || 1);
    this.score += pointVal * multiplier;
    soundEngine.playCollect(cType);
  }

  private activatePowerUp(type: PowerUpType) {
    let dur = this.powerUps[type].duration;
    if (type === 'shield' && this.characterInfo.perkMultiplier.shieldDurationBonus) {
      dur *= this.characterInfo.perkMultiplier.shieldDurationBonus;
    }
    this.powerUps[type].active = true;
    this.powerUps[type].timeLeft = dur;

    if (type === 'hoverboard' && this.characterActor) {
      this.characterActor.setHoverboardVisible(true);
    }
    if (type === 'shield' && this.characterActor) {
      this.characterActor.setShieldVisible(true);
    }

    this.callbacks.onPowerUpUpdate({ ...this.powerUps });
  }

  private recycleChunks() {
    // If the oldest chunk is far behind player, move it to the front
    const oldestChunk = this.chunks[0];
    if (oldestChunk && oldestChunk.position.z + this.chunkSize < this.playerZ - 10) {
      this.scene.remove(oldestChunk);
      this.chunks.shift();

      // Spawn new chunk at nextChunkZ
      this.spawnTrackChunk(false);
    }
  }

  private checkCollisions() {
    // Player bounding box calculation
    const playerHalfWidth = 0.55;
    const playerMinY = this.playerY;
    const playerMaxY = this.playerY + (this.isSliding ? 0.85 : 1.9);

    _playerBox.min.set(
      this.playerX - playerHalfWidth,
      playerMinY,
      this.playerZ - 0.4
    );
    _playerBox.max.set(
      this.playerX + playerHalfWidth,
      playerMaxY,
      this.playerZ + 0.4
    );

    for (let i = 0; i < this.obstacles.length; i++) {
      const obs = this.obstacles[i];
      // Only check obstacles in close range
      if (Math.abs(obs.z - this.playerZ) > 2.0) continue;

      _obsBox.copy(obs.box);
      _obsBox.translate(_tempVec3.set(obs.lane * 3.2, 0, obs.z));

      if (_playerBox.intersectsBox(_obsBox)) {
        // Fair mechanics check
        if (obs.dodgeType === 'jump') {
          // If player jumped high enough, no crash!
          if (this.playerY > 1.1) continue;
        } else if (obs.dodgeType === 'slide') {
          // If player is sliding and low, safe!
          if (this.isSliding && this.playerY < 0.35) continue;
        }

        // Collision confirmed!
        this.handleCrash(obs);
        break;
      }
    }
  }

  private handleCrash(obs: ObstacleInstance) {
    // If Shield is active, consume shield and survive!
    if (this.powerUps.shield.active) {
      this.powerUps.shield.active = false;
      this.powerUps.shield.timeLeft = 0;
      if (this.characterActor) this.characterActor.setShieldVisible(false);
      this.cameraShake = 0.6;
      soundEngine.playShieldDeflect();
      // Remove this obstacle so player can pass
      this.scene.remove(obs.group);
      this.obstacles = this.obstacles.filter((o) => o !== obs);
      this.callbacks.onPowerUpUpdate({ ...this.powerUps });
      return;
    }

    // If Hoverboard is active, consume board and survive!
    if (this.powerUps.hoverboard.active) {
      this.powerUps.hoverboard.active = false;
      this.powerUps.hoverboard.timeLeft = 0;
      if (this.characterActor) this.characterActor.setHoverboardVisible(false);
      this.cameraShake = 0.8;
      soundEngine.playShieldDeflect();
      this.scene.remove(obs.group);
      this.obstacles = this.obstacles.filter((o) => o !== obs);
      this.callbacks.onPowerUpUpdate({ ...this.powerUps });
      return;
    }

    // Lethal crash: Hitstop 80ms, crash sound, camera shake, Game Over
    this.hitstopTimer = 0.08;
    this.cameraShake = 1.2;
    soundEngine.playCrash();
    soundEngine.playGameOver();
    soundEngine.stopBGM();

    this.isRunning = false;

    // Report final run stats
    const stats: RunStats = {
      score: Math.floor(this.score),
      distance: Math.floor(this.distance),
      examPapers: this.examPapersCount,
      constitutions: this.constitutionsCount,
      votes: this.votesCount,
      rtis: this.rtisCount,
      highScore: Math.floor(this.score),
      causeSupported:
        this.trackTheme === 'jantar_mantar'
          ? 'NEET & Exam Transparency at Jantar Mantar'
          : 'Civic Democracy & Public Accountability at CP',
    };

    setTimeout(() => {
      this.callbacks.onGameOver(stats);
    }, 450);
  }

  public reset() {
    // Clean up entities
    this.obstacles.forEach((o) => this.scene.remove(o.group));
    this.obstacles = [];

    this.collectibles.forEach((c) => this.scene.remove(c.group));
    this.collectibles = [];

    this.chunks.forEach((ch) => this.scene.remove(ch));
    this.chunks = [];

    // Reset player position & kinematics
    this.playerLane = 0;
    this.playerX = 0;
    this.playerY = 0;
    this.playerZ = 0;
    this.playerVy = 0;
    this.isGrounded = true;
    this.isSliding = false;
    this.slideTimer = 0;
    this.currentSpeed = this.baseSpeed;
    this.distance = 0;
    this.score = 0;
    this.examPapersCount = 0;
    this.constitutionsCount = 0;
    this.votesCount = 0;
    this.rtisCount = 0;
    this.nextChunkZ = 0;

    // Reset power-ups
    for (const key of Object.keys(this.powerUps) as PowerUpType[]) {
      this.powerUps[key].active = false;
      this.powerUps[key].timeLeft = 0;
    }
    if (this.characterActor) {
      this.characterActor.setHoverboardVisible(false);
      this.characterActor.setShieldVisible(false);
      this.characterActor.group.position.set(0, 0, 0);
    }

    // Rebuild track
    for (let i = 0; i < this.totalChunks; i++) {
      this.spawnTrackChunk(i === 0);
    }

    this.camera.position.set(0, 4.2, -6.5);
    this.camera.lookAt(0, 1.8, 12);
  }

  private handleResize() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public dispose() {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    soundEngine.stopBGM();
    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('touchstart', this.touchHandlerStart);
    window.removeEventListener('touchend', this.touchHandlerEnd);
    window.removeEventListener('resize', this.handleResize);

    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
