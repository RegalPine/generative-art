/**
 * Motion implementations — all concrete motion types.
 *
 * Types:
 * - FlowMotion: v(t) = F(p,t), p(t+dt) = p(t) + v(t)dt
 * - DriftMotion: slow, gentle drift in a direction
 * - WaveMotion: sinusoidal oscillation
 * - BreathingMotion: periodic scale pulsing
 *
 * All use delta-time model (never assume fixed FPS).
 * All are deterministic given the same seed.
 */

import type { Vector } from '../geometry/types'
import type { Field } from '../field/types'
import type { Motion, MotionState, MotionContext, MotionConfig } from './types'

// ─── Flow Motion ─────────────────────────────────────────────────────────────

/** Flow motion — follows a vector field */
export class FlowMotion implements Motion {
  readonly type = 'flow'
  private field: Field
  private speed: number

  constructor(field: Field, speed?: number) {
    this.field = field
    this.speed = speed ?? 1
  }

  update(state: MotionState, context: MotionContext): MotionState {
    const fieldCtx = {
      time: context.time,
      delta: context.delta,
      seed: context.seed,
      viewport: context.viewport,
      semantic: {
        density: 0.5,
        complexity: 0.5,
        energy: context.semantic.energy,
        softness: 0.5,
        depth: 0.5,
        rhythm: context.semantic.rhythm,
        turbulence: context.semantic.turbulence,
        focus: 0.5,
      },
    }

    const velocity = this.field.sample(state.position, fieldCtx)
    const scaledVelocity = {
      x: velocity.x * this.speed * context.semantic.energy,
      y: velocity.y * this.speed * context.semantic.energy,
    }

    return {
      ...state,
      position: {
        x: state.position.x + scaledVelocity.x * context.delta,
        y: state.position.y + scaledVelocity.y * context.delta,
      },
      velocity: scaledVelocity,
    }
  }
}

// ─── Drift Motion ────────────────────────────────────────────────────────────

/** Drift motion — slow, gentle drift */
export class DriftMotion implements Motion {
  readonly type = 'drift'
  private direction: Vector
  private speed: number

  constructor(direction?: Vector, speed?: number) {
    this.direction = direction ?? { x: 0.01, y: 0.005 }
    this.speed = speed ?? 0.5
  }

  update(state: MotionState, context: MotionContext): MotionState {
    const drift = {
      x: this.direction.x * this.speed * context.semantic.energy,
      y: this.direction.y * this.speed * context.semantic.energy,
    }

    return {
      ...state,
      position: {
        x: state.position.x + drift.x * context.delta,
        y: state.position.y + drift.y * context.delta,
      },
      velocity: drift,
    }
  }
}

// ─── Wave Motion ─────────────────────────────────────────────────────────────

/** Wave motion — sinusoidal oscillation */
export class WaveMotion implements Motion {
  readonly type = 'wave'
  private amplitude: number
  private frequency: number
  private phase: number
  private axis: 'x' | 'y'

  constructor(config?: { amplitude?: number; frequency?: number; phase?: number; axis?: 'x' | 'y' }) {
    this.amplitude = config?.amplitude ?? 0.1
    this.frequency = config?.frequency ?? 1
    this.phase = config?.phase ?? 0
    this.axis = config?.axis ?? 'y'
  }

  update(state: MotionState, context: MotionContext): MotionState {
    const wave = Math.sin(context.time * this.frequency * Math.PI * 2 + this.phase)
    const displacement = wave * this.amplitude * context.semantic.rhythm

    const offset = this.axis === 'x'
      ? { x: displacement, y: 0 }
      : { x: 0, y: displacement }

    return {
      ...state,
      position: {
        x: state.position.x + offset.x * context.delta,
        y: state.position.y + offset.y * context.delta,
      },
    }
  }
}

// ─── Breathing Motion ────────────────────────────────────────────────────────

/** Breathing motion — periodic scale pulsing */
export class BreathingMotion implements Motion {
  readonly type = 'breathing'
  private minScale: number
  private maxScale: number
  private frequency: number
  private phase: number

  constructor(config?: { minScale?: number; maxScale?: number; frequency?: number; phase?: number }) {
    this.minScale = config?.minScale ?? 0.8
    this.maxScale = config?.maxScale ?? 1.2
    this.frequency = config?.frequency ?? 0.5
    this.phase = config?.phase ?? 0
  }

  update(state: MotionState, context: MotionContext): MotionState {
    const t = (Math.sin(context.time * this.frequency * Math.PI * 2 + this.phase) + 1) / 2
    const scale = this.minScale + (this.maxScale - this.minScale) * t * context.semantic.rhythm

    return {
      ...state,
      scale: { x: scale, y: scale },
    }
  }
}

// ─── Motion Factory ──────────────────────────────────────────────────────────

/** Create a motion from config */
export function createMotion(config: MotionConfig, field?: Field): Motion {
  switch (config.type) {
    case 'flow':
      if (!field) throw new Error('Flow motion requires a field')
      return new FlowMotion(field, config.speed)
    case 'drift':
      return new DriftMotion(
        config.direction as Vector | undefined,
        config.speed,
      )
    case 'wave':
      return new WaveMotion({
        amplitude: config.amplitude,
        frequency: config.frequency,
        phase: config.phase as number | undefined,
        axis: config.axis as 'x' | 'y' | undefined,
      })
    case 'breathing':
      return new BreathingMotion({
        minScale: config.minScale as number | undefined,
        maxScale: config.maxScale as number | undefined,
        frequency: config.frequency,
        phase: config.phase as number | undefined,
      })
    default:
      return new DriftMotion()
  }
}
