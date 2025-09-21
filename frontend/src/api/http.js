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
  
  // Add debugging for production (can be disabled by setting window.DEBUG_API = false)
  if (window.DEBUG_API !== false) {
    console.log(`Making ${method} request to:`, url)
    console.log('Headers:', finalHeaders)
    if (body) console.log('Body:', body)
  }
  
  try {
    const res = await fetch(url, { method, headers: finalHeaders, body: body ? JSON.stringify(body) : undefined, signal, mode: 'cors', credentials: 'omit' })
    const text = await res.text()
    let data
    try { data = text ? JSON.parse(text) : null } catch { data = text }
    
    if (window.DEBUG_API !== false) {
      console.log(`Response status: ${res.status}`)
      console.log('Response data:', data)
    }
    
    // Handle JWT expiration and unauthorized responses
    if (!res.ok) {
      // If token is expired or invalid, clear auth data and redirect to login
      if ((res.status === 401 || res.status === 403) && auth) {
        console.log('Token expired or invalid, clearing auth data')
        clearAuthData()
        // Only redirect if we're not already on an auth page
        if (!window.location.hash.includes('/login') && !window.location.hash.includes('/signup')) {
          window.location.hash = '#/login'
        }
      }
      const err = new Error((data && data.message) || `HTTP ${res.status}`)
      err.status = res.status
      err.data = data
      throw err
    }
    return data
  } catch (error) {
    console.error('HTTP request failed:', error)
    console.error('Request details:', { url, method, headers: finalHeaders, body })
    throw error
  }
}

// Helper function to clear authentication data
function clearAuthData() {
  try {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  } catch (e) {
    console.error('Error clearing auth data:', e)
  }
}


