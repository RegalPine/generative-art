# Generative Geometric Art Engine
## Field Specification
### 场系统规范 V1.3

> Status: Draft / Architecture Baseline  
> Product: Generative Geometric Art Engine  
> Package: `@regalpine/generative-art`  
> Previous: Geometry Specification V1.2

---

# 1. 规范目标

Field 是 Generative Geometric Art Engine 中连接：

```text
Geometry
    ↓
Field
    ↓
Deformation / Flow / Motion
```

的核心语义层。

Field 回答：

> **“空间中的每一个位置，会受到怎样的方向、强度或影响？”**

Field 本身不负责：

- 生成最终 Geometry
- 决定 Geometry 的视觉材质
- 决定场景构图
- 管理动画生命周期
- 负责 Renderer
- 直接管理用户交互

---

# 2. Field 核心模型

统一抽象：

```ts
interface Field<T = Vector> {

  readonly type: string

  sample(
    point: Point,
    context: FieldContext
  ): T

}
```

对于二维视觉引擎，最核心的 Field 是：

```text
Point
  ↓
Vector
```

即：

```text
F(x, y, t) → (vx, vy)
```

---

# 3. Field 的语义

Field 可以理解为空间中的函数：

```text
F : R² × Time → Value
```

对于 Vector Field：

```text
F(x, y, t) = (vx, vy)
```

对于 Scalar Field：

```text
F(x, y, t) = s
```

因此 Field 不应该被限定为 Vector Field。

---

# 4. Field 类型体系

V1.3 定义：

```text
Field
├── ScalarField
├── VectorField
├── NoiseField
├── CurlField
├── ForceField
├── FlowField
├── CompositeField
└── TransformField
```

---

# 5. Scalar Field

Scalar Field 为每个空间位置提供一个标量值。

```ts
interface ScalarField extends Field<number> {

  sample(
    point: Point,
    context: FieldContext
  ): number

}
```

数学形式：

```text
S(x,y,t) → s
```

用途：

- Density
- Opacity
- Mask
- Height
- Distortion strength
- Color influence
- Falloff

---

# 6. Vector Field

Vector Field 是最核心的 Field。

```ts
interface VectorField extends Field<Vector> {

  sample(
    point: Point,
    context: FieldContext
  ): Vector

}
```

数学：

```text
V(x,y,t) = (vx, vy)
```

例如：

```text
→ → → → →
→ → → → →
→ → → → →
```

或者：

```text
↗ → ↘
↑   ↓
↖ ← ↙
```

---

# 7. FieldContext

所有 Field 都必须通过 Context 获取运行时信息。

```ts
interface FieldContext {

  time: number

  delta: number

  seed: Seed

  viewport: Viewport

  semantic: SemanticArtConfig

}
```

可选：

```ts
interface FieldContext {

  interaction?: InteractionState

}
```

Field 不应直接访问：

```text
window
document
canvas
DOM
```

---

# 8. Field Coordinate System

Field 默认使用归一化坐标：

```text
x ∈ [0,1]
y ∈ [0,1]
```

因此：

```text
(0,0)
 ┌──────────────┐
 │              │
 │      (0.5,   │
 │       0.5)   │
 │              │
 └──────────────┘
              (1,1)
```

Field 不应该依赖具体屏幕像素尺寸。

---

# 9. Vector Magnitude

Vector Field 的结果：

```text
V = (vx, vy)
```

必须能够计算：

```text
magnitude(V)
```

即：

```text
|V| = √(vx² + vy²)
```

Field 可以分别定义：

```text
Direction
Magnitude
```

避免将二者耦合。

---

# 10. Normalized Vector Field

部分场只关心方向。

例如：

```text
Flow Direction
```

定义：

```ts
normalize(vector)
```

结果：

```text
|V| = 1
```

推荐允许：

```ts
interface VectorFieldOptions {

  normalize?: boolean

}
```

---

# 11. Noise Field

Noise Field 用于生成连续的空间变化。

基础接口：

```ts
interface NoiseField extends VectorField {

  scale: number

  octaves: number

  persistence: number

  lacunarity: number

}
```

Noise 本身可以产生：

```text
Scalar Noise
Vector Noise
```

---

# 12. Scalar Noise

```text
N(x,y,t) → s
```

典型用途：

```text
Density
Distortion
Opacity
Color
Height
```

---

# 13. Vector Noise

```text
N(x,y,t) → (vx,vy)
```

可以直接用于：

```text
Flow
Displacement
Motion
Curve Deformation
```

---

# 14. Noise 算法

V1.3 定义算法抽象：

```ts
interface NoiseSource {

  sample(
    x: number,
    y: number,
    z?: number
  ): number

}
```

允许：

```text
Perlin
Simplex
Value Noise
Fractal Noise
Domain Warping
```

但算法不应该污染 Field Contract。

---

# 15. Seeded Noise

所有 Noise 必须支持 deterministic seed。

```ts
interface NoiseSource {

  readonly seed: number

  sample(
    x: number,
    y: number
  ): number

}
```

相同：

```text
seed
+
coordinates
```

必须得到相同结果。

---

# 16. Fractal Noise

Fractal Noise：

```text
Noise
 +
Noise × persistence
 +
Noise × persistence²
 +
...
```

配置：

```ts
interface FractalNoiseConfig {

  octaves: number

  persistence: number

  lacunarity: number

  scale: number

}
```

语义：

```text
octaves
    ↓
complexity

persistence
    ↓
detail strength

scale
    ↓
spatial frequency
```

---

# 17. Curl Field

Curl Field 是本引擎非常重要的 Field。

它可以生成：

```text
连续
无明显汇聚
具有流体感
```

的流线。

二维形式可以由 Scalar Noise 派生：

```text
Vx = ∂N / ∂y

Vy = -∂N / ∂x
```

即：

```text
Curl(N)
   ↓
Vector Field
```

典型效果：

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

---

# 18. Force Field

Force Field 描述空间中的作用力。

```ts
interface ForceField extends VectorField {

  strength: number

}
```

基础类型：

```text
Attractor
Repulsor
Gravity
Vortex
Magnetic
Directional
```

---

# 19. Attractor

吸引场：

```text
     ↘ ↓ ↙
      ↘↓↙
    →  ●  ←
      ↗↑↖
```

数学：

```text
F = normalize(C - P) × strength
```

其中：

```text
C = center
P = point
```

---

# 20. Repulsor

排斥场：

```text
      ↖ ↑ ↗
      ← ● →
      ↙ ↓ ↘
```

数学方向与 Attractor 相反。

---

# 21. Gravity Field

Gravity Field 与 Attractor 类似，但强度可以随距离衰减：

```text
F(r) = strength / r²
```

必须设置最小距离：

```ts
minDistance
```

避免：

```text
r → 0
```

导致数值爆炸。

---

# 22. Vortex Field

Vortex 是生成旋转流动的核心 Field。

例如：

```text
↖ ↑ ↗
←   →
↙ ↓ ↘
```

或者：

```text
↘ ↓ ↙
→   ←
↗ ↑ ↖
```

定义：

```text
F = perpendicular(normalize(C-P)) × strength
```

支持：

```text
clockwise
counter-clockwise
```

---

# 23. Magnetic Field

Magnetic Field 是 Force Field 的扩展模型。

它允许：

```text
Direction
+
Distance
+
Polarity
```

共同决定影响。

典型用途：

```text
Organic attraction
Particle-like flow
Network deformation
Abstract magnetic structures
```

---

# 24. Directional Field

最简单的 Field：

```ts
interface DirectionalField extends VectorField {

  direction: Vector

  strength: number

}
```

例如：

```text
→ → → → →
→ → → → →
→ → → → →
```

适用于：

- Wind
- Horizontal flow
- Vertical flow
- Background motion

---

# 25. Flow Field

Flow Field 是面向视觉生成的高层 Field。

```ts
interface FlowField extends VectorField {

  sample(
    point: Point,
    context: FieldContext
  ): Vector

}
```

它不限定具体算法。

可以来自：

```text
Noise
Curl
Force
Composite
Custom Function
```

因此：

```text
FlowField
   ├── Noise Flow
   ├── Curl Flow
   ├── Vortex Flow
   ├── Force Flow
   └── Composite Flow
```

---

# 26. Field Composition

多个 Field 可以组合。

```ts
interface CompositeField extends VectorField {

  fields: VectorField[]

  weights: number[]

}
```

数学：

```text
F = w1F1 + w2F2 + ... + wnFn
```

例如：

```text
Curl Noise
      +
Vortex
      +
Directional Wind
      ↓
Composite Flow
```

---

# 27. Field Operations

V1.3 定义基本操作：

```text
Add
Subtract
Multiply
Normalize
Clamp
Scale
Rotate
Invert
Blend
```

例如：

```text
Field A
   ↓
Scale(0.5)
   ↓
Rotate(30°)
   ↓
Field B
   ↓
Add
```

---

# 28. Field Falloff

Force Field 必须支持 Falloff。

统一抽象：

```ts
interface Falloff {

  evaluate(distance: number): number

}
```

基础类型：

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

例如：

```text
Center
  ●
  │
  │ strong
  ↓
 ●
   \
    \ weak
     ●
```

---

# 29. Field Bounds

Field 可以限定作用范围：

```ts
interface FieldBounds {

  contains(point: Point): boolean

}
```

超出范围：

```text
return zero
```

或者：

```text
return fallback field
```

---

# 30. Field Mask

Field 可以通过 Scalar Field 控制强度。

```text
Vector Field
     ×
Scalar Mask
     ↓
Masked Vector Field
```

数学：

```text
F'(p) = F(p) × M(p)
```

用途：

- Focus
- Spotlight
- Edge fade
- Organic region
- Hero center

---

# 31. Field Transform

Field 可以进行空间变换。

```text
Transform
 ├── Translate
 ├── Rotate
 ├── Scale
 └── Warp
```

例如：

```text
Original Field
      ↓
Rotate 45°
      ↓
Transformed Field
```

---

# 32. Field Sampling

Field 必须支持单点采样：

```ts
sample(point, context)
```

同时允许批量采样：

```ts
sampleBatch(
  points: Point[],
  context: FieldContext
): Vector[]
```

批量 API 用于：

```text
Geometry deformation
Flow lines
Particle-like instances
Mesh displacement
```

---

# 33. Field Grid

Renderer 或 Generator 可以建立 Field Grid：

```text
● ● ● ● ●
● ● ● ● ●
● ● ● ● ●
● ● ● ● ●
```

但 Grid 不属于 Field 本身。

推荐：

```ts
interface FieldSampler {

  sampleGrid(
    width: number,
    height: number,
    context: FieldContext
  ): Vector[]

}
```

这样可以缓存计算结果。

---

# 34. Field Resolution

Field Resolution 与 Renderer Resolution 分离。

例如：

```text
Viewport
1920 × 1080

Field Grid
128 × 72

Renderer
1920 × 1080
```

Field 可以低分辨率采样，然后插值。

---

# 35. Field Interpolation

Grid Field 支持：

```text
Nearest
Linear
Bilinear
Smooth
```

默认：

```text
Bilinear
```

避免视觉上的方向突变。

---

# 36. Field Time

动态 Field 可以依赖：

```ts
context.time
```

例如：

```text
F(x,y,t)
```

而不是：

```text
F(x,y)
```

这允许：

```text
Moving Noise
Animated Vortex
Pulsing Force
Flow Evolution
```

---

# 37. Field Temporal Stability

动态 Field 必须保持时间连续。

不允许：

```text
frame 1 → random field
frame 2 → completely different field
```

应该：

```text
F(x,y,t)
```

连续变化。

否则会产生：

```text
Flicker
Noise
Temporal Instability
```

---

# 38. Field Seed Hierarchy

Field 使用独立 Seed：

```text
Root Seed
   │
   ├── Geometry Seed
   │
   ├── Field Seed
   │     ├── Noise Seed
   │     ├── Curl Seed
   │     └── Force Seed
   │
   ├── Motion Seed
   │
   └── Composition Seed
```

这样修改 Geometry 不会导致 Field 完全重随机。

---

# 39. Field Semantic Parameters

用户层不应该暴露：

```text
octaves
lacunarity
curl epsilon
```

作为主要控制项。

推荐：

```ts
interface FieldSemanticConfig {

  turbulence: number

  flow: number

  attraction: number

  repulsion: number

  vortex: number

  smoothness: number

}
```

内部再映射：

```text
turbulence
    ↓
noise scale
+
octaves
+
curl strength
```

---

# 40. Field 与 Geometry

Field 对 Geometry 的主要作用：

```text
Geometry
    ↓
Sample
    ↓
Field
    ↓
Displacement
    ↓
Deformed Geometry
```

例如 Ribbon：

```text
Center Curve
     ↓
Curl Field
     ↓
Control Point Displacement
     ↓
Organic Ribbon
```

---

# 41. Field 与 Motion

Field 可以提供 Motion 的方向。

```text
Motion
   ↓
sample Field
   ↓
velocity
   ↓
position
```

因此：

```text
Field = influence
Motion = temporal integration
```

二者必须保持边界。

---

# 42. Field 与 Composition

Composition 可以使用 Field 作为空间权重。

例如：

```text
Center Focus
    ↓
Scalar Field
    ↓
Geometry Density
```

形成：

```text
高密度
   ●●●●
 ●●●●●●
   ●●●●
低密度
```

---

# 43. Field 与 Interaction

Interaction 不直接修改 Field。

推荐：

```text
Pointer
   ↓
InteractionState
   ↓
Field Modifier
   ↓
Runtime Field
```

例如：

```text
Pointer
    ↓
Repulsor
    ↓
Composite Field
```

这样交互是 Field 的一种动态来源。

---

# 44. Field Modifier

定义：

```ts
interface FieldModifier {

  apply(
    field: VectorField,
    context: FieldContext
  ): VectorField

}
```

基础 Modifier：

```text
PointerRepulsion
PointerAttraction
PointerVortex
Focus
Boundary
TimeWarp
```

---

# 45. Field Pipeline

完整流程：

```text
Field Config
     ↓
Field Generator
     ↓
Base Field
     ↓
Transform
     ↓
Mask
     ↓
Composition
     ↓
Modifier
     ↓
Runtime Field
     ↓
Geometry / Motion
```

---

# 46. Field Registry

```ts
interface FieldRegistry {

  register(
    type: string,
    factory: FieldFactory
  ): void

  get(
    type: string
  ): FieldFactory | undefined

}
```

默认：

```text
scalar
vector
noise
curl
attractor
repulsor
gravity
vortex
magnetic
directional
flow
composite
```

---

# 47. Field Plugin

插件可以提供：

```text
Custom Field
Custom Noise
Custom Falloff
Custom Modifier
Custom Field Operator
```

例如：

```ts
registerField({
  type: 'swirl-noise',
  factory: swirlNoiseFactory
})
```

插件不得修改基础：

```text
FieldContext
Vector
Scalar
Sampling Contract
```

---

# 48. Field Performance

Field 是高频计算模块。

必须遵循：

```text
No allocation in hot path
```

避免每次：

```ts
sample()
```

都创建大量临时对象。

推荐：

```ts
interface MutableVector {

  x: number
  y: number

}
```

或者：

```text
TypedArray
```

用于批量计算。

---

# 49. Field Cache

支持：

```text
Static Field
Cached Field
Dynamic Field
Procedural Field
```

例如 Static Noise：

```text
Generate
 ↓
Cache
 ↓
Reuse
```

Dynamic Noise：

```text
sample(x,y,t)
```

无需完整缓存。

---

# 50. Field GPU Compatibility

Field Contract 必须保持 Renderer-independent。

但未来允许：

```text
CPU Field
     ↓
GPU Field
```

例如：

```text
CPU:
sample(point)

GPU:
shader evaluation
```

核心语义保持一致：

```text
F(x,y,t)
```

---

# 51. Field Determinism

相同：

```text
Field Config
+
Seed
+
Point
+
Time
```

必须产生相同结果。

即：

```text
F(config, seed, p, t)
```

具有确定性。

---

# 52. Field Error Model

定义：

```ts
FieldError
FieldSamplingError
NoiseGenerationError
FieldCompositionError
FieldConfigurationError
```

非法参数：

```text
NaN
Infinity
negative scale
invalid falloff
```

必须被拦截。

---

# 53. Field Serialization

例如：

```json
{
  "type": "curl-noise",
  "scale": 1.2,
  "strength": 0.8,
  "octaves": 4,
  "seed": 12345
}
```

Field Serialization 不应包含：

```text
Renderer State
Canvas
DOM
GPU Resource
```

---

# 54. Field 示例：Aurora

```json
{
  "type": "composite",
  "fields": [
    {
      "type": "curl-noise",
      "strength": 0.8,
      "scale": 1.1
    },
    {
      "type": "directional",
      "direction": [1, 0],
      "strength": 0.15
    }
  ]
}
```

语义：

```text
Curl Noise
+
Horizontal Drift
=
Aurora Flow
```

---

# 55. Field 示例：Orbital

```json
{
  "type": "vortex",
  "center": [0.5, 0.5],
  "strength": 0.8,
  "falloff": "smooth"
}
```

形成：

```text
        ↗ ↑ ↖
      →   ●   ←
        ↘ ↓ ↙
```

---

# 56. Field 示例：Organic

```json
{
  "type": "composite",
  "fields": [
    {
      "type": "curl-noise",
      "strength": 0.7
    },
    {
      "type": "attractor",
      "center": [0.5, 0.5],
      "strength": 0.2
    }
  ]
}
```

形成：

```text
Organic Flow
      +
Central Focus
```

---

# 57. Field 最终分层

最终 Field 架构：

```text
                 Field
                   │
        ┌──────────┴──────────┐
        ↓                     ↓
   ScalarField           VectorField
                              │
          ┌───────────┬───────┴─────────┐
          ↓           ↓                 ↓
       Noise        Force             Flow
          │           │                 │
       Curl       Attractor          Composite
       Fractal    Repulsor           Transform
       Domain     Vortex              Modifier
                  Gravity
                  Magnetic
```

---

# 58. Field 核心边界

Field：

> **定义空间影响。**

Geometry：

> **定义空间形状。**

Motion：

> **定义时间变化。**

三者关系：

```text
Geometry
   │
   ├── Shape
   │
   └── Sample
         ↓
       Field
         ↓
      Influence
         ↓
       Motion
         ↓
      Animation
```

---

# 59. V1.3 MVP

必须实现：

```text
[x] Scalar Field
[x] Vector Field
[x] Seeded Noise
[x] Fractal Noise
[x] Curl Noise
[x] Directional Field
[x] Attractor
[x] Repulsor
[x] Vortex
[x] Falloff
[x] Composite Field
[x] Field Mask
[x] Field Transform
[x] Field Sampling
[x] Field Context
[x] Field Registry
[x] Field Serialization
```

---

# 60. V1.3 暂不实现

明确排除：

```text
3D Vector Field
Fluid Dynamics Solver
Navier-Stokes
Physics Engine
GPU Compute Framework
SPH
Particle Physics
Full Simulation Engine
```

这些不是 Generative Art Engine 当前核心职责。

---

# 61. V1.3 收敛判定

Field Specification 满足以下条件即可冻结：

- [x] Scalar Field
- [x] Vector Field
- [x] Noise Field
- [x] Curl Field
- [x] Force Field
- [x] Flow Field
- [x] Composite Field
- [x] Falloff
- [x] Mask
- [x] Transform
- [x] Modifier
- [x] Sampling
- [x] Resolution
- [x] Temporal Stability
- [x] Seed
- [x] Serialization
- [x] Registry
- [x] Plugin
- [x] Performance Boundary
- [x] GPU Compatibility Boundary
- [x] MVP Scope

**Field Specification V1.3 收敛。**

---

# 62. 下一阶段

下一版本进入：

> **Composition Specification V1.4**

重点定义：

```text
Geometry
    ↓
Distribution
    ↓
Layer
    ↓
Composition
    ↓
Balance
    ↓
Focus
    ↓
Depth
    ↓
Rhythm
    ↓
Visual Hierarchy
```

Composition 的目标不是“把元素摆上去”，而是解决：

> **为什么同样的几何与 Field，最终画面能够形成艺术感，而不是随机图形堆积。**

V1.4 将重点定义：

1. Composition Model
2. Layout
3. Distribution
4. Density
5. Balance
6. Symmetry
7. Focus
8. Depth
9. Rhythm
10. Visual Hierarchy
11. Layer Composition
12. Negative Space
13. Responsive Composition
14. Semantic Composition Parameters
15. Composition Quality Constraints

不引入新的产品范围。