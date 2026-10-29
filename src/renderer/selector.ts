/**
 * Renderer Selector — auto-detects best renderer with fallback chain.
 *
 * Priority: WebGPU → WebGL → Canvas2D
 * Falls back gracefully when a renderer fails to initialize.
 */

import type { Renderer, RenderContext } from './types'
import { detectBestRenderer } from './capabilities'
import { WebGLRenderer } from './webgl'
import { WebGPURenderer } from './webgpu'
import { Canvas2DRenderer } from './canvas2d'

/** Renderer selection result */
export interface RendererSelectionResult {
  renderer: Renderer
  type: 'webgpu' | 'webgl' | 'canvas2d'
  fallbackUsed: boolean
}

/** Try to create and initialize a WebGPU renderer (async) */
async function tryWebGPU(context: RenderContext): Promise<Renderer | null> {
  try {
    const renderer = new WebGPURenderer()
    await renderer.initialize(context)
    return renderer
  } catch {
    return null
  }
}

/** Try to create and initialize a WebGL renderer */
function tryWebGL(context: RenderContext): Renderer | null {
  try {
    const renderer = new WebGLRenderer()
    renderer.initialize(context)
    return renderer
  } catch {
    return null
  }
}

/** Create and initialize a Canvas2D renderer */
function createCanvas2D(context: RenderContext): Renderer {
  const renderer = new Canvas2DRenderer()
  renderer.initialize(context)
  return renderer
}

/** Select and initialize the best available renderer (sync — WebGPU requires async) */
export function selectRenderer(context: RenderContext): RendererSelectionResult {
  const preferred = detectBestRenderer()

  // WebGPU requires async initialization, so for sync path we try WebGL first
  if (preferred === 'webgl' || preferred === 'webgpu') {
    const webglRenderer = tryWebGL(context)
    if (webglRenderer) {
      return {
        renderer: webglRenderer,
        type: 'webgl',
        fallbackUsed: preferred === 'webgpu',
      }
    }
  }

  // Fallback to Canvas2D
  const canvas2dRenderer = createCanvas2D(context)
  return {
    renderer: canvas2dRenderer,
    type: 'canvas2d',
    fallbackUsed: preferred !== 'canvas2d',
  }
}

/** Select renderer with WebGPU support (async) */
export async function selectRendererAsync(context: RenderContext): Promise<RendererSelectionResult> {
  const preferred = detectBestRenderer()

  if (preferred === 'webgpu') {
    const webgpuRenderer = await tryWebGPU(context)
    if (webgpuRenderer) {
      return { renderer: webgpuRenderer, type: 'webgpu', fallbackUsed: false }
    }
    // WebGPU failed, fall through to WebGL
  }

  if (preferred === 'webgl' || preferred === 'webgpu') {
    const webglRenderer = tryWebGL(context)
    if (webglRenderer) {
      return {
        renderer: webglRenderer,
        type: 'webgl',
        fallbackUsed: preferred === 'webgpu',
      }
    }
  }

  const canvas2dRenderer = createCanvas2D(context)
  return {
    renderer: canvas2dRenderer,
    type: 'canvas2d',
    fallbackUsed: preferred !== 'canvas2d',
  }
}

/** Create renderer with explicit type preference */
export function createRenderer(
  type: 'auto' | 'canvas2d' | 'webgl' | 'webgpu',
  context: RenderContext,
): RendererSelectionResult {
  if (type === 'auto') {
    return selectRenderer(context)
  }

  if (type === 'webgpu') {
    // WebGPU requires async, use sync fallback
    return selectRenderer(context)
  }

  if (type === 'webgl') {
    const webglRenderer = tryWebGL(context)
    if (webglRenderer) {
      return { renderer: webglRenderer, type: 'webgl', fallbackUsed: false }
    }
    // WebGL failed, fallback to auto
    return selectRenderer(context)
  }

  // Canvas2D
  const canvas2dRenderer = createCanvas2D(context)
  return { renderer: canvas2dRenderer, type: 'canvas2d', fallbackUsed: false }
}
