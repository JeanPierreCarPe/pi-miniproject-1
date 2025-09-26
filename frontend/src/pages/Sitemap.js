export default function Sitemap() {
  const div = document.createElement('div')
  div.innerHTML = `
    <style>
      :root {
        --primary-color: #A0522D;
        --primary-dark: #8B4513;
        --text-dark: #1F2937;
        --text-gray: #374151;
        --background-gradient: linear-gradient(135deg, #F5E8D3 0%, #E8D3B0 100%);
        --card-gradient: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%);
      }

      .sitemap-container {
        min-height: 100vh;
        background: var(--background-gradient);
        padding: 2rem;
        position: relative;
      }

      .sitemap-content {
        max-width: 800px;
        margin: 0 auto;
        text-align: center;
        position: relative;
        z-index: 1;
      }

      .sitemap-title {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        line-height: 1.2;
        background: linear-gradient(135deg, var(--text-dark) 0%, var(--primary-color) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 700;
      }

      .sitemap-subtitle {
        font-size: 1.1rem;
        color: var(--text-gray);
        margin-bottom: 3rem;
        line-height: 1.6;
      }

      .sitemap-card {
        background: var(--card-gradient);
        backdrop-filter: blur(20px);
        border-radius: 24px;
        padding: 2rem;
        box-shadow: 0 20px 40px rgba(0,0,0,.15);
        margin-bottom: 2rem;
      }

      .sitemap-card h2 {
        color: var(--text-dark);
        margin-bottom: 1.5rem;
        border-bottom: 2px solid rgba(160, 82, 45, 0.2);
        padding-bottom: 0.5rem;
        font-weight: 600;
      }

      .pages-sections {
        display: grid;
        gap: 1.5rem;
        text-align: left;
      }

      .pages-section {
        padding: 1.5rem;
        border-radius: 16px;
        border: 1px solid rgba(160, 82, 45, 0.1);
      }

      .pages-section.public {
        background: rgba(160, 82, 45, 0.05);
        border-left: 4px solid var(--primary-color);
      }

      .pages-section.private {
        background: rgba(160, 82, 45, 0.08);
        border-left: 4px solid var(--primary-dark);
        border: 1px solid rgba(160, 82, 45, 0.15);
      }

      .section-title {
        color: var(--text-dark);
        margin-bottom: 1rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .auth-badge {
        background: var(--primary-color);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 500;
        box-shadow: 0 2px 8px rgba(160, 82, 45, 0.3);
      }

      .pages-list {
        margin: 0;
        padding-left: 1.5rem;
        color: var(--text-gray);
        list-style: none;
      }

      .pages-list li {
        margin-bottom: 0.75rem;
        line-height: 1.5;
      }

      .pages-list li:last-child {
        margin-bottom: 0;
      }

      .page-link {
        color: var(--text-dark);
        text-decoration: none;
        font-weight: 600;
        transition: color 0.3s ease;
      }

      .page-link:hover {
        color: var(--primary-color);
      }

      .page-description {
        color: var(--text-gray);
      }

      .sitemap-navigation {
        margin-top: 2rem;
      }

      .back-home-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--primary-color);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(160, 82, 45, 0.3);
        position: relative;
        overflow: hidden;
      }

      .back-home-btn:hover {
        background: var(--primary-dark);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(160, 82, 45, 0.4);
      }

      .back-home-btn:active {
        transform: translateY(0);
      }
    </style>
    
    <div class="sitemap-container">
      <div class="sitemap-content">
        
        <!-- Header -->
        <h1 class="sitemap-title">Mapa del Sitio</h1>
        <p class="sitemap-subtitle">Todas las páginas de TaskFlow</p>
        
        <!-- Pages List -->
        <div class="sitemap-card">
          
          <h2>Páginas Disponibles</h2>
          
          <div class="pages-sections">
            
            <!-- Public Pages -->
            <div class="pages-section public">
              <h3 class="section-title">Páginas Públicas</h3>
              <ul class="pages-list">
                <li>
                  <a href="#/" class="page-link">Inicio</a> 
                  <span class="page-description"> - Página principal de bienvenida</span>
                </li>
                <li>
                  <a href="#/login" class="page-link">Iniciar Sesión</a>
                  <span class="page-description"> - Para usuarios registrados</span>
                </li>
                <li>
                  <a href="#/signup" class="page-link">Registrarse</a>
                  <span class="page-description"> - Crear nueva cuenta</span>
                </li>
                <li>
                  <a href="#/forgot-password" class="page-link">Recuperar Contraseña</a>
                  <span class="page-description"> - ¿Olvidaste tu contraseña?</span>
                </li>
                <li>
                  <a href="#/sitemap" class="page-link">Mapa del Sitio</a>
                  <span class="page-description"> - Esta página</span>
                </li>
              </ul>
            </div>
            
            <!-- Private Pages -->
            <div class="pages-section private">
              <h3 class="section-title">
                Páginas Privadas 
                <small class="auth-badge">Requiere Login</small>
              </h3>
              <ul class="pages-list">
                <li>
                  <a href="#/tasks" class="page-link">Mis Tareas</a>
                  <span class="page-description"> - Ver y gestionar todas tus tareas</span>
                </li>
                <li>
                  <a href="#/tasks/new" class="page-link">Nueva Tarea</a>
                  <span class="page-description"> - Crear una nueva tarea</span>
                </li>
                <li>
                  <a href="#/profile" class="page-link">Mi Perfil</a>
                  <span class="page-description"> - Ver información personal</span>
                </li>
                <li>
                  <a href="#/profile/edit" class="page-link">Editar Perfil</a>
                  <span class="page-description"> - Actualizar datos personales</span>
                </li>
                <li>
                  <a href="#/about" class="page-link">Acerca de</a>
                  <span class="page-description"> - Información sobre TaskFlow</span>
                </li>
              </ul>
            </div>
            
          </div>
          
        </div>
        
        <!-- Navigation -->
        <div class="sitemap-navigation">
          <a href="#/" class="back-home-btn">
            ← Volver al Inicio
          </a>
        </div>
        
      </div>
    </div>
  `

  // Set page title
  document.title = 'Mapa del Sitio - TaskFlow'

  // Add hover effects and click handlers for all navigation links
  const allLinks = div.querySelectorAll('.page-link, .back-home-btn')
  allLinks.forEach(link => {
    // Add click handler for navigation
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const href = link.getAttribute('href')
      window.location.hash = href
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
  })

  return div
}