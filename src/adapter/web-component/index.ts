/**
 * Web Component Adapter — custom element `<generative-art>`.
 *
 * Usage:
 *   <generative-art preset="flow" density="0.6" energy="0.4"></generative-art>
 *
 * Attributes:
 *   - preset: Preset name (default: "flow")
 *   - seed: Random seed (default: random)
 *   - renderer: Renderer type (auto|canvas2d|webgl|webgpu)
 *   - animated: Whether to animate (true|false, default: true)
 *   - density, complexity, energy, softness, depth, rhythm, turbulence, focus: Semantic params
 */

import type { GenerativeArt, SemanticArtConfig } from '../../core/types'
import { createGenerativeArt } from '../../core/runtime'

/** Web Component tag name */
export const WEB_COMPONENT_TAG = 'generative-art'

/** Semantic attribute names */
const SEMANTIC_ATTRS = [
  'density', 'complexity', 'energy', 'softness',
  'depth', 'rhythm', 'turbulence', 'focus',
] as const

/** GenerativeArt Web Component instance type */
export type GenerativeArtElement = HTMLElement

/** Internal class — only created in browser environments */
let _GenerativeArtElementClass: (CustomElementConstructor & (new () => HTMLElement)) | undefined

function createGenerativeArtElementClass(): CustomElementConstructor & (new () => HTMLElement) {
  if (typeof HTMLElement === 'undefined') {
    throw new Error('HTMLElement is not available (SSR environment)')
  }

  class GenerativeArtElementImpl extends HTMLElement {
  private instance: GenerativeArt | null = null
  private canvas: HTMLCanvasElement | null = null
  private resizeObserver: ResizeObserver | null = null
  private shadow: ShadowRoot

  static get observedAttributes(): string[] {
    return [
      'preset', 'seed', 'renderer', 'animated',
      ...SEMANTIC_ATTRS,
    ]
  }

  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback(): void {
    this.setupCanvas()
    this.initInstance()
    this.setupResizeObserver()
  }

  disconnectedCallback(): void {
    this.destroyInstance()
    this.resizeObserver?.disconnect()
    this.resizeObserver = null
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return

    if (name === 'preset' || name === 'seed' || name === 'renderer') {
      this.destroyInstance()
      this.initInstance()
    } else if (SEMANTIC_ATTRS.includes(name as typeof SEMANTIC_ATTRS[number])) {
      this.updateSemanticConfig()
    }
  }

  /** Set up the internal canvas */
  private setupCanvas(): void {
    this.canvas = document.createElement('canvas')
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'
    this.canvas.style.display = 'block'

    // Add styles to shadow root
    const style = document.createElement('style')
    style.textContent = `
      :host {
        display: block;
        position: relative;
        width: 300px;
        height: 300px;
      }
      canvas {
        width: 100%;
        height: 100%;
      }
    `
    this.shadow.appendChild(style)
    this.shadow.appendChild(this.canvas)
  }

  /** Initialize the generative art instance */
  private initInstance(): void {
    if (!this.canvas) return

    const preset = this.getAttribute('preset') ?? 'flow'
    const seed = this.getAttribute('seed') ? Number(this.getAttribute('seed')) : undefined
    const rendererType = (this.getAttribute('renderer') ?? 'auto') as 'auto' | 'canvas2d' | 'webgl' | 'webgpu'
    const animated = this.getAttribute('animated') !== 'false'

    const semantic = this.getSemanticConfig()

    try {
      this.instance = createGenerativeArt({
        target: this.canvas,
        preset,
        seed,
        renderer: rendererType,
        animated,
        semantic,
      })

      if (animated) {
        this.instance.start()
      }
    } catch (err) {
      console.error('Failed to initialize generative-art:', err)
    }
  }

  /** Destroy the current instance */
  private destroyInstance(): void {
    if (this.instance) {
      this.instance.destroy()
      this.instance = null
    }
  }

  /** Get semantic config from attributes */
  private getSemanticConfig(): Partial<SemanticArtConfig> {
    const config: Partial<SemanticArtConfig> = {}

    for (const attr of SEMANTIC_ATTRS) {
      const value = this.getAttribute(attr)
      if (value !== null) {
        (config as Record<string, number>)[attr] = Number(value)
      }
    }

    return config
  }

  /** Update semantic config on existing instance */
  private updateSemanticConfig(): void {
    if (!this.instance) return

    const semantic = this.getSemanticConfig()
    this.instance.update(semantic)
  }

  /** Set up resize observer */
  private setupResizeObserver(): void {
    if (typeof ResizeObserver === 'undefined') return

    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (this.instance && width > 0 && height > 0) {
          this.instance.resize(width, height)
        }
      }
    })

    this.resizeObserver.observe(this)
  }
  }

  return GenerativeArtElementImpl as unknown as CustomElementConstructor & (new () => HTMLElement)
}

/** Get the Web Component class (lazily created, SSR-safe) */
export function getGenerativeArtElementClass(): (CustomElementConstructor & (new () => HTMLElement)) | undefined {
  if (typeof HTMLElement === 'undefined') return undefined
  if (!_GenerativeArtElementClass) {
    _GenerativeArtElementClass = createGenerativeArtElementClass()
  }
  return _GenerativeArtElementClass
}

/** Register the web component */
export function registerWebComponent(tagName = WEB_COMPONENT_TAG): void {
  if (typeof customElements === 'undefined') return

  const ElementClass = getGenerativeArtElementClass()
  if (!ElementClass) return

  if (!customElements.get(tagName)) {
    customElements.define(tagName, ElementClass as unknown as CustomElementConstructor)
  }
}

/** Check if the web component is registered */
export function isWebComponentRegistered(tagName = WEB_COMPONENT_TAG): boolean {
  if (typeof customElements === 'undefined') return false
  return customElements.get(tagName) !== undefined
}
