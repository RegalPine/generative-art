/**
 * WebGL Renderer — GPU-accelerated renderer using WebGL 1.0.
 *
 * Capabilities:
 * - Path/Line/Curve/Fill/Stroke via triangulated geometry
 * - Gradient (linear/radial) via shader
 * - Opacity + Blend modes
 * - Instanced rendering for batch optimization
 * - DPR management
 *
 * Semantic equivalence with Canvas2D:
 * - Same composition (geometry position/count/layers)
 * - Same color intent (perceptually consistent)
 * - Same motion intent (direction/speed)
 * - Same material intent (texture intent)
 */

import type {
  Renderer,
  RendererCapabilities,
  RenderContext,
  RenderFrameContext,
  RenderScene,
  RenderLayer,
  DrawCommand,
} from './types'
import type { Curve } from '../geometry/types'
import type { Point } from '../geometry/types'
import type { BlendMode } from '../material/types'
import { initDrawProgram, drawBatch, clearCanvas, enableBlending } from './webgl/draw'
import type { WebGLDrawContext } from './webgl/types'
import {
  pointsToLineVertexData,
  pointsToFillVertexData,
  pointsToCircleVertexData,
  parseColorToGL,
  createVertexBuffer,
} from './webgl/geometry'
import { applyBlendMode, resetBlendMode } from './webgl/blend'

/** WebGL Renderer capabilities */
const WEBGL_CAPABILITIES: RendererCapabilities = {
  type: 'webgl',
  maxTextureSize: 8192,
  supportsBlendModes: ['normal', 'multiply', 'screen', 'overlay', 'soft-light', 'hard-light', 'color-dodge', 'color-burn', 'darken', 'lighten'],
  supportsBlur: false,
  supportsGlow: false,
  supportsOffscreen: typeof OffscreenCanvas !== 'undefined',
  supportsInstancing: true,
  supportsHighDensity: true,
}

/** WebGL Renderer implementation */
export class WebGLRenderer implements Renderer {
  readonly type = 'webgl'
  readonly capabilities = WEBGL_CAPABILITIES

  private gl: WebGLRenderingContext | null = null
  private canvas: HTMLCanvasElement | null = null
  private drawCtx: WebGLDrawContext | null = null
  private width = 0
  private height = 0
  private dpr = 1
  private isPaused = false
  private isDisposed = false

  initialize(context: RenderContext): void {
    this.canvas = context.canvas
    this.width = context.width
    this.height = context.height
    this.dpr = context.dpr

    // Get WebGL context
    const gl = this.canvas.getContext('webgl', {
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    })

    if (!gl) {
      throw new Error('Failed to get WebGL context')
    }

    this.gl = gl

    // Set initial canvas size
    this.canvas.width = this.width * this.dpr
    this.canvas.height = this.height * this.dpr

    // Initialize draw program
    this.drawCtx = initDrawProgram(gl)
    if (!this.drawCtx) {
      throw new Error('Failed to initialize WebGL draw program')
    }

    // Enable blending
    enableBlending(gl)
  }

  resize(viewport: { width: number; height: number; dpr: number }): void {
    if (!this.gl || !this.canvas) return

    this.width = viewport.width
    this.height = viewport.height
    this.dpr = viewport.dpr

    this.canvas.width = this.width * this.dpr
    this.canvas.height = this.height * this.dpr
  }

  render(scene: RenderScene, context: RenderFrameContext): void {
    if (!this.gl || !this.drawCtx || this.isPaused || this.isDisposed) return

    const gl = this.gl
    const pixelWidth = this.width * this.dpr
    const pixelHeight = this.height * this.dpr

    // Clear
    clearCanvas(gl, pixelWidth, pixelHeight)

    // Render layers sorted by zIndex
    const sortedLayers = [...scene.layers].sort((a, b) => a.zIndex - b.zIndex)

    for (const layer of sortedLayers) {
      this.renderLayer(layer, context)
    }
  }

  pause(): void {
    this.isPaused = true
  }

  resume(): void {
    this.isPaused = false
  }

  dispose(): void {
    this.isDisposed = true
    if (this.gl && this.drawCtx) {
      this.gl.deleteProgram(this.drawCtx.program)
    }
    this.gl = null
    this.drawCtx = null
    this.canvas = null
  }

  /** Render a single layer */
  private renderLayer(layer: RenderLayer, context: RenderFrameContext): void {
    if (!this.gl || !this.drawCtx) return

    const resolution: [number, number] = [this.width * this.dpr, this.height * this.dpr]

    for (const command of layer.drawCommands) {
      this.renderCommand(command, context, layer.opacity, resolution)
    }
  }

  /** Render a single draw command */
  private renderCommand(
    command: DrawCommand,
    _context: RenderFrameContext,
    layerOpacity: number,
    resolution: [number, number],
  ): void {
    if (!this.gl || !this.drawCtx) return

    const gl = this.gl
    const style = command.style as {
      color?: string
      opacity?: number
      blendMode?: BlendMode
      lineWidth?: number
      fill?: boolean
      radius?: number
    }

    const opacity = (style.opacity ?? 1) * layerOpacity
    const color = parseColorToGL(style.color ?? '#888888')

    // Apply blend mode
    if (style.blendMode) {
      applyBlendMode(gl, style.blendMode)
    }

    if (command.type === 'curve' || command.type === 'path') {
      const curve = command.path as Curve
      const points = curve.sample(100)

      if (style.fill) {
        const vd = pointsToFillVertexData(points, color, opacity, this.width, this.height)
        const buffer = this.createInterleavedBuffer(vd)
        if (buffer) {
          drawBatch(this.drawCtx, buffer, vd.vertexCount, resolution, 1)
          gl.deleteBuffer(buffer)
        }
      } else {
        const vd = pointsToLineVertexData(points, color, opacity, this.width, this.height)
        const buffer = this.createInterleavedBuffer(vd)
        if (buffer) {
          drawBatch(this.drawCtx, buffer, vd.vertexCount, resolution, 1)
          gl.deleteBuffer(buffer)
        }
      }
    } else if (command.type === 'points') {
      const points = command.path as Point[]
      const radius = style.radius ?? style.lineWidth ?? 2
      const vd = pointsToCircleVertexData(points, radius, color, opacity, this.width, this.height)
      const buffer = this.createInterleavedBuffer(vd)
      if (buffer) {
        drawBatch(this.drawCtx, buffer, vd.vertexCount, resolution, 1)
        gl.deleteBuffer(buffer)
      }
    }

    // Reset blend mode
    if (style.blendMode) {
      resetBlendMode(gl)
    }
  }

  /** Create interleaved vertex buffer */
  private createInterleavedBuffer(vd: {
    positions: Float32Array
    colors: Float32Array
    opacities: Float32Array
    vertexCount: number
  }): WebGLBuffer | null {
    if (!this.drawCtx) return null

    const stride = 7
    const interleavedData = new Float32Array(vd.vertexCount * stride)

    for (let i = 0; i < vd.vertexCount; i++) {
      const offset = i * stride
      interleavedData[offset] = vd.positions[i * 2]!
      interleavedData[offset + 1] = vd.positions[i * 2 + 1]!
      interleavedData[offset + 2] = vd.colors[i * 4]!
      interleavedData[offset + 3] = vd.colors[i * 4 + 1]!
      interleavedData[offset + 4] = vd.colors[i * 4 + 2]!
      interleavedData[offset + 5] = vd.colors[i * 4 + 3]!
      interleavedData[offset + 6] = vd.opacities[i]!
    }

    return createVertexBuffer(this.gl!, interleavedData)
  }
}

/** Create a WebGL renderer instance */
export function createWebGLRenderer(): WebGLRenderer {
  return new WebGLRenderer()
}
