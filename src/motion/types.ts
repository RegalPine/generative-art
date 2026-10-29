/**
 * Motion types — the temporal change layer of the semantic model.
 *
 * Motion answers: "How does each element change over time?"
 * Uses delta-time model, never assumes fixed FPS.
 */

import type { Point, Vector } from '../geometry/types'

/** Motion state — describes an element's current dynamic properties */
export interface MotionState {
  position: Point
  rotation: number
  scale: { x: number; y: number }
  velocity: Vector
  angularVelocity: number
  opacity: number
}

/** Motion update context */
export interface MotionContext {
  time: number
  delta: number
  seed: number
  viewport: { width: number; height: number }
  semantic: {
    energy: number
    rhythm: number
    turbulence: number
  }
}

/** Motion configuration */
export interface MotionConfig {
  type: string
  speed?: number
  amplitude?: number
  frequency?: number
  [key: string]: unknown
}

/** Motion channel — controls a single aspect of motion */
export interface MotionChannel {
  readonly target: 'position' | 'rotation' | 'scale' | 'opacity'
  update(state: MotionState, context: MotionContext): Partial<MotionState>
}

/** Base Motion interface */
export interface Motion {
  readonly type: string
  /** Update motion state by one time step */
  update(state: MotionState, context: MotionContext): MotionState
}
