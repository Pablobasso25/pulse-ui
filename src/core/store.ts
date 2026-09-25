import { useSyncExternalStore } from 'react'

export interface Store<T> {
  getState: () => T
  setState: (updater: T | ((previous: T) => T)) => void
  subscribe: (listener: () => void) => () => void
}

export function createStore<T>(initialState: T): Store<T> {
  let state = initialState
  const listeners = new Set<() => void>()

  const getState = (): T => state

  const setState = (updater: T | ((previous: T) => T)): void => {
    const next =
      typeof updater === 'function' ? (updater as (previous: T) => T)(state) : updater

    if (Object.is(next, state)) return

    state = next
    listeners.forEach((listener) => listener())
  }

  const subscribe = (listener: () => void): (() => void) => {
    listeners.add(listener)

    return () => {
      listeners.delete(listener)
    }
  }

  return { getState, setState, subscribe }
}

export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.getState, store.getState)
}
