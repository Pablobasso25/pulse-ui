let lockCount = 0
let originalOverflow = ''
let originalPaddingRight = ''

export function lockScroll(): () => void {
  if (typeof document === 'undefined') return () => {}

  if (lockCount === 0) {
    const { body } = document
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    originalOverflow = body.style.overflow
    originalPaddingRight = body.style.paddingRight
    body.style.overflow = 'hidden'

    if (scrollbarWidth > 0) {
      const currentPadding =
        Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0
      body.style.paddingRight = `${currentPadding + scrollbarWidth}px`
    }
  }

  lockCount += 1
  let released = false

  return () => {
    if (released) return
    released = true
    lockCount -= 1

    if (lockCount === 0) {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
    }
  }
}
