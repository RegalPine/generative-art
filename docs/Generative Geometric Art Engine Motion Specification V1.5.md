# Generative Geometric Art Engine
## Motion Specification
### 动态与时间系统规范 V1.5

> Status: Draft / Architecture Baseline  
> Product: Generative Geometric Art Engine  
> Package: `@regalpine/generative-art`  
> Previous: Composition Specification V1.4

---

# 1. 规范目标

Motion 定义 Generative Geometric Art Engine 中：

> **Geometry、Field、Composition 如何随时间发生变化。**

核心关系：

```text
Geometry
   ↓
Field
   ↓
Composition
   ↓
Motion
   ↓
Time
   ↓
Scene State
   ↓
Renderer
```

Motion 不负责：

- 生成 Geometry
- 计算 Field 本身
- 决定 Composition
- 定义颜色与材质
- 绘制 Canvas/WebGL/WebGPU
- 管理 DOM

---

# 2. Motion 核心原则

Motion 必须区分：

```text
State
Time
Velocity
Acceleration
```

基本模型：

```text
Position
    ↓
Velocity
    ↓
Acceleration
    ↓
Time Integration
    ↓
New Position
```

---

# 3. Motion Contract

统一接口：

```ts
interface Motion {

  readonly type: string

  update(
    state: MotionState,
    context: MotionContext
  ): MotionState

}
```

---

# 4. MotionState

```ts
interface MotionState {

  position: Vector2

  rotation: number

  scale: Vector2

  velocity: Vector2

  angularVelocity: number

  opacity: number

}
```

可扩展：

```ts
interface MotionState {

  data?: Record<string, number>

}
```

---

# 5. MotionContext

```ts
interface MotionContext {

  time: number

  delta: number

  seed: Seed

  viewport: Viewport

  interaction: InteractionState

  field?: Field

}
```

Motion 不直接访问：

```text
window
document
requestAnimationFrame
canvas
```

---

# 6. Time Model

系统使用：

```text
time
delta
```

两个基本时间量。

```text
time
=
从 Motion 开始以来的累计时间

delta
=
当前更新与上一更新之间的时间差
```

单位：

```text
milliseconds
```

内部计算可转换为：

```text
seconds
```

---

# 7. Delta Time

禁止假设固定 FPS。

错误：

```ts
position.x += 2
```

推荐：

```ts
position.x += velocity.x * deltaSeconds
```

因此：

```text
30 FPS
60 FPS
120 FPS
```

理论运动结果应保持接近一致。

---

# 8. Time Normalization

Motion 内部统一：

```ts
const dt = delta / 1000
```

所有速度：

```text
units / second
```

而不是：

```text
units / frame
```

---

# 9. Motion Lifecycle

```text
CREATED
   ↓
INITIALIZED
   ↓
ACTIVE
   ↓
PAUSED
   ↓
RESUMED
   ↓
STOPPED
   ↓
DISPOSED
```

Motion 本身不管理整个 Runtime 生命周期。

Runtime 负责：

```text
start()
pause()
resume()
stop()
destroy()
```

---

# 10. Flow Motion

Flow 是本引擎最重要的 Motion 类型之一。

```text
Geometry
    ↓
Field.sample()
    ↓
Velocity
    ↓
Position
```

数学：

```text
v(t) = F(p,t)
```

然后：

```text
p(t + dt)
=
p(t) + v(t)dt
```

---

# 11. Flow Motion Interface

```ts
interface FlowMotion extends Motion {

  field: VectorField

  strength: number

}
```

更新：

```ts
const force = field.sample(position, context)

velocity += force * strength * dt

position += velocity * dt
```

---

# 12. Direct Flow

为了简单流动，可以使用：

```text
velocity = field(position)
```

即：

```text
p(t + dt)
=
p(t) + F(p,t)dt
```

适合：

```text
Ribbon
Flow Line
Atmospheric Curve
```

---

# 13. Inertial Flow

更自然的运动：

```text
Field
 ↓
Acceleration
 ↓
Velocity
 ↓
Position
```

即：

```text
a = F(p,t)
v = v + a·dt
p = p + v·dt
```

适合：

```text
Organic Motion
Fluid-like Motion
Soft Flow
```

---

# 14. Damping

为了防止速度无限增长：

```text
v = v × damping
```

推荐：

```ts
interface FlowMotionConfig {

  strength: number

  damping: number

}
```

典型：

```text
damping < 1
```

---

# 15. Drift Motion

Drift 是低强度持续移动。

```text
p(t + dt)
=
p(t)
+
velocity × dt
```

适合：

```text
Atmosphere
Background
Floating Geometry
```

特点：

```text
低速度
低变化
高稳定性
```

---

# 16. Orbit Motion

围绕中心旋转：

```text
        ●
      ↗
    ●
      ↘
        ●
```

配置：

```ts
interface OrbitMotionConfig {

  center: Point

  radius: number

  angularVelocity: number

  phase: number

}
```

公式：

```text
x = cx + r cos(ωt + φ)

y = cy + r sin(ωt + φ)
```

---

# 17. Elliptical Orbit

允许：

```text
radiusX
radiusY
```

公式：

```text
x = cx + rx cos(θ)

y = cy + ry sin(θ)
```

适用于：

```text
Orbital
Planetary
Cosmic
Elegant
```

---

# 18. Wave Motion

Wave Motion：

```text
offset = A sin(ωt + phase)
```

支持：

```text
Position
Rotation
Scale
Opacity
```

例如：

```text
●  →  ●  →  ●
 ↘     ↘
```

---

# 19. Wave Propagation

多个 Geometry 可以产生传播波：

```text
t0:
●

t1:
● ●

t2:
● ● ●

t3:
● ● ● ●
```

参数：

```ts
interface WavePropagationConfig {

  amplitude: number

  frequency: number

  speed: number

  phaseOffset: number

}
```

---

# 20. Pulse Motion

Pulse 用于周期性变化。

```text
scale(t)
=
baseScale
+
amplitude × sin(ωt)
```

可以作用于：

```text
Scale
Opacity
Glow
Width
```

Motion 本身只改变逻辑状态。

Glow 的实际实现由 Material 完成。

---

# 21. Breathing Motion

Breathing 是更柔和的 Pulse。

推荐使用：

```text
Smooth Sinusoidal
```

或者：

```text
Smoothstep
```

避免：

```text
突然开始
突然结束
```

适用于：

```text
Organic
Atmosphere
Soft Background
```

---

# 22. Rotation Motion

支持：

```ts
interface RotationMotionConfig {

  angularVelocity: number

  axis?: 'x' | 'y' | 'z'

}
```

V1.5 只实现 2D：

```text
rotation += angularVelocity × dt
```

---

# 23. Parallax Motion

Parallax 根据 Depth 产生不同移动速度。

```text
Background
   ↓ slow

Middle
   ↓ medium

Foreground
   ↓ fast
```

统一模型：

```text
velocity =
baseVelocity × depthFactor
```

---

# 24. Interaction Motion

用户交互不直接修改 Geometry。

推荐：

```text
Pointer
   ↓
InteractionState
   ↓
Field / Motion
   ↓
Geometry State
```

例如：

```text
Pointer
   ↓
Repulsion Field
   ↓
Flow Motion
   ↓
Ribbon
```

---

# 25. InteractionState

```ts
interface InteractionState {

  pointer?: Point

  velocity?: Vector2

  pressure?: number

  active: boolean

}
```

未来可以支持：

```text
Touch
Pointer
Device Orientation
Scroll
Hover
Drag
```

---

# 26. Mouse Repulsion

典型：

```text
Pointer
   ●
  ↙ ↓ ↘
 ←     →
  ↖ ↑ ↗
```

实现方式：

```text
Pointer
   ↓
Repulsor Field
   ↓
Flow Motion
```

而不是：

```text
Geometry
   ↓
if mouse...
```

这样保持架构一致。

---

# 27. Scroll Motion

Scroll 不应该直接修改 Geometry。

推荐：

```text
Scroll Position
      ↓
Motion Context
      ↓
Parallax Motion
      ↓
Scene State
```

---

# 28. Morph Motion

Morph 用于：

```text
Geometry A
    ↓
Geometry B
```

之间的连续变换。

要求：

```text
Topology Compatible
```

或者通过：

```text
Resampling
```

转换成相同采样数量。

---

# 29. Curve Morph

例如：

```text
Circle
  ↓
Resample
  ↓
N points

Wave
  ↓
Resample
  ↓
N points

N points
  ↓
Interpolation
  ↓
Morph
```

公式：

```text
P(t)
=
(1-a)PA(t)
+
aPB(t)
```

---

# 30. Morph Easing

Morph 不应只能线性变化。

支持：

```text
Linear
EaseIn
EaseOut
EaseInOut
Smooth
Cubic
```

---

# 31. Motion Composition

多个 Motion 可以组合：

```ts
interface CompositeMotion extends Motion {

  motions: Motion[]

}
```

例如：

```text
Orbit
 +
Pulse
 +
Rotation
```

形成：

```text
Orbital + Breathing + Rotation
```

---

# 32. Motion Priority

多个 Motion 同时影响同一属性时必须有明确规则。

推荐：

```text
Base
 ↓
Primary Motion
 ↓
Secondary Motion
 ↓
Modifier
 ↓
Final State
```

例如：

```text
Orbit
 ↓
Pulse
 ↓
Interaction Offset
```

---

# 33. Motion Channels

为了避免互相覆盖，Motion 应区分 Channel：

```text
Position
Rotation
Scale
Opacity
Custom
```

例如：

```ts
interface MotionChannel {

  position?: Vector2

  rotation?: number

  scale?: Vector2

  opacity?: number

}
```

这样：

```text
Orbit → Position
Pulse → Scale
Fade → Opacity
```

可以同时存在。

---

# 34. Motion Blending

支持：

```text
Override
Additive
Multiply
Lerp
```

例如：

```text
Orbit Position
+
Pointer Offset
```

采用：

```text
Additive
```

---

# 35. Motion Weight

每个 Motion 可以拥有：

```ts
weight: number
```

例如：

```text
Orbit
weight = 1.0

Pointer
weight = 0.2
```

最终：

```text
Motion
=
Σ(weight × contribution)
```

---

# 36. Easing

Motion 统一使用 Easing：

```ts
interface Easing {

  evaluate(t: number): number

}
```

基础：

```text
Linear
Quadratic
Cubic
Quartic
Quintic
Sine
Exponential
Circular
Back
Elastic
Bounce
```

但 MVP 不需要实现全部。

---

# 37. Motion Phase

每个 Geometry 可以拥有独立 Phase：

```text
phase = seededRandom()
```

例如：

```text
●   ●   ●   ●
↗   →   ↘   ↑
```

而不是所有元素：

```text
同时开始
同时结束
```

---

# 38. Phase Distribution

支持：

```text
Uniform
Random
Progressive
Spatial
DepthBased
```

例如：

```text
phase =
x × frequency
```

可以产生空间传播效果。

---

# 39. Motion Seed

Motion 使用独立 Seed：

```text
Root Seed
   ↓
Motion Seed
   ↓
Instance Seed
   ↓
Phase
Amplitude
Frequency
```

因此：

```text
修改 Palette
```

不应该导致：

```text
Motion 完全改变
```

---

# 40. Motion Determinism

同样：

```text
Preset
+
Seed
+
Viewport
+
Time
```

必须产生确定结果。

即：

```text
M(config, seed, viewport, time)
```

是 deterministic 的。

---

# 41. Temporal Continuity

动画必须连续。

禁止：

```text
Frame N
 ↓
random state

Frame N+1
 ↓
another random state
```

推荐：

```text
State(t)
 ↓
Integration
 ↓
State(t + dt)
```

---

# 42. Fixed Step

对于需要稳定模拟的 Motion，可以使用 Fixed Step：

```text
simulationStep = 1 / 60
```

渲染 FPS 与模拟 FPS 分离：

```text
Simulation
60 Hz

Renderer
30 / 60 / 120 Hz
```

MVP 默认不强制 Fixed Step。

但接口必须允许未来加入。

---

# 43. Time Scale

Runtime 支持：

```ts
timeScale: number
```

例如：

```text
1.0
正常

0.5
慢动作

2.0
快速

0
暂停
```

计算：

```text
effectiveDelta
=
delta × timeScale
```

---

# 44. Reduced Motion

必须支持：

```text
prefers-reduced-motion
```

用户启用 Reduced Motion 时：

```text
Motion Complexity ↓
Motion Speed ↓
Amplitude ↓
Parallax ↓
```

或者：

```text
Static Frame
```

---

# 45. Reduced Motion Policy

配置：

```ts
interface ReducedMotionConfig {

  enabled: boolean

  mode:
    | 'disable'
    | 'reduce'
    | 'static'

}
```

默认：

```text
reduce
```

而不是完全关闭。

---

# 46. Visibility Optimization

页面不可见时：

```text
Visibility
   ↓
Pause / Throttle
```

例如：

```text
Document Hidden
      ↓
Motion Pause
      ↓
Renderer Pause
```

恢复：

```text
Visible
   ↓
Resume
```

---

# 47. Intersection Optimization

当 Canvas 不在 viewport 中：

```text
IntersectionObserver
        ↓
Motion Pause
```

避免后台持续计算。

---

# 48. Motion Scheduler

Runtime 统一管理：

```ts
interface MotionScheduler {

  update(
    time: number,
    delta: number
  ): void

}
```

流程：

```text
requestAnimationFrame
        ↓
Scheduler
        ↓
Motion
        ↓
Scene State
        ↓
Renderer
```

---

# 49. Renderer 与 Motion 的边界

Motion 不负责：

```text
draw()
stroke()
fill()
shader()
```

Renderer 只读取：

```text
Scene State
```

因此：

```text
Motion
   ↓
State

Renderer
   ↓
Render(State)
```

---

# 50. Motion Performance

每帧 Hot Path：

```text
sample Field
calculate Motion
update State
```

必须：

```text
No unnecessary allocation
No DOM access
No synchronous layout
No serialization
```

---

# 51. Motion Batch Update

大量 Geometry：

```text
100
1000
10000
```

不能逐个产生大量临时对象。

推荐：

```text
TypedArray
SoA
Batch Field Sampling
Batch Motion Update
```

例如：

```text
positions[]
velocities[]
rotations[]
scales[]
```

---

# 52. Static Motion

部分场景可以不启用动画：

```text
motion.enabled = false
```

此时：

```text
Geometry
 ↓
Composition
 ↓
Static Scene
```

Renderer 只需要渲染一次。

---

# 53. Animation Budget

Runtime 可以提供：

```ts
interface MotionBudget {

  maxInstances: number

  maxFieldSamplesPerFrame: number

  maxUpdateTime: number

}
```

当超过预算：

```text
Quality Degradation
```

优先：

```text
减少 Motion 更新
```

而不是直接导致页面卡顿。

---

# 54. Adaptive Motion Quality

支持：

```text
Performance
    ↓
Motion Quality
```

例如：

```text
High
 ↓
Full Motion

Medium
 ↓
Reduced Instances

Low
 ↓
Static / Simplified
```

---

# 55. Motion Serialization

示例：

```json
{
  "type": "flow",
  "strength": 0.8,
  "damping": 0.94,
  "timeScale": 1
}
```

Orbit：

```json
{
  "type": "orbit",
  "center": [0.5, 0.5],
  "radius": 0.25,
  "angularVelocity": 0.15
}
```

---

# 56. Motion Registry

```ts
interface MotionRegistry {

  register(
    type: string,
    factory: MotionFactory
  ): void

  get(
    type: string
  ): MotionFactory | undefined

}
```

默认：

```text
flow
drift
orbit
wave
pulse
breathing
morph
rotation
parallax
composite
```

---

# 57. Motion Plugin

插件允许扩展：

```text
Custom Motion
Custom Easing
Custom Motion Modifier
Custom Motion Channel
```

但不能修改：

```text
MotionContext
MotionState
Scheduler Contract
```

---

# 58. Motion Pipeline

完整流程：

```text
Composition
     ↓
Initial State
     ↓
Motion
     ↓
Field Sample
     ↓
Velocity / Acceleration
     ↓
Integration
     ↓
Motion Modifiers
     ↓
Final Scene State
     ↓
Renderer
```

---

# 59. 完整 Runtime 时间循环

```text
requestAnimationFrame
        ↓
   Runtime Clock
        ↓
   Time / Delta
        ↓
 Motion Scheduler
        ↓
   Field Sampling
        ↓
 Motion Evaluation
        ↓
 Scene State Update
        ↓
 Composition Constraints
        ↓
 Material State
        ↓
 Renderer
```

---

# 60. Motion 与六层模型

现在核心模型完整连接：

```text
┌───────────────┐
│   Geometry    │
│     Shape     │
└───────┬───────┘
        ↓
┌───────────────┐
│     Field     │
│   Influence   │
└───────┬───────┘
        ↓
┌───────────────┐
│ Composition   │
│ Organization  │
└───────┬───────┘
        ↓
┌───────────────┐
│    Motion     │
│ Temporal      │
│ Change        │
└───────┬───────┘
        ↓
┌───────────────┐
│   Material    │
│ Appearance    │
└───────┬───────┘
        ↓
┌───────────────┐
│   Renderer    │
│ Presentation  │
└───────────────┘
```

---

# 61. Motion 示例：Aurora

```text
Geometry
  Ribbon

Field
  Curl Noise

Composition
  Flow Distribution
  Center Focus
  Negative Space

Motion
  Flow
  Low Frequency Drift

Material
  Gradient
  Glow
  Soft Blur

Renderer
  Canvas2D
```

结果：

```text
Geometry
    ↓
沿 Curl Field 流动
    ↓
不同 Phase
    ↓
产生连续 Aurora Motion
```

---

# 62. Motion 示例：Orbital

```text
Geometry
  Circle / Point

Field
  Vortex

Composition
  Radial

Motion
  Orbit
  Rotation
  Pulse

Material
  Glow

Renderer
  Canvas2D
```

---

# 63. Motion 示例：Organic

```text
Geometry
  Ribbon / Spline

Field
  Curl Noise
  Attractor

Composition
  Organic Distribution
  Asymmetric Balance

Motion
  Inertial Flow
  Breathing
  Drift

Material
  Soft Gradient
  Low Glow
```

---

# 64. Motion 与 CSS

CSS 可以控制 Motion 的语义参数：

```css
.hero {
  --ga-speed: 0.35;
  --ga-energy: 0.4;
  --ga-rhythm: 0.7;
}
```

但 CSS 不负责：

```text
Field Integration
Velocity
Geometry Morph
Simulation
```

即：

> CSS 声明 Motion 参数，TypeScript 执行 Motion。

---

# 65. Motion 与 Runtime API

支持：

```ts
art.update({
  motion: {
    speed: 0.5
  }
})
```

以及：

```ts
art.pause()
art.resume()
```

和：

```ts
art.update({
  timeScale: 0.3
})
```

---

# 66. V1.5 MVP

必须实现：

```text
[x] Motion Contract
[x] MotionState
[x] MotionContext
[x] Delta Time
[x] Flow
[x] Drift
[x] Orbit
[x] Wave
[x] Pulse
[x] Breathing
[x] Rotation
[x] Parallax
[x] Composite Motion
[x] Motion Channel
[x] Motion Weight
[x] Easing
[x] Phase
[x] Seed
[x] Time Scale
[x] Reduced Motion
[x] Visibility Optimization
[x] Intersection Optimization
[x] Motion Scheduler
[x] Serialization
[x] Registry
```

---

# 67. V1.5 P1

后续增强：

```text
Morph
Fixed-Step Simulation
Adaptive Motion Quality
Advanced Interaction
Motion Graph
GPU Motion
```

---

# 68. V1.5 暂不实现

明确排除：

```text
3D Physics
Rigid Body
Collision Engine
Fluid Simulation
Cloth Simulation
Particle Physics Engine
Full Timeline Editor
Audio Reactive Engine
```

这些不属于当前核心产品。

---

# 69. Motion 收敛判定

以下能力确定后，Motion 层冻结：

- [x] 时间模型
- [x] Delta Time
- [x] Flow
- [x] Drift
- [x] Orbit
- [x] Wave
- [x] Pulse
- [x] Breathing
- [x] Rotation
- [x] Parallax
- [x] Motion Channel
- [x] Motion Composition
- [x] Easing
- [x] Phase
- [x] Seed
- [x] Reduced Motion
- [x] Visibility Optimization
- [x] Scheduler
- [x] Performance Budget
- [x] Serialization
- [x] Plugin Boundary

**Motion Specification V1.5 收敛。**

---

# 70. 当前六层模型

至此核心语义已经稳定：

```text
Geometry
   │
   │ Shape
   ↓
Field
   │
   │ Influence
   ↓
Composition
   │
   │ Organization
   ↓
Motion
   │
   │ Temporal Change
   ↓
Material
   │
   │ Appearance
   ↓
Renderer
   │
   │ Presentation
   ↓
Canvas / WebGL / WebGPU
```

一句话定义：

> **Geometry 定义形，Field 定义势，Composition 定义构，Motion 定义变，Material 定义质，Renderer 定义呈现。**

---

# 71. 下一阶段

下一版本进入：

> **Material Specification V1.6**

重点定义：

```text
Material
├── Opacity
├── Gradient
├── Color
├── Glow
├── Blur
├── Grain
├── Noise
├── Shadow
├── Blend
├── Depth
└── Appearance Composition
```

特别需要解决一个核心问题：

> **如何让生成的几何从“技术图形”变成具有质感、层次和艺术美感的视觉对象。**

因此 V1.6 将重点定义 **Material + Palette + OKLCH/OKLab + Blend + Glow + Blur + Grain + Depth + Visual Style**，而不是重新扩展 Geometry 或 Motion。

**Motion Specification V1.5 收敛。**