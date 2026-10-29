import { describe, it, expect } from 'vitest'
import { Polyline } from './polyline'
import { QuadraticBezier, CubicBezier } from './bezier'
import { Spline } from './spline'
import { Circle } from './circle'
import { Wave } from './wave'
import { Ribbon } from './ribbon'
import { DefaultGeometryGenerator } from './generator'
import { translateMatrix } from './curve'
import { pointDistance } from '../core/math'

describe('Polyline', () => {
  it('should interpolate between points', () => {
    const line = new Polyline([{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }])
    const start = line.pointAt(0)
    const end = line.pointAt(1)
    expect(start.x).toBeCloseTo(0, 5)
    expect(start.y).toBeCloseTo(0, 5)
    expect(end.x).toBeCloseTo(1, 1)
    expect(end.y).toBeCloseTo(1, 1)
  })

  it('should have correct length', () => {
    const line = new Polyline([{ x: 0, y: 0 }, { x: 3, y: 4 }])
    expect(line.length()).toBeCloseTo(5, 1)
  })

  it('sample should produce uniform points', () => {
    const line = new Polyline([{ x: 0, y: 0 }, { x: 10, y: 0 }])
    const pts = line.sample(11)
    expect(pts).toHaveLength(11)
    // Points should be roughly evenly spaced
    for (let i = 1; i < pts.length; i++) {
      const d = pointDistance(pts[i - 1]!, pts[i]!)
      expect(d).toBeCloseTo(1, 0)
    }
  })

  it('transform should not modify original', () => {
    const line = new Polyline([{ x: 0, y: 0 }, { x: 1, y: 1 }])
    const translated = line.transform(translateMatrix(10, 20)) as Polyline
    const origStart = line.pointAt(0)
    expect(origStart.x).toBeCloseTo(0, 5)
    const transStart = translated.pointAt(0)
    expect(transStart.x).toBeCloseTo(10, 1)
    expect(transStart.y).toBeCloseTo(20, 1)
  })
})

describe('QuadraticBezier', () => {
  it('endpoints match control points', () => {
    const bz = new QuadraticBezier({ x: 0, y: 0 }, { x: 0.5, y: 1 }, { x: 1, y: 0 })
    const start = bz.pointAt(0)
    const end = bz.pointAt(1)
    expect(start.x).toBeCloseTo(0, 1)
    expect(start.y).toBeCloseTo(0, 1)
    expect(end.x).toBeCloseTo(1, 1)
    expect(end.y).toBeCloseTo(0, 1)
  })

  it('should have positive length', () => {
    const bz = new QuadraticBezier({ x: 0, y: 0 }, { x: 0.5, y: 1 }, { x: 1, y: 0 })
    expect(bz.length()).toBeGreaterThan(0)
  })
})

describe('CubicBezier', () => {
  it('endpoints match control points', () => {
    const bz = new CubicBezier(
      { x: 0, y: 0 }, { x: 0.33, y: 1 }, { x: 0.66, y: 1 }, { x: 1, y: 0 },
    )
    const start = bz.pointAt(0)
    const end = bz.pointAt(1)
    expect(start.x).toBeCloseTo(0, 1)
    expect(end.x).toBeCloseTo(1, 1)
  })
})

describe('Spline', () => {
  it('passes through control points', () => {
    const pts = [{ x: 0, y: 0 }, { x: 0.25, y: 0.5 }, { x: 0.5, y: 0 }, { x: 0.75, y: 0.5 }, { x: 1, y: 0 }]
    const spline = new Spline(pts)
    // At t=0, should be at first point
    const start = spline.pointAt(0)
    expect(start.x).toBeCloseTo(0, 1)
    expect(start.y).toBeCloseTo(0, 1)
  })

  it('should throw for < 2 points', () => {
    expect(() => new Spline([{ x: 0, y: 0 }])).toThrow()
  })
})

describe('Circle', () => {
  it('should have correct circumference', () => {
    const circle = new Circle(0.5, 0.5, 1)
    expect(circle.length()).toBeCloseTo(2 * Math.PI, 2)
  })

  it('pointAt should trace the circle', () => {
    const circle = new Circle(0, 0, 1)
    const p0 = circle.pointAt(0)
    const p25 = circle.pointAt(0.25)
    const p50 = circle.pointAt(0.5)
    expect(p0.x).toBeCloseTo(1, 2)
    expect(p0.y).toBeCloseTo(0, 2)
    expect(p25.x).toBeCloseTo(0, 2)
    expect(p25.y).toBeCloseTo(1, 2)
    expect(p50.x).toBeCloseTo(-1, 2)
    expect(p50.y).toBeCloseTo(0, 2)
  })

  it('bounds should be correct', () => {
    const circle = new Circle(0, 0, 1)
    const b = circle.bounds()
    expect(b.x).toBeCloseTo(-1, 1)
    expect(b.y).toBeCloseTo(-1, 1)
    expect(b.width).toBeCloseTo(2, 1)
    expect(b.height).toBeCloseTo(2, 1)
  })
})

describe('Wave', () => {
  it('should start and end at configured points', () => {
    const wave = new Wave({
      start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 },
      amplitude: 0.1, frequency: 3,
    })
    const s = wave.pointAt(0)
    const e = wave.pointAt(1)
    expect(s.x).toBeCloseTo(0, 2)
    expect(s.y).toBeCloseTo(0.5, 2)
    expect(e.x).toBeCloseTo(1, 2)
    expect(e.y).toBeCloseTo(0.5, 2)
  })
})

describe('Ribbon', () => {
  it('should produce edge points', () => {
    const ribbon = new Ribbon({
      points: [{ x: 0, y: 0.5 }, { x: 0.5, y: 0.5 }, { x: 1, y: 0.5 }],
      width: 0.1,
    })
    const edges = ribbon.getEdges(10)
    expect(edges.left).toHaveLength(10)
    expect(edges.right).toHaveLength(10)
  })
})

describe('DefaultGeometryGenerator', () => {
  it('should generate deterministic geometry', () => {
    const gen = new DefaultGeometryGenerator()
    const g1 = gen.generate({ type: 'polyline', count: 5 }, 42)
    const g2 = gen.generate({ type: 'polyline', count: 5 }, 42)
    const pts1 = g1.sample(5)
    const pts2 = g2.sample(5)
    for (let i = 0; i < 5; i++) {
      expect(pts1[i]!.x).toBeCloseTo(pts2[i]!.x, 10)
      expect(pts1[i]!.y).toBeCloseTo(pts2[i]!.y, 10)
    }
  })

  it('should generate all MVP types', () => {
    const gen = new DefaultGeometryGenerator()
    const types = ['polyline', 'quadratic-bezier', 'cubic-bezier', 'spline', 'circle', 'wave', 'ribbon']
    for (const type of types) {
      const g = gen.generate({ type }, 42)
      expect(g.type).toBe(type)
      expect(g.sample(5).length).toBe(5)
    }
  })

  it('should throw for unknown type', () => {
    const gen = new DefaultGeometryGenerator()
    expect(() => gen.generate({ type: 'unknown' }, 42)).toThrow()
  })
})
