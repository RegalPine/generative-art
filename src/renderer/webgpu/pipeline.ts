/**
 * WebGPU Pipeline — render pipeline configuration and management.
 */

import { BASIC_VERTEX_SHADER, BASIC_FRAGMENT_SHADER, loadShaderModule } from './shader'

/** Create the basic render pipeline */
export function createBasicPipeline(
  device: GPUDevice,
  format: GPUTextureFormat,
): GPURenderPipeline {
  const vertexModule = loadShaderModule(device, BASIC_VERTEX_SHADER)
  const fragmentModule = loadShaderModule(device, BASIC_FRAGMENT_SHADER)

  const vertexBufferLayout: GPUVertexBufferLayout = {
    arrayStride: 28, // 2(pos) + 4(color) + 1(opacity) = 7 floats × 4 bytes
    attributes: [
      { shaderLocation: 0, offset: 0, format: 'float32x2' },   // position
      { shaderLocation: 1, offset: 8, format: 'float32x4' },   // color
      { shaderLocation: 2, offset: 24, format: 'float32' },     // opacity
    ],
  }

  return device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: vertexModule,
      entryPoint: 'main',
      buffers: [vertexBufferLayout],
    },
    fragment: {
      module: fragmentModule,
      entryPoint: 'main',
      targets: [
        {
          format,
          blend: {
            color: {
              srcFactor: 'src-alpha',
              dstFactor: 'one-minus-src-alpha',
              operation: 'add',
            },
            alpha: {
              srcFactor: 'one',
              dstFactor: 'one-minus-src-alpha',
              operation: 'add',
            },
          },
        },
      ],
    },
    primitive: {
      topology: 'triangle-list',
    },
  })
}

/** Create a uniform buffer binding */
export function createUniformBinding(
  device: GPUDevice,
  size: number,
  usage?: number,
): { buffer: GPUBuffer; bindGroupLayout: GPUBindGroupLayout; bindGroup: GPUBindGroup } {
  const buffer = device.createBuffer({
    size,
    usage: usage ?? (GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST),
  })

  const bindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: { type: 'uniform' },
      },
    ],
  })

  const bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [
      { binding: 0, resource: { buffer } },
    ],
  })

  return { buffer, bindGroupLayout, bindGroup }
}

/** Check if WebGPU is available */
export function isWebGPUAvailable(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.gpu
}

/** Request a WebGPU adapter and device */
export async function requestWebGPUDevice(): Promise<{
  adapter: GPUAdapter
  device: GPUDevice
} | null> {
  if (!isWebGPUAvailable()) return null

  try {
    const adapter = await navigator.gpu.requestAdapter({
      powerPreference: 'high-performance',
    })
    if (!adapter) return null

    const device = await adapter.requestDevice()
    return { adapter, device }
  } catch {
    return null
  }
}
