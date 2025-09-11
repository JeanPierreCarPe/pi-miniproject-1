import TaskForm from '../../components/TaskForm'
import { createTask } from '../../api/tasks'
import { getToken } from '../../state/authStore'
import { showToast } from '../../components/Modal'

/**
 * Create/Edit task page component with full validation according to HU requirements
 * Fields: Título (required, max 50), Detalle (optional, max 500), Fecha, Hora, Estado
 * Button disabled until Título, Fecha, Hora, Estado are valid
 * @returns {HTMLElement} The create task page element
 */
export default function CreateEdit() {
  if (!getToken()) { 
    window.location.hash = '#/login'
    return document.createElement('div') 
  }
  
  const wrap = document.createElement('div')
  wrap.className = 'container'
  wrap.innerHTML = `
    <div class="header">
      <div class="welcome-text">
        <h1>Nueva Tarea</h1>
        <p>Crea una nueva tarea para organizar tu trabajo</p>
      </div>
    </div>
    <div class="form-container">
      <div id="task-form-wrapper"></div>
    </div>
  `
  
  const formWrapper = wrap.querySelector('#task-form-wrapper')
  const form = TaskForm({ 
    onSubmit: async ({ titulo, descripcion, fecha, hora, estado }) => {
      const initDate = new Date(`${fecha}T${hora}`)
      try { 
        await createTask({ 
          Title: titulo, 
          detail: descripcion || undefined, 
          initDate, 
          endDate: null, 
          stageName: estado 
        })
        // Show success message and redirect immediately
        showToast('Tarea creada exitosamente', 'success')
        // Redirect immediately to see updated task list
        window.location.hash = '#/tasks'
      } catch (err) { 
        // Show error message without page reload
        showToast(err.message || 'No se pudo crear la tarea', 'error')
      }
    }
  })
  
  formWrapper.appendChild(form)
  return wrap
}


