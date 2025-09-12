import { http } from './http'
import { setToken } from '../state/authStore'

export const signup = ({ firstname, lastname, age, email, password }) =>
  http('/auth/signup', { method: 'POST', body: { firstname, lastname, age, email, password } })

export const login = ({ email, password }) =>
  http('/auth/login', { method: 'POST', body: { email, password } })

export const logout = () => http('/auth/logout', { method: 'POST' })

export const requestPasswordReset = (email) =>
  http('/auth/password/forgot', { method: 'POST', body: { email } })

export const verifyResetToken = (token) =>
  http(`/auth/password/verify?token=${encodeURIComponent(token)}`)

export const resetPassword = ({ token, newPassword }) =>
  http('/auth/password/reset', { method: 'POST', body: { token, newPassword } })


