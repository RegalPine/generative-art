/**
 * Arc-length parameterization utilities.
 *
 * Provides uniform sampling along curves by building a lookup table
 * of cumulative arc lengths and using binary search for interpolation.
 */

import type { Point } from './types'
import { pointDistance, lerp } from '../core/math'

/** A lookup table entry for arc-length parameterization */
export interface ArcLengthEntry {
  t: number
  length: number
}

/** Build an arc-length lookup table from a parametric function */
export function buildArcLengthTable(
  pointFn: (t: number) => Point,
  segments: number = 200,
): ArcLengthEntry[] {
  const table: ArcLengthEntry[] = [{ t: 0, length: 0 }]
  let totalLength = 0

  for (let i = 1; i <= segments; i++) {
    const t = i / segments
    const prev = pointFn((i - 1) / segments)
    const curr = pointFn(t)
    totalLength += pointDistance(prev, curr)
    table.push({ t, length: totalLength })
  }

  return table
}

/** Get total arc length from a lookup table */
export function tableLength(table: ArcLengthEntry[]): number {
  return table[table.length - 1]!.length
}

/**
 * Find the parameter t for a given normalized arc-length fraction (0~1).
 * Uses binary search + linear interpolation.
 */
export function tAtArcLength(table: ArcLengthEntry[], fraction: number): number {
  if (fraction <= 0) return 0
  if (fraction >= 1) return 1

  const totalLen = tableLength(table)
  const targetLen = fraction * totalLen

  // Binary search for the segment
  let lo = 0
  let hi = table.length - 1

  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1
    if (table[mid]!.length < targetLen) {
      lo = mid
    } else {
      hi = mid
    }
  }

  const entry0 = table[lo]!
  const entry1 = table[hi]!
  const segLen = entry1.length - entry0.length

  if (segLen < 1e-10) return entry0.t

  const localT = (targetLen - entry0.length) / segLen
  return lerp(entry0.t, entry1.t, localT)
}

/** Sample N points at uniform arc-length intervals */
export function sampleUniform(
  pointFn: (t: number) => Point,
  count: number,
  segments: number = 200,
): Point[] {
  const table = buildArcLengthTable(pointFn, segments)
  const points: Point[] = []

  for (let i = 0; i < count; i++) {
    const fraction = count === 1 ? 0 : i / (count - 1)
    const t = tAtArcLength(table, fraction)
    points.push(pointFn(t))
  }

  return points
}
