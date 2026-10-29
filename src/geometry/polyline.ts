/**
 * Polyline — a curve defined by a sequence of connected line segments.
 */

import type { Point, Geometry, TransformMatrix } from './types'
import { CurveGeometry, transformPoint } from './curve'

export class Polyline extends CurveGeometry {
  readonly type = 'polyline'
  private points: Point[]

  constructor(points: Point[]) {
    super()
    this.points = points
    // Use exact segment count for polylines
    this.segments = Math.max(points.length - 1, 1)
  }

  protected rawPointAt(t: number): Point {
    const pts = this.points
    if (pts.length === 0) return { x: 0, y: 0 }
    if (pts.length === 1) return pts[0]!

    const clampedT = Math.max(0, Math.min(1, t))
    const totalSegments = pts.length - 1
    const scaledT = clampedT * totalSegments
    const segIndex = Math.min(Math.floor(scaledT), totalSegments - 1)
    const localT = scaledT - segIndex

    const p0 = pts[segIndex]!
    const p1 = pts[segIndex + 1]!

    return {
      x: p0.x + (p1.x - p0.x) * localT,
      y: p0.y + (p1.y - p0.y) * localT,
    }
  }

  /** Get the control points */
  getPoints(): readonly Point[] {
    return this.points
  }

  transform(matrix: TransformMatrix): Geometry {
    return new Polyline(this.points.map((p) => transformPoint(p, matrix)))
  }
}
