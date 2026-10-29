/**
 * Blend modes — complete blend mode set with Canvas2D mapping.
 *
 * Maps semantic blend modes to Canvas2D globalCompositeOperation values.
 */

import type { BlendMode } from './types'

/** Extended blend mode list */
export type ExtendedBlendMode =
  | BlendMode
  | 'color-dodge'
  | 'color-burn'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity'

/** Map blend mode to Canvas2D globalCompositeOperation */
export function blendModeToCompositeOp(mode: ExtendedBlendMode): GlobalCompositeOperation {
  switch (mode) {
    case 'normal':
      return 'source-over'
    case 'multiply':
      return 'multiply'
    case 'screen':
      return 'screen'
    case 'overlay':
      return 'overlay'
    case 'darken':
      return 'darken'
    case 'lighten':
      return 'lighten'
    case 'color-dodge':
      return 'color-dodge'
    case 'color-burn':
      return 'color-burn'
    case 'hard-light':
      return 'hard-light'
    case 'soft-light':
      return 'soft-light'
    case 'difference':
      return 'difference'
    case 'exclusion':
      return 'exclusion'
    case 'hue':
      return 'hue'
    case 'saturation':
      return 'saturation'
    case 'color':
      return 'color'
    case 'luminosity':
      return 'luminosity'
    default:
      return 'source-over'
  }
}

/** Check if a blend mode is supported by Canvas2D */
export function isBlendModeSupported(mode: string): boolean {
  const supported = new Set([
    'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
    'color-dodge', 'color-burn', 'hard-light', 'soft-light',
    'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity',
  ])
  return supported.has(mode)
}

/** All available blend modes */
export const ALL_BLEND_MODES: ExtendedBlendMode[] = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
  'hue',
  'saturation',
  'color',
  'luminosity',
]
