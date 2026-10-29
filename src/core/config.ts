/**
 * Configuration normalization and resolution.
 *
 * Priority chain (low → high):
 *   Default → Preset → Theme → CSS → Data Attribute → JavaScript → Runtime update()
 */

import type { GenerativeArtConfig, SemanticArtConfig } from './types'

/** Default semantic configuration values */
export const DEFAULT_SEMANTIC: Required<SemanticArtConfig> = {
  density: 0.5,
  complexity: 0.5,
  energy: 0.5,
  softness: 0.5,
  depth: 0.5,
  rhythm: 0.5,
  turbulence: 0.5,
  focus: 0.5,
}

/** Clamp a value to [0, 1] range */
function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value))
}

/** Normalize semantic config, filling defaults and clamping values */
export function normalizeSemanticConfig(
  config: Partial<SemanticArtConfig> | undefined,
): Required<SemanticArtConfig> {
  const merged = { ...DEFAULT_SEMANTIC, ...config }
  return {
    density: clamp01(merged.density),
    complexity: clamp01(merged.complexity),
    energy: clamp01(merged.energy),
    softness: clamp01(merged.softness),
    depth: clamp01(merged.depth),
    rhythm: clamp01(merged.rhythm),
    turbulence: clamp01(merged.turbulence),
    focus: clamp01(merged.focus),
  }
}

/** Normalize full GenerativeArtConfig with defaults */
export function normalizeConfig(config: GenerativeArtConfig): Required<
  Omit<GenerativeArtConfig, 'target' | 'preset' | 'semantic'>
> & {
  target: GenerativeArtConfig['target']
  preset: GenerativeArtConfig['preset']
  semantic: Required<SemanticArtConfig>
} {
  return {
    target: config.target,
    preset: config.preset,
    seed: config.seed ?? Date.now(),
    renderer: config.renderer ?? 'auto',
    maxDpr: config.maxDpr ?? 2,
    animated: config.animated ?? true,
    semantic: normalizeSemanticConfig(config.semantic),
  }
}
