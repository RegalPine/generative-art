# Generative Geometric Art Engine
## CSS Variable Specification V1.8

> **Status:** Draft → Converged Target  
> **Version:** V1.8  
> **Scope:** CSS Variables / Declarative Configuration / Web Integration  
> **Previous:** Preset Specification V1.7  
> **Next:** Renderer Contract V1.9

---

# 1. 文档目标

V1.8 定义 Web 应用如何通过 CSS Variables 对 Generative Art Engine 进行声明式配置。

核心原则：

> **CSS declares. TypeScript generates.**

CSS 只负责：

- 声明语义参数
- 提供主题上下文
- 提供响应式覆盖
- 提供视觉参数
- 控制容器相关配置

CSS 不负责：

- Geometry 算法
- Field 算法
- Composition 算法
- Motion 算法
- Material 算法
- Scene Runtime
- Renderer

---

# 2. CSS 在整体架构中的位置

```text id="6p8n9x"
HTML
  │
  ├── data-* attributes
  │
  ▼
CSS Variables
  │
  ├── semantic parameters
  ├── appearance parameters
  └── responsive context
  │
  ▼
Configuration Resolver
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
Renderer
```

---

# 3. CSS 的核心定位

CSS Integration Layer：

```text id="a9t5p2"
CSS
 │
 │ configuration
 ▼
Generative Art Engine
```

而不是：

```text id="z6r1x4"
CSS
 │
 │ drawing instructions
 ▼
Canvas
```

因此：

> CSS 是配置协议，不是绘图语言。

---

# 4. CSS Variable Namespace

所有官方变量必须使用：

```text id="z8q2r5"
--ga-*
```

其中：

```text id="3c9j7m"
ga = Generative Art
```

示例：

```css id="c7x4p1"
.hero {
  --ga-density: 0.7;
  --ga-complexity: 0.6;
  --ga-energy: 0.5;
  --ga-softness: 0.8;
}
```

---

# 5. CSS Variable 分类

变量分为：

```text id="q4n7s2"
--ga-semantic-*
--ga-motion-*
--ga-material-*
--ga-composition-*
--ga-color-*
--ga-runtime-*
--ga-responsive-*
```

但为了降低使用复杂度：

> 推荐用户优先使用不带子域前缀的语义变量。

例如：

```css id="k3v9m6"
--ga-density
--ga-energy
--ga-softness
```

---

# 6. 核心 Semantic Variables

V1.8 官方语义变量：

```text id="w8m2q5"
--ga-density
--ga-complexity
--ga-energy
--ga-softness
--ga-depth
--ga-rhythm
--ga-turbulence
--ga-focus
```

全部推荐范围：

```text id="x6p4r8"
0.0 ───────────── 1.0
```

---

# 7. Semantic Variable Mapping

```text id="g7k3z1"
--ga-density
    ↓
Composition Density

--ga-complexity
    ↓
Geometry / Composition Complexity

--ga-energy
    ↓
Motion Energy

--ga-softness
    ↓
Material Softness

--ga-depth
    ↓
Composition + Material Depth

--ga-rhythm
    ↓
Composition Rhythm + Motion Phase

--ga-turbulence
    ↓
Field Turbulence

--ga-focus
    ↓
Composition Focus
```

---

# 8. CSS Semantic Parameters

推荐：

```css id="z8r5x3"
.art {
  --ga-density: 0.65;
  --ga-complexity: 0.55;
  --ga-energy: 0.45;
  --ga-softness: 0.75;
  --ga-depth: 0.6;
  --ga-rhythm: 0.5;
  --ga-turbulence: 0.35;
  --ga-focus: 0.4;
}
```

应用开发者无需理解底层：

```text
curl-noise
octaves
frequency
blur-radius
phase-offset
```

---

# 9. Preset Selection

Preset 不通过 CSS Variable 指定。

推荐使用：

```html id="j3n8q2"
<div
  data-generative-art
  data-art-preset="aurora">
</div>
```

原因：

> Preset 是离散资源，Semantic Parameter 是连续参数。

---

# 10. Theme Selection

同样：

```html id="q5m7z1"
<div
  data-generative-art
  data-art-preset="aurora"
  data-art-theme="dark">
</div>
```

Theme 不使用：

```css id="v6x3r8"
--ga-theme: dark;
```

因为 Theme 属于配置对象，而不是数值型语义变量。

---

# 11. CSS Color Variables

支持：

```text id="u7k5p3"
--ga-color-primary
--ga-color-secondary
--ga-color-accent
--ga-color-background
```

例如：

```css id="n8q2x4"
.hero {
  --ga-color-primary: #7dd3fc;
  --ga-color-secondary: #818cf8;
  --ga-color-accent: #f0abfc;
}
```

---

# 12. Palette Variables

允许定义：

```css id="m5r8y1"
.hero {
  --ga-palette-1: #7dd3fc;
  --ga-palette-2: #818cf8;
  --ga-palette-3: #c084fc;
  --ga-palette-4: #f0abfc;
}
```

Runtime 将其解析为 Palette。

---

# 13. Material Variables

V1.8 支持：

```text id="j4x9c7"
--ga-opacity
--ga-glow
--ga-blur
--ga-grain
--ga-noise
--ga-contrast
--ga-saturation
```

---

# 14. Material Semantic Mapping

```text id="r5w8k3"
--ga-softness
    │
    ├── blur
    └── glow diffusion

--ga-glow
    │
    └── glow intensity

--ga-opacity
    │
    └── material opacity

--ga-texture
    │
    ├── grain
    └── noise
```

优先使用：

```text id="s7q3m8"
--ga-softness
--ga-glow
--ga-opacity
--ga-texture
```

底层变量属于高级用户接口。

---

# 15. Motion Variables

支持：

```text id="p8v4n6"
--ga-speed
--ga-time-scale
--ga-motion-strength
```

例如：

```css id="d3q7m2"
.hero {
  --ga-speed: 0.5;
  --ga-time-scale: 1;
  --ga-motion-strength: 0.7;
}
```

---

# 16. Motion 与 Semantic Energy

推荐：

```text id="f9k2s5"
--ga-energy
```

而不是要求普通用户同时设置：

```text id="h5z7q3"
--ga-speed
--ga-motion-strength
--ga-acceleration
--ga-damping
```

高级变量只在必要时开放。

---

# 17. Composition Variables

支持：

```text id="x6m3r8"
--ga-density
--ga-balance
--ga-symmetry
--ga-focus
--ga-negative-space
--ga-depth
--ga-rhythm
```

---

# 18. Geometry Variables

Geometry 不推荐直接通过 CSS 变量切换复杂类型。

不推荐：

```css id="y7q4m1"
--ga-geometry-type: bezier;
```

因为 CSS 不适合作为离散算法选择语言。

推荐：

```html id="f8n2k6"
data-art-geometry="ribbon"
```

CSS 负责：

```text id="q3w7m5"
count
scale
density
variation
```

---

# 19. CSS 与 Data Attribute 分工

最终规则：

```text id="u5r9p2"
HTML data-*
    │
    ├── preset
    ├── theme
    ├── geometry type
    └── renderer preference

CSS variables
    │
    ├── semantic values
    ├── appearance
    ├── responsive overrides
    └── visual context

JavaScript
    │
    ├── lifecycle
    ├── runtime control
    ├── dynamic update
    └── application integration
```

---

# 20. Configuration Priority

完整优先级：

```text id="c9m5x2"
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
Runtime update()
```

后者覆盖前者。

---

# 21. CSS Cascade

CSS 本身继续遵守标准 Cascade：

```text id="a6k4r9"
:root
  ↓
container
  ↓
component
  ↓
state
```

例如：

```css id="s5x8q2"
:root {
  --ga-density: 0.5;
}

.hero {
  --ga-density: 0.7;
}

.hero.featured {
  --ga-density: 0.85;
}
```

最终 Engine 读取元素计算后的 CSS Variable。

---

# 22. CSS Computed Value

Runtime 不应该直接解析 CSS 源代码。

错误：

```text id="r7p3m1"
read stylesheet text
↓
parse CSS
```

正确：

```text id="k8x4q6"
DOM Element
   ↓
getComputedStyle()
   ↓
CSS Custom Properties
   ↓
Configuration Resolver
```

---

# 23. CSS Reader

```ts id="n6q2z9"
interface CSSVariableReader {
  read(
    element: HTMLElement
  ): Record<string, string>
}
```

---

# 24. Semantic Resolver

```ts id="m3v7x5"
interface SemanticResolver {
  resolve(
    variables: Record<string, string>
  ): Partial<SemanticArtConfig>
}
```

---

# 25. CSS Value Normalization

CSS 值必须经过：

```text id="w9p4k2"
Raw String
   ↓
Parse
   ↓
Validate
   ↓
Normalize
   ↓
Semantic Value
```

例如：

```text
"0.8"
    ↓
0.8
```

---

# 26. Invalid CSS Value

例如：

```css id="z2q6m8"
.hero {
  --ga-density: hello;
}
```

不能导致 Runtime 崩溃。

应：

```text id="y7m3p5"
Invalid
   ↓
Warning
   ↓
Ignore
   ↓
Use previous/default value
```

---

# 27. CSS Value Range

对于：

```text id="f4x8n2"
--ga-density
--ga-energy
--ga-softness
...
```

默认：

```text id="e5q9m7"
< 0      → clamp(0)
0..1     → valid
> 1      → clamp(1)
```

但对于特殊参数：

> 使用各自定义的单位和范围。

---

# 28. CSS Unit

语义变量原则上使用无单位数字：

```css id="c7n4p1"
--ga-density: 0.8;
```

而不是：

```css id="s6q2m9"
--ga-density: 80%;
```

原因：

> Engine API 与 CSS API 的语义保持一致。

---

# 29. CSS Length

涉及空间尺寸时可以支持 CSS Length：

```css id="r8m3x5"
--ga-glow-radius: 24px;
```

Runtime 必须根据 viewport/DPR 转换。

---

# 30. Responsive Configuration

CSS 天然支持响应式。

```css id="q4x7m2"
.hero {
  --ga-density: 0.8;
  --ga-complexity: 0.7;
}

@media (max-width: 768px) {
  .hero {
    --ga-density: 0.45;
    --ga-complexity: 0.35;
  }
}
```

无需额外 Responsive DSL。

---

# 31. Container Query

未来允许：

```css id="n5z8r3"
@container art (max-width: 600px) {
  .hero {
    --ga-density: 0.4;
  }
}
```

Engine 只读取最终 computed value。

因此不需要理解 Container Query。

---

# 32. Dark / Light Context

推荐：

```css id="m6q3x8"
:root {
  --ga-color-background: #ffffff;
}

.dark {
  --ga-color-background: #09090b;
}
```

Generative Art Engine 自动获得上下文。

---

# 33. CSS Theme Integration

应用主题系统：

```text id="p7r4n9"
Application Theme
       │
       ▼
CSS Variables
       │
       ▼
Generative Art
```

Engine 不需要拥有独立完整 Theme Engine。

---

# 34. CSS State

可以根据状态调整艺术：

```css id="x8m2q5"
.hero:hover {
  --ga-energy: 0.8;
}

.hero[data-active="true"] {
  --ga-glow: 0.8;
}
```

但：

> CSS State 只改变配置，不直接驱动 Renderer。

---

# 35. Runtime Observation

CSS Variables 可能发生变化。

Engine 可以通过：

```text id="k3v7p1"
ResizeObserver
MutationObserver
Application update()
```

检测配置变化。

CSS Variable 变化不保证必须实时监听。

---

# 36. CSS Update Strategy

推荐：

```text id="d8q5m4"
CSS Change
   │
   ▼
Detect
   │
   ▼
Diff
   │
   ├── Hot Update
   │
   └── Rebuild
```

例如：

```text
--ga-opacity
    → Hot Update

--ga-density
    → Hot Update

data-art-preset
    → Rebuild
```

---

# 37. Avoid Continuous Style Reads

禁止每一帧：

```ts id="w4n8p6"
getComputedStyle(element)
```

正确：

```text id="q6m2z9"
CSS
 │
 ▼
Read
 │
 ▼
Cache
 │
 ▼
Runtime
```

只有配置变化时重新读取。

---

# 38. CSS Performance Boundary

CSS Integration 不得进入 Animation Hot Path。

错误：

```text id="v5x8r2"
Animation Frame
  ↓
getComputedStyle
  ↓
Parse CSS
  ↓
Render
```

正确：

```text id="f3m7q1"
Configuration Change
       ↓
Read CSS
       ↓
Resolve
       ↓
Cache
       ↓
Animation
```

---

# 39. Declarative HTML

最简单：

```html id="j8q3m5"
<div
  data-generative-art
  data-art-preset="aurora">
</div>
```

然后：

```ts id="r4x7n2"
import '@regalpine/generative-art/auto'
```

即可自动初始化。

---

# 40. CSS Example

```css id="m9p4k6"
.hero {
  --ga-density: 0.7;
  --ga-complexity: 0.55;
  --ga-energy: 0.45;
  --ga-softness: 0.8;
  --ga-depth: 0.65;
  --ga-focus: 0.4;
  --ga-glow: 0.55;
}
```

---

# 41. Full Declarative Example

```html id="c6n8q3"
<section
  class="hero"
  data-generative-art
  data-art-preset="aurora"
  data-art-theme="dark">
</section>
```

```css id="v2m7x5"
.hero {
  --ga-density: 0.65;
  --ga-complexity: 0.55;
  --ga-energy: 0.5;
  --ga-softness: 0.8;
  --ga-depth: 0.7;
  --ga-glow: 0.6;
}

@media (max-width: 768px) {
  .hero {
    --ga-density: 0.4;
    --ga-complexity: 0.35;
    --ga-glow: 0.35;
  }
}
```

---

# 42. CSS Variable Groups

官方变量最终分为：

```text id="z5q8m3"
Core
├── density
├── complexity
├── energy
├── softness
├── depth
├── rhythm
├── turbulence
└── focus

Composition
├── balance
├── symmetry
└── negative-space

Motion
├── speed
├── time-scale
└── motion-strength

Material
├── opacity
├── glow
├── blur
├── grain
├── noise
├── contrast
└── saturation

Color
├── color-primary
├── color-secondary
├── color-accent
└── color-background
```

---

# 43. CSS API Design Principle

优先级：

```text id="u9r3k6"
Semantic
    >
Specific
    >
Renderer-specific
```

例如推荐：

```css id="t5m8q2"
--ga-softness: 0.8;
```

而不是：

```css id="p3x7n9"
--ga-canvas-shadow-blur: 24;
```

---

# 44. Renderer-specific CSS

V1.8 禁止：

```text id="e7q2m5"
--ga-webgl-shader-x
--ga-webgpu-bind-group
--ga-canvas-filter-internal
```

因为这些会破坏：

```text id="x8n4r6"
Renderer Independence
```

---

# 45. CSS Fallback

CSS Variable 可以使用标准 fallback：

```css id="j6m9q3"
.hero {
  --ga-density: var(--app-art-density, 0.6);
}
```

Engine 最终读取：

```text id="c4x7p1"
Computed Value
```

---

# 46. CSS Custom Property Inheritance

默认允许 CSS Variable 继承。

但 Engine 只读取：

> **Target Element 的 computed value。**

因此：

```text id="r9m2k5"
:root
  ↓
body
  ↓
section
  ↓
hero
```

均由 CSS 自身处理。

Engine 不实现自己的继承机制。

---

# 47. SSR Safety

SSR 阶段：

```text id="n7x3q8"
No DOM
No Canvas
No Window
No getComputedStyle
```

因此：

```ts id="m4p8z2"
import '@regalpine/generative-art'
```

必须是 SSR-safe。

只有：

```text id="y6q1r5"
client initialization
```

才读取 CSS。

---

# 48. Hydration

SSR：

```text id="w3n7k9"
HTML
 +
CSS
```

Client：

```text id="p5m2x8"
Hydration
   ↓
Read CSS
   ↓
Initialize Art
```

不得在 SSR 阶段创建 Renderer。

---

# 49. CSS 与 Accessibility

Generative Art 通常属于：

> decorative content

推荐：

```html id="x4q8m3"
<div
  data-generative-art
  aria-hidden="true">
</div>
```

如果艺术本身承载信息：

> 不得依赖动画视觉作为唯一信息表达。

---

# 50. Reduced Motion

Engine 应检测：

```text id="g5n9r2"
prefers-reduced-motion
```

CSS 可以进一步提供：

```css id="z8m4q6"
@media (prefers-reduced-motion: reduce) {
  .hero {
    --ga-energy: 0;
    --ga-time-scale: 0;
  }
}
```

Engine 仍需拥有自己的 Runtime Reduced Motion 策略。

两者不是互斥关系。

---

# 51. CSS 与 Runtime Reduced Motion

最终：

```text id="k7p3m5"
OS Preference
      │
      ├──────────────┐
      ▼              ▼
CSS Media Query   Runtime Detection
      │              │
      └──────┬───────┘
             ▼
       Reduced Motion
```

---

# 52. CSS Schema

建议生成 JSON Schema：

```text id="n4x8q2"
generative-art-css.schema.json
```

用于：

- IDE
- CSS lint
- Documentation
- Validation
- Completion

---

# 53. TypeScript Constants

建议提供：

```ts id="s6m9r3"
export const CSS_VARIABLES = {
  density: '--ga-density',
  complexity: '--ga-complexity',
  energy: '--ga-energy',
  softness: '--ga-softness',
  depth: '--ga-depth',
  rhythm: '--ga-rhythm',
  turbulence: '--ga-turbulence',
  focus: '--ga-focus'
} as const
```

避免字符串散落。

---

# 54. CSS Token Registry

内部维护：

```ts id="q8v3m5"
interface CSSVariableDefinition {
  name: string
  type: 'number' | 'color' | 'length'
  min?: number
  max?: number
  default?: unknown
  semantic: string
}
```

---

# 55. CSS Variable Registry

```ts id="j5n8x2"
interface CSSVariableRegistry {
  register(
    definition: CSSVariableDefinition
  ): void

  get(
    name: string
  ): CSSVariableDefinition | undefined

  list(): CSSVariableDefinition[]
}
```

允许插件增加变量，但：

> 官方 `--ga-*` 变量必须保持稳定。

---

# 56. CSS 与 Plugin

Plugin 可以注册：

```text id="r7m4q9"
custom semantic variable
```

但不得覆盖核心：

```text id="u2x8p5"
--ga-density
--ga-energy
--ga-softness
...
```

除非明确声明兼容版本。

---

# 57. CSS Contract

V1.8 定义以下稳定契约：

```text id="d9k3m6"
--ga-* namespace
CSS → Semantic Config
CSS → Material
CSS → Composition
CSS → Motion
CSS → Color
Responsive CSS
CSS Cascade
Computed Style Reading
SSR Safety
Reduced Motion
Runtime Diff
```

---

# 58. 明确不进入 CSS

以下全部禁止进入 CSS 核心 API：

```text id="p8x4n2"
Geometry Algorithm
Field Algorithm
Noise Algorithm
Composition Algorithm
Motion Algorithm
Shader Code
Renderer Internals
Scene Graph
GPU Resources
```

---

# 59. CSS API 的核心原则

最终形成：

```text id="m5q8r3"
HTML
  = Select

CSS
  = Configure

JavaScript
  = Control

Preset
  = Compose

Engine
  = Generate

Renderer
  = Present
```

这是整个 Web API 的核心分工。

---

# 60. V1.8 MVP

必须支持：

```text id="x7n2m5"
--ga-* namespace
Core semantic variables
Composition variables
Motion variables
Material variables
Color variables
CSS computed value reader
CSS value normalization
CSS validation
CSS cascade
Responsive CSS
CSS fallback
SSR safety
Reduced motion
Configuration caching
Hot update
```

---

# 61. V1.8 P1

```text id="q4m8z6"
Container Query
CSS Typed OM
Advanced CSS Color
Custom Plugin Variables
CSS Schema Tooling
DevTools Integration
```

---

# 62. V1.8 P2

暂不进入：

```text id="r9x3p7"
CSS-based Geometry DSL
CSS-based Field DSL
CSS-based Shader DSL
CSS Animation replacement
CSS Paint API as core renderer
```

---

# 63. 收敛原则

V1.8 完成后：

> CSS Integration Layer 不再继续扩张成独立 DSL。

后续任何新的 CSS 能力必须回答：

```text id="w6n4q2"
是否只是已有语义的声明方式？
```

如果不是：

> 不进入 CSS API。

---

# 64. 当前架构收敛状态

```text id="e3m8x7"
V1.0 Architecture
       │
V1.1 Runtime
       │
V1.4 Composition
       │
V1.5 Motion
       │
V1.6 Material
       │
V1.7 Preset
       │
V1.8 CSS
       │
       ▼
Application Integration
```

核心模型已经稳定：

```text id="p7x4m2"
Geometry
Field
Composition
Motion
Material
Preset
CSS Integration
```

---

# 65. 下一阶段

下一版本：

> **Renderer Contract V1.9**

V1.9 将只解决：

```text id="z8q3m6"
Resolved Scene
      │
      ▼
Renderer Contract
      │
      ├── Canvas2D
      ├── WebGL
      └── WebGPU
```

重点确定：

- Renderer Interface
- RenderContext
- Renderer Capabilities
- Canvas2D Renderer
- WebGL Renderer边界
- WebGPU Renderer边界
- Feature Negotiation
- DPR
- Resize
- Offscreen Rendering
- Render Loop
- Frame Budget
- Fallback
- Renderer Lifecycle
- SSR / Client Boundary

**V1.9 完成后，核心引擎从“语义模型 + 配置系统”进入完整的“渲染执行层”，随后 V2.0 才收敛 NPM Package Contract。**