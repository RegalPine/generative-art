/**
 * Preset Registry — register, lookup, and manage presets.
 *
 * Presets are versioned (MAJOR.MINOR.PATCH) and can be:
 * - Built-in (shipped with the engine)
 * - User-registered (via registerPreset)
 */

import type { PresetSchema } from './types'
import { BUILT_IN_PRESETS } from './built-in'

/** Preset registry — singleton store for all presets */
class PresetRegistryImpl {
  private presets = new Map<string, PresetSchema>()

  /** Register a preset */
  register(preset: PresetSchema): void {
    this.presets.set(preset.id, preset)
  }

  /** Unregister a preset */
  unregister(id: string): void {
    this.presets.delete(id)
  }

  /** Get a preset by ID */
  get(id: string): PresetSchema | undefined {
    return this.presets.get(id)
  }

  /** Check if a preset exists */
  has(id: string): boolean {
    return this.presets.has(id)
  }

  /** List all registered preset IDs */
  list(): string[] {
    return Array.from(this.presets.keys())
  }

  /** Clear all presets */
  clear(): void {
    this.presets.clear()
  }
}

/** Global preset registry singleton */
export const presetRegistry = new PresetRegistryImpl()

/** Register a preset */
export function registerPreset(preset: PresetSchema): void {
  presetRegistry.register(preset)
}

/** Get a preset by ID */
export function getPreset(id: string): PresetSchema | undefined {
  return presetRegistry.get(id)
}

/** List all preset IDs */
export function listPresets(): string[] {
  return presetRegistry.list()
}

// Auto-register built-in presets
for (const preset of BUILT_IN_PRESETS) {
  presetRegistry.register(preset)
}
