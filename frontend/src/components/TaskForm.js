import { maxLength, isNonEmpty } from '../utils/validators'

export default function TaskForm({ onSubmit }) {
  const form = document.createElement('form')
  form.id = 'taskForm'
  form.innerHTML = `
    <style>
      @keyframes spin { 
        0% { transform: rotate(0deg); } 
        100% { transform: rotate(360deg); } 
      }
    </style>
    <div class="form-grid">
      <div class="form-group" id="group-titulo"><label for="titulo">Título (máx. 50)</label><input id="titulo" type="text" maxlength="50" /></div>
      <div class="form-group" id="group-estado"><label for="estado">Estado</label>
        <select id="estado"><option value="">Selecciona</option><option value="Por hacer">Por hacer</option><option value="Haciendo">Haciendo</option><option value="Hecho">Hecho</option></select>
      </div>
      <div class="form-group" id="group-fecha"><label for="fecha">Fecha</label><input id="fecha" type="date" /></div>
      <div class="form-group" id="group-hora"><label for="hora">Hora</label><input id="hora" type="time" /></div>
      <div class="form-group full" id="group-descripcion"><label for="descripcion">Detalle (opcional, máx. 500)</label><textarea id="descripcion" rows="5" maxlength="500"></textarea></div>
    </div>
    <div style="margin-top:12px;display:flex;gap:12px;align-items:center;">
      <button class="btn" id="saveBtn" type="submit" disabled style="display:flex;align-items:center;justify-content:center;gap:8px">
        <span id="btn-text">Guardar</span>
        <div id="spinner" style="display:none;width:16px;height:16px;border:2px solid transparent;border-top:2px solid #fff;border-radius:50%;animation:spin 1s linear infinite"></div>
      </button>
      <a href="#/tasks" style="color:#A0522D;text-decoration:none">Cancelar</a>
    </div>
  `
  const titulo = form.querySelector('#titulo')
  const detalle = form.querySelector('#descripcion')
  const fecha = form.querySelector('#fecha')
  const hora = form.querySelector('#hora')
  const estado = form.querySelector('#estado')
  const submit = form.querySelector('#saveBtn')
  const btnText = form.querySelector('#btn-text')
  const spinner = form.querySelector('#spinner')

  // Track user interaction to show errors only after interaction
  const userInteracted = { titulo: false, fecha: false, hora: false, estado: false, descripcion: false }

  const group = (id) => form.querySelector(`#group-${id}`)
  function announce(container, msg) {
    let t = container.querySelector('[data-tooltip]')
    if (!t) {
      t = document.createElement('div')
      t.dataset.tooltip = 'true'
      t.setAttribute('aria-live', 'polite')
      t.style.cssText = 'color:#B91C1C;font-size:12px;margin-top:6px;background:#FEF2F2;padding:4px 8px;border-radius:4px;border-left:3px solid #DC2626;display:none'
      container.appendChild(t)
    }
    t.textContent = msg || ''
    t.style.display = msg ? 'block' : 'none'
  }
  function setDisabled(el, d) { d ? el.setAttribute('disabled', 'true') : el.removeAttribute('disabled') }

  function validate() {
    let ok = true
    
    // Título - campo requerido según modelo Task.js
    if (!isNonEmpty(titulo.value)) { 
      if (userInteracted.titulo) {
        announce(group('titulo'), 'Completa este campo')
      }
      ok = false 
    } else if (!maxLength(titulo.value, 50)) { 
      if (userInteracted.titulo) {
        announce(group('titulo'), 'Máximo 50 caracteres')
      }
      ok = false 
    } else announce(group('titulo'), '')
    
    // Fecha - campo requerido según modelo Task.js (initDate)
    if (!fecha.value) { 
      if (userInteracted.fecha) {
        announce(group('fecha'), 'Completa este campo')
      }
      ok = false 
    } else announce(group('fecha'), '')
    
    // Hora - campo requerido
    if (!hora.value) { 
      if (userInteracted.hora) {
        announce(group('hora'), 'Completa este campo')
      }
      ok = false 
    } else announce(group('hora'), '')
    
    // Estado - campo requerido según modelo Task.js (stageName)
    if (!estado.value) { 
      if (userInteracted.estado) {
        announce(group('estado'), 'Completa este campo')
      }
      ok = false 
    } else announce(group('estado'), '')
    
    // Detalle - validación solo de longitud máxima (opcional)
    if (detalle.value && !maxLength(detalle.value, 500)) { 
      if (userInteracted.descripcion) {
        announce(group('descripcion'), 'Máximo 500 caracteres')
      }
      ok = false 
    } else announce(group('descripcion'), '')
    
    setDisabled(submit, !ok)
    return ok
  }
  // Mark user interaction and validate
  const fields = [
    { element: titulo, key: 'titulo' },
    { element: detalle, key: 'descripcion' },
    { element: fecha, key: 'fecha' },
    { element: hora, key: 'hora' },
    { element: estado, key: 'estado' }
  ]
  
  fields.forEach(({ element, key }) => {
    element.addEventListener('input', () => {
      userInteracted[key] = true
      validate()
    })
    element.addEventListener('blur', () => {
      userInteracted[key] = true
      validate()
    })
  })
  
  validate()

  form.addEventListener('submit', async (e) => { 
    e.preventDefault()
    if (!validate()) return
    
    // Show spinner and disable button
    setDisabled(submit, true)
    btnText.style.display = 'none'
    spinner.style.display = 'block'
    
    try {
      await onSubmit({ 
        titulo: titulo.value.trim(), 
        descripcion: detalle.value.trim(), 
        fecha: fecha.value, 
        hora: hora.value, 
        estado: estado.value 
      })
    } catch (err) {
      // Error handling is done in the parent component
      console.error('Task creation error:', err)
    } finally {
      // Hide spinner and enable button
      spinner.style.display = 'none'
      btnText.style.display = 'block'
      setDisabled(submit, false)
    }
  })
  return form
}


