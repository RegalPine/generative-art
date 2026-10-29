import { describe, it, expect } from 'vitest'
import { createSeed } from './core/seed'
import { createSimplexNoise } from './field/noise'
import { CurlField } from './field/fields'
import { FlowField, MagneticField } from './field/advanced'
import { PoissonDistribution, GoldenDistribution, SpiralDistribution, ClusterDistribution } from './composition/distributions'
import { FLOW_PRESET, AURORA_PRESET, WAVE_PRESET } from './preset/built-in'
import { validatePreset } from './preset/validation'
import { OrbitMotion } from './motion/additional'
import { parseHexColor, interpolateOKLab, parseCSSColor } from './material/color'
import type { FieldContext } from './field/types'
import type { MotionState, MotionContext } from './motion/types'

/**
 * Visual Regression Tests — ensures deterministic output.
 *
 * Same seed + same config → same output, every time.
 * This verifies the core visual pipeline produces consistent results.
 */

const SEMANTIC = { density: 0.5, complexity: 0.5, energy: 0.5, softness: 0.5, depth: 0.5, rhythm: 0.5, turbulence: 0.3, focus: 0.5 }
const FIELD_CTX: FieldContext = { time: 0, delta: 0.016, seed: 42, viewport: { width: 800, height: 600 }, semantic: SEMANTIC }
const MOTION_CTX: MotionContext = { time: 1, delta: 0.016, seed: 42, viewport: { width: 800, height: 600 }, semantic: { energy: 0.5, rhythm: 0.5, turbulence: 0.3 } }
const BASE_STATE: MotionState = { position: { x: 0.5, y: 0.5 }, rotation: 0, scale: { x: 1, y: 1 }, velocity: { x: 0, y: 0 }, angularVelocity: 0, opacity: 1 }

describe('Visual Regression: Deterministic Seed', () => {
  it('same seed produces identical noise field', () => {
    const noise1 = createSimplexNoise(42)
    const noise2 = createSimplexNoise(42)

    for (let i = 0; i < 100; i++) {
      const x = i * 0.01
      const y = i * 0.013
      expect(noise1.sample(x, y)).toBe(noise2.sample(x, y))
    }
  })

  it('different seeds produce different noise', () => {
    const noise1 = createSimplexNoise(42)
    const noise2 = createSimplexNoise(99)

    let same = 0
    for (let i = 0; i < 100; i++) {
      const x = i * 0.01
      const y = i * 0.013
      if (noise1.sample(x, y) === noise2.sample(x, y)) same++
    }
    expect(same).toBeLessThan(5)
  })

  it('same seed produces identical CurlField', () => {
    const field1 = new CurlField({ seed: 42, scale: 1.0, octaves: 2 })
    const field2 = new CurlField({ seed: 42, scale: 1.0, octaves: 2 })

    for (let i = 0; i < 50; i++) {
      const p = { x: i * 0.02, y: i * 0.02 }
      const v1 = field1.sample(p, FIELD_CTX)
      const v2 = field2.sample(p, FIELD_CTX)
      expect(v1.x).toBe(v2.x)
      expect(v1.y).toBe(v2.y)
    }
  })

  it('same seed produces identical Poisson distribution', () => {
    const d1 = new PoissonDistribution(0.05)
    const d2 = new PoissonDistribution(0.05)
    const pts1 = d1.generate(50, createSeed(42))
    const pts2 = d2.generate(50, createSeed(42))

    expect(pts1.length).toBe(pts2.length)
    for (let i = 0; i < pts1.length; i++) {
      expect(pts1[i]!.x).toBe(pts2[i]!.x)
      expect(pts1[i]!.y).toBe(pts2[i]!.y)
    }
  })

  it('same seed produces identical Golden distribution', () => {
    const d1 = new GoldenDistribution()
    const d2 = new GoldenDistribution()
    const pts1 = d1.generate(100, createSeed(42))
    const pts2 = d2.generate(100, createSeed(42))

    expect(pts1.length).toBe(pts2.length)
    for (let i = 0; i < pts1.length; i++) {
      expect(pts1[i]!.x).toBe(pts2[i]!.x)
      expect(pts1[i]!.y).toBe(pts2[i]!.y)
    }
  })

  it('same seed produces identical Spiral distribution', () => {
    const d1 = new SpiralDistribution(3)
    const d2 = new SpiralDistribution(3)
    const pts1 = d1.generate(80, createSeed(42))
    const pts2 = d2.generate(80, createSeed(42))

    expect(pts1.length).toBe(pts2.length)
    for (let i = 0; i < pts1.length; i++) {
      expect(pts1[i]!.x).toBe(pts2[i]!.x)
      expect(pts1[i]!.y).toBe(pts2[i]!.y)
    }
  })

  it('same seed produces identical motion output', () => {
    const orbit1 = new OrbitMotion({ center: { x: 0.5, y: 0.5 }, radius: 0.1, speed: 1 })
    const orbit2 = new OrbitMotion({ center: { x: 0.5, y: 0.5 }, radius: 0.1, speed: 1 })

    for (let i = 0; i < 20; i++) {
      const state = { ...BASE_STATE, position: { x: i * 0.05, y: i * 0.05 } }
      const r1 = orbit1.update(state, MOTION_CTX)
      const r2 = orbit2.update(state, MOTION_CTX)
      expect(r1.position.x).toBe(r2.position.x)
      expect(r1.position.y).toBe(r2.position.y)
    }
  })
})

describe('Visual Regression: Color Consistency', () => {
  it('parseHexColor produces consistent RGB', () => {
    const c1 = parseHexColor('#ff6600')
    const c2 = parseHexColor('#ff6600')
    expect(c1).toEqual(c2)
    expect(c1.r).toBe(255)
    expect(c1.g).toBe(102)
    expect(c1.b).toBe(0)
  })

  it('OKLab interpolation is deterministic', () => {
    const mid1 = interpolateOKLab('#ff0000', '#0000ff', 0.5)
    const mid2 = interpolateOKLab('#ff0000', '#0000ff', 0.5)
    expect(mid1).toBe(mid2)
  })

  it('OKLab interpolation t=0 returns near start color', () => {
    const start = interpolateOKLab('#ff0000', '#0000ff', 0)
    const startRGB = parseCSSColor(start)
    const expectRGB = parseHexColor('#ff0000')
    expect(Math.abs(startRGB.r - expectRGB.r)).toBeLessThan(2)
    expect(Math.abs(startRGB.g - expectRGB.g)).toBeLessThan(2)
    expect(Math.abs(startRGB.b - expectRGB.b)).toBeLessThan(2)
  })

  it('OKLab interpolation t=1 returns near end color', () => {
    const end = interpolateOKLab('#ff0000', '#0000ff', 1)
    const endRGB = parseCSSColor(end)
    const expectRGB = parseHexColor('#0000ff')
    expect(Math.abs(endRGB.r - expectRGB.r)).toBeLessThan(2)
    expect(Math.abs(endRGB.g - expectRGB.g)).toBeLessThan(2)
    expect(Math.abs(endRGB.b - expectRGB.b)).toBeLessThan(2)
  })
})

describe('Visual Regression: Preset Consistency', () => {
  it('FLOW_PRESET is stable across calls', () => {
    const v1 = validatePreset(FLOW_PRESET)
    const v2 = validatePreset(FLOW_PRESET)
    expect(v1).toEqual(v2)
    expect(v1.valid).toBe(true)
  })

  it('all built-in presets have valid semantic ranges', () => {
    const presets = [FLOW_PRESET, AURORA_PRESET, WAVE_PRESET]
    for (const preset of presets) {
      if (preset.semantic) {
        for (const [, value] of Object.entries(preset.semantic)) {
          expect(value).toBeGreaterThanOrEqual(0)
          expect(value).toBeLessThanOrEqual(1)
        }
      }
    }
  })

  it('preset geometry count is positive', () => {
    for (const preset of [FLOW_PRESET, AURORA_PRESET, WAVE_PRESET]) {
      expect(preset.geometry!.count).toBeGreaterThan(0)
      expect(preset.geometry!.count).toBeLessThanOrEqual(10000)
    }
  })
})

describe('Visual Regression: Field Continuity', () => {
  it('CurlField produces continuous vectors (nearby points → similar vectors)', () => {
    const field = new CurlField({ seed: 42, scale: 1.0, octaves: 2 })

    const p1 = { x: 0.5, y: 0.5 }
    const p2 = { x: 0.501, y: 0.501 }
    const v1 = field.sample(p1, FIELD_CTX)
    const v2 = field.sample(p2, FIELD_CTX)

    const dx = v1.x - v2.x
    const dy = v1.y - v2.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    expect(dist).toBeLessThan(0.1)
  })

  it('FlowField produces bounded vectors', () => {
    const field = new FlowField({ seed: 42, cols: 20, rows: 20 })

    for (let i = 0; i < 50; i++) {
      const p = { x: i * 0.02, y: i * 0.02 }
      const v = field.sample(p, FIELD_CTX)
      expect(Math.abs(v.x)).toBeLessThan(10)
      expect(Math.abs(v.y)).toBeLessThan(10)
    }
  })

  it('MagneticField produces finite vectors', () => {
    const field = new MagneticField({
      poles: [
        { center: { x: 0.3, y: 0.3 }, polarity: 1, strength: 1 },
        { center: { x: 0.7, y: 0.7 }, polarity: -1, strength: 0.5 },
      ],
    })

    for (let i = 0; i < 50; i++) {
      const p = { x: 0.1 + i * 0.016, y: 0.1 + i * 0.016 }
      const v = field.sample(p, FIELD_CTX)
      expect(Number.isFinite(v.x)).toBe(true)
      expect(Number.isFinite(v.y)).toBe(true)
    }
  })
})

describe('Visual Regression: Distribution Bounds', () => {
  it('all distributions produce points in [0,1] × [0,1]', () => {
    const distributions = [
      new PoissonDistribution(0.05),
      new GoldenDistribution(),
      new SpiralDistribution(3),
      new ClusterDistribution(5, 0.05),
    ]

    for (const dist of distributions) {
      const points = dist.generate(50, createSeed(42))
      for (const p of points) {
        expect(p.x).toBeGreaterThanOrEqual(0)
        expect(p.x).toBeLessThanOrEqual(1)
        expect(p.y).toBeGreaterThanOrEqual(0)
        expect(p.y).toBeLessThanOrEqual(1)
      }
    }
  })
})
