// Ambient WebGL backdrop behind the whole app: a barely-there daylight
// shader — soft off-white gradient with faint pitch markings and a slow
// drifting brightness. Cheap (one fullscreen quad), fixed behind all content.

import * as THREE from 'three'

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv - 0.5;
    p.x *= uRes.x / uRes.y;

    // Soft daylight gradient.
    vec3 top = vec3(0.975, 0.985, 0.978);
    vec3 bottom = vec3(0.945, 0.965, 0.950);
    vec3 col = mix(top, bottom, uv.y);

    // Faint giant centre circle and halfway line, off to the side.
    float circle = abs(length(p - vec2(0.55, -0.18)) - 0.5);
    col -= vec3(0.030, 0.014, 0.026) * (1.0 - smoothstep(0.0, 0.012, circle)) * 0.8;
    float halfway = abs(p.x + 0.62);
    col -= vec3(0.030, 0.014, 0.026) * (1.0 - smoothstep(0.0, 0.008, halfway)) * 0.5;

    // Slow drifting brightness, like light through clouds.
    float sweepPos = fract(uTime * 0.015);
    float sweep = exp(-10.0 * abs(uv.x - sweepPos));
    col += vec3(0.015) * sweep;

    // Grain to stop banding.
    col += (hash(uv * uRes + uTime) - 0.5) * 0.006;

    gl_FragColor = vec4(col, 1.0);
  }
`

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

export class Backdrop {
  mount(container) {
    this.container = container
    this.renderer = new THREE.WebGLRenderer({ antialias: false })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    }
    this.scene.add(
      new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({ uniforms: this.uniforms, vertexShader: VERT, fragmentShader: FRAG }),
      ),
    )

    this.onResize = () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.uniforms.uRes.value.set(window.innerWidth, window.innerHeight)
      if (REDUCED_MOTION) this.renderer.render(this.scene, this.camera)
    }
    window.addEventListener('resize', this.onResize)

    this.clock = new THREE.Clock()
    if (REDUCED_MOTION) {
      this.renderer.render(this.scene, this.camera)
    } else {
      this.renderer.setAnimationLoop(() => {
        this.uniforms.uTime.value = this.clock.getElapsedTime()
        this.renderer.render(this.scene, this.camera)
      })
    }
  }

  unmount() {
    this.renderer?.setAnimationLoop(null)
    window.removeEventListener('resize', this.onResize)
    this.scene?.traverse((obj) => {
      obj.geometry?.dispose?.()
      obj.material?.dispose?.()
    })
    this.renderer?.dispose()
    this.renderer?.domElement?.remove()
  }
}
