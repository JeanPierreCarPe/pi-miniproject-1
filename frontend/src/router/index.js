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
    // Prevent multiple renders at once
    if (isRendering) return
    
    const { path, params } = parseLocation()
    
    // Skip render if path hasn't changed
    if (currentPath === path) return
    
    isRendering = true
    currentPath = path
    
    try {
      // Handle root path - redirect based on auth status
      if (path === '/') {
        if (isAuthenticated()) {
          window.location.hash = '#/tasks'
        } else {
          window.location.hash = '#/login'
        }
        return
      }
      
      const match = routes.find((r) => r.path === path) || routes.find((r) => r.path === '*')
      
      // Guard: require auth when route.auth === true
      if (match?.auth && !isAuthenticated()) {
        window.location.hash = '#/login'
        return
      }
      
      const view = match.component
      if (view) {
        mount(root, view({ params }))
      } else {
        console.error('No component found for path:', path)
        // Show a loading state or error
        root.innerHTML = '<div style="padding: 20px; text-align: center;">Cargando...</div>'
      }
    } finally {
      // Allow next render after a microtask
      setTimeout(() => {
        isRendering = false
      }, 0)
    }
  }
  
  window.addEventListener('hashchange', render)
  render()
}


