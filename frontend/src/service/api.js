const API_BASE_URL = 'http://127.0.0.1:8000/api'

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
    throw new Error('Sesi telah berakhir, silakan login kembali.')
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan pada server')
  }

  return data
}