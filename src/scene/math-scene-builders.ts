/**
 * Mathematical curve scene builders.
 *
 * Scene construction for parametric curves, special functions, and fractals.
 */

import type { SceneLayer } from '../core/types'
import type { Point } from '../geometry/types'
import type { ArtCurve } from '../geometry/math-curves'
import {
  createLissajous,
  createRose,
  createLogSpiral,
  createArchimedeanSpiral,
  createCycloid,
  createCardioid,
  createAstroid,
  createAMWave,
  createFMWave,
  createMoire,
  createFourier,
  createGaussian,
  createSinc,
  createCatenary,
  createKoch,
  createDragon,
  createHilbert,
  createLevyC,
  createSierpinskiTriangle,
  createFractalTree,
  createPeano,
  createMobiusStrip,
  createTorus,
  createTrefoilKnot,
  createFigure8Knot,
  createBorromeanRings,
  createSuperellipse,
  createLemniscate,
  createFoliumOfDescartes,
  createWitchOfAgnesi,
  createFermatSpiral,
  createHyperbolicSpiral,
  createEpicycloid,
  createHypocycloid,
  createInvoluteOfCircle,
  createConchoid,
  createCissoid,
  createTrisectrix,
  createCassiniOval,
  createButterflyCurve,
  createTorusKnot,
  createParabolicSpiral,
  createCartesianOval,
  createSpringCurve,
  createDecayLissajous,
  createRhodonea3D,
  createHarmonograph,
  createSpirograph,
  createHeartCurve,
  createTheodorusSpiral,
  createEpitrochoid,
  createHypotrochoid,
} from '../geometry/math-curves'

const TAU = Math.PI * 2

/* ─── Helper: create a curve layer ─── */

function makeCurveLayer(
  id: string,
  curve: ArtCurve,
  color: string,
  opacity: number,
  lineWidth: number,
  zIndex: number,
  blendMode: string = 'normal',
): SceneLayer {
  return {
    id,
    geometries: [],
    drawCommands: [{
      type: 'curve',
      path: curve,
      style: {
        color,
        opacity,
        blendMode,
        lineWidth,
        glow: 8,
        glowColor: color,
        lineCap: 'round',
        lineJoin: 'round',
      },
    }],
    material: {},
    zIndex,
    opacity,
  }
}

function makeBandLayer(
  id: string,
  curve: ArtCurve,
  color: string,
  opacity: number,
  bandWidth: number,
  zIndex: number,
  blendMode: string = 'screen',
): SceneLayer {
  return {
    id,
    geometries: [],
    drawCommands: [{
      type: 'filled-curve',
      path: curve,
      style: {
        color,
        opacity: opacity * 0.4,
        blendMode,
        lineWidth: bandWidth,
        glow: 20,
        glowColor: color,
        gradient: 'linear',
      },
    }],
    material: {},
    zIndex,
    opacity,
  }
}

/* ═══════════════════════════════════════════
 * PARAMETRIC CURVES
 * ═══════════════════════════════════════════ */

/** Lissajous — harmonic ratios create symmetric patterns */
export function buildLissajousScene(layers: SceneLayer[], basePhase: number): void {
  const ratios = [[1, 2], [2, 3], [3, 4], [3, 5], [5, 7]]
  for (let i = 0; i < ratios.length; i++) {
    const pair = ratios[i]!
    const a = pair[0]!
    const b = pair[1]!
    const curve = createLissajous(a, b, basePhase + i * 0.5, 0.35 - i * 0.03)
    const opacity = 0.6 - i * 0.1
    const color = `hsl(${200 + i * 20}, 70%, 55%)`
    layers.push(makeCurveLayer(`lissajous-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/** Rose — petal-shaped curves */
export function buildRoseScene(layers: SceneLayer[], basePhase: number): void {
  const kValues = [3, 4, 5, 6, 7, 8]
  for (let i = 0; i < kValues.length; i++) {
    const k = kValues[i]!
    const curve = createRose(k, 0.35 - i * 0.02)
    const opacity = 0.5 - i * 0.07
    const color = `hsl(${320 + i * 15}, 65%, 55%)`
    layers.push(makeCurveLayer(`rose-${i}`, curve, color, opacity, 1.2, i, 'screen'))
  }
}

/** Log Spiral — golden spiral growth */
export function buildLogSpiralScene(layers: SceneLayer[], basePhase: number): void {
  const count = 6
  for (let i = 0; i < count; i++) {
    const b = 0.12 + i * 0.02
    const curve = createLogSpiral(0.01, b, TAU * 3)
    const opacity = 0.6 - i * 0.08
    const color = `hsl(${40 + i * 10}, 70%, 50%)`
    layers.push(makeCurveLayer(`logspiral-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/** Archimedean Spiral — equal spacing */
export function buildArchimedeanSpiralScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  for (let i = 0; i < count; i++) {
    const b = 0.015 + i * 0.005
    const curve = createArchimedeanSpiral(0.02, b, TAU * 4)
    const opacity = 0.5 - i * 0.08
    const color = `hsl(${160 + i * 15}, 60%, 50%)`
    layers.push(makeCurveLayer(`archspiral-${i}`, curve, color, opacity, 1.2, i, 'screen'))
  }
}

/** Cycloid — rolling circle path */
export function buildCycloidScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  for (let i = 0; i < count; i++) {
    const offsetX = 0.1 + i * 0.15
    const curve = createCycloid(0.12, offsetX, 0.5)
    const opacity = 0.6 - i * 0.1
    const color = `hsl(${280 + i * 10}, 65%, 55%)`
    layers.push(makeCurveLayer(`cycloid-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/** Cardioid — heart-shaped curve */
export function buildCardioidScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  for (let i = 0; i < count; i++) {
    const scale = 0.2 + i * 0.03
    const curve = createCardioid(scale)
    const opacity = 0.5 - i * 0.08
    const color = `hsl(${350 + i * 5}, 70%, 55%)`
    layers.push(makeCurveLayer(`cardioid-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/** Astroid — four-cusped star */
export function buildAstroidScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  for (let i = 0; i < count; i++) {
    const scale = 0.3 + i * 0.03
    const curve = createAstroid(scale)
    const opacity = 0.5 - i * 0.08
    const color = `hsl(${50 + i * 15}, 70%, 55%)`
    layers.push(makeCurveLayer(`astroid-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/* ══════════════════════════════════════════
 * MODULATION FUNCTIONS
 * ═══════════════════════════════════════════ */

/** AM Wave — amplitude modulation, beat frequency */
export function buildAMWaveScene(layers: SceneLayer[], basePhase: number): void {
  const count = 8
  const modFreqs = [0.3, 0.5, 0.7, 1.0, 1.5, 2.0, 2.5, 3.0]
  for (let i = 0; i < count; i++) {
    const baseY = 0.1 + (i / (count - 1)) * 0.8
    const curve = createAMWave(5, modFreqs[i]!, 0.06, baseY)
    const opacity = 0.4 + (1 - Math.abs(i / (count - 1) - 0.5) * 2) * 0.4
    const color = `hsl(${180 + i * 10}, 60%, 55%)`
    layers.push(makeCurveLayer(`amwave-${i}`, curve, color, opacity, 1.2, i, 'screen'))
  }
}

/** FM Wave — frequency modulation */
export function buildFMWaveScene(layers: SceneLayer[], basePhase: number): void {
  const count = 8
  const modIndices = [1, 2, 3, 4, 5, 6, 7, 8]
  for (let i = 0; i < count; i++) {
    const baseY = 0.1 + (i / (count - 1)) * 0.8
    const curve = createFMWave(3, 1, modIndices[i]!, 0.04, baseY)
    const opacity = 0.4 + (1 - Math.abs(i / (count - 1) - 0.5) * 2) * 0.4
    const color = `hsl(${260 + i * 8}, 65%, 55%)`
    layers.push(makeCurveLayer(`fmwave-${i}`, curve, color, opacity, 1.2, i, 'screen'))
  }
}

/** Moiré — interference pattern */
export function buildMoireScene(layers: SceneLayer[], basePhase: number): void {
  const count = 10
  const freqDiffs = [0.1, 0.2, 0.3, 0.5, 0.7, 1.0, 1.5, 2.0, 2.5, 3.0]
  for (let i = 0; i < count; i++) {
    const baseY = 0.08 + (i / (count - 1)) * 0.84
    const curve = createMoire(10, 10 + freqDiffs[i]!, 0.03, baseY)
    const opacity = 0.3 + (1 - Math.abs(i / (count - 1) - 0.5) * 2) * 0.5
    const color = `hsl(${200 + i * 5}, 55%, 55%)`
    layers.push(makeCurveLayer(`moire-${i}`, curve, color, opacity, 1.0, i, 'screen'))
  }
}

/** Fourier — harmonic series approximation */
export function buildFourierScene(layers: SceneLayer[], basePhase: number): void {
  const count = 6
  const harmonics = [3, 5, 7, 9, 11, 13]
  for (let i = 0; i < count; i++) {
    const baseY = 0.15 + (i / (count - 1)) * 0.7
    const curve = createFourier(harmonics[i]!, 0.06, baseY)
    const opacity = 0.5 - i * 0.07
    const color = `hsl(${30 + i * 20}, 70%, 55%)`
    layers.push(makeCurveLayer(`fourier-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/* ═══════════════════════════════════════════
 * NATURAL FORM FUNCTIONS
 * ═══════════════════════════════════════════ */

/** Gaussian — bell curve */
export function buildGaussianScene(layers: SceneLayer[], basePhase: number): void {
  const count = 7
  const sigmas = [0.08, 0.12, 0.16, 0.20, 0.25, 0.30, 0.35]
  for (let i = 0; i < count; i++) {
    const centerX = 0.2 + (i / (count - 1)) * 0.6
    const curve = createGaussian(sigmas[i]!, 0.25, centerX, 0.7)
    const opacity = 0.5 - i * 0.06
    const color = `hsl(${120 + i * 15}, 55%, 50%)`
    layers.push(makeCurveLayer(`gaussian-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/** Sinc — diffraction pattern */
export function buildSincScene(layers: SceneLayer[], basePhase: number): void {
  const count = 6
  const scales = [0.08, 0.12, 0.16, 0.20, 0.25, 0.30]
  for (let i = 0; i < count; i++) {
    const baseY = 0.15 + (i / (count - 1)) * 0.7
    const curve = createSinc(scales[i]!, 0.12, baseY)
    const opacity = 0.5 - i * 0.07
    const color = `hsl(${220 + i * 10}, 60%, 55%)`
    layers.push(makeCurveLayer(`sinc-${i}`, curve, color, opacity, 1.2, i, 'screen'))
  }
}

/** Catenary — hanging chain */
export function buildCatenaryScene(layers: SceneLayer[], basePhase: number): void {
  const count = 6
  const aValues = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7]
  for (let i = 0; i < count; i++) {
    const baseY = 0.2 + (i / (count - 1)) * 0.5
    const curve = createCatenary(aValues[i]!, 0.15, baseY)
    const opacity = 0.5 - i * 0.07
    const color = `hsl(${30 + i * 15}, 60%, 50%)`
    layers.push(makeCurveLayer(`catenary-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/* ═══════════════════════════════════════════
 * FRACTAL CURVES
 * ═══════════════════════════════════════════ */

/** Koch — snowflake edge */
export function buildKochScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  const iterations = [2, 3, 3, 4, 4]
  for (let i = 0; i < count; i++) {
    const startY = 0.2 + (i / (count - 1)) * 0.6
    const curve = createKoch(iterations[i]!, 0.1, startY, 0.8, 0)
    const opacity = 0.6 - i * 0.1
    const color = `hsl(${190 + i * 10}, 65%, 55%)`
    layers.push(makeCurveLayer(`koch-${i}`, curve, color, opacity, 1.2, i, 'screen'))
  }
}

/** Dragon — paper folding curve */
export function buildDragonScene(layers: SceneLayer[], basePhase: number): void {
  const count = 4
  const iterations = [8, 9, 10, 11]
  for (let i = 0; i < count; i++) {
    const curve = createDragon(iterations[i]!, 0.5, 0.5, 0.008)
    const opacity = 0.5 - i * 0.1
    const color = `hsl(${270 + i * 15}, 65%, 55%)`
    layers.push(makeCurveLayer(`dragon-${i}`, curve, color, opacity, 1.0, i, 'screen'))
  }
}

/** Hilbert — space-filling curve */
export function buildHilbertScene(layers: SceneLayer[], basePhase: number): void {
  const count = 4
  const iterations = [3, 4, 4, 5]
  for (let i = 0; i < count; i++) {
    const margin = 0.15 + i * 0.02
    const size = 0.7 - i * 0.05
    const curve = createHilbert(iterations[i]!, margin, size)
    const opacity = 0.5 - i * 0.1
    const color = `hsl(${100 + i * 20}, 60%, 50%)`
    layers.push(makeCurveLayer(`hilbert-${i}`, curve, color, opacity, 1.0, i, 'screen'))
  }
}

/* ══════════════════════════════════════════
 * MORE FRACTAL CURVES
 * ═══════════════════════════════════════════ */

/** Lévy C — self-similar fractal */
export function buildLevyCScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  const iterations = [8, 9, 10, 10, 11]
  for (let i = 0; i < count; i++) {
    const curve = createLevyC(iterations[i]!, 0.5, 0.5, 0.008)
    const opacity = 0.5 - i * 0.08
    const color = `hsl(${200 + i * 15}, 65%, 55%)`
    layers.push(makeCurveLayer(`levyc-${i}`, curve, color, opacity, 1.0, i, 'screen'))
  }
}

/** Sierpinski Triangle — recursive triangle */
export function buildSierpinskiTriangleScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  const iterations = [4, 5, 5, 6, 6]
  for (let i = 0; i < count; i++) {
    const size = 0.35 - i * 0.03
    const curve = createSierpinskiTriangle(iterations[i]!, 0.5, 0.5, size)
    const opacity = 0.6 - i * 0.1
    const color = `hsl(${120 + i * 20}, 60%, 50%)`
    layers.push(makeCurveLayer(`sierpinski-${i}`, curve, color, opacity, 1.0, i, 'screen'))
  }
}

/** Fractal Tree — branching structure */
export function buildFractalTreeScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  const iterations = [6, 7, 7, 8, 8]
  for (let i = 0; i < count; i++) {
    const curve = createFractalTree(iterations[i]!, 0.5, 0.9, 0.12, -Math.PI / 2, Math.PI / 6 + i * 0.1)
    const opacity = 0.6 - i * 0.1
    const color = `hsl(${30 + i * 15}, 65%, 45%)`
    layers.push(makeCurveLayer(`tree-${i}`, curve, color, opacity, 1.2, i, 'screen'))
  }
}

/** Peano — space-filling curve */
export function buildPeanoScene(layers: SceneLayer[], basePhase: number): void {
  const count = 4
  const iterations = [2, 3, 3, 4]
  for (let i = 0; i < count; i++) {
    const margin = 0.15 + i * 0.02
    const size = 0.7 - i * 0.05
    const curve = createPeano(iterations[i]!, margin, size)
    const opacity = 0.5 - i * 0.1
    const color = `hsl(${60 + i * 20}, 60%, 50%)`
    layers.push(makeCurveLayer(`peano-${i}`, curve, color, opacity, 1.0, i, 'screen'))
  }
}

/* ══════════════════════════════════════════
 * TOPOLOGICAL CURVES
 * ═══════════════════════════════════════════ */

/** Möbius Strip — one-sided surface */
export function buildMobiusStripScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  for (let i = 0; i < count; i++) {
    const curve = createMobiusStrip(200, 0.5, 0.5, 0.25 + i * 0.02, 0.08 + i * 0.01)
    const opacity = 0.5 - i * 0.08
    const color = `hsl(${280 + i * 10}, 65%, 55%)`
    layers.push(makeCurveLayer(`mobius-${i}`, curve, color, opacity, 1.0, i, 'screen'))
  }
}

/** Torus — donut shape */
export function buildTorusScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  for (let i = 0; i < count; i++) {
    const curve = createTorus(200, 0.5, 0.5, 0.2 + i * 0.02, 0.08 + i * 0.01)
    const opacity = 0.5 - i * 0.08
    const color = `hsl(${180 + i * 15}, 60%, 50%)`
    layers.push(makeCurveLayer(`torus-${i}`, curve, color, opacity, 1.0, i, 'screen'))
  }
}

/** Trefoil Knot — simplest non-trivial knot */
export function buildTrefoilKnotScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  for (let i = 0; i < count; i++) {
    const curve = createTrefoilKnot(200, 0.5, 0.5, 0.25 + i * 0.02)
    const opacity = 0.6 - i * 0.1
    const color = `hsl(${320 + i * 8}, 70%, 55%)`
    layers.push(makeCurveLayer(`trefoil-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/** Figure-8 Knot — simplest alternating knot */
export function buildFigure8KnotScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  for (let i = 0; i < count; i++) {
    const curve = createFigure8Knot(200, 0.5, 0.5, 0.25 + i * 0.02)
    const opacity = 0.6 - i * 0.1
    const color = `hsl(${240 + i * 10}, 65%, 55%)`
    layers.push(makeCurveLayer(`fig8knot-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/** Borromean Rings — three interlocked rings */
export function buildBorromeanRingsScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  for (let i = 0; i < count; i++) {
    const curves = createBorromeanRings(100, 0.5, 0.5, 0.12 + i * 0.01, 0.1 + i * 0.01)
    const opacity = 0.5 - i * 0.08
    const color = `hsl(${40 + i * 20}, 70%, 55%)`
    // Add each ring as a separate layer
    curves.forEach((curve, ringIdx) => {
      layers.push(makeCurveLayer(`borromean-${i}-${ringIdx}`, curve, color, opacity, 1.5, i, 'screen'))
    })
  }
}

/* ══════════════════════════════════════════
 * CLASSICAL CURVES
 * ═══════════════════════════════════════════ */

/** Superellipse — between ellipse and rectangle */
export function buildSuperellipseScene(layers: SceneLayer[], basePhase: number): void {
  const count = 6
  const nValues = [2, 3, 4, 5, 6, 8]
  for (let i = 0; i < count; i++) {
    const curve = createSuperellipse(nValues[i]!, 0.3 - i * 0.02, 0.3 - i * 0.02)
    const opacity = 0.5 - i * 0.07
    const color = `hsl(${160 + i * 15}, 60%, 50%)`
    layers.push(makeCurveLayer(`superellipse-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/** Lemniscate — figure-eight curve */
export function buildLemniscateScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  for (let i = 0; i < count; i++) {
    const curve = createLemniscate(0.3 + i * 0.02)
    const opacity = 0.5 - i * 0.08
    const color = `hsl(${300 + i * 10}, 65%, 55%)`
    layers.push(makeCurveLayer(`lemniscate-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/** Folium of Descartes — x³ + y³ = 3axy */
export function buildFoliumScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  for (let i = 0; i < count; i++) {
    const curve = createFoliumOfDescartes(0.25 + i * 0.02)
    const opacity = 0.5 - i * 0.08
    const color = `hsl(${80 + i * 20}, 65%, 50%)`
    layers.push(makeCurveLayer(`folium-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/** Witch of Agnesi — bell-shaped curve */
export function buildWitchOfAgnesiScene(layers: SceneLayer[], basePhase: number): void {
  const count = 6
  for (let i = 0; i < count; i++) {
    const curve = createWitchOfAgnesi(0.12 + i * 0.02, 0.5, 0.5, 0.25)
    const opacity = 0.5 - i * 0.07
    const color = `hsl(${20 + i * 15}, 60%, 50%)`
    layers.push(makeCurveLayer(`witch-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/** Fermat's Spiral — r² = a²·θ */
export function buildFermatSpiralScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  for (let i = 0; i < count; i++) {
    const curve = createFermatSpiral(0.04 + i * 0.01, TAU * 4)
    const opacity = 0.5 - i * 0.08
    const color = `hsl(${140 + i * 15}, 60%, 50%)`
    layers.push(makeCurveLayer(`fermat-${i}`, curve, color, opacity, 1.2, i, 'screen'))
  }
}

/** Hyperbolic Spiral — r = a/θ */
export function buildHyperbolicSpiralScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  for (let i = 0; i < count; i++) {
    const curve = createHyperbolicSpiral(0.4 + i * 0.1, 0.5, TAU * 3)
    const opacity = 0.5 - i * 0.08
    const color = `hsl(${220 + i * 10}, 60%, 55%)`
    layers.push(makeCurveLayer(`hypspiral-${i}`, curve, color, opacity, 1.2, i, 'screen'))
  }
}

/* ══════════════════════════════════════════
 * CYCLOID VARIANTS
 * ═══════════════════════════════════════════ */

/** Epicycloid — circle rolling outside */
export function buildEpicycloidScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  const rValues = [0.05, 0.08, 0.1, 0.12, 0.15]
  for (let i = 0; i < count; i++) {
    const curve = createEpicycloid(0.2, rValues[i]!)
    const opacity = 0.6 - i * 0.1
    const color = `hsl(${260 + i * 12}, 65%, 55%)`
    layers.push(makeCurveLayer(`epicycloid-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/** Hypocycloid — circle rolling inside */
export function buildHypocycloidScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  const rValues = [0.08, 0.1, 0.12, 0.15, 0.2]
  for (let i = 0; i < count; i++) {
    const curve = createHypocycloid(0.3, rValues[i]!)
    const opacity = 0.6 - i * 0.1
    const color = `hsl(${100 + i * 15}, 65%, 50%)`
    layers.push(makeCurveLayer(`hypocycloid-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/** Involute of Circle — unwinding string */
export function buildInvoluteScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  for (let i = 0; i < count; i++) {
    const curve = createInvoluteOfCircle(0.04 + i * 0.01, TAU * 2)
    const opacity = 0.5 - i * 0.08
    const color = `hsl(${340 + i * 8}, 65%, 55%)`
    layers.push(makeCurveLayer(`involute-${i}`, curve, color, opacity, 1.2, i, 'screen'))
  }
}

/* ══════════════════════════════════════════
 * SPECIAL CURVES
 * ═══════════════════════════════════════════ */

/** Conchoid — shell-shaped curve */
export function buildConchoidScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  for (let i = 0; i < count; i++) {
    const curve = createConchoid(0.18, 0.12 + i * 0.02)
    const opacity = 0.5 - i * 0.08
    const color = `hsl(${180 + i * 15}, 60%, 50%)`
    layers.push(makeCurveLayer(`conchoid-${i}`, curve, color, opacity, 1.2, i, 'screen'))
  }
}

/** Cissoid — ivy-shaped curve */
export function buildCissoidScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  for (let i = 0; i < count; i++) {
    const curve = createCissoid(0.25 + i * 0.02)
    const opacity = 0.5 - i * 0.08
    const color = `hsl(${60 + i * 20}, 65%, 50%)`
    layers.push(makeCurveLayer(`cissoid-${i}`, curve, color, opacity, 1.2, i, 'screen'))
  }
}

/** Trisectrix — angle trisection curve */
export function buildTrisectrixScene(layers: SceneLayer[], basePhase: number): void {
  const count = 5
  for (let i = 0; i < count; i++) {
    const curve = createTrisectrix(0.25 + i * 0.02)
    const opacity = 0.5 - i * 0.08
    const color = `hsl(${300 + i * 10}, 65%, 55%)`
    layers.push(makeCurveLayer(`trisectrix-${i}`, curve, color, opacity, 1.2, i, 'screen'))
  }
}

/** Cassini Oval — product of distances to foci is constant */
export function buildCassiniScene(layers: SceneLayer[], basePhase: number): void {
  const count = 6
  for (let i = 0; i < count; i++) {
    const a = 0.28 + i * 0.02
    const b = 0.22 + i * 0.015
    const curve = createCassiniOval(a, b)
    const opacity = 0.6 - i * 0.08
    const color = `hsl(${330 + i * 15}, 70%, 60%)`
    layers.push(makeCurveLayer(`cassini-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/** Butterfly Curve — beautiful butterfly-shaped curve */
export function buildButterflyScene(layers: SceneLayer[], basePhase: number): void {
  const count = 8
  for (let i = 0; i < count; i++) {
    const scale = 0.12 + i * 0.01
    const curve = createButterflyCurve(0.5, 0.5, scale)
    const opacity = 0.7 - i * 0.06
    const color = `hsl(${320 + i * 10}, 75%, 70%)`
    layers.push(makeCurveLayer(`butterfly-${i}`, curve, color, opacity, 1.0, i, 'screen'))
  }
}

/** Torus Knot — complex knot winding on torus surface */
export function buildTorusKnotScene(layers: SceneLayer[], basePhase: number): void {
  const count = 6
  const knots = [
    { p: 2, q: 3 },
    { p: 2, q: 5 },
    { p: 3, q: 4 },
    { p: 3, q: 5 },
    { p: 3, q: 7 },
    { p: 4, q: 5 },
  ]
  for (let i = 0; i < count; i++) {
    const knot = knots[i]!
    const curve = createTorusKnot(knot.p, knot.q, 0.28, 0.08 + i * 0.005)
    const opacity = 0.6 - i * 0.08
    const color = `hsl(${270 + i * 20}, 65%, 60%)`
    layers.push(makeCurveLayer(`torusknot-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/** Parabolic Spiral — spiral with parabolic growth */
export function buildParabolicSpiralScene(layers: SceneLayer[], basePhase: number): void {
  const count = 6
  for (let i = 0; i < count; i++) {
    const a = 0.12 + i * 0.015
    const curve = createParabolicSpiral(a)
    const opacity = 0.5 - i * 0.07
    const color = `hsl(${200 + i * 15}, 70%, 60%)`
    layers.push(makeCurveLayer(`paraspiral-${i}`, curve, color, opacity, 1.2, i, 'screen'))
  }
}

/** Cartesian Oval — generalized ellipse */
export function buildCartesianScene(layers: SceneLayer[], basePhase: number): void {
  const count = 6
  for (let i = 0; i < count; i++) {
    const a = 0.28 + i * 0.02
    const b = 0.18 + i * 0.015
    const curve = createCartesianOval(a, b)
    const opacity = 0.6 - i * 0.08
    const color = `hsl(${20 + i * 15}, 70%, 60%)`
    layers.push(makeCurveLayer(`cartesian-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/** Spring Curve — damped harmonic oscillation */
export function buildSpringScene(layers: SceneLayer[], basePhase: number): void {
  const count = 6
  for (let i = 0; i < count; i++) {
    const damping = 0.08 + i * 0.015
    const frequency = 2.5 + i * 0.5
    const curve = createSpringCurve(damping, frequency)
    const opacity = 0.5 - i * 0.07
    const color = `hsl(${140 + i * 20}, 65%, 55%)`
    layers.push(makeCurveLayer(`spring-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/** Decay Lissajous — damped Lissajous figure */
export function buildDecayLissajousScene(layers: SceneLayer[], basePhase: number): void {
  const count = 8
  for (let i = 0; i < count; i++) {
    const freqX = 3 + i
    const freqY = 4 + i
    const damping = 0.06 + i * 0.01
    const curve = createDecayLissajous(freqX, freqY, damping)
    const opacity = 0.6 - i * 0.06
    const color = `hsl(${320 + i * 10}, 70%, 65%)`
    layers.push(makeCurveLayer(`decaylissajous-${i}`, curve, color, opacity, 1.2, i, 'screen'))
  }
}

/** Rhodonea 3D — 3D rose curve */
export function buildRhodonea3DScene(layers: SceneLayer[], basePhase: number): void {
  const count = 6
  for (let i = 0; i < count; i++) {
    const k = 4 + i
    const curve = createRhodonea3D(k)
    const opacity = 0.6 - i * 0.08
    const color = `hsl(${280 + i * 15}, 65%, 60%)`
    layers.push(makeCurveLayer(`rhodonea3d-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/** Harmonograph — pendulum-based artistic curve */
export function buildHarmonographScene(layers: SceneLayer[], basePhase: number): void {
  const count = 8
  for (let i = 0; i < count; i++) {
    const freq1 = 2 + i * 0.5
    const freq2 = 3 + i * 0.3
    const phase1 = i * 0.2
    const phase2 = Math.PI / 4 + i * 0.15
    const curve = createHarmonograph(freq1, freq2, phase1, phase2)
    const opacity = 0.6 - i * 0.06
    const color = `hsl(${330 + i * 10}, 70%, 65%)`
    layers.push(makeCurveLayer(`harmonograph-${i}`, curve, color, opacity, 1.2, i, 'screen'))
  }
}

/** Spirograph — classic toy curve */
export function buildSpirographScene(layers: SceneLayer[], basePhase: number): void {
  const count = 8
  for (let i = 0; i < count; i++) {
    const R = 0.22 + i * 0.01
    const r = 0.08 + i * 0.005
    const d = 0.12 + i * 0.01
    const curve = createSpirograph(R, r, d)
    const opacity = 0.7 - i * 0.07
    const color = `hsl(${210 + i * 15}, 75%, 60%)`
    layers.push(makeCurveLayer(`spirograph-${i}`, curve, color, opacity, 1.0, i, 'screen'))
  }
}

/** Heart Curve — beautiful heart shape */
export function buildHeartScene(layers: SceneLayer[], basePhase: number): void {
  const count = 6
  for (let i = 0; i < count; i++) {
    const size = 0.22 + i * 0.02
    const curve = createHeartCurve(size)
    const opacity = 0.7 - i * 0.09
    const color = `hsl(${340 + i * 10}, 80%, 55%)`
    layers.push(makeCurveLayer(`heart-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/** Theodorus Spiral — square root spiral */
export function buildTheodorusScene(layers: SceneLayer[], basePhase: number): void {
  const count = 6
  for (let i = 0; i < count; i++) {
    const turns = 10 + i * 2
    const curve = createTheodorusSpiral(turns)
    const opacity = 0.5 - i * 0.07
    const color = `hsl(${150 + i * 20}, 65%, 55%)`
    layers.push(makeCurveLayer(`theodorus-${i}`, curve, color, opacity, 1.2, i, 'screen'))
  }
}

/** Epitrochoid — generalized epicycloid */
export function buildEpitrochoidScene(layers: SceneLayer[], basePhase: number): void {
  const count = 6
  for (let i = 0; i < count; i++) {
    const R = 0.18 + i * 0.015
    const r = 0.07 + i * 0.005
    const d = 0.10 + i * 0.01
    const curve = createEpitrochoid(R, r, d)
    const opacity = 0.6 - i * 0.08
    const color = `hsl(${30 + i * 15}, 70%, 60%)`
    layers.push(makeCurveLayer(`epitrochoid-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}

/** Hypotrochoid — generalized hypocycloid */
export function buildHypotrochoidScene(layers: SceneLayer[], basePhase: number): void {
  const count = 6
  for (let i = 0; i < count; i++) {
    const R = 0.22 + i * 0.015
    const r = 0.09 + i * 0.005
    const d = 0.13 + i * 0.01
    const curve = createHypotrochoid(R, r, d)
    const opacity = 0.6 - i * 0.08
    const color = `hsl(${90 + i * 20}, 65%, 55%)`
    layers.push(makeCurveLayer(`hypotrochoid-${i}`, curve, color, opacity, 1.5, i, 'screen'))
  }
}
