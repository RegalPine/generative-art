/**
 * Performance Tier — tiered performance levels (0-3).
 *
 * Tier 0: Low-end (mobile, old devices)
 * Tier 1: Mid-range (average laptops)
 * Tier 2: High-end (modern desktops)
 * Tier 3: Maximum (workstations, gaming GPUs)
 */

/** Performance tier level */
export type PerformanceTier = 0 | 1 | 2 | 3

/** Tier configuration */
export interface TierConfig {
  tier: PerformanceTier
  label: string
  maxDpr: number
  maxGeometryCount: number
  maxFieldOctaves: number
  maxMotionLayers: number
  maxMaterialLayers: number
  targetFps: number
  enableBlur: boolean
  enableGlow: boolean
  enableInstancing: boolean
  geometrySegments: number
}

/** Get configuration for a performance tier */
export function getTierConfig(tier: PerformanceTier): TierConfig {
  switch (tier) {
    case 0:
      return {
        tier: 0,
        label: 'low',
        maxDpr: 1,
        maxGeometryCount: 50,
        maxFieldOctaves: 2,
        maxMotionLayers: 1,
        maxMaterialLayers: 1,
        targetFps: 30,
        enableBlur: false,
        enableGlow: false,
        enableInstancing: false,
        geometrySegments: 32,
      }
    case 1:
      return {
        tier: 1,
        label: 'medium',
        maxDpr: 1.5,
        maxGeometryCount: 200,
        maxFieldOctaves: 3,
        maxMotionLayers: 2,
        maxMaterialLayers: 2,
        targetFps: 60,
        enableBlur: false,
        enableGlow: false,
        enableInstancing: true,
        geometrySegments: 64,
      }
    case 2:
      return {
        tier: 2,
        label: 'high',
        maxDpr: 2,
        maxGeometryCount: 1000,
        maxFieldOctaves: 4,
        maxMotionLayers: 4,
        maxMaterialLayers: 3,
        targetFps: 60,
        enableBlur: true,
        enableGlow: false,
        enableInstancing: true,
        geometrySegments: 100,
      }
    case 3:
      return {
        tier: 3,
        label: 'ultra',
        maxDpr: 3,
        maxGeometryCount: 5000,
        maxFieldOctaves: 6,
        maxMotionLayers: 8,
        maxMaterialLayers: 6,
        targetFps: 60,
        enableBlur: true,
        enableGlow: true,
        enableInstancing: true,
        geometrySegments: 200,
      }
  }
}

/** Clamp a tier value to valid range */
export function clampTier(tier: number): PerformanceTier {
  return Math.max(0, Math.min(3, Math.floor(tier))) as PerformanceTier
}

/** All tier labels */
export const TIER_LABELS = ['low', 'medium', 'high', 'ultra'] as const
