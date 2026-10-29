/**
 * Composition types — the organization layer of the semantic model.
 *
 * Composition answers:
 * "Where, at what density, layer, scale, rhythm, and visual weight should geometry appear?"
 */

import type { Geometry } from '../geometry/types'
import type { Field } from '../field/types'

/** Composition context */
export interface CompositionContext {
  viewport: { width: number; height: number }
  seed: number
  semantic: {
    density: number
    complexity: number
    energy: number
    softness: number
    depth: number
    rhythm: number
    turbulence: number
    focus: number
  }
  field?: Field
}

/** A scene layer produced by composition */
export interface CompositionLayer {
  id: string
  geometries: Geometry[]
  zIndex: number
  opacity: number
  role: 'background' | 'atmosphere' | 'structure' | 'flow' | 'accent' | 'foreground'
}

/** Distribution configuration */
export interface DistributionConfig {
  type: 'uniform' | 'grid' | 'random' | 'poisson' | 'radial' | 'spiral' | 'cluster' | 'flow' | 'edge' | 'center' | 'golden' | 'organic'
  count?: number
  minSpacing?: number
}

/** Focus configuration */
export interface FocusConfig {
  position: { x: number; y: number }
  radius?: number
  strength?: number
}

/** Depth configuration */
export interface DepthConfig {
  layers: number
  scaleVariation: number
  opacityVariation: number
}

/** Rhythm configuration */
export interface RhythmConfig {
  strength: number
  pattern?: 'regular' | 'alternating' | 'progressive' | 'random'
}

/** Composition configuration */
export interface CompositionConfig {
  distribution?: DistributionConfig
  density?: number
  balance?: number
  symmetry?: number
  focus?: FocusConfig
  depth?: DepthConfig
  rhythm?: RhythmConfig
  negativeSpace?: number
}

/** Base Composition interface */
export interface Composition {
  arrange(geometries: Geometry[], context: CompositionContext): CompositionLayer[]
}
