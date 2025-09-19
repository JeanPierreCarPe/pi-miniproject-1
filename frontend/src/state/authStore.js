import { setToken as setTokenHttp, getApiBaseUrl } from '../api/http'

export function getToken() { try { return localStorage.getItem('auth_token') || '' } catch { return '' } }
export function setToken(token) { setTokenHttp(token) }
export function getUser() { try { return JSON.parse(localStorage.getItem('auth_user')||'null') } catch { return null } }
export function setUser(user) { try { user ? localStorage.setItem('auth_user', JSON.stringify(user)) : localStorage.removeItem('auth_user') } catch {} }

export function isAuthenticated() { 
  const token = getToken()
  if (!token) return false
  
  // Basic token validation - check if it's expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    
    // If token is expired, clear auth data
    if (payload.exp && payload.exp < currentTime) {
      console.log('Token expired, clearing auth data')
      clearAuth()
      return false
    }
    
    return true
  } catch (e) {
    // If token is malformed, clear auth data
    console.log('Invalid token format, clearing auth data')
    clearAuth()
    return false
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setTokenHttp(null)
  } catch (e) {
    console.error('Error clearing auth data:', e)
  }
}

export function logout() {
  clearAuth()
  // Redirect to login if not already there
  if (!window.location.hash.includes('/login')) {
    window.location.hash = '#/login'
  }
}


