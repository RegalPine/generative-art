/**
 * Lifecycle state machine for GenerativeArt instances.
 *
 * State transitions:
 *   CREATED → INITIALIZED → RUNNING ⇄ PAUSED
 *                               ↓         ↓
 *                           STOPPED ← DESTROYED
 */

export enum LifecycleState {
  CREATED = 'CREATED',
  INITIALIZED = 'INITIALIZED',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  STOPPED = 'STOPPED',
  DESTROYED = 'DESTROYED',
}

/** Valid state transitions map */
const VALID_TRANSITIONS: Record<LifecycleState, LifecycleState[]> = {
  [LifecycleState.CREATED]: [LifecycleState.INITIALIZED, LifecycleState.DESTROYED],
  [LifecycleState.INITIALIZED]: [LifecycleState.RUNNING, LifecycleState.DESTROYED],
  [LifecycleState.RUNNING]: [LifecycleState.PAUSED, LifecycleState.STOPPED, LifecycleState.DESTROYED],
  [LifecycleState.PAUSED]: [LifecycleState.RUNNING, LifecycleState.STOPPED, LifecycleState.DESTROYED],
  [LifecycleState.STOPPED]: [LifecycleState.DESTROYED],
  [LifecycleState.DESTROYED]: [],
}

export interface LifecycleStateMachine {
  readonly state: LifecycleState
  transition(to: LifecycleState): boolean
  is(state: LifecycleState): boolean
  canTransitionTo(state: LifecycleState): boolean
}

/** Create a lifecycle state machine starting in CREATED state */
export function createLifecycleStateMachine(): LifecycleStateMachine {
  let currentState = LifecycleState.CREATED

  return {
    get state() {
      return currentState
    },

    transition(to: LifecycleState): boolean {
      const allowed = VALID_TRANSITIONS[currentState]
      if (!allowed || !allowed.includes(to)) {
        return false
      }
      currentState = to
      return true
    },

    is(state: LifecycleState): boolean {
      return currentState === state
    },

    canTransitionTo(state: LifecycleState): boolean {
      const allowed = VALID_TRANSITIONS[currentState]
      return !!allowed && allowed.includes(state)
    },
  }
}
