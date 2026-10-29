/**
 * Additional distribution implementations — completes the P1 composition system.
 *
 * New types:
 * - PoissonDistribution: minimum-distance sampling
 * - SpiralDistribution: spiral placement
 * - ClusterDistribution: grouped placement
 * - EdgeDistribution: edge-focused placement
 * - CenterDistribution: center-focused placement
 * - GoldenDistribution: golden ratio placement
 * - OrganicDistribution: controlled randomness
 * - GridDistribution: strict grid with jitter
 */

import type { Point } from '../geometry/types'
import type { Seed } from '../core/seed'
import type { Distribution } from './distribution'

// ─── Poisson Disk Distribution ───────────────────────────────────────────

/**
 * Poisson Disk — ensures minimum distance between all points.
 *
 * Uses Bridson's algorithm for O(n) generation.
 */
export class PoissonDistribution implements Distribution {
  readonly type = 'poisson'
  private minDistance: number
  private maxAttempts: number

  constructor(minDistance?: number, maxAttempts?: number) {
    this.minDistance = minDistance ?? 0.05
    this.maxAttempts = maxAttempts ?? 30
  }

  generate(count: number, seed: Seed): Point[] {
    const cellSize = this.minDistance / Math.SQRT2
    const gridW = Math.ceil(1 / cellSize)
    const gridH = Math.ceil(1 / cellSize)
    const grid: (Point | null)[] = new Array(gridW * gridH).fill(null)
    const active: Point[] = []
    const result: Point[] = []

    // Start from center
    const first: Point = { x: 0.5, y: 0.5 }
    result.push(first)
    active.push(first)
    const gi = Math.floor(first.x / cellSize)
    const gj = Math.floor(first.y / cellSize)
    if (gi >= 0 && gi < gridW && gj >= 0 && gj < gridH) {
      grid[gj * gridW + gi] = first
    }

    while (active.length > 0 && result.length < count) {
      const idx = Math.floor(seed.next() * active.length)
      const point = active[idx]!
      let found = false

      for (let attempt = 0; attempt < this.maxAttempts; attempt++) {
        const angle = seed.next() * Math.PI * 2
        const dist = this.minDistance + seed.next() * this.minDistance
        const candidate: Point = {
          x: point.x + Math.cos(angle) * dist,
          y: point.y + Math.sin(angle) * dist,
        }

        if (candidate.x < 0 || candidate.x > 1 || candidate.y < 0 || candidate.y > 1) {
          continue
        }

        // Check neighbors
        const ci = Math.floor(candidate.x / cellSize)
        const cj = Math.floor(candidate.y / cellSize)
        let tooClose = false

        for (let dj = -2; dj <= 2 && !tooClose; dj++) {
          for (let di = -2; di <= 2 && !tooClose; di++) {
            const ni = ci + di
            const nj = cj + dj
            if (ni < 0 || ni >= gridW || nj < 0 || nj >= gridH) continue
            const neighbor = grid[nj * gridW + ni]
            if (neighbor) {
              const dx = candidate.x - neighbor.x
              const dy = candidate.y - neighbor.y
              if (dx * dx + dy * dy < this.minDistance * this.minDistance) {
                tooClose = true
              }
            }
          }
        }

        if (!tooClose) {
          result.push(candidate)
          active.push(candidate)
          if (ci >= 0 && ci < gridW && cj >= 0 && cj < gridH) {
            grid[cj * gridW + ci] = candidate
          }
          found = true
          break
        }
      }

      if (!found) {
        active.splice(idx, 1)
      }
    }

    return result.slice(0, count)
  }
}

// ─── Spiral Distribution ─────────────────────────────────────────────────

/** Spiral — points arranged in spiral patterns */
export class SpiralDistribution implements Distribution {
  readonly type = 'spiral'
  private turns: number
  private direction: 'cw' | 'ccw'

  constructor(turns?: number, direction?: 'cw' | 'ccw') {
    this.turns = turns ?? 3
    this.direction = direction ?? 'ccw'
  }

  generate(count: number, _seed: Seed): Point[] {
    const points: Point[] = []
    const sign = this.direction === 'cw' ? -1 : 1

    for (let i = 0; i < count; i++) {
      const t = i / count
      const angle = sign * t * this.turns * Math.PI * 2
      const radius = t * 0.45
      points.push({
        x: 0.5 + Math.cos(angle) * radius,
        y: 0.5 + Math.sin(angle) * radius,
      })
    }

    return points
  }
}

// ─── Cluster Distribution ────────────────────────────────────────────────

/** Cluster — points grouped into clusters */
export class ClusterDistribution implements Distribution {
  readonly type = 'cluster'
  private clusterCount: number
  private spread: number

  constructor(clusterCount?: number, spread?: number) {
    this.clusterCount = clusterCount ?? 5
    this.spread = spread ?? 0.1
  }

  generate(count: number, seed: Seed): Point[] {
    // Generate cluster centers
    const centers: Point[] = []
    for (let i = 0; i < this.clusterCount; i++) {
      centers.push({ x: seed.next(), y: seed.next() })
    }

    const points: Point[] = []
    for (let i = 0; i < count; i++) {
      const centerIdx = Math.floor(seed.next() * this.clusterCount)
      const center = centers[centerIdx]!

      // Gaussian-like distribution around center
      const angle = seed.next() * Math.PI * 2
      const dist = seed.next() * this.spread
      points.push({
        x: Math.max(0, Math.min(1, center.x + Math.cos(angle) * dist)),
        y: Math.max(0, Math.min(1, center.y + Math.sin(angle) * dist)),
      })
    }

    return points
  }
}

// ─── Edge Distribution ───────────────────────────────────────────────────

/** Edge — points concentrated along edges */
export class EdgeDistribution implements Distribution {
  readonly type = 'edge'
  private margin: number
  private edgeWeight: number

  constructor(margin?: number, edgeWeight?: number) {
    this.margin = margin ?? 0.1
    this.edgeWeight = edgeWeight ?? 0.7
  }

  generate(count: number, seed: Seed): Point[] {
    const points: Point[] = []
    const m = this.margin

    for (let i = 0; i < count; i++) {
      if (seed.next() < this.edgeWeight) {
        // Place near an edge
        const edge = Math.floor(seed.next() * 4)
        switch (edge) {
          case 0: // top
            points.push({ x: seed.next(), y: seed.next() * m })
            break
          case 1: // bottom
            points.push({ x: seed.next(), y: 1 - seed.next() * m })
            break
          case 2: // left
            points.push({ x: seed.next() * m, y: seed.next() })
            break
          case 3: // right
            points.push({ x: 1 - seed.next() * m, y: seed.next() })
            break
        }
      } else {
        // Random placement
        points.push({ x: seed.next(), y: seed.next() })
      }
    }

    return points
  }
}

// ─── Center Distribution ─────────────────────────────────────────────────

/** Center — points concentrated toward center */
export class CenterDistribution implements Distribution {
  readonly type = 'center'
  private concentration: number

  constructor(concentration?: number) {
    this.concentration = concentration ?? 2
  }

  generate(count: number, seed: Seed): Point[] {
    const points: Point[] = []

    for (let i = 0; i < count; i++) {
      const angle = seed.next() * Math.PI * 2
      const rawDist = seed.next()
      const dist = Math.pow(rawDist, this.concentration) * 0.45
      points.push({
        x: 0.5 + Math.cos(angle) * dist,
        y: 0.5 + Math.sin(angle) * dist,
      })
    }

    return points
  }
}

// ─── Golden Distribution ─────────────────────────────────────────────────

/** Golden — uses golden ratio for placement */
export class GoldenDistribution implements Distribution {
  readonly type = 'golden'
  private phi = (1 + Math.sqrt(5)) / 2

  generate(count: number, _seed: Seed): Point[] {
    const points: Point[] = []

    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count
      const angle = 2 * Math.PI * i / (this.phi * this.phi)
      const radius = Math.sqrt(t) * 0.45
      points.push({
        x: 0.5 + Math.cos(angle) * radius,
        y: 0.5 + Math.sin(angle) * radius,
      })
    }

    return points
  }
}

// ─── Organic Distribution ────────────────────────────────────────────────

/**
 * Organic — controlled randomness: rules + perturbation + constraints.
 *
 * Starts with a base pattern (grid-like) and adds noise perturbation.
 */
export class OrganicDistribution implements Distribution {
  readonly type = 'organic'
  private regularity: number
  private perturbation: number

  constructor(regularity?: number, perturbation?: number) {
    this.regularity = regularity ?? 0.6
    this.perturbation = perturbation ?? 0.4
  }

  generate(count: number, seed: Seed): Point[] {
    const cols = Math.ceil(Math.sqrt(count))
    const rows = Math.ceil(count / cols)
    const cellW = 1 / cols
    const cellH = 1 / rows
    const points: Point[] = []

    for (let r = 0; r < rows && points.length < count; r++) {
      for (let c = 0; c < cols && points.length < count; c++) {
        // Base position (grid)
        const baseX = (c + 0.5) * cellW
        const baseY = (r + 0.5) * cellH

        // Perturbation
        const px = (seed.next() - 0.5) * cellW * this.perturbation
        const py = (seed.next() - 0.5) * cellH * this.perturbation

        // Blend between regular and perturbed
        const x = baseX * this.regularity + (baseX + px) * (1 - this.regularity)
        const y = baseY * this.regularity + (baseY + py) * (1 - this.regularity)

        points.push({
          x: Math.max(0, Math.min(1, x)),
          y: Math.max(0, Math.min(1, y)),
        })
      }
    }

    return points
  }
}

// ─── Grid Distribution ───────────────────────────────────────────────────

/** Grid — strict grid with optional jitter */
export class GridDistribution implements Distribution {
  readonly type = 'grid'
  private columns: number
  private rows: number
  private jitter: number

  constructor(columns?: number, rows?: number, jitter?: number) {
    this.columns = columns ?? 0 // 0 = auto
    this.rows = rows ?? 0
    this.jitter = jitter ?? 0
  }

  generate(count: number, seed: Seed): Point[] {
    const cols = this.columns > 0
      ? this.columns
      : Math.ceil(Math.sqrt(count))
    const rows = this.rows > 0
      ? this.rows
      : Math.ceil(count / cols)

    const cellW = 1 / cols
    const cellH = 1 / rows
    const points: Point[] = []

    for (let r = 0; r < rows && points.length < count; r++) {
      for (let c = 0; c < cols && points.length < count; c++) {
        let x = (c + 0.5) * cellW
        let y = (r + 0.5) * cellH

        if (this.jitter > 0) {
          x += (seed.next() - 0.5) * cellW * this.jitter
          y += (seed.next() - 0.5) * cellH * this.jitter
          x = Math.max(0, Math.min(1, x))
          y = Math.max(0, Math.min(1, y))
        }

        points.push({ x, y })
      }
    }

    return points
  }
}
