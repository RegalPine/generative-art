/**
 * Additional field types — FlowField, MagneticField, FieldMask, DomainWarp.
 *
 * These complete the P1 field system.
 */

import type { Point, Vector } from '../geometry/types'
import type {
  FieldContext,
  VectorField,
  ScalarField,
  FieldMask as FieldMaskInterface,
  DomainWarpConfig,
  NoiseSource,
} from './types'
import { createFractalNoise } from './fractal'
import { vecAdd, vecScale, pointDistance } from '../core/math'

// ─── Flow Field ──────────────────────────────────────────────────────────

/**
 * Flow field — a vector field that represents a steady flow direction.
 *
 * Unlike noise-based fields, flow field uses interpolated direction vectors
 * placed on a grid, creating smooth continuous flow patterns.
 */
export class FlowField implements VectorField {
  readonly type = 'flow'
  private gridCols: number
  private gridRows: number
  private directions: Vector[]
  private timeScale: number

  constructor(config: {
    seed: number
    cols?: number
    rows?: number
    timeScale?: number
  }) {
    this.gridCols = config.cols ?? 10
    this.gridRows = config.rows ?? 10
    this.timeScale = config.timeScale ?? 0.1

    // Generate deterministic direction grid using seeded noise
    const noise = createFractalNoise({
      seed: config.seed,
      octaves: 3,
      persistence: 0.5,
      lacunarity: 2,
      scale: 1,
    })

    this.directions = []
    for (let r = 0; r < this.gridRows; r++) {
      for (let c = 0; c < this.gridCols; c++) {
        const nx = c / this.gridCols
        const ny = r / this.gridRows
        const angle = noise.sample(nx * 4, ny * 4) * Math.PI * 2
        this.directions.push({
          x: Math.cos(angle),
          y: Math.sin(angle),
        })
      }
    }
  }

  sample(point: Point, context: FieldContext): Vector {
    // Map point [0,1] to grid coordinates
    const gx = point.x * (this.gridCols - 1)
    const gy = point.y * (this.gridRows - 1)

    // Bilinear interpolation
    const c0 = Math.floor(gx)
    const r0 = Math.floor(gy)
    const c1 = Math.min(c0 + 1, this.gridCols - 1)
    const r1 = Math.min(r0 + 1, this.gridRows - 1)
    const fx = gx - c0
    const fy = gy - r0

    const idx = (r: number, c: number) => r * this.gridCols + c
    const v00 = this.directions[idx(r0, c0)]!
    const v10 = this.directions[idx(r0, c1)]!
    const v01 = this.directions[idx(r1, c0)]!
    const v11 = this.directions[idx(r1, c1)]!

    // Bilinear interpolation of direction vectors
    const top: Vector = {
      x: v00.x * (1 - fx) + v10.x * fx,
      y: v00.y * (1 - fx) + v10.y * fx,
    }
    const bottom: Vector = {
      x: v01.x * (1 - fx) + v11.x * fx,
      y: v01.y * (1 - fx) + v11.y * fx,
    }

    const result: Vector = {
      x: top.x * (1 - fy) + bottom.x * fy,
      y: top.y * (1 - fy) + bottom.y * fy,
    }

    // Add subtle time variation
    const timeAngle = context.time * this.timeScale
    const cos = Math.cos(timeAngle)
    const sin = Math.sin(timeAngle)
    return {
      x: result.x * cos - result.y * sin,
      y: result.x * sin + result.y * cos,
    }
  }
}

// ─── Magnetic Field ──────────────────────────────────────────────────────

/**
 * Magnetic field — simulates magnetic-like attraction/repulsion.
 *
 * Uses polarity to determine attraction (-1) or repulsion (+1).
 * Field strength varies with distance and follows an inverse-square law.
 */
export class MagneticField implements VectorField {
  readonly type = 'magnetic'
  private poles: Array<{ center: Point; polarity: number; strength: number }>

  constructor(config: {
    poles: Array<{ center: Point; polarity?: number; strength: number }>
  }) {
    this.poles = config.poles.map((p) => ({
      center: p.center,
      polarity: p.polarity ?? 1,
      strength: p.strength,
    }))
  }

  sample(point: Point, _context: FieldContext): Vector {
    let result: Vector = { x: 0, y: 0 }

    for (const pole of this.poles) {
      const dx = point.x - pole.center.x
      const dy = point.y - pole.center.y
      const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 0.01)

      // Inverse-square law with polarity
      const force = (pole.polarity * pole.strength) / (dist * dist)
      const dirX = dx / dist
      const dirY = dy / dist

      result = vecAdd(result, { x: dirX * force, y: dirY * force })
    }

    return result
  }
}

// ─── Field Mask ──────────────────────────────────────────────────────────

/**
 * Field mask — modulates a field's output by a scalar mask.
 *
 * Mask values ∈ [0, 1]:
 *   0 = field fully inactive
 *   1 = field fully active
 */
export class MaskedField implements VectorField {
  readonly type = 'masked'
  private field: VectorField
  private mask: FieldMaskInterface

  constructor(field: VectorField, mask: FieldMaskInterface) {
    this.field = field
    this.mask = mask
  }

  sample(point: Point, context: FieldContext): Vector {
    const v = this.field.sample(point, context)
    const m = this.mask.sample(point, context)
    return vecScale(v, m)
  }
}

/** Radial mask — active within a radius, falloff at edges */
export class RadialMask implements FieldMaskInterface {
  private center: Point
  private radius: number
  private falloffType: 'linear' | 'smooth' | 'sharp'

  constructor(
    center?: Point,
    radius?: number,
    falloffType?: 'linear' | 'smooth' | 'sharp',
  ) {
    this.center = center ?? { x: 0.5, y: 0.5 }
    this.radius = radius ?? 0.5
    this.falloffType = falloffType ?? 'smooth'
  }

  sample(point: Point, _context: FieldContext): number {
    const dist = pointDistance(point, this.center)
    if (dist >= this.radius) return 0

    const t = dist / this.radius
    switch (this.falloffType) {
      case 'linear':
        return 1 - t
      case 'smooth':
        return 1 - t * t * (3 - 2 * t)
      case 'sharp':
        return t < 0.8 ? 1 : 1 - (t - 0.8) / 0.2
      default:
        return 1
    }
  }
}

/** Rectangular mask — active within a rectangle */
export class RectMask implements FieldMaskInterface {
  private x: number
  private y: number
  private width: number
  private height: number
  private feather: number

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    feather?: number,
  ) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.feather = feather ?? 0.05
  }

  sample(point: Point, _context: FieldContext): number {
    const px = point.x
    const py = point.y

    // Distance from rectangle edges
    const dxLeft = px - this.x
    const dxRight = this.x + this.width - px
    const dyTop = py - this.y
    const dyBottom = this.y + this.height - py

    // Outside check
    if (dxLeft < 0 || dxRight < 0 || dyTop < 0 || dyBottom < 0) return 0

    // Feather at edges
    const f = this.feather
    const fx = Math.min(dxLeft / f, dxRight / f, 1)
    const fy = Math.min(dyTop / f, dyBottom / f, 1)

    return Math.min(fx, fy, 1)
  }
}

// ─── Domain Warping ──────────────────────────────────────────────────────

/**
 * Domain warping — distorts the sampling coordinates using noise.
 *
 * Creates organic, swirling patterns by warping the input space
 * before sampling another noise function.
 *
 * Single warp:  N(warp(x,y) + x, y)
 * Double warp:  N(warp2(warp1(x,y)), ...)
 */
export class DomainWarpField implements ScalarField {
  readonly type = 'domain-warp'
  private warpNoiseX: NoiseSource
  private warpNoiseY: NoiseSource
  private sampleNoise: NoiseSource
  private strength: number
  private secondaryStrength: number
  private scale: number

  constructor(config: DomainWarpConfig) {
    this.strength = config.strength
    this.scale = config.scale
    this.secondaryStrength = config.secondary?.strength ?? 0

    // Primary warp noise
    this.warpNoiseX = createFractalNoise({
      seed: config.seed,
      octaves: config.octaves,
      persistence: config.persistence,
      lacunarity: config.lacunarity,
      scale: config.scale,
    })
    this.warpNoiseY = createFractalNoise({
      seed: config.seed + 7777,
      octaves: config.octaves,
      persistence: config.persistence,
      lacunarity: config.lacunarity,
      scale: config.scale,
    })

    // Secondary warp (optional)
    if (config.secondary) {
      this.warpNoiseX = createFractalNoise({
        seed: config.seed + 3333,
        octaves: config.octaves,
        persistence: config.persistence,
        lacunarity: config.lacunarity,
        scale: config.secondary.scale,
      })
      this.warpNoiseY = createFractalNoise({
        seed: config.seed + 5555,
        octaves: config.octaves,
        persistence: config.persistence,
        lacunarity: config.lacunarity,
        scale: config.secondary.scale,
      })
      this.secondaryStrength = config.secondary.strength
    }

    // Sampling noise
    this.sampleNoise = createFractalNoise({
      seed: config.seed + 9999,
      octaves: config.octaves,
      persistence: config.persistence,
      lacunarity: config.lacunarity,
      scale: config.scale,
    })
  }

  sample(point: Point, context: FieldContext): number {
    const t = context.time * 0.05
    const px = point.x * this.scale
    const py = point.y * this.scale

    // First warp
    const wx = this.warpNoiseX.sample(px + t, py + t) * this.strength
    const wy = this.warpNoiseY.sample(px + t, py + t) * this.strength

    if (this.secondaryStrength > 0) {
      // Second warp layer
      const wx2 = this.warpNoiseX.sample(px + wx + t * 0.5, py + wy + t * 0.5) * this.secondaryStrength
      const wy2 = this.warpNoiseY.sample(px + wx + t * 0.5, py + wy + t * 0.5) * this.secondaryStrength
      return this.sampleNoise.sample(px + wx + wx2, py + wy + wy2)
    }

    return this.sampleNoise.sample(px + wx, py + wy)
  }
}
