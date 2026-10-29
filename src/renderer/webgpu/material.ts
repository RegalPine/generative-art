/**
 * WebGPU Material Renderer — material/blend mode support for WebGPU.
 */

import type { BlendMode } from '../../material/types'

/** WebGPU blend mode parameters */
export interface WebGPUBlendParams {
  srcFactor: GPUBlendFactor
  dstFactor: GPUBlendFactor
  operation: GPUBlendOperation
}

/** Map blend mode to WebGPU blend state */
export function blendModeToWebGPU(mode: BlendMode): WebGPUBlendParams {
  switch (mode) {
    case 'normal':
      return { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' }
    case 'multiply':
      return { srcFactor: 'dst', dstFactor: 'one-minus-src-alpha', operation: 'add' }
    case 'screen':
      return { srcFactor: 'one', dstFactor: 'one-minus-src', operation: 'add' }
    case 'overlay':
      return { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' }
    case 'darken':
      return { srcFactor: 'one', dstFactor: 'one', operation: 'min' }
    case 'lighten':
      return { srcFactor: 'one', dstFactor: 'one', operation: 'max' }
    case 'color-dodge':
      return { srcFactor: 'one', dstFactor: 'one-minus-src', operation: 'add' }
    case 'color-burn':
      return { srcFactor: 'dst', dstFactor: 'one', operation: 'add' }
    case 'hard-light':
      return { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' }
    case 'soft-light':
      return { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' }
    default:
      return { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' }
  }
}

/** Create a blend state for a pipeline target */
export function createBlendState(mode: BlendMode): GPUBlendState {
  const params = blendModeToWebGPU(mode)
  return {
    color: {
      srcFactor: params.srcFactor,
      dstFactor: params.dstFactor,
      operation: params.operation,
    },
    alpha: {
      srcFactor: 'one',
      dstFactor: 'one-minus-src-alpha',
      operation: 'add',
    },
  }
}
