/**
 * Preset Capability Negotiation — matches preset requirements to renderer capabilities.
 */

import type { PresetSchema } from './types'
import type { RendererCapabilities } from '../renderer/types'
import type { PerformanceProfile } from './performance'
import { getPerformanceConstraints } from './performance'

/** Negotiation result */
export interface NegotiationResult {
  compatible: boolean
  profile: PerformanceProfile
  scaledPreset: PresetSchema
  warnings: string[]
  unsupportedFeatures: string[]
}

/** Negotiate preset against renderer capabilities and performance profile */
export function negotiatePreset(
  preset: PresetSchema,
  rendererCapabilities: RendererCapabilities,
  profile: PerformanceProfile,
): NegotiationResult {
  const warnings: string[] = []
  const unsupportedFeatures: string[] = []
  const constraints = getPerformanceConstraints(profile)

  // Check blend mode support
  if (preset.material?.blendMode) {
    const mode = preset.material.blendMode
    if (!rendererCapabilities.supportsBlendModes.includes(mode)) {
      unsupportedFeatures.push(`blendMode:${mode}`)
      warnings.push(`Blend mode '${mode}' not supported, falling back to 'normal'`)
    }
  }

  // Check blur support
  if (preset.material?.blur && preset.material.blur > 0 && !rendererCapabilities.supportsBlur) {
    unsupportedFeatures.push('blur')
    warnings.push('Blur not supported, will be skipped')
  }

  // Check glow support
  if (preset.material?.glow && !rendererCapabilities.supportsGlow) {
    unsupportedFeatures.push('glow')
    warnings.push('Glow not supported, will be skipped')
  }

  // Check instancing needs
  const count = typeof preset.geometry?.count === 'number' ? preset.geometry.count : 0
  if (count > 100 && !rendererCapabilities.supportsInstancing) {
    warnings.push('High geometry count without instancing may impact performance')
  }

  // Scale preset for profile
  const scaledPreset: PresetSchema = { ...preset }
  if (count > constraints.maxGeometryCount && scaledPreset.geometry) {
    scaledPreset.geometry = { ...scaledPreset.geometry, type: scaledPreset.geometry.type, count: constraints.maxGeometryCount }
    warnings.push(`Geometry count scaled from ${count} to ${constraints.maxGeometryCount}`)
  }

  return {
    compatible: unsupportedFeatures.length === 0 || warnings.length > 0,
    profile,
    scaledPreset,
    warnings,
    unsupportedFeatures,
  }
}
