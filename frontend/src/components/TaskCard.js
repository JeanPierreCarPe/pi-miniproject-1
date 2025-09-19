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
    <div class="task-header" style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
      <div class="task-title">${escapeHtml(task.Title)}</div>
      <div class="task-right" style="display:flex;align-items:center;gap:8px">
        <span class="pill ${pillClass}">${escapeHtml(task.stageName)}</span>
        <button type="button" class="action-btn" title="Editar tarea" aria-label="Editar tarea" 
          style="background:transparent;border:0;padding:4px;border-radius:8px;color:var(--cafe-principal);cursor:pointer;display:flex;align-items:center;justify-content:center;">
          <i class="fas fa-edit" style="font-size:16px"></i>
        </button>
      </div>
    </div>
    <div class="task-detail">${escapeHtml(task.detail||'')}</div>
    <div class="task-date-time">
      <span><i class="fas fa-calendar"></i> ${fecha}</span>
      <span><i class="fas fa-clock"></i> ${hora}</span>
    </div>
  `

  // Open edit modal when clicking the edit icon
  const editBtn = card.querySelector('.action-btn')
  if (editBtn) {
    editBtn.addEventListener('click', (e) => {
      e.preventDefault()
      try {
        window.dispatchEvent(new CustomEvent('openTaskEditModal', { detail: { task } }))
      } catch {}
    })
  }
  return card
}

function escapeHtml(str) { return String(str||'').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])) }


