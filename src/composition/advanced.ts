/**
 * Advanced composition features — NegativeSpace, Symmetry, Hierarchy, Depth, Rhythm.
 *
 * These complete the P1 composition system.
 */

import type { Point } from '../geometry/types'
import type { Seed } from '../core/seed'

// ─── Negative Space ──────────────────────────────────────────────────────

/**
 * Negative space — removes or repels geometry from specified regions.
 *
 * Useful for keeping text areas clear, creating focal breathing room.
 */
export interface ProtectedRegion {
  type: 'circle' | 'rect'
  /** For circle */
  center?: Point
  radius?: number
  /** For rect */
  x?: number
  y?: number
  width?: number
  height?: number
}

/** Filter points that fall inside protected regions */
export function applyNegativeSpace(
  points: Point[],
  regions: ProtectedRegion[],
): Point[] {
  return points.filter((p) => !isInsideAnyRegion(p, regions))
}

function isInsideAnyRegion(point: Point, regions: ProtectedRegion[]): boolean {
  for (const region of regions) {
    if (region.type === 'circle') {
      const cx = region.center?.x ?? 0.5
      const cy = region.center?.y ?? 0.5
      const r = region.radius ?? 0.2
      const dx = point.x - cx
      const dy = point.y - cy
      if (dx * dx + dy * dy < r * r) return true
    } else if (region.type === 'rect') {
      const rx = region.x ?? 0.25
      const ry = region.y ?? 0.25
      const rw = region.width ?? 0.5
      const rh = region.height ?? 0.5
      if (
        point.x >= rx &&
        point.x <= rx + rw &&
        point.y >= ry &&
        point.y <= ry + rh
      ) {
        return true
      }
    }
  }
  return false
}

// ─── Symmetry ────────────────────────────────────────────────────────────

/** Symmetry mode */
export type SymmetryMode = 'none' | 'horizontal' | 'vertical' | 'radial' | 'rotational' | 'mirror'

/** Symmetry configuration */
export interface SymmetryConfig {
  mode: SymmetryMode
  /** 0 = no symmetry, 1 = full symmetry */
  strength: number
  /** For radial/rotational: number of folds */
  folds?: number
}

/** Apply symmetry to a set of points */
export function applySymmetry(
  points: Point[],
  config: SymmetryConfig,
  _seed: Seed,
): Point[] {
  if (config.mode === 'none' || config.strength <= 0) return points

  const result: Point[] = [...points]
  const strength = Math.max(0, Math.min(1, config.strength))

  switch (config.mode) {
    case 'horizontal': {
      const mirrored = points.map((p) => ({
        x: p.x + (1 - p.x - p.x) * strength,
        y: p.y,
      }))
      result.push(...mirrored)
      break
    }
    case 'vertical': {
      const mirrored = points.map((p) => ({
        x: p.x,
        y: p.y + (1 - p.y - p.y) * strength,
      }))
      result.push(...mirrored)
      break
    }
    case 'radial':
    case 'rotational': {
      const folds = config.folds ?? 4
      for (let f = 1; f < folds; f++) {
        const angle = (f / folds) * Math.PI * 2 * strength
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        const rotated = points.map((p) => {
          const dx = p.x - 0.5
          const dy = p.y - 0.5
          return {
            x: 0.5 + dx * cos - dy * sin,
            y: 0.5 + dx * sin + dy * cos,
          }
        })
        result.push(...rotated)
      }
      break
    }
    case 'mirror': {
      const mirrored = points.map((p) => ({
        x: 1 - p.x,
        y: p.y,
      }))
      result.push(...mirrored)
      break
    }
  }

  return result
}

// ─── Hierarchy ───────────────────────────────────────────────────────────

/** Visual hierarchy level */
export type HierarchyLevel = 'primary' | 'secondary' | 'tertiary'

/** Hierarchy configuration */
export interface HierarchyConfig {
  /** Ratio of primary elements (0~1) */
  primaryRatio: number
  /** Ratio of secondary elements (0~1) */
  secondaryRatio: number
  /** Scale factor for secondary vs primary */
  secondaryScale: number
  /** Scale factor for tertiary vs primary */
  tertiaryScale: number
  /** Opacity factor for secondary */
  secondaryOpacity: number
  /** Opacity factor for tertiary */
  tertiaryOpacity: number
}

/** Default hierarchy configuration */
export const DEFAULT_HIERARCHY: HierarchyConfig = {
  primaryRatio: 0.2,
  secondaryRatio: 0.5,
  secondaryScale: 0.6,
  tertiaryScale: 0.3,
  secondaryOpacity: 0.7,
  tertiaryOpacity: 0.4,
}

/** Hierarchy assignment for a point */
export interface HierarchyAssignment {
  point: Point
  level: HierarchyLevel
  scale: number
  opacity: number
  zIndex: number
}

/** Assign hierarchy levels to points */
export function assignHierarchy(
  points: Point[],
  config: HierarchyConfig,
  seed: Seed,
): HierarchyAssignment[] {
  const sorted = [...points]
  // Shuffle deterministically
  for (let i = sorted.length - 1; i > 0; i--) {
    const j = Math.floor(seed.next() * (i + 1))
    ;[sorted[i], sorted[j]] = [sorted[j]!, sorted[i]!]
  }

  const n = sorted.length
  const primaryCount = Math.max(1, Math.floor(n * config.primaryRatio))
  const secondaryCount = Math.max(1, Math.floor(n * config.secondaryRatio))

  return sorted.map((point, i) => {
    let level: HierarchyLevel
    let scale: number
    let opacity: number
    let zIndex: number

    if (i < primaryCount) {
      level = 'primary'
      scale = 1
      opacity = 1
      zIndex = 2
    } else if (i < primaryCount + secondaryCount) {
      level = 'secondary'
      scale = config.secondaryScale
      opacity = config.secondaryOpacity
      zIndex = 1
    } else {
      level = 'tertiary'
      scale = config.tertiaryScale
      opacity = config.tertiaryOpacity
      zIndex = 0
    }

    return { point, level, scale, opacity, zIndex }
  })
}

// ─── Depth Model ─────────────────────────────────────────────────────────

/** Depth layer configuration */
export interface DepthConfig {
  /** Number of depth layers */
  layers: number
  /** Depth range for fog effect (0 = no fog, 1 = full fog) */
  fogIntensity: number
  /** Fog color */
  fogColor: string
  /** Scale reduction per depth layer */
  scaleDecay: number
  /** Opacity reduction per depth layer */
  opacityDecay: number
}

/** Default depth configuration */
export const DEFAULT_DEPTH: DepthConfig = {
  layers: 3,
  fogIntensity: 0.3,
  fogColor: '#000000',
  scaleDecay: 0.8,
  opacityDecay: 0.85,
}

/** Depth assignment for a point */
export interface DepthAssignment {
  point: Point
  depthLayer: number // 0 = front, layers-1 = back
  scale: number
  opacity: number
  blur: number
}

/** Assign depth layers to points */
export function assignDepth(
  points: Point[],
  config: DepthConfig,
  seed: Seed,
): DepthAssignment[] {
  return points.map((point) => {
    const layer = Math.floor(seed.next() * config.layers)
    const scale = Math.pow(config.scaleDecay, layer)
    const opacity = Math.pow(config.opacityDecay, layer)
    const blur = layer * config.fogIntensity * 2

    return { point, depthLayer: layer, scale, opacity, blur }
  })
}

// ─── Rhythm Model ────────────────────────────────────────────────────────

/** Rhythm configuration */
export interface RhythmConfig {
  /** Rhythm type */
  type: 'uniform' | 'alternating' | 'accelerating' | 'decelerating' | 'syncopated'
  /** Base interval */
  interval: number
  /** Variation strength (0~1) */
  variation: number
}

/** Default rhythm configuration */
export const DEFAULT_RHYTHM: RhythmConfig = {
  type: 'uniform',
  interval: 0.1,
  variation: 0.2,
}

/** Apply rhythm modulation to a sequence of values (e.g., spacing, scale) */
export function applyRhythm(
  count: number,
  config: RhythmConfig,
  seed: Seed,
): number[] {
  const result: number[] = []

  for (let i = 0; i < count; i++) {
    let value = config.interval

    switch (config.type) {
      case 'uniform':
        value = config.interval
        break
      case 'alternating':
        value = i % 2 === 0 ? config.interval : config.interval * 0.5
        break
      case 'accelerating':
        value = config.interval * (1 - i / count)
        break
      case 'decelerating':
        value = config.interval * (i / count + 0.2)
        break
      case 'syncopated': {
        const beat = i % 4
        if (beat === 0 || beat === 2) value = config.interval
        else if (beat === 1) value = config.interval * 1.5
        else value = config.interval * 0.5
        break
      }
    }

    // Add variation
    if (config.variation > 0) {
      value *= 1 + (seed.next() - 0.5) * config.variation * 2
    }

    result.push(Math.max(0.001, value))
  }

  return result
}
