/**
 * Spline — Catmull-Rom spline through a sequence of control points.
 *
 * Produces a smooth curve that passes through all control points.
 */

import type { Point, Geometry, TransformMatrix } from './types'
import { CurveGeometry, transformPoint } from './curve'

export class Spline extends CurveGeometry {
  readonly type = 'spline'
  private points: Point[]
  private tension: number

  constructor(points: Point[], tension: number = 0.5) {
    super()
    if (points.length < 2) {
      throw new Error('Spline requires at least 2 control points')
    }
    this.points = points
    this.tension = tension
    this.segments = Math.max((points.length - 1) * 50, 200)
  }

  protected rawPointAt(t: number): Point {
    const pts = this.points
    const n = pts.length

    if (n === 1) return pts[0]!
    if (n === 2) {
      // Linear interpolation fallback
      return {
        x: pts[0]!.x + (pts[1]!.x - pts[0]!.x) * t,
        y: pts[0]!.y + (pts[1]!.y - pts[0]!.y) * t,
      }
    }

    // Map t to segment index and local t
    const totalSegments = n - 1
    const scaledT = Math.max(0, Math.min(1, t)) * totalSegments
    const segIndex = Math.min(Math.floor(scaledT), totalSegments - 1)
    const localT = scaledT - segIndex

    // Get 4 control points for Catmull-Rom
    const p0 = pts[Math.max(0, segIndex - 1)]!
    const p1 = pts[segIndex]!
    const p2 = pts[Math.min(n - 1, segIndex + 1)]!
    const p3 = pts[Math.min(n - 1, segIndex + 2)]!

    return catmullRom(p0, p1, p2, p3, localT, this.tension)
  }

  /** Get the control points */
  getPoints(): readonly Point[] {
    return this.points
  }

  transform(matrix: TransformMatrix): Geometry {
    return new Spline(
      this.points.map((p) => transformPoint(p, matrix)),
      this.tension,
    )
  }
}

/** Catmull-Rom interpolation between p1 and p2 */
function catmullRom(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  t: number,
  tension: number,
): Point {
  const t2 = t * t
  const t3 = t2 * t
  const s = (1 - tension) / 2

  // Tangents
  const m1x = s * (p2.x - p0.x)
  const m1y = s * (p2.y - p0.y)
  const m2x = s * (p3.x - p1.x)
  const m2y = s * (p3.y - p1.y)

  // Hermite basis functions
  const a = 2 * t3 - 3 * t2 + 1
  const b = t3 - 2 * t2 + t
  const c = -2 * t3 + 3 * t2
  const d = t3 - t2

  return {
    x: a * p1.x + b * m1x + c * p2.x + d * m2x,
    y: a * p1.y + b * m1y + c * p2.y + d * m2y,
  }
}
