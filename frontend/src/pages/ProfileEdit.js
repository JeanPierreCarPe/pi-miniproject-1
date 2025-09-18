import { emailRFC5322 } from '../utils/validators'
import { updateProfile } from '../api/auth'
import { showToast } from '../components/Modal'

export default function ProfileEdit() {
  // Get current user data
  let currentUser = {}
  try {
    currentUser = JSON.parse(localStorage.getItem('auth_user') || '{}')
  } catch {
    currentUser = {}
  }
  
  const div = document.createElement('div')
  div.className = 'container'
  
  div.innerHTML = `
    <div class="header">
      <div class="welcome-text">
        <h1>Editar Perfil</h1>
        <p>Actualiza tu información personal</p>
      </div>
    </div>
    
    <div class="profile-edit-container">
      <div class="profile-edit-card">
        <form id="profileForm" class="form">
          <div class="form-group" id="group-firstname">
            <label for="firstname">Nombres</label>
            <input id="firstname" type="text" value="${escapeHtml(currentUser.firstname || '')}" />
          </div>
          <div class="form-group" id="group-lastname">
            <label for="lastname">Apellidos</label>
            <input id="lastname" type="text" value="${escapeHtml(currentUser.lastname || '')}" />
          </div>
          <div class="form-group" id="group-age">
            <label for="age">Edad</label>
            <input id="age" type="number" min="13" value="${currentUser.age || ''}" />
          </div>
          <div class="form-group" id="group-email">
            <label for="email">Correo electrónico</label>
            <input id="email" type="email" value="${escapeHtml(currentUser.email || '')}" />
          </div>
          <div class="form-actions">
            <button id="saveBtn" class="btn btn-primary" type="submit" disabled>
              <span id="btn-text">Guardar</span>
              <div id="spinner" style="display:none;width:16px;height:16px;border:2px solid transparent;border-top:2px solid #fff;border-radius:50%;animation:spin 1s linear infinite"></div>
            </button>
            <a href="#/profile" class="btn btn-secondary">Cancelar</a>
          </div>
        </form>
      </div>
    </div>

    <style>
      .profile-edit-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }

      .profile-edit-card {
        background: linear-gradient(135deg, #fff 0%, #fefefe 100%);
        border-radius: 24px;
        box-shadow: 0 12px 32px rgba(0,0,0,.08);
        padding: 40px;
        border: 1px solid rgba(0,0,0,.06);
        animation: fadeIn 0.6s ease;
        position: relative;
        overflow: hidden;
      }

      .profile-edit-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--cafe-principal), #FFD700, var(--cafe-principal));
      }

      .form-group {
        margin-bottom: 24px;
      }

      .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #333;
        font-size: 14px;
      }

      .form-group input {
        width: 100%;
        padding: 14px 16px;
        border: 2px solid #e1e5e9;
        border-radius: 12px;
        font-size: 16px;
        transition: border-color 0.2s ease;
        box-sizing: border-box;
      }

      .form-group input:focus {
        outline: none;
        border-color: var(--cafe-principal, #A0522D);
      }

      .form-actions {
        display: flex;
        gap: 16px;
        margin-top: 32px;
        justify-content: center;
      }

      .btn {
        padding: 14px 28px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        text-decoration: none;
        border: none;
        min-width: 120px;
      }

      .btn-primary {
        background: linear-gradient(135deg, var(--cafe-principal, #A0522D), #8B4513);
        color: #fff;
        box-shadow: 0 4px 12px rgba(160, 82, 45, 0.3);
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(160, 82, 45, 0.4);
        background: linear-gradient(135deg, #8B4513, var(--cafe-principal, #A0522D));
      }

      .btn-primary:disabled {
        background: #ccc;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      .btn-secondary {
        background: transparent;
        color: var(--cafe-principal, #A0522D);
        border: 2px solid var(--cafe-principal, #A0522D);
      }

      .btn-secondary:hover {
        background: var(--cafe-principal, #A0522D);
        color: #fff;
        transform: translateY(-2px);
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes spin { 
        0% { transform: rotate(0deg); } 
        100% { transform: rotate(360deg); } 
      }

      @media (max-width: 768px) {
        .profile-edit-container {
          padding: 16px;
        }

        .profile-edit-card {
          padding: 32px 24px;
          border-radius: 20px;
        }

        .form-actions {
          flex-direction: column;
          gap: 12px;
        }

        .btn {
          width: 100%;
        }
      }

      @media (max-width: 480px) {
        .profile-edit-card {
          padding: 24px 20px;
          border-radius: 16px;
        }
      }
    </style>
  `

  const form = div.querySelector('#profileForm')
  const firstname = div.querySelector('#firstname')
  const lastname = div.querySelector('#lastname')
  const age = div.querySelector('#age')
  const email = div.querySelector('#email')
  const submit = div.querySelector('#saveBtn')
  const btnText = div.querySelector('#btn-text')
  const spinner = div.querySelector('#spinner')
  const group = (id) => div.querySelector(`#group-${id}`)

  // Track user interaction to show errors only after interaction
  const userInteracted = { firstname: false, lastname: false, age: false, email: false }

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
   * Validates profile fields
   * @returns {boolean} True if all fields are valid
   */
  function validate() {
    let ok = true

    // Firstname - required
    if (!firstname.value.trim()) {
      if (userInteracted.firstname) {
        announce(group('firstname'), 'Nombres son requeridos')
      }
      ok = false
    } else {
      announce(group('firstname'), '')
    }

    // Lastname - required  
    if (!lastname.value.trim()) {
      if (userInteracted.lastname) {
        announce(group('lastname'), 'Apellidos son requeridos')
      }
      ok = false
    } else {
      announce(group('lastname'), '')
    }

    // Age - required, ≥13, integer
    const ageValue = Number(age.value)
    if (!age.value.trim() || !Number.isInteger(ageValue) || ageValue < 13) {
      if (userInteracted.age) {
        announce(group('age'), 'Edad debe ser un número entero ≥ 13')
      }
      ok = false
    } else {
      announce(group('age'), '')
    }

    // Email - required, RFC 5322
    if (!emailRFC5322.test(email.value)) {
      if (userInteracted.email) {
        announce(group('email'), 'Ingresa un correo electrónico válido')
      }
      ok = false
    } else {
      announce(group('email'), '')
    }

    setDisabled(submit, !ok)
    return ok
  }

  // Add event listeners with interaction tracking
  firstname.addEventListener('input', () => {
    userInteracted.firstname = true
    validate()
  })
  firstname.addEventListener('blur', () => {
    userInteracted.firstname = true
    validate()
  })

  lastname.addEventListener('input', () => {
    userInteracted.lastname = true
    validate()
  })
  lastname.addEventListener('blur', () => {
    userInteracted.lastname = true
    validate()
  })

  age.addEventListener('input', () => {
    userInteracted.age = true
    validate()
  })
  age.addEventListener('blur', () => {
    userInteracted.age = true
    validate()
  })

  email.addEventListener('input', () => {
    userInteracted.email = true
    validate()
  })
  email.addEventListener('blur', () => {
    userInteracted.email = true
    validate()
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (!validate()) return

    // Show spinner
    setDisabled(submit, true)
    btnText.style.display = 'none'
    spinner.style.display = 'block'

    try {
      const updatedUser = await updateProfile({
        firstname: firstname.value.trim(),
        lastname: lastname.value.trim(),
        age: Number(age.value),
        email: email.value.trim()
      })

      // Update localStorage with new user data
      localStorage.setItem('auth_user', JSON.stringify({
        ...currentUser,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        age: updatedUser.age,
        email: updatedUser.email,
        updatedAt: updatedUser.updatedAt
      }))

      showToast('Perfil actualizado', 'success')
      
      // Redirect to profile page
      setTimeout(() => {
        window.location.hash = '#/profile'
      }, 1000)

    } catch (err) {
      // Handle specific errors
      if (err.message.includes('409') || err.message.includes('Email already in use')) {
        announce(group('email'), 'Este correo ya está en uso')
      } else if (err.message.includes('401') || err.message.includes('token')) {
        showToast('Tu sesión ha expirado', 'error')
        setTimeout(() => {
          window.location.hash = '#/login'
        }, 2000)
      } else {
        showToast('No se pudo actualizar el perfil', 'error')
        if (process.env.NODE_ENV !== 'production') {
          console.error('Profile update error:', err)
        }
      }
    } finally {
      // Hide spinner and restore button
      spinner.style.display = 'none'
      btnText.style.display = 'block'
      setDisabled(submit, false)
    }
  })

  // Initial validation without showing errors
  validate()

  return div
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]))
}
