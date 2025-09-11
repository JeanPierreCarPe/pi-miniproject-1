export default function TaskCard(task) {
  const card = document.createElement('div')
  card.className = 'task-card'
  card.style.background = '#F9FAFB'
  card.style.borderRadius = '10px'
  card.style.padding = '12px'
  card.style.marginBottom = '12px'
  card.style.borderLeft = '4px solid #A0522D'
  const date = new Date(task.initDate)
  const fecha = isNaN(date) ? '' : date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
  const hora = isNaN(date) ? '' : date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })
  const pillClass = task.stageName === 'Por hacer' ? 'por-hacer' : task.stageName === 'Haciendo' ? 'haciendo' : 'hecho'
  card.innerHTML = `
    <div class="task-header">
      <div class="task-title">${escapeHtml(task.Title)}</div>
      <span class="pill ${pillClass}">${escapeHtml(task.stageName)}</span>
    </div>
    <div class="task-detail">${escapeHtml(task.detail||'')}</div>
    <div class="task-date-time">
      <span><i class="fas fa-calendar"></i> ${fecha}</span>
      <span><i class="fas fa-clock"></i> ${hora}</span>
    </div>
  `
  return card
}

function escapeHtml(str) { return String(str||'').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])) }


