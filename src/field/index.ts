export type {
  Field,
  FieldContext,
  ScalarField,
  VectorField,
  NoiseFieldConfig,
  ForceFieldConfig,
  NoiseSource,
  FieldMask,
  DomainWarpConfig,
} from './types'

export { createSimplexNoise } from './noise'
export { createFractalNoise } from './fractal'
export type { FractalNoiseConfig } from './fractal'

export {
  ScalarNoiseField,
  VectorNoiseField,
  CurlField,
  CompositeField,
  TransformField,
  createForceField,
  applyFalloff,
} from './fields'
export type { FalloffType } from './fields'

// Operations
export {
  SubtractField,
  MultiplyField,
  ScaleField,
  NormalizeField,
  ClampField,
  RotateField,
  InvertField,
  BlendField,
  ScalarAddField,
  ScalarMultiplyField,
  ScalarScaleField,
  ScalarClampField,
  ScalarInvertField,
} from './operations'

// Advanced fields
export {
  FlowField,
  MagneticField,
  MaskedField,
  RadialMask,
  RectMask,
  DomainWarpField,
} from './advanced'
