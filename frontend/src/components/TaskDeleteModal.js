import { deleteTask } from '../api/tasks'
import { showToast } from './Modal'

/**
 * Task delete confirmation modal
 * @param {Object} task - The task to delete
 * @param {Function} onTaskDeleted - Callback when task is successfully deleted
 * @returns {HTMLElement} The modal element
 */
export default function TaskDeleteModal(task, onTaskDeleted) {
  const modal = document.createElement('div')
  modal.className = 'modal-overlay'
  modal.innerHTML = `
    <div class="modal-container">
      <div class="modal-header">
        <div class="modal-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3 class="modal-title">Confirmar Eliminación</h3>
      </div>
      <div class="modal-content">
        <p>¿Seguro que deseas borrar esta tarea?</p>
        <div class="task-preview">
          <div class="task-title">${escapeHtml(task.Title)}</div>
          <div class="task-stage">${escapeHtml(task.stageName)}</div>
        </div>
      </div>
      <div class="modal-actions">
        <button id="cancel-delete-btn" class="btn btn-secondary">
          <i class="fas fa-times"></i> Cancelar
        </button>
        <button id="confirm-delete-btn" class="btn btn-primary">
          <i class="fas fa-trash-alt"></i> Eliminar definitivamente
        </button>
      </div>
    </div>
    <style>
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
        font-size: 18px;
        line-height: 1.6;
        color: var(--gris-medio);
        margin: 0 0 20px 0;
        text-align: center;
      }

      .task-preview {
        background: linear-gradient(135deg, rgba(160, 82, 45, 0.1), rgba(210, 180, 140, 0.1));
        border-radius: 12px;
        padding: 20px;
        border: 2px solid rgba(160, 82, 45, 0.2);
        text-align: center;
      }

      .task-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--cafe-principal);
        margin-bottom: 8px;
      }

      .task-stage {
        font-size: 14px;
        color: var(--gris-medio);
        background: rgba(160, 82, 45, 0.1);
        padding: 4px 12px;
        border-radius: 20px;
        display: inline-block;
      }

      .modal-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
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
        min-width: 160px;
      }

      .btn-primary {
        background: linear-gradient(135deg, #dc3545, #c82333);
        box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
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
        background: linear-gradient(135deg, #c82333, #dc3545);
        box-shadow: 0 8px 20px rgba(220, 53, 69, 0.4);
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

      .btn-loading {
        pointer-events: none;
        opacity: 0.8;
      }

      .btn-loading::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      .btn-loading span {
        opacity: 0;
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

      @keyframes spin { 
        0% { transform: rotate(0deg); } 
        100% { transform: rotate(360deg); } 
      }

      @media (max-width: 768px) {
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
        }
        .btn {
          width: 100%;
        }
      }

      @media (max-width: 480px) {
        .modal-container {
          padding: 20px;
        }
        .modal-title {
          font-size: 24px;
        }
      }
    </style>
  `

  const cancelBtn = modal.querySelector('#cancel-delete-btn')
  const confirmBtn = modal.querySelector('#confirm-delete-btn')

  // Handle cancel
  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(modal)
  })

  // Handle confirm delete
  confirmBtn.addEventListener('click', async () => {
    try {
      // Show loading state
      confirmBtn.classList.add('btn-loading')
      confirmBtn.disabled = true
      cancelBtn.disabled = true

      // Call delete API
      await deleteTask(task._id)

      // Show success toast
      showToast('Tarea eliminada', 'success')

      // Call callback to update UI
      if (onTaskDeleted) {
        onTaskDeleted(task._id)
      }

      // Close modal
      document.body.removeChild(modal)

    } catch (error) {
      // Remove loading state
      confirmBtn.classList.remove('btn-loading')
      confirmBtn.disabled = false
      cancelBtn.disabled = false

      // Handle specific errors
      if (error.status === 404) {
        showToast('La tarea ya no está disponible', 'error')
      } else if (error.status >= 500) {
        showToast('No pudimos eliminar la tarea, inténtalo más tarde', 'error')
      } else {
        showToast('Error al eliminar la tarea', 'error')
      }
    }
  })

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal)
    }
  })

  // Close modal with Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      document.body.removeChild(modal)
      document.removeEventListener('keydown', handleEscape)
    }
  }
  document.addEventListener('keydown', handleEscape)

  return modal
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
