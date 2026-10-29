/**
 * Material types — the appearance layer of the semantic model.
 *
 * Material answers: "How does each element look visually?"
 * Three-layer model: Base Appearance / Visual Effects / Spatial Appearance.
 */

/** Material configuration */
export interface MaterialConfig {
  color?: ColorConfig
  opacity?: number
  gradient?: GradientConfig
  glow?: GlowConfig
  blur?: number
  grain?: number
  noise?: number
  blendMode?: BlendMode
  depth?: number
}

/** Color configuration — supports multiple color spaces */
export interface ColorConfig {
  /** CSS color string or OKLCH values */
  value: string
  /** Optional secondary color for gradients */
  secondary?: string
}

/** Gradient configuration */
export interface GradientConfig {
  type: 'linear' | 'radial' | 'conic' | 'depth' | 'field'
  stops: GradientStop[]
  angle?: number
  center?: { x: number; y: number }
}

/** Gradient stop */
export interface GradientStop {
  offset: number
  color: string
  opacity?: number
}

/** Glow configuration */
export interface GlowConfig {
  color: string
  intensity: number
  radius: number
}

/** Supported blend modes */
export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'soft-light'
  | 'hard-light'
  | 'color-dodge'
  | 'color-burn'

/** Base Material interface */
export interface Material {
  readonly type: string
  /** Resolve material to render-ready properties */
  resolve(context: MaterialContext): ResolvedMaterial
}

/** Material resolution context */
export interface MaterialContext {
  time: number
  seed: number
  viewport: { width: number; height: number }
  semantic: {
    softness: number
    depth: number
  }
}

/** Fully resolved material properties ready for renderer */
export interface ResolvedMaterial {
  color: string
  opacity: number
  gradient: GradientConfig | null
  glow: GlowConfig | null
  blur: number
  blendMode: BlendMode
}
