# Changelog

All notable changes to `@regalpine/generative-art` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] — 2026-10-07

### Added

#### WebGPU Renderer (Sprint 18)
- `WebGPURenderer` — GPU-accelerated renderer using WebGPU API
- WGSL shader modules (vertex + fragment)
- WebGPU render pipeline with interleaved vertex buffers
- Batch draw call submission
- WebGPU blend mode mapping (16 modes)
- `isWebGPUAvailable()` / `requestWebGPUDevice()` utilities
- `selectRendererAsync()` — async renderer selection with WebGPU support

#### Parallel Computation + Worker (Sprint 19)
- `WorkerManager` — Web Worker pool with request/response correlation
- Worker protocol with Transferable Objects for zero-copy data transfer
- `computeFieldInWorker()` — offload field computation to worker thread
- `computeMotionInWorker()` — offload motion computation to worker thread
- `OffscreenRenderer` — render in worker thread via OffscreenCanvas
- `isOffscreenCanvasAvailable()` detection

#### Advanced Compositing + Web Component (Sprint 20)
- Multi-pass compositing pipeline (`CompositePipeline`)
- Composite operations: over / in / out / atop / xor / plus
- Post-processing pipeline: bloom, DOF, vignette, chromatic-aberration, film-grain, color-grade
- CSS filter generation from post-processing config
- `GenerativeArtElement` — Web Component `<generative-art>`
- `registerWebComponent()` / `isWebComponentRegistered()` utilities

#### Tools + Ecosystem (Sprint 21)
- `PerfPanel` — real-time performance monitoring overlay (FPS, draw calls, tier)
- `validatePresetJSON()` / `validatePresetObject()` — preset validation tools
- `PresetLoader` — marketplace preset loading with cache
- `MarketplaceAPI` interface + `createMockMarketplaceAPI()` for development
- Preset search, download, publish protocol types

### Changed
- Renderer selector now supports WebGPU → WebGL → Canvas2D fallback chain
- `selectRendererAsync()` added alongside sync `selectRenderer()`
- `@webgpu/types` added as devDependency

---

## [1.0.0] — 2026-10-07

### Added

#### Core Architecture (P0 — Sprint 0~9)
- Six-layer semantic model: Geometry → Field → Composition → Motion → Material → Renderer
- `createGenerativeArt()` — main entry point
- Seed-based deterministic generation (`createSeed()`)
- Semantic config normalization (density, complexity, energy, etc.)
- Lifecycle state machine (idle → initializing → ready → rendering → paused → disposed)
- Delta-time scheduler (no fixed FPS assumption)
- Math utilities (vec2 operations, lerp, clamp, smoothstep)

#### Geometry Layer
- `CurveGeometry` — unified curve interface with arc-length parameterization
- `Polyline` — piecewise linear curves
- `QuadraticBezier` / `CubicBezier` — Bézier curves
- `Spline` — Catmull-Rom spline through control points
- `Circle` — circle/arc geometry
- `Wave` — parametric wave curves
- `Ribbon` — flowing ribbon geometry
- `DefaultGeometryGenerator` — config-driven geometry generation
- Transform matrix utilities (translate, rotate, scale, compose)

#### Field Layer
- `ScalarField` / `VectorField` interfaces
- `createSimplexNoise()` — seed-driven 2D/3D simplex noise
- `createFractalNoise()` — multi-octave fractal noise
- `ScalarNoiseField` / `VectorNoiseField` — noise-based fields
- `CurlField` — divergence-free curl noise field
- `CompositeField` — field superposition
- `TransformField` — field coordinate transformation
- `createForceField()` — attractor/repeller force fields
- Field operations: Subtract, Multiply, Scale, Normalize, Clamp, Rotate, Invert, Blend
- `FlowField` — grid-interpolated flow field
- `MagneticField` — multi-pole magnetic field
- `MaskedField` — field × mask modulation
- `RadialMask` / `RectMask` — field mask shapes
- `DomainWarpField` — dual-layer coordinate warping

#### Composition Layer
- 12 distribution algorithms: Uniform, Random, Radial, Flow, Poisson Disk, Spiral, Cluster, Edge, Center, Golden, Organic, Grid
- `applyNegativeSpace()` — protected region filtering
- `applySymmetry()` — 5 symmetry modes (horizontal, vertical, radial, rotational, mirror)
- `assignHierarchy()` — 3-level visual hierarchy
- `assignDepth()` — depth layer assignment with decay
- `applyRhythm()` — 5 rhythm patterns

#### Motion Layer
- 9 motion types: Flow, Drift, Wave, Breathing, Orbit, Pulse, Rotation, Parallax, Morph
- `MotionComposer` — priority + weight-based motion blending
- `ReducedMotion` — accessibility wrapper with energy reduction
- `prefersReducedMotion()` — browser preference detection

#### Material Layer
- OKLab color space for perceptually uniform interpolation
- `parseHexColor()` / `parseCSSColor()` — color parsing
- `resolveMaterial()` — semantic → material resolution
- 5 material effects: Glow, Blur, Grain, NoiseTexture, Shadow
- `MaterialStack` — multi-layer material composition
- 16 blend modes with Canvas2D composite operation mapping

#### Renderer Layer
- `Canvas2DRenderer` — Canvas 2D rendering
- `WebGLRenderer` — WebGL 1.0 rendering with shader pipeline
- `WebGPURenderer` — WebGPU rendering (v2.0)
- Capability negotiation (`negotiateCapabilities()`)
- Auto renderer selection (`selectRenderer()` / `selectRendererAsync()`)
- DPR management

#### Preset System
- 8 built-in presets: Flow, Aurora, Wave, Ribbon, Organic, Orbital, Mesh, Atmosphere
- Version management (parse, compare, satisfy, bump)
- Preset validation with error/warning reporting
- Performance profiles (light, balanced, rich, experimental)
- Preset capability negotiation

#### CSS Integration
- CSS variable parsing → semantic config
- CSS observer for live variable changes
- Semantic → CSS variable conversion
- Responsive breakpoints (mobile, tablet, desktop, large)

#### Plugin System
- `Plugin` contract with `install(PluginContext)`
- `pluginRegistry` — install/uninstall/list plugins
- Register custom geometry, field, motion, material, preset

#### Framework Adapters
- React adapter pattern (`createCanvasAdapter()`)
- Vue adapter pattern (`createVueAdapter()`)
- Auto-init from DOM data attributes (`autoInit()`)
- Web Component `<generative-art>` (`GenerativeArtElement`)

#### Performance System
- 4-tier performance model (0=low → 3=maximum)
- Device detection (mobile/tablet/desktop, WebGL/WebGPU, memory, cores)
- `FPSMonitor` — real-time frame rate tracking
- `AdaptivePerformance` — dynamic tier adjustment based on FPS
- Render quality settings per tier

---

## [0.0.0] — Project Initialization

- Project scaffold (tsup, vitest, eslint, TypeScript strict)
- ESM + CJS dual format build
- Zero runtime dependency
