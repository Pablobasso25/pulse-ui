import { useEffect } from 'react'
import { createRootManager } from '../core/root'
import { useStore } from '../core/store'
import { AlertDialog } from './AlertDialog'
import { alertStore } from './alert-store'

const rootManager = createRootManager('alert')

export function mountAlertHost(): void {
  rootManager.mount(<AlertHost />)
}

export function unmountAlertHost(): void {
  rootManager.unmount()
}

function AlertHost() {
  const queue = useStore(alertStore)
  const current = queue[0]

  useEffect(() => {
    if (queue.length > 0) return

    const timeout = window.setTimeout(() => {
      if (alertStore.getState().length === 0) unmountAlertHost()
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [queue.length])

  if (!current) return null

  return <AlertDialog key={current.id} request={current} />
}
