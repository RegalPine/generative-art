/**
 * Device Detection — detects device capabilities and assigns initial tier.
 *
 * SSR-safe: only accesses navigator/screen when explicitly called.
 */

import type { PerformanceTier } from './tier'

/** Device info */
export interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  hasWebGL: boolean
  hasWebGPU: boolean
  hardwareConcurrency: number
  deviceMemory: number
  devicePixelRatio: number
  screenWidth: number
  screenHeight: number
}

/** Detect device information */
export function detectDevice(): DeviceInfo {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      hasWebGL: false,
      hasWebGPU: false,
      hardwareConcurrency: 4,
      deviceMemory: 4,
      devicePixelRatio: 1,
      screenWidth: 1920,
      screenHeight: 1080,
    }
  }

  const ua = navigator.userAgent.toLowerCase()
  const isMobile = /mobile|android|iphone|ipod/.test(ua)
  const isTablet = /ipad|android(?!.*mobile)/.test(ua)
  const isDesktop = !isMobile && !isTablet

  // Check WebGL
  let hasWebGL = false
  try {
    const canvas = document.createElement('canvas')
    hasWebGL = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    hasWebGL = false
  }

  // Check WebGPU
  const hasWebGPU = 'gpu' in navigator

  return {
    isMobile,
    isTablet,
    isDesktop,
    hasWebGL,
    hasWebGPU,
    hardwareConcurrency: navigator.hardwareConcurrency ?? 4,
    deviceMemory: (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4,
    devicePixelRatio: window.devicePixelRatio ?? 1,
    screenWidth: window.screen?.width ?? 1920,
    screenHeight: window.screen?.height ?? 1080,
  }
}

/** Detect initial performance tier based on device info */
export function detectInitialTier(device?: DeviceInfo): PerformanceTier {
  const info = device ?? detectDevice()

  let score = 0

  // CPU cores
  if (info.hardwareConcurrency >= 8) score += 3
  else if (info.hardwareConcurrency >= 4) score += 2
  else if (info.hardwareConcurrency >= 2) score += 1

  // Device memory
  if (info.deviceMemory >= 16) score += 3
  else if (info.deviceMemory >= 8) score += 2
  else if (info.deviceMemory >= 4) score += 1

  // GPU
  if (info.hasWebGPU) score += 3
  else if (info.hasWebGL) score += 2

  // Device type
  if (info.isDesktop) score += 2
  else if (info.isTablet) score += 1

  // Screen size
  const pixels = info.screenWidth * info.screenHeight
  if (pixels >= 3_000_000) score += 2
  else if (pixels >= 1_000_000) score += 1

  // Map score to tier
  if (score >= 10) return 3
  if (score >= 7) return 2
  if (score >= 4) return 1
  return 0
}
