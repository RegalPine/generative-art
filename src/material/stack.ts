/**
 * Material stack — multi-layer material composition.
 *
 * A MaterialStack applies multiple material layers in order:
 *   Base Color → Gradient → Effects (glow/blur/grain) → Blend → Depth
 */

import type { MaterialEffect } from './effects'
import type { BlendMode } from './types'

/** A single layer in a material stack */
export interface MaterialLayer {
  /** Layer type */
  type: 'color' | 'gradient' | 'effect'
  /** CSS color (for color layer) */
  color?: string
  /** Opacity (0~1) */
  opacity: number
  /** Blend mode for this layer */
  blendMode: BlendMode
  /** Effect config (for effect layer) */
  effect?: MaterialEffect
  /** Gradient config (for gradient layer) */
  gradient?: {
    type: 'linear' | 'radial' | 'conic' | 'depth' | 'field'
    stops: Array<{ offset: number; color: string; opacity?: number }>
    angle?: number
    center?: { x: number; y: number }
  }
}

/** Material stack — ordered list of material layers */
export class MaterialStack {
  readonly layers: MaterialLayer[]

  constructor(layers: MaterialLayer[]) {
    this.layers = layers
  }

  /** Add a layer to the stack */
  push(layer: MaterialLayer): MaterialStack {
    return new MaterialStack([...this.layers, layer])
  }

  /** Get the number of layers */
  get size(): number {
    return this.layers.length
  }

  /** Get the effective opacity (product of all layer opacities) */
  get effectiveOpacity(): number {
    return this.layers.reduce((acc, l) => acc * l.opacity, 1)
  }

  /** Get the base color (first color layer) */
  get baseColor(): string {
    for (const layer of this.layers) {
      if (layer.type === 'color' && layer.color) {
        return layer.color
      }
    }
    return '#888888'
  }
}

/** Create a default material stack from basic properties */
export function createMaterialStack(config: {
  color?: string
  opacity?: number
  blendMode?: BlendMode
  effects?: MaterialEffect[]
}): MaterialStack {
  const layers: MaterialLayer[] = []

  // Base color layer
  layers.push({
    type: 'color',
    color: config.color ?? '#888888',
    opacity: config.opacity ?? 1,
    blendMode: config.blendMode ?? 'normal',
  })

  // Effect layers
  if (config.effects) {
    for (const effect of config.effects) {
      layers.push({
        type: 'effect',
        opacity: 1,
        blendMode: 'normal',
        effect,
      })
    }
  }

  return new MaterialStack(layers)
}
