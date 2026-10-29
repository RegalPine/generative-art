# Generative Geometric Art Engine 分阶段实现计划

> **Status:** Implementation Plan  
> **Version:** V1.0  
> **Package:** `@regalpine/generative-art`  
> **Based on:** Architecture Design V1.0 (Spec Chain V1.0 ~ V2.0)

---

## 目录

- [1. 计划概述](#1-计划概述)
- [2. 阶段总览](#2-阶段总览)
- [3. P0 阶段：MVP — 核心架构 + Canvas2D](#3-p0-阶段mvp--核心架构--canvas2d)
- [4. P1 阶段：完整视觉 + WebGL + 框架适配](#4-p1-阶段完整视觉--webgl--框架适配)
- [5. P2 阶段：大规模场景 + WebGPU + 产品化](#5-p2-阶段大规模场景--webgpu--产品化)
- [6. 跨阶段基础设施](#6-跨阶段基础设施)
- [7. 风险管理](#7-风险管理)
- [8. 质量门禁](#8-质量门禁)

---

# 1. 计划概述

## 1.1 目标

基于架构设计文档 V1.0 定义的六层语义模型与系统架构，将引擎从规范设计推进到可交付产品。

```text
规范阶段 (V1.0 ~ V2.0)
        ↓  ← 已完成
实现阶段 (P0 → P1 → P2)
        ↓
可交付产品
```

## 1.2 核心约束

```text
TypeScript strict mode
ESM primary + CJS compatible
Zero runtime dependency
Browser 运行环境
SSR-safe（模块加载不访问浏览器 API）
确定性生成（Seed 驱动，禁止 Math.random）
```

## 1.3 技术栈

```text
Language:    TypeScript (strict)
Build:       tsup / rollup
Test:        vitest
Module:      ESM + CJS
Package:     @regalpine/generative-art
```

---

# 2. 阶段总览

## 2.1 三阶段路线图

```text
┌─────────────────────────────────────────────────────────────┐
│                        P0: MVP                              │
│  核心架构 + Seed + 语义配置 + 基础六层 + Canvas2D            │
│  + 基础 Preset + CSS Variables + 生命周期                    │
│                                                             │
│  目标: 端到端跑通，验证六层语义模型                           │
│  产出: 可渲染的生成式几何艺术 Demo                            │
├─────────────────────────────────────────────────────────────┤
│                        P1: 完整视觉                         │
│  完整六层实现 + WebGL + 完整 Preset + Plugin                 │
│  + React/Vue Adapter + 自适应降级                           │
│                                                             │
│  目标: 生产级视觉表现                                        │
│  产出: 可发布到 npm 的 1.0 版本                              │
├─────────────────────────────────────────────────────────────┤
│                        P2: 规模化                           │
│  WebGPU + Worker + Offscreen + GPU Compute                  │
│  + Web Component + 性能工具 + Marketplace                   │
│                                                             │
│  目标: 大规模场景 + 生态                                     │
│  产出: 2.0 版本 + 生态工具                                   │
└─────────────────────────────────────────────────────────────┘
```

## 2.2 阶段依赖关系

```text
P0 (MVP)
  │
  ├── core/        → P1 全部依赖
  ├── geometry/    → P1 Geometry 扩展
  ├── field/       → P1 Field 扩展
  ├── composition/ → P1 Composition 扩展
  ├── motion/      → P1 Motion 扩展
  ├── material/    → P1 Material 扩展
  ├── renderer/    → P1 WebGL + P2 WebGPU
  ├── preset/      → P1 完整 Preset
  ├── css/         → P1 完整 CSS
  └── lifecycle/   → P1 完善
        │
        ▼
P1 (完整视觉)
  │
  ├── webgl/         → P2 增强
  ├── plugin/        → P2 Marketplace
  ├── adapter/       → P2 Web Component
  └── performance/   → P2 GPU Compute
        │
        ▼
P2 (规模化)
```

## 2.3 各阶段产出物

| 阶段 | 产出 | 验收标准 |
|------|------|----------|
| P0 | 可运行的 MVP 引擎 + Demo | 端到端渲染生成式几何艺术 |
| P1 | npm 1.0 发布 | 生产环境可用，框架适配完整 |
| P2 | npm 2.0 + 生态工具 | 大规模场景流畅运行 |

---

# 3. P0 阶段：MVP — 核心架构 + Canvas2D

## 3.1 阶段目标

```text
验证六层语义模型端到端可行
    ↓
Canvas2D 渲染出可演示的生成式几何艺术
    ↓
为 P1 扩展奠定坚实的架构基础
```

## 3.2 P0 范围

```text
✅ 项目工程化基础设施
✅ core: 运行时 + 生命周期 + Seed + 配置解析
✅ geometry: Polyline / Bezier / Spline / Circle / Wave / Ribbon
✅ field: Noise / Curl / Force (基础)
✅ composition: Distribution (Uniform / Random / Radial / Flow)
✅ motion: Flow / Drift / Wave / Breathing
✅ material: Color / Opacity / Gradient / basic Blend
✅ renderer: Canvas2D
✅ preset: 基础系统 + 2~3 内置 Preset
✅ css: 核心语义变量
✅ performance: DPR 限制 + Visibility 优化
```

## 3.3 Sprint 拆分

### Sprint 0: 工程化基础设施

**目标：** 搭建项目骨架，建立开发、构建、测试流水线。

| # | 任务 | 依赖 | 产出 |
|---|------|------|------|
| 0.1 | 初始化 npm 项目 `@regalpine/generative-art` | 无 | `package.json` |
| 0.2 | 配置 TypeScript (strict mode) | 0.1 | `tsconfig.json` |
| 0.3 | 配置构建工具 tsup (ESM + CJS dual build) | 0.1 | `tsup.config.ts` |
| 0.4 | 配置测试框架 vitest | 0.1 | `vitest.config.ts` |
| 0.5 | 配置 ESLint + Prettier | 0.1 | lint 配置 |
| 0.6 | 建立目录结构 | 0.2~0.5 | 所有模块目录骨架 |
| 0.7 | 配置 CI (lint + test + build) | 0.2~0.5 | CI pipeline |
| 0.8 | 配置入口文件 `src/index.ts` | 0.6 | 导出骨架 |

**目录结构：**

```text
src/
├── index.ts
├── core/
│   ├── runtime.ts
│   ├── seed.ts
│   ├── config.ts
│   ├── lifecycle.ts
│   └── types.ts
├── geometry/
│   ├── types.ts
│   ├── curve.ts
│   ├── polyline.ts
│   ├── bezier.ts
│   ├── spline.ts
│   ├── circle.ts
│   ├── wave.ts
│   ├── ribbon.ts
│   ├── generator.ts
│   ├── transform.ts
│   └── sampling.ts
├── field/
│   ├── types.ts
│   ├── scalar.ts
│   ├── vector.ts
│   ├── noise.ts
│   ├── curl.ts
│   ├── force.ts
│   └── operations.ts
├── composition/
│   ├── types.ts
│   ├── distribution/
│   │   ├── uniform.ts
│   │   ├── random.ts
│   │   ├── radial.ts
│   │   └── flow.ts
│   ├── density.ts
│   ├── focus.ts
│   ├── layer.ts
│   └── arrange.ts
├── motion/
│   ├── types.ts
│   ├── flow.ts
│   ├── drift.ts
│   ├── wave.ts
│   ├── breathing.ts
│   ├── channel.ts
│   └── integration.ts
├── material/
│   ├── types.ts
│   ├── color.ts
│   ├── opacity.ts
│   ├── gradient.ts
│   └── blend.ts
├── renderer/
│   ├── types.ts
│   ├── capabilities.ts
│   └── canvas2d.ts
├── preset/
│   ├── types.ts
│   ├── registry.ts
│   ├── resolver.ts
│   └── built-in/
├── css/
│   ├── variables.ts
│   ├── parser.ts
│   ├── mapping.ts
│   └── observer.ts
└── adapter/
    └── (P1)
```

**验收标准：**

```text
✅ npm install → 无报错
✅ npm run build → 产出 ESM + CJS
✅ npm run test → vitest 可运行
✅ npm run lint → ESLint 通过
✅ import { createGenerativeArt } from '@regalpine/generative-art' → 类型正确
```

---

### Sprint 1: Core — Seed + 类型系统 + 生命周期

**目标：** 建立引擎核心基础设施：确定性随机、基础类型、生命周期状态机。

| # | 任务 | 依赖 | 产出 |
|---|------|------|------|
| 1.1 | 实现基础数学类型 (Point, Vector, Matrix, Rect) | S0 | `core/types.ts` |
| 1.2 | 实现 Seeded Random (mulberry32 或等价算法) | 1.1 | `core/seed.ts` |
| 1.3 | Seed 确定性验证测试 | 1.2 | 测试用例 |
| 1.4 | 实现生命周期状态机 | 1.1 | `core/lifecycle.ts` |
| 1.5 | 状态转换规则 + 非法转换拒绝 | 1.4 | 测试用例 |
| 1.6 | 定义 Viewport / RenderContext 等基础接口 | 1.1 | 类型文件 |
| 1.7 | 定义 SemanticArtConfig (8 个语义参数) | 1.1 | 类型文件 |
| 1.8 | 定义 LayerContext / FieldContext 等统一 Context | 1.7 | 类型文件 |

**关键实现：**

```ts
// Seed - 确定性随机
interface Seed {
  readonly value: number
  next(): number        // [0, 1)
  range(min, max): number
  pick<T>(arr: T[]): T
}

// 生命周期状态机
enum LifecycleState {
  CREATED, INITIALIZED, RUNNING, PAUSED, STOPPED, DESTROYED
}

// 语义配置
interface SemanticArtConfig {
  density: number       // 0~1
  complexity: number    // 0~1
  energy: number        // 0~1
  softness: number      // 0~1
  depth: number         // 0~1
  rhythm: number        // 0~1
  turbulence: number    // 0~1
  focus: number         // 0~1
}
```

**验收标准：**

```text
✅ 相同 Seed → 相同随机序列（1000 次验证）
✅ 生命周期状态转换全部覆盖
✅ 非法状态转换被拒绝（如 DESTROYED → RUNNING）
✅ 所有类型通过 TypeScript strict 编译
```

---

### Sprint 2: Core — 配置解析 + 运行时骨架

**目标：** 实现配置优先级链、归一化流程、运行时主循环骨架。

| # | 任务 | 依赖 | 产出 |
|---|------|------|------|
| 2.1 | 实现配置归一化 (type check + range clamp + default fill) | S1 | `core/config.ts` |
| 2.2 | 实现语义→数学参数映射 | 2.1 | `core/config.ts` |
| 2.3 | 实现配置优先级链 (Default < Preset < Theme < CSS < JS < update) | 2.1 | `core/config.ts` |
| 2.4 | 实现 Runtime 主循环骨架 (update → render loop) | 2.2 | `core/runtime.ts` |
| 2.5 | 实现 GenerativeArt 接口 (start/pause/resume/stop/destroy) | 2.4 | `core/runtime.ts` |
| 2.6 | 实现 update() / resize() | 2.4 | `core/runtime.ts` |
| 2.7 | 实现 requestAnimationFrame 调度器 | 2.4 | `core/scheduler.ts` |
| 2.8 | Runtime 集成测试 (配置→种子→空 Scene→空渲染) | 2.5 | 测试用例 |

**配置优先级链：**

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

**验收标准：**

```text
✅ 配置归一化：越界值被 clamp 到 [0,1]
✅ 配置优先级：高优先级正确覆盖低优先级
✅ createGenerativeArt() 可创建实例
✅ start() → pause() → resume() → stop() → destroy() 流程跑通
✅ resize() 更新 Viewport
✅ SSR 安全：模块加载不访问 window/document
```

---

### Sprint 3: Geometry — 统一 Curve 接口 + 基础类型

**目标：** 实现 Geometry 层核心：统一 Curve 接口 + Arc-Length 参数化 + 6 种 MVP 几何类型。

| # | 任务 | 依赖 | 产出 |
|---|------|------|------|
| 3.1 | 实现统一 Curve 接口 (pointAt/tangentAt/normalAt/length/sample) | S1 | `geometry/curve.ts` |
| 3.2 | 实现 Arc-Length 参数化算法 | 3.1 | `geometry/sampling.ts` |
| 3.3 | 实现 Polyline | 3.1, 3.2 | `geometry/polyline.ts` |
| 3.4 | 实现 QuadraticBezier + CubicBezier | 3.1, 3.2 | `geometry/bezier.ts` |
| 3.5 | 实现 Spline (Catmull-Rom 或等价) | 3.1, 3.2 | `geometry/spline.ts` |
| 3.6 | 实现 Circle | 3.1, 3.2 | `geometry/circle.ts` |
| 3.7 | 实现 Wave | 3.1, 3.2 | `geometry/wave.ts` |
| 3.8 | 实现 Ribbon | 3.1, 3.2 | `geometry/ribbon.ts` |
| 3.9 | 实现 Geometry Transform (translate/rotate/scale) | 3.1 | `geometry/transform.ts` |
| 3.10 | 实现 Geometry Bounds 计算 | 3.3~3.8 | `geometry/bounds.ts` |
| 3.11 | 实现 Geometry Generator (Seed 驱动) | 3.3~3.8 | `geometry/generator.ts` |
| 3.12 | Geometry 单元测试 (Arc-Length 均匀性、确定性) | 3.3~3.11 | 测试用例 |

**关键验证 — Arc-Length 参数化：**

```text
对于 Circle (radius=100):
  pointAt(0.25) → 弧长 = 2π×100×0.25 = 157.08...
  pointAt(0.5)  → 弧长 = 2π×100×0.5  = 314.16...

对于 Bezier:
  sample(10) → 10 个点，相邻点间距近似相等
```

**验收标准：**

```text
✅ 所有 Curve 实现统一接口
✅ Arc-Length 参数化：t=0.5 对应曲线总长度的 50%
✅ sample(N) 产生 N 个近似等距点
✅ 相同 Seed → 相同 Geometry（确定性）
✅ Transform 不修改原始 Geometry
✅ Bounds 计算正确
```

---

### Sprint 4: Field — Noise + Curl + 基础 Force

**目标：** 实现 Field 层核心：统一 Field 接口 + Noise 体系 + Curl Field + 基础 Force Field。

| # | 任务 | 依赖 | 产出 |
|---|------|------|------|
| 4.1 | 实现统一 Field 接口 + FieldContext | S1 | `field/types.ts` |
| 4.2 | 实现 NoiseSource 抽象 + Seeded Perlin/Simplex Noise | 4.1, S1 | `field/noise.ts` |
| 4.3 | 实现 Fractal Noise (fBm: octaves/persistence/lacunarity) | 4.2 | `field/noise.ts` |
| 4.4 | 实现 ScalarField | 4.1 | `field/scalar.ts` |
| 4.5 | 实现 VectorField | 4.1 | `field/vector.ts` |
| 4.6 | 实现 NoiseField (Scalar + Vector) | 4.3 | `field/noise.ts` |
| 4.7 | 实现 Curl Field (Vx=∂N/∂y, Vy=-∂N/∂x) | 4.6 | `field/curl.ts` |
| 4.8 | 实现基础 Force Field (Attractor / Repulsor / Directional) | 4.1 | `field/force.ts` |
| 4.9 | 实现 Falloff 模型 (Constant/Linear/SmoothStep/Quadratic/Gaussian) | 4.1 | `field/falloff.ts` |
| 4.10 | 实现基础 Field 操作 (Add/Scale/Blend) | 4.1 | `field/operations.ts` |
| 4.11 | Field 单元测试 (确定性、Curl 无散度、Falloff 衰减) | 4.2~4.10 | 测试用例 |

**关键验证 — Curl Field：**

```text
Curl Field 产生的流线应该：
  - 连续，无断裂
  - 无明显汇聚点（无散度）
  - 具有流体感
  
验证：
  相同 seed + 相同坐标 → 相同向量（确定性）
  ∂Vx/∂x + ∂Vy/∂y ≈ 0（无散度，数值近似）
```

**验收标准：**

```text
✅ 所有 Field 实现统一 sample(point, context) 接口
✅ Noise 确定性：相同 seed → 相同值
✅ Curl Field 产生连续流线
✅ Falloff 模型正确衰减
✅ 归一化坐标系 [0,1] × [0,1]
✅ Field 不访问 window/document
```

---

### Sprint 5: Composition — Distribution + Density + Focus + Layer

**目标：** 实现 Composition 层核心：4 种 Distribution + Density + Focus + Layer 模型。

| # | 任务 | 依赖 | 产出 |
|---|------|------|------|
| 5.1 | 实现统一 Composition 接口 + CompositionContext | S1 | `composition/types.ts` |
| 5.2 | 实现统一 Distribution 接口 | 5.1 | `composition/distribution/types.ts` |
| 5.3 | 实现 Uniform Distribution | 5.2 | `composition/distribution/uniform.ts` |
| 5.4 | 实现 Random Distribution (Seeded) | 5.2, S1 | `composition/distribution/random.ts` |
| 5.5 | 实现 Radial Distribution | 5.2 | `composition/distribution/radial.ts` |
| 5.6 | 实现 Flow Distribution (沿 Field) | 5.2, S4 | `composition/distribution/flow.ts` |
| 5.7 | 实现 Density 模型 (Scalar Field 控制) | 5.1, S4 | `composition/density.ts` |
| 5.8 | 实现 Focus Field 模型 | 5.1, S4 | `composition/focus.ts` |
| 5.9 | 实现 Layer 模型 (Background/Structure/Flow/Accent) | 5.1 | `composition/layer.ts` |
| 5.10 | 实现 Balance 基础模型 | 5.1 | `composition/balance.ts` |
| 5.11 | 实现 arrange() — 完整 Composition Pipeline | 5.3~5.10 | `composition/arrange.ts` |
| 5.12 | Composition 单元测试 | 5.3~5.11 | 测试用例 |

**验收标准：**

```text
✅ Distribution 输出归一化坐标 [0,1] × [0,1]
✅ Random Distribution 使用 Seeded Random（非 Math.random）
✅ Flow Distribution 正确沿 Field 分布
✅ Density 影响 Geometry 数量/间距/大小
✅ arrange() 输出 SceneLayer[]
✅ 相同 Seed → 相同构图（确定性）
```

---

### Sprint 6: Motion — Flow + Drift + Wave + Breathing + 时间积分

**目标：** 实现 Motion 层核心：4 种 Motion 类型 + Motion Channel + 时间积分。

| # | 任务 | 依赖 | 产出 |
|---|------|------|------|
| 6.1 | 实现统一 Motion 接口 + MotionState + MotionContext | S1 | `motion/types.ts` |
| 6.2 | 实现 Flow Motion (v(t)=F(p,t), p(t+dt)=p(t)+v(t)dt) | 6.1, S4 | `motion/flow.ts` |
| 6.3 | 实现 Drift Motion (缓慢漂移) | 6.1 | `motion/drift.ts` |
| 6.4 | 实现 Wave Motion (正弦/余弦波动) | 6.1 | `motion/wave.ts` |
| 6.5 | 实现 Breathing Motion (呼吸缩放) | 6.1 | `motion/breathing.ts` |
| 6.6 | 实现 Motion Channel (Position/Rotation/Scale/Opacity 独立通道) | 6.1 | `motion/channel.ts` |
| 6.7 | 实现时间积分器 (delta time, 禁止固定 FPS) | 6.1 | `motion/integration.ts` |
| 6.8 | 实现 Reduced Motion 支持 | 6.1 | `motion/reduced.ts` |
| 6.9 | Motion 单元测试 (确定性、delta time 无关性) | 6.2~6.8 | 测试用例 |

**验收标准：**

```text
✅ Flow Motion 沿 Field 正确流动
✅ 不同 delta time → 相同轨迹（时间积分正确性）
✅ Motion Channel 独立控制 position/rotation/scale/opacity
✅ Reduced Motion 时动画幅度降至 0 或停止
✅ 相同 Seed → 相同运动轨迹（确定性）
```

---

### Sprint 7: Material — Color + Opacity + Gradient + Blend

**目标：** 实现 Material 层 MVP：基础颜色 + 透明度 + 渐变 + 混合模式。

| # | 任务 | 依赖 | 产出 |
|---|------|------|------|
| 7.1 | 实现 Color 系统 (sRGB + OKLab/OKLCH 感知插值) | S1 | `material/color.ts` |
| 7.2 | 实现 Opacity 控制 | 7.1 | `material/opacity.ts` |
| 7.3 | 实现 Linear Gradient | 7.1 | `material/gradient.ts` |
| 7.4 | 实现 Radial Gradient | 7.1 | `material/gradient.ts` |
| 7.5 | 实现基础 Blend Mode (normal/multiply/screen/overlay) | 7.1 | `material/blend.ts` |
| 7.6 | 实现 Material 语义映射 (luminosity/softness/transparency) | 7.1 | `material/semantic.ts` |
| 7.7 | 实现 Material Resolver (Semantic → Math) | 7.1~7.6 | `material/resolver.ts` |
| 7.8 | Material 单元测试 | 7.1~7.7 | 测试用例 |

**验收标准：**

```text
✅ OKLab/OKLCH 颜色插值感知均匀
✅ Gradient 正确生成 CanvasGradient 对象
✅ Blend Mode 正确应用到 Canvas2D globalCompositeOperation
✅ 语义参数正确映射到数学参数
✅ Material 不依赖 Renderer
```

---

### Sprint 8: Renderer — Canvas2D + 能力协商

**目标：** 实现 Canvas2D Renderer + Renderer 接口 + 能力协商基础。

| # | 任务 | 依赖 | 产出 |
|---|------|------|------|
| 8.1 | 实现 Renderer 接口 + RendererCapabilities | S1 | `renderer/types.ts` |
| 8.2 | 实现 RenderContext + RenderFrameContext | 8.1 | `renderer/types.ts` |
| 8.3 | 实现 Canvas2DRenderer.initialize() | 8.1 | `renderer/canvas2d.ts` |
| 8.4 | 实现 Canvas2DRenderer.render() — Geometry 绘制 (Path/Line/Curve/Fill/Stroke) | 8.3, S3 | `renderer/canvas2d.ts` |
| 8.5 | 实现 Canvas2DRenderer.render() — Material 应用 (Color/Gradient/Opacity/Blend) | 8.3, S7 | `renderer/canvas2d.ts` |
| 8.6 | 实现 Canvas2DRenderer.render() — Layer 分层渲染 | 8.5, S5 | `renderer/canvas2d.ts` |
| 8.7 | 实现 resize() (不重建 Renderer) | 8.3 | `renderer/canvas2d.ts` |
| 8.8 | 实现 DPR 管理 (effectiveDpr = min(devicePixelRatio, maxDpr)) | 8.3 | `renderer/canvas2d.ts` |
| 8.9 | 实现 pause() / resume() / dispose() | 8.3 | `renderer/canvas2d.ts` |
| 8.10 | 实现基础能力协商 (Capability Negotiation) | 8.1 | `renderer/capabilities.ts` |
| 8.11 | Canvas2D 渲染测试 (视觉回归) | 8.3~8.10 | 测试用例 |

**验收标准：**

```text
✅ Canvas2DRenderer 实现完整 Renderer 接口
✅ 正确绘制 Polyline/Bezier/Spline/Circle/Wave/Ribbon
✅ 正确应用 Color/Gradient/Opacity/Blend
✅ Layer 分层渲染顺序正确
✅ resize() 不重建 Renderer
✅ DPR 限制生效 (maxDpr=2)
✅ 生命周期: initialize → render → pause → resume → dispose
```

---

### Sprint 9: Preset + CSS Variables + 端到端集成

**目标：** 实现 Preset 系统 + CSS Variables + 端到端集成测试 + Demo。

| # | 任务 | 依赖 | 产出 |
|---|------|------|------|
| 9.1 | 实现 Preset Schema 定义 + Validation | S1 | `preset/types.ts` |
| 9.2 | 实现 Preset Registry (register/get/list) | 9.1 | `preset/registry.ts` |
| 9.3 | 实现 Preset Resolver (ID → Version → Config Merge → Validate) | 9.2 | `preset/resolver.ts` |
| 9.4 | 实现 2~3 个内置 Preset (flow / aurora / wave) | 9.3, S3~S7 | `preset/built-in/` |
| 9.5 | 实现 setPreset() 集成到 Runtime | 9.3, S2 | `core/runtime.ts` |
| 9.6 | 实现 CSS Variable 解析器 (--ga-* 读取 + normalization) | S1 | `css/parser.ts` |
| 9.7 | 实现 CSS → Semantic Config 映射 | 9.6 | `css/mapping.ts` |
| 9.8 | 实现 CSS Observer (MutationObserver / getComputedStyle) | 9.6 | `css/observer.ts` |
| 9.9 | 实现 CSS Hot Update (CSS 变化 → 参数更新 → 继续渲染) | 9.8 | `css/observer.ts` |
| 9.10 | CSS 集成到 Runtime | 9.7, S2 | `core/runtime.ts` |
| 9.11 | 实现 Visibility 优化 (IntersectionObserver + Page Visibility) | S8 | `core/visibility.ts` |
| 9.12 | 端到端集成测试 | S1~S10 | 测试用例 |
| 9.13 | 实现 Demo 页面 (HTML + 基础交互) | S1~S10 | `demo/` |
| 9.14 | P0 阶段验收 | 全部 | 验收报告 |

**内置 Preset 定义：**

```text
flow:
  geometry: Ribbon + Wave
  field: Curl Field
  composition: Flow Distribution
  motion: Flow Motion
  material: Gradient + 低 opacity

aurora:
  geometry: Wave + Ribbon
  field: Noise + Curl
  composition: Center Distribution
  motion: Breathing + Drift
  material: Gradient (垂直) + Glow(模拟)

wave:
  geometry: Wave
  field: Noise
  composition: Uniform Distribution
  motion: Wave Motion
  material: Color + Opacity 渐变
```

**验收标准：**

```text
✅ Preset 注册/查询/解析正确
✅ 内置 Preset 可正确渲染
✅ CSS 变量变化 → 参数热更新
✅ 页面不可见时暂停渲染
✅ 元素不可见时暂停渲染
✅ 端到端：createGenerativeArt → preset → render → 可见画面
✅ Demo 页面可在浏览器中展示生成式几何艺术
```

---

### P0 里程碑验收

```text
┌────────────────────────────────────────────────────────────┐
│                    P0 MVP 验收清单                          │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  □ 六层语义模型端到端跑通                                   │
│  □ Geometry: 6 种类型全部实现                               │
│  □ Field: Noise + Curl + 基础 Force                       │
│  □ Composition: 4 种 Distribution                          │
│  □ Motion: 4 种 Motion 类型                                │
│  □ Material: Color + Opacity + Gradient + Blend            │
│  □ Renderer: Canvas2D 完整渲染                              │
│  □ Preset: 基础系统 + 2~3 内置 Preset                      │
│  □ CSS: 8 个核心语义变量                                    │
│  □ Seed: 全链路确定性                                       │
│  □ 生命周期: 完整状态机                                     │
│  □ Performance: DPR 限制 + Visibility 优化                  │
│  □ 测试覆盖率: 核心模块 ≥ 80%                              │
│  □ Demo: 可演示的生成式几何艺术                              │
│  □ Build: ESM + CJS 双格式产出                              │
│  □ SSR: 模块加载安全                                        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

# 4. P1 阶段：完整视觉 + WebGL + 框架适配

## 4.1 阶段目标

```text
补全六层语义模型的完整实现
    ↓
引入 WebGL Renderer 提升渲染性能
    ↓
提供 React / Vue 框架适配
    ↓
达到生产环境可发布质量 → npm 1.0
```

## 4.2 P1 范围

```text
□ WebGL Renderer
□ 完整 Field 体系 (Vortex / Magnetic / Gravity / Composite / Transform)
□ 完整 Composition (Poisson / Spiral / Cluster / Edge / Center / Golden / Organic)
□ 完整 Motion (Orbit / Pulse / Rotation / Parallax / Morph)
□ 完整 Material (Glow / Blur / Grain / Noise / Shadow / Depth)
□ Material Stack 组合模型
□ 完整 Preset 体系 + 8 内置 Preset
□ 完整 CSS Variables (全部 --ga-* 变量)
□ Plugin 系统完善
□ React / Vue Adapter
□ Performance: 自适应降级
```

## 4.3 Sprint 拆分

### Sprint 10: Field 完整实现

| # | 任务 | 依赖 | 产出 |
|---|------|------|------|
| 10.1 | 实现 Gravity Field (距离衰减 F=strength/r²) | P0 | `field/force.ts` |
| 10.2 | 实现 Vortex Field (旋转流动) | P0 | `field/force.ts` |
| 10.3 | 实现 Magnetic Field | 10.1 | `field/force.ts` |
| 10.4 | 实现 FlowField | P0 | `field/flow.ts` |
| 10.5 | 实现 CompositeField (多场叠加) | P0 | `field/composite.ts` |
| 10.6 | 实现 TransformField (场的空间变换) | P0 | `field/transform.ts` |
| 10.7 | 实现完整 Field 操作集 (Subtract/Multiply/Normalize/Clamp/Rotate/Invert) | P0 | `field/operations.ts` |
| 10.8 | 实现 Field Mask | 10.5 | `field/mask.ts` |
| 10.9 | Domain Warping Noise | P0 | `field/noise.ts` |
| 10.10 | Field 完整测试 | 10.1~10.9 | 测试用例 |

---

### Sprint 11: Composition 完整实现

| # | 任务 | 依赖 | 产出 |
|---|------|------|------|
| 11.1 | 实现 Poisson Disk Distribution | P0 | `composition/distribution/poisson.ts` |
| 11.2 | 实现 Spiral Distribution | P0 | `composition/distribution/spiral.ts` |
| 11.3 | 实现 Cluster Distribution | P0 | `composition/distribution/cluster.ts` |
| 11.4 | 实现 Edge Distribution | P0 | `composition/distribution/edge.ts` |
| 11.5 | 实现 Center Distribution | P0 | `composition/distribution/center.ts` |
| 11.6 | 实现 Golden Distribution | P0 | `composition/distribution/golden.ts` |
| 11.7 | 实现 Organic Distribution (受控随机) | P0 | `composition/distribution/organic.ts` |
| 11.8 | 实现 Grid Distribution | P0 | `composition/distribution/grid.ts` |
| 11.9 | 实现 Negative Space + Protected Region | P0 | `composition/negative.ts` |
| 11.10 | 实现完整 Symmetry 模型 (Horizontal/Vertical/Radial/Mirror) | P0 | `composition/symmetry.ts` |
| 11.11 | 实现完整 Hierarchy (Primary/Secondary/Tertiary) | P0 | `composition/hierarchy.ts` |
| 11.12 | 实现完整 Depth 模型 (z-depth + fog) | P0 | `composition/depth.ts` |
| 11.13 | 实现完整 Rhythm 模型 | P0 | `composition/rhythm.ts` |
| 11.14 | Composition 完整测试 | 11.1~11.13 | 测试用例 |

---

### Sprint 12: Motion 完整实现

| # | 任务 | 依赖 | 产出 |
|---|------|------|------|
| 12.1 | 实现 Orbit Motion (轨道运动) | P0 | `motion/orbit.ts` |
| 12.2 | 实现 Pulse Motion (脉冲) | P0 | `motion/pulse.ts` |
| 12.3 | 实现 Rotation Motion (旋转) | P0 | `motion/rotation.ts` |
| 12.4 | 实现 Parallax Motion (视差) | P0 | `motion/parallax.ts` |
| 12.5 | 实现 Morph Motion (变形) | P0 | `motion/morph.ts` |
| 12.6 | 实现 Motion Composition (Priority + Weight + Blending) | P0 | `motion/compose.ts` |
| 12.7 | 完善 Reduced Motion (细粒度控制) | P0 | `motion/reduced.ts` |
| 12.8 | Motion 完整测试 | 12.1~12.7 | 测试用例 |

---

### Sprint 13: Material 完整实现

| # | 任务 | 依赖 | 产出 |
|---|------|------|------|
| 13.1 | 实现 Glow 效果 | P0 | `material/glow.ts` |
| 13.2 | 实现 Blur 效果 | P0 | `material/blur.ts` |
| 13.3 | 实现 Grain 效果 | P0 | `material/grain.ts` |
| 13.4 | 实现 Noise 纹理效果 | P0 | `material/noise.ts` |
| 13.5 | 实现 Shadow 效果 | P0 | `material/shadow.ts` |
| 13.6 | 实现 Conic Gradient | P0 | `material/gradient.ts` |
| 13.7 | 实现 Path Gradient (沿路径渐变) | P0 | `material/gradient.ts` |
| 13.8 | 实现 Depth Gradient (深度渐变) | P0 | `material/gradient.ts` |
| 13.9 | 实现 Field Gradient (场驱动渐变) | 13.8, S10 | `material/gradient.ts` |
| 13.10 | 实现 Material Stack (多层材质组合) | 13.1~13.9 | `material/stack.ts` |
| 13.11 | 实现完整 Blend Mode 集 | P0 | `material/blend.ts` |
| 13.12 | Material 完整测试 | 13.1~13.11 | 测试用例 |

---

### Sprint 14: WebGL Renderer

| # | 任务 | 依赖 | 产出 |
|---|------|------|------|
| 14.1 | 实现 WebGLRenderer 骨架 (initialize/resize/dispose) | P0 | `renderer/webgl.ts` |
| 14.2 | 实现 WebGL Shader 基础设施 (vertex/fragment shader 管理) | 14.1 | `renderer/webgl/shader.ts` |
| 14.3 | 实现 Geometry → WebGL Buffer 转换 | 14.2, S3 | `renderer/webgl/geometry.ts` |
| 14.4 | 实现 WebGL 基础绘制 (Line/Curve/Fill/Stroke) | 14.3 | `renderer/webgl/draw.ts` |
| 14.5 | 实现 WebGL Gradient 渲染 | 14.4 | `renderer/webgl/gradient.ts` |
| 14.6 | 实现 WebGL Blend Mode | 14.4 | `renderer/webgl/blend.ts` |
| 14.7 | 实现 WebGL Instancing (批量渲染) | 14.4 | `renderer/webgl/instancing.ts` |
| 14.8 | 实现 WebGL Renderer 自动选择 (auto → WebGPU → WebGL → Canvas2D) | 14.1 | `renderer/selector.ts` |
| 14.9 | 实现 Renderer Fallback (WebGL 失败 → Canvas2D) | 14.8 | `renderer/selector.ts` |
| 14.10 | WebGL 渲染测试 + 语义等价性验证 | 14.1~14.9 | 测试用例 |

**语义等价性验证：**

```text
同一 Preset + 同一 Seed:
  Canvas2D 渲染结果 ≈ WebGL 渲染结果
  
  "≈" 定义:
  - Composition 一致（Geometry 位置/数量/层级）
  - Color intent 一致（颜色感知一致）
  - Motion intent 一致（运动方向/速度）
  - Material intent 一致（质感意图一致）
```

---

### Sprint 15: 完整 Preset + CSS

| # | 任务 | 依赖 | 产出 |
|---|------|------|------|
| 15.1 | 补全 8 个内置 Preset (flow/aurora/ribbon/organic/wave/orbital/mesh/atmosphere) | S9, S10~S13 | `preset/built-in/` |
| 15.2 | 实现 Preset 版本化 (MAJOR.MINOR.PATCH 解析) | P0 | `preset/version.ts` |
| 15.3 | 实现 Preset Validation + Constraints | P0 | `preset/validation.ts` |
| 15.4 | 实现 Preset Performance Profile (light/balanced/rich/experimental) | P0 | `preset/performance.ts` |
| 15.5 | 实现 Preset Capability Negotiation | 15.4, S14 | `preset/negotiation.ts` |
| 15.6 | 补全 CSS Variables (所有 --ga-* 变量) | P0 | `css/variables.ts` |
| 15.7 | 实现 CSS Value 完整 Normalization + Validation | P0 | `css/parser.ts` |
| 15.8 | 实现 CSS 响应式 (Media Query 联动) | P0 | `css/responsive.ts` |
| 15.9 | Preset + CSS 完整测试 | 15.1~15.8 | 测试用例 |

---

### Sprint 16: Plugin 系统 + 框架适配

| # | 任务 | 依赖 | 产出 |
|---|------|------|------|
| 16.1 | 实现 Plugin Contract (name/version/install/uninstall) | P0 | `plugin/types.ts` |
| 16.2 | 实现 Plugin Registry | 16.1 | `plugin/registry.ts` |
| 16.3 | 实现 registerGeometry / registerField / registerPreset 等注册 API | 16.2 | `plugin/register.ts` |
| 16.4 | Plugin 生命周期管理 | 16.2 | `plugin/lifecycle.ts` |
| 16.5 | 实现 React Adapter (`GenerativeArtCanvas` 组件) | 16.3, P0 | `adapter/react/` |
| 16.6 | 实现 Vue Adapter (`GenerativeArt` 组件) | 16.3, P0 | `adapter/vue/` |
| 16.7 | 实现 Auto Init 入口 (`./auto`) | P0 | `adapter/auto/` |
| 16.8 | React / Vue Adapter 测试 | 16.5, 16.6 | 测试用例 |
| 16.9 | Plugin 系统测试 | 16.1~16.4 | 测试用例 |

---

### Sprint 17: 性能优化 + P1 集成验收

| # | 任务 | 依赖 | 产出 |
|---|------|------|------|
| 17.1 | 实现 Performance Tier 系统 (Tier 0~3) | P0 | `performance/tier.ts` |
| 17.2 | 实现设备性能检测 + 初始 Tier 分配 | 17.1 | `performance/detect.ts` |
| 17.3 | 实现运行时 FPS 监控 | 17.1 | `performance/monitor.ts` |
| 17.4 | 实现动态降级 / 升级 | 17.2, 17.3 | `performance/adaptive.ts` |
| 17.5 | 实现 Render Quality 自适应 | 17.1 | `performance/quality.ts` |
| 17.6 | P1 端到端集成测试 | S10~S17 | 测试用例 |
| 17.7 | P1 Demo 页面 (展示所有 8 个 Preset + 交互) | S10~S17 | `demo/` |
| 17.8 | 性能基准测试 (各 Tier 下 FPS / 内存) | 17.1~17.5 | 性能报告 |
| 17.9 | P1 阶段验收 | 全部 | 验收报告 |

### P1 里程碑验收

```text
┌────────────────────────────────────────────────────────────┐
│                    P1 完整视觉 验收清单                      │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  □ 完整 Field: 8 种 Field 类型                             │
│  □ 完整 Composition: 12 种 Distribution                    │
│  □ 完整 Motion: 9 种 Motion 类型                           │
│  □ 完整 Material: Glow/Blur/Grain/Noise/Shadow + Stack     │
│  □ WebGL Renderer + 语义等价性                              │
│  □ Renderer 自动选择 + Fallback                             │
│  □ 8 个内置 Preset 全部可用                                 │
│  □ 完整 CSS Variables                                      │
│  □ Plugin 系统可用                                         │
│  □ React Adapter 可用                                      │
│  □ Vue Adapter 可用                                        │
│  □ Auto Init 可用                                          │
│  □ 自适应降级可用                                           │
│  □ 测试覆盖率: 全模块 ≥ 80%                                │
│  □ npm publish: @regalpine/generative-art@1.0.0            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

# 5. P2 阶段：大规模场景 + WebGPU + 产品化

## 5.1 阶段目标

```text
引入 WebGPU 实现大规模场景渲染
    ↓
GPU Compute 加速 Field / Motion 计算
    ↓
Worker Thread 分离计算与渲染
    ↓
构建生态工具 + Marketplace 支持
```

## 5.2 P2 范围

```text
□ WebGPU Renderer
□ Offscreen Canvas
□ Worker Thread 计算
□ GPU Compute for Field / Motion
□ Advanced Compositing
□ Web Component Adapter
□ 性能分析工具
□ Preset Marketplace 支持
```

## 5.3 Sprint 拆分

### Sprint 18: WebGPU Renderer

| # | 任务 | 依赖 | 产出 |
|---|------|------|------|
| 18.1 | WebGPU 能力检测 + 特性调研 | P1 | 调研报告 |
| 18.2 | 实现 WebGPURenderer 骨架 | 18.1 | `renderer/webgpu.ts` |
| 18.3 | 实现 WebGPU Pipeline (shader/vertex/fragment) | 18.2 | `renderer/webgpu/pipeline.ts` |
| 18.4 | 实现 Geometry → GPU Buffer | 18.3 | `renderer/webgpu/geometry.ts` |
| 18.5 | 实现 WebGPU 批量渲染 (Compute Pass + Render Pass) | 18.4 | `renderer/webgpu/batch.ts` |
| 18.6 | 实现 WebGPU Material 渲染 | 18.5 | `renderer/webgpu/material.ts` |
| 18.7 | WebGPU Fallback → WebGL → Canvas2D | 18.2 | `renderer/selector.ts` |
| 18.8 | WebGPU 渲染测试 + 语义等价性验证 | 18.2~18.7 | 测试用例 |

---

### Sprint 19: 并行计算 + Worker

| # | 任务 | 依赖 | 产出 |
|---|------|------|------|
| 19.1 | 实现 Offscreen Canvas 支持 | P1 | `renderer/offscreen.ts` |
| 19.2 | 实现 Worker Thread 架构 (计算与渲染分离) | 19.1 | `worker/` |
| 19.3 | Field 计算迁移到 Worker | 19.2, S10 | `worker/field.ts` |
| 19.4 | Motion 计算迁移到 Worker | 19.2, S12 | `worker/motion.ts` |
| 19.5 | 实现 GPU Compute for Field (WebGPU Compute Pass) | 18.5, S10 | `renderer/webgpu/compute-field.ts` |
| 19.6 | 实现 GPU Compute for Motion | 18.5, S12 | `renderer/webgpu/compute-motion.ts` |
| 19.7 | Worker 通信协议定义 | 19.2 | `worker/protocol.ts` |
| 19.8 | Worker + GPU Compute 性能基准测试 | 19.1~19.7 | 性能报告 |

---

### Sprint 20: Advanced Compositing + Web Component

| # | 任务 | 依赖 | 产出 |
|---|------|------|------|
| 20.1 | 实现 Advanced Compositing (multi-pass / framebuffer) | P1 | `renderer/compositing.ts` |
| 20.2 | 实现 Post-processing Pipeline (bloom / DOF / vignette) | 20.1 | `renderer/postprocess.ts` |
| 20.3 | 实现 Web Component Adapter | P1, 16.3 | `adapter/web-component/` |
| 20.4 | Web Component 测试 | 20.3 | 测试用例 |

---

### Sprint 21: 工具链 + 生态 + P2 验收

| # | 任务 | 依赖 | 产出 |
|---|------|------|------|
| 21.1 | 实现性能分析工具 (FPS / draw call / geometry count 面板) | P1 | `tools/perf-panel/` |
| 21.2 | 实现 Preset Schema 验证工具 (CLI) | P1 | `tools/preset-validator/` |
| 21.3 | 实现 Preset Marketplace 协议 / API 定义 | P1 | `marketplace/` |
| 21.4 | 实现 Preset 加载器 (远程加载 + 缓存) | 21.3 | `preset/loader.ts` |
| 21.5 | 编写完整 API 文档 | P1 | 文档 |
| 21.6 | 编写 Plugin 开发指南 | P1 | 文档 |
| 21.7 | 编写 Preset 开发指南 | P1 | 文档 |
| 21.8 | P2 Demo (大规模场景 + 多 Preset 切换) | S18~S21 | `demo/` |
| 21.9 | P2 阶段验收 | 全部 | 验收报告 |

### P2 里程碑验收

```text
┌────────────────────────────────────────────────────────────┐
│                    P2 规模化 验收清单                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  □ WebGPU Renderer 可用 + Fallback 链完整                  │
│  □ Offscreen Canvas 可用                                    │
│  □ Worker Thread 计算分离                                   │
│  □ GPU Compute for Field / Motion                           │
│  □ Advanced Compositing                                     │
│  □ Web Component Adapter                                    │
│  □ 性能分析工具                                             │
│  □ Preset Marketplace 协议定义                              │
│  □ 10,000+ Geometry 场景 ≥ 30fps                           │
│  □ npm publish: @regalpine/generative-art@2.0.0            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

# 6. 跨阶段基础设施

## 6.1 持续集成

```text
每个 Sprint 必须:
  ✅ TypeScript strict 编译通过
  ✅ ESLint 通过
  ✅ 单元测试通过
  ✅ Build 通过 (ESM + CJS)
  ✅ 新增模块测试覆盖率 ≥ 80%
```

## 6.2 文档维护

```text
每个 Sprint 必须:
  ✅ 更新 API 文档
  ✅ 更新 CHANGELOG
  ✅ 新增模块附带 JSDoc
```

## 6.3 视觉回归测试

```text
P0 开始建立:
  基准截图 → 每次构建对比 → 像素差异 < 阈值

P1 扩展:
  跨 Renderer 语义等价性截图对比
```

## 6.4 性能基准

```text
每个 Sprint 必须:
  ✅ 无性能退化（或明确记录 + 计划修复）
  
P0 基准:
  1000 Geometry @ Canvas2D ≥ 30fps (中端设备)

P1 基准:
  5000 Geometry @ WebGL ≥ 60fps

P2 基准:
  10000+ Geometry @ WebGPU ≥ 60fps
```

---

# 7. 风险管理

## 7.1 技术风险

| 风险 | 影响 | 概率 | 缓解策略 |
|------|------|------|----------|
| Arc-Length 参数化精度问题 | Geometry 采样不均匀 | 中 | 提前 P0 Sprint 3 验证，预留自适应步长方案 |
| Curl Field 数值稳定性 | 流线出现汇聚/发散 | 中 | 数值微分步长调优 + 单元测试覆盖 |
| WebGL 语义等价性 | 与 Canvas2D 视觉差异大 | 高 | 建立视觉回归测试，逐功能对比 |
| WebGPU 浏览器兼容性 | P2 时 WebGPU 未广泛支持 | 中 | Fallback 链 (WebGPU → WebGL → Canvas2D) |
| Worker 通信开销 | 数据传输延迟抵消并行收益 | 中 | Transferable Objects + 数据序列化优化 |
| OKLab 颜色空间实现精度 | 颜色插值不均匀 | 低 | 参考实现 + 视觉对比测试 |

## 7.2 进度风险

| 风险 | 影响 | 缓解策略 |
|------|------|----------|
| P0 范围蔓延 | 延迟 MVP | 严格控制 MVP 范围，非 MVP 功能推入 P1 |
| WebGL 实现复杂度超预期 | P1 延期 | P1 初期做技术 Spike，评估工作量 |
| 框架适配兼容性问题 | P1 延期 | 核心包与 Adapter 分离，Adapter 可独立发布 |

## 7.3 缓解原则

```text
1. 每个 Sprint 开始做技术 Spike（高风险任务优先验证）
2. 核心路径 P0 必须扎实，不为 P1/P2 埋架构债
3. 每个 Sprint 结束做 Retro，及时调整计划
4. 非关键路径功能可推迟，不阻塞里程碑
```

---

# 8. 质量门禁

## 8.1 代码质量

```text
每个 PR 必须:
  ✅ TypeScript strict 编译通过
  ✅ ESLint 无 error
  ✅ 新增代码测试覆盖 ≥ 80%
  ✅ 无 console.log / debugger
  ✅ JSDoc 覆盖所有 public API
```

## 8.2 架构一致性

```text
每个模块必须:
  ✅ 遵循六层语义模型边界（不越层依赖）
  ✅ 通过 Context 获取运行时信息（不直接访问全局）
  ✅ 支持 Seed 确定性（不使用 Math.random）
  ✅ SSR 安全（模块加载不访问浏览器 API）
```

## 8.3 性能门禁

```text
P0: 1000 Geometry @ Canvas2D ≥ 30fps
P1: 5000 Geometry @ WebGL ≥ 60fps
P2: 10000+ Geometry @ WebGPU ≥ 60fps

每次发版前执行性能基准测试
```

## 8.4 发版检查清单

```text
□ 所有测试通过
□ 性能基准达标
□ 视觉回归测试通过
□ API 文档更新
□ CHANGELOG 更新
□ Breaking Changes 记录
□ 升级指南（如有 Breaking Changes）
□ npm pack 验证
□ 安装测试（新项目中 npm install + 基础使用）
```

---

# 附录: Sprint 依赖关系总图

```text
S0 (工程化)
 │
 ├── S1 (Core: Seed + 类型 + 生命周期)
 │    │
 │    ├── S2 (Core: 配置 + 运行时)
 │    │    │
 │    │    └──────────────────────────────────────┐
 │    │                                           │
 │    ├── S3 (Geometry)                           │
 │    │    │                                       │
 │    │    ├── S5 (Composition) ──┐               │
 │    │    │                      │               │
 │    │    └── S8 (Canvas2D) ─────┤               │
 │    │                           │               │
 │    ├── S4 (Field) ─────────────┤               │
 │    │    │                      │               │
 │    │    ├── S6 (Motion) ───────┤               │
 │    │    │                      │               │
 │    │    └── S7 (Material) ─────┤               │
 │    │                           │               │
 │    └───────────────────────────┤               │
 │                                │               │
 │    S9 (Preset + CSS + 集成) ◄──┘───────────────┘
 │    │
 │    ═══════════ P0 完成 ═══════════
 │    │
 │    ├── S10 (Field 完整)
 │    ├── S11 (Composition 完整)
 │    ├── S12 (Motion 完整)
 │    ├── S13 (Material 完整)
 │    │    │
 │    │    ├── S14 (WebGL)
 │    │    │    │
 │    ├── S15 (完整 Preset + CSS)
 │    │    │
 │    ├── S16 (Plugin + 框架适配)
 │    │    │
 │    └── S17 (性能 + P1 集成)
 │         │
 │         ═══════════ P1 完成 ═══════════
 │         │
 │         ├── S18 (WebGPU)
 │         ├── S19 (Worker + GPU Compute)
 │         ├── S20 (Advanced + Web Component)
 │         └── S21 (工具链 + 生态)
 │              │
 │              ═══════════ P2 完成 ═══════════
```

---

> **End of Document**  
> Generative Geometric Art Engine 分阶段实现计划 V1.0  
> Based on Architecture Design V1.0
