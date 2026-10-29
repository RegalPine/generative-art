/**
 * Field types — the influence layer of the semantic model.
 *
 * Field answers: "What influence does each position in space receive?"
 * Connects Geometry → Deformation / Flow / Motion.
 */

import type { Point, Vector } from '../geometry/types'

/** Field sampling context */
export interface FieldContext {
  time: number
  delta: number
  seed: number
  viewport: { width: number; height: number }
  semantic: {
    density: number
    complexity: number
    energy: number
    softness: number
    depth: number
    rhythm: number
    turbulence: number
    focus: number
  }
}

/** Base Field interface — parameterized by output type T */
export interface Field<T = Vector> {
  readonly type: string
  /** Sample the field value at a given point */
  sample(point: Point, context: FieldContext): T
}

/** Scalar field — returns a single number at each point */
export interface ScalarField extends Field<number> {
  sample(point: Point, context: FieldContext): number
}

/** Vector field — returns a vector at each point */
export interface VectorField extends Field<Vector> {
  sample(point: Point, context: FieldContext): Vector
}

/** Noise field configuration */
export interface NoiseFieldConfig {
  scale: number
  octaves: number
  persistence: number
  lacunarity: number
}

/** Force field configuration */
export interface ForceFieldConfig {
  strength: number
  type: 'attractor' | 'repulsor' | 'gravity' | 'vortex' | 'directional' | 'magnetic'
  center?: Point
  direction?: Vector
  /** For magnetic field */
  polarity?: number
  /** Falloff type for force fields */
  falloff?: string
  /** Radius for force fields */
  radius?: number
}

/** Noise source interface — deterministic noise algorithm */
export interface NoiseSource {
  readonly seed: number
  sample(x: number, y: number, z?: number): number
}

/** Field mask — controls where a field is active */
export interface FieldMask {
  sample(point: Point, context: FieldContext): number
}

/** Domain warping configuration */
export interface DomainWarpConfig {
  seed: number
  scale: number
  octaves: number
  persistence: number
  lacunarity: number
  /** Warp strength */
  strength: number
  /** Secondary warp layer */
  secondary?: {
    strength: number
    scale: number
  }
}
