/**
 * Wave — a sinusoidal wave curve.
 *
 * Configurable: amplitude, frequency, phase, direction.
 */

import type { Point, Geometry, TransformMatrix } from './types'
import { CurveGeometry, transformPoint } from './curve'

export interface WaveConfig {
  /** Start point */
  start: Point
  /** End point */
  end: Point
  /** Wave amplitude (perpendicular to direction) */
  amplitude: number
  /** Number of complete wave cycles */
  frequency: number
  /** Phase offset in radians */
  phase?: number
}

export class Wave extends CurveGeometry {
  readonly type = 'wave'
  private start: Point
  private end: Point
  private amplitude: number
  private frequency: number
  private phase: number

  constructor(config: WaveConfig) {
    super()
    this.start = config.start
    this.end = config.end
    this.amplitude = config.amplitude
    this.frequency = config.frequency
    this.phase = config.phase ?? 0
  }

  protected rawPointAt(t: number): Point {
    // Linear interpolation along the wave axis
    const baseX = this.start.x + (this.end.x - this.start.x) * t
    const baseY = this.start.y + (this.end.y - this.start.y) * t

    // Perpendicular direction
    const dx = this.end.x - this.start.x
    const dy = this.end.y - this.start.y
    const len = Math.sqrt(dx * dx + dy * dy)
    if (len < 1e-10) return { x: baseX, y: baseY }

    // Normal (perpendicular)
    const nx = -dy / len
    const ny = dx / len

    // Sinusoidal displacement
    const displacement = Math.sin(t * this.frequency * Math.PI * 2 + this.phase) * this.amplitude

    return {
      x: baseX + nx * displacement,
      y: baseY + ny * displacement,
    }
  }

  transform(matrix: TransformMatrix): Geometry {
    return new Wave({
      start: transformPoint(this.start, matrix),
      end: transformPoint(this.end, matrix),
      amplitude: this.amplitude,
      frequency: this.frequency,
      phase: this.phase,
    })
  }
}
