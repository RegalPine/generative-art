/**
 * Performance Panel — real-time performance monitoring overlay.
 *
 * Displays FPS, draw calls, geometry count, and tier info.
 * SSR-safe: only accesses DOM when explicitly initialized.
 */

import { FPSMonitor } from '../../performance/monitor'
import type { PerformanceTier } from '../../performance/tier'

/** Performance panel configuration */
export interface PerfPanelConfig {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  showFps: boolean
  showDrawCalls: boolean
  showGeometryCount: boolean
  showTier: boolean
  backgroundColor: string
  textColor: string
  fontSize: number
}

/** Default performance panel config */
export const DEFAULT_PERF_PANEL_CONFIG: PerfPanelConfig = {
  position: 'top-left',
  showFps: true,
  showDrawCalls: true,
  showGeometryCount: true,
  showTier: true,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  textColor: '#00ff88',
  fontSize: 12,
}

/** Performance stats */
export interface PerfStats {
  fps: number
  averageFps: number
  drawCalls: number
  geometryCount: number
  tier: PerformanceTier
  frameTime: number
}

/** Performance Panel — displays real-time stats */
export class PerfPanel {
  private element: HTMLDivElement | null = null
  private monitor: FPSMonitor
  private config: PerfPanelConfig
  private animationId = 0
  private stats: PerfStats = {
    fps: 0,
    averageFps: 0,
    drawCalls: 0,
    geometryCount: 0,
    tier: 1,
    frameTime: 0,
  }

  constructor(config: Partial<PerfPanelConfig> = {}) {
    this.config = { ...DEFAULT_PERF_PANEL_CONFIG, ...config }
    this.monitor = new FPSMonitor(60)
  }

  /** Attach the panel to a container element */
  attach(container: HTMLElement): void {
    if (typeof document === 'undefined') return

    this.element = document.createElement('div')
    this.applyPosition()
    this.applyStyles()
    container.appendChild(this.element)

    this.monitor.start()
    this.updateLoop()
  }

  /** Detach the panel */
  detach(): void {
    if (this.element?.parentElement) {
      this.element.parentElement.removeChild(this.element)
    }
    this.element = null
    this.monitor.stop()
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  }

  /** Update stats (call per frame) */
  tick(time: number, drawCalls: number, geometryCount: number, tier: PerformanceTier): void {
    this.monitor.tick(time)
    this.stats.drawCalls = drawCalls
    this.stats.geometryCount = geometryCount
    this.stats.tier = tier
    this.stats.fps = this.monitor.fps
    this.stats.averageFps = this.monitor.averageFps
    this.stats.frameTime = this.stats.fps > 0 ? 1000 / this.stats.fps : 0
  }

  /** Get current stats */
  getStats(): PerfStats {
    return { ...this.stats }
  }

  /** Update loop */
  private updateLoop = (): void => {
    if (!this.element) return

    this.renderStats()
    this.animationId = requestAnimationFrame(this.updateLoop)
  }

  /** Render stats to DOM */
  private renderStats(): void {
    if (!this.element) return

    const lines: string[] = []
    if (this.config.showFps) {
      lines.push(`FPS: ${this.stats.fps.toFixed(0)} (avg: ${this.stats.averageFps.toFixed(0)})`)
    }
    if (this.config.showDrawCalls) {
      lines.push(`Draw Calls: ${this.stats.drawCalls}`)
    }
    if (this.config.showGeometryCount) {
      lines.push(`Geometry: ${this.stats.geometryCount}`)
    }
    if (this.config.showTier) {
      lines.push(`Tier: ${this.stats.tier}`)
    }
    lines.push(`Frame: ${this.stats.frameTime.toFixed(1)}ms`)

    this.element.textContent = lines.join('\n')
  }

  /** Apply position styles */
  private applyPosition(): void {
    if (!this.element) return

    this.element.style.position = 'fixed'
    this.element.style.zIndex = '99999'
    this.element.style.padding = '8px'
    this.element.style.borderRadius = '4px'
    this.element.style.fontFamily = 'monospace'
    this.element.style.pointerEvents = 'none'

    switch (this.config.position) {
      case 'top-left':
        this.element.style.top = '8px'
        this.element.style.left = '8px'
        break
      case 'top-right':
        this.element.style.top = '8px'
        this.element.style.right = '8px'
        break
      case 'bottom-left':
        this.element.style.bottom = '8px'
        this.element.style.left = '8px'
        break
      case 'bottom-right':
        this.element.style.bottom = '8px'
        this.element.style.right = '8px'
        break
    }
  }

  /** Apply visual styles */
  private applyStyles(): void {
    if (!this.element) return
    this.element.style.backgroundColor = this.config.backgroundColor
    this.element.style.color = this.config.textColor
    this.element.style.fontSize = `${this.config.fontSize}px`
    this.element.style.whiteSpace = 'pre'
    this.element.style.lineHeight = '1.4'
  }
}

/** Create a performance panel */
export function createPerfPanel(config?: Partial<PerfPanelConfig>): PerfPanel {
  return new PerfPanel(config)
}
