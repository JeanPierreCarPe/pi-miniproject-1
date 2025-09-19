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

  div.innerHTML = `
    <div class="header">
      <div class="welcome-text">
        <h1>Mi Perfil</h1>
        <p>Información de tu cuenta y datos personales</p>
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

      <div class="profile-actions" style="display:flex;justify-content:flex-end">
        <button id="edit-profile-btn" class="btn btn-primary" style="margin-left:auto">
          <i class="fas fa-edit"></i>
          Editar Perfil
        </button>
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

      .profile-actions {
        text-align: center;
        margin-top: 32px;
        padding-top: 32px;
        border-top: 2px solid rgba(160, 82, 45, 0.1);
      }

      .btn {
        background: linear-gradient(135deg, var(--cafe-principal), #8B4513);
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
        box-shadow: 0 4px 12px rgba(160, 82, 45, 0.3);
        text-decoration: none;
      }

      .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(160, 82, 45, 0.4);
        background: linear-gradient(135deg, #8B4513, var(--cafe-principal));
      }

      .btn:active {
        transform: translateY(0);
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
      }
    </style>
  `
  
  // Add event listener for edit button
  const editBtn = div.querySelector('#edit-profile-btn')
  editBtn.addEventListener('click', () => {
    window.location.hash = '#/profile/edit'
  })
  
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
}