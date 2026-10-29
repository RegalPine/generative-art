import { describe, it, expect } from 'vitest'
import { createSeed } from './seed'
import { createLifecycleStateMachine, LifecycleState } from './lifecycle'
import { normalizeSemanticConfig, DEFAULT_SEMANTIC } from './config'

describe('Seed', () => {
  it('should produce deterministic results', () => {
    const seed1 = createSeed(42)
    const seed2 = createSeed(42)

    const values1 = Array.from({ length: 10 }, () => seed1.next())
    const values2 = Array.from({ length: 10 }, () => seed2.next())

    expect(values1).toEqual(values2)
  })

  it('should produce values in [0, 1)', () => {
    const seed = createSeed(123)
    for (let i = 0; i < 100; i++) {
      const v = seed.next()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })

  it('range() should produce values in [min, max)', () => {
    const seed = createSeed(456)
    for (let i = 0; i < 100; i++) {
      const v = seed.range(5, 10)
      expect(v).toBeGreaterThanOrEqual(5)
      expect(v).toBeLessThan(10)
    }
  })

  it('int() should produce integers in [min, max]', () => {
    const seed = createSeed(789)
    for (let i = 0; i < 100; i++) {
      const v = seed.int(1, 6)
      expect(v).toBeGreaterThanOrEqual(1)
      expect(v).toBeLessThanOrEqual(6)
      expect(Number.isInteger(v)).toBe(true)
    }
  })

  it('pick() should select from array', () => {
    const seed = createSeed(100)
    const arr = ['a', 'b', 'c', 'd']
    for (let i = 0; i < 20; i++) {
      const v = seed.pick(arr)
      expect(arr).toContain(v)
    }
  })

  it('child() should produce a different but deterministic seed', () => {
    const seed1 = createSeed(42)
    const child1 = seed1.child()

    const seed2 = createSeed(42)
    const child2 = seed2.child()

    expect(child1.next()).toBe(child2.next())
    expect(child1.value).not.toBe(42)
  })
})

describe('LifecycleStateMachine', () => {
  it('should start in CREATED state', () => {
    const sm = createLifecycleStateMachine()
    expect(sm.state).toBe(LifecycleState.CREATED)
  })

  it('should follow valid transitions', () => {
    const sm = createLifecycleStateMachine()

    expect(sm.transition(LifecycleState.INITIALIZED)).toBe(true)
    expect(sm.state).toBe(LifecycleState.INITIALIZED)

    expect(sm.transition(LifecycleState.RUNNING)).toBe(true)
    expect(sm.state).toBe(LifecycleState.RUNNING)

    expect(sm.transition(LifecycleState.PAUSED)).toBe(true)
    expect(sm.state).toBe(LifecycleState.PAUSED)

    expect(sm.transition(LifecycleState.RUNNING)).toBe(true)
    expect(sm.state).toBe(LifecycleState.RUNNING)

    expect(sm.transition(LifecycleState.STOPPED)).toBe(true)
    expect(sm.state).toBe(LifecycleState.STOPPED)

    expect(sm.transition(LifecycleState.DESTROYED)).toBe(true)
    expect(sm.state).toBe(LifecycleState.DESTROYED)
  })

  it('should reject invalid transitions', () => {
    const sm = createLifecycleStateMachine()

    // CREATED → RUNNING is not valid
    expect(sm.transition(LifecycleState.RUNNING)).toBe(false)
    expect(sm.state).toBe(LifecycleState.CREATED)
  })

  it('should report canTransitionTo correctly', () => {
    const sm = createLifecycleStateMachine()

    expect(sm.canTransitionTo(LifecycleState.INITIALIZED)).toBe(true)
    expect(sm.canTransitionTo(LifecycleState.DESTROYED)).toBe(true)
    expect(sm.canTransitionTo(LifecycleState.RUNNING)).toBe(false)
  })

  it('is() should check current state', () => {
    const sm = createLifecycleStateMachine()
    expect(sm.is(LifecycleState.CREATED)).toBe(true)
    expect(sm.is(LifecycleState.RUNNING)).toBe(false)
  })
})

describe('Config Normalization', () => {
  it('should fill defaults for missing values', () => {
    const result = normalizeSemanticConfig(undefined)
    expect(result).toEqual(DEFAULT_SEMANTIC)
  })

  it('should clamp values to [0, 1]', () => {
    const result = normalizeSemanticConfig({
      density: -0.5,
      energy: 1.5,
      complexity: 0.3,
    })
    expect(result.density).toBe(0)
    expect(result.energy).toBe(1)
    expect(result.complexity).toBe(0.3)
  })

  it('should merge partial config with defaults', () => {
    const result = normalizeSemanticConfig({ density: 0.8 })
    expect(result.density).toBe(0.8)
    expect(result.energy).toBe(DEFAULT_SEMANTIC.energy)
  })
})
