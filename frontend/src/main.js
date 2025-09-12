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
  const navLinks = ['navTasks', 'navNew', 'navProfile']
  
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
    // Stateless logout: remove local token and go to login
    try { localStorage.removeItem('auth_token'); localStorage.removeItem('auth_user') } catch {}
    window.location.hash = '#/login'
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
function syncActiveLink() {
  const path = window.location.hash.replace('#','') || '/'
  const links = [['#/tasks','navTasks'],['#/tasks/new','navNew'],['#/profile','navProfile']]
  links.forEach(([href,id]) => {
    const el = document.getElementById(id)
    if (!el) return
    if (href === window.location.hash) el.classList.add('active')
    else el.classList.remove('active')
  })
  // Hide sidebar when not authenticated (except in auth routes)
  const authed = !!localStorage.getItem('auth_token')
  const authRoute = ['#/login','#/signup','#/forgot-password','#/reset-password'].includes(window.location.hash)
  document.getElementById('sidebar').style.display = authed && !authRoute ? 'flex' : 'none'
  document.getElementById('menuToggle').style.display = authed && !authRoute ? 'block' : 'none'
  
  // Update user info when authenticated
  if (authed && !authRoute) {
    updateUserInfo()
  }
}
window.addEventListener('hashchange', syncActiveLink)
syncActiveLink()

// Mount router into view container
startRouter(document.getElementById('view'))
