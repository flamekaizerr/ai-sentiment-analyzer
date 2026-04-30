import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({ baseURL: API_BASE })

export const analyzeText = (text) => api.post('/analyze', { text })
export const getHistory = (limit = 50) => api.get(`/history?limit=${limit}`)
export const deleteHistoryItem = (id) => api.delete(`/history/${id}`)
export const getStats = () => api.get('/stats')
