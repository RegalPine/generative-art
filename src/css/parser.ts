/**
 * CSS Variable parser — reads --ga-* variables from DOM.
 *
 * SSR-safe: only accesses DOM when explicitly called.
 * Supports hot-update via MutationObserver / getComputedStyle polling.
 *
 * Core variables:
 *   --ga-density, --ga-complexity, --ga-energy, --ga-softness,
 *   --ga-depth, --ga-rhythm, --ga-turbulence, --ga-focus
 */

import type { SemanticArtConfig } from '../core/types'

/** CSS variable name → semantic config key mapping */
const CSS_VAR_MAP: Record<string, keyof SemanticArtConfig> = {
  '--ga-density': 'density',
  '--ga-complexity': 'complexity',
  '--ga-energy': 'energy',
  '--ga-softness': 'softness',
  '--ga-depth': 'depth',
  '--ga-rhythm': 'rhythm',
  '--ga-turbulence': 'turbulence',
  '--ga-focus': 'focus',
}

/** All CSS variable names */
export const CSS_VARIABLES = Object.keys(CSS_VAR_MAP)

/** Parse CSS variables from an element's computed style */
export function parseCSSVariables(element: HTMLElement): Partial<SemanticArtConfig> {
  const computed = getComputedStyle(element)
  const config: Partial<SemanticArtConfig> = {}

  for (const [cssVar, key] of Object.entries(CSS_VAR_MAP)) {
    const rawValue = computed.getPropertyValue(cssVar).trim()
    if (rawValue) {
      const value = parseFloat(rawValue)
      if (!isNaN(value)) {
        config[key] = clamp01(value)
      }
    }
  }

  return config
}

/** Clamp value to [0, 1] */
function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v))
}

/** Create a CSS variable observer that calls back on changes */
export function createCSSObserver(
  element: HTMLElement,
  onChange: (config: Partial<SemanticArtConfig>) => void,
): { start(): void; stop(): void } {
  let lastValues: Partial<SemanticArtConfig> = {}
  let intervalId: ReturnType<typeof setInterval> | null = null

  function check(): void {
    const current = parseCSSVariables(element)
    const changed = hasChanged(lastValues, current)
    if (changed) {
      lastValues = current
      onChange(current)
    }
  }

  return {
    start(): void {
      // Poll every 200ms for CSS variable changes
      intervalId = setInterval(check, 200)
    },
    stop(): void {
      if (intervalId !== null) {
        clearInterval(intervalId)
        intervalId = null
      }
    },
  }
}

/** Check if two config objects differ */
function hasChanged(
  a: Partial<SemanticArtConfig>,
  b: Partial<SemanticArtConfig>,
): boolean {
  for (const key of Object.keys(CSS_VAR_MAP) as (keyof SemanticArtConfig)[]) {
    if (a[key] !== b[key]) return true
  }
  return false
}

/** Generate CSS variable declarations string from semantic config */
export function semanticToCSSVariables(config: SemanticArtConfig): string {
  const lines: string[] = []
  for (const [cssVar, key] of Object.entries(CSS_VAR_MAP)) {
    const value = config[key]
    if (value !== undefined) {
      lines.push(`${cssVar}: ${value}`)
    }
  }
  return lines.join(';\n')
}
