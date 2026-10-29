# Generative Geometric Art Engine
## Material Specification V1.6

> **Status:** Draft → Converged Target  
> **Version:** V1.6  
> **Scope:** Material / Appearance  
> **Previous:** Motion Specification V1.5  
> **Next:** Preset Specification V1.7

---

# 1. 文档目标

Material Specification 定义 Generative Geometric Art Engine 中：

> **Geometry 如何被表现为具有颜色、透明度、光感、层次、质感和视觉风格的艺术对象。**

Material 不负责：

- 生成 Geometry
- 计算 Geometry 位置
- 决定 Geometry 空间布局
- 决定 Geometry 的运动轨迹
- 管理 Renderer 生命周期

Material 只负责：

> **Appearance = How Geometry Looks**

整体语义模型：

```text
Geometry
    │
    ▼
Composition
    │
    ▼
Motion
    │
    ▼
Material
    │
    ├── Color
    ├── Opacity
    ├── Gradient
    ├── Glow
    ├── Blur
    ├── Grain
    ├── Noise
    ├── Shadow
    ├── Depth
    └── Blend
    │
    ▼
Renderer
    │
    ▼
Visual Output
```

---

# 2. Material 在整体架构中的位置

Generative Art Engine 六层核心语义：

```text
┌─────────────────────────────┐
│          Renderer           │
│       Presentation          │
├─────────────────────────────┤
│          Material           │
│         Appearance          │
├─────────────────────────────┤
│           Motion            │
│       Temporal Change       │
├─────────────────────────────┤
│        Composition          │
│      Spatial Organization   │
├─────────────────────────────┤
│            Field            │
│         Influence           │
├─────────────────────────────┤
│          Geometry           │
│            Shape            │
└─────────────────────────────┘
```

语义职责：

| Layer | 核心问题 |
|---|---|
| Geometry | What is it? |
| Field | What influences it? |
| Composition | Where is it organized? |
| Motion | How does it change over time? |
| Material | How does it look? |
| Renderer | How is it presented? |

Material 不应该反向依赖 Renderer。

---

# 3. Material 核心模型

定义统一 Material：

```ts
interface Material {
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

Material 可以被 Geometry、SceneLayer 或整个 Scene 使用。

---

# 4. Material 的三个层级

Material 分为三个层级：

```text
Material
│
├── Base Appearance
│   ├── Color
│   ├── Opacity
│   └── Gradient
│
├── Visual Effects
│   ├── Glow
│   ├── Blur
│   ├── Grain
│   ├── Noise
│   └── Shadow
│
└── Spatial Appearance
    ├── Depth
    ├── Blend
    └── Layer Interaction
```

这样可以避免把所有视觉效果混成一个大型参数对象。

---

# 5. Color

Color 是 Material 的基础视觉属性。

```ts
interface Color {
  r: number
  g: number
  b: number
  a?: number
}
```

内部标准化：

```text
RGB
RGBA
Linear RGB
OKLab
OKLCH
```

推荐内部颜色计算采用：

> **Linear RGB + OKLab / OKLCH**

---

# 6. ColorSource

颜色不一定是静态颜色。

```ts
type ColorSource =
  | SolidColor
  | GradientColor
  | PaletteColor
  | DynamicColor
  | FieldColor
```

---

# 7. Solid Color

```ts
interface SolidColor {
  type: 'solid'
  color: Color
}
```

例如：

```json
{
  "type": "solid",
  "color": "#8FD3FF"
}
```

---

# 8. Palette

Palette 用于定义艺术作品的颜色体系。

```ts
interface Palette {
  id: string
  colors: Color[]
  background?: Color
  interpolation?: 'linear' | 'perceptual'
}
```

示例：

```json
{
  "id": "aurora",
  "colors": [
    "#7DD3FC",
    "#818CF8",
    "#C084FC",
    "#F0ABFC"
  ],
  "interpolation": "perceptual"
}
```

---

# 9. Palette 不等于 Theme

两者必须保持独立。

```text
Theme
│
├── Typography
├── UI Colors
├── Surface
├── Border
└── Generative Art Defaults

Palette
│
├── Art Colors
├── Gradient
└── Color Variation
```

因此：

> Theme 是应用视觉主题，Palette 是生成艺术的色彩系统。

---

# 10. OKLab / OKLCH

引擎不应只使用 RGB 插值。

RGB：

```text
Color A ───── RGB interpolation ───── Color B
```

可能导致：

- 中间颜色不自然
- 明度变化不均匀
- 高饱和度区域视觉跳变

推荐：

```text
Color A
   │
   ▼
 OKLCH
   │
   ▼
Perceptual Interpolation
   │
   ▼
Color B
```

推荐用于：

- Gradient
- Palette interpolation
- Dynamic Color
- Animated Color
- Glow color
- Atmospheric effects

---

# 11. Gradient

```ts
interface Gradient {
  type: GradientType
  stops: GradientStop[]
}
```

```ts
interface GradientStop {
  offset: number
  color: Color
}
```

支持：

```ts
type GradientType =
  | 'linear'
  | 'radial'
  | 'conic'
  | 'path'
  | 'depth'
  | 'field'
```

---

# 12. Linear Gradient

```text
A ─────────────── B
```

适合：

- Ribbon
- Wave
- Line
- Structural geometry

---

# 13. Radial Gradient

```text
       B
     B B B
   B B A B B
     B B B
       B
```

适合：

- Glow
- Orbital
- Atmosphere
- Focus

---

# 14. Depth Gradient

Material 可以根据 Geometry 的深度产生颜色变化。

```text
Depth
  │
  ├── foreground → brighter
  │
  ├── middle     → normal
  │
  └── background → darker
```

例如：

```ts
interface DepthGradient {
  near: Color
  middle: Color
  far: Color
}
```

---

# 15. Field Color

颜色可以受到 Field 影响。

```text
Field
  │
  ▼
Sample
  │
  ├── magnitude
  ├── direction
  └── gradient
        │
        ▼
      Color
```

例如：

```ts
interface FieldColor {
  type: 'field'
  fieldId: string
  palette: string
  strength: number
}
```

这使颜色与空间结构产生关联。

---

# 16. Dynamic Color

颜色可以随时间变化。

```ts
interface DynamicColor {
  type: 'dynamic'
  source: ColorSource
  speed?: number
  phase?: number
}
```

但是 Dynamic Color 属于 Material 的表现层。

不能重新定义 Motion。

因此：

```text
Motion
  └── Geometry movement

Dynamic Color
  └── Appearance movement
```

---

# 17. Opacity

Opacity：

```ts
opacity: number
```

范围：

```text
0.0 ─────────────── 1.0
transparent        opaque
```

建议：

```text
0.0 → invisible
0.3 → atmospheric
0.6 → soft
0.8 → strong
1.0 → solid
```

Opacity 可以应用于：

- Geometry
- Layer
- Material
- Gradient Stop

---

# 18. Opacity Composition

多个透明度不能简单覆盖。

推荐：

```text
FinalOpacity
=
GeometryOpacity
× MaterialOpacity
× LayerOpacity
× GlobalOpacity
```

因此：

```ts
finalOpacity =
  geometryOpacity *
  materialOpacity *
  layerOpacity *
  globalOpacity
```

---

# 19. Glow

Glow 用于创造：

- 光晕
- 发光
- 柔和边缘
- Atmosphere
- Aurora
- Cosmic visual

```ts
interface GlowConfig {
  enabled: boolean
  radius: number
  intensity: number
  color?: Color
}
```

---

# 20. Glow 模型

Glow 不应该直接修改 Geometry。

概念模型：

```text
Geometry
    │
    ├───────────────► Base
    │
    └── Blur ──► Glow Layer
                    │
                    ▼
                 Composite
```

因此 Glow 是：

> Secondary Appearance Layer

---

# 21. Glow Composition

推荐：

```text
Final
=
Base
+
Glow
```

而不是：

```text
Geometry = Glow
```

这样 Renderer 可以根据能力决定实现方式。

---

# 22. Blur

```ts
interface BlurConfig {
  enabled: boolean
  radius: number
}
```

Blur 类型：

```ts
type BlurMode =
  | 'gaussian'
  | 'soft'
  | 'depth'
  | 'motion'
```

MVP：

```text
gaussian
soft
```

---

# 23. Blur 的边界

Blur 是昂贵操作。

因此：

```text
Geometry
   │
   ▼
Renderer capability
   │
   ├── native blur
   ├── offscreen blur
   └── approximate blur
```

Material 只描述：

> “需要什么视觉效果”

Renderer 决定：

> “如何实现”

---

# 24. Grain

Grain 用于模拟材料质感。

```ts
interface GrainConfig {
  enabled: boolean
  intensity: number
  scale: number
  animated?: boolean
}
```

适合：

- Film
- Paper
- Organic
- Atmospheric
- Premium visual

---

# 25. Noise

Noise 与 Grain 不完全相同。

```text
Noise
└── structural / procedural variation

Grain
└── surface texture
```

Noise：

```ts
interface NoiseConfig {
  enabled: boolean
  scale: number
  intensity: number
  animated?: boolean
}
```

---

# 26. Grain + Noise

推荐组合：

```text
Geometry
    │
    ▼
Material
    │
    ├── Color
    ├── Gradient
    ├── Noise
    │
    └── Grain
          │
          ▼
       Texture
```

Noise 负责结构变化。

Grain 负责表面质感。

---

# 27. Shadow

```ts
interface ShadowConfig {
  enabled: boolean
  color?: Color
  blur?: number
  offsetX?: number
  offsetY?: number
  opacity?: number
}
```

Shadow 用于：

- depth
- separation
- hierarchy
- visual focus

---

# 28. Blend Mode

```ts
type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'soft-light'
  | 'hard-light'
  | 'lighter'
  | 'difference'
```

MVP 最少支持：

```text
normal
screen
lighter
multiply
overlay
```

---

# 29. Blend 语义

Blend Mode 属于：

> Layer compositing

而不是 Color。

因此：

```text
Color
    │
    ▼
Material
    │
    ▼
Layer
    │
    ▼
Blend
    │
    ▼
Scene
```

---

# 30. Depth Material

Material 可以根据深度影响：

- opacity
- brightness
- blur
- saturation
- glow

```ts
interface DepthMaterialConfig {
  enabled: boolean
  opacity?: DepthRange
  blur?: DepthRange
  brightness?: DepthRange
  saturation?: DepthRange
}
```

---

# 31. Depth Range

```ts
interface DepthRange {
  near: number
  far: number
}
```

例如：

```json
{
  "near": 1,
  "far": 0.25
}
```

表示：

```text
Near ───────────── Far
100%               25%
```

---

# 32. Material Semantics

Material 不应该要求用户理解所有底层参数。

定义高级语义：

```ts
interface MaterialSemanticConfig {
  luminosity: number
  softness: number
  glow: number
  transparency: number
  texture: number
  depth: number
  contrast: number
  saturation: number
}
```

推荐范围：

```text
0.0 ───────────── 1.0
```

---

# 33. Material Semantic Mapping

例如：

```text
softness
   │
   ├── blur ↑
   ├── contrast ↓
   └── glow diffusion ↑
```

```text
luminosity
   │
   ├── brightness ↑
   └── glow intensity ↑
```

```text
texture
   │
   ├── grain ↑
   └── noise ↑
```

```text
depth
   │
   ├── opacity variation
   ├── blur variation
   └── brightness variation
```

---

# 34. Material Preset

Material 可以独立成为可复用对象。

```ts
interface MaterialPreset {
  id: string
  version: string
  material: Material
}
```

例如：

```text
soft-glow
glass
aurora
cosmic
organic
minimal
film
```

---

# 35. Material 与 Style

Material 是 Style 的实现基础。

例如：

```text
Style: Atmospheric
        │
        ├── low contrast
        ├── high softness
        ├── subtle glow
        ├── transparent layers
        └── low grain
```

因此：

```text
Style
  ↓
Material Semantics
  ↓
Material
```

---

# 36. Visual Style Mapping

推荐内置 Style：

```text
Minimal
Organic
Atmospheric
Elegant
Futuristic
Structural
Fluid
Cosmic
```

Style 不直接进入 Renderer。

---

# 37. Appearance Composition

单一 Material 不足以表达复杂视觉。

因此允许 Material Stack：

```ts
interface MaterialStack {
  layers: MaterialLayer[]
}
```

```ts
interface MaterialLayer {
  material: Material
  opacity: number
  blendMode?: BlendMode
}
```

例如：

```text
Base Color
    ↓
Gradient
    ↓
Glow
    ↓
Noise
    ↓
Grain
    ↓
Final Composite
```

---

# 38. Material Stack 原则

Material Stack 必须满足：

```text
Deterministic
Composable
Serializable
Renderer Independent
```

不能允许 Renderer-specific 参数成为核心 Material Schema 的必选字段。

---

# 39. Material Resolution

最终 Material 通过以下过程产生：

```text
Default
   ↓
Preset
   ↓
Theme
   ↓
CSS
   ↓
Data Attribute
   ↓
JavaScript
   ↓
Runtime Update
   ↓
Material Resolution
```

输出：

```ts
ResolvedMaterial
```

---

# 40. Resolved Material

```ts
interface ResolvedMaterial {
  color: ColorSource
  opacity: number
  gradient?: Gradient
  glow?: GlowConfig
  blur?: BlurConfig
  grain?: GrainConfig
  noise?: NoiseConfig
  shadow?: ShadowConfig
  blendMode: BlendMode
  depth?: DepthMaterialConfig
}
```

Resolved Material 必须是：

> Renderer 可直接消费的稳定结构。

---

# 41. CSS Variable Mapping

Material 允许通过 CSS Variables 暴露语义参数。

统一前缀：

```text
--ga-
```

示例：

```css
.hero {
  --ga-luminosity: 0.8;
  --ga-softness: 0.7;
  --ga-glow: 0.5;
  --ga-transparency: 0.35;
  --ga-texture: 0.2;
  --ga-depth: 0.6;
}
```

---

# 42. Material CSS Variables

推荐：

```text
--ga-luminosity
--ga-softness
--ga-glow
--ga-transparency
--ga-texture
--ga-depth
--ga-contrast
--ga-saturation
```

低层变量可继续扩展，但不应成为推荐用户 API。

---

# 43. Material Data Attributes

例如：

```html
<div
  data-generative-art
  data-art-material="aurora"
  data-art-glow="0.6"
  data-art-softness="0.8"
  data-art-texture="0.2">
</div>
```

---

# 44. Renderer Independence

Material API：

```text
Material
   │
   ▼
Material Resolver
   │
   ▼
Resolved Material
   │
   ├────────► Canvas2D
   ├────────► WebGL
   └────────► WebGPU
```

Material 不应该出现：

```ts
canvasContext.shadowBlur
gl.enable(...)
gpuPipeline(...)
```

这些属于 Renderer。

---

# 45. Canvas2D 映射

Canvas2D Renderer 可以将：

```text
Glow
Blur
Shadow
Blend
```

映射到：

- shadowBlur
- globalAlpha
- globalCompositeOperation
- offscreen canvas
- compositing

---

# 46. WebGL 映射

WebGL 可以将 Material 映射为：

```text
Uniforms
Textures
Framebuffer
Shader Parameters
Post Processing
```

但这些实现细节不进入 Material Schema。

---

# 47. WebGPU 映射

WebGPU 可以进一步支持：

```text
GPU Material
GPU Post Processing
Compute-based Noise
High Density Glow
Advanced Blending
```

仍然保持：

```text
Same Material
Different Renderer
```

---

# 48. Performance Budget

Material Effect 必须分级：

```text
Tier 0
Base Color
Opacity
Gradient

Tier 1
Blend
Depth
Simple Shadow

Tier 2
Glow
Blur

Tier 3
Noise
Grain
Multi-pass Effects
```

默认：

> 优先保证视觉稳定性，而不是叠加效果数量。

---

# 49. Effect Budget

定义：

```ts
interface MaterialBudget {
  maxBlurPasses: number
  maxGlowPasses: number
  maxOffscreenLayers: number
  maxTextureEffects: number
}
```

Renderer 可以根据设备能力调整。

---

# 50. Quality Degradation

当性能不足时：

```text
Full Material
      │
      ▼
Remove Grain
      │
      ▼
Reduce Noise
      │
      ▼
Reduce Blur
      │
      ▼
Reduce Glow
      │
      ▼
Base Material
```

视觉降级必须优先保证：

```text
Composition
>
Color
>
Opacity
>
Motion
>
Effects
```

也就是说：

> 宁可减少特效，也不能破坏核心艺术构图。

---

# 51. Reduced Motion

Reduced Motion 主要影响 Motion。

Material 只有在存在：

```text
animated glow
animated noise
animated grain
dynamic color
```

时才需要同步降级。

例如：

```text
prefers-reduced-motion
        │
        ▼
Dynamic Material
        │
        ├── static color
        ├── static glow
        └── static grain
```

---

# 52. Deterministic Material

Material 中的 Noise、Grain、Palette Variation 必须使用 Seed。

禁止：

```ts
Math.random()
```

推荐：

```ts
materialSeed
noiseSeed
grainSeed
colorSeed
```

Seed 层级：

```text
Root Seed
   │
   └── Material Seed
          ├── Color Seed
          ├── Noise Seed
          └── Grain Seed
```

---

# 53. Material Serialization

Material 必须可以 JSON 序列化。

示例：

```json
{
  "color": "#8FD3FF",
  "opacity": 0.72,
  "gradient": {
    "type": "radial",
    "stops": [
      {
        "offset": 0,
        "color": "#FFFFFF"
      },
      {
        "offset": 1,
        "color": "#7DD3FC"
      }
    ]
  },
  "glow": {
    "enabled": true,
    "radius": 18,
    "intensity": 0.6
  },
  "grain": {
    "enabled": true,
    "intensity": 0.08,
    "scale": 1
  },
  "blendMode": "screen"
}
```

---

# 54. Material Registry

```ts
interface MaterialRegistry {
  register(
    type: string,
    factory: MaterialFactory
  ): void

  get(
    type: string
  ): MaterialFactory | undefined
}
```

允许第三方扩展：

```text
Core
 │
 ├── Built-in Material
 │
 └── Plugin Material
```

---

# 55. Material Factory

```ts
interface MaterialFactory {
  create(
    config: MaterialConfig,
    context: MaterialContext
  ): Material
}
```

---

# 56. Material Context

```ts
interface MaterialContext {
  viewport: Viewport
  seed: Seed
  semantic: SemanticArtConfig
  palette?: Palette
  field?: Field
  depth?: number
}
```

---

# 57. Material Pipeline

完整 Material Pipeline：

```text
Material Config
      │
      ▼
Normalize
      │
      ▼
Semantic Resolution
      │
      ▼
Palette Resolution
      │
      ▼
Effect Resolution
      │
      ▼
Depth Resolution
      │
      ▼
Material Budget
      │
      ▼
Resolved Material
      │
      ▼
Renderer Adapter
```

---

# 58. Appearance Pipeline

最终视觉输出：

```text
Geometry
   │
   ▼
Composition
   │
   ▼
Motion
   │
   ▼
Material
   │
   ├── Color
   ├── Gradient
   ├── Opacity
   ├── Glow
   ├── Blur
   ├── Noise
   ├── Grain
   ├── Shadow
   └── Blend
   │
   ▼
Layer Composite
   │
   ▼
Renderer
```

---

# 59. Material Quality Contract

Material 必须满足：

### MQ-01
颜色具有确定性。

### MQ-02
同一个 Seed 应得到相同 Material。

### MQ-03
Material 不依赖具体 Renderer。

### MQ-04
Material 参数可以序列化。

### MQ-05
Material 可以独立复用。

### MQ-06
Material Effect 必须具有性能边界。

### MQ-07
视觉降级不能破坏核心构图。

### MQ-08
Material 不得修改 Geometry 语义。

### MQ-09
Material 不得修改 Composition 语义。

### MQ-10
Material 不得直接管理 Motion。

---

# 60. Material Visual Quality Metrics

Material 可以参与视觉质量测试：

```text
Color Consistency
Contrast
Opacity Consistency
Glow Stability
Gradient Smoothness
Depth Separation
Effect Density
Visual Noise
```

但 Material 不负责：

> 自动判断艺术是否“好看”。

视觉评价属于后续 Visual Quality / UIQ 等外部质量体系。

---

# 61. Material MVP

V1.6 MVP 必须支持：

```text
Color
Opacity
Palette
Linear Gradient
Radial Gradient
Perceptual Color Interpolation
Glow
Blur
Blend
Depth
Grain
Noise
Shadow
Material Semantics
Material Stack
Seeded Material
Serialization
Registry
Canvas2D Mapping
Performance Budget
Reduced Motion Compatibility
```

---

# 62. Material P1

P1：

```text
Field Color
Dynamic Color
Path Gradient
Depth Gradient
Advanced Grain
Advanced Noise
Multi-pass Material
GPU Material Optimization
```

---

# 63. Material P2

暂不进入核心版本：

```text
Physical Material
PBR
Metallic
Roughness
Refraction
Subsurface Scattering
Volumetric Material
3D Shader Material
```

原因：

> 当前产品是二维 Web Generative Art Engine，而不是完整 3D Rendering Engine。

---

# 64. 明确排除

V1.6 不包含：

```text
3D PBR
Physics Material
Texture Editor
Material Editor
Node-based Shader Editor
AI Material Generation
LLM Art Direction
Online Material Marketplace
Cloud Material Service
```

---

# 65. V1.6 核心语义闭环

至此：

```text
Geometry
   │
   │ Shape
   ▼
Field
   │
   │ Influence
   ▼
Composition
   │
   │ Organization
   ▼
Motion
   │
   │ Temporal Change
   ▼
Material
   │
   │ Appearance
   ▼
Renderer
   │
   │ Presentation
   ▼
Visual Art
```

六层职责已经形成完整闭环。

---

# 66. V1.6 与前版本关系

```text
V1.0 Architecture
        │
        ▼
V1.1 Semantic Runtime
        │
        ▼
V1.4 Composition
        │
        ▼
V1.5 Motion
        │
        ▼
V1.6 Material
```

当前核心模型：

```text
Shape
  +
Influence
  +
Organization
  +
Temporal Change
  +
Appearance
  +
Presentation
```

---

# 67. V1.6 收敛结论

Material V1.6 完成后，以下核心概念正式稳定：

```text
Geometry
Field
Composition
Motion
Material
Renderer
```

其中：

```text
Geometry = Shape
Field = Influence
Composition = Organization
Motion = Temporal Change
Material = Appearance
Renderer = Presentation
```

后续规范不得重新定义以上六层的职责。

下一阶段只允许：

> **在既定语义模型之上进行组合、配置、集成和工程化。**

---

# 68. 下一阶段

下一版本进入：

> **Generative Geometric Art Engine Preset Specification V1.7**

重点解决：

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
        │
        ▼
      Preset
```

即：

> 如何把一组经过设计的生成规则封装成可复用、可版本化、可组合的艺术生成方案。

V1.7 将是从“引擎能力定义”进入“艺术能力产品化”的关键阶段。