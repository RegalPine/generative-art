/**
 * Plugin register helpers — convenience APIs for external registration.
 *
 * Note: Most registration happens via PluginContext inside plugin.install().
 * These helpers are for direct registration without a plugin wrapper.
 */

import type { PresetSchema } from '../preset/types'
import { registerPreset } from '../preset/registry'

/** Register a custom preset directly (without plugin) */
export function registerCustomPreset(preset: PresetSchema): void {
  registerPreset(preset)
}
