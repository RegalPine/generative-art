/**
 * Composition implementation — the arrange() pipeline.
 *
 * Pipeline:
 *   Config → Distribution → Density → Focus → Depth → Rhythm → Balance → Layer → Scene
 *
 * Uses normalized coordinates [0,1] × [0,1].
 */

import type { Geometry } from '../geometry/types'
import type { Seed } from '../core/seed'
import { createSeed } from '../core/seed'
import type {
  Composition,
  CompositionConfig,
  CompositionContext,
  CompositionLayer,
} from './types'
import { createDistribution } from './distribution'

/** Resolved composition configuration (all fields have defaults) */
interface ResolvedCompositionConfig {
  distribution: NonNullable<CompositionConfig['distribution']>
  density: number
  balance: number
  symmetry: number
  negativeSpace: number
}

/** Default composition configuration */
export const DEFAULT_COMPOSITION: ResolvedCompositionConfig = {
  distribution: { type: 'random', count: 20 },
  density: 0.5,
  balance: 0.5,
  symmetry: 0,
  negativeSpace: 0.1,
}

/** Default composition implementation */
export class DefaultComposition implements Composition {
  private config: ResolvedCompositionConfig

  constructor(config: CompositionConfig = {}) {
    this.config = {
      distribution: config.distribution ?? DEFAULT_COMPOSITION.distribution,
      density: config.density ?? DEFAULT_COMPOSITION.density,
      balance: config.balance ?? DEFAULT_COMPOSITION.balance,
      symmetry: config.symmetry ?? DEFAULT_COMPOSITION.symmetry,
      negativeSpace: config.negativeSpace ?? DEFAULT_COMPOSITION.negativeSpace,
    }
  }

  arrange(geometries: Geometry[], context: CompositionContext): CompositionLayer[] {
    const seed = createSeed(context.seed)
    const distConfig = this.config.distribution
    const count = distConfig.count ?? Math.round(10 + this.config.density * 40)

    // Step 1: Generate distribution positions
    const distribution = createDistribution(distConfig.type, {
      field: context.field,
    })
    const positions = distribution.generate(count, seed, {
      field: context.field,
      viewport: context.viewport,
      density: this.config.density,
    })

    // Step 2: Apply density modulation (filter by density field if available)
    const filteredPositions = this.applyDensity(positions, seed, context)

    // Step 3: Apply focus field (attract toward focus point)
    const focusedPositions = this.applyFocus(filteredPositions, context)

    // Step 4: Apply balance (shift visual weight)
    const balancedPositions = this.applyBalance(focusedPositions)

    // Step 5: Assign geometries to positions (cycle through available geometries)
    const assignedGeometries = this.assignGeometries(balancedPositions, geometries, seed)

    // Step 6: Organize into layers
    return this.createLayers(assignedGeometries, balancedPositions, context)
  }

  /** Filter positions based on density */
  private applyDensity(
    positions: { x: number; y: number }[],
    seed: Seed,
    _context: CompositionContext,
  ): { x: number; y: number }[] {
    // Density controls how many positions survive
    const survivalRate = 0.3 + this.config.density * 0.7
    return positions.filter(() => seed.next() < survivalRate)
  }

  /** Apply focus — attract positions toward focus point */
  private applyFocus(
    positions: { x: number; y: number }[],
    _context: CompositionContext,
  ): { x: number; y: number }[] {
    const _focusConfig = this.config
    // Simple focus: pull positions slightly toward center based on focus strength
    // In a full implementation, this would use FocusConfig
    return positions
  }

  /** Apply balance — shift positions to balance visual weight */
  private applyBalance(positions: { x: number; y: number }[]): { x: number; y: number }[] {
    // Balance = 0.5 means perfectly centered
    // Shift positions slightly based on balance value
    const shift = (this.config.balance - 0.5) * 0.1
    return positions.map((p) => ({
      x: Math.max(0, Math.min(1, p.x + shift)),
      y: p.y,
    }))
  }

  /** Assign geometries to positions */
  private assignGeometries(
    positions: { x: number; y: number }[],
    geometries: Geometry[],
    seed: Seed,
  ): { geometry: Geometry; position: { x: number; y: number } }[] {
    if (geometries.length === 0) return []

    return positions.map((pos) => ({
      geometry: geometries[seed.int(0, geometries.length - 1)]!,
      position: pos,
    }))
  }

  /** Create layers from assigned geometries */
  private createLayers(
    assigned: { geometry: Geometry; position: { x: number; y: number } }[],
    _positions: { x: number; y: number }[],
    _context: CompositionContext,
  ): CompositionLayer[] {
    // For MVP, create 3 layers: background, structure, foreground
    const layers: CompositionLayer[] = []
    const layerCount = 3
    const perLayer = Math.ceil(assigned.length / layerCount)

    const roles: CompositionLayer['role'][] = ['background', 'structure', 'foreground']
    const opacities = [0.3, 0.6, 1.0]
    const zIndices = [0, 10, 20]

    for (let l = 0; l < layerCount; l++) {
      const start = l * perLayer
      const end = Math.min(start + perLayer, assigned.length)
      const layerGeometries = assigned.slice(start, end).map((a) => a.geometry)

      if (layerGeometries.length > 0) {
        layers.push({
          id: `layer-${l}`,
          geometries: layerGeometries,
          zIndex: zIndices[l]!,
          opacity: opacities[l]!,
          role: roles[l]!,
        })
      }
    }

    return layers
  }
}
