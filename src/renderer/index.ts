export type {
  Renderer,
  RendererCapabilities,
  RenderContext,
  RenderFrameContext,
  RenderScene,
  RenderLayer,
  DrawCommand,
  RenderQuality,
} from './types'

export { Canvas2DRenderer, createCanvas2DRenderer } from './canvas2d'
export { WebGLRenderer, createWebGLRenderer } from './webgl'
export { WebGPURenderer, createWebGPURenderer } from './webgpu'
export { negotiateCapabilities, detectBestRenderer } from './capabilities'
export type { PresetRendererRequirements, CapabilityResult } from './capabilities'
export { selectRenderer, selectRendererAsync, createRenderer } from './selector'
export type { RendererSelectionResult } from './selector'

// WebGL internals (for advanced usage)
export type { WebGLDrawContext, DrawBatch, GradientBatch, InstancedBatch, InstanceData } from './webgl/types'
export { compileShader, linkProgram, createProgram } from './webgl/shader'
export { createVertexBuffer, createIndexBuffer } from './webgl/geometry'
export type { VertexData } from './webgl/geometry'
export { initDrawProgram, drawBatch as drawWebGLBatch, clearCanvas, enableBlending } from './webgl/draw'
export { blendModeToWebGL, applyBlendMode, resetBlendMode } from './webgl/blend'
export { initInstancedProgram, drawInstanced } from './webgl/instancing'
export type { InstancedDrawContext } from './webgl/instancing'
export { initGradientProgram, drawGradientBatch, createGradientQuad } from './webgl/gradient'
export type { GradientDrawContext } from './webgl/gradient'

// WebGPU internals (for advanced usage)
export type { WebGPUVertexData } from './webgpu/geometry'
export { pointsToLineVertexData as webgpuPointsToLine, pointsToFillVertexData as webgpuPointsToFill, pointsToCircleVertexData as webgpuPointsToCircle, parseColorToWebGPU } from './webgpu/geometry'
export { createDrawBatch, submitBatch, disposeBatch } from './webgpu/batch'
export type { WebGPUDrawBatch } from './webgpu/batch'
export { blendModeToWebGPU, createBlendState } from './webgpu/material'
export type { WebGPUBlendParams } from './webgpu/material'
export { createBasicPipeline, isWebGPUAvailable, requestWebGPUDevice } from './webgpu/pipeline'

// Offscreen
export { OffscreenRenderer, createOffscreenRenderer, isOffscreenCanvasAvailable } from './offscreen'
