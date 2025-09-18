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
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}