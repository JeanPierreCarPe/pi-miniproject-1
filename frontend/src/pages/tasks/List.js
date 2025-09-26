import { fetchTasks } from '../../api/tasks'
import { getToken } from '../../state/authStore'
import { showToast } from '../../components/Modal'
import TaskCard from '../../components/TaskCard'
import TaskEditModal from '../../components/TaskEditModal'

export default function TasksList() {
  if (!getToken()) { window.location.hash = '#/login'; return document.createElement('div') }
  const wrap = document.createElement('div')
  wrap.className = 'container'
  wrap.innerHTML = `
    <div class="header">
      <div class="welcome-text">
        <h1>Mis Tareas</h1>
        <p>Gestiona y organiza todas tus tareas en un solo lugar</p>
      </div>
      <div class="date">
        <i class="fas fa-calendar-alt"></i>
        <span id="current-date"></span>
      </div>
    </div>
    <div id="kanban" class="content-section"></div>
  `
  const kanban = wrap.querySelector('#kanban')
  
  // Set current date
  const dateEl = wrap.querySelector('#current-date')
  dateEl.textContent = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  function renderKanban(tasks){
    kanban.innerHTML = ''
    const grid = document.createElement('div')
    grid.className = 'columns'
    const cols = ['Por hacer','Haciendo','Hecho']
    
    // Show empty state if no tasks
    if (tasks.length === 0) {
      const emptyState = document.createElement('div')
      emptyState.className = 'empty-state'
      emptyState.innerHTML = `
        <div class="empty-icon">
          <i class="fas fa-tasks"></i>
        </div>
        <h3>No tienes tareas aún</h3>
        <p>¡Crea tu primera tarea para comenzar a organizar tu trabajo!</p>
        <a href="#/tasks/new" class="btn">
          <i class="fas fa-plus"></i> Crear Primera Tarea
        </a>
      `
      kanban.appendChild(emptyState)
      return
    }
    
    cols.forEach((c)=>{
      const col = document.createElement('div')
      col.className = `column ${c==='Por hacer'?'por-hacer':c==='Haciendo'?'haciendo':'hecho'}`
      const header = document.createElement('div'); header.className = 'head'
      const icon = c==='Por hacer' ? 'fa-clock' : c==='Haciendo' ? 'fa-spinner' : 'fa-check-circle'
      header.innerHTML = `<div class="title"><i class="fas ${icon}"></i>${c}</div><span class="count" id="count">0</span>`
      const body = document.createElement('div'); body.className = 'task-list'
      const items = tasks.filter(t=>t.stageName===c)
      header.querySelector('#count').textContent = String(items.length)
      items.forEach(t=> body.appendChild(TaskCard(t)))
      col.appendChild(header); col.appendChild(body); grid.appendChild(col)
    })
    kanban.appendChild(grid)
  }
  function escapeHtml(str){return String(str||'').replace(/[&<>"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}


  /**
   * Load tasks with ≤ 500ms requirement and proper error handling
   * Token expiration → redirect to /login with message "Inicia sesión de nuevo"
   * 5xx errors → toast "No pudimos obtener tus tareas, inténtalo más tarde"
   */
  async function loadTasks() {
    const startTime = Date.now()
    
    // Show loading skeleton immediately
    showLoadingSkeleton()
    
    try { 
      const tasks = await fetchTasks()
      
      // Loading time tracking (silent)
      const loadTime = Date.now() - startTime
      
      // Use requestAnimationFrame for smooth rendering
      requestAnimationFrame(() => {
        renderKanban(tasks)
      })
      
    } catch (err) { 
      // Clear loading skeleton on error
      kanban.innerHTML = ''
      
      // Token expired → redirect to /login with message
      if(err.status === 401){ 
        // Show message "Inicia sesión de nuevo" as per HU
        sessionStorage.setItem('loginMessage', 'Inicia sesión de nuevo')
        window.location.hash = '#/login' 
      } 
      // 5xx errors → toast message as per HU
      else if (err.status >= 500) {
        showToast('No pudimos obtener tus tareas, inténtalo más tarde', 'error')
      } else {
        showToast('Error al cargar las tareas', 'error')
      }
    }
  }
  
  function showLoadingSkeleton() {
    kanban.innerHTML = `
      <div class="loading-skeleton">
        <div class="skeleton-columns">
          <div class="skeleton-column">
            <div class="skeleton-header"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
          </div>
          <div class="skeleton-column">
            <div class="skeleton-header"></div>
            <div class="skeleton-card"></div>
          </div>
          <div class="skeleton-column">
            <div class="skeleton-header"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
          </div>
        </div>
      </div>
    `
  }
  
  // Function to update specific task in DOM without reloading
  function updateTaskInDOM(updatedTask) {
    const existingCard = wrap.querySelector(`[data-task-id="${updatedTask._id}"]`)
    if (!existingCard) return
    const newCard = TaskCard(updatedTask)
    existingCard.replaceWith(newCard)
  }

  // Move card to the correct column if stage changed and update counts
  function moveTaskCard(updatedTask) {
    const card = wrap.querySelector(`[data-task-id="${updatedTask._id}"]`)
    if (!card) return
    const currentColumn = card.closest('.column')
    const targetStage = updatedTask.stageName
    const targetClass = targetStage === 'Por hacer' ? 'por-hacer' : targetStage === 'Haciendo' ? 'haciendo' : 'hecho'
    const targetColumn = wrap.querySelector(`.column.${targetClass}`)
    if (!targetColumn) return
    const targetList = targetColumn.querySelector('.task-list')
    if (!targetList) return

    // If the column changed, move the card
    if (!currentColumn?.classList.contains(targetClass)) {
      targetList.prepend(card)
      // Update counts
      const updateCount = (col) => {
        const countEl = col.querySelector('.count')
        const list = col.querySelector('.task-list')
        if (countEl && list) countEl.textContent = String(list.children.length)
      }
      if (currentColumn) updateCount(currentColumn)
      updateCount(targetColumn)
    }
  }

  // Event listener for task edit modal
  // Avoid duplicate handlers when navigating back to /tasks repeatedly
  if (window.__taskEditHandler) {
    window.removeEventListener('openTaskEditModal', window.__taskEditHandler)
  }
  window.__taskEditHandler = (e) => {
    const { task } = e.detail
    const modal = TaskEditModal(task, (updatedTask) => {
      updateTaskInDOM(updatedTask)
      moveTaskCard(updatedTask)
      showToast('Tarea actualizada', 'success')
    })
    document.body.appendChild(modal)
  }
  window.addEventListener('openTaskEditModal', window.__taskEditHandler)

  // Load tasks immediately
  loadTasks()

  return wrap
}


