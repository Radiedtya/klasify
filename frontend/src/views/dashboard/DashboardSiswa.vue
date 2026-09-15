<template>
  <div class="dashboard-container">
    <div v-if="isLoading" class="loading-state">
      Memeriksa hak akses...
    </div>

    <div v-else class="dashboard-content">
      <h2>Dashboard Siswa</h2>
      <p>Selamat datang, {{ userProfile?.name }}!</p>
      <button @click="handleLogout" class="btn-logout">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isLoading = ref(true)
const userProfile = ref(null)
const API_BASE_URL = 'http://localhost:8000/api'

onMounted(async () => {
  const token = localStorage.getItem('access_token')

  // 1. Cek Token
  if (!token) {
    router.push('/login')
    return
  }

  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    
    // 2. Cek Role via API /me (Paling Aman)
    const res = await axios.get(`${API_BASE_URL}/me`)
    const user = res.data.data || res.data
    userProfile.value = user

    // 3. Validasi Role
    if (user.role !== 'siswa') {
      alert('Akses ditolak! Halaman ini khusus untuk Siswa.')
      redirectByRole(user.role)
    }
  } catch (error) {
    // Token kadaluarsa / tidak valid
    localStorage.clear()
    router.push('/login')
  } finally {
    isLoading.value = false
  }
})

const redirectByRole = (role) => {
  if (role === 'bendahara') router.push('/dashboard')
  else if (role === 'guru') router.push('/dashboard-guru')
  else router.push('/login')
}

const handleLogout = async () => {
  try {
    await axios.post(`${API_BASE_URL}/logout`)
  } catch (err) {
    // Abaikan error logout backend
  } finally {
    localStorage.clear()
    delete axios.defaults.headers.common['Authorization']
    router.push('/login')
  }
}
</script>

<style scoped>
.dashboard-container { padding: 24px; }
.loading-state { text-align: center; margin-top: 50px; font-weight: 600; }
.btn-logout { background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
</style>