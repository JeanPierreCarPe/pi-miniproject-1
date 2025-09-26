export default function NotFound() {
  const div = document.createElement('div')
  div.style.padding = '40px'
  div.innerHTML = `<h2 style="color:#A0522D">Página no encontrada</h2><p><a href="#/">Ir al inicio</a></p>`
  return div
}


