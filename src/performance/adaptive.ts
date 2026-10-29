/**
 * Adaptive Performance — dynamic tier adjustment based on FPS.
 */

import type { PerformanceTier } from './tier'
import { clampTier } from './tier'

/** Adaptive config */
export interface AdaptiveConfig {
  /** FPS threshold to downgrade (below this → downgrade) */
  downgradeThreshold: number
  /** FPS threshold to upgrade (above this → upgrade) */
  upgradeThreshold: number
  /** Minimum tier (won't go below) */
  minTier: PerformanceTier
  /** Maximum tier (won't go above) */
  maxTier: PerformanceTier
  /** Number of consecutive bad frames before downgrade */
  downgradeFrames: number
  /** Number of consecutive good frames before upgrade */
  upgradeFrames: number
}

/** Default adaptive config */
export const DEFAULT_ADAPTIVE_CONFIG: AdaptiveConfig = {
  downgradeThreshold: 24,
  upgradeThreshold: 55,
  minTier: 0,
  maxTier: 3,
  downgradeFrames: 60,
  upgradeFrames: 120,
}

/** Adaptive performance manager */
export class AdaptivePerformance {
  private currentTier: PerformanceTier
  private badFrameCount = 0
  private goodFrameCount = 0
  private readonly config: AdaptiveConfig
  private onTierChange?: (tier: PerformanceTier) => void

  constructor(
    initialTier: PerformanceTier,
    config: AdaptiveConfig = DEFAULT_ADAPTIVE_CONFIG,
    onTierChange?: (tier: PerformanceTier) => void,
  ) {
    this.currentTier = initialTier
    this.config = config
    this.onTierChange = onTierChange
  }

  /** Update based on current FPS — call once per frame */
  update(fps: number): PerformanceTier {
    // Check for downgrade
    if (fps < this.config.downgradeThreshold) {
      this.badFrameCount++
      this.goodFrameCount = 0

      if (this.badFrameCount >= this.config.downgradeFrames && this.currentTier > this.config.minTier) {
        this.currentTier = clampTier(this.currentTier - 1)
        this.badFrameCount = 0
        this.onTierChange?.(this.currentTier)
      }
    }
    // Check for upgrade
    else if (fps > this.config.upgradeThreshold) {
      this.goodFrameCount++
      this.badFrameCount = 0

      if (this.goodFrameCount >= this.config.upgradeFrames && this.currentTier < this.config.maxTier) {
        this.currentTier = clampTier(this.currentTier + 1)
        this.goodFrameCount = 0
        this.onTierChange?.(this.currentTier)
      }
    }
    // FPS in acceptable range — reset counters
    else {
      this.badFrameCount = 0
      this.goodFrameCount = 0
    }

    return this.currentTier
  }

  /** Get current tier */
  get tier(): PerformanceTier {
    return this.currentTier
  }

  /** Force a specific tier */
  setTier(tier: PerformanceTier): void {
    this.currentTier = clampTier(tier)
    this.badFrameCount = 0
    this.goodFrameCount = 0
    this.onTierChange?.(this.currentTier)
  }

  /** Reset counters */
  reset(): void {
    this.badFrameCount = 0
    this.goodFrameCount = 0
  }
}

/** Create adaptive performance manager */
export function createAdaptivePerformance(
  initialTier: PerformanceTier,
  config?: Partial<AdaptiveConfig>,
  onTierChange?: (tier: PerformanceTier) => void,
): AdaptivePerformance {
  return new AdaptivePerformance(
    initialTier,
    { ...DEFAULT_ADAPTIVE_CONFIG, ...config },
    onTierChange,
  )
}
