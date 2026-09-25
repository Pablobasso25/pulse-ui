import { createStore } from '../core/store'
import type { AlertRequest } from './types'

export const alertStore = createStore<AlertRequest[]>([])

let dismissHandler: ((result: boolean) => void) | null = null

export function registerDismissHandler(
  handler: ((result: boolean) => void) | null,
): void {
  dismissHandler = handler
}

export function dismissAlert(result = false): void {
  dismissHandler?.(result)
}

export function finishAlert(id: number, result: boolean): void {
  const request = alertStore.getState().find((item) => item.id === id)
  if (!request) return

  request.resolve(result)
  alertStore.setState((queue) => queue.filter((item) => item.id !== id))
}
