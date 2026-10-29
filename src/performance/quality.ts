/**
 * Render Quality — maps performance tier to render quality settings.
 */

import type { PerformanceTier } from './tier'
import { getTierConfig } from './tier'

/** Render quality settings */
export interface RenderQualitySettings {
  dpr: number
  maxGeometryCount: number
  geometrySegments: number
  fieldOctaves: number
  motionLayers: number
  materialLayers: number
  enableBlur: boolean
  enableGlow: boolean
  enableInstancing: boolean
}

/** Get render quality settings for a performance tier */
export function getRenderQuality(tier: PerformanceTier): RenderQualitySettings {
  const config = getTierConfig(tier)

  return {
    dpr: config.maxDpr,
    maxGeometryCount: config.maxGeometryCount,
    geometrySegments: config.geometrySegments,
    fieldOctaves: config.maxFieldOctaves,
    motionLayers: config.maxMotionLayers,
    materialLayers: config.maxMaterialLayers,
    enableBlur: config.enableBlur,
    enableGlow: config.enableGlow,
    enableInstancing: config.enableInstancing,
  }
}

/** Scale render quality by a factor (0-1) */
export function scaleRenderQuality(
  base: RenderQualitySettings,
  factor: number,
): RenderQualitySettings {
  const f = Math.max(0, Math.min(1, factor))

  return {
    dpr: Math.max(1, base.dpr * f),
    maxGeometryCount: Math.max(10, Math.floor(base.maxGeometryCount * f)),
    geometrySegments: Math.max(8, Math.floor(base.geometrySegments * f)),
    fieldOctaves: Math.max(1, Math.floor(base.fieldOctaves * f)),
    motionLayers: Math.max(1, Math.floor(base.motionLayers * f)),
    materialLayers: Math.max(1, Math.floor(base.materialLayers * f)),
    enableBlur: f > 0.5 ? base.enableBlur : false,
    enableGlow: f > 0.7 ? base.enableGlow : false,
    enableInstancing: base.enableInstancing,
  }
}
