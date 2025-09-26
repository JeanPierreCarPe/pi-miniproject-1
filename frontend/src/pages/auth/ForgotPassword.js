import { emailRFC5322 } from '../../utils/validators'
import { requestPasswordReset } from '../../api/auth'

/**
 * Forgot password page with spinner (≤ 3s) and toast message
 * @returns {HTMLElement} The forgot password page element
 */
export default function ForgotPassword() {
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
      .auth-img{display:none; position: relative; overflow: hidden;}
      .auth-card{
        display:flex;
        align-items:center;
        justify-content:center;
        padding:24px; 
        position: relative; 
        z-index: 1;
        min-height: 100vh;
      }
      .auth-card .card{
        width:100%;
        max-width:480px;
        background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%);
        backdrop-filter: blur(20px);
        box-shadow:0 20px 40px rgba(0,0,0,.15);
        border-radius:24px;
        padding:32px;
        border: 1px solid rgba(255,255,255,0.2);
        animation: slideInFromRight 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        margin: auto 0;
      }
      @media(min-width:768px){ 
        .auth-screen{
          align-items: stretch;
        }
        .auth-img{
          display:block; 
          position:relative;
          min-height: 100vh;
        } 
        .auth-img img{
          width:100%;
          height:100%;
          min-height: 100vh;
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
          padding: 40px 32px;
          align-items: center;
        }
        .auth-card .card{
          padding: 40px;
          margin: 0;
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
        .auth-card{
          padding: 0;
          width: 100%;
        }
        .auth-card .card{
          max-width: 100%;
          padding: 28px 20px;
          border-radius: 20px;
          width: 100%;
          box-sizing: border-box;
        }
      }
      @media(max-width:480px){
        .auth-screen{
          padding: 12px;
          padding-top: 30px;
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
    </style>
    <section class="auth-img"><img src="/login-bg.jpeg" alt="Imagen" /></section>
    <section class="auth-card">
      <div class="card">
        <h2 style="text-align:center;margin:0 0 8px;">Recuperar contraseña</h2>
        <p style="text-align:center;margin:0 0 16px;color:#374151;">Ingresa tu correo para recibir un enlace</p>
            <form id="formEmail" class="form">
              <div class="form-group" id="group-email">
                <label for="email">Correo electrónico</label>
                <input id="email" type="email" placeholder="ejemplo@gmail.com" />
              </div>
              <div id="success-message" style="display:none;" class="success-feedback">
                <div class="success-icon">
                  <i class="fas fa-check-circle"></i>
                </div>
                <div class="success-content">
                  <h4>¡Correo enviado exitosamente!</h4>
                  <p>Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.</p>
                  <small>Si no encuentras el correo, revisa tu carpeta de spam.</small>
                  <button id="try-again-btn" class="btn-secondary" style="margin-top:12px;">Usar otro correo</button>
                </div>
              </div>
              <button id="sendLinkBtn" class="btn" type="submit" disabled style="width:100%;display:flex;align-items:center;justify-content:center;gap:8px">
                <span id="btn-text">Enviar enlace</span>
                <div id="spinner" style="display:none;width:16px;height:16px;border:2px solid transparent;border-top:2px solid #fff;border-radius:50%;animation:spin 1s linear infinite"></div>
              </button>
            </form>
        <div id="toast" style="display:none;position:fixed;top:20px;right:20px;background:#065F46;color:#fff;padding:12px 20px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.15);z-index:1000"></div>
        <style>
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          
          .success-feedback {
            background: linear-gradient(135deg, #D1FAE5, #A7F3D0);
            border: 2px solid #10B981;
            border-radius: 16px;
            padding: 20px;
            margin: 16px 0;
            display: flex;
            align-items: flex-start;
            gap: 16px;
            animation: bounceIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          
          .success-icon {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #10B981;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 24px;
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          }
          
          .success-content {
            flex: 1;
          }
          
          .success-content h4 {
            color: #065F46;
            font-size: 18px;
            font-weight: 700;
            margin: 0 0 8px 0;
          }
          
          .success-content p {
            color: #047857;
            font-size: 15px;
            font-weight: 500;
            margin: 0 0 8px 0;
            line-height: 1.4;
          }
          
          .success-content small {
            color: #059669;
            font-size: 13px;
            font-weight: 400;
            display: block;
          }
          
          .btn-secondary {
            background: transparent;
            color: #047857;
            border: 2px solid #10B981;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-block;
          }
          
          .btn-secondary:hover {
            background: #10B981;
            color: #fff;
            transform: translateY(-1px);
          }
          
          @media (max-width: 768px) {
            .success-feedback {
              flex-direction: column;
              text-align: center;
              padding: 16px;
            }
            
            .success-icon {
              margin: 0 auto;
              width: 40px;
              height: 40px;
              font-size: 20px;
            }
            
            .success-content h4 {
              font-size: 16px;
            }
            
            .success-content p {
              font-size: 14px;
            }
            
            .success-content small {
              font-size: 12px;
            }
          }
          
          @keyframes bounceIn {
            0% { opacity: 0; transform: scale(0.3) translateY(20px); }
            50% { opacity: 1; transform: scale(1.05) translateY(-5px); }
            70% { transform: scale(0.98) translateY(2px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
        </style>
        <p style="text-align:center;margin-top:16px"><a href="#/login" style="color:#A0522D">Volver a iniciar sesión</a></p>
      </div>
    </section>`

  const form = div.querySelector('#formEmail')
  const email = div.querySelector('#email')
  const submit = div.querySelector('#sendLinkBtn')
  const groupEmail = div.querySelector('#group-email')
  const btnText = div.querySelector('#btn-text')
  const spinner = div.querySelector('#spinner')
  const toast = div.querySelector('#toast')
  const successMessage = div.querySelector('#success-message')
  const tryAgainBtn = div.querySelector('#try-again-btn')
  
  // Track user interaction to show errors only after interaction
  const userInteracted = { email: false }

  const setDisabled = (el, d) => d ? el.setAttribute('disabled','true') : el.removeAttribute('disabled')
  
  /**
   * Shows error messages in aria-live regions
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
   * Shows toast message for 3 seconds
   * @param {string} message - The toast message
   */
  function showToast(message) {
    toast.textContent = message
    toast.style.display = 'block'
    setTimeout(() => {
      toast.style.display = 'none'
    }, 3000)
  }
  
  /**
   * Validates email field
   * @returns {boolean} True if email is valid
   */
  function validate() {
    const ok = emailRFC5322.test(email.value)
    
    // Only show error if user has interacted with the field
    if (!ok && userInteracted.email) {
      announce(groupEmail, 'Ingresa un correo electrónico válido')
    } else if (ok) {
      announce(groupEmail, '')
    }
    
    setDisabled(submit, !ok)
    return ok
  }
  
  // Mark user interaction and validate
  email.addEventListener('input', () => {
    userInteracted.email = true
    validate()
  })
  
  email.addEventListener('blur', () => {
    userInteracted.email = true
    validate()
  })
  
  // Initial validation without showing errors
  validate()
  
  // Try again button functionality
  tryAgainBtn.addEventListener('click', () => {
    successMessage.style.display = 'none'
    email.style.display = 'block'
    submit.style.display = 'flex'
    groupEmail.querySelector('label').style.display = 'block'
    email.value = ''
    validate()
  })
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (!validate()) return
    
    // Show spinner (≤ 3s requirement)
    setDisabled(submit, true)
    btnText.style.display = 'none'
    spinner.style.display = 'block'
    
    try {
      await requestPasswordReset(email.value.trim())
      // Backend responds HTTP 200 and sends email
      // Show success message in the form instead of toast
      successMessage.style.display = 'flex'
      email.style.display = 'none'
      submit.style.display = 'none'
      groupEmail.querySelector('label').style.display = 'none'
      announce(groupEmail, '') // Clear any error
      
      // Also show toast for additional feedback
      showToast('Revisa tu correo para continuar')
    } catch (err) {
      announce(groupEmail, 'Inténtalo más tarde')
    } finally {
      // Hide spinner and restore button
      spinner.style.display = 'none'
      btnText.style.display = 'block'
      setDisabled(submit, false)
    }
  })

  return div
}


