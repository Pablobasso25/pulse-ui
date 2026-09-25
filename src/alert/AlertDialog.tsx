import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { handleTabKey } from '../core/focus-trap'
import { lockScroll } from '../core/scroll-lock'
import { CheckIcon, CloseIcon, InfoIcon, QuestionIcon, WarningIcon } from '../icons'
import { cx } from '../utils/cx'
import { finishAlert, registerDismissHandler } from './alert-store'
import type { AlertRequest, AlertVariant } from './types'

const EXIT_DURATION = 180

const iconContainerStyles: Record<AlertVariant, string> = {
  success:
    'bg-pulse-success-soft text-pulse-success-strong dark:bg-pulse-success/15 dark:text-pulse-success',
  danger:
    'bg-pulse-danger-soft text-pulse-danger-strong dark:bg-pulse-danger/15 dark:text-pulse-danger',
  warning:
    'bg-pulse-warning-soft text-pulse-warning-strong dark:bg-pulse-warning/15 dark:text-pulse-warning',
  info: 'bg-pulse-info-soft text-pulse-info-strong dark:bg-pulse-info/15 dark:text-pulse-info',
  neutral:
    'bg-pulse-neutral-soft text-pulse-neutral-strong dark:bg-pulse-neutral/15 dark:text-pulse-neutral',
}

const confirmButtonStyles: Record<AlertVariant, string> = {
  success: 'bg-pulse-success-strong text-white hover:bg-pulse-success',
  danger: 'bg-pulse-danger-strong text-white hover:bg-pulse-danger',
  warning: 'bg-pulse-warning-strong text-white hover:bg-pulse-warning',
  info: 'bg-pulse-info-strong text-white hover:bg-pulse-info',
  neutral: 'bg-pulse-neutral-strong text-white hover:bg-pulse-neutral',
}

const buttonBase =
  'pulse-reset inline-flex h-10 cursor-pointer items-center justify-center rounded-lg px-4 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pulse-info'

const cancelButtonStyles =
  'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'

interface AlertIconProps {
  variant: AlertVariant
  className?: string
}

function AlertIcon({ variant, className }: AlertIconProps) {
  switch (variant) {
    case 'success':
      return <CheckIcon className={className} />
    case 'danger':
      return <CloseIcon className={className} />
    case 'warning':
      return <WarningIcon className={className} />
    case 'info':
      return <InfoIcon className={className} />
    case 'neutral':
      return <QuestionIcon className={className} />
  }
}

interface AlertDialogProps {
  request: AlertRequest
}

export function AlertDialog({ request }: AlertDialogProps) {
  const { id, options } = request
  const [closing, setClosing] = useState(false)
  const closingRef = useRef(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const textId = useId()

  const close = useCallback(
    (result: boolean) => {
      if (closingRef.current) return

      closingRef.current = true
      setClosing(true)
      window.setTimeout(() => finishAlert(id, result), EXIT_DURATION)
    },
    [id],
  )

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const target =
      options.variant === 'danger' && options.showCancel
        ? cancelRef.current
        : confirmRef.current

    target?.focus()

    return () => {
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus()
      }
    }
  }, [options.showCancel, options.variant])

  useEffect(() => lockScroll(), [])

  useEffect(() => {
    registerDismissHandler(close)

    return () => registerDismissHandler(null)
  }, [close])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !options.dismissOnEscape) return

      event.preventDefault()
      close(false)
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [close, options.dismissOnEscape])

  return (
    <div className="fixed inset-0 z-[var(--pulse-z-modal)] flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        className={cx(
          'absolute inset-0 bg-slate-950/50',
          closing ? 'animate-pulse-fade-out' : 'animate-pulse-fade-in',
        )}
        onClick={options.dismissOnBackdrop ? () => close(false) : undefined}
      />
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={options.title ? titleId : undefined}
        aria-describedby={options.text ? textId : undefined}
        onKeyDown={(event) => {
          if (dialogRef.current) handleTabKey(event, dialogRef.current)
        }}
        className={cx(
          'pulse-reset relative w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl ring-1 ring-slate-950/5 dark:bg-slate-900 dark:ring-white/10',
          closing ? 'animate-pulse-pop-out' : 'animate-pulse-pop-in',
        )}
      >
        <div
          className={cx(
            'mx-auto flex size-12 items-center justify-center rounded-full',
            iconContainerStyles[options.variant],
          )}
        >
          <AlertIcon variant={options.variant} className="size-6" />
        </div>
        {options.title ? (
          <h2
            id={titleId}
            className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100"
          >
            {options.title}
          </h2>
        ) : null}
        {options.text ? (
          <p id={textId} className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {options.text}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          {options.showCancel ? (
            <button
              ref={cancelRef}
              type="button"
              onClick={() => close(false)}
              className={cx(buttonBase, cancelButtonStyles)}
            >
              {options.cancelText}
            </button>
          ) : null}
          <button
            ref={confirmRef}
            type="button"
            onClick={() => close(true)}
            className={cx(buttonBase, confirmButtonStyles[options.variant])}
          >
            {options.confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
