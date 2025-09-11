import { fetchTasks } from '../../api/tasks'
import { getToken } from '../../state/authStore'
import { showToast } from '../../components/Modal'
import TaskCard from '../../components/TaskCard'

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
  
  // Load tasks immediately
  loadTasks()

  return wrap
}


