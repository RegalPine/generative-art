/**
 * WebGL Geometry Buffer — converts geometry data to WebGL buffers.
 */

import type { Point, Curve } from '../../geometry/types'

/** Vertex data for WebGL rendering */
export interface VertexData {
  positions: Float32Array
  colors: Float32Array
  opacities: Float32Array
  vertexCount: number
  uvs?: Float32Array
}

/** Create a WebGL buffer from vertex data */
export function createVertexBuffer(
  gl: WebGLRenderingContext,
  data: Float32Array,
): WebGLBuffer | null {
  const buffer = gl.createBuffer()
  if (!buffer) return null

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)
  return buffer
}

/** Create an index buffer */
export function createIndexBuffer(
  gl: WebGLRenderingContext,
  indices: Uint16Array | Uint32Array,
): WebGLBuffer | null {
  const buffer = gl.createBuffer()
  if (!buffer) return null

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
  return buffer
}

/** Convert a curve to vertex data for line rendering */
export function curveToVertexData(
  curve: Curve,
  segments: number,
  color: [number, number, number, number],
  opacity: number,
  width: number,
  height: number,
): VertexData {
  const points = curve.sample(segments)
  return pointsToLineVertexData(points, color, opacity, width, height)
}

/** Convert points to line strip vertex data (with thickness) */
export function pointsToLineVertexData(
  points: Point[],
  color: [number, number, number, number],
  opacity: number,
  width: number,
  height: number,
): VertexData {
  if (points.length < 2) {
    return {
      positions: new Float32Array(0),
      colors: new Float32Array(0),
      opacities: new Float32Array(0),
      vertexCount: 0,
    }
  }

  // Each segment = 2 triangles = 6 vertices
  const segCount = points.length - 1
  const vertexCount = segCount * 6
  const positions = new Float32Array(vertexCount * 2)
  const colors = new Float32Array(vertexCount * 4)
  const opacities = new Float32Array(vertexCount)

  const halfWidth = 0.003 // Line half-width in normalized coords

  let idx = 0
  for (let i = 0; i < segCount; i++) {
    const p0 = points[i]!
    const p1 = points[i + 1]!

    // Direction perpendicular to segment
    const dx = p1.x - p0.x
    const dy = p1.y - p0.y
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    const nx = -dy / len * halfWidth
    const ny = dx / len * halfWidth

    // Two corners of the segment quad
    const x0 = p0.x + nx
    const y0 = p0.y + ny
    const x1 = p0.x - nx
    const y1 = p0.y - ny
    const x2 = p1.x + nx
    const y2 = p1.y + ny
    const x3 = p1.x - nx
    const y3 = p1.y - ny

    // Triangle 1: (x0,y0), (x1,y1), (x2,y2)
    // Triangle 2: (x1,y1), (x3,y3), (x2,y2)
    const verts = [x0, y0, x1, y1, x2, y2, x1, y1, x3, y3, x2, y2]

    for (let v = 0; v < 6; v++) {
      positions[idx * 2] = verts[v * 2]! * width
      positions[idx * 2 + 1] = verts[v * 2 + 1]! * height
      colors[idx * 4] = color[0]
      colors[idx * 4 + 1] = color[1]
      colors[idx * 4 + 2] = color[2]
      colors[idx * 4 + 3] = color[3]
      opacities[idx] = opacity
      idx++
    }
  }

  return { positions, colors, opacities, vertexCount }
}

/** Convert points to triangle fan vertex data (for filled shapes) */
export function pointsToFillVertexData(
  points: Point[],
  color: [number, number, number, number],
  opacity: number,
  width: number,
  height: number,
): VertexData {
  if (points.length < 3) {
    return {
      positions: new Float32Array(0),
      colors: new Float32Array(0),
      opacities: new Float32Array(0),
      vertexCount: 0,
    }
  }

  // Triangle fan: n-2 triangles, each = 3 vertices
  const triCount = points.length - 2
  const vertexCount = triCount * 3
  const positions = new Float32Array(vertexCount * 2)
  const colors = new Float32Array(vertexCount * 4)
  const opacities = new Float32Array(vertexCount)

  let idx = 0
  const p0 = points[0]!

  for (let i = 1; i < points.length - 1; i++) {
    const p1 = points[i]!
    const p2 = points[i + 1]!

    const verts = [
      p0.x * width, p0.y * height,
      p1.x * width, p1.y * height,
      p2.x * width, p2.y * height,
    ]

    for (let v = 0; v < 3; v++) {
      positions[idx * 2] = verts[v * 2]!
      positions[idx * 2 + 1] = verts[v * 2 + 1]!
      colors[idx * 4] = color[0]
      colors[idx * 4 + 1] = color[1]
      colors[idx * 4 + 2] = color[2]
      colors[idx * 4 + 3] = color[3]
      opacities[idx] = opacity
      idx++
    }
  }

  return { positions, colors, opacities, vertexCount }
}

/** Convert points to circle/dot vertex data */
export function pointsToCircleVertexData(
  points: Point[],
  radius: number,
  color: [number, number, number, number],
  opacity: number,
  width: number,
  height: number,
  segments = 16,
): VertexData {
  const vertexCount = points.length * segments * 3
  const positions = new Float32Array(vertexCount * 2)
  const colors = new Float32Array(vertexCount * 4)
  const opacities = new Float32Array(vertexCount)

  let idx = 0
  const r = radius / Math.max(width, height) // Normalize radius

  for (const p of points) {
    for (let s = 0; s < segments; s++) {
      const a0 = (s / segments) * Math.PI * 2
      const a1 = ((s + 1) / segments) * Math.PI * 2

      const verts = [
        p.x * width, p.y * height,
        (p.x + Math.cos(a0) * r) * width, (p.y + Math.sin(a0) * r) * height,
        (p.x + Math.cos(a1) * r) * width, (p.y + Math.sin(a1) * r) * height,
      ]

      for (let v = 0; v < 3; v++) {
        positions[idx * 2] = verts[v * 2]!
        positions[idx * 2 + 1] = verts[v * 2 + 1]!
        colors[idx * 4] = color[0]
        colors[idx * 4 + 1] = color[1]
        colors[idx * 4 + 2] = color[2]
        colors[idx * 4 + 3] = color[3]
        opacities[idx] = opacity
        idx++
      }
    }
  }

  return { positions, colors, opacities, vertexCount }
}

/** Parse hex color to [r, g, b, a] in 0-1 range */
export function parseColorToGL(hex: string): [number, number, number, number] {
  const cleaned = hex.replace('#', '')
  const r = parseInt(cleaned.substring(0, 2), 16) / 255
  const g = parseInt(cleaned.substring(2, 4), 16) / 255
  const b = parseInt(cleaned.substring(4, 6), 16) / 255
  return [r, g, b, 1]
}
