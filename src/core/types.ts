// ─── Core Types ──────────────────────────────────────────────────────────────

/** Semantic art configuration — 8 core parameters exposed to users */
export interface SemanticArtConfig {
  /** 0~1 — Visual density of geometry */
  density?: number
  /** 0~1 — Structural complexity */
  complexity?: number
  /** 0~1 — Energy / motion intensity */
  energy?: number
  /** 0~1 — Softness of edges and transitions */
  softness?: number
  /** 0~1 — Depth perception intensity */
  depth?: number
  /** 0~1 — Visual rhythm strength */
  rhythm?: number
  /** 0~1 — Turbulence / noise intensity */
  turbulence?: number
  /** 0~1 — Focus / attention strength */
  focus?: number
}

/** Viewport information */
export interface Viewport {
  width: number
  height: number
  dpr: number
  aspectRatio: number
}

/** A resolved scene ready for rendering */
export interface Scene {
  layers: SceneLayer[]
  width: number
  height: number
  time: number
}

/** A layer within a scene */
export interface SceneLayer {
  id: string
  geometries: unknown[]
  drawCommands: unknown[]
  material: unknown
  zIndex: number
  opacity: number
}

/** Full configuration for creating a GenerativeArt instance */
export interface GenerativeArtConfig {
  /** Target canvas element or CSS selector */
  target: HTMLCanvasElement | string
  /** Preset ID or preset configuration */
  preset?: string | PresetConfig
  /** Semantic art overrides */
  semantic?: SemanticArtConfig
  /** Seed for deterministic generation */
  seed?: number
  /** Renderer preference: 'auto' | 'canvas2d' | 'webgl' | 'webgpu' */
  renderer?: 'auto' | 'canvas2d' | 'webgl' | 'webgpu'
  /** Max device pixel ratio (default: 2) */
  maxDpr?: number
  /** Enable animation (default: true) */
  animated?: boolean
}

/** Preset configuration (simplified) */
export interface PresetConfig {
  id: string
  version?: string
  [key: string]: unknown
}

// ─── GenerativeArt Instance ──────────────────────────────────────────────────

/** The main GenerativeArt instance interface */
export interface GenerativeArt {
  /** Start rendering */
  start(): void
  /** Pause animation */
  pause(): void
  /** Resume animation */
  resume(): void
  /** Stop rendering */
  stop(): void
  /** Resize to new viewport */
  resize(width: number, height: number): void
  /** Update semantic configuration at runtime */
  update(config: Partial<SemanticArtConfig>): void
  /** Switch preset */
  setPreset(id: string): void
  /** Destroy instance and release resources */
  destroy(): void
}
