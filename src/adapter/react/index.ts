/**
 * React Adapter — GenerativeArtCanvas component.
 *
 * This is a framework-agnostic adapter that provides the integration pattern.
 * Actual React usage: wrap in a React component with useRef + useEffect.
 *
 * Usage pattern:
 *   const canvasRef = useRef<HTMLCanvasElement>(null)
 *   useEffect(() => {
 *     const art = createGenerativeArt({ target: canvasRef.current!, preset: 'flow' })
 *     art.start()
 *     return () => art.destroy()
 *   }, [])
 */

import type { GenerativeArt, GenerativeArtConfig, SemanticArtConfig } from '../../core/types'
import { createGenerativeArt } from '../../core/runtime'

/** React adapter props */
export interface GenerativeArtCanvasProps {
  preset?: string
  semantic?: Partial<SemanticArtConfig>
  seed?: number
  renderer?: 'auto' | 'canvas2d' | 'webgl' | 'webgpu'
  animated?: boolean
  className?: string
  style?: Record<string, string>
}

/** Create and manage a GenerativeArt instance for a canvas element */
export function createCanvasAdapter(
  canvas: HTMLCanvasElement,
  props: GenerativeArtCanvasProps,
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

/** Update semantic config on an existing instance */
export function updateCanvasAdapter(art: GenerativeArt, semantic: Partial<SemanticArtConfig>): void {
  art.update(semantic)
}

/** Resize an existing instance */
export function resizeCanvasAdapter(art: GenerativeArt, width: number, height: number): void {
  art.resize(width, height)
}

/** Destroy an existing instance */
export function destroyCanvasAdapter(art: GenerativeArt): void {
  art.destroy()
}
