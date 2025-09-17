import { passwordReset } from '../../utils/validators'
import { verifyResetToken, resetPassword } from '../../api/auth'

export default function ResetPassword({ params }) {
  const token = params.get('token') || ''
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
        animation: slideInFromLeft 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
      @keyframes slideInFromLeft {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
      }
    </style>
    <section class="auth-img"><img src="/login-bg.jpeg" alt="Imagen" /></section>
    <section class="auth-card">
      <div class="card">
        <h2 style="text-align:center;margin:0 0 8px;">Restablecer contraseña</h2>
        <div id="invalidToken" style="display:none;color:#7A3E23;text-align:center;margin:12px 0;">Enlace inválido o caducado. <a href="#/forgot-password">Solicitar nuevo</a>.</div>
            <form id="resetForm" class="form">
              <div class="form-group" id="group-newPassword"><label for="newPassword">Nueva contraseña</label><input id="newPassword" type="password" placeholder="Mín. 8, mayúscula, minúscula, número y especial" /></div>
          <div class="form-group" id="group-confirmNewPassword"><label for="confirmNewPassword">Confirmar</label><input id="confirmNewPassword" type="password" /></div>
          <button id="resetBtn" class="btn" type="submit" disabled style="width:100%">Actualizar</button>
        </form>
      </div>
    </section>`

  const form = div.querySelector('#resetForm')
  const invalid = div.querySelector('#invalidToken')
  const newPassword = div.querySelector('#newPassword')
  const confirmPassword = div.querySelector('#confirmNewPassword')
  const submit = div.querySelector('#resetBtn')
  const group = (id) => div.querySelector(`#group-${id}`)
  const setDisabled = (el, d) => d ? el.setAttribute('disabled','true') : el.removeAttribute('disabled')
  /**
   * Shows error messages in aria-live regions
   * @param {HTMLElement} container - The form group container
   * @param {string} msg - The error message to show (empty to hide)
   */
  function announce(container, msg) { 
    let t = container.querySelector('[data-tooltip]')
    if(!t){ 
      t=document.createElement('div')
      t.dataset.tooltip='true'
      t.setAttribute('aria-live','polite')
      t.style.cssText = 'color:#B91C1C;font-size:12px;margin-top:6px;background:#FEF2F2;padding:4px 8px;border-radius:4px;border-left:3px solid #DC2626;display:none'
      container.appendChild(t)
    } 
    t.textContent=msg||''
    t.style.display=msg?'block':'none' 
  }
  
  /**
   * Validates reset password fields according to HU requirements
   * Password ≥ 8 chars, with uppercase, lowercase and number
   * Confirm password must match
   * @returns {boolean} True if all fields are valid
   */
  function validate(){ 
    let ok=true
    
        // Nueva contraseña - ≥ 8 chars, mayúscula, minúscula, número, carácter especial
        if(!passwordReset.test(newPassword.value)){ 
          announce(group('newPassword'),'Contraseña ≥ 8 caracteres, con mayúscula, minúscula, número y carácter especial'); ok=false 
        } else announce(group('newPassword'),'')
    
    // Confirmar contraseña - must match
    if(confirmPassword.value!==newPassword.value||confirmPassword.value===''){ 
      announce(group('confirmNewPassword'),'Las contraseñas no coinciden'); ok=false 
    } else announce(group('confirmNewPassword'),'')
    
    setDisabled(submit,!ok)
    return ok 
  }
  // Add event listeners only if elements exist
  if (newPassword) newPassword.addEventListener('input',validate)
  if (confirmPassword) confirmPassword.addEventListener('input',validate)

  // Verify token
  (async () => {
    try { const v = await verifyResetToken(token); if(!v?.valid){ invalid.style.display='block'; form.style.display='none' } }
    catch { invalid.style.display='block'; form.style.display='none' }
  })()

  form.addEventListener('submit', async (e)=>{
    e.preventDefault(); if(!validate()) return
    setDisabled(submit,true)
    try { await resetPassword({ token, newPassword: newPassword.value }); window.location.hash = '#/login' }
    catch (err) { announce(group('newPassword'), err.message || 'No se pudo actualizar') }
    finally { setDisabled(submit,false) }
  })

  validate()
  return div
}


