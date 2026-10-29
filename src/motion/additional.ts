/**
 * Additional motion implementations — completes the P1 motion system.
 *
 * New types:
 * - OrbitMotion: circular/orbital motion around a center
 * - PulseMotion: periodic pulse (size + opacity)
 * - RotationMotion: continuous rotation
 * - ParallaxMotion: depth-based parallax
 * - MorphMotion: shape morphing over time
 * - MotionComposer: compose multiple motions with priority/weight/blending
 * - ReducedMotion: fine-grained reduced motion control
 */

import type { Point, Vector } from '../geometry/types'
import type { Motion, MotionState, MotionContext } from './types'

// ─── Orbit Motion ────────────────────────────────────────────────────────

/** Orbit — circular motion around a center point */
export class OrbitMotion implements Motion {
  readonly type = 'orbit'
  private center: Point
  private radius: number
  private speed: number
  private phase: number
  private direction: 'cw' | 'ccw'

  constructor(config?: {
    center?: Point
    radius?: number
    speed?: number
    phase?: number
    direction?: 'cw' | 'ccw'
  }) {
    this.center = config?.center ?? { x: 0.5, y: 0.5 }
    this.radius = config?.radius ?? 0.2
    this.speed = config?.speed ?? 1
    this.phase = config?.phase ?? 0
    this.direction = config?.direction ?? 'ccw'
  }

  update(state: MotionState, context: MotionContext): MotionState {
    const t = context.time * this.speed * context.semantic.energy + this.phase
    const sign = this.direction === 'cw' ? -1 : 1
    const angle = sign * t * Math.PI * 2

    const newX = this.center.x + Math.cos(angle) * this.radius
    const newY = this.center.y + Math.sin(angle) * this.radius

    const velocity: Vector = {
      x: -Math.sin(angle) * this.radius * this.speed * sign,
      y: Math.cos(angle) * this.radius * this.speed * sign,
    }

    return {
      ...state,
      position: { x: newX, y: newY },
      velocity,
      rotation: angle,
    }
  }
}

// ─── Pulse Motion ────────────────────────────────────────────────────────

/** Pulse — periodic pulse affecting scale and opacity */
export class PulseMotion implements Motion {
  readonly type = 'pulse'
  private frequency: number
  private amplitude: number
  private phase: number
  private affectOpacity: boolean

  constructor(config?: {
    frequency?: number
    amplitude?: number
    phase?: number
    affectOpacity?: boolean
  }) {
    this.frequency = config?.frequency ?? 2
    this.amplitude = config?.amplitude ?? 0.3
    this.phase = config?.phase ?? 0
    this.affectOpacity = config?.affectOpacity ?? true
  }

  update(state: MotionState, context: MotionContext): MotionState {
    const t = context.time * this.frequency * context.semantic.rhythm + this.phase
    const pulse = (Math.sin(t * Math.PI * 2) + 1) / 2 // 0~1

    const scale = 1 + pulse * this.amplitude
    const opacity = this.affectOpacity
      ? state.opacity * (0.7 + pulse * 0.3)
      : state.opacity

    return {
      ...state,
      scale: { x: scale, y: scale },
      opacity,
    }
  }
}

// ─── Rotation Motion ─────────────────────────────────────────────────────

/** Rotation — continuous rotation */
export class RotationMotion implements Motion {
  readonly type = 'rotation'
  private speed: number
  private direction: 'cw' | 'ccw'

  constructor(config?: { speed?: number; direction?: 'cw' | 'ccw' }) {
    this.speed = config?.speed ?? 1
    this.direction = config?.direction ?? 'ccw'
  }

  update(state: MotionState, context: MotionContext): MotionState {
    const sign = this.direction === 'cw' ? -1 : 1
    const angularVelocity = sign * this.speed * context.semantic.energy * Math.PI * 2
    const newRotation = state.rotation + angularVelocity * context.delta

    return {
      ...state,
      rotation: newRotation,
      angularVelocity,
    }
  }
}

// ─── Parallax Motion ─────────────────────────────────────────────────────

/** Parallax — depth-based displacement (simulates 3D parallax) */
export class ParallaxMotion implements Motion {
  readonly type = 'parallax'
  private depth: number // 0 = far, 1 = near
  private direction: Vector
  private amplitude: number

  constructor(config?: {
    depth?: number
    direction?: Vector
    amplitude?: number
  }) {
    this.depth = config?.depth ?? 0.5
    this.direction = config?.direction ?? { x: 1, y: 0.5 }
    this.amplitude = config?.amplitude ?? 0.05
  }

  update(state: MotionState, context: MotionContext): MotionState {
    // Parallax factor based on depth
    const factor = this.depth * this.amplitude

    // Sinusoidal movement based on time
    const offsetX = Math.sin(context.time * 0.5) * this.direction.x * factor
    const offsetY = Math.sin(context.time * 0.3) * this.direction.y * factor

    return {
      ...state,
      position: {
        x: state.position.x + offsetX * context.semantic.energy,
        y: state.position.y + offsetY * context.semantic.energy,
      },
    }
  }
}

// ─── Morph Motion ────────────────────────────────────────────────────────

/** Morph — smooth position morphing between target points */
export class MorphMotion implements Motion {
  readonly type = 'morph'
  private targets: Point[]
  private speed: number
  private currentIndex = 0
  private progress = 0

  constructor(config?: { targets?: Point[]; speed?: number }) {
    this.targets = config?.targets ?? [
      { x: 0.3, y: 0.3 },
      { x: 0.7, y: 0.3 },
      { x: 0.7, y: 0.7 },
      { x: 0.3, y: 0.7 },
    ]
    this.speed = config?.speed ?? 0.5
  }

  update(state: MotionState, context: MotionContext): MotionState {
    if (this.targets.length < 2) return state

    this.progress += context.delta * this.speed * context.semantic.energy

    if (this.progress >= 1) {
      this.progress -= 1
      this.currentIndex = (this.currentIndex + 1) % this.targets.length
    }

    const from = this.targets[this.currentIndex]!
    const to = this.targets[(this.currentIndex + 1) % this.targets.length]!

    // Smooth interpolation (ease in-out)
    const t = this.progress
    const eased = t * t * (3 - 2 * t)

    const newX = from.x + (to.x - from.x) * eased
    const newY = from.y + (to.y - from.y) * eased

    return {
      ...state,
      position: { x: newX, y: newY },
      velocity: {
        x: (to.x - from.x) * this.speed,
        y: (to.y - from.y) * this.speed,
      },
    }
  }
}

// ─── Motion Composer ─────────────────────────────────────────────────────

/**
 * Motion composer — combines multiple motions with priority and weight.
 *
 * Higher priority motions are applied first.
 * Weight determines how much each motion contributes.
 */
export interface MotionLayer {
  motion: Motion
  priority: number
  weight: number
}

export class MotionComposer implements Motion {
  readonly type = 'compose'
  private layers: MotionLayer[]

  constructor(layers: MotionLayer[]) {
    // Sort by priority (highest first)
    this.layers = [...layers].sort((a, b) => b.priority - a.priority)
  }

  update(state: MotionState, context: MotionContext): MotionState {
    let result = { ...state }

    for (const layer of this.layers) {
      const updated = layer.motion.update(result, context)
      const w = layer.weight

      // Blend between original and updated based on weight
      result = {
        position: {
          x: result.position.x + (updated.position.x - result.position.x) * w,
          y: result.position.y + (updated.position.y - result.position.y) * w,
        },
        rotation: result.rotation + (updated.rotation - result.rotation) * w,
        scale: {
          x: result.scale.x + (updated.scale.x - result.scale.x) * w,
          y: result.scale.y + (updated.scale.y - result.scale.y) * w,
        },
        velocity: {
          x: result.velocity.x + (updated.velocity.x - result.velocity.x) * w,
          y: result.velocity.y + (updated.velocity.y - result.velocity.y) * w,
        },
        angularVelocity:
          result.angularVelocity +
          (updated.angularVelocity - result.angularVelocity) * w,
        opacity: result.opacity + (updated.opacity - result.opacity) * w,
      }
    }

    return result
  }
}

// ─── Reduced Motion ──────────────────────────────────────────────────────

/**
 * Reduced motion wrapper — wraps a motion and reduces its intensity.
 *
 * Respects prefers-reduced-motion and provides fine-grained control.
 */
export class ReducedMotion implements Motion {
  readonly type = 'reduced'
  private inner: Motion
  private factor: number // 0 = no motion, 1 = full motion

  constructor(inner: Motion, factor?: number) {
    this.inner = inner
    this.factor = factor ?? 0.2
  }

  update(state: MotionState, context: MotionContext): MotionState {
    if (this.factor <= 0) return state

    const reducedContext: MotionContext = {
      ...context,
      semantic: {
        energy: context.semantic.energy * this.factor,
        rhythm: context.semantic.rhythm * this.factor,
        turbulence: context.semantic.turbulence * this.factor,
      },
    }

    return this.inner.update(state, reducedContext)
  }
}

/** Check if user prefers reduced motion (browser only) */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}
