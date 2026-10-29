/**
 * Material resolver — converts MaterialConfig to ResolvedMaterial.
 *
 * Handles:
 * - Semantic → mathematical parameter mapping
 * - Default filling
 * - Color resolution
 * - Gradient resolution
 * - Blend mode mapping to Canvas2D globalCompositeOperation
 */

import type {
  MaterialConfig,
  MaterialContext,
  ResolvedMaterial,
  BlendMode,
} from './types'

/** Default material configuration */
export const DEFAULT_MATERIAL: MaterialConfig = {
  color: { value: '#888888' },
  opacity: 1,
  blendMode: 'normal',
  blur: 0,
  depth: 0,
}

/** Resolve a material config to render-ready properties */
export function resolveMaterial(
  config: MaterialConfig,
  _context: MaterialContext,
): ResolvedMaterial {
  const merged = { ...DEFAULT_MATERIAL, ...config }

  return {
    color: merged.color?.value ?? '#888888',
    opacity: clamp01(merged.opacity ?? 1),
    gradient: merged.gradient ?? null,
    glow: merged.glow ?? null,
    blur: Math.max(0, merged.blur ?? 0),
    blendMode: merged.blendMode ?? 'normal',
  }
}

/** Map blend mode to Canvas2D globalCompositeOperation */
export function blendModeToCompositeOperation(mode: BlendMode): string {
  const map: Record<BlendMode, string> = {
    normal: 'source-over',
    multiply: 'multiply',
    screen: 'screen',
    overlay: 'overlay',
    darken: 'darken',
    lighten: 'lighten',
    'soft-light': 'soft-light',
    'hard-light': 'hard-light',
    'color-dodge': 'color-dodge',
    'color-burn': 'color-burn',
  }
  return map[mode] ?? 'source-over'
}

/** Clamp value to [0, 1] */
function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v))
}

/** Resolve semantic config to material overrides */
export function semanticToMaterialOverrides(semantic: {
  softness: number
  depth: number
}): Partial<MaterialConfig> {
  return {
    // softness → blur
    blur: semantic.softness * 2,
    // depth → opacity variation
    opacity: 0.5 + semantic.depth * 0.5,
  }
}
