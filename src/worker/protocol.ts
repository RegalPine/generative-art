/**
 * Worker Protocol — message types for main thread ↔ worker communication.
 *
 * Uses Transferable Objects for efficient data transfer.
 */

/** Worker request types */
export type WorkerRequestType =
  | 'init'
  | 'computeField'
  | 'computeMotion'
  | 'computeComposition'
  | 'updateConfig'
  | 'dispose'

/** Worker response types */
export type WorkerResponseType =
  | 'ready'
  | 'result'
  | 'error'
  | 'progress'

/** Base worker message */
export interface WorkerMessage {
  id: number
  type: WorkerRequestType | WorkerResponseType
  timestamp: number
}

/** Worker request */
export interface WorkerRequest extends WorkerMessage {
  type: WorkerRequestType
  payload: unknown
}

/** Worker response */
export interface WorkerResponse extends WorkerMessage {
  type: WorkerResponseType
  payload: unknown
  error?: string
}

/** Init payload */
export interface WorkerInitPayload {
  seed: number
  config: Record<string, unknown>
}

/** Field computation payload */
export interface WorkerFieldPayload {
  points: Float32Array
  width: number
  height: number
  time: number
  fieldType: string
  fieldConfig: Record<string, unknown>
}

/** Field computation result */
export interface WorkerFieldResult {
  vectors: Float32Array
  pointCount: number
}

/** Motion computation payload */
export interface WorkerMotionPayload {
  positions: Float32Array
  time: number
  delta: number
  motionType: string
  motionConfig: Record<string, unknown>
}

/** Motion computation result */
export interface WorkerMotionResult {
  positions: Float32Array
  count: number
}

/** Create a worker request */
export function createWorkerRequest(
  id: number,
  type: WorkerRequestType,
  payload: unknown,
): WorkerRequest {
  return { id, type, payload, timestamp: Date.now() }
}

/** Create a worker response */
export function createWorkerResponse(
  id: number,
  type: WorkerResponseType,
  payload: unknown,
  error?: string,
): WorkerResponse {
  return { id, type, payload, timestamp: Date.now(), error }
}

/** Extract transferable objects from a response */
export function getTransferables(response: WorkerResponse): Transferable[] {
  const transferables: Transferable[] = []
  const payload = response.payload as Record<string, unknown>

  if (payload) {
    for (const value of Object.values(payload)) {
      if (value instanceof Float32Array || value instanceof ArrayBuffer) {
        transferables.push(value instanceof Float32Array ? value.buffer : value)
      }
    }
  }

  return transferables
}
