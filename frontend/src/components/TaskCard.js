import TaskDeleteModal from './TaskDeleteModal'

export default function TaskCard(task) {
  const card = document.createElement('div')
  card.className = 'task-card'
  card.style.background = '#F9FAFB'
  card.style.borderRadius = '10px'
  card.style.padding = '12px'
  card.style.marginBottom = '12px'
  card.style.borderLeft = '4px solid #A0522D'
  if (task && task._id) {
    try { card.setAttribute('data-task-id', String(task._id)) } catch {}
  }
  const date = new Date(task.initDate)
  const fecha = isNaN(date) ? '' : date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
  const hora = isNaN(date) ? '' : date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })
  const pillClass = task.stageName === 'Por hacer' ? 'por-hacer' : task.stageName === 'Haciendo' ? 'haciendo' : 'hecho'
  card.innerHTML = `
    <div class="task-header" style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px">
      <div class="task-title" style="flex:1;font-weight:600;color:#1F2937;font-size:16px;line-height:1.4">${escapeHtml(task.Title)}</div>
      <div class="task-actions" style="display:flex;gap:4px;flex-shrink:0">
        <button type="button" class="action-btn edit-btn" title="Editar tarea" aria-label="Editar tarea" 
          style="background:transparent;border:0;padding:6px;border-radius:8px;color:var(--cafe-principal);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s ease;">
          <i class="fas fa-edit" style="font-size:14px"></i>
        </button>
        <button type="button" class="action-btn delete-btn" title="Eliminar tarea" aria-label="Eliminar tarea" 
          style="background:transparent;border:0;padding:6px;border-radius:8px;color:var(--cafe-principal);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s ease;">
          <i class="fas fa-trash" style="font-size:14px"></i>
        </button>
      </div>
    </div>
    <div class="task-status" style="margin-bottom:12px">
      <span class="pill ${pillClass}" style="display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">${escapeHtml(task.stageName)}</span>
    </div>
    <div class="task-detail" style="color:#6B7280;font-size:14px;line-height:1.5;margin-bottom:12px;min-height:20px">${escapeHtml(task.detail||'')}</div>
    <div class="task-date-time" style="display:flex;gap:16px;font-size:12px;color:#9CA3AF">
      <span style="display:flex;align-items:center;gap:4px"><i class="fas fa-calendar" style="font-size:10px"></i> ${fecha}</span>
      <span style="display:flex;align-items:center;gap:4px"><i class="fas fa-clock" style="font-size:10px"></i> ${hora}</span>
    </div>
  `

  // Get action buttons
  const editBtn = card.querySelector('.edit-btn')
  const deleteBtn = card.querySelector('.delete-btn')

  // Open edit modal when clicking the edit icon
  if (editBtn) {
    editBtn.addEventListener('click', (e) => {
      e.preventDefault()
      try {
        window.dispatchEvent(new CustomEvent('openTaskEditModal', { detail: { task } }))
      } catch {}
    })
  }

  // Delete task when clicking the trash icon
  if (deleteBtn) {
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault()
      try {
        // Create and show delete modal
        const modal = TaskDeleteModal(task, (deletedTaskId) => {
          // Remove the task card from DOM
          const taskCard = document.querySelector(`[data-task-id="${deletedTaskId}"]`)
          if (taskCard) {
            taskCard.remove()
            // Update column counts
            const columns = document.querySelectorAll('.column')
            columns.forEach(col => {
              const countEl = col.querySelector('.count')
              const list = col.querySelector('.task-list')
              if (countEl && list) {
                countEl.textContent = String(list.children.length)
              }
            })
          }
        })
        document.body.appendChild(modal)
      } catch {}
    })
  }

  // Add hover effects for action buttons
  if (editBtn) {
    editBtn.addEventListener('mouseenter', () => {
      editBtn.style.background = 'rgba(160, 82, 45, 0.1)'
      editBtn.style.transform = 'scale(1.1)'
    })
    editBtn.addEventListener('mouseleave', () => {
      editBtn.style.background = 'transparent'
      editBtn.style.transform = 'scale(1)'
    })
  }
  
  if (deleteBtn) {
    deleteBtn.addEventListener('mouseenter', () => {
      deleteBtn.style.background = 'rgba(220, 53, 69, 0.1)'
      deleteBtn.style.color = '#dc3545'
      deleteBtn.style.transform = 'scale(1.1)'
    })
    deleteBtn.addEventListener('mouseleave', () => {
      deleteBtn.style.background = 'transparent'
      deleteBtn.style.color = 'var(--cafe-principal)'
      deleteBtn.style.transform = 'scale(1)'
    })
  }

  return card
}

function escapeHtml(str) { return String(str||'').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])) }