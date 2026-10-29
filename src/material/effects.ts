/**
 * Material effects — Glow, Blur, Grain, Noise, Shadow.
 *
 * These complete the P1 material system.
 */

import type { Point } from '../geometry/types'
import type { Seed } from '../core/seed'

// ─── Glow Effect ─────────────────────────────────────────────────────────

/** Glow configuration */
export interface GlowEffect {
  type: 'glow'
  /** Glow color (CSS string) */
  color: string
  /** Glow radius in pixels */
  radius: number
  /** Glow intensity (0~1) */
  intensity: number
  /** Number of glow layers (more = smoother) */
  layers: number
}

/** Create a glow effect */
export function createGlow(config: Partial<GlowEffect> = {}): GlowEffect {
  return {
    type: 'glow',
    color: config.color ?? '#ffffff',
    radius: config.radius ?? 10,
    intensity: config.intensity ?? 0.5,
    layers: config.layers ?? 3,
  }
}

/** Get canvas shadow properties from glow */
export function glowToShadow(glow: GlowEffect): {
  color: string
  blur: number
} {
  return {
    color: glow.color,
    blur: glow.radius * glow.intensity,
  }
}

// ─── Blur Effect ─────────────────────────────────────────────────────────

/** Blur configuration */
export interface BlurEffect {
  type: 'blur'
  /** Blur radius in pixels */
  radius: number
  /** Blur type */
  blurType: 'gaussian' | 'box' | 'directional'
  /** For directional blur: angle in radians */
  angle?: number
}

/** Create a blur effect */
export function createBlur(config: Partial<BlurEffect> = {}): BlurEffect {
  return {
    type: 'blur',
    radius: config.radius ?? 5,
    blurType: config.blurType ?? 'gaussian',
    angle: config.angle,
  }
}

// ─── Grain Effect ────────────────────────────────────────────────────────

/** Grain configuration — adds film-grain-like texture */
export interface GrainEffect {
  type: 'grain'
  /** Grain intensity (0~1) */
  intensity: number
  /** Grain size (pixels) */
  size: number
  /** Grain color tint */
  color: string
  /** Whether grain is monochrome */
  monochrome: boolean
}

/** Create a grain effect */
export function createGrain(config: Partial<GrainEffect> = {}): GrainEffect {
  return {
    type: 'grain',
    intensity: config.intensity ?? 0.1,
    size: config.size ?? 1,
    color: config.color ?? '#808080',
    monochrome: config.monochrome ?? true,
  }
}

/** Generate grain value at a point (deterministic) */
export function sampleGrain(
  point: Point,
  seed: Seed,
  config: GrainEffect,
): { r: number; g: number; b: number; a: number } {
  // Use point coordinates + seed for deterministic grain
  const hash = Math.sin(point.x * 12.9898 + point.y * 78.233 + seed.value) * 43758.5453
  const noise = hash - Math.floor(hash)

  const intensity = config.intensity * (noise * 2 - 1)

  if (config.monochrome) {
    const v = 128 + intensity * 128
    return { r: v, g: v, b: v, a: config.intensity }
  }

  return {
    r: 128 + intensity * 128,
    g: 128 + (noise * 2 - 1) * config.intensity * 128,
    b: 128 + ((noise * 3 - 1.5) % 1) * config.intensity * 128,
    a: config.intensity,
  }
}

// ─── Noise Texture Effect ────────────────────────────────────────────────

/** Noise texture configuration */
export interface NoiseTextureEffect {
  type: 'noise-texture'
  /** Noise scale */
  scale: number
  /** Noise intensity (0~1) */
  intensity: number
  /** Noise octaves */
  octaves: number
  /** Whether to use as overlay blend */
  asOverlay: boolean
}

/** Create a noise texture effect */
export function createNoiseTexture(
  config: Partial<NoiseTextureEffect> = {},
): NoiseTextureEffect {
  return {
    type: 'noise-texture',
    scale: config.scale ?? 10,
    intensity: config.intensity ?? 0.2,
    octaves: config.octaves ?? 3,
    asOverlay: config.asOverlay ?? true,
  }
}

// ─── Shadow Effect ───────────────────────────────────────────────────────

/** Shadow configuration */
export interface ShadowEffect {
  type: 'shadow'
  /** Shadow color */
  color: string
  /** Shadow blur radius */
  blur: number
  /** Shadow offset X */
  offsetX: number
  /** Shadow offset Y */
  offsetY: number
  /** Shadow opacity */
  opacity: number
}

/** Create a shadow effect */
export function createShadow(config: Partial<ShadowEffect> = {}): ShadowEffect {
  return {
    type: 'shadow',
    color: config.color ?? '#000000',
    blur: config.blur ?? 5,
    offsetX: config.offsetX ?? 2,
    offsetY: config.offsetY ?? 2,
    opacity: config.opacity ?? 0.5,
  }
}

// ─── Effect Union Type ───────────────────────────────────────────────────

export type MaterialEffect =
  | GlowEffect
  | BlurEffect
  | GrainEffect
  | NoiseTextureEffect
  | ShadowEffect
