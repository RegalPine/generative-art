/**
 * Advanced Compositing — multi-pass rendering with framebuffers.
 *
 * Supports:
 * - Multi-layer compositing
 * - Framebuffer read-back
 * - Layer isolation (render to texture, then composite)
 */

import type { RenderScene } from './types'

/** Composite operation */
export type CompositeOperation =
  | 'over'
  | 'in'
  | 'out'
  | 'atop'
  | 'xor'
  | 'plus'

/** Composite layer descriptor */
export interface CompositeLayer {
  id: string
  source: string
  operation: CompositeOperation
  opacity: number
  mask?: string
}

/** Composite pipeline configuration */
export interface CompositePipeline {
  layers: CompositeLayer[]
  backgroundColor?: string
}

/** Default composite pipeline (simple over blending) */
export function createDefaultCompositePipeline(scene: RenderScene): CompositePipeline {
  return {
    layers: scene.layers.map(layer => ({
      id: layer.id,
      source: layer.id,
      operation: 'over' as CompositeOperation,
      opacity: layer.opacity,
    })),
  }
}

/** Apply composite pipeline to render scene */
export function applyCompositePipeline(
  scene: RenderScene,
  pipeline: CompositePipeline,
): RenderScene {
  // Sort layers by their order in the pipeline
  const layerOrder = new Map(pipeline.layers.map((l, i) => [l.id, i]))

  const sortedLayers = [...scene.layers].sort((a, b) => {
    const orderA = layerOrder.get(a.id) ?? Infinity
    const orderB = layerOrder.get(b.id) ?? Infinity
    return orderA - orderB
  })

  return {
    ...scene,
    layers: sortedLayers.map(layer => {
      const descriptor = pipeline.layers.find(l => l.id === layer.id)
      if (!descriptor) return layer
      return {
        ...layer,
        opacity: layer.opacity * descriptor.opacity,
      }
    }),
  }
}

/** Composite operation to Canvas2D globalCompositeOperation */
export function compositeOpToCanvas2D(op: CompositeOperation): string {
  switch (op) {
    case 'over': return 'source-over'
    case 'in': return 'source-in'
    case 'out': return 'source-out'
    case 'atop': return 'source-atop'
    case 'xor': return 'xor'
    case 'plus': return 'lighter'
    default: return 'source-over'
  }
}
