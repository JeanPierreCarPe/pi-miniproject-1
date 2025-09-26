import { emailRFC5322, passwordSignup, isValidAge, isNonEmpty } from '../../utils/validators'
import { signup } from '../../api/auth'
import { setToken, setUser } from '../../state/authStore'

export default function Signup() {
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
        max-width:560px;
        background: transparent;
        box-shadow: none;
        border-radius: 0;
        padding:0;
        border: none;
        animation: slideInFromLeft 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
      @keyframes slideInFromLeft {
        from { opacity: 0; transform: translateX(-30px); }
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
          <h2 style="text-align:center;margin:0 0 8px;">Crear cuenta</h2>
          <p style="text-align:center;margin:0 0 16px;color:#374151;">Completa los campos para registrarte</p>
          <form id="signupForm" class="form">
            <div class="form-grid">
              <div class="form-group" id="group-firstName"><label for="firstName">Nombres</label><input id="firstName" type="text" /></div>
              <div class="form-group" id="group-lastName"><label for="lastName">Apellidos</label><input id="lastName" type="text" /></div>
            </div>
            <div class="form-group" id="group-age"><label for="age">Edad</label><input id="age" type="number" min="13" /></div>
            <div class="form-group" id="group-email"><label for="email">Correo electrónico</label><input id="email" type="email" /></div>
            <div class="form-group" id="group-password"><label for="password">Contraseña</label><input id="password" type="password" placeholder="Mín. 8, mayúscula, minúscula, número y especial" /></div>
            <div class="form-group" id="group-confirmPassword"><label for="confirmPassword">Confirmar contraseña</label><input id="confirmPassword" type="password" /></div>
            <button id="signupBtn" class="btn" type="submit" disabled style="width:100%;display:flex;align-items:center;justify-content:center;gap:8px">
              <span id="btn-text">Registrarse</span>
              <div id="spinner" style="display:none;width:16px;height:16px;border:2px solid transparent;border-top:2px solid #fff;border-radius:50%;animation:spin 1s linear infinite"></div>
            </button>
          </form>
          <p style="text-align:center;margin-top:16px;color:#374151;">¿Ya tienes cuenta? <a href="#/login" style="color:#A0522D">Inicia sesión</a></p>
        </div>
      </section>
    </div>`

  const form = div.querySelector('#signupForm')
  const firstname = div.querySelector('#firstName')
  const lastname = div.querySelector('#lastName')
  const age = div.querySelector('#age')
  const email = div.querySelector('#email')
  const password = div.querySelector('#password')
  const confirmPassword = div.querySelector('#confirmPassword')
  const submit = div.querySelector('#signupBtn')
  const btnText = div.querySelector('#btn-text')
  const spinner = div.querySelector('#spinner')
  const group = (id) => div.querySelector(`#group-${id}`)
  const setDisabled = (el, d) => d ? el.setAttribute('disabled','true') : el.removeAttribute('disabled')

  // Track user interaction to show errors only after interaction
  const userInteracted = { 
    firstname: false, 
    lastname: false, 
    age: false, 
    email: false, 
    password: false, 
    confirmPassword: false 
  }
  /**
   * Shows or hides tooltip error messages that disappear when field is corrected
   * @param {HTMLElement} container - The form group container
   * @param {string} msg - The error message to show (empty to hide)
   */
  function announce(container, msg) {
    let t = container.querySelector('[data-tooltip]')
    if (!t) { 
      t = document.createElement('div')
      t.dataset.tooltip='true'
      t.setAttribute('role','tooltip')
      t.setAttribute('aria-live','polite')
      t.style.cssText = 'color:#B91C1C;font-size:12px;margin-top:6px;background:#FEF2F2;padding:4px 8px;border-radius:4px;border-left:3px solid #DC2626;display:none'
      container.appendChild(t)
    }
    t.textContent = msg || ''
    t.style.display = msg ? 'block' : 'none'
  }
  /**
   * Validates all form fields according to HU requirements
   * Button remains disabled until all fields are valid
   * Only shows errors after user interaction
   * @returns {boolean} True if all fields are valid
   */
  function validate() {
    let ok = true
    
    // Nombres - required field
    if (!isNonEmpty(firstname.value)) { 
      if (userInteracted.firstname) {
        announce(group('firstName'), 'Completa este campo')
      }
      ok = false 
    } else announce(group('firstName'), '')
    
    // Apellidos - required field  
    if (!isNonEmpty(lastname.value)) { 
      if (userInteracted.lastname) {
        announce(group('lastName'), 'Completa este campo')
      }
      ok = false 
    } else announce(group('lastName'), '')
    
    // Edad - numeric ≥ 13, only digits
    if (!isValidAge(age.value) || age.value < 13) { 
      if (userInteracted.age) {
        announce(group('age'), 'La edad debe ser un número ≥ 13')
      }
      ok = false 
    } else announce(group('age'), '')
    
    // Correo electrónico - RFC 5322 format
    if (!emailRFC5322.test(email.value)) { 
      if (userInteracted.email) {
        announce(group('email'), 'Ingresa un correo electrónico válido')
      }
      ok = false 
    } else announce(group('email'), '')
    
    // Contraseña - ≥ 8 chars, min 1 uppercase, 1 number, 1 special char
    if (!passwordSignup.test(password.value)) { 
      if (userInteracted.password) {
        announce(group('password'), 'Mín. 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial')
      }
      ok = false 
    } else announce(group('password'), '')
    
    // Confirmar contraseña - must match password
    if (confirmPassword.value !== password.value || confirmPassword.value === '') { 
      if (userInteracted.confirmPassword) {
        announce(group('confirmPassword'), 'Las contraseñas no coinciden')
      }
      ok = false 
    } else announce(group('confirmPassword'), '')
    
    // Button disabled until all fields valid
    setDisabled(submit, !ok)
    return ok
  }
  // Mark user interaction and validate
  const fields = [
    { element: firstname, key: 'firstname' },
    { element: lastname, key: 'lastname' },
    { element: age, key: 'age' },
    { element: email, key: 'email' },
    { element: password, key: 'password' },
    { element: confirmPassword, key: 'confirmPassword' }
  ]
  
  fields.forEach(({ element, key }) => {
    element.addEventListener('input', () => {
      userInteracted[key] = true
      validate()
    })
    element.addEventListener('blur', () => {
      userInteracted[key] = true
      validate()
    })
  })
  
  validate()

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); if (!validate()) return
    
    // Show spinner and disable button
    setDisabled(submit, true)
    btnText.style.display = 'none'
    spinner.style.display = 'block'
    
    try {
      // Backend espera: firstname, lastname, age (entero), email, password
      const payload = {
        firstname: firstname.value.trim(),
        lastname: lastname.value.trim(),
        age: parseInt(age.value, 10),
        email: email.value.trim(),
        password: password.value
      }
      const res = await signup(payload)
      
      // Set user and token asynchronously to avoid blocking
      setTimeout(() => {
        setUser(res.user)
        setToken(res.token)
        // Force router to update by dispatching hashchange event
        window.location.hash = '#/tasks'
        window.dispatchEvent(new HashChangeEvent('hashchange'))
      }, 0)
      
    } catch (err) {
      // Mostrar el mensaje devuelto por el backend si existe
      const msg = err?.data?.message || err.message || 'Error de registro'
      announce(group('email'), msg)
    } finally { 
      // Hide spinner and enable button
      spinner.style.display = 'none'
      btnText.style.display = 'block'
      setDisabled(submit, false) 
    }
  })

  return div
}


