/**
 * Preset Performance Profile — categorizes presets by performance requirements.
 */

import type { PresetSchema } from './types'

/** Performance profile levels */
export type PerformanceProfile = 'light' | 'balanced' | 'rich' | 'experimental'

/** Performance constraints per profile */
export interface PerformanceConstraints {
  maxGeometryCount: number
  maxFieldComplexity: number
  maxMotionLayers: number
  maxMaterialLayers: number
  maxDpr: number
  targetFps: number
}

/** Get constraints for a performance profile */
export function getPerformanceConstraints(profile: PerformanceProfile): PerformanceConstraints {
  switch (profile) {
    case 'light':
      return {
        maxGeometryCount: 50,
        maxFieldComplexity: 2,
        maxMotionLayers: 1,
        maxMaterialLayers: 1,
        maxDpr: 1,
        targetFps: 60,
      }
    case 'balanced':
      return {
        maxGeometryCount: 200,
        maxFieldComplexity: 4,
        maxMotionLayers: 3,
        maxMaterialLayers: 2,
        maxDpr: 2,
        targetFps: 60,
      }
    case 'rich':
      return {
        maxGeometryCount: 1000,
        maxFieldComplexity: 6,
        maxMotionLayers: 5,
        maxMaterialLayers: 4,
        maxDpr: 3,
        targetFps: 30,
      }
    case 'experimental':
      return {
        maxGeometryCount: 5000,
        maxFieldComplexity: 8,
        maxMotionLayers: 10,
        maxMaterialLayers: 8,
        maxDpr: 3,
        targetFps: 30,
      }
  }
}

/** Infer performance profile from preset */
export function inferPerformanceProfile(preset: PresetSchema): PerformanceProfile {
  const count = typeof preset.geometry?.count === 'number' ? preset.geometry.count : 0
  const complexity = preset.semantic?.complexity ?? 0.5
  const turbulence = preset.semantic?.turbulence ?? 0

  // Experimental: very high counts or complexity
  if (count > 1000 || complexity > 0.9) return 'experimental'

  // Rich: moderate-high counts
  if (count > 200 || complexity > 0.7 || turbulence > 0.7) return 'rich'

  // Light: very low counts
  if (count < 50 && complexity < 0.3) return 'light'

  // Default: balanced
  return 'balanced'
}

/** Check if a preset is compatible with a performance profile */
export function isPresetCompatible(preset: PresetSchema, profile: PerformanceProfile): boolean {
  const constraints = getPerformanceConstraints(profile)
  const count = typeof preset.geometry?.count === 'number' ? preset.geometry.count : 0

  return count <= constraints.maxGeometryCount
}

/** Scale preset to fit within performance constraints */
export function scalePresetForProfile(preset: PresetSchema, profile: PerformanceProfile): PresetSchema {
  const constraints = getPerformanceConstraints(profile)
  const scaled = { ...preset }

  if (scaled.geometry) {
    const count = typeof scaled.geometry.count === 'number' ? scaled.geometry.count : 0
    if (count > constraints.maxGeometryCount) {
      scaled.geometry = { ...scaled.geometry, count: constraints.maxGeometryCount }
    }
  }

  return scaled
}
