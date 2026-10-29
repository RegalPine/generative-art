/**
 * Field operations — arithmetic and transformation operations on fields.
 *
 * Operations:
 * - SubtractField: A - B
 * - MultiplyField: A * B (component-wise)
 * - ScaleField: field * scalar
 * - NormalizeField: unit-length output
 * - ClampField: clamp magnitude to range
 * - RotateField: rotate output vectors
 * - InvertField: negate output
 * - AbsField: absolute value (scalar) / magnitude (vector)
 * - BlendField: weighted blend of two fields
 */

import type { Point, Vector } from '../geometry/types'
import type { FieldContext, ScalarField, VectorField } from './types'
import { vecSub, vecScale, vecNormalize, vecLength } from '../core/math'

// ─── Vector Field Operations ─────────────────────────────────────────────

/** Subtract field B from field A */
export class SubtractField implements VectorField {
  readonly type = 'subtract'
  private a: VectorField
  private b: VectorField

  constructor(a: VectorField, b: VectorField) {
    this.a = a
    this.b = b
  }

  sample(point: Point, context: FieldContext): Vector {
    const va = this.a.sample(point, context)
    const vb = this.b.sample(point, context)
    return vecSub(va, vb)
  }
}

/** Multiply two vector fields component-wise */
export class MultiplyField implements VectorField {
  readonly type = 'multiply'
  private a: VectorField
  private b: VectorField

  constructor(a: VectorField, b: VectorField) {
    this.a = a
    this.b = b
  }

  sample(point: Point, context: FieldContext): Vector {
    const va = this.a.sample(point, context)
    const vb = this.b.sample(point, context)
    return { x: va.x * vb.x, y: va.y * vb.y }
  }
}

/** Scale a field by a constant */
export class ScaleField implements VectorField {
  readonly type = 'scale'
  private field: VectorField
  private scalar: number

  constructor(field: VectorField, scalar: number) {
    this.field = field
    this.scalar = scalar
  }

  sample(point: Point, context: FieldContext): Vector {
    return vecScale(this.field.sample(point, context), this.scalar)
  }
}

/** Normalize field output to unit length */
export class NormalizeField implements VectorField {
  readonly type = 'normalize'
  private field: VectorField

  constructor(field: VectorField) {
    this.field = field
  }

  sample(point: Point, context: FieldContext): Vector {
    return vecNormalize(this.field.sample(point, context))
  }
}

/** Clamp field magnitude to a maximum value */
export class ClampField implements VectorField {
  readonly type = 'clamp'
  private field: VectorField
  private maxMagnitude: number

  constructor(field: VectorField, maxMagnitude: number) {
    this.field = field
    this.maxMagnitude = maxMagnitude
  }

  sample(point: Point, context: FieldContext): Vector {
    const v = this.field.sample(point, context)
    const mag = vecLength(v)
    if (mag > this.maxMagnitude && mag > 1e-10) {
      return vecScale(v, this.maxMagnitude / mag)
    }
    return v
  }
}

/** Rotate field output vectors by an angle (radians) */
export class RotateField implements VectorField {
  readonly type = 'rotate'
  private field: VectorField
  private angle: number

  constructor(field: VectorField, angle: number) {
    this.field = field
    this.angle = angle
  }

  sample(point: Point, context: FieldContext): Vector {
    const v = this.field.sample(point, context)
    const cos = Math.cos(this.angle)
    const sin = Math.sin(this.angle)
    return {
      x: v.x * cos - v.y * sin,
      y: v.x * sin + v.y * cos,
    }
  }
}

/** Invert (negate) field output */
export class InvertField implements VectorField {
  readonly type = 'invert'
  private field: VectorField

  constructor(field: VectorField) {
    this.field = field
  }

  sample(point: Point, context: FieldContext): Vector {
    const v = this.field.sample(point, context)
    return { x: -v.x, y: -v.y }
  }
}

/** Weighted blend of two vector fields */
export class BlendField implements VectorField {
  readonly type = 'blend'
  private a: VectorField
  private b: VectorField
  private weight: number

  constructor(a: VectorField, b: VectorField, weight: number) {
    this.a = a
    this.b = b
    this.weight = Math.max(0, Math.min(1, weight))
  }

  sample(point: Point, context: FieldContext): Vector {
    const va = this.a.sample(point, context)
    const vb = this.b.sample(point, context)
    const w = this.weight
    return {
      x: va.x * (1 - w) + vb.x * w,
      y: va.y * (1 - w) + vb.y * w,
    }
  }
}

// ─── Scalar Field Operations ────────────────────────────────────────────

/** Add two scalar fields */
export class ScalarAddField implements ScalarField {
  readonly type = 'scalar-add'
  private a: ScalarField
  private b: ScalarField

  constructor(a: ScalarField, b: ScalarField) {
    this.a = a
    this.b = b
  }

  sample(point: Point, context: FieldContext): number {
    return this.a.sample(point, context) + this.b.sample(point, context)
  }
}

/** Multiply two scalar fields */
export class ScalarMultiplyField implements ScalarField {
  readonly type = 'scalar-multiply'
  private a: ScalarField
  private b: ScalarField

  constructor(a: ScalarField, b: ScalarField) {
    this.a = a
    this.b = b
  }

  sample(point: Point, context: FieldContext): number {
    return this.a.sample(point, context) * this.b.sample(point, context)
  }
}

/** Scale a scalar field by a constant */
export class ScalarScaleField implements ScalarField {
  readonly type = 'scalar-scale'
  private field: ScalarField
  private scalar: number

  constructor(field: ScalarField, scalar: number) {
    this.field = field
    this.scalar = scalar
  }

  sample(point: Point, context: FieldContext): number {
    return this.field.sample(point, context) * this.scalar
  }
}

/** Clamp a scalar field to [min, max] */
export class ScalarClampField implements ScalarField {
  readonly type = 'scalar-clamp'
  private field: ScalarField
  private min: number
  private max: number

  constructor(field: ScalarField, min: number, max: number) {
    this.field = field
    this.min = min
    this.max = max
  }

  sample(point: Point, context: FieldContext): number {
    const v = this.field.sample(point, context)
    return Math.max(this.min, Math.min(this.max, v))
  }
}

/** Invert (negate) a scalar field */
export class ScalarInvertField implements ScalarField {
  readonly type = 'scalar-invert'
  private field: ScalarField

  constructor(field: ScalarField) {
    this.field = field
  }

  sample(point: Point, context: FieldContext): number {
    return -this.field.sample(point, context)
  }
}
