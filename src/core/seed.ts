/**
 * Seeded random number generator for deterministic generation.
 *
 * Uses mulberry32 algorithm — fast, simple, and produces good distribution.
 * All randomness in the engine MUST go through this, never Math.random().
 */

export interface Seed {
  /** The original seed value */
  readonly value: number
  /** Generate next random number in [0, 1) */
  next(): number
  /** Generate random number in [min, max) */
  range(min: number, max: number): number
  /** Pick a random element from an array */
  pick<T>(arr: readonly T[]): T
  /** Generate random integer in [min, max] (inclusive) */
  int(min: number, max: number): number
  /** Create a child seed derived from this one */
  child(): Seed
}

/** Create a Seed instance from a numeric value */
export function createSeed(value: number): Seed {
  let state = value | 0

  function mulberry32(): number {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  const seed: Seed = {
    get value() {
      return value
    },

    next(): number {
      return mulberry32()
    },

    range(min: number, max: number): number {
      return min + mulberry32() * (max - min)
    },

    pick<T>(arr: readonly T[]): T {
      const index = Math.floor(mulberry32() * arr.length)
      return arr[index] as T
    },

    int(min: number, max: number): number {
      return Math.floor(min + mulberry32() * (max - min + 1))
    },

    child(): Seed {
      // Derive a new seed by advancing the current state
      const childValue = (mulberry32() * 0xffffffff) | 0
      return createSeed(childValue)
    },
  }

  return seed
}
