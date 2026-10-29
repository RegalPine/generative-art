/**
 * WebGPU Geometry Buffer — converts geometry to GPU buffers for WebGPU.
 */

import type { Point } from '../../geometry/types'

/** Vertex data for WebGPU */
export interface WebGPUVertexData {
  data: Float32Array
  vertexCount: number
}

/** Create a GPU buffer from vertex data */
export function createWebGPUVertexBuffer(
  device: GPUDevice,
  data: Float32Array,
): GPUBuffer {
  const buffer = device.createBuffer({
    size: data.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  })
  new Float32Array(buffer.getMappedRange()).set(data)
  buffer.unmap()
  return buffer
}

/** Convert points to line vertex data (interleaved: pos2 + color4 + opacity1 = 7 floats) */
export function pointsToLineVertexData(
  points: Point[],
  color: [number, number, number, number],
  opacity: number,
  width: number,
  height: number,
): WebGPUVertexData {
  const vertexCount = points.length
  const stride = 7
  const data = new Float32Array(vertexCount * stride)

  for (let i = 0; i < vertexCount; i++) {
    const offset = i * stride
    data[offset] = points[i]!.x * width
    data[offset + 1] = points[i]!.y * height
    data[offset + 2] = color[0]
    data[offset + 3] = color[1]
    data[offset + 4] = color[2]
    data[offset + 5] = color[3]
    data[offset + 6] = opacity
  }

  return { data, vertexCount }
}

/** Convert points to fill vertex data (triangulated fan) */
export function pointsToFillVertexData(
  points: Point[],
  color: [number, number, number, number],
  opacity: number,
  width: number,
  height: number,
): WebGPUVertexData {
  if (points.length < 3) {
    return { data: new Float32Array(0), vertexCount: 0 }
  }

  const triangleCount = points.length - 2
  const vertexCount = triangleCount * 3
  const stride = 7
  const data = new Float32Array(vertexCount * stride)

  let idx = 0
  for (let t = 0; t < triangleCount; t++) {
    const indices = [0, t + 1, t + 2]
    for (const vi of indices) {
      const offset = idx * stride
      data[offset] = points[vi]!.x * width
      data[offset + 1] = points[vi]!.y * height
      data[offset + 2] = color[0]
      data[offset + 3] = color[1]
      data[offset + 4] = color[2]
      data[offset + 5] = color[3]
      data[offset + 6] = opacity
      idx++
    }
  }

  return { data, vertexCount }
}

/** Convert points to circle/dot vertex data (triangle-fan circles) */
export function pointsToCircleVertexData(
  points: Point[],
  radius: number,
  color: [number, number, number, number],
  opacity: number,
  width: number,
  height: number,
  segments = 16,
): WebGPUVertexData {
  const vertexCount = points.length * segments * 3
  const stride = 7
  const data = new Float32Array(vertexCount * stride)

  let idx = 0
  for (const point of points) {
    const cx = point.x * width
    const cy = point.y * height
    const r = radius

    for (let s = 0; s < segments; s++) {
      const a0 = (s / segments) * Math.PI * 2
      const a1 = ((s + 1) / segments) * Math.PI * 2

      // Center
      const centerOff = idx * stride
      data[centerOff] = cx
      data[centerOff + 1] = cy
      data[centerOff + 2] = color[0]
      data[centerOff + 3] = color[1]
      data[centerOff + 4] = color[2]
      data[centerOff + 5] = color[3]
      data[centerOff + 6] = opacity
      idx++

      // Edge 0
      const e0Off = idx * stride
      data[e0Off] = cx + Math.cos(a0) * r
      data[e0Off + 1] = cy + Math.sin(a0) * r
      data[e0Off + 2] = color[0]
      data[e0Off + 3] = color[1]
      data[e0Off + 4] = color[2]
      data[e0Off + 5] = color[3]
      data[e0Off + 6] = opacity
      idx++

      // Edge 1
      const e1Off = idx * stride
      data[e1Off] = cx + Math.cos(a1) * r
      data[e1Off + 1] = cy + Math.sin(a1) * r
      data[e1Off + 2] = color[0]
      data[e1Off + 3] = color[1]
      data[e1Off + 4] = color[2]
      data[e1Off + 5] = color[3]
      data[e1Off + 6] = opacity
      idx++
    }
  }

  return { data, vertexCount }
}

/** Parse CSS color to GL normalized RGBA */
export function parseColorToWebGPU(hex: string): [number, number, number, number] {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16) / 255
  const g = parseInt(clean.substring(2, 4), 16) / 255
  const b = parseInt(clean.substring(4, 6), 16) / 255
  const a = clean.length >= 8 ? parseInt(clean.substring(6, 8), 16) / 255 : 1
  return [r, g, b, a]
}
