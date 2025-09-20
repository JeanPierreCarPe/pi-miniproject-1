import { updateTask } from '../api/tasks'
import { showToast } from './Modal'

export default function TaskEditModal(task, onTaskUpdated) {
  const modal = document.createElement('div')
  modal.className = 'modal-overlay'
  
  // Extract date and time from initDate
  const initDate = new Date(task.initDate)
  const dateValue = initDate.toISOString().split('T')[0]
  const timeValue = initDate.toTimeString().slice(0, 5)

  // Store original values to detect changes
  const originalTitle = task.Title
  const originalDetail = task.detail || ''
  const originalDate = dateValue
  const originalTime = timeValue
  const originalStatus = task.stageName
  
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Editar Tarea</h3>
        <button class="close-btn" type="button">&times;</button>
      </div>
      
      <form id="taskEditForm" class="form">
        <div class="form-group" id="group-title">
          <label for="title">Título</label>
          <input id="title" type="text" value="${escapeHtml(task.Title)}" maxlength="50" />
        </div>
        
        <div class="form-group" id="group-detail">
          <label for="detail">Detalle</label>
          <textarea id="detail" rows="3" maxlength="500" placeholder="Descripción opcional de la tarea"></textarea>
        </div>
        
        <div class="form-grid">
          <div class="form-group" id="group-date">
            <label for="date">Fecha</label>
            <input id="date" type="date" value="${dateValue}" />
          </div>
          
          <div class="form-group" id="group-time">
            <label for="time">Hora</label>
            <input id="time" type="time" value="${timeValue}" />
          </div>
        </div>
        
        <div class="form-group" id="group-status">
          <label for="status">Estado</label>
          <select id="status">
            <option value="Por hacer" ${task.stageName === 'Por hacer' ? 'selected' : ''}>Por hacer</option>
            <option value="Haciendo" ${task.stageName === 'Haciendo' ? 'selected' : ''}>Haciendo</option>
            <option value="Hecho" ${task.stageName === 'Hecho' ? 'selected' : ''}>Hecho</option>
          </select>
        </div>
        
        <button id="updateBtn" type="submit" class="btn" disabled style="width:100%;display:flex;align-items:center;justify-content:center;gap:8px">
          <span id="btn-text">Actualizar</span>
          <div id="spinner" style="display:none;width:16px;height:16px;border:2px solid transparent;border-top:2px solid #fff;border-radius:50%;animation:spin 1s linear infinite"></div>
        </button>
      </form>
    </div>
    
    <style>
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 20px;
        animation: fadeIn 0.3s ease;
      }
      
      .modal-content {
        background: #fff;
        border-radius: 20px;
        width: 100%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideInUp 0.3s ease;
      }
      
      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24px 24px 0 24px;
        border-bottom: 1px solid #e5e5e5;
        margin-bottom: 24px;
      }
      
      .modal-header h3 {
        margin: 0;
        color: var(--cafe-principal, #A0522D);
        font-size: 24px;
        font-weight: 700;
      }
      
      .close-btn {
        background: none;
        border: none;
        font-size: 28px;
        color: #999;
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
      }
      
      .close-btn:hover {
        background: #f5f5f5;
        color: #666;
      }
      
      .form {
        padding: 0 24px 24px 24px;
      }
      
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      
      .form-group {
        margin-bottom: 20px;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 6px;
        font-weight: 600;
        color: #333;
        font-size: 14px;
      }
      
      .form-group input,
      .form-group textarea,
      .form-group select {
        width: 100%;
        padding: 12px;
        border: 2px solid #e1e5e9;
        border-radius: 8px;
        font-size: 16px;
        transition: border-color 0.2s ease;
        box-sizing: border-box;
      }
      
      .form-group input:focus,
      .form-group textarea:focus,
      .form-group select:focus {
        outline: none;
        border-color: var(--cafe-principal, #A0522D);
      }
      
      .form-group textarea {
        resize: vertical;
        min-height: 80px;
      }
      
      .btn {
        background: linear-gradient(135deg, var(--cafe-principal, #A0522D), #8B4513);
        color: #fff;
        border: none;
        padding: 14px 28px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .btn:disabled {
        background: #ccc;
        cursor: not-allowed;
        transform: none;
      }
      
      .btn:not(:disabled):hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(160, 82, 45, 0.4);
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideInUp {
        from { 
          opacity: 0;
          transform: translateY(50px) scale(0.9);
        }
        to { 
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      @keyframes spin { 
        0% { transform: rotate(0deg); } 
        100% { transform: rotate(360deg); } 
      }
      
      /* Responsive */
      @media (max-width: 768px) {
        .modal-content {
          margin: 20px;
          max-width: none;
        }
        
        .form-grid {
          grid-template-columns: 1fr;
          gap: 12px;
        }
        
        .modal-header {
          padding: 20px 20px 0 20px;
        }
        
        .form {
          padding: 0 20px 20px 20px;
        }
      }
    </style>
  `

  const form = modal.querySelector('#taskEditForm')
  const titleInput = modal.querySelector('#title')
  const detailInput = modal.querySelector('#detail')
  const dateInput = modal.querySelector('#date')
  const timeInput = modal.querySelector('#time')
  const statusSelect = modal.querySelector('#status')
  const submitBtn = modal.querySelector('#updateBtn')
  const btnText = modal.querySelector('#btn-text')
  const spinner = modal.querySelector('#spinner')
  const closeBtn = modal.querySelector('.close-btn')
  
  // Initialize textarea with task detail
  detailInput.value = task.detail || ''
  
  const group = (id) => modal.querySelector(`#group-${id}`)
  
  // Track user interaction to show errors only after interaction
  const userInteracted = { title: false, date: false, time: false }

  const setDisabled = (el, d) => d ? el.setAttribute('disabled','true') : el.removeAttribute('disabled')

  /**
   * Shows error messages in aria-live regions
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
   * Validates form fields
   */
  function validate() {
    let ok = true

    // Title - required, 1-50 characters
    if (!titleInput.value.trim() || titleInput.value.trim().length > 50) {
      if (userInteracted.title) {
        announce(group('title'), 'Título es requerido (máximo 50 caracteres)')
      }
      ok = false
    } else {
      announce(group('title'), '')
    }

    // Detail - max 500 characters
    if (detailInput.value.trim().length > 500) {
      announce(group('detail'), 'Detalle máximo 500 caracteres')
      ok = false
    } else {
      announce(group('detail'), '')
    }

    // Date - required, allow today but enforce not-in-the-past combined with time below
    if (!dateInput.value) {
      if (userInteracted.date) {
        announce(group('date'), 'Fecha es requerida')
      }
      ok = false
    } else {
      announce(group('date'), '')
    }

    // Time - required
    if (!timeInput.value) {
      if (userInteracted.time) {
        announce(group('time'), 'Hora es requerida')
      }
      ok = false
    } else {
      announce(group('time'), '')
    }

    // Combined date/time must not be in the past. Today with future time is allowed.
    if (dateInput.value && timeInput.value) {
      const selected = new Date(`${dateInput.value}T${timeInput.value}:00`)
      const now = new Date()
      if (selected < now) {
        if (userInteracted.date || userInteracted.time) {
          announce(group('date'), 'La fecha y hora deben ser posteriores al momento actual')
        }
        ok = false
      }
    }

    // Check if any field has changed from original
    const hasChanged = titleInput.value.trim() !== originalTitle ||
      detailInput.value.trim() !== originalDetail ||
      dateInput.value !== originalDate ||
      timeInput.value !== originalTime ||
      statusSelect.value !== originalStatus

    // Enable button if any change has been made
    setDisabled(submitBtn, !hasChanged)
    return ok && hasChanged
  }

  // Add event listeners with interaction tracking
  titleInput.addEventListener('input', () => {
    userInteracted.title = true
    validate()
  })
  titleInput.addEventListener('blur', () => {
    userInteracted.title = true
    validate()
  })

  detailInput.addEventListener('input', validate)

  dateInput.addEventListener('change', () => {
    userInteracted.date = true
    validate()
  })
  dateInput.addEventListener('blur', () => {
    userInteracted.date = true
    validate()
  })

  timeInput.addEventListener('change', () => {
    userInteracted.time = true
    validate()
  })
  timeInput.addEventListener('blur', () => {
    userInteracted.time = true
    validate()
  })

  statusSelect.addEventListener('change', validate)

  // Track if modal is already closing to prevent double-closing
  let isClosing = false

  // Close modal functionality
  function closeModal() {
    if (isClosing) return
    isClosing = true
    
    // Remove event listeners immediately to prevent double-closing
    document.removeEventListener('keydown', handleEscape)
    
    // Apply closing animation
    modal.style.animation = 'fadeOut 0.2s ease forwards'
    
    // Remove from DOM after animation
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal)
      }
    }, 200)
  }

  // Add event listeners for closing modal
  closeBtn.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    closeModal()
  })
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      e.preventDefault()
      e.stopPropagation()
      closeModal()
    }
  })
  
  // Close modal on Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal()
    }
  }
  document.addEventListener('keydown', handleEscape)

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (!validate()) return

    // Show spinner
    setDisabled(submitBtn, true)
    btnText.style.display = 'none'
    spinner.style.display = 'block'

    try {
      // Combine date and time
      const initDateTime = new Date(`${dateInput.value}T${timeInput.value}:00`)

      const updatedTask = await updateTask(task._id, {
        Title: titleInput.value.trim(),
        detail: detailInput.value.trim() || null,
        initDate: initDateTime.toISOString(),
        endDate: null,
        stageName: statusSelect.value
      })

      // Call callback to update the task in the list
      if (onTaskUpdated) {
        onTaskUpdated(updatedTask)
      }

      showToast('Tarea actualizada', 'success')
      
      // Close modal automatically after successful update
      closeModal()

    } catch (err) {
      // Handle specific errors
      if (err.message.includes('La fecha debe ser futura')) {
        announce(group('date'), 'La fecha debe ser futura')
      } else if (err.message.includes('401') || err.message.includes('token')) {
        showToast('Tu sesión ha expirado', 'error')
        setTimeout(() => {
          window.location.hash = '#/login'
        }, 2000)
      } else {
        showToast('No pudimos actualizar tu tarea', 'error')
        if (process.env.NODE_ENV !== 'production') {
          console.error('Task update error:', err)
        }
      }
    } finally {
      // Hide spinner and restore button
      spinner.style.display = 'none'
      btnText.style.display = 'block'
      setDisabled(submitBtn, false)
    }
  })

  // Initial validation without showing errors
  validate()

  // Add CSS animation for closing
  const style = document.createElement('style')
  style.textContent = `
    @keyframes fadeOut {
      from { 
        opacity: 1; 
        transform: scale(1);
      }
      to { 
        opacity: 0; 
        transform: scale(0.95);
      }
    }
  `
  document.head.appendChild(style)

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
