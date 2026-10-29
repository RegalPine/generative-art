/**
 * Field Worker — offloads field computation to a Web Worker.
 */

import type { WorkerFieldPayload, WorkerFieldResult } from './protocol'

/** Field worker script — runs inside a Web Worker */
export const FIELD_WORKER_SCRIPT = /* javascript */ `
'use strict';

// Simplex noise implementation for worker
function createNoise(seed) {
  const perm = new Uint8Array(512);
  const grad3 = [
    [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
    [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
    [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
  ];

  // Seed-based permutation
  let s = seed;
  for (let i = 0; i < 256; i++) {
    perm[i] = i;
  }
  for (let i = 255; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  for (let i = 0; i < 256; i++) {
    perm[i + 256] = perm[i];
  }

  function dot3(g, x, y) {
    return g[0] * x + g[1] * y;
  }

  const F2 = 0.5 * (Math.sqrt(3) - 1);
  const G2 = (3 - Math.sqrt(3)) / 6;

  return function noise2D(xin, yin) {
    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;

    let i1, j1;
    if (x0 > y0) { i1 = 1; j1 = 0; }
    else { i1 = 0; j1 = 1; }

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;

    const ii = i & 255;
    const jj = j & 255;
    const gi0 = perm[ii + perm[jj]] % 12;
    const gi1 = perm[ii + i1 + perm[jj + j1]] % 12;
    const gi2 = perm[ii + 1 + perm[jj + 1]] % 12;

    let n0, n1, n2;
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 < 0) n0 = 0;
    else { t0 *= t0; n0 = t0 * t0 * dot3(grad3[gi0], x0, y0); }

    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 < 0) n1 = 0;
    else { t1 *= t1; n1 = t1 * t1 * dot3(grad3[gi1], x1, y1); }

    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 < 0) n2 = 0;
    else { t2 *= t2; n2 = t2 * t2 * dot3(grad3[gi2], x2, y2); }

    return 70 * (n0 + n1 + n2);
  };
}

self.onmessage = (event) => {
  const request = event.data;
  const { id, payload } = request;

  try {
    if (request.type === 'computeField') {
      const { points, width, height, time, fieldType, fieldConfig } = payload;
      const pointCount = points.length / 2;
      const vectors = new Float32Array(pointCount * 2);
      const noise = createNoise(fieldConfig.seed || 42);
      const scale = fieldConfig.scale || 1;

      for (let i = 0; i < pointCount; i++) {
        const x = points[i * 2] * width;
        const y = points[i * 2 + 1] * height;
        const nx = x / width * scale;
        const ny = y / height * scale;

        if (fieldType === 'curl') {
          const eps = 0.001;
          const n1 = noise(nx, ny + eps + time * 0.1);
          const n2 = noise(nx, ny - eps + time * 0.1);
          const n3 = noise(nx + eps, ny + time * 0.1);
          const n4 = noise(nx - eps, ny + time * 0.1);
          vectors[i * 2] = (n1 - n2) / (2 * eps);
          vectors[i * 2 + 1] = -(n3 - n4) / (2 * eps);
        } else {
          vectors[i * 2] = noise(nx + time * 0.1, ny);
          vectors[i * 2 + 1] = noise(nx, ny + time * 0.1);
        }
      }

      const result = { vectors, pointCount };
      self.postMessage(
        { id, type: 'result', payload: result, timestamp: Date.now() },
        [vectors.buffer]
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

/** Create a field computation worker */
export function createFieldWorker(): Worker | null {
  if (typeof Worker === 'undefined') return null

  const blob = new Blob([FIELD_WORKER_SCRIPT], { type: 'application/javascript' })
  const url = URL.createObjectURL(blob)
  return new Worker(url)
}

/** Compute field in a worker */
export function computeFieldInWorker(
  worker: Worker,
  payload: WorkerFieldPayload,
): Promise<WorkerFieldResult> {
  return new Promise((resolve, reject) => {
    const id = Date.now()

    const handler = (event: MessageEvent) => {
      const response = event.data
      if (response.id === id) {
        worker.removeEventListener('message', handler)
        if (response.type === 'error') {
          reject(new Error(response.error))
        } else {
          resolve(response.payload as WorkerFieldResult)
        }
      }
    }

    worker.addEventListener('message', handler)
    worker.postMessage(
      { id, type: 'computeField', payload, timestamp: Date.now() },
      [payload.points.buffer],
    )
  })
}
