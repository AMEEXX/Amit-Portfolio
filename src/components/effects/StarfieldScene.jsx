import React, { useEffect, useRef } from 'react';

export default function StarfieldScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const pinEl = canvas.parentElement; // .starfield-zone
    if (!pinEl) return;

    let animationFrameId = null;
    let disposed = false;

    // ── Async init to match original dynamic import pattern ──
    (async () => {
      const THREE = await import('three');
      const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js');
      const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js');
      const { ShaderPass } = await import('three/examples/jsm/postprocessing/ShaderPass.js');
      const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js');
      const { GammaCorrectionShader } = await import('three/examples/jsm/shaders/GammaCorrectionShader.js');
      const { CopyShader } = await import('three/examples/jsm/shaders/CopyShader.js');

      if (disposed) return;

      // ── Renderer ──
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.VSMShadowMap;

      // ── Scene ──
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      scene.fog = new THREE.Fog(0x000000, 0, 15);

      // ── Camera ──
      const camera = new THREE.PerspectiveCamera(45, pinEl.clientWidth / pinEl.clientHeight, 0.1, 80);
      camera.position.set(0, 0, 5);

      const LAYERS = { NONE: 0, TORUS_SCENE: 1, BLOOM_SCENE: 2, ENTIRE_SCENE: 3 };
      camera.layers.enable(LAYERS.TORUS_SCENE);
      camera.layers.enable(LAYERS.BLOOM_SCENE);
      camera.layers.enable(LAYERS.ENTIRE_SCENE);
      scene.add(camera);

      // ── Colour helpers ──
      function hexToVec3(hex) {
        const n = parseInt(hex.slice(1), 16);
        return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
      }

      const CONFIG = {
        bgColor: '#05060f',
        flameColor: '#2c165f',
        flameColor2: '#455792',
        flameAmt: 3,
        colorA: '#62a2d8',
        colorB: '#acbde0',
        colorC: '#def8f9',
        opacity: 2,
        pointSize: 50,
        brightness: 1.85,
        drift: 2.35,
        twinkle: 1,
        spin: 0.03,
        repelRadius: 5,
        repelStrength: 0.35,
        scrollPush: 8,
        scrollDrift: 6,
        scrollSpin: 0.1,
        parallax: 0.6,
      };

      // ── Composers ──
      const renderScene = new RenderPass(scene, camera);

      const torusComposer = new EffectComposer(renderer);
      torusComposer.renderToScreen = false;
      torusComposer.addPass(renderScene);
      torusComposer.addPass(new ShaderPass(GammaCorrectionShader));
      torusComposer.addPass(new UnrealBloomPass(new THREE.Vector2(pinEl.clientWidth, pinEl.clientHeight), 0.22, 0.2, 0));
      torusComposer.addPass(new ShaderPass(CopyShader));

      const bloomComposer = new EffectComposer(renderer);
      bloomComposer.renderToScreen = false;
      bloomComposer.addPass(renderScene);
      bloomComposer.addPass(new UnrealBloomPass(new THREE.Vector2(pinEl.clientWidth, pinEl.clientHeight), 0.4, 0.55, 0));
      bloomComposer.addPass(new ShaderPass(GammaCorrectionShader));

      const finalPass = new ShaderPass({
        uniforms: {
          iTime: { value: 0 },
          tDiffuse: { value: null },
          torusTexture: { value: null },
          bloomTexture: { value: null },
          haloTexture: { value: null },
          uBg: { value: hexToVec3('#05060f') },
          uFlameA: { value: hexToVec3('#2c165f') },
          uFlameB: { value: hexToVec3('#455792') },
          uFlameAmt: { value: 3 },
        },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }`,
        fragmentShader: `
uniform float iTime; uniform sampler2D tDiffuse; uniform sampler2D bloomTexture; uniform sampler2D torusTexture; uniform sampler2D haloTexture;
uniform vec3 uBg; uniform vec3 uFlameA; uniform vec3 uFlameB; uniform float uFlameAmt;
varying vec2 vUv;
vec3 warp3d(vec3 pos, float t){ float curv=.8,a=1.9,b=0.7; pos*=2.;
  pos.x+=curv*sin(t+a*pos.y)+t*b; pos.y+=curv*cos(t+a*pos.x);
  pos.y+=curv*sin(t+a*pos.z)+t*b; pos.z+=curv*cos(t+a*pos.y);
  pos.z+=curv*sin(t+a*pos.x)+t*b; pos.x+=curv*cos(t+a*pos.z);
  return 0.5+0.5*cos(pos.xyz+vec3(1,2,4)); }
void main(){
  vec2 uv = 2.*vUv - 1.;
  vec3 w = pow(warp3d(vec3(uv.x, sin(uv.y), uv.y), iTime*1.5), vec3(1.5));
  vec3 flame = 1.5*uFlameA*w.x; flame*=w.y; flame += uFlameB*w.z;
  flame *= smoothstep(0.25, 1., abs(uv.y));
  float md = smoothstep(-0.7, 1., -uv.y*uv.x); flame *= md*md;
  vec3 bg = uBg * (1.0 - 0.4 * length(uv));
  vec3 halo = texture2D(haloTexture, vUv).xyz;
  gl_FragColor = vec4(bg + flame*uFlameAmt + texture2D(bloomTexture, vUv).xyz + texture2D(torusTexture, vUv).xyz + texture2D(tDiffuse, vUv).xyz + halo, 1.);
}`
      });

      const finalComposer = new EffectComposer(renderer);
      finalComposer.addPass(renderScene);
      finalComposer.addPass(finalPass);
      finalPass.uniforms.bloomTexture.value = bloomComposer.renderTarget1.texture;
      finalPass.uniforms.torusTexture.value = torusComposer.renderTarget1.texture;

      // ── Particle geometry (matches original exactly) ──
      const count = 4200, depth = 30;
      const positions = new Float32Array(count * 3);
      const palette = new Float32Array(count);
      const bright = new Float32Array(count);
      const scales = new Float32Array(count);
      const phases = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3]     = (Math.random() - 0.5) * 24;
        positions[i3 + 1] = (Math.random() - 0.5) * 16;
        positions[i3 + 2] = (Math.random() - 0.5) * 30;
        palette[i] = Math.floor(Math.random() * 3);
        bright[i]  = 0.7 + Math.random() * 0.6;
        scales[i]  = 0.5 + Math.pow(Math.random(), 1.4) * 2.5;
        phases[i]  = Math.random();
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('aScale',   new THREE.Float32BufferAttribute(scales, 1));
      geometry.setAttribute('aPhase',   new THREE.Float32BufferAttribute(phases, 1));
      geometry.setAttribute('aPalette', new THREE.Float32BufferAttribute(palette, 1));
      geometry.setAttribute('aBright',  new THREE.Float32BufferAttribute(bright, 1));

      const uniforms = {
        uTime:          { value: 0 },
        uSize:          { value: 50 },
        uOpacity:       { value: 0 },
        uDrift:         { value: 0 },
        uDepth:         { value: 30 },
        uTwinkle:       { value: 1 },
        uCursor:        { value: new THREE.Vector3() },
        uRepelRadius:   { value: 5 },
        uRepelStrength: { value: 0.35 },
        uActivity:      { value: 0 },
        uColorA:        { value: hexToVec3('#62a2d8') },
        uColorB:        { value: hexToVec3('#acbde0') },
        uColorC:        { value: hexToVec3('#def8f9') },
        uBrightness:    { value: 1.85 },
      };

      const vertexShader = `
uniform float uTime; uniform float uSize; uniform float uDrift; uniform float uDepth; uniform float uTwinkle;
uniform vec3 uCursor; uniform float uRepelRadius; uniform float uRepelStrength; uniform float uActivity;
uniform vec3 uColorA; uniform vec3 uColorB; uniform vec3 uColorC;
attribute float aScale; attribute float aPhase; attribute float aPalette; attribute float aBright;
varying vec3 vColor; varying float vTwinkle;
void main() {
  vec3 pos = position;
  pos.z = mod(pos.z + uDrift + (uDepth * 0.5), uDepth) - (uDepth * 0.5);
  float tw = sin(uTime * 1.6 + aPhase * 6.2831);
  vTwinkle = (1.0 - uTwinkle) + uTwinkle * (0.55 + 0.45 * tw);
  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec3 toParticle = modelPosition.xyz - uCursor;
  float dist = length(toParticle);
  float falloff = smoothstep(uRepelRadius, 0.0, dist);
  modelPosition.xyz += normalize(toParticle + vec3(0.0001)) * falloff * uRepelStrength * uActivity;
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
  gl_PointSize = uSize * aScale;
  gl_PointSize *= (1.0 / -viewPosition.z);
  vec3 base = aPalette < 0.5 ? uColorA : (aPalette < 1.5 ? uColorB : uColorC);
  vColor = base * aBright;
}`;

      const fragmentShader = `
uniform float uOpacity; uniform float uBrightness;
varying vec3 vColor; varying float vTwinkle;
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float strength = pow(1.0 - d * 2.0, 4.0);
  vec3 color = mix(vec3(0.0), vColor, strength);
  gl_FragColor = vec4(color * uBrightness, strength * uOpacity * vTwinkle);
}`;

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geometry, material);
      points.layers.enable(LAYERS.ENTIRE_SCENE);

      const group = new THREE.Group();
      group.add(points);
      scene.add(group);

      // ── Pointer interaction ──
      const POINTER = { world: new THREE.Vector3(), activity: 0 };
      const ndc = new THREE.Vector2(0, 0);
      const raycaster = new THREE.Raycaster();
      let active = false, lastMove = 0;

      function onPointerMove(e) {
        const r = pinEl.getBoundingClientRect();
        ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
        active = true;
        lastMove = performance.now();
      }
      function onPointerLeave() { active = false; }
      pinEl.addEventListener('pointermove', onPointerMove);
      pinEl.addEventListener('pointerleave', onPointerLeave);

      // ── Scroll tracking ──
      const lerp = (a, b, t) => a + (b - a) * t;
      let scrollTarget = 0, scrollSmooth = 0, scrollCurrent = 0;
      const mouseSmooth = { x: 0, y: 0 };

      function computeScrollTarget() {
        const hostRect = pinEl.getBoundingClientRect();
        const total = pinEl.offsetHeight - window.innerHeight;
        if (total <= 0) { scrollTarget = 0; return; }
        const raw = -hostRect.top / total;
        scrollTarget = Math.min(1, Math.max(0, raw));
      }

      // ── Resize ──
      function onResize() {
        if (!pinEl || disposed) return;
        const w = pinEl.clientWidth, h = pinEl.clientHeight;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        [torusComposer, bloomComposer, finalComposer].forEach(c => {
          c.setPixelRatio(window.devicePixelRatio);
          c.setSize(w, h);
        });
      }

      window.addEventListener('resize', onResize);
      const ro = new ResizeObserver(onResize);
      ro.observe(pinEl);

      // ── Animation loop ──
      let t0 = performance.now() / 1000;
      const appearStart = performance.now();

      function animate() {
        if (disposed) return;
        animationFrameId = requestAnimationFrame(animate);
        const t = performance.now() / 1000;
        const dt = Math.min(0.05, t - t0); t0 = t;
        uniforms.uTime.value = t;

        computeScrollTarget();
        scrollSmooth  = lerp(scrollSmooth, scrollTarget, 0.10);
        scrollCurrent = lerp(scrollCurrent, scrollSmooth, 0.06);
        mouseSmooth.x = lerp(mouseSmooth.x, ndc.x, 0.06);
        mouseSmooth.y = lerp(mouseSmooth.y, ndc.y, 0.06);

        // Cursor repel
        let targetWorld;
        if (active) {
          raycaster.setFromCamera(ndc, camera);
          const dir = raycaster.ray.direction;
          const tz = -camera.position.z / dir.z;
          targetWorld = (Math.abs(dir.z) > 1e-4 && tz > 0 && isFinite(tz))
            ? raycaster.ray.origin.clone().add(dir.clone().multiplyScalar(tz))
            : new THREE.Vector3(0, 0, 0);
        } else {
          targetWorld = new THREE.Vector3(0, 0, 0);
        }
        POINTER.world.lerp(targetWorld, 0.12);
        const idleSec = (performance.now() - lastMove) / 1000;
        const want = (active && idleSec < 3) ? 1 : 0;
        POINTER.activity += (want - POINTER.activity) * 0.06;
        uniforms.uCursor.value.copy(POINTER.world);
        uniforms.uActivity.value = POINTER.activity;

        // Drift + scroll-reactive camera
        uniforms.uDrift.value += dt * (CONFIG.drift + scrollCurrent * CONFIG.scrollDrift);
        camera.position.set(mouseSmooth.x * 0.6, mouseSmooth.y * 0.6, 5 - scrollCurrent * 8);
        camera.lookAt(mouseSmooth.x * 0.6, mouseSmooth.y * 0.6, -10);

        // Fade in
        const elapsed = performance.now() - appearStart;
        const fade = Math.min(Math.max((elapsed - 300) / 1400, 0), 1);
        uniforms.uOpacity.value = fade * 2;

        // Group spin
        group.rotation.z += dt * (CONFIG.spin + scrollCurrent * CONFIG.scrollSpin);

        // Render all three composers
        finalPass.uniforms.iTime.value = t;
        camera.layers.set(LAYERS.TORUS_SCENE); torusComposer.render();
        camera.layers.set(LAYERS.BLOOM_SCENE); bloomComposer.render();
        camera.layers.set(LAYERS.ENTIRE_SCENE); finalComposer.render();
      }

      onResize();
      animate();

      // ── Cleanup ──
      return () => {
        disposed = true;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        pinEl.removeEventListener('pointermove', onPointerMove);
        pinEl.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('resize', onResize);
        ro.disconnect();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        [torusComposer, bloomComposer, finalComposer].forEach(c => c.dispose());
      };
    })();

    // Return a no-op cleanup here; real cleanup is in the async IIFE above
    // We store the cleanup in a ref-based pattern
    return () => { disposed = true; if (animationFrameId) cancelAnimationFrame(animationFrameId); };
  }, []);

  return <canvas ref={canvasRef} id="starfield-scene" />;
}
