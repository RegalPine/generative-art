/**
 * Renderer types — the presentation layer of the semantic model.
 *
 * Renderer = Presentation.
 * Receives resolved Scene + Geometry + Material + Viewport → produces actual pixels.
 * Renderer does NOT create presets, modify geometry semantics, or read CSS.
 */

/** Renderer capabilities */
export interface RendererCapabilities {
  type: string
  maxTextureSize?: number
  supportsBlendModes: string[]
  supportsBlur: boolean
  supportsGlow: boolean
  supportsOffscreen: boolean
  supportsInstancing: boolean
  supportsHighDensity: boolean
}

/** Render context — provided to renderer at initialization */
export interface RenderContext {
  canvas: HTMLCanvasElement
  width: number
  height: number
  dpr: number
  capabilities: RendererCapabilities
}

/** Render frame context — provided per frame */
export interface RenderFrameContext {
  time: number
  delta: number
  viewport: { width: number; height: number; dpr: number; aspectRatio: number }
  dpr: number
  quality: RenderQuality
}

/** Render quality level */
export interface RenderQuality {
  tier: 0 | 1 | 2 | 3
  dpr: number
  maxGeometryCount: number
}

/** Scene contract — what renderer consumes */
export interface RenderScene {
  layers: RenderLayer[]
  width: number
  height: number
  time: number
}

/** A single renderable layer */
export interface RenderLayer {
  id: string
  drawCommands: DrawCommand[]
  zIndex: number
  opacity: number
}

/** A draw command for the renderer */
export interface DrawCommand {
  type: string
  path: unknown
  style: unknown
}

/** Base Renderer interface */
export interface Renderer {
  readonly type: string
  readonly capabilities: RendererCapabilities

  initialize(context: RenderContext): void
  resize(viewport: { width: number; height: number; dpr: number }): void
  render(scene: RenderScene, context: RenderFrameContext): void
  pause(): void
  resume(): void
  dispose(): void
}
