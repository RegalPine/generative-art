/**
 * Plugin types — contract for engine extensibility.
 *
 * Plugins can register custom geometry types, field types,
 * motion types, material types, and presets.
 */

import type { GeometryGenerator } from '../geometry/types'
import type { PresetSchema } from '../preset/types'

/** Plugin metadata */
export interface PluginMeta {
  name: string
  version: string
  description?: string
  author?: string
}

/** Plugin installation context — provided to plugin.install() */
export interface PluginContext {
  registerGeometry(type: string, generator: GeometryGenerator): void
  registerPreset(preset: PresetSchema): void
  registerField(type: string, factory: FieldFactory): void
  registerMotion(type: string, factory: MotionFactory): void
  registerMaterial(type: string, factory: MaterialFactory): void
  getEngineVersion(): string
}

/** Factory for creating field instances */
export type FieldFactory = (config: Record<string, unknown>) => unknown

/** Factory for creating motion instances */
export type MotionFactory = (config: Record<string, unknown>) => unknown

/** Factory for creating material instances */
export type MaterialFactory = (config: Record<string, unknown>) => unknown

/** Plugin interface — all plugins must implement this */
export interface Plugin {
  readonly meta: PluginMeta
  install(context: PluginContext): void
  uninstall?(context: PluginContext): void
}

/** Plugin state */
export type PluginState = 'installed' | 'active' | 'uninstalled'

/** Plugin registration entry */
export interface PluginEntry {
  plugin: Plugin
  state: PluginState
  installedAt: number
}
