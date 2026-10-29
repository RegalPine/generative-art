import { describe, it, expect } from 'vitest'
import { createSeed } from '../core/seed'
import { createSimplexNoise } from '../field/noise'
import { createFractalNoise } from '../field/fractal'
import { CurlField } from '../field/fields'
import { FlowField, MagneticField, DomainWarpField } from '../field/advanced'
import { PoissonDistribution, GoldenDistribution, SpiralDistribution } from '../composition/distributions'
import { applySymmetry, assignHierarchy, applyRhythm } from '../composition/advanced'
import { OrbitMotion, PulseMotion, MotionComposer } from '../motion/additional'
import { createMaterialStack } from '../material/stack'
import { parseHexColor, interpolateOKLab } from '../material/color'
import { FPSMonitor } from '../performance/monitor'
import { getTierConfig } from '../performance/tier'
import { detectDevice, detectInitialTier } from '../performance/detect'
import { validatePreset } from '../preset/validation'
import { parseVersion, compareVersions, bumpVersion } from '../preset/version'
import { FLOW_PRESET } from '../preset/built-in'
import { getPerformanceConstraints } from '../preset/performance'
import { createWorkerRequest, getTransferables } from '../worker/protocol'
import { createDefaultPostProcessPipeline, createBloomEffect } from '../renderer/postprocess'
import { createDefaultCompositePipeline } from '../renderer/compositing'
import type { FieldContext } from '../field/types'
import type { PerformanceTier } from '../performance/tier'
import type { MotionState } from '../motion/types'

const SEMANTIC = { density: 0.5, complexity: 0.5, energy: 0.5, softness: 0.5, depth: 0.5, rhythm: 0.5, turbulence: 0.5, focus: 0.5 }

function makeFieldCtx(time = 0): FieldContext {
  return { time, delta: 0.016, seed: 42, viewport: { width: 800, height: 600 }, semantic: SEMANTIC }
}

// ─── Field Benchmarks ────────────────────────────────────────────────────────

describe('Field Performance', () => {
  it('SimplexNoise: 10,000 samples < 100ms', () => {
    const noise = createSimplexNoise(42)
    const start = performance.now()
    for (let i = 0; i < 10000; i++) {
      noise.sample(i * 0.01, i * 0.02)
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(100)
  })

  it('FractalNoise: 10,000 samples < 200ms', () => {
    const noise = createFractalNoise({ seed: 42, octaves: 4, lacunarity: 2, persistence: 0.5 })
    const start = performance.now()
    for (let i = 0; i < 10000; i++) {
      noise.sample(i * 0.01, i * 0.02)
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(200)
  })

  it('CurlField: 5,000 samples < 100ms', () => {
    const field = new CurlField({ seed: 42, scale: 0.01, octaves: 2 })
    const ctx = makeFieldCtx()
    const start = performance.now()
    for (let i = 0; i < 5000; i++) {
      field.sample({ x: i * 0.001, y: i * 0.002 }, ctx)
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(100)
  })

  it('FlowField: 5,000 samples < 100ms', () => {
    const field = new FlowField({ seed: 42, cols: 20, rows: 20 })
    const ctx = makeFieldCtx()
    const start = performance.now()
    for (let i = 0; i < 5000; i++) {
      field.sample({ x: (i % 100) * 0.01, y: Math.floor(i / 100) * 0.01 }, ctx)
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(100)
  })

  it('MagneticField: 1,000 samples < 50ms', () => {
    const field = new MagneticField({
      poles: [
        { center: { x: 0.5, y: 0.5 }, polarity: 1, strength: 1 },
        { center: { x: 0.2, y: 0.8 }, polarity: -1, strength: 0.5 },
      ],
    })
    const ctx = makeFieldCtx()
    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      field.sample({ x: i * 0.001, y: i * 0.001 }, ctx)
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(50)
  })

  it('DomainWarpField: 1,000 samples < 100ms', () => {
    const field = new DomainWarpField({ seed: 42, scale: 0.05, octaves: 2, persistence: 0.5, lacunarity: 2, strength: 0.2 })
    const ctx = makeFieldCtx()
    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      field.sample({ x: i * 0.001, y: i * 0.001 }, ctx)
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(100)
  })
})

// ─── Composition Benchmarks ──────────────────────────────────────────────────

describe('Composition Performance', () => {
  const seed = createSeed(42)

  it('PoissonDistribution: 500 points < 200ms', () => {
    const dist = new PoissonDistribution(0.05, 30)
    const start = performance.now()
    const points = dist.generate(500, seed)
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(200)
    expect(points.length).toBeGreaterThan(0)
  })

  it('GoldenDistribution: 1000 points < 50ms', () => {
    const dist = new GoldenDistribution()
    const start = performance.now()
    const points = dist.generate(1000, seed)
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(50)
    expect(points.length).toBe(1000)
  })

  it('SpiralDistribution: 500 points < 20ms', () => {
    const dist = new SpiralDistribution(5)
    const start = performance.now()
    const points = dist.generate(500, seed)
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(20)
    expect(points.length).toBe(500)
  })

  it('applySymmetry: 200 points × 3 modes < 20ms', () => {
    const points = Array.from({ length: 200 }, (_, i) => ({ x: i * 0.005, y: i * 0.003 }))
    const symSeed = createSeed(42)
    const start = performance.now()
    applySymmetry(points, { mode: 'radial', strength: 1, folds: 6 }, symSeed)
    applySymmetry(points, { mode: 'mirror', strength: 1 }, symSeed)
    applySymmetry(points, { mode: 'horizontal', strength: 1 }, symSeed)
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(20)
  })

  it('assignHierarchy: 500 points < 10ms', () => {
    const points = Array.from({ length: 500 }, (_, i) => ({ x: i * 0.002, y: i * 0.002 }))
    const hierSeed = createSeed(42)
    const start = performance.now()
    assignHierarchy(points, { primaryRatio: 0.2, secondaryRatio: 0.4, secondaryScale: 0.7, tertiaryScale: 0.4, secondaryOpacity: 0.8, tertiaryOpacity: 0.5 }, hierSeed)
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(10)
  })

  it('applyRhythm: 300 values × 5 modes < 20ms', () => {
    const rhythmSeed = createSeed(42)
    const start = performance.now()
    applyRhythm(300, { type: 'uniform', interval: 0.1, variation: 0.2 }, rhythmSeed)
    applyRhythm(300, { type: 'alternating', interval: 0.1, variation: 0.2 }, rhythmSeed)
    applyRhythm(300, { type: 'accelerating', interval: 0.1, variation: 0.2 }, rhythmSeed)
    applyRhythm(300, { type: 'decelerating', interval: 0.1, variation: 0.2 }, rhythmSeed)
    applyRhythm(300, { type: 'syncopated', interval: 0.1, variation: 0.2 }, rhythmSeed)
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(20)
  })
})

// ─── Motion Benchmarks ──────────────────────────────────────────────────────

describe('Motion Performance', () => {
  const motionSemantic = { energy: 0.5, rhythm: 0.5, turbulence: 0.5 }
  const mctx = { time: 0, delta: 0.016, seed: 42, viewport: { width: 800, height: 600 }, semantic: motionSemantic }
  const baseState = (): MotionState => ({ position: { x: 0.5, y: 0.5 }, rotation: 0, scale: { x: 1, y: 1 }, velocity: { x: 0, y: 0 }, angularVelocity: 0, opacity: 1 })

  it('OrbitMotion: 1000 updates < 20ms', () => {
    const motion = new OrbitMotion({ center: { x: 0.5, y: 0.5 }, radius: 0.1, speed: 1 })
    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      mctx.time = i * 0.016
      motion.update(baseState(), mctx)
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(20)
  })

  it('PulseMotion: 1000 updates < 20ms', () => {
    const motion = new PulseMotion({ frequency: 2, amplitude: 0.2 })
    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      mctx.time = i * 0.016
      motion.update(baseState(), mctx)
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(20)
  })

  it('MotionComposer: 500 updates with 3 layers < 30ms', () => {
    const composer = new MotionComposer([
        { motion: new OrbitMotion({ center: { x: 0.5, y: 0.5 }, radius: 0.1, speed: 1 }), priority: 1, weight: 0.5 },
        { motion: new PulseMotion({ frequency: 2, amplitude: 0.2 }), priority: 2, weight: 0.3 },
        { motion: new OrbitMotion({ center: { x: 0.3, y: 0.3 }, radius: 0.05, speed: 0.5 }), priority: 3, weight: 0.2 },
      ])
    const start = performance.now()
    for (let i = 0; i < 500; i++) {
      mctx.time = i * 0.016
      composer.update(baseState(), mctx)
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(30)
  })
})

// ─── Material Benchmarks ────────────────────────────────────────────────────

describe('Material Performance', () => {
  it('parseHexColor: 10,000 parses < 50ms', () => {
    const start = performance.now()
    for (let i = 0; i < 10000; i++) {
      parseHexColor('#ff6600')
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(50)
  })

  it('OKLab interpolation: 5,000 interpolations < 100ms', () => {
    const start = performance.now()
    for (let i = 0; i < 5000; i++) {
      interpolateOKLab('#ff0000', '#0000ff', i / 5000)
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(100)
  })

  it('MaterialStack: 1000 create + query < 20ms', () => {
    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      const stack = createMaterialStack({ color: '#ff0000', opacity: 0.8 })
      void stack.size
      void stack.baseColor
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(20)
  })
})

// ─── Preset Benchmarks ──────────────────────────────────────────────────────

describe('Preset Performance', () => {
  it('validatePreset: 1000 validations < 50ms', () => {
    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      validatePreset(FLOW_PRESET)
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(50)
  })

  it('parseVersion + compareVersions: 5000 ops < 20ms', () => {
    const start = performance.now()
    for (let i = 0; i < 5000; i++) {
      parseVersion('1.2.3')
      compareVersions('1.2.3', '1.2.4')
      bumpVersion('1.2.3', 'minor')
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(20)
  })

  it('getPerformanceConstraints: 1000 lookups < 10ms', () => {
    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      getPerformanceConstraints('balanced')
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(10)
  })
})

// ─── Performance System Benchmarks ───────────────────────────────────────────

describe('Performance System', () => {
  it('FPSMonitor: 1000 ticks < 20ms', () => {
    const monitor = new FPSMonitor(60)
    monitor.start()
    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      monitor.tick(i * 16.67)
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(20)
    monitor.stop()
  })

  it('getTierConfig: 1000 lookups < 5ms', () => {
    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      getTierConfig(2 as PerformanceTier)
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(5)
  })

  it('detectDevice: 100 calls < 20ms', () => {
    const start = performance.now()
    for (let i = 0; i < 100; i++) {
      detectDevice()
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(20)
  })

  it('detectInitialTier: 100 calls < 20ms', () => {
    const start = performance.now()
    for (let i = 0; i < 100; i++) {
      detectInitialTier()
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(20)
  })
})

// ─── Worker Protocol Benchmarks ─────────────────────────────────────────────

describe('Worker Protocol Performance', () => {
  it('createWorkerRequest: 5000 requests < 20ms', () => {
    const start = performance.now()
    for (let i = 0; i < 5000; i++) {
      createWorkerRequest(i, 'computeField', { positions: new Float32Array(100) })
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(20)
  })

  it('getTransferables: 1000 extractions < 20ms', () => {
    const data = new Float32Array(1000)
    const response = { id: 1, type: 'result' as const, payload: { data }, timestamp: 0 }
    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      getTransferables(response)
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(20)
  })
})

// ─── Renderer Utilities Benchmarks ───────────────────────────────────────────

describe('Renderer Utilities Performance', () => {
  it('createDefaultPostProcessPipeline: 500 calls < 20ms', () => {
    const start = performance.now()
    for (let i = 0; i < 500; i++) {
      createDefaultPostProcessPipeline()
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(20)
  })

  it('createBloomEffect: 1000 calls < 10ms', () => {
    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      createBloomEffect({ threshold: 0.5, radius: 0.3, intensity: 0.8 })
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(10)
  })

  it('createDefaultCompositePipeline: 500 calls < 20ms', () => {
    const scene = { layers: [{ id: 'l1', drawCommands: [], zIndex: 0, opacity: 1 }], width: 800, height: 600, time: 0 }
    const start = performance.now()
    for (let i = 0; i < 500; i++) {
      createDefaultCompositePipeline(scene)
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(20)
  })
})
