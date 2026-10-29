/**
 * Core math utilities — Vector operations, Point operations, clamping, interpolation.
 */

import type { Point, Vector } from '../geometry/types'

/** Add two vectors */
export function vecAdd(a: Vector, b: Vector): Vector {
  return { x: a.x + b.x, y: a.y + b.y }
}

/** Subtract vector b from a */
export function vecSub(a: Vector, b: Vector): Vector {
  return { x: a.x - b.x, y: a.y - b.y }
}

/** Scale a vector by a scalar */
export function vecScale(v: Vector, s: number): Vector {
  return { x: v.x * s, y: v.y * s }
}

/** Vector magnitude (length) */
export function vecLength(v: Vector): number {
  return Math.sqrt(v.x * v.x + v.y * v.y)
}

/** Normalize a vector to unit length */
export function vecNormalize(v: Vector): Vector {
  const len = vecLength(v)
  if (len < 1e-10) return { x: 0, y: 0 }
  return { x: v.x / len, y: v.y / len }
}

/** Dot product of two vectors */
export function vecDot(a: Vector, b: Vector): number {
  return a.x * b.x + a.y * b.y
}

/** Perpendicular vector (rotate 90° counter-clockwise) */
export function vecPerp(v: Vector): Vector {
  return { x: -v.y, y: v.x }
}

/** Distance between two points */
export function pointDistance(a: Point, b: Point): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.sqrt(dx * dx + dy * dy)
}

/** Linear interpolation */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Clamp value to [min, max] */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/** Clamp value to [0, 1] */
export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value))
}

/** Smoothstep interpolation */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

/** Convert point to vector (same shape, different semantic) */
export function pointToVec(p: Point): Vector {
  return { x: p.x, y: p.y }
}

/** Convert vector to point */
export function vecToPoint(v: Vector): Point {
  return { x: v.x, y: v.y }
}
