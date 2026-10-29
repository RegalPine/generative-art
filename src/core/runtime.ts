/**
 * Core runtime — Mathematical curve backgrounds.
 *
 * Parametric curves, special functions, and fractal curves
 * for generative art backgrounds.
 */

import { normalizeConfig, normalizeSemanticConfig } from './config'
import { createLifecycleStateMachine, LifecycleState } from './lifecycle'
import { createSeed } from './seed'
import { createScheduler } from './scheduler'
import type { GenerativeArt, GenerativeArtConfig, SemanticArtConfig, Viewport, Scene, SceneLayer } from './types'
import type { Renderer, RenderScene } from '../renderer/types'
import { Canvas2DRenderer } from '../renderer/canvas2d'
import { getPreset } from '../preset/registry'
import type { Point } from '../geometry/types'
import {
  createLissajous,
  createRose,
  createLogSpiral,
  createArchimedeanSpiral,
  createCycloid,
  createCardioid,
  createAstroid,
  createAMWave,
  createFMWave,
  createMoire,
  createFourier,
  createGaussian,
  createSinc,
  createCatenary,
  createKoch,
  createDragon,
  createHilbert,
  createCubicBezier,
  createQuadraticBezier,
  createSmoothCurve,
  type ArtCurve,
} from '../geometry/math-curves'
import {
  buildLissajousScene,
  buildRoseScene,
  buildLogSpiralScene,
  buildArchimedeanSpiralScene,
  buildCycloidScene,
  buildCardioidScene,
  buildAstroidScene,
  buildAMWaveScene,
  buildFMWaveScene,
  buildMoireScene,
  buildFourierScene,
  buildGaussianScene,
  buildSincScene,
  buildCatenaryScene,
  buildKochScene,
  buildDragonScene,
  buildHilbertScene,
  buildLevyCScene,
  buildSierpinskiTriangleScene,
  buildFractalTreeScene,
  buildPeanoScene,
  buildMobiusStripScene,
  buildTorusScene,
  buildTrefoilKnotScene,
  buildFigure8KnotScene,
  buildBorromeanRingsScene,
  buildSuperellipseScene,
  buildLemniscateScene,
  buildFoliumScene,
  buildWitchOfAgnesiScene,
  buildFermatSpiralScene,
  buildHyperbolicSpiralScene,
  buildEpicycloidScene,
  buildHypocycloidScene,
  buildInvoluteScene,
  buildConchoidScene,
  buildCissoidScene,
  buildTrisectrixScene,
  buildCassiniScene,
  buildButterflyScene,
  buildTorusKnotScene,
  buildParabolicSpiralScene,
  buildCartesianScene,
  buildSpringScene,
  buildDecayLissajousScene,
  buildRhodonea3DScene,
  buildHarmonographScene,
  buildSpirographScene,
  buildHeartScene,
  buildTheodorusScene,
  buildEpitrochoidScene,
  buildHypotrochoidScene,
} from '../scene/math-scene-builders'

const TAU = Math.PI * 2

/* ─── Instance Creation ─── */

export function createGenerativeArt(config: GenerativeArtConfig): GenerativeArt {
  const normalized = normalizeConfig(config)
  const lifecycle = createLifecycleStateMachine()
  const _seed = createSeed(normalized.seed)
  const scheduler = createScheduler()

  let currentSemantic = normalizeSemanticConfig(normalized.semantic)
  let viewport: Viewport = { width: 0, height: 0, dpr: 1, aspectRatio: 1 }
  let renderer: Renderer | null = null
  let canvas: HTMLCanvasElement | null = null
  let currentScene: Scene = { layers: [], width: 0, height: 0, time: 0 }
  let animationTime = 0

  function resolveCanvas(target: HTMLCanvasElement | string): HTMLCanvasElement {
    if (typeof target === 'string') {
      const el = document.querySelector(target)
      if (!el || !(el instanceof HTMLCanvasElement)) {
        throw new Error(`Canvas element not found: ${target}`)
      }
      return el
    }
    return target
  }

  function updateViewport(): void {
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const maxDpr = normalized.maxDpr ?? 2
    const effectiveDpr = Math.min(window.devicePixelRatio, maxDpr)
    viewport = { width: rect.width, height: rect.height, dpr: effectiveDpr, aspectRatio: rect.width / rect.height }
    canvas.width = rect.width * effectiveDpr
    canvas.height = rect.height * effectiveDpr
  }

  function frame(time: number, delta: number): void {
    animationTime = time
    currentScene = { ...currentScene, time: animationTime }
    if (renderer && canvas) {
      renderer.render(currentScene as unknown as RenderScene, {
        time: animationTime, delta, viewport,
        dpr: viewport.dpr,
        quality: { tier: 0 as const, dpr: viewport.dpr, maxGeometryCount: 1000 },
      })
    }
  }

  const instance: GenerativeArt = {
    start(): void {
      if (!lifecycle.transition(LifecycleState.INITIALIZED)) {
        if (!lifecycle.is(LifecycleState.INITIALIZED)) return
      }
      canvas = resolveCanvas(normalized.target)
      updateViewport()
      renderer = new Canvas2DRenderer()
      renderer.initialize({ canvas, width: viewport.width, height: viewport.height, dpr: viewport.dpr, capabilities: renderer.capabilities })
      currentScene = buildScene(normalized, viewport, _seed.value)
      lifecycle.transition(LifecycleState.RUNNING)
      if (normalized.animated !== false) scheduler.start(frame)
    },
    pause(): void { if (lifecycle.transition(LifecycleState.PAUSED)) scheduler.pause() },
    resume(): void { if (lifecycle.transition(LifecycleState.RUNNING)) scheduler.resume() },
    stop(): void { lifecycle.transition(LifecycleState.STOPPED); scheduler.stop(); animationTime = 0 },
    resize(width: number, height: number): void {
      if (!lifecycle.is(LifecycleState.RUNNING) && !lifecycle.is(LifecycleState.PAUSED)) return
      if (canvas) { canvas.style.width = `${width}px`; canvas.style.height = `${height}px` }
      updateViewport()
      if (renderer) renderer.resize({ width: viewport.width, height: viewport.height, dpr: viewport.dpr })
      currentScene = { ...currentScene, width: viewport.width, height: viewport.height }
    },
    update(config: Partial<SemanticArtConfig>): void {
      currentSemantic = normalizeSemanticConfig({ ...currentSemantic, ...config })
    },
    setPreset(_id: string): void {
      if (!lifecycle.is(LifecycleState.RUNNING) && !lifecycle.is(LifecycleState.PAUSED)) return
    },
    destroy(): void {
      scheduler.stop()
      if (renderer) { renderer.dispose(); renderer = null }
      canvas = null
      currentScene = { layers: [], width: 0, height: 0, time: 0 }
      lifecycle.transition(LifecycleState.DESTROYED)
    },
  }

  if (lifecycle.is(LifecycleState.CREATED)) lifecycle.transition(LifecycleState.INITIALIZED)
  return instance
}

/* ─── Scene Builder ─── */

function buildScene(
  config: GenerativeArtConfig,
  viewport: Viewport,
  seedValue: number,
): Scene {
  const presetId = typeof config.preset === 'string' ? config.preset : config.preset?.id
  if (!presetId) return { layers: [], width: viewport.width, height: viewport.height, time: 0 }

  const preset = getPreset(presetId)
  if (!preset) return { layers: [], width: viewport.width, height: viewport.height, time: 0 }

  const seed = createSeed(seedValue)
  const layers: SceneLayer[] = []
  const basePhase = seed.range(0, TAU)

  switch (presetId) {
    case 'flow':       buildFlow(layers, basePhase); break
    case 'aurora':     buildAurora(layers, basePhase); break
    case 'wave':       buildWave(layers, basePhase); break
    case 'ribbon':     buildRibbon(layers, basePhase); break
    case 'organic':    buildOrganic(layers); break
    case 'orbital':    buildOrbital(layers); break
    case 'mesh':       buildMesh(layers, basePhase); break
    case 'atmosphere': buildAtmosphere(layers, basePhase); break
    // Parametric curves
    case 'lissajous':       buildLissajousScene(layers, basePhase); break
    case 'rose':            buildRoseScene(layers, basePhase); break
    case 'logspiral':       buildLogSpiralScene(layers, basePhase); break
    case 'archspiral':      buildArchimedeanSpiralScene(layers, basePhase); break
    case 'cycloid':         buildCycloidScene(layers, basePhase); break
    case 'cardioid':        buildCardioidScene(layers, basePhase); break
    case 'astroid':         buildAstroidScene(layers, basePhase); break
    // Modulation functions
    case 'amwave':          buildAMWaveScene(layers, basePhase); break
    case 'fmwave':          buildFMWaveScene(layers, basePhase); break
    case 'moire':           buildMoireScene(layers, basePhase); break
    case 'fourier':         buildFourierScene(layers, basePhase); break
    // Natural forms
    case 'gaussian':        buildGaussianScene(layers, basePhase); break
    case 'sinc':            buildSincScene(layers, basePhase); break
    case 'catenary':        buildCatenaryScene(layers, basePhase); break
    // Fractal curves
    case 'koch':            buildKochScene(layers, basePhase); break
    case 'dragon':          buildDragonScene(layers, basePhase); break
    case 'hilbert':         buildHilbertScene(layers, basePhase); break
    case 'levyc':           buildLevyCScene(layers, basePhase); break
    case 'sierpinski':      buildSierpinskiTriangleScene(layers, basePhase); break
    case 'fractaltree':     buildFractalTreeScene(layers, basePhase); break
    case 'peano':           buildPeanoScene(layers, basePhase); break
    // Topological curves
    case 'mobius':          buildMobiusStripScene(layers, basePhase); break
    case 'torus':           buildTorusScene(layers, basePhase); break
    case 'trefoil':         buildTrefoilKnotScene(layers, basePhase); break
    case 'fig8knot':        buildFigure8KnotScene(layers, basePhase); break
    case 'borromean':       buildBorromeanRingsScene(layers, basePhase); break
    // Classical curves
    case 'superellipse':    buildSuperellipseScene(layers, basePhase); break
    case 'lemniscate':      buildLemniscateScene(layers, basePhase); break
    case 'folium':          buildFoliumScene(layers, basePhase); break
    case 'witch':           buildWitchOfAgnesiScene(layers, basePhase); break
    case 'fermat':          buildFermatSpiralScene(layers, basePhase); break
    case 'hypspiral':       buildHyperbolicSpiralScene(layers, basePhase); break
    // Cycloid variants
    case 'epicycloid':      buildEpicycloidScene(layers, basePhase); break
    case 'hypocycloid':     buildHypocycloidScene(layers, basePhase); break
    case 'involute':        buildInvoluteScene(layers, basePhase); break
    // Special curves
    case 'conchoid':        buildConchoidScene(layers, basePhase); break
    case 'cissoid':         buildCissoidScene(layers, basePhase); break
    case 'trisectrix':      buildTrisectrixScene(layers, basePhase); break
    // New beautiful curves
    case 'cassini':         buildCassiniScene(layers, basePhase); break
    case 'butterfly':       buildButterflyScene(layers, basePhase); break
    case 'torusknot':       buildTorusKnotScene(layers, basePhase); break
    case 'paraspiral':      buildParabolicSpiralScene(layers, basePhase); break
    case 'cartesian':       buildCartesianScene(layers, basePhase); break
    case 'spring':          buildSpringScene(layers, basePhase); break
    case 'decaylissajous':  buildDecayLissajousScene(layers, basePhase); break
    case 'rhodonea3d':      buildRhodonea3DScene(layers, basePhase); break
    case 'harmonograph':    buildHarmonographScene(layers, basePhase); break
    case 'spirograph':      buildSpirographScene(layers, basePhase); break
    case 'heart':           buildHeartScene(layers, basePhase); break
    case 'theodorus':       buildTheodorusScene(layers, basePhase); break
    case 'epitrochoid':     buildEpitrochoidScene(layers, basePhase); break
    case 'hypotrochoid':    buildHypotrochoidScene(layers, basePhase); break
    default:                buildDefault(layers, basePhase)
  }

  return { layers, width: viewport.width, height: viewport.height, time: 0 }
}

/* ─── Helper: create a curve layer ─── */

function makeCurveLayer(
  id: string,
  curve: ArtCurve,
  color: string,
  opacity: number,
  lineWidth: number,
  zIndex: number,
  blendMode: string = 'normal',
): SceneLayer {
  return {
    id,
    geometries: [],
    drawCommands: [{
      type: 'curve',
      path: curve,
      style: {
        color,
        opacity,
        blendMode,
        lineWidth,
        glow: 8,
        glowColor: color,
        lineCap: 'round',
        lineJoin: 'round',
      },
    }],
    material: {},
    zIndex,
    opacity,
  }
}

function makeBandLayer(
  id: string,
  curve: ArtCurve,
  color: string,
  opacity: number,
  bandWidth: number,
  zIndex: number,
  blendMode: string = 'screen',
): SceneLayer {
  return {
    id,
    geometries: [],
    drawCommands: [{
      type: 'filled-curve',
      path: curve,
      style: {
        color,
        opacity: opacity * 0.4,
        blendMode,
        lineWidth: bandWidth,
        glow: 20,
        glowColor: color,
        gradient: 'linear',
      },
    }],
    material: {},
    zIndex,
    opacity,
  }
}

/* ─── FLOW — Same shape, phase-shifted sine waves ─── */

function buildFlow(layers: SceneLayer[], basePhase: number): void {
  const count = 12
  const frequency = 3 // Same for all lines
  const amplitude = 0.03 // Same for all lines
  const phaseStep = Math.PI / 6 // Regular phase increment

  for (let i = 0; i < count; i++) {
    const baseY = 0.08 + (i / (count - 1)) * 0.84
    const phase = basePhase + i * phaseStep

    const pts: Point[] = []
    const steps = 80
    for (let j = 0; j <= steps; j++) {
      const x = j / steps
      const y = baseY + Math.sin(x * TAU * frequency + phase) * amplitude
      pts.push({ x, y })
    }

    const curve = createSmoothCurve(pts)
    const opacity = 0.2 + (1 - Math.abs(i / (count - 1) - 0.5) * 2) * 0.6
    const color = `hsl(210, 70%, ${45 + (1 - Math.abs(i / (count - 1) - 0.5) * 2) * 20}%)`
    layers.push(makeCurveLayer(`flow-${i}`, curve, color, opacity, 1.2, i, 'screen'))
  }
}

/* ─── AURORA — Same shape, phase-shifted wide bands ─── */

function buildAurora(layers: SceneLayer[], basePhase: number): void {
  const count = 8
  const frequency = 2 // Same for all
  const amplitude = 0.04 // Same for all
  const phaseStep = Math.PI / 4

  for (let i = 0; i < count; i++) {
    const baseY = 0.1 + (i / (count - 1)) * 0.8
    const phase = basePhase + i * phaseStep

    const pts: Point[] = []
    const steps = 80
    for (let j = 0; j <= steps; j++) {
      const x = j / steps
      const y = baseY + Math.sin(x * TAU * frequency + phase) * amplitude
      pts.push({ x, y })
    }

    const curve = createSmoothCurve(pts)
    const opacity = 0.3 + (1 - Math.abs(i / (count - 1) - 0.5) * 2) * 0.5
    const color = `hsl(150, 55%, ${40 + (1 - Math.abs(i / (count - 1) - 0.5) * 2) * 25}%)`
    layers.push(makeBandLayer(`aurora-${i}`, curve, color, opacity, 30, i, 'screen'))
  }
}

/* ─── WAVE — Same shape, phase-shifted sine waves ─── */

function buildWave(layers: SceneLayer[], basePhase: number): void {
  const count = 12
  const frequency = 2.5 // Same for all
  const amplitude = 0.025 // Same for all
  const phaseStep = Math.PI / 6

  for (let i = 0; i < count; i++) {
    const baseY = 0.08 + (i / (count - 1)) * 0.84
    const phase = basePhase + i * phaseStep

    const pts: Point[] = []
    const steps = 80
    for (let j = 0; j <= steps; j++) {
      const x = j / steps
      const y = baseY + Math.sin(x * TAU * frequency + phase) * amplitude
      pts.push({ x, y })
    }

    const curve = createSmoothCurve(pts)
    const opacity = 0.2 + (1 - Math.abs(i / (count - 1) - 0.5) * 2) * 0.6
    const color = `hsl(250, 60%, ${45 + (1 - Math.abs(i / (count - 1) - 0.5) * 2) * 20}%)`
    layers.push(makeCurveLayer(`wave-${i}`, curve, color, opacity, 1.2, i))
  }
}

/* ─── RIBBON — Same shape, phase-shifted wide bands ─── */

function buildRibbon(layers: SceneLayer[], basePhase: number): void {
  const count = 8
  const frequency = 2 // Same for all
  const amplitude = 0.05 // Same for all
  const phaseStep = Math.PI / 4

  for (let i = 0; i < count; i++) {
    const baseY = 0.1 + (i / (count - 1)) * 0.8
    const phase = basePhase + i * phaseStep

    const pts: Point[] = []
    const steps = 80
    for (let j = 0; j <= steps; j++) {
      const x = j / steps
      const y = baseY + Math.sin(x * TAU * frequency + phase) * amplitude
      pts.push({ x, y })
    }

    const curve = createSmoothCurve(pts)
    const opacity = 0.3 + (1 - Math.abs(i / (count - 1) - 0.5) * 2) * 0.5
    const color = `hsl(20, 65%, ${45 + (1 - Math.abs(i / (count - 1) - 0.5) * 2) * 20}%)`
    layers.push(makeBandLayer(`ribbon-${i}`, curve, color, opacity, 28, i, 'screen'))
  }
}

/* ── ORGANIC — Fibonacci spiral points ─── */

function buildOrganic(layers: SceneLayer[]): void {
  const count = 50
  const pts: Point[] = []

  for (let i = 0; i < count; i++) {
    const angle = i * 2.399963 // Golden angle
    const r = Math.sqrt(i / count) * 0.4
    pts.push({
      x: 0.5 + Math.cos(angle) * r,
      y: 0.5 + Math.sin(angle) * r,
    })
  }

  layers.push({
    id: 'organic-all',
    geometries: [],
    drawCommands: [{
      type: 'points',
      path: pts,
      style: {
        color: '#55cc44',
        opacity: 0.6,
        lineWidth: 4,
        glow: 15,
        glowColor: '#66ee55',
      },
    }],
    material: {},
    zIndex: 0,
    opacity: 0.6,
  })
}

/* ─── ORBITAL — Concentric circles with points ─── */

function buildOrbital(layers: SceneLayer[]): void {
  const orbits = 5
  const fibRadius = [1, 2, 3, 5, 8]

  for (let orbit = 0; orbit < orbits; orbit++) {
    const radius = (fibRadius[orbit]! / 10) * 0.35
    const count = 8 + orbit * 3
    const pts: Point[] = []

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * TAU
      pts.push({
        x: 0.5 + Math.cos(angle) * radius,
        y: 0.5 + Math.sin(angle) * radius,
      })
    }

    const opacity = 0.7 - orbit * 0.1
    layers.push({
      id: `orbital-${orbit}`,
      geometries: [],
      drawCommands: [{
        type: 'points',
        path: pts,
        style: {
          color: `hsl(${270 + orbit * 10}, 60%, ${55 + orbit * 5}%)`,
          opacity,
          lineWidth: 3.5 - orbit * 0.3,
          glow: 18 - orbit * 2,
          glowColor: `hsl(${270 + orbit * 10}, 70%, 60%)`,
        },
      }],
      material: {},
      zIndex: orbit,
      opacity,
    })
  }
}

/* ─── MESH — Same shape, phase-shifted horizontal and vertical waves ─── */

function buildMesh(layers: SceneLayer[], basePhase: number): void {
  const count = 10
  const frequency = 3 // Same for all
  const amplitude = 0.02 // Same for all
  const phaseStep = Math.PI / 5

  // Horizontal waves
  for (let i = 0; i < count; i++) {
    const baseY = 0.08 + (i / (count - 1)) * 0.84
    const phase = basePhase + i * phaseStep

    const pts: Point[] = []
    const steps = 60
    for (let j = 0; j <= steps; j++) {
      const x = j / steps
      const y = baseY + Math.sin(x * TAU * frequency + phase) * amplitude
      pts.push({ x, y })
    }

    const curve = createSmoothCurve(pts)
    const opacity = 0.2 + (1 - Math.abs(i / (count - 1) - 0.5) * 2) * 0.5
    const color = `hsl(185, 55%, ${45 + (1 - Math.abs(i / (count - 1) - 0.5) * 2) * 20}%)`
    layers.push(makeCurveLayer(`mesh-h-${i}`, curve, color, opacity, 1.0, i))
  }

  // Vertical waves (same shape, perpendicular)
  for (let i = 0; i < count; i++) {
    const baseX = 0.08 + (i / (count - 1)) * 0.84
    const phase = basePhase + i * phaseStep + Math.PI / 2 // 90° offset

    const pts: Point[] = []
    const steps = 60
    for (let j = 0; j <= steps; j++) {
      const y = j / steps
      const x = baseX + Math.sin(y * TAU * frequency + phase) * amplitude
      pts.push({ x, y })
    }

    const curve = createSmoothCurve(pts)
    const opacity = 0.15 + (1 - Math.abs(i / (count - 1) - 0.5) * 2) * 0.4
    const color = `hsl(185, 50%, ${42 + (1 - Math.abs(i / (count - 1) - 0.5) * 2) * 18}%)`
    layers.push(makeCurveLayer(`mesh-v-${i}`, curve, color, opacity, 0.8, count + i))
  }
}

/* ─── ATMOSPHERE — Same shape, phase-shifted gentle waves ─── */

function buildAtmosphere(layers: SceneLayer[], basePhase: number): void {
  const count = 6
  const frequency = 1.5 // Same for all
  const amplitude = 0.025 // Same for all
  const phaseStep = Math.PI / 3

  for (let i = 0; i < count; i++) {
    const baseY = 0.15 + (i / (count - 1)) * 0.7
    const phase = basePhase + i * phaseStep

    const pts: Point[] = []
    const steps = 60
    for (let j = 0; j <= steps; j++) {
      const x = j / steps
      const y = baseY + Math.sin(x * TAU * frequency + phase) * amplitude
      pts.push({ x, y })
    }

    const curve = createSmoothCurve(pts)
    const opacity = 0.25 + (1 - Math.abs(i / (count - 1) - 0.5) * 2) * 0.4
    const color = `hsl(215, 35%, ${50 + (1 - Math.abs(i / (count - 1) - 0.5) * 2) * 15}%)`
    layers.push(makeBandLayer(`atmosphere-${i}`, curve, color, opacity, 40, i, 'screen'))
  }
}

/* ─── DEFAULT — Same shape, phase-shifted ─── */

function buildDefault(layers: SceneLayer[], basePhase: number): void {
  const count = 8
  const frequency = 2.5
  const amplitude = 0.025
  const phaseStep = Math.PI / 4

  for (let i = 0; i < count; i++) {
    const baseY = 0.1 + (i / (count - 1)) * 0.8
    const phase = basePhase + i * phaseStep

    const pts: Point[] = []
    const steps = 60
    for (let j = 0; j <= steps; j++) {
      const x = j / steps
      const y = baseY + Math.sin(x * TAU * frequency + phase) * amplitude
      pts.push({ x, y })
    }

    const curve = createSmoothCurve(pts)
    const opacity = 0.3 + (1 - Math.abs(i / (count - 1) - 0.5) * 2) * 0.5
    layers.push(makeCurveLayer(`default-${i}`, curve, '#888888', opacity, 1.2, i))
  }
}
