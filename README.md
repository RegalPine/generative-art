# @regalpine/generative-art

> Generative Geometric Art Engine — 基于六层语义模型的生成式几何艺术引擎

[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![Bundle Size](https://img.shields.io/badge/gzip-~100KB-orange)](./dist)

## 特性

- **六层语义模型**: Geometry(形) → Field(势) → Composition(构) → Motion(变) → Material(质) → Renderer(呈现)
- **三种渲染器**: Canvas2D / WebGL / WebGPU，自动选择 + Fallback 链
- **确定性生成**: Seed 体系，相同输入 → 相同输出
- **8 个内置 Preset**: flow / aurora / wave / ribbon / organic / orbital / mesh / atmosphere
- **性能自适应**: 4 级性能档位 (Tier 0-3)，自动设备检测 + FPS 监控 + 动态降级
- **插件系统**: 自定义 Geometry / Field / Motion / Material / Preset
- **框架适配**: React / Vue / Web Component / Auto Init
- **Worker 并行**: Field / Motion 计算可卸载到 Web Worker
- **SSR 安全**: 模块加载不访问浏览器 API
- **TypeScript strict**: 完整类型定义，ESM + CJS 双格式

## 快速开始

```bash
npm install @regalpine/generative-art
```

```typescript
import { createGenerativeArt } from '@regalpine/generative-art'

const art = createGenerativeArt({
  target: document.querySelector('canvas')!,
  preset: 'flow',
  semantic: { density: 0.6, energy: 0.4, complexity: 0.5 },
})

art.start()
// ... later
art.destroy()
```

## Web Component

```html
<generative-art preset="aurora" density="0.6" energy="0.4"></generative-art>
<script type="module">
  import { registerWebComponent } from '@regalpine/generative-art'
  registerWebComponent()
</script>
```

## 语义参数

| 参数 | 范围 | 说明 |
|------|------|------|
| `density` | 0-1 | 几何密度 |
| `complexity` | 0-1 | 形态复杂度 |
| `energy` | 0-1 | 运动能量 |
| `softness` | 0-1 | 边缘柔和度 |
| `depth` | 0-1 | 空间深度 |
| `rhythm` | 0-1 | 节奏感 |
| `turbulence` | 0-1 | 扰动强度 |
| `focus` | 0-1 | 视觉焦点 |

## 内置 Preset

```typescript
import { FLOW_PRESET, AURORA_PRESET, BUILT_IN_PRESETS } from '@regalpine/generative-art'

// 8 个内置 preset
console.log(BUILT_IN_PRESETS.map(p => p.id))
// → ['flow', 'aurora', 'wave', 'ribbon', 'organic', 'orbital', 'mesh', 'atmosphere']
```

## 性能系统

```typescript
import { detectInitialTier, getTierConfig, FPSMonitor, AdaptivePerformance } from '@regalpine/generative-art'

// 自动检测设备性能
const tier = detectInitialTier() // 0-3
const config = getTierConfig(tier)

// FPS 监控
const monitor = new FPSMonitor()
monitor.start()

// 自适应降级
const adaptive = new AdaptivePerformance({ minTier: 0, maxTier: 3 })
// 每帧调用: adaptive.update(monitor.fps)
```

## 插件系统

```typescript
import { pluginRegistry } from '@regalpine/generative-art'

pluginRegistry.install({
  meta: { name: 'my-plugin', version: '1.0.0' },
  install(ctx) {
    ctx.registerGeometry('custom', (config, seed) => { /* ... */ })
    ctx.registerPreset({ id: 'my-preset', version: '1.0.0', /* ... */ })
  },
})
```

## CSS 变量集成

```css
canvas {
  --ga-density: 0.6;
  --ga-energy: 0.4;
  --ga-complexity: 0.5;
}
```

## API 文档

完整 API 文档见 [docs/API_REFERENCE.md](./docs/API_REFERENCE.md)

## 项目规模

| 指标 | 数值 |
|------|------|
| TypeScript 文件 | 106+ |
| 代码行数 | 13,000+ |
| 导出符号 | 250+ |
| 测试 | 98 (单元 + 性能基准 + 视觉回归) |
| Build ESM | ~188 KB |
| Build CJS | ~194 KB |
| Build DTS | ~105 KB |

## 架构

```
src/
├── core/          # 运行时核心 (Seed, Runtime, Types)
├── geometry/      # 几何层 (Point, Curve, Shape, Generator)
├── field/         # 势场层 (Noise, Curl, Flow, Magnetic, DomainWarp, Operations)
├── composition/   # 构图层 (12 Distribution + Symmetry/Hierarchy/Depth/Rhythm)
├── motion/        # 运动层 (9 Motion + Composer + ReducedMotion)
├── material/      # 材质层 (Color/OKLab, 5 Effects, Stack, 16 BlendMode)
├── renderer/      # 呈现层 (Canvas2D, WebGL, WebGPU, Selector, Compositing, PostProcess)
├── preset/        # Preset 系统 (8 Built-in, Version, Validation, Performance, Negotiation)
├── css/           # CSS 变量 (Parser, Responsive)
├── plugin/        # 插件系统 (Contract, Registry)
├── adapter/       # 框架适配 (React, Vue, Web Component, Auto Init)
├── performance/   # 性能系统 (Tier 0-3, Device Detect, FPS Monitor, Adaptive)
├── worker/        # Worker 系统 (Protocol, Manager, Field/Motion Worker)
├── tools/         # 工具链 (Perf Panel, Preset Validator)
└── marketplace/   # Preset Marketplace (Protocol, Loader, Cache)
```

## License

MIT
