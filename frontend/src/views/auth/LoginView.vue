<template>
  <div class="login-container">
    <div class="login-card">
      <div class="brand">
        <div class="brand-logo">K</div>
        <h2>Klasify</h2>
      </div>
      <p class="subtitle">Masuk ke akun kamu untuk mengelola kas kelas</p>

      <!-- Alert Error -->
      <div v-if="errorMessage" class="alert-error">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>Email</label>
          <input 
            type="email" 
            v-model="form.email" 
            placeholder="nama@email.com" 
            required 
            :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input 
            type="password" 
            v-model="form.password" 
            placeholder="••••••••" 
            required 
            :disabled="isLoading"
          />
        </div>

        <button type="submit" class="btn-login" :disabled="isLoading">
          {{ isLoading ? 'Memproses...' : 'Masuk' }}
        </button>
      </form>

      <div class="footer-text">
        Belum punya akun? 
        <router-link to="/register" class="link-register">Daftar di sini</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const errorMessage = ref('')
const isLoading = ref(false)

const form = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    // Memanggil API Backend secara langsung menggunakan Native fetch
    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: form.value.email,
        password: form.value.password
      })
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      // Ambil pesan error dari backend
      throw new Error(result.message || 'Login gagal, periksa email dan password!')
    }

    // Simpan Token dan Data User ke localStorage
    localStorage.setItem('token', result.data.token)
    localStorage.setItem('role', result.data.role)
    localStorage.setItem('user', JSON.stringify(result.data.user))

    // Redirect berdasarkan role yang diterima dari AuthController.php
    const userRole = result.data.role
    if (userRole === 'guru') {
      router.push('/guru/profile')
    } else if (userRole === 'bendahara') {
      router.push('/bendahara/dashboard')
    } else {
      router.push('/siswa/dashboard')
    }

  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  background-color: var(--bg, #f8fafc);
}

.login-card {
  background: #ffffff;
  width: 100%;
  max-width: 400px;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  color: #000000;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.brand-logo {
  width: 40px;
  height: 40px;
  background: #3b82f6;
  color: #ffffff;
  font-weight: 800;
  font-size: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand h2 {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
}

.subtitle {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 24px;
}

.alert-error {
  background-color: #fef2f2;
  border: 1px solid #fca5a5;
  color: #b91c1c;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 16px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
}

.form-group input {
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  background: #ffffff;
  color: #000000;
}

.form-group input:focus {
  border-color: #3b82f6;
}

.btn-login {
  margin-top: 8px;
  background: #3b82f6;
  color: #ffffff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}

.btn-login:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.btn-login:hover:not(:disabled) {
  background: #2563eb;
}

.footer-text {
  margin-top: 20px;
  text-align: center;
  font-size: 13px;
  color: #64748b;
}

.link-register {
  color: #3b82f6;
  font-weight: 600;
  text-decoration: none;
}

.link-register:hover {
  text-decoration: underline;
}
</style>