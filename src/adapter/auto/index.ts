/**
 * Auto Init — automatic initialization from DOM data attributes.
 *
 * Scans DOM for elements with [data-generative-art] attribute and
 * automatically creates GenerativeArt instances.
 *
 * Usage:
 *   <canvas data-generative-art="flow" data-ga-density="0.6" data-ga-energy="0.4"></canvas>
 *   <script>
 *     import { autoInit } from '@regalpine/generative-art/auto'
 *     autoInit()
 *   </script>
 */

import type { GenerativeArt, GenerativeArtConfig, SemanticArtConfig } from '../../core/types'
import { createGenerativeArt } from '../../core/runtime'
import { parseCSSVariables } from '../../css/parser'

/** Auto-init result */
export interface AutoInitResult {
  instances: Map<HTMLCanvasElement, GenerativeArt>
  destroy(): void
}

/** Auto-init all canvas elements with data-generative-art attribute */
export function autoInit(root: HTMLElement | Document = document): AutoInitResult {
  const instances = new Map<HTMLCanvasElement, GenerativeArt>()

  if (typeof document === 'undefined') {
    return {
      instances,
      destroy() { /* no-op in SSR */ },
    }
  }

  const elements = root.querySelectorAll('canvas[data-generative-art]')

  for (const el of elements) {
    if (!(el instanceof HTMLCanvasElement)) continue

    const preset = el.getAttribute('data-generative-art') ?? 'flow'
    const seed = el.getAttribute('data-ga-seed')
    const renderer = el.getAttribute('data-ga-renderer') as GenerativeArtConfig['renderer']

    // Parse semantic config from data attributes or CSS variables
    const semantic: Partial<SemanticArtConfig> = {}
    const semanticKeys: (keyof SemanticArtConfig)[] = [
      'density', 'complexity', 'energy', 'softness',
      'depth', 'rhythm', 'turbulence', 'focus',
    ]

    for (const key of semanticKeys) {
      const value = el.getAttribute(`data-ga-${key}`)
      if (value !== null) {
        const num = parseFloat(value)
        if (!isNaN(num)) {
          semantic[key] = num
        }
      }
    }

    // Also try CSS variables
    const cssConfig = parseCSSVariables(el)
    const mergedSemantic = { ...cssConfig, ...semantic }

    const config: GenerativeArtConfig = {
      target: el,
      preset,
      semantic: mergedSemantic as SemanticArtConfig,
      seed: seed !== null ? parseInt(seed, 10) : undefined,
      renderer: renderer ?? 'auto',
      animated: true,
    }

    const art = createGenerativeArt(config)
    art.start()
    instances.set(el, art)
  }

  return {
    instances,
    destroy(): void {
      for (const art of instances.values()) {
        art.destroy()
      }
      instances.clear()
    },
  }
}
