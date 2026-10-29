/**
 * Color utilities — OKLab/OKLCH perceptual color interpolation.
 *
 * Supports:
 * - sRGB ↔ OKLab conversion
 * - Perceptual color interpolation in OKLab space
 * - CSS color string parsing
 */

/** OKLab color representation */
export interface OKLabColor {
  L: number // Lightness [0, 1]
  a: number // Green-Red [-0.4, 0.4]
  b: number // Blue-Yellow [-0.4, 0.4]
}

/** sRGB color */
export interface RGBColor {
  r: number // [0, 255]
  g: number // [0, 255]
  b: number // [0, 255]
}

/** Parse a CSS hex color to RGB */
export function parseHexColor(hex: string): RGBColor {
  const cleaned = hex.replace('#', '')
  const full = cleaned.length === 3
    ? cleaned[0]! + cleaned[0]! + cleaned[1]! + cleaned[1]! + cleaned[2]! + cleaned[2]!
    : cleaned

  return {
    r: parseInt(full.substring(0, 2), 16),
    g: parseInt(full.substring(2, 4), 16),
    b: parseInt(full.substring(4, 6), 16),
  }
}

/** Convert sRGB [0,255] to linear RGB [0,1] */
function srgbToLinear(c: number): number {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

/** Convert linear RGB [0,1] to sRGB [0,255] */
function linearToSrgb(c: number): number {
  const s = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
  return Math.round(Math.max(0, Math.min(255, s * 255)))
}

/** Convert RGB to OKLab */
export function rgbToOKLab(rgb: RGBColor): OKLabColor {
  // sRGB to linear
  const r = srgbToLinear(rgb.r)
  const g = srgbToLinear(rgb.g)
  const b = srgbToLinear(rgb.b)

  // Linear RGB to LMS
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b

  // LMS to OKLab
  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  return {
    L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  }
}

/** Convert OKLab to RGB */
export function okLabToRGB(lab: OKLabColor): RGBColor {
  // OKLab to LMS
  const l_ = lab.L + 0.3963377774 * lab.a + 0.2158037573 * lab.b
  const m_ = lab.L - 0.1055613458 * lab.a - 0.0638541728 * lab.b
  const s_ = lab.L - 0.0894841775 * lab.a - 1.2914855480 * lab.b

  // LMS to linear RGB
  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_

  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s

  return {
    r: linearToSrgb(r),
    g: linearToSrgb(g),
    b: linearToSrgb(b),
  }
}

/** Interpolate two colors in OKLab space (perceptual) */
export function interpolateOKLab(color1: string, color2: string, t: number): string {
  const rgb1 = parseHexColor(color1)
  const rgb2 = parseHexColor(color2)
  const lab1 = rgbToOKLab(rgb1)
  const lab2 = rgbToOKLab(rgb2)

  const mixed: OKLabColor = {
    L: lab1.L + (lab2.L - lab1.L) * t,
    a: lab1.a + (lab2.a - lab1.a) * t,
    b: lab1.b + (lab2.b - lab1.b) * t,
  }

  const result = okLabToRGB(mixed)
  return `rgb(${result.r}, ${result.g}, ${result.b})`
}

/** Convert OKLab color to CSS string */
export function okLabToCSS(lab: OKLabColor): string {
  const rgb = okLabToRGB(lab)
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

/** Parse any CSS color string to RGB (simplified — supports hex and rgb()) */
export function parseCSSColor(color: string): RGBColor {
  if (color.startsWith('#')) {
    return parseHexColor(color)
  }

  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]!, 10),
      g: parseInt(rgbMatch[2]!, 10),
      b: parseInt(rgbMatch[3]!, 10),
    }
  }

  // Fallback: return black
  return { r: 0, g: 0, b: 0 }
}
