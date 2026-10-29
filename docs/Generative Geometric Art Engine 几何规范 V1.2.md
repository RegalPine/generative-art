# Generative Geometric Art Engine
## Geometry Specification
### 几何系统规范 V1.2

> Status: Draft / Architecture Baseline  
> Product: Generative Geometric Art Engine  
> Package: `@regalpine/generative-art`  
> Previous: Core Semantic Model & Runtime Specification V1.1

---

# 1. 规范目标

本规范定义 Generative Geometric Art Engine 的统一几何模型。

几何系统负责回答：

> **“场景中究竟生成什么形状，以及这些形状如何被采样、变换、组合和渲染。”**

Geometry 不负责：

- 如何运动
- 如何着色
- 如何产生随机性
- 如何选择渲染器
- 如何处理用户交互
- 如何决定最终视觉构图

这些能力分别由：

```text
Geometry
   ↓
Field
   ↓
Motion
   ↓
Composition
   ↓
Material
   ↓
Renderer
```

共同完成。

---

# 2. Geometry 核心原则

## 2.1 Geometry-first

系统不以 Particle 作为最基本对象。

推荐抽象：

```text
Geometry
 ├── Point
 ├── Line
 ├── Polyline
 ├── BezierCurve
 ├── Spline
 ├── Circle
 ├── Arc
 ├── Ellipse
 ├── Spiral
 ├── Wave
 ├── Ribbon
 ├── Polygon
 ├── Mesh
 └── CompositeGeometry
```

Particle 可以存在，但应视为：

```text
Particle
    ↓
Geometry Instance
```

而不是整个引擎的根抽象。

---

# 3. Geometry 类型体系

## 3.1 Point

最基础几何元素。

```ts
interface PointGeometry extends Geometry {
  x: number
  y: number
}
```

语义：

```text
Point
 ├── position
 ├── radius
 └── metadata
```

主要用途：

- 节点
- 控制点
- 星点
- 采样点
- 粒子视觉元素

---

# 4. Line

直线。

```ts
interface LineGeometry extends Geometry {
  start: Point
  end: Point
}
```

数学表达：

```text
P(t) = P0 + t(P1 - P0)

0 ≤ t ≤ 1
```

必须支持：

```ts
pointAt(t)
tangentAt(t)
length()
bounds()
```

---

# 5. Polyline

折线。

```ts
interface PolylineGeometry extends Geometry {
  points: Point[]
  closed: boolean
}
```

典型用途：

- 数据轨迹
- 流线
- 抽象线条
- 网络连接
- 几何装饰

Polyline 不要求连续曲率。

---

# 6. BezierCurve

Bezier 曲线是核心曲线类型之一。

## 6.1 Quadratic

```text
P(t) =
(1-t)^2 P0
+ 2(1-t)tP1
+ t²P2
```

接口：

```ts
interface QuadraticBezier extends Curve {
  start: Point
  control: Point
  end: Point
}
```

---

## 6.2 Cubic

```text
P(t) =
(1-t)^3P0
+ 3(1-t)^2tP1
+ 3(1-t)t²P2
+ t³P3
```

接口：

```ts
interface CubicBezier extends Curve {
  start: Point
  control1: Point
  control2: Point
  end: Point
}
```

---

# 7. Curve 统一接口

所有可参数化曲线必须实现：

```ts
interface Curve extends Geometry {

  pointAt(t: number): Point

  tangentAt(t: number): Vector

  normalAt(t: number): Vector

  length(): number

  sample(count: number): Point[]

}
```

其中：

```text
t ∈ [0,1]
```

表示曲线归一化参数。

---

# 8. Arc

圆弧。

```ts
interface ArcGeometry extends Curve {

  center: Point

  radius: number

  startAngle: number

  endAngle: number

}
```

支持：

```text
circle
semi-circle
quarter-circle
custom arc
```

---

# 9. Circle

完整圆形。

```ts
interface CircleGeometry extends Geometry {

  center: Point

  radius: number

}
```

必须支持：

```ts
pointAt(angle)
circumference()
bounds()
```

---

# 10. Ellipse

椭圆。

```ts
interface EllipseGeometry extends Geometry {

  center: Point

  radiusX: number

  radiusY: number

  rotation: number

}
```

用途：

- Orbital
- Planetary
- Abstract geometry
- Decorative composition

---

# 11. Spiral

螺旋是 Generative Art 中的重要基础几何。

推荐支持：

```text
Archimedean Spiral
Logarithmic Spiral
Fermat Spiral
```

统一接口：

```ts
interface SpiralGeometry extends Curve {

  center: Point

  turns: number

  radius: number

  growth: number

}
```

参数：

```text
turns
radius
growth
rotation
```

---

# 12. Wave

Wave 不是单纯的数学曲线，而是一个参数化生成器。

```ts
interface WaveGeometry extends Curve {

  amplitude: number

  frequency: number

  phase: number

  wavelength: number

}
```

支持：

```text
Sine
Cosine
Triangle
Saw
Noise
Custom
```

例如：

```text
y = A sin(ωx + φ)
```

---

# 13. Ribbon

Ribbon 是本引擎的重要高级几何。

它不是一条线，而是：

```text
Center Curve
     ↓
Normal
     ↓
Width
     ↓
Ribbon Surface
```

接口：

```ts
interface RibbonGeometry extends Geometry {

  curve: Curve

  width: number

  widthProfile?: WidthProfile

}
```

其中：

```ts
interface WidthProfile {
  sample(t: number): number
}
```

这样可以生成：

```text
Uniform Ribbon
Tapered Ribbon
Organic Ribbon
Breathing Ribbon
Flow Ribbon
```

---

# 14. Polygon

多边形。

```ts
interface PolygonGeometry extends Geometry {

  points: Point[]

  closed: true

}
```

支持：

```text
Triangle
Quadrilateral
Pentagon
Regular Polygon
Irregular Polygon
Convex Polygon
Concave Polygon
```

---

# 15. Mesh

Mesh 用于更复杂的几何结构。

```ts
interface MeshGeometry extends Geometry {

  vertices: Vertex[]

  edges: Edge[]

  faces: Face[]

}
```

其中：

```ts
interface Vertex {
  position: Point
}

interface Edge {
  a: number
  b: number
}

interface Face {
  vertices: number[]
}
```

V1.x 只要求支持 2D Mesh。

不引入完整 3D Mesh Engine。

---

# 16. CompositeGeometry

多个几何组成一个逻辑几何。

```ts
interface CompositeGeometry extends Geometry {

  children: Geometry[]

}
```

例如：

```text
Composite
 ├── Circle
 ├── Arc
 ├── Ribbon
 └── Point
```

典型用途：

- Logo-like composition
- Decorative structures
- Complex generative forms
- Layered geometric motifs

---

# 17. Geometry Transform

所有 Geometry 必须支持统一 Transform。

```ts
interface Transform {

  position: Vector2

  rotation: number

  scale: Vector2

}
```

推荐内部计算：

```text
Local Geometry
      ↓
Transform
      ↓
World Geometry
```

不要直接修改原始几何数据。

---

# 18. Geometry Bounds

每个 Geometry 必须能够提供 Bounds。

```ts
interface Bounds {

  minX: number
  minY: number

  maxX: number
  maxY: number

  width: number
  height: number

}
```

接口：

```ts
bounds(): Bounds
```

用途：

- Viewport culling
- Resize
- Composition
- Collision
- Interaction
- Renderer optimization

---

# 19. Geometry Sampling

所有可采样 Geometry 必须支持：

```ts
sample(t: number): Point
```

其中：

```text
t = 0
```

表示起点。

```text
t = 1
```

表示终点。

对于闭合几何：

```text
t = 0 ≡ t = 1
```

---

# 20. Arc-Length Sampling

简单的参数采样：

```text
t = 0
0.1
0.2
...
1
```

并不保证空间距离均匀。

因此系统必须提供：

```ts
sampleByLength(distance: number): Point
```

以及：

```ts
sampleUniform(count: number): Point[]
```

这样：

```text
Curve
   ↓
Arc Length
   ↓
Uniform Samples
```

可以避免曲线局部采样过密或过稀。

---

# 21. Geometry Resolution

Geometry 不应该直接绑定 Renderer。

例如：

```ts
{
  type: "bezier",
  resolution: 128
}
```

resolution 只是生成/采样参数。

最终渲染质量由 Renderer 决定。

推荐：

```text
Geometry Resolution
        ↓
Sampling
        ↓
Renderer Resolution
```

两个概念必须分离。

---

# 22. Geometry Generator

Geometry 可以由 Generator 创建。

```ts
interface GeometryGenerator<T extends GeometryConfig> {

  readonly type: string

  generate(
    config: T,
    context: GeometryGenerationContext
  ): Geometry

}
```

上下文：

```ts
interface GeometryGenerationContext {

  seed: Seed

  viewport: Viewport

  semantic: SemanticArtConfig

}
```

---

# 23. Geometry Seed

Geometry Generator 必须支持 deterministic generation。

禁止：

```ts
Math.random()
```

推荐：

```ts
context.seed
```

生成：

```text
Root Seed
    ↓
Geometry Seed
    ↓
Geometry Instance Seed
    ↓
Control Point Seed
```

相同：

```text
preset + seed + viewport
```

应该产生可重复结果。

---

# 24. Geometry Variation

Generative Art 不应该依赖完全随机。

推荐使用：

```text
Base Geometry
      ↓
Variation
      ↓
Final Geometry
```

Variation 类型：

```text
Position Variation
Scale Variation
Rotation Variation
Width Variation
Curvature Variation
Amplitude Variation
Phase Variation
```

---

# 25. Geometry Distribution

当场景包含多个 Geometry 时，需要统一 Distribution。

```ts
interface GeometryDistribution {

  generate(
    count: number,
    bounds: Bounds,
    context: DistributionContext
  ): Point[]

}
```

基础分布：

```text
Uniform
Grid
Random
Poisson
Radial
Spiral
Organic
Flow
Cluster
```

---

# 26. Geometry Clustering

支持几何聚集。

```ts
interface ClusterDistribution {

  center: Point

  radius: number

  density: number

  falloff: number

}
```

形成：

```text
集中
 ↓
扩散
 ↓
稀疏
```

而不是简单均匀随机。

---

# 27. Geometry Replication

支持从单个 Geometry 派生多个实例。

```ts
interface GeometryReplicator {

  replicate(
    source: Geometry,
    count: number,
    context: ReplicationContext
  ): Geometry[]

}
```

支持：

```text
Linear
Radial
Grid
Spiral
Flow
Mirror
Symmetry
```

---

# 28. Geometry Deformation

Geometry 可以被 Field 或其他变形器修改。

```ts
interface GeometryDeformer {

  deform(
    geometry: Geometry,
    context: DeformationContext
  ): Geometry

}
```

基础变形：

```text
Noise
Wave
Turbulence
Twist
Bend
Warp
Displace
```

注意：

> Deformation 不等同于 Motion。

Deformation：

```text
改变 Geometry 形状
```

Motion：

```text
改变 Geometry 随时间的位置/状态
```

---

# 29. Geometry → Field

Geometry 可以被 Field 影响。

例如：

```text
Curve
   ↓
Sample Points
   ↓
Field
   ↓
Displacement
   ↓
New Geometry
```

因此 Field 与 Geometry 必须保持松耦合。

---

# 30. Geometry → Motion

Geometry 可以作为 Motion 的载体。

例如：

```text
Ribbon
   ↓
Flow Motion
   ↓
Position(t)
```

或者：

```text
Circle
   ↓
Orbit Motion
   ↓
Rotation(t)
```

Geometry 不实现具体 Motion。

---

# 31. Geometry Identity

每一个 Geometry Instance 必须具有稳定 ID。

```ts
interface GeometryIdentity {

  id: string

  type: string

  seed: number

}
```

例如：

```text
scene-01
geometry-ribbon-001
geometry-ribbon-002
```

ID 用于：

- Debug
- Runtime Update
- Animation
- Interaction
- Visual Regression
- Serialization

---

# 32. Geometry Metadata

Geometry 可以携带非渲染元数据：

```ts
interface GeometryMetadata {

  id: string

  tags?: string[]

  semanticRole?: string

  source?: string

}
```

例如：

```json
{
  "semanticRole": "hero-flow",
  "tags": ["background", "organic", "primary"]
}
```

Metadata 不得影响 Geometry 数学定义。

---

# 33. Geometry Serialization

Geometry 必须能够被序列化。

例如：

```json
{
  "type": "bezier",
  "start": [0.1, 0.2],
  "control1": [0.3, 0.0],
  "control2": [0.7, 1.0],
  "end": [0.9, 0.8]
}
```

要求：

```text
Serialization
    ↓
Deterministic
    ↓
Portable
    ↓
Renderer Independent
```

---

# 34. Geometry Coordinate System

默认使用：

```text
Origin:
top-left

X:
right

Y:
down
```

即：

```text
(0,0) ─────────→ X
  │
  │
  │
  ↓
  Y
```

Geometry 内部可以使用数学坐标，但 Renderer Adapter 必须完成坐标转换。

---

# 35. Normalized Coordinates

推荐支持：

```text
0.0 ≤ x ≤ 1.0
0.0 ≤ y ≤ 1.0
```

作为逻辑坐标。

例如：

```json
{
  "x": 0.5,
  "y": 0.5
}
```

表示：

```text
Viewport Center
```

这样 Preset 不依赖固定屏幕尺寸。

---

# 36. Responsive Geometry

Geometry 应优先使用：

```text
Viewport
+
Normalized Coordinates
+
Semantic Scale
```

而不是：

```text
1024 × 768
```

硬编码。

例如：

```text
radius = 0.15 × min(width,height)
```

而不是：

```text
radius = 120px
```

---

# 37. Geometry Performance

Geometry 系统必须区分：

```text
Static Geometry
Dynamic Geometry
Procedural Geometry
```

## Static

初始化一次。

```text
生成 → 缓存 → 渲染
```

## Dynamic

每帧更新。

```text
生成 → Update → Render
```

## Procedural

按需计算。

```text
Parameters
   ↓
Evaluation
   ↓
Geometry
```

Renderer 应尽可能避免重复生成 Static Geometry。

---

# 38. Geometry Cache

支持：

```ts
interface GeometryCache {

  get(key: string): Geometry | undefined

  set(key: string, geometry: Geometry): void

  delete(key: string): void

  clear(): void

}
```

Cache Key 推荐：

```text
preset
+
seed
+
viewport
+
geometry parameters
```

---

# 39. Geometry Lifecycle

生命周期：

```text
CREATED
   ↓
GENERATED
   ↓
ACTIVE
   ↓
UPDATED
   ↓
DISPOSED
```

必须支持：

```ts
dispose(): void
```

避免：

- GPU buffer leak
- Event leak
- TypedArray leak
- Cache leak

---

# 40. Geometry Error Model

定义：

```ts
GeometryError
GeometryGenerationError
GeometrySamplingError
GeometryTransformError
GeometrySerializationError
```

错误不得导致整个 Runtime 无条件崩溃。

推荐：

```text
Invalid Geometry
      ↓
Error Boundary
      ↓
Fallback Geometry
```

---

# 41. Geometry Fallback

Renderer 无法处理复杂 Geometry 时：

```text
Advanced Geometry
       ↓
Compatibility Adapter
       ↓
Polyline / Path
```

例如：

```text
Spline
 ↓
Sample
 ↓
Polyline
```

保证 Canvas2D Renderer 可以处理更高级 Geometry。

---

# 42. Geometry 与 Renderer 解耦

禁止：

```ts
class BezierCanvasGeometry
```

推荐：

```text
BezierGeometry
      ↓
Renderer Adapter
      ↓
Canvas2D
```

或者：

```text
BezierGeometry
      ↓
Renderer Adapter
      ↓
WebGL
```

或者：

```text
BezierGeometry
      ↓
Renderer Adapter
      ↓
WebGPU
```

同一个 Geometry 不应该绑定具体渲染技术。

---

# 43. Geometry Registry

提供：

```ts
interface GeometryRegistry {

  register(
    type: string,
    generator: GeometryGenerator<any>
  ): void

  get(
    type: string
  ): GeometryGenerator<any> | undefined

  has(
    type: string
  ): boolean

}
```

默认注册：

```text
point
line
polyline
bezier
spline
circle
arc
ellipse
spiral
wave
ribbon
polygon
mesh
composite
```

---

# 44. Geometry Plugin

第三方可以增加：

```text
Custom Geometry
Custom Generator
Custom Deformer
Custom Distribution
```

例如：

```ts
registerGeometry({
  type: 'fractal-curve',
  generator: fractalCurveGenerator
})
```

但插件不得修改核心 Geometry Contract。

---

# 45. Geometry Semantic Mapping

高级 API 不应该要求用户直接理解所有数学参数。

推荐：

```ts
createGenerativeArt({
  preset: 'organic',
  density: 0.7,
  complexity: 0.5,
  softness: 0.8
})
```

内部映射：

```text
softness
   ↓
curvature
   ↓
Bezier / Spline parameters
```

以及：

```text
complexity
   ↓
geometry count
   ↓
control points
   ↓
deformation
```

因此：

> Semantic Configuration 是用户层，Geometry Configuration 是引擎层。

---

# 46. Geometry Configuration

统一结构：

```ts
interface GeometryConfig {

  type: string

  count?: number

  scale?: number

  rotation?: number

  position?: Vector2

  variation?: VariationConfig

  distribution?: DistributionConfig

  transform?: TransformConfig

  parameters?: Record<string, unknown>

}
```

---

# 47. Geometry Pipeline

最终 Geometry Pipeline：

```text
Semantic Config
      ↓
Preset
      ↓
Geometry Config
      ↓
Geometry Generator
      ↓
Seed
      ↓
Base Geometry
      ↓
Distribution
      ↓
Replication
      ↓
Deformation
      ↓
Transform
      ↓
Geometry Instance
      ↓
Scene
```

---

# 48. Geometry 与整体系统关系

完整关系：

```text
                    ┌──────────────┐
                    │ Semantic     │
                    │ Configuration│
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │   Preset     │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │   Geometry   │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │    Field     │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │    Motion    │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │ Composition  │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │   Material   │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │   Renderer   │
                    └──────────────┘
```

---

# 49. V1.2 必须实现

MVP Geometry 最低要求：

```text
Point
Line
Polyline
BezierCurve
Spline
Circle
Arc
Ellipse
Spiral
Wave
Ribbon
Polygon
Composite
```

其中优先级：

### P0

```text
Polyline
Bezier
Spline
Circle
Wave
Ribbon
```

### P1

```text
Arc
Ellipse
Spiral
Polygon
Composite
```

### P2

```text
Mesh
Advanced Procedural Geometry
```

---

# 50. V1.2 明确不实现

本版本不引入：

```text
3D Geometry
3D Mesh Engine
Boolean Geometry
CAD Kernel
Physics Geometry
SVG Full DOM Geometry
B-Rep
NURBS
CSG
```

这些属于未来扩展范围。

---

# 51. Geometry 最终设计原则

Geometry 系统最终遵循：

```text
Geometry defines shape.
Field defines influence.
Motion defines change.
Composition defines arrangement.
Material defines appearance.
Renderer defines presentation.
```

中文：

> **Geometry 定义形，Field 定义势，Motion 定义变，Composition 定义构，Material 定义质感，Renderer 定义呈现。**

这是整个 Generative Geometric Art Engine 的核心分层边界。

---

# 52. V1.2 完成判定

满足以下条件即可认为 Geometry Specification 收敛：

- [x] Geometry-first 模型确定
- [x] 基础 Geometry 类型确定
- [x] Curve Contract 确定
- [x] Sampling Contract 确定
- [x] Transform Contract 确定
- [x] Bounds Contract 确定
- [x] Distribution 模型确定
- [x] Replication 模型确定
- [x] Deformation 模型确定
- [x] Seed 规则确定
- [x] Serialization 确定
- [x] Renderer 解耦确定
- [x] Plugin 扩展边界确定
- [x] Responsive Geometry 确定
- [x] Performance 生命周期确定
- [x] MVP Geometry 范围确定

**Geometry Specification V1.2 收敛。**

下一阶段进入：

> **Field Specification V1.3 —— Vector Field / Noise Field / Force Field / Flow Field / Field Composition / Field Sampling / Field Performance。**

保持 V1.1 → V1.2 → V1.3 连续编号，不重新定义产品范围。