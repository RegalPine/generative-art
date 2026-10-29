/**
 * WebGL Blend Mode — maps blend modes to WebGL blend functions.
 */

import type { BlendMode } from '../../material/types'

/** WebGL blend function parameters */
export interface WebGLBlendParams {
  srcRGB: number
  dstRGB: number
  srcAlpha: number
  dstAlpha: number
}

/** Map blend mode to WebGL blend function parameters */
export function blendModeToWebGL(gl: WebGLRenderingContext, mode: BlendMode): WebGLBlendParams {
  switch (mode) {
    case 'normal':
      return { srcRGB: gl.SRC_ALPHA, dstRGB: gl.ONE_MINUS_SRC_ALPHA, srcAlpha: gl.ONE, dstAlpha: gl.ONE_MINUS_SRC_ALPHA }
    case 'multiply':
      return { srcRGB: gl.DST_COLOR, dstRGB: gl.ONE_MINUS_SRC_ALPHA, srcAlpha: gl.ONE, dstAlpha: gl.ONE_MINUS_SRC_ALPHA }
    case 'screen':
      return { srcRGB: gl.ONE, dstRGB: gl.ONE_MINUS_SRC_COLOR, srcAlpha: gl.ONE, dstAlpha: gl.ONE_MINUS_SRC_ALPHA }
    case 'overlay':
      return { srcRGB: gl.ONE, dstRGB: gl.ONE_MINUS_SRC_ALPHA, srcAlpha: gl.ONE, dstAlpha: gl.ONE_MINUS_SRC_ALPHA }
    case 'darken':
      return { srcRGB: gl.ONE, dstRGB: gl.ONE, srcAlpha: gl.ONE, dstAlpha: gl.ONE }
    case 'lighten':
      return { srcRGB: gl.ONE, dstRGB: gl.ONE, srcAlpha: gl.ONE, dstAlpha: gl.ONE }
    case 'color-dodge':
      return { srcRGB: gl.ONE, dstRGB: gl.ONE_MINUS_SRC_COLOR, srcAlpha: gl.ONE, dstAlpha: gl.ONE_MINUS_SRC_ALPHA }
    case 'color-burn':
      return { srcRGB: gl.DST_COLOR, dstRGB: gl.ONE, srcAlpha: gl.ONE, dstAlpha: gl.ONE }
    case 'hard-light':
      return { srcRGB: gl.ONE, dstRGB: gl.ONE_MINUS_SRC_ALPHA, srcAlpha: gl.ONE, dstAlpha: gl.ONE_MINUS_SRC_ALPHA }
    case 'soft-light':
      return { srcRGB: gl.ONE, dstRGB: gl.ONE_MINUS_SRC_ALPHA, srcAlpha: gl.ONE, dstAlpha: gl.ONE_MINUS_SRC_ALPHA }
    default:
      return { srcRGB: gl.SRC_ALPHA, dstRGB: gl.ONE_MINUS_SRC_ALPHA, srcAlpha: gl.ONE, dstAlpha: gl.ONE_MINUS_SRC_ALPHA }
  }
}

/** Apply blend mode to WebGL context */
export function applyBlendMode(gl: WebGLRenderingContext, mode: BlendMode): void {
  const params = blendModeToWebGL(gl, mode)
  gl.blendFuncSeparate(params.srcRGB, params.dstRGB, params.srcAlpha, params.dstAlpha)
}

/** Reset blend mode to normal */
export function resetBlendMode(gl: WebGLRenderingContext): void {
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
}
