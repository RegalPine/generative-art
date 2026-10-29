/**
 * Canvas2D Renderer — multi-pass glow stroke rendering.
 *
 * Key technique: each stroke is drawn 3 times with decreasing width
 * and increasing blur to create a natural glow effect:
 *   Pass 1: Wide + heavy blur  → soft outer glow
 *   Pass 2: Medium + mid blur  → inner glow
 *   Pass 3: Thin + no blur     → crisp core line
 */

import type { Point } from '../geometry/types'
import type {
  Renderer,
  RendererCapabilities,
  RenderContext,
  RenderFrameContext,
  RenderScene,
  RenderLayer,
  DrawCommand,
} from './types'
import { blendModeToCompositeOperation } from '../material/resolver'
import type { BlendMode } from '../material/types'

interface ArtCurve {
  sample(count: number): Point[]
}

const CANVAS2D_CAPABILITIES: RendererCapabilities = {
  type: 'canvas2d',
  maxTextureSize: 4096,
  supportsBlendModes: ['normal', 'multiply', 'screen', 'overlay', 'soft-light', 'hard-light'],
  supportsBlur: true,
  supportsGlow: true,
  supportsOffscreen: typeof OffscreenCanvas !== 'undefined',
  supportsInstancing: false,
  supportsHighDensity: true,
}

export class Canvas2DRenderer implements Renderer {
  readonly type = 'canvas2d'
  readonly capabilities = CANVAS2D_CAPABILITIES

  private ctx: CanvasRenderingContext2D | null = null
  private canvas: HTMLCanvasElement | null = null
  private width = 0
  private height = 0
  private dpr = 1
  private isPaused = false
  private isDisposed = false

  initialize(context: RenderContext): void {
    this.canvas = context.canvas
    this.width = context.width
    this.height = context.height
    this.dpr = context.dpr
    const ctx = this.canvas.getContext('2d')
    if (!ctx) throw new Error('Failed to get Canvas2D context')
    this.ctx = ctx
    this.canvas.width = this.width * this.dpr
    this.canvas.height = this.height * this.dpr
    this.ctx.scale(this.dpr, this.dpr)
  }

  resize(viewport: { width: number; height: number; dpr: number }): void {
    if (!this.ctx || !this.canvas) return
    this.width = viewport.width
    this.height = viewport.height
    this.dpr = viewport.dpr
    this.canvas.width = this.width * this.dpr
    this.canvas.height = this.height * this.dpr
    this.ctx.scale(this.dpr, this.dpr)
  }

  render(scene: RenderScene, context: RenderFrameContext): void {
    if (!this.ctx || this.isPaused || this.isDisposed) return
    const ctx = this.ctx
    const w = this.width
    const h = this.height

    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height)
    ctx.restore()

    const bg = (scene as any).background
    if (bg) this.drawBackground(bg, w, h)

    const sortedLayers = [...scene.layers].sort((a, b) => a.zIndex - b.zIndex)
    for (const layer of sortedLayers) {
      this.renderLayer(layer, context)
    }
  }

  pause(): void { this.isPaused = true }
  resume(): void { this.isPaused = false }
  dispose(): void { this.isDisposed = true; this.ctx = null; this.canvas = null }

  private drawBackground(bg: { colors?: string[]; angle?: number }, w: number, h: number): void {
    if (!this.ctx || !bg.colors || bg.colors.length < 2) return
    const angle = (bg.angle ?? 180) * Math.PI / 180
    const x1 = w / 2 + Math.cos(angle) * w / 2
    const y1 = h / 2 + Math.sin(angle) * h / 2
    const x2 = w / 2 - Math.cos(angle) * w / 2
    const y2 = h / 2 - Math.sin(angle) * h / 2
    const grad = this.ctx.createLinearGradient(x1, y1, x2, y2)
    bg.colors.forEach((c: string, i: number) => grad.addColorStop(i / (bg.colors!.length - 1), c))
    this.ctx.fillStyle = grad
    this.ctx.fillRect(0, 0, w, h)
  }

  private renderLayer(layer: RenderLayer, context: RenderFrameContext): void {
    if (!this.ctx) return
    this.ctx.save()
    for (const command of layer.drawCommands) {
      this.renderCommand(command, context)
    }
    this.ctx.restore()
  }

  private renderCommand(command: DrawCommand, _context: RenderFrameContext): void {
    if (!this.ctx) return
    const style = command.style as Record<string, unknown>

    if (style.blendMode) {
      this.ctx.globalCompositeOperation = blendModeToCompositeOperation(style.blendMode as BlendMode) as GlobalCompositeOperation
    }
    if (style.opacity !== undefined) {
      this.ctx.globalAlpha = style.opacity as number
    }

    switch (command.type) {
      case 'curve':
      case 'path':
        this.drawGlowStroke(command.path as ArtCurve, style)
        break
      case 'points':
        this.drawGlowPoints(command.path as Point[], style)
        break
      case 'filled-curve':
        this.drawSoftBand(command.path as ArtCurve, style)
        break
    }
  }

  /** Build a smooth path from sampled points using Catmull-Rom → bezier */
  private buildSmoothPath(points: Point[]): void {
    const ctx = this.ctx!
    const w = this.width
    const h = this.height
    const scaled = points.map(p => ({ x: p.x * w, y: p.y * h }))

    if (scaled.length < 2) return
    ctx.beginPath()
    ctx.moveTo(scaled[0]!.x, scaled[0]!.y)

    if (scaled.length === 2) {
      ctx.lineTo(scaled[1]!.x, scaled[1]!.y)
      return
    }

    for (let i = 0; i < scaled.length - 1; i++) {
      const p0 = scaled[Math.max(0, i - 1)]!
      const p1 = scaled[i]!
      const p2 = scaled[i + 1]!
      const p3 = scaled[Math.min(scaled.length - 1, i + 2)]!
      const tension = 0.35
      ctx.bezierCurveTo(
        p1.x + (p2.x - p0.x) * tension, p1.y + (p2.y - p0.y) * tension,
        p2.x - (p3.x - p1.x) * tension, p2.y - (p3.y - p1.y) * tension,
        p2.x, p2.y,
      )
    }
  }

  /**
   * Two-pass glow stroke: outer glow + core line
   */
  private drawGlowStroke(curve: ArtCurve, style: Record<string, unknown>): void {
    const ctx = this.ctx!
    const points = curve.sample(300)
    if (points.length < 2) return

    const color = (style.color as string) ?? '#888888'
    const baseWidth = (style.lineWidth as number) ?? 2
    const glowIntensity = (style.glow as number) ?? 0
    const glowColor = (style.glowColor as string) ?? color
    const lineCap = (style.lineCap as CanvasLineCap) ?? 'round'
    const lineJoin = (style.lineJoin as CanvasLineJoin) ?? 'round'

    // Create gradient stroke style
    const strokeStyle = this.createStrokeStyle(color, style.colorEnd as string | undefined, points, style.gradient as string | undefined)

    // Pass 1: Outer glow (wide + heavy blur)
    if (glowIntensity > 0) {
      ctx.save()
      ctx.shadowColor = glowColor
      ctx.shadowBlur = glowIntensity * 1.5
      ctx.strokeStyle = strokeStyle
      ctx.lineWidth = baseWidth + glowIntensity * 0.5
      ctx.lineCap = lineCap
      ctx.lineJoin = lineJoin
      ctx.globalAlpha = (ctx.globalAlpha ?? 1) * 0.2
      this.buildSmoothPath(points)
      ctx.stroke()
      ctx.restore()
    }

    // Pass 2: Core line (thin + no blur)
    ctx.save()
    ctx.strokeStyle = strokeStyle
    ctx.lineWidth = baseWidth
    ctx.lineCap = lineCap
    ctx.lineJoin = lineJoin
    ctx.shadowBlur = 0
    this.buildSmoothPath(points)
    ctx.stroke()
    ctx.restore()
  }

  /**
   * Soft band rendering for aurora/ribbon effects.
   * Draws a wide, soft, semi-transparent filled band.
   */
  private drawSoftBand(curve: ArtCurve, style: Record<string, unknown>): void {
    const ctx = this.ctx!
    const points = curve.sample(300)
    if (points.length < 2) return

    const color = (style.color as string) ?? '#888888'
    const colorEnd = style.colorEnd as string | undefined
    const glowIntensity = (style.glow as number) ?? 0
    const glowColor = (style.glowColor as string) ?? color
    const bandWidth = (style.lineWidth as number) ?? 20

    // Pass 1: Wide soft glow
    if (glowIntensity > 0) {
      ctx.save()
      ctx.shadowColor = glowColor
      ctx.shadowBlur = glowIntensity
      ctx.globalAlpha = (ctx.globalAlpha ?? 1) * 0.1
      this.drawWideBand(points, bandWidth * 2, color, colorEnd, style.gradient as string | undefined)
      ctx.restore()
    }

    // Pass 2: Core band
    ctx.save()
    ctx.globalAlpha = (ctx.globalAlpha ?? 1) * 0.2
    this.drawWideBand(points, bandWidth * 0.6, color, colorEnd, style.gradient as string | undefined)
    ctx.restore()
  }

  /** Draw a wide band along a curve path */
  private drawWideBand(points: Point[], width: number, color: string, colorEnd: string | undefined, gradientType: string | undefined): void {
    const ctx = this.ctx!
    const w = this.width
    const h = this.height
    const scaled = points.map(p => ({ x: p.x * w, y: p.y * h }))

    // Build both edges of the band
    const left: { x: number; y: number }[] = []
    const right: { x: number; y: number }[] = []

    for (let i = 0; i < scaled.length; i++) {
      const prev = scaled[Math.max(0, i - 1)]!
      const next = scaled[Math.min(scaled.length - 1, i + 1)]!
      const dx = next.x - prev.x
      const dy = next.y - prev.y
      const len = Math.sqrt(dx * dx + dy * dy) || 1
      const nx = -dy / len
      const ny = dx / len
      const halfW = width / 2
      left.push({ x: scaled[i]!.x + nx * halfW, y: scaled[i]!.y + ny * halfW })
      right.push({ x: scaled[i]!.x - nx * halfW, y: scaled[i]!.y - ny * halfW })
    }

    ctx.beginPath()
    ctx.moveTo(left[0]!.x, left[0]!.y)
    for (let i = 1; i < left.length; i++) ctx.lineTo(left[i]!.x, left[i]!.y)
    for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i]!.x, right[i]!.y)
    ctx.closePath()

    if (colorEnd) {
      const first = scaled[0]!
      const last = scaled[scaled.length - 1]!
      const grad = gradientType === 'radial'
        ? ctx.createRadialGradient(
            (first.x + last.x) / 2, (first.y + last.y) / 2, 0,
            (first.x + last.x) / 2, (first.y + last.y) / 2,
            Math.max(Math.abs(last.x - first.x), Math.abs(last.y - first.y)),
          )
        : ctx.createLinearGradient(first.x, first.y, last.x, last.y)
      grad.addColorStop(0, color)
      grad.addColorStop(1, colorEnd)
      ctx.fillStyle = grad
    } else {
      ctx.fillStyle = color
    }
    ctx.fill()
  }

  /** Draw glowing points */
  private drawGlowPoints(points: Point[], style: Record<string, unknown>): void {
    const ctx = this.ctx!
    const w = this.width
    const h = this.height
    const color = (style.color as string) ?? '#888888'
    const radius = (style.lineWidth as number) ?? 3
    const glowIntensity = (style.glow as number) ?? 0
    const glowColor = (style.glowColor as string) ?? color

    for (const p of points) {
      const px = p.x * w
      const py = p.y * h

      // Outer glow
      if (glowIntensity > 0) {
        ctx.save()
        ctx.shadowColor = glowColor
        ctx.shadowBlur = glowIntensity * 2
        ctx.globalAlpha = (ctx.globalAlpha ?? 1) * 0.2
        ctx.beginPath()
        ctx.arc(px, py, radius * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
        ctx.restore()
      }

      // Core
      ctx.save()
      ctx.beginPath()
      ctx.arc(px, py, radius, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      ctx.restore()
    }
  }

  /** Create stroke style (solid color or gradient) */
  private createStrokeStyle(color: string, colorEnd: string | undefined, points: Point[], gradientType: string | undefined): string | CanvasGradient {
    if (!colorEnd || !this.ctx) return color

    const w = this.width
    const h = this.height
    const scaled = points.map(p => ({ x: p.x * w, y: p.y * h }))
    const first = scaled[0]!
    const last = scaled[scaled.length - 1]!

    if (gradientType === 'radial') {
      const cx = (first.x + last.x) / 2
      const cy = (first.y + last.y) / 2
      const r = Math.max(Math.abs(last.x - first.x), Math.abs(last.y - first.y))
      const grad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      grad.addColorStop(0, color)
      grad.addColorStop(1, colorEnd)
      return grad
    }

    const grad = this.ctx.createLinearGradient(first.x, first.y, last.x, last.y)
    grad.addColorStop(0, color)
    grad.addColorStop(1, colorEnd)
    return grad
  }
}

export function createCanvas2DRenderer(): Canvas2DRenderer {
  return new Canvas2DRenderer()
}
