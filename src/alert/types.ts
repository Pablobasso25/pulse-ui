export type AlertVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral'

export interface AlertOptions {
  title?: string
  text?: string
  variant?: AlertVariant
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  dismissOnBackdrop?: boolean
  dismissOnEscape?: boolean
}

export interface ResolvedAlertOptions {
  title: string
  text: string
  variant: AlertVariant
  confirmText: string
  cancelText: string
  showCancel: boolean
  dismissOnBackdrop: boolean
  dismissOnEscape: boolean
}

export interface AlertRequest {
  id: number
  options: ResolvedAlertOptions
  resolve: (confirmed: boolean) => void
}
