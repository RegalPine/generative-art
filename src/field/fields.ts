/**
 * Field implementations — all concrete field types.
 *
 * Types:
 * - ScalarNoiseField: scalar fractal noise
 * - VectorNoiseField: two independent scalar noises → (vx, vy)
 * - CurlField: curl noise from scalar noise (Vx = ∂N/∂y, Vy = -∂N/∂x)
 * - AttractorField / RepulsorField / GravityField / VortexField / DirectionalField
 * - CompositeField: combine multiple fields
 * - TransformField: transform a field (scale/rotate/offset)
 */

import type { Point, Vector } from '../geometry/types'
import type {
  FieldContext,
  ScalarField,
  VectorField,
  NoiseFieldConfig,
  ForceFieldConfig,
  NoiseSource,
} from './types'
import { createFractalNoise } from './fractal'
import { vecAdd, vecLength } from '../core/math'

// ─── Scalar Noise Field ────────────────────────────────────────────────────

/** Scalar field that samples fractal noise */
export class ScalarNoiseField implements ScalarField {
  readonly type = 'scalar-noise'
  private noise: NoiseSource
  private config: Required<NoiseFieldConfig>

  constructor(config: Partial<NoiseFieldConfig> & { seed: number }) {
    this.config = {
      scale: config.scale ?? 1,
      octaves: config.octaves ?? 4,
      persistence: config.persistence ?? 0.5,
      lacunarity: config.lacunarity ?? 2,
    }
    this.noise = createFractalNoise({
      seed: config.seed,
      octaves: this.config.octaves,
      persistence: this.config.persistence,
      lacunarity: this.config.lacunarity,
      scale: this.config.scale,
    })
  }

  sample(point: Point, context: FieldContext): number {
    const t = context.time
    // Map normalized coords to noise space, add time for animation
    return this.noise.sample(
      point.x * this.config.scale + t * 0.1,
      point.y * this.config.scale + t * 0.1,
    )
  }
}

// ─── Vector Noise Field ────────────────────────────────────────────────────

/** Vector field built from two independent scalar noises */
export class VectorNoiseField implements VectorField {
  readonly type = 'vector-noise'
  private noiseX: NoiseSource
  private noiseY: NoiseSource
  private scale: number

  constructor(config: Partial<NoiseFieldConfig> & { seed: number }) {
    this.scale = config.scale ?? 1
    this.noiseX = createFractalNoise({
      seed: config.seed,
      octaves: config.octaves ?? 4,
      persistence: config.persistence ?? 0.5,
      lacunarity: config.lacunarity ?? 2,
      scale: this.scale,
    })
    // Offset seed for Y to decorrelate from X
    this.noiseY = createFractalNoise({
      seed: config.seed + 1000,
      octaves: config.octaves ?? 4,
      persistence: config.persistence ?? 0.5,
      lacunarity: config.lacunarity ?? 2,
      scale: this.scale,
    })
  }

  sample(point: Point, context: FieldContext): Vector {
    const t = context.time
    const sx = point.x * this.scale + t * 0.1
    const sy = point.y * this.scale + t * 0.1
    return {
      x: this.noiseX.sample(sx, sy),
      y: this.noiseY.sample(sx, sy),
    }
  }
}

// ─── Curl Field ────────────────────────────────────────────────────────────

/**
 * Curl noise field — derives a divergence-free vector field from scalar noise.
 *
 * Vx = ∂N/∂y
 * Vy = -∂N/∂x
 *
 * Produces continuous, fluid-like flow patterns.
 */
export class CurlField implements VectorField {
  readonly type = 'curl'
  private noise: NoiseSource
  private scale: number
  private epsilon = 0.001

  constructor(config: Partial<NoiseFieldConfig> & { seed: number }) {
    this.scale = config.scale ?? 1
    this.noise = createFractalNoise({
      seed: config.seed,
      octaves: config.octaves ?? 4,
      persistence: config.persistence ?? 0.5,
      lacunarity: config.lacunarity ?? 2,
      scale: this.scale,
    })
  }

  sample(point: Point, context: FieldContext): Vector {
    const t = context.time
    const px = point.x * this.scale + t * 0.1
    const py = point.y * this.scale + t * 0.1
    const e = this.epsilon

    // Partial derivatives via central differences
    const nRight = this.noise.sample(px + e, py)
    const nLeft = this.noise.sample(px - e, py)
    const nUp = this.noise.sample(px, py + e)
    const nDown = this.noise.sample(px, py - e)

    // Curl: Vx = ∂N/∂y, Vy = -∂N/∂x
    return {
      x: (nUp - nDown) / (2 * e),
      y: -(nRight - nLeft) / (2 * e),
    }
  }
}

// ─── Force Fields ──────────────────────────────────────────────────────────

/** Create a force field from configuration */
export function createForceField(config: ForceFieldConfig): VectorField {
  switch (config.type) {
    case 'attractor':
      return new AttractorField(config)
    case 'repulsor':
      return new RepulsorField(config)
    case 'gravity':
      return new GravityField(config)
    case 'vortex':
      return new VortexField(config)
    case 'directional':
      return new DirectionalField(config)
    case 'magnetic':
      return new MagneticFieldSingle(config)
    default:
      return new DirectionalField(config)
  }
}

/** Attractor — pulls toward center */
class AttractorField implements VectorField {
  readonly type = 'attractor'
  private center: Point
  private strength: number

  constructor(config: ForceFieldConfig) {
    this.center = config.center ?? { x: 0.5, y: 0.5 }
    this.strength = config.strength
  }

  sample(point: Point, _context: FieldContext): Vector {
    const dx = this.center.x - point.x
    const dy = this.center.y - point.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 1e-6) return { x: 0, y: 0 }
    return {
      x: (dx / dist) * this.strength,
      y: (dy / dist) * this.strength,
    }
  }
}

/** Repulsor — pushes away from center */
class RepulsorField implements VectorField {
  readonly type = 'repulsor'
  private center: Point
  private strength: number

  constructor(config: ForceFieldConfig) {
    this.center = config.center ?? { x: 0.5, y: 0.5 }
    this.strength = config.strength
  }

  sample(point: Point, _context: FieldContext): Vector {
    const dx = point.x - this.center.x
    const dy = point.y - this.center.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 1e-6) return { x: 0, y: 0 }
    return {
      x: (dx / dist) * this.strength,
      y: (dy / dist) * this.strength,
    }
  }
}

/** Gravity — attraction with inverse-square falloff */
class GravityField implements VectorField {
  readonly type = 'gravity'
  private center: Point
  private strength: number
  private minDistance = 0.01

  constructor(config: ForceFieldConfig) {
    this.center = config.center ?? { x: 0.5, y: 0.5 }
    this.strength = config.strength
  }

  sample(point: Point, _context: FieldContext): Vector {
    const dx = this.center.x - point.x
    const dy = this.center.y - point.y
    const dist = Math.max(Math.sqrt(dx * dx + dy * dy), this.minDistance)
    const force = this.strength / (dist * dist)
    return {
      x: (dx / dist) * force,
      y: (dy / dist) * force,
    }
  }
}

/** Vortex — rotational flow around center */
class VortexField implements VectorField {
  readonly type = 'vortex'
  private center: Point
  private strength: number

  constructor(config: ForceFieldConfig) {
    this.center = config.center ?? { x: 0.5, y: 0.5 }
    this.strength = config.strength
  }

  sample(point: Point, _context: FieldContext): Vector {
    const dx = point.x - this.center.x
    const dy = point.y - this.center.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 1e-6) return { x: 0, y: 0 }
    // Perpendicular to radial direction → rotation
    return {
      x: (-dy / dist) * this.strength,
      y: (dx / dist) * this.strength,
    }
  }
}

/** Directional — uniform field in one direction */
class DirectionalField implements VectorField {
  readonly type = 'directional'
  private direction: Vector
  private strength: number

  constructor(config: ForceFieldConfig) {
    this.direction = config.direction ?? { x: 1, y: 0 }
    this.strength = config.strength
  }

  sample(_point: Point, _context: FieldContext): Vector {
    const len = vecLength(this.direction)
    if (len < 1e-6) return { x: 0, y: 0 }
    return {
      x: (this.direction.x / len) * this.strength,
      y: (this.direction.y / len) * this.strength,
    }
  }
}

/** Magnetic (single pole) — attraction/repulsion with polarity and falloff */
class MagneticFieldSingle implements VectorField {
  readonly type = 'magnetic'
  private center: Point
  private strength: number
  private polarity: number
  private radius: number
  private falloffType: string

  constructor(config: ForceFieldConfig) {
    this.center = config.center ?? { x: 0.5, y: 0.5 }
    this.strength = config.strength
    this.polarity = config.polarity ?? 1
    this.radius = config.radius ?? 1
    this.falloffType = config.falloff ?? 'inverse-square'
  }

  sample(point: Point, _context: FieldContext): Vector {
    const dx = point.x - this.center.x
    const dy = point.y - this.center.y
    const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 0.01)
    const normalizedDist = dist / this.radius

    const force = applyFalloff(
      this.polarity * this.strength,
      normalizedDist,
      1,
      this.falloffType as FalloffType,
    )

    const dirX = dx / dist
    const dirY = dy / dist
    return {
      x: dirX * force,
      y: dirY * force,
    }
  }
}

// ─── Composite Field ───────────────────────────────────────────────────────

/** Combine multiple vector fields by addition */
export class CompositeField implements VectorField {
  readonly type = 'composite'
  private fields: VectorField[]

  constructor(fields: VectorField[]) {
    this.fields = fields
  }

  sample(point: Point, context: FieldContext): Vector {
    let result: Vector = { x: 0, y: 0 }
    for (const field of this.fields) {
      result = vecAdd(result, field.sample(point, context))
    }
    return result
  }
}

// ─── Transform Field ───────────────────────────────────────────────────────

/** Apply transformations to an existing field */
export class TransformField implements VectorField {
  readonly type = 'transform'
  private inner: VectorField
  private scale: number
  private rotation: number
  private offset: Vector

  constructor(
    inner: VectorField,
    options: { scale?: number; rotation?: number; offset?: Vector } = {},
  ) {
    this.inner = inner
    this.scale = options.scale ?? 1
    this.rotation = options.rotation ?? 0
    this.offset = options.offset ?? { x: 0, y: 0 }
  }

  sample(point: Point, context: FieldContext): Vector {
    // Apply inverse transform to the input point
    const cos = Math.cos(-this.rotation)
    const sin = Math.sin(-this.rotation)
    const dx = point.x - this.offset.x
    const dy = point.y - this.offset.y
    const transformedPoint: Point = {
      x: (dx * cos - dy * sin) / this.scale,
      y: (dx * sin + dy * cos) / this.scale,
    }

    const result = this.inner.sample(transformedPoint, context)

    // Apply forward transform to the output vector
    const cosF = Math.cos(this.rotation)
    const sinF = Math.sin(this.rotation)
    return {
      x: (result.x * cosF - result.y * sinF) * this.scale,
      y: (result.x * sinF + result.y * cosF) * this.scale,
    }
  }
}

// ─── Falloff Models ────────────────────────────────────────────────────────

/** Falloff function types */
export type FalloffType =
  | 'constant'
  | 'linear'
  | 'smoothstep'
  | 'quadratic'
  | 'cubic'
  | 'inverse'
  | 'inverse-square'
  | 'gaussian'

/** Apply falloff to a field value based on distance from center */
export function applyFalloff(
  value: number,
  distance: number,
  radius: number,
  type: FalloffType,
): number {
  if (distance >= radius) return 0
  const t = distance / radius

  switch (type) {
    case 'constant':
      return value
    case 'linear':
      return value * (1 - t)
    case 'smoothstep':
      return value * (1 - t * t * (3 - 2 * t))
    case 'quadratic':
      return value * (1 - t) * (1 - t)
    case 'cubic':
      return value * (1 - t) * (1 - t) * (1 - t)
    case 'inverse':
      return value / (1 + t * 10)
    case 'inverse-square':
      return value / (1 + t * t * 100)
    case 'gaussian':
      return value * Math.exp(-t * t * 4)
    default:
      return value
  }
}
