import { getUser } from '../state/authStore'

/**
 * Profile page component showing user registration data
 * @returns {HTMLElement} The profile page element
 */
export default function Profile() {
  const div = document.createElement('div')
  div.className = 'container'

  // Get user data from localStorage
  let user = {}
  try {
    user = JSON.parse(localStorage.getItem('auth_user') || '{}')
  } catch {
    user = {}
  }

  // Calculate membership duration
  const memberSince = user.createdAt ? new Date(user.createdAt) : new Date()
  const memberSinceFormatted = memberSince.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  })

  div.innerHTML = `
    <div class="header">
      <div class="welcome-text">
        <h1>Mi Perfil</h1>
        <p>Información de tu cuenta y datos personales</p>
      </div>
      <div class="date">
        <i class="fas fa-calendar-alt"></i>
        <span>Miembro desde: ${memberSinceFormatted}</span>
      </div>
    </div>
    <div class="profile-container">
      <div class="profile-header">
        <div class="profile-avatar">
          <i class="fas fa-user-circle"></i>
        </div>
        <div class="profile-info">
          <h2 class="profile-name">${escapeHtml(user.firstname || 'Usuario')} ${escapeHtml(user.lastname || '')}</h2>
          <p class="profile-email">${escapeHtml(user.email || 'email@ejemplo.com')}</p>
        </div>
      </div>
      <div class="profile-details">
        <div class="detail-card">
          <div class="detail-icon">
            <i class="fas fa-user"></i>
          </div>
          <div class="detail-content">
            <label>Nombres</label>
            <div class="detail-value">${escapeHtml(user.firstname || 'No especificado')}</div>
          </div>
        </div>
        <div class="detail-card">
          <div class="detail-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="detail-content">
            <label>Apellidos</label>
            <div class="detail-value">${escapeHtml(user.lastname || 'No especificado')}</div>
          </div>
        </div>
        <div class="detail-card">
          <div class="detail-icon">
            <i class="fas fa-envelope"></i>
          </div>
          <div class="detail-content">
            <label>Correo Electrónico</label>
            <div class="detail-value">${escapeHtml(user.email || 'No especificado')}</div>
          </div>
        </div>
        <div class="detail-card">
          <div class="detail-icon">
            <i class="fas fa-birthday-cake"></i>
          </div>
          <div class="detail-content">
            <label>Edad</label>
            <div class="detail-value">${user.age || 'No especificado'} años</div>
          </div>
        </div>
<<<<<<< Updated upstream
      </div>

      <!-- Botón de editar perfil en la parte inferior derecha -->
      <button class="edit-profile-button" id="editProfileBtn">
        <i class="fas fa-user-edit"></i>
        Editar Perfil
      </button>

    </div>

    <!-- Modal de edición -->
    <div class="modal-overlay" id="editModal">
      <div class="modal">
        <button class="modal-close" id="closeModal">
          <i class="fas fa-times"></i>
=======
        <div class="detail-card">
          <div class="detail-icon">
            <i class="fas fa-calendar-plus"></i>
          </div>
          <div class="detail-content">
            <label>Miembro desde</label>
            <div class="detail-value">${formatMemberSince(user.createdAt)}</div>
          </div>
        </div>
      </div>
      <div class="profile-actions" style="display:flex;justify-content:flex-end;gap:12px">
        <button id="edit-profile-btn" class="btn btn-primary">
          <i class="fas fa-edit"></i> Editar Perfil
        </button>
        <button id="delete-account-btn" class="btn btn-primary">
          <i class="fas fa-trash-alt"></i> Eliminar Cuenta
>>>>>>> Stashed changes
        </button>
        <h2 class="modal-title">Editar Información</h2>
        
        <form id="profileForm">
          <div class="form-group">
            <label for="firstname">Nombres</label>
            <input type="text" id="firstname" name="firstname" value="${escapeHtml(user.firstname || '')}" required>
          </div>
          
          <div class="form-group">
            <label for="lastname">Apellidos</label>
            <input type="text" id="lastname" name="lastname" value="${escapeHtml(user.lastname || '')}" required>
          </div>
          
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input type="email" id="email" name="email" value="${escapeHtml(user.email || '')}" required>
          </div>
          
          <div class="form-group">
            <label for="age">Edad</label>
            <input type="number" id="age" name="age" value="${user.age || ''}" min="1" max="120" required>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-cancel" id="cancelEdit">Cancelar</button>
            <button type="submit" class="btn btn-save">Guardar Cambios</button>
          </div>
        </form>
      </div>
<<<<<<< Updated upstream
=======
    </div>

    <!-- Modal de confirmación para eliminar cuenta -->
    <div id="delete-confirm-modal" class="modal-overlay" style="display: none;">
      <div class="modal-container">
        <div class="modal-header">
          <div class="modal-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <h3 class="modal-title">Confirmar Eliminación</h3>
        </div>
        <div class="modal-content">
          <p>Para eliminar tu cuenta permanentemente, por favor confirma tu identidad:</p>
          
          <div class="confirmation-fields">
            <div class="input-group">
              <label for="current-password">Contraseña actual:</label>
              <input type="password" id="current-password" placeholder="Ingresa tu contraseña actual" class="form-input">
            </div>
            
            <div class="input-group">
              <label for="confirm-text">Escribe <strong>ELIMINAR</strong> para confirmar:</label>
              <input type="text" id="confirm-text" placeholder="Escribe ELIMINAR aquí" class="form-input">
            </div>
          </div>
          
          <p class="warning-text">Esta acción no se puede deshacer. Perderás todos tus datos, historial y configuraciones.</p>
        </div>
        <div class="modal-actions">
          <button id="cancel-delete-btn" class="btn btn-secondary">
            <i class="fas fa-times"></i> Cancelar
          </button>
          <button id="confirm-delete-btn" class="btn btn-primary" disabled>
            <i class="fas fa-trash-alt"></i> Sí, Eliminar Cuenta
          </button>
        </div>
      </div>
>>>>>>> Stashed changes
    </div>

    <style>
      .profile-container {
        background: linear-gradient(135deg, #fff 0%, #fefefe 100%);
        border-radius: 24px;
        box-shadow: 0 12px 32px rgba(0,0,0,.08);
        padding: 40px;
        border: 1px solid rgba(0,0,0,.06);
        animation: fadeIn 0.6s ease;
        position: relative;
        overflow: hidden;
      }
      .profile-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--cafe-principal), #FFD700, var(--cafe-principal));
      }
      .profile-header {
        display: flex;
        align-items: center;
        gap: 24px;
        margin-bottom: 40px;
        padding-bottom: 32px;
        border-bottom: 2px solid rgba(160, 82, 45, 0.1);
      }
      .profile-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--cafe-principal), #8B4513);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 60px;
        box-shadow: 0 8px 24px rgba(160, 82, 45, 0.3);
        border: 4px solid rgba(255,255,255,0.9);
        position: relative;
      }
      .profile-avatar::after {
        content: '';
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        background: linear-gradient(45deg, #FFD700, var(--cafe-principal));
        z-index: -1;
      }
      .profile-info {
        flex: 1;
      }
      .profile-name {
        font-size: 32px;
        font-weight: 800;
        color: var(--cafe-principal);
        margin: 0 0 8px 0;
        background: linear-gradient(135deg, var(--cafe-principal), #D2B48C);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .profile-email {
        font-size: 18px;
        color: var(--gris-medio);
        margin: 0;
        font-weight: 500;
      }
      .profile-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
        margin-bottom: 40px;
      }
<<<<<<< Updated upstream
=======
      .profile-actions {
        text-align: center;
        margin-top: 32px;
        padding-top: 32px;
        border-top: 2px solid rgba(160, 82, 45, 0.1);
      }
      .btn {
        color: #fff;
        border: none;
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
      }
      .btn-primary {
        background: linear-gradient(135deg, var(--cafe-principal), #8B4513);
        box-shadow: 0 4px 12px rgba(160, 82, 45, 0.3);
      }
      .btn-secondary {
        background: linear-gradient(135deg, #6c757d, #5a6268);
        box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
      }
      .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.4);
      }
      .btn-primary:hover {
        background: linear-gradient(135deg, #8B4513, var(--cafe-principal));
        box-shadow: 0 8px 20px rgba(160, 82, 45, 0.4);
      }
      .btn-secondary:hover {
        background: linear-gradient(135deg, #5a6268, #6c757d);
        box-shadow: 0 8px 20px rgba(108, 117, 125, 0.4);
      }
      .btn:active {
        transform: translateY(0);
      }
      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
      .btn:disabled:hover {
        transform: none;
        box-shadow: none;
      }

      /* Estilos del Modal */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
      }

      .modal-container {
        background: linear-gradient(135deg, #fff 0%, #fefefe 100%);
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        padding: 40px;
        border: 1px solid rgba(0,0,0,.06);
        max-width: 500px;
        width: 90%;
        animation: slideIn 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .modal-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--cafe-principal), #FFD700, var(--cafe-principal));
      }

      .modal-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 24px;
        text-align: left;
      }

      .modal-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ffc107, #ff8c00);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 28px;
        box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
      }

      .modal-title {
        font-size: 28px;
        font-weight: 800;
        color: var(--cafe-principal);
        margin: 0;
        background: linear-gradient(135deg, var(--cafe-principal), #D2B48C);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .modal-content {
        margin-bottom: 32px;
      }

      .modal-content p {
        font-size: 16px;
        line-height: 1.6;
        color: var(--gris-medio);
        margin: 0 0 16px 0;
      }

      .confirmation-fields {
        margin: 24px 0;
      }

      .input-group {
        margin-bottom: 20px;
      }

      .input-group label {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: var(--gris-medio);
        margin-bottom: 8px;
      }

      .form-input {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid rgba(160, 82, 45, 0.2);
        border-radius: 8px;
        font-size: 16px;
        transition: all 0.3s ease;
        background: #fff;
        box-sizing: border-box;
      }

      .form-input:focus {
        outline: none;
        border-color: var(--cafe-principal);
        box-shadow: 0 0 0 3px rgba(160, 82, 45, 0.1);
      }

      .form-input:invalid {
        border-color: #dc3545;
      }

      .form-input:valid {
        border-color: #28a745;
      }

      .warning-text {
        color: #dc3545;
        font-weight: 600;
        background: rgba(220, 53, 69, 0.1);
        padding: 12px;
        border-radius: 8px;
        border-left: 4px solid #dc3545;
      }

      .modal-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-50px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
>>>>>>> Stashed changes

      .detail-card {
        background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,246,243,0.9));
        border-radius: 20px;
        padding: 24px;
        display: flex;
        align-items: center;
        gap: 20px;
        box-shadow: 0 6px 20px rgba(0,0,0,.06);
        border: 1px solid rgba(160, 82, 45, 0.1);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      .detail-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(180deg, var(--cafe-principal), #D2B48C);
      }
      .detail-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0,0,0,.12);
      }
      .detail-icon {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        background: linear-gradient(135deg, var(--cafe-principal), #8B4513);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 24px;
        box-shadow: 0 4px 12px rgba(160, 82, 45, 0.3);
        flex-shrink: 0;
      }
      .detail-content {
        flex: 1;
        min-width: 0;
      }
      .detail-content label {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: var(--gris-medio);
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .detail-value {
        font-size: 18px;
        font-weight: 600;
        color: var(--cafe-principal);
        word-wrap: break-word;
      }
<<<<<<< Updated upstream

      /* Botón de editar perfil */
      .edit-profile-button {
        position: absolute;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, var(--cafe-principal), var(--cafe-oscuro));
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
        transition: all 0.3s ease;
        z-index: 10;
      }

      .edit-profile-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(139, 69, 19, 0.4);
      }

      /* Modal de edición */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .modal-overlay.active {
        opacity: 1;
        visibility: visible;
      }

      .modal {
        background: white;
        border-radius: 20px;
        width: 90%;
        max-width: 500px;
        padding: 30px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        transform: translateY(-50px);
        transition: transform 0.4s ease;
        position: relative;
      }

      .modal-overlay.active .modal {
        transform: translateY(0);
      }

      .modal-close {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--gris-medio);
      }

      .modal-title {
        font-size: 24px;
        color: var(--cafe-principal);
        margin-bottom: 25px;
        text-align: center;
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: var(--cafe-oscuro);
      }

      .form-group input {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e0e0e0;
        border-radius: 10px;
        font-size: 16px;
        transition: border-color 0.3s;
      }

      .form-group input:focus {
        outline: none;
        border-color: var(--cafe-principal);
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 15px;
        margin-top: 30px;
      }

      .btn {
        padding: 12px 24px;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.3s ease;
      }

      .btn-cancel {
        background: #f0f0f0;
        color: var(--gris-medio);
      }

      .btn-cancel:hover {
        background: #e0e0e0;
      }

      .btn-save {
        background: linear-gradient(135deg, var(--cafe-principal), var(--cafe-oscuro));
        color: white;
      }

      .btn-save:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

=======
>>>>>>> Stashed changes
      @media (max-width: 768px) {
        .profile-container {
          padding: 24px;
          border-radius: 20px;
        }
        .profile-header {
          flex-direction: column;
          text-align: center;
          gap: 20px;
          margin-bottom: 32px;
          padding-bottom: 24px;
        }
        .profile-avatar {
          width: 100px;
          height: 100px;
          font-size: 48px;
        }
        .profile-name {
          font-size: 26px;
        }
        .profile-email {
          font-size: 16px;
        }
        .profile-details {
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 32px;
        }
        .detail-card {
          padding: 20px;
          border-radius: 16px;
        }
        .detail-icon {
          width: 48px;
          height: 48px;
          font-size: 20px;
        }
        .detail-value {
          font-size: 16px;
        }
<<<<<<< Updated upstream

        .edit-profile-button {
          position: relative;
          bottom: unset;
          right: unset;
          margin: 20px auto 0;
          width: fit-content;
        }

        .header {
          flex-direction: column;
          align-items: flex-start;
=======
        .profile-actions {
          flex-direction: column;
        }
        .btn {
          width: 100%;
        }
        .modal-container {
          padding: 24px;
          margin: 20px;
        }
        .modal-header {
          flex-direction: column;
          text-align: center;
          gap: 12px;
        }
        .modal-actions {
          flex-direction: column;
>>>>>>> Stashed changes
        }
      }
      @media (max-width: 480px) {
        .profile-container {
          padding: 20px;
        }
        .profile-name {
          font-size: 22px;
        }
        .detail-card {
          padding: 16px;
          gap: 16px;
        }
        .detail-icon {
          width: 44px;
          height: 44px;
          font-size: 18px;
        }
        .detail-value {
          font-size: 15px;
        }
<<<<<<< Updated upstream

        .modal {
          padding: 20px;
        }

        .form-actions {
          flex-direction: column;
        }

        .btn {
          width: 100%;
        }
      }
    </style>
  `;
  
  // Añadir funcionalidad JavaScript después de que el HTML se haya insertado
  setTimeout(() => {
    // Elementos del DOM
    const editProfileBtn = div.querySelector('#editProfileBtn');
    const editModal = div.querySelector('#editModal');
    const closeModal = div.querySelector('#closeModal');
    const cancelEdit = div.querySelector('#cancelEdit');
    const profileForm = div.querySelector('#profileForm');
    
    // Abrir modal de edición
    editProfileBtn.addEventListener('click', () => {
      editModal.classList.add('active');
    });
    
    // Cerrar modal
    const closeModalFunc = () => {
      editModal.classList.remove('active');
    };
    
    closeModal.addEventListener('click', closeModalFunc);
    cancelEdit.addEventListener('click', closeModalFunc);
    
    // Enviar formulario
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Obtener valores del formulario
      const firstname = div.querySelector('#firstname').value;
      const lastname = div.querySelector('#lastname').value;
      const email = div.querySelector('#email').value;
      const age = div.querySelector('#age').value;
      
      // Actualizar la interfaz
      div.querySelector('.profile-name').textContent = `${firstname} ${lastname}`;
      div.querySelector('.profile-email').textContent = email;
      div.querySelectorAll('.detail-value')[0].textContent = firstname;
      div.querySelectorAll('.detail-value')[1].textContent = lastname;
      div.querySelectorAll('.detail-value')[2].textContent = email;
      div.querySelectorAll('.detail-value')[3].textContent = `${age} años`;
      
      // Guardar en localStorage
      try {
        const userData = {
          firstname,
          lastname,
          email,
          age,
          createdAt: user.createdAt || new Date().toISOString()
        };
        localStorage.setItem('auth_user', JSON.stringify(userData));
        console.log('Datos guardados en localStorage');
      } catch (error) {
        console.error('Error al guardar en localStorage:', error);
      }
      
      // Cerrar el modal
      closeModalFunc();
      
      // Mostrar mensaje de éxito
      alert('Información actualizada correctamente');
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    editModal.addEventListener('click', (e) => {
      if (e.target === editModal) {
        closeModalFunc();
      }
    });
  }, 0);
  
  return div;
=======
        .modal-container {
          padding: 20px;
        }
        .modal-title {
          font-size: 24px;
        }
      }
    </style>
  `

  // Add event listener for edit button
  const editBtn = div.querySelector('#edit-profile-btn')
  editBtn.addEventListener('click', () => {
    window.location.hash = '#/profile/edit'
  })

  // Add event listeners for delete account functionality
  const deleteBtn = div.querySelector('#delete-account-btn')
  const modal = div.querySelector('#delete-confirm-modal')
  const cancelBtn = div.querySelector('#cancel-delete-btn')
  const confirmBtn = div.querySelector('#confirm-delete-btn')
  const passwordInput = div.querySelector('#current-password')
  const confirmTextInput = div.querySelector('#confirm-text')

  // Función para validar los campos y habilitar/deshabilitar el botón
  function validateDeleteConfirmation() {
    const password = passwordInput.value.trim()
    const confirmText = confirmTextInput.value.trim()
    
    const isPasswordValid = password.length > 0
    const isTextValid = confirmText === 'ELIMINAR'
    
    confirmBtn.disabled = !(isPasswordValid && isTextValid)
  }

  // Agregar event listeners para validación en tiempo real
  passwordInput.addEventListener('input', validateDeleteConfirmation)
  confirmTextInput.addEventListener('input', validateDeleteConfirmation)

  deleteBtn.addEventListener('click', () => {
    // Resetear campos al abrir el modal
    passwordInput.value = ''
    confirmTextInput.value = ''
    confirmBtn.disabled = true
    modal.style.display = 'flex'
  })

  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none'
  })

  confirmBtn.addEventListener('click', () => {
    // Validar una última vez antes de proceder
    validateDeleteConfirmation()
    
    if (confirmBtn.disabled) {
      alert('Por favor completa todos los campos correctamente')
      return
    }

    // Aquí iría la lógica para eliminar la cuenta
    console.log('Eliminando cuenta...')
    // Ejemplo:
    // localStorage.removeItem('auth_user')
    // window.location.hash = '#/login'
    
    // Por ahora solo cerramos el modal
    modal.style.display = 'none'
    alert('Cuenta eliminada exitosamente (esto es una simulación)')
  })

  // Cerrar modal al hacer clic fuera del contenido
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none'
    }
  })

  return div
>>>>>>> Stashed changes
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
<<<<<<< Updated upstream
  }[c]));
=======
  }[c]))
}

function formatMemberSince(dateString) {
  if (!dateString) return 'Fecha no disponible'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return 'Fecha no disponible'
  }
>>>>>>> Stashed changes
}