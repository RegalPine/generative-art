/**
 * WebGPU Batch Renderer — batched draw call submission.
 */

import type { WebGPUVertexData } from './geometry'

/** A draw batch for WebGPU */
export interface WebGPUDrawBatch {
  vertexBuffer: GPUBuffer
  vertexCount: number
  topology: 'triangle-list' | 'line-list' | 'line-strip'
}

/** Create a draw batch from vertex data */
export function createDrawBatch(
  device: GPUDevice,
  vertexData: WebGPUVertexData,
  topology: 'triangle-list' | 'line-list' | 'line-strip' = 'triangle-list',
): WebGPUDrawBatch {
  const vertexBuffer = device.createBuffer({
    size: vertexData.data.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  })
  new Float32Array(vertexBuffer.getMappedRange()).set(vertexData.data)
  vertexBuffer.unmap()

  return { vertexBuffer, vertexCount: vertexData.vertexCount, topology }
}

/** Submit a draw batch to the render pass */
export function submitBatch(
  passEncoder: GPURenderPassEncoder,
  batch: WebGPUDrawBatch,
): void {
  passEncoder.setVertexBuffer(0, batch.vertexBuffer)
  passEncoder.draw(batch.vertexCount)
}

/** Dispose of a draw batch */
export function disposeBatch(batch: WebGPUDrawBatch): void {
  batch.vertexBuffer.destroy()
}
