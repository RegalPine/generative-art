# Generative Geometric Art Engine 架构设计与规范

> **Status:** Architecture Baseline  
> **Version:** V1.0  
> **Package:** `@regalpine/generative-art`  
> **Spec Chain:** V1.0 Architecture → V1.1 Semantic Runtime → V1.2 Geometry → V1.3 Field → V1.4 Composition → V1.5 Motion → V1.6 Material → V1.7 Preset → V1.8 CSS → V1.9 Renderer → V2.0 NPM Package

---

## 目录

- [1. 文档目标](#1-文档目标)
- [2. 产品定位与愿景](#2-产品定位与愿景)
- [3. 核心设计原则](#3-核心设计原则)
- [4. 六层语义模型](#4-六层语义模型)
- [5. 系统架构全景](#5-系统架构全景)
- [6. Geometry 几何层](#6-geometry-几何层)
- [7. Field 场层](#7-field-场层)
- [8. Composition 构图层](#8-composition-构图层)
- [9. Motion 动态层](#9-motion-动态层)
- [10. Material 材质层](#10-material-材质层)
- [11. Renderer 渲染层](#11-renderer-渲染层)
- [12. 运行时架构](#12-运行时架构)
- [13. 配置体系](#13-配置体系)
- [14. Preset 系统](#14-preset-系统)
- [15. CSS Variable 集成](#15-css-variable-集成)
- [16. Plugin 架构](#16-plugin-架构)
- [17. 框架适配](#17-框架适配)
- [18. 性能策略](#18-性能策略)
- [19. NPM 包契约](#19-npm-包契约)
- [20. 路线图与里程碑](#20-路线图与里程碑)

---

# 1. 文档目标

本文档是 Generative Geometric Art Engine 的总体架构设计文档，整合并统一以下规范：

| 版本 | 规范 | 核心职责 |
|------|------|----------|
| V1.0 | 架构设计与规范 | 产品定位、核心概念、设计原则、MVP 范围 |
| V1.1 | 核心语义模型与运行时规范 | Runtime Object Model、生命周期、配置解析 |
| V1.2 | 几何规范 | Geometry 数学模型、采样、变换、生成 |
| V1.3 | 场系统规范 | Field 统一接口、类型体系、噪声、Curl Field |
| V1.4 | 构图系统规范 | Distribution、Density、Balance、Focus、Layer |
| V1.5 | 动态系统规范 | Motion 类型、时间模型、通道、Reduced Motion |
| V1.6 | 材质系统规范 | Color、Gradient、Glow、Blend、Material Stack |
| V1.7 | 预设系统规范 | Preset Schema、注册、解析、版本化 |
| V1.8 | CSS Variable 规范 | `--ga-*` 变量体系、映射规则、响应式 |
| V1.9 | Renderer Contract | Renderer 接口、能力协商、生命周期 |
| V2.0 | NPM Package Contract | 包结构、入口、API、构建、发布 |

本文档面向：

- 架构师
- 核心开发者
- Plugin 开发者
- 框架适配层开发者
- 技术 PM

---

# 2. 产品定位与愿景

## 2.1 产品定义

Generative Geometric Art Engine 是一个面向 Web 应用的**生成式几何艺术视觉引擎**。

核心能力：

```text
通过语义化参数
    ↓
驱动几何、场、构图、动态、材质
    ↓
在浏览器中生成
    ↓
高质量的生成式几何艺术视觉
```

## 2.2 核心价值

```text
面向设计师 / 开发者
    ↓
语义化配置（非数学参数直出）
    ↓
确定性生成（Seed 驱动）
    ↓
艺术品质优先（非粒子堆砌）
    ↓
Web 原生（零依赖，框架无关）
```

## 2.3 典型应用场景

```text
Hero Background
Landing Page
Brand Visual
Art Direction
Creative Portfolio
Atmospheric Background
Product Visual
```

## 2.4 产品边界

引擎**是**：

- 生成式几何艺术渲染引擎
- 语义化视觉配置系统
- 可扩展的 Plugin 架构

引擎**不是**：

- 通用 2D/3D 渲染引擎（如 PixiJS / Three.js）
- 粒子系统
- 游戏引擎
- 数据可视化库
- 动画库（如 GSAP / Framer Motion）

---

# 3. 核心设计原则

## 3.1 TypeScript First

所有核心 API、接口、类型均使用 TypeScript 定义。

```text
类型安全
  ↓
IDE 友好
  ↓
重构安全
  ↓
文档即代码
```

## 3.2 Renderer Independent

核心语义模型不依赖任何特定 Renderer。

```text
Scene Model
    ↓
┌──────┼──────┐
Canvas2D  WebGL  WebGPU
```

Canvas2D / WebGL / WebGPU 只是 Scene 的不同呈现方式，不改变语义。

## 3.3 Declarative First

用户通过声明式配置描述"想要什么"，而非"怎么做"。

```text
用户层：语义参数
  ↓
density: 0.7
energy: 0.5
softness: 0.8
  ↓
内部映射：数学参数
```

## 3.4 Deterministic

相同输入必须产生相同输出。

```text
Seed + Config → 确定性结果
```

**禁止** 在核心逻辑中使用 `Math.random()`。所有随机必须使用 Seeded Random。

## 3.5 Artistic Quality First

艺术品质优先于技术参数完备性。

```text
不是：暴露 200 个数学参数
而是：提供 8 个语义参数 → 映射到精心调校的数学空间
```

## 3.6 Separation of Concerns

六层语义模型各司其职，不越界：

```text
Geometry  → "是什么形状"
Field     → "空间中的力如何分布"
Composition → "形状之间如何组织"
Motion    → "如何随时间变化"
Material  → "看起来是什么质感"
Renderer  → "如何绘制到像素"
```

## 3.7 Performance Aware

性能是一等约束，不是事后优化。

```text
Performance Budget
  ↓
Capability Negotiation
  ↓
Adaptive Degradation
```

---

# 4. 六层语义模型

六层语义模型是整个引擎的核心架构。

## 4.1 模型总览

```text
┌─────────────────────────────────────────┐
│              Application                 │
├─────────────────────────────────────────┤
│    Preset / CSS / JS / Data Attribute   │
├─────────────────────────────────────────┤
│           Semantic Runtime              │
│    (Config → Normalize → Resolve)       │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────┐                           │
│  │ Geometry │  "是什么形状"              │
│  └────┬─────┘                           │
│       ↓                                 │
│  ┌──────────┐                           │
│  │  Field   │  "空间中的力如何分布"       │
│  └────┬─────┘                           │
│       ↓                                 │
│  ┌──────────────┐                       │
│  │ Composition  │  "形状之间如何组织"     │
│  └────┬─────────┘                       │
│       ↓                                 │
│  ┌──────────┐                           │
│  │  Motion  │  "如何随时间变化"          │
│  └────┬─────┘                           │
│       ↓                                 │
│  ┌──────────┐                           │
│  │ Material │  "看起来是什么质感"        │
│  └────┬─────┘                           │
│       ↓                                 │
│  ┌──────────┐                           │
│  │ Renderer │  "如何绘制到像素"          │
│  └──────────┘                           │
│                                         │
├─────────────────────────────────────────┤
│          Canvas / WebGL / WebGPU        │
└─────────────────────────────────────────┘
```

## 4.2 层间关系

```text
Geometry
    ↓ 提供形状
Field
    ↓ 提供空间影响力
Composition
    ↓ 组织空间关系
Motion
    ↓ 赋予时间变化
Material
    ↓ 赋予视觉质感
Renderer
    ↓ 呈现为像素
```

每一层：

- 只消费上一层的输出
- 不跳层依赖
- 不反向依赖
- 不跨层修改

## 4.3 统一接口模式

每一层遵循统一的设计模式：

```ts
interface Layer {
  readonly type: string
  // 核心方法
  process(input, context): Output
}
```

每一层的 Context 包含：

```ts
interface LayerContext {
  time: number
  delta: number
  seed: Seed
  viewport: Viewport
  semantic: SemanticArtConfig
}
```

## 4.4 确定性保证

每一层都通过 Seed 体系保证确定性：

```text
Root Seed
    ├── Geometry Seed
    ├── Field Seed
    ├── Composition Seed
    ├── Motion Seed
    └── Material Seed
```

相同 Root Seed → 相同各层 Seed → 相同最终结果。

---

# 5. 系统架构全景

## 5.1 整体数据流

```text
User Configuration
    │
    ├── Preset (可选)
    ├── Theme (可选)
    ├── CSS Variables (可选)
    ├── Data Attributes (可选)
    └── JavaScript API
           │
           ▼
    ┌──────────────┐
    │  Config      │
    │  Resolution  │
    │  Pipeline    │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  Normalized  │
    │  Config      │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  Seed        │
    │  Generator   │
    └──────┬───────┘
           │
           ▼
    ┌──────────────────────────────┐
    │        Scene Generation       │
    │                              │
    │  Geometry Generator          │
    │       ↓                      │
    │  Field Sampler               │
    │       ↓                      │
    │  Composition Arrange         │
    │       ↓                      │
    │  Motion Update               │
    │       ↓                      │
    │  Material Resolve            │
    │                              │
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────┐
    │  Resolved    │
    │  Scene       │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  Renderer    │
    │  (Canvas2D / │
    │   WebGL /    │
    │   WebGPU)    │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  Canvas      │
    │  Pixels      │
    └──────────────┘
```

## 5.2 核心对象模型

```ts
// 顶层入口
interface GenerativeArt {
  start(): void
  pause(): void
  resume(): void
  stop(): void
  resize(viewport: Viewport): void
  update(config: Partial<GenerativeArtConfig>): void
  setPreset(presetId: string): void
  setTheme(theme: ThemeConfig): void
  destroy(): void
}

// 场景
interface Scene {
  layers: SceneLayer[]
  width: number
  height: number
  time: number
}

// 场景层
interface SceneLayer {
  geometries: Geometry[]
  material: Material
  depth: number
  opacity: number
  blendMode: BlendMode
}
```

## 5.3 生命周期状态机

```text
CREATED
   │
   ▼
INITIALIZED
   │
   ▼
RUNNING ←──► PAUSED
   │            │
   │            └──► RUNNING
   │
   ▼
STOPPED
   │
   ▼
DESTROYED
```

状态转换规则：

| 当前状态 | 允许操作 | 目标状态 |
|----------|----------|----------|
| CREATED | initialize() | INITIALIZED |
| INITIALIZED | start() | RUNNING |
| RUNNING | pause() | PAUSED |
| RUNNING | stop() | STOPPED |
| RUNNING | destroy() | DESTROYED |
| PAUSED | resume() | RUNNING |
| PAUSED | stop() | STOPPED |
| STOPPED | start() | RUNNING |
| STOPPED | destroy() | DESTROYED |
| DESTROYED | - | - |

非法状态转换必须被拒绝或安全忽略。

## 5.4 模块依赖关系

```text
@regalpine/generative-art
│
├── core/
│   ├── runtime          ← V1.1 语义运行时
│   ├── seed             ← 确定性随机
│   ├── config           ← 配置解析
│   └── lifecycle        ← 状态机
│
├── geometry/            ← V1.2 几何
│   ├── types
│   ├── generators
│   ├── transforms
│   └── sampling
│
├── field/               ← V1.3 场
│   ├── types
│   ├── noise
│   ├── curl
│   └── operations
│
├── composition/         ← V1.4 构图
│   ├── distribution
│   ├── density
│   ├── balance
│   ├── focus
│   └── layer
│
├── motion/              ← V1.5 动态
│   ├── types
│   ├── channels
│   └── integration
│
├── material/            ← V1.6 材质
│   ├── color
│   ├── gradient
│   ├── effects
│   └── stack
│
├── renderer/            ← V1.9 渲染器
│   ├── canvas2d
│   ├── webgl (P1)
│   └── webgpu (P2)
│
├── preset/              ← V1.7 预设
│   ├── registry
│   ├── resolver
│   └── built-in
│
├── css/                 ← V1.8 CSS Variables
│   ├── parser
│   ├── mapping
│   └── observer
│
└── adapter/             ← V2.0 框架适配
    ├── react
    ├── vue
    └── web-component
```

## 5.5 技术栈约束

```text
Language:     TypeScript (strict mode)
Module:       ESM (primary), CJS (compatible)
Runtime:      Browser (primary)
Dependency:   Zero runtime dependency
Build:        tsup / rollup
Test:         vitest
SSR:          Module-safe (no window/document/canvas at import)
```

---

# 6. Geometry 几何层

> 详细规范：Geometry Specification V1.2

## 6.1 核心定位

Geometry 回答：

> **"画什么形状？"**

Geometry 是整个引擎的**数学基础层**。它不关心：

- 形状在空间中的分布（→ Composition）
- 形状如何运动（→ Motion）
- 形状看起来是什么材质（→ Material）
- 形状如何被绘制（→ Renderer）

## 6.2 Geometry-first 模型

本引擎采用 **Geometry-first** 而非 **Particle-first** 模型：

```text
Geometry-first:
    形状 → 变形 → 采样 → 渲染

Particle-first:
    粒子 → 力场 → 聚合 → 渲染
```

Geometry-first 的优势：

- 更精确的形状控制
- 更好的艺术品质
- 更自然的曲线表现
- 更适合几何艺术风格

## 6.3 统一 Curve 接口

所有曲线类 Geometry 共享统一接口：

```ts
interface Curve {
  readonly type: string

  pointAt(t: number): Point

  tangentAt(t: number): Vector

  normalAt(t: number): Vector

  length(): number

  sample(count: number): Point[]
}
```

其中 `t ∈ [0, 1]`。

## 6.4 Arc-Length 参数化

`pointAt(t)` 必须基于 **Arc-Length 参数化**：

```text
t = 0.5
  ↓
曲线总长度的 50% 位置
  ↓
不是控制点的 50%
```

这保证了：

- 均匀采样
- 匀速运动
- 等距分布

## 6.5 Geometry 类型体系

```text
Geometry
├── PointGeometry
├── Line
├── Polyline
├── BezierCurve
│   ├── QuadraticBezier
│   └── CubicBezier
├── Spline
├── Circle
├── Arc
├── Ellipse
├── Spiral
├── Wave
├── Ribbon
├── Polygon
└── Mesh
```

MVP (P0) 必须实现：

```text
Polyline
BezierCurve (Quadratic / Cubic)
Spline
Circle
Wave
Ribbon
```

## 6.6 Geometry Transform

```ts
interface GeometryTransform {
  translate?: Vector
  rotate?: number
  scale?: number | Vector
  origin?: Point
}
```

Transform 不修改原始 Geometry，而是返回新的采样结果。

## 6.7 Geometry Bounds

```ts
interface GeometryBounds {
  x: number
  y: number
  width: number
  height: number
}
```

所有 Geometry 必须能够计算包围盒。

## 6.8 Geometry Generator

```ts
interface GeometryGenerator {
  generate(
    config: GeometryConfig,
    context: GeneratorContext
  ): Geometry[]
}
```

Generator 通过 Seed 保证确定性：

```text
Seed + Config → 相同 Geometry[]
```

## 6.9 Geometry Distribution / Replication

Geometry 支持：

```text
Distribution:
    在空间中按规则复制

Replication:
    基于 Field 的变形复制

Deformation:
    沿 Field 的弯曲/扭曲
```

---

# 7. Field 场层

> 详细规范：Field Specification V1.3

## 7.1 核心定位

Field 回答：

> **"空间中的每一个位置，会受到怎样的方向、强度或影响？"**

Field 连接：

```text
Geometry
    ↓
Field
    ↓
Deformation / Flow / Motion
```

## 7.2 统一 Field 接口

```ts
interface Field<T = Vector> {
  readonly type: string

  sample(
    point: Point,
    context: FieldContext
  ): T
}
```

对于 Vector Field：

```text
F(x, y, t) → (vx, vy)
```

对于 Scalar Field：

```text
F(x, y, t) → s
```

## 7.3 Field 类型体系

```text
Field
├── ScalarField        → 标量场（密度、透明度、高度）
├── VectorField        → 向量场（方向 + 强度）
├── NoiseField         → 噪声场（连续空间变化）
├── CurlField          → 旋度场（流体感流线）
├── ForceField         → 力场（吸引/排斥/重力/漩涡）
├── FlowField          → 流场（沿流线运动）
├── CompositeField     → 组合场（多场叠加）
└── TransformField     → 变换场（场的空间变换）
```

## 7.4 Curl Field

Curl Field 是引擎中最重要的 Field 之一。

由 Scalar Noise 派生：

```text
Vx = ∂N / ∂y
Vy = -∂N / ∂x
```

产生连续、无明显汇聚、具有流体感的流线：

```text
~~~~~~
  ~~~~~
~~~~ ~~~
  ~~~~~
```

适用于：

- Aurora
- Organic Flow
- Fluid Background
- Ribbon Flow
- Atmospheric Motion

## 7.5 Force Field 类型

```text
ForceField
├── Attractor       → 吸引力
├── Repulsor        → 排斥力
├── Gravity         → 重力（距离衰减）
├── Vortex          → 漩涡（旋转流动）
├── Magnetic        → 磁力
└── Directional     → 方向力
```

## 7.6 Noise 体系

```text
NoiseSource
├── Perlin Noise
├── Simplex Noise
├── Value Noise
├── Fractal Noise (fBm)
└── Domain Warping
```

所有 Noise 必须支持 deterministic seed：

```text
相同 seed + 相同坐标 → 相同结果
```

Fractal Noise 配置：

```ts
interface FractalNoiseConfig {
  octaves: number        // → complexity
  persistence: number    // → detail strength
  lacunarity: number     // → frequency multiplier
  scale: number          // → spatial frequency
}
```

## 7.7 Falloff 模型

```text
Constant
Linear
SmoothStep
Quadratic
Cubic
Inverse
InverseSquare
Gaussian
```

## 7.8 Field 操作

```text
Add / Subtract / Multiply
Normalize / Clamp / Scale
Rotate / Invert
Blend
Field Mask
Field Transform
```

## 7.9 坐标系

Field 使用归一化坐标：

```text
x ∈ [0, 1]
y ∈ [0, 1]
```

不依赖具体屏幕像素尺寸。

---

# 8. Composition 构图层

> 详细规范：Composition Specification V1.4

## 8.1 核心定位

Composition 回答：

> **"这些几何应该在哪里、以什么密度、层次、尺度、节奏和视觉权重出现？"**

艺术感不来自：

```text
复杂 Geometry + 复杂 Noise
```

而来自：

```text
Geometry + 空间关系 + 视觉层级 + 负空间 + 节奏 + 平衡 + 焦点
```

## 8.2 统一接口

```ts
interface Composition {
  arrange(
    geometries: Geometry[],
    context: CompositionContext
  ): SceneLayer[]
}
```

## 8.3 Composition Pipeline

```text
Config
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

## 8.4 Distribution 类型

```text
Distribution
├── Uniform         → 均匀分布
├── Grid            → 网格分布
├── Random          → 随机分布（Seeded）
├── Poisson         → Poisson Disk（避免聚集）
├── Radial          → 径向分布
├── Spiral          → 螺旋分布
├── Cluster         → 聚类分布
├── Flow            → 沿 Field 分布
├── Edge            → 边缘分布
├── Center          → 中心分布
├── Golden          → 黄金比例分布
└── Organic         → 有机分布（受控随机）
```

统一接口：

```ts
interface Distribution {
  position(
    index: number,
    count: number,
    context: DistributionContext
  ): Point
}
```

## 8.5 Density 模型

Density 不是简单的 Geometry count，它影响：

```text
Geometry Count
Spacing
Size
Overlap
Field Influence
```

Density 可以由 Scalar Field 控制：

```text
Density → Scalar Field → Geometry Probability
```

## 8.6 Focus Field

Focus 使用 Scalar Field 控制：

```text
Density
Scale
Opacity
Contrast
```

Focus 位置形成视觉焦点。

## 8.7 Negative Space

```text
Negative Space:
    画面中"空"的区域

Protected Region:
    不允许放置 Geometry 的区域
```

适合 Hero Text、CTA 等场景。

## 8.8 Layer 类型

```text
Layer
├── Background      → 背景层
├── Atmosphere      → 氛围层
├── Structure       → 结构层
├── Flow            → 流动层
├── Accent          → 强调层
└── Foreground      → 前景层
```

## 8.9 视觉层级

```text
Primary     → 主体元素
Secondary   → 辅助元素
Tertiary    → 装饰元素
```

## 8.10 坐标系

Composition 使用归一化坐标：

```text
x ∈ [0, 1]
y ∈ [0, 1]
```

Presets 不绑定固定 viewport。

---

# 9. Motion 动态层

> 详细规范：Motion Specification V1.5

## 9.1 核心定位

Motion 回答：

> **"这些几何如何随时间变化？"**

## 9.2 统一接口

```ts
interface Motion {
  update(
    state: MotionState,
    context: MotionContext
  ): MotionState
}
```

## 9.3 MotionState

```ts
interface MotionState {
  position: Point
  rotation: number
  scale: number | Vector
  velocity: Vector
  angularVelocity: number
  opacity: number
}
```

## 9.4 时间模型

```text
delta time (dt)
    ↓
不是固定 FPS
    ↓
p(t + dt) = p(t) + v(t) × dt
```

禁止固定 FPS 假设。

## 9.5 Motion 类型

```text
Motion
├── Flow          → 沿 Field 流动
├── Drift         → 缓慢漂移
├── Orbit         → 轨道运动
├── Wave          → 波动
├── Pulse         → 脉冲
├── Breathing     → 呼吸
├── Rotation      → 旋转
├── Parallax      → 视差
└── Morph         → 变形
```

## 9.6 Flow Motion

核心运动模型：

```text
v(t) = F(p, t)
p(t + dt) = p(t) + v(t) × dt
```

其中 F 是 Vector Field。

## 9.7 Motion Channel

```text
MotionChannel
├── Position Channel
├── Rotation Channel
├── Scale Channel
└── Opacity Channel
```

每个通道可以独立应用不同的 Motion。

## 9.8 Motion Composition

```text
Motion A (weight: 0.7)
    +
Motion B (weight: 0.3)
    ↓
Blended Motion
```

支持：

- Priority
- Weight
- Blending

## 9.9 Reduced Motion

```text
prefers-reduced-motion: reduce
    ↓
Motion Amplitude → 0
    ↓
或完全停止动画
```

必须尊重用户的 Reduced Motion 偏好。

---

# 10. Material 材质层

> 详细规范：Material Specification V1.6

## 10.1 核心定位

Material 回答：

> **"看起来是什么质感？"**

## 10.2 统一接口

```ts
interface Material {
  color: ColorConfig
  opacity: number
  gradient?: GradientConfig
  glow?: GlowConfig
  blur?: BlurConfig
  grain?: GrainConfig
  noise?: NoiseConfig
  shadow?: ShadowConfig
  blendMode: BlendMode
  depth?: number
}
```

## 10.3 三层模型

```text
┌─────────────────────────────┐
│  Base Appearance            │  颜色、透明度、渐变
├─────────────────────────────┤
│  Visual Effects             │  发光、模糊、颗粒、噪声
├─────────────────────────────┤
│  Spatial Appearance         │  混合模式、深度、阴影
└─────────────────────────────┘
```

## 10.4 颜色系统

支持颜色空间：

```text
sRGB          → 标准显示
OKLab / OKLCH → 感知均匀插值
HSL / HSV     → 直觉调整
```

推荐 OKLab/OKLCH 进行颜色插值，保证感知均匀。

## 10.5 Gradient 类型

```text
Gradient
├── linear      → 线性渐变
├── radial      → 径向渐变
├── conic       → 锥形渐变
├── path        → 沿路径渐变
├── depth       → 深度渐变
└── field       → 场驱动渐变
```

## 10.6 Material Semantic

```text
Semantic        →  Math
────────────────────────────
luminosity      →  brightness
softness        →  blur + opacity
glow            →  glow radius + intensity
transparency    →  opacity
texture         →  grain + noise
depth           →  z-depth + fog
contrast        →  color contrast
saturation      →  color saturation
```

## 10.7 Material Stack

```text
Base Material
    +
Effect Layer 1
    +
Effect Layer 2
    +
...
    ↓
Final Material
```

Material Stack 支持组合多个材质效果。

## 10.8 Performance Budget

```text
Tier 0:  Minimal (solid color + opacity)
Tier 1:  Basic (gradient + blur)
Tier 2:  Rich (gradient + glow + grain)
Tier 3:  Full (all effects)
```

---

# 11. Renderer 渲染层

> 详细规范：Renderer Contract V1.9

## 11.1 核心定位

Renderer = Presentation

Renderer 接收已经解析完成的 Scene / Geometry / Material / Viewport，并将其转换为实际像素。

## 11.2 统一接口

```ts
interface Renderer {
  readonly type: string
  readonly capabilities: RendererCapabilities

  initialize(context: RenderContext): void
  resize(viewport: Viewport): void
  render(scene: Scene, context: RenderFrameContext): void
  pause(): void
  resume(): void
  dispose(): void
}
```

## 11.3 Renderer 生命周期

```text
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

## 11.4 Renderer 体系

```text
Renderer
├── Canvas2D Renderer    → MVP (P0)
├── WebGL Renderer       → P1
└── WebGPU Renderer      → P2
```

## 11.5 Canvas2D MVP Contract

Canvas2D 是 MVP Renderer，职责：

```text
Path / Line / Curve
Fill / Stroke
Gradient / Opacity
Blend / Shadow
Basic Blur
```

Canvas2D 不负责：

```text
Geometry generation
Noise calculation
Motion calculation
Composition
Preset resolution
```

## 11.6 Renderer Capabilities

```ts
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

## 11.7 Capability Negotiation

```text
Preset Requirements
       │
       ▼
Renderer Capabilities
       │
       ▼
Capability Negotiator
       │
       ├── Full Support      → 完整渲染
       ├── Partial Support   → 降级渲染
       └── Unsupported       → Fallback
```

## 11.8 Renderer Selection

默认优先级：

```text
WebGPU → WebGL → Canvas2D
```

支持用户指定：

```ts
createGenerativeArt({
  renderer: 'auto' | 'canvas2d' | 'webgl' | 'webgpu'
})
```

默认 `auto`。

## 11.9 DPR 管理

```text
effectiveDpr = min(devicePixelRatio, maxDpr)
```

默认 `maxDpr = 2`。

## 11.10 语义等价性

不同 Renderer 必须保持：

```text
Composition 一致
Geometry 一致
Color intent 一致
Motion intent 一致
Material intent 一致
```

---

# 12. 运行时架构

> 详细规范：核心语义模型与运行时规范 V1.1

## 12.1 运行时流程

```text
Configuration
    ↓
Normalization
    ↓
Seed Generation
    ↓
Generator Pipeline
    ├── Geometry Generator
    ├── Field Sampler
    ├── Composition Arrange
    ├── Motion Update
    └── Material Resolve
    ↓
Scene Assembly
    ↓
Animation Loop
    ↓
Renderer.render()
```

## 12.2 GenerativeArt 实例

```ts
interface GenerativeArt {
  // 生命周期
  start(): void
  pause(): void
  resume(): void
  stop(): void
  destroy(): void

  // 配置
  update(config: Partial<GenerativeArtConfig>): void
  setPreset(presetId: string): void
  setTheme(theme: ThemeConfig): void

  // 视口
  resize(viewport: Viewport): void
}
```

## 12.3 Animation Loop

```text
requestAnimationFrame
       │
       ├── update(deltaTime)
       │       ├── update Fields
       │       ├── update Motion
       │       └── resolve Material
       │
       └── render()
               └── Renderer.render(scene, frameContext)
```

## 12.4 调度策略

```text
Scheduler
├── requestAnimationFrame (默认)
├── fixed timestep (可选)
├── external clock (可选)
└── offscreen worker (可选)
```

## 12.5 SSR 安全

```text
模块加载阶段：
    禁止访问 window
    禁止访问 document
    禁止访问 canvas
    禁止访问 CSS

运行时阶段：
    通过 RenderContext 获取环境信息
```

---

# 13. 配置体系

> 详细规范：核心语义模型与运行时规范 V1.1

## 13.1 配置优先级

```text
Default (最低)
    ↓
Preset
    ↓
Theme
    ↓
CSS Variables
    ↓
Data Attributes
    ↓
JavaScript API
    ↓
Runtime update() (最高)
```

高优先级覆盖低优先级。

## 13.2 配置四层模型

```text
┌─────────────────────────┐
│  Base Defaults          │  引擎内置默认值
├─────────────────────────┤
│  Preset                 │  预设配置
├─────────────────────────┤
│  Theme                  │  主题覆盖
├─────────────────────────┤
│  User Overrides         │  用户自定义
│  (CSS / JS / Data Attr) │
└─────────────────────────┘
```

## 13.3 语义配置模型

用户层暴露语义参数：

```ts
interface SemanticArtConfig {
  density: number       // 0~1  视觉密度
  complexity: number    // 0~1  视觉复杂度
  energy: number        // 0~1  运动能量
  softness: number      // 0~1  柔和程度
  depth: number         // 0~1  空间深度
  rhythm: number        // 0~1  节奏感
  turbulence: number    // 0~1  扰动强度
  focus: number         // 0~1  焦点强度
}
```

语义参数内部映射到数学参数：

```text
density: 0.8
    ↓
Geometry count: 50
Spacing: 20px
Field influence: 0.6
```

## 13.4 配置解析流程

```text
Raw Config
    ↓
Preset Resolution
    ↓
Theme Merge
    ↓
CSS Variable Read
    ↓
Data Attribute Read
    ↓
JS API Merge
    ↓
Normalization + Validation
    ↓
Normalized Config
```

## 13.5 值归一化

所有配置值必须经过：

```text
Type Check
    ↓
Range Clamp
    ↓
Default Fill
    ↓
Semantic → Math Mapping
```

---

# 14. Preset 系统

> 详细规范：Preset Specification V1.7

## 14.1 核心定位

Preset = Geometry + Field + Composition + Motion + Material 的可复用封装。

```text
Preset
    ↓
一套完整的视觉方案
    ↓
一键应用
```

## 14.2 Preset Schema

```ts
interface PresetSchema {
  id: string
  version: string
  name: string
  description?: string

  geometry: GeometryConfig
  field: FieldConfig
  composition: CompositionConfig
  motion: MotionConfig
  material: MaterialConfig

  semantic?: SemanticArtConfig
  responsive?: ResponsiveConfig
  metadata?: PresetMetadata
}
```

## 14.3 内置 Preset

```text
flow          → 流体线条
aurora        → 极光氛围
ribbon        → 丝带流动
organic       → 有机形态
wave          → 波浪韵律
orbital       → 轨道运动
mesh          → 网格结构
atmosphere    → 大气氛围
```

## 14.4 Preset 版本化

```text
MAJOR.MINOR.PATCH

MAJOR:   不兼容变更
MINOR:   向后兼容新增
PATCH:   修复/微调
```

## 14.5 Preset Resolution Pipeline

```text
Preset ID
    ↓
Registry Lookup
    ↓
Version Resolution
    ↓
Config Merge
    ↓
Semantic Mapping
    ↓
Validation
    ↓
Resolved Config
```

## 14.6 Performance Profile

```text
light         → 低性能设备
balanced      → 默认平衡
rich          → 高性能设备
experimental  → 实验性特性
```

## 14.7 Capability Negotiation

```text
Preset Requirements
    vs
Renderer Capabilities
    ↓
Full / Partial / Unsupported
```

---

# 15. CSS Variable 集成

> 详细规范：CSS Variable Specification V1.8

## 15.1 命名空间

```css
--ga-*
```

所有 CSS 变量使用 `--ga-` 前缀。

## 15.2 核心语义变量

```css
--ga-density: 0.7;
--ga-complexity: 0.5;
--ga-energy: 0.6;
--ga-softness: 0.8;
--ga-depth: 0.5;
--ga-rhythm: 0.6;
--ga-turbulence: 0.4;
--ga-focus: 0.7;
```

## 15.3 CSS 的职责边界

CSS **负责**：

```text
声明语义参数
响应式切换
主题覆盖
```

CSS **不负责**：

```text
Geometry 生成
Field 计算
Composition 算法
Motion 算法
Material 渲染
```

## 15.4 读取方式

```text
getComputedStyle(element)
    ↓
读取 --ga-* 值
    ↓
Normalization + Clamping
    ↓
映射到内部参数
```

## 15.5 响应式支持

通过 CSS Media Query 原生支持：

```css
@media (max-width: 768px) {
  :root {
    --ga-density: 0.4;
    --ga-complexity: 0.3;
  }
}
```

## 15.6 SSR 安全

```text
模块加载阶段：不读取 CSS
运行时阶段：通过 getComputedStyle() 读取
```

## 15.7 Update Strategy

```text
Hot Update:
    CSS 变量变化 → 重新读取 → 更新参数 → 继续渲染
    不需要重建 Scene

Rebuild:
    Preset 变化 → 重建 Scene → 重新渲染
```

---

# 16. Plugin 架构

> 详细规范：NPM Package Contract V2.0

## 16.1 Plugin Contract

```ts
interface Plugin {
  readonly name: string
  readonly version: string

  install(app: GenerativeArt): void
  uninstall?(app: GenerativeArt): void
}
```

## 16.2 Plugin 类型

```text
Plugin
├── Geometry Plugin      → 自定义 Geometry 类型
├── Field Plugin         → 自定义 Field 类型
├── Composition Plugin   → 自定义 Distribution
├── Motion Plugin        → 自定义 Motion 类型
├── Material Plugin      → 自定义 Material 效果
├── Renderer Plugin      → 自定义 Renderer
└── Preset Plugin        → 自定义 Preset
```

## 16.3 注册机制

```ts
// 注册自定义 Geometry
registerGeometry('custom-shape', CustomGeometryGenerator)

// 注册自定义 Field
registerField('custom-field', CustomField)

// 注册自定义 Preset
registerPreset('custom-preset', CustomPresetSchema)
```

## 16.4 Plugin 生命周期

```text
Plugin.install()
    ↓
注册到 Registry
    ↓
引擎运行时使用
    ↓
Plugin.uninstall() (可选)
    ↓
从 Registry 移除
```

---

# 17. 框架适配

> 详细规范：NPM Package Contract V2.0

## 17.1 核心原则

```text
核心包：零框架依赖
    ↓
Adapter 包：桥接框架
```

## 17.2 Entry Points

```text
@regalpine/generative-art          → 核心包
@regalpine/generative-art/auto     → 自动初始化
@regalpine/generative-art/react    → React Adapter
@regalpine/generative-art/vue      → Vue Adapter
@regalpine/generative-art/web-component → Web Component
```

## 17.3 React Adapter

```tsx
import { GenerativeArtCanvas } from '@regalpine/generative-art/react'

function App() {
  return (
    <GenerativeArtCanvas
      preset="aurora"
      density={0.7}
      energy={0.5}
    />
  )
}
```

## 17.4 Vue Adapter

```vue
<template>
  <GenerativeArt
    preset="aurora"
    :density="0.7"
    :energy="0.5"
  />
</template>

<script setup>
import { GenerativeArt } from '@regalpine/generative-art/vue'
</script>
```

## 17.5 Web Component

```html
<generative-art
  data-preset="aurora"
  data-density="0.7"
  data-energy="0.5"
></generative-art>
```

## 17.6 Auto Init

```html
<script src="@regalpine/generative-art/auto"></script>

<div class="ga-auto" data-preset="aurora"></div>
```

---

# 18. 性能策略

## 18.1 性能分层

```text
Performance Tier
├── Tier 0: Minimal      → 纯色 + 透明度
├── Tier 1: Basic        → 渐变 + 模糊
├── Tier 2: Rich         → 渐变 + 发光 + 颗粒
└── Tier 3: Full         → 全部效果
```

## 18.2 自适应降级

```text
设备性能检测
    ↓
初始 Tier 分配
    ↓
运行时 FPS 监控
    ↓
动态降级 / 升级
```

## 18.3 Visibility 优化

```text
IntersectionObserver
    ↓
元素不可见 → 暂停渲染

Page Visibility API
    ↓
页面不可见 → 暂停动画

Reduced Motion
    ↓
prefers-reduced-motion → 降低或停止动画
```

## 18.4 DPR 限制

```text
effectiveDpr = min(devicePixelRatio, maxDpr)
默认 maxDpr = 2
```

避免高端设备过度渲染。

## 18.5 Performance Budget

每个 Preset 声明性能预算：

```ts
interface PerformanceProfile {
  tier: 'light' | 'balanced' | 'rich' | 'experimental'
  maxGeometryCount: number
  maxFieldComplexity: number
  maxMaterialEffects: number
}
```

---

# 19. NPM 包契约

> 详细规范：NPM Package Contract V2.0

## 19.1 包信息

```text
Package Name:   @regalpine/generative-art
Module Type:    ESM (primary) + CJS (compatible)
Dependency:     Zero runtime dependency
SSR:            Safe (模块加载不访问浏览器 API)
Tree Shaking:   支持
```

## 19.2 导出结构

```text
@regalpine/generative-art
├── ./auto              → 自动初始化入口
├── ./react             → React Adapter
├── ./vue               → Vue Adapter
├── ./web-component     → Web Component Adapter
└── ./styles.css        → 默认样式（可选）
```

## 19.3 核心 API

```ts
// 创建实例
createGenerativeArt(config: GenerativeArtConfig): GenerativeArt

// Preset 管理
registerPreset(preset: PresetSchema): void
getPreset(id: string): PresetSchema | undefined

// Plugin 管理
registerPlugin(plugin: Plugin): void

// 类型导出
export type { GenerativeArt, Scene, Geometry, Field, ... }
```

## 19.4 设计原则（V2.0）

```text
1.  Zero Dependency
2.  ESM First
3.  SSR Safe
4.  Tree Shakeable
5.  Framework Agnostic
6.  Plugin Extensible
7.  Capability Aware
8.  Performance First
9.  Deterministic
10.  Semantic Driven
```

## 19.5 V2.0 里程碑意义

V2.0 标志着从**核心架构设计阶段**进入**产品实现阶段**。

```text
V1.0 ~ V1.9:  架构设计 + 规范定义
V2.0:         实现契约 + 产品化
```

---

# 20. 路线图与里程碑

## 20.1 MVP (P0)

核心目标：验证六层语义模型 + Canvas2D 渲染

必须实现：

```text
✅ 六层语义模型核心架构
✅ Seed 确定性体系
✅ 语义配置模型
✅ Geometry: Polyline / Bezier / Spline / Circle / Wave / Ribbon
✅ Field: Noise / Curl / Force (基础)
✅ Composition: Distribution (Uniform / Random / Radial / Flow)
✅ Motion: Flow / Drift / Wave / Breathing
✅ Material: Color / Opacity / Gradient / basic Blend
✅ Renderer: Canvas2D
✅ Preset: 基础 Preset 系统 + 2~3 内置 Preset
✅ CSS Variables: 核心语义变量
✅ 生命周期管理
✅ Performance: 基础 DPR 限制 + Visibility 优化
```

## 20.2 Phase 1 (P1)

核心目标：丰富视觉表现 + WebGL 渲染

```text
□ WebGL Renderer
□ 完整 Field 体系 (Vortex / Magnetic / Composite)
□ 完整 Composition (Poisson / Spiral / Golden / Organic)
□ 完整 Motion (Orbit / Pulse / Rotation / Parallax / Morph)
□ 完整 Material (Glow / Blur / Grain / Noise / Shadow)
□ Material Stack
□ 完整 Preset 体系 + 8 内置 Preset
□ 完整 CSS Variables
□ Plugin 系统完善
□ React / Vue Adapter
□ Performance: 自适应降级
```

## 20.3 Phase 2 (P2)

核心目标：大规模场景 + WebGPU

```text
□ WebGPU Renderer
□ Offscreen Canvas
□ Worker Thread 计算
□ Advanced Compositing
□ GPU Compute for Field/Motion
□ Web Component Adapter
□ 性能分析工具
□ Preset Marketplace 支持
```

---

# 附录 A: 规范版本链

```text
V1.0  架构设计与规范
  ↓
V1.1  核心语义模型与运行时规范
  ↓
V1.2  几何规范
  ↓
V1.3  场系统规范
  ↓
V1.4  构图系统规范
  ↓
V1.5  动态系统规范
  ↓
V1.6  材质系统规范
  ↓
V1.7  预设系统规范
  ↓
V1.8  CSS Variable 规范
  ↓
V1.9  Renderer Contract
  ↓
V2.0  NPM Package Contract
```

# 附录 B: 核心接口速查

```ts
// === 顶层 API ===
createGenerativeArt(config): GenerativeArt
GenerativeArt.start() / pause() / resume() / stop() / destroy()
GenerativeArt.update(config) / setPreset(id) / setTheme(theme) / resize(viewport)

// === Geometry ===
Curve.pointAt(t) / tangentAt(t) / normalAt(t) / length() / sample(count)
GeometryGenerator.generate(config, context): Geometry[]

// === Field ===
Field.sample(point, context): T
ScalarField.sample() → number
VectorField.sample() → Vector
NoiseField: scale / octaves / persistence / lacunarity
CurlField: Vx = ∂N/∂y, Vy = -∂N/∂x

// === Composition ===
Composition.arrange(geometries, context): SceneLayer[]
Distribution.position(index, count, context): Point

// === Motion ===
Motion.update(state, context): MotionState
MotionState: position / rotation / scale / velocity / opacity

// === Material ===
Material: color / opacity / gradient / glow / blur / grain / blendMode
Material Stack: Base + Effects → Final

// === Renderer ===
Renderer.initialize(context) / resize(viewport) / render(scene, ctx)
Renderer.pause() / resume() / dispose()
RendererCapabilities: type / supports* / maxTextureSize

// === Preset ===
PresetSchema: id / version / geometry / field / composition / motion / material
registerPreset(preset) / getPreset(id)

// === Plugin ===
Plugin: name / version / install(app) / uninstall?(app)
registerPlugin(plugin)

// === Config ===
SemanticArtConfig: density / complexity / energy / softness / depth / rhythm / turbulence / focus
优先级: Default < Preset < Theme < CSS < DataAttr < JS < update()
```

# 附录 C: 术语表

| 术语 | 含义 |
|------|------|
| Geometry | 几何形状（曲线、面等） |
| Field | 空间场（影响力分布） |
| Composition | 构图（空间组织） |
| Motion | 运动（时间变化） |
| Material | 材质（视觉质感） |
| Renderer | 渲染器（像素呈现） |
| Preset | 预设（完整视觉方案） |
| Seed | 随机种子（确定性保证） |
| Semantic Config | 语义配置（用户层参数） |
| Arc-Length | 弧长参数化（均匀采样） |
| Curl Field | 旋度场（流体流线） |
| DPR | Device Pixel Ratio |
| OKLab/OKLCH | 感知均匀颜色空间 |
| fBm | Fractal Brownian Motion |
| Reduced Motion | 减少动画偏好 |

---

> **End of Document**  
> Generative Geometric Art Engine Architecture V1.0  
> Based on Spec Chain V1.0 ~ V2.0
