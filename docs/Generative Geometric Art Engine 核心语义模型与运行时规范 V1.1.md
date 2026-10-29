# Generative Geometric Art Engine
## 核心语义模型与运行时规范 V1.1

> 文档状态：Draft  
> 基础版本：V1.0  
> 本版本重点：Core Model / Runtime / CSS Integration / Preset / Renderer  
> 实现语言：TypeScript  
> 包形态：NPM  
> 运行环境：Browser

---

# 1. 本版本目标

V1.1 不增加新的产品方向。

本版本解决 V1.0 中定义但尚未充分形式化的核心问题：

1. Generative Art 的运行时对象是什么
2. Geometry、Field、Composition、Motion 如何关联
3. CSS 如何映射到运行时配置
4. Preset 如何定义
5. Scene 如何生成
6. Renderer 如何工作
7. 生命周期如何管理
8. 参数覆盖优先级如何确定
9. 响应式如何处理
10. 如何保证 API 长期稳定

---

# 2. 核心运行模型

系统采用：

```text
Configuration
      ↓
Normalization
      ↓
Seed
      ↓
Generator
      ↓
Scene
      ↓
Animation
      ↓
Renderer
```

完整流程：

```text
HTML / CSS / JS
      ↓
Configuration Resolver
      ↓
Preset Resolver
      ↓
Theme Resolver
      ↓
Semantic Parameters
      ↓
Geometry Generator
      ↓
Field Generator
      ↓
Composition
      ↓
Motion
      ↓
Scene
      ↓
Renderer
```

---

# 3. Runtime Object Model

运行时核心对象：

```text
GenerativeArt
│
├── Configuration
│
├── Generator
│
├── Scene
│
├── Clock
│
├── Renderer
│
├── Interaction
│
└── Lifecycle
```

---

# 4. GenerativeArt

```typescript
interface GenerativeArt {
  start(): void
  pause(): void
  resume(): void
  stop(): void

  resize(): void

  update(
    config: Partial<GenerativeArtConfig>
  ): void

  setPreset(
    preset: string
  ): void

  setTheme(
    theme: string
  ): void

  destroy(): void
}
```

---

# 5. 生命周期

状态：

```text
CREATED
   ↓
INITIALIZED
   ↓
RUNNING
   ↓
PAUSED
   ↓
RUNNING
   ↓
STOPPED
   ↓
DESTROYED
```

---

# 6. 初始化生命周期

```text
createGenerativeArt()
        ↓
Resolve Target
        ↓
Read HTML Attributes
        ↓
Read CSS Variables
        ↓
Resolve Preset
        ↓
Resolve Theme
        ↓
Normalize Configuration
        ↓
Create Seed
        ↓
Create Scene
        ↓
Select Renderer
        ↓
Initialize Renderer
        ↓
INITIALIZED
```

---

# 7. Start 生命周期

```text
start()
  ↓
Create Clock
  ↓
Request Animation Frame
  ↓
Update
  ↓
Render
  ↓
Request Animation Frame
```

---

# 8. Update Loop

每一帧：

```text
Clock
  ↓
Interaction
  ↓
Field
  ↓
Motion
  ↓
Geometry
  ↓
Composition
  ↓
Material
  ↓
Renderer
```

禁止 Geometry 绕过 Scene 直接访问 Renderer。

---

# 9. Configuration

配置分成四层：

```text
Base Defaults
      ↓
Preset
      ↓
Theme
      ↓
User Overrides
```

最终：

```text
Final Configuration
```

---

# 10. 配置优先级

优先级从低到高：

```text
Default
<
Preset
<
Theme
<
CSS
<
Data Attribute
<
JavaScript
<
Runtime update()
```

即：

```text
Runtime
   ↑
JavaScript
   ↑
Data Attribute
   ↑
CSS
   ↑
Theme
   ↑
Preset
   ↑
Default
```

---

# 11. 为什么 CSS 高于 Theme

例如：

```css
.hero {
  --ga-speed: 0.1;
}
```

用户明确指定了速度。

因此必须覆盖 Theme 默认值。

---

# 12. Data Attribute

HTML：

```html
<div
  data-generative-art
  data-art-preset="flow"
  data-art-theme="aurora"
  data-art-seed="100"
  data-art-quality="high">
</div>
```

映射：

```text
data-art-preset
→ preset

data-art-theme
→ theme

data-art-seed
→ seed

data-art-quality
→ quality
```

---

# 13. CSS Variable Resolver

系统读取：

```text
--ga-*
```

作为视觉参数。

例如：

```css
.art {
  --ga-density: 0.6;
  --ga-speed: 0.15;
  --ga-turbulence: 0.2;
}
```

解析：

```typescript
{
  density: 0.6,
  speed: 0.15,
  turbulence: 0.2
}
```

---

# 14. CSS 参数命名规则

统一：

```text
--ga-{domain}-{property}
```

例如：

```text
--ga-geometry-density
--ga-geometry-curvature

--ga-motion-speed
--ga-motion-turbulence

--ga-material-opacity
--ga-material-glow

--ga-composition-focus
```

同时允许简写：

```text
--ga-density
--ga-speed
--ga-glow
```

简写属于 Public Convenience API。

---

# 15. Semantic Configuration

内部配置统一使用语义模型：

```typescript
interface SemanticArtConfig {
  density: number
  complexity: number
  energy: number
  softness: number
  depth: number
  rhythm: number
  turbulence: number
  focus: number
}
```

---

# 16. Semantic → Mathematical Mapping

例如：

```text
density
 ↓
Geometry Count

complexity
 ↓
Curve Complexity

energy
 ↓
Motion Amplitude

softness
 ↓
Curvature + Blur

depth
 ↓
Layer Distribution

rhythm
 ↓
Motion Frequency

turbulence
 ↓
Field Noise

focus
 ↓
Composition Weight
```

用户不需要理解数学模型。

---

# 17. Geometry Model

```typescript
interface Geometry {
  readonly type: string

  update(
    context: GeometryUpdateContext
  ): void

  bounds(): Bounds

  sample(
    t: number
  ): Point

  dispose(): void
}
```

---

# 18. Geometry 不负责

Geometry 不负责：

```text
Renderer
Color
Global Animation Loop
DOM
CSS
User Input
```

Geometry 只描述：

> 空间形态。

---

# 19. Field Model

```typescript
interface Field {
  sample(
    point: Point,
    context: FieldContext
  ): Vector
}
```

Field 负责：

> 空间关系。

---

# 20. Geometry 与 Field

两者关系：

```text
Geometry
   ↑
   │ influenced by
   │
Field
```

例如：

```text
Flow Field
    ↓
Streamline
    ↓
Ribbon Geometry
```

---

# 21. Composition Model

Composition 不生成 Geometry。

它负责决定：

```text
Geometry 应该出现在哪里
Geometry 应该多大
Geometry 应该有多少
Geometry 如何分层
```

---

# 22. Composition Pipeline

```text
Geometry Candidates
        ↓
Density
        ↓
Focus
        ↓
Balance
        ↓
Depth
        ↓
Visibility
        ↓
Final Geometry
```

---

# 23. Motion Model

Motion 不负责 Geometry 的创建。

Motion 只改变：

```text
Position
Rotation
Scale
Morph
Opacity
Field Influence
```

---

# 24. Motion Context

```typescript
interface MotionContext {
  time: number
  delta: number
  seed: Seed
  interaction: InteractionState
}
```

---

# 25. Scene Model

Scene 是最终运行时状态。

```typescript
interface Scene {
  layers: SceneLayer[]

  width: number
  height: number

  time: number

  background?: Background
}
```

---

# 26. Scene Layer

```typescript
interface SceneLayer {
  id: string

  zIndex: number

  geometries: Geometry[]

  material: Material

  opacity: number

  blendMode?: BlendMode
}
```

---

# 27. Layer 顺序

默认：

```text
0 Background
10 Far Geometry
20 Main Geometry
30 Near Geometry
40 Atmosphere
50 Glow
60 Overlay
```

用户可以覆盖。

---

# 28. Material

```typescript
interface Material {
  opacity: number
  blur: number
  glow: number
  grain: number

  blendMode: BlendMode
}
```

---

# 29. Blend Mode

基础支持：

```text
normal
multiply
screen
overlay
add
soft-light
```

Renderer 可以根据能力降级。

---

# 30. Palette

```typescript
interface Palette {
  id: string

  colors: Color[]

  background?: Color

  interpolation:
    | 'linear'
    | 'perceptual'
}
```

默认颜色插值推荐：

```text
OKLCH
```

---

# 31. Theme

Theme 不是 Palette。

Theme 可以同时控制：

```text
Palette
Material
Motion
Composition
```

例如：

```text
Aurora Theme
 ├── green/blue palette
 ├── soft glow
 ├── low contrast
 └── slow motion
```

---

# 32. Preset

Preset 是完整生成方案。

```typescript
interface Preset {
  id: string
  version: string

  geometry: GeometryConfig
  field?: FieldConfig

  composition: CompositionConfig
  motion: MotionConfig

  material: MaterialConfig
}
```

---

# 33. Preset 不应该包含

Preset 不应该绑定：

```text
DOM
Renderer
HTMLElement
Canvas
Framework
```

这样 Preset 才可以跨环境复用。

---

# 34. Preset Resolution

```text
Preset ID
   ↓
Preset Registry
   ↓
Preset Definition
   ↓
Clone
   ↓
Theme Merge
   ↓
User Override
```

Preset 本身不能被 Runtime 直接修改。

---

# 35. Registry

```typescript
interface PresetRegistry {
  register(preset: Preset): void

  get(id: string): Preset | undefined

  has(id: string): boolean

  list(): string[]
}
```

---

# 36. Plugin Registry

统一插件注册：

```typescript
interface PluginRegistry {
  register(plugin: GenerativePlugin): void

  unregister(id: string): void

  get(id: string): GenerativePlugin | undefined
}
```

---

# 37. Renderer Selection

默认：

```text
auto
```

选择：

```text
WebGPU
 ↓ unavailable
WebGL
 ↓ unavailable
Canvas2D
```

用户可以强制：

```typescript
{
  renderer: 'canvas'
}
```

---

# 38. Renderer Capability

Renderer 声明能力：

```typescript
interface RendererCapabilities {
  webgl: boolean
  webgpu: boolean

  blur: boolean
  glow: boolean
  blendModes: boolean

  maxTextureSize: number
}
```

---

# 39. Feature Negotiation

Scene 不应该假定 Renderer 支持所有能力。

例如：

```text
Material.glow = 0.5
        ↓
Renderer Capability
        ↓
Supported?
   ├── Yes → GPU Glow
   └── No  → Approximation
```

---

# 40. Canvas Renderer

Canvas Renderer 是兼容基线。

必须实现：

```text
Geometry
Curve
Line
Gradient
Opacity
Basic Blend
Basic Motion
```

---

# 41. WebGL Renderer

WebGL Renderer 增强：

```text
Particle
Instancing
Glow
Blur
Blend
Large Geometry
```

---

# 42. WebGPU Renderer

WebGPU Renderer用于：

```text
大量 Geometry
Compute
Advanced Post Processing
High Density
```

但：

> WebGPU 不改变 Public API。

---

# 43. Interaction

Interaction 是输入层。

```typescript
interface InteractionState {
  pointer?: Point

  velocity?: Vector

  pressed: boolean

  scroll: number
}
```

---

# 44. Interaction Pipeline

```text
Browser Event
      ↓
Interaction Adapter
      ↓
Interaction State
      ↓
Field / Motion / Composition
```

---

# 45. Pointer Influence

例如：

```yaml
interaction:
  pointer:
    enabled: true
    radius: 200
    strength: 0.25
```

效果：

```text
Pointer
   ↓
Influence Field
   ↓
Geometry Motion
```

---

# 46. Responsive Model

系统监听：

```text
ResizeObserver
```

得到：

```typescript
interface Viewport {
  width: number
  height: number
  pixelRatio: number
}
```

---

# 47. Responsive Density

Geometry 数量不能简单按照：

```text
width × height
```

线性增加。

推荐：

```text
density × viewportAreaFactor × qualityFactor
```

并设置上限：

```text
maxGeometryCount
```

---

# 48. Device Pixel Ratio

Renderer 使用：

```text
CSS Size
×
Device Pixel Ratio
```

但必须限制最大 Render Resolution。

例如：

```text
maxPixelRatio = 2
```

防止高 DPI 设备造成性能异常。

---

# 49. Reduced Motion

检测：

```typescript
matchMedia(
  '(prefers-reduced-motion: reduce)'
)
```

策略：

```text
Motion Scale = 0.1
```

或者：

```text
Static Mode
```

由 Preset 决定。

---

# 50. Background / Foreground

推荐生成：

```html
<div class="art-container">
  <canvas class="art-layer"></canvas>

  <div class="art-content">
    ...
  </div>
</div>
```

Canvas：

```css
position: absolute;
inset: 0;
pointer-events: none;
```

Content：

```css
position: relative;
z-index: 1;
```

---

# 51. CSS Injection

引擎不得覆盖用户已有 CSS。

只能创建：

```text
.ga-root
.ga-canvas
.ga-layer
```

命名空间。

---

# 52. CSS Scope

默认 CSS：

```text
.ga-*
```

例如：

```text
.ga-root
.ga-canvas
.ga-content
```

禁止使用：

```text
canvas
container
background
```

等通用名称。

---

# 53. Auto Initialization

扫描：

```css
[data-generative-art]
```

流程：

```text
MutationObserver
        ↓
Detect Element
        ↓
Create Instance
        ↓
Initialize
```

动态插入 DOM 的元素也必须支持。

---

# 54. Auto Destroy

如果元素从 DOM 删除：

```text
MutationObserver
      ↓
Detect Removal
      ↓
art.destroy()
```

防止：

```text
Memory Leak
Animation Leak
Event Listener Leak
```

---

# 55. Visibility Optimization

使用：

```text
IntersectionObserver
```

当元素不可见：

```text
pause()
```

或者降低更新频率。

---

# 56. Page Visibility

当：

```text
document.hidden === true
```

默认：

```text
pause rendering
```

恢复后：

```text
resume
```

---

# 57. Runtime Update

支持：

```typescript
art.update({
  motion: {
    speed: 0.1
  }
})
```

Update 分为：

```text
Hot Update
Rebuild
```

---

# 58. Hot Update

以下属性尽可能实时更新：

```text
Opacity
Speed
Color
Glow
Blur
Turbulence
```

---

# 59. Rebuild Update

以下属性可能触发 Scene 重建：

```text
Geometry Type
Preset
Topology
Renderer
Major Density Change
```

---

# 60. API 稳定性

Public API 分为：

```text
Stable
Experimental
Internal
```

只有：

```text
Stable
```

允许 SemVer 保证兼容。

---

# 61. Internal Boundary

以下属于内部 API：

```text
Geometry Generator internals
Field implementation
Renderer implementation
Scene optimization
Memory pool
GPU buffer management
```

这些可以自由演进。

---

# 62. Visual Contract

每个 Preset 必须定义：

```text
Expected density
Expected motion
Expected contrast
Expected complexity
Recommended viewport
```

---

# 63. Visual Quality Contract

Preset 不仅要通过代码测试，还必须满足：

```text
Composition
Continuity
Motion Quality
Color Harmony
Visual Hierarchy
Performance
```

---

# 64. Visual Regression

测试输入：

```text
Preset
Seed
Viewport
Time
Pixel Ratio
```

输出：

```text
Reference Image
```

比较：

```text
Structural Similarity
Pixel Difference
```

---

# 65. Deterministic Random

内部提供：

```typescript
interface Random {
  next(): number

  float(
    min: number,
    max: number
  ): number

  integer(
    min: number,
    max: number
  ): number

  choice<T>(
    items: T[]
  ): T
}
```

所有 Generator 使用统一 Random。

---

# 66. Seed Hierarchy

避免不同模块共享同一个随机序列。

使用：

```text
Root Seed
   ├── Geometry Seed
   ├── Field Seed
   ├── Motion Seed
   ├── Composition Seed
   └── Material Seed
```

例如：

```text
Seed = 100

Geometry → hash(100, geometry)
Field    → hash(100, field)
Motion   → hash(100, motion)
```

这样修改 Geometry 不应该破坏 Motion 的随机状态。

---

# 67. Error Model

统一错误：

```typescript
class GenerativeArtError extends Error
```

错误类别：

```text
ConfigurationError
PresetError
RendererError
PluginError
BrowserCapabilityError
```

---

# 68. Graceful Degradation

原则：

```text
视觉质量下降
>
页面崩溃
```

例如：

```text
WebGPU unavailable
↓
WebGL
↓
Canvas
```

---

# 69. Logging

默认：

```text
silent
```

Debug：

```typescript
{
  debug: true
}
```

输出：

```text
Renderer
Preset
Seed
Geometry Count
FPS
Quality
```

---

# 70. Debug Overlay

开发模式可显示：

```text
FPS: 60
Renderer: WebGL
Geometry: 320
DPR: 2
Quality: high
Preset: aurora-flow
Seed: 20261007
```

正式环境默认关闭。

---

# 71. NPM Entry Points

推荐：

```text
@regalpine/generative-art
@regalpine/generative-art/auto
@regalpine/generative-art/react
@regalpine/generative-art/vue
@regalpine/generative-art/web-component
```

---

# 72. Tree Shaking

例如只使用 Core：

```typescript
import {
  createGenerativeArt
} from '@regalpine/generative-art'
```

不应强制加载：

```text
React
Vue
WebGPU
所有 Preset
```

---

# 73. Preset Loading

默认提供基础 Preset。

大型 Preset 可以：

```typescript
import {
  loadPreset
} from '@regalpine/generative-art'
```

实现按需加载。

---

# 74. CSS Package

提供：

```text
@regalpine/generative-art/styles.css
```

但默认 CSS 必须极少。

核心视觉 CSS 尽量由 Runtime 根据容器生成。

---

# 75. Web Component

标准组件：

```html
<generative-art
  preset="aurora-flow"
  theme="aurora">
</generative-art>
```

属性变化：

```text
attributeChangedCallback
        ↓
Runtime update()
```

---

# 76. React

未来：

```tsx
<GenerativeArt
  preset="aurora-flow"
  theme="aurora"
  seed={20261007}
/>
```

React Adapter 不应该重新实现 Core。

---

# 77. Vue

未来：

```vue
<GenerativeArt
  preset="aurora-flow"
  theme="aurora"
/>
```

同样只负责生命周期绑定。

---

# 78. 不支持的模式

第一阶段明确不支持：

```text
直接修改用户 DOM 内容
自动修改页面主题
自动注入全局 CSS
自动联网获取资源
自动调用 AI
```

---

# 79. API 示例

最简单：

```typescript
createGenerativeArt({
  target: '#hero',
  preset: 'aurora-flow'
})
```

---

# 80. 高级配置

```typescript
createGenerativeArt({
  target: '#hero',

  preset: 'flow',

  seed: 20261007,

  renderer: 'auto',

  quality: 'high',

  motion: {
    speed: 0.15,
    turbulence: 0.2
  },

  material: {
    glow: 0.2,
    opacity: 0.8
  }
})
```

---

# 81. CSS 配置示例

```css
.hero {
  --ga-preset: aurora-flow;
  --ga-seed: 20261007;

  --ga-density: 0.6;
  --ga-speed: 0.15;
  --ga-turbulence: 0.2;

  --ga-glow: 0.2;
  --ga-opacity: 0.8;
}
```

---

# 82. HTML 配置示例

```html
<section
  class="hero"
  data-generative-art
  data-art-preset="aurora-flow">
</section>
```

---

# 83. 最终推荐使用方式

普通开发者：

```html
<div
  data-generative-art
  data-art-preset="flow">
</div>
```

高级开发者：

```typescript
createGenerativeArt({
  target,
  preset: 'flow'
})
```

设计系统：

```css
--ga-preset: flow;
--ga-theme: aurora;
```

框架开发者：

```tsx
<GenerativeArt preset="flow" />
```

---

# 84. 架构收敛

V1.1 到此完成以下边界确定：

```text
                    Public API
                        │
                Configuration
                        │
             Preset / Theme / CSS
                        │
                Semantic Model
                        │
       ┌────────────────┼────────────────┐
       ↓                ↓                ↓
   Geometry           Field            Motion
       └────────────────┼────────────────┘
                        ↓
                   Composition
                        ↓
                    Material
                        ↓
                      Scene
                        ↓
                    Renderer
                        ↓
              Canvas / WebGL / WebGPU
```

---

# 85. 本阶段禁止继续扩张

下一阶段只允许围绕以下内容深化：

```text
1. Geometry Specification
2. Field Specification
3. Composition Specification
4. Motion Specification
5. Preset Specification
6. CSS Variable Specification
7. Renderer Contract
8. NPM Package Contract
```

不得重新引入：

```text
AI
3D Engine
Rust Core
Marketplace
Online Editor
Cloud Service
```

这些全部留待后续版本。

---

# 86. V1.1 结论

Generative Geometric Art Engine 的核心不是：

> “给网页加一个动态背景。”

而是：

> **将几何、空间场、构图、运动、色彩和材质抽象成可组合的生成式视觉模型，并通过 CSS、HTML 和 TypeScript 以极低成本注入 Web 应用。**

因此其核心技术抽象确定为：

```text
Geometry
+
Field
+
Composition
+
Motion
+
Material
+
Renderer
```

其中：

```text
Geometry = What
Field = Where / How
Composition = Why
Motion = When
Material = Appearance
Renderer = How to Draw
```

这六个概念构成系统长期稳定的核心语义模型。