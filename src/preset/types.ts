/**
 * Preset types — reusable visual configurations.
 *
 * Preset = Geometry + Field + Composition + Motion + Material bundled together.
 * Presets are versioned (MAJOR.MINOR.PATCH) and can be registered/looked up.
 */

import type { GeometryConfig } from '../geometry/types'
import type { CompositionConfig } from '../composition/types'
import type { MotionConfig } from '../motion/types'
import type { MaterialConfig } from '../material/types'

/** Preset schema — full preset definition */
export interface PresetSchema {
  id: string
  version: string
  geometry?: GeometryConfig
  field?: Record<string, unknown>
  composition?: CompositionConfig
  motion?: MotionConfig
  material?: MaterialConfig
  semantic?: {
    density?: number
    complexity?: number
    energy?: number
    softness?: number
    depth?: number
    rhythm?: number
    turbulence?: number
    focus?: number
  }
  responsive?: {
    breakpoints?: Record<string, Record<string, unknown>>
  }
  metadata?: {
    name?: string
    description?: string
    author?: string
    tags?: string[]
    performanceProfile?: 'light' | 'balanced' | 'rich' | 'experimental'
  }
}

/** Preset configuration — user-facing preset reference */
export interface PresetConfig {
  id: string
  version?: string
  overrides?: Record<string, unknown>
}

/** Preset registry interface */
export interface PresetRegistry {
  register(preset: PresetSchema): void
  unregister(id: string): void
  get(id: string): PresetSchema | undefined
  getAll(): PresetSchema[]
  has(id: string): boolean
}
