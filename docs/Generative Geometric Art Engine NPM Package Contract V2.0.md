# Generative Geometric Art Engine
## NPM Package Contract V2.0

**文档类型：** Product & Engineering Specification  
**版本：** V2.0  
**状态：** Converged  
**技术基线：** TypeScript + ESM + Browser  
**核心包：** `@regalpine/generative-art`

---

# 1. 文档目的

V2.0 将 Generative Geometric Art Engine 从核心架构规范进一步收敛为一个可以：

- 安装
- 引入
- 配置
- 扩展
- 构建
- 测试
- 发布
- 升级

的标准 NPM 产品。

V2.0 不改变 V1.x 已确定的核心语义模型：

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

也不增加新的核心语义层。

V2.0 的核心目标是：

> **把 Generative Art Engine 从“架构设计”变成“可交付的软件包”。**

---

# 2. 产品定位

## 2.1 正式定位

Generative Geometric Art Engine 是一个：

> **面向 Web 应用的生产级生成式几何视觉引擎。**

它通过 NPM Package 向业务应用提供动态几何艺术视觉能力。

---

## 2.2 产品边界

产品负责：

```text
Geometry Generation
        ↓
Field Influence
        ↓
Composition
        ↓
Motion
        ↓
Material
        ↓
Rendering
```

业务应用负责：

```text
Application
├── Business UI
├── Business State
├── Authentication
├── Routing
├── Data
└── Generative Art Integration
```

引擎不负责：

- 业务 UI
- 页面路由
- 用户认证
- 数据请求
- CMS
- 设计器
- 在线艺术社区
- AI 艺术生成
- 云端渲染平台

---

# 3. 核心 NPM Package

正式核心包：

```text
@regalpine/generative-art
```

安装：

```bash
npm install @regalpine/generative-art
```

或：

```bash
pnpm add @regalpine/generative-art
```

或：

```bash
yarn add @regalpine/generative-art
```

---

# 4. Package Architecture

V2.0 推荐采用：

```text
@regalpine/generative-art
│
├── Core Runtime
├── Geometry
├── Field
├── Composition
├── Motion
├── Material
├── Preset
├── Theme
├── Renderer
├── Configuration
├── CSS Integration
└── Plugin System
```

单包模式下：

```text
@regalpine/generative-art
```

内部保持模块化。

未来需要扩大生态时再拆分：

```text
@regalpine/generative-core
@regalpine/generative-geometry
@regalpine/generative-renderer
@regalpine/generative-presets
@regalpine/generative-react
@regalpine/generative-vue
```

---

# 5. Dependency Boundary

核心包应尽可能保持轻依赖。

原则：

```text
Application
     │
     ▼
generative-art
     │
     ├── Core
     ├── Geometry
     ├── Field
     ├── Composition
     ├── Motion
     ├── Material
     └── Canvas Renderer
```

禁止核心运行时强依赖：

- React
- Vue
- Three.js
- p5.js
- LangChain
- AI SDK
- DOM UI Framework

---

# 6. Runtime Dependency Policy

推荐：

```json
{
  "dependencies": {},
  "peerDependencies": {},
  "optionalDependencies": {}
}
```

核心运行时尽可能：

> **Zero Runtime Dependency**

第三方依赖如果必须存在，应优先：

```text
devDependencies
```

而不是：

```text
dependencies
```

---

# 7. Public Entry Point

默认入口：

```ts
import {
  createGenerativeArt
} from '@regalpine/generative-art'
```

示例：

```ts
const art = createGenerativeArt({
  target: '#hero',
  preset: 'aurora',
  theme: 'aurora'
})

art.start()
```

---

# 8. Auto Initialization Entry

提供：

```text
@regalpine/generative-art/auto
```

使用：

```ts
import '@regalpine/generative-art/auto'
```

HTML：

```html
<div
  data-generative-art
  data-art-preset="flow"
  data-art-theme="aurora">
</div>
```

Auto Runtime 自动：

```text
DOM Ready
   ↓
Scan Elements
   ↓
Read data-art-*
   ↓
Resolve CSS
   ↓
Create Instance
   ↓
Initialize
   ↓
Start
```

---

# 9. Public API

## 9.1 createGenerativeArt

```ts
interface CreateGenerativeArtOptions {
  target: string | HTMLElement
  preset?: string
  theme?: string
  renderer?: RendererPreference
  seed?: string | number
  semantic?: Partial<SemanticArtConfig>
  config?: Partial<GenerativeArtConfig>
}
```

：

```ts
function createGenerativeArt(
  options: CreateGenerativeArtOptions
): GenerativeArt
```

---

# 10. GenerativeArt Contract

```ts
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

# 11. API Stability

公共 API 分为三个等级。

## 11.1 Stable

长期兼容：

```text
createGenerativeArt()
GenerativeArt
Preset
Theme
Renderer
SemanticArtConfig
```

---

## 11.2 Experimental

实验性 API：

```text
Motion Graph
GPU Motion
Morph
WebGPU
Advanced Interaction
```

必须显式标记：

```ts
/** @experimental */
```

---

## 11.3 Internal

内部 API：

```text
InternalScene
InternalScheduler
InternalRendererContext
InternalGeometryBuffer
```

不得作为公共 API 暴露。

---

# 12. TypeScript Contract

包必须提供完整 TypeScript 类型声明：

```text
dist/
├── index.js
├── index.d.ts
├── auto.js
├── auto.d.ts
└── ...
```

禁止要求用户额外安装：

```text
@types/...
```

---

# 13. Configuration Contract

最终配置结构：

```ts
interface GenerativeArtConfig {

  preset?: string

  theme?: string

  renderer?: RendererPreference

  seed?: string | number

  semantic?: SemanticArtConfig

  geometry?: GeometryConfig

  field?: FieldConfig

  composition?: CompositionConfig

  motion?: MotionConfig

  material?: MaterialConfig

  palette?: PaletteConfig

  runtime?: RuntimeConfig
}
```

---

# 14. Configuration Resolution

配置优先级固定：

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
runtime.update()
```

不得在后续版本中随意改变该顺序。

---

# 15. Preset Distribution

MVP Preset 随核心包提供：

```text
flow
aurora
ribbon
organic
wave
orbital
mesh
atmosphere
```

调用：

```ts
createGenerativeArt({
  target: '#hero',
  preset: 'aurora'
})
```

---

# 16. Preset Independence

Preset 不得绑定：

```text
Canvas2D
WebGL
WebGPU
React
Vue
```

Preset 只描述：

```text
Geometry
Field
Composition
Motion
Material
Palette
```

Renderer 负责解释这些语义。

---

# 17. Theme Distribution

Theme 与 Preset 分离。

例如：

```text
Preset:
    aurora

Theme:
    aurora
    midnight
    monochrome
    ocean
    sunset
```

因此：

```ts
{
  preset: 'flow',
  theme: 'midnight'
}
```

是合法组合。

---

# 18. CSS Distribution

提供：

```text
@regalpine/generative-art/styles.css
```

CSS 主要用于：

```text
--ga-*
```

变量定义。

示例：

```css
.hero {
  --ga-density: 0.7;
  --ga-complexity: 0.55;
  --ga-energy: 0.8;
  --ga-softness: 0.65;
}
```

CSS 不承担：

- Geometry Generation
- Field Calculation
- Motion Simulation
- Rendering

---

# 19. CSS API Boundary

允许：

```css
--ga-density
--ga-energy
--ga-glow
--ga-opacity
--ga-speed
```

不允许将数学实现暴露成：

```css
--ga-spline-control-point-1
--ga-noise-octave-7
--ga-perlin-gradient-vector
```

原则：

> **CSS API 面向设计语义，而不是算法内部实现。**

---

# 20. Data Attribute Contract

标准属性：

```text
data-generative-art
data-art-preset
data-art-theme
data-art-renderer
data-art-seed
```

例如：

```html
<div
  data-generative-art
  data-art-preset="flow"
  data-art-theme="aurora"
  data-art-seed="homepage-hero">
</div>
```

---

# 21. Tree Shaking

核心包必须支持 Tree Shaking。

推荐：

```ts
import {
  createGenerativeArt
} from '@regalpine/generative-art'
```

而不是强制加载所有：

```text
Presets
Renderers
Adapters
Plugins
```

---

# 22. Renderer Loading

Renderer 应允许按需加载。

例如：

```ts
import {
  createGenerativeArt
} from '@regalpine/generative-art'
```

默认：

```text
Canvas2D
```

高级环境：

```text
WebGL
WebGPU
```

可以通过扩展包或动态加载提供。

---

# 23. Renderer Preference

```ts
type RendererPreference =
  | 'auto'
  | 'canvas2d'
  | 'webgl'
  | 'webgpu'
```

默认：

```text
auto
```

选择：

```text
WebGPU
 ↓
WebGL
 ↓
Canvas2D
 ↓
Static
```

最终选择必须经过 Capability Check。

---

# 24. ESM

正式发布格式：

```text
ESM
```

推荐：

```json
{
  "type": "module"
}
```

主要目标：

- Vite
- Rollup
- Webpack
- Rspack
- esbuild
- modern bundlers

---

# 25. CJS Compatibility

V2.0 不建议继续扩大 CommonJS 兼容层。

如果构建工具生态确实需要，则提供：

```text
dist/index.cjs
```

通过：

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
}
```

但产品主路径仍然：

```text
ESM-first
```

---

# 26. Package Exports

推荐：

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },

    "./auto": {
      "types": "./dist/auto.d.ts",
      "import": "./dist/auto.js"
    },

    "./styles.css": "./dist/styles.css",

    "./react": {
      "types": "./dist/react.d.ts",
      "import": "./dist/react.js"
    },

    "./vue": {
      "types": "./dist/vue.d.ts",
      "import": "./dist/vue.js"
    },

    "./web-component": {
      "types": "./dist/web-component.d.ts",
      "import": "./dist/web-component.js"
    },

    "./package.json": "./package.json"
  }
}
```

---

# 27. Browser Support

V2.0 目标：

```text
Chrome
Edge
Firefox
Safari
```

优先支持：

```text
现代浏览器
```

不以旧版 IE 等历史浏览器为目标。

---

# 28. Browser Capability Model

启动时检测：

```text
Canvas
WebGL
WebGPU
OffscreenCanvas
DevicePixelRatio
ResizeObserver
IntersectionObserver
```

Capability 不满足时：

```text
WebGPU
 ↓
WebGL
 ↓
Canvas2D
 ↓
Static
```

---

# 29. SSR Compatibility

核心包必须 SSR-safe。

禁止：

```ts
window
document
navigator
canvas
```

在 module initialization 阶段直接访问。

错误：

```ts
const canvas = document.createElement('canvas')
```

正确：

```ts
function createRenderer() {
  if (typeof document === 'undefined') {
    return undefined
  }

  // create renderer
}
```

---

# 30. Framework Integration

核心包不依赖框架。

提供：

```text
Core
├── React Adapter
├── Vue Adapter
└── Web Component Adapter
```

---

# 31. React Adapter

入口：

```text
@regalpine/generative-art/react
```

示例：

```tsx
<GenerativeArt
  preset="aurora"
  theme="midnight"
/>
```

React Adapter 负责：

```text
mount
update
resize
unmount
```

不重复实现核心引擎。

---

# 32. Vue Adapter

入口：

```text
@regalpine/generative-art/vue
```

示例：

```vue
<GenerativeArt
  preset="aurora"
  theme="midnight"
/>
```

生命周期映射：

```text
onMounted
onUpdated
onBeforeUnmount
```

---

# 33. Web Component Adapter

入口：

```text
@regalpine/generative-art/web-component
```

示例：

```html
<generative-art
  preset="aurora"
  theme="midnight">
</generative-art>
```

对应：

```text
HTMLElement
Custom Elements
Shadow DOM
```

是否使用 Shadow DOM 由 Adapter 决定，不影响核心 Runtime。

---

# 34. Plugin Contract

插件系统用于扩展：

```text
Geometry
Field
Composition
Motion
Material
Preset
Renderer
```

核心接口：

```ts
interface Plugin {

  readonly name: string

  readonly version: string

  install(
    context: PluginContext
  ): void

  uninstall?(
    context: PluginContext
  ): void
}
```

---

# 35. PluginContext

```ts
interface PluginContext {

  geometry: GeometryRegistry

  fields: FieldRegistry

  compositions: CompositionRegistry

  motions: MotionRegistry

  materials: MaterialRegistry

  presets: PresetRegistry

  renderers: RendererRegistry
}
```

---

# 36. Plugin Isolation

插件不得：

- 修改核心 Runtime 状态
- 修改全局配置
- 覆盖内置 API
- 修改其他插件内部状态

默认注册策略：

```text
register
    ↓
name conflict?
    ├── yes → reject
    └── no  → register
```

除非明确使用：

```ts
override: true
```

---

# 37. Preset Plugin

第三方可以提供：

```ts
registerPreset(...)
```

例如：

```text
@company/generative-presets
```

业务应用：

```ts
import {
  registerPreset
} from '@regalpine/generative-art'

registerPreset(myPreset)
```

---

# 38. Geometry Plugin

可以扩展：

```text
Bezier
Spline
Ribbon
Mesh
```

以及新的几何类型：

```text
CustomGeometry
```

但必须实现标准：

```ts
interface Geometry {
  readonly type: string

  update(
    context: GeometryUpdateContext
  ): void

  bounds(): Bounds

  sample(t: number): Point

  dispose(): void
}
```

---

# 39. Field Plugin

扩展：

```text
VectorField
NoiseField
ForceField
```

接口保持：

```ts
interface Field {
  sample(
    point: Point,
    context: FieldContext
  ): Vector
}
```

---

# 40. Motion Plugin

扩展：

```text
Motion
```

必须遵守：

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

# 41. Renderer Plugin

Renderer 可以作为独立扩展。

例如：

```text
@regalpine/generative-webgl
@regalpine/generative-webgpu
```

核心包只依赖 Renderer Contract。

---

# 42. Runtime Update

支持：

```ts
art.update({
  semantic: {
    density: 0.8,
    energy: 0.6
  }
})
```

Runtime 根据参数决定：

```text
Hot Update
    或
Scene Rebuild
```

用户不需要了解内部重建机制。

---

# 43. Lifecycle

完整生命周期：

```text
CREATED
   ↓
INITIALIZED
   ↓
READY
   ↓
RUNNING
   ↕
PAUSED
   ↓
STOPPED
   ↓
DESTROYED
```

禁止：

```text
DESTROYED → RUNNING
```

---

# 44. Auto Initialization Lifecycle

Auto 模式：

```text
DOM Ready
   ↓
Element Discovery
   ↓
Configuration Resolution
   ↓
Instance Creation
   ↓
Start
```

DOM 被移除：

```text
MutationObserver
      ↓
Detect Removed Element
      ↓
destroy()
```

避免：

```text
Detached Canvas
Animation Loop Leak
Memory Leak
```

---

# 45. Resize

优先使用：

```text
ResizeObserver
```

处理：

```text
CSS Width
CSS Height
DPR
Canvas Resolution
Viewport
```

内部：

```text
CSS Size
   ×
DPR
   ↓
Render Resolution
```

---

# 46. Device Pixel Ratio

必须支持：

```ts
window.devicePixelRatio
```

并限制最大 DPR，避免高密度设备导致异常 GPU/CPU 开销。

例如：

```text
effectiveDPR =
min(devicePixelRatio, maxDPR)
```

`maxDPR` 应作为 Runtime Quality 参数，而非业务必须配置的底层参数。

---

# 47. Visibility Optimization

页面不可见时：

```text
Page Hidden
    ↓
Pause / Reduce
```

页面恢复：

```text
Page Visible
    ↓
Resume
```

由 Runtime Scheduler 统一管理。

---

# 48. Intersection Optimization

元素离开 viewport：

```text
IntersectionObserver
        ↓
Visibility = false
        ↓
Motion pause/reduce
```

进入 viewport：

```text
Visibility = true
        ↓
Resume
```

---

# 49. Reduced Motion

检测：

```css
@media (prefers-reduced-motion: reduce)
```

Runtime 默认：

```text
reduce
```

策略：

```text
Normal
 ↓
Reduced
 ↓
Static
```

而不是强制关闭所有视觉。

---

# 50. Seed Contract

必须支持确定性生成：

```ts
{
  seed: 'hero-001'
}
```

同样：

```text
Seed
+
Configuration
+
Viewport
```

在相同条件下应生成稳定结果。

---

# 51. Randomness Boundary

核心禁止：

```ts
Math.random()
```

核心随机性必须通过：

```text
Seeded Random
```

统一生成。

---

# 52. Error Model

公共错误：

```ts
class GenerativeArtError extends Error
```

错误类别：

```text
ConfigurationError
PresetError
RendererError
PluginError
BrowserCapabilityError
RuntimeError
```

---

# 53. Error Code

错误应具有稳定 code：

```ts
interface GenerativeArtErrorOptions {
  code: string
  message: string
  cause?: unknown
}
```

例如：

```text
GA_INVALID_CONFIG
GA_PRESET_NOT_FOUND
GA_RENDERER_UNSUPPORTED
GA_RENDERER_INIT_FAILED
GA_PLUGIN_CONFLICT
GA_BROWSER_UNSUPPORTED
```

错误 code 比错误 message 更稳定。

---

# 54. Fallback Policy

正常情况下：

```text
WebGPU
 ↓
WebGL
 ↓
Canvas2D
 ↓
Static
```

Fallback 不应导致应用崩溃。

例如：

```ts
renderer: 'auto'
```

意味着：

> 选择当前环境最佳可用 Renderer。

而：

```ts
renderer: 'webgpu'
```

则表示：

> 用户明确要求 WebGPU。

如果不支持，应返回明确错误，而不是静默切换。

---

# 55. Static Fallback

最低级 fallback：

```text
Static Visual
```

可以是：

```text
Static Scene
```

或者：

```text
CSS Background
```

保证视觉增强功能失败时：

> 不影响宿主业务应用正常工作。

---

# 56. Build System

推荐：

```text
TypeScript
    ↓
tsup / Rollup / Vite Library Mode
    ↓
ESM
CJS
DTS
CSS
```

最终：

```text
dist/
├── index.js
├── index.cjs
├── index.d.ts
├── auto.js
├── auto.d.ts
├── react.js
├── react.d.ts
├── vue.js
├── vue.d.ts
├── web-component.js
├── web-component.d.ts
└── styles.css
```

---

# 57. Source Structure

推荐：

```text
src/
├── core/
│   ├── runtime/
│   ├── configuration/
│   ├── seed/
│   └── lifecycle/
│
├── geometry/
├── field/
├── composition/
├── motion/
├── material/
├── palette/
├── scene/
│
├── renderer/
│   ├── canvas2d/
│   ├── webgl/
│   └── webgpu/
│
├── preset/
├── theme/
├── plugin/
│
├── css/
├── adapters/
│   ├── react/
│   ├── vue/
│   └── web-component/
│
└── index.ts
```

---

# 58. Test Architecture

测试分为：

```text
Unit Test
Integration Test
Visual Regression Test
Browser Compatibility Test
Performance Test
Package Test
```

---

# 59. Unit Test

核心测试：

```text
Geometry
Field
Composition
Motion
Material
Seed
Configuration
Preset
```

尤其需要测试：

```text
deterministic generation
```

---

# 60. Integration Test

验证：

```text
Configuration
    ↓
Preset
    ↓
Scene
    ↓
Motion
    ↓
Renderer
```

完整链路。

---

# 61. Visual Regression

Preset 必须支持视觉回归。

输入：

```text
Preset
Theme
Seed
Viewport
DPR
```

输出：

```text
Screenshot
```

比较：

```text
Reference Image
      ↕
Current Image
```

检测视觉漂移。

---

# 62. Performance Test

至少测试：

```text
Startup Time
Initial Render
Frame Time
FPS
Memory
Geometry Count
Canvas Resolution
```

不同场景：

```text
Low Density
Medium Density
High Density
```

---

# 63. Performance Budget

MVP 应建立预算，而不是只追求理论最大性能。

建议指标：

```text
Normal Desktop:
60 FPS target

Normal Mobile:
30–60 FPS adaptive

Background Scene:
low CPU priority

Hidden:
0 FPS / paused
```

具体阈值由 Benchmark 后确定，不在 V2.0 固定为绝对硬编码数值。

---

# 64. Bundle Size Policy

核心包必须持续控制体积。

目标：

```text
Core Runtime
    ↓
small

Canvas2D
    ↓
small

Preset
    ↓
tree-shakable

React/Vue
    ↓
optional
```

禁止：

> 为支持高级 Renderer 而让普通 Canvas2D 用户承担全部体积。

---

# 65. Package Metadata

推荐：

```json
{
  "name": "@regalpine/generative-art",
  "version": "2.0.0",
  "description": "Production-grade generative geometric visual engine for the Web",
  "type": "module",
  "sideEffects": [
    "*.css",
    "./dist/auto.js"
  ]
}
```

---

# 66. Side Effects

核心模块尽可能：

```text
side-effect free
```

但：

```text
auto.js
```

属于主动初始化入口。

因此：

```text
auto.js
```

必须明确标识为 side effect。

---

# 67. Semantic Versioning

严格采用：

```text
MAJOR.MINOR.PATCH
```

例如：

```text
2.0.0
2.1.0
2.1.1
3.0.0
```

---

# 68. Major Version

Major 版本允许：

```text
Breaking API
Breaking Configuration
Breaking Plugin Contract
Breaking Renderer Contract
```

例如：

```text
2.x → 3.x
```

---

# 69. Minor Version

Minor 版本允许：

```text
New Geometry
New Motion
New Preset
New Theme
New Renderer
New API
```

但不得破坏已有稳定 API。

---

# 70. Patch Version

Patch 版本：

```text
Bug Fix
Performance Fix
Browser Compatibility Fix
Visual Regression Fix
Security Fix
```

不得引入 API breaking change。

---

# 71. Preset Versioning

Preset 自身必须具有版本：

```ts
interface Preset {
  id: string
  version: string
}
```

例如：

```text
aurora@1.2.0
```

引擎版本：

```text
generative-art@2.1.0
```

Preset 版本与 Engine 版本独立。

---

# 72. API Deprecation

废弃 API 必须经过：

```text
Announce
    ↓
Deprecation
    ↓
Migration Documentation
    ↓
Major Release
    ↓
Removal
```

TypeScript：

```ts
/** @deprecated Use setTheme() instead. */
```

---

# 73. Documentation Structure

正式文档：

```text
docs/
├── getting-started/
├── concepts/
├── configuration/
├── presets/
├── themes/
├── geometry/
├── field/
├── composition/
├── motion/
├── material/
├── renderer/
├── plugins/
├── react/
├── vue/
├── web-component/
├── performance/
├── accessibility/
└── migration/
```

---

# 74. Documentation Priority

用户首先需要理解：

```text
1. Installation
2. Quick Start
3. Presets
4. Themes
5. Configuration
6. CSS Variables
7. Framework Integration
8. Advanced Extension
```

而不是首先阅读：

```text
Noise Algorithm
Vector Mathematics
Renderer Internals
```

---

# 75. Quick Start

最小代码：

```ts
import {
  createGenerativeArt
} from '@regalpine/generative-art'

const art = createGenerativeArt({
  target: '#hero',
  preset: 'aurora'
})

art.start()
```

HTML：

```html
<div id="hero"></div>
```

---

# 76. Zero-Code Integration

最简单场景：

```ts
import '@regalpine/generative-art/auto'
```

HTML：

```html
<div
  data-generative-art
  data-art-preset="aurora">
</div>
```

目标：

> 普通 Web 开发者无需理解引擎内部架构即可使用。

---

# 77. CSS Customization Example

```css
.hero {
  --ga-density: 0.65;
  --ga-energy: 0.72;
  --ga-softness: 0.8;
  --ga-glow: 0.35;
}
```

HTML：

```html
<div
  class="hero"
  data-generative-art
  data-art-preset="flow">
</div>
```

---

# 78. Programmatic Customization

```ts
const art = createGenerativeArt({
  target: '#hero',
  preset: 'flow',
  semantic: {
    density: 0.7,
    complexity: 0.5,
    energy: 0.8,
    softness: 0.7,
    depth: 0.6,
    rhythm: 0.5,
    turbulence: 0.4,
    focus: 0.5
  }
})
```

---

# 79. Runtime Update Example

```ts
art.update({
  semantic: {
    energy: 0.9,
    turbulence: 0.7
  }
})
```

引擎负责判断：

```text
Hot Update
```

还是：

```text
Scene Rebuild
```

---

# 80. Package Usage Model

完整使用层次：

```text
Level 1
───────
Auto HTML

Level 2
───────
createGenerativeArt()

Level 3
───────
Semantic Configuration

Level 4
───────
Custom Preset

Level 5
───────
Plugin

Level 6
───────
Custom Renderer
```

大多数业务用户停留在：

```text
Level 1–3
```

---

# 81. Extension Principle

扩展应遵循：

```text
Configure
    >
Compose
    >
Extend
```

而不是：

```text
Fork Core
    >
Modify Core
    >
Maintain Private Version
```

目标是建立：

> **Stable Core + Extensible Ecosystem**

---

# 82. Public API Surface

V2.0 推荐稳定公开：

```text
createGenerativeArt
GenerativeArt
GenerativeArtConfig
SemanticArtConfig

Geometry
Field
Composition
Motion
Material

Preset
Theme

Renderer
RendererCapabilities

Plugin
PluginContext

Registry
```

---

# 83. Internal API Surface

以下不保证稳定：

```text
InternalSceneGraph
InternalGeometryBuffer
InternalRenderPipeline
InternalSchedulerImplementation
InternalNoiseImplementation
InternalCanvasAdapter
```

---

# 84. Security Boundary

虽然该产品主要为视觉引擎，但仍必须避免：

```text
eval()
new Function()
动态执行用户代码
```

Preset 配置应被视为：

```text
Data
```

而不是：

```text
Executable Code
```

---

# 85. Resource Safety

必须限制：

```text
Geometry Count
Path Length
Canvas Resolution
Effect Quality
Texture Size
```

避免配置异常导致：

```text
CPU Exhaustion
GPU Exhaustion
Memory Explosion
```

---

# 86. Runtime Safety

引擎不应因为视觉参数异常而导致：

```text
Infinite Loop
NaN propagation
Infinity coordinates
Negative canvas size
Unbounded geometry allocation
```

需要进行：

```text
Input Validation
Clamping
Finite Number Check
Resource Budget Check
```

---

# 87. Accessibility

Generative Art 默认属于：

```text
Decorative Visual
```

因此：

```html
aria-hidden="true"
```

应成为推荐集成方式。

不得影响：

```text
Screen Reader
Keyboard Navigation
Focus Management
Semantic Content
```

---

# 88. Interaction Boundary

V2.0 支持有限交互：

```text
Pointer
Hover
Scroll
Resize
```

交互只影响：

```text
Field
Motion
Composition
```

不承担：

```text
UI Interaction Framework
Gesture Framework
Game Input System
```

---

# 89. Framework Independence

核心架构：

```text
                  ┌───────────────┐
                  │   Core API    │
                  └───────┬───────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
     Vanilla            React              Vue
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
                    Runtime Engine
                          │
                          ▼
                       Renderer
```

---

# 90. Package Architecture Summary

最终：

```text
@regalpine/generative-art
│
├── Public API
│
├── Runtime
│
├── Semantic Model
│   ├── Geometry
│   ├── Field
│   ├── Composition
│   ├── Motion
│   └── Material
│
├── Preset
├── Theme
├── Palette
│
├── Renderer Contract
│   └── Canvas2D
│
├── CSS Integration
│
├── Plugin Registry
│
└── Optional Adapters
    ├── React
    ├── Vue
    └── Web Component
```

---

# 91. V2.0 MVP Scope

V2.0 发布版本必须包含：

### Core

- TypeScript
- ESM
- Public API
- Semantic Configuration
- Seed
- Lifecycle
- Runtime Update

### Generative

- Geometry
- Field
- Composition
- Motion
- Material
- Palette

### Rendering

- Canvas2D
- Renderer Contract
- Capability Detection
- Static Fallback

### Integration

- JavaScript API
- Auto Initialization
- CSS Variables
- data-* Attributes

### Presets

至少：

```text
flow
aurora
ribbon
organic
wave
orbital
mesh
atmosphere
```

### Runtime

- ResizeObserver
- IntersectionObserver
- Page Visibility
- Reduced Motion
- DPR
- Auto Destroy

### Engineering

- TypeScript declarations
- ESM
- CJS compatibility strategy
- Tree Shaking
- Unit Tests
- Integration Tests
- Visual Regression
- Performance Benchmark
- Documentation
- Semantic Versioning

---

# 92. V2.0 P1

V2.0 之后：

```text
WebGL Renderer
React Adapter
Vue Adapter
Web Component
Advanced Plugin System
```

---

# 93. V2.0 P2

后续：

```text
WebGPU Renderer
GPU Geometry
GPU Motion
OffscreenCanvas
Worker Rendering
Advanced Post Processing
```

---

# 94. 明确排除

V2.x 不因为生态扩展而引入：

```text
AI Art Generator
LLM Art Director
Online Editor
Design Marketplace
3D Game Engine
Physics Engine
Audio Engine
Video Editor
Cloud Rendering Service
```

这些属于完全不同的产品边界。

---

# 95. V2.0 架构闭环

到此，产品架构形成完整闭环：

```text
                  Configuration
                        │
                        ▼
                     Preset
                        │
                        ▼
                    Semantic
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
       Geometry       Field      Composition
          │             │             │
          └─────────────┼─────────────┘
                        ▼
                      Motion
                        │
                        ▼
                     Material
                        │
                        ▼
                       Scene
                        │
                        ▼
                    Renderer
                        │
                        ▼
                     Canvas
                        │
                        ▼
                  Web Application
```

---

# 96. 产品分层最终定义

```text
┌──────────────────────────────────────┐
│           Application Layer          │
├──────────────────────────────────────┤
│      React / Vue / Web Component     │
├──────────────────────────────────────┤
│          Generative Art API          │
├──────────────────────────────────────┤
│             Runtime                  │
├──────────────────────────────────────┤
│  Geometry / Field / Composition      │
│  Motion / Material / Palette         │
├──────────────────────────────────────┤
│          Scene Model                 │
├──────────────────────────────────────┤
│       Renderer Contract              │
├──────────────────────────────────────┤
│ Canvas2D / WebGL / WebGPU            │
└──────────────────────────────────────┘
```

---

# 97. 最终设计原则

V2.0 固化以下原则：

### 原则 1：NPM First

产品首先是：

```text
NPM Library
```

而不是：

```text
Standalone Application
```

### 原则 2：Semantic First

用户主要操作：

```text
density
energy
softness
depth
rhythm
focus
```

而不是复杂数学参数。

### 原则 3：Geometry First

核心不是：

```text
Particle System
```

而是：

```text
Geometric Structure
```

### 原则 4：Renderer Independent

核心模型不能绑定 Canvas2D、WebGL 或 WebGPU。

### 原则 5：Framework Independent

React/Vue 都只是 Adapter。

### 原则 6：CSS Declarative

CSS 用于表达：

```text
Visual Intent
```

而不是实现：

```text
Generative Algorithm
```

### 原则 7：Deterministic

Seed 保证：

```text
Reproducibility
```

### 原则 8：Graceful Degradation

高级能力失败时：

```text
WebGPU
 → WebGL
 → Canvas2D
 → Static
```

业务应用仍然正常运行。

### 原则 9：Performance by Architecture

性能不是后期优化，而是：

```text
Renderer
+
Scheduler
+
Visibility
+
DPR
+
Quality
+
Resource Budget
```

共同保证。

### 原则 10：Convergence

V2.0 之后：

> **不再新增核心语义层。**

未来新增能力必须归入已有：

```text
Geometry
Field
Composition
Motion
Material
Renderer
Runtime
Plugin
```

中的一个。

---

# 98. V2.0 状态

```text
Architecture          ✓
Semantic Model        ✓
Geometry              ✓
Field                 ✓
Composition           ✓
Motion                ✓
Material              ✓
Preset                ✓
CSS                   ✓
Renderer              ✓
NPM Contract          ✓
```

因此：

> **V2.0 标志着 Generative Geometric Art Engine 从“核心架构设计阶段”进入“产品实现阶段”。**

后续工作原则上不再继续扩张产品概念，而应进入：

```text
Implementation
    ↓
Benchmark
    ↓
Visual Quality
    ↓
Browser Compatibility
    ↓
Package Release
```

即：

> **从“继续设计”转向“按照规范实现”。**