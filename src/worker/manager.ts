/**
 * Worker Manager — manages Web Worker lifecycle and communication.
 *
 * Features:
 * - Worker pool for parallel computation
 * - Request/response correlation via message IDs
 * - Transferable Objects for zero-copy data transfer
 * - Graceful fallback when Workers unavailable
 */

import { createWorkerRequest } from './protocol'
import type { WorkerResponse, WorkerRequestType } from './protocol'

/** Worker state */
export interface WorkerState {
  worker: Worker
  busy: boolean
  pendingRequests: Map<number, {
    resolve: (value: unknown) => void
    reject: (reason: unknown) => void
  }>
}

/** Worker manager config */
export interface WorkerManagerConfig {
  maxWorkers: number
  workerUrl?: string
  workerScript?: string
}

/** Default worker manager config */
export const DEFAULT_WORKER_CONFIG: WorkerManagerConfig = {
  maxWorkers: 2,
}

/** Worker Manager — manages a pool of computation workers */
export class WorkerManager {
  private workers: WorkerState[] = []
  private nextId = 0
  private config: WorkerManagerConfig
  private initialized = false

  constructor(config: Partial<WorkerManagerConfig> = {}) {
    this.config = { ...DEFAULT_WORKER_CONFIG, ...config }
  }

  /** Initialize the worker pool */
  initialize(): void {
    if (this.initialized) return
    if (typeof Worker === 'undefined') return

    for (let i = 0; i < this.config.maxWorkers; i++) {
      try {
        const worker = this.createWorker()
        if (worker) {
          this.workers.push({
            worker,
            busy: false,
            pendingRequests: new Map(),
          })
        }
      } catch {
        // Worker creation failed, continue with fewer workers
      }
    }

    this.initialized = true
  }

  /** Check if workers are available */
  isAvailable(): boolean {
    return this.workers.length > 0
  }

  /** Get number of active workers */
  get workerCount(): number {
    return this.workers.length
  }

  /** Send a request to a worker and get a promise for the result */
  async send(type: WorkerRequestType, payload: unknown, transferables?: Transferable[]): Promise<unknown> {
    if (this.workers.length === 0) {
      throw new Error('No workers available')
    }

    // Find an idle worker, or wait for one
    const workerState = this.getIdleWorker()
    if (!workerState) {
      // All workers busy — run in main thread fallback
      return this.mainThreadFallback(type, payload)
    }

    const id = this.nextId++
    const request = createWorkerRequest(id, type, payload)

    return new Promise((resolve, reject) => {
      workerState.pendingRequests.set(id, { resolve, reject })
      workerState.busy = true

      const transferList = transferables ?? []
      workerState.worker.postMessage(request, transferList)
    })
  }

  /** Get an idle worker */
  private getIdleWorker(): WorkerState | null {
    return this.workers.find(w => !w.busy) ?? null
  }

  /** Create a worker instance */
  private createWorker(): Worker | null {
    if (typeof Worker === 'undefined') return null

    if (this.config.workerUrl) {
      return new Worker(this.config.workerUrl, { type: 'module' })
    }

    // Create an inline worker from a blob
    const script = this.config.workerScript ?? this.getDefaultWorkerScript()
    const blob = new Blob([script], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)
    const worker = new Worker(url, { type: 'module' })

    // Set up message handling
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      this.handleMessage(worker, event.data)
    }

    worker.onerror = (event: ErrorEvent) => {
      this.handleError(worker, event)
    }

    return worker
  }

  /** Handle a message from a worker */
  private handleMessage(worker: Worker, response: WorkerResponse): void {
    const workerState = this.workers.find(w => w.worker === worker)
    if (!workerState) return

    const pending = workerState.pendingRequests.get(response.id)
    if (pending) {
      workerState.pendingRequests.delete(response.id)
      if (response.error) {
        pending.reject(new Error(response.error))
      } else {
        pending.resolve(response.payload)
      }
    }

    if (workerState.pendingRequests.size === 0) {
      workerState.busy = false
    }
  }

  /** Handle a worker error */
  private handleError(worker: Worker, event: ErrorEvent): void {
    const workerState = this.workers.find(w => w.worker === worker)
    if (!workerState) return

    // Reject all pending requests
    for (const [, pending] of workerState.pendingRequests) {
      pending.reject(new Error(event.message))
    }
    workerState.pendingRequests.clear()
    workerState.busy = false
  }

  /** Main thread fallback when no workers available */
  private async mainThreadFallback(type: WorkerRequestType, payload: unknown): Promise<unknown> {
    // For field/motion computation, return payload as-is (caller handles)
    return { type, payload, fallback: true }
  }

  /** Get default worker script (minimal computation handler) */
  private getDefaultWorkerScript(): string {
    return `
      self.onmessage = (event) => {
        const request = event.data;
        try {
          // Echo back for now — actual computation is handled by specific worker scripts
          self.postMessage({
            id: request.id,
            type: 'result',
            payload: request.payload,
            timestamp: Date.now()
          });
        } catch (err) {
          self.postMessage({
            id: request.id,
            type: 'error',
            payload: null,
            error: err.message,
            timestamp: Date.now()
          });
        }
      };
    `
  }

  /** Dispose all workers */
  dispose(): void {
    for (const state of this.workers) {
      state.worker.terminate()
      state.pendingRequests.clear()
    }
    this.workers = []
    this.initialized = false
  }
}

/** Create a worker manager */
export function createWorkerManager(config?: Partial<WorkerManagerConfig>): WorkerManager {
  return new WorkerManager(config)
}
