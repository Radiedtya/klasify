<template>
  <div class="register-container">
    <div class="register-card">
      <div class="brand">
        <div class="brand-logo">K</div>
        <h2>Klasify</h2>
      </div>
      <p class="subtitle">Buat akun baru untuk mulai mengelola kas kelas</p>

      <div v-if="errorMessage" class="alert-error">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="alert-success">
        {{ successMessage }}
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label>Nama Lengkap</label>
          <input 
            type="text" 
            v-model="form.name" 
            placeholder="Masukkan nama lengkap" 
            required 
            :disabled="isLoading"
          />
        </div>

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
          <label>Role / Peran</label>
          <select v-model="form.role" required :disabled="isLoading">
            <option value="siswa">Siswa</option>
            <option value="bendahara">Bendahara</option>
            <option value="guru">Guru Wali Kelas</option>
          </select>
        </div>

        <!-- FIELD KELAS ID DISINI -->
        <div class="form-group">
          <label>Pilih Kelas</label>
          <select v-model="form.kelas_id" required :disabled="isLoading">
            <option value="" disabled>-- Pilih Kelas --</option>
            <option v-for="kelas in kelases" :key="kelas.id" :value="kelas.id">
              {{ kelas.nama_kelas || kelas.nama }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Password</label>
          <input 
            type="password" 
            v-model="form.password" 
            placeholder="Minimal 8 karakter" 
            required 
            :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label>Konfirmasi Password</label>
          <input 
            type="password" 
            v-model="form.password_confirmation" 
            placeholder="Ulangi password" 
            required 
            :disabled="isLoading"
          />
        </div>

        <button type="submit" class="btn-register" :disabled="isLoading">
          {{ isLoading ? 'Mendaftarkan...' : 'Daftar Akun' }}
        </button>
      </form>

      <div class="footer-text">
        Sudah punya akun? 
        <router-link to="/login" class="link-login">Masuk di sini</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  role: 'siswa',
  kelas_id: '', // Added kelas_id
  password: '',
  password_confirmation: ''
})

const kelases = ref([
  // Dummy fallback jika endpoint GET /api/kelas butuh login
  { id: 1, nama_kelas: 'XII RPL 1' },
  { id: 2, nama_kelas: 'XII RPL 2' }
])

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const API_BASE_URL = 'http://localhost:8000/api'

// Opsional: Coba ambil list kelas publik jika backend mengizinkan
onMounted(async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/kelas`)
    if (res.data && res.data.data) {
      kelases.value = res.data.data
    } else if (Array.isArray(res.data)) {
      kelases.value = res.data
    }
  } catch (err) {
    // Jika endpoint /kelas butuh auth, pakai dummy/fallback pilihan di atas
  }
})

const handleRegister = async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  if (form.password !== form.password_confirmation) {
    errorMessage.value = 'Konfirmasi password tidak cocok.'
    isLoading.value = false
    return
  }

  try {
    await axios.post(`${API_BASE_URL}/register`, {
      name: form.name,
      email: form.email,
      role: form.role,
      kelas_id: form.kelas_id, // Terkirim ke Laravel
      password: form.password,
      password_confirmation: form.password_confirmation
    })

    successMessage.value = 'Registrasi berhasil! Mengalihkan ke halaman login...'
    
    setTimeout(() => {
      router.push('/login')
    }, 1500)

  } catch (error) {
    if (error.response && error.response.data) {
      const resData = error.response.data
      if (resData.errors) {
        const firstErrorKey = Object.keys(resData.errors)[0]
        errorMessage.value = resData.errors[firstErrorKey][0]
      } else {
        errorMessage.value = resData.message || 'Gagal melakukan registrasi.'
      }
    } else {
      errorMessage.value = 'Gagal terhubung ke server Backend.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  background-color: var(--bg, #f8fafc);
  padding: 20px 0;
}

.register-card {
  background: #ffffff;
  width: 100%;
  max-width: 420px;
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
  margin-bottom: 20px;
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

.alert-success {
  background-color: #f0fdf4;
  border: 1px solid #86efac;
  color: #15803d;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 16px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
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

.form-group input, .form-group select {
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  background: #ffffff;
  color: #000000;
}

.form-group input:focus, .form-group select:focus {
  border-color: #3b82f6;
}

.btn-register {
  margin-top: 10px;
  background: #3b82f6;
  color: #ffffff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}

.btn-register:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.btn-register:hover:not(:disabled) {
  background: #2563eb;
}

.footer-text {
  margin-top: 20px;
  text-align: center;
  font-size: 13px;
  color: #64748b;
}

.link-login {
  color: #3b82f6;
  font-weight: 600;
  text-decoration: none;
}

.link-login:hover {
  text-decoration: underline;
}
</style>