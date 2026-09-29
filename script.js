/**
 * ✨ 3D MAGICAL BIRTHDAY EXPERIENCE FOR RIYA (TASU) - JAVASCRIPT ENGINE ✨
 * 
 * Features:
 * 1. Live 3D Flying Butterflies (WebGL + Viewport DOM overlay with gesture follow & touch attraction)
 * 2. Responsive Three.js 3D World (Balloons, Clouds, Starfield, Moon, Butterflies)
 * 3. 4-Scene Streamlined Storyboard with Camera Flight Transitions
 * 4. Mobile Touch Swipe Navigation (Swipe left/right to change scenes)
 * 5. Web Audio API Music Box Lullaby & Interactive Sound Effects
 * 6. Interactive 3D Envelope, Birthday Cake Candle Blowout & Personalization for Riya (Tasu)
 */

(function () {
  'use strict';

  // Application State
  const state = {
    currentSceneIndex: 0,
    recipientName: 'Riya (Tasu)',
    senderName: 'Forever Cheering For You, Tasu! 💖',
    customMessage1: 'Happy Birthday to the most wonderful, bright, and loving person! Your presence brings so much warmth, laughter, and happiness wherever you go.',
    customMessage2: 'May this year bless you with limitless smiles, blooming success in everything you do, good health, and moments as sweet as honey! Always keep shining your brightest.',
    soundEnabled: false,
    reducedMotion: false,
    parallaxEnabled: true,
    candleBlown: false
  };

  const scenes = ['scene-opening', 'scene-birthday', 'scene-card', 'scene-finale'];

  // =========================================================================
  // 1. THREE.JS 3D WEBGL SYSTEM
  // =========================================================================
  const canvas = document.getElementById('webglCanvas');
  let renderer, scene, camera;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0, screenX: window.innerWidth / 2, screenY: window.innerHeight / 2 };
  let raycaster, rayMouse;

  // 3D Object Collections
  const clouds3D = [];
  const balloons3D = [];
  const butterflies3D = [];
  let starField3D, moon3D;
  let ambientLight, directionalLight, pointLight;

  const baseCameraDestinations = [
    { x: 0, y: 5, z: 24, rotX: -0.05, rotY: 0 },   // Scene 0: Opening Sky
    { x: 0, y: 0, z: 20, rotX: 0, rotY: 0 },       // Scene 1: Birthday Celebration
    { x: 0, y: -2, z: 17, rotX: 0.05, rotY: 0 },   // Scene 2: Envelope & Letter
    { x: 0, y: 8, z: 23, rotX: -0.25, rotY: 0 }    // Scene 3: Starlight Finale
  ];

  function getResponsiveZOffset() {
    const isPortrait = window.innerHeight > window.innerWidth;
    if (isPortrait) {
      return window.innerWidth < 400 ? 6 : 4;
    }
    return 0;
  }

  function initThreeScene() {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xfce7f3, 0.015);

    const aspect = window.innerWidth / window.innerHeight;
    const fov = aspect < 1 ? 68 : 60;

    camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
    const zOffset = getResponsiveZOffset();
    camera.position.set(0, 5, 24 + zOffset);

    raycaster = new THREE.Raycaster();
    rayMouse = new THREE.Vector2();

    // Lighting setup
    ambientLight = new THREE.AmbientLight(0xfff0f5, 0.9);
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffeedd, 1.2);
    directionalLight.position.set(15, 25, 20);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    pointLight = new THREE.PointLight(0xf472b6, 1.5, 50);
    pointLight.position.set(0, 2, 10);
    scene.add(pointLight);

    // Build 3D Elements
    create3DClouds();
    create3DBalloons();
    create3DButterflies();
    create3DStarfield();
    create3DMoon();

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('click', onSceneClick);
    initTouchSwipeNavigation();
  }

  // --- 3D Clouds Builder ---
  function create3DClouds() {
    const cloudMat = new THREE.MeshToonMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85
    });

    for (let i = 0; i < 7; i++) {
      const cloudGroup = new THREE.Group();
      const puffs = 5 + Math.floor(Math.random() * 3);

      for (let p = 0; p < puffs; p++) {
        const radius = 1.2 + Math.random() * 1.5;
        const geom = new THREE.SphereGeometry(radius, 16, 16);
        const mesh = new THREE.Mesh(geom, cloudMat);
        mesh.position.set(
          (p - puffs / 2) * 1.2 + (Math.random() - 0.5),
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 1
        );
        cloudGroup.add(mesh);
      }

      cloudGroup.position.set(
        (Math.random() - 0.5) * 45,
        Math.random() * 16 - 2,
        (Math.random() - 0.5) * 18 - 8
      );
      cloudGroup.userData = { speed: 0.015 + Math.random() * 0.02 };
      clouds3D.push(cloudGroup);
      scene.add(cloudGroup);
    }
  }

  // --- 3D Balloons Builder ---
  function create3DBalloons() {
    const balloonColors = [0xf472b6, 0xa855f7, 0xfbbf24, 0x6ee7b7, 0x38bdf8, 0xf43f5e];

    for (let i = 0; i < 16; i++) {
      const bGroup = new THREE.Group();
      const color = balloonColors[i % balloonColors.length];

      const geom = new THREE.SphereGeometry(1.2, 24, 24);
      geom.scale(1, 1.25, 1);
      const mat = new THREE.MeshPhongMaterial({
        color: color,
        shininess: 90,
        specular: 0xffffff
      });
      const balloonMesh = new THREE.Mesh(geom, mat);
      bGroup.add(balloonMesh);

      // Knot
      const knotGeom = new THREE.ConeGeometry(0.2, 0.3, 8);
      const knot = new THREE.Mesh(knotGeom, mat);
      knot.position.y = -1.5;
      knot.rotation.x = Math.PI;
      bGroup.add(knot);

      // String line
      const lineMat = new THREE.LineBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.6 });
      const points = [new THREE.Vector3(0, -1.5, 0), new THREE.Vector3(0.2, -3.5, 0), new THREE.Vector3(-0.1, -5.5, 0)];
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeom, lineMat);
      bGroup.add(line);

      bGroup.position.set(
        (Math.random() - 0.5) * 26,
        -15 - Math.random() * 15,
        (Math.random() - 0.5) * 14
      );

      bGroup.userData = {
        speed: 0.04 + Math.random() * 0.03,
        swayOffset: Math.random() * Math.PI * 2,
        isBalloon: true
      };

      balloons3D.push(bGroup);
      scene.add(bGroup);
    }
  }

  // --- 3D Fluttering Butterflies (In WebGL World) ---
  function create3DButterflies() {
    const wingColors = [0xf472b6, 0xc084fc, 0xfef08a, 0x7dd3fc];

    for (let i = 0; i < 12; i++) {
      const bfGroup = new THREE.Group();
      const color = wingColors[i % wingColors.length];

      const wingMat = new THREE.MeshPhongMaterial({
        color: color,
        side: THREE.DoubleSide,
        shininess: 60,
        transparent: true,
        opacity: 0.9
      });

      const wingGeomL = new THREE.PlaneGeometry(0.9, 1.1);
      wingGeomL.translate(-0.45, 0, 0);
      const wingL = new THREE.Mesh(wingGeomL, wingMat);

      const wingGeomR = new THREE.PlaneGeometry(0.9, 1.1);
      wingGeomR.translate(0.45, 0, 0);
      const wingR = new THREE.Mesh(wingGeomR, wingMat);

      const bodyGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 8);
      const bodyMat = new THREE.MeshBasicMaterial({ color: 0x33203f });
      const body = new THREE.Mesh(bodyGeom, bodyMat);

      bfGroup.add(wingL);
      bfGroup.add(wingR);
      bfGroup.add(body);

      bfGroup.position.set(
        (Math.random() - 0.5) * 22,
        Math.random() * 12 - 2,
        (Math.random() - 0.5) * 14
      );

      bfGroup.userData = {
        wingL: wingL,
        wingR: wingR,
        orbitRadius: 3.5 + Math.random() * 5.5,
        orbitSpeed: 0.018 + Math.random() * 0.015,
        orbitAngle: Math.random() * Math.PI * 2,
        baseY: bfGroup.position.y
      };

      butterflies3D.push(bfGroup);
      scene.add(bfGroup);
    }
  }

  // --- 3D Starfield & Moon ---
  function create3DStarfield() {
    const starCount = 600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 120;
      positions[i + 1] = Math.random() * 80 - 10;
      positions[i + 2] = (Math.random() - 0.5) * 80 - 20;

      colors[i] = 1;
      colors[i + 1] = 0.9 + Math.random() * 0.1;
      colors[i + 2] = 0.7 + Math.random() * 0.3;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    starField3D = new THREE.Points(geometry, material);
    starField3D.visible = false;
    scene.add(starField3D);
  }

  function create3DMoon() {
    const moonGroup = new THREE.Group();
    const moonGeom = new THREE.SphereGeometry(3.5, 32, 32);
    const moonMat = new THREE.MeshPhongMaterial({
      color: 0xfef08a,
      emissive: 0xfbbf24,
      emissiveIntensity: 0.6,
      shininess: 10
    });
    const moonMesh = new THREE.Mesh(moonGeom, moonMat);
    moonGroup.add(moonMesh);

    moonGroup.position.set(10, 16, -25);
    moon3D = moonGroup;
    moon3D.visible = false;
    scene.add(moon3D);
  }

  function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.fov = aspect < 1 ? 68 : 60;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onMouseMove(e) {
    mouse.screenX = e.clientX;
    mouse.screenY = e.clientY;
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;

    rayMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    rayMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      mouse.screenX = e.touches[0].clientX;
      mouse.screenY = e.touches[0].clientY;
      mouse.targetX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = -(e.touches[0].clientY / window.innerHeight - 0.5) * 2;
    }
  }

  function onSceneClick(e) {
    raycaster.setFromCamera(rayMouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let i = 0; i < intersects.length; i++) {
      let obj = intersects[i].object;
      while (obj.parent && !obj.userData.isBalloon && obj !== scene) {
        obj = obj.parent;
      }
      if (obj.userData && obj.userData.isBalloon) {
        playBalloonPopSound();
        launchConfetti(e.clientX, e.clientY, 35);
        spawnLiveButterfly(e.clientX, e.clientY);
        obj.position.y = -30;
        break;
      }
    }
  }

  function initTouchSwipeNavigation() {
    let touchStartX = 0;
    let touchStartY = 0;

    window.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (deltaX < 0) {
          goToScene((state.currentSceneIndex + 1) % scenes.length);
        } else {
          goToScene((state.currentSceneIndex - 1 + scenes.length) % scenes.length);
        }
      }
    }, { passive: true });
  }

  // =========================================================================
  // 2. LIVE VIEWPORT BUTTERFLY SIMULATION & TOUCH ATTRACTION
  // =========================================================================
  const liveButterflies = [];

  class LiveButterfly {
    constructor(element, startX, startY) {
      this.el = element;
      this.x = startX || Math.random() * window.innerWidth;
      this.y = startY || Math.random() * window.innerHeight;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.angle = 0;
      this.targetX = this.x;
      this.targetY = this.y;
      this.timer = 0;
      this.speed = 2.2 + Math.random() * 1.5;

      this.el.addEventListener('click', (e) => {
        e.stopPropagation();
        playSparkleSound();
        launchConfetti(this.x, this.y, 25);
        this.el.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) scale(1.6) rotate(360deg)`;
      });
    }

    update() {
      this.timer += 0.03;

      if (Math.random() < 0.02) {
        this.targetX = Math.random() * (window.innerWidth - 60);
        this.targetY = Math.random() * (window.innerHeight - 60);
      }

      const dxMouse = mouse.screenX - this.x;
      const dyMouse = mouse.screenY - this.y;
      const distMouse = Math.hypot(dxMouse, dyMouse);

      let steerX = (this.targetX - this.x) * 0.02;
      let steerY = (this.targetY - this.y) * 0.02;

      if (distMouse < 300) {
        steerX += (dxMouse / distMouse) * 0.8;
        steerY += (dyMouse / distMouse) * 0.8;
      }

      this.vx += steerX * 0.1 + Math.sin(this.timer * 4) * 0.3;
      this.vy += steerY * 0.1 + Math.cos(this.timer * 3) * 0.3;

      const curSpeed = Math.hypot(this.vx, this.vy);
      if (curSpeed > this.speed) {
        this.vx = (this.vx / curSpeed) * this.speed;
        this.vy = (this.vy / curSpeed) * this.speed;
      }

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 10) { this.x = 10; this.vx *= -1; }
      if (this.x > window.innerWidth - 50) { this.x = window.innerWidth - 50; this.vx *= -1; }
      if (this.y < 10) { this.y = 10; this.vy *= -1; }
      if (this.y > window.innerHeight - 50) { this.y = window.innerHeight - 50; this.vy *= -1; }

      const targetAngle = Math.atan2(this.vy, this.vx) * (180 / Math.PI) + 90;
      this.angle += (targetAngle - this.angle) * 0.1;

      this.el.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) rotate(${this.angle}deg)`;
    }
  }

  function initLiveButterflies() {
    document.querySelectorAll('.live-3d-butterfly').forEach((el, idx) => {
      const startX = (window.innerWidth / 4) * (idx + 1);
      const startY = 150 + idx * 100;
      liveButterflies.push(new LiveButterfly(el, startX, startY));
    });
  }

  function spawnLiveButterfly(x, y) {
    const container = document.getElementById('liveButterflyContainer');
    if (!container) return;

    const el = document.createElement('div');
    el.className = 'live-3d-butterfly';
    el.innerHTML = `
      <div class="wing wing-l"></div>
      <div class="bf-torso"></div>
      <div class="wing wing-r"></div>
      <div class="bf-glow"></div>
    `;
    container.appendChild(el);

    const bf = new LiveButterfly(el, x || mouse.screenX, y || mouse.screenY);
    liveButterflies.push(bf);
    playSparkleSound();
    launchConfetti(bf.x, bf.y, 20);
  }

  // =========================================================================
  // 3. MAIN 3D ANIMATION LOOP
  // =========================================================================
  let clock = new THREE.Clock();

  function animate3D() {
    requestAnimationFrame(animate3D);
    const elapsedTime = clock.getElapsedTime();

    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    if (!state.reducedMotion) {
      liveButterflies.forEach((bf) => bf.update());
    }

    const baseDest = baseCameraDestinations[state.currentSceneIndex];
    if (baseDest) {
      const zOffset = getResponsiveZOffset();
      const parallaxX = state.parallaxEnabled && !state.reducedMotion ? mouse.x * 2 : 0;
      const parallaxY = state.parallaxEnabled && !state.reducedMotion ? mouse.y * 1.2 : 0;

      camera.position.x += (baseDest.x + parallaxX - camera.position.x) * 0.04;
      camera.position.y += (baseDest.y + parallaxY - camera.position.y) * 0.04;
      camera.position.z += (baseDest.z + zOffset - camera.position.z) * 0.04;

      camera.rotation.x += (baseDest.rotX - mouse.y * 0.03 - camera.rotation.x) * 0.04;
      camera.rotation.y += (baseDest.rotY + mouse.x * 0.03 - camera.rotation.y) * 0.04;
    }

    if (!state.reducedMotion) {
      clouds3D.forEach((c) => {
        c.position.x += c.userData.speed;
        if (c.position.x > 25) c.position.x = -25;
      });

      balloons3D.forEach((b) => {
        b.position.y += b.userData.speed;
        b.position.x += Math.sin(elapsedTime * 1.5 + b.userData.swayOffset) * 0.02;
        b.rotation.z = Math.sin(elapsedTime * 2 + b.userData.swayOffset) * 0.08;
        if (b.position.y > 25) {
          b.position.y = -20 - Math.random() * 10;
        }
      });

      butterflies3D.forEach((bf) => {
        const u = bf.userData;
        u.orbitAngle += u.orbitSpeed;
        bf.position.x = Math.cos(u.orbitAngle) * u.orbitRadius;
        bf.position.z = Math.sin(u.orbitAngle) * u.orbitRadius;
        bf.position.y = u.baseY + Math.sin(elapsedTime * 3 + u.orbitAngle) * 0.8;
        bf.rotation.y = -u.orbitAngle + Math.PI / 2;

        const flap = Math.sin(elapsedTime * 22) * 0.8;
        u.wingL.rotation.y = flap;
        u.wingR.rotation.y = -flap;
      });

      if (starField3D && starField3D.visible) {
        starField3D.rotation.y += 0.0006;
      }
    }

    renderer.render(scene, camera);
  }

  // =========================================================================
  // 4. WEB AUDIO API MUSIC BOX & SOUND EFFECTS
  // =========================================================================
  let audioCtx = null;
  let isPlayingMusic = false;
  let musicTimeoutId = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playChimeTone(freq, duration = 1.2, timeOffset = 0, gainLevel = 0.15) {
    if (!state.soundEnabled || !audioCtx) return;
    try {
      const startTime = audioCtx.currentTime + timeOffset;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(gainLevel, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {
      console.warn(e);
    }
  }

  function playBalloonPopSound() {
    if (!state.soundEnabled || !audioCtx) return;
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  function playSparkleSound() {
    if (!state.soundEnabled || !audioCtx) return;
    initAudio();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      playChimeTone(freq, 0.8, idx * 0.06, 0.08);
    });
  }

  function playCandleBlowSound() {
    if (!state.soundEnabled || !audioCtx) return;
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  const musicBoxNotes = [
    { note: 392.00, dur: 0.35 }, { note: 392.00, dur: 0.35 }, { note: 440.00, dur: 0.7 }, { note: 392.00, dur: 0.7 }, { note: 523.25, dur: 0.7 }, { note: 493.88, dur: 1.4 },
    { note: 392.00, dur: 0.35 }, { note: 392.00, dur: 0.35 }, { note: 440.00, dur: 0.7 }, { note: 392.00, dur: 0.7 }, { note: 587.33, dur: 0.7 }, { note: 523.25, dur: 1.4 },
    { note: 392.00, dur: 0.35 }, { note: 392.00, dur: 0.35 }, { note: 783.99, dur: 0.7 }, { note: 659.25, dur: 0.7 }, { note: 523.25, dur: 0.7 }, { note: 493.88, dur: 0.7 }, { note: 440.00, dur: 1.2 },
    { note: 698.46, dur: 0.35 }, { note: 698.46, dur: 0.35 }, { note: 659.25, dur: 0.7 }, { note: 523.25, dur: 0.7 }, { note: 587.33, dur: 0.7 }, { note: 523.25, dur: 2.0 }
  ];
  let currentNoteIdx = 0;

  function scheduleNextNote() {
    if (!isPlayingMusic || !state.soundEnabled) return;
    const current = musicBoxNotes[currentNoteIdx];
    playChimeTone(current.note, 1.2, 0, 0.12);
    currentNoteIdx = (currentNoteIdx + 1) % musicBoxNotes.length;
    musicTimeoutId = setTimeout(scheduleNextNote, current.dur * 700);
  }

  function startMusicBox() {
    if (isPlayingMusic) return;
    initAudio();
    isPlayingMusic = true;
    currentNoteIdx = 0;
    scheduleNextNote();
  }

  function stopMusicBox() {
    isPlayingMusic = false;
    if (musicTimeoutId) clearTimeout(musicTimeoutId);
  }

  function toggleSound(forceState) {
    if (typeof forceState === 'boolean') {
      state.soundEnabled = forceState;
    } else {
      state.soundEnabled = !state.soundEnabled;
    }

    const btn = document.getElementById('soundToggleBtn');
    const icon = document.getElementById('soundIcon');
    btn.setAttribute('aria-pressed', state.soundEnabled ? 'true' : 'false');
    icon.textContent = state.soundEnabled ? '🔊' : '🔇';

    if (state.soundEnabled) {
      initAudio();
      startMusicBox();
    } else {
      stopMusicBox();
    }
  }

  // =========================================================================
  // 5. CONFETTI & SPARKLE CANNON
  // =========================================================================
  const confettiCanvas = document.getElementById('confettiCanvas');
  const confettiCtx = confettiCanvas.getContext('2d');
  let cWidth = (confettiCanvas.width = window.innerWidth);
  let cHeight = (confettiCanvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    cWidth = confettiCanvas.width = window.innerWidth;
    cHeight = confettiCanvas.height = window.innerHeight;
  });

  const confettiPieces = [];

  class Confetti {
    constructor(x, y) {
      this.x = x || cWidth / 2;
      this.y = y || cHeight / 2;
      this.size = Math.random() * 8 + 5;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 10 + 5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 5;
      this.gravity = 0.28;
      this.drag = 0.97;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.2;
      this.colors = ['#ec4899', '#8b5cf6', '#f59e0b', '#10b981', '#3b82f6', '#f43f5e', '#ffffff'];
      this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.008;
    }
    update() {
      this.vx *= this.drag;
      this.vy *= this.drag;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotSpeed;
      this.alpha -= this.decay;
    }
    draw(ctx) {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      ctx.restore();
    }
  }

  function launchConfetti(x, y, amount = 70) {
    playSparkleSound();
    for (let i = 0; i < amount; i++) {
      confettiPieces.push(new Confetti(x, y));
    }
  }

  function renderConfettiLoop() {
    confettiCtx.clearRect(0, 0, cWidth, cHeight);
    for (let i = confettiPieces.length - 1; i >= 0; i--) {
      const c = confettiPieces[i];
      c.update();
      c.draw(confettiCtx);
      if (c.alpha <= 0) confettiPieces.splice(i, 1);
    }
    requestAnimationFrame(renderConfettiLoop);
  }
  renderConfettiLoop();

  // =========================================================================
  // 6. 3D CARD TILT MECHANICS
  // =========================================================================
  function init3DCardTilt() {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        if (state.reducedMotion || window.innerWidth < 768) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -(y / rect.height) * 14;
        const rotateY = (x / rect.width) * 14;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // =========================================================================
  // 7. SCENE SWITCHER
  // =========================================================================
  function goToScene(index) {
    if (index < 0 || index >= scenes.length) return;
    state.currentSceneIndex = index;

    document.querySelectorAll('.scene').forEach((sc, idx) => {
      if (idx === index) {
        sc.classList.add('active');
        sc.setAttribute('aria-hidden', 'false');
      } else {
        sc.classList.remove('active');
        sc.setAttribute('aria-hidden', 'true');
      }
    });

    document.querySelectorAll('.step-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });

    if (index === 3) {
      document.body.setAttribute('data-theme', 'night');
      scene.fog.color.setHex(0x090a1a);
      ambientLight.color.setHex(0x31135e);
      directionalLight.color.setHex(0x6366f1);
      if (starField3D) starField3D.visible = true;
      if (moon3D) moon3D.visible = true;
    } else {
      document.body.setAttribute('data-theme', 'day');
      scene.fog.color.setHex(0xfce7f3);
      ambientLight.color.setHex(0xfff0f5);
      directionalLight.color.setHex(0xffeedd);
      if (starField3D) starField3D.visible = false;
      if (moon3D) moon3D.visible = false;
    }
  }

  // =========================================================================
  // 8. ENVELOPE, CAKE & PERSONALIZATION
  // =========================================================================
  function initEnvelope() {
    const envelope = document.getElementById('envelope3D');
    const seal = document.getElementById('waxSeal3D');

    function openEnvelope() {
      if (!envelope.classList.contains('opened')) {
        envelope.classList.add('opened');
        playSparkleSound();
        const rect = seal.getBoundingClientRect();
        launchConfetti(rect.left + rect.width / 2, rect.top, 50);
        spawnLiveButterfly(rect.left + rect.width / 2, rect.top);
      }
    }

    seal.addEventListener('click', openEnvelope);
    envelope.addEventListener('click', openEnvelope);
  }

  const fortunes = [
    '"May every single dream of yours turn into reality, Tasu, bringing boundless happiness, love, and sweet adventures!" 💫',
    '"A joyful year filled with warm smiles, sunshine, and wonderful surprises awaits you, Riya!" 🌸',
    '"May success and peace follow you in everything you do, dearest Tasu!" ✨',
    '"You make life so much brighter! Wishing you the most magical and blessed birthday ever, Riya!" 🎂'
  ];

  function initSurpriseModal() {
    const modal = document.getElementById('surpriseModal');
    const triggerBtn = document.getElementById('surpriseModalBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const moreConfettiBtn = document.getElementById('moreConfettiBtn');
    const candle = document.getElementById('birthdayCandle3D');
    const flame = document.getElementById('candleFlame3D');
    const smoke = document.getElementById('candleSmoke3D');
    const fortuneBox = document.getElementById('wishFortuneBox');
    const fortuneText = document.getElementById('fortuneText');

    triggerBtn.addEventListener('click', () => {
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      launchConfetti(cWidth / 2, cHeight / 2, 80);
      spawnLiveButterfly(cWidth / 2, cHeight / 2);
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
    });

    moreConfettiBtn.addEventListener('click', () => {
      launchConfetti(cWidth / 2, cHeight / 2, 70);
      spawnLiveButterfly();
    });

    candle.addEventListener('click', () => {
      if (!state.candleBlown) {
        state.candleBlown = true;
        flame.classList.add('extinguished');
        smoke.classList.add('puff');
        playCandleBlowSound();
        launchConfetti(cWidth / 2, cHeight / 3, 100);
        spawnLiveButterfly(cWidth / 2, cHeight / 3);

        const pickedFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        fortuneText.textContent = pickedFortune;
        fortuneBox.classList.add('show');
      } else {
        state.candleBlown = false;
        flame.classList.remove('extinguished');
        smoke.classList.remove('puff');
        playSparkleSound();
      }
    });
  }

  function applyPersonalization() {
    document.querySelectorAll('.birthday-recipient-name').forEach((el) => {
      el.textContent = state.recipientName;
    });
    const letterText1 = document.getElementById('personalizedLetterText');
    const letterText2 = document.getElementById('personalizedLetterText2');
    const signatureDisplay = document.getElementById('signatureDisplay');

    if (letterText1) letterText1.textContent = state.customMessage1;
    if (letterText2) letterText2.textContent = state.customMessage2;
    if (signatureDisplay) signatureDisplay.textContent = state.senderName;
  }

  function initPersonalization() {
    const modal = document.getElementById('personalizeModal');
    const openBtn = document.getElementById('editNameBtn');
    const closeBtn = document.getElementById('closePersonalizeBtn');
    const form = document.getElementById('personalizeForm');
    const nameInput = document.getElementById('inputName');
    const senderInput = document.getElementById('inputSender');
    const messageInput = document.getElementById('inputMessage');
    const resetBtn = document.getElementById('resetDefaultsBtn');

    nameInput.value = state.recipientName;
    senderInput.value = state.senderName;
    messageInput.value = state.customMessage1;

    openBtn.addEventListener('click', () => {
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (nameInput.value.trim()) state.recipientName = nameInput.value.trim();
      if (senderInput.value.trim()) state.senderName = senderInput.value.trim();
      if (messageInput.value.trim()) state.customMessage1 = messageInput.value.trim();

      applyPersonalization();
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      playSparkleSound();
    });

    resetBtn.addEventListener('click', () => {
      state.recipientName = 'Riya (Tasu)';
      state.senderName = 'Forever Cheering For You, Tasu! 💖';
      state.customMessage1 = 'Happy Birthday to the most wonderful, bright, and loving person! Your presence brings so much warmth, laughter, and happiness wherever you go.';
      nameInput.value = state.recipientName;
      senderInput.value = state.senderName;
      messageInput.value = state.customMessage1;
      applyPersonalization();
    });
  }

  // =========================================================================
  // 9. INTERACTION HANDLERS & BINDINGS
  // =========================================================================
  function initInteractions() {
    document.getElementById('startJourneyBtn').addEventListener('click', () => {
      toggleSound(true);
      launchConfetti(cWidth / 2, cHeight / 2, 70);
      spawnLiveButterfly(cWidth / 2, cHeight / 2);
      goToScene(1);
    });

    const spawnBtn = document.getElementById('spawnButterflyBtn');
    if (spawnBtn) {
      spawnBtn.addEventListener('click', () => {
        spawnLiveButterfly();
      });
    }

    document.querySelectorAll('.next-scene-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetIdx = parseInt(btn.getAttribute('data-target'), 10);
        goToScene(targetIdx);
        spawnLiveButterfly();
      });
    });

    document.querySelectorAll('.step-dot').forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToScene(idx);
      });
    });

    document.getElementById('soundToggleBtn').addEventListener('click', () => {
      toggleSound();
    });

    // Wish chips clicks in Scene 2
    document.querySelectorAll('.wish-item-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        playSparkleSound();
        const rect = chip.getBoundingClientRect();
        launchConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
        spawnLiveButterfly(rect.left + rect.width / 2, rect.top);
      });
    });

    // Finale Replay & Wish
    document.getElementById('replayExperienceBtn').addEventListener('click', () => {
      goToScene(0);
    });

    document.getElementById('makeAWishBtn').addEventListener('click', () => {
      playSparkleSound();
      launchConfetti(cWidth / 2, cHeight / 3, 100);
      spawnLiveButterfly(cWidth / 2, cHeight / 3);
    });
  }

  // =========================================================================
  // 10. INITIALIZATION ENTRY POINT
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initThreeScene();
    initLiveButterflies();
    animate3D();
    init3DCardTilt();
    initEnvelope();
    initSurpriseModal();
    initPersonalization();
    initInteractions();
    applyPersonalization();
  });
})();
