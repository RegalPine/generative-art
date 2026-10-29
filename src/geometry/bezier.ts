/**
 * Bezier curves — Quadratic and Cubic.
 */

import type { Point, Geometry, TransformMatrix } from './types'
import { CurveGeometry, transformPoint } from './curve'

/** Quadratic Bezier: B(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2 */
export class QuadraticBezier extends CurveGeometry {
  readonly type = 'quadratic-bezier'
  private p0: Point
  private p1: Point
  private p2: Point

  constructor(p0: Point, p1: Point, p2: Point) {
    super()
    this.p0 = p0
    this.p1 = p1
    this.p2 = p2
  }

  protected rawPointAt(t: number): Point {
    const mt = 1 - t
    const mt2 = mt * mt
    const t2 = t * t
    return {
      x: mt2 * this.p0.x + 2 * mt * t * this.p1.x + t2 * this.p2.x,
      y: mt2 * this.p0.y + 2 * mt * t * this.p1.y + t2 * this.p2.y,
    }
  }

  transform(matrix: TransformMatrix): Geometry {
    return new QuadraticBezier(
      transformPoint(this.p0, matrix),
      transformPoint(this.p1, matrix),
      transformPoint(this.p2, matrix),
    )
  }
}

/** Cubic Bezier: B(t) = (1-t)³P0 + 3(1-t)²tP1 + 3(1-t)t²P2 + t³P3 */
export class CubicBezier extends CurveGeometry {
  readonly type = 'cubic-bezier'
  private p0: Point
  private p1: Point
  private p2: Point
  private p3: Point

  constructor(p0: Point, p1: Point, p2: Point, p3: Point) {
    super()
    this.p0 = p0
    this.p1 = p1
    this.p2 = p2
    this.p3 = p3
  }

  protected rawPointAt(t: number): Point {
    const mt = 1 - t
    const mt2 = mt * mt
    const mt3 = mt2 * mt
    const t2 = t * t
    const t3 = t2 * t
    return {
      x: mt3 * this.p0.x + 3 * mt2 * t * this.p1.x + 3 * mt * t2 * this.p2.x + t3 * this.p3.x,
      y: mt3 * this.p0.y + 3 * mt2 * t * this.p1.y + 3 * mt * t2 * this.p2.y + t3 * this.p3.y,
    }
  }

  transform(matrix: TransformMatrix): Geometry {
    return new CubicBezier(
      transformPoint(this.p0, matrix),
      transformPoint(this.p1, matrix),
      transformPoint(this.p2, matrix),
      transformPoint(this.p3, matrix),
    )
  }
}
