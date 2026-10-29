/**
 * WebGL Draw — basic drawing operations (line/curve/fill/stroke).
 */

import type { WebGLDrawContext, DrawBatch } from './types'
import { createVertexBuffer } from './geometry'
import type { VertexData } from './geometry'
import { DEFAULT_VERTEX_SHADER, DEFAULT_FRAGMENT_SHADER, createProgram } from './shader'

/** Initialize the default draw program */
export function initDrawProgram(gl: WebGLRenderingContext): WebGLDrawContext | null {
  const program = createProgram(gl, DEFAULT_VERTEX_SHADER, DEFAULT_FRAGMENT_SHADER)
  if (!program) return null

  return {
    gl,
    program,
    attribs: {
      position: gl.getAttribLocation(program, 'a_position'),
      color: gl.getAttribLocation(program, 'a_color'),
      opacity: gl.getAttribLocation(program, 'a_opacity'),
    },
    uniforms: {
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      globalOpacity: gl.getUniformLocation(program, 'u_globalOpacity'),
    },
  }
}

/** Submit a draw batch to the GPU */
export function submitBatch(
  ctx: WebGLDrawContext,
  vertexData: VertexData,
): WebGLBuffer | null {
  const { gl } = ctx

  // Interleave: position(2) + color(4) + opacity(1) = 7 floats per vertex
  const stride = 7
  const interleavedData = new Float32Array(vertexData.vertexCount * stride)

  for (let i = 0; i < vertexData.vertexCount; i++) {
    const offset = i * stride
    interleavedData[offset] = vertexData.positions[i * 2]!
    interleavedData[offset + 1] = vertexData.positions[i * 2 + 1]!
    interleavedData[offset + 2] = vertexData.colors[i * 4]!
    interleavedData[offset + 3] = vertexData.colors[i * 4 + 1]!
    interleavedData[offset + 4] = vertexData.colors[i * 4 + 2]!
    interleavedData[offset + 5] = vertexData.colors[i * 4 + 3]!
    interleavedData[offset + 6] = vertexData.opacities[i]!
  }

  const buffer = createVertexBuffer(gl, interleavedData)
  return buffer
}

/** Draw a batch of interleaved vertex data */
export function drawBatch(
  ctx: WebGLDrawContext,
  buffer: WebGLBuffer,
  vertexCount: number,
  resolution: [number, number],
  globalOpacity: number,
): void {
  const { gl, program, attribs, uniforms } = ctx

  gl.useProgram(program)

  // Set uniforms
  gl.uniform2f(uniforms.resolution, resolution[0], resolution[1])
  gl.uniform1f(uniforms.globalOpacity, globalOpacity)

  // Bind buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  const stride = 7 * 4 // 7 floats × 4 bytes

  // Position attribute
  gl.enableVertexAttribArray(attribs.position)
  gl.vertexAttribPointer(attribs.position, 2, gl.FLOAT, false, stride, 0)

  // Color attribute
  gl.enableVertexAttribArray(attribs.color)
  gl.vertexAttribPointer(attribs.color, 4, gl.FLOAT, false, stride, 8)

  // Opacity attribute
  gl.enableVertexAttribArray(attribs.opacity)
  gl.vertexAttribPointer(attribs.opacity, 1, gl.FLOAT, false, stride, 24)

  // Draw
  gl.drawArrays(gl.TRIANGLES, 0, vertexCount)

  // Cleanup
  gl.disableVertexAttribArray(attribs.position)
  gl.disableVertexAttribArray(attribs.color)
  gl.disableVertexAttribArray(attribs.opacity)
}

/** Draw multiple batches */
export function drawBatches(
  ctx: WebGLDrawContext,
  batches: DrawBatch[],
  resolution: [number, number],
  globalOpacity: number,
): void {
  for (const batch of batches) {
    const buffer = submitBatch(ctx, batch.vertexData)
    if (buffer) {
      drawBatch(ctx, buffer, batch.vertexData.vertexCount, resolution, globalOpacity * batch.opacity)
      ctx.gl.deleteBuffer(buffer)
    }
  }
}

/** Clear the WebGL canvas */
export function clearCanvas(gl: WebGLRenderingContext, width: number, height: number): void {
  gl.viewport(0, 0, width, height)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)
}

/** Enable alpha blending */
export function enableBlending(gl: WebGLRenderingContext): void {
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
}
