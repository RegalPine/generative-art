/**
 * Renderer capability negotiation.
 *
 * Flow:
 *   Preset Requirements → Renderer Capabilities → Negotiation → Result
 *
 * Results:
 *   - Full Support: all features available
 *   - Partial Support: some features degraded
 *   - Unsupported: renderer cannot handle preset at all
 */

import type { RendererCapabilities } from './types'

/** Preset renderer requirements */
export interface PresetRendererRequirements {
  blendModes: string[]
  needsBlur: boolean
  needsGlow: boolean
  needsOffscreen: boolean
  needsInstancing: boolean
  minTextureSize?: number
}

/** Capability negotiation result */
export interface CapabilityResult {
  supported: boolean
  degraded: boolean
  unsupported: string[]
  fallbacks: string[]
}

/** Check if a renderer meets preset requirements */
export function negotiateCapabilities(
  capabilities: RendererCapabilities,
  requirements: PresetRendererRequirements,
): CapabilityResult {
  const unsupported: string[] = []
  const fallbacks: string[] = []

  // Check blend modes
  for (const mode of requirements.blendModes) {
    if (!capabilities.supportsBlendModes.includes(mode)) {
      unsupported.push(`blendMode:${mode}`)
      fallbacks.push('normal')
    }
  }

  // Check blur
  if (requirements.needsBlur && !capabilities.supportsBlur) {
    unsupported.push('blur')
    fallbacks.push('no-blur')
  }

  // Check glow
  if (requirements.needsGlow && !capabilities.supportsGlow) {
    unsupported.push('glow')
    fallbacks.push('no-glow')
  }

  // Check instancing
  if (requirements.needsInstancing && !capabilities.supportsInstancing) {
    unsupported.push('instancing')
    fallbacks.push('sequential-draw')
  }

  // Check texture size
  if (
    requirements.minTextureSize &&
    capabilities.maxTextureSize &&
    capabilities.maxTextureSize < requirements.minTextureSize
  ) {
    unsupported.push(`textureSize:${requirements.minTextureSize}`)
    fallbacks.push(`maxTextureSize:${capabilities.maxTextureSize}`)
  }

  return {
    supported: unsupported.length === 0,
    degraded: unsupported.length > 0 && fallbacks.length > 0,
    unsupported,
    fallbacks,
  }
}

/** Auto-detect best renderer based on browser capabilities */
export function detectBestRenderer(): 'webgpu' | 'webgl' | 'canvas2d' {
  // Check WebGPU
  if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
    return 'webgpu'
  }

  // Check WebGL
  if (typeof document !== 'undefined') {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      if (gl) return 'webgl'
    } catch {
      // WebGL not available
    }
  }

  return 'canvas2d'
}
