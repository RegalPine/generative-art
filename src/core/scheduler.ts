/**
 * Animation scheduler — drives the update/render loop.
 *
 * Uses requestAnimationFrame when available (browser).
 * SSR-safe: only accesses rAF inside start().
 *
 * Supports:
 * - start/stop/pause/resume
 * - delta-time computation
 * - external clock (future: worker, fixed timestep)
 */

/** Scheduler callback signature */
export type SchedulerCallback = (time: number, delta: number) => void

/** Scheduler interface */
export interface Scheduler {
  start(callback: SchedulerCallback): void
  stop(): void
  pause(): void
  resume(): void
  readonly running: boolean
  readonly paused: boolean
}

/** Create a requestAnimationFrame-based scheduler */
export function createScheduler(): Scheduler {
  let rafId: number | null = null
  let lastTime = 0
  let callback: SchedulerCallback | null = null
  let isRunning = false
  let isPaused = false

  function tick(time: number): void {
    if (!isRunning || isPaused) return

    const delta = lastTime > 0 ? (time - lastTime) / 1000 : 0.016
    lastTime = time

    // Clamp delta to avoid spiral of death
    const clampedDelta = Math.min(delta, 0.1)

    if (callback) {
      callback(time / 1000, clampedDelta)
    }

    rafId = requestAnimationFrame(tick)
  }

  return {
    start(cb: SchedulerCallback): void {
      if (isRunning) return
      callback = cb
      isRunning = true
      isPaused = false
      lastTime = 0
      rafId = requestAnimationFrame(tick)
    },

    stop(): void {
      isRunning = false
      isPaused = false
      callback = null
      lastTime = 0
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    },

    pause(): void {
      if (!isRunning || isPaused) return
      isPaused = true
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    },

    resume(): void {
      if (!isRunning || !isPaused) return
      isPaused = false
      lastTime = 0 // Reset so delta doesn't spike
      rafId = requestAnimationFrame(tick)
    },

    get running(): boolean {
      return isRunning
    },

    get paused(): boolean {
      return isPaused
    },
  }
}
