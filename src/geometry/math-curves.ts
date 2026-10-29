/**
 * Mathematical curves with aesthetic beauty.
 *
 * Parametric curves, special functions, and fractal curves
 * for generative art backgrounds.
 */

import type { Point } from '../geometry/types'

const TAU = Math.PI * 2
const PHI = 1.618033988749895

/* ── Utility: Catmull-Rom smooth curve ─── */

export interface ArtCurve {
  sample(count: number): Point[]
}

export function createSmoothCurve(controlPoints: Point[]): ArtCurve {
  const pts = controlPoints
  return {
    sample(count: number): Point[] {
      if (pts.length < 2) return [...pts]
      const result: Point[] = []
      for (let i = 0; i < count; i++) {
        const t = count === 1 ? 0 : i / (count - 1)
        const scaledT = t * (pts.length - 1)
        const seg = Math.min(Math.floor(scaledT), pts.length - 2)
        const localT = scaledT - seg
        const p0 = pts[Math.max(0, seg - 1)]!
        const p1 = pts[seg]!
        const p2 = pts[seg + 1]!
        const p3 = pts[Math.min(pts.length - 1, seg + 2)]!
        const t2 = localT * localT
        const t3 = t2 * localT
        result.push({
          x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * localT + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
          y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * localT + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
        })
      }
      return result
    },
  }
}

/* ═══════════════════════════════════════════
 * 1. PARAMETRIC CURVES
 * ═══════════════════════════════════════════ */

/**
 * Lissajous curve: x = sin(a·t + δ), y = sin(b·t)
 * Harmonic ratios create symmetric patterns
 */
export function createLissajous(
  freqA: number,
  freqB: number,
  phase: number = Math.PI / 2,
  scale: number = 0.4,
): ArtCurve {
  const pts: Point[] = []
  const steps = 500
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU
    pts.push({
      x: 0.5 + Math.sin(freqA * t + phase) * scale,
      y: 0.5 + Math.sin(freqB * t) * scale,
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Rose curve: r = cos(k·θ)
 * Petal-shaped, k determines petal count
 */
export function createRose(
  k: number,
  scale: number = 0.4,
): ArtCurve {
  const pts: Point[] = []
  const steps = 360
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * TAU
    const r = Math.cos(k * theta) * scale
    pts.push({
      x: 0.5 + r * Math.cos(theta),
      y: 0.5 + r * Math.sin(theta),
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Logarithmic spiral: r = a·e^(b·θ)
 * Golden spiral when b = ln(PHI)/(π/2)
 */
export function createLogSpiral(
  a: number = 0.01,
  b: number = 0.05,
  maxTheta: number = TAU * 1.5,
): ArtCurve {
  const pts: Point[] = []
  const steps = 500
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * maxTheta
    const r = a * Math.exp(b * theta)
    // Clamp to keep within bounds
    const clampedR = Math.min(r, 0.35)
    pts.push({
      x: 0.5 + clampedR * Math.cos(theta),
      y: 0.5 + clampedR * Math.sin(theta),
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Archimedean spiral: r = a + b·θ
 * Equal spacing between turns
 */
export function createArchimedeanSpiral(
  a: number = 0.02,
  b: number = 0.02,
  maxTheta: number = TAU * 4,
): ArtCurve {
  const pts: Point[] = []
  const steps = 500
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * maxTheta
    const r = a + b * theta
    pts.push({
      x: 0.5 + r * Math.cos(theta),
      y: 0.5 + r * Math.sin(theta),
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Cycloid: x = t - sin(t), y = 1 - cos(t)
 * Path of a point on a rolling circle
 */
export function createCycloid(
  scale: number = 0.15,
  offsetX: number = 0.1,
  offsetY: number = 0.5,
): ArtCurve {
  const pts: Point[] = []
  const steps = 300
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU * 2
    pts.push({
      x: offsetX + (t - Math.sin(t)) * scale,
      y: offsetY - (1 - Math.cos(t)) * scale,
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Cardioid: r = 1 - cos(θ)
 * Heart-shaped curve
 */
export function createCardioid(
  scale: number = 0.25,
): ArtCurve {
  const pts: Point[] = []
  const steps = 500
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * TAU
    const r = (1 - Math.cos(theta)) * scale
    pts.push({
      x: 0.5 + r * Math.cos(theta),
      y: 0.5 + r * Math.sin(theta),
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Astroid: x = cos³(t), y = sin³(t)
 * Four-cusped star shape
 */
export function createAstroid(
  scale: number = 0.35,
): ArtCurve {
  const pts: Point[] = []
  const steps = 500
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU
    pts.push({
      x: 0.5 + Math.pow(Math.cos(t), 3) * scale,
      y: 0.5 + Math.pow(Math.sin(t), 3) * scale,
    })
  }
  return createSmoothCurve(pts)
}

/* ═══════════════════════════════════════════
 * 2. MODULATION FUNCTIONS
 * ═══════════════════════════════════════════ */

/**
 * Amplitude-modulated wave: sin(x)·sin(ε·x)
 * Beat frequency effect
 */
export function createAMWave(
  carrierFreq: number = 5,
  modFreq: number = 0.5,
  amplitude: number = 0.08,
  baseY: number = 0.5,
): ArtCurve {
  const pts: Point[] = []
  const steps = 500
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * TAU
    const envelope = Math.sin(modFreq * x)
    const y = baseY + Math.sin(carrierFreq * x) * envelope * amplitude
    pts.push({ x: i / steps, y })
  }
  return createSmoothCurve(pts)
}

/**
 * Frequency-modulated wave: sin(x + β·sin(ω·x))
 * Complex but ordered patterns
 */
export function createFMWave(
  carrierFreq: number = 3,
  modFreq: number = 1,
  modulationIndex: number = 2,
  amplitude: number = 0.05,
  baseY: number = 0.5,
): ArtCurve {
  const pts: Point[] = []
  const steps = 500
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * TAU
    const phase = carrierFreq * x + modulationIndex * Math.sin(modFreq * x)
    const y = baseY + Math.sin(phase) * amplitude
    pts.push({ x: i / steps, y })
  }
  return createSmoothCurve(pts)
}

/**
 * Moiré pattern: sin(x) + sin(x + ε)
 * Interference pattern
 */
export function createMoire(
  freq1: number = 10,
  freq2: number = 10.5,
  amplitude: number = 0.04,
  baseY: number = 0.5,
): ArtCurve {
  const pts: Point[] = []
  const steps = 500
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * TAU
    const y = baseY + (Math.sin(freq1 * x) + Math.sin(freq2 * x)) * amplitude * 0.5
    pts.push({ x: i / steps, y })
  }
  return createSmoothCurve(pts)
}

/**
 * Fourier series approximation
 * Sum of harmonics: Σ sin(n·x)/n
 */
export function createFourier(
  harmonics: number = 5,
  amplitude: number = 0.08,
  baseY: number = 0.5,
): ArtCurve {
  const pts: Point[] = []
  const steps = 500
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * TAU
    let y = 0
    for (let n = 1; n <= harmonics; n++) {
      y += Math.sin(n * x) / n
    }
    pts.push({ x: i / steps, y: baseY + y * amplitude })
  }
  return createSmoothCurve(pts)
}

/* ═══════════════════════════════════════════
 * 3. NATURAL FORM FUNCTIONS
 * ═══════════════════════════════════════════ */

/**
 * Gaussian curve: e^(-x²)
 * Bell-shaped, smooth transition
 */
export function createGaussian(
  sigma: number = 0.15,
  amplitude: number = 0.3,
  centerX: number = 0.5,
  baseY: number = 0.7,
): ArtCurve {
  const pts: Point[] = []
  const steps = 300
  for (let i = 0; i <= steps; i++) {
    const x = i / steps
    const normalized = (x - centerX) / sigma
    const y = baseY - Math.exp(-normalized * normalized * 0.5) * amplitude
    pts.push({ x, y })
  }
  return createSmoothCurve(pts)
}

/**
 * Sinc function: sin(x)/x
 * Diffraction pattern
 */
export function createSinc(
  scale: number = 0.1,
  amplitude: number = 0.15,
  baseY: number = 0.5,
): ArtCurve {
  const pts: Point[] = []
  const steps = 500
  for (let i = 0; i <= steps; i++) {
    const x = ((i / steps) - 0.5) * 12
    const sinc = x === 0 ? 1 : Math.sin(x) / x
    pts.push({
      x: i / steps,
      y: baseY + sinc * amplitude * scale,
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Catenary: cosh(x)
 * Hanging chain curve
 */
export function createCatenary(
  a: number = 0.3,
  amplitude: number = 0.2,
  baseY: number = 0.3,
): ArtCurve {
  const pts: Point[] = []
  const steps = 300
  for (let i = 0; i <= steps; i++) {
    const x = ((i / steps) - 0.5) * 2
    const y = baseY + (Math.cosh(x * a) - 1) * amplitude
    pts.push({ x: i / steps, y })
  }
  return createSmoothCurve(pts)
}

/* ═══════════════════════════════════════════
 * 4. FRACTAL CURVES
 * ═══════════════════════════════════════════ */

/**
 * Koch curve (snowflake edge)
 * Recursive subdivision
 */
export function createKoch(
  iterations: number = 3,
  startX: number = 0.1,
  startY: number = 0.5,
  length: number = 0.8,
  angle: number = 0,
): ArtCurve {
  function kochPoints(
    x1: number, y1: number,
    x2: number, y2: number,
    iter: number,
  ): Point[] {
    if (iter === 0) return [{ x: x2, y: y2 }]
    
    const dx = x2 - x1
    const dy = y2 - y1
    const x3 = x1 + dx / 3
    const y3 = y1 + dy / 3
    const x4 = x1 + dx * 2 / 3
    const y4 = y1 + dy * 2 / 3
    
    const angle = Math.atan2(dy, dx) - Math.PI / 3
    const dist = Math.sqrt(dx * dx + dy * dy) / 3
    const xPeak = x3 + Math.cos(angle) * dist
    const yPeak = y3 + Math.sin(angle) * dist
    
    return [
      ...kochPoints(x1, y1, x3, y3, iter - 1),
      ...kochPoints(x3, y3, xPeak, yPeak, iter - 1),
      ...kochPoints(xPeak, yPeak, x4, y4, iter - 1),
      ...kochPoints(x4, y4, x2, y2, iter - 1),
    ]
  }
  
  const endX = startX + length * Math.cos(angle)
  const endY = startY + length * Math.sin(angle)
  const pts = [{ x: startX, y: startY }, ...kochPoints(startX, startY, endX, endY, iterations)]
  return createSmoothCurve(pts)
}

/**
 * Dragon curve (paper folding)
 * L-system based
 */
export function createDragon(
  iterations: number = 10,
  startX: number = 0.5,
  startY: number = 0.5,
  stepSize: number = 0.01,
): ArtCurve {
  // Generate dragon curve sequence
  let sequence = [1]
  for (let i = 0; i < iterations; i++) {
    const newSeq = [...sequence, 1, ...sequence.map(x => -x).reverse()]
    sequence = newSeq
  }
  
  const pts: Point[] = [{ x: startX, y: startY }]
  let x = startX
  let y = startY
  let angle = 0
  
  for (const turn of sequence) {
    angle += turn * Math.PI / 2
    x += Math.cos(angle) * stepSize
    y += Math.sin(angle) * stepSize
    pts.push({ x, y })
  }
  
  return createSmoothCurve(pts)
}

/**
 * Hilbert curve (space-filling)
 * Recursive U-shaped pattern
 */
export function createHilbert(
  iterations: number = 4,
  margin: number = 0.1,
  size: number = 0.8,
): ArtCurve {
  function hilbertPoints(
    x: number, y: number,
    size: number,
    iter: number,
  ): Point[] {
    if (iter === 0) return [{ x, y }]
    
    const half = size / 2
    const pts: Point[] = []
    
    // Four quadrants in Hilbert order
    pts.push(...hilbertPoints(x, y, half, iter - 1))
    pts.push(...hilbertPoints(x, y + half, half, iter - 1))
    pts.push(...hilbertPoints(x + half, y + half, half, iter - 1))
    pts.push(...hilbertPoints(x + half, y, half, iter - 1))
    
    return pts
  }
  
  const pts = hilbertPoints(margin, margin, size, iterations)
  return createSmoothCurve(pts)
}

/* ═══════════════════════════════════════════
 * 5. BEZIER CURVES
 * ═══════════════════════════════════════════ */

/**
 * Cubic Bezier curve
 * Four control points
 */
export function createCubicBezier(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
): ArtCurve {
  const pts: Point[] = []
  const steps = 100
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const mt = 1 - t
    const x = mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x
    const y = mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y
    pts.push({ x, y })
  }
  return createSmoothCurve(pts)
}

/**
 * Quadratic Bezier curve
 * Three control points
 */
export function createQuadraticBezier(
  p0: Point,
  p1: Point,
  p2: Point,
): ArtCurve {
  const pts: Point[] = []
  const steps = 100
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const mt = 1 - t
    const x = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x
    const y = mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y
    pts.push({ x, y })
  }
  return createSmoothCurve(pts)
}

/* ═══════════════════════════════════════════
 * 6. MORE FRACTAL CURVES
 * ══════════════════════════════════════════ */

/**
 * Lévy C curve — self-similar fractal
 */
export function createLevyC(
  iterations: number = 10,
  startX: number = 0.5,
  startY: number = 0.5,
  stepSize: number = 0.01,
): ArtCurve {
  let sequence = [1]
  for (let i = 0; i < iterations; i++) {
    const newSeq = [...sequence, 1, ...sequence.map(x => -x).reverse()]
    sequence = newSeq
  }
  
  const pts: Point[] = [{ x: startX, y: startY }]
  let x = startX
  let y = startY
  let angle = Math.PI / 4
  
  for (const turn of sequence) {
    angle += turn * Math.PI / 4
    x += Math.cos(angle) * stepSize
    y += Math.sin(angle) * stepSize
    pts.push({ x, y })
  }
  
  return createSmoothCurve(pts)
}

/**
 * Sierpinski Triangle — recursive triangle fractal
 */
export function createSierpinskiTriangle(
  iterations: number = 6,
  centerX: number = 0.5,
  centerY: number = 0.5,
  size: number = 0.4,
): ArtCurve {
  function sierpinskiPoints(
    x: number, y: number,
    size: number,
    iter: number,
  ): Point[] {
    if (iter === 0) {
      return [
        { x, y: y - size },
        { x: x - size * 0.866, y: y + size * 0.5 },
        { x: x + size * 0.866, y: y + size * 0.5 },
        { x, y: y - size },
      ]
    }
    
    const half = size / 2
    const pts: Point[] = []
    pts.push(...sierpinskiPoints(x, y - half, half, iter - 1))
    pts.push(...sierpinskiPoints(x - half * 0.866, y + half * 0.5, half, iter - 1))
    pts.push(...sierpinskiPoints(x + half * 0.866, y + half * 0.5, half, iter - 1))
    return pts
  }
  
  const pts = sierpinskiPoints(centerX, centerY, size, iterations)
  return createSmoothCurve(pts)
}

/**
 * Fractal Tree — branching structure
 */
export function createFractalTree(
  iterations: number = 8,
  startX: number = 0.5,
  startY: number = 0.9,
  length: number = 0.15,
  angle: number = -Math.PI / 2,
  branchAngle: number = Math.PI / 6,
): ArtCurve {
  function branch(
    x: number, y: number,
    len: number, ang: number,
    iter: number,
  ): Point[] {
    if (iter === 0) return []
    
    const endX = x + Math.cos(ang) * len
    const endY = y + Math.sin(ang) * len
    const pts: Point[] = [{ x, y }, { x: endX, y: endY }]
    
    const newLen = len * 0.7
    pts.push(...branch(endX, endY, newLen, ang - branchAngle, iter - 1))
    pts.push(...branch(endX, endY, newLen, ang + branchAngle, iter - 1))
    
    return pts
  }
  
  const pts = branch(startX, startY, length, angle, iterations)
  return createSmoothCurve(pts)
}

/**
 * Peano Curve — space-filling curve
 */
export function createPeano(
  iterations: number = 3,
  margin: number = 0.1,
  size: number = 0.8,
): ArtCurve {
  function peanoPoints(
    x: number, y: number,
    size: number,
    iter: number,
  ): Point[] {
    if (iter === 0) return [{ x, y }]
    
    const third = size / 3
    const pts: Point[] = []
    
    // 9 sub-squares in Peano order
    pts.push(...peanoPoints(x, y, third, iter - 1))
    pts.push(...peanoPoints(x, y + third, third, iter - 1))
    pts.push(...peanoPoints(x, y + 2 * third, third, iter - 1))
    pts.push(...peanoPoints(x + third, y + 2 * third, third, iter - 1))
    pts.push(...peanoPoints(x + third, y + third, third, iter - 1))
    pts.push(...peanoPoints(x + third, y, third, iter - 1))
    pts.push(...peanoPoints(x + 2 * third, y, third, iter - 1))
    pts.push(...peanoPoints(x + 2 * third, y + third, third, iter - 1))
    pts.push(...peanoPoints(x + 2 * third, y + 2 * third, third, iter - 1))
    
    return pts
  }
  
  const pts = peanoPoints(margin, margin, size, iterations)
  return createSmoothCurve(pts)
}

/* ═══════════════════════════════════════════
 * 7. TOPOLOGICAL CURVES
 * ═══════════════════════════════════════════ */

/**
 * Möbius Strip — edge curve only (2D projection)
 */
export function createMobiusStrip(
  steps: number = 200,
  centerX: number = 0.5,
  centerY: number = 0.5,
  radius: number = 0.3,
  width: number = 0.1,
): ArtCurve {
  const pts: Point[] = []
  // Only draw the edge curve
  for (let i = 0; i <= steps; i++) {
    const u = (i / steps) * TAU
    const x = centerX + radius * Math.cos(u) + width * Math.cos(u / 2) * Math.cos(u)
    const y = centerY + radius * Math.sin(u) + width * Math.cos(u / 2) * Math.sin(u)
    pts.push({ x, y })
  }
  return createSmoothCurve(pts)
}

/**
 * Torus — outer edge curve (2D projection)
 */
export function createTorus(
  steps: number = 200,
  centerX: number = 0.5,
  centerY: number = 0.5,
  majorRadius: number = 0.25,
  minorRadius: number = 0.1,
): ArtCurve {
  const pts: Point[] = []
  // Draw the outer silhouette
  for (let i = 0; i <= steps; i++) {
    const u = (i / steps) * TAU
    const x = centerX + (majorRadius + minorRadius) * Math.cos(u)
    const y = centerY + (majorRadius + minorRadius) * Math.sin(u)
    pts.push({ x, y })
  }
  return createSmoothCurve(pts)
}

/**
 * Trefoil Knot — simplest non-trivial knot
 */
export function createTrefoilKnot(
  steps: number = 200,
  centerX: number = 0.5,
  centerY: number = 0.5,
  scale: number = 0.3,
): ArtCurve {
  const pts: Point[] = []
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU
    const x = Math.sin(t) + 2 * Math.sin(2 * t)
    const y = Math.cos(t) - 2 * Math.cos(2 * t)
    pts.push({
      x: centerX + x * scale * 0.3,
      y: centerY + y * scale * 0.3,
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Figure-8 Knot — simplest alternating knot
 */
export function createFigure8Knot(
  steps: number = 200,
  centerX: number = 0.5,
  centerY: number = 0.5,
  scale: number = 0.3,
): ArtCurve {
  const pts: Point[] = []
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU
    const x = (2 + Math.cos(2 * t)) * Math.cos(3 * t)
    const y = (2 + Math.cos(2 * t)) * Math.sin(3 * t)
    pts.push({
      x: centerX + x * scale * 0.2,
      y: centerY + y * scale * 0.2,
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Borromean Rings — three separate rings
 */
export function createBorromeanRings(
  steps: number = 100,
  centerX: number = 0.5,
  centerY: number = 0.5,
  radius: number = 0.15,
  offset: number = 0.12,
): ArtCurve[] {
  // Return three separate curves
  const curves: ArtCurve[] = []
  const centers = [
    { x: centerX - offset, y: centerY + offset * 0.3 },
    { x: centerX + offset, y: centerY + offset * 0.3 },
    { x: centerX, y: centerY - offset * 0.6 },
  ]
  
  for (const center of centers) {
    const pts: Point[] = []
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * TAU
      pts.push({
        x: center.x + radius * Math.cos(t),
        y: center.y + radius * Math.sin(t),
      })
    }
    curves.push(createSmoothCurve(pts))
  }
  return curves
}

/* ═══════════════════════════════════════════
 * 8. CLASSICAL CURVES
 * ═══════════════════════════════════════════ */

/**
 * Superellipse — between ellipse and rectangle
 * |x/a|^n + |y/b|^n = 1
 */
export function createSuperellipse(
  n: number = 4,
  a: number = 0.35,
  b: number = 0.35,
  centerX: number = 0.5,
  centerY: number = 0.5,
): ArtCurve {
  const pts: Point[] = []
  const steps = 500
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU
    const cosT = Math.cos(t)
    const sinT = Math.sin(t)
    const sign = (val: number) => val >= 0 ? 1 : -1
    const x = sign(cosT) * Math.pow(Math.abs(cosT), 2 / n) * a
    const y = sign(sinT) * Math.pow(Math.abs(sinT), 2 / n) * b
    pts.push({ x: centerX + x, y: centerY + y })
  }
  return createSmoothCurve(pts)
}

/**
 * Lemniscate — figure-eight curve (Bernoulli)
 */
export function createLemniscate(
  scale: number = 0.35,
  centerX: number = 0.5,
  centerY: number = 0.5,
): ArtCurve {
  const pts: Point[] = []
  const steps = 500
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU
    const cosT = Math.cos(t)
    const sinT = Math.sin(t)
    const denom = 1 + sinT * sinT
    const x = scale * cosT / denom
    const y = scale * sinT * cosT / denom
    pts.push({ x: centerX + x, y: centerY + y })
  }
  return createSmoothCurve(pts)
}

/**
 * Folium of Descartes — x³ + y³ = 3axy
 * Using polar coordinates for better visualization
 */
export function createFoliumOfDescartes(
  a: number = 0.2,
  centerX: number = 0.5,
  centerY: number = 0.5,
): ArtCurve {
  const pts: Point[] = []
  const steps = 500
  // Use polar parameterization for the loop
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI - Math.PI / 4 // -π/4 to 3π/4
    const cosT = Math.cos(theta)
    const sinT = Math.sin(theta)
    const denom = cosT * cosT * cosT + sinT * sinT * sinT
    if (Math.abs(denom) < 0.1) continue
    const r = 3 * a * cosT * sinT / denom
    // Clamp radius
    const clampedR = Math.min(Math.abs(r), 0.35) * Math.sign(r)
    pts.push({
      x: centerX + clampedR * cosT,
      y: centerY - clampedR * sinT,
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Witch of Agnesi — bell-shaped curve
 * y = 8a³ / (x² + 4a²)
 */
export function createWitchOfAgnesi(
  a: number = 0.25,
  centerX: number = 0.5,
  centerY: number = 0.5,
  scale: number = 1.2,
): ArtCurve {
  const pts: Point[] = []
  const steps = 500
  for (let i = 0; i <= steps; i++) {
    const x = ((i / steps) - 0.5) * 1.5
    const y = 8 * a * a * a / (x * x + 4 * a * a)
    pts.push({
      x: centerX + x * scale * 0.4,
      y: centerY - y * scale * 0.3,
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Fermat's Spiral — r² = a²·θ
 */
export function createFermatSpiral(
  a: number = 0.08,
  maxTheta: number = TAU * 3,
  centerX: number = 0.5,
  centerY: number = 0.5,
): ArtCurve {
  const pts: Point[] = []
  const steps = 500
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * maxTheta
    const r = a * Math.sqrt(theta)
    // Clamp to keep within bounds
    const clampedR = Math.min(r, 0.45)
    pts.push({
      x: centerX + clampedR * Math.cos(theta),
      y: centerY + clampedR * Math.sin(theta),
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Hyperbolic Spiral — r = a/θ
 */
export function createHyperbolicSpiral(
  a: number = 0.3,
  minTheta: number = 0.8,
  maxTheta: number = TAU * 2,
  centerX: number = 0.5,
  centerY: number = 0.5,
): ArtCurve {
  const pts: Point[] = []
  const steps = 500
  for (let i = 0; i <= steps; i++) {
    const theta = minTheta + (i / steps) * (maxTheta - minTheta)
    const r = a / theta
    // Clamp to keep within bounds
    const clampedR = Math.min(r, 0.45)
    pts.push({
      x: centerX + clampedR * Math.cos(theta),
      y: centerY + clampedR * Math.sin(theta),
    })
  }
  return createSmoothCurve(pts)
}

/* ══════════════════════════════════════════
 * 9. CYCLOID VARIANTS
 * ═══════════════════════════════════════════ */

/**
 * Epicycloid — circle rolling outside another circle
 */
export function createEpicycloid(
  R: number = 0.2,
  r: number = 0.05,
  steps: number = 500,
  centerX: number = 0.5,
  centerY: number = 0.5,
): ArtCurve {
  const pts: Point[] = []
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU
    const x = (R + r) * Math.cos(t) - r * Math.cos((R + r) / r * t)
    const y = (R + r) * Math.sin(t) - r * Math.sin((R + r) / r * t)
    pts.push({ x: centerX + x, y: centerY + y })
  }
  return createSmoothCurve(pts)
}

/**
 * Hypocycloid — circle rolling inside another circle
 */
export function createHypocycloid(
  R: number = 0.3,
  r: number = 0.1,
  steps: number = 500,
  centerX: number = 0.5,
  centerY: number = 0.5,
): ArtCurve {
  const pts: Point[] = []
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU
    const x = (R - r) * Math.cos(t) + r * Math.cos((R - r) / r * t)
    const y = (R - r) * Math.sin(t) - r * Math.sin((R - r) / r * t)
    pts.push({ x: centerX + x, y: centerY + y })
  }
  return createSmoothCurve(pts)
}

/**
 * Involute of Circle — unwinding string
 */
export function createInvoluteOfCircle(
  a: number = 0.05,
  maxTheta: number = TAU * 2,
  centerX: number = 0.5,
  centerY: number = 0.5,
): ArtCurve {
  const pts: Point[] = []
  const steps = 500
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * maxTheta
    const x = a * (Math.cos(theta) + theta * Math.sin(theta))
    const y = a * (Math.sin(theta) - theta * Math.cos(theta))
    pts.push({ x: centerX + x, y: centerY + y })
  }
  return createSmoothCurve(pts)
}

/* ═══════════════════════════════════════════
 * 10. SPECIAL CURVES
 * ═══════════════════════════════════════════ */

/**
 * Conchoid of Nicomedes — shell-shaped curve
 */
export function createConchoid(
  a: number = 0.2,
  b: number = 0.15,
  steps: number = 500,
  centerX: number = 0.5,
  centerY: number = 0.5,
): ArtCurve {
  const pts: Point[] = []
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU
    if (Math.abs(Math.cos(t)) < 0.1) continue
    const r = a + b / Math.cos(t)
    const x = r * Math.cos(t)
    const y = r * Math.sin(t)
    pts.push({ x: centerX + x, y: centerY + y })
  }
  return createSmoothCurve(pts)
}

/**
 * Cissoid of Diocles — ivy-shaped curve
 */
export function createCissoid(
  a: number = 0.3,
  steps: number = 500,
  centerX: number = 0.5,
  centerY: number = 0.5,
): ArtCurve {
  const pts: Point[] = []
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 0.9 - Math.PI * 0.45
    if (Math.abs(Math.cos(t)) < 0.1) continue
    const x = 2 * a * Math.sin(t) * Math.sin(t) / Math.cos(t)
    const y = 2 * a * Math.sin(t) * Math.sin(t) * Math.tan(t)
    pts.push({ x: centerX + x * 0.3, y: centerY + y * 0.3 })
  }
  return createSmoothCurve(pts)
}

/**
 * Trisectrix of Maclaurin — angle trisection curve
 */
export function createTrisectrix(
  a: number = 0.3,
  steps: number = 500,
  centerX: number = 0.5,
  centerY: number = 0.5,
): ArtCurve {
  const pts: Point[] = []
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU
    if (Math.abs(Math.cos(t)) < 0.1) continue
    const r = a * (4 * Math.cos(t) - 1 / Math.cos(t))
    const x = r * Math.cos(t)
    const y = r * Math.sin(t)
    pts.push({ x: centerX + x * 0.2, y: centerY + y * 0.2 })
  }
  return createSmoothCurve(pts)
}

/**
 * Cassini Oval — curves where product of distances to two foci is constant
 * |PA| * |PB| = a^2
 * Creates beautiful figure-8 or single-loop shapes
 */
export function createCassiniOval(
  a: number = 0.3,
  b: number = 0.25,
  centerX: number = 0.5,
  centerY: number = 0.5,
  scale: number = 1.0,
): ArtCurve {
  const pts: Point[] = []
  const steps = 500
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2
    const cos2t = Math.cos(2 * theta)
    const sin2t = Math.sin(2 * theta)
    
    // Solve for r: r^4 - 2b^2*r^2*cos(2*theta) + b^4 - a^4 = 0
    const discriminant = b * b * b * b * cos2t * cos2t + a * a * a * a - b * b * b * b
    if (discriminant < 0) continue
    
    const r2 = b * b * cos2t + Math.sqrt(discriminant)
    if (r2 < 0) continue
    const r = Math.sqrt(r2)
    
    const x = r * Math.cos(theta)
    const y = r * Math.sin(theta)
    pts.push({
      x: centerX + x * scale,
      y: centerY + y * scale,
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Butterfly Curve — beautiful butterfly-shaped curve
 * r = e^(sin(theta)) - 2*cos(4*theta) + sin^5((2*theta - pi) / 24)
 */
export function createButterflyCurve(
  centerX: number = 0.5,
  centerY: number = 0.5,
  scale: number = 0.15,
): ArtCurve {
  const pts: Point[] = []
  const steps = 500
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 12 // 6 full rotations for complete curve
    const sinT = Math.sin(theta)
    const cos4t = Math.cos(4 * theta)
    const sinPow5 = Math.pow(Math.sin((2 * theta - Math.PI) / 24), 5)
    
    const r = Math.exp(sinT) - 2 * cos4t + sinPow5
    const x = r * Math.cos(theta)
    const y = r * Math.sin(theta)
    pts.push({
      x: centerX + x * scale,
      y: centerY - y * scale,
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Torus Knot — curve that winds p times around and q times through the hole
 * Beautiful complex knot patterns
 */
export function createTorusKnot(
  p: number = 2,
  q: number = 3,
  R: number = 0.3,
  r: number = 0.1,
  centerX: number = 0.5,
  centerY: number = 0.5,
  scale: number = 1.0,
): ArtCurve {
  const pts: Point[] = []
  const steps = 500
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2 * p // p full rotations
    
    // Torus knot parametric equations
    const phi = (q / p) * t
    const cosPhi = Math.cos(phi)
    const sinPhi = Math.sin(phi)
    const cosT = Math.cos(t)
    const sinT = Math.sin(t)
    
    // Project 3D torus knot to 2D
    const x = (R + r * cosPhi) * cosT
    const y = (R + r * cosPhi) * sinT
    
    pts.push({
      x: centerX + x * scale,
      y: centerY + y * scale,
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Parabolic Spiral — spiral with parabolic growth
 * r = a * sqrt(theta)
 */
export function createParabolicSpiral(
  a: number = 0.15,
  centerX: number = 0.5,
  centerY: number = 0.5,
  scale: number = 1.0,
): ArtCurve {
  const pts: Point[] = []
  const steps = 1200
  const maxTheta = Math.PI * 8 // 4 full rotations
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * maxTheta
    const r = a * Math.sqrt(theta) * scale
    const x = r * Math.cos(theta)
    const y = r * Math.sin(theta)
    pts.push({
      x: centerX + x,
      y: centerY + y,
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Cartesian Oval — generalization of ellipse and Cassini oval
 * Distance relationship: |PA|² + |PB|² = constant
 */
export function createCartesianOval(
  a: number = 0.3,
  b: number = 0.2,
  centerX: number = 0.5,
  centerY: number = 0.5,
  scale: number = 1.0,
): ArtCurve {
  const pts: Point[] = []
  const steps = 1000
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2
    
    // Parametric approximation for Cartesian oval
    const cosT = Math.cos(theta)
    const sinT = Math.sin(theta)
    const r = a + b * Math.cos(2 * theta)
    
    const x = r * cosT
    const y = r * sinT
    pts.push({
      x: centerX + x * scale,
      y: centerY + y * scale,
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Spring Curve — damped harmonic oscillation
 * Shows spring motion with friction
 */
export function createSpringCurve(
  damping: number = 0.1,
  frequency: number = 3,
  centerX: number = 0.5,
  centerY: number = 0.5,
  scale: number = 0.3,
): ArtCurve {
  const pts: Point[] = []
  const steps = 1200
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 6 // 3 full cycles
    const decay = Math.exp(-damping * t)
    const x = decay * Math.cos(frequency * t)
    const y = decay * Math.sin(frequency * t)
    pts.push({
      x: centerX + x * scale,
      y: centerY + y * scale,
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Lissajous with Decay — damped Lissajous figure
 * Creates beautiful fading patterns
 */
export function createDecayLissajous(
  freqX: number = 3,
  freqY: number = 4,
  damping: number = 0.08,
  centerX: number = 0.5,
  centerY: number = 0.5,
  scale: number = 0.35,
): ArtCurve {
  const pts: Point[] = []
  const steps = 1200
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 8
    const decay = Math.exp(-damping * t)
    const x = decay * Math.sin(freqX * t)
    const y = decay * Math.sin(freqY * t)
    pts.push({
      x: centerX + x * scale,
      y: centerY + y * scale,
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Rhodonea 3D — 3D rose curve projected to 2D
 * Beautiful petal patterns with depth
 */
export function createRhodonea3D(
  k: number = 5,
  centerX: number = 0.5,
  centerY: number = 0.5,
  scale: number = 0.35,
): ArtCurve {
  const pts: Point[] = []
  const steps = 1200
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2 * 3 // 3 full rotations
    const r = Math.cos(k * theta)
    
    // 3D projection with rotation
    const phi = theta * 0.3
    const x = r * Math.cos(theta)
    const y = r * Math.sin(theta) * Math.cos(phi)
    
    pts.push({
      x: centerX + x * scale,
      y: centerY + y * scale,
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Harmonograph — pendulum-based artistic curve
 * Creates beautiful Lissajous-like patterns with decay
 */
export function createHarmonograph(
  freq1: number = 2,
  freq2: number = 3,
  phase1: number = 0,
  phase2: number = Math.PI / 4,
  damping: number = 0.05,
  centerX: number = 0.5,
  centerY: number = 0.5,
  scale: number = 0.35,
): ArtCurve {
  const pts: Point[] = []
  const steps = 1000
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 12
    const decay = Math.exp(-damping * t)
    const x = decay * (Math.sin(freq1 * t + phase1) + Math.sin(freq2 * t + phase2))
    const y = decay * (Math.cos(freq1 * t) + Math.cos(freq2 * t))
    pts.push({
      x: centerX + x * scale,
      y: centerY + y * scale,
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Spirograph — classic toy curve
 * Epitrochoid with inner rolling circle
 */
export function createSpirograph(
  R: number = 0.25,
  r: number = 0.1,
  d: number = 0.15,
  centerX: number = 0.5,
  centerY: number = 0.5,
  scale: number = 1.0,
): ArtCurve {
  const pts: Point[] = []
  const steps = 1000
  const rotations = 10
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2 * rotations
    const cosT = Math.cos(theta)
    const sinT = Math.sin(theta)
    const ratio = (R - r) / r
    const x = (R - r) * cosT + d * Math.cos(ratio * theta)
    const y = (R - r) * sinT - d * Math.sin(ratio * theta)
    pts.push({
      x: centerX + x * scale,
      y: centerY + y * scale,
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Heart Curve — beautiful heart shape
 * Parametric heart equation
 */
export function createHeartCurve(
  size: number = 0.25,
  centerX: number = 0.5,
  centerY: number = 0.5,
  scale: number = 1.0,
): ArtCurve {
  const pts: Point[] = []
  const steps = 1200
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const x = 16 * Math.pow(Math.sin(t), 3)
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
    pts.push({
      x: centerX + x * size * scale * 0.05,
      y: centerY - y * size * scale * 0.05,
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Spiral of Theodorus — square root spiral
 * Built from right triangles
 */
export function createTheodorusSpiral(
  turns: number = 12,
  centerX: number = 0.5,
  centerY: number = 0.5,
  scale: number = 0.08,
): ArtCurve {
  const pts: Point[] = []
  let r = 1
  let theta = 0
  const steps = turns * 120
  
  for (let i = 0; i <= steps; i++) {
    const x = r * Math.cos(theta)
    const y = r * Math.sin(theta)
    pts.push({
      x: centerX + x * scale,
      y: centerY + y * scale,
    })
    
    // Increment for next point
    r = Math.sqrt(1 + r * r)
    theta += Math.atan(1 / r)
  }
  return createSmoothCurve(pts)
}

/**
 * Epitrochoid — generalization of epicycloid
 * Curve traced by point attached to rolling circle
 */
export function createEpitrochoid(
  R: number = 0.2,
  r: number = 0.08,
  d: number = 0.12,
  centerX: number = 0.5,
  centerY: number = 0.5,
  scale: number = 1.0,
): ArtCurve {
  const pts: Point[] = []
  const steps = 1000
  const rotations = 8
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2 * rotations
    const cosT = Math.cos(theta)
    const sinT = Math.sin(theta)
    const ratio = (R + r) / r
    const x = (R + r) * cosT - d * Math.cos(ratio * theta)
    const y = (R + r) * sinT - d * Math.sin(ratio * theta)
    pts.push({
      x: centerX + x * scale,
      y: centerY + y * scale,
    })
  }
  return createSmoothCurve(pts)
}

/**
 * Hypotrochoid — generalization of hypocycloid
 * Curve traced by point attached to circle rolling inside
 */
export function createHypotrochoid(
  R: number = 0.25,
  r: number = 0.1,
  d: number = 0.15,
  centerX: number = 0.5,
  centerY: number = 0.5,
  scale: number = 1.0,
): ArtCurve {
  const pts: Point[] = []
  const steps = 1000
  const rotations = 8
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2 * rotations
    const cosT = Math.cos(theta)
    const sinT = Math.sin(theta)
    const ratio = (R - r) / r
    const x = (R - r) * cosT + d * Math.cos(ratio * theta)
    const y = (R - r) * sinT - d * Math.sin(ratio * theta)
    pts.push({
      x: centerX + x * scale,
      y: centerY + y * scale,
    })
  }
  return createSmoothCurve(pts)
}
