export type {
  Material,
  MaterialConfig,
  MaterialContext,
  ResolvedMaterial,
  ColorConfig,
  GradientConfig,
  GradientStop,
  GlowConfig,
  BlendMode,
} from './types'

export {
  parseHexColor,
  parseCSSColor,
  rgbToOKLab,
  okLabToRGB,
  okLabToCSS,
  interpolateOKLab,
} from './color'
export type { OKLabColor, RGBColor } from './color'

export {
  resolveMaterial,
  blendModeToCompositeOperation,
  semanticToMaterialOverrides,
  DEFAULT_MATERIAL,
} from './resolver'

// Effects (P1)
export {
  createGlow,
  createBlur,
  createGrain,
  createNoiseTexture,
  createShadow,
  glowToShadow,
  sampleGrain,
} from './effects'
export type {
  GlowEffect,
  BlurEffect,
  GrainEffect,
  NoiseTextureEffect,
  ShadowEffect,
  MaterialEffect,
} from './effects'

// Material Stack (P1)
export { MaterialStack, createMaterialStack } from './stack'
export type { MaterialLayer } from './stack'

// Blend Modes (P1)
export {
  blendModeToCompositeOp,
  isBlendModeSupported,
  ALL_BLEND_MODES,
} from './blend'
export type { ExtendedBlendMode } from './blend'
