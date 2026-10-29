export type {
  Motion,
  MotionState,
  MotionContext,
  MotionConfig,
  MotionChannel,
} from './types'

export {
  FlowMotion,
  DriftMotion,
  WaveMotion,
  BreathingMotion,
  createMotion,
} from './motions'

// Additional motions (P1)
export {
  OrbitMotion,
  PulseMotion,
  RotationMotion,
  ParallaxMotion,
  MorphMotion,
  MotionComposer,
  ReducedMotion,
  prefersReducedMotion,
} from './additional'
export type { MotionLayer } from './additional'
