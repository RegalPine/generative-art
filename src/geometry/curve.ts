/**
 * Base CurveGeometry — provides arc-length parameterization for all curve types.
 *
 * Subclasses implement rawPointAt(t) and the base class handles
 * arc-length reparameterization for uniform sampling.
 */

import type { Point, Vector, Bounds, Curve, Geometry, TransformMatrix } from './types'
import { buildArcLengthTable, tAtArcLength, tableLength } from './sampling'
import { vecPerp, vecNormalize } from '../core/math'

/** Abstract base for curve-based geometry */
export abstract class CurveGeometry implements Curve, Geometry {
  abstract readonly type: string

  /** Raw parametric point at t ∈ [0,1] — subclasses implement this */
  protected abstract rawPointAt(t: number): Point

  /** Number of segments for arc-length table */
  protected segments = 200

  /** Cached arc-length table (lazy built) */
  private _table: ReturnType<typeof buildArcLengthTable> | null = null

  protected get table() {
    if (!this._table) {
      this._table = buildArcLengthTable((t) => this.rawPointAt(t), this.segments)
    }
    return this._table
  }

  /** Invalidate cache — call when geometry changes */
  protected invalidateCache(): void {
    this._table = null
  }

  /** Point at arc-length fraction t ∈ [0,1] */
  pointAt(t: number): Point {
    const arcT = tAtArcLength(this.table, t)
    return this.rawPointAt(arcT)
  }

  /** Tangent vector at arc-length fraction t */
  tangentAt(t: number): Vector {
    const arcT = tAtArcLength(this.table, t)
    const dt = 0.001
    const t0 = Math.max(0, arcT - dt)
    const t1 = Math.min(1, arcT + dt)
    const p0 = this.rawPointAt(t0)
    const p1 = this.rawPointAt(t1)
    return vecNormalize({ x: p1.x - p0.x, y: p1.y - p0.y })
  }

  /** Normal vector at arc-length fraction t (perpendicular to tangent) */
  normalAt(t: number): Vector {
    return vecPerp(this.tangentAt(t))
  }

  /** Total arc length */
  length(): number {
    return tableLength(this.table)
  }

  /** Sample N points at uniform arc-length intervals */
  sample(count: number): Point[] {
    const points: Point[] = []
    for (let i = 0; i < count; i++) {
      const fraction = count === 1 ? 0 : i / (count - 1)
      points.push(this.pointAt(fraction))
    }
    return points
  }

  /** Bounding box — computed from sampling */
  bounds(): Bounds {
    const pts = this.sample(100)
    let minX = Infinity, minY = Infinity
    let maxX = -Infinity, maxY = -Infinity

    for (const p of pts) {
      if (p.x < minX) minX = p.x
      if (p.y < minY) minY = p.y
      if (p.x > maxX) maxX = p.x
      if (p.y > maxY) maxY = p.y
    }

    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
  }

  /** Apply affine transform — returns new geometry (subclasses override) */
  abstract transform(matrix: TransformMatrix): Geometry
}

/** Apply an affine transform to a point */
export function transformPoint(p: Point, m: TransformMatrix): Point {
  return {
    x: m.a * p.x + m.c * p.y + m.tx,
    y: m.b * p.x + m.d * p.y + m.ty,
  }
}

/** Create an identity transform matrix */
export function identityMatrix(): TransformMatrix {
  return { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 }
}

/** Create a translation matrix */
export function translateMatrix(tx: number, ty: number): TransformMatrix {
  return { a: 1, b: 0, c: 0, d: 1, tx, ty }
}

/** Create a rotation matrix (radians) */
export function rotateMatrix(angle: number): TransformMatrix {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return { a: cos, b: sin, c: -sin, d: cos, tx: 0, ty: 0 }
}

/** Create a scale matrix */
export function scaleMatrix(sx: number, sy: number = sx): TransformMatrix {
  return { a: sx, b: 0, c: 0, d: sy, tx: 0, ty: 0 }
}

/** Compose two transform matrices: result = m1 * m2 */
export function composeMatrix(m1: TransformMatrix, m2: TransformMatrix): TransformMatrix {
  return {
    a: m1.a * m2.a + m1.c * m2.b,
    b: m1.b * m2.a + m1.d * m2.b,
    c: m1.a * m2.c + m1.c * m2.d,
    d: m1.b * m2.c + m1.d * m2.d,
    tx: m1.a * m2.tx + m1.c * m2.ty + m1.tx,
    ty: m1.b * m2.tx + m1.d * m2.ty + m1.ty,
  }
}
