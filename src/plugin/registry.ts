/**
 * Plugin Registry — manages plugin installation and lifecycle.
 */

import type { Plugin, PluginEntry, PluginContext } from './types'
import type { GeometryGenerator } from '../geometry/types'
import type { PresetSchema } from '../preset/types'
import type { FieldFactory, MotionFactory, MaterialFactory } from './types'
import { registerPreset } from '../preset/registry'

/** Engine version */
const ENGINE_VERSION = '1.0.0'

/** Plugin registry — manages all installed plugins */
class PluginRegistryImpl {
  private plugins = new Map<string, PluginEntry>()
  private geometryGenerators = new Map<string, GeometryGenerator>()
  private fieldFactories = new Map<string, FieldFactory>()
  private motionFactories = new Map<string, MotionFactory>()
  private materialFactories = new Map<string, MaterialFactory>()

  /** Install a plugin */
  install(plugin: Plugin): void {
    const name = plugin.meta.name

    if (this.plugins.has(name)) {
      throw new Error(`Plugin '${name}' is already installed`)
    }

    // Create plugin context
    const context: PluginContext = {
      registerGeometry: (type: string, generator: GeometryGenerator) => {
        this.geometryGenerators.set(type, generator)
      },
      registerPreset: (preset: PresetSchema) => {
        registerPreset(preset)
      },
      registerField: (type: string, factory: FieldFactory) => {
        this.fieldFactories.set(type, factory)
      },
      registerMotion: (type: string, factory: MotionFactory) => {
        this.motionFactories.set(type, factory)
      },
      registerMaterial: (type: string, factory: MaterialFactory) => {
        this.materialFactories.set(type, factory)
      },
      getEngineVersion: () => ENGINE_VERSION,
    }

    // Install plugin
    plugin.install(context)

    this.plugins.set(name, {
      plugin,
      state: 'active',
      installedAt: Date.now(),
    })
  }

  /** Uninstall a plugin */
  uninstall(name: string): void {
    const entry = this.plugins.get(name)
    if (!entry) return

    if (entry.plugin.uninstall) {
      const context: PluginContext = {
        registerGeometry: () => { /* no-op during uninstall */ },
        registerPreset: () => { /* no-op during uninstall */ },
        registerField: () => { /* no-op during uninstall */ },
        registerMotion: () => { /* no-op during uninstall */ },
        registerMaterial: () => { /* no-op during uninstall */ },
        getEngineVersion: () => ENGINE_VERSION,
      }
      entry.plugin.uninstall(context)
    }

    entry.state = 'uninstalled'
    this.plugins.delete(name)
  }

  /** Get a plugin by name */
  get(name: string): PluginEntry | undefined {
    return this.plugins.get(name)
  }

  /** List all installed plugins */
  list(): PluginEntry[] {
    return Array.from(this.plugins.values())
  }

  /** Check if a plugin is installed */
  has(name: string): boolean {
    return this.plugins.has(name)
  }

  /** Get a registered geometry generator */
  getGeometryGenerator(type: string): GeometryGenerator | undefined {
    return this.geometryGenerators.get(type)
  }

  /** Get a registered field factory */
  getFieldFactory(type: string): FieldFactory | undefined {
    return this.fieldFactories.get(type)
  }

  /** Get a registered motion factory */
  getMotionFactory(type: string): MotionFactory | undefined {
    return this.motionFactories.get(type)
  }

  /** Get a registered material factory */
  getMaterialFactory(type: string): MaterialFactory | undefined {
    return this.materialFactories.get(type)
  }

  /** Clear all plugins */
  clear(): void {
    for (const name of this.plugins.keys()) {
      this.uninstall(name)
    }
    this.plugins.clear()
    this.geometryGenerators.clear()
    this.fieldFactories.clear()
    this.motionFactories.clear()
    this.materialFactories.clear()
  }
}

/** Global plugin registry singleton */
export const pluginRegistry = new PluginRegistryImpl()

/** Install a plugin */
export function installPlugin(plugin: Plugin): void {
  pluginRegistry.install(plugin)
}

/** Uninstall a plugin */
export function uninstallPlugin(name: string): void {
  pluginRegistry.uninstall(name)
}

/** List installed plugins */
export function listPlugins(): PluginEntry[] {
  return pluginRegistry.list()
}
