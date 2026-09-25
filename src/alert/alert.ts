import { mountAlertHost } from './AlertHost'
import { alertStore, dismissAlert } from './alert-store'
import type {
  AlertOptions,
  AlertRequest,
  AlertVariant,
  ResolvedAlertOptions,
} from './types'

let nextId = 0

function resolveOptions(
  options: AlertOptions,
  variant: AlertVariant,
  showCancel: boolean,
): ResolvedAlertOptions {
  return {
    title: options.title ?? '',
    text: options.text ?? '',
    variant,
    confirmText: options.confirmText ?? 'Aceptar',
    cancelText: options.cancelText ?? 'Cancelar',
    showCancel: options.showCancel ?? showCancel,
    dismissOnBackdrop: options.dismissOnBackdrop ?? true,
    dismissOnEscape: options.dismissOnEscape ?? true,
  }
}

function open(
  options: AlertOptions,
  variant: AlertVariant,
  showCancel: boolean,
): Promise<boolean> {
  return new Promise((resolve) => {
    const request: AlertRequest = {
      id: nextId,
      options: resolveOptions(options, variant, showCancel),
      resolve,
    }

    nextId += 1
    alertStore.setState((queue) => [...queue, request])
    mountAlertHost()
  })
}

export const alert = {
  confirm(options: AlertOptions = {}): Promise<boolean> {
    return open(options, options.variant ?? 'neutral', true)
  },
  success(options: AlertOptions = {}): Promise<boolean> {
    return open(options, 'success', false)
  },
  error(options: AlertOptions = {}): Promise<boolean> {
    return open(options, 'danger', false)
  },
  warning(options: AlertOptions = {}): Promise<boolean> {
    return open(options, 'warning', false)
  },
  info(options: AlertOptions = {}): Promise<boolean> {
    return open(options, 'info', false)
  },
  dismiss(result = false): void {
    dismissAlert(result)
  },
}
