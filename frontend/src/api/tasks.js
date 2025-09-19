import { http } from './http'

export const fetchTasks = () => http('/tasks', { auth: true })

export const createTask = ({ Title, detail, initDate, endDate, stageName }) =>
  http('/tasks', { method: 'POST', body: { Title, detail, initDate, endDate, stageName }, auth: true })

// Update an existing task by id
export const updateTask = (id, { Title, detail, initDate, endDate, stageName }) =>
  http(`/tasks/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: { Title, detail, initDate, endDate, stageName },
    auth: true,
  })


