/**
 * Distribution implementations — algorithms for placing geometry in space.
 *
 * All distributions output normalized coordinates [0,1] × [0,1].
 * All use seeded random (never Math.random).
 *
 * Types:
 * - UniformDistribution: regular grid
 * - RandomDistribution: seeded random placement
 * - RadialDistribution: circular/radial placement
 * - FlowDistribution: placement along a field
 */

import type { Point } from '../geometry/types'
import type { Field } from '../field/types'
import type { Seed } from '../core/seed'

/** Distribution interface */
export interface Distribution {
  readonly type: string
  generate(count: number, seed: Seed, context?: DistributionContext): Point[]
}

/** Distribution context — optional field influence */
export interface DistributionContext {
  field?: Field
  viewport?: { width: number; height: number }
  density?: number
}

/** Uniform grid distribution */
export class UniformDistribution implements Distribution {
  readonly type = 'uniform'
  private columns: number

  constructor(columns?: number) {
    this.columns = columns ?? 0 // 0 = auto
  }

  generate(count: number, _seed: Seed): Point[] {
    const cols = this.columns > 0 ? this.columns : Math.ceil(Math.sqrt(count))
    const rows = Math.ceil(count / cols)
    const points: Point[] = []

    for (let r = 0; r < rows && points.length < count; r++) {
      for (let c = 0; c < cols && points.length < count; c++) {
        points.push({
          x: cols > 1 ? c / (cols - 1) : 0.5,
          y: rows > 1 ? r / (rows - 1) : 0.5,
        })
      }
    }

    return points
  }
}

/** Random distribution with seeded random */
export class RandomDistribution implements Distribution {
  readonly type = 'random'

  generate(count: number, seed: Seed): Point[] {
    const points: Point[] = []
    for (let i = 0; i < count; i++) {
      points.push({
        x: seed.next(),
        y: seed.next(),
      })
    }
    return points
  }
}

/** Radial distribution — points arranged in circular patterns */
export class RadialDistribution implements Distribution {
  readonly type = 'radial'
  private rings: number

  constructor(rings?: number) {
    this.rings = rings ?? 0 // 0 = auto
  }

  generate(count: number, _seed: Seed): Point[] {
    const points: Point[] = []
    const ringCount = this.rings > 0 ? this.rings : Math.ceil(Math.sqrt(count / Math.PI))

    let placed = 0
    for (let ring = 1; ring <= ringCount && placed < count; ring++) {
      const radius = ring / ringCount
      const circumference = 2 * Math.PI * radius
      const pointsInRing = Math.max(1, Math.round((count / ringCount) * (circumference / 1)))

      for (let i = 0; i < pointsInRing && placed < count; i++) {
        const angle = (i / pointsInRing) * Math.PI * 2
        points.push({
          x: 0.5 + Math.cos(angle) * radius * 0.5,
          y: 0.5 + Math.sin(angle) * radius * 0.5,
        })
        placed++
      }
    }

    return points
  }
}

/** Flow distribution — geometry placed along a field's streamlines */
export class FlowDistribution implements Distribution {
  readonly type = 'flow'
  private field: Field
  private stepsPerStreamline: number

  constructor(field: Field, stepsPerStreamline?: number) {
    this.field = field
    this.stepsPerStreamline = stepsPerStreamline ?? 20
  }

  generate(count: number, seed: Seed, context?: DistributionContext): Point[] {
    const points: Point[] = []
    const streamlines = Math.max(1, Math.ceil(count / this.stepsPerStreamline))

    const fieldCtx = {
      time: 0,
      delta: 0.016,
      seed: seed.value,
      viewport: context?.viewport ?? { width: 1, height: 1 },
      semantic: {
        density: 0.5,
        complexity: 0.5,
        energy: 0.5,
        softness: 0.5,
        depth: 0.5,
        rhythm: 0.5,
        turbulence: 0.5,
        focus: 0.5,
      },
    }

    for (let s = 0; s < streamlines && points.length < count; s++) {
      // Start from a random position
      let pos = { x: seed.next(), y: seed.next() }

      for (let step = 0; step < this.stepsPerStreamline && points.length < count; step++) {
        points.push({ x: pos.x, y: pos.y })

        // Follow the field
        const v = this.field.sample(pos, fieldCtx)
        const stepSize = 0.01
        pos = {
          x: Math.max(0, Math.min(1, pos.x + v.x * stepSize)),
          y: Math.max(0, Math.min(1, pos.y + v.y * stepSize)),
        }
      }
    }

    return points
  }
}

/** Create a distribution from config */
export function createDistribution(
  type: string,
  options?: { columns?: number; rings?: number; field?: Field; steps?: number },
): Distribution {
  switch (type) {
    case 'uniform':
    case 'grid':
      return new UniformDistribution(options?.columns)
    case 'random':
      return new RandomDistribution()
    case 'radial':
      return new RadialDistribution(options?.rings)
    case 'flow':
      if (!options?.field) {
        throw new Error('Flow distribution requires a field')
      }
      return new FlowDistribution(options.field, options.steps)
    default:
      return new RandomDistribution()
  }
}
