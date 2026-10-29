export type {
  Composition,
  CompositionConfig,
  CompositionContext,
  CompositionLayer,
  DistributionConfig,
  FocusConfig,
  DepthConfig,
  RhythmConfig,
} from './types'

export {
  UniformDistribution,
  RandomDistribution,
  RadialDistribution,
  FlowDistribution,
  createDistribution,
} from './distribution'
export type { Distribution, DistributionContext } from './distribution'

// Additional distributions
export {
  PoissonDistribution,
  SpiralDistribution,
  ClusterDistribution,
  EdgeDistribution,
  CenterDistribution,
  GoldenDistribution,
  OrganicDistribution,
  GridDistribution,
} from './distributions'

// Advanced composition features
export {
  applyNegativeSpace,
  applySymmetry,
  assignHierarchy,
  assignDepth,
  applyRhythm,
  DEFAULT_HIERARCHY,
  DEFAULT_DEPTH,
  DEFAULT_RHYTHM,
} from './advanced'
export type {
  ProtectedRegion,
  SymmetryMode,
  SymmetryConfig,
  HierarchyLevel,
  HierarchyConfig,
  HierarchyAssignment,
  DepthConfig as DepthLayerConfig,
  DepthAssignment,
  RhythmConfig as RhythmLayerConfig,
} from './advanced'

export { DefaultComposition, DEFAULT_COMPOSITION } from './composition'
