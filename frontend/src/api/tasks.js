import { http } from './http'

export const fetchTasks = () => http('/tasks', { auth: true })

export const createTask = ({ Title, detail, initDate, endDate, stageName }) =>
  http('/tasks', { method: 'POST', body: { Title, detail, initDate, endDate, stageName }, auth: true })


