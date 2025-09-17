import { emailRFC5322 } from '../../utils/validators'
import { login } from '../../api/auth'
import { setToken, setUser } from '../../state/authStore'

/**
 * Login page component with RFC 5322 email validation and aria-live error messages
 * @returns {HTMLElement} The login page element
 */
export default function Login() {
  const div = document.createElement('div')
  div.className = 'auth-screen'
  div.innerHTML = `
    <style>
      .auth-screen{
        min-height:100vh;
        background: linear-gradient(135deg, #F5E8D3 0%, #E8D3B0 100%);
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
        background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%);
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
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%);
        }
        .auth-card .card{
          padding: 0;
        }
      }
      @media(max-width:767px){
        .auth-screen{
          grid-template-columns: 1fr;
          padding: 16px;
          min-height: 100vh;
          align-items: flex-start;
          padding-top: 40px;
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
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%);
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 40px rgba(0,0,0,.15);
          border-radius: 20px;
          padding: 28px 20px;
          border: 1px solid rgba(255,255,255,0.2);
          box-sizing: border-box;
        }
      }
      @media(max-width:480px){
        .auth-screen{
          padding: 12px;
          padding-top: 30px;
        }
        .auth-container{
          border-radius: 16px;
          min-height: auto;
        }
        .auth-card{
          padding: 0;
        }
        .auth-card .card{
          padding: 24px 18px;
          border-radius: 16px;
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
      <section class="auth-img"><img src="/login-bg.jpeg" alt="Imagen" /></section>
      <section class="auth-card">
        <div class="card">
          <h2 style="text-align:center;margin:0 0 8px;">Iniciar sesión</h2>
          <p style="text-align:center;margin:0 0 16px;color:#374151;">¡Bienvenido de nuevo!</p>
              <form id="loginForm" class="form">
                <div class="form-group" id="group-email"><label for="email">Correo electrónico</label><input id="email" type="email" placeholder="Correo" /></div>
                <div class="form-group" id="group-password"><label for="password">Contraseña</label><input id="password" type="password" placeholder="Contraseña" /></div>
                <!-- Funcionalidad de recuperar contraseña deshabilitada para este sprint -->
                <!-- <div class="forgot-password-link"><a href="#/forgot-password">¿Olvidaste tu contraseña?</a></div> -->
                <button id="loginBtn" class="btn" type="submit" disabled style="width:100%;display:flex;align-items:center;justify-content:center;gap:8px">
                  <span id="btn-text">Iniciar sesión</span>
                  <div id="spinner" style="display:none;width:16px;height:16px;border:2px solid transparent;border-top:2px solid #fff;border-radius:50%;animation:spin 1s linear infinite"></div>
                </button>
              </form>
          <p style="text-align:center;margin-top:16px;color:#374151;">¿No tienes una cuenta? <a href="#/signup" style="color:#A0522D">Regístrate</a></p>
        </div>
      </section>
    </div>`

  const form = div.querySelector('#loginForm')
  const email = div.querySelector('#email')
  const password = div.querySelector('#password')
  const submit = div.querySelector('#loginBtn')
  const btnText = div.querySelector('#btn-text')
  const spinner = div.querySelector('#spinner')
  const emailGroup = div.querySelector('#group-email')
  const passGroup = div.querySelector('#group-password')

  // Track user interaction to show errors only after interaction
  const userInteracted = { email: false, password: false }

  const setDisabled = (el, d) => d ? el.setAttribute('disabled','true') : el.removeAttribute('disabled')
  
  /**
   * Shows error messages in aria-live regions that disappear when field is corrected
   * @param {HTMLElement} container - The form group container
   * @param {string} msg - The error message to show (empty to hide)
   */
  function announce(container, msg) {
    let t = container.querySelector('[data-tooltip]')
    if (!t) { 
      t = document.createElement('div')
      t.dataset.tooltip='true'
      t.setAttribute('aria-live','polite')
      t.style.cssText = 'color:#B91C1C;font-size:12px;margin-top:6px;background:#FEF2F2;padding:4px 8px;border-radius:4px;border-left:3px solid #DC2626;display:none'
      container.appendChild(t)
    }
    t.textContent = msg || ''
    t.style.display = msg ? 'block' : 'none'
  }
  
  /**
   * Validates login fields according to HU requirements
   * Button disabled until both email (RFC 5322) and password are valid
   * Only shows errors after user interaction
   * @returns {boolean} True if all fields are valid
   */
  function validate() {
    let ok = true
    
    // Correo electrónico - RFC 5322 format
    if (!emailRFC5322.test(email.value)) { 
      if (userInteracted.email) {
        announce(emailGroup, 'Ingresa un correo electrónico válido')
      }
      ok = false 
    } else announce(emailGroup, '')
    
    // Contraseña - required field
    if (!password.value.trim()) { 
      if (userInteracted.password) {
        announce(passGroup, 'Ingresa tu contraseña')
      }
      ok = false 
    } else announce(passGroup, '')
    
    // Button disabled until both fields valid
    setDisabled(submit, !ok)
    return ok
  }
  // Mark user interaction and validate
  email.addEventListener('input', () => {
    userInteracted.email = true
    validate()
  })
  
  password.addEventListener('input', () => {
    userInteracted.password = true
    validate()
  })
  
  // Also mark interaction on focus/blur
  email.addEventListener('blur', () => {
    userInteracted.email = true
    validate()
  })
  
  password.addEventListener('blur', () => {
    userInteracted.password = true
    validate()
  })
  
  validate()

  // Check for expired token message
  const loginMessage = sessionStorage.getItem('loginMessage')
  if (loginMessage) {
    announce(passGroup, loginMessage)
    sessionStorage.removeItem('loginMessage')
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); if (!validate()) return
    
    // Show spinner and disable button
    setDisabled(submit, true)
    btnText.style.display = 'none'
    spinner.style.display = 'block'
    
    try {
      const res = await login({ email: email.value.trim(), password: password.value })
      
      // Set user and token asynchronously to avoid blocking
      setTimeout(() => {
        setUser(res.user)
        setToken(res.token)
        // Force router to update by dispatching hashchange event
        window.location.hash = '#/tasks'
        window.dispatchEvent(new HashChangeEvent('hashchange'))
      }, 0)
      
    } catch (err) {
      announce(passGroup, err.status >= 500 ? 'Inténtalo más tarde' : (err.message || 'Credenciales inválidas'))
    } finally { 
      // Hide spinner and enable button
      spinner.style.display = 'none'
      btnText.style.display = 'block'
      setDisabled(submit, false) 
    }
  })

  return div
}


