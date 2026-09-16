import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user_data') || 'null'))
  const token = ref(localStorage.getItem('token') || null)

  const login = async (credentials) => {
    const response = await axios.post('http://localhost:8000/api/login', credentials)
    
    token.value = response.data.token || response.data.access_token
    user.value = response.data.user || response.data.data

    localStorage.setItem('token', token.value)
    localStorage.setItem('user_data', JSON.stringify(user.value))

    return response
  }

  // ⚠️ WAJIB RETURN SEMUA VARIABEL & FUNGSI DI SINI!
  // Kalau 'login' tidak di-return di bawah ini, jadinya error "not a function"
  return {
    user,
    token,
    login
  }
})