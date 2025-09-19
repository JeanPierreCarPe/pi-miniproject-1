/**
 * Main application entry point
 * Initializes the SPA router, sets up layout, and handles global UI elements like sidebar and logout
 */
import { startRouter } from './router/index'
import { showModal } from './components/Modal'
import './styles/base.css'
import './styles/layout.css'
import './styles/form.css'
import './styles/task.css'

// Handle direct URLs without hash (for email links)
function handleDirectURLs() {
  const path = window.location.pathname
  const search = window.location.search
  const routes = ['/login', '/signup', '/tasks', '/profile', '/reset', '/reset-password', '/forgot-password']
  
  console.log('Direct URL check - path:', path, 'search:', search)
  
  // If accessing a route directly (not through hash), redirect to hash version
  if (path !== '/' && routes.some(route => path.startsWith(route))) {
    const newUrl = `${window.location.origin}/#${path}${search}`
    console.log('Redirecting direct URL to:', newUrl)
    
    // Use history.replaceState to avoid reload, then update hash manually
    history.replaceState({}, '', newUrl)
    
    // Trigger hashchange event to make router work
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    
    return false // Continue with app initialization
  }
  
  // If accessing root path without hash, set initial hash based on auth status
  if (path === '/' && !window.location.hash) {
    const hasToken = !!localStorage.getItem('auth_token')
    const initialHash = hasToken ? '#/tasks' : '#/login'
    console.log('Setting initial hash:', initialHash)
    window.location.hash = initialHash
  }
  
  return false
}

// Always initialize the app
{

const root = document.getElementById('app')
// Shell layout with sidebar to match original UI
root.innerHTML = `
  <div class="menu-toggle" id="menuToggle"><i class="fas fa-bars"></i></div>
  <div class="app">
    <aside class="sidebar" id="sidebar">
      <div>
        <div class="logo"><i class="icon fas fa-tasks"></i><div class="text">TaskFlow</div></div>
        <div class="user-info" id="userInfo" style="display:none;">
          <div class="user-avatar">
            <i class="fas fa-user-circle"></i>
          </div>
          <div class="user-details">
            <div class="user-name" id="userName">Usuario</div>
            <div class="user-email" id="userEmail">email@ejemplo.com</div>
          </div>
        </div>
        <nav class="menu">
          <a href="#/tasks" id="navTasks"><i class="icon fas fa-list-check"></i><span>Mis Tareas</span></a>
          <a href="#/tasks/new" id="navNew"><i class="icon fas fa-plus-circle"></i><span>Nueva Tarea</span></a>
          <a href="#/profile" id="navProfile"><i class="icon fas fa-user"></i><span>Mi Perfil</span></a>
          <a href="#/about" id="navAbout"><i class="icon fas fa-info-circle"></i><span>Sobre nosotros</span></a>
        </nav>
      </div>
      <div class="footer">
        <button class="logout" id="logoutBtn"><i class="icon fas fa-sign-out-alt"></i><span>Cerrar sesión</span></button>
      </div>
    </aside>
    <main class="main"><div id="view"></div></main>
  </div>`

// Sidebar toggle + active menu sync + logout
const sidebarEl = document.getElementById('sidebar')
const menuToggle = document.getElementById('menuToggle')

// Toggle sidebar
menuToggle?.addEventListener('click', (e) => {
  e.stopPropagation()
  sidebarEl?.classList.toggle('active')
  
  // Ocultar/mostrar el botón hamburger con animación
  if (sidebarEl?.classList.contains('active')) {
    menuToggle.classList.add('hidden')
  } else {
    menuToggle.classList.remove('hidden')
  }
})

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768 && sidebarEl?.classList.contains('active')) {
    if (!sidebarEl.contains(e.target) && !menuToggle?.contains(e.target)) {
      sidebarEl.classList.remove('active')
      menuToggle?.classList.remove('hidden')
    }
  }
})

// Close sidebar on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sidebarEl?.classList.contains('active')) {
    sidebarEl.classList.remove('active')
    menuToggle?.classList.remove('hidden')
  }
})

// Auto-close sidebar when navigation links are clicked on mobile
function setupNavigationAutoClose() {
  const navLinks = ['navTasks', 'navNew', 'navProfile', 'navAbout']
  
  navLinks.forEach(linkId => {
    const link = document.getElementById(linkId)
    link?.addEventListener('click', () => {
      // Only auto-close on mobile when sidebar is active
      if (window.innerWidth <= 768 && sidebarEl?.classList.contains('active')) {
        sidebarEl.classList.remove('active')
        menuToggle?.classList.remove('hidden')
      }
    })
  })
}

// Initialize navigation auto-close
setupNavigationAutoClose()
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  // Show custom confirmation modal before logout
  const confirmed = await showModal({
    title: 'Cerrar Sesión',
    message: '¿Estás seguro de que quieres cerrar sesión?',
    confirmText: 'Cerrar Sesión',
    cancelText: 'Cancelar',
    type: 'confirm'
  })
  
  if (confirmed) {
    // Import logout function dynamically to avoid circular imports
    const { logout } = await import('./state/authStore.js')
    logout()
  }
})

/**
 * Updates user information in the sidebar
 */
function updateUserInfo() {
  const userInfo = document.getElementById('userInfo')
  const userName = document.getElementById('userName')
  const userEmail = document.getElementById('userEmail')
  
  try {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}')
    if (user && user.firstname && user.email) {
      userName.textContent = `${user.firstname} ${user.lastname || ''}`.trim()
      userEmail.textContent = user.email
      userInfo.style.display = 'flex'
    } else {
      userInfo.style.display = 'none'
    }
  } catch {
    userInfo.style.display = 'none'
  }
}

/**
 * Synchronizes active menu link highlighting and controls sidebar visibility
 * Hides sidebar for unauthenticated users and auth routes
 */
async function syncActiveLink() {
  const path = window.location.hash.replace('#','') || '/'
  const links = [['#/tasks','navTasks'],['#/tasks/new','navNew'],['#/profile','navProfile'],['#/about','navAbout']]
  links.forEach(([href,id]) => {
    const el = document.getElementById(id)
    if (!el) return
    if (href === window.location.hash) el.classList.add('active')
    else el.classList.remove('active')
  })
  // Hide sidebar when not authenticated (except in auth routes)
  // Import isAuthenticated dynamically to avoid circular imports
  const { isAuthenticated } = await import('./state/authStore.js')
  const authed = isAuthenticated()
  const authRoute = ['#/login','#/signup'].includes(window.location.hash)
  // Reset password routes deshabilitadas: '#/forgot-password','#/reset-password','#/reset'
  document.getElementById('sidebar').style.display = authed && !authRoute ? 'flex' : 'none'
  document.getElementById('menuToggle').style.display = authed && !authRoute ? 'block' : 'none'
  
  // Update user info when authenticated
  if (authed && !authRoute) {
    updateUserInfo()
  }
}
window.addEventListener('hashchange', syncActiveLink)
syncActiveLink()

// Handle direct URLs first
handleDirectURLs()

// Mount router into view container
const viewElement = document.getElementById('view')
if (viewElement) {
  startRouter(viewElement)
} else {
  console.error('View element not found')
}

// Start token expiration checking
import('./state/authStore.js').then(({ startTokenExpirationCheck }) => {
  startTokenExpirationCheck()
})

} // End of block
