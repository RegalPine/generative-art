# Generative Geometric Art Engine
## Composition Specification
### 构图系统规范 V1.4

> Status: Draft / Architecture Baseline  
> Product: Generative Geometric Art Engine  
> Package: `@regalpine/generative-art`  
> Previous: Field Specification V1.3

---

# 1. 规范目标

Composition 是 Geometry 与最终视觉结果之间的组织层。

它解决的问题不是：

> “生成什么几何？”

而是：

> **“这些几何应该在哪里、以什么密度、层次、尺度、节奏和视觉权重出现？”**

整体关系：

```text
Geometry
    ↓
Field
    ↓
Composition
    ↓
Motion
    ↓
Material
    ↓
Renderer
```

Composition 不负责：

- Geometry 数学生成
- Field 计算
- 动画时间积分
- Material 渲染
- Canvas/WebGL/WebGPU 实现

---

# 2. Composition 核心思想

艺术感不是简单来自：

```text
复杂 Geometry
+
复杂 Noise
```

而来自：

```text
Geometry
+
空间关系
+
视觉层级
+
负空间
+
节奏
+
平衡
+
焦点
```

因此 Composition 是整个引擎中非常重要的“艺术组织层”。

---

# 3. Composition 模型

统一接口：

```ts
interface Composition {

  arrange(
    geometries: Geometry[],
    context: CompositionContext
  ): SceneLayer[]

}
```

Context：

```ts
interface CompositionContext {

  viewport: Viewport

  seed: Seed

  semantic: SemanticArtConfig

  field?: Field

}
```

---

# 4. Composition Pipeline

```text
Composition Config
       ↓
Layout
       ↓
Distribution
       ↓
Density
       ↓
Scale
       ↓
Focus
       ↓
Depth
       ↓
Rhythm
       ↓
Balance
       ↓
Layer
       ↓
Scene
```

---

# 5. Composition 与 Geometry 的边界

Geometry 决定：

```text
“是什么形状”
```

Composition 决定：

```text
“形状之间如何组织”
```

例如：

```text
Bezier Curve
```

是 Geometry。

而：

```text
10 条曲线向右上方逐渐展开
```

属于 Composition。

---

# 6. Composition Coordinate System

Composition 使用：

```text
Normalized Coordinates
```

范围：

```text
x ∈ [0,1]
y ∈ [0,1]
```

因此：

```text
┌──────────────────────┐
│                      │
│        Focus         │
│          ●           │
│                      │
│                      │
└──────────────────────┘
```

Presets 不应绑定固定 viewport。

---

# 7. Composition Config

```ts
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

---

# 8. Density

Density 描述空间中 Geometry 的视觉密度。

```text
0
↓
极低密度

0.5
↓
中等密度

1
↓
高密度
```

重要：

> Density 不是简单的 Geometry count。

它还可以影响：

```text
Geometry Count
Spacing
Size
Overlap
Field Influence
```

---

# 9. Density Field

Density 可以由 Scalar Field 控制。

```text
Density
   ↓
Scalar Field
   ↓
Geometry Probability
```

例如：

```text
        ●●●
      ●●●●●
    ●●●●●●●
      ●●●●
        ●
```

中心区域密度更高。

---

# 10. Distribution

Composition 支持：

```text
Uniform
Grid
Random
Poisson
Radial
Spiral
Cluster
Flow
Edge
Center
Golden
Organic
```

统一：

```ts
interface Distribution {

  position(
    index: number,
    count: number,
    context: DistributionContext
  ): Point

}
```

---

# 11. Uniform Distribution

均匀分布：

```text
●   ●   ●   ●

●   ●   ●   ●

●   ●   ●   ●
```

适用于：

- Grid
- Mesh
- Structured
- Technical

---

# 12. Random Distribution

随机分布：

```text
●       ●

    ●

        ●    ●

  ●
```

但随机必须是：

```text
Seeded Random
```

而不是：

```ts
Math.random()
```

---

# 13. Poisson Distribution

Poisson Disk 用于避免 Geometry 过度聚集：

```text
●       ●

    ●

          ●

  ●       ●
```

保证最小间距。

适用于：

- 点阵
- 星点
- Decorative Geometry
- Background Elements

---

# 14. Radial Distribution

围绕中心：

```text
        ●
    ●       ●
  ●     ●     ●
    ●       ●
        ●
```

适用于：

- Orbital
- Cosmic
- Circular
- Mandala-like compositions

---

# 15. Spiral Distribution

```text
        ●
      ●
    ●
  ●
●
```

或者：

```text
      ●
   ●
 ●
   ●
      ●
```

适用于：

- Flow
- Organic
- Cosmic
- Dynamic compositions

---

# 16. Flow Distribution

Geometry 沿 Field 分布：

```text
Geometry
   ↓
Field
   ↓
Streamline
   ↓
Placement
```

这是本引擎的重要组合能力。

例如：

```text
Curl Field
     ↓
Flow Lines
     ↓
Ribbon Geometry
```

---

# 17. Center Distribution

围绕视觉中心形成集中区域：

```text
       ●
    ● ● ●
  ● ● ● ● ●
    ● ● ●
       ●
```

适合：

```text
Hero Background
Product Landing
Atmospheric
Aurora
```

---

# 18. Edge Distribution

Geometry 主要分布于画面边缘：

```text
● ● ● ● ● ●

●             ●

●             ●

● ● ● ● ● ●
```

中心形成负空间。

非常适合：

```text
Hero Text
Headline
CTA
```

---

# 19. Golden Distribution

支持基于黄金比例的构图：

```text
φ ≈ 1.618
```

可以用于：

```text
Focus Position
Scale
Spacing
Layer Ratio
```

但黄金比例只是工具，不应成为所有 Preset 的硬规则。

---

# 20. Organic Distribution

Organic Distribution 不追求规则，也不追求完全随机。

核心：

```text
Controlled Randomness
```

即：

```text
规则
 +
扰动
 +
约束
```

形成：

```text
Natural Order
```

---

# 21. Balance

Balance 描述画面视觉重量的平衡程度。

```ts
interface BalanceConfig {

  horizontal: number

  vertical: number

  radial?: number

}
```

可以理解：

```text
左重 ←────→ 右重
上重 ←────→ 下重
```

---

# 22. Visual Weight

Geometry 的视觉重量可以由：

```text
Size
Opacity
Density
Brightness
Contrast
Glow
Depth
```

共同决定。

因此 Composition 不应该只计算 Geometry 数量。

---

# 23. Balance Model

概念模型：

```text
Visual Weight
      ↓
Spatial Distribution
      ↓
Center of Mass
      ↓
Balance
```

例如：

```text
●●●●
      ●
        ●
```

虽然 Geometry 数量相同，但视觉重量可能偏右。

---

# 24. Symmetry

支持：

```text
None
Horizontal
Vertical
Radial
Rotational
Mirror
```

例如：

```text
     ●
   ●   ●
 ●       ●
   ●   ●
     ●
```

Symmetry 应作为可控参数，而不是固定规则。

---

# 25. Symmetry Parameter

```ts
interface SymmetryConfig {

  mode: SymmetryMode

  strength: number

}
```

其中：

```text
0
↓
完全不对称

0.5
↓
部分对称

1
↓
高度对称
```

---

# 26. Focus

Focus 是 Composition 的核心概念。

```ts
interface FocusConfig {

  position: Point

  strength: number

  radius: number

}
```

Focus 不一定是一个 Geometry。

它可以表示：

```text
视觉关注区域
```

---

# 27. Focus Field

Focus 可以映射为：

```text
Focus
 ↓
Scalar Field
 ↓
Density
Scale
Opacity
Contrast
```

形成：

```text
        low
      low low
    medium medium
   HIGH  FOCUS  HIGH
    medium medium
      low low
```

---

# 28. Multiple Focus

支持多个 Focus：

```ts
interface FocusPoint {

  position: Point

  strength: number

  radius: number

}
```

例如：

```text
●                 ●
      ●
```

但默认最多建议：

```text
1–3
```

避免视觉竞争。

---

# 29. Negative Space

负空间是本引擎艺术构图的重要指标。

定义：

```text
Negative Space
=
未被视觉元素占据的有效区域
```

例如：

```text
● ● ●

        TEXT


● ● ●
```

中间区域不是“空”。

它是：

> **Composition 的主动设计结果。**

---

# 30. Negative Space Config

```ts
interface NegativeSpaceConfig {

  amount: number

  protectedRegions?: Region[]

}
```

支持：

```text
Center
Top
Bottom
Left
Right
Custom
```

---

# 31. Protected Region

例如网页 Hero：

```text
┌───────────────────────────┐
│                           │
│       PROTECTED           │
│        TEXT               │
│                           │
└───────────────────────────┘
```

Geometry 不应该大量进入 protected region。

---

# 32. Hierarchy

Composition 必须建立视觉层级。

```text
Primary
   ↓
Secondary
   ↓
Tertiary
```

对应：

```text
主视觉
次视觉
装饰
```

---

# 33. Hierarchy Config

```ts
interface HierarchyConfig {

  primary: number

  secondary: number

  tertiary: number

}
```

可以通过：

```text
Scale
Opacity
Density
Contrast
Depth
```

实现层级差异。

---

# 34. Scale Distribution

Geometry 尺寸不应该完全相同。

支持：

```text
Uniform
Linear
Gaussian
Power
Organic
FocusWeighted
```

例如：

```text
●
  ●
      ●
 ●
         ●
```

大小也可以变化：

```text
●
  ●●
     ●●●
```

---

# 35. Depth

虽然 MVP 是 2D，但 Composition 必须支持逻辑 Depth。

```ts
interface DepthConfig {

  enabled: boolean

  range: number

}
```

Depth 可以影响：

```text
Scale
Opacity
Blur
Parallax
Brightness
```

---

# 36. Logical Depth

例如：

```text
Background
    ↓
Middle
    ↓
Foreground
```

即使所有元素都在 Canvas 2D 中，也可以产生空间层次。

---

# 37. Depth Model

```text
Depth
 ↓
┌───────────────┐
│ Scale         │
│ Opacity       │
│ Blur          │
│ Contrast      │
│ Motion        │
└───────────────┘
```

Composition 只决定 Depth。

具体视觉表现由 Material / Motion 实现。

---

# 38. Rhythm

Rhythm 描述 Geometry 在空间中的重复、变化和间隔规律。

例如：

```text
● ● ● ● ●
```

是规则 Rhythm。

而：

```text
●  ● ●    ●   ●●
```

是变化 Rhythm。

---

# 39. Rhythm Config

```ts
interface RhythmConfig {

  frequency: number

  variation: number

  phase: number

  progression: number

}
```

---

# 40. Rhythm 类型

```text
Regular
Alternating
Progressive
Wave
Organic
Chaotic
```

---

# 41. Progressive Rhythm

例如：

```text
●
  ●
    ●
       ●
          ●
```

或者：

```text
●
 ●●
  ●●●
   ●●●●
```

可以产生：

```text
Growth
Direction
Movement
```

即使没有 Animation。

---

# 42. Layer Composition

Scene 由多个 Layer 组成：

```ts
interface SceneLayer {

  id: string

  zIndex: number

  geometries: Geometry[]

  material: Material

  opacity: number

  blendMode?: BlendMode

}
```

Composition 负责：

```text
Geometry
    ↓
Layer
```

---

# 43. Layer 类型

推荐：

```text
Background
Atmosphere
Structure
Flow
Accent
Foreground
```

例如：

```text
Scene
├── Background
├── Atmosphere
├── Flow
├── Structure
└── Accent
```

---

# 44. Background Layer

特点：

```text
低对比
低密度
高覆盖
```

主要负责：

```text
建立空间基调
```

---

# 45. Atmosphere Layer

特点：

```text
柔和
模糊
低频
低对比
```

例如：

```text
Gradient
Glow
Noise
Soft Ribbon
```

---

# 46. Structure Layer

提供主要几何结构：

```text
Curve
Ribbon
Mesh
Orbital
Wave
```

是视觉主体。

---

# 47. Accent Layer

少量高权重元素：

```text
Point
Glow
Highlight
Small Geometry
```

数量必须受到约束。

---

# 48. Foreground Layer

前景元素：

```text
高对比
较大
较清晰
```

用于产生空间深度。

---

# 49. Composition Constraint

Composition 不能无限自由。

必须支持约束：

```ts
interface CompositionConstraint {

  minSpacing?: number

  maxDensity?: number

  protectedRegions?: Region[]

  maxOverlap?: number

  maxVisualWeight?: number

}
```

---

# 50. Overlap

Overlap 不一定是错误。

支持：

```text
None
Controlled
Organic
Layered
```

推荐：

```text
Organic Art
→ Controlled Overlap
```

而不是完全禁止重叠。

---

# 51. Composition Randomness

随机必须属于：

```text
Controlled Randomness
```

而不是：

```text
Unbounded Randomness
```

随机范围由：

```text
Seed
+
Semantic Parameters
+
Composition Constraints
```

共同确定。

---

# 52. Composition Determinism

同样：

```text
Preset
+
Seed
+
Viewport
```

必须产生相同 Composition。

即：

```text
C(preset, seed, viewport)
```

具有确定性。

---

# 53. Responsive Composition

Composition 必须根据 viewport 变化。

例如：

```text
Desktop
───────────────
多层
高密度
较复杂

Mobile
────────
少层
低密度
低复杂度
```

---

# 54. Responsive Rules

```ts
interface ResponsiveComposition {

  desktop: Partial<CompositionConfig>

  tablet?: Partial<CompositionConfig>

  mobile?: Partial<CompositionConfig>

}
```

但推荐优先使用：

```text
Semantic Scaling
```

而不是大量 breakpoint。

---

# 55. Mobile Composition

移动端默认：

```text
Density ↓
Complexity ↓
Geometry Count ↓
Glow ↓
Motion Complexity ↓
```

同时：

```text
Focus ↑
Negative Space ↑
```

保证文字和交互元素可读。

---

# 56. Composition Quality

Composition 必须具有基础质量指标：

```text
Balance
Density
Focus
Negative Space
Hierarchy
Rhythm
Overlap
Contrast Distribution
```

这些指标未来可以进入：

```text
Visual Quality Evaluation
```

但 V1.4 不实现完整自动评分系统。

---

# 57. Composition Semantic Parameters

用户层只暴露：

```ts
interface CompositionSemanticConfig {

  density: number

  balance: number

  symmetry: number

  focus: number

  depth: number

  rhythm: number

  negativeSpace: number

  complexity: number

}
```

避免用户直接操作：

```text
Poisson radius
Gaussian sigma
golden ratio offset
layer weight
```

---

# 58. Semantic Mapping

例如：

```text
density
   ↓
count
spacing
overlap

focus
   ↓
position
density field
scale field
opacity field

depth
   ↓
layer distribution
scale
opacity

rhythm
   ↓
spacing
phase
progression
```

---

# 59. Composition Pipeline 实例

以 `aurora` 为例：

```text
Curl Field
    ↓
Flow Curves
    ↓
Ribbon Geometry
    ↓
Flow Distribution
    ↓
Focus
    ↓
Negative Space
    ↓
Depth Layers
    ↓
Visual Hierarchy
    ↓
Composition
```

---

# 60. Hero Background 实例

目标：

```text
中间文字清晰
两侧具有动态艺术背景
```

Composition：

```text
Edge Distribution
       +
Center Protected Region
       +
Low Density Center
       +
High Depth Variation
```

结果：

```text
┌────────────────────────────┐
│ ●●●                ●●●●    │
│   ●                ●       │
│                            │
│         TEXT               │
│                            │
│   ●                ●●      │
│ ●●●                ●●●     │
└────────────────────────────┘
```

---

# 61. Organic Background 实例

```text
Organic Distribution
        +
Curl Field
        +
Multiple Depth Layers
        +
Controlled Overlap
        +
Asymmetric Balance
```

形成：

```text
~~~~~~     ~~~~~
   ~~~~~~~~~
~~~~     ~~~~~~~
    ~~~~~~~~~
```

---

# 62. Composition Registry

```ts
interface CompositionRegistry {

  register(
    type: string,
    factory: CompositionFactory
  ): void

  get(
    type: string
  ): CompositionFactory | undefined

}
```

允许：

```text
Custom Composition
Custom Distribution
Custom Layout
Custom Hierarchy
```

---

# 63. Composition Plugin

插件可以扩展：

```text
Distribution
Layout
Focus Strategy
Rhythm Strategy
Balance Strategy
Composition Constraint
```

但不得破坏：

```text
CompositionContext
SceneLayer
Semantic Configuration
```

---

# 64. Composition Performance

Composition 主要发生在：

```text
Initialization
Resize
Preset Change
Configuration Update
```

不应每一帧完整重建。

推荐：

```text
Static Composition
      ↓
Cache

Dynamic Composition
      ↓
Incremental Update
```

---

# 65. Hot Update

以下参数允许 Hot Update：

```text
Density
Focus
Balance
Symmetry
Depth
Negative Space
```

以下变化可能触发 Rebuild：

```text
Geometry Type
Distribution Type
Layer Count
Major Composition Strategy
```

---

# 66. Composition Serialization

示例：

```json
{
  "distribution": {
    "type": "edge",
    "strength": 0.8
  },
  "density": 0.45,
  "balance": 0.65,
  "symmetry": 0.2,
  "focus": {
    "position": [0.5, 0.5],
    "strength": 0.9,
    "radius": 0.25
  },
  "depth": {
    "enabled": true,
    "range": 0.8
  },
  "negativeSpace": 0.7
}
```

---

# 67. Composition 与 Preset

Preset 不应该只保存 Geometry。

推荐：

```text
Preset
├── Geometry
├── Field
├── Composition
├── Motion
└── Material
```

因此两个 Preset 即使使用相同 Geometry，也可以产生完全不同的视觉结果。

---

# 68. Composition 与 Theme

Theme 不改变 Composition 结构。

例如：

```text
Preset:
Aurora

Theme:
Dark
Light
Ocean
Violet
Monochrome
```

Theme 主要影响：

```text
Palette
Material
Contrast
Glow
```

Composition 保持稳定。

---

# 69. Composition 核心边界

最终边界：

```text
Geometry
  = Shape

Field
  = Spatial Influence

Composition
  = Spatial Organization

Motion
  = Temporal Change

Material
  = Visual Appearance

Renderer
  = Rendering
```

这是引擎最重要的职责分离之一。

---

# 70. V1.4 MVP

必须实现：

```text
[x] Density
[x] Distribution
[x] Balance
[x] Symmetry
[x] Focus
[x] Negative Space
[x] Hierarchy
[x] Scale Distribution
[x] Depth
[x] Rhythm
[x] Layer Composition
[x] Protected Region
[x] Overlap Constraint
[x] Responsive Composition
[x] Seeded Determinism
[x] Semantic Parameters
[x] Composition Registry
[x] Serialization
```

---

# 71. V1.4 暂不实现

明确排除：

```text
AI Art Direction
LLM Composition
Automatic Art Critic
Computer Vision Layout Analysis
3D Scene Composition
Full Physics Layout
Design Editor
Online Composition Marketplace
```

这些不属于核心运行时。

---

# 72. V1.4 收敛判定

Composition 系统完成以下能力后冻结：

- [x] Distribution
- [x] Density
- [x] Balance
- [x] Symmetry
- [x] Focus
- [x] Negative Space
- [x] Hierarchy
- [x] Scale
- [x] Depth
- [x] Rhythm
- [x] Layer
- [x] Protected Region
- [x] Overlap
- [x] Responsive
- [x] Determinism
- [x] Semantic Configuration
- [x] Serialization
- [x] Plugin Boundary
- [x] Performance Boundary

**Composition Specification V1.4 收敛。**

---

# 73. 当前核心模型

至此：

```text
                    Generative Art
                          │
          ┌───────────────┼───────────────┐
          ↓               ↓               ↓
      Geometry          Field        Composition
          │               │               │
         Shape        Influence       Organization
          │               │               │
          └───────────────┼───────────────┘
                          ↓
                       Motion
                          ↓
                       Material
                          ↓
                      Renderer
```

已经形成稳定的六层核心语义模型：

```text
1. Geometry
2. Field
3. Composition
4. Motion
5. Material
6. Renderer
```

---

# 74. 下一阶段

下一版本：

> **Motion Specification V1.5**

将只解决：

```text
Geometry
   +
Field
   ↓
Motion
   ↓
Time
```

重点定义：

```text
Flow
Drift
Orbit
Wave
Pulse
Breathing
Morph
Rotation
Parallax
Velocity
Acceleration
Temporal Integration
Frame Scheduling
Pause / Resume
Reduced Motion
Interaction Motion
```

尤其需要明确一个关键边界：

> **Field 决定“往哪里受到影响”，Motion 决定“这种影响如何随时间产生运动”。**

V1.5 不重新定义 Geometry、Field、Composition，也不扩展产品范围。

**Composition Specification V1.4 收敛。**