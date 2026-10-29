/**
 * Built-in presets — flow, aurora, wave.
 *
 * These presets demonstrate the engine's capabilities and provide
 * ready-to-use visual configurations.
 */

import type { PresetSchema } from './types'

/** Flow preset — ribbon + wave flowing along curl field */
export const FLOW_PRESET: PresetSchema = {
  id: 'flow',
  version: '1.0.0',
  geometry: {
    type: 'ribbon',
    count: 15,
    points: 8,
  },
  field: {
    type: 'curl',
    scale: 2,
    octaves: 3,
  },
  composition: {
    distribution: { type: 'flow', count: 15 },
    density: 0.6,
    balance: 0.5,
  },
  motion: {
    type: 'flow',
    speed: 0.5,
  },
  material: {
    color: { value: '#4488cc' },
    opacity: 0.6,
    gradient: {
      type: 'linear',
      stops: [
        { offset: 0, color: '#4488cc', opacity: 0.3 },
        { offset: 1, color: '#88ccff', opacity: 0.8 },
      ],
      angle: 45,
    },
    blendMode: 'normal',
  },
  semantic: {
    density: 0.6,
    complexity: 0.5,
    energy: 0.4,
    softness: 0.7,
    depth: 0.5,
    rhythm: 0.5,
    turbulence: 0.4,
    focus: 0.3,
  },
  metadata: {
    name: 'Flow',
    description: 'Flowing ribbons along a curl noise field',
    tags: ['flow', 'ribbon', 'organic'],
  },
}

/** Aurora preset — wave + ribbon with breathing motion */
export const AURORA_PRESET: PresetSchema = {
  id: 'aurora',
  version: '1.0.0',
  geometry: {
    type: 'wave',
    count: 12,
    amplitude: 0.15,
    frequency: 2,
  },
  field: {
    type: 'noise',
    scale: 1.5,
    octaves: 4,
  },
  composition: {
    distribution: { type: 'uniform', count: 12 },
    density: 0.5,
    balance: 0.5,
  },
  motion: {
    type: 'breathing',
    frequency: 0.3,
    minScale: 0.9,
    maxScale: 1.1,
  },
  material: {
    color: { value: '#44cc88' },
    opacity: 0.5,
    gradient: {
      type: 'linear',
      stops: [
        { offset: 0, color: '#22aa66', opacity: 0.2 },
        { offset: 0.5, color: '#44cc88', opacity: 0.6 },
        { offset: 1, color: '#88ffcc', opacity: 0.3 },
      ],
      angle: 90,
    },
    blendMode: 'screen',
  },
  semantic: {
    density: 0.5,
    complexity: 0.6,
    energy: 0.3,
    softness: 0.8,
    depth: 0.6,
    rhythm: 0.4,
    turbulence: 0.3,
    focus: 0.4,
  },
  metadata: {
    name: 'Aurora',
    description: 'Northern lights with gentle breathing motion',
    tags: ['aurora', 'atmospheric', 'calm'],
  },
}

/** Wave preset — sinusoidal waves with drift */
export const WAVE_PRESET: PresetSchema = {
  id: 'wave',
  version: '1.0.0',
  geometry: {
    type: 'wave',
    count: 20,
    amplitude: 0.1,
    frequency: 3,
  },
  field: {
    type: 'noise',
    scale: 1,
    octaves: 2,
  },
  composition: {
    distribution: { type: 'uniform', count: 20 },
    density: 0.7,
    balance: 0.5,
  },
  motion: {
    type: 'wave',
    amplitude: 0.05,
    frequency: 0.8,
  },
  material: {
    color: { value: '#6666cc' },
    opacity: 0.7,
    blendMode: 'normal',
  },
  semantic: {
    density: 0.7,
    complexity: 0.4,
    energy: 0.5,
    softness: 0.5,
    depth: 0.4,
    rhythm: 0.7,
    turbulence: 0.3,
    focus: 0.3,
  },
  metadata: {
    name: 'Wave',
    description: 'Layered sinusoidal waves with gentle motion',
    tags: ['wave', 'rhythmic', 'minimal'],
  },
}

/** Ribbon preset — flowing ribbon curves */
export const RIBBON_PRESET: PresetSchema = {
  id: 'ribbon',
  version: '1.0.0',
  geometry: {
    type: 'ribbon',
    count: 10,
    points: 12,
  },
  field: {
    type: 'curl',
    scale: 1.5,
    octaves: 2,
  },
  composition: {
    distribution: { type: 'flow', count: 10 },
    density: 0.4,
    balance: 0.6,
  },
  motion: {
    type: 'flow',
    speed: 0.3,
  },
  material: {
    color: { value: '#cc6644' },
    opacity: 0.7,
    gradient: {
      type: 'linear',
      stops: [
        { offset: 0, color: '#cc4422', opacity: 0.4 },
        { offset: 1, color: '#ffaa66', opacity: 0.9 },
      ],
      angle: 30,
    },
    blendMode: 'normal',
  },
  semantic: {
    density: 0.4,
    complexity: 0.6,
    energy: 0.5,
    softness: 0.6,
    depth: 0.5,
    rhythm: 0.6,
    turbulence: 0.5,
    focus: 0.4,
  },
  metadata: {
    name: 'Ribbon',
    description: 'Flowing ribbon curves with warm tones',
    tags: ['ribbon', 'flow', 'warm'],
    performanceProfile: 'balanced',
  },
}

/** Organic preset — organic shapes with noise deformation */
export const ORGANIC_PRESET: PresetSchema = {
  id: 'organic',
  version: '1.0.0',
  geometry: {
    type: 'circle',
    count: 12,
  },
  field: {
    type: 'noise',
    scale: 3,
    octaves: 4,
  },
  composition: {
    distribution: { type: 'poisson', count: 12 },
    density: 0.5,
    balance: 0.5,
  },
  motion: {
    type: 'drift',
    speed: 0.2,
  },
  material: {
    color: { value: '#66aa44' },
    opacity: 0.6,
    blendMode: 'multiply',
  },
  semantic: {
    density: 0.5,
    complexity: 0.7,
    energy: 0.3,
    softness: 0.8,
    depth: 0.6,
    rhythm: 0.3,
    turbulence: 0.6,
    focus: 0.3,
  },
  metadata: {
    name: 'Organic',
    description: 'Organic shapes with noise deformation',
    tags: ['organic', 'natural', 'noise'],
    performanceProfile: 'balanced',
  },
}

/** Orbital preset — circular orbiting elements */
export const ORBITAL_PRESET: PresetSchema = {
  id: 'orbital',
  version: '1.0.0',
  geometry: {
    type: 'circle',
    count: 24,
  },
  field: {
    type: 'magnetic',
  },
  composition: {
    distribution: { type: 'radial', count: 24 },
    density: 0.6,
    balance: 0.5,
  },
  motion: {
    type: 'orbit',
    speed: 0.5,
  },
  material: {
    color: { value: '#8844cc' },
    opacity: 0.7,
    gradient: {
      type: 'radial',
      stops: [
        { offset: 0, color: '#aa66ff', opacity: 0.8 },
        { offset: 1, color: '#4422aa', opacity: 0.3 },
      ],
    },
    blendMode: 'screen',
  },
  semantic: {
    density: 0.6,
    complexity: 0.5,
    energy: 0.7,
    softness: 0.5,
    depth: 0.7,
    rhythm: 0.8,
    turbulence: 0.3,
    focus: 0.6,
  },
  metadata: {
    name: 'Orbital',
    description: 'Circular orbiting elements with radial gradients',
    tags: ['orbital', 'circular', 'dynamic'],
    performanceProfile: 'balanced',
  },
}

/** Mesh preset — interconnected grid mesh */
export const MESH_PRESET: PresetSchema = {
  id: 'mesh',
  version: '1.0.0',
  geometry: {
    type: 'line',
    count: 12,
    points: 6,
  },
  field: {
    type: 'noise',
    scale: 2,
    octaves: 3,
  },
  composition: {
    distribution: { type: 'uniform', count: 12 },
    density: 0.6,
    balance: 0.5,
  },
  motion: {
    type: 'wave',
    amplitude: 0.03,
    frequency: 0.5,
  },
  material: {
    color: { value: '#4488aa' },
    opacity: 0.5,
    blendMode: 'normal',
  },
  semantic: {
    density: 0.8,
    complexity: 0.6,
    energy: 0.4,
    softness: 0.3,
    depth: 0.4,
    rhythm: 0.7,
    turbulence: 0.4,
    focus: 0.2,
  },
  metadata: {
    name: 'Mesh',
    description: 'Interconnected grid mesh with wave motion',
    tags: ['mesh', 'grid', 'structural'],
    performanceProfile: 'balanced',
  },
}

/** Atmosphere preset — atmospheric depth with layered fog */
export const ATMOSPHERE_PRESET: PresetSchema = {
  id: 'atmosphere',
  version: '1.0.0',
  geometry: {
    type: 'wave',
    count: 8,
    amplitude: 0.2,
    frequency: 1,
  },
  field: {
    type: 'noise',
    scale: 1,
    octaves: 5,
  },
  composition: {
    distribution: { type: 'uniform', count: 8 },
    density: 0.3,
    balance: 0.5,
  },
  motion: {
    type: 'breathing',
    frequency: 0.15,
    minScale: 0.95,
    maxScale: 1.05,
  },
  material: {
    color: { value: '#aabbcc' },
    opacity: 0.3,
    gradient: {
      type: 'linear',
      stops: [
        { offset: 0, color: '#8899bb', opacity: 0.1 },
        { offset: 0.5, color: '#aabbcc', opacity: 0.3 },
        { offset: 1, color: '#ccddeee', opacity: 0.1 },
      ],
      angle: 180,
    },
    blendMode: 'screen',
  },
  semantic: {
    density: 0.3,
    complexity: 0.4,
    energy: 0.2,
    softness: 0.9,
    depth: 0.8,
    rhythm: 0.2,
    turbulence: 0.2,
    focus: 0.2,
  },
  metadata: {
    name: 'Atmosphere',
    description: 'Atmospheric depth with layered fog effects',
    tags: ['atmosphere', 'fog', 'ambient'],
    performanceProfile: 'light',
  },
}

/** Lissajous preset — harmonic ratio patterns */
export const LISSAJOUS_PRESET: PresetSchema = {
  id: 'lissajous', version: '1.0.0',
  geometry: { type: 'lissajous' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#4488cc' }, opacity: 0.6, blendMode: 'screen' },
  metadata: { name: 'Lissajous', description: 'Harmonic ratio parametric curves', tags: ['parametric', 'harmonic'] },
}

/** Rose preset — petal-shaped curves */
export const ROSE_PRESET: PresetSchema = {
  id: 'rose', version: '1.0.0',
  geometry: { type: 'rose' },
  composition: { distribution: { type: 'uniform', count: 6 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#cc4488' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Rose', description: 'Petal-shaped rose curves', tags: ['parametric', 'floral'] },
}

/** Log Spiral preset — golden spiral growth */
export const LOGSPIRAL_PRESET: PresetSchema = {
  id: 'logspiral', version: '1.0.0',
  geometry: { type: 'logspiral' },
  composition: { distribution: { type: 'uniform', count: 6 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#ccaa44' }, opacity: 0.6, blendMode: 'screen' },
  metadata: { name: 'Log Spiral', description: 'Logarithmic spiral growth', tags: ['parametric', 'spiral'] },
}

/** Archimedean Spiral preset — equal spacing */
export const ARCHSPIRAL_PRESET: PresetSchema = {
  id: 'archspiral', version: '1.0.0',
  geometry: { type: 'archspiral' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#44ccaa' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Archimedean Spiral', description: 'Equal-spacing spiral', tags: ['parametric', 'spiral'] },
}

/** Cycloid preset — rolling circle path */
export const CYCLOID_PRESET: PresetSchema = {
  id: 'cycloid', version: '1.0.0',
  geometry: { type: 'cycloid' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#8844cc' }, opacity: 0.6, blendMode: 'screen' },
  metadata: { name: 'Cycloid', description: 'Rolling circle trajectory', tags: ['parametric', 'mechanical'] },
}

/** Cardioid preset — heart-shaped curve */
export const CARDIOID_PRESET: PresetSchema = {
  id: 'cardioid', version: '1.0.0',
  geometry: { type: 'cardioid' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#cc4466' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Cardioid', description: 'Heart-shaped curve', tags: ['parametric', 'heart'] },
}

/** Astroid preset — four-cusped star */
export const ASTROID_PRESET: PresetSchema = {
  id: 'astroid', version: '1.0.0',
  geometry: { type: 'astroid' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#cccc44' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Astroid', description: 'Four-cusped star curve', tags: ['parametric', 'star'] },
}

/** AM Wave preset — amplitude modulation */
export const AMWAVE_PRESET: PresetSchema = {
  id: 'amwave', version: '1.0.0',
  geometry: { type: 'amwave' },
  composition: { distribution: { type: 'uniform', count: 8 }, density: 0.6, balance: 0.5 },
  material: { color: { value: '#44aacc' }, opacity: 0.4, blendMode: 'screen' },
  metadata: { name: 'AM Wave', description: 'Amplitude modulation beat frequency', tags: ['modulation', 'wave'] },
}

/** FM Wave preset — frequency modulation */
export const FMWAVE_PRESET: PresetSchema = {
  id: 'fmwave', version: '1.0.0',
  geometry: { type: 'fmwave' },
  composition: { distribution: { type: 'uniform', count: 8 }, density: 0.6, balance: 0.5 },
  material: { color: { value: '#8844cc' }, opacity: 0.4, blendMode: 'screen' },
  metadata: { name: 'FM Wave', description: 'Frequency modulation patterns', tags: ['modulation', 'wave'] },
}

/** Moiré preset — interference pattern */
export const MOIRE_PRESET: PresetSchema = {
  id: 'moire', version: '1.0.0',
  geometry: { type: 'moire' },
  composition: { distribution: { type: 'uniform', count: 10 }, density: 0.7, balance: 0.5 },
  material: { color: { value: '#4488aa' }, opacity: 0.3, blendMode: 'screen' },
  metadata: { name: 'Moiré', description: 'Interference pattern', tags: ['interference', 'pattern'] },
}

/** Fourier preset — harmonic series */
export const FOURIER_PRESET: PresetSchema = {
  id: 'fourier', version: '1.0.0',
  geometry: { type: 'fourier' },
  composition: { distribution: { type: 'uniform', count: 6 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#cc8844' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Fourier', description: 'Harmonic series approximation', tags: ['harmonic', 'series'] },
}

/** Gaussian preset — bell curve */
export const GAUSSIAN_PRESET: PresetSchema = {
  id: 'gaussian', version: '1.0.0',
  geometry: { type: 'gaussian' },
  composition: { distribution: { type: 'uniform', count: 7 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#44aa66' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Gaussian', description: 'Bell curve distribution', tags: ['natural', 'distribution'] },
}

/** Sinc preset — diffraction pattern */
export const SINC_PRESET: PresetSchema = {
  id: 'sinc', version: '1.0.0',
  geometry: { type: 'sinc' },
  composition: { distribution: { type: 'uniform', count: 6 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#4466cc' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Sinc', description: 'Diffraction pattern', tags: ['natural', 'diffraction'] },
}

/** Catenary preset — hanging chain */
export const CATENARY_PRESET: PresetSchema = {
  id: 'catenary', version: '1.0.0',
  geometry: { type: 'catenary' },
  composition: { distribution: { type: 'uniform', count: 6 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#aa8844' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Catenary', description: 'Hanging chain curve', tags: ['natural', 'architectural'] },
}

/** Koch preset — snowflake fractal */
export const KOCH_PRESET: PresetSchema = {
  id: 'koch', version: '1.0.0',
  geometry: { type: 'koch' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.6, balance: 0.5 },
  material: { color: { value: '#44aacc' }, opacity: 0.6, blendMode: 'screen' },
  metadata: { name: 'Koch', description: 'Snowflake fractal curve', tags: ['fractal', 'snowflake'] },
}

/** Dragon preset — paper folding curve */
export const DRAGON_PRESET: PresetSchema = {
  id: 'dragon', version: '1.0.0',
  geometry: { type: 'dragon' },
  composition: { distribution: { type: 'uniform', count: 4 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#8844cc' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Dragon', description: 'Paper folding dragon curve', tags: ['fractal', 'dragon'] },
}

/** Hilbert preset — space-filling curve */
export const HILBERT_PRESET: PresetSchema = {
  id: 'hilbert', version: '1.0.0',
  geometry: { type: 'hilbert' },
  composition: { distribution: { type: 'uniform', count: 4 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#66aa44' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Hilbert', description: 'Space-filling Hilbert curve', tags: ['fractal', 'space-filling'] },
}

/** Lévy C preset — self-similar fractal */
export const LEVYC_PRESET: PresetSchema = {
  id: 'levyc', version: '1.0.0',
  geometry: { type: 'levyc' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#4488cc' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Lévy C', description: 'Self-similar Lévy C fractal', tags: ['fractal', 'levy'] },
}

/** Sierpinski Triangle preset */
export const SIERPINSKI_PRESET: PresetSchema = {
  id: 'sierpinski', version: '1.0.0',
  geometry: { type: 'sierpinski' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.6, balance: 0.5 },
  material: { color: { value: '#44aa66' }, opacity: 0.6, blendMode: 'screen' },
  metadata: { name: 'Sierpinski', description: 'Recursive triangle fractal', tags: ['fractal', 'sierpinski'] },
}

/** Fractal Tree preset */
export const FRACTALTREE_PRESET: PresetSchema = {
  id: 'fractaltree', version: '1.0.0',
  geometry: { type: 'fractaltree' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.6, balance: 0.5 },
  material: { color: { value: '#886644' }, opacity: 0.6, blendMode: 'screen' },
  metadata: { name: 'Fractal Tree', description: 'Branching tree structure', tags: ['fractal', 'tree'] },
}

/** Peano preset — space-filling curve */
export const PEANO_PRESET: PresetSchema = {
  id: 'peano', version: '1.0.0',
  geometry: { type: 'peano' },
  composition: { distribution: { type: 'uniform', count: 4 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#aa8844' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Peano', description: 'Space-filling Peano curve', tags: ['fractal', 'space-filling'] },
}

/** Möbius Strip preset */
export const MOBIUS_PRESET: PresetSchema = {
  id: 'mobius', version: '1.0.0',
  geometry: { type: 'mobius' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#8844cc' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Möbius', description: 'One-sided Möbius strip', tags: ['topology', 'mobius'] },
}

/** Torus preset */
export const TORUS_PRESET: PresetSchema = {
  id: 'torus', version: '1.0.0',
  geometry: { type: 'torus' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#44aacc' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Torus', description: 'Donut-shaped torus', tags: ['topology', 'torus'] },
}

/** Trefoil Knot preset */
export const TREFOIL_PRESET: PresetSchema = {
  id: 'trefoil', version: '1.0.0',
  geometry: { type: 'trefoil' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.6, balance: 0.5 },
  material: { color: { value: '#cc4488' }, opacity: 0.6, blendMode: 'screen' },
  metadata: { name: 'Trefoil', description: 'Simplest non-trivial knot', tags: ['topology', 'knot'] },
}

/** Figure-8 Knot preset */
export const FIG8KNOT_PRESET: PresetSchema = {
  id: 'fig8knot', version: '1.0.0',
  geometry: { type: 'fig8knot' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.6, balance: 0.5 },
  material: { color: { value: '#6644cc' }, opacity: 0.6, blendMode: 'screen' },
  metadata: { name: 'Figure-8 Knot', description: 'Simplest alternating knot', tags: ['topology', 'knot'] },
}

/** Borromean Rings preset */
export const BORROMEAN_PRESET: PresetSchema = {
  id: 'borromean', version: '1.0.0',
  geometry: { type: 'borromean' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#ccaa44' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Borromean', description: 'Three interlocked rings', tags: ['topology', 'rings'] },
}

/** Superellipse preset */
export const SUPERELLIPSE_PRESET: PresetSchema = {
  id: 'superellipse', version: '1.0.0',
  geometry: { type: 'superellipse' },
  composition: { distribution: { type: 'uniform', count: 6 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#44aa88' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Superellipse', description: 'Between ellipse and rectangle', tags: ['classical', 'superellipse'] },
}

/** Lemniscate preset */
export const LEMNISCATE_PRESET: PresetSchema = {
  id: 'lemniscate', version: '1.0.0',
  geometry: { type: 'lemniscate' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#aa44aa' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Lemniscate', description: 'Figure-eight curve', tags: ['classical', 'lemniscate'] },
}

/** Folium of Descartes preset */
export const FOLIUM_PRESET: PresetSchema = {
  id: 'folium', version: '1.0.0',
  geometry: { type: 'folium' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#88aa44' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Folium', description: 'Folium of Descartes', tags: ['classical', 'folium'] },
}

/** Witch of Agnesi preset */
export const WITCH_PRESET: PresetSchema = {
  id: 'witch', version: '1.0.0',
  geometry: { type: 'witch' },
  composition: { distribution: { type: 'uniform', count: 6 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#aa6644' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Witch of Agnesi', description: 'Bell-shaped curve', tags: ['classical', 'witch'] },
}

/** Fermat's Spiral preset */
export const FERMAT_PRESET: PresetSchema = {
  id: 'fermat', version: '1.0.0',
  geometry: { type: 'fermat' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#44aa66' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Fermat Spiral', description: 'Fermat spiral r²=a²θ', tags: ['classical', 'spiral'] },
}

/** Hyperbolic Spiral preset */
export const HYPSPIRAL_PRESET: PresetSchema = {
  id: 'hypspiral', version: '1.0.0',
  geometry: { type: 'hypspiral' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#4466aa' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Hyperbolic Spiral', description: 'Hyperbolic spiral r=a/θ', tags: ['classical', 'spiral'] },
}

/** Epicycloid preset */
export const EPICYCLOID_PRESET: PresetSchema = {
  id: 'epicycloid', version: '1.0.0',
  geometry: { type: 'epicycloid' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.6, balance: 0.5 },
  material: { color: { value: '#8844aa' }, opacity: 0.6, blendMode: 'screen' },
  metadata: { name: 'Epicycloid', description: 'Circle rolling outside', tags: ['cycloid', 'epicycloid'] },
}

/** Hypocycloid preset */
export const HYPOCYCLOID_PRESET: PresetSchema = {
  id: 'hypocycloid', version: '1.0.0',
  geometry: { type: 'hypocycloid' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.6, balance: 0.5 },
  material: { color: { value: '#66aa44' }, opacity: 0.6, blendMode: 'screen' },
  metadata: { name: 'Hypocycloid', description: 'Circle rolling inside', tags: ['cycloid', 'hypocycloid'] },
}

/** Involute preset */
export const INVOLUTE_PRESET: PresetSchema = {
  id: 'involute', version: '1.0.0',
  geometry: { type: 'involute' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#aa4466' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Involute', description: 'Unwinding string from circle', tags: ['cycloid', 'involute'] },
}

/** Conchoid preset */
export const CONCHOID_PRESET: PresetSchema = {
  id: 'conchoid', version: '1.0.0',
  geometry: { type: 'conchoid' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#44aa88' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Conchoid', description: 'Shell-shaped curve', tags: ['special', 'conchoid'] },
}

/** Cissoid preset */
export const CISSOID_PRESET: PresetSchema = {
  id: 'cissoid', version: '1.0.0',
  geometry: { type: 'cissoid' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#aaaa44' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Cissoid', description: 'Ivy-shaped curve', tags: ['special', 'cissoid'] },
}

/** Trisectrix preset */
export const TRISECTRIX_PRESET: PresetSchema = {
  id: 'trisectrix', version: '1.0.0',
  geometry: { type: 'trisectrix' },
  composition: { distribution: { type: 'uniform', count: 5 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#aa44aa' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Trisectrix', description: 'Angle trisection curve', tags: ['special', 'trisectrix'] },
}

/** Cassini Oval preset */
export const CASSINI_PRESET: PresetSchema = {
  id: 'cassini', version: '1.0.0',
  geometry: { type: 'cassini' },
  composition: { distribution: { type: 'uniform', count: 6 }, density: 0.6, balance: 0.5 },
  material: { color: { value: '#ff6699' }, opacity: 0.6, blendMode: 'screen' },
  metadata: { name: 'Cassini Oval', description: 'Product of distances to foci is constant', tags: ['classical', 'oval', 'cassini'] },
}

/** Butterfly Curve preset */
export const BUTTERFLY_PRESET: PresetSchema = {
  id: 'butterfly', version: '1.0.0',
  geometry: { type: 'butterfly' },
  composition: { distribution: { type: 'uniform', count: 8 }, density: 0.7, balance: 0.5 },
  material: { color: { value: '#ff99cc' }, opacity: 0.7, blendMode: 'screen' },
  metadata: { name: 'Butterfly Curve', description: 'Beautiful butterfly-shaped curve', tags: ['classical', 'butterfly'] },
}

/** Torus Knot preset */
export const TORUSKNOT_PRESET: PresetSchema = {
  id: 'torusknot', version: '1.0.0',
  geometry: { type: 'torusknot' },
  composition: { distribution: { type: 'uniform', count: 6 }, density: 0.6, balance: 0.5 },
  material: { color: { value: '#9966ff' }, opacity: 0.6, blendMode: 'screen' },
  metadata: { name: 'Torus Knot', description: 'Complex knot winding on torus surface', tags: ['topological', 'knot', 'torus'] },
}

/** Parabolic Spiral preset */
export const PARASPIRAL_PRESET: PresetSchema = {
  id: 'paraspiral', version: '1.0.0',
  geometry: { type: 'paraspiral' },
  composition: { distribution: { type: 'uniform', count: 6 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#66ccff' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Parabolic Spiral', description: 'Spiral with parabolic growth', tags: ['classical', 'spiral'] },
}

/** Cartesian Oval preset */
export const CARTESIAN_PRESET: PresetSchema = {
  id: 'cartesian', version: '1.0.0',
  geometry: { type: 'cartesian' },
  composition: { distribution: { type: 'uniform', count: 6 }, density: 0.6, balance: 0.5 },
  material: { color: { value: '#ff9966' }, opacity: 0.6, blendMode: 'screen' },
  metadata: { name: 'Cartesian Oval', description: 'Generalized ellipse with depth', tags: ['classical', 'oval'] },
}

/** Spring Curve preset */
export const SPRING_PRESET: PresetSchema = {
  id: 'spring', version: '1.0.0',
  geometry: { type: 'spring' },
  composition: { distribution: { type: 'uniform', count: 6 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#66ff99' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Spring Curve', description: 'Damped harmonic oscillation', tags: ['physics', 'spring'] },
}

/** Decay Lissajous preset */
export const DECAYLISSAJOUS_PRESET: PresetSchema = {
  id: 'decaylissajous', version: '1.0.0',
  geometry: { type: 'decaylissajous' },
  composition: { distribution: { type: 'uniform', count: 8 }, density: 0.6, balance: 0.5 },
  material: { color: { value: '#ff66cc' }, opacity: 0.6, blendMode: 'screen' },
  metadata: { name: 'Decay Lissajous', description: 'Damped Lissajous with fading trails', tags: ['modulation', 'lissajous'] },
}

/** Rhodonea 3D preset */
export const RHODONEA3D_PRESET: PresetSchema = {
  id: 'rhodonea3d', version: '1.0.0',
  geometry: { type: 'rhodonea3d' },
  composition: { distribution: { type: 'uniform', count: 6 }, density: 0.6, balance: 0.5 },
  material: { color: { value: '#cc66ff' }, opacity: 0.6, blendMode: 'screen' },
  metadata: { name: 'Rhodonea 3D', description: '3D rose curve with depth projection', tags: ['classical', 'rose', '3d'] },
}

/** Harmonograph preset */
export const HARMONOGRAPH_PRESET: PresetSchema = {
  id: 'harmonograph', version: '1.0.0',
  geometry: { type: 'harmonograph' },
  composition: { distribution: { type: 'uniform', count: 8 }, density: 0.6, balance: 0.5 },
  material: { color: { value: '#ff66aa' }, opacity: 0.6, blendMode: 'screen' },
  metadata: { name: 'Harmonograph', description: 'Pendulum-based artistic curve', tags: ['artistic', 'pendulum'] },
}

/** Spirograph preset */
export const SPIROGRAPH_PRESET: PresetSchema = {
  id: 'spirograph', version: '1.0.0',
  geometry: { type: 'spirograph' },
  composition: { distribution: { type: 'uniform', count: 8 }, density: 0.7, balance: 0.5 },
  material: { color: { value: '#66aaff' }, opacity: 0.7, blendMode: 'screen' },
  metadata: { name: 'Spirograph', description: 'Classic toy curve patterns', tags: ['toy', 'spirograph'] },
}

/** Heart Curve preset */
export const HEART_PRESET: PresetSchema = {
  id: 'heart', version: '1.0.0',
  geometry: { type: 'heart' },
  composition: { distribution: { type: 'uniform', count: 6 }, density: 0.6, balance: 0.5 },
  material: { color: { value: '#ff3366' }, opacity: 0.7, blendMode: 'screen' },
  metadata: { name: 'Heart Curve', description: 'Beautiful heart shape', tags: ['artistic', 'heart'] },
}

/** Theodorus Spiral preset */
export const THEODORUS_PRESET: PresetSchema = {
  id: 'theodorus', version: '1.0.0',
  geometry: { type: 'theodorus' },
  composition: { distribution: { type: 'uniform', count: 6 }, density: 0.5, balance: 0.5 },
  material: { color: { value: '#66ffaa' }, opacity: 0.5, blendMode: 'screen' },
  metadata: { name: 'Theodorus Spiral', description: 'Square root spiral from right triangles', tags: ['classical', 'spiral'] },
}

/** Epitrochoid preset */
export const EPITROCHOID_PRESET: PresetSchema = {
  id: 'epitrochoid', version: '1.0.0',
  geometry: { type: 'epitrochoid' },
  composition: { distribution: { type: 'uniform', count: 6 }, density: 0.6, balance: 0.5 },
  material: { color: { value: '#ffaa66' }, opacity: 0.6, blendMode: 'screen' },
  metadata: { name: 'Epitrochoid', description: 'Generalized epicycloid', tags: ['cycloid', 'epitrochoid'] },
}

/** Hypotrochoid preset */
export const HYPOTROCHOID_PRESET: PresetSchema = {
  id: 'hypotrochoid', version: '1.0.0',
  geometry: { type: 'hypotrochoid' },
  composition: { distribution: { type: 'uniform', count: 6 }, density: 0.6, balance: 0.5 },
  material: { color: { value: '#aaff66' }, opacity: 0.6, blendMode: 'screen' },
  metadata: { name: 'Hypotrochoid', description: 'Generalized hypocycloid', tags: ['cycloid', 'hypotrochoid'] },
}

/** All built-in presets */
export const BUILT_IN_PRESETS: PresetSchema[] = [
  FLOW_PRESET,
  AURORA_PRESET,
  WAVE_PRESET,
  RIBBON_PRESET,
  ORGANIC_PRESET,
  ORBITAL_PRESET,
  MESH_PRESET,
  ATMOSPHERE_PRESET,
  // Parametric curves
  LISSAJOUS_PRESET,
  ROSE_PRESET,
  LOGSPIRAL_PRESET,
  ARCHSPIRAL_PRESET,
  CYCLOID_PRESET,
  CARDIOID_PRESET,
  ASTROID_PRESET,
  // Modulation functions
  AMWAVE_PRESET,
  FMWAVE_PRESET,
  MOIRE_PRESET,
  FOURIER_PRESET,
  // Natural forms
  GAUSSIAN_PRESET,
  SINC_PRESET,
  CATENARY_PRESET,
  // Fractal curves
  KOCH_PRESET,
  DRAGON_PRESET,
  HILBERT_PRESET,
  LEVYC_PRESET,
  SIERPINSKI_PRESET,
  FRACTALTREE_PRESET,
  PEANO_PRESET,
  // Topological curves
  MOBIUS_PRESET,
  TORUS_PRESET,
  TREFOIL_PRESET,
  FIG8KNOT_PRESET,
  BORROMEAN_PRESET,
  // Classical curves
  SUPERELLIPSE_PRESET,
  LEMNISCATE_PRESET,
  FOLIUM_PRESET,
  WITCH_PRESET,
  FERMAT_PRESET,
  HYPSPIRAL_PRESET,
  // Cycloid variants
  EPICYCLOID_PRESET,
  HYPOCYCLOID_PRESET,
  INVOLUTE_PRESET,
  // Special curves
  CONCHOID_PRESET,
  CISSOID_PRESET,
  TRISECTRIX_PRESET,
  // New beautiful curves
  CASSINI_PRESET,
  BUTTERFLY_PRESET,
  TORUSKNOT_PRESET,
  PARASPIRAL_PRESET,
  CARTESIAN_PRESET,
  SPRING_PRESET,
  DECAYLISSAJOUS_PRESET,
  RHODONEA3D_PRESET,
  HARMONOGRAPH_PRESET,
  SPIROGRAPH_PRESET,
  HEART_PRESET,
  THEODORUS_PRESET,
  EPITROCHOID_PRESET,
  HYPOTROCHOID_PRESET,
]
