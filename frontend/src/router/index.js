import routes from './routes'
import { mount } from '../utils/dom'
import { getToken } from '../state/authStore'

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
<<<<<<< Updated upstream
        if (getToken()) {
          window.location.hash = '#/tasks'
        } else {
          window.location.hash = '#/login'
=======
        const match = routes.find((r) => r.path === '/')
        if (match) {
          mount(root, match.component({ params }))
>>>>>>> Stashed changes
        }
        return
      }

      // Buscar ruta o fallback NotFound
      const match = routes.find((r) => r.path === path) || routes.find((r) => r.path === '*')
<<<<<<< Updated upstream
      
      // Guard: require auth when route.auth === true
      if (match?.auth && !getToken()) {
=======

      // Guard: si la ruta requiere auth y no está logueado
      if (match?.auth && !isAuthenticated()) {
>>>>>>> Stashed changes
        window.location.hash = '#/login'
        return
      }

      const view = match.component
<<<<<<< Updated upstream
      mount(root, view({ params }))
=======
      if (view) {
        mount(root, view({ params }))
      } else {
        console.error('No se encontró componente para la ruta:', path)
        root.innerHTML = '<div style="padding: 20px; text-align: center;">Cargando...</div>'
      }
>>>>>>> Stashed changes
    } finally {
      setTimeout(() => {
        isRendering = false
      }, 0)
    }
  }

  window.addEventListener('hashchange', render)
  render()
}
<<<<<<< Updated upstream



=======
>>>>>>> Stashed changes
