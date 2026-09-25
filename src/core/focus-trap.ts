const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

interface TabKeyEvent {
  key: string
  shiftKey: boolean
  preventDefault: () => void
}

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)

  return Array.from(elements).filter(
    (element) =>
      !element.hasAttribute('hidden') &&
      element.getAttribute('aria-hidden') !== 'true' &&
      element.getClientRects().length > 0,
  )
}

export function handleTabKey(event: TabKeyEvent, container: HTMLElement): void {
  if (event.key !== 'Tab') return

  const focusable = getFocusableElements(container)
  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (!first || !last) {
    event.preventDefault()
    return
  }

  const active = document.activeElement

  if (event.shiftKey) {
    if (active === first || !container.contains(active)) {
      event.preventDefault()
      last.focus()
    }
    return
  }

  if (active === last || !container.contains(active)) {
    event.preventDefault()
    first.focus()
  }
}

export function focusFirstElement(container: HTMLElement): void {
  const focusable = getFocusableElements(container)
  const target = focusable[0] ?? container
  target.focus()
}
