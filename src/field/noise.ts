/**
 * Simplex Noise implementation with deterministic seed support.
 *
 * Based on Stefan Gustavson's simplex noise algorithm.
 * All noise values are deterministic given the same seed.
 *
 * Supports:
 * - 2D noise: noise2D(x, y)
 * - 3D noise: noise3D(x, y, z)
 */

import type { NoiseSource } from '../field/types'

/** Permutation table size */
const PERM_SIZE = 256

/** Gradient vectors for 2D */
const GRAD2 = [
  [1, 1], [-1, 1], [1, -1], [-1, -1],
  [1, 0], [-1, 0], [0, 1], [0, -1],
] as const

/** Gradient vectors for 3D */
const GRAD3 = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
] as const

/** Skewing factors for 2D */
const F2 = 0.5 * (Math.sqrt(3) - 1)
const G2 = (3 - Math.sqrt(3)) / 6

/** Skewing factors for 3D */
const F3 = 1 / 3
const G3 = 1 / 6

/** Build a seeded permutation table */
function buildPermutation(seed: number): Uint8Array {
  const perm = new Uint8Array(PERM_SIZE * 2)
  const base = new Uint8Array(PERM_SIZE)

  // Initialize with identity
  for (let i = 0; i < PERM_SIZE; i++) {
    base[i] = i
  }

  // Fisher-Yates shuffle with seeded random
  let state = seed | 0
  for (let i = PERM_SIZE - 1; i > 0; i--) {
    // mulberry32 step
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    const r = ((t ^ (t >>> 14)) >>> 0) / 4294967296

    const j = Math.floor(r * (i + 1))
    const tmp = base[i]!
    base[i] = base[j]!
    base[j] = tmp
  }

  // Duplicate for overflow
  for (let i = 0; i < PERM_SIZE; i++) {
    perm[i] = base[i]!
    perm[i + PERM_SIZE] = base[i]!
  }

  return perm
}

/** Dot product of gradient and distance for 2D */
function grad2D(hash: number, x: number, y: number): number {
  const g = GRAD2[hash & 7]!
  return g[0] * x + g[1] * y
}

/** Dot product of gradient and distance for 3D */
function grad3D(hash: number, x: number, y: number, z: number): number {
  const g = GRAD3[hash % 12]!
  return g[0] * x + g[1] * y + g[2] * z
}

/** 2D Simplex Noise — returns value in approximately [-1, 1] */
function noise2DImpl(perm: Uint8Array, x: number, y: number): number {
  // Skew the input space
  const s = (x + y) * F2
  const i = Math.floor(x + s)
  const j = Math.floor(y + s)

  const t = (i + j) * G2
  const X0 = i - t
  const Y0 = j - t
  const x0 = x - X0
  const y0 = y - Y0

  // Determine which simplex we're in
  let i1: number, j1: number
  if (x0 > y0) {
    i1 = 1; j1 = 0
  } else {
    i1 = 0; j1 = 1
  }

  const x1 = x0 - i1 + G2
  const y1 = y0 - j1 + G2
  const x2 = x0 - 1 + 2 * G2
  const y2 = y0 - 1 + 2 * G2

  // Hash coordinates to simplex corners
  const ii = i & 255
  const jj = j & 255

  // Calculate contribution from the three corners
  let n0 = 0, n1 = 0, n2 = 0

  let t0 = 0.5 - x0 * x0 - y0 * y0
  if (t0 >= 0) {
    const gi0 = perm[ii + perm[jj]!]!
    t0 *= t0
    n0 = t0 * t0 * grad2D(gi0, x0, y0)
  }

  let t1 = 0.5 - x1 * x1 - y1 * y1
  if (t1 >= 0) {
    const gi1 = perm[ii + i1 + perm[jj + j1]!]!
    t1 *= t1
    n1 = t1 * t1 * grad2D(gi1, x1, y1)
  }

  let t2 = 0.5 - x2 * x2 - y2 * y2
  if (t2 >= 0) {
    const gi2 = perm[ii + 1 + perm[jj + 1]!]!
    t2 *= t2
    n2 = t2 * t2 * grad2D(gi2, x2, y2)
  }

  // Scale to [-1, 1]
  return 70 * (n0 + n1 + n2)
}

/** 3D Simplex Noise — returns value in approximately [-1, 1] */
function noise3DImpl(perm: Uint8Array, x: number, y: number, z: number): number {
  const s = (x + y + z) * F3
  const i = Math.floor(x + s)
  const j = Math.floor(y + s)
  const k = Math.floor(z + s)

  const t = (i + j + k) * G3
  const X0 = i - t
  const Y0 = j - t
  const Z0 = k - t
  const x0 = x - X0
  const y0 = y - Y0
  const z0 = z - Z0

  let i1: number, j1: number, k1: number
  let i2: number, j2: number, k2: number

  if (x0 >= y0) {
    if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0 }
    else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1 }
    else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1 }
  } else {
    if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1 }
    else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1 }
    else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0 }
  }

  const x1 = x0 - i1 + G3
  const y1 = y0 - j1 + G3
  const z1 = z0 - k1 + G3
  const x2 = x0 - i2 + 2 * G3
  const y2 = y0 - j2 + 2 * G3
  const z2 = z0 - k2 + 2 * G3
  const x3 = x0 - 1 + 3 * G3
  const y3 = y0 - 1 + 3 * G3
  const z3 = z0 - 1 + 3 * G3

  const ii = i & 255
  const jj = j & 255
  const kk = k & 255

  let n0 = 0, n1 = 0, n2 = 0, n3 = 0

  let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0
  if (t0 >= 0) {
    const gi0 = perm[ii + perm[jj + perm[kk]!]!]!
    t0 *= t0
    n0 = t0 * t0 * grad3D(gi0, x0, y0, z0)
  }

  let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1
  if (t1 >= 0) {
    const gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1]!]!]!
    t1 *= t1
    n1 = t1 * t1 * grad3D(gi1, x1, y1, z1)
  }

  let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2
  if (t2 >= 0) {
    const gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2]!]!]!
    t2 *= t2
    n2 = t2 * t2 * grad3D(gi2, x2, y2, z2)
  }

  let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3
  if (t3 >= 0) {
    const gi3 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1]!]!]!
    t3 *= t3
    n3 = t3 * t3 * grad3D(gi3, x3, y3, z3)
  }

  return 32 * (n0 + n1 + n2 + n3)
}

/** Create a seeded NoiseSource using Simplex noise */
export function createSimplexNoise(seed: number): NoiseSource {
  const perm = buildPermutation(seed)

  return {
    get seed() {
      return seed
    },

    sample(x: number, y: number, z?: number): number {
      if (z !== undefined) {
        return noise3DImpl(perm, x, y, z)
      }
      return noise2DImpl(perm, x, y)
    },
  }
}
