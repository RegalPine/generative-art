# Generative Geometric Art Engine
## Aesthetic Principles Specification V2.1

**文档类型：** Aesthetic & Visual Quality Specification  
**版本：** V2.1  
**状态：** Draft → Convergence Candidate  
**适用产品：** Generative Geometric Art Engine  
**核心命题：**

> **美感来自秩序与韵律。**

---

# 1. 文档目的

本规范定义 Generative Geometric Art Engine 的基础审美原则。

本规范不定义新的：

- Geometry
- Field
- Composition
- Motion
- Material
- Renderer

语义层。

而是定义一组横向的审美原则，用于约束和评价已有生成系统：

```text
                 Aesthetic Principles
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
      Order            Rhythm          Coherence
        │                │                │
        └────────────────┼────────────────┘
                         ▼
                     Variation
                         │
                         ▼
                      Tension
                         │
                         ▼
                      Beauty
```

---

# 2. 核心命题

## 2.1 第一原则

> **美感来自秩序与韵律。**

其中：

- **秩序 Order**：使视觉元素之间形成可感知、可预测的关系。
- **韵律 Rhythm**：使这些关系在空间或时间中产生重复、变化与节奏。
- **变化 Variation**：避免秩序退化为机械重复。
- **一致性 Coherence**：保证局部变化仍然属于同一个整体。
- **张力 Tension**：在秩序与变化之间建立审美吸引力。

---

# 3. 审美生成模型

Generative Art 的基本审美过程定义为：

```text
Order
  ↓
Structure
  ↓
Repetition
  ↓
Variation
  ↓
Rhythm
  ↓
Coherence
  ↓
Tension
  ↓
Aesthetic Experience
```

更完整地表达：

```text
                ┌─────────────┐
                │    Order    │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │  Structure  │
                └──────┬──────┘
                       │
                 repetition
                       │
                       ▼
                ┌─────────────┐
                │  Variation  │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │   Rhythm    │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │  Coherence  │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │   Tension   │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │   Beauty    │
                └─────────────┘
```

---

# 4. 五个审美基本概念

本规范定义五个核心审美概念：

```text
Order
Rhythm
Variation
Coherence
Tension
```

它们不是新的 Runtime Layer，而是：

> **跨 Geometry / Composition / Motion / Material 的评价维度。**

---

# 5. Order — 秩序

## 5.1 定义

Order 是视觉元素之间形成的：

> **结构化关系、比例关系、层次关系与空间关系。**

秩序让观察者能够理解：

```text
哪里是中心
哪里是边缘
什么属于同一组
什么更重要
什么重复
什么变化
```

---

# 6. Order 的组成

```text
Order
├── Balance
├── Proportion
├── Hierarchy
├── Alignment
├── Symmetry
├── Density
├── Scale
└── Negative Space
```

---

# 7. Balance — 平衡

平衡描述视觉重量的分布。

视觉重量可以来自：

```text
Size
Brightness
Contrast
Density
Color
Motion
Position
```

理想状态：

```text
视觉重量
     │
     ▼
整体稳定
```

并不要求：

```text
Left = Right
```

因此：

> 平衡 ≠ 对称。

---

# 8. Proportion — 比例

比例描述不同元素之间的尺度关系。

包括：

```text
Element / Element
Element / Group
Group / Canvas
```

优秀比例通常具有：

```text
重复关系
层级关系
尺度变化
```

禁止把：

```text
比例越复杂
```

等同于：

```text
美感越高
```

---

# 9. Hierarchy — 层次

视觉系统应存在一定程度的优先级：

```text
Primary
   ↓
Secondary
   ↓
Supporting
   ↓
Atmosphere
```

如果所有元素具有相同视觉权重：

```text
Primary = Secondary = Supporting
```

则容易形成：

> Visual Noise。

---

# 10. Alignment — 对齐

对齐是形成视觉秩序的重要机制。

包括：

```text
Geometric Alignment
Directional Alignment
Flow Alignment
Radial Alignment
Perspective Alignment
```

但生成艺术不要求完全对齐。

允许：

```text
Alignment
+
Controlled Deviation
```

形成自然感。

---

# 11. Symmetry — 对称

对称是一种秩序机制，而不是审美目标本身。

定义：

```text
Perfect Symmetry
        ↓
Strong Order
```

但：

```text
Perfect Symmetry
        ↓
Potential Predictability
```

因此允许：

```text
Symmetry
+
Variation
=
Organic Order
```

---

# 12. Density — 密度

密度描述单位空间内视觉元素的分布程度。

不能采用：

```text
Density ↑
Beauty ↑
```

而应采用：

```text
Sparse
   ↓
Balanced
   ↓
Dense
```

存在一个与具体作品风格相关的最佳区域。

因此：

> Density 是审美变量，而不是审美目标。

---

# 13. Negative Space — 留白

留白不是“没有东西”。

它是：

> **主动构成视觉节奏的空间。**

留白用于：

```text
Separation
Breathing
Focus
Hierarchy
Contrast
Rhythm
```

因此：

```text
Object
+
Negative Space
```

共同构成 Composition。

---

# 14. Rhythm — 韵律

## 14.1 定义

Rhythm 是：

> **视觉关系在空间或时间上的重复、变化与连续。**

韵律可以发生在：

```text
Space
Time
Scale
Color
Opacity
Direction
Density
Motion
```

---

# 15. Spatial Rhythm

空间韵律：

```text
○   ○     ○   ○
   ○   ○
○      ○      ○
```

形成：

```text
Spacing
Scale
Direction
Density
```

之间的节奏关系。

---

# 16. Temporal Rhythm

动态作品中的韵律：

```text
Slow
  ↓
Fast
  ↓
Slow
  ↓
Fast
```

或者：

```text
Pulse
   ↓
Rest
   ↓
Pulse
   ↓
Rest
```

这使 Motion 不再只是：

> “不断移动”。

而成为：

> “具有节奏的运动”。

---

# 17. Rhythm 的组成

```text
Rhythm
├── Repetition
├── Frequency
├── Phase
├── Amplitude
├── Tempo
├── Spacing
├── Variation
└── Continuity
```

---

# 18. Repetition — 重复

重复建立可预测性。

例如：

```text
A A A A A
```

能够快速形成模式。

但完全重复容易产生：

```text
Monotony
```

因此：

```text
Repetition
+
Variation
```

才构成具有生命力的韵律。

---

# 19. Variation — 变化

Variation 是对已有秩序的偏离。

变化可以作用于：

```text
Position
Scale
Rotation
Opacity
Color
Frequency
Amplitude
Speed
Density
```

变化必须受到一定约束。

因此：

```text
Randomness
≠
Variation
```

---

# 20. Controlled Variation

定义：

> **Variation must occur within a recognizable structural constraint.**

即：

```text
完全规则
    ↓
Mechanical

受约束变化
    ↓
Rhythmic

完全随机
    ↓
Chaotic
```

审美通常存在于：

```text
Order ←──────→ Variation
             ▲
          Aesthetic
           Zone
```

---

# 21. Coherence — 一致性

一致性回答：

> 为什么这些元素看起来属于同一个作品？

包括：

```text
Geometric Coherence
Color Coherence
Motion Coherence
Material Coherence
Compositional Coherence
```

---

# 22. Local vs Global Coherence

局部：

```text
一个元素自身合理
```

整体：

```text
所有元素共同形成统一视觉语言
```

必须满足：

```text
Local Coherence
        +
Global Coherence
```

---

# 23. Tension — 张力

张力产生于：

```text
Order
  ↕
Variation
```

以及：

```text
Symmetry
  ↕
Asymmetry
```

```text
Repetition
  ↕
Change
```

```text
Stability
  ↕
Motion
```

```text
Harmony
  ↕
Contrast
```

张力过低：

```text
Boring
```

张力过高：

```text
Chaotic
```

理想状态：

```text
Controlled Tension
```

---

# 24. Aesthetic Zone

定义审美空间：

```text
                     Chaos
                       ▲
                       │
                       │
          High         │
        Tension        │
                       │
                       │
Order ─────────────────┼──────────────── Variation
                       │
                       │
         Aesthetic     │
           Zone        │
                       │
                       ▼
                    Monotony
```

更准确地说：

```text
Too Much Order
      ↓
Monotony

Balanced Order + Variation
      ↓
Aesthetic Zone

Too Much Variation
      ↓
Chaos
```

---

# 25. 秩序与韵律的关系

本规范认为：

```text
Order
```

主要建立：

```text
Spatial Structure
```

而：

```text
Rhythm
```

主要建立：

```text
Spatial / Temporal Pattern
```

二者关系：

```text
Order
  ↓
Pattern

Pattern
  ↓
Repetition

Repetition
  +
Variation
  ↓
Rhythm
```

因此：

> **秩序是韵律的结构基础。**

---

# 26. Geometry 中的审美

Geometry 主要贡献：

```text
Shape
Continuity
Curvature
Proportion
Complexity
```

评价重点：

```text
Curve Smoothness
Shape Integrity
Curvature Rhythm
Geometric Proportion
Structural Simplicity
```

---

# 27. Field 中的审美

Field 本身不直接产生美感。

它通过影响：

```text
Direction
Density
Flow
Attraction
Repulsion
```

间接产生：

```text
Spatial Order
Flow Rhythm
Directional Coherence
```

---

# 28. Composition 中的审美

Composition 是：

> **Order 的主要承载层。**

重点：

```text
Balance
Hierarchy
Density
Negative Space
Focus
Scale
Symmetry
Distribution
```

因此：

```text
Composition
≈
Spatial Order
```

---

# 29. Motion 中的审美

Motion 是：

> **Rhythm 的主要承载层。**

重点：

```text
Frequency
Phase
Amplitude
Tempo
Acceleration
Repetition
Variation
Continuity
```

因此：

```text
Motion
≈
Temporal Rhythm
```

---

# 30. Material 中的审美

Material 不应创造新的结构。

它主要：

> **强化已有秩序与韵律。**

例如：

```text
Glow
```

应该强化：

```text
Hierarchy
Focus
Depth
```

而不是：

```text
Glow everywhere
```

---

# 31. Color 中的审美

Color 应服从：

```text
Order
Rhythm
Hierarchy
```

颜色变化可以产生：

```text
Color Rhythm
```

例如：

```text
Hue
→
Saturation
→
Lightness
→
Hue
```

形成循环。

---

# 32. 动态作品的完整审美结构

```text
Static Order
      │
      ▼
Spatial Rhythm
      │
      ▼
Temporal Rhythm
      │
      ▼
Motion Coherence
      │
      ▼
Aesthetic Experience
```

因此动态艺术：

> **不是静态图像 + 动画。**

而是：

> **空间秩序随时间展开形成的视觉韵律。**

---

# 33. 审美参数模型

定义三个核心参数：

```ts id="w7x4yo"
interface AestheticConfig {

  order: number

  rhythm: number

  variation: number

  coherence: number

  tension: number
}
```

范围：

```text
0.0 ───────────── 1.0
```

注意：

> 这些参数是审美控制参数，不替代已有 SemanticArtConfig。

---

# 34. Order Parameter

Order 可以进一步映射：

```ts id="3v3u8d"
interface OrderProfile {

  balance: number

  proportion: number

  hierarchy: number

  symmetry: number

  density: number

  negativeSpace: number
}
```

---

# 35. Rhythm Parameter

```ts id="x1f5wq"
interface RhythmProfile {

  repetition: number

  frequency: number

  variation: number

  continuity: number

  tempo: number

  amplitude: number
}
```

---

# 36. Tension Parameter

```ts id="vlb1o7"
interface TensionProfile {

  orderVariation: number

  symmetryAsymmetry: number

  repetitionChange: number

  stabilityMotion: number

  harmonyContrast: number
}
```

---

# 37. 审美评价模型

第一版不定义绝对“美”公式。

采用：

```text
Aesthetic Quality
=
Order Quality
+
Rhythm Quality
+
Coherence Quality
+
Tension Quality
```

但各项不是简单算术平均。

推荐采用：

```text
Constraint-aware Weighted Evaluation
```

---

# 38. 为什么不简单平均

例如：

```text
Order = 0.95
Rhythm = 0.95
Coherence = 0.20
```

如果平均：

```text
0.70
```

看起来似乎不错。

实际上：

> 局部秩序与韵律之间已经失去整体一致性。

因此：

```text
Coherence
```

应作为基础约束。

---

# 39. 审美评价的基本结构

```text
                 Input Scene
                     │
                     ▼
              ┌─────────────┐
              │ Order Eval   │
              └──────┬──────┘
                     │
              ┌──────▼──────┐
              │ Rhythm Eval  │
              └──────┬──────┘
                     │
              ┌──────▼──────┐
              │ Coherence    │
              └──────┬──────┘
                     │
              ┌──────▼──────┐
              │ Tension      │
              └──────┬──────┘
                     │
                     ▼
             Aesthetic Profile
```

---

# 40. 审美评价不是单一分数

系统输出：

```text
Aesthetic Profile
```

而不是：

```text
Beauty = 87
```

例如：

```text
Order          0.91
Rhythm         0.86
Variation      0.73
Coherence      0.94
Tension        0.78
```

同时生成：

```text
Strengths
Weaknesses
Warnings
Suggestions
```

---

# 41. 审美诊断

例如：

```text
Aesthetic Diagnosis

Order
██████████████████░░ 0.91

Rhythm
█████████████████░░░ 0.86

Coherence
███████████████████░ 0.94

Tension
███████████████░░░░░ 0.78
```

诊断：

```text
Strong spatial order.

Rhythm is coherent but slightly repetitive.

Visual hierarchy is strong.

Variation is insufficient in secondary structures.

Recommended:
increase controlled variation by 8–12%.
```

---

# 42. 评价原则

评价系统必须遵守：

### Principle 1

不把复杂度当作美感。

### Principle 2

不把随机性当作创造力。

### Principle 3

不把对称性当作美感。

### Principle 4

不把颜色数量当作丰富度。

### Principle 5

不把动画速度当作韵律。

### Principle 6

不把视觉效果数量当作质感。

---

# 43. 生成原则

生成器应优先：

```text
Constraint
   ↓
Structure
   ↓
Repetition
   ↓
Variation
   ↓
Rhythm
```

而不是：

```text
Random
   ↓
Random
   ↓
Random
   ↓
Random
```

---

# 44. Preset 的审美契约

每个 Preset 应具有：

```ts id="dd11rj"
interface AestheticProfile {

  order: number

  rhythm: number

  variation: number

  coherence: number

  tension: number
}
```

例如：

```text
Aurora

Order       0.72
Rhythm      0.91
Variation   0.84
Coherence   0.93
Tension     0.68
```

这不是评价运行结果的最终分数，而是：

> **Preset 的设计意图。**

---

# 45. Theme 的审美契约

Theme 主要影响：

```text
Material
Color
Contrast
Atmosphere
```

因此 Theme 也可以声明：

```text
Color Harmony
Contrast Profile
Material Restraint
```

但不能覆盖 Geometry 的结构原则。

---

# 46. 动态审美原则

动态生成必须遵守：

```text
Motion should reveal structure,
not destroy structure.
```

中文：

> **运动应该揭示结构，而不是破坏结构。**

因此：

```text
Motion
   ↓
Enhance Order
Enhance Rhythm
Enhance Focus
```

而不是：

```text
Motion
   ↓
Destroy Composition
```

---

# 47. 静态审美原则

即使：

```text
Motion = 0
```

作品仍然应该具有：

```text
Order
Composition
Hierarchy
Rhythm
```

因为：

> 动态艺术首先必须是一个成立的视觉结构。

---

# 48. 时间冻结原则

任何动态作品都应该允许：

```text
t = constant
```

得到稳定的静态帧。

该静态帧应具有基本的 Composition Quality。

因此：

```text
Dynamic Quality
```

不能完全依赖：

```text
Motion
```

---

# 49. Seed 与审美

Seed 不仅用于复现。

它还应该保证：

```text
Same Seed
+
Same Configuration
+
Same Viewport
```

产生：

```text
Same Structural Rhythm
```

从而可以进行：

```text
A/B
Regression
Benchmark
```

---

# 50. 审美回归测试

测试输入：

```text
Preset
Theme
Seed
Viewport
DPR
Time
```

输出：

```text
Order Metrics
Rhythm Metrics
Coherence Metrics
Tension Metrics
```

检测：

```text
Previous Version
        ↕
Current Version
```

防止：

> 算法优化导致视觉美感退化。

---

# 51. Aesthetic Regression

允许一定范围：

```text
Metric Drift
```

例如：

```text
Order      ±5%
Rhythm     ±5%
Coherence  ±3%
```

具体阈值应通过 Benchmark 确定。

---

# 52. Human Evaluation

算法评价不能完全替代人的审美判断。

因此最终体系：

```text
Objective Evaluation
        +
Human Preference
```

人工评价主要采用：

```text
Pairwise Comparison
```

例如：

```text
A vs B

Which is more aesthetically pleasing?
```

而不是要求人直接给：

```text
A = 87
B = 84
```

---

# 53. A/B 美感评价

推荐：

```text
Same Preset
Same Seed
Same Viewport
```

只改变一个变量：

```text
Order
Rhythm
Variation
Material
Motion
```

然后进行：

```text
A/B Preference
```

以建立因果关系。

---

# 54. Aesthetic Benchmark

未来建立：

```text
Generative Art Aesthetic Benchmark
```

结构：

```text
Benchmark
├── Order
├── Rhythm
├── Variation
├── Coherence
├── Tension
└── Overall Preference
```

用于：

```text
Preset Tuning
Algorithm Tuning
Renderer Comparison
Regression Testing
```

---

# 55. 审美报告

最终生成：

```text
Generative Art Aesthetic Report
```

结构：

```text
# Aesthetic Evaluation

## Overall

## Order

## Rhythm

## Variation

## Coherence

## Tension

## Strengths

## Weaknesses

## Recommendations

## Technical Metrics
```

---

# 56. Markdown 报告示例

```markdown
# Aesthetic Evaluation

## Overall

Strong

## Order

0.91

The composition has strong spatial hierarchy
and balanced negative space.

## Rhythm

0.86

The visual rhythm is coherent with moderate
temporal variation.

## Variation

0.73

Secondary structures are slightly repetitive.

## Coherence

0.94

Geometry, material and motion form a consistent
visual language.

## Tension

0.78

The composition maintains controlled asymmetry.

## Recommendations

- Increase secondary variation.
- Preserve focal hierarchy.
- Avoid increasing global density.
```

---

# 57. 审美反馈闭环

未来可以形成：

```text
Generate
   ↓
Render
   ↓
Evaluate
   ↓
Diagnose
   ↓
Adjust Parameters
   ↓
Generate Again
```

注意：

> Evaluation 不直接修改 Scene。

它只提供：

```text
Feedback
```

避免评价系统侵入生成器。

---

# 58. Architecture Position

最终架构：

```text
                         Generative Art
                               │
                ┌──────────────┴──────────────┐
                │                             │
             Generate                      Evaluate
                │                             │
        ┌───────┴────────┐             ┌──────┴──────┐
        │                │             │             │
     Semantic          Renderer      Metrics       Human
        │                │             │             │
        └───────┬────────┘             └──────┬──────┘
                │                             │
                ▼                             ▼
              Scene                     Aesthetic Report
```

---

# 59. 与现有架构的关系

最终不增加：

```text
Aesthetic Layer
```

而采用：

```text
                         Aesthetic Principles
                                  │
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
          Geometry            Composition           Motion
              │                   │                   │
              └───────────────────┼───────────────────┘
                                  ▼
                              Material
                                  │
                                  ▼
                               Renderer
```

审美原则横向约束已有语义。

---

# 60. 最终审美哲学

本产品最终采用以下审美哲学：

> **秩序产生可理解性。**

> **重复产生预期。**

> **变化打破机械。**

> **韵律赋予时间与空间以生命。**

> **一致性维持整体。**

> **张力产生吸引。**

最终：

```text
秩序
 +
变化
 ↓
韵律
 +
一致
 ↓
张力
 ↓
美感
```

---

# 61. 核心公式

作为设计原则，而非严格数学公式：

```text
Beauty
≈
Order
×
Rhythm
×
Coherence
```

并受到：

```text
Variation
Tension
```

调节。

因此：

```text
Order = 0
    → Chaos

Rhythm = 0
    → Static / Monotony

Coherence = 0
    → Fragmentation

Variation = 0
    → Mechanical Repetition

Tension = 0
    → Weak Attraction
```

---

# 62. 最终定义

Generative Geometric Art Engine 对“艺术美感”的正式定义：

> **艺术美感，是视觉元素在约束结构中形成秩序，在重复与变化中形成韵律，在局部与整体的一致性中形成统一，并通过适度张力产生持续感知吸引力的结果。**

简化为：

> **秩序构成骨架，韵律赋予生命，变化避免机械，一致性维持整体，张力产生美感。**

---

# 63. V2.1 收敛结论

V2.1 不新增生成引擎核心语义层。

正式建立：

```text
Order
Rhythm
Variation
Coherence
Tension
```

作为 Generative Art Engine 的：

> **Aesthetic Foundation。**

未来所有：

```text
Preset
Composition
Motion
Material
Visual Evaluation
Visual Regression
```

均应能够追溯到上述审美原则。

---

# 64. 规范状态

```text
Geometry                ✓
Field                   ✓
Composition             ✓
Motion                  ✓
Material                ✓
Preset                  ✓
CSS                     ✓
Renderer                ✓
NPM Contract            ✓

Aesthetic Principles    ✓
Order                   ✓
Rhythm                  ✓
Variation               ✓
Coherence               ✓
Tension                 ✓
```

**V2.1 完成审美原则层收敛。**

下一阶段不再继续增加新的“美学概念”。应进入：

```text
Aesthetic Principles
        ↓
Metrics Definition
        ↓
Evaluation Algorithm
        ↓
Benchmark Dataset
        ↓
Markdown Evaluation Report
        ↓
Visual Regression
```

从“审美哲学”正式进入“**可计算的审美评价体系**”。