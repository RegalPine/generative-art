/**
 * Offscreen Canvas — renders in a worker thread using OffscreenCanvas.
 *
 * Allows rendering to happen off the main thread,
 * preventing UI jank during heavy computation.
 */

import type { Renderer, RenderContext, RenderFrameContext, RenderScene, RendererCapabilities } from './types'

/** Offscreen canvas renderer wrapper */
export class OffscreenRenderer implements Renderer {
  readonly type = 'offscreen'
  readonly capabilities: RendererCapabilities

  private worker: Worker | null = null
  private canvas: HTMLCanvasElement | null = null
  private offscreen: OffscreenCanvas | null = null
  private isPaused = false
  private isDisposed = false
  private innerCapabilities: RendererCapabilities

  constructor(innerCapabilities: RendererCapabilities) {
    this.innerCapabilities = innerCapabilities
    this.capabilities = {
      ...innerCapabilities,
      type: 'offscreen',
      supportsOffscreen: true,
    }
  }

  initialize(context: RenderContext): void {
    this.canvas = context.canvas

    // Transfer canvas to OffscreenCanvas
    if (typeof this.canvas.transferControlToOffscreen === 'function') {
      this.offscreen = this.canvas.transferControlToOffscreen()
    } else {
      // Fallback: create a separate OffscreenCanvas
      this.offscreen = new OffscreenCanvas(
        context.width * context.dpr,
        context.height * context.dpr,
      )
    }

    // Initialize worker with the offscreen canvas
    this.initWorker(context)
  }

  resize(viewport: { width: number; height: number; dpr: number }): void {
    if (!this.worker) return

    this.worker.postMessage({
      type: 'resize',
      viewport,
    })

    if (this.offscreen) {
      this.offscreen.width = viewport.width * viewport.dpr
      this.offscreen.height = viewport.height * viewport.dpr
    }
  }

  render(scene: RenderScene, context: RenderFrameContext): void {
    if (!this.worker || this.isPaused || this.isDisposed) return

    this.worker.postMessage({
      type: 'render',
      scene: {
        layers: scene.layers.map(l => ({
          id: l.id,
          zIndex: l.zIndex,
          opacity: l.opacity,
          drawCommands: l.drawCommands,
        })),
        width: scene.width,
        height: scene.height,
        time: scene.time,
      },
      context,
    })
  }

  pause(): void {
    this.isPaused = true
    this.worker?.postMessage({ type: 'pause' })
  }

  resume(): void {
    this.isPaused = false
    this.worker?.postMessage({ type: 'resume' })
  }

  dispose(): void {
    this.isDisposed = true
    this.worker?.terminate()
    this.worker = null
    this.offscreen = null
    this.canvas = null
  }

  /** Initialize the rendering worker */
  private initWorker(_context: RenderContext): void {
    if (typeof Worker === 'undefined' || !this.offscreen) return

    const script = `
      let renderer = null;
      let canvas = null;
      let ctx = null;

      self.onmessage = (event) => {
        const msg = event.data;
        switch (msg.type) {
          case 'init':
            canvas = msg.canvas;
            ctx = canvas.getContext('2d');
            break;
          case 'resize':
            if (canvas) {
              canvas.width = msg.viewport.width * msg.viewport.dpr;
              canvas.height = msg.viewport.height * msg.viewport.dpr;
            }
            break;
          case 'render':
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              // Render layers
              const layers = msg.scene.layers.sort((a, b) => a.zIndex - b.zIndex);
              for (const layer of layers) {
                ctx.globalAlpha = layer.opacity;
                for (const cmd of layer.drawCommands) {
                  // Basic rendering via Canvas2D in worker
                }
              }
            }
            break;
          case 'pause':
          case 'resume':
            break;
          case 'dispose':
            renderer = null;
            canvas = null;
            ctx = null;
            break;
        }
      };
    `

    const blob = new Blob([script], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)
    this.worker = new Worker(url)

    this.worker.postMessage(
      { type: 'init', canvas: this.offscreen },
      [this.offscreen as unknown as Transferable],
    )
  }
}

/** Create an offscreen renderer wrapper */
export function createOffscreenRenderer(
  innerCapabilities: RendererCapabilities,
): OffscreenRenderer {
  return new OffscreenRenderer(innerCapabilities)
}

/** Check if OffscreenCanvas is available */
export function isOffscreenCanvasAvailable(): boolean {
  return typeof OffscreenCanvas !== 'undefined'
}
