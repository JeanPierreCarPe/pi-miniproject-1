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
  const render = () => {
    const { path, params } = parseLocation()
    
    // Handle root path - redirect based on auth status
    if (path === '/') {
      if (getToken()) {
        window.location.hash = '#/tasks'
      } else {
        window.location.hash = '#/login'
      }
      return
    }
    
    const match = routes.find((r) => r.path === path) || routes.find((r) => r.path === '*')
    
    // Guard: require auth when route.auth === true
    if (match?.auth && !getToken()) {
      window.location.hash = '#/login'
      return
    }
    
    const view = match.component
    mount(root, view({ params }))
  }
  
  window.addEventListener('hashchange', render)
  render()
}


