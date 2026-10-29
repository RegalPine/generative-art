# Generative Geometric Art Engine
## Preset Specification V1.7

> **Status:** Draft → Converged Target  
> **Version:** V1.7  
> **Scope:** Preset / Art Definition / Reusable Generative Composition  
> **Previous:** Material Specification V1.6  
> **Next:** CSS Variable Specification V1.8

---

# 1. 文档目标

Preset 是 Generative Geometric Art Engine 对一组生成艺术规则的**可复用封装**。

核心定义：

> **Preset = Geometry + Field + Composition + Motion + Material 的可复用生成方案。**

Preset 不产生新的底层语义。

它只是：

```text
已有能力
    │
    ├── Geometry
    ├── Field
    ├── Composition
    ├── Motion
    └── Material
          │
          ▼
       Preset
          │
          ▼
   Reusable Art Definition
```

---

# 2. Preset 的定位

Preset 不是：

- Renderer
- Theme
- Material
- Animation
- Geometry
- Scene
- Plugin
- Template
- AI Prompt

Preset 是：

> **面向艺术效果的确定性生成配置。**

---

# 3. Preset 与其他概念关系

```text
Theme
  │
  │ visual context
  ▼
Preset
  │
  ├── Geometry
  ├── Field
  ├── Composition
  ├── Motion
  └── Material
        │
        ▼
      Scene
        │
        ▼
     Renderer
```

其中：

```text
Preset = What art is generated
Theme  = How the art fits the application
```

---

# 4. Preset 核心接口

```ts id="1n9x6z"
interface Preset {
  id: string
  version: string
  name?: string
  description?: string

  geometry: GeometryConfig
  field?: FieldConfig
  composition: CompositionConfig
  motion: MotionConfig
  material: MaterialConfig

  semantic?: PresetSemanticConfig
  responsive?: ResponsivePresetConfig
  metadata?: PresetMetadata
}
```

---

# 5. Preset 最小模型

最小 Preset：

```json id="q9e4de"
{
  "id": "flow",
  "version": "1.0.0",
  "geometry": {},
  "composition": {},
  "motion": {},
  "material": {}
}
```

Field 为可选。

原因：

> 并不是所有生成艺术都需要 Field。

---

# 6. Preset 生命周期

```text id="l3z4g4"
Definition
   │
   ▼
Validation
   │
   ▼
Normalization
   │
   ▼
Resolution
   │
   ▼
Instantiation
   │
   ▼
Runtime
   │
   ▼
Destroy
```

---

# 7. Preset Definition

Preset Definition 是静态描述：

```ts id="7h5f6p"
interface PresetDefinition {
  id: string
  version: string
  config: Preset
}
```

它不包含运行时状态。

禁止在 Preset 中保存：

```text
currentTime
canvas
DOM
renderer instance
animation frame
runtime state
```

---

# 8. Preset Instance

Preset 被加载后形成 Runtime Instance：

```ts id="wqj7m3"
interface PresetInstance {
  preset: PresetDefinition
  seed: Seed
  scene: Scene
}
```

关系：

```text
Preset Definition
       │
       ▼
Preset Instance
       │
       ▼
Runtime Scene
```

---

# 9. Preset ID

Preset ID 必须：

```text
lowercase
kebab-case
stable
globally unique within registry
```

例如：

```text id="o7y2b9"
flow
aurora
organic-wave
deep-space
soft-ribbon
orbital-field
```

禁止：

```text
FlowPreset
FLOW
flowPreset1
```

---

# 10. Preset Version

Preset 必须版本化。

格式：

```text id="4t8y4f"
MAJOR.MINOR.PATCH
```

例如：

```text
1.0.0
1.1.0
2.0.0
```

---

# 11. Preset Version 语义

### MAJOR

破坏兼容：

```text
Geometry semantics changed
Configuration semantics changed
Preset meaning changed
```

### MINOR

新增兼容能力：

```text
new optional configuration
new effect
new composition option
```

### PATCH

修复：

```text
parameter correction
visual tuning
bug fix
```

---

# 12. Preset Semantic Identity

Preset 不应只由参数定义。

建议：

```ts id="qpjm0q"
interface PresetSemanticConfig {
  style?: ArtStyle
  energy?: number
  complexity?: number
  softness?: number
  depth?: number
  rhythm?: number
  density?: number
  focus?: number
}
```

---

# 13. Preset Style

```ts id="e0c7if"
type ArtStyle =
  | 'minimal'
  | 'organic'
  | 'atmospheric'
  | 'elegant'
  | 'futuristic'
  | 'structural'
  | 'fluid'
  | 'cosmic'
```

Style 是语义描述。

不能直接替代具体 Material / Composition 参数。

---

# 14. Preset Metadata

```ts id="b8j4q3"
interface PresetMetadata {
  author?: string
  license?: string
  tags?: string[]
  category?: string
  preview?: string
  documentation?: string
}
```

Metadata 不参与运行时生成。

---

# 15. Preset Category

推荐：

```text id="e4zq1c"
flow
organic
atmospheric
geometric
structural
cosmic
minimal
experimental
```

Category 主要用于：

- 文档
- Demo
- Gallery
- Preset Browser

不是 Runtime 语义。

---

# 16. Preset Composition

Preset 由五个主要模块组成：

```text id="t4d4t4"
Preset
│
├── Geometry
├── Field
├── Composition
├── Motion
└── Material
```

严格对应：

```text
V1.1 Geometry
V1.1 Field
V1.4 Composition
V1.5 Motion
V1.6 Material
```

---

# 17. Geometry Configuration

Preset 可以指定：

```ts id="w4x3rc"
interface GeometryConfig {
  type: string
  count?: number
  size?: number
  variation?: number
  parameters?: Record<string, unknown>
}
```

例如：

```json id="b3x6kz"
{
  "type": "bezier",
  "count": 32,
  "variation": 0.4
}
```

---

# 18. Field Configuration

```ts id="7d2x7u"
interface FieldConfig {
  type: string
  strength?: number
  scale?: number
  parameters?: Record<string, unknown>
}
```

例如：

```json id="t6j2r0"
{
  "type": "curl-noise",
  "strength": 0.8,
  "scale": 0.015
}
```

---

# 19. Composition Configuration

Preset 可以定义：

```ts id="z5h2sq"
interface CompositionConfig {
  distribution?: DistributionConfig
  density?: number
  balance?: number
  symmetry?: number
  focus?: FocusConfig
  scale?: ScaleConfig
  depth?: DepthConfig
  rhythm?: RhythmConfig
  negativeSpace?: number
  hierarchy?: HierarchyConfig
}
```

Composition 结构必须复用 V1.4。

---

# 20. Motion Configuration

Preset 可以指定：

```ts id="n5z1vp"
interface MotionConfig {
  type: string
  speed?: number
  strength?: number
  timeScale?: number
  parameters?: Record<string, unknown>
}
```

复杂运动：

```ts id="1f5a5q"
interface CompositeMotionConfig {
  type: 'composite'
  motions: MotionConfig[]
}
```

---

# 21. Material Configuration

Preset 可以指定：

```ts id="qj5z8a"
interface MaterialConfig {
  color?: ColorSource
  opacity?: number
  gradient?: Gradient
  glow?: GlowConfig
  blur?: BlurConfig
  grain?: GrainConfig
  noise?: NoiseConfig
  shadow?: ShadowConfig
  blendMode?: BlendMode
  depth?: DepthMaterialConfig
}
```

完全复用 V1.6。

---

# 22. Preset 不重复定义底层 Schema

这是 V1.7 的重要约束。

错误：

```text
Preset
 ├── own Geometry model
 ├── own Motion model
 └── own Material model
```

正确：

```text
Preset
 │
 ├── GeometryConfig
 ├── FieldConfig
 ├── CompositionConfig
 ├── MotionConfig
 └── MaterialConfig
```

因此 Preset 只是：

> **Composition of existing semantic models**

---

# 23. Preset Resolution

运行时：

```text id="l17r5b"
Preset
  │
  ▼
Preset Resolver
  │
  ├── Geometry Resolver
  ├── Field Resolver
  ├── Composition Resolver
  ├── Motion Resolver
  └── Material Resolver
  │
  ▼
Resolved Preset
```

---

# 24. Resolved Preset

```ts id="c8j5wm"
interface ResolvedPreset {
  id: string
  version: string

  geometry: ResolvedGeometry
  field?: ResolvedField
  composition: ResolvedComposition
  motion: ResolvedMotion
  material: ResolvedMaterial
}
```

---

# 25. Preset Validation

Preset 加载前必须验证：

```text id="i9q6l3"
Identity
Version
Schema
Geometry
Field
Composition
Motion
Material
Semantic Constraints
```

---

# 26. Preset Validation Contract

```ts id="4b9t1d"
interface PresetValidator {
  validate(
    preset: Preset
  ): ValidationResult
}
```

```ts id="i0b6i8"
interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}
```

---

# 27. Validation Error

例如：

```text id="8b5qcg"
PRESET_INVALID_GEOMETRY
PRESET_INVALID_FIELD
PRESET_INVALID_COMPOSITION
PRESET_INVALID_MOTION
PRESET_INVALID_MATERIAL
PRESET_VERSION_UNSUPPORTED
PRESET_PARAMETER_OUT_OF_RANGE
```

---

# 28. Preset Constraints

Preset 必须满足跨层约束。

例如：

```text id="0iyf3w"
Geometry count
        │
        ▼
Composition density
        │
        ▼
Material effect budget
```

如果：

```text
count = 5000
blur = high
glow = high
grain = animated
```

则应该产生性能警告。

---

# 29. Semantic Constraint

例如：

```text id="7yy5u4"
complexity ↑
density ↑
effects ↑
```

不能无限同时增长。

定义：

```ts id="a8qz9h"
interface PresetConstraint {
  id: string
  severity: 'warning' | 'error'
  validate(context: PresetContext): boolean
}
```

---

# 30. Preset Performance Profile

Preset 可以声明性能级别：

```ts id="s6q8o5"
type PerformanceProfile =
  | 'light'
  | 'balanced'
  | 'rich'
  | 'experimental'
```

含义：

```text
light
    mobile friendly

balanced
    default

rich
    desktop recommended

experimental
    no guarantee
```

---

# 31. Preset Capability Requirements

Preset 可以声明：

```ts id="1qk6q7"
interface PresetRequirements {
  renderer?: string[]
  features?: string[]
}
```

例如：

```json id="g5f9i1"
{
  "renderer": ["canvas2d", "webgl"],
  "features": ["blur", "blend"]
}
```

---

# 32. Capability Negotiation

运行时：

```text id="qg9m3r"
Preset Requirements
        │
        ▼
Renderer Capabilities
        │
        ▼
Capability Negotiation
        │
        ├── Full
        ├── Partial
        └── Unsupported
```

---

# 33. Preset Fallback

如果某个效果不支持：

```text id="e9l7v3"
Advanced Glow
     │
     ▼
Renderer Capability
     │
     ├── supported → Glow
     │
     └── unsupported → Soft Glow
```

原则：

> Preset 尽量优雅降级，而不是直接失败。

---

# 34. Preset Seed

Preset 必须支持 Seed。

```ts id="m1o0qd"
interface PresetSeedContext {
  root: number | string
}
```

Seed 派生：

```text id="n9z0bq"
Root
 │
 ├── Geometry
 ├── Field
 ├── Composition
 ├── Motion
 └── Material
```

---

# 35. Preset Determinism

同一：

```text
Preset
+
Version
+
Seed
+
Viewport
+
Configuration
```

必须尽可能得到：

> 相同的生成结果。

---

# 36. Responsive Preset

Preset 不应只针对固定屏幕。

```ts id="r5q8k3"
interface ResponsivePresetConfig {
  mobile?: Partial<Preset>
  tablet?: Partial<Preset>
  desktop?: Partial<Preset>
}
```

但推荐优先使用：

```text
semantic adaptation
```

而不是完整复制三套 Preset。

---

# 37. Responsive Semantic Adaptation

例如：

```text id="w7h1x4"
Mobile
  density ↓
  complexity ↓
  blur ↓
  glow ↓

Desktop
  density ↑
  complexity ↑
  depth ↑
  effects ↑
```

---

# 38. Preset Parameters

Preset 可以暴露少量用户可调参数。

```ts id="o4f8m2"
interface PresetParameter {
  id: string
  type: 'number' | 'boolean' | 'enum'
  default: unknown
  min?: number
  max?: number
  options?: string[]
}
```

例如：

```text id="j6z8y3"
flow
├── density
├── energy
├── softness
└── depth
```

---

# 39. Parameter Exposure Principle

Preset 不应暴露所有底层参数。

错误：

```text
curlNoiseFrequency
curlNoiseOctaves
curlNoiseLacunarity
blurRadius
glowRadius
...
```

正确：

```text
density
energy
softness
depth
```

原则：

> **Expose artistic intent, hide implementation detail.**

---

# 40. Preset Parameter Mapping

例如：

```text id="9k5x0r"
energy
 │
 ├── Motion strength
 ├── Motion speed
 └── Glow intensity
```

```text id="8p4w1m"
softness
 │
 ├── Blur
 ├── Opacity
 └── Gradient diffusion
```

参数映射由 Preset 定义。

---

# 41. Preset Parameter Interface

```ts id="5g6d8s"
interface PresetParameterResolver {
  resolve(
    parameter: PresetParameterValue,
    preset: Preset
  ): Preset
}
```

---

# 42. Preset Override

运行时允许：

```ts id="u8m4s1"
createGenerativeArt({
  preset: 'aurora',
  density: 0.7,
  softness: 0.8
})
```

实际过程：

```text
Preset
   │
   ▼
Parameter Override
   │
   ▼
Resolved Preset
```

---

# 43. Override Boundary

Override 可以修改：

```text id="y3n2w8"
semantic parameters
appearance parameters
runtime parameters
```

但不能破坏：

```text id="k4r1z6"
Preset identity
Preset version
Registry identity
```

---

# 44. Preset Registry

```ts id="z7p3x1"
interface PresetRegistry {
  register(
    preset: Preset
  ): void

  get(
    id: string
  ): Preset | undefined

  has(
    id: string
  ): boolean

  list(): Preset[]
}
```

---

# 45. Built-in Preset Registry

MVP 建议：

```text id="2x9q8j"
flow
aurora
ribbon
organic
wave
orbital
mesh
atmosphere
```

即 V1.0 定义的八个基础 Preset。

---

# 46. Flow Preset

语义：

> Continuous geometric flow.

```text id="p2x4q7"
Geometry
  → Curve / Ribbon

Field
  → Curl Noise

Composition
  → Flow distribution

Motion
  → Flow

Material
  → Soft gradient + subtle glow
```

---

# 47. Aurora Preset

语义：

> Atmospheric luminous flow.

```text id="d4h7q1"
Geometry
  → Ribbon

Field
  → Curl Noise

Composition
  → Flow + Focus

Motion
  → Wave + Flow

Material
  → Gradient + Glow + Blur
```

---

# 48. Organic Preset

语义：

> Natural irregular geometric movement.

```text id="g2x8n4"
Geometry
  → Spline

Field
  → Organic Noise

Composition
  → Cluster

Motion
  → Drift + Wave

Material
  → Soft Gradient + Grain
```

---

# 49. Orbital Preset

语义：

> Structured orbital geometry.

```text id="f6k1r8"
Geometry
  → Circle / Arc

Composition
  → Radial

Motion
  → Orbit

Material
  → Gradient + Glow
```

---

# 50. Mesh Preset

语义：

> Structural geometric network.

```text id="p7n2c6"
Geometry
  → Mesh

Composition
  → Grid / Organic

Motion
  → Subtle Wave

Material
  → Thin Lines + Low Opacity
```

---

# 51. Preset Composition Rule

Preset 应遵循：

```text id="a6k8r2"
One primary visual idea
+
One primary motion language
+
One primary material language
```

避免：

```text
10 geometry types
+
10 motion types
+
20 effects
```

否则 Preset 会失去视觉身份。

---

# 52. Preset Visual Identity

Preset 必须具备：

```text id="u3p5y9"
Shape Identity
Motion Identity
Color Identity
Material Identity
Composition Identity
```

例如：

```text
Aurora
=
Ribbon
+
Flow
+
Radial Focus
+
Luminous Gradient
```

---

# 53. Preset Inheritance

默认不支持传统继承：

```text id="x6q9w3"
Preset A
   ↑
Preset B
   ↑
Preset C
```

因为容易产生配置继承链。

推荐：

> Preset Composition / Parameter Override

而不是 Class-style inheritance。

---

# 54. Preset Extension

允许：

```ts id="d9m3x7"
extendPreset(
  'aurora',
  {
    material: {...}
  }
)
```

语义：

```text
Base Preset
     +
Override
     =
Derived Preset
```

Derived Preset 必须生成新的 ID。

---

# 55. Preset Composition

允许多个 Preset 组合，但限制为 P1。

例如：

```text id="y5q7m1"
Aurora
+
Orbital
```

形成：

```text
Composite Preset
```

MVP 不要求。

---

# 56. Preset Import

Preset 可以来自：

```text id="e8p1s4"
Built-in
Local JSON
NPM package
Application code
Plugin
```

---

# 57. Preset JSON

推荐文件：

```text id="q8n4k5"
presets/
├── flow.json
├── aurora.json
├── ribbon.json
├── organic.json
├── wave.json
├── orbital.json
├── mesh.json
└── atmosphere.json
```

---

# 58. Preset Package

第三方可以发布：

```text id="x1v6s8"
@vendor/generative-presets
```

包含：

```text
presets/
metadata/
preview/
README
```

---

# 59. Preset Security Boundary

Preset 是数据，不应该默认允许：

```text id="s4k8j2"
eval
Function constructor
DOM execution
Network request
Arbitrary JS execution
```

因此：

> JSON Preset 必须是 declarative-only。

---

# 60. Preset Schema

最终推荐：

```ts id="g9z3x2"
interface Preset {
  id: string
  version: string

  geometry: GeometryConfig
  field?: FieldConfig
  composition: CompositionConfig
  motion: MotionConfig
  material: MaterialConfig

  semantic?: PresetSemanticConfig
  parameters?: PresetParameter[]
  responsive?: ResponsivePresetConfig
  requirements?: PresetRequirements
  metadata?: PresetMetadata
}
```

---

# 61. Preset Runtime Pipeline

```text
Preset
   │
   ▼
Load
   │
   ▼
Validate
   │
   ▼
Normalize
   │
   ▼
Apply Parameters
   │
   ▼
Resolve Dependencies
   │
   ▼
Capability Negotiation
   │
   ▼
Seed Initialization
   │
   ▼
Generate Scene
   │
   ▼
Run Motion
   │
   ▼
Render
```

---

# 62. Preset Update

运行时：

```ts id="a7v3q5"
art.setPreset('aurora')
```

流程：

```text
Current Preset
      │
      ▼
Stop / Transition
      │
      ▼
Load New Preset
      │
      ▼
Resolve
      │
      ▼
Rebuild Required Layers
      │
      ▼
Resume
```

---

# 63. Hot Update

以下参数允许 Hot Update：

```text id="w5n8m3"
density
opacity
glow
softness
energy
color
speed
timeScale
```

以下通常需要 Rebuild：

```text id="r1z4p8"
geometry.type
field.type
composition.distribution
renderer
```

---

# 64. Preset Transition

P1 支持：

```ts id="k4m7s2"
transitionTo(
  preset: string,
  duration: number
)
```

概念：

```text
Preset A
   │
   │ interpolation
   ▼
Preset B
```

但不进入 V1.7 MVP。

---

# 65. Preset Quality Contract

每个官方 Preset 必须：

```text id="j8x2v5"
Deterministic
Responsive
Renderer Compatible
Performance Bounded
Visually Distinct
Serializable
Documented
Versioned
```

---

# 66. Official Preset Test

官方 Preset 至少测试：

```text id="c7m3q9"
Desktop
Tablet
Mobile

Canvas2D

Seed A
Seed B

Reduced Motion

Resize
Visibility Change

Low Performance Device
```

---

# 67. Visual Regression

官方 Preset 应支持：

```text id="m8p4y6"
Preset
+
Seed
+
Viewport
+
Renderer
```

生成基准快照。

用于检测：

```text
unexpected geometry change
unexpected composition change
unexpected color change
unexpected material change
```

---

# 68. Preset Documentation

每个官方 Preset 应提供：

```text id="v5n7q2"
Name
Description
Visual intent
Geometry
Field
Composition
Motion
Material
Semantic parameters
Performance
Recommended usage
```

---

# 69. Preset Demo

每个 Preset 应拥有独立 Demo：

```text id="n4x8s1"
Preset Demo
├── Preview
├── Parameters
├── Seed
├── Renderer
├── Performance
└── Code Example
```

---

# 70. Preset 与 NPM API

用户最终使用：

```ts id="z6q2m8"
import {
  createGenerativeArt
} from '@regalpine/generative-art'

const art = createGenerativeArt({
  target: '#hero',
  preset: 'aurora'
})
```

而不是：

```ts id="j7p3c9"
new Geometry(...)
new CurlNoise(...)
new Composition(...)
new Motion(...)
new Material(...)
```

后者属于 Engine Developer API。

---

# 71. Preset 与低级 API

两种用户层级：

```text
Application Developer
        │
        ▼
Preset API
        │
        ▼
Generative Art Engine
        │
        ▼
Engine Developer
        │
        ▼
Geometry / Field / Composition / Motion / Material API
```

这也是 NPM 产品易用性的关键。

---

# 72. Preset MVP

V1.7 MVP：

```text id="f2k7m5"
Preset Schema
Preset ID
Preset Version
Preset Metadata
Preset Validation
Preset Registry
Preset Resolution
Preset Parameters
Preset Seed
Preset Determinism
Preset Performance Profile
Preset Requirements
Capability Negotiation
Preset Serialization
Built-in Presets
Preset Documentation
Visual Regression
```

---

# 73. Preset P1

```text id="h9w4s2"
Preset Extension
Composite Preset
Preset Transition
Advanced Responsive Preset
Preset Marketplace-ready metadata
Preset Preview Metadata
```

---

# 74. Preset P2

暂不进入：

```text id="u6x3q8"
AI Preset Generation
LLM Preset Authoring
Automatic Style Discovery
Online Preset Community
Cloud Preset Registry
AI Visual Critic
```

---

# 75. 明确排除

V1.7 不负责：

```text id="p3r8m1"
Renderer Implementation
Geometry Implementation
Field Algorithms
Motion Algorithms
Material Algorithms
UI Editor
Visual Design Tool
AI Art Generation
Cloud Service
```

---

# 76. V1.7 收敛结论

至此，生成艺术引擎已经形成：

```text
Semantic Layer
        │
        ▼
Geometry
Field
Composition
Motion
Material
        │
        ▼
Preset
        │
        ▼
Scene
        │
        ▼
Renderer
```

Preset 成为：

> **底层生成能力与应用开发者之间的核心产品抽象。**

---

# 77. 当前完整架构

```text
┌──────────────────────────────────────┐
│             Application              │
├──────────────────────────────────────┤
│        Generative Art API            │
├──────────────────────────────────────┤
│              Preset                  │
├──────────────────────────────────────┤
│ Geometry │ Field │ Composition       │
│ Motion   │ Material                  │
├──────────────────────────────────────┤
│             Scene Runtime             │
├──────────────────────────────────────┤
│ Canvas2D │ WebGL │ WebGPU            │
└──────────────────────────────────────┘
```

---

# 78. 下一阶段

下一版本进入：

> **CSS Variable Specification V1.8**

V1.8 不再增加新的生成艺术语义。

核心解决：

```text
CSS
 │
 ▼
Declarative Configuration
 │
 ▼
Semantic Parameters
 │
 ▼
Preset
 │
 ▼
Runtime
```

重点确定：

- `--ga-*` 完整变量体系
- CSS → Semantic Config 映射
- CSS Cascade
- Theme / Preset / CSS 优先级
- Data Attribute 与 CSS 的关系
- Responsive CSS
- Dark / Light context
- CSS Typed OM 可选支持
- SSR / hydration 边界
- 不让 CSS 变成第二套 DSL

V1.8 完成后，**Web 应用的声明式接入模型将基本收敛**。