// ─── Core ────────────────────────────────────────────────────────────────────
export { createGenerativeArt } from './core/runtime'
export { LifecycleState, createLifecycleStateMachine } from './core/lifecycle'
export type { LifecycleStateMachine } from './core/lifecycle'
export { createSeed } from './core/seed'
export type { Seed } from './core/seed'
export { normalizeConfig, normalizeSemanticConfig, DEFAULT_SEMANTIC } from './core/config'
export { createScheduler } from './core/scheduler'
export type { Scheduler, SchedulerCallback } from './core/scheduler'
export {
  vecAdd, vecSub, vecScale, vecLength, vecNormalize, vecDot, vecPerp,
  pointDistance, lerp, clamp, clamp01, smoothstep,
  pointToVec, vecToPoint,
} from './core/math'

export type {
  GenerativeArt,
  GenerativeArtConfig,
  SemanticArtConfig,
  Viewport,
  Scene,
  SceneLayer,
} from './core/types'

// ─── Geometry ────────────────────────────────────────────────────────────────
export type {
  Point, Vector, Bounds, Curve, Geometry, GeometryConfig, GeometryGenerator, TransformMatrix,
} from './geometry/types'
export {
  CurveGeometry, transformPoint, identityMatrix, translateMatrix, rotateMatrix, scaleMatrix, composeMatrix,
  buildArcLengthTable, tAtArcLength, sampleUniform,
} from './geometry'
export type { ArcLengthEntry } from './geometry'
export { Polyline } from './geometry/polyline'
export { QuadraticBezier, CubicBezier } from './geometry/bezier'
export { Spline } from './geometry/spline'
export { Circle } from './geometry/circle'
export { Wave } from './geometry/wave'
export type { WaveConfig } from './geometry/wave'
export { Ribbon } from './geometry/ribbon'
export type { RibbonConfig } from './geometry/ribbon'
export { DefaultGeometryGenerator } from './geometry/generator'

// ─── Field ───────────────────────────────────────────────────────────────────
export type {
  Field, FieldContext, ScalarField, VectorField,
  NoiseFieldConfig, ForceFieldConfig, NoiseSource, FieldMask, DomainWarpConfig,
} from './field/types'
export { createSimplexNoise } from './field/noise'
export { createFractalNoise } from './field/fractal'
export type { FractalNoiseConfig } from './field/fractal'
export {
  ScalarNoiseField, VectorNoiseField, CurlField,
  CompositeField, TransformField,
  createForceField, applyFalloff,
} from './field/fields'
export type { FalloffType } from './field/fields'
// Field operations
export {
  SubtractField, MultiplyField, ScaleField, NormalizeField,
  ClampField, RotateField, InvertField, BlendField,
  ScalarAddField, ScalarMultiplyField, ScalarScaleField,
  ScalarClampField, ScalarInvertField,
} from './field/operations'
// Advanced fields
export {
  FlowField, MagneticField, MaskedField, RadialMask, RectMask, DomainWarpField,
} from './field/advanced'

// ─── Composition ─────────────────────────────────────────────────────────────
export type {
  Composition, CompositionConfig, CompositionContext, CompositionLayer,
  DistributionConfig, FocusConfig, DepthConfig, RhythmConfig,
} from './composition/types'
export {
  UniformDistribution, RandomDistribution, RadialDistribution, FlowDistribution,
  createDistribution,
} from './composition/distribution'
export type { Distribution, DistributionContext } from './composition/distribution'
export { DefaultComposition, DEFAULT_COMPOSITION } from './composition/composition'
// Additional distributions
export {
  PoissonDistribution, SpiralDistribution, ClusterDistribution,
  EdgeDistribution, CenterDistribution, GoldenDistribution,
  OrganicDistribution, GridDistribution,
} from './composition/distributions'
// Advanced composition
export {
  applyNegativeSpace, applySymmetry, assignHierarchy, assignDepth, applyRhythm,
  DEFAULT_HIERARCHY, DEFAULT_DEPTH, DEFAULT_RHYTHM,
} from './composition/advanced'
export type {
  ProtectedRegion, SymmetryMode, SymmetryConfig,
  HierarchyLevel, HierarchyConfig, HierarchyAssignment,
  DepthAssignment,
} from './composition/advanced'

// ─── Motion ──────────────────────────────────────────────────────────────────
export type {
  Motion, MotionState, MotionContext, MotionConfig, MotionChannel,
} from './motion/types'
export {
  FlowMotion, DriftMotion, WaveMotion, BreathingMotion,
  createMotion,
} from './motion/motions'
// Additional motions
export {
  OrbitMotion, PulseMotion, RotationMotion, ParallaxMotion, MorphMotion,
  MotionComposer, ReducedMotion, prefersReducedMotion,
} from './motion/additional'
export type { MotionLayer } from './motion/additional'

// ─── Material ────────────────────────────────────────────────────────────────
export type {
  Material, MaterialConfig, MaterialContext, ResolvedMaterial,
  ColorConfig, GradientConfig, GradientStop, GlowConfig, BlendMode,
} from './material/types'
export {
  parseHexColor, parseCSSColor, rgbToOKLab, okLabToRGB, okLabToCSS, interpolateOKLab,
} from './material/color'
export type { OKLabColor, RGBColor } from './material/color'
export {
  resolveMaterial, blendModeToCompositeOperation, semanticToMaterialOverrides, DEFAULT_MATERIAL,
} from './material/resolver'
// Material effects
export {
  createGlow, createBlur, createGrain, createNoiseTexture, createShadow,
  glowToShadow, sampleGrain,
} from './material/effects'
export type {
  GlowEffect, BlurEffect, GrainEffect, NoiseTextureEffect, ShadowEffect, MaterialEffect,
} from './material/effects'
// Material stack
export { MaterialStack, createMaterialStack } from './material/stack'
export type { MaterialLayer } from './material/stack'
// Blend modes
export { blendModeToCompositeOp, isBlendModeSupported, ALL_BLEND_MODES } from './material/blend'
export type { ExtendedBlendMode } from './material/blend'

// ─── Renderer ────────────────────────────────────────────────────────────────
export type {
  Renderer, RendererCapabilities, RenderContext, RenderFrameContext,
  RenderScene, RenderLayer, DrawCommand, RenderQuality,
} from './renderer/types'
export { Canvas2DRenderer, createCanvas2DRenderer } from './renderer/canvas2d'
export { WebGLRenderer, createWebGLRenderer } from './renderer/webgl'
export { WebGPURenderer, createWebGPURenderer } from './renderer/webgpu'
export { negotiateCapabilities, detectBestRenderer } from './renderer/capabilities'
export type { PresetRendererRequirements, CapabilityResult } from './renderer/capabilities'
export { selectRenderer, selectRendererAsync, createRenderer } from './renderer/selector'
export type { RendererSelectionResult } from './renderer/selector'
// WebGPU utilities
export { isWebGPUAvailable, requestWebGPUDevice } from './renderer/webgpu/pipeline'
export { blendModeToWebGPU } from './renderer/webgpu/material'
export type { WebGPUBlendParams } from './renderer/webgpu/material'

// ─── Preset ──────────────────────────────────────────────────────────────────
export type { PresetSchema, PresetRegistry } from './preset/types'
export type { PresetConfig as PresetReference } from './preset/types'
export { presetRegistry, registerPreset, getPreset, listPresets } from './preset/registry'
export {
  FLOW_PRESET, AURORA_PRESET, WAVE_PRESET,
  RIBBON_PRESET, ORGANIC_PRESET, ORBITAL_PRESET,
  MESH_PRESET, ATMOSPHERE_PRESET,
  BUILT_IN_PRESETS,
} from './preset/built-in'
export { parseVersion, compareVersions, satisfiesVersion, formatVersion, bumpVersion } from './preset/version'
export type { ParsedVersion } from './preset/version'
export { validatePreset, validatePresetConstraints } from './preset/validation'
export type { ValidationError, ValidationResult } from './preset/validation'
export {
  getPerformanceConstraints, inferPerformanceProfile,
  isPresetCompatible, scalePresetForProfile,
} from './preset/performance'
export type { PerformanceProfile, PerformanceConstraints } from './preset/performance'
export { negotiatePreset } from './preset/negotiation'
export type { NegotiationResult } from './preset/negotiation'

// ─── CSS ─────────────────────────────────────────────────────────────────────
export { parseCSSVariables, createCSSObserver, semanticToCSSVariables, CSS_VARIABLES } from './css/parser'
export { createResponsiveManager, mergeResponsiveConfig, DEFAULT_BREAKPOINTS } from './css/responsive'
export type { ResponsiveBreakpoint, ResponsiveConfig } from './css/responsive'

// ─── Plugin ──────────────────────────────────────────────────────────────────
export type { Plugin, PluginMeta, PluginContext, PluginEntry, PluginState } from './plugin/types'
export type { FieldFactory, MotionFactory, MaterialFactory } from './plugin/types'
export { pluginRegistry, installPlugin, uninstallPlugin, listPlugins } from './plugin/registry'
export { registerCustomPreset } from './plugin/register'

// ─── Adapter ────────────────────────────────────────────────────────────────
export { createCanvasAdapter, updateCanvasAdapter, resizeCanvasAdapter, destroyCanvasAdapter } from './adapter/react'
export type { GenerativeArtCanvasProps } from './adapter/react'
export { createVueAdapter, updateVueAdapter, destroyVueAdapter } from './adapter/vue'
export type { GenerativeArtVueProps } from './adapter/vue'
export { autoInit } from './adapter/auto'
export type { AutoInitResult } from './adapter/auto'
export type { GenerativeArtElement } from './adapter/web-component'
export { registerWebComponent, isWebComponentRegistered, WEB_COMPONENT_TAG } from './adapter/web-component'

// ─── Performance ────────────────────────────────────────────────────────────
export type { PerformanceTier, TierConfig } from './performance/tier'
export { getTierConfig, clampTier, TIER_LABELS } from './performance/tier'
export type { DeviceInfo } from './performance/detect'
export { detectDevice, detectInitialTier } from './performance/detect'
export { FPSMonitor, createFPSMonitor } from './performance/monitor'
export type { FPSMonitorState } from './performance/monitor'
export { AdaptivePerformance, createAdaptivePerformance, DEFAULT_ADAPTIVE_CONFIG } from './performance/adaptive'
export type { AdaptiveConfig } from './performance/adaptive'
export { getRenderQuality, scaleRenderQuality } from './performance/quality'
export type { RenderQualitySettings } from './performance/quality'

// ─── Worker ─────────────────────────────────────────────────────────────────
export { createWorkerManager, WorkerManager, DEFAULT_WORKER_CONFIG } from './worker/manager'
export type { WorkerManagerConfig, WorkerState } from './worker/manager'
export { createWorkerRequest, createWorkerResponse, getTransferables } from './worker/protocol'
export type {
  WorkerRequest, WorkerResponse, WorkerRequestType, WorkerResponseType,
  WorkerMessage, WorkerInitPayload, WorkerFieldPayload, WorkerFieldResult,
  WorkerMotionPayload, WorkerMotionResult,
} from './worker/protocol'
export { createFieldWorker, computeFieldInWorker } from './worker/field'
export { createMotionWorker, computeMotionInWorker } from './worker/motion'

// ─── Offscreen ──────────────────────────────────────────────────────────────
export { OffscreenRenderer, createOffscreenRenderer, isOffscreenCanvasAvailable } from './renderer/offscreen'

// ─── Compositing & Post-processing ───────────────────────────────────────────
export { createDefaultCompositePipeline, applyCompositePipeline, compositeOpToCanvas2D } from './renderer/compositing'
export type { CompositeOperation, CompositeLayer, CompositePipeline } from './renderer/compositing'
export {
  createDefaultPostProcessPipeline, createBloomEffect, createDOFEffect,
  createVignetteEffect, createFilmGrainEffect, createChromaticAberrationEffect,
  postProcessToCSSFilter,
} from './renderer/postprocess'
export type {
  PostProcessEffectType, PostProcessEffect, PostProcessPipeline,
  BloomConfig, DOFConfig, VignetteConfig,
} from './renderer/postprocess'

// ─── Tools ──────────────────────────────────────────────────────────────────
export { PerfPanel, createPerfPanel, DEFAULT_PERF_PANEL_CONFIG } from './tools/perf-panel'
export type { PerfPanelConfig, PerfStats } from './tools/perf-panel'
export { validatePresetJSON, validatePresetObject, formatValidationResult } from './tools/preset-validator'
export type { PresetFileResult } from './tools/preset-validator'

// ─── Marketplace ─────────────────────────────────────────────────────────────
export { PresetLoader, createPresetLoader, createMockMarketplaceAPI } from './marketplace'
export type {
  MarketplacePresetMeta, MarketplaceSearchQuery, MarketplaceSearchResult,
  PresetCacheEntry, MarketplaceAPI,
} from './marketplace'
