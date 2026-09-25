import { alert } from 'pulse-ui-react'

async function handleConfirm() {
  const confirmed = await alert.confirm({
    title: '¿Eliminar proyecto?',
    text: 'Esta acción no se puede deshacer.',
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    variant: 'danger',
  })

  if (confirmed) {
    await alert.success({
      title: 'Proyecto eliminado',
      text: 'El proyecto se eliminó correctamente.',
    })
  }
}

function handleQueue() {
  void alert.info({ title: 'Primera alerta', text: 'Se muestra de inmediato.' })
  void alert.warning({
    title: 'Segunda alerta',
    text: 'Aparece al cerrar la primera.',
  })
}

const buttonStyles =
  'rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-700'

export function App() {
  return (
    <main className="min-h-screen bg-slate-950 p-10 text-slate-100">
      <h1 className="text-3xl font-bold">pulse-ui-react · playground</h1>
      <p className="mt-2 text-slate-400">Probá las alertas imperativas:</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" className={buttonStyles} onClick={() => void handleConfirm()}>
          Confirmación
        </button>
        <button
          type="button"
          className={buttonStyles}
          onClick={() =>
            void alert.success({
              title: 'Guardado',
              text: 'Los cambios se guardaron.',
            })
          }
        >
          Success
        </button>
        <button
          type="button"
          className={buttonStyles}
          onClick={() =>
            void alert.error({
              title: 'Algo salió mal',
              text: 'Intentá de nuevo en unos minutos.',
            })
          }
        >
          Error
        </button>
        <button
          type="button"
          className={buttonStyles}
          onClick={() =>
            void alert.warning({
              title: 'Atención',
              text: 'Estás por salir sin guardar.',
            })
          }
        >
          Warning
        </button>
        <button
          type="button"
          className={buttonStyles}
          onClick={() =>
            void alert.info({
              title: 'Dato importante',
              text: 'La sesión expira en 5 minutos.',
            })
          }
        >
          Info
        </button>
        <button type="button" className={buttonStyles} onClick={handleQueue}>
          Cola de 2
        </button>
      </div>
    </main>
  )
}
