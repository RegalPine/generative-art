# Generative Geometric Art Engine
## Renderer Contract V1.9

> **Status:** Draft → Converged Target  
> **Version:** V1.9  
> **Scope:** Renderer / RenderContext / Capability / Render Lifecycle  
> **Previous:** CSS Variable Specification V1.8  
> **Next:** NPM Package Contract V2.0

---

# 1. 文档目标

Renderer 是 Generative Geometric Art Engine 的最终呈现层。

核心定义：

> **Renderer = Presentation**

Renderer 接收已经解析完成的：

```text
Scene
Geometry
Material
Viewport
```

并将其转换为：

```text
Canvas / WebGL / WebGPU
        ↓
Actual Pixels
```

---

# 2. Renderer 在整体架构中的位置

```text
Application
     │
     ▼
Preset
     │
     ▼
Semantic Runtime
     │
     ├── Geometry
     ├── Field
     ├── Composition
     ├── Motion
     └── Material
             │
             ▼
        Scene Runtime
             │
             ▼
       Resolved Scene
             │
             ▼
        Renderer Contract
             │
      ┌──────┼──────┐
      ▼      ▼      ▼
   Canvas2D WebGL WebGPU
```

---

# 3. Renderer 核心原则

Renderer 必须：

```text
Deterministic
Capability-aware
Lifecycle-safe
Renderer-independent upstream
Performance-aware
Replaceable
```

Renderer 不应该：

- 创建 Preset
- 修改 Geometry 语义
- 修改 Composition
- 修改 Motion
- 修改 Material 定义
- 读取 CSS
- 访问应用业务状态

---

# 4. Renderer Interface

统一接口：

```ts id="f5z8q2"
interface Renderer {
  readonly type: string
  readonly capabilities: RendererCapabilities

  initialize(
    context: RenderContext
  ): void

  resize(
    viewport: Viewport
  ): void

  render(
    scene: Scene,
    context: RenderFrameContext
  ): void

  pause(): void

  resume(): void

  dispose(): void
}
```

---

# 5. Renderer 生命周期

```text id="m7q3x9"
CREATED
   │
   ▼
INITIALIZED
   │
   ▼
READY
   │
   ▼
RENDERING
   │
   ├────► PAUSED
   │        │
   │        └──► RENDERING
   │
   ▼
DISPOSED
```

非法状态转换必须被拒绝或安全忽略。

---

# 6. Renderer Initialization

```ts id="p4n8r5"
interface RenderContext {
  canvas: HTMLCanvasElement
  width: number
  height: number
  dpr: number
  capabilities: RendererCapabilities
}
```

Renderer 不负责：

```text
canvas discovery
DOM querying
preset loading
CSS reading
```

这些属于 Runtime。

---

# 7. Render Frame Context

```ts id="x6m2q8"
interface RenderFrameContext {
  time: number
  delta: number
  viewport: Viewport
  dpr: number
  quality: RenderQuality
}
```

---

# 8. Render Loop

Renderer 不拥有完整 Application Runtime Loop。

推荐：

```text id="q9v4m6"
Runtime Scheduler
       │
       ├── update Geometry
       ├── update Field
       ├── update Composition
       ├── update Motion
       ├── resolve Material
       │
       ▼
Renderer.render()
```

因此：

> Renderer 是被 Runtime 驱动，而不是驱动整个 Runtime。

---

# 9. Animation Frame

默认使用：

```ts id="g7x3n1"
requestAnimationFrame()
```

但：

> requestAnimationFrame 不属于 Renderer Contract。

Scheduler 可以未来支持：

- requestAnimationFrame
- fixed timestep
- external clock
- offscreen worker scheduling

---

# 10. Viewport

```ts id="v5m8q2"
interface Viewport {
  width: number
  height: number
  dpr: number
  aspectRatio: number
}
```

---

# 11. DPR

Renderer 必须支持：

```text id="n3x7p9"
CSS Pixels
      │
      × DPR
      │
      ▼
Physical Pixels
```

例如：

```text id="8q4m1z"
width = 1000 CSS px
DPR = 2

canvas width = 2000 physical px
```

---

# 12. DPR 限制

不能无限放大。

推荐：

```ts id="w6p3r8"
effectiveDpr =
  min(devicePixelRatio, maxDpr)
```

默认建议：

```text id="q8m5x2"
maxDpr = 2
```

高端设备可以由配置提升。

---

# 13. Resize

Renderer 必须支持：

```ts id="m4n9z6"
resize(viewport: Viewport): void
```

Resize 流程：

```text id="c7x2p8"
ResizeObserver
      │
      ▼
Viewport Update
      │
      ▼
Runtime
      │
      ▼
Renderer.resize()
```

---

# 14. Resize 不应重建 Renderer

默认：

```text id="r5q8m3"
Resize
  ↓
Update viewport
  ↓
Resize resources
```

而不是：

```text id="v7x4n2"
Resize
  ↓
Destroy
  ↓
Create Renderer
```

---

# 15. Renderer Capabilities

```ts id="k3m7p9"
interface RendererCapabilities {
  type: string
  maxTextureSize?: number
  supportsBlendModes: string[]
  supportsBlur: boolean
  supportsGlow: boolean
  supportsOffscreen: boolean
  supportsInstancing: boolean
  supportsHighDensity: boolean
}
```

---

# 16. Capability Registry

```ts id="x8q4m1"
interface RendererCapabilityRegistry {
  register(
    capability: RendererCapabilities
  ): void

  get(
    rendererType: string
  ): RendererCapabilities | undefined
}
```

---

# 17. Capability Negotiation

完整流程：

```text id="f6n2r8"
Preset Requirements
       │
       ▼
Renderer Capabilities
       │
       ▼
Capability Negotiator
       │
       ├── Full Support
       ├── Partial Support
       └── Unsupported
```

---

# 18. Capability Result

```ts id="p7m4x9"
interface CapabilityResult {
  supported: boolean
  degraded: boolean
  unsupported: string[]
  fallbacks: string[]
}
```

---

# 19. Renderer Selection

默认优先级：

```text id="z4q8m2"
WebGPU
   ↓
WebGL
   ↓
Canvas2D
```

但是：

> Renderer 能力必须优先于理论优先级。

---

# 20. Renderer Preference

用户可以：

```ts id="c6n3p8"
createGenerativeArt({
  renderer: 'canvas2d'
})
```

或者：

```ts id="m9x4q7"
renderer: 'auto'
```

默认：

```text id="w5r2k8"
auto
```

---

# 21. Auto Renderer

```text id="j7q3m6"
auto
 │
 ▼
Detect WebGPU
 │
 ├── yes → WebGPU
 │
 └── no
      │
      ▼
   Detect WebGL
      │
      ├── yes → WebGL
      │
      └── no
           │
           ▼
        Canvas2D
```

---

# 22. Renderer Fallback

如果 Renderer 初始化失败：

```text id="n8p4x2"
WebGPU
   │
   X
   ▼
WebGL
   │
   X
   ▼
Canvas2D
```

Fallback 必须：

- 记录原因
- 触发诊断事件
- 保持 Scene 不变
- 尽量不影响应用

---

# 23. Canvas2D Renderer

Canvas2D 是 MVP Renderer。

```ts id="y4m8q3"
class Canvas2DRenderer implements Renderer
```

职责：

```text id="x5n7p2"
Path
Line
Curve
Fill
Stroke
Gradient
Opacity
Blend
Shadow
Basic Blur
```

---

# 24. Canvas2D 边界

Canvas2D Renderer 不应该负责：

```text id="q8m3r6"
Geometry generation
Noise calculation
Motion calculation
Composition
Preset resolution
```

它只消费结果。

---

# 25. WebGL Renderer

WebGL 属于 P1。

主要用于：

```text id="p6x2m9"
High instance count
GPU batching
GPU effects
Advanced compositing
Large scenes
```

---

# 26. WebGL Renderer 边界

WebGL Renderer 可以使用：

```text id="v7q4n8"
Shader
Buffer
Texture
Framebuffer
Instancing
```

但这些都是 Renderer 内部实现。

不暴露到核心 Scene Model。

---

# 27. WebGPU Renderer

WebGPU 属于 P1/P2，取决于浏览器生态与 MVP 时间点。

目标：

```text id="f9m5x3"
Large scale generative art
GPU compute
Advanced material
High density geometry
```

---

# 28. WebGPU 不改变语义模型

无论：

```text id="c8n4p7"
Canvas2D
WebGL
WebGPU
```

输入始终：

```text id="s5x2m8"
Scene
```

而不是：

```text id="e7q9r3"
Shader-specific Scene
```

---

# 29. Scene Contract

Renderer 消费：

```ts id="m6p3x8"
interface Scene {
  layers: SceneLayer[]
  width: number
  height: number
  time: number
  background?: Background
}
```

---

# 30. Scene Layer

```ts id="q4n8m2"
interface SceneLayer {
  id: string
  zIndex: number
  geometries: Geometry[]
  material: Material
  opacity: number
  blendMode?: BlendMode
}
```

Renderer 按：

```text id="r7x5p9"
zIndex
```

排序。

---

# 31. Rendering Order

```text id="n2m8q4"
Background
    ↓
Atmosphere
    ↓
Structure
    ↓
Flow
    ↓
Accent
    ↓
Foreground
```

但实际顺序由：

```ts id="x6p3r7"
zIndex
```

决定。

---

# 32. Geometry Rendering Contract

Renderer 不要求所有 Geometry 使用同一种 API。

统一要求：

```ts id="f8q4m2"
interface RenderableGeometry {
  readonly type: string
  getRenderData(): RenderGeometryData
}
```

---

# 33. Render Geometry Data

```ts id="p5n7x3"
interface RenderGeometryData {
  kind: string
  points?: Float32Array
  indices?: Uint32Array
  attributes?: Record<string, Float32Array>
}
```

这样可以同时支持：

```text id="m9x2q6"
Path
Polyline
Mesh
Ribbon
Instanced Geometry
```

---

# 34. Geometry → Renderer

```text id="c4r8m1"
Semantic Geometry
      │
      ▼
Render Geometry Data
      │
      ▼
Renderer
```

这是重要的解耦层。

---

# 35. Material → Renderer

```text id="q7x3m9"
Resolved Material
      │
      ▼
Material Adapter
      │
      ├── Canvas2D
      ├── WebGL
      └── WebGPU
```

---

# 36. Material Adapter

```ts id="v8n4p2"
interface MaterialAdapter {
  apply(
    material: ResolvedMaterial,
    context: RenderContext
  ): void
}
```

Renderer 不需要知道：

> Material 是如何产生的。

---

# 37. Background

Background 可以是：

```ts id="m3q7x9"
interface Background {
  type: 'solid' | 'gradient'
  color?: Color
  gradient?: Gradient
}
```

未来可以扩展：

```text id="j8p4r5"
image
video
shader
```

但不进入 V1.9 MVP。

---

# 38. Offscreen Rendering

Renderer 可以使用 Offscreen Surface：

```text id="n5x2m8"
Scene
 │
 ▼
Offscreen Surface
 │
 ├── Blur
 ├── Glow
 └── Composite
 │
 ▼
Main Surface
```

Offscreen 是实现细节。

---

# 39. Offscreen Contract

```ts id="y7m4q3"
interface RenderSurface {
  width: number
  height: number
  resize(width: number, height: number): void
  dispose(): void
}
```

Renderer 自行决定是否使用。

---

# 40. Frame Budget

Runtime 应尽量控制：

```text id="p8x3n6"
Frame Budget ≈ 16.67ms
```

目标：

```text
60 FPS
```

但不能把 60 FPS 作为绝对保证。

---

# 41. Adaptive Quality

定义：

```ts id="c5m9q2"
interface RenderQuality {
  level: number
  geometryDensity: number
  effectQuality: number
  resolutionScale: number
}
```

范围：

```text id="x7r4m8"
0.0 ───────────── 1.0
```

---

# 42. Quality Degradation

性能不足时：

```text id="m6p2q9"
Full
 │
 ├── Geometry Density ↓
 ├── Effects ↓
 ├── Blur Quality ↓
 ├── Glow ↓
 └── Resolution Scale ↓
```

原则：

> 保持视觉构图优先于视觉特效。

---

# 43. Performance Monitor

Renderer 可以提供：

```ts id="n4x8p3"
interface RenderMetrics {
  fps: number
  frameTime: number
  drawCalls?: number
  geometryCount?: number
  textureMemory?: number
}
```

主要用于 Debug / DevTools。

---

# 44. Performance Monitor 不进入核心 Scene

Metrics 属于：

```text id="q5m7x2"
Diagnostics
```

而不是：

```text id="j8r3n6"
Scene
```

---

# 45. Render Error

定义：

```ts id="v4p8m1"
class RendererError extends Error {
  code:
    | 'INITIALIZATION_FAILED'
    | 'CONTEXT_LOST'
    | 'UNSUPPORTED'
    | 'RESOURCE_LIMIT'
    | 'RENDER_FAILED'
}
```

---

# 46. Context Lost

WebGL/WebGPU 可能发生上下文丢失。

流程：

```text id="m7x3q9"
Rendering
    │
    ▼
Context Lost
    │
    ▼
Recover
    │
    ├── success → Rendering
    │
    └── fail → Fallback Renderer
```

---

# 47. Renderer Recovery

恢复优先级：

```text id="c8p4n6"
same renderer recovery
       ↓
lower renderer
       ↓
Canvas2D
       ↓
Static fallback
```

---

# 48. Static Fallback

所有 Renderer 都不可用时：

```text id="r5m8x2"
Animated Art
     ↓
Static Scene
```

应用不应因此产生：

```text
blank screen
fatal error
```

---

# 49. Visibility Optimization

Renderer 可以暂停绘制：

```text id="x7n3q5"
Page hidden
     ↓
Pause Render
```

恢复：

```text id="m4p8r2"
Page visible
     ↓
Resume
```

---

# 50. Intersection Optimization

如果目标元素不可见：

```text id="q9x2m6"
IntersectionObserver
      ↓
not intersecting
      ↓
pause / reduce render
```

Renderer 不直接创建 IntersectionObserver。

Runtime 管理。

---

# 51. Renderer 不访问 DOM

Renderer 可以持有：

```ts id="p3n7x8"
HTMLCanvasElement
```

但不应该：

```ts id="z5m2q4"
document.querySelector(...)
window.innerWidth
getComputedStyle(...)
```

这些属于 Integration / Runtime。

---

# 52. Renderer 不访问 Application State

禁止：

```text id="r8x4m1"
Redux
Vue Store
React Context
Business API
Router
```

Renderer 必须保持：

> Application-agnostic。

---

# 53. Renderer Plugin

Renderer 可以通过 Registry 注册。

```ts id="k6p9x3"
interface RendererRegistry {
  register(
    type: string,
    factory: RendererFactory
  ): void

  get(
    type: string
  ): RendererFactory | undefined

  list(): string[]
}
```

---

# 54. Renderer Factory

```ts id="n4m8q2"
interface RendererFactory {
  create(
    context: RendererCreationContext
  ): Renderer
}
```

---

# 55. Renderer Creation Context

```ts id="x7p3r9"
interface RendererCreationContext {
  canvas: HTMLCanvasElement
  viewport: Viewport
  options: RendererOptions
}
```

---

# 56. Renderer Options

Renderer Options 只能描述：

```text id="m5q8x2"
preference
quality
debug
```

例如：

```ts id="v3n7p4"
interface RendererOptions {
  quality?: number
  antialias?: boolean
  debug?: boolean
}
```

不得暴露底层 GPU pipeline 作为公共核心 API。

---

# 57. Renderer Configuration Priority

```text id="c8m4r7"
Default
   ↓
Preset Requirements
   ↓
Application Renderer Preference
   ↓
Runtime Capability
   ↓
Resolved Renderer
```

---

# 58. Renderer Selection Result

```ts id="p6x2n9"
interface RendererSelection {
  requested: string
  selected: string
  fallback: boolean
  capabilities: RendererCapabilities
}
```

---

# 59. Renderer Contract 流程

```text id="q4n8m3"
Preset
  │
  ▼
Requirements
  │
  ▼
Renderer Selection
  │
  ▼
Capability Negotiation
  │
  ▼
Renderer Creation
  │
  ▼
Initialize
  │
  ▼
Resize
  │
  ▼
Render Loop
  │
  ▼
Pause / Resume
  │
  ▼
Dispose
```

---

# 60. Canvas2D MVP Contract

V1.9 MVP：

```text id="x5m7q2"
Canvas2D
├── initialize
├── resize
├── render
├── pause
├── resume
├── dispose
├── opacity
├── color
├── gradient
├── blend
├── basic shadow
├── basic blur
└── basic glow
```

---

# 61. WebGL P1

```text id="r3p8m5"
WebGL
├── batching
├── instancing
├── GPU geometry
├── advanced blend
├── framebuffer effects
└── high density rendering
```

---

# 62. WebGPU P1/P2

```text id="m9x4q7"
WebGPU
├── compute
├── GPU noise
├── GPU motion
├── advanced post-processing
└── high density scenes
```

但这些不会修改上层语义模型。

---

# 63. Renderer Test Contract

每个 Renderer 必须测试：

```text id="n6p3x8"
Initialization
Resize
Render
Pause
Resume
Dispose
DPR
Empty Scene
Large Scene
Context Loss
Fallback
Unsupported Feature
```

---

# 64. Deterministic Rendering

相同：

```text id="c7m4q2"
Scene
Viewport
Renderer
Quality
```

应产生尽可能一致的输出。

不同 Renderer：

> 不要求像素级完全一致。

只要求：

```text id="x8n5p1"
Semantic Equivalence
```

---

# 65. Semantic Equivalence

Canvas2D 与 WebGL 可以存在视觉差异：

```text id="q5r8m3"
Glow radius
Antialiasing
Blend behavior
Gradient interpolation
```

但必须保持：

```text
Composition
Geometry identity
Color intent
Motion intent
Material intent
```

---

# 66. Renderer Conformance

定义：

```ts id="m3x7p9"
interface RendererConformance {
  verify(
    renderer: Renderer
  ): ConformanceResult
}
```

---

# 67. Conformance Result

```ts id="v8q4m2"
interface ConformanceResult {
  valid: boolean
  capabilities: RendererCapabilities
  failures: ConformanceFailure[]
}
```

---

# 68. Renderer Quality Levels

```text id="p6m9x3"
Level 0
Basic Renderer

Level 1
Material Renderer

Level 2
High Density Renderer

Level 3
Advanced GPU Renderer
```

Canvas2D：

> Level 1 MVP

WebGL：

> Level 2

WebGPU：

> Level 3

---

# 69. V1.9 MVP

必须完成：

```text id="r4x8m2"
Renderer Interface
RenderContext
RenderFrameContext
Viewport
DPR
Lifecycle
Resize
Canvas2D Renderer
Capabilities
Capability Negotiation
Renderer Selection
Fallback
Material Adapter
Geometry Render Data
Render Quality
Performance Budget
Visibility Integration
Error Handling
Conformance
```

---

# 70. V1.9 P1

```text id="n7q3p5"
WebGL Renderer
Instancing
Batching
Advanced Offscreen
Adaptive Quality
Context Recovery
Advanced Material Effects
```

---

# 71. V1.9 P2

```text id="m8x4r1"
WebGPU Renderer
GPU Compute
GPU Motion
GPU Noise
Advanced Post Processing
Worker Rendering
OffscreenCanvas
```

---

# 72. 明确排除

V1.9 不包含：

```text id="q5n8x2"
Full 3D Renderer
Physics Engine
Game Engine
Scene Editor
Shader Editor
Material Editor
GPU DSL
WebGPU-specific public scene model
```

---

# 73. 六层语义正式封口

至此核心生成语义：

```text id="x3m7p9"
Geometry
Field
Composition
Motion
Material
```

执行呈现：

```text id="v8q2n5"
Preset
   ↓
Scene
   ↓
Renderer
```

Web 集成：

```text id="r4m9x6"
HTML
CSS
JavaScript
   ↓
Configuration
```

整体架构：

```text id="c6p3n8"
┌────────────────────────────────────────┐
│              Application               │
├────────────────────────────────────────┤
│         HTML / CSS / JavaScript        │
├────────────────────────────────────────┤
│              Preset                    │
├────────────────────────────────────────┤
│ Geometry │ Field │ Composition         │
│ Motion   │ Material                    │
├────────────────────────────────────────┤
│             Scene Runtime              │
├────────────────────────────────────────┤
│          Renderer Contract             │
├────────────────────────────────────────┤
│ Canvas2D │ WebGL │ WebGPU              │
└────────────────────────────────────────┘
```

---

# 74. V1.x 核心规范收敛

到 V1.9 为止：

```text id="p8m4x7"
V1.0  Architecture
V1.1  Semantic Runtime
V1.4  Composition
V1.5  Motion
V1.6  Material
V1.7  Preset
V1.8  CSS
V1.9  Renderer
```

已经覆盖：

```text
语义
生成
组织
运动
外观
复用
声明式 Web 接入
渲染执行
```

因此：

> **V1.x 不应再新增核心语义层。**

---

# 75. V2.0 进入工程产品化

下一阶段：

> **NPM Package Contract V2.0**

重点不再是继续发明引擎概念，而是把已经完成的规范真正封装为：

```text id="z7x3m5"
@regalpine/generative-art
```

包括：

```text
Package Structure
Entry Points
Public API
Auto Initialization
Tree Shaking
ESM
CJS compatibility strategy
TypeScript Types
CSS Distribution
Preset Distribution
Plugin API
React Adapter
Vue Adapter
Web Component Adapter
SSR
Browser Support
Build
Versioning
Exports
Error Model
Documentation
Examples
Testing
Release
```

V2.0 将是一个重要的**工程收敛点**：

> **不再扩展核心能力，而是把 V1.x 的设计固化成可发布的 NPM 产品。**