import routes from './routes'
import { mount } from '../utils/dom'
import { isAuthenticated } from '../state/authStore'

function parseLocation() {
  const hash = window.location.hash || '#/'
  const [path, query] = hash.slice(1).split('?')
  const params = new URLSearchParams(query || '')
  const cleanPath = path || '/'

  return { path: cleanPath, params }
}

export function startRouter(root) {
  let currentPath = null
  let isRendering = false

  const render = () => {
    if (isRendering) return

    const { path, params } = parseLocation()
    if (currentPath === path) return

    isRendering = true
    currentPath = path

    try {
      // Mostrar Welcome siempre en "/"
      if (path === '/') {
        const match = routes.find((r) => r.path === '/')
        if (match) {
          mount(root, match.component({ params }))
        }
        return
      }

      // Buscar ruta o fallback NotFound
      const match = routes.find((r) => r.path === path) || routes.find((r) => r.path === '*')

      // Guard: si la ruta requiere auth y no está logueado
      if (match?.auth && !isAuthenticated()) {
        window.location.hash = '#/login'
        return
      }

      const view = match.component
      if (view) {
        mount(root, view({ params }))
      } else {
        console.error('No se encontró componente para la ruta:', path)
        root.innerHTML = '<div style="padding: 20px; text-align: center;">Cargando...</div>'
      }
    } finally {
      setTimeout(() => {
        isRendering = false
      }, 0)
    }
  }

  window.addEventListener('hashchange', render)
  render()
}
