import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'
import type { ReactNode } from 'react'

export interface RootManager {
  mount: (node: ReactNode) => void
  unmount: () => void
}

export function createRootManager(name: string): RootManager {
  let container: HTMLDivElement | null = null
  let root: Root | null = null

  const mount = (node: ReactNode): void => {
    if (typeof document === 'undefined') return

    if (!container || !root) {
      container = document.createElement('div')
      container.setAttribute('data-pulse', name)
      document.body.appendChild(container)
      root = createRoot(container)
    }

    root.render(node)
  }

  const unmount = (): void => {
    if (!container || !root) return

    root.unmount()
    container.remove()
    container = null
    root = null
  }

  return { mount, unmount }
}
