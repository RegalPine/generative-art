/**
 * CSS Responsive — media query integration for CSS variable-driven presets.
 *
 * SSR-safe: only accesses window/matchMedia when explicitly called.
 */

import type { SemanticArtConfig } from '../core/types'

/** Responsive breakpoint configuration */
export interface ResponsiveBreakpoint {
  name: string
  query: string
  overrides: Partial<SemanticArtConfig>
}

/** Default responsive breakpoints */
export const DEFAULT_BREAKPOINTS: ResponsiveBreakpoint[] = [
  {
    name: 'mobile',
    query: '(max-width: 767px)',
    overrides: { density: 0.3, complexity: 0.3, turbulence: 0.2 },
  },
  {
    name: 'tablet',
    query: '(min-width: 768px) and (max-width: 1023px)',
    overrides: { density: 0.5, complexity: 0.5, turbulence: 0.4 },
  },
  {
    name: 'desktop',
    query: '(min-width: 1024px)',
    overrides: { density: 0.7, complexity: 0.7, turbulence: 0.5 },
  },
  {
    name: 'large',
    query: '(min-width: 1440px)',
    overrides: { density: 0.8, complexity: 0.8, turbulence: 0.6 },
  },
]

/** Responsive config result */
export interface ResponsiveConfig {
  activeBreakpoint: string
  config: Partial<SemanticArtConfig>
}

/** Create a responsive manager that monitors media queries */
export function createResponsiveManager(
  breakpoints: ResponsiveBreakpoint[] = DEFAULT_BREAKPOINTS,
  onChange: (config: ResponsiveConfig) => void,
): { start(): void; stop(): void; getCurrent(): ResponsiveConfig } {
  let _currentBreakpoint = 'desktop'
  let listeners: Array<{ mql: MediaQueryList; handler: () => void }> = []

  function detectBreakpoint(): ResponsiveConfig {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return { activeBreakpoint: 'desktop', config: {} }
    }

    for (const bp of breakpoints) {
      const mql = window.matchMedia(bp.query)
      if (mql.matches) {
        _currentBreakpoint = bp.name
        return { activeBreakpoint: bp.name, config: bp.overrides }
      }
    }

    return { activeBreakpoint: 'desktop', config: {} }
  }

  return {
    start(): void {
      if (typeof window === 'undefined' || !window.matchMedia) return

      listeners = breakpoints.map((bp) => {
        const mql = window.matchMedia(bp.query)
        const handler = (): void => {
          if (mql.matches) {
            _currentBreakpoint = bp.name
            onChange({ activeBreakpoint: bp.name, config: bp.overrides })
          }
        }
        mql.addEventListener('change', handler)
        return { mql, handler }
      })

      // Detect initial breakpoint
      const initial = detectBreakpoint()
      if (initial.activeBreakpoint !== 'desktop') {
        onChange(initial)
      }
    },

    stop(): void {
      for (const { mql, handler } of listeners) {
        mql.removeEventListener('change', handler)
      }
      listeners = []
    },

    getCurrent(): ResponsiveConfig {
      return detectBreakpoint()
    },
  }
}

/** Merge base config with responsive overrides */
export function mergeResponsiveConfig(
  base: SemanticArtConfig,
  overrides: Partial<SemanticArtConfig>,
): SemanticArtConfig {
  return {
    density: overrides.density ?? base.density,
    complexity: overrides.complexity ?? base.complexity,
    energy: overrides.energy ?? base.energy,
    softness: overrides.softness ?? base.softness,
    depth: overrides.depth ?? base.depth,
    rhythm: overrides.rhythm ?? base.rhythm,
    turbulence: overrides.turbulence ?? base.turbulence,
    focus: overrides.focus ?? base.focus,
  }
}
