/**
 * WebGL Gradient rendering — linear and radial gradients via shaders.
 */

import type { GradientBatch } from './types'
import { createVertexBuffer } from './geometry'
import type { VertexData } from './geometry'
import {
  GRADIENT_VERTEX_SHADER,
  GRADIENT_FRAGMENT_SHADER,
  createProgram,
} from './shader'

/** Gradient draw context */
export interface GradientDrawContext {
  gl: WebGLRenderingContext
  program: WebGLProgram
  attribs: {
    position: number
    uv: number
    color: number
    opacity: number
  }
  uniforms: {
    resolution: WebGLUniformLocation | null
    globalOpacity: WebGLUniformLocation | null
    color0: WebGLUniformLocation | null
    color1: WebGLUniformLocation | null
    gradientAngle: WebGLUniformLocation | null
    gradientType: WebGLUniformLocation | null
  }
}

/** Initialize gradient draw program */
export function initGradientProgram(gl: WebGLRenderingContext): GradientDrawContext | null {
  const program = createProgram(gl, GRADIENT_VERTEX_SHADER, GRADIENT_FRAGMENT_SHADER)
  if (!program) return null

  return {
    gl,
    program,
    attribs: {
      position: gl.getAttribLocation(program, 'a_position'),
      uv: gl.getAttribLocation(program, 'a_uv'),
      color: gl.getAttribLocation(program, 'a_color'),
      opacity: gl.getAttribLocation(program, 'a_opacity'),
    },
    uniforms: {
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      globalOpacity: gl.getUniformLocation(program, 'u_globalOpacity'),
      color0: gl.getUniformLocation(program, 'u_color0'),
      color1: gl.getUniformLocation(program, 'u_color1'),
      gradientAngle: gl.getUniformLocation(program, 'u_gradientAngle'),
      gradientType: gl.getUniformLocation(program, 'u_gradientType'),
    },
  }
}

/** Create gradient vertex data with UV coordinates */
export function createGradientQuad(
  x: number,
  y: number,
  w: number,
  h: number,
  color: [number, number, number, number],
  opacity: number,
): VertexData {
  const positions = new Float32Array([
    x, y,
    x + w, y,
    x, y + h,
    x + w, y,
    x + w, y + h,
    x, y + h,
  ])

  const uvs = new Float32Array([
    0, 0,
    1, 0,
    0, 1,
    1, 0,
    1, 1,
    0, 1,
  ])

  const colors = new Float32Array(24)
  const opacities = new Float32Array(6)

  for (let i = 0; i < 6; i++) {
    colors[i * 4] = color[0]
    colors[i * 4 + 1] = color[1]
    colors[i * 4 + 2] = color[2]
    colors[i * 4 + 3] = color[3]
    opacities[i] = opacity
  }

  return { positions, colors, opacities, vertexCount: 6, uvs }
}

/** Draw a gradient batch */
export function drawGradientBatch(
  ctx: GradientDrawContext,
  batch: GradientBatch,
  resolution: [number, number],
  globalOpacity: number,
): void {
  const { gl, program, attribs, uniforms } = ctx

  gl.useProgram(program)

  // Set uniforms
  gl.uniform2f(uniforms.resolution, resolution[0], resolution[1])
  gl.uniform1f(uniforms.globalOpacity, globalOpacity * batch.opacity)
  gl.uniform4fv(uniforms.color0, batch.color0)
  gl.uniform4fv(uniforms.color1, batch.color1)
  gl.uniform1f(uniforms.gradientAngle, batch.angle)
  gl.uniform1i(uniforms.gradientType, batch.gradientType === 'linear' ? 0 : 1)

  // Interleave: position(2) + uv(2) + color(4) + opacity(1) = 9 floats
  const vd = batch.vertexData
  const uvs = (vd as VertexData & { uvs?: Float32Array }).uvs
  const stride = 9
  const interleavedData = new Float32Array(vd.vertexCount * stride)

  for (let i = 0; i < vd.vertexCount; i++) {
    const offset = i * stride
    interleavedData[offset] = vd.positions[i * 2]!
    interleavedData[offset + 1] = vd.positions[i * 2 + 1]!
    interleavedData[offset + 2] = uvs?.[i * 2] ?? 0
    interleavedData[offset + 3] = uvs?.[i * 2 + 1] ?? 0
    interleavedData[offset + 4] = vd.colors[i * 4]!
    interleavedData[offset + 5] = vd.colors[i * 4 + 1]!
    interleavedData[offset + 6] = vd.colors[i * 4 + 2]!
    interleavedData[offset + 7] = vd.colors[i * 4 + 3]!
    interleavedData[offset + 8] = vd.opacities[i]!
  }

  const buffer = createVertexBuffer(gl, interleavedData)
  if (!buffer) return

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  const byteStride = stride * 4

  gl.enableVertexAttribArray(attribs.position)
  gl.vertexAttribPointer(attribs.position, 2, gl.FLOAT, false, byteStride, 0)

  gl.enableVertexAttribArray(attribs.uv)
  gl.vertexAttribPointer(attribs.uv, 2, gl.FLOAT, false, byteStride, 8)

  gl.enableVertexAttribArray(attribs.color)
  gl.vertexAttribPointer(attribs.color, 4, gl.FLOAT, false, byteStride, 16)

  gl.enableVertexAttribArray(attribs.opacity)
  gl.vertexAttribPointer(attribs.opacity, 1, gl.FLOAT, false, byteStride, 32)

  gl.drawArrays(gl.TRIANGLES, 0, vd.vertexCount)

  gl.disableVertexAttribArray(attribs.position)
  gl.disableVertexAttribArray(attribs.uv)
  gl.disableVertexAttribArray(attribs.color)
  gl.disableVertexAttribArray(attribs.opacity)

  gl.deleteBuffer(buffer)
}
