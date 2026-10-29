/**
 * Geometry types — the shape layer of the semantic model.
 *
 * Geometry answers: "What shape?"
 * Uses Geometry-first model (not Particle-first).
 */

/** 2D point */
export interface Point {
  x: number
  y: number
}

/** 2D vector */
export interface Vector {
  x: number
  y: number
}

/** Bounding rectangle */
export interface Bounds {
  x: number
  y: number
  width: number
  height: number
}

/** Unified Curve interface — all curve types implement this */
export interface Curve {
  readonly type: string
  /** Get point at parameter t ∈ [0, 1] */
  pointAt(t: number): Point
  /** Get tangent vector at parameter t */
  tangentAt(t: number): Vector
  /** Get normal vector at parameter t */
  normalAt(t: number): Vector
  /** Total arc length */
  length(): number
  /** Sample points along the curve at uniform arc-length intervals */
  sample(count: number): Point[]
}

/** Geometry configuration */
export interface GeometryConfig {
  type: string
  seed?: number
  [key: string]: unknown
}

/** Base Geometry interface — all geometry types implement this */
export interface Geometry {
  readonly type: string
  /** Get bounding box */
  bounds(): Bounds
  /** Transform this geometry */
  transform(matrix: TransformMatrix): Geometry
  /** Sample points from this geometry */
  sample(count: number): Point[]
}

/** Transform matrix (2D affine) */
export interface TransformMatrix {
  a: number
  b: number
  c: number
  d: number
  tx: number
  ty: number
}

/** Geometry generator — creates geometry from config + seed */
export interface GeometryGenerator {
  generate(config: GeometryConfig, seed: number): Geometry
}
