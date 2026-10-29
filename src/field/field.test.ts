import { describe, it, expect } from 'vitest'
import { createSimplexNoise } from './noise'
import { createFractalNoise } from './fractal'
import { CurlField, ScalarNoiseField, VectorNoiseField, createForceField, CompositeField, applyFalloff } from './fields'

const fieldCtx = {
  time: 0,
  delta: 0.016,
  seed: 42,
  viewport: { width: 800, height: 600 },
  semantic: { density: 0.5, complexity: 0.5, energy: 0.5, softness: 0.5, depth: 0.5, rhythm: 0.5, turbulence: 0.5, focus: 0.5 },
}

describe('SimplexNoise', () => {
  it('should be deterministic', () => {
    const n1 = createSimplexNoise(42)
    const n2 = createSimplexNoise(42)
    for (let i = 0; i < 50; i++) {
      const x = i * 0.1
      const y = i * 0.2
      expect(n1.sample(x, y)).toBeCloseTo(n2.sample(x, y), 10)
    }
  })

  it('different seeds produce different values', () => {
    const n1 = createSimplexNoise(1)
    const n2 = createSimplexNoise(2)
    let allSame = true
    for (let i = 0; i < 20; i++) {
      if (n1.sample(i * 0.3, i * 0.7) !== n2.sample(i * 0.3, i * 0.7)) {
        allSame = false
        break
      }
    }
    expect(allSame).toBe(false)
  })

  it('should return values in approximately [-1, 1]', () => {
    const noise = createSimplexNoise(99)
    for (let i = 0; i < 200; i++) {
      const v = noise.sample(i * 0.05, i * 0.07)
      expect(v).toBeGreaterThanOrEqual(-1.5)
      expect(v).toBeLessThanOrEqual(1.5)
    }
  })

  it('supports 3D noise', () => {
    const noise = createSimplexNoise(42)
    const v1 = noise.sample(0.5, 0.5, 0.5)
    const v2 = noise.sample(0.5, 0.5, 0.5)
    expect(v1).toBe(v2) // deterministic
    expect(typeof v1).toBe('number')
  })
})

describe('FractalNoise', () => {
  it('should be deterministic', () => {
    const n1 = createFractalNoise({ seed: 42 })
    const n2 = createFractalNoise({ seed: 42 })
    for (let i = 0; i < 30; i++) {
      expect(n1.sample(i * 0.1, i * 0.2)).toBeCloseTo(n2.sample(i * 0.1, i * 0.2), 10)
    }
  })

  it('should normalize output to approximately [-1, 1]', () => {
    const noise = createFractalNoise({ seed: 42, octaves: 6 })
    for (let i = 0; i < 100; i++) {
      const v = noise.sample(i * 0.05, i * 0.07)
      expect(v).toBeGreaterThanOrEqual(-1.5)
      expect(v).toBeLessThanOrEqual(1.5)
    }
  })
})

describe('ScalarNoiseField', () => {
  it('should sample a scalar value', () => {
    const field = new ScalarNoiseField({ seed: 42, scale: 2 })
    const v = field.sample({ x: 0.5, y: 0.5 }, fieldCtx)
    expect(typeof v).toBe('number')
  })
})

describe('VectorNoiseField', () => {
  it('should sample a vector value', () => {
    const field = new VectorNoiseField({ seed: 42, scale: 2 })
    const v = field.sample({ x: 0.5, y: 0.5 }, fieldCtx)
    expect(typeof v.x).toBe('number')
    expect(typeof v.y).toBe('number')
  })
})

describe('CurlField', () => {
  it('should produce a vector', () => {
    const field = new CurlField({ seed: 42, scale: 3 })
    const v = field.sample({ x: 0.5, y: 0.5 }, fieldCtx)
    expect(typeof v.x).toBe('number')
    expect(typeof v.y).toBe('number')
  })

  it('should be deterministic', () => {
    const f1 = new CurlField({ seed: 42, scale: 3 })
    const f2 = new CurlField({ seed: 42, scale: 3 })
    const v1 = f1.sample({ x: 0.3, y: 0.7 }, fieldCtx)
    const v2 = f2.sample({ x: 0.3, y: 0.7 }, fieldCtx)
    expect(v1.x).toBeCloseTo(v2.x, 10)
    expect(v1.y).toBeCloseTo(v2.y, 10)
  })
})

describe('ForceField', () => {
  it('attractor pulls toward center', () => {
    const field = createForceField({ type: 'attractor', strength: 1, center: { x: 0.5, y: 0.5 } })
    const v = field.sample({ x: 0, y: 0.5 }, fieldCtx)
    expect(v.x).toBeGreaterThan(0) // pulling right toward center
  })

  it('repulsor pushes away from center', () => {
    const field = createForceField({ type: 'repulsor', strength: 1, center: { x: 0.5, y: 0.5 } })
    const v = field.sample({ x: 0, y: 0.5 }, fieldCtx)
    expect(v.x).toBeLessThan(0) // pushing left away from center
  })

  it('directional produces uniform field', () => {
    const field = createForceField({ type: 'directional', strength: 2, direction: { x: 1, y: 0 } })
    const v1 = field.sample({ x: 0.1, y: 0.1 }, fieldCtx)
    const v2 = field.sample({ x: 0.9, y: 0.9 }, fieldCtx)
    expect(v1.x).toBeCloseTo(v2.x, 10)
    expect(v1.x).toBeCloseTo(2, 5)
  })

  it('vortex produces rotational flow', () => {
    const field = createForceField({ type: 'vortex', strength: 1, center: { x: 0.5, y: 0.5 } })
    const v = field.sample({ x: 1, y: 0.5 }, fieldCtx)
    // At (1, 0.5), radial direction is (1,0), perpendicular should be (0,1) or (0,-1)
    expect(Math.abs(v.x)).toBeLessThan(0.01) // mostly vertical
    expect(Math.abs(v.y)).toBeGreaterThan(0.5) // significant vertical
  })
})

describe('CompositeField', () => {
  it('should sum multiple fields', () => {
    const f1 = createForceField({ type: 'directional', strength: 1, direction: { x: 1, y: 0 } })
    const f2 = createForceField({ type: 'directional', strength: 1, direction: { x: 0, y: 1 } })
    const composite = new CompositeField([f1, f2])
    const v = composite.sample({ x: 0.5, y: 0.5 }, fieldCtx)
    expect(v.x).toBeCloseTo(1, 5)
    expect(v.y).toBeCloseTo(1, 5)
  })
})

describe('Falloff', () => {
  it('constant falloff returns full value', () => {
    expect(applyFalloff(1, 0.5, 1, 'constant')).toBe(1)
  })

  it('linear falloff at edge returns 0', () => {
    expect(applyFalloff(1, 1, 1, 'linear')).toBeCloseTo(0, 5)
  })

  it('linear falloff at center returns full value', () => {
    expect(applyFalloff(1, 0, 1, 'linear')).toBeCloseTo(1, 5)
  })

  it('beyond radius returns 0', () => {
    expect(applyFalloff(1, 1.5, 1, 'linear')).toBe(0)
    expect(applyFalloff(1, 1.5, 1, 'gaussian')).toBe(0)
  })
})
