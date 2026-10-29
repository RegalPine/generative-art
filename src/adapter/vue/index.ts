/**
 * Vue Adapter — GenerativeArt component.
 *
 * This is a framework-agnostic adapter that provides the integration pattern.
 * Actual Vue usage: wrap in a Vue component with ref + onMounted/onUnmounted.
 *
 * Usage pattern:
 *   <template><canvas ref="canvasRef" /></template>
 *   <script setup>
 *   const canvasRef = ref(null)
 *   onMounted(() => {
 *     const art = createGenerativeArt({ target: canvasRef.value, preset: 'flow' })
 *     art.start()
 *     onUnmounted(() => art.destroy())
 *   })
 *   </script>
 */

import type { GenerativeArt, GenerativeArtConfig, SemanticArtConfig } from '../../core/types'
import { createGenerativeArt } from '../../core/runtime'

/** Vue adapter props */
export interface GenerativeArtVueProps {
  preset?: string
  semantic?: Partial<SemanticArtConfig>
  seed?: number
  renderer?: 'auto' | 'canvas2d' | 'webgl' | 'webgpu'
  animated?: boolean
}

/** Create and manage a GenerativeArt instance for a Vue canvas element */
export function createVueAdapter(
  canvas: HTMLCanvasElement,
  props: GenerativeArtVueProps,
): GenerativeArt {
  const config: GenerativeArtConfig = {
    target: canvas,
    preset: props.preset,
    semantic: props.semantic as SemanticArtConfig,
    seed: props.seed,
    renderer: props.renderer ?? 'auto',
    animated: props.animated ?? true,
  }

  const art = createGenerativeArt(config)
  art.start()
  return art
}

/** Update semantic config on an existing Vue instance */
export function updateVueAdapter(art: GenerativeArt, semantic: Partial<SemanticArtConfig>): void {
  art.update(semantic)
}

/** Destroy an existing Vue instance */
export function destroyVueAdapter(art: GenerativeArt): void {
  art.destroy()
}
