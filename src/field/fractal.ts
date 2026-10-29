/**
 * Fractal Noise — layered noise with octaves, persistence, and lacunarity.
 *
 * Config:
 *   octaves     → number of noise layers (complexity)
 *   persistence → amplitude decay per octave (detail strength)
 *   lacunarity  → frequency growth per octave (spatial frequency)
 *   scale       → base spatial frequency
 */

import type { NoiseSource } from './types'
import { createSimplexNoise } from './noise'

/** Fractal noise configuration */
export interface FractalNoiseConfig {
  seed: number
  octaves: number
  persistence: number
  lacunarity: number
  scale: number
}

/** Default fractal noise configuration */
export const DEFAULT_FRACTAL: Required<FractalNoiseConfig> = {
  seed: 0,
  octaves: 4,
  persistence: 0.5,
  lacunarity: 2,
  scale: 1,
}

/** Create a fractal noise source from layered simplex noise */
export function createFractalNoise(config: Partial<FractalNoiseConfig> = {}): NoiseSource {
  const cfg = { ...DEFAULT_FRACTAL, ...config }
  const baseNoise = createSimplexNoise(cfg.seed)

  return {
    get seed() {
      return cfg.seed
    },

    sample(x: number, y: number, z?: number): number {
      let value = 0
      let amplitude = 1
      let frequency = cfg.scale
      let maxValue = 0

      for (let i = 0; i < cfg.octaves; i++) {
        if (z !== undefined) {
          value += baseNoise.sample(x * frequency, y * frequency, z * frequency) * amplitude
        } else {
          value += baseNoise.sample(x * frequency, y * frequency) * amplitude
        }
        maxValue += amplitude
        amplitude *= cfg.persistence
        frequency *= cfg.lacunarity
      }

      // Normalize to [-1, 1]
      return value / maxValue
    },
  }
}
