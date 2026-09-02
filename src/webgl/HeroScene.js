// The hero: a WebGL daylight scene — a bright striped pitch under a soft sky
// and a floating football. Pure three.js, mounted/unmounted by the Hero
// component. Rendered with alpha so the CSS sky gradient shows through.

import * as THREE from 'three'

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function makeBallTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fdfefd'
  ctx.fillRect(0, 0, size, size)

  // Stylised panel pattern: staggered dark pentagons on a hex-ish grid.
  const r = 34
  ctx.fillStyle = '#1c2622'
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      const x = col * 96 + (row % 2 ? 48 : 0) + 24
      const y = row * 88 + 30
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const a = (Math.PI * 2 * i) / 5 - Math.PI / 2
        const px = x + Math.cos(a) * r
        const py = y + Math.sin(a) * r
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()
    }
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}

const PITCH_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const PITCH_FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;

  float line(float d, float w) { return 1.0 - smoothstep(w * 0.5, w, abs(d)); }

  void main() {
    // Fresh-cut mowing stripes.
    float stripe = step(0.5, fract(vUv.y * 9.0));
    vec3 grassA = vec3(0.36, 0.65, 0.40);
    vec3 grassB = vec3(0.41, 0.70, 0.45);
    vec3 col = mix(grassA, grassB, stripe);

    // Markings: touchlines, halfway line, centre circle & spot.
    vec2 p = vUv - 0.5;
    float marks = 0.0;
    marks = max(marks, line(abs(p.x) - 0.46, 0.006));
    marks = max(marks, line(abs(p.y) - 0.47, 0.006));
    marks = max(marks, line(p.y, 0.006) * step(abs(p.x), 0.46));
    marks = max(marks, line(length(p * vec2(1.0, 1.35)) - 0.12, 0.008));
    marks = max(marks, 1.0 - smoothstep(0.006, 0.012, length(p * vec2(1.0, 1.35))));
    col = mix(col, vec3(0.99, 1.0, 0.99), marks * 0.9);

    // A soft patch of drifting sunlight.
    float sweep = 0.5 + 0.5 * sin(uTime * 0.2);
    vec2 sun = vec2(0.35 + 0.3 * sweep, 0.45);
    col += vec3(0.10, 0.09, 0.06) * exp(-8.0 * dot(vUv - sun, vUv - sun));

    // Fade the far edge into the sky haze.
    float fade = smoothstep(0.0, 0.4, vUv.y);
    col = mix(vec3(0.93, 0.96, 0.94), col, fade);

    gl_FragColor = vec4(col, 1.0);
  }
`

export class HeroScene {
  mount(container) {
    this.container = container
    const width = container.clientWidth
    const height = container.clientHeight

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(width, height)
    container.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.Fog(0xeef4ef, 22, 70)

    this.camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 120)
    this.camera.position.set(0, 3.2, 13)

    // Pitch.
    this.pitchUniforms = { uTime: { value: 0 } }
    const pitch = new THREE.Mesh(
      new THREE.PlaneGeometry(70, 44),
      new THREE.ShaderMaterial({ uniforms: this.pitchUniforms, vertexShader: PITCH_VERT, fragmentShader: PITCH_FRAG }),
    )
    pitch.rotation.x = -Math.PI / 2
    pitch.position.y = -1.6
    this.scene.add(pitch)

    // Ball.
    this.ball = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 48, 48),
      new THREE.MeshStandardMaterial({ map: makeBallTexture(), roughness: 0.5, metalness: 0.02 }),
    )
    this.ball.position.set(0, 1.4, 0)
    this.scene.add(this.ball)

    // Daylight: bright sky/ground bounce + warm sun.
    this.scene.add(new THREE.HemisphereLight(0xf3f8ff, 0xa8d6b2, 1.3))
    const sun = new THREE.DirectionalLight(0xfff4dd, 2.2)
    sun.position.set(-8, 14, 7)
    this.scene.add(sun)

    // Gentle mouse parallax.
    this.pointer = { x: 0, y: 0 }
    this.onPointerMove = (e) => {
      this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      this.pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', this.onPointerMove)

    this.onResize = () => {
      const w = this.container.clientWidth
      const h = this.container.clientHeight
      if (!w || !h) return
      this.camera.aspect = w / h
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(w, h)
    }
    window.addEventListener('resize', this.onResize)

    this.clock = new THREE.Clock()
    if (REDUCED_MOTION) {
      this.renderer.render(this.scene, this.camera) // single static frame
    } else {
      this.renderer.setAnimationLoop(() => this.tick())
    }
  }

  tick() {
    const t = this.clock.getElapsedTime()
    this.pitchUniforms.uTime.value = t

    this.ball.rotation.y = t * 0.5
    this.ball.rotation.x = Math.sin(t * 0.3) * 0.25
    this.ball.position.y = 1.4 + Math.sin(t * 1.1) * 0.35

    this.camera.position.x += (this.pointer.x * 1.6 - this.camera.position.x) * 0.03
    this.camera.position.y += (3.2 - this.pointer.y * 0.8 - this.camera.position.y) * 0.03
    this.camera.lookAt(0, 1.0, 0)

    this.renderer.render(this.scene, this.camera)
  }

  unmount() {
    this.renderer?.setAnimationLoop(null)
    window.removeEventListener('pointermove', this.onPointerMove)
    window.removeEventListener('resize', this.onResize)
    this.scene?.traverse((obj) => {
      obj.geometry?.dispose?.()
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
      mats.forEach((m) => {
        m?.map?.dispose?.()
        m?.dispose?.()
      })
    })
    this.renderer?.dispose()
    this.renderer?.domElement?.remove()
  }
}
