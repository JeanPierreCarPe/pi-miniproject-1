import { setToken as setTokenHttp, getApiBaseUrl } from '../api/http'

export function getToken() { try { return localStorage.getItem('auth_token') || '' } catch { return '' } }
export function setToken(token) { setTokenHttp(token) }
export function getUser() { try { return JSON.parse(localStorage.getItem('auth_user')||'null') } catch { return null } }
export function setUser(user) { try { user ? localStorage.setItem('auth_user', JSON.stringify(user)) : localStorage.removeItem('auth_user') } catch {} }
export function isAuthenticated() { return !!getToken() }


