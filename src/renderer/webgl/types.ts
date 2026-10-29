/**
 * WebGL Renderer types — internal types for WebGL rendering subsystem.
 */

import type { VertexData } from './geometry'

/** WebGL draw context — holds compiled program and attribute/uniform locations */
export interface WebGLDrawContext {
  gl: WebGLRenderingContext
  program: WebGLProgram
  attribs: {
    position: number
    color: number
    opacity: number
  }
  uniforms: {
    resolution: WebGLUniformLocation | null
    globalOpacity: WebGLUniformLocation | null
  }
}

/** A batch of geometry data ready for GPU submission */
export interface DrawBatch {
  vertexData: VertexData
  opacity: number
  blendMode?: string
}

/** Gradient batch with additional gradient uniforms */
export interface GradientBatch extends DrawBatch {
  gradientType: 'linear' | 'radial'
  color0: [number, number, number, number]
  color1: [number, number, number, number]
  angle: number
}

/** Instanced batch for batch rendering */
export interface InstancedBatch {
  baseGeometry: VertexData
  instances: InstanceData[]
  opacity: number
}

/** Per-instance data for instanced rendering */
export interface InstanceData {
  offsetX: number
  offsetY: number
  scale: number
  rotation: number
  color: [number, number, number, number]
  opacity: number
}

/** WebGL renderer configuration */
export interface WebGLRendererConfig {
  antialias?: boolean
  alpha?: boolean
  premultipliedAlpha?: boolean
  preserveDrawingBuffer?: boolean
  maxInstances?: number
}
