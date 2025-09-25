/**
 * Main application entry point
 * Initializes the SPA router, sets up layout, and handles global UI elements like sidebar and logout
 */
import { startRouter } from './router/index'
import { showModal, showToast } from './components/Modal.js'
import './styles/base.css'
import './styles/layout.css'
import './styles/form.css'
import './styles/task.css'

// Handle direct URLs without hash (for email links)
function handleDirectURLs() {
  const path = window.location.pathname
  const search = window.location.search
  const routes = ['/login', '/signup', '/tasks', '/profile']
  // Rutas de reset password deshabilitadas para este sprint: '/reset', '/reset-password', '/forgot-password'
  
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
          <a href="#/about" id="navAbout"><i class="icon fas fa-info-circle"></i><span>Sobre Nosotros</span></a>
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
  const links = [['#/tasks','navTasks'],['#/tasks/new','navNew'],['#/profile','navProfile'],['#/about','navAbout']]
  links.forEach(([href,id]) => {
    const el = document.getElementById(id)
    if (!el) return
    if (href === window.location.hash) el.classList.add('active')
    else el.classList.remove('active')
  })
  // Hide sidebar when not authenticated (except in auth routes)
  const authed = !!localStorage.getItem('auth_token')
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

// Agregar la ruta para "Sobre Nosotros" al router
// Esto debe hacerse en el archivo router/index.js, pero como no podemos modificarlo directamente,
// agregamos un listener para manejar la ruta about
window.addEventListener('hashchange', function() {
  if (window.location.hash === '#/about') {
    const viewElement = document.getElementById('view');
    if (viewElement) {
      viewElement.innerHTML = `
        <div class="container">
          <div class="header">
            <div class="welcome-text">
              <h1>Sobre Nosotros</h1>
              <p>Conoce al equipo detrás de TaskFlow</p>
            </div>
          </div>
          
          <div class="about-container">
            <div class="about-content">
              <p>Somos Bugbusters, un equipo de cinco desarrolladores de software apasionados por crear soluciones innovadoras y de calidad. Nuestro Product Owner, Jean Pierre Cardenas, lidera la visión del proyecto y asegura que cada entrega cumpla con los objetivos estratégicos. John Freidy Lubrido, experto en bases de datos, garantiza que la información fluya de manera segura y eficiente. Laura Valentina Arbeláez, especialista en frontend, convierte las ideas en experiencias de usuario atractivas y funcionales. Juan David Olaya, encargado de las pruebas de usabilidad, vela porque cada detalle sea intuitivo y fácil de usar. Finalmente, Cristin DanielGuaza, nuestro desarrollador backend, asegura que la lógica y el rendimiento del sistema sean impecables. Juntos combinamos creatividad, técnica y pasión para enfrentar cualquier reto, siempre con la energía de un verdadero equipo que transforma los bugs en oportunidades. 🚀✨</p>
            </div>
          </div>
        </div>
        
        <style>
          .about-container {
            background: linear-gradient(135deg, #fff 0%, #fefefe 100%);
            border-radius: 24px;
            box-shadow: 0 12px 32px rgba(0,0,0,.08);
            padding: 40px;
            border: 1px solid rgba(0,0,0,.06);
            margin-top: 20px;
          }
          
          .about-content {
            line-height: 1.6;
            color: #333;
            font-size: 16px;
          }
          
          .about-content p {
            margin: 0;
          }
          
          @media (max-width: 768px) {
            .about-container {
              padding: 24px;
              border-radius: 20px;
            }
          }
        </style>
      `;
    }
  }
});

<<<<<<< Updated upstream
=======
// Event listener for task deletion modal
window.addEventListener('openTaskDeleteModal', async (e) => {
  const task = e.detail.task
  
  // Mostrar el modal de confirmación
  const confirmed = await showModal({
    title: 'Eliminar tarea',
    message: `¿Seguro que deseas eliminar la tarea <strong>${task.Title}</strong>?`,
    confirmText: 'Sí, eliminar',
    cancelText: 'Cancelar',
    type: 'error'
  })

  if (confirmed) {
    // Lanza el evento real de eliminación
    window.dispatchEvent(new CustomEvent('deleteTask', { detail: { task } }))
    
    // Muestra notificación de éxito
    showToast('Tarea eliminada con éxito', 'success')
  }
})

>>>>>>> Stashed changes
} // End of block