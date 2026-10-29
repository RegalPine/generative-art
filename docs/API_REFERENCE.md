# API Reference

> **Package:** `@regalpine/generative-art`  
> **Version:** 2.0.0  
> **Module:** ESM + CJS dual format

---

## Quick Start

```typescript
import { createGenerativeArt } from '@regalpine/generative-art'

const art = createGenerativeArt({
  target: canvasElement,
  preset: 'flow',
  semantic: { density: 0.6, energy: 0.4, complexity: 0.5 },
})

art.start()
// ... later
art.destroy()
```

---

## Core

### `createGenerativeArt(config)`

Main entry point. Creates a GenerativeArt instance.

```typescript
function createGenerativeArt(config: GenerativeArtConfig): GenerativeArt
```

**GenerativeArtConfig:**
- `target: HTMLCanvasElement` — Canvas element
- `preset?: string` — Preset name (default: `'flow'`)
- `seed?: number` — Random seed
- `renderer?: 'auto' | 'canvas2d' | 'webgl' | 'webgpu'` — Renderer type
- `semantic?: Partial<SemanticArtConfig>` — Semantic overrides

**SemanticArtConfig:**
- `density: number` (0~1) — Element count density
- `complexity: number` (0~1) — Geometric complexity
- `energy: number` (0~1) — Motion energy
- `softness: number` (0~1) — Edge softness
- `depth: number` (0~1) — Depth perception
- `rhythm: number` (0~1) — Rhythmic variation
- `turbulence: number` (0~1) — Flow turbulence
- `focus: number` (0~1) — Center focus

**GenerativeArt:**
- `start(): void` — Start rendering
- `pause(): void` — Pause rendering
- `resume(): void` — Resume rendering
- `stop(): void` — Stop rendering
- `destroy(): void` — Dispose all resources
- `update(semantic: Partial<SemanticArtConfig>): void` — Update semantic params
- `setSeed(seed: number): void` — Change seed
- `setPreset(name: string): void` — Change preset
- `getState(): LifecycleState` — Current lifecycle state
- `getFPS(): number` — Current FPS

### Seed & Math

```typescript
createSeed(value: number): Seed          // Deterministic PRNG
createLifecycleStateMachine(): LifecycleStateMachine
normalizeSemanticConfig(config?: Partial<SemanticArtConfig>): SemanticArtConfig
createScheduler(callback: SchedulerCallback): Scheduler

// Vector math
vecAdd, vecSub, vecScale, vecLength, vecNormalize, vecDot, vecPerp
pointDistance, lerp, clamp, clamp01, smoothstep, pointToVec, vecToPoint
```

---

## Geometry

### Geometry Types

| Class | Description |
|-------|-------------|
| `CurveGeometry` | Unified curve with arc-length parameterization |
| `Polyline` | Piecewise linear curves |
| `QuadraticBezier` | Quadratic Bézier curve |
| `CubicBezier` | Cubic Bézier curve |
| `Spline` | Catmull-Rom spline |
| `Circle` | Circle/arc geometry |
| `Wave` | Parametric wave curves |
| `Ribbon` | Flowing ribbon geometry |
| `DefaultGeometryGenerator` | Config-driven geometry generation |

### Transform Utilities

```typescript
transformPoint(point: Point, matrix: TransformMatrix): Point
identityMatrix(): TransformMatrix
translateMatrix(tx: number, ty: number): TransformMatrix
rotateMatrix(angle: number): TransformMatrix
scaleMatrix(sx: number, sy: number): TransformMatrix
composeMatrix(...matrices: TransformMatrix[]): TransformMatrix
```

### Arc-Length Parameterization

```typescript
buildArcLengthTable(curve: Curve, samples?: number): ArcLengthEntry[]
tAtArcLength(table: ArcLengthEntry[], targetLength: number): number
sampleUniform(curve: Curve, count: number): Point[]
```

---

## Field

### Field Types

| Export | Description |
|--------|-------------|
| `createSimplexNoise(seed)` | 2D/3D simplex noise |
| `createFractalNoise(config)` | Multi-octave fractal noise |
| `ScalarNoiseField` | Noise → scalar field |
| `VectorNoiseField` | Noise → vector field |
| `CurlField` | Divergence-free curl noise |
| `CompositeField` | Field superposition |
| `TransformField` | Coordinate transformation |
| `createForceField(config)` | Attractor/repeller fields |
| `FlowField` | Grid-interpolated flow |
| `MagneticField` | Multi-pole magnetic |
| `MaskedField` | Field × mask modulation |
| `RadialMask` / `RectMask` | Field mask shapes |
| `DomainWarpField` | Dual-layer coordinate warping |

### Field Operations

```typescript
// Vector field operations
SubtractField, MultiplyField, ScaleField, NormalizeField
ClampField, RotateField, InvertField, BlendField

// Scalar field operations
ScalarAddField, ScalarMultiplyField, ScalarScaleField
ScalarClampField, ScalarInvertField
```

---

## Composition

### Distributions (12 algorithms)

| Class | Description |
|-------|-------------|
| `UniformDistribution` | Regular grid |
| `RandomDistribution` | Seeded random |
| `RadialDistribution` | Center-outward |
| `FlowDistribution` | Field-guided |
| `PoissonDistribution` | Bridson's algorithm |
| `SpiralDistribution` | Parametric spiral |
| `ClusterDistribution` | Gaussian clusters |
| `EdgeDistribution` | Edge-concentrated |
| `CenterDistribution` | Center-concentrated |
| `GoldenDistribution` | Fibonacci/golden angle |
| `OrganicDistribution` | Perturbed grid |
| `GridDistribution` | Strict grid + jitter |

### Advanced Composition

```typescript
applyNegativeSpace(points, regions): Point[]
applySymmetry(points, config, seed): Point[]
assignHierarchy(points, config, seed): HierarchyAssignment[]
assignDepth(points, config, seed): DepthAssignment[]
applyRhythm(count, config, seed): number[]
```

---

## Motion

### Motion Types (9 types)

| Class | Description |
|-------|-------------|
| `FlowMotion` | Field-guided flow |
| `DriftMotion` | Gentle drift |
| `WaveMotion` | Sinusoidal wave |
| `BreathingMotion` | Scale oscillation |
| `OrbitMotion` | Circular orbit |
| `PulseMotion` | Pulse effect |
| `RotationMotion` | Continuous rotation |
| `ParallaxMotion` | Depth parallax |
| `MorphMotion` | Multi-point morph |

### Motion Composition

```typescript
MotionComposer    // Priority + weight blending
ReducedMotion     // Accessibility wrapper
prefersReducedMotion(): boolean
```

---

## Material

### Color

```typescript
parseHexColor(hex: string): RGBColor
parseCSSColor(css: string): RGBColor
rgbToOKLab(rgb: RGBColor): OKLabColor
okLabToRGB(oklab: OKLabColor): RGBColor
okLabToCSS(oklab: OKLabColor): string
interpolateOKLab(color1: string, color2: string, t: number): string
```

### Material Effects

```typescript
createGlow(config): GlowEffect
createBlur(config): BlurEffect
createGrain(config): GrainEffect
createNoiseTexture(config): NoiseTextureEffect
createShadow(config): ShadowEffect
sampleGrain(grain, point): number
glowToShadow(glow): ShadowEffect
```

### Material Stack

```typescript
MaterialStack       // Multi-layer material
createMaterialStack(config): MaterialStack
```

### Blend Modes (16 modes)

`normal`, `multiply`, `screen`, `overlay`, `darken`, `lighten`, `color-dodge`, `color-burn`, `hard-light`, `soft-light`, `difference`, `exclusion`, `hue`, `saturation`, `color`, `alpha`

---

## Renderer

### Renderers

| Renderer | Backend | Features |
|----------|---------|----------|
| `Canvas2DRenderer` | Canvas 2D | Full compatibility |
| `WebGLRenderer` | WebGL 1.0 | GPU acceleration, instancing |
| `WebGPURenderer` | WebGPU | Max performance, compute |

### Renderer Selection

```typescript
selectRenderer(context): RendererSelectionResult        // Sync (WebGL/Canvas2D)
selectRendererAsync(context): Promise<RendererSelectionResult>  // Async (WebGPU first)
detectBestRenderer(): 'webgpu' | 'webgl' | 'canvas2d'
negotiateCapabilities(preset, renderer): CapabilityResult
```

### Compositing & Post-processing

```typescript
createDefaultCompositePipeline(scene): CompositePipeline
applyCompositePipeline(pipeline, ctx): void

createDefaultPostProcessPipeline(): PostProcessPipeline
createBloomEffect(config): PostProcessEffect
createDOFEffect(config): PostProcessEffect
createVignetteEffect(config): PostProcessEffect
createFilmGrainEffect(config): PostProcessEffect
createChromaticAberrationEffect(config): PostProcessEffect
postProcessToCSSFilter(effects): string
```

---

## Preset

### Built-in Presets (8)

`FLOW_PRESET`, `AURORA_PRESET`, `WAVE_PRESET`, `RIBBON_PRESET`, `ORGANIC_PRESET`, `ORBITAL_PRESET`, `MESH_PRESET`, `ATMOSPHERE_PRESET`

### Preset Management

```typescript
getPreset(id: string): PresetSchema | undefined
listPresets(): PresetSchema[]
registerPreset(preset: PresetSchema): void

// Versioning
parseVersion(version: string): ParsedVersion
compareVersions(a: string, b: string): -1 | 0 | 1
satisfiesVersion(version: string, minVersion: string): boolean
bumpVersion(version: string, type: 'major' | 'minor' | 'patch'): string

// Validation
validatePreset(preset: PresetSchema): ValidationResult

// Performance
getPerformanceConstraints(profile: PerformanceProfile): PerformanceConstraints
inferPerformanceProfile(preset: PresetSchema): PerformanceProfile
scalePresetForProfile(preset: PresetSchema, profile: PerformanceProfile): PresetSchema

// Negotiation
negotiatePreset(preset, rendererCaps, profile): NegotiationResult
```

---

## CSS Integration

```typescript
parseCSSVariables(element: HTMLElement): Partial<SemanticArtConfig>
createCSSObserver(element, callback): { disconnect(): void }
semanticToCSSVariables(semantic: SemanticArtConfig): Record<string, string>

// Responsive
createResponsiveManager(breakpoints?): ResponsiveManager
mergeResponsiveConfig(base, overrides): SemanticArtConfig
DEFAULT_BREAKPOINTS: ResponsiveBreakpoint[]
```

---

## Plugin System

```typescript
interface Plugin {
  meta: PluginMeta
  install(ctx: PluginContext): void
}

pluginRegistry.install(plugin): void
pluginRegistry.uninstall(name: string): void
pluginRegistry.list(): PluginMeta[]
installPlugin(plugin): void
uninstallPlugin(name: string): void
listPlugins(): PluginMeta[]
registerCustomPreset(preset: PresetSchema): void
```

---

## Framework Adapters

### React

```typescript
createCanvasAdapter(props: GenerativeArtCanvasProps): { instance, canvas }
updateCanvasAdapter(instance, props): void
resizeCanvasAdapter(instance, width, height): void
destroyCanvasAdapter(instance): void
```

### Vue

```typescript
createVueAdapter(props: GenerativeArtVueProps): { instance, canvas }
updateVueAdapter(instance, props): void
destroyVueAdapter(instance): void
```

### Auto Init

```typescript
autoInit(root?: HTMLElement | Document): AutoInitResult
// Scans DOM for [data-generative-art] elements
```

### Web Component

```typescript
registerWebComponent(): void
isWebComponentRegistered(): boolean
// <generative-art preset="flow" density="0.6"></generative-art>
```

---

## Performance

```typescript
// Tier system (0=low → 3=maximum)
getTierConfig(tier: PerformanceTier): TierConfig
clampTier(tier: PerformanceTier): PerformanceTier

// Device detection
detectDevice(): DeviceInfo
detectInitialTier(): PerformanceTier

// FPS monitoring
new FPSMonitor(windowSize?): FPSMonitor
// .start(), .stop(), .tick(time), .fps, .averageFps

// Adaptive performance
new AdaptivePerformance(config?): AdaptivePerformance
// .update(fps): PerformanceTier

// Render quality
getRenderQuality(tier): RenderQualitySettings
scaleRenderQuality(settings, factor): RenderQualitySettings
```

---

## Worker

```typescript
WorkerManager              // Worker pool management
createWorkerManager(config): WorkerManager
createFieldWorker(): WorkerManager
computeFieldInWorker(manager, payload): Promise<Float32Array>
createMotionWorker(): WorkerManager
computeMotionInWorker(manager, payload): Promise<Float32Array>
```

---

## Tools

```typescript
// Performance panel
PerfPanel                  // Real-time monitoring overlay
createPerfPanel(config?): PerfPanel

// Preset validator
validatePresetJSON(json: string): ValidationResult
validatePresetObject(preset: unknown): ValidationResult
formatValidationResult(result: ValidationResult): string

// Marketplace
PresetLoader              // Preset loading + caching
createPresetLoader(api): PresetLoader
createMockMarketplaceAPI(): MarketplaceAPI
```

---

## Entry Points

| Import | Description |
|--------|-------------|
| `@regalpine/generative-art` | Main package (all exports) |
| `@regalpine/generative-art/auto` | Auto-init (tree-shakeable) |
| `@regalpine/generative-art/styles.css` | Default CSS |
