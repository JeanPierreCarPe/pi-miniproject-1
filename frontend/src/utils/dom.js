export function qs(sel, root = document) { return root.querySelector(sel) }
export function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)) }
export function mount(root, node) {
  root.innerHTML = ''
  if (typeof node === 'string') {
    root.innerHTML = node
  } else if (node instanceof Node) {
    root.appendChild(node)
  } else if (node && typeof node.render === 'function') {
    root.appendChild(node.render())
  } else {
    root.textContent = ''
  }
}


