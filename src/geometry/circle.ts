/**
 * Circle — a parametric circle/ellipse.
 *
 * Since circle has a known analytical arc-length,
 * we override pointAt to skip the lookup table.
 */

import type { Point, Geometry, TransformMatrix } from './types'
import { CurveGeometry, transformPoint } from './curve'

export class Circle extends CurveGeometry {
  readonly type = 'circle'
  private cx: number
  private cy: number
  private rx: number
  private ry: number

  constructor(cx: number, cy: number, radius: number)
  constructor(cx: number, cy: number, rx: number, ry: number)
  constructor(cx: number, cy: number, rxOrRadius: number, ry?: number) {
    super()
    this.cx = cx
    this.cy = cy
    this.rx = rxOrRadius
    this.ry = ry ?? rxOrRadius
  }

  protected rawPointAt(t: number): Point {
    const angle = t * Math.PI * 2
    return {
      x: this.cx + Math.cos(angle) * this.rx,
      y: this.cy + Math.sin(angle) * this.ry,
    }
  }

  /** Analytical arc length (circumference approximation for ellipse) */
  override length(): number {
    if (this.rx === this.ry) {
        return 2 * Math.PI * this.rx
      }
    // Ramanujan approximation for ellipse circumference
    const a = Math.max(this.rx, this.ry)
    const b = Math.min(this.rx, this.ry)
    const h = ((a - b) * (a - b)) / ((a + b) * (a + b))
    return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))
  }

  /** Get center point */
  getCenter(): Point {
    return { x: this.cx, y: this.cy }
  }

  /** Get radii */
  getRadii(): { rx: number; ry: number } {
    return { rx: this.rx, ry: this.ry }
  }

  transform(matrix: TransformMatrix): Geometry {
    const center = transformPoint({ x: this.cx, y: this.cy }, matrix)
    // Approximate: scale radii by average scale factor
    const scaleX = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b)
    const scaleY = Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d)
    return new Circle(center.x, center.y, this.rx * scaleX, this.ry * scaleY)
  }
}
