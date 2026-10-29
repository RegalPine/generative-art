/**
 * Motion Worker — offloads motion computation to a Web Worker.
 */

import type { WorkerMotionPayload, WorkerMotionResult } from './protocol'

/** Motion worker script — runs inside a Web Worker */
export const MOTION_WORKER_SCRIPT = /* javascript */ `
'use strict';

self.onmessage = (event) => {
  const request = event.data;
  const { id, payload } = request;

  try {
    if (request.type === 'computeMotion') {
      const { positions, time, delta, motionType, motionConfig } = payload;
      const count = positions.length / 2;
      const result = new Float32Array(count * 2);
      const speed = motionConfig.speed || 1;
      const amplitude = motionConfig.amplitude || 0.1;

      for (let i = 0; i < count; i++) {
        const x = positions[i * 2];
        const y = positions[i * 2 + 1];
        const phase = motionConfig.phase || i * 0.1;

        switch (motionType) {
          case 'flow':
            result[i * 2] = x + Math.sin(time * speed + phase) * amplitude * delta;
            result[i * 2 + 1] = y + Math.cos(time * speed + phase) * amplitude * delta;
            break;
          case 'drift':
            result[i * 2] = x + Math.sin(time * speed * 0.5 + phase) * amplitude * 0.5 * delta;
            result[i * 2 + 1] = y + delta * speed * 0.01;
            break;
          case 'orbit': {
            const cx = motionConfig.centerX || 0.5;
            const cy = motionConfig.centerY || 0.5;
            const radius = motionConfig.radius || 0.1;
            const angle = time * speed + phase;
            result[i * 2] = cx + Math.cos(angle) * radius;
            result[i * 2 + 1] = cy + Math.sin(angle) * radius;
            break;
          }
          case 'pulse': {
            const scale = 1 + Math.sin(time * speed + phase) * amplitude * 0.3;
            result[i * 2] = x * scale;
            result[i * 2 + 1] = y * scale;
            break;
          }
          default:
            result[i * 2] = x;
            result[i * 2 + 1] = y;
        }
      }

      const motionResult = { positions: result, count };
      self.postMessage(
        { id, type: 'result', payload: motionResult, timestamp: Date.now() },
        [result.buffer]
      );
    }
  } catch (err) {
    self.postMessage({
      id,
      type: 'error',
      payload: null,
      error: err.message,
      timestamp: Date.now()
    });
  }
};
`

/** Create a motion computation worker */
export function createMotionWorker(): Worker | null {
  if (typeof Worker === 'undefined') return null

  const blob = new Blob([MOTION_WORKER_SCRIPT], { type: 'application/javascript' })
  const url = URL.createObjectURL(blob)
  return new Worker(url)
}

/** Compute motion in a worker */
export function computeMotionInWorker(
  worker: Worker,
  payload: WorkerMotionPayload,
): Promise<WorkerMotionResult> {
  return new Promise((resolve, reject) => {
    const id = Date.now()

    const handler = (event: MessageEvent) => {
      const response = event.data
      if (response.id === id) {
        worker.removeEventListener('message', handler)
        if (response.type === 'error') {
          reject(new Error(response.error))
        } else {
          resolve(response.payload as WorkerMotionResult)
        }
      }
    }

    worker.addEventListener('message', handler)
    worker.postMessage(
      { id, type: 'computeMotion', payload, timestamp: Date.now() },
      [payload.positions.buffer],
    )
  })
}
