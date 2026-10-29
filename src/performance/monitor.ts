/**
 * FPS Monitor — runtime frame rate monitoring.
 */

/** FPS monitor state */
export interface FPSMonitorState {
  fps: number
  averageFps: number
  minFps: number
  maxFps: number
  frameCount: number
  isRunning: boolean
}

/** FPS Monitor — tracks frame rate over time */
export class FPSMonitor {
  private frameTimes: number[] = []
  private lastTime = 0
  private _fps = 0
  private _averageFps = 0
  private _minFps = Infinity
  private _maxFps = 0
  private _frameCount = 0
  private _isRunning = false
  private readonly windowSize: number

  constructor(windowSize = 60) {
    this.windowSize = windowSize
  }

  /** Start monitoring */
  start(): void {
    this._isRunning = true
    this.lastTime = performance.now()
    this.frameTimes = []
  }

  /** Stop monitoring */
  stop(): void {
    this._isRunning = false
  }

  /** Record a frame — call once per frame */
  tick(time: number): void {
    if (!this._isRunning) return

    const delta = time - this.lastTime
    this.lastTime = time

    if (delta <= 0) return

    const fps = 1000 / delta
    this.frameTimes.push(fps)

    // Keep only the window size
    if (this.frameTimes.length > this.windowSize) {
      this.frameTimes.shift()
    }

    // Calculate current FPS (average over window)
    const sum = this.frameTimes.reduce((a, b) => a + b, 0)
    this._fps = sum / this.frameTimes.length
    this._averageFps = this._fps

    // Track min/max
    if (fps < this._minFps) this._minFps = fps
    if (fps > this._maxFps) this._maxFps = fps

    this._frameCount++
  }

  /** Get current FPS */
  get fps(): number {
    return this._fps
  }

  /** Get average FPS */
  get averageFps(): number {
    return this._averageFps
  }

  /** Get minimum FPS observed */
  get minFps(): number {
    return this._minFps === Infinity ? 0 : this._minFps
  }

  /** Get maximum FPS observed */
  get maxFps(): number {
    return this._maxFps
  }

  /** Get total frame count */
  get frameCount(): number {
    return this._frameCount
  }

  /** Check if monitor is running */
  get isRunning(): boolean {
    return this._isRunning
  }

  /** Get full state */
  getState(): FPSMonitorState {
    return {
      fps: this._fps,
      averageFps: this._averageFps,
      minFps: this.minFps,
      maxFps: this._maxFps,
      frameCount: this._frameCount,
      isRunning: this._isRunning,
    }
  }

  /** Reset all metrics */
  reset(): void {
    this.frameTimes = []
    this._fps = 0
    this._averageFps = 0
    this._minFps = Infinity
    this._maxFps = 0
    this._frameCount = 0
  }
}

/** Create a new FPS monitor */
export function createFPSMonitor(windowSize = 60): FPSMonitor {
  return new FPSMonitor(windowSize)
}
