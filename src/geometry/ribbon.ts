/**
 * Ribbon — a curve with width, creating a ribbon/band shape.
 *
 * Defined by a center curve and a width that can vary along the length.
 */

import type { Point, Geometry, TransformMatrix } from './types'
import { CurveGeometry, transformPoint } from './curve'
import { vecPerp, vecNormalize } from '../core/math'

export interface RibbonConfig {
  /** Center curve points */
  points: Point[]
  /** Base width of the ribbon */
  width: number
  /** Width variation along the ribbon (0~1, modulates width by sine) */
  widthVariation?: number
  /** Number of width oscillations */
  widthFrequency?: number
}

export class Ribbon extends CurveGeometry {
  readonly type = 'ribbon'
  private centerPoints: Point[]
  private width: number
  private widthVariation: number
  private widthFrequency: number

  constructor(config: RibbonConfig) {
    super()
    if (config.points.length < 2) {
      throw new Error('Ribbon requires at least 2 center points')
    }
    this.centerPoints = config.points
    this.width = config.width
    this.widthVariation = config.widthVariation ?? 0
    this.widthFrequency = config.widthFrequency ?? 1
    this.segments = Math.max((config.points.length - 1) * 50, 200)
  }

  protected rawPointAt(t: number): Point {
    // Get center point by interpolating through control points
    const center = this.interpolateCenter(t)

    // Get tangent to compute perpendicular offset
    const dt = 0.001
    const center0 = this.interpolateCenter(Math.max(0, t - dt))
    const center1 = this.interpolateCenter(Math.min(1, t + dt))

    const tangent = vecNormalize({
      x: center1.x - center0.x,
      y: center1.y - center0.y,
    })
    const normal = vecPerp(tangent)

    // Width at this point
    const widthMod = 1 + this.widthVariation * Math.sin(t * this.widthFrequency * Math.PI * 2)
    const halfWidth = (this.width * widthMod) / 2

    // Offset from center (returns the edge of the ribbon)
    return {
      x: center.x + normal.x * halfWidth,
      y: center.y + normal.y * halfWidth,
    }
  }

  private interpolateCenter(t: number): Point {
    const pts = this.centerPoints
    const n = pts.length

    if (n === 1) return pts[0]!
    if (n === 2) {
      return {
        x: pts[0]!.x + (pts[1]!.x - pts[0]!.x) * t,
        y: pts[0]!.y + (pts[1]!.y - pts[0]!.y) * t,
      }
    }

    const scaledT = Math.max(0, Math.min(1, t)) * (n - 1)
    const segIndex = Math.min(Math.floor(scaledT), n - 2)
    const localT = scaledT - segIndex

    const p0 = pts[segIndex]!
    const p1 = pts[segIndex + 1]!

    return {
      x: p0.x + (p1.x - p0.x) * localT,
      y: p0.y + (p1.y - p0.y) * localT,
    }
  }

  /** Get both edges of the ribbon as polylines */
  getEdges(sampleCount: number = 50): { left: Point[]; right: Point[] } {
    const left: Point[] = []
    const right: Point[] = []

    for (let i = 0; i < sampleCount; i++) {
      const t = sampleCount === 1 ? 0 : i / (sampleCount - 1)
      const center = this.interpolateCenter(t)

      const dt = 0.001
      const c0 = this.interpolateCenter(Math.max(0, t - dt))
      const c1 = this.interpolateCenter(Math.min(1, t + dt))
      const tangent = vecNormalize({ x: c1.x - c0.x, y: c1.y - c0.y })
      const normal = vecPerp(tangent)

      const widthMod = 1 + this.widthVariation * Math.sin(t * this.widthFrequency * Math.PI * 2)
      const halfWidth = (this.width * widthMod) / 2

      left.push({
        x: center.x + normal.x * halfWidth,
        y: center.y + normal.y * halfWidth,
      })
      right.push({
        x: center.x - normal.x * halfWidth,
        y: center.y - normal.y * halfWidth,
      })
    }

    return { left, right }
  }

  transform(matrix: TransformMatrix): Geometry {
    return new Ribbon({
      points: this.centerPoints.map((p) => transformPoint(p, matrix)),
      width: this.width,
      widthVariation: this.widthVariation,
      widthFrequency: this.widthFrequency,
    })
  }
}
