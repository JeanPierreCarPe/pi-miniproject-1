/**
 * HTTP client for making API requests with authentication
 * Handles token injection, CORS, and error responses
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '/api'

/**
 * Gets the configured API base URL
 * @returns {string} The API base URL
 */
export function getApiBaseUrl() { return API_BASE_URL }

export function getToken() {
  try { return localStorage.getItem('auth_token') || '' } catch { return '' }
}
export function setToken(token) {
  try { token ? localStorage.setItem('auth_token', token) : localStorage.removeItem('auth_token') } catch {}
}

export async function http(path, { method = 'GET', body, headers = {}, auth = false, signal } = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`
  const finalHeaders = { 'Accept': 'application/json', 'Content-Type': 'application/json', ...headers }
  if (auth) {
    const token = getToken()
    if (token) finalHeaders['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(url, { method, headers: finalHeaders, body: body ? JSON.stringify(body) : undefined, signal, mode: 'cors', credentials: 'omit' })
  const text = await res.text()
  let data
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  if (!res.ok) { const err = new Error((data && data.message) || `HTTP ${res.status}`); err.status = res.status; err.data = data; throw err }
  return data
}


