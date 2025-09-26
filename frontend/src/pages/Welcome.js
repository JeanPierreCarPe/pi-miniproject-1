/**
 * Welcome page component with the same visual style as Login
 * @returns {HTMLElement} The welcome page element
 */
export default function Welcome() {
  const div = document.createElement('div')
  div.className = 'auth-screen'
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
      
      .auth-screen{
        min-height:100vh;
        background: var(--background-gradient);
        display:grid;
        grid-template-columns:1fr 1fr;
        position: relative;
        overflow: hidden;
        padding: 40px;
        box-sizing: border-box;
      }
      .auth-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        border-radius: 24px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0,0,0,.15);
        background: #fff;
        max-width: 1200px;
        margin: auto;
        min-height: calc(100vh - 80px);
      }
      .auth-screen::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23A0522D" opacity="0.05"/><circle cx="75" cy="75" r="1" fill="%23A0522D" opacity="0.05"/><circle cx="50" cy="10" r="0.5" fill="%23A0522D" opacity="0.03"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        pointer-events: none;
      }
      .auth-img{
        display:none; 
        position: relative; 
        overflow: hidden;
      }
      .auth-card{
        display:flex;
        align-items:center;
        justify-content:center;
        padding:40px; 
        background: var(--card-gradient);
        backdrop-filter: blur(20px);
      }
      .auth-card .card{
        width:100%;
        max-width:480px;
        background: transparent;
        box-shadow: none;
        border-radius: 0;
        padding:0;
        border: none;
        animation: slideInFromRight 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      .welcome-content {
        text-align: center;
      }
      .welcome-title {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--text-dark);
        margin: 0 0 16px 0;
        line-height: 1.2;
        background: linear-gradient(135deg, var(--text-dark) 0%, var(--primary-color) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .welcome-subtitle {
        font-size: 1.1rem;
        color: var(--text-gray);
        line-height: 1.6;
        margin: 0 0 32px 0;
        transition: transform 0.3s ease;
      }
      .welcome-subtitle:hover {
        transform: translateY(-2px);
      }
      .features-preview {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin: 24px 0;
        padding: 20px;
        background: rgba(160, 82, 45, 0.05);
        border-radius: 16px;
        border: 1px solid rgba(160, 82, 45, 0.1);
      }

      .feature-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 0;
        color: var(--text-gray);
        font-size: 14px;
        font-weight: 500;
      }

      .feature-item i {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-color);
        font-size: 16px;
      }

      .welcome-buttons {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 24px;
      }
      .btn-primary, .btn-secondary {
        padding: 16px 24px;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        position: relative;
        overflow: hidden;
      }
      .btn-primary {
        background: var(--primary-color);
        color: white;
        box-shadow: 0 4px 15px rgba(160, 82, 45, 0.3);
      }
      .btn-primary:hover {
        background: var(--primary-dark);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(160, 82, 45, 0.4);
      }
      .btn-primary:active {
        transform: translateY(0);
      }
      .btn-secondary {
        background: transparent;
        color: var(--primary-color);
        border: 2px solid var(--primary-color);
        box-shadow: 0 4px 15px rgba(160, 82, 45, 0.1);
      }
      .btn-secondary:hover {
        background: var(--primary-color);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(160, 82, 45, 0.2);
      }
      .btn-secondary:active {
        transform: translateY(0);
      }
      .welcome-footer {
        color: var(--text-gray);
        font-size: 0.9rem;
        opacity: 0.8;
        transition: opacity 0.3s ease;
      }
      .welcome-footer:hover {
        opacity: 1;
      }
      
      @media(min-width:768px){ 
        .auth-screen{
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .auth-img{
          display:block; 
          position:relative;
          flex: 1;
        } 
        .auth-img img{
          width:100%;
          height:100%;
          object-fit:cover;
          object-position: center;
          loading: lazy;
        } 
        .auth-img::after{
          content:'';
          position:absolute;
          inset:0;
          background: linear-gradient(45deg, rgba(160,82,45,0.4), rgba(139,69,19,0.6));
        }
        .auth-card{
          flex: 1;
          padding: 40px;
          background: var(--card-gradient);
        }
        .auth-card .card{
          padding: 0;
        }
        .features-preview {
          flex-direction: row;
          justify-content: space-around;
          gap: 16px;
        }

        .feature-item {
          flex-direction: column;
          text-align: center;
          gap: 8px;
          font-size: 12px;
        }

        .feature-item i {
          font-size: 18px;
        }

        .welcome-buttons {
          flex-direction: row;
          justify-content: center;
        }
        .btn-primary, .btn-secondary {
          flex: 1;
          max-width: 200px;
          min-height: 54px;
        }
      }
      @media(max-width:767px){
        .auth-screen{
          grid-template-columns: 1fr;
          padding: 16px;
          min-height: 100vh;
          align-items: flex-start;
          padding-top: 60px;
        }
        .auth-container{
          grid-template-columns: 1fr;
          border-radius: 20px;
          min-height: auto;
          box-shadow: 0 20px 40px rgba(0,0,0,.15);
          background: transparent;
          margin: 0;
        }
        .auth-card{
          padding: 0;
          width: 100%;
          background: transparent;
        }
        .auth-card .card{
          width: 100%;
          max-width: 100%;
          background: var(--card-gradient);
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 40px rgba(0,0,0,.15);
          border-radius: 20px;
          padding: 40px 28px;
          border: 1px solid rgba(255,255,255,0.2);
          box-sizing: border-box;
        }
        .welcome-title {
          font-size: 2rem;
        }
        .welcome-subtitle {
          font-size: 1rem;
        }
        .btn-primary, .btn-secondary {
          padding: 18px 24px;
          min-height: 58px;
        }
      }
      @media(max-width:480px){
        .auth-screen{
          padding: 12px;
          padding-top: 50px;
        }
        .auth-container{
          border-radius: 16px;
          min-height: auto;
        }
        .auth-card{
          padding: 0;
        }
        .auth-card .card{
          padding: 32px 20px;
          border-radius: 16px;
        }
        .welcome-title {
          font-size: 1.75rem;
        }
      }
      @keyframes slideInFromRight {
        from { opacity: 0; transform: translateX(30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes spin { 
        0% { transform: rotate(0deg); } 
        100% { transform: rotate(360deg); } 
      }
    </style>
    
    
    <div class="auth-container">
      <section class="auth-img">
        <img src="/login-bg.jpeg" alt="Persona organizando tareas de forma productiva" loading="lazy" />
      </section>
      <section class="auth-card">
        <div class="card">
          <div class="welcome-content">
            <h1 class="welcome-title">Bienvenido a TaskFlow</h1>
            <p class="welcome-subtitle">
              La herramienta perfecta para organizar tu vida y maximizar tu productividad. 
              Gestiona tus tareas de manera inteligente, mantén el control de tus proyectos 
              y alcanza tus objetivos con facilidad.
            </p>
            <div class="features-preview">
              <div class="feature-item">
                <i class="fas fa-columns"></i>
                <span>Organización Visual</span>
              </div>
              <div class="feature-item">
                <i class="fas fa-calendar-alt"></i>
                <span>Planificación Inteligente</span>
              </div>
              <div class="feature-item">
                <i class="fas fa-mobile-alt"></i>
                <span>Acceso Multiplataforma</span>
              </div>
            </div>
            <div class="welcome-buttons">
              <a href="#/login" class="btn-primary" id="loginBtn">
                <span>Iniciar Sesión</span>
              </a>
              <a href="#/signup" class="btn-secondary" id="signupBtn">
                <span>Registrarse</span>
              </a>
            </div>
            <p class="welcome-footer">
              "El comienzo de una vida más organizada"
            </p>
          </div>
        </div>
      </section>
    </div>`

  // Prefetch de recursos para mejor performance
  const prefetchLinks = ['/login-bg.jpeg', '#/login', '#/signup']
  prefetchLinks.forEach(link => {
    const prefetch = document.createElement('link')
    prefetch.rel = 'prefetch'
    prefetch.href = link
    document.head.appendChild(prefetch)
  })

  // Mejorar interactividad de botones
  const loginBtn = div.querySelector('#loginBtn')
  const signupBtn = div.querySelector('#signupBtn')

  // If already authenticated, replace buttons with "Ir al Panel"
  try {
    const hasToken = !!localStorage.getItem('auth_token')
    if (hasToken) {
      const buttonsWrap = div.querySelector('.welcome-buttons')
      if (buttonsWrap) {
        buttonsWrap.innerHTML = `<a href="#/tasks" class="btn-primary" id="dashboardBtn"><span>Ir al Panel</span></a>`
        const dashboardBtn = div.querySelector('#dashboardBtn')
        dashboardBtn?.addEventListener('click', (e) => {
          e.preventDefault()
          window.location.hash = '#/tasks'
          window.dispatchEvent(new HashChangeEvent('hashchange'))
        })
      }
    }
  } catch {}

  loginBtn.addEventListener('click', (e) => {
    e.preventDefault()
    window.location.hash = '#/login'
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  })
  
  signupBtn.addEventListener('click', (e) => {
    e.preventDefault()
    window.location.hash = '#/signup'
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  })

  // Mejorar accesibilidad
  div.querySelectorAll('a').forEach(link => {
    link.setAttribute('role', 'button')
    link.setAttribute('aria-label', link.textContent.trim())
  })

  // Añadir meta información semántica
  div.setAttribute('role', 'main')
  div.setAttribute('aria-label', 'Página de bienvenida de Touchflow')

  return div
}