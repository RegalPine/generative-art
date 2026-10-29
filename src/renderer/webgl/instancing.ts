/**
 * WebGL Instancing — batch rendering for repeated geometry.
 *
 * Uses ANGLE_instanced_arrays extension for efficient drawing of
 * many instances of the same base geometry with different transforms.
 */

import type { InstanceData } from './types'
import type { VertexData } from './geometry'
import { createVertexBuffer } from './geometry'
import { INSTANCED_VERTEX_SHADER, DEFAULT_FRAGMENT_SHADER, createProgram } from './shader'

/** Instanced draw context */
export interface InstancedDrawContext {
  gl: WebGLRenderingContext
  program: WebGLProgram
  ext: ANGLE_instanced_arrays
  attribs: {
    position: number
    color: number
    opacity: number
    offset: number
    scale: number
    rotation: number
  }
  uniforms: {
    resolution: WebGLUniformLocation | null
    globalOpacity: WebGLUniformLocation | null
  }
}

/** Initialize instanced draw program */
export function initInstancedProgram(gl: WebGLRenderingContext): InstancedDrawContext | null {
  const ext = gl.getExtension('ANGLE_instanced_arrays')
  if (!ext) return null

  const program = createProgram(gl, INSTANCED_VERTEX_SHADER, DEFAULT_FRAGMENT_SHADER)
  if (!program) return null

  return {
    gl,
    program,
    ext,
    attribs: {
      position: gl.getAttribLocation(program, 'a_position'),
      color: gl.getAttribLocation(program, 'a_color'),
      opacity: gl.getAttribLocation(program, 'a_opacity'),
      offset: gl.getAttribLocation(program, 'a_offset'),
      scale: gl.getAttribLocation(program, 'a_scale'),
      rotation: gl.getAttribLocation(program, 'a_rotation'),
    },
    uniforms: {
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      globalOpacity: gl.getUniformLocation(program, 'u_globalOpacity'),
    },
  }
}

/** Draw instanced geometry */
export function drawInstanced(
  ctx: InstancedDrawContext,
  baseGeometry: VertexData,
  instances: InstanceData[],
  resolution: [number, number],
  globalOpacity: number,
): void {
  const { gl, program, ext, attribs, uniforms } = ctx
  const instanceCount = instances.length

  if (instanceCount === 0) return

  gl.useProgram(program)

  // Set uniforms
  gl.uniform2f(uniforms.resolution, resolution[0], resolution[1])
  gl.uniform1f(uniforms.globalOpacity, globalOpacity)

  // Create base geometry buffer (shared across instances)
  const baseBuffer = createVertexBuffer(gl, baseGeometry.positions)
  if (!baseBuffer) return

  gl.bindBuffer(gl.ARRAY_BUFFER, baseBuffer)
  gl.enableVertexAttribArray(attribs.position)
  gl.vertexAttribPointer(attribs.position, 2, gl.FLOAT, false, 0, 0)

  // Create per-instance buffers
  const offsetData = new Float32Array(instanceCount * 2)
  const scaleData = new Float32Array(instanceCount)
  const rotationData = new Float32Array(instanceCount)
  const colorData = new Float32Array(instanceCount * 4)
  const opacityData = new Float32Array(instanceCount)

  for (let i = 0; i < instanceCount; i++) {
    const inst = instances[i]!
    offsetData[i * 2] = inst.offsetX
    offsetData[i * 2 + 1] = inst.offsetY
    scaleData[i] = inst.scale
    rotationData[i] = inst.rotation
    colorData[i * 4] = inst.color[0]
    colorData[i * 4 + 1] = inst.color[1]
    colorData[i * 4 + 2] = inst.color[2]
    colorData[i * 4 + 3] = inst.color[3]
    opacityData[i] = inst.opacity
  }

  // Offset buffer
  const offsetBuffer = createVertexBuffer(gl, offsetData)
  if (offsetBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer)
    gl.enableVertexAttribArray(attribs.offset)
    gl.vertexAttribPointer(attribs.offset, 2, gl.FLOAT, false, 0, 0)
    ext.vertexAttribDivisorANGLE(attribs.offset, 1)
  }

  // Scale buffer
  const scaleBuffer = createVertexBuffer(gl, scaleData)
  if (scaleBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, scaleBuffer)
    gl.enableVertexAttribArray(attribs.scale)
    gl.vertexAttribPointer(attribs.scale, 1, gl.FLOAT, false, 0, 0)
    ext.vertexAttribDivisorANGLE(attribs.scale, 1)
  }

  // Rotation buffer
  const rotationBuffer = createVertexBuffer(gl, rotationData)
  if (rotationBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, rotationBuffer)
    gl.enableVertexAttribArray(attribs.rotation)
    gl.vertexAttribPointer(attribs.rotation, 1, gl.FLOAT, false, 0, 0)
    ext.vertexAttribDivisorANGLE(attribs.rotation, 1)
  }

  // Color buffer
  const colorBuffer = createVertexBuffer(gl, colorData)
  if (colorBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    gl.enableVertexAttribArray(attribs.color)
    gl.vertexAttribPointer(attribs.color, 4, gl.FLOAT, false, 0, 0)
    ext.vertexAttribDivisorANGLE(attribs.color, 1)
  }

  // Opacity buffer
  const opacityBuffer = createVertexBuffer(gl, opacityData)
  if (opacityBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, opacityBuffer)
    gl.enableVertexAttribArray(attribs.opacity)
    gl.vertexAttribPointer(attribs.opacity, 1, gl.FLOAT, false, 0, 0)
    ext.vertexAttribDivisorANGLE(attribs.opacity, 1)
  }

  // Draw instanced
  ext.drawArraysInstancedANGLE(gl.TRIANGLES, 0, baseGeometry.vertexCount, instanceCount)

  // Cleanup
  gl.disableVertexAttribArray(attribs.position)
  gl.disableVertexAttribArray(attribs.offset)
  gl.disableVertexAttribArray(attribs.scale)
  gl.disableVertexAttribArray(attribs.rotation)
  gl.disableVertexAttribArray(attribs.color)
  gl.disableVertexAttribArray(attribs.opacity)

  gl.deleteBuffer(baseBuffer)
  if (offsetBuffer) gl.deleteBuffer(offsetBuffer)
  if (scaleBuffer) gl.deleteBuffer(scaleBuffer)
  if (rotationBuffer) gl.deleteBuffer(rotationBuffer)
  if (colorBuffer) gl.deleteBuffer(colorBuffer)
  if (opacityBuffer) gl.deleteBuffer(opacityBuffer)
}
