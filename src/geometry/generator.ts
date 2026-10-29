/**
 * Geometry Generator — seed-driven geometry creation.
 *
 * Generates deterministic geometry from configuration + seed.
 */

import type { Point, Geometry, GeometryConfig, GeometryGenerator } from './types'
import { createSeed } from '../core/seed'
import { Polyline } from './polyline'
import { QuadraticBezier, CubicBezier } from './bezier'
import { Spline } from './spline'
import { Circle } from './circle'
import { Wave } from './wave'
import { Ribbon } from './ribbon'

/** Default geometry generator — supports all MVP geometry types */
export class DefaultGeometryGenerator implements GeometryGenerator {
  generate(config: GeometryConfig, seedValue: number): Geometry {
    const seed = createSeed(seedValue)

    switch (config.type) {
      case 'polyline':
      case 'line':
        return this.generatePolyline(config, seed)
      case 'quadratic-bezier':
        return this.generateQuadraticBezier(config, seed)
      case 'cubic-bezier':
        return this.generateCubicBezier(config, seed)
      case 'spline':
        return this.generateSpline(config, seed)
      case 'circle':
        return this.generateCircle(config, seed)
      case 'wave':
        return this.generateWave(config, seed)
      case 'ribbon':
        return this.generateRibbon(config, seed)
      default:
        throw new Error(`Unknown geometry type: ${config.type}`)
    }
  }

  private generatePolyline(config: GeometryConfig, seed: ReturnType<typeof createSeed>): Polyline {
    const count = (config.count as number) ?? 10
    const points: Point[] = []
    for (let i = 0; i < count; i++) {
      points.push({
        x: i / (count - 1), // Evenly spaced x
        y: seed.range(0.1, 0.9), // Random y within range
      })
    }
    return new Polyline(points)
  }

  private generateQuadraticBezier(
    config: GeometryConfig,
    seed: ReturnType<typeof createSeed>,
  ): QuadraticBezier {
    return new QuadraticBezier(
      { x: 0, y: seed.range(0.2, 0.8) },
      { x: seed.range(0.3, 0.7), y: seed.range(0, 1) },
      { x: 1, y: seed.range(0.2, 0.8) },
    )
  }

  private generateCubicBezier(
    config: GeometryConfig,
    seed: ReturnType<typeof createSeed>,
  ): CubicBezier {
    return new CubicBezier(
      { x: 0, y: seed.range(0.2, 0.8) },
      { x: seed.range(0.2, 0.4), y: seed.range(0, 1) },
      { x: seed.range(0.6, 0.8), y: seed.range(0, 1) },
      { x: 1, y: seed.range(0.2, 0.8) },
    )
  }

  private generateSpline(config: GeometryConfig, seed: ReturnType<typeof createSeed>): Spline {
    const count = (config.count as number) ?? 5
    const points: Point[] = []
    for (let i = 0; i < count; i++) {
      points.push({
        x: i / (count - 1), // Evenly spaced x
        y: seed.range(0.1, 0.9), // Random y within range
      })
    }
    return new Spline(points, (config.tension as number) ?? 0.5)
  }

  private generateCircle(config: GeometryConfig, seed: ReturnType<typeof createSeed>): Circle {
    const cx = (config.cx as number) ?? seed.range(0.2, 0.8)
    const cy = (config.cy as number) ?? seed.range(0.2, 0.8)
    const radius = (config.radius as number) ?? seed.range(0.05, 0.3)
    return new Circle(cx, cy, radius)
  }

  private generateWave(config: GeometryConfig, seed: ReturnType<typeof createSeed>): Wave {
    return new Wave({
      start: { x: (config.startX as number) ?? 0, y: (config.startY as number) ?? 0.5 },
      end: { x: (config.endX as number) ?? 1, y: (config.endY as number) ?? 0.5 },
      amplitude: (config.amplitude as number) ?? seed.range(0.02, 0.15),
      frequency: (config.frequency as number) ?? seed.range(2, 8),
      phase: (config.phase as number) ?? seed.range(0, Math.PI * 2),
    })
  }

  private generateRibbon(config: GeometryConfig, seed: ReturnType<typeof createSeed>): Ribbon {
    const count = (config.count as number) ?? 5
    const points: Point[] = []
    for (let i = 0; i < count; i++) {
      points.push({
        x: i / (count - 1), // Evenly spaced x
        y: seed.range(0.2, 0.8), // Random y within range
      })
    }
    return new Ribbon({
      points,
      width: (config.width as number) ?? seed.range(0.01, 0.05),
      widthVariation: (config.widthVariation as number) ?? 0,
      widthFrequency: (config.widthFrequency as number) ?? 1,
    })
  }
}
