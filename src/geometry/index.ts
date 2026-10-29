export type {
  Point,
  Vector,
  Bounds,
  Curve,
  Geometry,
  GeometryConfig,
  GeometryGenerator,
  TransformMatrix,
} from './types'

export {
  CurveGeometry,
  transformPoint,
  identityMatrix,
  translateMatrix,
  rotateMatrix,
  scaleMatrix,
  composeMatrix,
} from './curve'

export { buildArcLengthTable, tAtArcLength, sampleUniform } from './sampling'
export type { ArcLengthEntry } from './sampling'

export { Polyline } from './polyline'
export { QuadraticBezier, CubicBezier } from './bezier'
export { Spline } from './spline'
export { Circle } from './circle'
export { Wave } from './wave'
export type { WaveConfig } from './wave'
export { Ribbon } from './ribbon'
export type { RibbonConfig } from './ribbon'

export { DefaultGeometryGenerator } from './generator'
