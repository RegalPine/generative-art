/**
 * Post-processing Pipeline — bloom, DOF, vignette, and other effects.
 *
 * These effects are applied after the main render pass.
 * For Canvas2D: applied as CSS filters or additional draw calls.
 * For WebGL/WebGPU: applied as screen-space shader passes.
 */

/** Post-processing effect type */
export type PostProcessEffectType =
  | 'bloom'
  | 'dof' // depth of field
  | 'vignette'
  | 'chromatic-aberration'
  | 'film-grain'
  | 'color-grade'

/** Post-processing effect configuration */
export interface PostProcessEffect {
  type: PostProcessEffectType
  enabled: boolean
  intensity: number
  params: Record<string, number>
}

/** Bloom effect config */
export interface BloomConfig {
  threshold: number
  radius: number
  intensity: number
}

/** DOF (depth of field) config */
export interface DOFConfig {
  focusDistance: number
  aperture: number
  maxBlur: number
}

/** Vignette config */
export interface VignetteConfig {
  radius: number
  softness: number
  opacity: number
}

/** Post-processing pipeline */
export interface PostProcessPipeline {
  effects: PostProcessEffect[]
  enabled: boolean
}

/** Create a default post-processing pipeline (no effects) */
export function createDefaultPostProcessPipeline(): PostProcessPipeline {
  return {
    effects: [],
    enabled: true,
  }
}

/** Create a bloom effect */
export function createBloomEffect(config: Partial<BloomConfig> = {}): PostProcessEffect {
  return {
    type: 'bloom',
    enabled: true,
    intensity: config.intensity ?? 0.5,
    params: {
      threshold: config.threshold ?? 0.8,
      radius: config.radius ?? 4,
    },
  }
}

/** Create a DOF effect */
export function createDOFEffect(config: Partial<DOFConfig> = {}): PostProcessEffect {
  return {
    type: 'dof',
    enabled: true,
    intensity: 1,
    params: {
      focusDistance: config.focusDistance ?? 0.5,
      aperture: config.aperture ?? 2.8,
      maxBlur: config.maxBlur ?? 5,
    },
  }
}

/** Create a vignette effect */
export function createVignetteEffect(config: Partial<VignetteConfig> = {}): PostProcessEffect {
  return {
    type: 'vignette',
    enabled: true,
    intensity: config.opacity ?? 0.3,
    params: {
      radius: config.radius ?? 0.7,
      softness: config.softness ?? 0.5,
    },
  }
}

/** Create a film grain effect */
export function createFilmGrainEffect(intensity = 0.1): PostProcessEffect {
  return {
    type: 'film-grain',
    enabled: true,
    intensity,
    params: {},
  }
}

/** Create a chromatic aberration effect */
export function createChromaticAberrationEffect(intensity = 0.01): PostProcessEffect {
  return {
    type: 'chromatic-aberration',
    enabled: true,
    intensity,
    params: {},
  }
}

/** Apply post-processing effects to a CSS filter string */
export function postProcessToCSSFilter(pipeline: PostProcessPipeline): string {
  if (!pipeline.enabled) return ''

  const filters: string[] = []

  for (const effect of pipeline.effects) {
    if (!effect.enabled) continue

    switch (effect.type) {
      case 'bloom':
        // Bloom approximated with brightness + blur
        filters.push(`brightness(${1 + effect.intensity * 0.3})`)
        break
      case 'dof': {
        const blur = effect.params.maxBlur ?? 5
        filters.push(`blur(${blur * effect.intensity}px)`)
        break
      }
      case 'vignette':
        // Vignette can't be done with CSS filter alone, needs overlay
        break
      case 'film-grain':
        // Film grain needs a separate overlay
        break
      case 'chromatic-aberration':
        // Chromatic aberration needs shader
        break
    }
  }

  return filters.join(' ')
}
